'use strict'
/**
 * 淘宝商品订单确定页ContentScript
 * ===========================
 * 程序起点：get_orderinfo
 * ===========================
 * by: YSPN  2018.04.13
 */
let orderInfo, buyerOrder, oneKeyOrderInstance
let shopInBlackList = false
window.onload = () => {
  
}

$(document).ready(function () {
  window.document.querySelector('.go-btn').style.display = 'none'
  window.chrome.runtime.sendMessage({ cmd: 'get_orderinfo' }, (response) => {
    if (response !== 'ok') {
      // window.setTimeout(function () {
      //   window.chrome.runtime.sendMessage({ cmd: 'get_orderinfo' })
      // }, 2000)
      alert('选品订单信息失败！请刷新本页面。')
    }
    console.log('获取订单信息：' + response)
  })
  window.chrome.storage.local.get('one_key_order', function (store) {
    console.log(store)
    oneKeyOrderInstance = store.one_key_order
    $('.order-item').each(function (orderIndex) {
      var cur = $(this)
      $(this).append($('<select class=\'oneKeyOrder_oriOrderItemSelect\'><option>不选择</option></select>'))
      for (var i = 0; i < oneKeyOrderInstance.orders.order.length; i++) {
        cur.find('.oneKeyOrder_oriOrderItemSelect').append($('<option value=\'' + oneKeyOrderInstance.orders.order[i].oid_str + '\' ' + (i === orderIndex ? 'selected' : '') + '>' + '[' + (i + 1) + ']' + oneKeyOrderInstance.orders.order[i].title + '(' + oneKeyOrderInstance.orders.order[i].num + '件,¥' + oneKeyOrderInstance.orders.order[i].payment + ')' + '</option>'))
      }
    })
    window.setTimeout(function () {
      console.log(orderInfo, oneKeyOrderInstance)
      buyerOrder = getOrdersFeesOnload(orderInfo)
      console.log(buyerOrder)
      window.chrome.runtime.sendMessage({ cmd: 'set_orderbought_temp', value: buyerOrder }, (response) => {
        if (response !== 'ok') {
          window.setTimeout(function () {
            buyerOrder = getOrdersFeesOnload(orderInfo)
            window.chrome.runtime.sendMessage({ cmd: 'set_orderbought_temp', value: buyerOrder })
          }, 200)
          alert('选品信息暂存失败！请刷新本页面。')
        }
        // console.log('1123', window.document.querySelector('.go-btn'))
        console.log('选品信息暂存：' + response)
      })
    }, 2000)
    
    $('body').delegate('.go-btn', 'click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      buyerOrder = getOrdersFees(orderInfo)
      if (buyerOrder) {
        window.chrome.runtime.sendMessage({ cmd: 'set_orderbought_temp', value: buyerOrder }, (response) => {
          if (response !== 'ok') {
            window.setTimeout(function () {
              buyerOrder = getOrdersFees(orderInfo)
              window.chrome.runtime.sendMessage({ cmd: 'set_orderbought_temp', value: buyerOrder })
            }, 500)
            alert('选品信息暂存失败！请刷新本页面。')
          }
          console.log('选品信息暂存：' + response)
        })
      }
      // console.log(buyerOrder)
      if (checkOriginalAddress()) {
        if (buyerOrder) {
          $('body').undelegate('.go-btn', 'click')
          setTimeout(function () {
            // $('.order-anonymous label').click()
            $('.order-anonymous label input').val(true)
            document.querySelectorAll('a.go-btn')[0].click()
          }, 500)
        }
      }
    })
  })
  $('.order-order').each(function () {
    let shopSeller = $(this).find('.shop-seller a').text()
    let shopName = $(this).find('.shop-url').text()
    // console.log(shopSeller)
    if (window.location.href.toLocaleLowerCase().indexOf('tmall') > -1) {
      checkBlackListShop(shopName)
    } else {
      checkBlackListShop(shopSeller)
    }
  })
})

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  orderInfoResponse(request, sender, sendResponse)
  orderBoughtTempResponse(request, sender, sendResponse)
  checkBlackListShopResponse(request, sender, sendResponse)
})

const checkBlackListShop = (shopname) => {
  window.chrome.runtime.sendMessage({ cmd: 'check_blacklistshop', value: shopname }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'check_blacklistshop', value: shopname })
      }, 2000)
    }
    console.log('检查店铺黑名单：' + response)
  })
}

const checkBlackListShopResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'check_blacklistshop_response') {
    // console.log(request.value)
    shopInBlackList = request.value.in
    if (request.value.in) {
      let reason = ''
      if (request.value.reason) {
        reason = '(' + request.value.reason + ')'
      }
      alert('【店铺黑名单】请勿在列入黑名单的店铺下单！' + reason)
    }
    // getOrdersFees(orderInfo)
    // let buyerOrder = getOrdersFees(request.value)
    sendResponse('ok')
  }
}

const orderInfoResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_orderinfo_response') {
    console.log(request.value)
    orderInfo = request.value
    // getOrdersFees(orderInfo)
    // let buyerOrder = getOrdersFees(request.value)
    sendResponse('ok')
  }
}

const orderBoughtTempResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'orderbought_temp_succeed') {
    console.log(request.value)
    console.log(request.text)
    if (!request.value) {
      alert('数据回传失败！' + request.text)
    } else {
      window.document.querySelector('.go-btn').style.display = ''
    }
  }
}

const getOrdersFees = (order) => {
  // console.log('triggered')
  // if ($('.order-order').length > 1) {
  //   alert('请单次下单一件商品！')
  //   window.history.go(-1)
  // } else {
    var postFee, itemUrl, num, buyerFee, shopSeller
    var tradePayment = oneKeyOrderInstance.payment
    var orderedPayedTotal = 0
    if (oneKeyOrderInstance.ordered) {
      oneKeyOrderInstance.ordered.filter((item) => {
        return !item.dismiss
      }).forEach((item) => {
        orderedPayedTotal += item.buyer_fee / 100
      })
    }
    let orderNum = oneKeyOrderInstance.orders.order.filter((item) => {
      return item.oid_str === orderInfo.oid
    })[0].num
    postFee = Math.round(parseFloat($('.select-price').text()) * 100, 0)
    itemUrl = $('.info-title').prop('href')
    num = $('input.amount').val()
    var realPay = $('.order-payInfo .realPay-price').text() || $('.realpay--price').text()
    buyerFee = Math.round(parseFloat(realPay) * 100, 0)
    shopSeller = $('.shop-seller a').text()
    console.log('tradePayment:' + tradePayment)
    console.log('orderedPayedTotal:' +orderedPayedTotal)
    console.log('postFee:' + (postFee / 100))
    console.log('buyerFee:' + (buyerFee / 100))
    console.log('orderNum:' + orderNum)
    console.log('num:' + num)
    console.log('shopSeller:' + shopSeller)
    if (tradePayment <= orderedPayedTotal + postFee / 100 + buyerFee / 100) {
      let r = confirm('【亏损预警】本订单可能产生亏损，确认下单么？')
      if (r !== true) {
        return false
      }
    }
    if (orderNum !== parseInt(num)) {
      let r = confirm('【数量预警】子订单商品数量不匹配，确认下单么？')
      if (r !== true) {
        return false
      }
    }
    // if (shopSeller === orderInfo.sellernick) {
    //   alert('【错误店铺】请勿在自己店铺下单！')
    //   return false
    // }
    // checkBlackListShop(shopSeller)
    // sleep(500)
    // if (shopInBlackList) {
    //   alert('【店铺黑名单】请勿在列入黑名单的店铺下单！')
    //   return false
    // }
    $('.order-anonymous label').click()
    return {
      tradeid: order.tradeid,
      tid: order.tid,
      oid: order.oid,
      num: num,
      buyerFee: buyerFee,
      buyUrl: itemUrl,
      buyerPostFee: postFee
    }
  // }
}
const getOrdersFeesOnload = (order) => {
  var postFee, itemUrl, num, buyerFee, shopSeller
  var tradePayment = oneKeyOrderInstance.payment
  var orderedPayedTotal = 0
  if (oneKeyOrderInstance.ordered) {
    oneKeyOrderInstance.ordered.filter((item) => {
      return !item.dismiss
    }).forEach((item) => {
      orderedPayedTotal += item.buyer_fee / 100
    })
  }
  let orderNum = oneKeyOrderInstance.orders.order.filter((item) => {
    return item.oid_str === orderInfo.oid
  })[0].num
  postFee = Math.round(parseFloat($('.select-price').text()) * 100, 0)
  itemUrl = $('.info-title').prop('href')
  num = $('input.amount').val()
  var realPay = $('.order-payInfo .realPay-price').text() || $('.realpay--price').text()
  buyerFee = Math.round(parseFloat(realPay) * 100, 0)
  shopSeller = $('.shop-seller a').text()
  console.log('tradePayment:' + tradePayment)
  console.log('orderedPayedTotal:' + orderedPayedTotal)
  console.log('postFee:' + (postFee / 100))
  console.log('buyerFee:' + (buyerFee / 100))
  console.log('orderNum:' + orderNum)
  console.log('num:' + num)
  console.log('shopSeller:' + shopSeller)
  if (tradePayment <= orderedPayedTotal + buyerFee / 100) {
    if ($('.order-payInfo .order-realPay').length) {
      $('.order-payInfo .order-realPay').after($('<h2 class=\'loss-alert\'>【亏损预警】预计亏损：¥' + (tradePayment - orderedPayedTotal - buyerFee / 100).toFixed(2) + '元</h2>'))
    } else {
      $('.order-payInfo').after($('<h2 class=\'loss-alert\'>【亏损预警】预计亏损：¥' + (tradePayment - orderedPayedTotal - buyerFee / 100).toFixed(2) + '元</h2>'))
    }
  } else {
    if ($('.order-payInfo .order-realPay').length) {
      $('.order-payInfo .order-realPay').after($('<h2 class=\'benefit-info\'>【利润】预计利润：¥' + (tradePayment - orderedPayedTotal - buyerFee / 100).toFixed(2) + '元</h2>'))
    } else {
      $('.order-payInfo').after($('<h2 class=\'benefit-info\'>【利润】预计利润：¥' + (tradePayment - orderedPayedTotal - buyerFee / 100).toFixed(2) + '元</h2>'))
    }
  }
  if (orderNum !== parseInt(num)) {
  }
  // $('.order-anonymous label').click()
  return {
    tradeid: order.tradeid,
    tid: order.tid,
    oid: order.oid,
    num: num,
    buyerFee: buyerFee,
    buyUrl: itemUrl,
    buyerPostFee: postFee
  }
}

