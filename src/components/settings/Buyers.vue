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
        <Button type="ghost" icon="document" @click="newModal=true" v-if="$store.getters.user.role==='boss'">新增</Button>
        <Button type="ghost" icon="ios-refresh-empty" @click="refreshBuyerList">刷新</Button>
      </Button-group>
    </div>
    <Table stripe :loading="loading" :height="tableHeight" :columns="userColumns" :data="dataViewPage" ref="usertable"></Table>
    <!-- <Table stripe :loading="loading" :height="tableHeight" :columns="columns" :data="dataViewPage" ref="table"></Table> -->
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <!-- <Page :total="data.length" :page-size-opts="[10,20,50,100]" @on-change="changePage" @on-page-size-change="changePageSize" :current="pageCurrent" show-sizer show-total show-elevator></Page> -->
        <Page :total="userSelectList.length" :page-size-opts="[10,20,50,100]" @on-change="changeUserPage" @on-page-size-change="changeUserPageSize" :current="pageUserCurrent" show-sizer show-total show-elevator></Page>
      </div>
    </div>
    <Modal
      v-model="buyerShopModal"
      title="买手接单设置"
      width="80%"
      :mask-closable="true"
      @on-cancel="buyerShopModal=false;detailByShopid=null;detailByUserid=null"
      :transfer="false">
      <div class="modal-content">
        <div class="buyer-shops-content" v-if="detailByUserid">
          <h2>{{userSelectList.filter((item)=>{return item.id===detailByUserid})[0].name}}</h2>
          <ul>
            <li v-for="(shop, index) in shopSelectList" :key="index" :class="dataBuyer.filter((item)=>{return item.shopid===shop.id}).length?dataBuyer.filter((item)=>{return item.shopid===shop.id})[0].is_enable?'listening':'holding':'unlinked'" @click="processBuyerShop(detailByUserid, shop.id)">
              <div class="buyer-shop-item">{{shop.name}}</div>
              <Tag type="dot" :color="dataBuyer.filter((item)=>{return item.shopid===shop.id}).length?dataBuyer.filter((item)=>{return item.shopid===shop.id})[0].is_enable?'green':'red':'default'">{{dataBuyer.filter((item)=>{return item.shopid===shop.id}).length?dataBuyer.filter((item)=>{return item.shopid===shop.id})[0].is_enable?'接单中':'休息中':'未关联'}}</Tag>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer">
        <Button size="large" @click="newModal=true" v-if="$store.getters.user.role==='boss'">新增</Button>
        <Button size="large" @click="buyerShopModal=false;detailByShopid=null;detailByUserid=null">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="detailModal"
      title="买手设置"
      width="80%"
      :mask-closable="true"
      @on-cancel="detailModal=false;detailByShopid=null;detailByUserid=null"
      :transfer="false">
      <div class="modal-content">
        <Table stripe :loading="loading" :height="tableHeight" @on-sort-change="sortBuyerTable" :columns="columns" :data="dataBuyerViewPage" ref="table"></Table>
      </div>
      <div slot="footer">
        <div style="float: left;">
          <Page :total="dataBuyer.length" :page-size-opts="[10,20,50,100]" @on-change="changePage" @on-page-size-change="changePageSize" :current="pageCurrent" show-sizer show-total show-elevator></Page>
        </div>
        <Button size="large" @click="newModal=true" v-if="$store.getters.user.role==='boss'">新增</Button>
        <Button size="large" @click="detailModal=false;detailByShopid=null;detailByUserid=null">关闭</Button>
      </div>
    </Modal>
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
        <Button type="success" size="large" @click="submitRename" v-if="detailByShopid||detailByUserid">提交</Button>
        <Button type="success" size="large" @click="submitUserRename" v-else>提交</Button>
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
  props: ['shopList'],
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
          sortable: 'custom',
          render: (h, params) => {
            return h('span', {}, this.getShopName(params.row.shopid))
          }
        },
        { title: '权重',
          key: 'weight',
          width: 120,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '状态',
          key: 'is_enable',
          width: 120,
          ellipsis: true,
          sortable: 'custom',
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.is_enable === false ? 'red' : 'blue'
              }
            }, params.row.is_enable === false ? '休息中' : '接单中')
          }
        },
        { title: '本日派单',
          key: 'today_assigned',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '本日完成',
          key: 'today_finished',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
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
          sortable: 'custom'
        },
        { title: '本日撤销',
          key: 'today_dismissed',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '本月派单',
          key: 'monthly_assigned',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '本月完成',
          key: 'monthly_finished',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '本月下单',
          key: 'monthly_ordered',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '本月退回',
          key: 'monthly_failed',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '本月撤销',
          key: 'monthly_dismissed',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '历史派单',
          key: 'total_assigned',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '历史完成',
          key: 'total_finished',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '历史下单',
          key: 'total_ordered',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '历史退回',
          key: 'total_failed',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        { title: '历史撤销',
          key: 'total_dismissed',
          width: 100,
          ellipsis: true,
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 180,
          render: (h, params) => {
            if (['boss'].indexOf(this.$store.getters.user.role) > -1) {
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
      userColumns: [
        // { type: 'selection', width: 70, align: 'center' },
        {
          title: 'user_id',
          key: 'user_id',
          sortable: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.user_id)
          }
        },
        {
          title: '姓名',
          key: 'name',
          ellipsis: true,
          sortable: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.name)
          }
        },
        { title: '用户id',
          key: 'id',
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
            return h('span', {}, this.getShopName(params.row.id))
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 180,
          render: (h, params) => {
            if (['boss'].indexOf(this.$store.getters.user.role) > -1) {
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
                      this.detailModal = true
                      this.detailByUserid = params.row.id
                    }
                  }
                }, '详细'),
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                  },
                  on: {
                    click: async () => {
                      this.buyerShopModal = true
                      this.detailByUserid = params.row.id
                    }
                  }
                }, '接单'),
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
                }, '改名')
              ])
            }
          }
        }
      ],
      loading: false,
      dataRaw: [],
      data: [],
      dataBuyer: [],
      dataBuyerRaw: [],
      dataViewPage: [],
      dataBuyerViewPage: [],
      pageCurrent: 1,
      pageSize: 10,
      pageUserCurrent: 1,
      pageUserSize: 10,
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
      detailModal: false,
      detailByUserid: null,
      detailByShopid: null,
      buyerShopModal: false,
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
      this.dataBuyer = result
      this.dataBuyerRaw = result
      this.pageSize = 10
      this.pageCurrent = 1
      this.loading = false
      this.calcTableHeight()
      await this.syncUserList().then((users) => {
        this.data = users
      })
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
    'detailByUserid': function (newVal) {
      this.dataBuyer = this.dataBuyerRaw.filter((item) => {
        return item.userid === newVal
      })
      this.dataBuyerViewPage = this.dataBuyer.filter((item, index, source) => {
        return index < this.pageSize * this.pageCurrent && index >= this.pageSize * (this.pageCurrent - 1)
      })
    },
    'data': async function (newVal) {
      let vmInstance = this
      this.dataViewPage = this.data.filter(function (item, index, source) {
        return index < vmInstance.pageSize * vmInstance.pageCurrent && index >= vmInstance.pageSize * (vmInstance.pageCurrent - 1)
      })
    },
    'pageCurrent': async function (newVal) {
      let vmInstance = this
      this.dataBuyerViewPage = this.dataBuyer.filter(function (item, index, source) {
        return index < vmInstance.pageSize * vmInstance.pageCurrent && index >= vmInstance.pageSize * (vmInstance.pageCurrent - 1)
      })
    },
    'pageSize': async function (newVal) {
      let vmInstance = this
      this.dataBuyerViewPage = this.dataBuyer.filter((item) => {
        if (this.detailByUserid) {
          return item.userid === this.detailByUserid
        } else if (this.detailByShopid) {
          return item.shopid === this.detailByShopid
        } else {
          return item
        }
      }).filter(function (item, index, source) {
        return index < vmInstance.pageSize
      })
    },
    'pageUserCurrent': async function (newVal) {
      let vmInstance = this
      this.dataViewPage = this.userSelectList.filter(function (item, index, source) {
        return index < vmInstance.pageUserSize * vmInstance.pageUserCurrent && index >= vmInstance.pageUserSize * (vmInstance.pageUserCurrent - 1)
      })
    },
    'pageUserSize': async function (newVal) {
      let vmInstance = this
      this.dataViewPage = this.userSelectList.filter(function (item, index, source) {
        return index < vmInstance.pageUserSize
      })
    },
    'sort': function (newVal) {
      this.refreshList((refreshList) => {
        this.dataBuyer = this.dataBuyerRaw.filter((item) => {
          return item.userid === this.detailByUserid
        })
      })
    },
    'filterShop': function (newVal) {
      this.refreshList((refreshList) => {
        this.dataBuyer = this.dataBuyerRaw.filter((item) => {
          return item.userid === this.detailByUserid
        })
      })
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
    refreshBuyerList () {
      this.refreshList((refreshList) => {
        this.dataBuyer = this.dataBuyerRaw.filter((item) => {
          return item.userid === this.detailByUserid
        })
        this.syncUserList().then((users) => {
          this.data = users
        })
      })
    },
    refreshList (callback) {
      this.initDataTable().then(async (result) => {
        this.dataBuyerRaw = result
        // this.dataBuyer = result
        this.pageSize = 10
        this.pageCurrent = 1
        this.loading = false
        // this.searchBy = ''
        // this.keyword = ''
        // this.searchMode = false
        this.tableSearchOn = false
        if (callback && typeof callback === 'function') {
          callback(result)
        }
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
            // this.dataBuyerRaw = respBody.data
            // this.data = respBody.data
            // this.dataBuyer = respBody.data
            // this.data = this.prepareBuyerData(respBody.data)
            // this.pageSize = 10
            // this.pageCurrent = 1
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    prepareBuyerData (data) {
      let tempArr = []
      let buyerArr = []
      data.map((item) => {
        tempArr.push(item.userid)
      })
      let buyerUserIdArr = Array.from(new Set(tempArr))
      buyerUserIdArr.forEach((item) => {
        let buyer = data.filter((b) => {
          return b.userid === item
        })[0]
        buyerArr.push({
          name: buyer.name,
          userid: item
        })
      })
      return buyerArr
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
    sortBuyerTable (sort) {
      // console.log(sort.column, sort.key, sort.order, this.dataBuyer[0][sort.key])
      this.dataBuyer.sort((a, b) => {
        let type = typeof a[sort.key]
        switch (type) {
          case 'string':
            if (sort.order === 'asc') {
              if (sort.key === 'shopid') {
                return this.getShopName(a[sort.key]).localeCompare(this.getShopName(b[sort.key]), 'zh-CN')
              } else {
                return a[sort.key].localeCompare(b[sort.key], 'zh-CN')
              }
            } else if (sort.order === 'desc') {
              if (sort.key === 'shopid') {
                return this.getShopName(b[sort.key]).localeCompare(this.getShopName(a[sort.key]), 'zh-CN')
              } else {
                return b[sort.key].localeCompare(a[sort.key], 'zh-CN')
              }
            } else {
              return a - b
            }
          default:
            if (sort.order === 'asc') {
              return a[sort.key] - b[sort.key]
            } else if (sort.order === 'desc') {
              return b[sort.key] - a[sort.key]
            } else {
              return a - b
            }
        }
      })
      this.dataBuyerViewPage = this.dataBuyer.filter((item, index, source) => {
        return index < this.pageSize * this.pageCurrent && index >= this.pageSize * (this.pageCurrent - 1)
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
    changeUserPage (page) {
      this.pageUserCurrent = page
    },
    changeUserPageSize (pageSize) {
      this.pageUserSize = pageSize
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
      this.refreshList((refreshList) => {
        this.dataBuyer = this.dataBuyerRaw.filter((item) => {
          return item.userid === this.detailByUserid
        })
      })
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
            this.userSelectList = respBody.data.sort((a, b) => {
              return a.name.localeCompare(b.name, 'zh-CN')
            })
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
            this.shopSelectList = respBody.data.sort((a, b) => {
              return a.name.localeCompare(b.name, 'zh-CN')
            })
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
    processBuyerShop (userid, shopid) {
      let user = this.userSelectList.filter((item) => {
        return item.id === userid
      })[0]
      let shop = this.shopSelectList.filter((item) => {
        return item.id === shopid
      })[0]
      let buyer = this.dataBuyer.filter((item) => {
        return item.shopid === shopid
      })
      let status = buyer.length ? buyer[0].is_enable ? 'listening' : 'holding' : 'unlinked'
      switch (status) {
        case 'listening':
          this.editModel = {
            id: buyer[0].id,
            group: this.$store.getters.user.group || buyer[0].group,
            name: buyer[0].name,
            userid: userid,
            shopid: shopid,
            weight: 0,
            is_enable: false
          }
          this.$Modal.confirm({
            render: (h) => {
              return h('div', {}, '确认设置' + buyer[0].name + '对店铺' + shop.name + '为“休息中”么？设置后该买手将无法取到这个店铺的订单')
            },
            onOk: async () => {
              await this.submitEdit()
              this.refreshList((refreshList) => {
                this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                  return item.userid === this.detailByUserid
                })
              })
            }
          })
          break
        case 'holding':
          this.editModel = {
            id: buyer[0].id,
            group: this.$store.getters.user.group || buyer[0].group,
            name: buyer[0].name,
            userid: userid,
            shopid: shopid,
            weight: 0,
            is_enable: true
          }
          this.$Modal.confirm({
            render: (h) => {
              return h('div', {}, '确认设置' + buyer[0].name + '对店铺' + shop.name + '为“接单中”么？')
            },
            onOk: async () => {
              await this.submitEdit()
              this.refreshList((refreshList) => {
                this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                  return item.userid === this.detailByUserid
                })
              })
            }
          })
          break
        case 'unlinked':
          this.newModel = {
            group: this.$store.getters.user.group || 1,
            name: user.name,
            userid: userid,
            shopid: shopid,
            weight: 0,
            is_enable: true
          }
          this.$Modal.confirm({
            render: (h) => {
              return h('div', {}, '确认设置' + user.name + '对店铺' + shop.name + '为“接单中”么？')
            },
            onOk: async () => {
              await this.submitNew()
              this.refreshList((refreshList) => {
                this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                  return item.userid === this.detailByUserid
                })
              })
            }
          })
          break
      }
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
                this.refreshList((refreshList) => {
                  this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                    return item.userid === this.detailByUserid
                  })
                })
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
                this.refreshList((refreshList) => {
                  this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                    return item.userid === this.detailByUserid
                  })
                })
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
                this.refreshList((refreshList) => {
                  this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                    return item.userid === this.detailByUserid
                  })
                  this.syncUserList().then((users) => {
                    this.data = users
                  })
                })
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
    submitUserRename () {
      this.$refs['renameForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'users',
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
                this.refreshList((refreshList) => {
                  this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                    return item.userid === this.detailByUserid
                  })
                })
                this.syncUserList().then((users) => {
                  this.data = users
                })
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
            this.refreshList((refreshList) => {
              this.dataBuyer = this.dataBuyerRaw.filter((item) => {
                return item.userid === this.detailByUserid
              })
            })
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
.buyer-shops-content {
  ul {
    list-style: none;
    li {
      width: 280px;
      height: 70px;
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #f2f2f2;
      margin: 0 10px 10px 0;
      border-radius: 5px;
      cursor: pointer;
      transition: all .3s linear;
      padding: 10px 20px;
      &.holding {
        border: 1px solid #cf3a3a;
        background: #ffe6e6;
      }
      &.listening {
        border: 1px solid #2b9669;
        background: #c9ffe9;
      }
      &:hover {
        border: 1px solid rgb(0, 89, 255);
        background: rgb(204, 222, 255);
      }
    }
  }
}
</style>
