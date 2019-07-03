<template>
  <Layout class="layout">
    <Header>
      <Menu mode="horizontal" theme="dark" active-name="1" @on-select="switchMenu">
        <div class="layout-logo">
          <img src="../../static/logo.png">
          <div class="site-title">
            淘易易
            <span class="small">订单管理</span>
          </div>
        </div>
        <div class="layout-nav">
          <MenuItem name="1">
            <Icon type="ios-list-outline"></Icon>
            订单中心
          </MenuItem>
          <MenuItem name="2" id="logisHistoryTrigger">
            <Icon type="ios-navigate"></Icon>
            发货情况
            <div class="hover-box">
              <Form :label-width="120" inline>
                <FormItem label="发货跟踪状态">
                  <span :style="{color: autoTracerSwitch ? 'forestgreen' : 'grey', fontWeight: 800}">{{autoTracerSwitch ? '进行中' : '关闭'}}</span>
                </FormItem>
                <FormItem label="成功/总数">
                  <span style="color: forestgreen; font-weight: 800">{{logisticHistory.filter((item)=>{return item.result==='success'}).length}}</span>
                  /
                  <span>{{logisticHistory.length}}</span>
                  <Button type="text" icon="ios-trash-outline" @click="logisticHistory=[]"></Button>
                </FormItem>
              </Form>
              <Tabs value="logisticHisTab">
                <TabPane :label="logisticHisTabLabelSucceed" name="succeed"><div class="logis-history-console-box"><p v-for="(log, index) in logisticHistory.filter((item)=>{return item.result==='success'})" :key="index" @click.stop.prevent="logisDetailModal=true;logisDetail=log">{{log.tid + '\t' + log.logisNumber + '\t' + log.companyCode + '\t' + log.result + '\t' + new Date(log.captureTime).Format('hh:mm:ss') }}</p></div></TabPane>
                <TabPane :label="logisticHisTabLabelFailed" name="failed"><div class="logis-history-console-box"><p v-for="(log, index) in logisticHistory.filter((item)=>{return item.result==='fail'})" :key="index" @click.stop.prevent="logisDetailModal=true;logisDetail=log">{{log.tid + '\t' + log.logisNumber + '\t' + log.companyCode + '\t' + log.result + '\t' + new Date(log.captureTime).Format('hh:mm:ss') }}</p></div></TabPane>
              </Tabs>
              <Modal
                v-model="logisDetailModal"
                v-if="logisDetail"
                :title="logisDetail.oid + '订单物流信息'">
                <dl class="logis-detail-dl">
                  <dt>序号</dt>
                  <dd>{{logisDetail.id}}</dd>
                  <dt>状态</dt>
                  <dd>{{logisDetail.result}}</dd>
                  <dt>主订单编号</dt>
                  <dd>{{logisDetail.tid}}</dd>
                  <dt v-if="logisDetail.tid!==logisDetail.oid">子订单编号</dt>
                  <dd v-if="logisDetail.tid!==logisDetail.oid">{{logisDetail.oid}}</dd>
                  <dt>运单号</dt>
                  <dd>{{logisDetail.logisNumber}}</dd>
                  <dt>快递公司</dt>
                  <dd>{{logisDetail.companyCode}}</dd>
                  <dt>时间</dt>
                  <dd>{{new Date(logisDetail.captureTime).Format('yyyy-MM-dd hh:mm:ss')}}</dd>
                  <dt v-if="logisDetail.result==='fail'">失败原因</dt>
                  <dd v-if="logisDetail.result==='fail'">{{logisDetail.reason}}</dd>
                </dl>
              </Modal>
            </div>
          </MenuItem>
          <MenuItem name="3" id="myinfoTrigger">
            <Icon type="person"></Icon>
            我
            <div class="hover-box">
              <div class="hover-box-content-flex">
                <div class="hover-box-content-flex-1">
                  <dl>
                    <dt><Icon type="ios-barcode-outline"></Icon> 用户</dt>
                    <dd>{{$store.getters.user.tao11id}}</dd>
                    <dt><Icon type="ios-person-outline"></Icon> 姓名</dt>
                    <dd>{{$store.getters.user.name}}</dd>
                    <dt><Icon type="ios-unlocked-outline"></Icon> 角色</dt>
                    <dd>{{$store.getters.user.role}}</dd>
                    <dt><Icon type="ios-color-filter-outline"></Icon> 店群</dt>
                    <dd v-if="$store.getters.user.role==='god'">
                      <Input v-model="godGroup" size="small" style="width:50px;"></Input>
                      <Button type="ghost" size="small" @click="switchGroup">更改</Button>
                    </dd>
                    <dd v-else>
                      {{$store.getters.user.group}}
                    </dd>
                    <dt><Icon type="social-tumblr-outline"></Icon> 淘宝账号</dt>
                    <dd>{{currentTBNick}}</dd>
                  </dl>
                </div>
                <Button type="error" long size="large" icon="power" @click="$router.push({path: '/logout'})">登出</Button>
              </div>
            </div>
          </MenuItem>
        </div>
      </Menu>
    </Header>
    <Layout :style="{padding: '0 50px'}">
      <!-- <Breadcrumb :style="{margin: '16px 0'}">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>订单列表</BreadcrumbItem>
      </Breadcrumb> -->
      <div class="padding-top-20"></div>
      <Content id="main" :style="{padding: '24px 0', minHeight: '280px', display: 'flex', background: '#fff'}">
        <Layout :style="{position: 'relative', overflowY: 'auto'}">
          <Sider hide-trigger :style="{background: '#fff'}">
            <menu-left></menu-left>
          </Sider>
          <Content id="mainContent" :style="{padding: '0 24px', minHeight: '280px', background: '#fff'}">
            <router-view
              @on-addordermemo="listenAddOrderMemo"
              @on-addorderbuyermessage="listenAddOrderBuyerMessage"
              @on-checkauth="checkAuth"
              @on-autotracerswitch="onAutoTracerSwitch"
              @on-autotracerinterval="onAutoTracerInterval"
              @on-autotracermode="onAutoTracerMode"
              @on-get-addresslist="getAddressList201807"
              @on-insertnewaddress="insertNewAddress"
              @on-searchbytid="searchTradeByTid"
              @on-checkpricechange="checkPriceChange"
              :shopList="shopList"
              :orderFinished="orderFinished"
              :orderFailed="orderFailed"
              :addressList="addressList"
              :searchByTid="searchByTid"
              :logisUpdateItem="logisUpdateItem">
            </router-view>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Footer class="layout-footer-center">
      2011-2019 &copy; YSPN Studio &nbsp;&nbsp;当前版本：{{currentVersion?currentVersion.versionName:'未知'}}
      <Button type="ghost" size="small" @click="checkLatestVersion">检查更新</Button>
      <Button type="text" size="small" @click="showChangeLogs">更新日志</Button>
      <!-- <Button @click="x5Test">test</Button> -->
    </Footer>
  </Layout>
</template>

