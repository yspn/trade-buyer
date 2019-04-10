var getElementLeft = function (e) {
    for (var t = e.offsetLeft, n = e.offsetParent; null !== n;)
        t += n.offsetLeft,
            n = n.offsetParent;
    return t
}
var getElementTop = function (e) {
    for (var t = e.offsetTop, n = e.offsetParent; null !== n;)
        t += n.offsetTop,
            n = n.offsetParent;
    return t
}
var calcSessionId = function (e) {
    return parseInt(e.offsetWidth + "a" + e.offsetHeight + "a" + getElementLeft(e) + "a" + getElementTop(e), 11).toString(16)
}

calcSessionId(document.getElementById("nc_1_n1t"))
// "5e701e77d00d"

// win._n = "115#1r4yBf1O1TZLl1rfGCFm1CsoE51GBaFt1g4phZDwy5nlVkC1fxZ+1Zruv11CI+GUhaU8jxV2aTC9yzEQjDAkeKT8ukNQiQWWhEz4OkNcZLpAHirSpIfyeK1GzWNQiQXRUWzbvBNDaGwfyW/8pU2deKg8ykNQiFMJhUU4AWNcaB6fyzFQgSckTRDv5Fh8kcX8HHc9N/okKbQNr6R0e4lv1wwlhGwDiSV3tPPG5uBgw/VNoSnU5/4UHCTT3vYSRy5chaZCMK8bd7OC//tERMrxITE46sfEPt7XN/iyg9sUqp9DhlS4wURtBNZPDBidnwllwZkhE7LyvQnJrB1lpQPq0goZQ5r45X+IMAfJrs5DNLAFRtNUNXk+k1POTSMu4t1HBx2mpy6oK5rdlMcmwDodU5FaA9hzkDSmiNwxc0rAlin94SEfyzDBkl5yjBl86KKZ3Fe71qRqNC8jble7kUOKUVmjaTjvapoVrx7jxVtsFiUS1+N17HzzGV1/Yv5hx/M3YfAGo54nmf11d0LLx8ZdC5UHgof5z/TzOzDJo+OEF0+ReNqdpofO7NCHxFVLR+4vDFYIkieu/SChX8/pCW9ck5bQtEmWflKdDUkpEUqCCDvSPHb0wGZli20WZv6Y/XjWxGc51YLmSrX0FgNgfrri9bH7LgSSxxL23W+6nvFl2nJnDgOBCGU9RIQA1MpCgoffprKwXVpPnuLTwm+baOxGPCYowBQ87YFt0/W91peZmN4SghQVv5DGCnLkGhefb8Aw5XuktK8JRomnPr+3JqbOHDnJ90hmwI2VR9Bt3tTvLYz3BjXFnkPrn23RnD7YWT9SNycY1Bz7MWyL2tNkMkdge1JM5PCsVmGcvYLWX+7mhYZJ/XYPgpMN/DrjRNBirrPTenQ13Y4NT45tGqQaVck959cs4vgb/+0GTnLPDpONYaiuiFVmRE2ege24l07cva40Vupg3WYk2eZmf3n8b3/nxd//xpi7xPwcKRATNqB7Iii2ozGelQKwo4RXOEpiqvqFW60NVQbS4zAhe9V2pphThTS1Da12eKfps6FeTEtctob8i8VU/sDziKOwHQCvS19ez1RIpm441IWyHXC0upd3Ae6/GmIAQbU6YvWtZAS1JoEbZmB3oO/7E9cPvfgUKRyxXhWLkR4FinHN3izzWV5QuP64kYj64HvS7myF/0AFR9pj997QoQarOC6YvWdKd23CRMU0yDK0PKOhIb1lMqkcYrXx6pUpu5ZR15CODHxzGXqezW3Oh4RdwBi7oj2ZVb2Y7mREa8C9UT2oaOZFgy5lyRyBook52nmXT5W0n/AnhKXW0wFtuOuCBz6N9oiENziFKNsMWKa4Pf=="


window.__acjs_awsc_115.getUA()

