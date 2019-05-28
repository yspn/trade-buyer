var skus = null;

function getHubConfigs () {
  var hub = window.Hub;
  if (hub) {
    return hub.config.config.sku;
  } else {
    return false;
  }
}

function sendSkusToBackground () {
  window.postMessage({'skus': skus}, '*');
}

function documentReady () {
  if (document.readyState === 'complete') {
    skus = getHubConfigs();
  }
}

document.onreadystatechange = documentReady;