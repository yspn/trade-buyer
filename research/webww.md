1. GET https://webww.tmall.com/tagkey.do?token={cookie2}&callback=TDog.WebServer.handleLoginFirst&nkh={tracknick}&appId=1&t=1556026052570

> Host: webww.tmall.com
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36
Accept: */*
Referer: https://detail.tmall.com/item.htm?id=588107039502
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: cna=YPWlEUmWzxACAdubXCpw8cPL; otherx=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0; enc=OPgWHx6Qw2mzbuubYvvBaKWQhTcBZ518mFnm5KT1VCkzHvQCQCz2zVVEU3HilUK7HbwvUMXskuCwY%2F6PhchNzw%3D%3D; OZ_1U_2061=vid=vb66e313464723.0&ctime=1533469606&ltime=1533469600; x=__ll%3D-1%26_ato%3D0; uss=""; hng=CN%7Czh-CN%7CCNY%7C156; lid=yspn1987; t=b5858c6454ddef2cf62d0cb2ae9499f6; tracknick=yspn1987; lgc=yspn1987; _tb_token_=758f99e3aeaee; cookie2=52fd06d46822ea780b2120131ee06ec8; dnk=yspn1987; _l_g_=Ug%3D%3D; unb=96809650; cookie1=AQXOUqBv%2Bo45Q9%2Fa2ubwAkFer2lcPN7i1GP0RdmFTPk%3D; login=true; cookie17=WvZtCq1lI0A%3D; _nk_=yspn1987; sg=703; uc1=cookie16=VT5L2FSpNgq6fDudInPRgavC%2BQ%3D%3D&cookie21=VFC%2FuZ9ajCbF99I66nU0Bw%3D%3D&cookie15=UIHiLt3xD8xYTw%3D%3D&existShop=false&pas=0&cookie14=UoTZ4tN1HuZm%2Bw%3D%3D&tag=8&lng=zh_CN; uc3=vt3=F8dByEfN5I0ZEdfqgrY%3D&id2=WvZtCq1lI0A%3D&nk2=Ghj5vueFPqk%3D&lg2=VT5L2FSpMGV7TQ%3D%3D; ck1=""; csg=b682eb06; skt=1f0f83da14b53aa8; whl=-1%260%260%260; l=bBEjLpvqvxnYsLcNBOfwCuIRtAPUBIObzIVzw4il7ICP_zfylKI1WZ_hA5L2C3NVa6E9R3y1Nww8BAY-Vyznh; isg=BD092C5QPeP5e54ZdnvruBd5TJn3crZVX9JPQ_-DAxTSNl5oxy5l_cig4CrXnonk
>


```javascript
TDog.WebServer.handleLoginFirst({"success":"true","result":{"token":"52fd06d46822ea780b2120131ee06ec8","tagKey":"0C0F93FF07234DF83A53FC20BEE7D9943FEC84E04357C8CDC844F31E49CE205E"}});
```


2. GET https://webww.tmall.com/login.do?token={cookie2}&callback=TDog.WebServer.prepareLogin&nickName={tracknick}&autoLogin=1&loginTag=p947D405BFFF4B37D&nkh={tracknick}&appId=1&t=1556026053112

```javascript
TDog.WebServer.prepareLogin({"success":"true","result":{"sessionid":"52fd06d46822ea780b2120131ee06ec8b5858c6454ddef2cf62d0cb2ae9499f6"}});
```

=============loginTag proc=========================
```javascript
let c =[2, 13, 28, 9, 18, 27, 23, 20, 17, 27, 7, 9, 29, 25, 5, 24]
let e = [9, 6, 7, 19, 15, 22, 2, 26, 18, 24, 21, 25, 16, 13, 25, 12]
for (var b = [], g = 0; 16 > g; g++)
{b.push(Math.floor(c[g] + e[g] / 7.3 * 100) % 32);}
b=[29, 31, 27, 13, 31, 8, 18, 24, 7, 3, 6, 31, 24, 11, 27, 28]
let loginKey = {tagKey} // 0C0F93FF07234DF83A53FC20BEE7D9943FEC84E04357C8CDC844F31E49CE205E
for (var a = "", i = 0; i < 16; i++)
{a += loginKey.charAt(b[i]);} // 947D405BFFF4B37D
var g = encodeURIComponent({tracknick}).charAt(2); // p
var loginTag = g + a // p947D405BFFF4B37D
```

3. GET https://webww.tmall.com/login.do?token={cookie2}&callback=TDog.WebServer.prepareLogin&nickName={tracknick}&autoLogin=1&loginTag={loginTag}&nkh={tracknick}&appId=1&t=1556026053112

```javacript
TDog.WebServer.prepareLogin({"success":"true","result":{"sessionid":"52fd06d46822ea780b2120131ee06ec8b5858c6454ddef2cf62d0cb2ae9499f6"}});
```

4. GET https://webww.tmall.com/getloginresult.do?time=1&token={cookie2}&callback=TDog.WebServer.disposeLoginResult&nkh={tracknick}&appId=1&t=1556026054176

```javacript
TDog.WebServer.disposeLoginResult({"success":"true","result":{"sessionid":""}});
```

5. GET https://webww.tmall.com/get.do?token={cookie2}&callback=TDog.DataManager.Message.saveGetData&nkh={tracknick}&appId=1&t=1556026054225

```javascript
TDog.DataManager.Message.saveGetData({"success":"true","result":{"size":"0","person":"","messages":[{"changedUserId":"cntaobao古美婷旗舰店","status":"1","subType":"0","type":"3"},{"changedUserId":"cntaobao品生智能设备旗舰店","status":"1","subType":"0","type":"3"},{"changedUserId":"cntaobao燕派旗舰店","status":"2","subType":"0","type":"3"},{"changedUserId":"cntaobao点滴水世界","status":"1","subType":"0","type":"3"}]}});
```

6. GET https://webww.tmall.com/send.do?token={cookie2}&callback=TDog.WebServer.handleSendResult&userId=cntaobao%E7%82%B9%E6%BB%B4%E6%B0%B4%E4%B8%96%E7%95%8C&content=1&nkh={tracknick}&appId=1&t=1556026115028

```javascript
TDog.WebServer.handleSendResult({"success":"true","result":{"send":"true"}});
```

7. GET https://webww.tmall.com/receive.do?token={cookie2}&callback=TDog.DataManager.handleReceiveMessage&targetUserChatId=cntaobao%E7%82%B9%E6%BB%B4%E6%B0%B4%E4%B8%96%E7%95%8C&focused=false&update=false&time=&nkh={tracknick}&appId=1&t=1556026139628

```javascript
TDog.DataManager.handleReceiveMessage({"success":"true","result":{"timeStamp":"2019-04-23 21:28:34","size":0,"all":true,"talkUserStatus":{"userId":"cntaobao点滴水世界","nickName":"点滴水世界","size":"0","statusType":"1","relation":"0","route":"0016","hasDBMessage":"false","hasCacheMessage":"true","wangXinSatus":"0"},"messages":[{"userId":"-","fromId":"cntaobao点滴水世界","sendTime":"2019-04-23 21:28:34","content":"1","type":6,"subType":0}]}});
```


8. GET https://webww.tmall.com/start.do?token={cookie2}&callback=TDog.DataManager.saveStartChatData&userId=cntaobao%E7%87%95%E6%B4%BE%E6%97%97%E8%88%B0%E5%BA%97&itemId=&fromLight=false&time=&nkh={tracknick}&appId=1&t=1556026162505

```javascript
TDog.DataManager.saveStartChatData({"success":"true","result":{"user":{"nick":"点滴水世界:波多","userChatId":"cntaobao点滴水世界:波多","sex":"0","from":"上海","registDate":"2015-3-17 20:22:46","visitDate":"2019-4-23 21:29:22","sellNum":"3_3","buyNum":"0","certification":"false","suspended":"0","relation":"2","site":"cntaobao"},"timeStamp":"2019-04-23 21:29:20","size":0,"all":false,"single":false,"talkUserStatus":{"userId":"cntaobao点滴水世界:波多","nickName":"点滴水世界:波多","size":"0","statusType":"2","relation":"2","hasDBMessage":"false","hasCacheMessage":"true","wangXinSatus":"0"},"messages":[]}});
```

9. GET https://webww.tmall.com/buildconnection.do?nkh=yspn1987&user=0&message=1&t=1556026161628

```javascript
{"type":"2","message":"1"}
{"type":"2","user":"0","message":"1"}
{"type":"2","user":"0"}
let MESSAGE_TYPE = {
  OFFLINE: 1,
  TALK: 2,
  STATUS: 3,
  LOGOUT: 4,
  SYSTEM: 5,
  SELF: 6
}
let MESSAGE_SUBTYPE = {
  TALK_MESSAGE: 201,
  AUTO_BACK_TALK_MESSAGE: 202,
  NEED_AUTH: 204,
  FAIL_ACK: 205,
  FILE_MESSAGE: 206,
  PIC_MESSAGE: 207,
  GRAFFITI: 208,
  REMOTE_ASSIST: 209,
  AV: 210,
  FOLDER: 211,
  ILLEGALITY: 212,
  PEER_VERIFY: 213,
  NO_HEARTBEAT: 401,
  OTHER_LOGIN: 402,
  SESSION_TIMEOUT: 403,
  POPUP_MESSAGE: 501,
  SUBSCRIBE_MESSAGE: 502
}
```