let opt = {"renderTo":"#nocaptcha","isEnabled":true,"foreign":0,"cssUrl":false,"uaUrl":"","appkey":"X82Y__b0da956b61b46ba9b6ad16811c2d0b8d","trans":{},"token":"46ffcbaf062e66e85a7a357420001a5c","elementID":"","audio":false,"timeout":3000,"times":3,"is_Opt":1,"language":"cn","umidServer":"h","scene":"register","is_tbLogin":0,"tb_errMsg":"","glog":0.05,"apimap":{},"customWidth":300}
let ua_opt = {
    MPInterval: 4,
    MaxMCLog: 12,
    MaxKSLog: 14,
    MaxMPLog: 5,
    MaxFocusLog: 6,
    SendInterval: 5,
    SendMethod: 8,
    GPInterval: 50,
    MaxGPLog: 1,
    MaxTCLog: 12,
    Flag: 880846 // 2980046
}
ua_opt.Token = (new Date).getTime() + ":" + opt.token
let uaoption = { "SendInterval": 5, "SendMethod": 8, "MaxMCLog": 12, "MaxKSLog": 14, "MaxMPLog": 5, "MaxGPLog": 1, "MaxTCLog": 12, "GPInterval": 50, "MPInterval": 4, "MaxFocusLog": 6, "Flag": 880846, "OnlyHost": 1, "MaxMTLog": 500, "MinMTDwnLog": 30, "MaxNGPLog": 1, "sIDs": ["_n1t|_n1z|nocaptcha|-stage-1"], "hook": 1, "font": 1, "api": 1 }
window.__nc.__uab.getUA(uaoption)

