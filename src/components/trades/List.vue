<template>
  <div class="trade-list">
    <div class="box-tools pull-left">
      <template v-if="$route.params.status==='ASSIGNED'">
        <!-- <Button type="warning" @click="assignBatch" :disabled="checkAssignBatchDisabled">取单</Button> -->
        <Button type="warning" @click="assignBatch" :disabled="checkAssignBatchDisabled" v-if="['god', 'boss'].indexOf($store.getters.user.role)<0">取单</Button>
        <span class="assignable-total">({{assignableTradesTotal}}个订单待取)</span>
        <Button type="text" @click="getAssignableTrades">刷新</Button>
      </template>
    </div>
    <div class="box-tools pull-right">
      <div style="display: inline-block;margin-right:15px;">
        <Select v-model="searchBy" class="table-search on">
          <Option :value="col.subKey ? col.key +'.' + col.subKey : col.key" v-for="col in columns" :key="col.key" v-if="col.title&&col.searchable">{{col.title}}</Option>
        </Select>
        <Input v-model="keyword" ref="tableSearch" placeholder="搜索关键字" @on-focus="toggleSearchMode" @on-blur="toggleSearchMode" class="table-search on" clearable></Input>
        <Button type="ghost" icon="ios-search" @click="searchRemote"></Button>
      </div>
      <Button-group>
        <Button type="ghost" icon="document" @click="$router.push('/guarantee/new/step1')" v-if="$store.getters.role==='bidder'">新增</Button>
        <Button type="ghost" @click="reset">重置</Button>
        <Button type="ghost" icon="ios-refresh-empty" @click="refreshList">刷新</Button>
      </Button-group>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Table stripe :loading="loading" :height="tableHeight" :columns="columns" :data="dataViewPage" ref="table" @on-sort-change="sortTable" @on-row-click="toggleDetail"></Table>
    <div style="margin: 10px;overflow: hidden">
      <!-- <Button type="primary" size="large" @click="exportData" :disabled="!rowSelected"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button> -->
      <div style="float: right;">
        <Page :total="totalCount" :page-size-opts="[10,20,50,100]" @on-change="changePage" @on-page-size-change="changePageSize" :current="pageCurrent" show-sizer show-total show-elevator></Page>
      </div>
    </div>
    <Modal v-model="detailed" :transfer="false" :mask-closable="true" width="1200" v-if="detailedItem.tid_str">
      <p slot="header" style="text-align:center;height:initial">
        <Icon type="information-circled"></Icon>
        <span>订单详情[{{detailedItem.tid_str}}]</span>
        <Tag type="border" :color="recentOrderCount > 1 ? 'red' : 'green'" v-if="recentOrderCount">打假风险预警（测试）：{{recentOrderCount>1?'危险':'安全'}}</Tag>
        <Poptip placement="top" trigger="hover" v-if="recentOrderCount>1">
          <Icon type="help-circled"></Icon>
          <div slot="content" style="white-space:wrap;">
            <div>提示风险的订单，可能为以下情况：</div>
            <div>1、职业打假人恶意购买。</div>
            <div>2、正常用户同一账号短时间内多次下单。</div>
            <div>3、同行同一买手账号代购多次下单。</div>
            <div>请确认后确定是否下单。</div>
          </div>
        </Poptip>
      </p>
      <div>
        <Tabs value="order-info" type="card">
          <TabPane label="订单详情" name="order-info">
            <div style="text-align:center">
              <table class="info-table">
                <tr>
                  <th>店铺</th>
                  <td>{{detailedItem.seller_nick}}</td>
                  <th>订单时间</th>
                  <td>{{detailedItem.created}}</td>
                  <th>原始订单状态</th>
                  <td><Tag type="border" :color="getTradeStatusColor(detailedItem.status)">{{this.getTradeStatus(detailedItem.status)}}</Tag></td>
                </tr>
                <tr>
                  <th>订单状态</th>
                  <td><Tag :color="getOrderStatusColor(detailedItem.order_status)">{{this.getOrderStatus(detailedItem.order_status)}}</Tag></td>
                  <th>操作员</th>
                  <td>{{detailedItem.last_assignbuyer ? detailedItem.last_assignbuyer.name : ''}}</td>
                  <th>配单时间</th>
                  <td>{{detailedItem.last_assignbuyer ? new Date(detailedItem.last_assignbuyer.time).Format('yyyy-MM-dd hh:mm:ss') : ''}}</td>
                </tr>
                <tr v-if="detailedItem.order_status==='RESIGNED'">
                  <th>退回原因</th>
                  <td colspan="5" style="text-align: left">
                    {{getResignReason(detailedItem)}}
                  </td>
                </tr>
                <tr>
                  <th>商品数量</th>
                  <td>{{detailedItem.num}}</td>
                  <th>订单金额</th>
                  <td>{{detailedItem.total_fee}}</td>
                  <th>支付金额</th>
                  <td>
                    {{detailedItem.payment}}
                    <span class="grey small" v-if="(detailedItem.total_fee - detailedItem.payment) || detailedItem.post_fee">
                      (邮费:{{detailedItem.post_fee}},优惠:{{(detailedItem.payment - detailedItem.total_fee - detailedItem.post_fee).toFixed(2)}})
                    </span>
                  </td>
                </tr>
                <tr v-if="['ORDERED', 'PARTLY_ORDERED', 'PARTLY_FINISHED', 'FINISHED'].indexOf(detailedItem.order_status) > -1">
                  <th>最后下单时间</th>
                  <td>{{new Date(detailedItem.ordered[detailedItem.ordered.length - 1].time).Format('yyyy-MM-dd hh:mm:ss')}}</td>
                  <th>最后下单操作员</th>
                  <td>{{detailedItem.ordered[detailedItem.ordered.length - 1].name}}({{detailedItem.ordered[detailedItem.ordered.length - 1].buyer_nick}})</td>
                  <th>下单价格</th>
                  <td>
                    {{getTradeOrderFeesTotal(detailedItem).fee / 100}}
                    <span class="grey small">
                      (邮费:{{getTradeOrderFeesTotal(detailedItem).post / 100}},
                      <b>
                        <span :style="{color: (detailedItem.payment - getTradeOrderFeesTotal(detailedItem).fee / 100 - getTradeOrderFeesTotal(detailedItem).post / 100) ? 'forestgreen' : 'red'}">
                          利润:{{(detailedItem.payment - getTradeOrderFeesTotal(detailedItem).fee / 100).toFixed(2)}}
                        </span>
                      </b>)
                    </span>
                    <a :href="getLinkHref(detailedItem.ordered[detailedItem.ordered.length - 1].buy_url)" target="_blank">下单链接</a>
                  </td>
                </tr>
                <tr>
                  <th>买家昵称</th>
                  <td colspan="1">
                    {{detailedItem.buyer_nick_decrypted}}
                    <a target="_blank" :href="'http://amos.alicdn.com/getcid.aw?v=2&uid=' + detailedItem.buyer_nick_decrypted + '&site=cntaobao&s=2&groupid=0&charset=utf-8'"><img border="0" :src="'http://amos.alicdn.com/online.aw?v=2&uid=' + detailedItem.buyer_nick_decrypted + '&site=cntaobao&s=2&charset=utf-8'" alt="点击这里给我买家消息" /></a>
                  </td>
                  <th>收货信息</th>
                  <td colspan="4">
                    <p><b>
                      {{detailedItem.receiver_name}}
                      ({{detailedItem.receiver_mobile}}<span v-if="detailedItem.receiver_phone"> {{detailedItem.receiver_phone}}</span>)
                      <Button type="text" @click="editReceiverMobile=true;editReceiverMobileModel.receiverMobile=detailedItem.receiver_mobile;editReceiverMobileModel.receiverPhone=detailedItem.receiver_phone;" size="small">改电话</Button>
                      </b>
                    </p>
                    <p style="max-width: 480px; margin: 0 auto;">
                      {{detailedItem.receiver_state}}/
                      {{detailedItem.receiver_city}}/
                      {{detailedItem.receiver_district}}/
                      {{detailedItem.receiver_town || 'none'}}&nbsp;
                      {{detailedItem.receiver_address}}
                      <Button type="text" @click="detailedItem.receiver_address_sync=false" size="small">更新</Button>
                    </p>
                    <Modal
                      v-model="editReceiverMobile"
                      title="修改收货人电话"
                      :mask-closable="true"
                      :transfer="true">
                      <Form ref="editReceiverMobileForm" :model="editReceiverMobileModel" :label-width="80">
                        <FormItem label="手机号码" prop="receiverMobile" :rules="[{validator: editReceiverMobileValidator, trigger: 'blur'}]">
                          <Input v-model="editReceiverMobileModel.receiverMobile" placeholder="手机号码"></Input>
                        </FormItem>
                        <FormItem label="固话号码" prop="receiverPhone" :rules="[{validator: editReceiverMobileValidator, trigger: 'blur'}]">
                          <Input v-model="editReceiverMobileModel.receiverPhone" placeholder="固话号码"></Input>
                        </FormItem>
                      </Form>
                      <div class="">手机或固话二者必填其中之一</div>
                      <div slot="footer">
                        <Button type="error" size="large" @click="editReceiverMobile=false">取消</Button>
                        <Button type="success" size="large" @click="submitEditReceiverMobile">提交</Button>
                      </div>
                    </Modal>
                  </td>
                </tr>
                <tr>
                  <th>买家留言</th>
                  <td style="font-weight: bold; color: blue" colspan="5">
                    {{detailedItem.buyer_message}}
                    <Button type="text" @click="editBuyerMessage=true;editBuyerMessageModel=detailedItem.buyer_message;" size="small">改留言</Button>
                    <Modal
                      v-model="editBuyerMessage"
                      title="修改买家留言"
                      :mask-closable="true"
                      :transfer="true">
                      <Form ref="editBuyerMessageForm">
                        <Input v-model="editBuyerMessageModel" type="textarea" placeholder="请填写买家留言。内容将自动填入订单留言"></Input>
                      </Form>
                      <div slot="footer">
                        <Button type="error" size="large" @click="editBuyerMessage=false">取消</Button>
                        <Button type="success" size="large" @click="submitEditBuyerMessage">提交</Button>
                      </div>
                    </Modal>
                  </td>
                </tr>
                <tr v-if="detailedItem.seller_memo">
                  <th>订单备注</th>
                  <td colspan="5">
                    <div style="font-weight: bold;" :style="{color: getMemoColor(detailedItem.seller_flag)}">
                      {{detailedItem.seller_memo}}
                    </div>
                  </td>
                </tr>
              </table>
              <div class="padding-top-20"></div>
              <div v-if="detailedItem.orders.order.length > 1" style="float:right;">
                拆单发货：<i-switch v-model="separateLogis"></i-switch>
              </div>
              <table class="brief-table">
                <thead>
                  <tr>
                    <th>订单编号</th>
                    <th>状态</th>
                    <th colspan="2">商品</th>
                    <th>单价</th>
                    <th>数量</th>
                    <th>付款</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody v-for="(item, index) in detailedItem.orders.order" :key="index">
                  <tr @click="orderClick(item)" :style="{cursor: getSubOrderStatus(item).text === '待下单' ? 'pointer': 'default'}">
                    <td>
                      {{item.oid_str}}
                      <div class="small font-grey" v-if="!item.is_daixiao && getSubOrderStatus(item).text === '已发货'">{{subOrderShipmentInfo(item)?`${getMoment(subOrderShipmentInfo(item).time).format('YYYY-MM-DD HH:mm:ss')} ${subOrderShipmentInfo(item).company_code} ${subOrderShipmentInfo(item).logis_number}`:'未知'}}</div>
                    </td>
                    <td>
                      <span :style="{color: getSubOrderStatus(item).color}">{{getSubOrderStatus(item).text}}</span>
                      <div v-if="item.refund_id">
                        <span :style="{color: getRefundStatusColor(item.refund_status)}">{{getRefundStatus(item.refund_status)}}</span>
                      </div>
                    </td>
                    <td>
                      <img :src="item.pic_path" width="48" height="48">
                    </td>
                    <td>
                      {{item.title}}<Tag color="yellow" v-if="item.is_daixiao">代销</Tag>
                      <p class="small">{{item.sku_properties_name}}</p>
                    </td>
                    <td>{{item.price}}</td>
                    <td>{{item.num}}</td>
                    <td>
                      {{item.payment}}
                      <p class="grey small" v-if="item.discount_fee">
                        (优惠:{{item.discount_fee}})
                      </p>
                    </td>
                    <td v-if="['service'].indexOf($store.getters.user.role) < 0">
                      <Button size="large" type="warning" @click.prevent.stop="goJoin(item)" v-if="!item.is_daixiao && (getSubOrderStatus(item).text === '待下单' || getSubOrderStatus(item).text === '已退单') && ['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1 && ['NO_REFUND', 'CLOSED'].indexOf(item.refund_status) > -1">关联订单</Button>
                      <Button size="large" type="success" @click.prevent.stop="goBuying(item)" v-if="!item.is_daixiao && getSubOrderStatus(item).text === '待下单' && ['NO_REFUND', 'CLOSED'].indexOf(item.refund_status) > -1 ">去下单</Button>
                      <Button size="large" type="success" @click.prevent.stop="goBuying(item)" v-if="!item.is_daixiao && getSubOrderStatus(item).text === '已退单' && ['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1 && ['NO_REFUND', 'CLOSED'].indexOf(item.refund_status) > -1">去下单</Button>
                      <Button size="large" type="error" @click.prevent.stop="goDismiss(item)" v-if="!item.is_daixiao && getSubOrderStatus(item).text === '已下单'">撤销关联</Button>
                      <Button size="large" type="warning" @click.prevent.stop="goCheckPriceChange(item)" v-if="!item.is_daixiao && (getSubOrderStatus(item).text === '已下单' || getSubOrderStatus(item).text === '已完成')">检查改价</Button>
                    </td>
                    <td v-else></td>
                  </tr>
                  <tr v-if="['service'].indexOf($store.getters.user.role) < 0 && (((item.history_purchase && item.history_purchase.length) || item.outer_iid) &&
                            (getSubOrderStatus(item).text === '待下单' ||
                            (getSubOrderStatus(item).text === '已退单' &&
                            ['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1)))" class="history-purchase">
                    <td>
                      历史下单
                    </td>
                    <td colspan="7">
                      <ul>
                        <li class="history-purchase-item" v-for="(history, i) in item.history_purchase" :key="index + '.' + i" @click="goBuying(item, history.buy_url)">
                          <div class="history-purchase-price">¥{{(history.buyer_fee / 100).toFixed(2)}}</div>
                          <div class="history-purchase-additional">(<span class="strong" v-if="history.times > 1">{{history.times}}次,</span>{{history.num}}件,邮费:¥{{(history.post_fee / 100).toFixed(2)}})</div>
                          <Button type="primary" size="large">去下单</Button>
                        </li>
                        <li class="history-purchase-item" v-if="item.outer_iid" @click="goBuying(item, getOriginalUrl(item))">
                          <!-- <div class="history-purchase-price">{{item.outer_iid}}</div> -->
                          <Button type="warning" size="large">商家编码</Button>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane label="操作历史" name="order-history">
            <table class="info-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>时间</th>
                  <th>操作</th>
                  <th>目标</th>
                  <th>用户</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in tradeOperationHistory" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{new Date(log.time).Format('yyyy-MM-dd hh:mm:ss')}}</td>
                  <td>{{log.desc}}</td>
                  <td>{{log.target}}</td>
                  <td>{{log.op}}</td>
                  <td>{{log.others}}</td>
                </tr>
              </tbody>
            </table>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button size="large" type="warning" @click="assignModal=true" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1&&['UNASSIGNED', 'RESIGNED', 'ASSIGNED'].indexOf(detailedItem.order_status) >= 0">分配给...</Button>
        <Button size="large" type="error" @click="goResign" v-if="['service'].indexOf($store.getters.user.role) < 0 && ['ORDERED', 'PARTLY_ORDERED', 'RESIGNED', 'PARTLY_FINISHED', 'FINISHED'].indexOf(detailedItem.order_status) < 0">退单</Button>
        <Button size="large" type="default" @click="setMemoModal">订单备注</Button>
        <Button size="large" @click="closeDetailed">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="buyingModal"
      v-if="buyingItem"
      title="正在选品..."
      :mask-closable="true"
      :transfer="false">
      <div class="buying-modal-content">
        <div class="buying-product-container">
          <div class="thumb">
            <img :src="buyingItem.pic_path" width="64" height="64">
          </div>
          <div class="brief">
            <div class="title">{{buyingItem.title}}</div>
            <div class="properties small">{{buyingItem.sku_properties_name}}</div>
          </div>
          <div class="trigger" @click="goToItemLink(buyingItem)">
            <div class="price">¥{{buyingItem.payment}}<p>点击查看</p></div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="unbindOrder(buyingItem)">遇到问题了</Button>
        <Button type="success" size="large" @click="reviewOrder(buyingItem)">是的，我已下单</Button>
      </div>
    </Modal>
    <Modal
      v-model="dismissModal"
      title="撤销关联"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="dismissForm" :model="dismissModel" :rules="dismissValidate" :label-width="80">
          <FormItem label="选择原因" prop="reason">
            <Select v-model="dismissModel.reason" placeholder="选择原因">
              <Option value="拍错单了">拍错单了</Option>
              <Option value="客户取消">客户取消</Option>
              <Option value="系统测试">系统测试</Option>
              <Option value="other">其他或需要补充说明</Option>
            </Select>
          </FormItem>
          <FormItem label="其他原因" prop="other" v-if="dismissModel.reason==='other'">
            <Input v-model="dismissModel.other" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="其他原因或需要说明的内容写在这里..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Poptip
          confirm
          title="确认撤销关联么？"
          @on-ok="doDismiss">
          <Button size="large" type="error">
            提交
          </Button>
        </Poptip>
        <Button type="default" size="large" @click="dismissModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="resignModal"
      title="退单"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="resignForm" :model="resignModel" :rules="resignValidate" :label-width="80">
          <FormItem label="选择原因" prop="reason">
            <Select v-model="resignModel.reason" placeholder="选择原因">
              <Option value="拍错单了">拍错单了</Option>
              <Option value="代销订单">代销订单</Option>
              <Option value="客户取消">客户取消</Option>
              <Option value="系统测试">系统测试</Option>
              <Option value="other">疑难杂症</Option>
            </Select>
          </FormItem>
          <FormItem label="其他原因" prop="other" v-if="resignModel.reason==='other'">
            <Input v-model="resignModel.other" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="其他原因或需要说明的内容写在这里..."></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Poptip
          confirm
          title="确认退单么？"
          @on-ok="doResign">
          <Button size="large" type="error">
            提交
          </Button>
        </Poptip>
        <Button type="default" size="large" @click="resignModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="assignModal"
      title="分配给买手..."
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="assignForm" :model="assignModel" :rules="assignValidate" :label-width="80">
          <FormItem label="选择买手" prop="buyerid">
            <Select v-model="assignModel.buyerid" placeholder="选择买手" filterable>
              <Option value="">请选择买手</Option>
              <Option :value="buyer.id" v-for="(buyer, index) in buyerSelectList" :key="index">{{buyer.name}}({{getShopName(buyer.shopid)}})</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Poptip
          confirm
          title="确认分配订单么？"
          @on-ok="doAssignToBuyer">
          <Button size="large" type="error">
            提交
          </Button>
        </Poptip>
        <Button type="default" size="large" @click="assignModal=false">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="joinModal"
      title="关联订单"
      :mask-closable="false"
      :transfer="false">
      <div class="modal-content">
        <Form ref="joinForm" :model="joinModel" :rules="joinValidate" :label-width="120">
          <FormItem label="订单序号" prop="tradeid">
            <Input v-model="joinModel.tradeid" :disabled="true"></Input>
          </FormItem>
          <FormItem label="主订单编号" prop="tid">
            <Input v-model="joinModel.tid" :disabled="true"></Input>
          </FormItem>
          <FormItem label="子订单编号" prop="oid">
            <Input v-model="joinModel.oid" :disabled="true"></Input>
          </FormItem>
          <FormItem label="买手旺旺" prop="buyer">
            <Input v-model="joinModel.buyer"></Input>
          </FormItem>
          <FormItem label="下单主订单编号" prop="buyerTid">
            <Input v-model="joinModel.buyerTid"></Input>
          </FormItem>
          <FormItem label="下单子订单编号" prop="buyerOid">
            <Input v-model="joinModel.buyerOid"></Input>
          </FormItem>
          <FormItem label="下单金额" prop="buyerFee">
            <InputNumber :min="0" :step="1" v-model="joinModel.buyerFee"></InputNumber>
          </FormItem>
          <FormItem label="下单商品链接" prop="buyUrl">
            <Input v-model="joinModel.buyUrl"></Input>
          </FormItem>
          <FormItem label="下单邮费" prop="buyerPostFee">
            <InputNumber :min="0" :step="1" v-model="joinModel.buyerPostFee"></InputNumber>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Poptip
          confirm
          title="确认关联订单么？"
          @on-ok="doJoin">
          <Button size="large" type="error">
            提交
          </Button>
        </Poptip>
        <Button type="default" size="large" @click="joinModal=false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  focusOrCreateTab, sleepES6, getQueryString
} from '../../../static/common'
import {addresses} from './../../../static/addresses.js'
import moment from 'moment'
export default {
  name: 'trade-list',
  props: ['orderFinished', 'orderFailed', 'logisUpdateItem', 'shopList', 'addressList', 'searchByTid'],
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'list',
        apiQuery: {}
      },
      apiData: {},
      spinShow: false,
      columns: [],
      loading: false,
      dataRaw: [],
      data: [],
      dataViewPage: [],
      pageCurrent: 1,
      pageSize: 10,
      totalCount: 0,
      keyword: '',
      searchBy: '',
      searchMode: true,
      tableSearchOn: true,
      filterTradeStatus: null,
      filterOrderStatus: null,
      filterShop: null,
      sort: null,
      searchModel: null,
      tableHeight: 500,
      detailed: false,
      detailedItem: {},
      countryList: [],
      provList: [],
      cityList: [],
      areaList: [],
      townList: [],
      seller_flag: 3,
      buyingItem: null,
      buyingModal: false,
      dismissModal: false,
      dismissModel: {
        reason: '',
        other: ''
      },
      dismissValidate: {
        reason: [
          { required: true, message: '原因不能为空', trigger: 'change' }
        ]
      },
      sub: null,
      resignModal: false,
      resignModel: {
        reason: '',
        other: ''
      },
      resignValidate: {
        reason: [
          { required: true, message: '原因不能为空', trigger: 'change' }
        ]
      },
      assignModal: false,
      assignModel: {
        tradeid: '',
        buyerid: ''
      },
      assignValidate: {
        buyerid: [
          { required: true, message: '买手不能为空', trigger: 'blur' }
        ]
      },
      buyerSelectList: [],
      tradeOperationHistory: [],
      assignableTradesTotal: 0,
      notificationId: null,
      shopSelectList: null,
      lastTradeStatusCheckTime: null, // 最后一次检查远端订单状态时间,有效期30s
      joinModal: false,
      joinModel: {
        tradeid: null,
        tid: null,
        oid: null,
        buyer: '',
        buyerTid: null,
        buyerOid: null,
        buyerFee: 0,
        buyUrl: '',
        buyerPostFee: 0
      },
      joinValidate: {
        tradeid: [
          { required: true, message: '订单序号不能为空', trigger: 'blur' }
        ],
        tid: [
          { required: true, message: '主订单编号不能为空', trigger: 'blur' }
        ],
        oid: [
          { required: true, message: '子订单编号不能为空', trigger: 'blur' }
        ],
        buyer: [
          { required: true, message: '买手旺旺不能为空', trigger: 'blur' }
        ],
        buyerTid: [
          { required: true, message: '下单单号不能为空', trigger: 'blur' }
        ],
        buyerFee: [
          { type: 'number', required: true, message: '订单金额不能为空', trigger: 'blur' }
        ],
        buyUrl: [
          { required: true, message: '下单商品链接不能为空', trigger: 'blur' }
        ],
        buyerPostFee: [
          { type: 'number', required: true, message: '下单邮费不能为空', trigger: 'blur' }
        ]
      },
      editReceiverMobile: false,
      editReceiverMobileModel: {
        receiverMobile: '',
        receiverPhone: ''
      },
      editBuyerMessage: false,
      editBuyerMessageModel: '',
      recentOrderCount: 0, // 买家近期下单数量
      separateLogis: false // 订单拆单发货
    }
  },
  created () {
    // 如果页面刷新，则emit到Layout组件获取最新session
    if (!this.$store.getters.session) {
      this.$emit('on-checkauth', this.$route.path)
    }
    this.initTableColumns()
  },
  mounted () {
    this.syncShopList()
    // console.log(this.getTBAddressDB('410000'))
    if (this.searchByTid) {
      this.searchBy = 'tid_str'
      this.keyword = this.searchByTid
      this.searchRemote()
    }
    this.initDataTable().then(async (result) => {
      this.dataRaw = result
      this.data = result
      this.pageSize = 10
      this.pageCurrent = 1
      this.loading = false
      this.calcTableHeight()
      if (this.$route.params.status === 'ASSIGNED') {
        this.getAssignableTrades()
        // this.updateHistoryPurchase()
      } else if (this.$route.params.status === 'RESIGNED') {
        // this.updateHistoryPurchase()
      }
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
      this.dataViewPage = this.data
      // await this.updateDecrypted()
    },
    'pageCurrent': async function (newVal) {
      this.initTableColumns()
      this.refreshList()
    },
    'pageSize': async function (newVal) {
      this.initTableColumns()
      this.refreshList()
    },
    'searchByTid': function (newVal) {
      if (newVal) {
        this.searchBy = 'tid_str'
        this.keyword = this.searchByTid
        this.searchRemote()
      }
    },
    'filterTradeStatus': async function (newVal) {
      if (newVal) {
        this.initTableColumns()
        this.refreshList()
      }
    },
    'filterOrderStatus': async function (newVal) {
      if (newVal) {
        this.initTableColumns()
        this.refreshList()
      }
    },
    'filterShop': async function (newVal) {
      if (newVal) {
        this.initTableColumns()
        this.refreshList()
      }
    },
    'shopList': async function (newVal) {
      if (newVal) {
        this.columns.filter((col) => {
          return col.title === '店铺'
        })[0].filters = newVal.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      }
    },
    'detailedItem': {
      handler: async function (newVal, oldVal) {
        this.recentOrderCount = 0
        if (newVal._id) {
          // if (!newVal.buyer_nick_decrypted) {
          //   this.updateDecrypted(newVal)
          // }
          if (!newVal.receiver_address_sync) {
            this.getReceiverAddress(newVal._id, newVal.tid_str, newVal.seller_nick).then(receiver => {
              newVal = Object.assign(newVal, receiver)
            })
          }
          this.separateLogis = newVal.separate_logis ? newVal.separate_logis : false
          this.lastTradeStatusCheckTime = null
          if (['UNASSIGNED', 'ASSIGNED', 'PARTLY_ORDERED'].indexOf(newVal.order_status) > -1) {
            await this.syncTradeStatus(this.detailedItem.tid_str)
              .then(async (tradeRemote) => {
                this.lastTradeStatusCheckTime = new Date().getTime()
                if (['WAIT_SELLER_SEND_GOODS', 'SELLER_CONSIGNED_PART'].indexOf(tradeRemote.status) < 0) {
                  this.$Modal.error({
                    title: '无法下单！',
                    content: '订单状态错误！请检查核实'
                  })
                  this.resignModel = {
                    reason: '状态同步出错',
                    other: tradeRemote.status
                  }
                  await sleepES6(500)
                  this.doResign()
                }
              })
              .catch(err => {
                this.$Message.error('同步订单失败！(' + err.message + ')')
              })
            await this.checkReceiverRecentOrders(this.detailedItem.tid_str)
              .then((res) => {
                this.recentOrderCount = res.count
                if (res.count > 1) {
                  this.$Modal.warning({
                    title: '打假风险预警',
                    content: '该订单被系统识别可能存在打假风险，可能的原因包括但不限于：<br>1、职业打假人恶意购买。<br>2、正常用户同一账号短时间内多次下单。<br>3、同行同一买手账号代购多次下单。<br><strong>请确认后确定是否下单。</strong>'
                  })
                }
              }).catch((err) => {
                console.log(err.message)
              })
          }
          this.prepareTradeOperationHistory(newVal)
          newVal.orders.order.forEach(async (item) => {
            if (!item.history_purchase) {
              await this.getHistoryPurchase(item.num_iid).then(async (list) => {
                let hisList = []
                list.sort((a, b) => {
                  return a.buyer_fee - b.buyer_fee
                })
                for (let i = 0; i <= list.length;) {
                  await (() => {
                    return new Promise((resolve, reject) => {
                      try {
                        let his = list[i]
                        let existHis = hisList.filter((hisListItem) => {
                          return hisListItem.buyer_fee === his.buyer_fee &&
                            hisListItem.post_fee === his.post_fee &&
                            hisListItem.num === his.num
                        })
                        if (!existHis.length) {
                          his.times = 1
                          hisList.push(his)
                        } else {
                          existHis[0].times += 1
                        }
                        resolve()
                      } catch (e) {
                        reject(e)
                      }
                    })
                  })(i).then(() => {
                    i++
                  }).catch((e) => {
                    console.log(e)
                    i++
                  })
                  if (i >= list.length) {
                    break
                  }
                }
                this.$set(item, 'history_purchase', hisList)
              }).catch(err => {
                console.log(err.message)
                this.$Message.error('历史下单获取失败！(' + err.message + ')')
              })
            }
          })
        }
      },
      deep: true
    },
    'orderFinished': async function (newVal) {
      console.log(newVal)
      if (newVal) {
        console.log('order finished triggered')
        await this.updateTrade(this.$store.getters.orderBought).then((trade) => {
          let finalStatus = 'ORDERED'
          if (trade.ordered.filter((item) => { return !item.dismiss }).length !== trade.orders.order.length) {
            finalStatus = 'PARTLY_ORDERED'
          }
          this.$set(trade, 'ordered', trade.ordered)
          this.$set(trade, 'order_status', finalStatus)
          Object.assign(this.detailedItem, trade)
          // this.detailedItem = trade
          this.$emit('on-addorderbuyermessage', this.$store.getters.orderBought.buyerTid) // 写入订单留言
          let memo = trade.seller_memo ? trade.seller_memo + ':' + this.$store.getters.orderInfo.tid : this.$store.getters.orderInfo.sellernick + ':' + this.$store.getters.orderInfo.tid
          this.$emit('on-addordermemo', this.$store.getters.orderBought.buyerTid, memo) // 原始订单 sellernick：tid
          this.$Message.success('一键下单成功!')
          window.chrome.notifications.create(this.notificationId, {
            type: 'basic',
            iconUrl: './../../../static/logo.png',
            title: '一键下单成功',
            message: this.$store.getters.orderInfo.sellernick + ':' + this.$store.getters.orderInfo.tid
          }, (notiId) => {
            this.notificationId = notiId
            setTimeout(() => {
              window.chrome.notifications.clear(this.notificationId)
            }, 5000)
          })
        }).catch(err => {
          console.log(err)
          this.$Modal.error({
            title: '数据上传失败，下单失败！',
            content: err
          })
          window.chrome.notifications.create(this.notificationId, {
            type: 'basic',
            iconUrl: './../../../static/logo.png',
            title: '一键下单失败',
            message: err.message
          }, (notiId) => {
            this.notificationId = notiId
            setTimeout(() => {
              window.chrome.notifications.clear(this.notificationId)
            }, 5000)
          })
        })
        setTimeout(() => {
          this.$store.dispatch('clearOrderInfo')
          this.$store.dispatch('clearOrderBought')
        }, 2000)
        this.buyingModal = false
      }
    },
    'orderFailed': function (newVal) {
      if (newVal) {
        // TODO: 更新数据，记录，关闭窗口等
        this.$Modal.error({
          content: '下单失败，请重新下单！'
        })
        this.$store.dispatch('clearOrderInfo')
        this.$store.dispatch('clearOrderBought')
        this.buyingModal = false
      }
    },
    'logisUpdateItem': function (newVal) {
      if (newVal) {
        this.finishOrder(newVal)
      }
    },
    '$route.params.status': function (newVal) {
      this.refreshList()
      if (newVal === 'ASSIGNED') {
        // this.updateHistoryPurchase()
      } else if (newVal === 'RESIGNED') {
        // this.updateHistoryPurchase()
      }
    },
    'sort': function (newVal) {
      this.refreshList()
    },
    'assignModal': function (newVal) {
      if (newVal) {
        this.syncBuyerListByShopId(this.detailedItem.shop.id)
      }
    },
    'separateLogis': function (newVal) {
      this.setSeparateLogis(newVal)
    }
  },
  computed: {
    checkAssignBatchDisabled () {
      // let passiveExist = this.data.filter((item) => {
      //   return item.last_assignbuyer ? item.last_assignbuyer.is_passive || false : false
      // })
      // return passiveExist.length > 0 || !this.assignableTradesTotal
      return false
    }
  },
  methods: {
    /**
     * 处理淘宝四级地址数据库
     */
    getTBAddressDB (parentCode) {
      let list = []
      Object.keys(addresses).forEach((key) => {
        // console.log(key, addresses[key])
        let addr = addresses[key]
        if (addr[1] === parentCode) {
          list.push({
            name: addr[0],
            code: key
          })
        }
      })
      return list
    },
    getMoment (dt) {
      return moment(dt)
    },
    refreshList () {
      this.initTableColumns()
      this.initDataTable().then(async (result) => {
        this.loading = false
        // this.searchBy = ''
        // this.keyword = ''
        // this.searchMode = false
        this.tableSearchOn = false
        if (this.$route.params.status === 'ASSIGNED') {
          this.getAssignableTrades()
        }
      })
    },
    reset () {
      this.$emit('on-searchbytid', '')
      this.searchBy = ''
      this.keyword = ''
      // this.searchMode = false
      this.tableSearchOn = false
      this.filterTradeStatus = null
      this.filterOrderStatus = null
      this.filterShop = null
      this.sort = null
      this.searchModel = null
      this.pageCurrent = 1
      this.pageSize = 10
      this.initDataTable().then(async (result) => {
        this.loading = false
        if (this.$route.params.status === 'ASSIGNED') {
          this.getAssignableTrades()
        }
      })
    },
    async initDataTable () {
      this.loading = true
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'listnew',
        apiQuery: {}
      }
      this.apiData = {}
      if (this.$route.params.status) {
        if (this.$route.params.status === 'ORDEREDALL') {
          this.apiData.order_status = {
            $in: ['ORDERED', 'PARTLY_ORDERED']
          }
        } else if (this.$route.params.status === 'FINISHEDALL') {
          this.apiData.order_status = {
            $in: ['FINISHED', 'PARTLY_FINISHED']
          }
        } else {
          this.apiData.order_status = this.$route.params.status
        }
      }
      if (this.sort) {
        this.apiData.sort = this.sort
      }
      if (this.searchModel) {
        this.apiData.search = this.searchModel
      }
      if (this.filterTradeStatus && this.filterTradeStatus.length) {
        this.apiData.status = {
          $in: this.filterTradeStatus
        }
      }
      if (this.filterOrderStatus && this.filterOrderStatus.length) {
        this.apiData.order_status = {
          $in: this.filterOrderStatus
        }
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
            this.totalCount = respBody.data.total_count
            resolve(respBody.data.datalist)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    initTableColumns () {
      this.columns = [
        // { type: 'selection', width: 70, align: 'center' },
        {
          title: '订单编号',
          key: 'tid_str',
          // fixed: 'left',
          width: 160,
          sortable: true,
          searchable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          }
        },
        {
          title: '状态',
          key: 'order_status',
          width: 100,
          ellipsis: true,
          filters: [
            {
              label: '未指派',
              value: 'UNASSIGNED'
            },
            {
              label: '已派单',
              value: 'ASSIGNED'
            },
            {
              label: '已撤销',
              value: 'RESIGNED'
            },
            {
              label: '已下单',
              value: 'ORDERED'
            },
            {
              label: '部分下单',
              value: 'PARTLY_ORDERED'
            },
            {
              label: '部分完成',
              value: 'PARTLY_FINISHED'
            },
            {
              label: '已完成',
              value: 'FINISHED'
            }
          ],
          filterMultiple: true,
          filterRemote: (value, row) => {
            this.filterOrderStatus = value
          },
          render: (h, params) => {
            return h('Tag', {
              props: {
                // type: 'dot',
                color: this.getOrderStatusColor(params.row.order_status)
              }
            }, this.getOrderStatus(params.row.order_status))
          }
        },
        {
          title: '原始订单状态',
          key: 'status',
          width: 120,
          ellipsis: true,
          filters: [
            {
              label: '待付款',
              value: 'WAIT_BUYER_PAY'
            },
            {
              label: '待发货',
              value: 'WAIT_SELLER_SEND_GOODS'
            },
            {
              label: '已发货',
              value: 'WAIT_BUYER_CONFIRM_GOODS'
            },
            {
              label: '拆单发货',
              value: 'SELLER_CONSIGNED_PART'
            },
            {
              label: '已完成',
              value: 'TRADE_FINISHED'
            },
            {
              label: '用户退款',
              value: 'TRADE_CLOSED'
            },
            {
              label: '交易关闭',
              value: 'TRADE_CLOSED_BY_TAOBAO'
            }
          ],
          filterMultiple: true,
          filterRemote: (value, row) => {
            this.filterTradeStatus = value
          },
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'border',
                color: this.getTradeStatusColor(params.row.status)
              }
            }, this.getTradeStatus(params.row.status))
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
          filterRemote: (value, row) => {
            this.filterShop = value
          },
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, params.row.shop.name)
          }
        },
        {
          title: '商品标题',
          key: 'orders',
          ellipsis: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.orders.order[0].title)
          }
        },
        { title: '订单金额',
          key: 'total_fee',
          width: 120,
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h('span', {}, '¥' + params.row.total_fee)
          }
        },
        { title: '订单时间',
          key: 'created',
          width: 120,
          ellipsis: true,
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return new Date(a) - new Date(b)
            } else {
              return new Date(b) - new Date(a)
            }
          },
          render: (h, params) => {
            return h('span', {}, this.getDateTimeDiff(params.row.created))
          }
        },
        { title: '派单时间',
          key: 'assignbuyer',
          width: 120,
          ellipsis: true,
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return new Date(a) - new Date(b)
            } else {
              return new Date(b) - new Date(a)
            }
          },
          render: (h, params) => {
            // TODO:应按当前用户检索派单记录
            return h('span', {}, params.row.last_assignbuyer ? this.getDateTimeDiff(params.row.last_assignbuyer.time) : '')
          }
        },
        {
          title: '买家淘宝',
          key: 'buyer_nick_decrypted',
          width: 160,
          ellipsis: true,
          searchable: true,
          render: (h, params) => {
            return h('span', {}, params.row.buyer_nick_decrypted || '待加载...')
          }
        },
        // {
        //   title: '买家姓名',
        //   key: 'receiver_name',
        //   width: 120,
        //   ellipsis: true,
        //   searchable: true
        // },
        // {
        //   title: '收货地址',
        //   key: 'receiver_address',
        //   width: 160,
        //   ellipsis: true,
        //   searchable: true
        // },
        {
          title: '买家电话',
          key: 'receiver_mobile',
          width: 120,
          ellipsis: true,
          searchable: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 120,
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
                  click: () => {
                    this.detailed = true
                    this.detailedItem = params.row
                  }
                }
              }, '详情')
            ])
          }
        }
      ]
      if (this.$route.params.status === 'ASSIGNED') {
        this.columns.splice(4, 1)
        this.columns.splice(1, 0, {
          title: '分配给',
          key: 'last_assignbuyer',
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
            return h('span', {}, params.row.last_assignbuyer ? params.row.last_assignbuyer.name : '')
          }
        })
        this.columns.splice(2, 0, {
          title: '拍单',
          key: 'orders',
          width: 80,
          subKey: 'name',
          ellipsis: true,
          render: (h, params) => {
            let ordered = params.row.ordered ? params.row.ordered.filter((item) => {
              return !item.dismiss
            }) : []
            return h('span', {}, ordered.length + '/' + params.row.orders.order.length)
          }
        })
        this.columns.splice(9, 0, {
          title: '收货人',
          key: 'receiver_name',
          width: 80,
          ellipsis: true,
          searchable: true,
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, params.row.receiver_name)
          }
        })
      } else if (this.$route.params.status === 'RESIGNED') {
        this.columns.splice(2, 0, {
          title: '原因',
          key: 'resigned',
          width: 120,
          ellipsis: true,
          sortable: true,
          searchable: true,
          render: (h, params) => {
            let lastResign = params.row.resigned ? params.row.resigned[params.row.resigned.length - 1] : null
            return h('span', {}, lastResign ? lastResign.reason : '')
          }
        })
        this.columns.splice(9, 0, {
          title: '收货人',
          key: 'receiver_name',
          width: 80,
          ellipsis: true,
          searchable: true,
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, params.row.receiver_name)
          }
        })
      } else if (['ORDEREDALL', 'ORDERED', 'PARTLY_ORDERED', 'FINISHEDALL', 'FINISHED', 'PARTLY_FINISHED'].indexOf(this.$route.params.status) > -1) {
        this.columns.splice(3, 0, {
          title: '收款',
          key: 'payment',
          width: 120,
          ellipsis: true,
          render: (h, params) => {
            return h('span', {}, parseFloat(params.row.payment).toFixed(2))
          }
        })
        this.columns.splice(4, 0, {
          title: '利润',
          key: 'ordered',
          width: 120,
          ellipsis: true,
          render: (h, params) => {
            let orderPaymentTotal = 0
            params.row.ordered.filter((item) => {
              return !item.dismiss
            }).forEach((item) => {
              orderPaymentTotal += item.buyer_fee / 100
            })
            let profit = (parseFloat(params.row.payment) - orderPaymentTotal).toFixed(2)
            return h('span', {style: {color: profit > 0 ? 'forestgreen' : 'red'}}, profit)
          }
        })
        this.columns.splice(10, 0, {
          title: '收货人',
          key: 'receiver_name',
          width: 80,
          ellipsis: true,
          searchable: true,
          sortable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          },
          render: (h, params) => {
            return h('span', {}, params.row.receiver_name)
          }
        })
      }
    },
    sortTable (sort) {
      // console.log(sort)
      this.sort = sort
    },
    updateHistoryPurchase () {
      this.data.forEach((trade) => {
        trade.orders.order.forEach(async (item) => {
          await this.getHistoryPurchase(item.num_iid).then((list) => {
            list.sort((a, b) => {
              return a.buyer_fee - b.buyer_fee
            })
            this.$set(item, 'history_purchase', list)
          }).catch(err => {
            console.log(err.message)
            this.$Message.error('历史下单获取失败！(' + err.message + ')')
          })
        })
      })
    },
    updateDecrypted (trade) {
      return new Promise(async (resolve, reject) => {
        try {
          if (trade) {
            let decrypted = ''
            if (!trade.buyer_nick_decrypted) {
              await this.decryptCipher(trade._id, trade.seller_nick, trade.buyer_nick)
                .then(plain => {
                  decrypted = plain
                })
                .catch(err => {
                  throw err
                })
              this.$set(trade, 'buyer_nick_decrypted', decrypted)
            }
          } else {
            this.data.forEach(async (item, index) => {
              let decrypted = ''
              if (!item.buyer_nick_decrypted) {
                await this.decryptCipher(item._id, item.seller_nick, item.buyer_nick)
                  .then(plain => {
                    decrypted = plain
                  })
                  .catch(err => {
                    throw err
                  })
                this.$set(item, 'buyer_nick_decrypted', decrypted)
              }
            })
          }
          resolve()
        } catch (err) {
          reject(err)
        }
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
    getDateTimeDiff (datetime) {
      let dateMsg = new Date(datetime)
      let diff = new Date() - dateMsg
      const min = 1000 * 60
      const hour = min * 60
      const day = hour * 24
      const month = day * 30
      const year = day * 365
      let diffStr = ''
      if (diff <= min) {
        diffStr = '刚刚'
      } else if (diff < hour) {
        diffStr = Math.floor(diff / min) + '分前'
      } else if (diff < day) {
        diffStr = Math.floor(diff / hour) + '小时前'
      } else if (diff < month) {
        diffStr = Math.floor(diff / day) + '天前'
      } else if (diff < year) {
        diffStr = Math.floor(diff / month) + '月前'
      } else {
        diffStr = dateMsg.toLocaleDateString()
      }
      return diffStr
    },
    getTradeOrderFeesTotal (trade) {
      let result = {
        fee: 0,
        post: 0
      }
      let orderedList = trade.ordered.filter((item, index) => {
        return !item.dismiss
      })
      orderedList.forEach((item) => {
        result.fee += item.buyer_fee
        result.post += item.post_fee
      })
      return result
    },
    getSubOrderStatus (sub) {
      let orderedRecords = this.detailedItem.ordered
      let subOid = sub.oid_str
      let exist = orderedRecords ? orderedRecords.filter((item, index) => {
        return item.oid_str === subOid && !item.dismiss
      }) : []
      if (['RESIGNED'].indexOf(this.detailedItem.order_status) > -1) {
        return {
          color: 'red',
          text: '已退单'
        }
      }
      if (['FINISHED'].indexOf(this.detailedItem.order_status) > -1) {
        return {
          color: 'green',
          text: '已完成'
        }
      }
      if (exist.length) {
        if (exist[0].shipped) {
          return {
            color: 'green',
            text: '已发货'
          }
        } else {
          return {
            color: 'green',
            text: '已下单'
          }
        }
      } else {
        if (sub.is_daifa) {
          return {
            color: 'orange',
            text: '代发货'
          }
        } else {
          return {
            color: 'blue',
            text: '待下单'
          }
        }
      }
    },
    subOrderShipmentInfo (sub) {
      let shipped = this.detailedItem.ordered.filter((ordered, index) => {
        return ordered.oid_str === sub.oid_str && !ordered.dismiss
      })
      if (shipped.length) {
        shipped = shipped[0].shipped
      }
      return shipped
    },
    getOrderStatus (s) {
      switch (s) {
        case 'UNASSIGNED':
          return '未指派'
        case 'ASSIGNED':
          return '已派单'
        case 'RESIGNED':
          return '已退单'
        case 'PARTLY_ORDERED':
          return '部分下单'
        case 'ORDERED':
          return '已下单'
        case 'PARTLY_FINISHED':
          return '部分完成'
        case 'FINISHED':
          return '已完成'
        default:
          return '未指派'
      }
    },
    getOrderStatusColor (s) {
      switch (s) {
        case 'UNASSIGNED':
          return 'default'
        case 'ASSIGNED':
          return 'yellow'
        case 'RESIGNED':
          return 'red'
        case 'PARTLY_ORDERED':
          return 'yellow'
        case 'ORDERED':
          return 'blue'
        case 'PARTLY_FINISHED':
          return 'blue'
        case 'FINISHED':
          return 'green'
        default:
          return 'default'
      }
    },
    getTradeStatus (s) {
      switch (s) {
        case 'WAIT_BUYER_PAY':
          return '待支付'
        case 'WAIT_SELLER_SEND_GOODS':
          return '待发货'
        case 'WAIT_BUYER_CONFIRM_GOODS':
          return '已发货'
        case 'SELLER_CONSIGNED_PART':
          return '拆单发货'
        case 'TRADE_FINISHED':
          return '已完成'
        case 'TRADE_CLOSED':
          return '已退款'
        case 'TRADE_CLOSED_BY_TAOBAO':
          return '交易关闭'
        default:
          return s
      }
    },
    getTradeStatusColor (s) {
      switch (s) {
        case 'WAIT_BUYER_PAY':
          return 'default'
        case 'WAIT_SELLER_SEND_GOODS':
          return 'blue'
        case 'WAIT_BUYER_CONFIRM_GOODS':
          return 'yellow'
        case 'SELLER_CONSIGNED_PART':
          return 'yellow'
        case 'TRADE_FINISHED':
          return 'green'
        case 'TRADE_CLOSED':
          return 'red'
        case 'TRADE_CLOSED_BY_TAOBAO':
          return 'default'
        default:
          return 'default'
      }
    },
    getRefundStatus (s) {
      switch (s) {
        case 'SUCCESS':
          return '[退款]已退款'
        case 'WAIT_SELLER_AGREE':
          return '[退款]等待卖家同意'
        case 'WAIT_BUYER_RETURN_GOODS':
          return '[退款]等待买家退货'
        case 'WAIT_SELLER_CONFIRM_GOODS':
          return '[退款]等待卖家确认收货'
        case 'SELLER_REFUSE_BUYER':
          return '[退款]卖家拒绝退款'
        case 'CLOSED':
          return '[退款]退款关闭'
        default:
          return '[退款]' + s
      }
    },
    getRefundStatusColor (s) {
      switch (s) {
        case 'SUCCESS':
          return 'default'
        case 'WAIT_SELLER_AGREE':
          return 'blue'
        case 'WAIT_BUYER_RETURN_GOODS':
          return 'blue'
        case 'WAIT_SELLER_CONFIRM_GOODS':
          return 'blue'
        case 'SELLER_REFUSE_BUYER':
          return 'red'
        case 'CLOSED':
          return 'default'
        default:
          return 'default'
      }
    },
    getMemoColor (flag) {
      // 0-5 灰、红、黄、绿、蓝、紫
      switch (flag) {
        case 0:
          return '#666'
        case 1:
          return 'red'
        case 2:
          return 'orange'
        case 3:
          return 'forestgreen'
        case 4:
          return 'blue'
        case 5:
          return 'deeppink'
        default:
          return '#666'
      }
    },
    toggleDetail (row, index) {
      this.detailed = true
      this.detailedItem = row
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
        by[key] = this.keyword ? this.keyword.trim() : ''
        this.searchModel.push(by)
      })
      this.pageCurrent = 0
      this.pageCurrent = 1
      this.refreshList()
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
    async decryptCipher (tradeId, sellernick, cipher) {
      this.apiItem = {
        apiHost: '',
        apiService: 'tao11',
        apiAction: 'decrypt',
        apiQuery: {}
      }
      this.apiData = {
        tradeid: tradeId,
        nick: sellernick,
        cipher: cipher,
        session: this.$store.getters.session
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('买家信息获取失败！(' + respBody.message + ')')
            reject(new Error(respBody.message))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data.plain)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async getReceiverAddress (tradeId, tid, sellernick) {
      this.apiItem = {
        apiHost: '',
        apiService: 'tao11',
        apiAction: 'receivernew',
        apiQuery: {}
      }
      this.apiData = {
        tradeid: tradeId,
        tid: tid
        // nick: sellernick,
        // session: this.$store.getters.session
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(response => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('收货人信息获取失败！(' + respBody.message + ')')
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
    setMemoModal () {
      this.$Modal.confirm({
        render: (h) => {
          return h('div', {}, [
            h('Input', {
              props: {
                value: this.detailedItem.seller_memo,
                type: 'textarea',
                autosize: { minRows: 2, maxRows: 5 },
                autofocus: true,
                placeholder: '请填写订单备注信息'
              },
              on: {
                input: (val) => {
                  this.detailedItem.seller_memo = val
                }
              }
            }),
            h('RadioGroup', {
              props: {
                value: this.detailedItem.seller_flag
              },
              on: {
                'on-change': (val) => {
                  this.detailedItem.seller_flag = val
                }
              }
            }, [
              h('Radio', {
                props: {
                  label: 0
                }
              }, [h('span', {
                style: {
                  color: this.getMemoColor(0)
                }
              }, '灰色')]),
              h('Radio', {
                props: {
                  label: 1
                }
              }, [h('span', {
                style: {
                  color: this.getMemoColor(1)
                }
              }, '红色')]),
              h('Radio', {
                props: {
                  label: 2
                }
              }, [h('span', {
                style: {
                  color: this.getMemoColor(2)
                }
              }, '黄色')]),
              h('Radio', {
                props: {
                  label: 3
                }
              }, [h('span', {
                style: {
                  color: this.getMemoColor(3)
                }
              }, '绿色')]),
              h('Radio', {
                props: {
                  label: 4
                }
              }, [h('span', {
                style: {
                  color: this.getMemoColor(4)
                }
              }, '蓝色')]),
              h('Radio', {
                props: {
                  label: 5
                }
              }, [h('span', {
                style: {
                  color: this.getMemoColor(5)
                }
              }, '粉色')])
            ])
          ])
        },
        onOk: async () => {
          let result = confirm('确认修改订单备注么？')
          if (result) {
            // 手动备注为红色
            await this.setTradeMemo(this.detailedItem.tid_str, this.detailedItem.seller_memo, this.detailedItem.seller_flag).then((res) => {
              this.$Message.success('备注原始订单成功！')
            })
          }
        }
      })
    },
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
    orderClick (item) {
      let itemText = this.getSubOrderStatus(item).text
      if (!item.is_daixiao && item.refund_status === 'NO_REFUND' && (itemText === '待下单' || (itemText === '已退单' && ['god', 'boss'].indexOf(this.$store.getters.user.role) > -1))) {
        this.goBuying(item)
      }
    },
    goDismiss (sub) {
      this.dismissModal = true
      this.sub = sub
    },
    async doDismiss () {
      let sub = this.sub
      this.$refs['dismissForm'].validate(async (valid) => {
        if (valid) {
          if (this.getSubOrderStatus(sub, this.detailedItem).text === '已下单') {
            this.apiItem = {
              apiHost: '',
              apiService: 'trades',
              apiAction: 'dismiss',
              apiQuery: {}
            }
            this.apiData = {
              tradeid: this.detailedItem._id || this.detailedItem.id,
              tid: this.detailedItem.tid_str,
              oid: sub.oid_str,
              session: this.$store.getters.session,
              reason: this.dismissModel.reason,
              reason_other: this.dismissModel.other
            }
            this.$store.dispatch('setAPIStore', this.apiItem)
            var apiUrl = this.$store.getters.apiUrl
            await this.$http.post(apiUrl, this.apiData).then(response => {
              var respBody = response.data
              if (respBody.status === 'fail') {
                this.$Message.error('解除订单关联失败！(' + respBody.message + ')')
              } else {
                let trade = this.data.filter((item) => { // this.data
                  return item.id === this.detailedItem._id || this.detailedItem.id
                })[0]
                let dismissModel = {
                  oid: sub.oid_str,
                  tid: this.detailedItem.tid_str,
                  reason: this.dismissModel.reason,
                  reason_other: this.dismissModel.other,
                  name: this.$store.getters.user.name,
                  userid: this.$store.getters.user.userid,
                  time: new Date().toLocaleString()
                }
                let lastOrdered = trade.ordered.sort((a, b) => {
                  return new Date(b.time) - new Date(a.time)
                }).filter((item) => {
                  return item.oid_str === sub.oid_str
                })[0]
                lastOrdered.dismiss = dismissModel
                let status = trade.order_status
                let finalStatus = 'ASSIGNED'
                if (trade.resigned && (new Date(trade.resigned[trade.resigned.length - 1].time).getTime() - new Date(trade.last_assignbuyer.time).getTime())) {
                  finalStatus = 'RESIGNED'
                }
                if (trade.order_status === 'ORDERED') {
                  if (trade.orders.order.length > 1) {
                    status = 'PARTLY_ORDERED'
                  } else {
                    status = finalStatus
                  }
                } else if (trade.order_status === 'PARTLY_ORDERED') {
                  if (!trade.ordered.filter((item) => { return !item.dismiss }).length) {
                    status = finalStatus
                  }
                }
                this.$set(trade, 'oredered', trade.ordered)
                this.$set(trade, 'order_status', status)
                this.detailedItem = trade
                this.$store.dispatch('setAPILastResponse', respBody)
                this.$Message.success('解除订单关联成功！')
                this.sub = null
                this.dismissModal = false
                this.dismissModel = {reason: '', other: ''}
              }
            }).catch(err => {
              this.$store.dispatch('setAPILastResponse', err)
              this.$Message.error('解除订单关联失败！(' + err + ')')
            })
          } else {
            this.$Message.error('非法操作！请检查订单状态')
          }
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    goCheckPriceChange (sub) {
      try {
        let oid = sub.oid_str
        let tradeId = this.detailedItem._id
        let tbOrderNumber = this.detailedItem.ordered.filter((ordered) => {
          return ordered.oid_str === oid && !ordered.dismiss
        })[0].order_number
        this.$emit('on-checkpricechange', tradeId, tbOrderNumber)
      } catch (err) {
        console.log(err)
        this.$Message.error('检查改价失败！(' + err.message + ')')
      }
    },
    goResign () {
      this.resignModal = true
    },
    async doResign () {
      this.$refs['resignForm'].validate(async (valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'resign',
            apiQuery: {}
          }
          this.apiData = {
            tradeid: this.detailedItem._id || this.detailedItem.id,
            session: this.$store.getters.session,
            reason: this.resignModel.reason,
            reason_other: this.resignModel.other
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          await this.$http.post(apiUrl, this.apiData).then(response => {
            var respBody = response.data
            if (respBody.status === 'fail') {
              this.$Message.error('退回订单失败！(' + respBody.message + ')')
            } else {
              let trade = this.data.filter((item) => { // this.data
                return item._id === this.detailedItem._id || this.detailedItem.id
              })[0]
              let resignModel = {
                reason: this.resignModel.reason,
                reason_other: this.resignModel.other,
                name: this.$store.getters.user.name,
                userid: this.$store.getters.user.userid,
                time: new Date().toLocaleString()
              }
              if (trade.resigned) {
                trade.resigned.push(resignModel)
              } else {
                trade.resigned = [resignModel]
              }
              this.$set(trade, 'resigned', trade.resigned)
              this.$set(trade, 'order_status', 'RESIGNED')
              Object.assign(this.detailedItem, trade)
              this.$store.dispatch('setAPILastResponse', respBody)
              this.$Message.success('退回订单成功！')
              this.resignModal = false
              this.resignModel = {reason: '', other: ''}
            }
          }).catch(err => {
            // console.log(err)
            this.$store.dispatch('setAPILastResponse', err)
            this.$Message.error('退回订单失败！(' + err + ')')
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
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
    async syncBuyerListByShopId (shopid) {
      this.apiItem = {
        apiHost: '',
        apiService: 'buyers',
        apiAction: 'listall',
        apiQuery: {}
      }
      this.apiData = {
        // search: [
        // {'shopid': shopid || this.detailedItem.shop.id} // 选择本店的买手
        // ]
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('买手列表获取失败！(' + respBody.message + ')')
            reject(new Error('买手列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.buyerSelectList = respBody.data
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async doAssignToBuyer () {
      this.$refs['assignForm'].validate(async (valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'assigntobuyer',
            apiQuery: {}
          }
          this.apiData = {
            tradeid: this.detailedItem._id || this.detailedItem.id,
            buyerid: this.assignModel.buyerid
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          await this.$http.post(apiUrl, this.apiData).then(response => {
            var respBody = response.data
            if (respBody.status === 'fail') {
              this.$Message.error('分配订单失败！(' + respBody.message + ')')
            } else {
              let trade = this.data.filter((item) => { // this.data
                return item._id === this.detailedItem._id || this.detailedItem.id
              })[0]
              let assignbuyerModel = {
                buyerid: this.assignModel.buyerid,
                group: this.$store.getters.user.group,
                name: this.$store.getters.user.name,
                shopid: this.detailedItem.shop.id,
                userid: this.$store.getters.user.userid,
                time: new Date().toLocaleString()
              }
              if (trade.assignbuyer) {
                trade.assignbuyer.push(assignbuyerModel)
              } else {
                trade.assignbuyer = [assignbuyerModel]
              }
              trade.last_assignbuyer = assignbuyerModel
              this.$set(trade, 'assignbuyer', trade.assignbuyer)
              this.$set(trade, 'order_status', 'ASSIGNED')
              this.detailedItem = trade
              this.$store.dispatch('setAPILastResponse', respBody)
              this.$Message.success('分配订单成功！')
              this.assignModal = false
              this.assignModel = {}
            }
          }).catch(err => {
            // console.log(err)
            this.$store.dispatch('setAPILastResponse', err)
            this.$Message.error('分配订单失败！(' + err + ')')
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    async syncTradeStatus (tid) {
      return new Promise(async (resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'gettrade',
          apiQuery: {}
        }
        this.apiData = {
          tid: tid
          // session: this.$store.getters.session
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        await this.$http.post(apiUrl, this.apiData).then(response => {
          try {
            var respBody = response.data.data
            if (respBody.status === 'fail') {
              reject(new Error('同步订单失败！(' + respBody.message + ')'))
            } else {
              resolve(respBody)
            }
          } catch (err) {
            reject(err)
          }
        }).catch(err => {
          // console.log(err)
          this.$store.dispatch('setAPILastResponse', err)
          reject(new Error('同步订单失败！(' + err + ')'))
        })
      })
    },
    async checkReceiverRecentOrders (tid) {
      return new Promise(async (resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'checkrecentorder',
          apiQuery: {}
        }
        this.apiData = {
          tid: tid
          // session: this.$store.getters.session
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        await this.$http.post(apiUrl, this.apiData).then(response => {
          try {
            var respBody = response.data
            if (respBody.status === 'fail') {
              reject(new Error('检查恶意下单失败！(' + respBody.message + ')'))
            } else {
              resolve(respBody.data)
            }
          } catch (err) {
            reject(err)
          }
        }).catch(err => {
          // console.log(err)
          this.$store.dispatch('setAPILastResponse', err)
          reject(new Error('检查恶意下单失败！(' + err + ')'))
        })
      })
    },
    async goBuying (sub, url) { // 点击“去下单”
      let goOn = true
      if (['UNASSIGNED', 'ASSIGNED', 'PARTLY_ORDERED'].indexOf(this.detailedItem.order_status) > -1) {
        // 最后一次检查订单状态时间如果在30s以内就不再查验
        if (this.lastTradeStatusCheckTime && (new Date().getTime() - this.lastTradeStatusCheckTime >= 30 * 1000)) {
          await this.syncTradeStatus(this.detailedItem.tid_str)
            .then(async (tradeRemote) => {
              let refundStatus = tradeRemote.orders.order.filter((item) => { return item.oid_str === sub.oid_str })[0].refund_status
              if (['WAIT_SELLER_SEND_GOODS', 'SELLER_CONSIGNED_PART'].indexOf(tradeRemote.status) < 0 || ['NO_REFUND', 'CLOSED'].indexOf(refundStatus) < 0) {
                this.$Modal.error({
                  title: '无法下单！',
                  content: '订单状态错误！订单状态:' + this.getTradeStatus(tradeRemote.status) + ' 退款状态:' + this.getRefundStatus(refundStatus)
                })
                this.resignModel = {
                  reason: '状态同步出错',
                  other: tradeRemote.status + ' ' + refundStatus
                }
                await sleepES6(500)
                this.doResign()
                goOn = false
              }
            })
            .catch(err => {
              this.$Message.error('同步订单失败！(' + err.message + ')')
              goOn = false
            })
        }
      }
      if (goOn) {
        if (!sub) {
          this.$Message.error('参数错误!')
          return false
        } else {
          this.buyingItem = sub
          let numiid = sub.num_iid
          if (!this.detailedItem.receiver_address_sync) {
            await this.getReceiverAddress(this.detailedItem._id || this.detailedItem.id, this.detailedItem.tid_str, this.detailedItem.seller_nick)
              .catch(err => {
                this.$Message.error('获取收货人信息错误!' + err)
                return false
              })
          }
          var prov, city, area, town
          if (!this.provList || !this.provList.length) {
            this.provList = this.getTBAddressDB('1')
            // await this.$http.get('../../../static/address/provinces.json')
            //   .then((dataP) => {
            //     this.provList = dataP.data
            //   })
            //   .catch(err => {
            //     console.log(err)
            //     this.$Message.error('无法获取省/自治区/直辖市数据库')
            //   })
          }
          try {
            prov = this.provList.filter((p) => {
              return p.name.indexOf(this.detailedItem.receiver_state.trim()) >= 0
            })[0].code
          } catch (e) {
            console.log(e)
            this.$Message.error('省/自治区/直辖市填写错误！')
          }
          this.cityList = this.getTBAddressDB(prov)
          // if (!this.cityList || !this.cityList.length) {
          //   await this.$http.get('../../../static/address/cities.json')
          //     .then((dataC) => {
          //       this.cityList = dataC.data
          //     })
          //     .catch(err => {
          //       console.log(err)
          //       this.$Message.error('无法获取城市数据库')
          //     })
          // }
          try {
            city = this.cityList.filter((p) => {
              return p.name.indexOf(this.detailedItem.receiver_city.trim()) >= 0
            })[0].code
            console.log(city, this.cityList)
          } catch (e) {
            console.log(e)
            this.$Message.error('城市填写错误！')
          }
          this.areaList = this.getTBAddressDB(city)
          // if (!this.areaList || !this.areaList.length) {
          //   await this.$http.get('../../../static/address/areas.json')
          //     .then((dataA) => {
          //       this.areaList = dataA.data
          //     })
          //     .catch(err => {
          //       console.log(err)
          //       this.$Message.error('无法获取区/县数据库')
          //     })
          // }
          try {
            area = this.areaList.filter((p) => {
              return p.name.indexOf(this.detailedItem.receiver_district.trim()) >= 0
            })
            if (area.length) {
              area = area[0].code
            } else {
              // 类似东莞等地不设区的市
              area = null
            }
            console.log(area, this.areaList)
          } catch (e) {
            console.log(e)
            this.$Message.error('区/县填写错误！')
          }
          // 若为不设区的市，则调用市级代码
          this.townList = area ? this.getTBAddressDB(area) : this.getTBAddressDB(city)
          // if (!this.townList || !this.townList.length) {
          //   await this.$http.get('../../../static/address/streets.json')
          //     .then((dataS) => {
          //       this.townList = dataS.data
          //     })
          //     .catch(err => {
          //       console.log(err)
          //       this.$Message.error('无法获取街道/乡镇数据库')
          //     })
          // }
          // try {
          //   town = this.townList.filter((p) => {
          //     return p.name.indexOf(this.detailedItem.receiver_town.trim()) >= 0
          //   })[0].code
          //   console.log(town, this.townList)
          //   // town = this.townList.filter((p) => {
          //   //   return p.parent_code === area && p.name.indexOf(this.detailedItem.receiver_town.trim()) >= 0
          //   // })[0].code.substr(0, 9)
          // } catch (e) {
          //   console.log(e)
          //   this.$Message.error('街道/乡镇填写错误！')
          // }
          this.processReceiverPhone()
          let provName = this.detailedItem.receiver_state
          let cityName = this.detailedItem.receiver_city
          let areaName = this.detailedItem.receiver_district
          let townName = this.detailedItem.receiver_town
          // let addressOriginal = null
          // await this.getAddressSuggestion(prov, city, this.detailedItem.receiver_address).then(async (addrLayer) => {
          //   await (() => {
          //     return new Promise((resolve, reject) => {
          //       let names = addrLayer.fullname.split('/')
          //       let provNameNew = names[0]
          //       let cityNameNew = names[1]
          //       let areaNameNew = names[2]
          //       let townNameNew = names[3]
          //       if (prov !== addrLayer.prov || city !== addrLayer.city || area !== addrLayer.area || town !== addrLayer.town) {
          //         this.$Modal.confirm({
          //           title: '地址建议',
          //           content: '地址是否改为：<br><b>' + provNameNew + ' / ' + cityNameNew + ' / ' + areaNameNew + ' / ' + townNameNew + '</b> ?',
          //           okText: '确认修改',
          //           cancelText: '不修改',
          //           onOk: () => {
          //             addressOriginal = {
          //               fullName: this.detailedItem.receiver_name,
          //               prov: prov,
          //               city: city,
          //               area: area,
          //               town: town,
          //               provName: provName,
          //               cityName: cityName,
          //               areaName: areaName,
          //               townName: townName,
          //               addressDetail: this.detailedItem.receiver_address
          //             }
          //             prov = addrLayer.prov
          //             city = addrLayer.city
          //             area = addrLayer.area
          //             town = addrLayer.town
          //             provName = provNameNew
          //             cityName = cityNameNew
          //             areaName = areaNameNew
          //             townName = townNameNew
          //             resolve()
          //           },
          //           onCancel: function () {
          //             resolve()
          //           }
          //         })
          //       } else {
          //         resolve()
          //       }
          //     })
          //   })()
          // }).catch((err) => {
          //   console.log(err)
          //   this.$Message.error('获取建议地址失败')
          // })
          let receiverModel = {
            // addressOriginal: addressOriginal,
            country: '',
            prov: prov,
            provName: provName,
            provExt: '',
            city: city,
            cityName: cityName,
            area: area,
            areaName: areaName,
            town: town,
            townName: townName,
            fullArea: this.detailedItem.receiver_state + '/' + this.detailedItem.receiver_city + '/' + this.detailedItem.receiver_district + '/' + this.detailedItem.receiver_town,
            addressDetail: this.detailedItem.receiver_address,
            post: this.detailedItem.receiver_zip,
            fullName: this.detailedItem.receiver_name,
            mobile: this.detailedItem.receiver_mobile,
            phoneSection: this.detailedItem.receiver_phone && this.detailedItem.receiver_phone.indexOf('-') ? this.detailedItem.receiver_phone.split('-')[0] : '',
            phoneCode: this.detailedItem.receiver_phone && this.detailedItem.receiver_phone.indexOf('-') ? this.detailedItem.receiver_phone.split('-')[1] : '',
            phoneExt: this.detailedItem.receiver_phone && this.detailedItem.receiver_phone.match(/-/g) && this.detailedItem.receiver_phone.match(/-/g).length === 2 ? this.detailedItem.receiver_phone.split('-')[2] : ''
          }
          this.$emit('on-insertnewaddress', receiverModel)
          let orderInfo = {
            numiid: numiid,
            tradeid: this.detailedItem._id || this.detailedItem.id,
            tid: this.detailedItem.tid_str,
            oid: sub.oid_str,
            sellernick: this.detailedItem.seller_nick,
            receiver: receiverModel,
            addressAdded: false,
            buyerMessage: this.detailedItem.buyer_message
          }
          this.$store.dispatch('setOrderInfo', orderInfo)
          // console.log(this.$store.getters.orderInfo.buyerMessage)
          // console.log(this.$store.getters.orderInfo.numiid)
          let oneKeyOrderInfo = Object.assign(this.detailedItem, {receiver: receiverModel, orderInfo: orderInfo})
          window.chrome.storage.local.set({'one_key_order': oneKeyOrderInfo}, function () {
            console.log('OneKeyOrder local storage stored.')
          })
          this.buyingModal = true
          // 获取转链链接 sub.trans_link
          if (url) {
            let reg = /^[0-9]+$/ // 检测是否为纯num_iid
            if (reg.test(url)) {
              url = 'https://item.taobao.com/item.htm?id=' + url
            }
            await this.getShopTransLinkByURL(url, this.detailedItem.shop.id).then((link) => {
              if (link) {
                this.goToItemLink(sub, link)
              } else {
                this.goToItemLink(sub, url)
              }
            }).catch(() => {
              this.goToItemLink(sub, url)
            })
          } else {
            this.goToItemLink(sub, null)
          }
        }
      }
    },
    /**
     * 电话号码预处理程序
     */
    async processReceiverPhone () {
      if (!this.checkReceiverPhone(this.detailedItem.receiver_mobile)) {
        let section = ''
        await this.getTelAreaCode(this.detailedItem.receiver_city).then((res) => {
          section = res
        })
        // console.log(section, this.detailedItem.receiver_mobile, this.detailedItem.receiver_phone)
        if (this.detailedItem.receiver_mobile && !this.detailedItem.receiver_phone) {
          // console.log('1如果填写了错误的手机号码没填固话')
          // 如果填写了错误的手机号码没填固话
          if (this.detailedItem.receiver_mobile.indexOf(section) === 0) {
            if (this.detailedItem.receiver_mobile[section.length] === '-') {
              this.detailedItem.receiver_phone = this.detailedItem.receiver_mobile
            } else {
              this.detailedItem.receiver_phone = section + '-' + this.detailedItem.receiver_mobile.substr(section.length)
            }
          } else {
            this.detailedItem.receiver_phone = section + '-' + this.detailedItem.receiver_mobile
          }
          this.detailedItem.receiver_mobile = null
        } else if (this.detailedItem.receiver_mobile && this.detailedItem.receiver_phone) {
          // console.log('2如果填写了错误的手机号码也填写了固话')
          // 如果填写了错误的手机号码也填写了固话
          if (this.detailedItem.receiver_phone.indexOf(section) !== 0) {
            this.detailedItem.receiver_phone = section + '-' + this.detailedItem.receiver_phone
          } else {
            if (this.detailedItem.receiver_phone[section.length] !== '-') {
              this.detailedItem.receiver_phone = section + '-' + this.detailedItem.receiver_phone.substr(section.length)
            }
          }
          this.detailedItem.receiver_mobile = null
        } else {
          // 如果没填手机号，填写了固话
          // console.log('3如果没填手机号，填写了固话')
          if (this.detailedItem.receiver_phone.indexOf(section) !== 0) {
            // console.log('未发现区号')
            this.detailedItem.receiver_phone = section + '-' + this.detailedItem.receiver_phone
          } else {
            // console.log('发现区号')
            if (this.detailedItem.receiver_phone[section.length] !== '-') {
              // console.log('没有-号', this.detailedItem.receiver_phone.substr(section.length))
              this.detailedItem.receiver_phone = section + '-' + this.detailedItem.receiver_phone.substr(section.length)
            }
          }
        }
      }
    },
    /**
     * 检测是否是手机号
     */
    checkReceiverPhone (phone) {
      let result = true
      if (!phone) {
        return false
      }
      let phoneRegx = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57]|19[0-9]|16[0-9])[0-9]{8}$/
      if (!phoneRegx.test(phone.trim())) {
        result = false
      }
      console.log('检查手机号', result)
      return result
    },
    /**
     * 根据地市名获取区号
     */
    getTelAreaCode (area) {
      return new Promise(async (resolve, reject) => {
        let secRec = this.cityList.filter((item) => {
          return item.name === area
        })
        if (secRec.length) {
          resolve(secRec[0].section_code)
        } else {
          resolve('')
        }
      })
    },
    async getAddressList () {
      if (!this.addressList || !(this.addressList instanceof Array) || !this.addressList.length) {
        this.$emit('on-get-addresslist')
      } else {
        return this.addressList
      }
    },
    /**
     * 获取建议的四级地址
     */
    async getAddressSuggestion (prov, city, address) {
      return new Promise((resolve, reject) => {
        try {
          let url = 'https://lsp.wuliu.taobao.com/locationservice/addr/validateAddressNew.do?l1=' + prov + '&l2=' + city + '&addr=' + encodeURI(address) + '&lang=zh-S'
          this.$http.get(url)
            .then(response => {
              let data = response.data
              data = data.trim().replace(/↵/g, '').replace(/\\r/g, '').replace(/\\n/g, '')
              let reg = /callback\(.+\);/
              if (reg.test(data)) {
                let json = JSON.parse(data.substring(9, data.length - 2)) // callback({"code":"350000_350800_350802_350802004","result":"福建/龙岩/新罗/中城街道","success":true});↵
                let codes = json.code.split('_')
                resolve({
                  prov: codes[0],
                  city: codes[1],
                  area: codes[2] || null,
                  town: codes[3] || null,
                  fullname: json.result
                })
              } else {
                throw new Error('RESPONSE_INVALID')
              }
            })
            .catch(err => {
              throw err
            })
        } catch (err) {
          reject(err)
        }
      })
    },
    /**
     * 获取原始商家商品编码（outer_iid）
     */
    getOriginalNumiid (suborder) {
      if (suborder && suborder.outer_iid) {
        let numiid = ''
        let reg = /\d{6,}/
        let matches = suborder.outer_iid.match(reg)
        if (matches.length) {
          numiid = matches[0]
        } else {
          numiid = suborder.outer_iid
        }
        // if (suborder.outer_iid.indexOf('-') > 0) {
        //   numiid = suborder.outer_iid.split('-')[1]
        // } else {
        //   numiid = suborder.outer_iid
        // }
        return numiid
      } else {
        return ''
      }
    },
    getOriginalUrl (suborder) {
      if (suborder) {
        let numiid = this.getOriginalNumiid(suborder)
        return 'https://item.taobao.com/item.htm?id=' + numiid
      } else {
        return ''
      }
    },
    getLinkHref (link) {
      let linkHref = link
      if (/^\d+$/.test(link)) {
        linkHref = 'https://item.taobao.com/item.htm?id=' + link
      }
      return linkHref
    },
    async goJoin (sub, url) { // BOSS点击“关联”
      if (!sub) {
        this.$Message.error('参数错误!')
        return false
      } else {
        let numiid = sub.num_iid
        let orderInfo = {
          numiid: numiid,
          tradeid: this.detailedItem._id || this.detailedItem.id,
          tid: this.detailedItem.tid_str,
          oid: sub.oid_str,
          sellernick: this.detailedItem.seller_nick,
          receiver: null,
          addressAdded: false,
          buyerMessage: this.detailedItem.buyer_message
        }
        this.$store.dispatch('setOrderInfo', orderInfo)
        // console.log(this.$store.getters.tbCookies)
        this.joinModel = {
          tradeid: this.detailedItem._id || this.detailedItem.id,
          tid: this.detailedItem.tid_str,
          oid: sub.oid_str,
          buyer: this.$store.getters.tbNick,
          buyerTid: null,
          buyerOid: null,
          buyerFee: 0,
          buyUrl: '',
          buyerPostFee: 0
        }
        this.joinModal = true
      }
    },
    doJoin () {
      this.$refs['joinForm'].validate(async (valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'joinorder',
            apiQuery: {}
          }
          this.apiData = {
            tradeid: this.joinModel.tradeid,
            oid_str: this.joinModel.oid,
            orderBought: this.joinModel,
            session: this.$store.getters.session
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          await this.$http.post(apiUrl, this.apiData).then(async (response) => {
            var respBody = response.data
            if (respBody.status === 'fail') {
              this.$Message.error('关联订单失败！(' + respBody.message + ')')
            } else {
              this.$store.dispatch('setAPILastResponse', respBody)
              this.$Message.success('关联订单成功！')
              this.joinModal = false
              this.joinModel = {}
              this.refreshList()
            }
          }).catch(err => {
            // console.log(err)
            this.$store.dispatch('setAPILastResponse', err)
            this.$Message.error('关联订单失败！(' + err + ')')
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    getResignReason (order) {
      order = order || this.detailedItem
      let trade = JSON.parse(JSON.stringify(order))
      let resignRecords = trade.resigned
      if (!resignRecords || !resignRecords.length) {
        return ''
      } else {
        let rec = resignRecords.sort((a, b) => {
          return new Date(b.time) - new Date(a.time)
        })[0]
        return rec.reason + ' ' + rec.reason_other
      }
    },
    closeDetailed () {
      this.detailedItem = {}
      this.detailed = false
      this.$store.dispatch('clearOrderInfo')
      this.$store.dispatch('clearOrderBought')
    },
    goToItemLink (item, url) {
      let urlItem = 'https://item.taobao.com/item.htm?id=' + item.num_iid
      if (url) {
        urlItem = url
      }
      if (this.$store.getters.sysIsExtension) {
        focusOrCreateTab(urlItem)
      } else {
        window.open(urlItem, '_blank')
      }
    },
    getShopTransLinkByNumiid (numiid, shopid) {
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
          if (respBody.status === 0) {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            resolve(respBody.data.data.url)
          }
        }).catch(err => {
          this.$Message.error('获取商品转链失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    getShopTransLinkByURL (url, shopid) {
      // console.log(url)
      let numiid = getQueryString('id', url)
      // console.log(numiid)
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
    getTransLinkByNumiid (numiid) {
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
          if (respBody.status === 0) {
            this.$Message.error(respBody.message)
            reject(new Error(respBody.message))
          } else {
            resolve(respBody.data.data.url)
          }
        }).catch(err => {
          this.$Message.error('获取商品转链失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    getTransLinkByURL (url) {
      console.log(url)
      let numiid = getQueryString('id', url)
      console.log(numiid)
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
            console.log(respBody.data.data.url)
            resolve(respBody.data.data.url)
          }
        }).catch(err => {
          this.$Message.error('获取商品转链失败！(' + err + ')')
          reject(new Error(err.message))
        })
      })
    },
    reviewOrder (item) {
      // TODO: 检查订单信息
    },
    unbindOrder (item) {
      // TODO: 解绑订单，记录信息
    },
    async updateTrade (bought) {
      return new Promise(async (resolve, reject) => {
        // let trade = this.data.filter((item) => { // this.data
        //   return item.id === bought.tradeid
        // })[0]
        // if (trade) {
        //   let sub = trade.orders.order.filter((item) => {
        //     return item.oid_str === bought.oid
        //   })[0]
        //   if (sub) {
        if (this.$store.getters.orderInfo.numiid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'ordered', // success, ordered
            apiQuery: {}
          }
          this.apiData = {
            num_iid: this.$store.getters.orderInfo.numiid,
            tradeid: bought.tradeid,
            oid_str: bought.oid,
            orderBought: {
              tid: bought.tid,
              num: bought.num,
              buyer: bought.buyer,
              buyerTid: bought.buyerTid,
              buyerFee: bought.buyerFee,
              buyUrl: getQueryString('id', bought.buyUrl),
              buyerPostFee: bought.buyerPostFee
            }
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          await this.$http.post(apiUrl, this.apiData).then(async (response) => {
            var respBody = response.data
            if (respBody.status === 'fail') {
              reject(new Error(respBody.message))
            } else {
              this.$store.dispatch('setAPILastResponse', respBody)
              if (!respBody.data.suc || !respBody.data.taskTraceId) {
                reject(new Error('关联订单失败！'))
              } else {
                await this.traceOrderedTask(respBody.data.taskTraceId).then((resTrade) => {
                  // this.detailedItem = null
                  // this.detailed = false
                  this.refreshList()
                  // this.getAssignableTrades()
                  resolve(resTrade)
                }).catch(err => {
                  reject(new Error('关联订单失败！(' + err.message + ')'))
                })
              }
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('订单信息异常，请刷新列表重试一次！'))
        }
        //   } else {
        //     reject(new Error('子订单不存在！'))
        //   }
        // } else {
        //   reject(new Error('订单不存在！'))
        // }
      })
    },
    traceOrderedTask (taskTraceId) {
      return new Promise(async (resolve, reject) => {
        if (taskTraceId) {
          let repeatTimeout = null
          let timeoutSetting = setTimeout(() => {
            // console.log('timeout')
            clearTimeout(repeatTimeout)
            reject(new Error('超时Timeout'))
          }, 1000 * 30) // 30s timeout

          let repeatFn = async () => {
            // console.log('repeatFn triggered')
            await this.traceOrderedTaskProc(taskTraceId).then((msg) => {
              // console.log('repeatFn succeed')
              clearTimeout(timeoutSetting)
              if (typeof msg === 'object') {
                resolve(msg)
              } else {
                reject(new Error(msg.substr(5)))
              }
            }).catch(() => {
              // console.log('repeatFn failed')
              repeatTimeout = setTimeout(repeatFn, 300)
            })
          }
          repeatFn()
        } else {
          reject(new Error('TaskTraceId为空!'))
        }
      })
    },
    traceOrderedTaskProc (taskTraceId) {
      return new Promise(async (resolve, reject) => {
        if (taskTraceId) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'orderedtaskcheck',
            apiQuery: {}
          }
          this.apiData = {
            taskid: taskTraceId
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          await this.$http.post(apiUrl, this.apiData).then(response => {
            var respBody = response.data
            if (respBody.status === 'fail') {
              reject(new Error(respBody.message))
            } else {
              this.$store.dispatch('setAPILastResponse', respBody)
              if (!respBody.data.suc) {
                if (!respBody.data.reason) {
                  reject(new Error('UNKNOWN'))
                } else {
                  resolve('fail:' + respBody.data.reason)
                }
              } else {
                resolve(respBody.data.trade)
              }
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('TaskTraceId为空!'))
        }
      })
    },
    finishOrder (logis) {
      if (logis) {
        let trade = this.data.filter((item) => {
          return item._id === logis.tradeid
        })[0]
        if (trade) {
          let orderedRecord = trade.ordered.sort((a, b) => {
            return new Date(b.time) - new Date(a.time)
          }).filter((item) => {
            return item.oid_str === logis.oid && !item.dismiss
          })[0]
          if (orderedRecord) {
            let shipped = {
              logis_number: logis.logisNumber,
              company_code: logis.company,
              time: logis.captureTime
            }
            this.$set(orderedRecord, 'shipped', shipped)
            if (trade.orders.length > 1) {
              trade.orders.forEach((item) => {
                let orderedNotShipped = trade.ordered.filter((ordered) => {
                  return ordered.oid_str === item.oid_str && !ordered.shipped
                })
                if (orderedNotShipped) {
                  this.$set(trade, 'order_status', 'PARTLY_FINISHED')
                }
              })
            } else {
              this.$set(trade, 'order_status', 'FINISHED')
            }
          } else {
            this.$Message.error('未找到订单')
          }
        } else {
          this.$Message.error('未找到订单')
        }
      }
    },
    prepareTradeOperationHistory (trade) {
      trade = trade || this.detailedItem
      this.tradeOperationHistory = []
      this.tradeOperationHistory.push({
        time: new Date(trade.created).getTime(),
        desc: '创建订单',
        target: trade.tid_str,
        op: trade.buyer_nick_decrypted,
        others: trade.orders.order.length + '子订单，支付' + trade.payment + '元'
      })
      let assigns = trade.assignbuyer
      if (assigns) {
        this.tradeOperationHistory = this.tradeOperationHistory.concat(assigns.map((item, index) => {
          return {
            time: item.time,
            desc: '分配订单',
            target: trade.tid_str,
            op: item.name,
            others: '买手id:' + item.buyerid + ', 店群id:' + item.group
          }
        }))
      }
      let resigns = trade.resigned
      if (resigns) {
        this.tradeOperationHistory = this.tradeOperationHistory.concat(resigns.map((item, index) => {
          return {
            time: item.time,
            desc: '退回订单',
            target: trade.tid_str,
            op: item.userid,
            others: '原因:' + item.reason + ' ' + item.reason_other
          }
        }))
      }
      let ordered = trade.ordered
      if (ordered) {
        this.tradeOperationHistory = this.tradeOperationHistory.concat(ordered.map((item, index) => {
          if (item.dismiss) {
            this.tradeOperationHistory.push({
              time: item.dismiss.time,
              desc: '解除绑定',
              target: item.dismiss.oid,
              op: item.dismiss.name,
              others: '用户id：' + item.dismiss.userid + '\t原因:' + item.dismiss.reason + '' + item.dismiss.reason_other
            })
          }
          if (item.shipped) {
            this.tradeOperationHistory.push({
              time: item.shipped.time,
              desc: '订单发货',
              target: item.oid_str,
              op: '',
              others: '运单号码：' + item.shipped.logis_number + '\t快递公司:' + item.shipped.company_code
            })
          }
          return {
            time: item.time,
            desc: '买手下单',
            target: item.oid_str,
            op: item.name,
            others: '订单号码:' + item.order_number + '\t用户id：' + item.userid + '\t价格：' + item.buyer_fee + '\t邮费:' + item.post_fee + '\tURL:' + item.buy_url
          }
        }))
      }
      this.tradeOperationHistory.sort((a, b) => {
        return new Date(a.time) - new Date(b.time)
      })
    },
    /**
     * 获取可取单量
     */
    async getAssignableTrades () {
      this.assignableTradesTotal = 0
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'assignables',
        apiQuery: {}
      }
      this.apiData = {
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      await this.$http.post(apiUrl, this.apiData)
        .then((res) => {
          let list = res.data.data
          this.assignableTradesTotal = list.length
        })
        .catch(err => {
          this.$Message.error('获取可取单列表失败!' + err.message)
        })
    },
    /**
     * 取单
     */
    async assignBatch () {
      this.spinShow = true
      if (this.checkAssignBatchDisabled) {
        this.$Modal.error({
          title: '取单失败',
          content: '你还有未完成的订单，请先处理完'
        })
      } else {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'assignbatch',
          apiQuery: {}
        }
        this.apiData = {
          session: this.$store.getters.session
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        await this.$http.post(apiUrl, this.apiData)
          .then((res) => {
            if (res.data.status === 'ok') {
              let list = res.data.data
              if (list.length) {
                this.$Modal.success({
                  title: '取单成功',
                  content: '成功取到' + list.length + '单'
                })
                this.spinShow = false
                list.forEach((item) => {
                  this.data.push(item)
                })
              } else {
                this.$Modal.warning({
                  title: '取单失败',
                  content: '没有抢到订单哦:('
                })
                this.spinShow = false
              }
            } else {
              this.$Modal.error({
                title: '取单失败',
                content: '发生错误' + res.data.message
              })
              this.spinShow = false
            }
            this.getAssignableTrades()
          })
          .catch(err => {
            this.$Modal.error({
              title: '取单失败',
              content: '发生错误' + err.message
            })
            this.spinShow = false
          })
      }
    },
    editReceiverMobileValidator (rule, value, callback) {
      if (!this.editReceiverMobileModel.receiverMobile && !this.editReceiverMobileModel.receiverPhone) {
        return callback(new Error('手机或固话必填其一'))
      } else {
        callback()
      }
    },
    async submitEditReceiverMobile () {
      this.$refs['editReceiverMobileForm'].validate(async (valid) => {
        if (valid) {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'editaddress',
            apiQuery: {}
          }
          this.apiData = {
            tradeid: this.detailedItem._id || this.detailedItem.id,
            receiver_mobile: this.editReceiverMobileModel.receiverMobile,
            receiver_phone: this.editReceiverMobileModel.receiverPhone,
            receiver_address: this.detailedItem.receiver_address,
            receiver_city: this.detailedItem.receiver_city,
            receiver_district: this.detailedItem.receiver_district,
            receiver_name: this.detailedItem.receiver_name,
            receiver_state: this.detailedItem.receiver_state,
            receiver_town: this.detailedItem.receiver_town,
            receiver_zip: this.detailedItem.receiver_zip
          }
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          await this.$http.post(apiUrl, this.apiData).then(response => {
            var respBody = response.data
            if (respBody.status === 'fail') {
              this.$Message.error('修改收货电话失败！(' + respBody.message + ')')
            } else {
              Object.assign(this.detailedItem, respBody.data)
              this.$store.dispatch('setAPILastResponse', respBody)
              this.$Message.success('修改收货电话成功！')
              this.editReceiverMobile = false
            }
          }).catch(err => {
            // console.log(err)
            this.$store.dispatch('setAPILastResponse', err)
            this.$Message.error('修改收货电话失败！(' + err + ')')
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    async submitEditBuyerMessage () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'editbuyermessage',
        apiQuery: {}
      }
      this.apiData = {
        tradeid: this.detailedItem._id || this.detailedItem.id,
        buyer_message: this.editBuyerMessageModel
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      await this.$http.post(apiUrl, this.apiData).then(response => {
        var respBody = response.data
        if (respBody.status === 'fail') {
          this.$Message.error('修改买家留言失败！(' + respBody.message + ')')
        } else {
          Object.assign(this.detailedItem, respBody.data)
          this.$store.dispatch('setAPILastResponse', respBody)
          this.$Message.success('修改买家留言成功！')
          this.editBuyerMessage = false
        }
      }).catch(err => {
        // console.log(err)
        this.$store.dispatch('setAPILastResponse', err)
        this.$Message.error('修改买家留言失败！(' + err + ')')
      })
    },
    async setSeparateLogis () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'setseparatelogis',
        apiQuery: {}
      }
      this.apiData = {
        tradeid: this.detailedItem._id || this.detailedItem.id,
        separate: this.separateLogis
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      await this.$http.post(apiUrl, this.apiData).then(response => {
        var respBody = response.data
        if (respBody.status === 'fail') {
          this.$Message.error('设置拆单发货失败！(' + respBody.message + ')')
        } else {
          Object.assign(this.detailedItem, respBody.data)
          this.$store.dispatch('setAPILastResponse', respBody)
        }
      }).catch(err => {
        // console.log(err)
        this.$store.dispatch('setAPILastResponse', err)
        this.$Message.error('设置拆单发货失败！(' + err + ')')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.buying-product-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: #f5f7f9;
  transition: all .3s linear;
  &:hover {
    background: #eef5fc;
  }
  .thumb {
    width: 64px;
    height: 64px;
    margin-right: 5px;
  }
  .trigger {
    margin-left: 5px;
    width: 80px;
    height: 64px;
    border-radius: 4px;
    transition: all .3s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    cursor: pointer;
    background: rgb(92, 184, 92);
    font-size: 16px;
    font-weight: 800;
    &:hover {
      background: rgb(66, 151, 66);
    }
    p {
      font-size: 12px;
      font-weight: 500;
    }
  }
  .brief {
    flex: 1;
    .title {
      font-weight: 800;
      font-size: 14px;
    }
  }
}
.assignable-total {
  line-height: 32px;
  display: inline-block;
  margin-left: 10px;
}
.history-purchase {
  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    li {
      display: inline-block;
      padding: 5px;
      border: 2px dashed #ccc;
      transition: all .3s ease-in-out;
      cursor: pointer;
      &:hover {
        background: #f2f2f2;
        border: 2px dashed rgb(66, 151, 66);
      }
    }
  }
}
</style>
