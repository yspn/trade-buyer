var sku = null;

function getHubConfigs () {
  var hub = window.Hub;
  console.log(hub)
  if (hub) {
    return hub.config.config.sku.valItemInfo;
  } else {
    return false;
  }
}

function sendSkusToBackground () {
  window.postMessage({'sku': sku}, '*');
}

function documentReady () {
  if (document.readyState === 'complete') {
    sku = getHubConfigs();
    sendSkusToBackground();
  }
}

document.onreadystatechange = documentReady;