umx.init({
    timeout: 3000,
    timestamp: (new Date).getTime(),
    token: opt.token,
    serviceUrl: 'https://ynuf.aliapp.org/service/um.json',
    appName: opt.appkey,
    enableFlash: false,
    containers: {
        flash: null,
        dcp: null
    },
    closeImage: false
})
// post Origin: https://buyertrade.taobao.com,Referer: https://buyertrade.taobao.com//trade/itemlist/asyncBought.htm/_____tmd_____/punish?x5secdata=5e0c8e1365474455070961b803bd560607b52cabf5960afff39b64ce58073f7882a920b9577015bb63848d8585b4011d4236c76484f802b2adc32ff5c8e074fd7bf3fd8381b0cf846dca6234fbaf10bcbb59732cfb08afd44561a0c048d1d4c2b1726de5abc460619c989eed3429b470e7c70179f751a97b243e1a46f4e6c2d6ac137b5c0d84774a628390684b67a8c5e04de57ce17cef2064d8688f97e61cc8a8751f963303ddca91559e3c528e4bdcdeee3219cf0d173c7ca0846900c42cab0a7462692a44dd2b237f98c9f1ed8664834483b45f7c195c851e5ea867461b6ee0b14f67ee5fc4aa54094b1d3efc87f217cafbafe76d5955b72523b0576f3e33951881578f6d451ff315008447a0a18b5d40ea752251acdf61af4cbd8111fcb400b468ff65a3d89c9babdf1eee95e9168e082d62ea96b7ca9b0097fd4314039f874359d89eb3048a2f5487e9af5b14a6d4df76aded1ed367e842dad06db7fa4227c1d09816d6a668dc42fee80275d35ba9359d09962746eee30949445f20e3f6c83ad0d6ebcb39cfedace515dbeef94a49397b9d9c9d9ff34f3f4cc9a9bbf9c64b0aec08fe67cf78ba97589a0af75136379e401ea983d6093e07c344ed4f091bcc0da907e0df7d89f2b90da82c81f72bfc410d870d5e682e868b792fa89d2d44ab570034bcc3f82cda2fb36536ba0f781e2c57cdfeb172fffdb47bdf4585f28affcdd166028bb8f9988581ab2c7c69128aa55ca18d197f3ce3ccda97600fdb9b&x5step=2
// data=ENCODE~~V01~~eyJ4diI6IjMuMy43IiwieHQiOiJmY2VmYjc1ZTEzM2NkOGYyOTgxMDc4MGIwNWFjZTZlYiIsImV0ZiI6ImIiLCJ4YSI6Ilg4MllfX2IwZGE5NTZiNjFiNDZiYTliNmFkMTY4MTFjMmQwYjhkIiwic2l0ZUlkIjoiIiwidWlkIjoiXFx1NEY1QlxcdTY2RTZcXHU4MDAxXFx1NzUzN1xcdTVCNjkiLCJlbWwiOiJBQSIsImV0aWQiOiIiLCJlc2lkIjoiIiwidHlwZSI6InBjIiwibmNlIjp0cnVlLCJwbGF0IjoiV2luMzIiLCJuYWNuIjoiTW96aWxsYSIsIm5hbiI6Ik5ldHNjYXBlIiwibmxnIjoiemgtQ04iLCJzdyI6MTM2OCwic2giOjkxMiwic2F3IjoxMzY4LCJzYWgiOjg3MiwiYnN3IjoxMzY4LCJic2giOjQzMSwiZWxvYyI6Imh0dHBzJTNBJTJGJTJGYnV5ZXJ0cmFkZS50YW9iYW8uY29tJTJGJTJGdHJhZGUlMkZpdGVtbGlzdCUyRmFzeW5jQm91Z2h0Lmh0bSUyRl9fX19fdG1kX19fX18lMkZwdW5pc2giLCJldHoiOjQ4MCwiZXR0IjoxNTU0OTA2MTg2MTIxLCJlY24iOiJmZmViODIzNTU1N2EwMzg5ZDI3MWFkY2UyNDc3MmVjNjg0MDE0Zjg4IiwiZWNhIjoiWVBXbEVVbVd6eEFDQWR1YlhDcHc4Y1BMIiwiZXN0IjoyLCJ4cyI6Ikc1QzY3QjM2ODdBQTUwMzIzQUUzRTc2OTkyOUU0RTY5MTI3OTIwMyIsIm1zIjoiMTEyOSIsImVyZCI6ImRlZmF1bHQsY29tbXVuaWNhdGlvbnMsOGY4M2JmNzFjYWQxMzQ4NjExYzM5OWVmYjM2YjgwMGJjNmZiMWUwOGI1YmZjYmE0Mzc3YzQ1ZmQ5YjhjNjgyZCw0OTM1MzFjMTAyNWJjN2ZmYTgyOWE3MzM1NjRlNWJiMmMyMDZlN2ExYmE4NjZkN2IwZWQ1ZDViNDYwZTFkZTIzLDBmNjJhNGE4NDQ5MjE0YTZkM2MzNzc4NWJjY2Q2ZTI5MGFmNGJhZWE1ZDVhMGNlZWU4YTBkMzUxYjQ2ZDhjMzIsZDRjYzQxMWNjZjdjN2M2MGNmOTg1ZTk3MTk3ODZhMzk1MzdhZDViMjQwNzUwMjE5ZTI5NzA0YzZlYjNhOWM0MixkZWZhdWx0LGNvbW11bmljYXRpb25zLDU4NjBjZGMzYTQ5ZDJiM2U0MWM2NzU3YzBhZjYxNDUzMjhjNGM1NWIxZmM3ODQyYmJlODNhNTVmNzhmZTM2MDEiLCJjYWNoZWlkIjowLCJ4aCI6IiIsImlwcyI6IiIsImVwbCI6MywiZXAiOiIyZmJmNGEwZDM0MjE0ZDRmZGU2Y2M4YTIyODk3ZDExNWE3NjY3ODExIiwiZXBscyI6IkMzNzBjMzA3ZjRhY2E3ODU4NDkzZGZlMzIyMjU0ZTVjYjQzOGJlOTQ0LE4wZmNkNmUxOGZmNmRmNzRmOThhNjk4YjdmNmI2ZDgzOGE2YzExZTY5IiwiZXNsIjpmYWxzZX0
// umx.getData()
// {"xv":"3.3.7","xt":"46ffcbaf062e66e85a7a357420001a5c","etf":"b","xa":"X82Y__b0da956b61b46ba9b6ad16811c2d0b8d","siteId":"","uid":"\\u4F5B\\u66E6\\u8001\\u7537\\u5B69","eml":"AA","etid":"","esid":"","type":"pc","nce":true,"plat":"Win32","nacn":"Mozilla","nan":"Netscape","nlg":"zh-CN","sw":1368,"sh":912,"saw":1368,"sah":872,"bsw":420,"bsh":320,"eloc":"https%3A%2F%2Fbuyertrade.taobao.com%2Ftrade%2Fitemlist%2Flist_bought_items.htm","etz":480,"ett":1554908516131,"ecn":"ffeb8235557a0389d271adce24772ec684014f88","eca":"YPWlEUmWzxACAdubXCpw8cPL","est":2,"xs":null,"ms":"1127","erd":"default,communications,8f83bf71cad1348611c399efb36b800bc6fb1e08b5bfcba4377c45fd9b8c682d,493531c1025bc7ffa829a733564e5bb2c206e7a1ba866d7b0ed5d5b460e1de23,0f62a4a8449214a6d3c37785bccd6e290af4baea5d5a0ceee8a0d351b46d8c32,d4cc411ccf7c7c60cf985e9719786a39537ad5b240750219e29704c6eb3a9c42,default,communications,5860cdc3a49d2b3e41c6757c0af6145328c4c55b1fc7842bbe83a55f78fe3601","cacheid":0,"xh":"","ips":"","epl":3,"ep":"2fbf4a0d34214d4fde6cc8a22897d115a7667811","epls":"C370c307f4aca7858493dfe322254e5cb438be944,N0fcd6e18ff6df74f98a698b7f6b6d838a6c11e69","esl":false}

