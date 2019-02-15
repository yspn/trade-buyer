'use strict'

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,      // 月份 
    'd+': this.getDate(),           // 日 
    'h+': this.getHours(),          // 小时 
    'm+': this.getMinutes(),        // 分 
    's+': this.getSeconds(),        // 秒 
    'q+': Math.floor((this.getMonth() + 3) / 3),  // 季度 
    'S': this.getMilliseconds()                   // 毫秒 
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return fmt
}

const sleepES6 = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const setQueryConfig = (queryConfig) => {
  var _str = ''
  for (var o in queryConfig) {
    if (queryConfig[o] !== -1) {
      _str += o + '=' + queryConfig[o] + '&'
    }
  }
  _str = _str.substring(0, _str.length - 1)
  return _str
}

const getQueryString = (name, url) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r
  if (url) {
    r = url.substr(url.indexOf('?') + 1).match(reg)
  } else {
    r = window.location.search.substr(1).match(reg)
  }
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

/**
 * 淘宝地址敏感字过滤处理程序
 * @param {String} address 详细地址
 */
const addressDetailFilter = (address) => {
  let cuntaoReg = {
    reg: /\(\w*:\d*\)/, // (FJQG032:18859735035)
    method: 'space'
  }
  let cuntaoNameReg = {
    reg: '农村淘宝',
    method: 'replace',
    replaceStr: '淘宝农村'
  }
  let cunXiaoErReg = {
    reg: '村小二',
    method: 'replace',
    replaceStr: '小二'
  }
  let cainiaoReg = {
    reg: '菜鸟',
    method: 'delete'
  }
  let regs = [
    cuntaoReg,
    cuntaoNameReg,
    cunXiaoErReg,
    cainiaoReg
  ]
  regs.forEach((reg) => {
    let regIndex = address.search(reg.reg)
    if (regIndex > -1) {
      if (reg.method === 'delete') {
        address = address.replace(reg.reg, '')
      } else if (reg.method === 'replace') {
        address = address.replace(reg.reg, reg.replaceStr || '')
      } else if (reg.method === 'space') {
        address.match(reg.reg).forEach((item) => {
          let itemLength = item.length
          let insertIndex = 1 // 随机插入空格位置
          if (itemLength > 3) {
            insertIndex = Math.round(Math.random() * (itemLength - 2), 0) // 第一个、最后一个字符不添加空格
            let replaceStr = item.substr(0, insertIndex) + ' ' + item.substr(insertIndex)
            address = address.replace(item, replaceStr)
          } else {
            address = address.replace(item, item.substr(0, 1) + ' ' + item.substr(1))
          }
        })
      }
    }
  })
  return address
}

const focusOrCreateTab = (url, refresh) => {
  if (refresh === undefined || refresh === null) {
    refresh = false
  }
  window.chrome.windows.getAll({ 'populate': true }, (windows) => {
    var existingTab = null
    for (var i in windows) {
      var tabs = windows[i].tabs
      for (var j in tabs) {
        var tab = tabs[j]
        if (tab.url.indexOf(url) > -1) {
          existingTab = tab
          break
        }
      }
    }
    if (existingTab) {
      if (refresh) {
        window.chrome.tabs.reload(existingTab.id)
      } else {
        window.chrome.tabs.update(existingTab.id, { 'highlighted': true })
      }
    } else {
      window.chrome.tabs.create({ 'url': url, 'active': true })
    }
  })
}

/**
 * 转换为Unicode
 * @param {*} str utf8字符串
 */
const encodeUnicode = (str) => {
  var res = []
  for (var i = 0; i < str.length; i++) {
    res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4)
  }
  return '\\u' + res.join('\\u')
}

/**
 * Unicode解码
 * @param {string} str Unicode字符串
 */
const decodeUnicode = (str) => {
  str = str.replace(/\\/g, '%')
  return unescape(str)
}

/**
 * js休眠
 * @param {*} delay 休眠时间
 */
const sleep = (delay) => {
  var start = (new Date()).getTime()
  while ((new Date()).getTime() - start < delay) {
    continue
  }
}

/**
 * 对当前活动Tab页面ContentScript发消息
 * @param {*} message 消息
 * @param {Function} callback 回调函数
 */
const sendMessageToCurrentContentScript = (message, callback) => {
  window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    window.chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      if (callback) callback(response)
    })
  })
}

/**
 * 对指定URL PATTERN页面ContentScript发消息
 * @param {string} targetUrl 目标页面URL PATTERN
 * @param {*} message 消息
 * @param {Function} callback 回调函数
 */
const sendMessageToContentScript = (targetUrl, message, callback) => {
  window.chrome.windows.getAll({ 'populate': true }, function (windows) {
    var existingTab = null
    for (var i in windows) {
      var tabs = windows[i].tabs
      for (var j in tabs) {
        var tab = tabs[j]
        if (tab.url.indexOf(targetUrl) > -1) {
          existingTab = tab
          break
        }
      }
    }
    if (existingTab) {
      window.chrome.tabs.sendMessage(existingTab.id, message, (response) => {
        if (callback) callback(response)
      })
    } else {
      window.chrome.tabs.create({ 'url': targetUrl, 'active': true }, function (newtab) {
        setTimeout(function () {
          window.chrome.tabs.sendMessage(newtab.id, message, (response) => {
            if (callback) callback(response)
          })
        }, 2000)
      })
    }
  })
}

module.exports = {
  sleepES6,
  setQueryConfig,
  getQueryString,
  addressDetailFilter,
  focusOrCreateTab,
  encodeUnicode,
  decodeUnicode,
  sendMessageToCurrentContentScript,
  sendMessageToContentScript
}
