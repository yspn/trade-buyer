'use strict'
/**
 * 淘宝商品详情页ContentScript
 * ===========================
 * 程序起点：get_cookies
 * ===========================
 * by: YSPN  2018.04.13
 */
var cookieArr = []
var addressAdded
var itemId = '' // 当前浏览商品ID
var historyBought = []
var userRole = 'employer'

window.onload = () => {
  cookieArr = []
  addressAdded = {}
  itemId = getQueryString('id')
  // console.log(itemId)
  window.chrome.runtime.sendMessage({ cmd: 'get_cookies' }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'get_cookies' })
      }, 2000)
    }
    console.log('获取Cookies：' + response)
  })
  window.chrome.runtime.sendMessage({ cmd: 'get_user_role' }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'get_user_role' })
      }, 2000)
    }
    console.log('获取Role：' + response)

  })
  window.chrome.runtime.sendMessage({ cmd: 'get_history_bought', value: itemId }, (response) => {
    // if (response !== 'ok') {
    //   window.setTimeout(function () {
    //     window.chrome.runtime.sendMessage({ cmd: 'get_history_bought', value: itemId })
    //   }, 2000)
    // }
    console.log('获取历史下单：' + response)
  })
}

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  cookieResponse(request, sender, sendResponse)
  orderInfoResponse(request, sender, sendResponse)
  historyBoughtResponse(request, sender, sendResponse)
  userRoleResponse(request, sender, sendResponse)
})

const cookieResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_cookies_response') {
    cookieArr = request.value
    window.chrome.runtime.sendMessage({ cmd: 'get_orderinfo' }, (response) => {
      if (response !== 'ok') {
        window.setTimeout(function () {
          window.chrome.runtime.sendMessage({ cmd: 'get_orderinfo' })
        }, 2000)
      }
      console.log('获取订单信息：' + response)
    })
    sendResponse('ok')
  }
}
const initHistoryBoughtWindow = () => {
  var container = document.createElement('div')
  container.id = 'oneKeyOrder_HistoryBought_container'
  container.className = '' // active 开启
  var icon = document.createElement('div')
  icon.className = 'historyBought-icon'
  icon.title = '查询总店历史下单'
  var iconText = document.createTextNode('查')
  icon.appendChild(iconText)
  container.appendChild(icon)
  var infoBox = document.createElement('div')
  infoBox.className = 'historyBought-wrapper'
  var orderSummary = document.createElement('div')
  orderSummary.className = 'historyBought-box'
  infoBox.appendChild(orderSummary)
  container.appendChild(infoBox)
  document.querySelector('body').appendChild(container)
  $('#oneKeyOrder_HistoryBought_container .historyBought-icon').on('click', function (e) {
    $('#oneKeyOrder_HistoryBought_container').toggleClass('active')
  })
  if (historyBought.length) {
    for (var j = 0; j < historyBought.length; j++) {
      var insertData =
        '<div class=\'oneKeyOrder_purchasedDetail\'>' +
          '<div class=\'oneKeyOrder_purchasePrice\'>' +
            '<span class=\'bold\'>' + (historyBought[j].buyer_fee / historyBought[j].num / 100).toFixed(2)  + '元</span>' +
            '<span>(邮费:' + historyBought[j].post_fee + '元)</span>' +
          '</div>' +
          '<div class=\'oneKeyOrder_purchaseNum\'><span class=\'bold\'>' + historyBought[j].times + '次</span></div>' +
          '<a class=\'oneKeyOrder_purchaseLink\' href=\'' + getLinkHref(historyBought[j].buy_url) + '\'>去看看</div>' +
        '</div>'
      $(insertData).appendTo($(orderSummary))
    }
  } else {
    $('<span>没有找到总店信息</span>').appendTo($(orderSummary))
  }
}
function getLinkHref (link) {
  let linkHref = link
  if (/^\d+$/.test(link)) {
    linkHref = 'https://item.taobao.com/item.htm?id=' + link
  }
  return linkHref
}
const historyBoughtResponse = async (request, sender, sendResponse) => {
  if (request.cmd === 'get_history_bought_response') {
    if (request.err) {
      console.log('获取历史下单信息失败！' + err.message)
    } else {
      let list = request.value
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
      historyBought = hisList
      console.log(request.value)
      initHistoryBoughtWindow()
    }
    sendResponse('ok')
  }
}

const userRoleResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_user_role_response') {
    userRole = request.value
    sendResponse('ok')
  }
}

const orderInfoResponse = (request, sender, sendResponse) => {
  if (request.cmd === 'get_orderinfo_response') {
    try {
      let orderFullInfo = null
      window.chrome.storage.local.get('one_key_order', function (store) {
        orderFullInfo = store.one_key_order
        let orderInfo = request.value
        let orderCurrent = orderFullInfo.orders.order.filter((item) => {
          return item.oid_str === orderInfo.oid
        })[0]
        selectNumber(orderCurrent.num)
        let skuPropertiesName = orderCurrent.sku_properties_name
        let properties = skuPropertiesName.split(';')
        properties.forEach((prop) => {
          let skuProperty = prop.substring(0, prop.indexOf(':'))
          let skuPropertyValue = prop.substr(prop.indexOf(':') + 1)
          console.log(skuProperty, skuPropertyValue)
          selectSku(skuProperty, skuPropertyValue)
        })
      })
    } catch (err) {
      alert('一键下单数据错误！\r\n详细:' + err.message)
    }
    // console.log(request.value)
    // getAddressListNew(cookieArr)
    // addAddressEntrance(request.value.receiver, cookieArr, (error, addressId) => {
    //   console.log(request.value.receiver)
    //   if (error) {
    //     alert('地址新增失败!' + error.message)
    //     addressAdded = {
    //       result: false,
    //       message: error.message
    //     }
    //     window.chrome.runtime.sendMessage({ cmd: 'set_addressadded', value: false })
    //   }
    //   console.log('地址新增成功。ID：' + addressId)
    //   addressAdded = {
    //     result: true,
    //     message: addressId
    //   }
    //   window.chrome.runtime.sendMessage({ cmd: 'set_addressadded', value: true })
    // })
    sendResponse('ok')
  }
}

