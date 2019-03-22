<template>
  <div class="shops">
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
        <Button type="ghost" icon="android-sync" @click="syncShopModal" v-if="$store.getters.user.role==='boss'">同步店铺</Button>
        <Button type="ghost" icon="gear-a" @click="translinkModal=true" v-if="['god', 'boss'].indexOf($store.getters.user.role)>-1">转链设置</Button>
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
      v-model="translinkModal"
      title="转链设置"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="translinkForm" :model="translinkModel" :rules="ruleValidateTransLink" :label-width="120">
          <FormItem label="转链模式">
            <i-switch v-model="translinkModel.transMode" size="large" true-value="normal" false-value="yitao">
              <span slot="open">第三方</span>
              <span slot="close">一淘</span>
            </i-switch>
            <p>
              <span>一淘模式下系统将自动记录历史转链记录，为之后的下单提供转链服务。第三方转链服务提供在线实时转链服务。</span>
            </p>
          </FormItem>
          <FormItem label="转链AppKey" prop="appkey" v-show="translinkModel.transMode==='normal'">
            <Input v-model="translinkModel.appkey"></Input>
            <a href="http://yun.yangsa.net/" target="_blank">申请账号</a>
          </FormItem>
          <FormItem label="转链阿里妈妈" prop="pid" v-show="translinkModel.transMode==='normal'">
            <Input v-model="translinkModel.pid" placeholder="联盟授权对应的PID,需在六先生授权的联盟账号下"></Input>
          </FormItem>
          <FormItem label="淘宝联盟账号" prop="nickname" v-show="translinkModel.transMode==='normal'">
            <Input v-model="translinkModel.nickname" placeholder="绑定了多个联盟账号需填,否则取第一个"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="translinkModal=false">关闭</Button>
        <Button type="success" size="large" @click="submitTransLink">提交</Button>
      </div>
    </Modal>
    <Modal
      v-model="newModal"
      title="新增店铺"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="newForm" :model="newModel" :rules="ruleValidate" :label-width="120">
          <FormItem label="店铺昵称" prop="name">
            <Input v-model="newModel.name"></Input>
          </FormItem>
          <FormItem label="转链模式">
            <i-switch v-model="newModel.transMode" size="large" true-value="normal" false-value="yitao">
              <span slot="open">第三方</span>
              <span slot="close">一淘</span>
            </i-switch>
            <p>
              <span>一淘模式下系统将自动记录历史转链记录，为之后的下单提供转链服务。第三方转链服务提供在线实时转链服务。</span>
            </p>
          </FormItem>
          <FormItem label="转链AppKey" prop="appkey" v-show="newModel.transMode==='normal'">
            <Input v-model="newModel.appkey"></Input>
            <a href="http://yun.yangsa.net/" target="_blank">申请账号</a>
          </FormItem>
          <FormItem label="转链阿里妈妈" prop="pid" v-show="newModel.transMode==='normal'">
            <Input v-model="newModel.pid"></Input>
          </FormItem>
          <FormItem label="淘宝联盟账号" prop="nickname" v-show="newModel.transMode==='normal'">
            <Input v-model="newModel.nickname" placeholder="绑定了多个联盟账号需填,否则取第一个"></Input>
          </FormItem>
          <!-- <FormItem label="店铺" prop="shopid">
            <RadioGroup v-model="newModel.assignMode" type="button">
              <Radio label="auto">自动分配</Radio>
              <Radio label="passive">买手取单</Radio>
            </RadioGroup>
          </FormItem> -->
          <FormItem label="店铺分类标签" prop="tags" v-if="$store.getters.user.role==='god'">
            <CheckboxGroup v-model="newModel.tags">
              <Poptip trigger="hover" v-for="(tag, idx) in shopTagDic" :key="idx">
                <Checkbox :label="tag"></Checkbox>
                <div class="shoptag-manage" slot="content">
                  <Button type="text" @click="editTagSpec(tag)">修改</Button>
                  <Button type="text" @click="deleteTagSpec(tag)">删除</Button>
                </div>
              </Poptip>
              <Button type="ghost" size="small" icon="plus" @click="addNewTagSpec">新增</Button>
            </CheckboxGroup>
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
      title="修改店铺"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="editForm" :model="editModel" :rules="ruleValidateEdit" :label-width="120">
          <FormItem label="店铺昵称" prop="name">
            <Input v-model="editModel.name"></Input>
          </FormItem>
          <FormItem label="转链模式">
            <i-switch v-model="editModel.transMode" size="large" true-value="normal" false-value="yitao">
              <span slot="open">第三方</span>
              <span slot="close">一淘</span>
            </i-switch>
            <p>
              <span>一淘模式下系统将自动记录历史转链记录，为之后的下单提供转链服务。第三方转链服务提供在线实时转链服务。</span>
            </p>
          </FormItem>
          <FormItem label="转链AppKey" prop="appkey" v-show="editModel.transMode==='normal'">
            <Input v-model="editModel.appkey"></Input>
            <a href="http://yun.yangsa.net/" target="_blank">申请账号</a>
          </FormItem>
          <FormItem label="转链阿里妈妈" prop="pid" v-show="editModel.transMode==='normal'">
            <Input v-model="editModel.pid"></Input>
          </FormItem>
          <FormItem label="淘宝联盟账号" prop="nickname" v-show="editModel.transMode==='normal'">
            <Input v-model="editModel.nickname" placeholder="绑定了多个联盟账号需填,否则取第一个"></Input>
          </FormItem>
          <!-- <FormItem label="店铺" prop="shopid">
            <RadioGroup v-model="editModel.assignMode" type="button">
              <Radio label="auto">自动分配</Radio>
              <Radio label="passive">买手取单</Radio>
            </RadioGroup>
          </FormItem> -->
          <FormItem label="店铺分类标签" prop="tags" v-if="$store.getters.user.role==='god'">
            <CheckboxGroup v-model="editModel.tags">
              <Poptip trigger="hover" v-for="(tag, idx) in shopTagDic" :key="idx">
                <Checkbox :label="tag"></Checkbox>
                <div class="shoptag-manage" slot="content">
                  <Button type="text" @click="editTagSpec(tag)">修改</Button>
                  <Button type="text" @click="deleteTagSpec(tag)">删除</Button>
                </div>
              </Poptip>
              <Button type="ghost" size="small" icon="plus" @click="addNewTagSpec">新增</Button>
            </CheckboxGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" @click="editModal=false">关闭</Button>
        <Button type="success" size="large" @click="submitEdit">提交</Button>
      </div>
    </Modal>
    <Modal
      v-model="deleteModal"
      title="删除店铺"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        确认删除店铺"{{deleteModel.name}}"吗？
      </div>
      <div slot="footer">
        <Button size="large" @click="deleteModal=false">取消</Button>
        <Button type="error" size="large" @click="submitDelete">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'shops',
  data () {
    const validateTransLinkAppKeyNew = (rule, value, callback) => {
      if (value === '' && this.newModel.pid !== '') {
        // 对第二个密码框单独验证
        this.$refs.newForm.validateField('pid')
        callback(new Error('转链信息请填写完整'))
      } else {
        callback()
      }
    }
    const validateTransLinkPidNew = (rule, value, callback) => {
      if (value === '' && this.newModel.appkey !== '') {
        this.$refs.newForm.validateField('appkey')
        callback(new Error('转链信息请填写完整'))
      } else {
        callback()
      }
    }
    const validateTransLinkAppKeyEdit = (rule, value, callback) => {
      if (value === '' && this.editModel.pid !== '') {
        // 对第二个密码框单独验证
        this.$refs.editForm.validateField('pid')
        callback(new Error('转链信息请填写完整'))
      } else {
        callback()
      }
    }
    const validateTransLinkPidEdit = (rule, value, callback) => {
      if (value === '' && this.editModel.appkey !== '') {
        this.$refs.editForm.validateField('appkey')
        callback(new Error('转链信息请填写完整'))
      } else {
        callback()
      }
    }
    const validateTransLinkAppKeyAll = (rule, value, callback) => {
      if (value === '' && this.translinkModel.pid !== '') {
        // 对第二个密码框单独验证
        this.$refs.newForm.validateField('pid')
        callback(new Error('转链信息请填写完整'))
      } else {
        callback()
      }
    }
    const validateTransLinkPidAll = (rule, value, callback) => {
      if (value === '' && this.translinkModel.appkey !== '') {
        this.$refs.newForm.validateField('appkey')
        callback(new Error('转链信息请填写完整'))
      } else {
        callback()
      }
    }
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
          title: '店铺ID',
          key: 'id',
          ellipsis: true,
          sortable: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.id)
          }
        },
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
        { title: '授权状态',
          key: 'authority',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'border',
                color: this.getAuthorityStatusTagColor(params.row.trade_authorized)
              }
            }, this.getAuthorityStatusTagText(params.row.trade_authorized))
          }
        },
        // { title: '派单模式',
        //   key: 'assign_mode',
        //   ellipsis: true,
        //   render: (h, params) => {
        //     return h('span', {}, params.row.assign_mode === 'passive' ? '买手取单' : '自动分配')
        //   }
        // },
        { title: '转链模式',
          key: 'transMode',
          sortable: true,
          render: (h, params) => {
            return h('span', {}, params.row.transMode === 'yitao' ? '一淘' : params.row.transMode === 'normal' ? '第三方' : '未设置')
          }
        },
        { title: '转链AppKey',
          key: 'appkey',
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, params.row.appkey)
          }
        },
        { title: '转链阿里妈妈',
          key: 'pid',
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, params.row.pid)
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
                    this.editModal = true
                    this.editModel = {
                      id: params.row.id,
                      name: params.row.name,
                      appkey: params.row.appkey,
                      pid: params.row.pid,
                      nickname: params.row.nickname,
                      group: this.$store.getters.user.group,
                      assignMode: params.row.assign_mode || 'auto',
                      tags: params.row.tags
                    }
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
        name: '',
        transMode: 'normal',
        appkey: '',
        pid: '',
        nickname: '',
        group: this.$store.getters.user.group,
        tags: []
        // assignMode: 'auto'
      },
      editModal: false,
      editModel: {
        id: null,
        name: '',
        transMode: 'normal',
        appkey: '',
        pid: '',
        nickname: '',
        group: this.$store.getters.user.group,
        tags: []
        // assignMode: 'auto'
      },
      translinkModal: false,
      translinkModel: {
        transMode: 'normal',
        appkey: '',
        pid: '',
        nickname: '',
        group: this.$store.getters.user.group
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        appkey: [
          { validator: validateTransLinkAppKeyNew, trigger: 'blur' }
        ],
        pid: [
          { validator: validateTransLinkPidNew, trigger: 'blur' }
        ]
        // assignMode: [
        //   { required: true, message: '请选择派单模式', trigger: 'change' }
        // ]
      },
      ruleValidateEdit: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        appkey: [
          { validator: validateTransLinkAppKeyEdit, trigger: 'blur' }
        ],
        pid: [
          { validator: validateTransLinkPidEdit, trigger: 'blur' }
        ]
        // assignMode: [
        //   { required: true, message: '请选择派单模式', trigger: 'change' }
        // ]
      },
      ruleValidateTransLink: {
        appkey: [
          { validator: validateTransLinkAppKeyAll, trigger: 'blur' }
        ],
        pid: [
          { validator: validateTransLinkPidAll, trigger: 'blur' }
        ]
      },
      deleteModal: false,
      deleteModel: {
        id: null,
        name: ''
      },
      shopTagDic: ['男装', '女装', '男鞋', '女鞋', '内衣', '童装', '童鞋', '收纳整理', '宠物', '餐饮具', '家居饰品', '流行饰品', '家具', '园艺', '成人', '车品', '3C'],
      shopTagInOp: '' // 当前操作中的tag(增删改)
    }
  },
  created () {
    // 如果页面刷新，则emit到Layout组件获取最新session
    if (!this.$store.getters.session) {
      this.$emit('on-checkauth', this.$route.path)
    }
  },
  mounted () {
    if (this.$store.getters.user.role === 'god') {
      this.getShopSpecTagsDic().then(list => {
        this.shopTagDic = list.map((item) => {
          return item.tag
        })
      })
      this.columns.splice(3, 0, {
        title: '店群ID',
        key: 'group',
        sortable: true,
        searchable: true,
        render: (h, params) => {
          return h('span', {}, params.row.group)
        }
      })
      this.columns.splice(4, 0, {
        title: '分类标签',
        key: 'tags',
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
          let tagsH = []
          if (params.row.tags && params.row.tags instanceof Array) {
            params.row.tags.forEach((tag) => {
              tagsH.push(h('Tag', {
                props: {
                  type: 'border',
                  color: 'primary'
                }
              }, tag))
            })
          }
          return h('div', {}, tagsH)
        }
      })
      this.columns.splice(6, 2)
    }
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
    'dataViewPage': function (newVal) {
      if (this.$store.getters.user.role !== 'god') {
        this.updateShopAuthority()
      }
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
        apiService: 'shops',
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
    updateShopAuthority () {
      this.data.forEach(async (shop) => {
        if (!shop.trade_authorized || typeof shop.trade_authorized !== 'number' || new Date(shop.trade_authorized * 1000).getTime() <= new Date().getTime()) {
          await this.getAuthorityStatus(shop.name).then((shopSaved) => {
            this.$set(shop, 'trade_authorized', shopSaved.trade_authorized)
          }).catch(err => {
            console.log(err.message)
            this.$Message.error('授权信息获取失败！(' + err.message + ')')
          })
        }
      })
    },
    async getAuthorityStatus (shopNick) {
      this.apiItem = {
        apiHost: '',
        apiService: 'tao11',
        apiAction: 'getshopauthority',
        apiQuery: {}
      }
      this.apiData = {
        tb_nick: shopNick
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('授权信息获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    getAuthorityStatusTagText (s) {
      if (s && typeof s === 'number') {
        let authorityDue = new Date(s * 1000).Format('yyyy-MM-dd hh:mm:ss')
        if (new Date(s * 1000) > new Date().getTime()) {
          return '授权正常 ' + authorityDue
        } else {
          return '授权过期'
        }
      } else {
        return '未授权'
      }
    },
    getAuthorityStatusTagColor (s) {
      if (s && typeof s === 'number') {
        if (new Date(s * 1000) > new Date().getTime()) {
          return 'green'
        } else {
          return 'red'
        }
      } else {
        return 'default'
      }
    },
    syncShopModal () {
      this.$Modal.confirm({
        title: '同步店铺列表',
        content: '<p>确定同步店铺列表么？此操作可能会导致不可预估的错误。</p>',
        onOk: () => {
          this.syncShop()
        }
      })
    },
    syncShop () {
      this.apiItem = {
        apiHost: '',
        apiService: 'shops',
        apiAction: 'update',
        apiQuery: {}
      }
      this.apiData = {
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('店铺列表同步失败！(' + respBody.message + ')')
            reject(new Error('店铺列表同步失败！(' + respBody.message + ')'))
          } else {
            this.$Message.success('店铺列表同步成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    submitNew () {
      this.$refs['newForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'shops',
            apiAction: 'add',
            apiQuery: {}
          }
          this.apiData = {
            name: this.newModel.name,
            group: this.newModel.group,
            transMode: this.newModel.transMode,
            appkey: this.newModel.appkey,
            pid: this.newModel.pid,
            nickname: this.newModel.nickname,
            assign_mode: this.newModel.assignMode
          }
          if (this.$store.getters.user.role === 'god') {
            this.apiData.tags = this.editModel.tags
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('店铺新增失败！(' + respBody.message + ')')
                reject(new Error('店铺新增失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('店铺新增成功!')
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
    submitEdit () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'shops',
            apiAction: 'edit',
            apiQuery: {}
          }
          this.apiData = {
            id: this.editModel.id,
            name: this.editModel.name,
            group: this.editModel.group,
            transMode: this.editModel.transMode,
            appkey: this.editModel.appkey,
            pid: this.editModel.pid,
            nickname: this.editModel.nickname,
            assign_mode: this.editModel.assignMode
          }
          if (this.$store.getters.user.role === 'god') {
            this.apiData.tags = this.editModel.tags
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('修改失败！(' + respBody.message + ')')
                reject(new Error('修改失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('店铺修改成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.editModal = false
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
    submitTransLink () {
      this.$refs['translinkForm'].validate((valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'shops',
            apiAction: 'setallshoptranslink',
            apiQuery: {}
          }
          this.apiData = {
            group: this.translinkModel.group,
            transMode: this.translinkModel.transMode,
            appkey: this.translinkModel.appkey,
            pid: this.translinkModel.pid,
            nickname: this.translinkModel.nickname
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          return new Promise(async (resolve, reject) => {
            await this.$http.post(apiUrl, this.apiData).then(async (response) => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('转链设置失败！(' + respBody.message + ')')
                reject(new Error('转链设置失败！(' + respBody.message + ')'))
              } else {
                this.$Message.success('转链设置成功!')
                this.$store.dispatch('setAPILastResponse', respBody)
                this.translinkModal = false
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
        apiService: 'shops',
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
            this.$Message.error('删除失败！(' + respBody.message + ')')
            reject(new Error('删除失败！(' + respBody.message + ')'))
          } else {
            this.$Message.success('店铺删除成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.deleteModal = false
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    addNewTagSpec () {
      this.$Modal.confirm({
        title: '新增标签',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.shopTagInOp,
              autofocus: true,
              placeholder: '分类标签名称'
            },
            on: {
              input: (val) => {
                this.shopTagInOp = val
              }
            }
          })
        },
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.addShopSpecTagsDic(this.shopTagInOp).then(() => {
              this.shopTagDic.push(this.shopTagInOp)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    editTagSpec (tag) {
      this.shopTagInOp = tag
      this.$Modal.confirm({
        title: '修改标签',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.shopTagInOp,
              autofocus: true,
              placeholder: '分类标签名称'
            },
            on: {
              input: (val) => {
                this.shopTagInOp = val
              }
            }
          })
        },
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.editShopSpecTagsDic(tag, this.shopTagInOp).then(() => {
              this.shopTagDic.splice(this.shopTagDic.indexOf(tag), 1)
              this.shopTagDic.push(this.shopTagInOp)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    deleteTagSpec (tag) {
      this.shopTagInOp = tag
      this.$Modal.confirm({
        title: '删除标签',
        content: '确认删除标签\'' + tag + '\'么?',
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.deleteShopSpecTagsDic(tag).then(() => {
              this.shopTagDic.splice(this.shopTagDic.indexOf(tag), 1)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    async getShopSpecTagsDic () {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'listshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async addShopSpecTagsDic (tag) {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'addshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
        tag: tag
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async editShopSpecTagsDic (tag, tagNew) {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'editshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
        tag: tag,
        tag_new: tagNew
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async deleteShopSpecTagsDic (tag) {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'deleteshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
        tag: tag
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
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