const checkOriginalAddress = () => {
  if (!orderInfo) {
    alert('订单信息不存在！请重新下单！')
    return false
  }
  if (orderInfo.receiver.addressOriginal) {
    let r = confirm('注意：原始地址已发生变化！确定下单么？')
    if (r !== true) {
      return false
    }
  }
  try {
    let addressList = ''
    let addressSelected = ''
    let addressSelectedAreas = ''
    let addressSelectedDetail = ''
    let addressSelectedFullname = ''
    let fullArea = orderInfo.receiver.fullArea.split('/')
    if (window.location.host.toLowerCase().indexOf('tmall') < 0) {
      // 淘宝收款台
      // 先检测页面版本，.order-address对象如果有id="addressPC_1"则为风控的模式页面
      let orderAddressPC1Obj = $('.order-address#addressPC_1')
      if (orderAddressPC1Obj && orderAddressPC1Obj instanceof Array && orderAddressPC1Obj.length) {
        addressList = $('.order-address .address-list .addr-item-wrapper')
        addressSelected = $('.order-address .address-list .addr-item-wrapper.addr-selected')
        addressSelectedAreas = [
          addressSelected.find('.next-radio-label').find('span.provinceName').text().trim(),
          addressSelected.find('.next-radio-label').find('span.cityName').text().trim(),
          addressSelected.find('.next-radio-label').find('span.areaName').text().trim(),
          addressSelected.find('.next-radio-label').find('span.townName').text().trim()
        ]
        addressSelectedDetail = addressSelected.find('.next-radio-label').find('span.addressDetail').text().trim()
        // addressSelectedFullname = addressSelected.find('.next-radio-label').find('span.townName').text().trim()
      } else {
        addressList = $('.order-address .address-list li')
        addressSelected = addressList.first().find('label.addressInfo .user-address')
        addressSelectedAreas = addressSelected.find('span').eq(0).text().trim().split(' ')
        addressSelectedDetail = addressSelected.find('span').eq(1).text().trim()
        addressSelectedFullname = addressSelected.find('span').eq(3).text().trim()
      }
    } else {
      // 天猫收款台
      // 先检测页面版本，.order-address对象如果有id="addressPC_1"则为风控的模式页面
      let orderAddressPC1Obj = $('.order-address#addressPC_1')
      if (orderAddressPC1Obj && orderAddressPC1Obj instanceof Array && orderAddressPC1Obj.length) {
        addressList = $('.order-address .address-list .addr-item-wrapper')
        addressSelected = $('.order-address .address-list .addr-item-wrapper.addr-selected')
        addressSelectedAreas = [
          addressSelected.find('.addr-hd span').eq(0).text().trim(),
          addressSelected.find('.addr-hd span').eq(1).text().trim(),
          addressSelected.find('.addr-bd span').eq(0).text().trim(),
          addressSelected.find('.addr-bd span').eq(1).text().trim()
        ]
        addressSelectedDetail = addressSelected.find('.addr-bd span').eq(2).text().trim()
        // addressSelectedFullname = addressSelected.find('.next-radio-label').find('span.townName').text().trim()
      } else {
        addressList = $('.order-address .list .addr')
        addressSelected = addressList.first().find('div.inner')
        addressSelectedAreas = [
          addressSelected.find('.addr-hd span.prov').text().trim(),
          addressSelected.find('.addr-hd span.city').text().trim(),
          addressSelected.find('.addr-bd span.dist').text().trim(),
          addressSelected.find('.addr-bd span.town').text().trim()
        ]
        addressSelectedDetail = addressSelected.find('.addr-bd span.street').text().trim()
        addressSelectedFullname = addressSelected.find('.addr-hd span.name').text().trim()
      }
    }
    // console.log(addressSelectedAreas)
    // if (addressSelectedAreas.length < 3 || fullArea.length < 3) {
    //   alert('地址错误！请刷新页面重试!')
    //   return false
    // }
    if (fullArea[0].indexOf(addressSelectedAreas[0]) < 0 || fullArea[1].indexOf(addressSelectedAreas[1]) < 0 ||
      fullArea[2].indexOf(addressSelectedAreas[2]) < 0 || fullArea[3].indexOf(addressSelectedAreas[3]) < 0 ||
      addressSelectedDetail !== orderInfo.receiver.addressDetail.trim()) {
      let r = confirm('警告：当前收货地址与订单地址不一致！确定下单么？')
      if (r === true) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  } catch (e) {
    alert('地址错误！请刷新页面重试!1\r\n' + e.message)
    return false
  }
}
