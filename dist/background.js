

window.chrome.browserAction.onClicked.addListener((tab) => {
    focusOrCreateTab(window.chrome.extension.getURL('/') + 'controls.html')
  })
  
  window.chrome.webRequest.onCompleted.addListener((details) => {
    var orderNumber = ''
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name === 'at_ctbid') {
        orderNumber = details.responseHeaders[i].value.split(',')[0]
        break
      }
    }
    console.log('order number:' + orderNumber)
  }, {urls: ['*://buy.tmall.com/auction/confirm_order.htm*', '*://buy.taobao.com/auction/confirm_order.htm*']}, ['responseHeaders'])
  // window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   listenGetCookies(request)
  //   sendResponse('ok')
  // })
  