/**
 * 在已买到的商品页跟踪商品物流信息ContentScript
 * ===========================
 * 程序起点：getLogisticCompanies
 * ===========================
 * by: YSPN  2018.04.16
 */

var securityBlocked = false
var unpostTrades = []
var logisticsCompanies = []

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  traceStartResponse(request, sender, sendResponse)
  getLogisticCompaniesResponse(request, sender, sendResponse)
  unpostTradesResponse(request, sender, sendResponse)
})

const traceStartResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'trace_start') {
    getLogisticCompanies()
    sendResponse('ok')
  }
}

/**
 * 获取物流公司列表
 */
const getLogisticCompanies = () => {
  securityBlocked = false
  window.chrome.runtime.sendMessage({ cmd: 'get_logistic_companies' }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'get_logistic_companies' })
      }, 2000)
    } else {
      getLogisticCompaniesResponse(request, sender, sendResponse)
      console.log('获取物流公司列表：' + response)
    }
  })
}

/**
 * 物流公司列表返回
 * @param {*} request 
 * @param {*} sender 
 * @param {*} sendResponse 
 */
const getLogisticCompaniesResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_logistic_companies_response') {
    logisticsCompanies = request.value
    traceOrder()
    sendResponse('ok')
  }
}

/*
  **自动跟踪物流状态入口函数
  */
const traceOrder = () => {
  console.log('trace_order started')
  securityBlocked = false
  window.chrome.runtime.sendMessage({ cmd: 'get_unpost_trades' }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'get_unpost_trades' })
      }, 2000)
    } else {
      console.log('获取未发货订单列表：' + response)
    }
  })
}

const unpostTradesResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_unpost_trades_response') {
    unpostTrades = request.value
    if (unpostTrades.length) {
      // console.log(unpostTrades)
      searchTBSendOrders(100, 1, (orders) => {
        autoTracer(orders, unpostTrades)
      })
    }
    sendResponse('ok')
  }
}

const searchTBSendOrders = (pageSize, pageNum, callback) => {
  var form = {
    pageNum: pageNum,
    pageSize: pageSize,
    auctionStatus: 'SEND',
    prePageNo: pageNum === 1 ? 1 : pageNum - 1
  }
  $.ajax({
    url: 'https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8',
    method: 'POST',
    processData: false,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    data: setQueryConfig(form),
    success: function (data) {
      if (data) {
        if (callback) {
          callback(JSON.parse(data))
        }
      }
    }
  })
}

/*
 **分批跟踪物流状态处理函数
 **in:initBatchOrders(第一次取出的淘宝待收货订单列表)
 **in:trades(tao11取回的待发货订单列表)
 */
const autoTracer = (initBatchOrders, trades, callback) => {
  var totalOrderNum = initBatchOrders.page.totalNumber
  var pageSize = initBatchOrders.page.pageSize
  var pageTotal = initBatchOrders.page.totalPage
  var timeSpan = 0.5 * 60 * 1000       // 分批轮询间隔时间(ms)
  autoTracerProcessor(initBatchOrders, trades)
  if (totalOrderNum <= pageSize) {
    return false
  } else if (totalOrderNum > pageSize && totalOrderNum <= 5 * pageSize) {
    timeSpan = 0.5 * 60 * 1000     // 半分钟
    var i = 2
    var tracerMicroTask = setInterval(function () {
      searchTBSendOrders(pageSize, i, function (batchOrders) {
        i++
        if (i > pageTotal) {
          clearInterval(tracerMicroTask)
        }
        autoTracerProcessor(batchOrders, trades)
      })
    }, timeSpan)
  } else if (totalOrderNum > 5 * pageSize && totalOrderNum <= 10 * pageSize) {
    timeSpan = 1.5 * 60 * 1000     // 1.5分钟
    var i = 2
    var tracerMicroTask = setInterval(function () {
      searchTBSendOrders(pageSize, i, function (batchOrders) {
        i++
        if (i > pageTotal) {
          clearInterval(tracerMicroTask)
        }
        autoTracerProcessor(batchOrders, trades)
      })
    }, timeSpan)
  } else if (totalOrderNum > 10 * pageSize && totalOrderNum <= 20 * pageSize) {
    timeSpan = 1 * 60 * 1000     // 1分钟
    var i = 2
    var tracerMicroTask = setInterval(function () {
      searchTBSendOrders(pageSize, i, function (batchOrders) {
        i++
        if (i > pageTotal) {
          clearInterval(tracerMicroTask)
        }
        autoTracerProcessor(batchOrders, trades)
      })
    }, timeSpan)
  } else {
    timeSpan = Math.floor(19 * 60 * 1000 / pageTotal)     // 19分钟内平均分布
    var i = 2
    var tracerMicroTask = setInterval(function () {
      searchTBSendOrders(pageSize, i, function (batchOrders) {
        i++
        if (i > pageTotal) {
          clearInterval(tracerMicroTask)
        }
        autoTracerProcessor(batchOrders, trades)
      })
    }, timeSpan)
  }
}

