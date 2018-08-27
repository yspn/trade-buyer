'use strict'

$(document).ready(function () {
  getOneKeyOrderInfo(function () {
    var windowWidth = window.innerWidth
    var mainWidth = $('.screen-outer').width()
    var plunginWith = (windowWidth - mainWidth) / 2 - 24
    if (plunginWith > 280) {
      $('#oneKeyOrder_orderInfo').attr('style', 'width:' + plunginWith + 'px;')
    }
  })
  setTimeout(function () {
    if (addressAdded && addressAdded.result) {
      $('#oneKeyOrder_orderReceiver').addClass('added')
    }
  }, 5000)
})

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getTransLinkResponse(request, sender, sendResponse)
})

const getTransLinkResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_translink_response') {
    if (request.value && request.value.length) {
      window.open(request.value)
    } else {
      alert('转链失败！' + request.message)
    }
    sendResponse('ok')
  }
}

function getOneKeyOrderInfo (callback) {
  window.chrome.storage.local.get('one_key_order', function (store) {
    var info = store.one_key_order
    console.log(info)
    if (info) {
      var container = document.createElement('div')
      container.id = 'oneKeyOrder_container'
      container.className = 'active'
      var icon = document.createElement('img')
      icon.id = 'oneKeyOrder_icon'
      icon.title = '一键下单'
      icon.width = 32
      icon.height = 32
      // icon.src = chrome.extension.getURL('/logo.png')
      icon.src = 'http://store.tao11.la/favicon.ico'
      container.appendChild(icon)
      var infoBox = document.createElement('div')
      infoBox.id = 'oneKeyOrder_orderInfo'
      var orderSummary = document.createElement('div')
      orderSummary.id = 'oneKeyOrder_orderSummary'
      infoBox.appendChild(orderSummary)
      var orderReceiver = document.createElement('div')
      orderReceiver.id = 'oneKeyOrder_orderReceiver'
      infoBox.appendChild(orderReceiver)
      var foldUpTrigger = document.createElement('div')
      foldUpTrigger.id = 'oneKeyOrder_foldUpTrigger'
      foldUpTrigger.innerHTML = 'x'
      container.appendChild(infoBox)
      document.querySelector('body').appendChild(container)
      $('#oneKeyOrder_icon').on('click', function (e) {
        $('#oneKeyOrder_container').toggleClass('active')
      })
      var base64Imgs = []
      for (var i = 0; i < info.orders.order.length; i++) {
        var orderedItem = $('<div class=\'oneKeyOrder_orderItem selected\'>' +
          '<div class=\'oneKeyOrder_orderTitle\'>' +
            '<b>【子订单' + (i + 1) + '】</b>' +
            info.orders.order[i].title +
            '<a href=\'https://s.taobao.com/search?q=' + info.orders.order[i].title + '&s_from=newHeader&ssid=s5-e&search_type=item&sourceId=tb.item\' class=\'oneKeyOrder_searchTitle_trigger\'>检索标题</a>' +
          '</div>' +
          '<div class=\'oneKeyOrder_orderThumb\'>' +
            '<div class=\'oneKeyOrder_searchImage_mask\'>Loading...</div>' +
            '<img src=\'' + info.orders.order[i].pic_path + '\'>' +
            // '<a class=\'oneKeyOrder_searchImage_trigger\' data-orderid=\'' + i + '\'>一键搜图</a>' +
          '</div>' +
          '<div class=\'oneKeyOrder_orderRight\'>' +
          '<div class=\'oneKeyOrder_orderDetail\'>' + info.orders.order[i].sku_properties_name + '</div>' +
          '<span class=\'oneKeyOrder_orderNum\'>数量:' + info.orders.order[i].num + '件</span>' +
          '<span class=\'oneKeyOrder_orderTotalFee\'>¥' + info.orders.order[i].total_fee + '</span>' +
          '</div>' +
          '<div class=\'oneKeyOrder_purchased\' data-oid=' + info.orders.order[i].oid_str + '>' +
          '</div>' +
          '</div>').data('order', info.orders.order[i]).appendTo($(orderSummary))
        if (info.orders.order[i].history_purchase) {
          for (var j = 0; j < info.orders.order[i].history_purchase.length; j++) {
            var insertData =
              '<div class=\'oneKeyOrder_purchasedDetail\'>' +
                '<div class=\'oneKeyOrder_purchasePrice\'>' +
                  '<span class=\'bold\'>' + (info.orders.order[i].history_purchase[j].buyer_fee / info.orders.order[i].history_purchase[j].num / 100).toFixed(2)  + '元</span>' +
                  '<span>(邮费:' + info.orders.order[i].history_purchase[j].post_fee + '元)</span>' +
                '</div>' +
                '<div class=\'oneKeyOrder_purchaseNum\'><span class=\'bold\'>' + info.orders.order[i].history_purchase[j].num + '件</span></div>' +
                '<a class=\'oneKeyOrder_purchaseLink\' href=\'' + info.orders.order[i].history_purchase[j].buy_url + '\'>去下单</div>' +
              '</div>'
            $(insertData).appendTo($(orderedItem))
          }
          // let image = new Image()
          // image.src = info.orders.order[i].pic_path
          // image.setAttribute('crossOrigin', 'Anonymous')
          // image.onload = function () {
          //   let base64 = getBase64Image(image)
          //   base64Imgs.push(base64)
          //   console.log(base64Imgs)
          // }
        }
        // $('.oneKeyOrder_searchImage_trigger').click(function () {
        //   let orderid = $(this).data('orderid')
        //   $(this).parent().find('.oneKeyOrder_searchImage_mask').show()
        //   let base64 = base64Imgs[orderid]
        //   uploadImage(base64)
        // })
      }
      $('<div id=\'oneKeyOrder_receiverName\'><span>' + info.receiver.fullName + '</span>' +
        '<span id=\'oneKeyOrder_receiverMobile\'>' + info.receiver.mobile + '</span>' +
        '</div>' +
        '<div id=\'oneKeyOrder_receiverAddress\'>' +
        '<div id=\'oneKeyOrder_receiverArea\'>' + info.receiver.fullArea + '</div>' +
        info.receiver.addressDetail +
        '</div>'
      ).appendTo($(orderReceiver))
      $('<div id=\'oneKeyOrder_btns\'>' +
        '<div id=\'oneKeyOrder_translinkBtn\'>转链当前页面</div>' +
        '<div id=\'oneKeyOrder_clearBtn\'>取消一键下单</div>' +
        '</div>'
      ).appendTo($(infoBox))
      $('#oneKeyOrder_clearBtn').on('click', function (e) {
        window.chrome.storage.local.set({ 'one_key_order': null }, function () {
          $(container).remove()
        })
      })
      $('#oneKeyOrder_translinkBtn').on('click', function (e) {
        getTransLink(window.location.href)
      })
      $('.oneKeyOrder_purchaseLink').on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        getTransLink($(this).prop('href'), store.one_key_order.shopid)
      })
      if (callback) {
        callback()
      }
    }
  })
}

function getBase64Image (img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  var dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

function dataURItoBlob (base64Data) {
  var byteString
  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64Data.split(',')[1])
  } else {
    byteString = unescape(base64Data.split(',')[1])
  }
  var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {type: mimeString})
}

function uploadImage (imageBase64) {
  var blob = dataURItoBlob(imageBase64) // 上一步中的函数
  var canvas = document.createElement('canvas')
  var dataURL = canvas.toDataURL('image/jpeg', 0.5)
  var fd = new FormData()
  fd.append('imgfile', blob, 'image.png')

  $.ajax({
    url: 'https://s.taobao.com/image',
    method: 'POST',
    processData: false, // 必须
    contentType: false, // 必须
    dataType: 'json',
    data: fd,
    success (data) {
      console.log(data)
      if (data.url && data.name) {
        $('.oneKeyOrder_searchImage_mask').text('ok')
        $('.oneKeyOrder_searchImage_mask').hide()
        window.location.href = 'https://s.taobao.com/search?q=&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_' + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + '&ie=utf8&tfsid=' + data.name + '&app=imgsearch'
      }
    }
  })
}

function getTransLink (url, shopid, callback) {
  window.chrome.runtime.sendMessage({ cmd: 'get_translink', value: url, shopid: shopid })
}
