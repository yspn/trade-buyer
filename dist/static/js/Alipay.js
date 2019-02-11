/**
 * 进入支付宝获取订单编号之后弹出结果ContentScript
 * ===========================
 * 程序起点：
 * ===========================
 * by: YSPN  2018.04.23
 */

$(document).ready(function () {
  window.chrome.runtime.sendMessage({ cmd: 'get_onekey_order_success' }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'get_onekey_order_success' })
      }, 2000)
    }
    console.log('询问下单是否成功：' + response)
  })
})

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'get_onekey_order_success_response') {
    if (request.value) {
      alert('一键下单成功！')
    } else {
      alert('一键下单失败！')
    }
  }
})