/*
 **分批跟踪物流状态处理子函数
 **in:orders(本批次取出的淘宝待收货订单列表)
 **in:trades(tao11取回的待发货订单列表)
 */
const autoTracerProcessor = (orders, trades) => {
  if (orders.mainOrders) {
    for (var i = 0; i < orders.mainOrders.length; i++) {
      var tbOrderNumber = orders.mainOrders[i].id
      for (var j = 0; j < trades.length;) {
        var orderedList = trades[j].ordered.filter((item) => {
          return !item.dismiss
        }) // 一键下单的orderNumber
        var tradeid = trades[j].id
        var originalOrderNumber = trades[j].tid_str
        if (orderedList.length) {
          // 检索ordered列表，按oid_str进行关键字匹配
          let hit = orderedList.filter((item) => {
            return item.oid_str === tbOrderNumber
          })
          if (hit.length) {
            let oid = hit[0].oid_str // 子订单oid
            console.log('匹配订单！' + originalOrderNumber + ':' + tbOrderNumber)
            var sellerId = orders.mainOrders[i].seller.id
            var logisticUrl = 'https://detail.i56.taobao.com/trace/trace_detail.htm?tId=' + tbOrderNumber + '&userId=' + sellerId
            getLogisticDetail(logisticUrl, tradeid, originalOrderNumber, oid, function (logistic) {
              console.log(logistic)
              if (logistic.orderNumber) {
                window.chrome.runtime.sendMessage({ cmd: 'logistic_captured', logistic: logistic }, (response) => {
                  if (response !== 'ok') {
                    window.setTimeout(function () {
                      window.chrome.runtime.sendMessage({ cmd: 'logistic_captured', logistic: logistic })
                    }, 2000)
                  } else {
                    console.log('返回物流详情：' + response)
                  }
                })
              }
            })
          }
        }
        j++
      }
    }
  }
}

const getLogisticDetail = (url, tradeid, tid, oid, callback) => {
  $.ajax({
    url: url,
    method: 'GET',
    success: function (data) {
      if (data) {
        var securityIdentifier = '发现您的网络环境有异常，为保证正常使用，请验证'
        if (data.indexOf(securityIdentifier) >= 0) {
          if (!securityBlocked) {
            // 只开一个
            window.open(url, '_blank')
            securityBlocked = true
          }
        }
        var logis = $(data).find('.detail-panel .panel-order .info .order-row:first').children('span')
        var logistic = {
          tradeid: tradeid,
          tid: tid,
          oid: oid,
          logisNumber: $(logis[0]).text().trim(),       // 快递单号
          company: getLogisticCompanyCode($(logis[1]).text().trim())
        }
        if (callback) {
          callback(logistic)
        }
      }
    }
  })
  sleep(500)
}