// var skuMap = []
// var orderInfo
// window.setTimeout(function () {
//   window.chrome.storage.local.get('one_key_order', function (store) {
//     orderInfo = store.one_key_order
//     if (orderInfo) {
//       window.chrome.runtime.sendMessage({ cmd: 'add_address', address: orderInfo.receiver }, function (response) {
//         console.log('收到来自后台的回复：' + response)
//       })
//     }
//   })
// }, 1000)
function getAddressListNew (cookiesValue, callback) {
  try {
    var m5Token = cookiesValue.filter((item) => {
      return item.name === '_m_h5_tk'
    })[0].value.split('_')[0]
    var i = new Date().getTime()
    var appKey = '12574478'
    var data = '{}' // {"sn":"suibianchuan"}
    var md5 = hex_md5(m5Token + '&' + i + '&' + appKey + '&' + data)
    console.log(m5Token)
    $.ajax({
      url: 'https://h5api.wapa.taobao.com/h5/mtop.taobao.mbis.getdeliveraddrlist/1.0/?jsv=2.4.2&appKey=12574478&t=' + i + '&sign=' + md5 + '&api=mtop.taobao.mbis.getDeliverAddrList&v=1.0&ecode=1&needLogin=true&dataType=jsonp&type=jsonp&callback=mtopjsonp3&data=%7B%7D',
      method: 'GET',
      success: function (data, textStatus, jqXHR) {
        console.log(data)
      }
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function addAddressEntrance (address, cookiesValue, callback) {
  try {
    var cookies = []
    var cookies_raw = cookiesValue.filter((item) => {
      return item.domain === '.taobao.com'
    })
    for (var i = 0; i < cookies_raw.length; i++) {
      cookies.push({
        'name': cookies_raw[i].name,
        'value': cookies_raw[i].value,
        'domain': cookies_raw[i].domain,
        'path': cookies_raw[i].path,
        'httponly': cookies_raw[i].httpOnly,
        'secure': cookies_raw[i].secure,
        'expires': cookies_raw[i].expirationDate
      })
    }

    getAddressList((errorAddr, addressList, newAddressForm) => {
      if (errorAddr) {
        throw errorAddr
      }
      window.chrome.storage.local.set({'address_list': addressList}, function () {
        window.chrome.storage.local.get('address_list', function (oldAddressList) {
          var newAddr = []
          for (var i = 0; i < addressList.length; i++) {
            for (var j = 0; j < oldAddressList.length; j++) {
              if (oldAddressList[j].id === addressList[i].id) {
                newAddr.push(addressList[i])
              }
            }
          }
        })
        // if (addressList.length >= 10) {
        //   deleteAddresses(addressList, function () {
        //     // getAddressList()
        //   })
        // }
        deleteAddresses(addressList, function () {
          // 修改默认地址模式
          // editDefaultAddress(addressList, address, newAddressForm, function (error, exist) { // 地址ID
          //   if (error) {
          //     throw error
          //   } else {
          //     if (callback) {
          //       callback(null, exist)
          //     }
          //     return exist
          //   }
          // })
          addDefaultAddress(address, newAddressForm, function (error, exist) { // 地址ID
            if (error) {
              throw error
            } else {
              if (callback) {
                callback(null, exist)
              }
              return exist
            }
          })
        })
      })
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function getAddressList (callback) {
  try {
    var address_list = []
    var new_address_form = {}
    $.ajax({
      url: 'https://member1.taobao.com/member/fresh/deliver_address.htm',
      method: 'GET',
      success: function (data, textStatus, jqXHR) {
        var title = $(data.match(/<title>\s*.*\s*<\/title>/g)[0])[0].innerText
        if (data && title.indexOf('收货地址') >= 0) {
          var new_addr_form = $(data).find('#J_FormDeliver')
          new_address_form = {
            actionUrl: 'https://member1.taobao.com/member/fresh/deliver_address.htm',
            formBody: {
              action: new_addr_form.find('input[name=\'action\']').val(),
              event_submit_do_save: new_addr_form.find('input[name=\'event_submit_do_save\']').val(),
              from: new_addr_form.find('input[name=\'from\']').val(),
              isFrame: new_addr_form.find('input[name=\'isFrame\']').val(),
              token: new_addr_form.find('input[name=\'token\']').val(),
              lang: new_addr_form.find('input[name=\'lang\']').val(),
              _tb_token_: new_addr_form.find('input[name=\'_tb_token_\']').val(),
              id: new_addr_form.find('input[name=\'id\']').val(),
              x: new_addr_form.find('input[name=\'x\']').val(),
              y: new_addr_form.find('input[name=\'y\']').val(),
              reurl: new_addr_form.find('input[name=\'reurl\']').val(),
              country: new_addr_form.find('input[name=\'country\']').val(), // custom
              prov: new_addr_form.find('input[name=\'prov\']').val(), // custom
              provExt: new_addr_form.find('input[name=\'provExt\']').val(), // custom
              city: new_addr_form.find('input[name=\'city\']').val(), // custom
              area: new_addr_form.find('input[name=\'area\']').val(), // custom
              town: new_addr_form.find('input[name=\'town\']').val(), // custom
              addressDetail: new_addr_form.find('textarea[name=\'addressDetail\']').val(), // custom
              post: new_addr_form.find('input[name=\'post\']').val(), // custom
              fullName: new_addr_form.find('input[name=\'fullName\']').val(), // custom
              mobile: new_addr_form.find('input[name=\'mobile\']').val(), // custom
              phoneSection: new_addr_form.find('input[name=\'phoneSection\']').val(), // 固话区号,custom
              phoneCode: new_addr_form.find('input[name=\'phoneCode\']').val(), // custom
              phoneExt: new_addr_form.find('input[name=\'phoneExt\']').val(), // 固话分机,custom
              defaultAddress: new_addr_form.find('input[name=\'defaultAddress\']').val() // 是否为默认
            }
          }
          var address_list_temp = $(data).find('.tbl-deliver-address table.tbl-main tbody tr:gt(0)')
          $(address_list_temp).each(function () {
            address_list.push({
              id: $(this).find('td:eq(5)').find('a.del').prop('href').split('?')[1].split('&').filter(function (query) {
                return query.indexOf('id') === 0
              })[0].split('=')[1],
              name: $(this).find('td:eq(0)').text().trim(),
              district: $(this).find('td:eq(1)').text().trim(),
              address: $(this).find('td:eq(2)').text().trim(),
              postcode: $(this).find('td:eq(3)').text().trim(),
              tel: $(this).find('td:eq(4)').text().trim(),
              editUrl: 'https://member1.taobao.com' + $(this).find('td:eq(5)').find('a:first').attr('href'),
              deleteUrl: 'https://member1.taobao.com' + $(this).find('td:eq(5)').find('a.del').attr('href'),
              isDefault: $(this).find('td:eq(6)').text().indexOf('默认地址') >= 0
            })
          })
          if (callback) {
            callback(null, address_list, new_address_form)
          }
        } else {
          alert('请先登录淘宝账号。')
          window.location.href = 'https://login.taobao.com/member/login.jhtml?redirectURL=' + window.location.href
          // window.chrome.runtime.sendMessage({ cmd: 'redirect_taobao_login', redirect_url: window.location.href }, function () {})
        }
      }
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function findExistingAddress (error, addressList, addr, callback) {
  if (error) {
    if (callback) {
      callback(error)
    }
    return error
  }
  var exist = addressList.filter((item) => {
    return item.name === addr.fullName &&
      item.address === addr.addressDetail &&
      item.tel === '86-' + addr.mobile.substr(0, 2) + '*******' + addr.mobile.substr(addr.mobile.length - 2, 2)
  })
  if (exist.length) {
    return exist[0]
  }
  return null
}

function editDefaultAddress (addressList, addr, form, callback) {
  try {
    var defaultAddr = addressList.filter((address) => {
      return address.isDefault === true
    })
    if (defaultAddr.length > 0) {
      console.log('找到默认地址: ' + defaultAddr[0].id)
      form.formBody.id = defaultAddr[0].id
    }
    form.formBody.country = addr.country
    form.formBody.prov = addr.prov
    form.formBody.provExt = addr.provExt
    form.formBody.city = addr.city
    form.formBody.area = addr.area
    form.formBody.town = addr.town
    form.formBody.addressDetail = urlencode(addr.addressDetail, 'gbk')
    form.formBody.post = addr.post
    form.formBody.fullName = urlencode(addr.fullName, 'gbk')
    form.formBody.mobile = addr.mobile
    form.formBody.phoneSection = addr.phoneSection
    form.formBody.phoneCode = addr.phoneCode
    form.formBody.phoneExt = addr.phoneExt
    form.formBody.defaultAddress = 'on'
    $.ajax({
      url: form.actionUrl,
      method: 'POST',
      processData: false,
      contentType: 'application/x-www-form-urlencoded; charset=GBK',
      data: setQueryConfig(form.formBody),
      success: function (data) {
        window.chrome.storage.local.set({ 'address_new': defaultAddr[0] })
        if (callback) {
          callback(null, defaultAddr[0])
        }
        return defaultAddr[0]
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        // 状态码
        console.log(XMLHttpRequest.status)
        // 状态
        console.log(XMLHttpRequest.readyState)
        // 错误信息
        console.log(textStatus)
        alert('地址修改失败！')
        throw new Error(textStatus)
      }
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function addDefaultAddress (addr, form, callback) {
  try {
    getAddressSuggestion(addr.prov, addr.city, addr.addressDetail, function (code) {
      let area = addr.area
      let town = addr.town
      if (code && code.split('_').length) {
        area = code.split('_')[2]
        town = code.split('_')[3]
      }
      form.formBody.country = addr.country
      form.formBody.prov = addr.prov
      form.formBody.provExt = addr.provExt
      form.formBody.city = addr.city
      form.formBody.area = area
      form.formBody.town = town
      form.formBody.addressDetail = urlencode(addr.addressDetail, 'gbk')
      form.formBody.post = addr.post
      form.formBody.fullName = urlencode(addr.fullName, 'gbk')
      form.formBody.mobile = addr.mobile
      form.formBody.phoneSection = addr.phoneSection
      form.formBody.phoneCode = addr.phoneCode
      form.formBody.phoneExt = addr.phoneExt
      form.formBody.defaultAddress = 'on'
      $.ajax({
        url: form.actionUrl,
        method: 'POST',
        processData: false,
        contentType: 'application/x-www-form-urlencoded; charset=GBK',
        data: setQueryConfig(form.formBody),
        success: function (data) {
          window.chrome.storage.local.set({ 'address_new': addr })
          if (callback) {
            callback(null, addr)
          }
          return addr
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          // 状态码
          console.log(XMLHttpRequest.status)
          // 状态
          console.log(XMLHttpRequest.readyState)
          // 错误信息
          console.log(textStatus)
          alert('地址新增失败！')
          throw new Error(textStatus)
        }
      })
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function deleteAddress (id, addressList, callback) {
  try {
    var deleteUrl = addressList[addressList.length - 1].deleteUrl
    if (id) {
      deleteUrl = addressList.filter((item, index) => {
        return item.id === id
      })[0].deleteUrl
    }
    $.ajax({
      url: deleteUrl,
      method: 'GET',
      success: function (data) {
        console.log('删除[id:' + id + ']地址成功！')
        if (callback) {
          callback(null)
        }
      }
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function deleteAddresses (addressList, callback) {
  try {
    addressList.forEach((address) => {
      deleteAddress(address.id, addressList)
    })
    if (callback) {
      callback()
    }
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return err
  }
}

function getAddressSuggestion (l1, l2, address, callback) {
  try {
    $.ajax({
      url: 'https://lsp.wuliu.taobao.com/locationservice/addr/validateAddressNew.do?l1=' + l1 + '&l2=' + l2 + '&addr=' + encodeURI(address) + '&lang=zh-S',
      method: 'GET',
      success: function (res) {
        console.log(res)
        let code
        let data = res.trim()
        try {
          console.log(data.substring(9, data.length - 2))
          let json = JSON.parse(data.substring(9, data.length - 2))
          code = json.code
        } catch (err) {
          console.log(err)
        }
        if (callback) {
          callback(code)
        }
        return code
      }
    })
  } catch (err) {
    if (callback) {
      callback(err)
    }
    return false
  }
}

function selectSku (skuProperty, skuName) {
  let skuProperties = $('#J_isku .J_Prop.tb-prop')
  skuProperties.each(function () {
    let property = $(this)
    let pName = $(this).find('.tb-property-type').text().trim()
    if (pName === skuProperty) {
      let propSelections = $(this).find('dd ul li')
      propSelections.each(function () {
        let propLi = $(this)
        if (propSelections.length > 1 && propLi.find('a span').text().trim() === skuName) {
          propLi.click()
        }
      })
    }
  })
}

function selectNumber (num) {
  $('#J_IptAmount').val(num)
}