<script>
import menuLeft from './public/MenuLeft'
import common from '../../static/common'
import urlencode from '../../static/js/gbk'
import qs from 'qs'
import $ from 'jquery'
export default {
  name: 'layout',
  components: {
    menuLeft
  },
  data () {
    return {
      currentVersion: '',
      apiItem: {
        apiHost: '',
        apiService: 'zztAuth',
        apiAction: 'Login',
        apiQuery: {}
      },
      apiData: null,
      cookiesArr: [],
      buyerNick: '',
      orderFinished: null,
      orderFailed: null,
      logisticHisTab: 'succeed',
      logisticHisTabLabelSucceed: (h) => {
        let count = this.logisticHistory.filter((item) => {
          return item.result === 'success'
        }).length
        return h('div', [
          h('span', '成功' + (count ? '(' + count + ')' : ''))
        ])
      },
      logisticHisTabLabelFailed: (h) => {
        let count = this.logisticHistory.filter((item) => {
          return item.result === 'fail'
        }).length
        return h('div', [
          h('span', '失败' + (count ? '(' + count + ')' : ''))
        ])
      },
      logisUpdateItem: null,
      logisticHistory: [],
      logisDetailModal: false,
      logisDetail: null,
      autoTracerTask: null,
      autoTracerInterval: 10, // 十分钟开始一次物流查询遍历
      autoTracerSwitch: false,
      autoTracerMode: '模式1', // 发货追踪模式，模式1-淘宝物流消息，模式2-已买到宝贝
      logisticsCompanies: [{ 'code': 'HOAU', 'id': 1191, 'name': '天地华宇', 'reg_mail_no': '^[A-Za-z0-9]{8,9}$' }, { 'code': 'DTW', 'id': 512, 'name': '大田' }, { 'code': 'HTKY', 'id': 502, 'name': '百世快递', 'reg_mail_no': '^((A|B|D|E)[0-9]{12})$|^(BXA[0-9]{10})$|^(K8[0-9]{11})$|^(02[0-9]{11})$|^(000[0-9]{10})$|^(C0000[0-9]{8})$|^((21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|61|63)[0-9]{10})$|^((50|51)[0-9]{12})$|^7[0-9]{13}$|^6[0-9]{13}$|^58[0-9]{14}$' }, { 'code': 'YTO', 'id': 101, 'name': '圆通速递', 'reg_mail_no': '^[A-Za-z0-9]{2}[0-9]{10}$|^[A-Za-z0-9]{2}[0-9]{8}$|^(8)[0-9]{17}|^(9)[0-9]{17}$' }, { 'code': 'STO', 'id': 100, 'name': '申通快递', 'reg_mail_no': '^(268|888|588|688|368|468|568|668|768|868|968)[0-9]{9}$|^(11|22|40|268|888|588|688|368|468|568|668|768|868|968)[0-9]{10}$|^(STO)[0-9]{10}$|^(33)[0-9]{11}$|^(4)[0-9]{12}$|^(55)[0-9]{11}$|^(66)[0-9]{11}$|^(77)[0-9]{11}$|^(88)[0-9]{11}$|^(99)[0-9]{11}$' }, { 'code': 'SF', 'id': 505, 'name': '顺丰速运', 'reg_mail_no': '^[A-Za-z0-9-]{4,35}$' }, { 'code': 'EMS', 'id': 2, 'name': 'EMS', 'reg_mail_no': '^[A-Z]{2}[0-9]{9}[A-Z]{2}$|^(10|11)[0-9]{11}$|^(50|51)[0-9]{11}$|^(95|97)[0-9]{11}$' }, { 'code': 'ZJS', 'id': 103, 'name': '宅急送', 'reg_mail_no': '^[a-zA-Z0-9]{10}$|^(42|16)[0-9]{8}$|^A[0-9]{12}' }, { 'code': 'YUNDA', 'id': 102, 'name': '韵达快递', 'reg_mail_no': '^(10|11|12|13|14|15|16|17|19|18|50|55|58|80|88|66|31|77|39)[0-9]{11}$|^[0-9]{13}$' }, { 'code': 'ZTO', 'id': 500, 'name': '中通快递', 'reg_mail_no': '^((765|852|779|359|528|751|358|618|680|778|780|768|688|689|618|828|988|118|128|888|571|518|010|628|205|880|882|717|718|728|738|761|762|763|701|757|719|881|120)[0-9]{9})$|^((2008|2010|8050|7518)[0-9]{8})$|^((66|63|64|36|37|53|54|55|56|72)[0-9]{10})$|^((4)[0-9]{11})$' }, { 'code': 'POST', 'id': 1, 'name': '中国邮政' }, { 'code': 'OTHER', 'id': -1, 'name': '其他', 'reg_mail_no': '^[A-Za-z0-9-]{4,35}$' }, { 'code': 'AIR', 'id': 507, 'name': '亚风', 'reg_mail_no': '^[0-9]{11}$' }, { 'code': 'DISTRIBUTOR_1710055', 'id': 5000000178661, 'name': '邮政标准快递', 'reg_mail_no': '^(10)[0-9]{11}$|^(11)[0-9]{11}$' }, { 'code': 'MGSD', 'id': 21000007003, 'name': '美国速递' }, { 'code': 'BHWL', 'id': 21000053037, 'name': '保宏物流' }, { 'code': 'DISTRIBUTOR_13211725', 'id': 1216000000124268, 'name': '跨越速运' }, { 'code': 'UNIPS', 'id': 1237, 'name': '发网' }, { 'code': 'YUD', 'id': 513, 'name': '长发' }, { 'code': 'DISTRIBUTOR_13159132', 'id': 6000100034186, 'name': '菜鸟大件-日日顺配' }, { 'code': 'YC', 'id': 1139, 'name': '远长', 'reg_mail_no': '^96[0-9]{12}$' }, { 'code': 'DISTRIBUTOR_13148625', 'id': 6000100034229, 'name': '菜鸟大件-中铁配', 'reg_mail_no': '^\\d{15,}[-\\d]+$|^[0-9]{10}|[0-9]{12}$' }, { 'code': 'DISTRIBUTOR_13222803', 'id': 1216000000125358, 'name': '中通快运' }, { 'code': 'DFH', 'id': 1137, 'name': '东方汇', 'reg_mail_no': '^[0-9]{10}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}' }, { 'code': 'CYEXP', 'id': 511, 'name': '长宇' }, { 'code': 'WND', 'id': 21000127009, 'name': 'WnDirect' }, { 'code': 'GZLT', 'id': 200427, 'name': '飞远配送 ' }, { 'code': 'PKGJWL', 'id': 21000038002, 'name': '派易国际物流77' }, { 'code': 'BESTQJT', 'id': 105031, 'name': '百世快运' }, { 'code': 'NEDA', 'id': 1192, 'name': '能达速递', 'reg_mail_no': '^((88|)[0-9]{10})$|^((1|2|3|5|)[0-9]{9})$|^(90000[0-9]{7})$' }, { 'code': 'YCT', 'id': 1185, 'name': '黑猫宅急便', 'reg_mail_no': '^[0-9]{12}$' }, { 'code': 'SURE', 'id': 201174, 'name': '速尔', 'reg_mail_no': '^[0-9]{11}[0-9]{1}$' }, { 'code': 'DBL', 'id': 107, 'name': '德邦物流', 'reg_mail_no': '^[0-9]{8,10}$|^\\d{15,}[-\\d]+$' }, { 'code': 'UC', 'id': 1207, 'name': '优速快递', 'reg_mail_no': '^VIP[0-9]{9}|V[0-9]{11}|[0-9]{12}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}$|^(9001)[0-9]{8}$' }, { 'code': 'LTS', 'id': 1214, 'name': '联昊通', 'reg_mail_no': '^[0-9]{9,12}$' }, { 'code': 'ESB', 'id': 200740, 'name': 'E速宝', 'reg_mail_no': '[0-9a-zA-Z-]{5,20}' }, { 'code': 'GTO', 'id': 200143, 'name': '国通快递', 'reg_mail_no': '^(3(([0-6]|[8-9])\\d{8})|((2|4|5|6|7|8|9)\\d{9})|(1|2|3|4|5|6|7|8|9)\\d{11})$' }, { 'code': 'LB', 'id': 1195, 'name': '龙邦速递', 'reg_mail_no': '^[0-9]{12}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}$|^[0-9]{15}$|^[0-9]{15}-[1-9A-Z]{1}-[1-9A-Z]{1}$' }, { 'code': 'POSTB', 'id': 200734, 'name': '邮政快递包裹', 'reg_mail_no': '^([GA]|[KQ]|[PH]){2}[0-9]{9}([2-5][0-9]|[1][1-9]|[6][0-5])$|^[99]{2}[0-9]{11}$|^[96]{2}[0-9]{11}$|^[98]{2}[0-9]{11}$' }, { 'code': 'TTKDEX', 'id': 504, 'name': '天天快递', 'reg_mail_no': '^[0-9]{12}$' }, { 'code': 'HZABC', 'id': 1121, 'name': '飞远(爱彼西)配送', 'reg_mail_no': '^[0-9]{10,11}$|^T[0-9]{10}$|^FYPS[0-9]{12}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}$' }, { 'code': 'EYB', 'id': 3, 'name': 'EMS经济快递', 'reg_mail_no': '^[A-Z]{2}[0-9]{9}[A-Z]{2}$|^(10|11)[0-9]{11}$|^(50|51)[0-9]{11}$|^(95|97)[0-9]{11}$' }, { 'code': 'DBKD', 'id': 5000000110730, 'name': '德邦快递', 'reg_mail_no': '^[0-9]{8,10}$|^\\d{15,}[-\\d]+$' }, { 'code': 'CNEX', 'id': 1056, 'name': '佳吉快递', 'reg_mail_no': '^[7,1,9][0-9]{9}$' }, { 'code': 'QFKD', 'id': 1216, 'name': '全峰快递', 'reg_mail_no': '^[0-6|9][0-9]{11}$|^[7][0-8][0-9]{10}$|^[0-9]{15}$|^[S][0-9]{9,11}(-|)P[0-9]{1,2}$|^[0-9]{13}$|^[8][0,2-9][0,2-9][0-9]{9}$|^[8][1][0,2-9][0-9]{9}$|^[8][0,2-9][0-9]{10}$|^[8][1][1][0][8][9][0-9]{6}$' }, { 'code': 'GDEMS', 'id': 1269, 'name': '广东EMS', 'reg_mail_no': '^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$' }, { 'code': 'FEDEX', 'id': 106, 'name': '联邦快递', 'reg_mail_no': '^[0-9]{12}$' }, { 'code': 'QRT', 'id': 1208, 'name': '增益速递', 'reg_mail_no': '^[0-9]{12,13}$' }, { 'code': 'UAPEX', 'id': 1259, 'name': '全一快递', 'reg_mail_no': '^\\d{12}|\\d{11}$' }, { 'code': 'XB', 'id': 1186, 'name': '新邦物流', 'reg_mail_no': '[0-9]{8}' }, { 'code': 'BJRFD-001', 'id': 100034107, 'name': '如风达配送', 'reg_mail_no': '^[\\x21-\\x7e]{1,100}$' }, { 'code': 'XFWL', 'id': 202855, 'name': '信丰物流', 'reg_mail_no': '^130[0-9]{9}|13[7-9]{1}[0-9]{9}|18[8-9]{1}[0-9]{9}$' }, { 'code': 'FAST', 'id': 1204, 'name': '快捷快递', 'reg_mail_no': '^(?!440)(?!510)(?!520)(?!5231)([0-9]{9,13})$|^(P330[0-9]{8})$|^(D[0-9]{11})$|^(319)[0-9]{11}$|^(56)[0-9]{10}$|^(536)[0-9]{9}$' }, { 'code': 'SHQ', 'id': 108, 'name': '华强物流', 'reg_mail_no': '^[A-Za-z0-9]*[0|2|4|6|8]$' }, { 'code': 'BEST', 'id': 105, 'name': '百世物流', 'reg_mail_no': '^[0-9]{11,12}$' }],
      securityBlocked: false,
      unPostTrades: [],
      notificationId: null,
      shopList: [],
      buyerMessage: '',
      disputeData: null,
      disputes: [],
      disputePagination: null,
      disputeCommon: null,
      disputeSignature: null,
      disputeHierarchy: null,
      addressList: [],
      searchByTid: '',
      currentTBNick: '',
      checkTBConnectionTask: null,
      godGroup: 0,
      curLastMsgId: null // 本次发货查询最后一条消息的ID，将在全部完成后调用setbuyerlogismsgid
    }
  },
  watch: {
    'autoTracerSwitch': function (newVal) {
      if (newVal) {
        let that = this
        this.autoTracerTask = setInterval(function () {
          that.traceOrderOnce()
        }, this.autoTracerInterval * 60 * 1000)
        this.traceOrderOnce()
      } else {
        clearInterval(this.autoTracerTask)
      }
      this.$store.dispatch('setTraceLogisticsEnable', newVal)
    },
    'autoTracerInterval': function (newVal) {
      if (this.autoTracerSwitch) {
        let that = this
        clearInterval(this.autoTracerTask)
        this.autoTracerTask = setInterval(function () {
          that.traceOrderOnce()
        }, newVal * 60 * 1000)
        this.traceOrderOnce()
      }
      this.$store.dispatch('setTraceLogisticsInterval', newVal)
    },
    'autoTracerMode': function (newVal) {
      if (this.autoTracerSwitch) {
        let that = this
        clearInterval(this.autoTracerTask)
        this.autoTracerTask = setInterval(function () {
          that.traceOrderOnce()
        }, this.autoTracerInterval * 60 * 1000)
        this.traceOrderOnce()
      }
      this.$store.dispatch('setTraceLogisticsMode', newVal)
    },
    '$store.getters.orderInfo.buyerMessage': function (newVal) {
      this.buyerMessage = newVal
    }
  },
  async created () {
    await this.checkAuth().then(() => {
      this.godGroup = this.$store.getters.user.group
      this.getLocalUrl()
      if (this.$store.getters.sysIsExtension) {
        this.getTBCookies(() => {
          this.checkTaobaoConnection()
          this.checkTBConnectionTask = setInterval(() => {
            this.checkTaobaoConnection()
          }, 1000 * 60 * 5) // 每5分钟检查一次淘宝在线情况
          // this.getRefundList()
        })
        window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          this.listenGetCookies(request, sender, sendResponse)
          this.listenGetOrderInfo(request, sender, sendResponse)
          this.listenSetAddressAdded(request, sender, sendResponse)
          this.listenSetOrderBoughtTemp(request, sender, sendResponse)
          this.listenOrderedTest(request, sender, sendResponse) // TODO: TEST ONLY
          this.listenUCLogistic(request, sender, sendResponse)
          this.listenOneKeyOrderSuccess(request, sender, sendResponse) // 监听Alipay页面询问订单是否成功
          this.listenTransLink(request, sender, sendResponse)
          this.listenCheckBlackListShop(request, sender, sendResponse)
          this.listenGetHistoryPurchase(request, sender, sendResponse)
          this.listenGetUserRole(request, sender, sendResponse)
        })
        this.listenOrderSubmitted()
        // this.listenTBSendListRequest() // 监听修改获取淘宝买手号已发货列表请求
        this.listenModifyTaobaoBoughtItemsRequestHeaders()
        this.listenBuyerLogisMsgRequestHeaders()
        this.listenBoughtItemsTMDPunishRequestHeaders() // 调用滑动验证
        this.listenH5APITMDPunishRequestHeaders()
        this.listenH5APITMDVerifyRequestHeaders()
        this.listenAddressAPIRequestHeaders() // 监听地址相关H5API，增加Referer
        this.listenTransLinkDetailedHistoryRequestHeaders() // 监视Detail页面，记录页面地址
        this.autoTracerSwitch = this.$store.getters.user.tracelogisticsEnable
      }
      this.getLogisticCompanies()
      this.initShopList()
      // setInterval(() => {
      //   this.syncQueue()
      // }, 2000)
    }).catch(err => {
      console.log(err)
    })
  },
  async mounted () {
    await this.getCurrentVersion().then(() => {
      this.checkLatestVersion()
    })
  },
  computed: {
  },
  methods: {
    switchMenu (name) {
      let path = '/'
      switch (name) {
        case '1':
          path = '/trades'
          break
        case '2':
          path = null
          break
        case '3':
          path = null
          break
      }
      if (path) {
        this.$router.push({path: path})
      }
    },
    searchTradeByTid (tid) {
      this.searchByTid = tid
    },
    getLocalUrl () {
      let localUrl = window.chrome.extension ? window.chrome.extension.getURL('/') + 'controls.html' : 'http://localhost:8080/'
      this.$store.dispatch('setSysLocalUrl', localUrl)
      this.$store.dispatch('setSysIsExtension', window.chrome.extension || false)
      return localUrl
    },
    /**
     * 验证当前淘宝在线情况
     */
    checkTaobaoConnection () {
      let form = {
        pageNum: 1,
        pageSize: 10,
        auctionStatus: 'SEND',
        prePageNo: 1
      }
      // let form = {
      //   lastStartRow: null,
      //   options: 0,
      //   queryBizType: null,
      //   queryOrder: 'desc',
      //   tabCode: 'waitConfirm',
      //   pageNum: 1,
      //   pageSize: 10,
      //   // auctionStatus: 'SEND',
      //   orderStatus: 'SEND',
      //   prePageNo: 1
      // }
      let url = 'https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8'
      // url = 'https://www.easy-mock.com/mock/5ad70f9da675954fc238c33e/example/orders'
      this.$http.post(url, common.setQueryConfig(form))
        .then(response => {
          try {
            let result = response.data
            if (typeof result !== 'object') {
              this.currentTBNick = '未登录'
              // clearInterval(this.checkTBConnectionTask)
            } else {
              this.getTBCookies((cookiesArr) => {
                console.log(cookiesArr)
                this.uploadTBCookies(cookiesArr).then(() => {
                  this.downloadTBCookies(this.$store.getters.tbNick).then((res) => {
                    console.log(res)
                  })
                })
              })
              this.currentTBNick = this.$store.getters.tbNick
            }
          } catch (err) {
            this.currentTBNick = '未登录'
            // clearInterval(this.checkTBConnectionTask)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    listenTBSendListRequest () {
      window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        // console.log(details)
        let headers = details.requestHeaders
        headers.push({
          name: 'Referer',
          value: 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&tabCode=waitConfirm'
        })
        return {
          requestHeaders: headers
        }
      }, {urls: ['*://buyertrade.taobao.com/trade/itemlist/asyncBought.htm*']}, ['blocking', 'requestHeaders', 'extraHeaders']) // , 'extraHeaders', 'requestHeaders'
    },
    getTaobaoCookies (callback) {
      let arr = []
      window.chrome.cookies.getAll({}, (cookies) => {
        cookies.forEach((cookie, index) => {
          if (cookie.domain === '.taobao.com') {
            arr.push(cookie)
          }
        })
      })
      if (callback) {
        callback(arr)
      }
      console.log(arr)
      return arr
    },
    uploadTBCookies (cookiesArr) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'tao11',
          apiAction: 'writecookies',
          apiQuery: {}
        }
        this.apiData = {
          nick: this.$store.getters.tbNick,
          domain: '.taobao.com',
          cookies: cookiesArr,
          session: this.$store.getters.session
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            // console.log(response)
            resolve(respBody)
          }
        }).catch(err => {
          this.$Message.error('上传Cookies失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    downloadTBCookies (nick) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'tao11',
          apiAction: 'readcookies',
          apiQuery: {}
        }
        this.apiData = {
          nick: nick,
          domain: 'www.taobao.com',
          session: this.$store.getters.session
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            // console.log(response)
            console.log(respBody)
            resolve(respBody)
          }
        }).catch(err => {
          this.$Message.error('下载Cookies失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    listenLoggedIn () {
      window.chrome.webRequest.onBeforeRequest.addListener((details) => {
        let code = common.getQueryString('code', details.url)
        console.log(code)
        this.auth(code)
      }, {urls: [this.getLocalUrl() + '#/loggedin*']}, [])
    },
    async checkAuth (fromPath) {
      await this.renewToken().then(() => {
        this.$router.push({path: fromPath || '/today'})
      }).catch(err => {
        console.log(err)
      })
    },
    renewToken () {
      return new Promise((resolve, reject) => {
        if (!this.$store.getters.session) {
          this.apiItem = {
            apiHost: '',
            apiService: 'users',
            apiAction: 'renew', // this.$store.getters.token
            apiQuery: {}
          }
          this.apiData = {
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          this.$http.post(apiUrl, this.apiData).then(res => {
            if (res.data.status === 'ok') {
              this.$store.dispatch('setUserStore', res.data.data)
              resolve()
            } else {
              this.$Message.error('身份验证失败！(' + res.data.message + ')')
              reject(new Error('身份验证失败！(' + res.data.message + ')'))
            }
          }).catch(err => {
            console.log(err)
            this.$Message.error('身份验证失败，请重试。')
            reject(new Error('身份验证失败，请重试。'))
          })
        } else {
          this.$Message.error('身份验证失败，请重试。')
          reject(new Error('身份验证失败，请重试。'))
        }
      })
    },
    switchGroup () {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'switchgroup',
        apiQuery: {}
      }
      this.apiData = {
        group: parseInt(this.godGroup)
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.$http.post(apiUrl, this.apiData).then(response => {
        var respBody = response.data
        if (respBody.status === 'fail') {
          this.$Message.error(respBody.message)
        } else {
          this.$Message.error('修改成功!')
          window.location.reload()
        }
      }).catch(err => {
        this.$Message.error('获取商品转链失败！(' + err + ')')
      })
    },
    md5Encode (text) {
      let crypto = require('crypto')
      let md5 = crypto.createHash('md5')
      md5.update(text)
      var str = md5.digest('hex')
      return str.toLowerCase()
    },
    getTBCookies (callback) {
      window.chrome.cookies.getAll({}, (cookies) => {
        this.cookiesArr = []
        cookies.forEach((cookie, index) => {
          if (cookie.domain === '.taobao.com') {
            if (cookie.name === 'tracknick') {
              this.buyerNick = common.decodeUnicode(decodeURI(cookie.value)) // 记录当前登录淘宝账号昵称
            }
            this.cookiesArr.push(cookie)
          }
        })
        this.$store.dispatch('setTBCookies', this.cookiesArr)
        if (callback) {
          callback(this.cookiesArr)
        }
        // console.log(this.cookiesArr)
      })
    },
    listenGetCookies (request, sender, sendResponse) {
      if (request.cmd === 'get_cookies') {
        this.getTBCookies(() => {
          common.sendMessageToCurrentContentScript({ cmd: 'get_cookies_response', value: this.cookiesArr }, (response) => {
            if (response !== 'ok') {
              window.setTimeout(function () {
                common.sendMessageToCurrentContentScript({ cmd: 'get_cookies_response', value: this.cookiesArr })
              }, 2000)
            }
            console.log('返回Cookies：' + response)
          })
        })
        sendResponse('ok')
      }
    },
    listenGetUserRole (request, sender, sendResponse) {
      if (request.cmd === 'get_user_role') {
        common.sendMessageToCurrentContentScript({ cmd: 'get_user_role_response', value: this.$store.getters.user.role }, (response) => {
          if (response !== 'ok') {
            window.setTimeout(function () {
              common.sendMessageToCurrentContentScript({ cmd: 'get_user_role_response', value: this.$store.getters.user.role })
            }, 2000)
          }
          console.log('返回Cookies：' + response)
        })
        sendResponse('ok')
      }
    },
    listenGetOrderInfo (request, sender, sendResponse) {
      if (request.cmd === 'get_orderinfo') {
        sendResponse('ok')
        if (this.$store.getters.orderInfo.tradeid) {
          common.sendMessageToCurrentContentScript({ cmd: 'get_orderinfo_response', value: this.$store.getters.orderInfo }, (response) => {
            if (response !== 'ok') {
              window.setTimeout(function () {
                common.sendMessageToCurrentContentScript({ cmd: 'get_orderinfo_response', value: this.$store.getters.orderInfo })
              }, 2000)
            }
            console.log('返回orderinfo：' + response)
          })
        }
        sendResponse('ok')
      }
    },
    listenSetAddressAdded (request, sender, sendResponse) {
      if (request.cmd === 'set_addressadded') {
        if (request.value) {
          this.$store.dispatch('setOrderInfoAddressAdded', request.value)
          sendResponse('ok')
        } else {
          this.$Modal.error({
            title: '地址添加错误!',
            desc: ''
          })
          sendResponse('fail')
        }
      }
    },
    async listenTransLink (request, sender, sendResponse) {
      if (request.cmd === 'get_translink') {
        sendResponse('ok')
        await this.getShopTransLinkByURL(request.value, request.shopid).then((url) => {
          // console.log(url)
          common.sendMessageToCurrentContentScript({ cmd: 'get_translink_response', value: url })
        }).catch((err) => {
          console.log(err)
          common.sendMessageToCurrentContentScript({ cmd: 'get_translink_response', message: err.message })
        })
      }
    },
    getTransLinkByURL (url) {
      // console.log(url)
      let numiid = common.getQueryString('id', url)
      // console.log(numiid)
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'gettranslink',
          apiQuery: {}
        }
        this.apiData = {
          numiid: numiid
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl + '/?numiid=' + numiid
        this.$http.get(apiUrl).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            console.log(response)
            resolve(respBody.data.data.url)
          }
        }).catch(err => {
          this.$Message.error('获取商品转链失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    getShopTransLinkByURL (url, shopid) {
      let numiid = common.getQueryString('id', url)
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'getshoptranslink',
          apiQuery: {}
        }
        this.apiData = {
          numiid: numiid,
          shopid: shopid
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl + '/?numiid=' + numiid + '&shopid=' + shopid
        this.$http.get(apiUrl).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            console.log(respBody.data.data.url)
            resolve(respBody.data.data.url)
          }
        }).catch(err => {
          this.$Message.error('获取商品转链失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    // 获取历史下单
    listenGetHistoryPurchase (request, sender, sendResponse) {
      if (request.cmd === 'get_history_bought') {
        let numiid = request.value ? parseInt(request.value) : null
        this.getHistoryPurchase(numiid).then((list) => {
          common.sendMessageToCurrentContentScript({ cmd: 'get_history_bought_response', value: list }, (response) => {
            if (response !== 'ok') {
              window.setTimeout(function () {
                common.sendMessageToCurrentContentScript({ cmd: 'get_history_bought_response', value: list })
              }, 2000)
            }
            console.log('返回Cookies：' + response)
          })
          sendResponse('ok')
        }).catch((err) => {
          common.sendMessageToCurrentContentScript({ cmd: 'get_history_bought_response', err: err })
        })
      }
    },
    async getHistoryPurchase (numiid) {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades', // tao11, trades
        apiAction: 'gethistoryboughts', // hisbuy, gethistoryboughts
        apiQuery: {}
      }
      this.apiData = {
        numiid: numiid,
        session: this.$store.getters.session
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('历史下单获取失败！(' + respBody.message + ')')
            reject(new Error(respBody.message))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data) // respBody.data.all,respBody.data
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async listenCheckBlackListShop (request, sender, sendResponse) {
      if (request.cmd === 'check_blacklistshop') {
        sendResponse('ok')
        await this.checkBlackListShop(request.value).then((result) => {
          // console.log(result)
          common.sendMessageToCurrentContentScript({ cmd: 'check_blacklistshop_response', value: result })
        }).catch((err) => {
          console.log(err)
          common.sendMessageToCurrentContentScript({ cmd: 'check_blacklistshop_response', message: err.message })
        })
      }
    },
    checkBlackListShop (shopname) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'shops',
          apiAction: 'checkblacklist',
          apiQuery: {}
        }
        this.apiData = {
          name: shopname
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl + '/?name=' + shopname
        this.$http.get(apiUrl).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            // console.log(response)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$Message.error('查询店铺黑名单失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    listenOrderedTest (request, sender, sendResponse) {
      if (request.cmd === 'test_ordered') {
        this.orderFailed = null
        this.orderFinished = null
        let orderBought = this.$store.getters.orderBought
        // console.log(orderBought)
        if (!orderBought.tradeid || !orderBought.tid ||
            !orderBought.oid || !orderBought.buyer) {
          this.$Message.error('订单错误，请重新下单！')
          this.$store.dispatch('clearOrderInfo')
          this.$store.dispatch('clearOrderBought')
          this.orderFailed = orderBought
          sendResponse('fail')
        } else {
          orderBought.buyerTid = request.value
          orderBought.buyerOid = request.value
          this.$store.dispatch('setOrderBought', orderBought)
          this.orderFinished = orderBought
          // console.log(this.$store.getters.orderBought)
          sendResponse('ok')
        }
      }
    },
    getUnpostTrades () {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'listunpost', // this.$store.getters.token
          apiQuery: {}
        }
        this.apiData = {
          // status: 'WAIT_SELLER_SEND_GOODS',
          // order_status: {
          //   $in: ['PARTLY_ORDERED', 'ORDERED']
          // },
          limit$: 10000
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        // apiUrl = 'https://www.easy-mock.com/mock/5ad70f9da675954fc238c33e/example/trades' // MOCK
        this.$http.post(apiUrl, this.apiData).then(res => {
          if (res.data.status === 'ok') {
            resolve(res.data.data)
          } else {
            reject(new Error(res.data.message))
          }
        }).catch(err => {
          console.log(err)
          reject(new Error(err.message))
        })
      })
    },
    listenAddOrderMemo (tid, content) {
      if (!content || !tid) {
        this.$Message.error('传入参数错误')
      } else {
        this.addOrderMemo(tid, content).then(() => {
          this.$Message.success('更新订单备注成功！')
        }).catch(err => {
          this.$Modal.error({
            title: '更新订单备注失败',
            content: err.message
          })
        })
      }
    },
    addOrderMemo (orderId, content) {
      return new Promise((resolve, reject) => {
        try {
          window.chrome.cookies.getAll({}, (cookies) => {
            let cookiesArr = []
            cookies.forEach((cookie, index) => {
              if (cookie.domain === '.taobao.com') {
                cookiesArr.push(cookie)
              }
            })
            let _cookieTbToken = cookiesArr.filter(function (item) { return item.domain === '.taobao.com' && item.name === '_tb_token_' })[0]
            let _cookieUnb = cookiesArr.filter(function (item) { return item.domain === '.taobao.com' && item.name === 'unb' })[0]
            if (!_cookieTbToken || !_cookieUnb) {
              reject(new Error('淘宝账户登录失效，请先登录淘宝账户'))
              common.focusOrCreateTab('https://login.taobao.com/')
            } else {
              let randomInsertPosi = Math.ceil(Math.random() * content.length)
              content = content.substr(0, randomInsertPosi) + ' ' + content.substr(randomInsertPosi)
              var formData = {
                _tb_token_: _cookieTbToken.value,
                event_submit_do_query: '1',
                action: 'memo/UpdateBuyMemoAction',
                biz_order_id: orderId,
                buyer_id: decodeURI(_cookieUnb.value),
                memo: urlencode(content, 'gbk'),
                flag: this.$store.getters.defaultMemoFlag || 3
              }
              this.$http.post('https://trade.taobao.com/trade/memo/update_buy_memo.htm', common.setQueryConfig(formData))
                .then(suc => {
                  if (suc.request.responseURL.indexOf('login.taobao.com') > -1) {
                    reject(new Error('淘宝账户登录失效，请先登录淘宝账户'))
                    common.focusOrCreateTab(suc.request.responseURL)
                  } else {
                    resolve()
                  }
                })
                .catch(err => {
                  reject(err)
                })
            }
          })
        } catch (e) {
          reject(e)
        }
      })
    },
    /**
     * 原始订单备注
     */
    async setTradeMemo (tid, memo, flag) {
      this.apiItem = {
        apiHost: '',
        apiService: 'tao11',
        apiAction: 'setmemo',
        apiQuery: {}
      }
      this.apiData = {
        tid: tid,
        memo: memo,
        flag: flag || 0, // 备注颜色0-5,灰红黄绿蓝粉
        session: this.$store.getters.session
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('备注原始订单失败！(' + respBody.message + ')')
            reject(new Error(respBody.message))
          } else {
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    listenAddOrderBuyerMessage (tid) {
      if (!tid) {
        this.$Message.error('传入参数错误')
      } else {
        this.addOrderBuyerMessage(tid).then(() => {
          this.$Message.success('更新订单留言成功！')
        }).catch(err => {
          this.$Modal.error({
            title: '更新订单留言失败',
            content: err.message
          })
        })
      }
    },
    addOrderBuyerMessage (orderId) {
      return new Promise((resolve, reject) => {
        try {
          window.chrome.cookies.getAll({}, (cookies) => {
            let cookiesArr = []
            cookies.forEach((cookie, index) => {
              if (cookie.domain === '.taobao.com') {
                cookiesArr.push(cookie)
              }
            })
            let _cookieTbToken = cookiesArr.filter(function (item) { return item.domain === '.taobao.com' && item.name === '_tb_token_' })[0]
            let _cookieUnb = cookiesArr.filter(function (item) { return item.domain === '.taobao.com' && item.name === 'unb' })[0]
            if (!_cookieTbToken || !_cookieUnb) {
              reject(new Error('淘宝账户登录失效，请先登录淘宝账户'))
              common.focusOrCreateTab('https://login.taobao.com/')
            } else {
              let addMsg = this.$store.getters.defaultBuyerMessage || ''
              let msg = this.buyerMessage ? this.buyerMessage + ' ' : ''
              msg += addMsg
              var formData = {
                msg: encodeURIComponent(encodeURIComponent(msg))
              }
              this.$http.post('https://trade.taobao.com/trade/detail/add_message.do?bizOrderId=' + orderId + '&_tb_token_=' + _cookieTbToken.value, common.setQueryConfig(formData))
                .then(suc => {
                  if (suc.request.responseURL.indexOf('login.taobao.com') > -1) {
                    reject(new Error('淘宝账户登录失效，请先登录淘宝账户'))
                    common.focusOrCreateTab(suc.request.responseURL)
                  } else {
                    try {
                      let ret = JSON.parse(suc.data.trim().replace(/'/g, '"'))
                      // console.log(ret)
                      if (ret.status !== 'success') {
                        throw new Error(ret.desc)
                      } else {
                        resolve()
                      }
                    } catch (err) {
                      reject(err)
                    }
                  }
                })
                .catch(err => {
                  reject(err)
                })
            }
          })
        } catch (e) {
          reject(e)
        }
      })
    },
    /**
     * 选品信息暂存（订单确认页）
     */
    listenSetOrderBoughtTemp (request, sender, sendResponse) {
      if (request.cmd === 'set_orderbought_temp') {
        if (!request.value) {
          sendResponse('fail')
          common.sendMessageToCurrentContentScript({ cmd: 'orderbought_temp_succeed', value: false, text: '回传信息为空，请刷新页面，再试一次！' })
        } else {
          // console.log(request.value)
          if ((this.$store.getters.orderInfo.tradeid !== request.value.tradeid) ||
              (this.$store.getters.orderInfo.tid !== request.value.tid) ||
              (this.$store.getters.orderInfo.oid !== request.value.oid) ||
              (!this.$store.getters.orderInfo.numiid)) {
            this.$Message.error('订单不一致，请重新下单！')
            this.$store.dispatch('clearOrderInfo')
            this.$store.dispatch('clearOrderBought')
            common.sendMessageToCurrentContentScript({ cmd: 'orderbought_temp_succeed', value: false, text: '订单不一致，请重新下单！' })
            sendResponse('fail')
          } else {
            let orderBought = Object.assign(this.$store.getters.orderBought, request.value)
            orderBought.buyer = this.buyerNick
            orderBought.buyerTid = request.value
            orderBought.buyerOid = request.value
            let buyUrl = orderBought.buyUrl
            let querystring = buyUrl.indexOf('?') > -1 ? buyUrl.split('?')[1] : ''
            let qsObj = qs.parse(querystring)
            let numIid = qsObj.id
            // console.log(buyUrl, querystring, qsObj, numIid)
            window.chrome.storage.local.get('transLinkDetailedHistory', (store) => {
              let transLinkDetailedHistory = store.transLinkDetailedHistory || []
              let transHis = transLinkDetailedHistory.filter((his) => {
                return his.indexOf(numIid) > -1
              })
              if (transHis.length) {
                orderBought.buyUrl = transHis[transHis.length - 1]
              }
              // console.log(orderBought)
              this.$store.dispatch('setOrderBought', orderBought)
              common.sendMessageToCurrentContentScript({ cmd: 'orderbought_temp_succeed', value: true })
              sendResponse('ok')
            })
            // this.$store.dispatch('setOrderBought', orderBought)
          }
        }
      }
    },
    listenUCLogistic (request, sender, sendResponse) {
      if (request.cmd === 'uc_logistic_captured') {
        if (!request.value) {
          sendResponse('fail')
        } else {
          // console.log(request.value)
          sendResponse('ok')
        }
      }
    },
    listenOrderSubmitted () {
      window.chrome.webRequest.onCompleted.addListener((details) => {
        this.orderFinished = null
        this.orderFailed = null
        let orderNumber = ''
        for (var i = 0; i < details.responseHeaders.length; ++i) {
          if (details.responseHeaders[i].name === 'at_ctbid') {
            orderNumber = details.responseHeaders[i].value.split(',')[0]
            break
          }
        }
        if (!orderNumber) { // 没有获取到订单号，说明被风控
          console.log('订单号获取失败！可能是遇到风控！')
          // alert('订单号获取失败！请重新下单！')
          // this.$store.dispatch('clearOrderInfo')
          // this.$store.dispatch('clearOrderBought')
          // this.orderFailed = {}
        } else {
          console.log('order number:' + orderNumber)
          let orderBought = this.$store.getters.orderBought
          orderBought.buyerTid = orderNumber
          orderBought.buyerOid = orderNumber
          this.$store.dispatch('setOrderBought', orderBought)
          this.orderFinished = orderBought
          // let buyUrl = orderBought.buyUrl
          // let querystring = buyUrl.indexOf('?') > -1 ? buyUrl.split('?')[1] : ''
          // let qsObj = qs.parse(querystring)
          // let numIid = qsObj.id
          // window.chrome.storage.local.get('transLinkDetailedHistory', function (store) {
          //   let transLinkDetailedHistory = store.transLinkDetailedHistory || []
          //   let transHis = transLinkDetailedHistory.filter((his) => {
          //     return his.indexOf(numIid) > -1
          //   })
          //   if (transHis.length) {
          //     orderBought.buyUrl = transHis[transHis.length - 1]
          //   }
          //   this.$store.dispatch('setOrderBought', orderBought)
          //   this.orderFinished = orderBought
          //   window.chrome.storage.local.set({'transLinkDetailedHistory': []})
          // })
        }
        // '*://buy.taobao.com/auction/buy_now.jhtml*',
      }, {urls: ['*://buy.tmall.com/auction/confirm_order.htm*', '*://buy.taobao.com/auction/confirm_order.htm*', '*://buy.taobao.com/auction/confirmOrder.htm*']}, ['responseHeaders'])
    },
    listenOneKeyOrderSuccess (request, sender, sendResponse) {
      if (request.cmd === 'get_onekey_order_success') {
        sendResponse('ok')
        if (this.orderFinished && !this.orderFailed) {
          common.sendMessageToCurrentContentScript({ cmd: 'get_onekey_order_success_response', value: true })
        } else if (!this.orderFinished && this.orderFailed) {
          common.sendMessageToCurrentContentScript({ cmd: 'get_onekey_order_success_response', value: false })
        }
      }
    },
    getLogisticCompanies () {
      this.apiItem = {
        apiHost: '',
        apiService: 'tao11',
        apiAction: 'logiscompanies',
        apiQuery: {}
      }
      this.apiData = {
        session: this.$store.getters.session
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.$http.post(apiUrl, this.apiData).then(res => {
        if (res.data.status === 'ok') {
          this.logisticsCompanies = res.data.data
          this.$Message.success('更新物流公司列表成功！')
        } else {
          this.$Message.error('获取物流公司列表失败！')
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('获取物流公司列表失败！')
      })
    },
    getLogisticCompanyCode (name) {
      try {
        return this.logisticsCompanies.filter((c) => {
          return c.name.trim() === name.trim()
        })[0].code
      } catch (e) {
        console.log(e)
        return '未知'
      }
    },
    getLogisticDetail (url) {
      return new Promise(async (resolve, reject) => {
        // await common.sleepES6(500) // 间隔500毫秒
        console.log(url)
        this.$http.get(url).then((res) => {
          let securityIdentifier = '发现您的网络环境有异常，为保证正常使用，请验证'
          if (res.data.indexOf(securityIdentifier) >= 0) {
            if (!this.securityBlocked) {
              // 只开一个窗口
              window.open(url, '_blank')
              this.securityBlocked = true
              reject(new Error('SECURITY_BLOCKED'))
            }
          } else {
            let logis = $(res.data).find('.detail-panel .panel-order .info .order-row:first').children('span')
            var logistic = {
              logisNumber: $(logis[0]).text().trim(), // 快递单号
              companyCode: this.getLogisticCompanyCode($(logis[1]).text().trim())
            }
            resolve(logistic)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    logisticCaptured (logisTransaction) {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'finish',
        apiQuery: {}
      }
      this.apiData = {
        session: this.$store.getters.session,
        tradeid: logisTransaction.tradeid,
        tid: logisTransaction.tid,
        oid: logisTransaction.oid,
        logisNumber: logisTransaction.logisNumber,
        companyCode: logisTransaction.companyCode
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.$http.post(apiUrl, this.apiData).then(res => {
        if (res.data.status === 'ok') {
          this.$Message.success('发货成功！')
          this.$Notice.success({
            title: '发货成功！',
            desc: '订单[' + logisTransaction.tid + ']发货成功！'
          })
          logisTransaction.result = 'success'
          this.logisUpdateItem = logisTransaction
        } else {
          this.$Message.error('发货失败！' + res.data.message)
          logisTransaction.result = 'fail'
          logisTransaction.reason = res.data.message
        }
        this.logisticHistory.push(logisTransaction)
      }).catch(err => {
        console.log(err)
        this.$Message.error('发货失败！' + err.message)
        logisTransaction.result = 'fail'
        logisTransaction.reason = err.message
        this.logisticHistory.push(logisTransaction)
      })
    },
    searchTBSendOrders (pageSize, pageNum, tid) {
      return new Promise((resolve, reject) => {
        let form = {
          pageNum: pageNum,
          pageSize: pageSize,
          auctionStatus: 'SEND',
          prePageNo: pageNum === 1 ? 1 : pageNum - 1
        }
        // let form = {
        //   lastStartRow: null,
        //   options: 0,
        //   queryBizType: null,
        //   queryOrder: 'desc',
        //   tabCode: 'waitConfirm',
        //   pageNum: pageNum,
        //   pageSize: pageSize,
        //   // auctionStatus: 'SEND',
        //   orderStatus: 'SEND',
        //   prePageNo: pageNum === 1 ? 1 : pageNum - 1
        // }
        if (tid) {
          // tid不为空则为根据订单号查询
          form.auctionTitle = tid
          form.itemTitle = tid
          delete form.auctionStatus
        }
        let url = 'https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8'
        // url = 'https://www.easy-mock.com/mock/5ad70f9da675954fc238c33e/example/orders'
        this.$http.post(url, common.setQueryConfig(form))
          .then(response => {
            try {
              let result = response.data
              if (typeof result !== 'object') {
                throw new Error('TAOBAO_REDIRECT')
              } else if (result.url && result.url.indexOf('punish') > -1) {
                window.open(result.url)
                throw new Error('遇到风控!请打开淘宝已买到宝贝-待收货并切换页码直至出现滑动验证码并通过')
              } else if (result.url && result.url.indexOf('login') > -1) {
                throw new Error('淘宝账号登录过期')
              }
              resolve(result)
            } catch (err) {
              this.$Modal.error({
                title: 'Taobao发生错误',
                content: '检测到淘宝接口调用失败，可能需要重新登陆淘宝。' + err.message
              })
              reject(err)
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    listenModifyTaobaoBoughtItemsRequestHeaders () {
      window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        let headers = details.requestHeaders
        headers.push({
          name: 'Origin',
          value: 'http://buyertrade.taobao.com'
        })
        headers.push({
          name: 'Referer',
          value: 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm'
        })
        // headers.push({
        //   name: 'user-agent',
        //   value: 'zsea/fetch'
        // })
        return {
          requestHeaders: headers
        }
      }, {urls: ['*://buyertrade.taobao.com/trade/itemlist/asyncBought.htm*']},
      ['blocking', 'requestHeaders'])
    },
    listenBuyerLogisMsgRequestHeaders () {
      window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        let headers = details.requestHeaders
        headers.push({
          name: 'Referer',
          value: 'https://msg.taobao.com/message/list.htm?spm=0.0.0.0.yV296k&appId=1100111&page=1'
        })
        // headers.push({
        //   name: 'user-agent',
        //   value: 'zsea/fetch'
        // })
        return {
          requestHeaders: headers
        }
      }, {urls: ['*://msg.taobao.com/json/message_list_by_app.htm*']},
      ['blocking', 'requestHeaders']) // chrome 72+ 'extraHeaders'
    },
    listenBoughtItemsTMDPunishRequestHeaders () {
      window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        let headers = details.requestHeaders
        headers.push({
          name: 'Referer',
          value: 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm'
        })
        // headers.push({
        //   name: 'user-agent',
        //   value: 'zsea/fetch'
        // })
        return {
          requestHeaders: headers
        }
      }, {urls: ['*://buyertrade.taobao.com//trade/itemlist/asyncBought.htm*']},
      ['blocking', 'requestHeaders']) // chrome 72+ 'extraHeaders'
    },
    listenH5APITMDPunishRequestHeaders () {
      window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        let headers = details.requestHeaders
        headers.push({
          name: 'Referer',
          value: 'https://member1.taobao.com/member/fresh/deliver_address.htm'
        })
        // headers.push({
        //   name: 'user-agent',
        //   value: 'zsea/fetch'
        // })
        return {
          requestHeaders: headers
        }
      }, {urls: ['*://h5api.m.taobao.com:443//h5*_____tmd_____/punish*']},
      ['blocking', 'requestHeaders']) // chrome 72+ 'extraHeaders'
    },
    listenH5APITMDVerifyRequestHeaders () {
      window.chrome.webRequest.onCompleted.addListener((details) => {
        console.log('tmd verified!')
        common.closeTMDVerifyTab()
      }, {urls: ['*://h5api.m.taobao.com:443//h5*_____tmd_____/verify*']}, ['responseHeaders'])
    },
    onAutoTracerInterval (val) {
      this.autoTracerInterval = val
    },
    onAutoTracerMode (val) {
      this.autoTracerMode = val
    },
    onAutoTracerSwitch (val) {
      this.autoTracerSwitch = val
    },
    /**
     * 获取买手号最后一条物流消息ID
     * @param {String} [buyerNick] 买手旺旺
     */
    getBuyerLastLogisMsgId (buyerNick) {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'getlastlogismsgid',
        apiQuery: {}
      }
      this.apiData = {
        buyer_nick: buyerNick
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error(respBody.message))
          } else {
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    /**
     * 设置买手号最后一条物流消息ID
     * @param {String} [buyerNick] 买手旺旺
     * @param {Int} [msgId] 消息ID
     */
    setBuyerLastLogisMsgId (buyerNick, msgId) {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'setlastlogismsgid',
        apiQuery: {}
      }
      this.apiData = {
        buyer_nick: buyerNick,
        msg_id: msgId
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error(respBody.message))
          } else {
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    traceOrderOnce () {
      if (this.autoTracerMode === '模式1') {
        this.traceOrderOnceMode1()
      } else {
        this.traceOrderOnceMode2()
      }
    },
    async traceOrderOnceMode1 () {
      await this.getUnpostTrades().then(async (trades) => {
        this.unPostTrades = trades.datalist
      }).catch(err => {
        this.$Notice.error({
          title: '跟踪发货出错啦！',
          desc: err
        })
      })
      let lastMsgId = 0
      await this.getBuyerLastLogisMsgId(this.buyerNick).then((res) => {
        if (res.last_msg_id) {
          lastMsgId = res.last_msg_id ? res.last_msg_id : 0
        }
      }).catch((err) => {
        this.$Notice.error({
          title: '跟踪发货出错啦！',
          desc: '无法获取消息ID.' + err.message
        })
      })
      let mToken = this.cookiesArr.filter((item) => {
        return item.name === '_tb_token_'
      })[0].value.split('_')[0]
      // console.log(lastMsgId, mToken)
      this.curLastMsgId = null // 本次发货查询最后一条消息的ID，将在全部完成后调用setbuyerlogismsgid
      let curPage = 1
      await this.tracerBuyerLogisMsg(this.buyerNick, mToken, curPage, lastMsgId).then(() => {
        this.$Notice.success({
          title: '跟踪发货执行完毕！',
          desc: ''
        })
      }).catch(err => {
        console.log(err)
        this.$Notice.error({
          title: '跟踪发货出错啦！',
          desc: err.message
        })
      })
    },
    tracerBuyerLogisMsg (buyerNick, mToken, curPage, lastMsgId) {
      return new Promise(async (resolve, reject) => {
        await this.procBuyerLogisMsgs(mToken, curPage, lastMsgId).then(async (res) => {
          // console.log(res)
          if (this.curLastMsgId < res.curLastMsgId) {
            this.curLastMsgId = res.curLastMsgId
          }
          if (res.totalPage <= curPage) {
            resolve()
          } else {
            curPage++
            await this.tracerBuyerLogisMsg(buyerNick, mToken, curPage, lastMsgId)
          }
        }).catch(err => {
          console.log(err)
          if (err.message === 'EOF') {
            this.setBuyerLastLogisMsgId(buyerNick, this.curLastMsgId)
            resolve()
          } else {
            reject(err)
          }
        })
      })
    },
    procBuyerLogisMsgs (mToken, curPage, lastMsgId) {
      return new Promise(async (resolve, reject) => {
        if (!curPage) {
          curPage = 1
        }
        if (!mToken) {
          reject(new Error('参数错误'))
        }
        let totalPage = 0
        await this.getBuyerLogisMsgs(mToken, curPage).then((msg) => {
          // console.log(msg)
          if (msg && msg.totalNum) {
            totalPage = Math.ceil(msg.totalNum / 10)
            // console.log(totalPage, curPage)
            if (totalPage < curPage) {
              reject(new Error('EOF'))
            }
            let msgList = msg.msgList.filter((msgItem) => {
              // 首次执行只检查到6天前的消息
              if (!lastMsgId) {
                let acceptReg = /^刚刚|\d+分钟前|半小时前|\d+小时前|半天前|\d+天前$/ // /^刚刚|\d+分钟前|\d+小时前|半天前|\d+天前$/
                // console.log(acceptReg.test(msgItem.createTime), msgItem)
                if (!acceptReg.test(msgItem.createTime)) {
                  // console.log('eof', msgItem)
                  reject(new Error('EOF'))
                }
              }
              return msgItem.contentMsg.info.content === '卖家已经发货'
            })
            // console.log(msgList)
            if (!msgList.length) {
              resolve({
                totalPage: totalPage,
                curLastMsgId: null
              })
            }
            msgList.forEach(async (msgItem, idx) => {
              // console.log(idx)
              await this.procBuyerLogisMsgUnit(msgItem, lastMsgId).catch(err => {
                if (err.message === 'EOF') {
                  reject(new Error('EOF'))
                }
              })
              if (idx >= msgList.length - 1) {
                resolve({
                  totalPage: totalPage,
                  curLastMsgId: msgList[0].messageId
                })
              }
            })
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 处理淘宝物流消息单元
     * @param {Object} msg 消息对象
     * @param {Int} lastMsgId 数据库存储的最后一条消息id
     */
    procBuyerLogisMsgUnit (msg, lastMsgId) {
      // console.log(lastMsgId)
      return new Promise(async (resolve, reject) => {
        if (!msg || typeof msg !== 'object' || !lastMsgId) {
          reject(new Error('参数错误'))
        } else if (msg.messageId <= lastMsgId) {
          reject(new Error('EOF'))
        }
        let orderNumber = common.getQueryString('trade_id', msg.actionUrl)
        let sellerId = common.getQueryString('seller_id', msg.actionUrl)
        // console.log(orderNumber, sellerId)
        let hit = this.unPostTrades.filter((trade) => {
          return trade.ordered.filter((ordered) => {
            return ordered.order_number === orderNumber
          }).length > 0
        })
        if (hit && hit.length) {
          let oid = hit[0].ordered.filter((ordered) => {
            return ordered.order_number === orderNumber
          })[0].oid_str
          this.$Notice.info({
            title: '发现订单已发货',
            desc: '匹配订单！' + hit[0].tid_str + ':' + orderNumber
          })
          let logisticUrl = 'https://detail.i56.taobao.com/trace/trace_detail.htm?tId=' + orderNumber + '&userId=' + sellerId
          await this.getLogisticDetail(logisticUrl)
            .then(async (logistic) => {
              let logisTransaction = {
                // id: this.logisticHistory ? this.logisticHistory.length + 1 : 1,
                tradeid: hit[0].id,
                tid: hit[0].tid_str,
                oid: oid,
                logisNumber: logistic.logisNumber,
                companyCode: logistic.companyCode,
                captureTime: new Date().getTime()
              }
              if (logistic.logisNumber) {
                // console.log(logisTransaction)
                await this.logisticCaptured(logisTransaction)
                resolve()
              }
            })
            .catch(err => {
              reject(err)
            })
        } else {
          resolve()
        }
      })
    },
    /**
     * 爬取淘宝物流消息
     */
    getBuyerLogisMsgs (mToken, page) {
      return new Promise((resolve, reject) => {
        if (!page) {
          page = 1
        }
        let url = `https://msg.taobao.com/json/message_list_by_app.htm?appId=1100111&page=${page}&m_token=${mToken}&_input_charset=utf-8&callback=&t=${Date.now()}`
        this.$http.get(url)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async traceOrderOnceMode2 () {
      await this.getUnpostTrades().then(async (trades) => {
        this.unPostTrades = trades.datalist
      }).catch(err => {
        this.$Notice.error({
          title: '跟踪发货出错啦！',
          desc: err
        })
      })
      await this.searchTBSendOrders(100, 1).then(async (orders) => {
        this.autoTracer(orders, this.unPostTrades).then(() => {
          this.$Notice.success({
            title: '跟踪发货执行完毕！',
            desc: ''
          })
        }).catch(err => {
          this.$Notice.error({
            title: '跟踪发货出错啦！(淘宝端)',
            desc: err
          })
        })
      }).catch(err => {
        this.$Notice.error({
          title: '跟踪发货出错啦！(淘宝端)',
          desc: err
        })
      })
    },
    autoTracer (initBatchOrders, trades) {
      let that = this
      return new Promise(async (resolve, reject) => {
        let totalOrderNum = initBatchOrders.page.totalNumber
        let pageSize = initBatchOrders.page.pageSize
        let pageTotal = initBatchOrders.page.totalPage
        let timeSpan = 0.5 * 60 * 1000 // 分批轮询间隔时间(ms)
        let startTime = new Date().getTime()
        this.autoTracerProcessor(initBatchOrders, trades).then(res => {
          console.log((res.endTime - startTime) / 1000 + 'ms')
        }).catch(err => {
          reject(err)
        })
        console.log('totalOrderNum:' + totalOrderNum + ',pageSize:' + pageSize + ',pageTotal:' + pageTotal)
        if (totalOrderNum <= pageSize) {
          resolve()
        } else if (totalOrderNum > pageSize && totalOrderNum <= 5 * pageSize) { // 500个订单以内
          timeSpan = 0.5 * 60 * 1000 // 半分钟
          let i = 2
          let tracerMicroTask = setInterval(async function () {
            await that.searchTBSendOrders(pageSize, i).then(async (batchOrders) => {
              i++
              if (i > pageTotal) {
                clearInterval(tracerMicroTask)
                resolve()
              }
              await that.autoTracerProcessor(batchOrders, trades).catch(err => {
                clearInterval(tracerMicroTask)
                reject(err)
              })
            })
          }, timeSpan)
        } else if (totalOrderNum > 5 * pageSize && totalOrderNum <= 10 * pageSize) { // 501-1000订单
          timeSpan = 1.5 * 60 * 1000 // 1.5分钟
          let i = 2
          let tracerMicroTask = setInterval(async function () {
            await that.searchTBSendOrders(pageSize, i).then(async (batchOrders) => {
              i++
              if (i > pageTotal) {
                clearInterval(tracerMicroTask)
                resolve()
              }
              await that.autoTracerProcessor(batchOrders, trades).catch(err => {
                clearInterval(tracerMicroTask)
                reject(err)
              })
            })
          }, timeSpan)
        } else if (totalOrderNum > 10 * pageSize && totalOrderNum <= 20 * pageSize) { // 1001-2000订单
          timeSpan = 1 * 60 * 1000 // 1分钟
          let i = 2
          let tracerMicroTask = setInterval(async function () {
            await that.searchTBSendOrders(pageSize, i).then(async (batchOrders) => {
              i++
              if (i > pageTotal) {
                clearInterval(tracerMicroTask)
                resolve()
              }
              that.autoTracerProcessor(batchOrders, trades).catch(err => {
                clearInterval(tracerMicroTask)
                reject(err)
              })
            })
          }, timeSpan)
        } else {
          timeSpan = Math.floor(19 * 60 * 1000 / pageTotal) // 19分钟内平均分布
          let i = 2
          let tracerMicroTask = setInterval(async function () {
            await that.searchTBSendOrders(pageSize, i).then(async (batchOrders) => {
              i++
              if (i > pageTotal) {
                clearInterval(tracerMicroTask)
                resolve()
              }
              await that.autoTracerProcessor(batchOrders, trades).catch(err => {
                clearInterval(tracerMicroTask)
                reject(err)
              })
            })
          }, timeSpan)
        }
      })
    },
    async autoTracerProcessor (orders, trades) {
      return new Promise(async (resolve, reject) => {
        if (orders.mainOrders) {
          try {
            for (let i = 0; i < orders.mainOrders.length; i++) {
              let tbOrderNumber = orders.mainOrders[i].id
              // 轮询待发货订单
              for (let j = 0; j < trades.length;) {
                let orderedList = trades[j].ordered.filter((item) => {
                  return !item.dismiss
                }) // 一键下单的orderNumber
                let tradeid = trades[j].id
                let originalOrderNumber = trades[j].tid_str
                if (orderedList.length) {
                  // 检索ordered列表，按order_number进行关键字匹配
                  let hit = orderedList.filter((item) => {
                    return item.order_number === tbOrderNumber
                  })
                  if (hit.length) {
                    let oid = hit[0].oid_str // 子订单oid
                    // 检测是否改价
                    let boughtPrice = hit[0].buyer_fee
                    let boughtPostFee = hit[0].post_fee
                    let actualFee = orders.mainOrders[i].payInfo.actualFee
                    let oldActualFee = orders.mainOrders[i].payInfo.oldActualFee
                    if (oldActualFee) {
                      // 已改价
                      actualFee = parseFloat(actualFee) * 100
                      let actualPostFee = parseFloat(orders.mainOrders[i].payInfo.postFees[0].value.replace(/￥/g, '')) * 100
                      this.$Notice.info({
                        title: '发现订单改价',
                        desc: '订单' + originalOrderNumber + ' 原价:' + boughtPrice / 100 + '(邮费:' + boughtPostFee + ') 改为:' + actualFee / 100 + '(邮费: ' + actualPostFee + ')'
                      })
                      this.changePrice(tradeid, tbOrderNumber, actualFee, actualPostFee)
                    }
                    this.$Notice.info({
                      title: '发现订单已发货',
                      desc: '匹配订单！' + originalOrderNumber + ':' + tbOrderNumber
                    })
                    let sellerId = orders.mainOrders[i].seller.id
                    let logisticUrl = 'https://detail.i56.taobao.com/trace/trace_detail.htm?tId=' + tbOrderNumber + '&userId=' + sellerId
                    await this.getLogisticDetail(logisticUrl)
                      .then(async (logistic) => {
                        let logisTransaction = {
                          // id: this.logisticHistory ? this.logisticHistory.length + 1 : 1,
                          tradeid: tradeid,
                          tid: originalOrderNumber,
                          oid: oid,
                          logisNumber: logistic.logisNumber,
                          companyCode: logistic.companyCode,
                          captureTime: new Date().getTime()
                        }
                        if (logistic.logisNumber) {
                          // console.log(logisTransaction)
                          await this.logisticCaptured(logisTransaction)
                        }
                      })
                      .catch(err => {
                        throw err
                      })
                    // await this.logisticCaptured({
                    //   id: this.logisticHistory ? this.logisticHistory.length + 1 : 1,
                    //   tradeid: tradeid,
                    //   tid: originalOrderNumber,
                    //   oid: oid,
                    //   logisNumber: '348979200',
                    //   companyCode: 'YUNDA',
                    //   captureTime: new Date().getTime()
                    // })
                  }
                }
                j++
                if (i === orders.mainOrders.length - 1) {
                  resolve({
                    endTime: new Date().getTime()
                  })
                }
              }
            }
          } catch (err) {
            reject(err)
          }
        } else {
          resolve()
        }
      })
    },
    /**
     * 主动查询订单是否改价
     */
    checkPriceChange (tradeId, orderNumber) {
      return new Promise(async (resolve, reject) => {
        if (tradeId && orderNumber) {
          await this.searchTBSendOrders(15, 1, orderNumber).then(async (batchOrders) => {
            if (batchOrders && batchOrders.mainOrders.length) {
              let order = batchOrders.mainOrders[0]
              // 检测是否改价
              let actualFee = order.payInfo.actualFee
              let oldActualFee = order.payInfo.oldActualFee
              if (oldActualFee) {
                // 已改价
                actualFee = parseFloat(actualFee) * 100
                let actualPostFee = parseFloat(order.payInfo.postFees[0].value.replace(/￥/g, '')) * 100
                this.$Notice.info({
                  title: '发现订单改价',
                  desc: '订单' + orderNumber + ' 改为:' + actualFee / 100 + '(邮费: ' + actualPostFee + ')'
                })
                this.changePrice(tradeId, orderNumber, actualFee, actualPostFee)
              }
            } else {
              resolve()
            }
          })
        } else {
          reject(new Error('参数错误'))
        }
      })
    },
    /**
     * 改价
     * @param {String} [tradeId] 订单ID（Mongo）
     * @param {String} [orderNumber] 下单单号
     * @param {Number} [actualFee] 改后总价
     * @param {Number} [actualPostFee] 改后运费
     */
    changePrice (tradeId, orderNumber, actualFee, actualPostFee) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'updateprice',
          apiQuery: {}
        }
        this.apiData = {
          tradeid: tradeId,
          ordernumber: orderNumber,
          actualfee: actualFee,
          actualpostfee: actualPostFee
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            console.log(response)
            resolve()
          }
        }).catch(err => {
          this.$Message.error('更新下单价格失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    initShopList () {
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
            this.$Message.success('店铺列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.shopList = respBody.data
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    getRefundList () {
      let url = 'https://refund2.tmall.com/dispute/buyerDisputeList.htm?type=1&disputeType=1'
      // url = 'https://www.easy-mock.com/mock/5ad70f9da675954fc238c33e/example/orders'
      this.$http.get(url)
        .then(response => {
          let page = 1
          let regx = response.data.match(/var disputeData.*/)
          if (regx) {
            let disputeData = JSON.parse(regx[0].substring(18, regx[0].length - 1))
            // console.log(disputeData)
            this.disputeHierarchy = disputeData.hierarchy
            this.procDisputeData(disputeData, page).then(async () => {
              page = parseInt(this.disputePagination.defaultCurrent)
              let pageSize = parseInt(this.disputePagination.defaultPageSize)
              let total = parseInt(this.disputePagination.total)
              let totalPages = Math.ceil(total / pageSize)
              for (page; page < totalPages;) {
                await (async () => {
                  return new Promise(async (resolve, reject) => {
                    // await sleepES6(500)
                    await this.getRefundPages(page + 1)
                      .then(async (disp) => {
                        await this.procDisputeData(disp, page + 1).then(() => {
                          resolve()
                        })
                      })
                      .catch(err => {
                        console.log(err)
                        reject(err)
                      })
                  })
                })(page).then(() => {
                  page++
                }).catch(err => {
                  console.log(err)
                  page++
                })
              }
            })
            console.log(disputeData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getRefundPages (page) {
      return new Promise((resolve, reject) => {
        let url = 'https://refund2.tmall.com/dispute/adjust/adjustBuyerList.json'
        this.disputeData.data.listPagination_1.fields.defaultCurrent = page.toString()
        let postData = {
          operator: 'listPagination_1',
          data: this.disputeData.data,
          linkage: {
            common: {
              compress: this.disputeCommon.compress,
              queryParams: this.disputeCommon.queryParams,
              validateParams: this.disputeCommon.validateParams
            },
            signature: this.disputeSignature
          },
          hierarchy: this.disputeHierarchy
        }
        this.$http.post(url, qs.stringify({
          data: JSON.stringify(postData)
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then(response => {
            if (response.data.success) {
              let disputeData = response.data.resultData
              // console.log(disputeData)
              resolve(disputeData)
            } else {
              reject(new Error('NETWORK_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    /**
     * 获取退款列表
     */
    procDisputeData (disputeData, page) {
      return new Promise((resolve, reject) => {
        this.disputeData = disputeData
        let pagination = disputeData.data.listPagination_1.fields
        this.disputePagination = pagination
        let gridItems = disputeData.linkage.input
        gridItems.forEach((name) => {
          if (name.indexOf('ListGrid') > -1) {
            let dispute = disputeData.data[name]
            let id = dispute.id.split('@')[0]
            let exist = this.disputes.filter((item) => {
              return item.id === 'page' + page + '_' + id
            })[0]
            if (dispute.bizName === 'disputeHeader') {
              if (exist && !exist.orderNumber) {
                exist.orderNumber = dispute.fields.numbers[0].value
                exist.disputeNumber = dispute.fields.numbers[1].value
              } else if (!exist) {
                this.disputes.push({
                  id: 'page' + page + '_' + id,
                  orderNumber: dispute.fields.numbers[0].value,
                  disputeNumber: dispute.fields.numbers[1].value
                })
              }
            } else if (dispute.bizName === 'disputeBody') {
              if (exist && !exist.type) {
                exist.amount = dispute.fields.options[0].title.name
                exist.time = dispute.fields.options[1].title.name
                exist.type = dispute.fields.options[2].title.name
                exist.status = dispute.fields.options[3].title.name.indexOf('<br/>') > -1 ? dispute.fields.options[3].title.name.split('<br/>')[0] : ''
                exist.detailUrl = dispute.fields.options[4].title.linkUrl
              } else if (!exist) {
                this.disputes.push({
                  id: 'page' + page + '_' + id,
                  amount: dispute.fields.options[0].title.name,
                  time: dispute.fields.options[1].title.name,
                  type: dispute.fields.options[2].title.name,
                  status: dispute.fields.options[3].title.name.indexOf('<br/>') > -1 ? dispute.fields.options[3].title.name.split('<br/>')[0] : '',
                  detailUrl: dispute.fields.options[4].title.linkUrl
                })
              }
            }
          }
        })
        this.disputeCommon = disputeData.linkage.common
        this.disputeSignature = disputeData.linkage.signature
        // console.log(this.disputes)
        // console.log(this.disputePagination)
        resolve()
      })
    },
    /**
     * 监听地址类h5api请求，增加header referer（2018年7月版本）
     */
    listenAddressAPIRequestHeaders () {
      window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        let headers = details.requestHeaders
        // headers.push({
        //   name: 'Origin',
        //   value: 'http://buyertrade.taobao.com'
        // })
        // let accept = headers.filter((item) => {
        //   return item.name === 'Accept'
        // })
        // accept[0].value = '*/*'
        headers.push({
          name: 'Referer',
          value: 'https://member1.taobao.com/member/fresh/deliver_address.htm'
        })
        // headers.push({
        //   name: 'user-agent',
        //   value: 'zsea/fetch'
        // })
        // let cookies = headers.filter((item) => {
        //   return item.name === 'Cookie'
        // })
        // cookies[0].value += '; WAPFDFDTGFG=%2B4cMKKP%2B8PI%2BJV9eSpzXb7SSXQ%3D%3D; _w_app_lg=19'
        // console.log(headers)
        return {
          requestHeaders: headers
        }
      }, {urls: ['*://h5api.m.taobao.com/*']},
      ['blocking', 'requestHeaders'])
    },
    /**
     * 获取地址列表（2018年7月版本）
     */
    async getAddressList201807 () {
      return new Promise((resolve, reject) => {
        if (!this.cookiesArr || !this.cookiesArr.length) {
          this.getTBCookies()
        }
        let m5Token = this.cookiesArr.filter((item) => {
          return item.name === '_m_h5_tk'
        })[0].value.split('_')[0]
        let i = new Date().getTime()
        let appKey = '12574478'
        let data = '{}' // {"sn":"suibianchuan"}
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + data)
        let url = 'https://h5api.m.taobao.com/h5/mtop.taobao.mbis.getdeliveraddrlist/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.getDeliverAddrList&v=1.0&ecode=1&needLogin=true&dataType=jsonp&type=jsonp&callback=mtopjsonp3&data=%7B%7D'
        this.$http.get(url)
          .then(response => {
            let data = response.data.trim()
            let json = JSON.parse(data.substring(11, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              let jsonData = json.data
              if (jsonData.success === 'true') {
                try {
                  this.addressList = JSON.parse(jsonData.returnValue)
                  console.log(this.addressList)
                  resolve(this.addressList)
                } catch (err) {
                  reject(err)
                }
              } else {
                reject(new Error('API_RESPONSE_ERROR'))
              }
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
                // window.open(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    /**
     * 验证待新增地址，取得地理信息（2018年7月版本）
     */
    async validateNewAddress201807 (address) {
      return new Promise((resolve, reject) => {
        let m5Token = this.cookiesArr.filter((item) => {
          return item.name === '_m_h5_tk'
        })[0].value.split('_')[0]
        let i = new Date().getTime()
        let appKey = '12574478'
        let data = {
          'sn': 'suibianchuan',
          'prov': address.provName,
          'provId': address.prov,
          'city': address.cityName,
          'cityId': address.city,
          'district': address.areaName,
          'districtId': address.area || address.areaName,
          'town': address.townName,
          'townId': address.town || address.townName,
          'addressDetail': address.addressDetail
        }
        let dataStr = JSON.stringify(data)
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.cainiao.address.ua.china.address.validate/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.cainiao.address.ua.china.address.validate&v=1.0&dataType=jsonp&type=jsonp&callback=mtopjsonp17&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            let data = response.data.trim()
            let json = JSON.parse(data.substring(12, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              if (!json.data.divisionParse.townId) {
                reject(new Error('买家地址不完整'))
              }
              let jsonData = {
                'divisionCode': json.data.divisionParse.townId,
                'townDivisionCode': json.data.divisionParse.townId,
                'addressDetail': address.addressDetail,
                // 'longitude': json.data.gc.lng,
                // 'latitude': json.data.gc.lat,
                'postCode': address.post === '000000' ? '' : address.post,
                'overseaAddress': false,
                'fullName': address.fullName,
                'mobileCode': 86,
                'mobile': address.mobile,
                'phoneInternationalCode': 86,
                'phoneAreaCode': address.phoneSection,
                'phoneNumber': address.phoneCode,
                'phoneExtension': address.phoneExt,
                'defaultDeliverAddress': true
              }
              resolve(jsonData)
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    /**
     * 获取街道/乡镇列表
     * pid:第三级地址编码
     */
    async getAddressTownList201906 (pid) {
      return new Promise((resolve, reject) => {
        let m5Token = this.cookiesArr.filter((item) => {
          return item.name === '_m_h5_tk'
        })[0].value.split('_')[0]
        let i = new Date().getTime()
        let appKey = '12574478'
        let data = {
          'sn': 'suibianchuan',
          'pid': pid
        }
        let dataStr = JSON.stringify(data)
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.cainiao.address.ua.china.town.list/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.cainiao.address.ua.china.town.list&v=1.0&dataType=jsonp&type=jsonp&callback=mtopjsonp5&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            let data = response.data.trim()
            let json = JSON.parse(data.substring(11, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              resolve(json.data.divisions)
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              // reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
              resolve()
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    /**
     * 新增地址操作函数（2018年7月版本）
     */
    async insertNewAddress201807 (address) {
      return new Promise(async (resolve, reject) => {
        let validAddress = {}
        await this.validateNewAddress201807(address).then((addr) => {
          validAddress = addr
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
        let m5Token = null
        try {
          m5Token = this.cookiesArr.filter((item) => {
            return item.name === '_m_h5_tk'
          })[0].value.split('_')[0]
        } catch (e) {
          reject(new Error('TAOBAO_TOKEN_EXOIRED'))
        }
        let i = new Date().getTime()
        let appKey = '12574478'
        // console.log(data)
        let dataStr = JSON.stringify({
          'divisionCode': validAddress.divisionCode || address.town || '',
          'townDivisionCode': validAddress.townDivisionCode || address.town || '',
          'addressDetail': address.addressDetail,
          'postCode': address.post ? address.post : '000000',
          'overseaAddress': false,
          'fullName': address.fullName,
          'mobileCode': 86,
          'mobile': address.mobile,
          'phoneInternationalCode': 86,
          'phoneAreaCode': address.phoneSection,
          'phoneNumber': address.phoneCode,
          'phoneExtension': address.phoneExt,
          'defaultDeliverAddress': true
        })
        // console.log(dataStr)
        // let dataStr = '{"divisionCode":"410105011","townDivisionCode":"410105011","addressDetail":"阳光新城19号楼9楼026","longitude":"113.704274","latitude":"34.797823","postCode":"","overseaAddress":false,"fullName":"杨硕","mobileCode":86,"mobile":"18625587270","phoneInternationalCode":86,"phoneAreaCode":"","phoneNumber":"","phoneExtension":"","defaultDeliverAddress":true}' // {"sn":"suibianchuan"}
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.taobao.mbis.insertdeliveraddress/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.insertDeliverAddress&v=1.0&ecode=1&needLogin=true&timeout=20000&dataType=jsonp&type=jsonp&callback=mtopjsonp11&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            // console.log(response)
            let data = response.data.trim()
            let json = JSON.parse(data.substring(12, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              let jsonData = json.data
              if (jsonData.success === 'true') {
                try {
                  let addressnew = JSON.parse(jsonData.returnValue)
                  if (addressnew.deliverId) {
                    resolve(addressnew.deliverId)
                  } else {
                    reject(new Error('UNKNOWN'))
                  }
                } catch (err) {
                  reject(err)
                }
              } else {
                reject(new Error('API_RESPONSE_ERROR'))
              }
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('518') > -1) {
              reject(new Error('TAOBAO_ADDRESSLIST_FULL'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    async updateAddress201807 (deliverId, address) {
      return new Promise(async (resolve, reject) => {
        let validAddress = {}
        await this.validateNewAddress201807(address).then((addr) => {
          validAddress = addr
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
        let m5Token = null
        try {
          m5Token = this.cookiesArr.filter((item) => {
            return item.name === '_m_h5_tk'
          })[0].value.split('_')[0]
        } catch (e) {
          reject(new Error('TAOBAO_TOKEN_EXOIRED'))
        }
        let i = new Date().getTime()
        let appKey = '12574478'
        // console.log(data)
        let dataStr = JSON.stringify({
          'divisionCode': validAddress.divisionCode || address.town || '',
          'townDivisionCode': validAddress.townDivisionCode || address.town || '',
          'addressDetail': address.addressDetail,
          'postCode': address.post ? address.post : '000000',
          'overseaAddress': false,
          'fullName': address.fullName,
          'mobileCode': 86,
          'mobile': address.mobile,
          'phoneInternationalCode': 86,
          'phoneAreaCode': address.phoneSection,
          'phoneNumber': address.phoneCode,
          'phoneExtension': address.phoneExt,
          'defaultDeliverAddress': true,
          'deliverId': deliverId
        })
        // console.log(dataStr)
        // let dataStr = '{"divisionCode":"410105011","townDivisionCode":"410105011","addressDetail":"阳光新城19号楼9楼026","longitude":"113.704274","latitude":"34.797823","postCode":"","overseaAddress":false,"fullName":"杨硕","mobileCode":86,"mobile":"18625587270","phoneInternationalCode":86,"phoneAreaCode":"","phoneNumber":"","phoneExtension":"","defaultDeliverAddress":true}' // {"sn":"suibianchuan"}
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.taobao.mbis.updatedeliveraddress/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.updateDeliverAddress&v=1.0&ecode=1&needLogin=true&timeout=20000&dataType=jsonp&type=jsonp&callback=mtopjsonp17&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            // console.log(response)
            let data = response.data.trim()
            let json = JSON.parse(data.substring(12, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              let jsonData = json.data
              if (jsonData.success === 'true') {
                try {
                  let addressnew = JSON.parse(jsonData.returnValue)
                  if (addressnew.deliverId) {
                    resolve(addressnew.deliverId)
                  } else {
                    reject(new Error('UNKNOWN'))
                  }
                } catch (err) {
                  reject(err)
                }
              } else {
                reject(new Error('API_RESPONSE_ERROR'))
              }
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('518') > -1) {
              reject(new Error('TAOBAO_ADDRESSLIST_FULL'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    async insertNewAddress201906 (address) {
      return new Promise(async (resolve, reject) => {
        let division = address.town ? address.town : address.area
        await this.getAddressTownList201906(address.area).then((divisions) => {
          if (divisions && divisions instanceof Array) {
            let matchDivision = divisions.filter((d) => {
              return d.name === address.townName
            })
            if (matchDivision.length) {
              division = matchDivision[0].id
            }
          }
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
        console.log(division)
        let m5Token = null
        try {
          m5Token = this.cookiesArr.filter((item) => {
            return item.name === '_m_h5_tk'
          })[0].value.split('_')[0]
        } catch (e) {
          reject(new Error('TAOBAO_TOKEN_EXOIRED'))
        }
        let i = new Date().getTime()
        let appKey = '12574478'
        // console.log(data)
        let addData = {
          'divisionCode': division,
          'addressDetail': address.addressDetail,
          'postCode': address.post ? address.post : '000000',
          'overseaAddress': false,
          'fullName': address.fullName,
          'mobileCode': 86,
          'mobile': address.mobile,
          'phoneInternationalCode': 86,
          'phoneAreaCode': address.phoneSection,
          'phoneNumber': address.phoneCode,
          'phoneExtension': address.phoneExt,
          'defaultDeliverAddress': true
        }
        if (division.length === 9) {
          addData.townDivisionCode = division
        }
        let dataStr = JSON.stringify(addData)
        // console.log(dataStr)
        // let dataStr = '{"divisionCode":"410105011","townDivisionCode":"410105011","addressDetail":"阳光新城19号楼9楼026","longitude":"113.704274","latitude":"34.797823","postCode":"","overseaAddress":false,"fullName":"杨硕","mobileCode":86,"mobile":"18625587270","phoneInternationalCode":86,"phoneAreaCode":"","phoneNumber":"","phoneExtension":"","defaultDeliverAddress":true}' // {"sn":"suibianchuan"}
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.taobao.mbis.insertdeliveraddress/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.insertDeliverAddress&v=1.0&ecode=1&needLogin=true&timeout=20000&dataType=jsonp&type=jsonp&callback=mtopjsonp11&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            // console.log(response)
            let data = response.data.trim()
            let json = JSON.parse(data.substring(12, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              let jsonData = json.data
              if (jsonData.success === 'true') {
                try {
                  let addressnew = JSON.parse(jsonData.returnValue)
                  if (addressnew.deliverId) {
                    resolve(addressnew.deliverId)
                  } else {
                    reject(new Error('UNKNOWN'))
                  }
                } catch (err) {
                  reject(err)
                }
              } else {
                reject(new Error('API_RESPONSE_ERROR'))
              }
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('518') > -1) {
              reject(new Error('TAOBAO_ADDRESSLIST_FULL'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    async updateAddress201906 (deliverId, address) {
      return new Promise(async (resolve, reject) => {
        let division = address.town ? address.town : address.area
        await this.getAddressTownList201906(address.area).then((divisions) => {
          if (divisions && divisions instanceof Array) {
            let matchDivision = divisions.filter((d) => {
              return d.name === address.townName
            })
            if (matchDivision.length) {
              division = matchDivision[0].id
            }
          }
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
        let m5Token = null
        try {
          m5Token = this.cookiesArr.filter((item) => {
            return item.name === '_m_h5_tk'
          })[0].value.split('_')[0]
        } catch (e) {
          reject(new Error('TAOBAO_TOKEN_EXOIRED'))
        }
        let i = new Date().getTime()
        let appKey = '12574478'
        // console.log(data)
        let addData = {
          'divisionCode': division,
          'addressDetail': address.addressDetail,
          'postCode': address.post ? address.post : '000000',
          'overseaAddress': false,
          'fullName': address.fullName,
          'mobileCode': 86,
          'mobile': address.mobile,
          'phoneInternationalCode': 86,
          'phoneAreaCode': address.phoneSection,
          'phoneNumber': address.phoneCode,
          'phoneExtension': address.phoneExt,
          'defaultDeliverAddress': true,
          'deliverId': deliverId
        }
        if (division.length === 9) {
          addData.townDivisionCode = division
        }
        let dataStr = JSON.stringify(addData)
        // console.log(dataStr)
        // let dataStr = '{"divisionCode":"410105011","townDivisionCode":"410105011","addressDetail":"阳光新城19号楼9楼026","longitude":"113.704274","latitude":"34.797823","postCode":"","overseaAddress":false,"fullName":"杨硕","mobileCode":86,"mobile":"18625587270","phoneInternationalCode":86,"phoneAreaCode":"","phoneNumber":"","phoneExtension":"","defaultDeliverAddress":true}' // {"sn":"suibianchuan"}
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.taobao.mbis.updatedeliveraddress/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.updateDeliverAddress&v=1.0&ecode=1&needLogin=true&timeout=20000&dataType=jsonp&type=jsonp&callback=mtopjsonp17&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            // console.log(response)
            let data = response.data.trim()
            let json = JSON.parse(data.substring(12, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              let jsonData = json.data
              if (jsonData.success === 'true') {
                try {
                  let addressnew = JSON.parse(jsonData.returnValue)
                  if (addressnew.deliverId) {
                    resolve(addressnew.deliverId)
                  } else {
                    reject(new Error('UNKNOWN'))
                  }
                } catch (err) {
                  reject(err)
                }
              } else {
                reject(new Error('API_RESPONSE_ERROR'))
              }
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('518') > -1) {
              reject(new Error('TAOBAO_ADDRESSLIST_FULL'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    /**
     * 删除地址操作函数（2018年7月版本）
     */
    async deleteAddress201807 (address) {
      return new Promise(async (resolve, reject) => {
        if (!address || !address.deliverId) {
          reject(new Error('PARAMETER_ERROR'))
        }
        let data = {
          deliverId: address.deliverId
        }
        let m5Token = null
        try {
          m5Token = this.cookiesArr.filter((item) => {
            return item.name === '_m_h5_tk'
          })[0].value.split('_')[0]
        } catch (e) {
          reject(new Error('TAOBAO_TOKEN_EXOIRED'))
        }
        let i = new Date().getTime()
        let appKey = '12574478'
        let dataStr = JSON.stringify(data)
        // let dataStr = '{"divisionCode":"410105011","townDivisionCode":"410105011","addressDetail":"阳光新城19号楼9楼026","longitude":"113.704274","latitude":"34.797823","postCode":"","overseaAddress":false,"fullName":"杨硕","mobileCode":86,"mobile":"18625587270","phoneInternationalCode":86,"phoneAreaCode":"","phoneNumber":"","phoneExtension":"","defaultDeliverAddress":true}' // {"sn":"suibianchuan"}
        let md5 = this.md5Encode(m5Token + '&' + i + '&' + appKey + '&' + dataStr)
        let url = 'https://h5api.m.taobao.com/h5/mtop.taobao.mbis.deletedeliveraddressbyid/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.deleteDeliverAddressById&v=1.0&ecode=1&needLogin=true&dataType=jsonp&type=jsonp&callback=mtopjsonp4&data=' + encodeURIComponent(dataStr)
        this.$http.get(url)
          .then(response => {
            console.log(response)
            let data = response.data.trim()
            let json = JSON.parse(data.substring(11, data.length - 1))
            if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0] === 'SUCCESS') {
              resolve()
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('SESSION_EXPIRED') > -1) {
              reject(new Error('TAOBAO_SESSION_EXPIRED'))
            } else if (json.ret && json.ret[0] && json.ret[0].indexOf('::') > -1 && json.ret[0].split('::')[0].indexOf('TOKEN_EXOIRED') > -1) {
              reject(new Error('TAOBAO_TOKEN_EXOIRED'))
            } else {
              if (json.data.url && json.data.url.indexOf('punish') > -1) {
                common.focusOrCreateTMDTab(json.data.url)
              }
              reject(json.ret && json.ret[0] ? new Error(json.ret[0]) : new Error('API_ERROR'))
            }
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    async insertNewAddress (address) {
      if (address && address.addressDetail) { // 先进行详细地址敏感过滤
        address.addressDetail = common.addressDetailFilter(address.addressDetail)
      }
      await this.insertNewAddress201906(address).then((deliverId) => {
        this.$Notice.success({
          title: '新增地址成功！',
          desc: ''
        })
      }).catch(async (err) => {
        let message = err.message
        if (err.message === 'TAOBAO_SESSION_EXPIRED') {
          message = '淘宝账号登陆过期！请先登陆淘宝'
          window.open('https://login.taobao.com/member/login.jhtml')
        } else if (err.message === 'TAOBAO_TOKEN_EXOIRED') {
          message = '淘宝TOKEN过期！请重新登陆淘宝，然后再试一次'
          this.getTBCookies()
        } else if (err.message === 'TAOBAO_ADDRESSLIST_FULL') {
          let defaultAddress = null
          await this.getAddressList201807().then(async (list) => {
            defaultAddress = list.filter((item) => {
              return item.defaultAddress
            })
            if (defaultAddress.length) {
              defaultAddress = defaultAddress[0]
            } else {
              defaultAddress = list[0]
            }
            // if (list instanceof Array) {
            //   list.forEach((addr) => {
            //     this.deleteAddress201807(addr).catch((err) => {
            //       console.log(err)
            //       this.$Message.error('删除地址失败!' + err.message)
            //     })
            //   })
            // }
          })
          console.log(defaultAddress)
          await this.updateAddress201906(defaultAddress.deliverId, address)
          // this.insertNewAddress(address)
          return false
        }
        alert('新增地址失败！请手工添加地址。\r\n' + message)
      })
    },
    listenTransLinkDetailedHistoryRequestHeaders () {
      window.chrome.webRequest.onCompleted.addListener((details) => {
        let url = details.url
        if (url.indexOf('ali_trackid') > -1) {
          window.chrome.storage.local.get('transLinkDetailedHistory', function (store) {
            let transLinkDetailedHistory = store.transLinkDetailedHistory || []
            transLinkDetailedHistory.push(url)
            window.chrome.storage.local.set({'transLinkDetailedHistory': transLinkDetailedHistory})
          })
        }
        // console.log(details.url)
      }, {urls: ['*://item.taobao.com/item.htm*', '*://detail.tmall.com/item.htm*']},
      ['responseHeaders'])
    },
    getCurrentVersion () {
      return new Promise((resolve, reject) => {
        this.$http.get(window.chrome.extension.getURL('manifest.json')).then((info) => {
          this.currentVersion = {
            version: info.data.version,
            versionName: info.data.version_name
          }
          resolve(info.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    checkLatestVersion () {
      this.$http.get('http://dingdan.tao11.la/version.json?_t=' + new Date().getTime()).then((res) => {
        let latestVersion = res.data.stable
        let latestVersionBuild = latestVersion ? latestVersion.version_name.split(' build ')[1] : ''
        let currentVersionBuild = this.currentVersion ? this.currentVersion.versionName.split(' build ')[1] : ''
        if (latestVersion && (latestVersion.version > this.currentVersion.version || latestVersionBuild > currentVersionBuild)) {
          this.$Modal.confirm({
            title: '发现新版本插件',
            content: '<p>发现新版本：' + latestVersion.version_name + '</p><p>当前版本：' + this.currentVersion.versionName + '</p><p>是否更新？</p>',
            onOk: () => {
              window.open(latestVersion.file_url, '_blank')
            }
          })
        } else {
          this.$Message.success('您的版本已是最新')
        }
      })
    },
    showChangeLogs () {
      this.$http.get(window.chrome.extension.getURL('changelog.txt')).then((res) => {
        this.$Modal.info({
          title: '版本更新日志',
          scrollable: true,
          closable: true,
          content: '<pre>' + res.data + '</pre>',
          width: 600
        })
      })
    },
    x5Test () {
      window.open('https://buyertrade.taobao.com//trade/itemlist/asyncBought.htm/_____tmd_____/punish?x5secdata=5e0c8e1365474455070961b803bd560607b52cabf5960afff39b64ce58073f7882a920b9577015bb63848d8585b4011d4236c76484f802b2adc32ff5c8e074fd7bf3fd8381b0cf846dca6234fbaf10bcbb59732cfb08afd44561a0c048d1d4c2b1726de5abc460619c989eed3429b4705f3c1c13fdfb68c317a2cc129be33c33c09f387b9dd528ba656d25a9f8a04953d44be2178a79f3579898f4b762c9e9cfa8751f963303ddca91559e3c528e4bdcdeee3219cf0d173c7ca0846900c42cab0a7462692a44dd2b237f98c9f1ed8664834483b45f7c195c851e5ea867461b6ee0b14f67ee5fc4aa54094b1d3efc87f217cafbafe76d5955b72523b0576f3e33951881578f6d451ff315008447a0a18b5d40ea752251acdf61af4cbd8111fcb400b468ff65a3d89c9babdf1eee95e9168e082d62ea96b7ca9b0097fd4314039f874359d89eb3048a2f5487e9af5b14a6d4df76aded1ed367e842dad06db7fa4227c1d09816d6a668dc42fee80275d35ba9359d09962746eee30949445f20e3f6c83ad0d6ebcb39cfedace515dbeef94a49397b9d9c9d9ff34f3f4cc9a9bbf9c64b0aec08fe67cf78ba97589a0af75136379e401ea983d6093e07c344ed4f091bcc0da907e0df7d89f2b90da82c81f72bfc410d870d5e682e868b792fa89d2d44ab570034bcc3f82cda2fb36536ba0f782cfc675a313f985905150d999a2be7dd7913fc2c161f09bc0b31c6e48e62759f8b8fe77b5144f7157dd35a5db702e414&x5step=2')
    }
  }
}
</script>

<style lang="less">
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 5px solid transparent;
}
::-webkit-scrollbar-track {
  box-shadow: 1px 1px 5px rgba(0,0,0,.2) inset;
}
::-webkit-scrollbar-thumb {
  min-height: 20px;
  background-clip: content-box;
  box-shadow: 0 0 0 5px rgba(0,0,0,.2) inset;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.layout-logo {
  padding: 8px 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #f5f7f9;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  font-size: 16px;
  line-height: normal;
  top: 5px;
  left: 20px;
  img {
    margin-right: 5px;
  }
  .site-title {
    font-weight: 800;
    span {
      display: block;
      font-size: 12px;
      font-weight: 300;
    }
  }
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
  padding: 0;
}
#main {
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
#logisHistoryTrigger {
  position: relative;
  .hover-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 64px;
    right: 0;
    padding: 8px;
    visibility: hidden;
    opacity: 0;
    transition: all .3s ease-in-out;
    background: #fff;
    color: #000;
    line-height: 20px;
    cursor: default;
    width: 450px;
    height: 280px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    .ivu-form-item {
      margin-bottom: 5px;
    }
    .logis-history-console-box {
      flex: 1;
      overflow: auto;
      white-space: pre;
      font-family: 'Courier New';
      text-align: bottom;
      p {
        cursor: pointer;
        font-size: 11px;
        &:hover {
          background: #edf3ff;
        }
      }
    }
  }
  &:hover {
    background: rgba(255, 255, 255, .1);
    .hover-box {
      opacity: 1;
      visibility: visible;
    }
  }
}
.logis-detail-dl {
  line-height: 24px;
  dt {
    display: inline-block;
    width: 120px;
    overflow: hidden;
    font-weight: bold;
    float: left;
  }
  dd {
    padding-left: 130px;
  }
}
#myinfoTrigger {
  position: relative;
  .hover-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 64px;
    right: 0;
    padding: 8px;
    visibility: hidden;
    opacity: 0;
    transition: all .3s ease-in-out;
    background: #fff;
    color: #000;
    line-height: 20px;
    cursor: default;
    width: 320px;
    height: 240px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  &:hover {
    background: rgba(255, 255, 255, .1);
    .hover-box {
      opacity: 1;
      visibility: visible;
    }
  }
  .hover-box-content-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .hover-box-content-flex-1 {
    flex: 1;
    width: 100%;
    dl {
      dt {
        clear: both;
        float: left;
        font-weight: bold;
        width: 120px;
        text-align: right;
        margin-right: 20px;
        line-height: 36px;
        color: #999;
      }
      dd {
        float: left;
        line-height: 36px;
        color: #666;
      }
    }
  }
}
</style>