// 需等3秒
if (umx.getStatus()) {
    try {
        window.ua_opt.sendSA()
    } catch (e) {}
    
    get("https://cf.aliyun.com/nocaptcha/analyze.jsonp",{
        queryString: {
            a: opt.appkey,
            t: opt.token,
            n: window.__nc.__uab.getUA(uaoption),
            p: "{ncSessionID:xxx}",
            scene: "register",
            asyn: 0,
            lang: "cn",
            v: 948,
            callback: ""
        }
    })
    //jsonp_051838505021425({"success":true,"result":{"csessionid":"01_BZviDVUUl7hb8ALjzGLLA11bQfX3zXZh0hytSSkEJRBtj3Vrkf9wgGNQxBBo-poN8HPWMx6QlMWV-Nw9LKhFln6-0AXmw2z9nEi93BnEET-sMp86n9o8GHhzO6TCvKBpCEcEeTDwXakZOY0jM4N8gIyq3UZob3-_mXhs1-9JdVo5nGHO02I_c1fsk0RAh2RHvJG0DpdSHZOdyTDPcKc6A","code":0,"value":"05y9Q3HQP4VY1zBFMcwNsyVYLecOyW0F7tnjIjhpNZ7dSxjkKBQLnTF-meZY-n_DX9up9-Yjo9My1qsWZ1QOVn2qNKPSToJfF4iv77hl02pPNG0WqAKDnSvuNuvYZlNgxNcvbJt7jqJea4cxEyWP8VMYH2BwjOrKsyIRc8ogD-votocHVi94sltTSxISntS4nwhzIiGJzKxLpS1LnjuS6F8jnEPs_3D0-lJiwaplLuVDYjzhpRTg_pRqRvjBB--pFZ-TR5ImE95qSmy5ud6jnt5ijCvDPt3en6Eq3JbdbQY69kqAjr8GzuE1-aNPGJzO4r-V1c8basfq3eQjwtlgOtSqzOntg3TCFCkXV6EXkNNo0o2o3GOxbowBqfBsLfhdzrlcmGA5uSHLyIpm9yS08A3FsAxQHojeOF39MSL4bxBD5jO8Jt1TNjiy88zeOYEHYYlIAgCbBC81hyxSwydoOfCGxcybA5uz6YtFAXwkzA7ug"}});
    document.getElementById("nc-session-id").value = data.csessionid;
    document.getElementById("nc-sig").value = data.sig; // ?data.value?
    document.getElementById("nc-verify-form").submit();
}

<form id="nc-verify-form" action="//buyertrade.taobao.com:443/trade/itemlist/asyncBought.htm/_____tmd_____/verify/" method="GET">
    <input name="nc_token" value="46ffcbaf062e66e85a7a357420001a5c" type="hidden">
    <input name="nc_session_id" id="nc-session-id" value="" type="hidden">
    <input name="nc_sig" id="nc-sig" value="" type="hidden">
    <input name="x5secdata" id="x5secdata" type="hidden" value="5e0c8e1365474455070961b803bd560607b52cabf5960afff39b64ce58073f7882a920b9577015bb63848d8585b4011d4236c76484f802b2adc32ff5c8e074fd7bf3fd8381b0cf846dca6234fbaf10bcbb59732cfb08afd44561a0c048d1d4c2b1726de5abc460619c989eed3429b4709cb27cb7a2da8beeda8539d7cbba94e3d074861886ffa300aae1d82abb0836272a097374dbd3b7e02e90eeebe63d2929a8751f963303ddca91559e3c528e4bdcdeee3219cf0d173c7ca0846900c42cab0a7462692a44dd2b237f98c9f1ed8664834483b45f7c195c851e5ea867461b6ee0b14f67ee5fc4aa54094b1d3efc87f217cafbafe76d5955b72523b0576f3e33951881578f6d451ff315008447a0a18b5d40ea752251acdf61af4cbd8111fcb400b468ff65a3d89c9babdf1eee95e9168e082d62ea96b7ca9b0097fd4314039f874359d89eb3048a2f5487e9af5b14a6d4df76aded1ed367e842dad06db7fa4227c1d09816d6a668dc42fee80275d35ba9359d09962746eee30949445f20e3f6c83ad0d6ebcb39cfedace515dbeef94a49397b9d9c9d9ff34f3f4cc9a9bbf9c64b0aec08fe67cf78ba97589a0af75136379e401ea983d6093e07c344ed4f091bcc0da907e0df7d89f2b90da82c81f72bfc410d870d5e682e868b792fa89d2d44ab570034bcc3f82cda2fb36536ba0f781e2c57cdfeb172fffdb47bdf4585f28affcdd166028bb8f9988581ab2c7c69127ad0a85e8c7767e97aa2641f7784e674">
    <input name="x5step" id="x5step" type="hidden" value="100">
    <input name="nc_app_key" id="nc_app_key" type="hidden" value="X82Y__b0da956b61b46ba9b6ad16811c2d0b8d">
</form>