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
  window.chrome.runtime.sendMessage({ cmd: 'get_orderinfo' }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'get_orderinfo' })
      }, 2000)
      alert('选品订单信息失败！请刷新本页面。')
    }
    console.log('获取订单信息：' + response)
  })
}

$(document).ready(function () {
  window.chrome.storage.local.get('one_key_order', function (store) {
    oneKeyOrderInstance = store.one_key_order
    $('.order-item').each(function (orderIndex) {
      var cur = $(this)
      $(this).append($('<select class=\'oneKeyOrder_oriOrderItemSelect\'><option>不选择</option></select>'))
      for (var i = 0; i < oneKeyOrderInstance.orders.order.length; i++) {
        cur.find('.oneKeyOrder_oriOrderItemSelect').append($('<option value=\'' + oneKeyOrderInstance.orders.order[i].oid_str + '\' ' + (i === orderIndex ? 'selected' : '') + '>' + '[' + (i + 1) + ']' + oneKeyOrderInstance.orders.order[i].title + '(' + oneKeyOrderInstance.orders.order[i].num + '件,¥' + oneKeyOrderInstance.orders.order[i].payment + ')' + '</option>'))
      }
    })
    $('body').delegate('.go-btn', 'click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      buyerOrder = getOrdersFees(orderInfo)
      if (buyerOrder) {
        window.chrome.runtime.sendMessage({ cmd: 'set_orderbought_temp', value: buyerOrder }, (response) => {
          if (response !== 'ok') {
            window.setTimeout(function () {
              window.chrome.runtime.sendMessage({ cmd: 'set_orderbought_temp', value: buyerOrder })
            }, 2000)
            alert('选品信息暂存失败！请刷新本页面。')
          }
          console.log('选品信息暂存：' + response)
        })
      }
      console.log(buyerOrder)
      if (buyerOrder) {
        $('body').undelegate('.go-btn', 'click')
        setTimeout(function () {
          $('.order-anonymous label').click()
          document.querySelectorAll('a.go-btn')[0].click()
        }, 500)
      }
    })
  })
  $('.order-order').each(function () {
    let shopSeller = $(this).find('.shop-seller a').text()
    let shopName = $(this).find('.shop-url').text()
    console.log(shopSeller)
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
    console.log(request.value)
    shopInBlackList = request.value
    if (request.value) {
      alert('【店铺黑名单】请勿在列入黑名单的店铺下单！')
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
    }
  }
}

const getOrdersFees = (order) => {
  // console.log('triggered')
  if ($('.order-order').length > 1) {
    alert('请单次下单一件商品！')
    window.history.go(-1)
  } else {
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
    postFee = Math.round(parseFloat($('.order-order').find('.select-price').text()) * 100, 0)
    itemUrl = $('.order-order').find('.info-title').prop('href')
    num = $('.order-order').find('input.amount').val()
    buyerFee = Math.round(parseFloat($('.order-payInfo .realPay-price').text()) * 100, 0)
    shopSeller = $('.order-order').find('.shop-seller a').text()
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
  }
}
