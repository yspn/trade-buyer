<template>
  <div class="buyer-report">
    <div class="box-tools pull-left">
      <RadioGroup v-model="timespan" type="button">
        <Radio label="today">今日</Radio>
        <Radio label="monthly">本月</Radio>
        <!-- <Radio label="yearly">年度</Radio> -->
        <Radio label="daterange">指定日期</Radio>
      </RadioGroup>
      <DatePicker v-if="timespan==='daterange'" v-model="daterange" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期区间" style="width: 200px;" confirm clearable @on-ok="refreshList"></DatePicker>
    </div>
    <div class="box-tools pull-right">
      <Button-group>
        <Button type="ghost" icon="ios-refresh-empty" @click="refreshList">刷新</Button>
        <Button type="ghost" @click="exportData" icon="ios-cloud-download-outline">导出</Button>
        <!-- <Button type="ghost" @click="sendSocketMsg">test</Button> -->
      </Button-group>
    </div>
    <Table stripe :loading="loading" :height="tableHeight" :columns="columns" :data="dataViewPage" ref="table" @on-sort-change="sortTable"></Table>
    <div style="margin: 10px;overflow: hidden">
      <!-- <Button type="primary" size="large" @click="exportData" :disabled="!rowSelected"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button> -->
      <div style="float: right;">
        <Page :total="totalCount" :page-size-opts="[10,20,50,100]" @on-change="changePage" @on-page-size-change="changePageSize" :current="pageCurrent" show-sizer show-total show-elevator></Page>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sleepES6
} from '../../../static/common'
export default {
  name: 'buyer-report',
  props: ['shopList'],
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'list',
        apiQuery: {}
      },
      apiData: {},
      columns: [
        // { type: 'selection', width: 70, align: 'center' },
        {
          title: '订单编号',
          key: 'tid_str',
          width: 180,
          ellipsis: true,
          sortable: true,
          searchable: true,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.$emit('on-searchbytid', params.row.tid_str)
                  this.$router.push({path: '/trades'})
                }
              }
            }, params.row.tid_str)
          }
        },
        {
          title: '店铺',
          key: 'shop',
          width: 160,
          subKey: 'name',
          ellipsis: true,
          filters: this.shopList.map((item) => {
            return {
              label: item.name,
              value: item.id
            }
          }),
          filterMultiple: true,
          // filterMethod (value, row) {
          //   return value.indexOf(row.shopid) > -1
          // },
          filterRemote: (value, row) => {
            this.filterShop = value
          },
          render: (h, params) => {
            return h('span', {}, params.row.shop.name)
          }
        },
        { title: '下单单号',
          key: 'ordered_order_number',
          ellipsis: false,
          render: (h, params) => {
            return h('span', {}, this.getOrderNumbers(params.row.ordered_temp))
          }
        },
        { title: '买手',
          key: 'ordered_name',
          ellipsis: false,
          render: (h, params) => {
            return h('span', {}, this.getOrderBuyers(params.row.ordered_temp))
          }
        },
        { title: '买家号',
          key: 'ordered_buyer_nick',
          ellipsis: false,
          render: (h, params) => {
            return h('span', {}, this.getOrderBuyerNicks(params.row.ordered_temp))
          }
        },
        { title: '收入',
          width: 120,
          key: 'payment',
          ellipsis: true,
          render: (h, params) => {
            return h('span', {}, params.row.payment.toLocaleString())
          }
        },
        { title: '支出',
          key: 'ordered_sum',
          width: 120,
          ellipsis: true,
          render: (h, params) => {
            return h('span', {}, (params.row.ordered_sum / 100).toLocaleString())
          }
        },
        { title: '利润',
          key: 'profit',
          width: 120,
          ellipsis: true,
          sortable: 'custom',
          render: (h, params) => {
            return h('span', {style: {color: params.row.profit > 0 ? 'forestgreen' : 'red'}}, (Math.round(params.row.profit) / 100).toLocaleString())
          }
        },
        { title: '利润率',
          key: 'profit_ratio',
          width: 120,
          ellipsis: true,
          sortable: 'custom',
          render: (h, params) => {
            return h('span', {style: {color: params.row.profit > 0 ? 'forestgreen' : 'red'}}, Math.round(params.row.profit_ratio * 10000) / 100 + '%')
          }
        },
        { title: '下单时间',
          key: 'lastorder_time',
          width: 180,
          ellipsis: true,
          sortable: 'custom',
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, new Date(params.row.lastorder_time).Format('yyyy-MM-dd hh:mm:ss'))
          }
        }
      ],
      loading: false,
      dataRaw: [],
      data: [],
      dataViewPage: [],
      pageCurrent: 1,
      pageSize: 10,
      totalCount: 0,
      keyword: '',
      searchBy: '',
      searchMode: false,
      tableSearchOn: false,
      sort: null,
      searchModel: null,
      filterShop: null,
      tableHeight: 500,
      detailed: false,
      detailedItem: {},
      timespan: 'today',
      daterange: null,
      profitStart: null,
      profitEnd: null,
      webSocket: null,
      taskTraceId: null, // 异步任务追踪ID
      tracing: false, // 是否是追踪状态
      taskTraceTask: null // 追踪Interval id
    }
  },
  created () {
    // 如果页面刷新，则emit到Layout组件获取最新session
    if (!this.$store.getters.session) {
      this.$emit('on-checkauth', this.$route.path)
    }
  },
  mounted () {
    this.initDataTable().then(async (result) => {
      this.dataRaw = result
      this.data = result
      // this.pageSize = 10
      this.pageCurrent = 1
      this.loading = false
      this.calcTableHeight()
    })
    // 监听window.resize事件
    const that = this
    window.onresize = () => {
      return (() => {
        that.calcTableHeight()
      })()
    }
    // 很重要 必须写，判断浏览器是否支持websocket
    let CreateWebSocket = (function () {
      return function (urlValue) {
        if (window.WebSocket) { return new WebSocket(urlValue) }
        if (window.MozWebSocket) { return new window.MozWebSocket(urlValue) }
        return false
      }
    })()
    // 实例化websoscket websocket有两种协议ws(不加密)和wss(加密)
    this.webSocket = CreateWebSocket('ws://127.0.0.1:3050/buyerreport')
    this.webSocket.onopen = function (evt) {
      // 连接成功
      console.log('Connection opened.')
    }
    this.webSocket.onmessage = function (evt) {
      // 这是服务端返回的数据
      console.log('服务端说' + evt.data)
    }
    // 关闭连接
    this.webSocket.onclose = function (evt) {
      console.log('Connection closed.')
    }
  },
  watch: {
    'data': async function (newVal) {
      // let vmInstance = this
      // this.dataViewPage = this.data.filter(function (item, index, source) {
      //   return index < vmInstance.pageSize * vmInstance.pageCurrent && index >= vmInstance.pageSize * (vmInstance.pageCurrent - 1)
      // })
      this.dataViewPage = newVal
    },
    'pageCurrent': async function (newVal) {
      // let vmInstance = this
      // this.dataViewPage = this.data.filter(function (item, index, source) {
      //   return index < vmInstance.pageSize * vmInstance.pageCurrent && index >= vmInstance.pageSize * (vmInstance.pageCurrent - 1)
      // })
      this.refreshList()
    },
    'pageSize': async function (newVal) {
      // let vmInstance = this
      // this.dataViewPage = this.data.filter(function (item, index, source) {
      //   return index < vmInstance.pageSize
      // })
      this.refreshList()
    },
    'sort': function (newVal) {
      this.refreshList()
    },
    'filterShop': async function (newVal) {
      if (newVal) {
        // this.refreshList()
        // let templist = this.data.slice(0)
        // this.data = templist.filter((item) => {
        //   return newVal.indexOf(item.shopid) > -1
        // })
        if (this.timespan !== 'daterange') {
          this.refreshList()
        } else if (this.timespan === 'daterange' && this.daterange) {
          this.refreshList()
        }
      }
    },
    timespan: function (newVal) {
      if (newVal !== 'daterange') {
        this.refreshList()
      } else if (newVal === 'daterange' && this.daterange) {
        this.refreshList()
      }
    },
    profitStart: function (newVal) {
      if (this.timespan !== 'daterange') {
        this.refreshList()
      } else if (this.timespan === 'daterange' && this.daterange) {
        this.refreshList()
      }
    },
    profitEnd: function (newVal) {
      if (this.timespan !== 'daterange') {
        this.refreshList()
      } else if (this.timespan === 'daterange' && this.daterange) {
        this.refreshList()
      }
    }
  },
  methods: {
    refreshList () {
      // refreshList()
      if (this.timespan !== 'today') {
        this.getReportAsync().then(async (taskid) => {
          await this.traceTask()
        }).catch(err => {
          this.$Message.error(err.message)
        })
      } else {
        this.initDataTable().then(async (result) => {
          this.loading = false
          // this.searchBy = ''
          // this.keyword = ''
          // this.searchMode = false
          this.tableSearchOn = false
        })
      }
    },
    async initDataTable () {
      this.loading = true
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'buyerreport',
        apiQuery: {}
      }
      this.apiData = {
        timespan: this.timespan
      }
      if (this.timespan === 'daterange') {
        let dateStart = this.daterange[0]
        let dateEnd = this.daterange[1]
        let startdate = new Date(dateStart).toISOString()
        let enddate = new Date(dateEnd).toISOString()
        this.apiData = {
          timespan: 'daterange',
          startdate: startdate,
          enddate: enddate
        }
      }
      if (this.profitStart !== null) {
        this.apiData.profitstart = this.profitStart
      }
      if (this.profitEnd !== null) {
        this.apiData.profitend = this.profitEnd
      }
      if (this.sort) {
        this.apiData.sort = this.sort
      }
      if (this.searchModel) {
        this.apiData.search = this.searchModel
      }
      if (this.filterShop && this.filterShop.length) {
        this.apiData.shops = {
          $in: this.filterShop
        }
      }
      this.apiData.limit$ = this.pageSize
      this.apiData.skip$ = this.pageSize * (this.pageCurrent - 1)
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('列表获取失败！(' + respBody.message + ')')
            reject(new Error('列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.dataRaw = respBody.data.datalist
            this.data = respBody.data.datalist
            // this.pageSize = 10
            // this.pageCurrent = 1
            this.totalCount = respBody.data.total_count
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async getReportAsync () {
      return new Promise(async (resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'buyerreportnew',
          apiQuery: {}
        }
        this.apiData = {
          timespan: this.timespan
        }
        if (this.timespan === 'daterange') {
          let dateStart = this.daterange[0]
          let dateEnd = this.daterange[1]
          if (dateEnd.getTime() - dateStart.getTime() > 1000 * 60 * 60 * 24 * 30) {
            reject(new Error('报表请求失败！(最大查询窗口不能大于30天)'))
            return
          } else {
            let startdate = new Date(dateStart).toISOString()
            let enddate = new Date(dateEnd).toISOString()
            this.apiData = {
              timespan: 'daterange',
              startdate: startdate,
              enddate: enddate
            }
          }
        }
        if (this.profitStart !== null) {
          this.apiData.profitstart = this.profitStart
        }
        if (this.profitEnd !== null) {
          this.apiData.profitend = this.profitEnd
        }
        if (this.sort) {
          this.apiData.sort = this.sort
        }
        if (this.searchModel) {
          this.apiData.search = this.searchModel
        }
        if (this.filterShop && this.filterShop.length) {
          this.apiData.shops = {
            $in: this.filterShop
          }
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('报表请求失败！(' + respBody.message + ')')
            reject(new Error('报表请求失败！(' + respBody.message + ')'))
          } else {
            this.$Message.success('报表请求成功，请等待!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.taskTraceId = respBody.data.taskTraceId
            this.tracing = true
            resolve(respBody.data.taskTraceId)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async traceTask () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'buyerreporttaskcheck',
        apiQuery: {}
      }
      this.apiData = {
        taskid: this.taskTraceId
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            await sleepES6(3000)
            return this.traceTask()
            // reject(new Error('追踪请求失败！(' + respBody.message + ')'))
          } else {
            if (respBody.data.suc) {
              this.$Message.success('报表生成成功，即将下载...')
              this.$store.dispatch('setAPILastResponse', respBody)
              this.taskTraceId = null
              this.tracing = false
              window.open(respBody.data.url)
              resolve(respBody.data.url)
            } else {
              await sleepES6(3000)
              return this.traceTask()
            }
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    calcTableHeight () {
      let eleMain = document.querySelector('#main')
      let eleMainPaddingTop = window.getComputedStyle(eleMain, null).paddingTop
      let eleMainPaddingBottom = window.getComputedStyle(eleMain, null).paddingBottom
      this.tableHeight = eleMain.clientHeight - parseFloat(eleMainPaddingTop) - parseFloat(eleMainPaddingBottom) - 80
    },
    changePage (page) {
      this.pageCurrent = page
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    toggleSearchMode () {
      this.searchMode = !this.searchMode
    },
    toggleSearch (val) {
      this.tableSearchOn = val
    },
    sortTable (params) {
      let key = params.key
      let order = params.order
      let templist = this.dataRaw.slice(0)
      if (order === 'asc') {
        templist.sort((a, b) => {
          return a[key] - b[key]
        })
      } else {
        templist.sort((a, b) => {
          return b[key] - a[key]
        })
      }
      this.data = templist
    },
    getOrdersNumiid (orders) {
      let arr = []
      let list = orders.order
      list.forEach((item) => {
        arr.push(item.num_iid)
      })
      return arr
    },
    getOrdersNumiidLink (renderer, orders) {
      let arr = []
      let list = this.getOrdersNumiid(orders)
      list.forEach((item) => {
        let link = 'https://item.taobao.com/item.htm?id=' + item
        arr.push(renderer('a', {
          attrs: {
            href: link,
            target: '_blank'
          }
        }, item))
      })
      return arr
    },
    getOrderNumbers (ordered) {
      let arr = []
      let list = ordered
      list.forEach((item) => {
        arr.push(item.order_number)
      })
      return Array.from(new Set(arr)).join('|')
    },
    getOrderBuyers (ordered) {
      let arr = []
      let list = ordered
      list.forEach((item) => {
        arr.push(item.name)
      })
      return Array.from(new Set(arr)).join('|')
    },
    getOrderBuyerNicks (ordered) {
      let arr = []
      let list = ordered
      list.forEach((item) => {
        arr.push(item.buyer_nick)
      })
      return Array.from(new Set(arr)).join('|')
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: 'buyerreport',
        columns: this.columns,
        data: this.data.map((item, index, ori) => {
          return {
            tid_str: '\t' + item.tid_str + '\t',
            shop: item.shop.name,
            ordered_order_number: '\t' + this.getOrderNumbers(item.ordered_temp) + '\t',
            ordered_name: this.getOrderBuyers(item.ordered_temp),
            ordered_buyer_nick: this.getOrderBuyerNicks(item.ordered_temp),
            payment: item.payment,
            ordered_sum: item.ordered_sum / 100,
            profit: item.profit / 100,
            profit_ratio: item.profit_ratio,
            lastorder_time: new Date(item.lastorder_time).Format('yyyy-MM-dd hh:mm:ss')
          }
        })
      })
    },
    search () {
      let cols = this.columns.filter((col, idx, ss) => {
        return col.searchable
      })
      this.data = this.dataRaw.filter((item, index, source) => {
        if (this.searchBy) {
          if (this.searchBy.indexOf('.')) {
            let thing = eval('item.' + this.searchBy)
            return thing.indexOf(this.keyword) >= 0
          } else {
            return item[this.searchBy].indexOf(this.keyword) >= 0
          }
        } else {
          let found = false
          for (let i = 0; i < cols.length; i++) {
            let col = cols[i]
            if (col.subKey) {
              let thing = eval('item.' + col.key + '.' + col.subKey)
              if (thing.indexOf(this.keyword) >= 0) {
                found = true
              }
            } else if (col.key && item[col.key] && (item[col.key].indexOf(this.keyword) >= 0)) {
              found = true
            }
          }
          return found
        }
      })
      this.pageCurrent = 0
      this.pageCurrent = 1
    },
    searchRemote () {
      let cols = this.columns.filter((col, idx, ss) => {
        return col.searchable
      })
      if (this.searchBy) {
        if (this.searchBy.indexOf('.') > -1) {
          cols = cols.filter((item) => {
            return item.key === this.searchBy.split('.')[0] && item.subKey === this.searchBy.substr(this.searchBy.indexOf('.') + 1)
          })
        } else {
          cols = cols.filter((item) => {
            return item.key === this.searchBy
          })
        }
      }
      this.searchModel = []
      cols.forEach((item) => {
        let by = {}
        let key = item.subKey ? item.key + '.' + item.subKey : item.key
        by[key] = this.keyword
        this.searchModel.push(by)
      })
      this.pageCurrent = 0
      this.pageCurrent = 1
      this.refreshList()
    },
    sendSocketMsg () {
      this.webSocket.send('{"timespan":"yearly", "token": "' + this.$store.getters.user.token + '"}')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
