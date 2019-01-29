<template>
  <div class="report-profit">
    <Spin size="large" fix v-if="loading"></Spin>
    <RadioGroup v-model="timespan" type="button" size="large">
      <Radio label="today">今日</Radio>
      <Radio label="monthly">本月</Radio>
      <!-- <Radio label="yearly">年度</Radio> -->
      <Radio label="daterange">指定日期</Radio>
    </RadioGroup>
    <DatePicker v-if="timespan==='daterange'" v-model="daterange" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期区间" style="width: 200px;" confirm clearable @on-ok="getFinishedTradesByDateRange"></DatePicker>
    <RadioGroup v-model="status" type="button" size="large">
      <Radio label="received">已完成（到账利润）</Radio>
      <Radio label="shipped">已发货（入账利润）</Radio>
      <Radio label="ordered">已下单（实时利润）</Radio>
    </RadioGroup>
    <ul class="metro-ul">
      <li :style="{background: colorSelections[1]}" class="quarter">
        <span class="title">订单数：</span>
        <span class="num">{{finishedTrades.tradeCount ? finishedTrades.tradeCount.toLocaleString() : 0}}</span>
      </li>
      <li :style="{background: colorSelections[2]}" class="quarter">
        <span class="title">下单数：</span>
        <span class="num">{{finishedTrades.orderCount ? finishedTrades.orderCount.toLocaleString() : 0}}</span>
      </li>
      <li :style="{background: colorSelections[3]}" class="quarter">
        <span class="title">代销订单数：</span>
        <span class="num">{{finishedTrades.daixiaoTradeCount ? finishedTrades.daixiaoTradeCount.toLocaleString() : 0}}</span>
      </li>
      <li :style="{background: colorSelections[4]}" class="quarter">
        <span class="title">代销金额：</span>
        <span class="num">¥{{finishedTrades.daixiaoPaymentTotal ? finishedTrades.daixiaoPaymentTotal.toLocaleString() : 0}}</span>
      </li>
    </ul>
    <ul class="metro-ul">
      <li :style="{background: colorSelections[0]}" class="quarter">
        <span class="title">收入：</span>
        <span class="num">¥{{finishedTrades.tradePaymentTotal ? (finishedTrades.tradePaymentTotal-finishedTrades.daixiaoPaymentTotal).toLocaleString() : 0}}</span>
      </li>
      <li :style="{background: colorSelections[6]}" class="quarter">
        <span class="title">支出：</span>
        <span class="num">¥{{finishedTrades.orderPaymentTotal ? finishedTrades.orderPaymentTotal.toLocaleString() : 0}}</span>
      </li>
      <li :style="{background: colorSelections[5]}" class="half">
        <span class="title">利润总额：</span>
        <span class="num">¥{{finishedTrades.orderPaymentTotal ? (finishedTrades.tradePaymentTotal - finishedTrades.orderPaymentTotal - finishedTrades.daixiaoPaymentTotal).toLocaleString() : 0}}</span>
      </li>
    </ul>
    <Collapse v-model="showPanel">
      <Panel name="1">
        店铺列表({{finishedTrades.shops.length}})
        <div slot="content" class="byshop">
          <Card v-for="(shop, index) in finishedTrades.shops" :key="index" class="byshop-card" :class="{'loss':(shop.tradeAmount - shop.orderAmount)<=0}">
            <p slot="title">
              <Icon type="ios-home"></Icon>
              {{shop.name}}
            </p>
            <div class="card-content twin-cols">
              <ul>
                <li>
                  订单：
                  <span>
                    {{ shop.tradeCount ? shop.tradeCount.toLocaleString() : 0 }}
                  </span>
                </li>
                <li>
                  下单：
                  <span>
                    {{ shop.orderCount ? shop.orderCount.toLocaleString() : 0 }}
                  </span>
                </li>
                <li>
                  代销：
                  <span>
                    {{ shop.daixiaoCount ? shop.daixiaoCount.toLocaleString() : 0 }}
                  </span>
                </li>
                <li>
                  代销额：
                  <span>
                    {{ shop.daixiaoAmount ? shop.daixiaoAmount.toLocaleString() : 0 }}元
                  </span>
                </li>
              </ul>
              <ul>
                <li>
                  收入：
                  <span>
                    {{ shop.tradeAmount ? (shop.tradeAmount-shop.daixiaoAmount).toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  支出：
                  <span>
                    {{ shop.orderAmount ? shop.orderAmount.toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  利润：
                  <span :style="{color:(shop.tradeAmount - shop.orderAmount - shop.daixiaoAmount)>0?'#19be6b':'#ff4f4f'}">
                    {{ shop.tradeAmount ? (shop.tradeAmount - shop.orderAmount - shop.daixiaoAmount).toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  单均损益：
                  <span :style="{color:(shop.tradeAmount - shop.orderAmount - shop.daixiaoAmount)>0?'#19be6b':'#ff4f4f'}">
                    {{ shop.tradeAmount ? ((shop.tradeAmount - shop.orderAmount - shop.daixiaoAmount) / shop.tradeCount).toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  利润率：
                  <span :style="{color:(shop.tradeAmount - shop.orderAmount - shop.daixiaoAmount)>0?'#19be6b':'#ff4f4f'}">
                    {{ shop.tradeAmount ? ((shop.tradeAmount - shop.orderAmount - shop.daixiaoAmount) / shop.tradeAmount * 100).toFixed(1) : 0 }}%
                  </span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </Panel>
      <Panel name="2">
        买手列表({{finishedTrades.buyers.length}})
        <div slot="content" class="bybuyer">
          <Card v-for="(buyer, index) in finishedTrades.buyers" :key="index" class="bybuyer-card">
            <p slot="title">
              <Icon type="ios-person"></Icon>
              {{buyer.name}}
              <!-- <a @click="buyerDetail=buyer.shops;buyerDetailModal=true">{{buyer.name}}</a> -->
            </p>
            <div class="card-content twin-cols">
              <ul>
                <li>
                  订单：
                  <span>
                    {{ buyer.tradeCount ? buyer.tradeCount.toLocaleString() : 0 }}
                  </span>
                </li>
                <li>
                  下单：
                  <span>
                    {{ buyer.orderCount ? buyer.orderCount.toLocaleString() : 0 }}
                  </span>
                </li>
              </ul>
              <ul>
                <li>
                  收入：
                  <span>
                    {{ buyer.tradeAmount ? buyer.tradeAmount.toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  支出：
                  <span>
                    {{ buyer.orderAmount ? buyer.orderAmount.toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  利润：
                  <span :style="{color:(buyer.tradeAmount - buyer.orderAmount)>0?'#19be6b':'#ff4f4f'}">
                    {{ buyer.tradeAmount ? (buyer.tradeAmount - buyer.orderAmount).toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  单均损益：
                  <span :style="{color:(buyer.tradeAmount - buyer.orderAmount)>0?'#19be6b':'#ff4f4f'}">
                    {{ buyer.tradeAmount ? ((buyer.tradeAmount - buyer.orderAmount) / buyer.tradeCount).toLocaleString() : 0 }}元
                  </span>
                </li>
                <li>
                  利润率：
                  <span :style="{color:(buyer.tradeAmount - buyer.orderAmount)>0?'#19be6b':'#ff4f4f'}">
                    {{ buyer.tradeAmount ? ((buyer.tradeAmount - buyer.orderAmount) / buyer.tradeAmount * 100).toFixed(1) : 0 }}%
                  </span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </Panel>
    </Collapse>
    <Modal
      v-model="buyerDetailModal"
      title="买手详情"
      width="80%"
      @on-ok="buyerDetailModal=false;buyerDetail=null">
      <Table stripe :columns="buyerDetailColumns" :data="buyerDetail" v-if="buyerDetail"></Table>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'report-profit',
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'zztAuth',
        apiAction: 'Login',
        apiQuery: {}
      },
      apiData: null,
      colorSelections: ['#f2b98e', '#56bced', '#f4afcb', '#5fb985', '#e27719', '#0193de', '#dd1e6c', '#2ac56a'],
      timespan: 'monthly',
      daterange: null,
      finishedTrades: {
        tradeCount: 0,
        orderCount: 0,
        daixiaoTradeCount: 0,
        tradePaymentTotal: 0,
        orderPaymentTotal: 0,
        daixiaoPaymentTotal: 0,
        shops: [],
        buyers: []
      },
      status: 'received',
      showPanel: ['1', '2'],
      loading: false,
      buyerDetailModal: false,
      buyerDetail: null,
      buyerDetailColumns: [
        { title: '店铺名称',
          key: 'name',
          ellipsis: true,
          sortable: true,
          searchable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, params.row.name)
          }
        },
        { title: '利润',
          key: 'profit',
          ellipsis: true,
          // sortable: 'custom',
          render: (h, params) => {
            return h('span', {
              style: {
                fontWeight: '800',
                color: (params.row.tradeAmount - params.row.orderAmount) > 0 ? '#19be6b' : '#ff4f4f'
              }
            }, params.row.tradeAmount ? (params.row.tradeAmount - params.row.orderAmount).toLocaleString() + '元' : 0 + '元')
          }
        },
        { title: '单均损益',
          key: 'profitAverage',
          ellipsis: true,
          // sortable: true,
          render: (h, params) => {
            return h('span', {
              style: {
                fontWeight: '800',
                color: (params.row.tradeAmount - params.row.orderAmount) > 0 ? '#19be6b' : '#ff4f4f'
              }
            }, params.row.tradeAmount ? ((params.row.tradeAmount - params.row.orderAmount) / params.row.tradeCount).toLocaleString() + '元' : 0 + '元')
          }
        },
        { title: '利润率',
          key: 'profitRate',
          ellipsis: true,
          // sortable: true,
          render: (h, params) => {
            return h('span', {
              style: {
                fontWeight: '800',
                color: (params.row.tradeAmount - params.row.orderAmount) > 0 ? '#19be6b' : '#ff4f4f'
              }
            }, params.row.tradeAmount ? ((params.row.tradeAmount - params.row.orderAmount) / params.row.tradeAmount * 100).toFixed(1) + '%' : 0 + '%')
          }
        },
        { title: '订单',
          key: 'tradeCount',
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, params.row.tradeCount)
          }
        },
        { title: '收入',
          key: 'tradeAmount',
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, (params.row.tradeAmount).toLocaleString() + '元')
          }
        },
        { title: '下单',
          key: 'orderCount',
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, params.row.orderCount)
          }
        },
        { title: '支出',
          key: 'orderAmount',
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, (params.row.orderAmount).toLocaleString() + '元')
          }
        }
      ]
    }
  },
  watch: {
    timespan: function (newVal) {
      if (newVal !== 'daterange') {
        this.finishedTrades = {
          tradeCount: 0,
          orderCount: 0,
          daixiaoTradeCount: 0,
          tradePaymentTotal: 0,
          orderPaymentTotal: 0,
          daixiaoPaymentTotal: 0,
          shops: [],
          buyers: []
        }
        this.getFinishedTrades(this.timespan, this.status)
      } else if (newVal === 'daterange' && this.daterange) {
        this.finishedTrades = {
          tradeCount: 0,
          orderCount: 0,
          daixiaoTradeCount: 0,
          tradePaymentTotal: 0,
          orderPaymentTotal: 0,
          daixiaoPaymentTotal: 0,
          shops: [],
          buyers: []
        }
        this.getFinishedTradesByDateRange()
      }
    },
    status: function (newVal) {
      if (this.timespan !== 'daterange') {
        this.finishedTrades = {
          tradeCount: 0,
          orderCount: 0,
          daixiaoTradeCount: 0,
          tradePaymentTotal: 0,
          orderPaymentTotal: 0,
          daixiaoPaymentTotal: 0,
          shops: [],
          buyers: []
        }
        this.getFinishedTrades(this.timespan, this.status)
      } else if (this.timespan === 'daterange' && this.daterange) {
        this.finishedTrades = {
          tradeCount: 0,
          orderCount: 0,
          daixiaoTradeCount: 0,
          tradePaymentTotal: 0,
          orderPaymentTotal: 0,
          daixiaoPaymentTotal: 0,
          shops: [],
          buyers: []
        }
        this.getFinishedTradesByDateRange()
      }
    },
    finishedTrades: function (newVal) {
      newVal.shops.sort((a, b) => {
        return (b.tradeAmount - b.orderAmount) - (a.tradeAmount - a.orderAmount)
      })
      newVal.buyers.sort((a, b) => {
        return (b.tradeAmount - b.orderAmount) - (a.tradeAmount - a.orderAmount)
      })
    }
  },
  mounted () {
    this.colorSelections.sort(randomSort) // 随机排序颜色
    this.entrance()
  },
  computed: {
  },
  methods: {
    entrance () {
      if (!this.$store.getters.user.role) {
        this.$emit('on-checkauth', this.$route.path)
        setTimeout(() => {
          this.entrance()
        }, 2000)
      } else {
        this.getFinishedTrades(this.timespan, this.status)
      }
    },
    getFinishedTrades (timespan, status) {
      this.loading = true
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'profitstat',
        apiQuery: {}
      }
      this.apiData = {
        mode: status,
        timespan: timespan,
        byshop: true,
        bybuyer: true
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('订单列表获取失败！(' + respBody.message + ')')
            this.loading = false
            reject(new Error('订单列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.finishedTrades = respBody.data
            // console.log(respBody.data)
            this.loading = false
            resolve(respBody.data)
          }
        }).catch(err => {
          this.loading = false
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    getFinishedTradesByDateRange () {
      if (this.daterange && this.daterange.length === 2) {
        let dateStart = this.daterange[0]
        let dateEnd = this.daterange[1]
        if (new Date(dateEnd).getTime() - new Date(dateStart).getTime() > 1000 * 60 * 60 * 24 * 60) {
          this.$Message.error('订单列表获取失败！(统计时间跨度不能大于60天)')
        } else {
          let startdate = new Date(dateStart).toISOString()
          let enddate = new Date(dateEnd).toISOString()
          this.loading = true
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'profitstat',
            apiQuery: {}
          }
          this.apiData = {
            mode: this.status,
            timespan: 'daterange',
            startdate: startdate,
            enddate: enddate,
            byshop: true,
            bybuyer: true
          }
          // console.log(this.apiData)
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('订单列表获取失败！(' + respBody.message + ')')
                this.loading = false
                reject(new Error('订单列表获取失败！(' + respBody.message + ')'))
              } else {
                // this.$Message.success('列表载入成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.finishedTrades = respBody.data
                // console.log(respBody.data)
                this.loading = false
                resolve(respBody.data)
              }
            }).catch(err => {
              this.loading = false
              this.$store.dispatch('setAPILastResponse', err)
              reject(err)
            })
          })
        }
      }
    }
  }
}
function randomSort (a, b) {
  return Math.random() > 0.5 ? -1 : 1
}
</script>

