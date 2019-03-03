<template>
  <div class="buyers">
    <div class="box-tools pull-right">
      <div style="display: inline-block;margin-right:15px;" @mouseenter="toggleSearch(true)" @mouseleave="toggleSearch(false)">
        <Select v-model="searchBy" class="table-search" :class="{on: tableSearchOn||searchMode||searchBy}">
          <Option value="">不限</Option>
          <Option :value="col.subKey ? col.key +'.' + col.subKey : col.key" v-for="col in columns" :key="col.key" v-if="col.title&&col.searchable">{{col.title}}</Option>
        </Select>
        <Input v-model="keyword" ref="tableSearch" placeholder="搜索关键字" @on-focus="toggleSearchMode" @on-blur="toggleSearchMode" class="table-search" :class="{on: tableSearchOn||searchMode||keyword}" clearable></Input>
        <Button type="ghost" icon="ios-search" @click="searchRemote"></Button>
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
      title="新增买手"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="newForm" :model="newModel" :rules="ruleValidate" :label-width="120">
          <FormItem label="用户" prop="userid">
            <Select v-model="newModel.userid" placeholder="选择用户" @on-change="changeUser" filterable>
              <Option value="">请选择用户</Option>
              <Option :value="user.id" v-for="(user, index) in userSelectList" :key="index">{{user.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="店铺" prop="shopid">
            <Select v-model="newModel.shopid" placeholder="选择店铺" filterable>
              <Option value="">请选择店铺</Option>
              <Option :value="shop.id" v-for="(shop, index) in shopSelectList" :key="index">{{shop.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="权重" prop="weight">
            <InputNumber :max="1" :min="0" :step="0.1" v-model="newModel.weight"></InputNumber>
          </FormItem>
          <FormItem label="接单" prop="is_enable">
            <i-switch v-model="newModel.is_enable"></i-switch>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="newModal=false">关闭</Button>
        <Button type="success" size="large" @click="submitNew">提交</Button>
      </div>
    </Modal>
    <Modal
      v-model="editModal"
      title="修改买手"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="editForm" :model="editModel" :rules="ruleValidate" :label-width="120">
          <FormItem label="用户" prop="userid">
            <Select v-model="editModel.userid" placeholder="选择用户" @on-change="changeUserEdit" filterable disabled>
              <Option value="">请选择用户</Option>
              <Option :value="user.id" v-for="(user, index) in userSelectList" :key="index">{{user.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="店铺" prop="shopid">
            <Select v-model="editModel.shopid" placeholder="选择店铺" filterable disabled>
              <Option value="">请选择店铺</Option>
              <Option :value="shop.id" v-for="(shop, index) in shopSelectList" :key="index">{{shop.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="权重" prop="weight">
            <InputNumber :max="1" :min="0" :step="0.1" v-model="editModel.weight"></InputNumber>
          </FormItem>
          <FormItem label="接单" prop="is_enable">
            <i-switch v-model="editModel.is_enable"></i-switch>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="editModal=false">关闭</Button>
        <Button type="success" size="large" @click="submitEdit">提交</Button>
      </div>
    </Modal>
    <Modal
      v-model="renameModal"
      title="修改买手名称"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="renameForm" :model="renameModel" :rules="ruleValidateRename" :label-width="120">
          <FormItem label="名称" prop="name">
            <Input v-model="renameModel.name"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="renameModal=false">关闭</Button>
        <Button type="success" size="large" @click="submitRename">提交</Button>
      </div>
    </Modal>
    <Modal
      v-model="deleteModal"
      title="删除买手"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        确认删除 <b>{{getShopName(deleteModel.shopid)}}</b> 店铺的买手 <b>{{deleteModel.name}}</b> 么？
      </div>
      <div slot="footer">
        <Button size="large" @click="deleteModal=false">关闭</Button>
        <Button type="error" size="large" @click="submitDelete">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'buyers',
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
          title: '名称',
          key: 'name',
          width: 160,
          fixed: 'left',
          ellipsis: true,
          sortable: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.name)
          }
        },
        { title: '店铺id',
          key: 'shopid',
          width: 120,
          ellipsis: true,
          // filters: this.shopSelectList.map((item) => {
          //   return {
          //     label: item.name,
          //     value: item.id
          //   }
          // }),
          filterMultiple: true,
          filterRemote: (value, row) => {
            this.filterShop = value
          },
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, this.getShopName(params.row.shopid))
          }
        },
        { title: '权重',
          key: 'weight',
          width: 120,
          ellipsis: true,
          sortable: true
        },
        { title: '状态',
          key: 'is_enable',
          width: 120,
          ellipsis: true,
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, params.row.is_enable === false ? '休息中' : '接单中')
          }
        },
        { title: '本日派单',
          key: 'today_assigned',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本日完成',
          key: 'today_finished',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本日下单',
          key: 'today_ordered',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本日退回',
          key: 'today_failed',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本日撤销',
          key: 'today_dismissed',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本月派单',
          key: 'monthly_assigned',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本月完成',
          key: 'monthly_finished',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本月下单',
          key: 'monthly_ordered',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本月退回',
          key: 'monthly_failed',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '本月撤销',
          key: 'monthly_dismissed',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '历史派单',
          key: 'total_assigned',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '历史完成',
          key: 'total_finished',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '历史下单',
          key: 'total_ordered',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '历史退回',
          key: 'total_failed',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        { title: '历史撤销',
          key: 'total_dismissed',
          width: 100,
          ellipsis: true,
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 180,
          render: (h, params) => {
            if (['god', 'boss'].indexOf(this.$store.getters.user.role) > -1) {
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
                      await this.syncUserList().then((users) => {
                      })
                      await this.syncShopList().then((shops) => {
                      })
                      this.editModal = true
                      this.editModel = params.row
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                  },
                  on: {
                    click: async () => {
                      this.renameModal = true
                      this.renameModel = {
                        id: params.row.id,
                        name: params.row.name
                      }
                    }
                  }
                }, '改名'),
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
      filterShop: null,
      tableHeight: 500,
      detailed: false,
      detailedItem: {},
      newModal: false,
      newModel: {
        group: this.$store.getters.user.group || 1,
        name: '',
        userid: '',
        shopid: '',
        weight: 0,
        is_enable: true
      },
      editModal: false,
      editModel: {
        id: '',
        group: this.$store.getters.user.group || 1,
        name: '',
        userid: '',
        shopid: '',
        weight: 0,
        is_enable: true
      },
      deleteModal: false,
      deleteModel: {
        id: '',
        group: this.$store.getters.user.group || 1,
        name: '',
        userid: '',
        shopid: '',
        weight: 0,
        is_enable: true
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        userid: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        shopid: [
          { required: true, message: '请选择店铺', trigger: 'blur' }
        ],
        weight: [
          { type: 'number', message: '请输入0~1之间的数字', min: 0, max: 1, trigger: 'blur' }
        ]
      },
      renameModal: false,
      renameModel: {
        id: '',
        name: ''
      },
      ruleValidateRename: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ]
      },
      userSelectList: [],
      shopSelectList: null
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
      this.pageSize = 10
      this.pageCurrent = 1
      this.loading = false
      this.calcTableHeight()
      await this.syncShopList().then((shops) => {
      })
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
    },
    'filterShop': function (newVal) {
      this.refreshList()
    },
    'newModal': async function (val) {
      if (val) {
        await this.syncUserList().then((users) => {
        })
        await this.syncShopList().then((shops) => {
        })
      }
    },
    'shopSelectList': async function (newVal) {
      if (newVal) {
        this.columns[1].filters = newVal.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
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
        apiService: 'buyers',
        apiAction: 'listall',
        apiQuery: {}
      }
      this.apiData = {}
      if (this.sort) {
        this.apiData.sort = this.sort
      }
      if (this.searchModel) {
        this.apiData.search = this.searchModel
      }
      if (this.filterShop) {
        this.apiData.filterShop = this.filterShop
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
    getShopName (shopid) {
      if (this.shopSelectList) {
        let shop = this.shopSelectList.filter((item) => {
          return item.id === shopid
        })[0]
        return shop ? shop.name : shopid
      } else {
        return shopid
      }
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
    async syncUserList () {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'selectlist',
        apiQuery: {}
      }
      this.apiData = {}
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('用户列表获取失败！(' + respBody.message + ')')
            reject(new Error('用户列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.userSelectList = respBody.data
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async syncShopList () {
      this.apiItem = {
        apiHost: '',
        apiService: 'shops',
        apiAction: 'selectlist',
        apiQuery: {}
      }
      this.apiData = {}
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('店铺列表获取失败！(' + respBody.message + ')')
            reject(new Error('店铺列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.shopSelectList = respBody.data
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    changeUser (val) {
      let user = this.userSelectList.filter((item) => {
        return item.id === val
      })[0]
      this.newModel.name = user ? user.name : ''
    },
    changeUserEdit (val) {
      let user = this.userSelectList.filter((item) => {
        return item.id === val
      })[0]
      this.editModel.name = user ? user.name : ''
    },
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'buyers',
            apiAction: 'edit',
            apiQuery: {}
          }
          this.apiData = {
            id: this.editModel.id,
            group: this.editModel.group,
            name: this.editModel.name,
            userid: this.editModel.userid,
            shopid: this.editModel.shopid,
            weight: this.editModel.weight,
            is_enable: this.editModel.is_enable
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('买手修改失败！(' + respBody.message + ')')
                reject(new Error('买手修改失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('买手修改成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.editModal = false
                this.refreshList()
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
    submitNew () {
      this.$refs['newForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'buyers',
            apiAction: 'add',
            apiQuery: {}
          }
          this.apiData = {
            group: this.newModel.group,
            name: this.newModel.name,
            userid: this.newModel.userid,
            shopid: this.newModel.shopid,
            weight: this.newModel.weight,
            is_enable: this.newModel.is_enable
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('买手新增失败！(' + respBody.message + ')')
                reject(new Error('买手新增失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('买手新增成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.newModal = false
                this.refreshList()
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
    submitRename () {
      this.$refs['renameForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'buyers',
            apiAction: 'rename',
            apiQuery: {}
          }
          this.apiData = {
            id: this.renameModel.id,
            name: this.renameModel.name
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('名称修改失败！(' + respBody.message + ')')
                reject(new Error('名称修改失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('名称修改成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.renameModal = false
                this.refreshList()
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
        apiService: 'buyers',
        apiAction: 'delete',
        apiQuery: {}
      }
      this.apiData = {
        id: this.deleteModel.id
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('删除买手失败！(' + respBody.message + ')')
            reject(new Error('删除买手失败！(' + respBody.message + ')'))
          } else {
            this.$Message.success('删除买手成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.deleteModal = false
            this.refreshList()
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
