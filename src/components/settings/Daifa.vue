<template>
  <div class="daifa">
    <div class="box-tools pull-right">
      <div style="display: inline-block;margin-right:15px;" @mouseenter="toggleSearch(true)" @mouseleave="toggleSearch(false)">
        <Select v-model="searchBy" class="table-search" :class="{on: tableSearchOn||searchMode||searchBy}">
          <Option value="">不限</Option>
          <Option :value="col.subKey ? col.key +'.' + col.subKey : col.key" v-for="col in columns" :key="col.key" v-if="col.title&&col.searchable">{{col.title}}</Option>
        </Select>
        <Input v-model="keyword" ref="tableSearch" placeholder="搜索关键字" @on-focus="toggleSearchMode" @on-blur="toggleSearchMode" class="table-search" :class="{on: tableSearchOn||searchMode||keyword}" clearable></Input>
        <Button type="ghost" icon="ios-search" @click="search"></Button>
      </div>
      <Button-group>
        <Button type="ghost" icon="document" @click="newModal=true" v-if="['god', 'boss'].indexOf($store.getters.user.role)>-1">新增</Button>
        <Button type="ghost" icon="ios-refresh-empty" @click="refreshList">刷新</Button>
      </Button-group>
    </div>
    <Table stripe :loading="loading" :height="tableHeight" :columns="columns" :data="dataViewPage" ref="table"></Table>
    <div style="margin: 10px;overflow: hidden">
      <!-- <Button type="primary" size="large" @click="exportData" :disabled="!rowSelected"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button> -->
      <div style="float: right;">
        <Page :total="data.length" :page-size-opts="[10,20,50,100]" @on-change="changePage" @on-page-size-change="changePageSize" :current="pageCurrent" show-sizer show-total show-elevator></Page>
      </div>
    </div>
    <Modal
      v-model="newModal"
      title="新增代发商品"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="newForm" :model="newModel" :rules="ruleValidate" :label-width="120">
          <FormItem label="商品ID" prop="numIid">
            <Input v-model="newModel.numIid"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="newModal=false">关闭</Button>
        <Button type="success" size="large" @click="submitNew">提交</Button>
      </div>
    </Modal>
    <Modal
      v-model="deleteModal"
      title="删除代发商品"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        确认删除"{{deleteModel.num_iid}}"吗？
      </div>
      <div slot="footer">
        <Button size="large" @click="deleteModal=false">取消</Button>
        <Button type="error" size="large" @click="submitDelete">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {h} from './../../../static/115.js'
export default {
  name: 'daifa',
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'listall',
        apiQuery: {}
      },
      apiData: {},
      columns: [
        // { type: 'selection', width: 70, align: 'center' },
        {
          title: 'ID',
          key: 'id',
          ellipsis: true,
          sortable: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.id)
          }
        },
        { title: '商品ID',
          key: 'num_iid',
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
            return h('span', {}, params.row.num_iid)
          }
        },
        { title: '店群ID',
          key: 'group',
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
            return h('span', {}, params.row.group)
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          render: (h, params) => {
            return h('Button-group', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                },
                on: {
                  click: async () => {
                    this.deleteModal = true
                    this.deleteModel = params.row
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      loading: false,
      dataRaw: [],
      data: [],
      dataViewPage: [],
      pageCurrent: 1,
      pageSize: 10,
      keyword: '',
      searchBy: '',
      searchMode: false,
      tableSearchOn: false,
      sort: null,
      searchModel: null,
      tableHeight: 500,
      detailed: false,
      detailedItem: {},
      newModal: false,
      newModel: {
        numIid: ''
      },
      ruleValidate: {
        numIid: [
          { required: true, message: '请填写商品ID', trigger: 'blur' }
        ]
      },
      deleteModal: false,
      deleteModel: {
        id: null,
        num_iid: ''
      }
    }
  },
  created () {
    // 如果页面刷新，则emit到Layout组件获取最新session
    if (!this.$store.getters.session) {
      this.$emit('on-checkauth', this.$route.path)
    }
  },
  mounted () {
    console.log(h(22))
    this.initDataTable().then(async (result) => {
      this.dataRaw = result
      this.data = result
      this.pageSize = 10
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
  },
  watch: {
    'data': async function (newVal) {
      let vmInstance = this
      this.dataViewPage = this.data.filter(function (item, index, source) {
        return index < vmInstance.pageSize * vmInstance.pageCurrent && index >= vmInstance.pageSize * (vmInstance.pageCurrent - 1)
      })
    },
    'pageCurrent': async function (newVal) {
      let vmInstance = this
      this.dataViewPage = this.data.filter(function (item, index, source) {
        return index < vmInstance.pageSize * vmInstance.pageCurrent && index >= vmInstance.pageSize * (vmInstance.pageCurrent - 1)
      })
    },
    'pageSize': async function (newVal) {
      let vmInstance = this
      this.dataViewPage = this.data.filter(function (item, index, source) {
        return index < vmInstance.pageSize
      })
    },
    'sort': function (newVal) {
      this.refreshList()
    }
  },
  methods: {
    refreshList () {
      // refreshList()
      this.initDataTable().then(async (result) => {
        this.loading = false
        // this.searchBy = ''
        // this.keyword = ''
        // this.searchMode = false
        this.tableSearchOn = false
      })
    },
    async initDataTable () {
      this.loading = true
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'getblacklist',
        apiQuery: {}
      }
      this.apiData = {}
      if (this.sort) {
        this.apiData.sort = this.sort
      }
      if (this.searchModel) {
        this.apiData.search = this.searchModel
      }
      // TODO: 分页
      // this.apiData.limit$ = 2
      // this.apiData.skip$ = 2 * (this.pageCurrent - 1)
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
            this.dataRaw = respBody.data
            this.data = respBody.data
            this.pageSize = 10
            this.pageCurrent = 1
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    sortTable (sort) {
      this.sort = sort
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
    submitNew () {
      this.$refs['newForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'addblacklist',
            apiQuery: {}
          }
          this.apiData = {
            num_iid: this.newModel.numIid
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('新增失败！(' + respBody.message + ')')
                reject(new Error('新增失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('新增成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.newModal = false
                resolve(respBody.data)
              }
            }).catch(err => {
              this.$store.dispatch('setAPILastResponse', err)
              reject(err)
            })
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    submitDelete () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'deleteblacklist',
        apiQuery: {}
      }
      this.apiData = {
        num_iid: this.deleteModel.num_iid
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('删除失败！(' + respBody.message + ')')
            reject(new Error('删除失败！(' + respBody.message + ')'))
          } else {
            this.$Message.success('删除成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.deleteModal = false
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