<style lang="less" scoped>
ul.metro-ul {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  li {
    font-size: 20px;
    position: relative;
    color: #fff;
    display: inline-block;
    position: relative;
    min-height: 90px;
    padding: 10px;
    background:cadetblue;
    width: 19%;
    &.quarter {
      width: 24%;
    }
    &.half {
      width: 49%;
    }
    .title {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 18px;
      font-weight: 300;
    }
    .num {
      position: absolute;
      bottom: 10px;
      right: 20px;
      font-size: 36px;
      font-weight: 800;
    }
  }
}
.byshop {
  display: flex;
  flex-direction: row;
  justify-content:space-around;
  flex-wrap: wrap;
  .byshop-card {
    min-width: 240px;
    width: 24%;
    margin-bottom: 16px;
    &.loss {
      border-color: #ff4f4f;
      .ivu-card-head {
        border-color: #ff4f4f;
        background: #ff4f4f;
        color: #fff;
      }
    }
    .card-content {
      padding: 5px;
      display: flex;
      flex-direction: column;
      ul {
        list-style: none;
      }
      &.twin-cols {
        flex-direction: row;
        justify-content: space-between;
        ul {
          width: 47%;
          font-size: 12px;
          font-weight: 300;
          span {
            font-weight: 700;
            float: right;
          }
        }
      }
    }
  }
}
.bybuyer {
  display: flex;
  flex-direction: row;
  justify-content:space-around;
  flex-wrap: wrap;
  .bybuyer-card {
    min-width: 240px;
    width: 24%;
    margin-bottom: 16px;
    &.loss {
      border-color: #ff4f4f;
      .ivu-card-head {
        border-color: #ff4f4f;
        background: #ff4f4f;
        color: #fff;
      }
    }
    .card-content {
      padding: 5px;
      display: flex;
      flex-direction: column;
      ul {
        list-style: none;
      }
      &.twin-cols {
        flex-direction: row;
        justify-content: space-between;
        ul {
          width: 47%;
          font-size: 12px;
          font-weight: 300;
          span {
            font-weight: 700;
            float: right;
          }
        }
      }
    }
  }
}
</style>
