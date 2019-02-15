/**
 * 跟踪UC浏览器商品物流信息ContentScript
 * ===========================
 * 程序起点：
 * ===========================
 * by: YSPN  2018.04.23
 */

window.onload = function () {
  alert('uc msg captured!')
  let doc = document.replace(/\s/g, '')
  let json = doc.match(/jsonp313\(\{[\s\S]*\}\)/)[0]
  json = json.substr(9, json.length - 10)
  window.chrome.runtime.sendMessage({ cmd: 'uc_logistic_captured', value: JSON.parse(json) }, (response) => {
    if (response !== 'ok') {
      window.setTimeout(function () {
        window.chrome.runtime.sendMessage({ cmd: 'uc_logistic_captured', value: JSON.parse(json) })
      }, 2000)
    } else {
      console.log('截获UC物流信息：' + response)
    }
  })
}