function getLogisticCompanyCode (name) {
  var code = ''
  try {
    if (!logisticsCompanies) {
      logisticsCompanies = [{ "code": "HOAU", "id": 1191, "name": "天地华宇", "reg_mail_no": "^[A-Za-z0-9]{8,9}$" }, { "code": "DTW", "id": 512, "name": "大田" }, { "code": "HTKY", "id": 502, "name": "百世快递", "reg_mail_no": "^((A|B|D|E)[0-9]{12})$|^(BXA[0-9]{10})$|^(K8[0-9]{11})$|^(02[0-9]{11})$|^(000[0-9]{10})$|^(C0000[0-9]{8})$|^((21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|61|63)[0-9]{10})$|^((50|51)[0-9]{12})$|^7[0-9]{13}$|^6[0-9]{13}$|^58[0-9]{14}$" }, { "code": "YTO", "id": 101, "name": "圆通速递", "reg_mail_no": "^[A-Za-z0-9]{2}[0-9]{10}$|^[A-Za-z0-9]{2}[0-9]{8}$|^(8)[0-9]{17}|^(9)[0-9]{17}$" }, { "code": "STO", "id": 100, "name": "申通快递", "reg_mail_no": "^(268|888|588|688|368|468|568|668|768|868|968)[0-9]{9}$|^(11|22|40|268|888|588|688|368|468|568|668|768|868|968)[0-9]{10}$|^(STO)[0-9]{10}$|^(33)[0-9]{11}$|^(4)[0-9]{12}$|^(55)[0-9]{11}$|^(66)[0-9]{11}$|^(77)[0-9]{11}$|^(88)[0-9]{11}$|^(99)[0-9]{11}$" }, { "code": "SF", "id": 505, "name": "顺丰速运", "reg_mail_no": "^[A-Za-z0-9-]{4,35}$" }, { "code": "EMS", "id": 2, "name": "EMS", "reg_mail_no": "^[A-Z]{2}[0-9]{9}[A-Z]{2}$|^(10|11)[0-9]{11}$|^(50|51)[0-9]{11}$|^(95|97)[0-9]{11}$" }, { "code": "ZJS", "id": 103, "name": "宅急送", "reg_mail_no": "^[a-zA-Z0-9]{10}$|^(42|16)[0-9]{8}$|^A[0-9]{12}" }, { "code": "YUNDA", "id": 102, "name": "韵达快递", "reg_mail_no": "^(10|11|12|13|14|15|16|17|19|18|50|55|58|80|88|66|31|77|39)[0-9]{11}$|^[0-9]{13}$" }, { "code": "ZTO", "id": 500, "name": "中通快递", "reg_mail_no": "^((765|852|779|359|528|751|358|618|680|778|780|768|688|689|618|828|988|118|128|888|571|518|010|628|205|880|882|717|718|728|738|761|762|763|701|757|719|881|120)[0-9]{9})$|^((2008|2010|8050|7518)[0-9]{8})$|^((66|63|64|36|37|53|54|55|56|72)[0-9]{10})$|^((4)[0-9]{11})$" }, { "code": "POST", "id": 1, "name": "中国邮政" }, { "code": "OTHER", "id": -1, "name": "其他", "reg_mail_no": "^[A-Za-z0-9-]{4,35}$" }, { "code": "AIR", "id": 507, "name": "亚风", "reg_mail_no": "^[0-9]{11}$" }, { "code": "DISTRIBUTOR_1710055", "id": 5000000178661, "name": "邮政标准快递", "reg_mail_no": "^(10)[0-9]{11}$|^(11)[0-9]{11}$" }, { "code": "MGSD", "id": 21000007003, "name": "美国速递" }, { "code": "BHWL", "id": 21000053037, "name": "保宏物流" }, { "code": "DISTRIBUTOR_13211725", "id": 1216000000124268, "name": "跨越速运" }, { "code": "UNIPS", "id": 1237, "name": "发网" }, { "code": "YUD", "id": 513, "name": "长发" }, { "code": "DISTRIBUTOR_13159132", "id": 6000100034186, "name": "菜鸟大件-日日顺配" }, { "code": "YC", "id": 1139, "name": "远长", "reg_mail_no": "^96[0-9]{12}$" }, { "code": "DISTRIBUTOR_13148625", "id": 6000100034229, "name": "菜鸟大件-中铁配", "reg_mail_no": "^\\d{15,}[-\\d]+$|^[0-9]{10}|[0-9]{12}$" }, { "code": "DISTRIBUTOR_13222803", "id": 1216000000125358, "name": "中通快运" }, { "code": "DFH", "id": 1137, "name": "东方汇", "reg_mail_no": "^[0-9]{10}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}" }, { "code": "CYEXP", "id": 511, "name": "长宇" }, { "code": "WND", "id": 21000127009, "name": "WnDirect" }, { "code": "GZLT", "id": 200427, "name": "飞远配送 " }, { "code": "PKGJWL", "id": 21000038002, "name": "派易国际物流77" }, { "code": "BESTQJT", "id": 105031, "name": "百世快运" }, { "code": "NEDA", "id": 1192, "name": "能达速递", "reg_mail_no": "^((88|)[0-9]{10})$|^((1|2|3|5|)[0-9]{9})$|^(90000[0-9]{7})$" }, { "code": "YCT", "id": 1185, "name": "黑猫宅急便", "reg_mail_no": "^[0-9]{12}$" }, { "code": "SURE", "id": 201174, "name": "速尔", "reg_mail_no": "^[0-9]{11}[0-9]{1}$" }, { "code": "DBL", "id": 107, "name": "德邦物流", "reg_mail_no": "^[0-9]{8,10}$|^\\d{15,}[-\\d]+$" }, { "code": "UC", "id": 1207, "name": "优速快递", "reg_mail_no": "^VIP[0-9]{9}|V[0-9]{11}|[0-9]{12}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}$|^(9001)[0-9]{8}$" }, { "code": "LTS", "id": 1214, "name": "联昊通", "reg_mail_no": "^[0-9]{9,12}$" }, { "code": "ESB", "id": 200740, "name": "E速宝", "reg_mail_no": "[0-9a-zA-Z-]{5,20}" }, { "code": "GTO", "id": 200143, "name": "国通快递", "reg_mail_no": "^(3(([0-6]|[8-9])\\d{8})|((2|4|5|6|7|8|9)\\d{9})|(1|2|3|4|5|6|7|8|9)\\d{11})$" }, { "code": "LB", "id": 1195, "name": "龙邦速递", "reg_mail_no": "^[0-9]{12}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}$|^[0-9]{15}$|^[0-9]{15}-[1-9A-Z]{1}-[1-9A-Z]{1}$" }, { "code": "POSTB", "id": 200734, "name": "邮政快递包裹", "reg_mail_no": "^([GA]|[KQ]|[PH]){2}[0-9]{9}([2-5][0-9]|[1][1-9]|[6][0-5])$|^[99]{2}[0-9]{11}$|^[96]{2}[0-9]{11}$|^[98]{2}[0-9]{11}$" }, { "code": "TTKDEX", "id": 504, "name": "天天快递", "reg_mail_no": "^[0-9]{12}$" }, { "code": "HZABC", "id": 1121, "name": "飞远(爱彼西)配送", "reg_mail_no": "^[0-9]{10,11}$|^T[0-9]{10}$|^FYPS[0-9]{12}$|^LBX[0-9]{15}-[2-9AZ]{1}-[1-9A-Z]{1}$" }, { "code": "EYB", "id": 3, "name": "EMS经济快递", "reg_mail_no": "^[A-Z]{2}[0-9]{9}[A-Z]{2}$|^(10|11)[0-9]{11}$|^(50|51)[0-9]{11}$|^(95|97)[0-9]{11}$" }, { "code": "DBKD", "id": 5000000110730, "name": "德邦快递", "reg_mail_no": "^[0-9]{8,10}$|^\\d{15,}[-\\d]+$" }, { "code": "CNEX", "id": 1056, "name": "佳吉快递", "reg_mail_no": "^[7,1,9][0-9]{9}$" }, { "code": "QFKD", "id": 1216, "name": "全峰快递", "reg_mail_no": "^[0-6|9][0-9]{11}$|^[7][0-8][0-9]{10}$|^[0-9]{15}$|^[S][0-9]{9,11}(-|)P[0-9]{1,2}$|^[0-9]{13}$|^[8][0,2-9][0,2-9][0-9]{9}$|^[8][1][0,2-9][0-9]{9}$|^[8][0,2-9][0-9]{10}$|^[8][1][1][0][8][9][0-9]{6}$" }, { "code": "GDEMS", "id": 1269, "name": "广东EMS", "reg_mail_no": "^[a-zA-Z]{2}[0-9]{9}[a-zA-Z]{2}$" }, { "code": "FEDEX", "id": 106, "name": "联邦快递", "reg_mail_no": "^[0-9]{12}$" }, { "code": "QRT", "id": 1208, "name": "增益速递", "reg_mail_no": "^[0-9]{12,13}$" }, { "code": "UAPEX", "id": 1259, "name": "全一快递", "reg_mail_no": "^\\d{12}|\\d{11}$" }, { "code": "XB", "id": 1186, "name": "新邦物流", "reg_mail_no": "[0-9]{8}" }, { "code": "BJRFD-001", "id": 100034107, "name": "如风达配送", "reg_mail_no": "^[\\x21-\\x7e]{1,100}$" }, { "code": "XFWL", "id": 202855, "name": "信丰物流", "reg_mail_no": "^130[0-9]{9}|13[7-9]{1}[0-9]{9}|18[8-9]{1}[0-9]{9}$" }, { "code": "FAST", "id": 1204, "name": "快捷快递", "reg_mail_no": "^(?!440)(?!510)(?!520)(?!5231)([0-9]{9,13})$|^(P330[0-9]{8})$|^(D[0-9]{11})$|^(319)[0-9]{11}$|^(56)[0-9]{10}$|^(536)[0-9]{9}$" }, { "code": "SHQ", "id": 108, "name": "华强物流", "reg_mail_no": "^[A-Za-z0-9]*[0|2|4|6|8]$" }, { "code": "BEST", "id": 105, "name": "百世物流", "reg_mail_no": "^[0-9]{11,12}$" }];
    } else {
      code = logisticsCompanies.filter(function (c) {
        return c.name.trim() === name.trim()
      })[0].code
    }
  } catch (e) {
    console.log(e)
    code = ''
  }
  if (code) {
    return code
  } else {
    return '未知'
  }
}