KISSY.use("dom,event,ajax,ua,cookie,json", function(a, b, c, d, e, f, g) {
  function h(a) {
      var b = document.createElement("iframe");
      b.src = a,
      document.body.appendChild(b),
      setTimeout(function() {
          b.parentNode.removeChild(b)
      }, 500)
  }
  b = b || a.DOM,
  c = c || a.Event,
  d = d || a.IO || a.Ajax,
  e = e || a.UA,
  f = f || a.Cookie,
  g = g || a.JSON,
  KISSY.add("dragdrop", function(a) {
      function d(a, b, c, d, e, f, g, h) {
          return e >= c || f >= d || a >= g || b >= h ? !1 : !0
      }
      var f = document
        , g = window
        , h = {
          axis: 0,
          region: !1,
          handle: !1,
          not: !1,
          revert: !1,
          snap: !1,
          scroll: !1,
          lock: !1,
          circular: !1,
          multi: !1,
          resize: !1,
          proxy: !1,
          delay: !1,
          resizefn: !1,
          cursor: !1
      }
        , i = !1
        , j = function(c, d) {
          var e = c
            , c = a.makeArray(b.query(c))
            , f = this
            , d = a.merge(h, d || {});
          a.each(c, function(a) {
              f._init(a, d, e)
          })
      }
        , k = function(a, b, c) {
          return a > c ? c : b > a ? b : a
      }
        , l = function(a) {
          var c, d = b.css(a, "position");
          return "absolute" == d.toLowerCase() ? c = [a.offsetLeft, a.offsetTop] : "relative" == d.toLowerCase() && (c = [parseInt(b.css(a, "left")) || 0, parseInt(b.css(a, "top")) || 0]),
          c
      }
        , m = function(b, c, d, e, f) {
          if ("left" === d.toLowerCase()) {
              var g = "offsetWidth"
                , h = 3
                , i = 1;
              a.UA.ie && (g = "clientWidth")
          } else {
              var g = "offsetHeight"
                , h = 0
                , i = 2;
              a.UA.ie && (g = "clientHeight")
          }
          return c.region ? num = k(parseInt(b.style[d]) + e, c.region[h], c.region[i]) : num = parseInt(b.style[d]) + e,
          num
      }
        , n = function(a, c, d) {
          return "left" === c.toLowerCase() ? e.ie ? num = k(parseInt(a.style[c]) + d, 0, b.viewportWidth() - a.clientWidth - 2) : num = k(parseInt(a.style[c]) + d, 0, b.viewportWidth() - a.clientWidth - 2 - 17) : num = k(parseInt(a.style[c]) + d, parseInt(a.style[c]) - parseInt(b.offset(a).top) + (f.documentElement.scrollTop || f.body.scrollTop), 99999),
          num
      }
        , o = function(c, d) {
          if (a.isArray(d)) {
              for (var e = 0; e < d.length; e++)
                  if (b.hasClass(c, d[e].substr(1)))
                      return !0
          } else if (b.hasClass(c, d.substr(1)))
              return !0
      }
        , p = function(a) {
          var b = a.cloneNode(!0);
          return f.body.appendChild(b),
          b
      };
      setRegion = function(a, c) {
          return c[0] = parseInt(b.css(a, "top")) - c[0],
          c[1] = parseInt(b.css(a, "left")) + c[1],
          c[2] = parseInt(b.css(a, "top")) + c[2],
          c[3] = parseInt(b.css(a, "left")) - c[3],
          c
      }
      ,
      a.augment(j, {
          _init: function(d, h, j) {
              var k, q, r, s, t = !1, u = !1, v = this, w = !1, x = h.snap, y = [0, 0];
              if (function() {
                  var c = !1;
                  if (a.isString(h.region) && "scroll" != h.region.toLowerCase()) {
                      var e = b.get(h.region);
                      h.region = [b.offset(d).top - b.offset(e).top, b.offset(e).left + e.offsetWidth - (b.offset(d).left + d.offsetWidth), b.offset(e).top + e.offsetHeight - (b.offset(d).top + d.offsetHeight), b.offset(d).left - b.offset(e).left],
                      c = !0
                  } else
                      a.isString(h.region) && "scroll" == h.region.toLowerCase() ? (h.region = [b.offset(d).top, f.documentElement.clientWidth - b.offset(d).left - d.offsetWidth, f.documentElement.clientHeight - b.offset(d).top - d.offsetHeight, b.offset(d).left],
                      c = !0) : 4 == h.region.length && a.isArray(h.region);
                  c && setRegion(d, h.region),
                  c = !1
              }(),
              h.circular)
                  var z = l(d, h)[0] + h.circular + 30
                    , A = l(d, h)[1] + 30;
              var B = function(a) {
                  h.islock && (i = !0),
                  h.not && o(a.target, h.not) || (w = !0,
                  y = l(d),
                  r = a.clientX,
                  s = a.clientY,
                  !t && h.proxy && (u = d,
                  t = p(d),
                  d = t),
                  b.css(d, "left", y[0] + "px"),
                  b.css(d, "top", y[1] + "px"),
                  h.cursor && b.css(d, "cursor", h.cursor),
                  v.onStartDrag && v.onStartDrag(a, d, h))
              }
                , C = function(i) {
                  if (w && !v.isLock(h)) {
                      if (k = i.clientX - r,
                      q = i.clientY - s,
                      h.circular)
                          angle = Math.atan2(i.clientX - z, i.clientY - A),
                          b.css(d, "left", z + Math.sin(angle) * h.circular - 30 + "px"),
                          b.css(d, "top", A + Math.cos(angle) * h.circular - 30 + "px");
                      else if (h.snap)
                          b.css(d, "left", parseInt(d.style.left) + Math.round(k / x[0]) * x[0] + "px"),
                          b.css(d, "top", parseInt(d.style.top) + Math.round(q / x[1]) * x[1] + "px"),
                          r += Math.round(k / x[0]) * x[0],
                          s += Math.round(q / x[1]) * x[1];
                      else if (h.resize) {
                          var l = parseInt(b.css(d, "width"))
                            , o = parseInt(b.css(d, "height"));
                          h.resizefn[0] && Math.max(20, l + k) > h.resizefn[0] && (k > 0 && i.clientX <= parseInt(b.offset(d).left) + l && (k = 0),
                          b.css(d, "width", Math.max(20, l + k) + "px")),
                          h.resizefn[1] && Math.max(20, o + q) > h.resizefn[1] && (q > 0 && parseInt(i.clientY) <= parseInt(b.offset(d).top) + o - parseInt(f.documentElement.scrollTop || f.body.scrollTop) ? q = 0 : b.css(d, "height", Math.max(20, o + q) + "px")),
                          r = i.clientX,
                          s = i.clientY
                      } else if (h.scroll)
                          "y" != h.axis && b.css(d, "left", n(d, "left", k) + "px"),
                          "x" != h.axis && b.css(d, "top", n(d, "top", q) + "px"),
                          r = i.clientX,
                          s = i.clientY;
                      else {
                          if (h.multi && b.hasClass(d, "ks-multi")) {
                              var p = a.makeArray(b.query(".ks-multi"));
                              0 == p && (p = [d])
                          } else
                              p = [d];
                          a.each(p, function(a) {
                              "y" != h.axis && b.css(a, "left", m(a, h, "left", k, y) + "px"),
                              "x" != h.axis && b.css(a, "top", m(a, h, "top", q, y) + "px")
                          }),
                          r = i.clientX,
                          s = i.clientY
                      }
                      e.chrome && c.on(document, "selectstart", function(a) {
                          a.halt()
                      }),
                      g.getSelection ? g.getSelection().removeAllRanges() : f.selection.empty(),
                      v.onDrag && v.onDrag(i, d, h, k, q, j)
                  }
              }
                , D = function(a) {
                  1 == w && (w = !1,
                  c.remove(f, "mousemove", C),
                  g.getSelection ? g.getSelection().removeAllRanges() : f.selection.empty(),
                  t && h.proxy && (b.css(u, "left", parseInt(t.style.left) + "px"),
                  b.css(u, "top", parseInt(t.style.top) + "px"),
                  d = u,
                  t.parentNode.removeChild(t),
                  t = !1,
                  u = !1),
                  h.revert && (b.css(d, "left", y[0] + "px"),
                  b.css(d, "top", y[1] + "px")),
                  h.cursor && b.css(d, "cursor", "default"),
                  v.onEndDrag && v.onEndDrag(a, d, h),
                  e.chrome && c.remove(document, "selectstart"))
              }
                , E = function(a) {
                  b.hasClass(d, "ks-multi") ? b.removeClass(d, "ks-multi") : b.addClass(d, "ks-multi")
              };
              c.add(b.get(h.handle, d) || d, "mousedown", function(a) {
                  B(a),
                  c.add(f, "mousemove", C)
              }),
              c.add(f, "mouseup", D),
              h.multi && c.add(d, "dblclick", E)
          },
          onStartDrag: null,
          onDrag: null,
          onEndDrag: null,
          isLock: function() {
              return i
          }
      }),
      a.Drag = j,
      a.Drag.intersectRect = d
  }),
  window.TDog = function(a) {
      var c = TStart
        , d = window
        , e = d.g_config && d.g_config.appId
        , g = (c.isOnline,
      c.Config.DOMAIN)
        , h = function() {
          var a = location.hostname;
          return a = "http:" == location.protocol ? a.indexOf("tmall.com") > 0 ? "webww.tmall.com" : a.indexOf("tmall.net") > 0 ? "webww.daily.tmall.net:8080" : a.indexOf("taobao.net") > 0 ? "webww.daily.taobao.net:8080" : "webwangwang.taobao.com" : a.indexOf("tmall.com") > 0 ? "webww.tmall.com" : "webww.taobao.com",
          location.protocol + "//" + a + "/"
      }()
        , i = function() {
          var a = location.hostname;
          return a = "http" == location.protocol ? a.indexOf("tmall.com") > 0 ? "webww.tmall.com" : a.indexOf("tmall.net") > 0 ? "webww.daily.tmall.net:8080" : a.indexOf("taobao.net") > 0 ? "webww.daily.taobao.net:8080" : "webwangwang.taobao.com" : a.indexOf("tmall.com") > 0 ? "webww.tmall.com" : "webww.taobao.com",
          location.protocol + "//" + a + "/"
      }()
        , j = ".do"
        , k = "//wangwang.taobao.com/"
        , l = "//wangwang.taobao.com";
      return {
          version: "1.0",
          _MODS: {},
          add: function(a, b) {
              return this._MODS[a] = b(TDog)
          },
          Config: {
              getTokenUrl: h + "gettoken" + j,
              loginUrl: h + "login" + j,
              getLoginResultUrl: h + "getloginresult" + j,
              startUrl: h + "start" + j,
              receiveUrl: h + "receive" + j,
              sendUrl: h + "send" + j,
              getUrl: h + "get" + j,
              notifyUrl: i + "connection.html?t=20110322",
              connectionURL: h + "buildconnection" + j,
              checkAutoLoginUrl: h + "usertag.do",
              getTalkUsers: h + "gettalkusers" + j,
              ackGetMessage: h + "ackgetmessage" + j,
              tbLoginUrl: "https://login." + g + "/member/login.jhtml?f=top",
              tmsAdUrl: "//tms.alicdn.com/go/rgn/tdog/link-for-chat-window.php",
              tmsBulletinUrl: "//tce.alicdn.com/api/data.htm?ids=353289",
              clearUrl: h + "clear.do",
              clearListUrl: h + "clear.do?act=2",
              setAutoLoginUrl: h + "usertag.do",
              TagKeyUrl: h + "tagkey.do",
              LIGHT_NICK: "wwlight",
              forceAutoLogin: !1,
              appId: e,
              X: "x",
              NOTIFY_STATUS: {
                  logout: {
                      key: 0,
                      value: -1
                  },
                  timeout: {
                      key: 1,
                      value: -2
                  },
                  message: {
                      key: 2,
                      value: -3
                  },
                  close: {
                      key: 3,
                      value: -4
                  },
                  notMessage: {
                      key: 4,
                      value: 0
                  }
              },
              downloadWangWangURLBuy: k,
              downloadWangWangURLSeller: l,
              DOMAIN: g,
              LOGIN_KEY: "login_key",
              hash: [9, 6, 7, 19, 15, 22, 2, 26, 18, 24, 21, 25, 16, 13, 25, 12]
          },
          isReady: !1,
          init: function(c, d) {
              function g() {
                  m.init(),
                  h.WebServer.init(),
                  h.RecentList.init(),
                  h.ChatDialog.init(),
                  h.SysMessage.init(),
                  h.SysPopup.init(),
                  h.isReady = !0,
                  h.EventCenter.fire(h.EVENTS.TDOG_READY)
              }
              a.log("\u5f00\u59cb\u521d\u59cb\u5316 Web \u65fa\u65fa");
              var h = this
                , i = h.Util
                , j = h.Config
                , k = h.Login
                , l = h.SysTips
                , m = h.DataManager
                , n = f.get(j.X)
                , o = b.get("#tstart");
              if (k.init(),
              h.host = c,
              h.hostEl = d,
              l.init(),
              h.StatusIcon.init(),
              h.EventCenter.init(),
              "tdog" === a.unparam(n).p || Light.addonIsOK() || !m.getNickName())
                  return a.log("\u63a7\u4ef6\u5b89\u88c5\u6b63\u5e38\u6216\u6dd8\u5b9d\u672a\u767b\u5f55\uff0cWeb \u65fa\u65fa\u9000\u51fa\u521d\u59cb\u5316"),
                  void b.addClass(o, "tstart-tdog-disabled");
              if (Light.addonIsOK())
                  return a.log("\u63a7\u4ef6\u5b89\u88c5\u6b63\u5e38\uff0c\u5de5\u5177\u6761\u4e0a\u4e0d\u663e\u793a Web \u65fa\u65fa\uff0c\u9000\u51fa\u521d\u59cb\u5316"),
                  void b.addClass(o, "tstart-tdog-disabled");
              if (Light.addonIsOK())
                  return a.log("\u63a7\u4ef6\u5b89\u88c5\u6b63\u5e38\uff0c\u5de5\u5177\u6761\u4e0a\u4e0d\u663e\u793a Web \u65fa\u65fa\uff0c\u9000\u51fa\u521d\u59cb\u5316"),
                  void b.addClass(o, "tstart-tdog-disabled");
              b.addClass(o, "tstart-tdog-enable");
              var p = location.search;
              if (p && (p = p.substring(1))) {
                  var q = a.unparam(p)
                    , r = q[j.LIGHT_NICK];
                  if (0 === e && (r = i.decode(q.touid || q.tid)),
                  r) {
                      if (-1 !== r.indexOf("%3C") || -1 !== r.indexOf("<") || -1 !== r.indexOf("&#60;") || /\\/.test(r))
                          return !1;
                      a.log("wwlight = " + r),
                      i.hasSitePrefix(r) || (r = "cntaobao" + r),
                      Light.lightedUsers.push(r),
                      j.forceAutoLogin = !0
                  }
              }
              7 === e && o && (o.style.zIndex = 20001),
              g()
          },
          EVENTS: {
              CLICK_LIGHT_ICON: "clickLightIcon",
              CLICK_STATUS_ICON: "clickStatusIcon",
              LOGIN_START: "loginStart",
              LOGIN_SUCCESS: "loginSuccess",
              ERROR_LOGIN_FAILED: "errorLoginFailed",
              SHOW_RECENT_LIST: "showRecentList",
              SHOW_CHAT_DIALOG: "showChatDialog",
              SHOW_CHAT_MSG: "showChatMsg",
              RECEIVE_CHAT_MESSAGE: "receiveChatMessage",
              RECEIVE_SUBSCRIBE_MESSAGE: "receiveSystemMessage",
              RECEIVE_POPUP_MESSAGE: "receivePopupMessage",
              RECEIVE_LOGINOUT_SIGNAL: "receiveLoginoutSignal",
              UPDATE_USER_STATUS: "updateUserStatus",
              UPDATE_STATUS_ICON: "updateStatusIcon",
              ERROR_GET_CHAT_INFO: "errorGetChatInfo",
              UPDATE_CHAT_INFO: "updateChatInfo",
              SEND_MESSAGE: "sendMessage",
              ERROR_GET_MESSAGE: "errorGetMessage",
              UPDATE_LOCAL_STATUS: "updateLocalStatus",
              DAEMON_FIRE: "daemonFire",
              TDOG_READY: "tdogReady"
          },
          USER_STATUS: {
              1: ["offline", "\u79bb\u7ebf"],
              2: ["free", "\u5728\u7ebf"],
              3: ["busy", "\u5fd9\u788c\u4e2d"],
              4: ["away", "\u4e0d\u5728\u7535\u8111\u65c1"],
              5: ["incall", "\u63a5\u542c\u7535\u8bdd\u4e2d"],
              6: ["outofdinner", "\u5916\u51fa\u5c31\u9910"],
              7: ["wait", "\u7a0d\u5019"],
              8: ["invisible", ""],
              9: ["offlinelogin", ""],
              10: ["unknown", ""],
              11: ["fakeonline", ""],
              12: ["mobileonline", "\u624b\u673a\u5728\u7ebf"],
              13: ["free", "\u65fa\u4fe1\u5728\u7ebf"],
              14: ["busy", "\u8bf7\u52ff\u6253\u6270"]
          },
          ERROR_MESSAGE: {
              0: "",
              1: "\u8d26\u6237\u4e0d\u5b58\u5728\uff0c\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u8d26\u6237\u540d\u3002",
              2: "\u60a8\u8f93\u5165\u7684\u8d26\u6237\u540d\u548c\u5bc6\u7801\u4e0d\u5339\u914d\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002",
              3: '\u60a8\u7684\u5e10\u53f7\u4e0d\u80fd\u767b\u5f55\u7f51\u9875\u7248\u65fa\u65fa\uff0c\u8bf7\u4f7f\u7528\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\uff0c<a target="_blank" class="tstart-item-tips-on" href="' + l + '">\u70b9\u6b64\u4e0b\u8f7d\uff01</a>',
              4: "\u60a8\u7684\u8d26\u6237\u6743\u9650\u4e0d\u591f\u3002",
              5: "\u60a8\u767b\u5f55\u7684\u5e10\u53f7\u6570\u91cf\u5df2\u8d85\u8fc7\u6700\u5927\u6570\u91cf\u3002",
              6: '\u60a8\u662fE\u5ba2\u670d\u7528\u6237\uff0c\u53ea\u80fd\u4f7f\u7528\u963f\u91cc\u65fa\u65fa\uff0c<a target="_blank" class="tstart-item-tips-on" href="' + l + '">\u70b9\u6b64\u4e0b\u8f7d\uff01</a>',
              "-1": "\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\u3002",
              "-2": "\u5bf9\u65b9\u8d26\u53f7\u4e0d\u5b58\u5728\uff0c\u8bf7\u68c0\u67e5\u3002",
              "-3": "\u8d26\u6237\u4e0d\u5b58\u5728\uff0c\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u8d26\u6237\u540d\u3002",
              "-4": "\u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u3002",
              "-5": "\u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u3002",
              "-6": "\u53d1\u9001\u6d88\u606f\u4e0d\u5141\u8bb8\u4e3a\u7a7a\u3002",
              "-7": "\u60a8\u53d1\u9001\u7684\u6d88\u606f\u8fc7\u957f\uff0c\u8bf7\u4e0b\u8f7d\u652f\u6301\u53d1\u9001\u8d85\u957f\u4fe1\u606f\u7684\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\u3002",
              "-8": "\u963f\u91cc\u65fa\u65fa\u6682\u65f6\u4e0d\u53ef\u7528\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\u3002",
              "-9": "\u8d26\u6237\u4e0d\u5b58\u5728\uff0c\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u8d26\u6237\u540d\u3002",
              "-10": "\u963f\u91cc\u65fa\u65fa\u6682\u65f6\u4e0d\u53ef\u7528\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\u3002",
              "-11": "\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
              "-12": "\u963f\u91cc\u65fa\u65fa\u6682\u65f6\u4e0d\u53ef\u7528\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\u3002",
              "-14": "\u8bfb\u6d88\u606f\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5\u3002",
              "-15": "\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\u5728\u7ebf\uff0c\u662f\u5426\u8e22\u6389\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\u3002",
              "-16": "\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\u5728\u7ebf\uff0c\u662f\u5426\u8e22\u6389\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\u3002",
              "-17": "\u767b\u5f55\u5931\u8d25\uff0c\u975e\u6cd5\u8bf7\u6c42\u3002",
              "-100": "\u963f\u91cc\u65fa\u65fa\u5df2\u79bb\u7ebf\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55\u3002",
              "-101": "\u60a8\u8fd8\u6ca1\u6709\u767b\u5f55\uff0c\u8bf7\u767b\u5f55\u3002",
              "-102": '\u60a8\u7684\u5e10\u53f7\u88ab\u7981\u6b62\u767b\u5f55WEB\u65fa\u65fa\uff0c\u8bf7\u4f7f\u7528\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef\u767b\u5f55\uff08<a target="_blank" class="tstart-item-tips-on" href="' + k + '">\u70b9\u6b64\u4e0b\u8f7d\uff01</a>\uff09\u3002',
              "-1000": "\u83b7\u53d6\u4fe1\u606f\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
              "-1001": "\u83b7\u53d6\u4fe1\u606f\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
              "-40000": '\u8981\u652f\u6301\u8be5\u529f\u80fd\uff0c\u8bf7\u4e0b\u8f7d <a  target="_blank" href="' + k + '">\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef</a>'
          },
          MESSAGE_TYPE: {
              OFFLINE: 1,
              TALK: 2,
              STATUS: 3,
              LOGOUT: 4,
              SYSTEM: 5,
              SELF: 6
          },
          MESSAGE_SUBTYPE: {
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
          },
          UNSUPPORT_MSG: {
              204: "\u5bf9\u65b9\u9700\u8981\u9a8c\u8bc1\uff0c\u6682\u65f6\u65e0\u6cd5\u53d1\u9001\u3002",
              205: "\u53d1\u9001\u3010{content}\u3011\u6d88\u606f\u5931\u8d25\u3002",
              206: "\u5bf9\u65b9\u6b63\u5411\u60a8\u4f20\u6587\u4ef6\u3002",
              207: "\u5bf9\u65b9\u6b63\u5411\u60a8\u53d1\u56fe\u7247\u3002",
              208: "\u5bf9\u65b9\u6b63\u9080\u8bf7\u60a8\u6d82\u9e26\u3002",
              209: "\u5bf9\u65b9\u6b63\u9080\u8bf7\u60a8\u8fdc\u7a0b\u534f\u52a9\u3002",
              210: "\u5bf9\u65b9\u6b63\u9080\u8bf7\u60a8\u8bed\u97f3\u89c6\u9891\u3002",
              211: "\u5bf9\u65b9\u6b63\u5411\u60a8\u4f20\u6587\u4ef6\u5939\u3002",
              212: "\u60a8\u53d1\u9001\u7684\u6d88\u606f\u4e2d\u53ef\u80fd\u5305\u542b\u4e86\u6076\u610f\u7f51\u5740\u3001\u8fdd\u89c4\u5e7f\u544a\u53ca\u5176\u4ed6\u7c7b\u5173\u952e\u8bcd\uff0c\u8bf7\u505c\u6b62\u53d1\u9001\u7c7b\u4f3c\u7684\u6d88\u606f\uff01",
              213: "\u5bf9\u65b9\u9700\u8981\u9a8c\u8bc1\uff0c\u6682\u65f6\u65e0\u6cd5\u53d1\u9001\u3002"
          },
          SITES: {
              TAOBAO: "cntaobao",
              YAHOO: "chnyahoo",
              WANGWANG: "wangwnag",
              CNALICHN: "cnalichn",
              ENALIINT: "enaliint",
              CNALIMAM: "cnalimam",
              CNKOUBEI: "cnkoubei",
              HTYAHOO: "htyahooo",
              CNWUJING: "cnwujing",
              CHNAIGOU: "chnaigou"
          }
      }
  }(KISSY),
  TDog.add("Util", function(c) {
      var d = c.Config.DOMAIN;
      c.Util = {
          detect: function(a, b) {
              var c = +new Date
                , d = window[c] = new Image;
              d.src = "//log.mmstat.com/" + a + "?cache=" + Math.floor(1e7 * Math.random()) + "&wwnick=cntaobao" + b,
              d.onload = d.onerror = function() {
                  window[c] = null
              }
              ,
              d = null
          },
          contains: function(a, b) {
              for (var c = a.length - 1; c >= 0; c--)
                  if (a[c].sendTime == b.sendTime && a[c].content == b.content)
                      return !0;
              return !1
          },
          uniqueArray: function(a) {
              for (var b = [], c = a.length, d = function(a, b) {
                  for (var c = 0, d = a.length; d > c; c++)
                      if (a[c] == b)
                          return !0;
                  return !1
              }, e = 0; c > e; e++)
                  d(b, a[e]) || b.push(a[e]);
              return b
          },
          css: function(a, c) {
              KISSY.each(a, function(a) {
                  b.css(a[0], a[1], a[2])
              })
          },
          getRandom: function(a, b) {
              return a + parseInt((b - a + 1) * Math.random(), 10)
          },
          genUniqueName: function() {
              for (var a = 0, b = ""; 10 > a; a++)
                  b += String.fromCharCode(this.getRandom(97, 122));
              return "_" + b + +new Date
          },
          decode: function(a) {
              if (!a)
                  return "";
              var b = a;
              try {
                  b = decodeURIComponent(a)
              } catch (c) {}
              return b
          },
          SITES_REG: function() {
              var a = [];
              for (var b in c.SITES)
                  a.push(c.SITES[b]);
              return new RegExp("^(" + a.join("|") + ")(.*)$","i")
          }(),
          hasSitePrefix: function(a) {
              return c.Util.SITES_REG.test(a)
          },
          getUserName: function(a) {
              if (!a)
                  return "";
              var b = a
                , d = a.match(c.Util.SITES_REG);
              return d && d[1] && (b = a.substr(d[1].length)),
              b
          },
          substitute: function(a, b) {
              return a.replace(/\{([^}]+)\}/g, function(a, c) {
                  return b[c] || ""
              })
          },
          escapeHTML: function(a) {
              var b = document.createElement("div")
                , c = document.createTextNode(a);
              return b.appendChild(c),
              b.innerHTML
          },
          isTaobao: function() {
              return "taobao.com" === d || "taobao.net" === d
          },
          formatDate: function(a) {
              var b = "";
              return b += a.getFullYear() + "-",
              b += a.getMonth() + 1 < 10 ? "0" + (a.getMonth() + 1) + "-" : a.getMonth() + 1 + "-",
              b += a.getDate() < 10 ? "0" + a.getDate() + " " : a.getDate() + " ",
              b += a.getHours() < 10 ? "0" + a.getHours() : a.getHours(),
              b += a.getMinutes() < 10 ? ":0" + a.getMinutes() : ":" + a.getMinutes(),
              b += a.getSeconds() < 10 ? ":0" + a.getSeconds() : ":" + a.getSeconds()
          },
          getTmsContent: function(a) {
              if (a) {
                  var b = this
                    , d = KISSY;
                  d.each(a, function(a) {
                      var e = a;
                      e.data && d.isFunction(e.hasDate) && e.hasDate(),
                      d.later(function() {
                          c.Util.getScript(e.link + (e.link.indexOf("?") > -1 ? "&" : "?") + "callback=" + e.callback + "&t=" + +new Date, {
                              onSuccess: function() {
                                  d.isFunction(b.hasDate) && e.success()
                              },
                              scope: b,
                              charset: c.Config.charset || "gbk"
                          })
                      }, 0)
                  })
              }
          },
          charToFace: function() {
              var a = {
                  "/:^_^": ["\u5fae\u7b11", "0"],
                  "/:^$^": ["\u5bb3\u7f9e", "1"],
                  "/:Q": ["\u5410\u820c\u5934", "2"],
                  "/:815": ["\u5077\u7b11", "3"],
                  "/:809": ["\u7231\u6155", "4"],
                  "/:^O^": ["\u5927\u7b11", "5"],
                  "/:081": ["\u8df3\u821e", "6"],
                  "/:087": ["\u98de\u543b", "7"],
                  "/:086": ["\u5b89\u6170", "8"],
                  "/:H": ["\u62b1\u62b1", "9"],
                  "/:012": ["\u52a0\u6cb9", "10"],
                  "/:806": ["\u80dc\u5229", "11"],
                  "/:b": ["\u5f3a", "12"],
                  "/:^x^": ["\u4eb2\u4eb2", "13"],
                  "/:814": ["\u82b1\u75f4", "14"],
                  "/:^W^": ["\u9732\u9f7f\u7b11", "15"],
                  "/:080": ["\u67e5\u627e", "16"],
                  "/:066": ["\u547c\u53eb", "17"],
                  "/:807": ["\u7b97\u8d26", "18"],
                  "/:805": ["\u8d22\u8ff7", "19"],
                  "/:071": ["\u597d\u4e3b\u610f", "20"],
                  "/:072": ["\u9b3c\u8138", "21"],
                  "/:065": ["\u5929\u4f7f", "22"],
                  "/:804": ["\u518d\u89c1", "23"],
                  "/:813": ["\u6d41\u53e3\u6c34", "24"],
                  "/:818": ["\u4eab\u53d7", "25"],
                  "/:015": ["\u8272\u60c5\u72c2", "26"],
                  "/:084": ["\u5446\u82e5\u6728\u9e21", "27"],
                  "/:801": ["\u601d\u8003", "28"],
                  "/:811": ["\u8ff7\u60d1", "29"],
                  "/:?": ["\u7591\u95ee", "30"],
                  "/:077": ["\u6ca1\u94b1\u4e86", "31"],
                  "/:083": ["\u65e0\u804a", "32"],
                  "/:817": ["\u6000\u7591", "33"],
                  "/:!": ["\u5618", "34"],
                  "/:068": ["\u5c0f\u6837", "35"],
                  "/:079": ["\u6447\u5934", "36"],
                  "/:028": ["\u611f\u5192", "37"],
                  "/:026": ["\u5c34\u5c2c", "38"],
                  "/:007": ["\u50bb\u7b11", "39"],
                  "/:816": ["\u4e0d\u4f1a\u5427", "40"],
                  "/:&apos;&quot;&quot;": ["\u65e0\u5948", "41"],
                  "/:&#39;&quot;&quot;": ["\u65e0\u5948", "41"],
                  '/:\'""': ["\u65e0\u5948", "41"],
                  "/:802": ["\u6d41\u6c57", "42"],
                  "/:027": ["\u51c4\u51c9", "43"],
                  "/:(Zz...)": ["\u56f0\u4e86", "44"],
                  "/:*&amp;*": ["\u6655", "45"],
                  "/:*&*": ["\u6655", "45"],
                  "/:810": ["\u5fe7\u4f24", "46"],
                  "/:&gt;_&lt;": ["\u59d4\u5c48", "47"],
                  "/:>_<": ["\u59d4\u5c48", "47"],
                  "/:018": ["\u60b2\u6ce3", "48"],
                  "/:&gt;O&lt;": ["\u5927\u54ed", "49"],
                  "/:>O<": ["\u5927\u54ed", "49"],
                  "/:020": ["\u75db\u54ed", "50"],
                  "/:044": ["I\u670d\u4e86U", "51"],
                  "/:819": ["\u5bf9\u4e0d\u8d77", "52"],
                  "/:085": ["\u518d\u89c1", "53"],
                  "/:812": ["\u76b1\u7709", "54"],
                  "/:&quot;": ["\u597d\u7d2f", "55"],
                  '/:"': ["\u597d\u7d2f", "55"],
                  "/:&gt;M&lt;": ["\u751f\u75c5", "56"],
                  "/:>M<": ["\u751f\u75c5", "56"],
                  "/:&gt;@&lt;": ["\u5410", "57"],
                  "/:>@<": ["\u5410", "57"],
                  "/:076": ["\u80cc", "58"],
                  "/:069": ["\u60ca\u8bb6", "59"],
                  "/:O=O": ["\u8001\u5927", "70"],
                  "/:O": ["\u60ca\u6115", "60"],
                  "/:067": ["\u95ed\u5634", "61"],
                  "/:043": ["\u6b20\u6241", "62"],
                  "/:P": ["\u9119\u89c6\u4f60", "63"],
                  "/:808": ["\u5927\u6012", "64"],
                  "/:&gt;W&lt;": ["\u751f\u6c14", "65"],
                  "/:>W<": ["\u751f\u6c14", "65"],
                  "/:073": ["\u8d22\u795e", "66"],
                  "/:008": ["\u5b66\u4e60\u96f7\u950b", "67"],
                  "/:803": ["\u606d\u559c\u53d1\u8d22", "68"],
                  "/:074": ["\u5c0f\u4e8c", "69"],
                  "/:036": ["\u90aa\u6076", "71"],
                  "/:039": ["\u5355\u6311", "72"],
                  "/:045": ["CS", "73"],
                  "/:046": ["\u9690\u5f62\u4eba", "74"],
                  "/:048": ["\u70b8\u5f39", "75"],
                  "/:047": ["\u60ca\u58f0\u5c16\u53eb", "76"],
                  "/:girl": ["\u6f02\u4eaeMM", "77"],
                  "/:man": ["\u5e05\u54e5", "78"],
                  "/:052": ["\u62db\u8d22\u732b", "79"],
                  "/:(OK)": ["\u6210\u4ea4", "80"],
                  "/:8*8": ["\u9f13\u638c", "81"],
                  "/:)-(": ["\u63e1\u624b", "82"],
                  "/:lip": ["\u7ea2\u5507", "83"],
                  "/:-F": ["\u73ab\u7470", "84"],
                  "/:-W": ["\u6b8b\u82b1", "85"],
                  "/:Y": ["\u7231\u5fc3", "86"],
                  "/:qp": ["\u5fc3\u788e", "87"],
                  "/:$": ["\u94b1", "88"],
                  "/:%": ["\u8d2d\u7269", "89"],
                  "/:(&amp;)": ["\u793c\u7269", "90"],
                  "/:(&)": ["\u793c\u7269", "90"],
                  "/:@": ["\u6536\u90ae\u4ef6", "91"],
                  "/:~B": ["\u7535\u8bdd", "92"],
                  "/:U*U": ["\u4e3e\u676f\u5e86\u795d", "93"],
                  "/:clock": ["\u65f6\u949f", "94"],
                  "/:R": ["\u7b49\u5f85", "95"],
                  "/:C": ["\u5f88\u665a\u4e86", "96"],
                  "/:plane": ["\u98de\u673a", "97"],
                  "/:075": ["\u652f\u4ed8\u5b9d", "98"]
              }
                , b = "";
              for (var c in a)
                  b += "|" + c.substring(2);
              b = b.substring(1),
              b = b.replace(/([\^?()\.\*\$])/g, "\\$1");
              var d = new RegExp("\\\\T/:(" + b + ")\\\\T","g");
              return b = new RegExp("/:(" + b + ")","g"),
              function(c, e, f) {
                  if (c)
                      if (e) {
                          var g = new RegExp("\\\\","g");
                          c = c.replace(g, function(a) {
                              return a = "\\\\"
                          }),
                          c = c.replace(b, function(b) {
                              return a[b] && (b = "\\T" + b + "\\T"),
                              b
                          })
                      } else
                          c = f ? c.replace(d, function(b) {
                              var c = b.substring(2, b.length - 2);
                              return a[c] && (b = '<img src="//assets.alicdn.com/sys/wangwang/smiley/48x48/' + a[c][1] + '.gif" alt="' + a[c][0] + '" />'),
                              b
                          }) : c.replace(b, function(b) {
                              return a[b] && (b = '<img src="//assets.alicdn.com/sys/wangwang/smiley/48x48/' + a[b][1] + '.gif" alt="' + a[b][0] + '" />'),
                              b
                          });
                  return c
              }
          }(),
          faceToChar: function(a) {
              var b = ["/:^_^", "/:^$^", "/:Q", "/:815", "/:809", "/:^O^", "/:081", "/:087", "/:086", "/:H", "/:012", "/:806", "/:b", "/:^x^", "/:814", "/:^W^", "/:080", "/:066", "/:807", "/:805", "/:071", "/:072", "/:065", "/:804", "/:813", "/:818", "/:015", "/:084", "/:801", "/:811", "/:?", "/:077", "/:083", "/:817", "/:!", "/:068", "/:079", "/:028", "/:026", "/:007", "/:816", '/:\'""', "/:802", "/:027", "/:(Zz...)", "/:*&*", "/:810", "/:>_<", "/:018", "/:>O<", "/:020", "/:044", "/:819", "/:085", "/:812", '/:"', "/:>M<", "/:>@<", "/:076", "/:069", "/:O", "/:067", "/:043", "/:P", "/:808", "/:>W<", "/:073", "/:008", "/:803", "/:074", "/:O=O", "/:036", "/:039", "/:045", "/:046", "/:048", "/:047", "/:girl", "/:man", "/:052", "/:(OK)", "/:8*8", "/:)-(", "/:lip", "/:-F", "/:-W", "/:Y", "/:qp", "/:$", "/:%", "/:(&)", "/:@", "/:~B", "/:U*U", "/:clock", "/:R", "/:C", "/:plane", "/:075"]
                , c = b[parseInt(a, 10)];
              return c && (c = c.replace("&gt;", ">").replace("&lt;", "<").replace("&amp;", "&").replace("&apos;", "'").replace("&quot;", '"').replace("&quot;", '"')),
              c
          },
          getScript: function(b, c, d) {
              var e, f, g, h, i = window.document, j = i.getElementsByTagName("head")[0] || i.documentElement, k = i.createElement("script").readyState ? function(a, b) {
                  var c = a.onreadystatechange;
                  a.onreadystatechange = function() {
                      var d = a.readyState;
                      ("loaded" === d || "complete" === d) && (a.onreadystatechange = null,
                      c && c(),
                      b.call(this))
                  }
              }
              : function(a, b) {
                  a.addEventListener("load", b, !1)
              }
              , l = /\.css(?:\?|$)/i, m = l.test(b), n = i.createElement(m ? "link" : "script"), o = c;
              return a.isPlainObject(o) && (c = o.onSuccess,
              e = o.onFailure,
              h = o.onTimeout,
              f = o.timeout,
              d = o.charset),
              m ? (n.href = b,
              n.rel = "stylesheet") : (n.src = b,
              n.async = !0),
              d && (n.charset = d),
              a.isFunction(c) && (m ? c.call(n) : k(n, function() {
                  g && (g.cancel(),
                  g = void 0),
                  c.call(n),
                  a.later(function() {
                      j.removeChild(n),
                      n = void 0
                  }, 3e3)
              })),
              a.isFunction(h) && (g = a.later(function() {
                  g = void 0,
                  h()
              }, f || 3e3)),
              j.insertBefore(n, j.firstChild),
              n
          },
          sendLog: function(b) {
              var c = "";
              e.ie ? c = "ie" + e.ie : e.firefox ? c = "firefox" + e.firefox : e.chrome ? c = "chrome" + e.chrome : e.safari ? c = "safari" + e.safari : e.opera && (c = "opera" + e.opera),
              a.later(function() {
                  try {
                      (new Image).src = "//log.mmstat.com/ww?cache=" + (new Date).getTime() + "&browse=" + c + "&" + b
                  } catch (a) {}
              }, 500)
          }
      }
  }),
  TDog.add("EventCenter", function(d) {
      var e, f, g, h, i, j, k, l, m, n, o, p, q, r = d.EVENTS, s = {
          init: function() {
              a.log("init EventCenter"),
              e = d.Util,
              f = d.Config,
              g = d.Login,
              k = d.DataManager,
              l = d.DataManager.Message,
              i = d.WebServer,
              j = d.Daemon,
              h = d.LocalStorage,
              m = d.SysTips,
              n = d.SysMessage,
              o = d.StatusIcon,
              p = d.RecentList,
              q = d.ChatDialog
          }
      };
      a.mix(s, a.EventTarget || c.Target);
      var t = function(a) {
          return "string" != typeof a || "" === a
      };
      s.on(r.CLICK_STATUS_ICON, function() {
          return a.log("\u70b9\u51fb\u72b6\u6001\u56fe\u6807"),
          g.canTalk() ? (p.isOpen() ? k.getTotalUnreadMsgCount() > 0 && o.getmessage() : o.online(),
          k.getTotalUnreadMsgCount() > 0 && !p.isOpen() && 1 === k.getTotalUnreadMsgCount() ? (s.fire(r.SHOW_CHAT_DIALOG, {
              haveUser: {
                  userName: "donotknow"
              }
          }),
          !1) : !0) : !1
      }),
      s.on(r.CLICK_LIGHT_ICON, function(b) {
          a.log("\u70b9\u51fb\u4eae\u706f\u56fe\u6807");
          var c = b.userInfo || b;
          c && c.userId && (window.__userInfo = c),
          g.canTalk(c.key, !0, c) && (c.fromLight = !0,
          s.fire(d.EVENTS.SHOW_CHAT_DIALOG, b))
      }),
      s.on(r.LOGIN_START, function() {
          0 == d.Login.online || (o.onlogin(),
          d.Login.online = !1)
      }),
      s.on(r.LOGIN_SUCCESS, function() {
          a.log("\u767b\u5f55\u6210\u529f"),
          m.hide(),
          d.Login.ready = !1;
          for (var b, c, f = Light.lightedUsers; f.length; )
              if (b = f.shift(),
              a.log("\u81ea\u52a8\u6253\u5f00\u548c " + b + " \u7684\u804a\u5929\u7a97\u53e3"),
              b) {
                  if (!(c = Light.data[b])) {
                      var g = a.unparam(location.search.substring(1))
                        , h = g.touid || g.tid;
                      if (h) {
                          if (-1 !== h.indexOf("%3C") || -1 !== h.indexOf("<") || -1 !== h.indexOf("&#60;") || /\\/.test(h))
                              return !1;
                          c = {
                              key: b,
                              userName: e.getUserName(h),
                              userId: h,
                              status: g.status || 1,
                              itemId: g.gid,
                              subscribed: !1
                          }
                      }
                      Light.data[b] = c
                  }
                  c && (c.fromLight = !0,
                  a.later(function() {
                      s.fire(d.EVENTS.SHOW_CHAT_DIALOG, {
                          userInfo: c
                      })
                  }, 1e3))
              }
          var i = k.getTotalUnreadMsgCount();
          i > 0 ? (a.log("\u5b58\u5728\u672a\u8bfb\u6d88\u606f " + i),
          o.getmessage()) : o.online()
      }),
      s.on(r.ERROR_LOGIN_FAILED, function(b) {
          a.log("\u767b\u5f55\u5931\u8d25");
          var c = b.error || {}
            , e = parseInt(c.code, 10);
          -100 === e || -101 === e ? g.directToTBLogin() : (o.offline(),
          m.show(d.ERROR_MESSAGE[e] || c.errorMessage || d.ERROR_MESSAGE[-1], 200))
      }),
      s.on(r.SHOW_RECENT_LIST, function(c) {
          a.log("\u6253\u5f00\u6700\u8fd1\u8054\u7cfb\u4eba"),
          d.DataManager.isLogin() && (i.getTalkUsers(),
          b.removeClass(b.get(".tstart-tdog-panel-bd", "#tstart-plugin-tdog"), "tstart-panel-loading"))
      }),
      s.on(r.SHOW_CHAT_DIALOG, function(b) {
          if (a.log("\u6253\u5f00\u804a\u5929\u7a97\u53e3"),
          b.haveUser && b.haveUser.userName)
              i.startChat("", "", {
                  onSuccess: function() {
                      a.log("\u83b7\u53d6\u5f00\u59cb\u804a\u5929\u6570\u636e\u5b8c\u6210\u3002")
                  },
                  onTimeout: function() {
                      a.log("\u83b7\u53d6\u5f00\u59cb\u804a\u5929\u6570\u636e\u5931\u8d25", "warn"),
                      m.show(d.ERROR_MESSAGE[-1e3])
                  }
              }, !1);
          else {
              var c = b.userInfo || {}
                , e = c.userName || ""
                , f = c.userId || c.key || ""
                , g = c.itemId || "";
              if (c.status = c.status || 1,
              (!e || t(e)) && (!f || t(f)))
                  return void m.show("\u7f51\u7edc\u51fa\u73b0\u9519\u8bef\uff0c\u8bf7\u5237\u65b0\u3002", 140, 2);
              if (a.log("\u548c " + e + " \u5f00\u59cb\u804a\u5929 fromLight = " + c.fromLight),
              e == k.getNickName())
                  return void alert("\u4e0d\u80fd\u9009\u62e9\u81ea\u5df1\u54e6\u3002");
              if (c.fromLight)
                  if (c.subscribed) {
                      var h = k.getUser(f);
                      c.status = (h || {}).statusType || c.status || 1
                  } else
                      Light.data[c.key].subscribed = !0;
              d.ChatDialog.show(c, 0 === f.indexOf("cntaobao")),
              i.startChat(f, g, {
                  onSuccess: function() {
                      a.log("\u83b7\u53d6\u5f00\u59cb\u804a\u5929\u6570\u636e\u5b8c\u6210\u3002")
                  },
                  onTimeout: function() {
                      a.log("\u83b7\u53d6\u5f00\u59cb\u804a\u5929\u6570\u636e\u5931\u8d25", "warn"),
                      q.showSysTip("<p>" + d.ERROR_MESSAGE[-14] + "</p>", !0)
                  }
              }, c.fromLight)
          }
      }),
      s.on(r.RECEIVE_CHAT_MESSAGE, function(b) {
          var c = b.unreadMsgPersonCount;
          a.log("\u6536\u5230" + c + "\u4e2a\u4eba\u7684\u6d88\u606f"),
          p.isOpen() ? (p.update(),
          q.isOpen()) : s.fire(r.UPDATE_STATUS_ICON, {
              data: {
                  mSize: c
              }
          }),
          TStart.sendStatistic("1002.1.3")
      }),
      s.on(r.RECEIVE_SUBSCRIBE_MESSAGE, function(b) {
          a.log("\u63a5\u6536\u5230\u7cfb\u7edf\u63d0\u9192"),
          n.show(b.data)
      }),
      s.on(r.RECEIVE_LOGINOUT_SIGNAL, function(b) {
          a.log("\u63a5\u6536\u5230\u65fa\u65fa\u9000\u51fa\u901a\u77e5"),
          o.offline(),
          d.SysTips.hide(),
          j.stop(),
          d.NotifyDaemon.stop(),
          k.clearAll(),
          p.close(),
          q.closeDialog()
      }),
      s.on(r.UPDATE_USER_STATUS, function(b) {
          a.log("\u66f4\u65b0\u7528\u6237\u72b6\u6001\u4fe1\u606f");
          var c = b.data;
          p.isOpen() && p.update(),
          q.isOpen() && q.updateUserStatus(e.getUserName(c.changedUserId), c.status)
      }),
      s.on(r.UPDATE_STATUS_ICON, function(b) {
          var c, d = b.data;
          a.log("\u66f4\u65b0\u72b6\u6001\u56fe\u6807"),
          c = d ? d.mSize : k.getTotalUnreadMsgCount(),
          c > 0 ? (a.log("\u6709\u591a\u5c11\u4eba\u672a\u8bfb\uff1a " + c),
          o.getmessage()) : o.online()
      }),
      s.on(r.ERROR_GET_CHAT_INFO, function() {
          q.showSysTip("<p>" + d.ERROR_MESSAGE[-1e3] + "</p>", !0)
      }),
      s.on(r.SEND_MESSAGE, function(b) {
          var c = b.content
            , e = b.userName;
          e.length <= 8 && d.Util.detect("ww.1.20.1.1.5", k.getNickName()),
          a.log("\u7ed9 " + e + " \u53d1\u9001\u4ee5\u4e0b\u6d88\u606f\uff1a" + c, "info"),
          i.send(e, c, b.callback),
          TStart.sendStatistic("1002.1.2")
      }),
      s.on(r.ERROR_GET_MESSAGE, function(b) {
          a.log("\u53d6\u670d\u52a1\u7aef\u4fe1\u606f\u5931\u8d25");
          var c = b.error
            , e = parseInt(c.code, 10);
          -100 === e || -101 === e ? (s.fire(r.RECEIVE_LOGINOUT_SIGNAL, {
              data: {
                  subType: 403
              }
          }),
          j.stop(),
          d.NotifyDaemon.stop()) : m.show(d.ERROR_MESSAGE[e] || c.errorMessage || d.ERROR_MESSAGE[-1])
      }),
      s.on(d.EVENTS.DAEMON_FIRE, function() {
          i.get()
      }),
      d.EventCenter = s
  }),
  TDog.add("Login", function(a) {
      var b, c, d, e, f = KISSY;
      a.Login = {
          online: !1,
          ready: !1,
          init: function() {
              f.log("init Login"),
              b = a.Config,
              c = a.DataManager,
              d = a.StatusIcon,
              e = a.SysTips
          },
          canTalk: function(b, f, g) {
              return c.getNickName() ? e.isShown || c.getNickName() && !d.isOffline() && c.isLogin() ? d.isOffline() || !c.isLogin() ? (f ? (a.WebServer.login(),
              e.showLoginTips(!0)) : e.showLoginTips(a.Login.ready),
              b && Light.lightedUsers.push(b),
              !1) : !0 : (e.showUseWebwwConfirmTips(g),
              !1) : (this.directToTBLogin(b),
              !1)
          },
          directToTBLogin: function(a) {
              var c = location
                , d = c.protocol + "//" + c.host + c.pathname
                , e = c.search
                , g = c.hash
                , h = c.href
                , i = c.hostname
                , j = b.LIGHT_NICK
                , k = i.indexOf("daily.") > -1 ? !0 : !1
                , l = function() {
                  return k ? i.indexOf("tmall") > -1 ? "daily.tmall.net" : "daily.taobao.net" : i.indexOf("tmall") > -1 ? "tmall.com" : "taobao.com"
              }()
                , m = l.indexOf("tmall") > -1 ? "https://login." + l + "?redirectURL=" : "https://login." + l + "/member/login.jhtml?f=top&redirectUrl=";
              e = e ? f.unparam(e.substring(1)) : {},
              j in e && delete e[j],
              a && (this.isSearch() ? e[j] = encodeURIComponent(a) : e[j] = a),
              e = f.param(e),
              h = d + "?" + e + g,
              c.href = m + encodeURIComponent(h)
          },
          isSearch: function() {
              var a = ["search.taobao.com", "sandbox.search.taobao.com", "search8.taobao.com", "search8.daily.taobao.net", "s.taobao.com"];
              return f.indexOf(location.host, a) > -1 ? !0 : void 0
          }
      }
  }),
  TDog.add("LocalStorage", function(a) {
      var b, c = KISSY, d = a.Util, e = TStart, g = d.isTaobao ? "x" : "otherx", h = "whl", i = 0, j = e.Config.DOMAIN, k = {}, l = "_ato", m = "__ll";
      a.LocalStorage = {
          init: function() {
              k = {},
              this.setCookieWHL("-1", "0", "0", "0")
          },
          setItem: function(a, b) {
              k[a] = b
          },
          getItem: function(a) {
              return k[a] || {}
          },
          getItems: function() {
              var a = [];
              for (var b in k)
                  a.push([b, k[b]]);
              return a
          },
          clear: function() {
              var a = c.unparam(f.get(g))
                , b = this;
              ("-1" != a[m] || 0 === b.getCookieWHL().messageStatus) && (k = {},
              b.setCookieWHL("-1", "0", "0", "0"),
              b.setCookieX(m, "-1"),
              b.setCookieX(l, "0"))
          },
          getCookieX: function(a) {
              return decodeURIComponent(c.unparam(f.get(g))[a])
          },
          setCookieX: function(a, b) {
              var d = c.unparam(f.get(g));
              d[a] = encodeURIComponent(b);
              var e = c.param(d);
              f.set(g, e, 365, j, "/")
          },
          setAndGetFocusTime: function(a) {
              return a && (i = a),
              i
          },
          setCookieWHL: function(a, b, c, d) {
              var e = a + "&" + b + "&" + c + "&" + d;
              f.set(h, e, "", j, "/")
          },
          setPublicKey: function(a) {
              b = a
          },
          getPublicKey: function() {
              return b || ""
          },
          getCookieWHL: function() {
              var a = f.get(h)
                , b = null;
              return a ? (b = a.split("&"),
              4 !== b.length && (b = [-1, 0, 0, 0])) : b = [-1, 0, 0, 0],
              {
                  messageStatus: parseInt(b[0]),
                  system: parseInt(b[1]),
                  heartTime: parseInt(b[2]),
                  focusTime: parseInt(b[3])
              }
          }
      }
  }),
  TDog.add("DataManager", function(b) {
      var c, d, e, g, h, i = b.Config, j = b.Util, k = "", l = TStart.Config.isOnline, m = {
          FIRST_RUN: "_first_run",
          LAST_LOGIN: "__ll",
          LAST_LOGIN_NAME: "_last_login_name",
          RECENT_LIST: "_recent_list",
          RECENT_LIST_NAME: "_recent_list_name",
          USER_LIST: "_user",
          MESSAGE_LIST: "_message_list"
      }, n = b.EVENTS;
      b.DataManager = {
          init: function() {
              var f = this;
              a.log("\u521d\u59cb\u5316 DataManager \u6a21\u5757"),
              c = b.LocalStorage,
              d = b.EventCenter,
              e = b.WebServer,
              g = b.Daemon,
              h = f.Message,
              h.init()
          },
          getRecentList: function() {
              return c.getItem(m.RECENT_LIST)
          },
          getUser: function(a) {
              var b = c.getItem(m.RECENT_LIST);
              return b ? b[a] : {}
          },
          setRecentList: function(a) {
              for (var b = c.getItem(m.RECENT_LIST), d = 0; d < a.length; d++) {
                  var e = b[a[d].userId];
                  b[a[d].userId] = a[d],
                  e && (a[d].messageTime = e.messageTime)
              }
              c.setItem(m.RECENT_LIST, b)
          },
          updateMessageTime: function(a, b) {
              var d = c.getItem(m.RECENT_LIST);
              d && d[a] && (d[a].messageTime = b)
          },
          getMessageTime: function(b) {
              var c = (this.getUser(b) || {}).messageTime || "";
              return a.log("message time :" + c),
              c
          },
          getTotalUnreadMsgCount: function() {
              var a = c.getCookieWHL();
              return a.messageStatus ? a.messageStatus : 0
          },
          saveStartChatData: function(a) {
              if ("true" == a.success.toLowerCase()) {
                  var c = a.result
                    , e = c.item || {}
                    , f = c.user;
                  c.talkUserStatus.userId.length <= 8 && b.Util.detect("ww.1.20.1.1.4", this.getNickName()),
                  this.__checkOneUserMessage(c),
                  this.__isTaobaoUser(f, e),
                  this.__saveAndViewChatMessage(c),
                  this.__updateNuberOfPeople(c)
              } else
                  -2 == a.result.error[0].code ? (b.ChatDialog.closeDialog(),
                  b.SysTips.show(b.ERROR_MESSAGE[-2], 150, 3)) : -14 == a.result.error[0].code ? (b.SysTips.show(b.ERROR_MESSAGE[-14], 0, !0),
                  this.forcedUpdateNumberOfPeople(i.NOTIFY_STATUS.notMessage.value, 0)) : -100 == a.result.error[0].code || -101 == a.result.error[0].code || -12 == a.result.error[0].code ? d.fire(b.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {
                      data: {
                          subType: 403
                      }
                  }) : d.fire(n.ERROR_GET_CHAT_INFO, {
                      data: a.result,
                      method: "start"
                  })
          },
          handleReceiveMessage: function(a) {
              var c = this;
              if ("true" == a.success.toLowerCase()) {
                  var e = a.result;
                  e.user = {
                      userChatId: e.talkUserStatus.userId
                  },
                  b.ChatDialog.updateUserStatus(e.talkUserStatus.userId, e.talkUserStatus.statusType),
                  c.__saveAndViewChatMessage(e),
                  c.__updateNuberOfPeople(e)
              } else
                  -2 == a.result.error[0].code ? (b.ChatDialog.closeDialog(),
                  b.SysTips.show(b.ERROR_MESSAGE[-2], 150, 3)) : -14 == a.result.error[0].code ? (b.SysTips.show(b.ERROR_MESSAGE[-14], 0, !0),
                  this.forcedUpdateNumberOfPeople(i.NOTIFY_STATUS.notMessage.value, 0)) : -100 == a.result.error[0].code || -101 == a.result.error[0].code || -12 == a.result.error[0].code ? d.fire(b.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {
                      data: {
                          subType: 403
                      }
                  }) : d.fire(n.ERROR_GET_CHAT_INFO, {
                      data: a.result,
                      method: "start"
                  })
          },
          clearAll: function() {
              b.ChatDialog.clearCurrentChatUserId(),
              k = "",
              c.clear()
          },
          getNickName: function() {
              var a = f.get("_nk_") || "";
              return unescape(a.replace(/\\u/g, "%u"))
          },
          getNickUrlComponent: function() {
              return 0 == k.length && (k = encodeURIComponent(unescape((f.get("_nk_") || "").replace(/\\u/g, "%u")))),
              k
          },
          isLogin: function() {
              var a = this
                , b = !!a.getNickName()
                , d = c.getCookieX(m.LAST_LOGIN);
              return l ? b && d == a.getCookieLastLoginTime() : b
          },
          getCookieLastLoginTime: function() {
              return j.isTaobao() ? a.unparam(f.get("uc1")).lltime + f.get("lastgetwwmsg") || "-1" : f.get("t") + f.get("login") || "-1"
          },
          setLastLoginTime: function() {
              c.setCookieX(m.LAST_LOGIN, this.getCookieLastLoginTime()),
              c.setCookieWHL(0, 0, (new Date).getTime(), (new Date).getTime())
          },
          resetLastLoginTime: function() {
              c.setCookieX(m.LAST_LOGIN, "0")
          },
          haveNotFocusedPage: function() {
              return c.setAndGetFocusTime() === c.getCookieWHL().focusTime
          },
          setNumberOfPeople: function(a, b) {
              var d = c.getCookieWHL();
              d.messageStatus != a && (b = 2 | b),
              c.setCookieWHL(a, b, d.heartTime, d.focusTime)
          },
          forcedUpdateNumberOfPeople: function(a, b) {
              var d = c.getCookieWHL();
              c.setCookieWHL(a, b, d.heartTime, d.focusTime)
          },
          setAndGetFocusTime: function(a) {
              if (a) {
                  var b = c.getCookieWHL();
                  return c.setCookieWHL(b.messageStatus, b.system, b.heartTime, a),
                  c.setAndGetFocusTime(a),
                  a
              }
              return c.setAndGetFocusTime()
          },
          addMessage: function(a, b) {
              var d = c.getItem(m.MESSAGE_LIST);
              if (d[a]) {
                  for (var e = 0; e < b.length; e++)
                      j.contains(d[a], b[e]) || d[a].push(b[e]);
                  for (; d[a].length > 20; )
                      d[a].shift()
              } else
                  d[a] = b
          },
          addAllMessage: function(a, b) {
              var d = c.getItem(m.MESSAGE_LIST);
              for (d[a] = b,
              c.setItem(m.MESSAGE_LIST, d); b.length > 20; )
                  b.shift()
          },
          deleteMessage: function(a) {
              var b = c.getItem(m.MESSAGE_LIST);
              b[a] && (b[a] = []),
              c.setItem(m.MESSAGE_LIST, b)
          },
          getAllMessages: function(a) {
              return c.getItem(m.MESSAGE_LIST)[a] || []
          },
          getHeartTime: function() {
              return c.getCookieWHL().heartTime
          },
          setHeartTime: function(a) {
              var b = c.getCookieWHL();
              c.setCookieWHL(b.messageStatus, b.system, a, b.focusTime)
          },
          startHeartTime: function(a) {
              var b = c.getCookieWHL();
              c.setCookieWHL(b.messageStatus, b.system, a, b.focusTime)
          },
          setMessageStatus: function(a, b) {
              var d = c.getCookieWHL();
              c.setCookieWHL(a, b, d.heartTime, d.focusTime)
          },
          getCookieWHL: function() {
              return c.getCookieWHL()
          },
          setCookieWHL: function(a, b, d, e) {
              c.setCookieWHL(a, b, d, e)
          },
          getLoginKey: function() {
              return c.getPublicKey()
          },
          setLoginKey: function(a) {
              c.setPublicKey(a)
          },
          __checkOneUserMessage: function(a) {
              if (a.talkUserStatus && a.talkUserStatus.userId) {
                  var c = a.talkUserStatus;
                  if (c.userId.length <= 8 && b.Util.detect("ww.1.20.1.1.8", this.getNickName()),
                  a.single) {
                      var d = {
                          userName: a.user.nick,
                          userId: c.userId,
                          relation: c.relation,
                          status: c.statusType
                      };
                      b.ChatDialog.show(d, 0 === d.userId.indexOf("cntaobao"))
                  } else
                      b.ChatDialog.updateUserStatus(a.user.nick, c.statusType)
              }
          },
          __isTaobaoUser: function(a, c) {
              if (0 === a.userChatId.indexOf("cntaobao")) {
                  var d = c.title ? {
                      user: a,
                      item: c
                  } : {
                      user: a
                  };
                  b.ChatDialog.showInfo(d)
              }
          },
          __saveAndViewChatMessage: function(a) {
              var c = a.user;
              this.updateMessageTime(c.userChatId, a.timeStamp),
              a.messages && a.messages.length && (a.all ? this.addAllMessage(c.userChatId, a.messages) : this.addMessage(c.userChatId, a.messages)),
              b.ChatDialog.updateMsg()
          },
          __updateNuberOfPeople: function(a) {
              this.forcedUpdateNumberOfPeople(a.size, 0),
              0 == a.size ? d.fire(n.UPDATE_STATUS_ICON, {
                  data: {
                      mSize: 0
                  }
              }) : d.fire(n.RECEIVE_CHAT_MESSAGE, {
                  unreadMsgPersonCount: a.size
              })
          },
          hash: function() {
              return [2, 13, 28, 9, 18, 27, 23, 20, 17, 27, 7, 9, 29, 25, 5, 24]
          }
      }
  }),
  TDog.add("DataManager.Message", function(a) {
      var b, c, d, e, f, g, h = KISSY, i = a.DataManager, j = a.EVENTS, k = a.MESSAGE_SUBTYPE, l = a.MESSAGE_TYPE;
      h.isPlainObject(i) && (i.Message = {
          init: function() {
              h.log("\u521d\u59cb\u5316 Message \u6a21\u5757"),
              b = a.LocalStorage,
              c = a.EventCenter,
              d = a.Daemon,
              e = a.NotifyDaemon,
              g = a.WebServer,
              f = a.ChatDialog
          },
          saveGetData: function(a) {
              var b, d, e, f = 0;
              if ("true" == a.success.toLowerCase() && a.result.messages) {
                  e = a.result.messages,
                  f = a.result.size;
                  for (var g = 0, i = e.length; i > g; g++)
                      switch (b = e[g],
                      d = parseInt(b.subType, 10),
                      parseInt(b.type, 10)) {
                      case l.LOGOUT:
                          return h.log("\u6536\u5230\u9000\u51fa\u901a\u77e5\uff0c\u505c\u6b62\u8bf7\u6c42\u8f6e\u8be2", "warn"),
                          void c.fire(j.RECEIVE_LOGINOUT_SIGNAL, {
                              data: b
                          });
                      case l.STATUS:
                          var m = b.changedUserId || "";
                          m && (h.log("\u6536\u5230\u7528\u6237 " + m + " \u7684\u72b6\u6001\u66f4\u65b0\u4fe1\u606f"),
                          c.fire(j.UPDATE_USER_STATUS, {
                              data: b
                          }));
                          break;
                      case l.SYSTEM:
                          switch (d) {
                          case k.SUBSCRIBE_MESSAGE:
                              c.fire(j.RECEIVE_SUBSCRIBE_MESSAGE, {
                                  data: b
                              });
                              break;
                          case k.POPUP_MESSAGE:
                              c.fire(j.RECEIVE_POPUP_MESSAGE, {
                                  data: b
                              })
                          }
                          break;
                      case l.OFFLINE:
                      case l.SELF:
                      case l.TALK:
                          h.log("\u63a5\u53d7\u5230\u6b63\u5e38\u7684\u804a\u5929\u6570\u636e,ERROR`")
                      }
              }
          },
          checkCurrentUserMessage: function(a, b) {
              var c = f.getCurrentChatUserId();
              return c ? (g.receiveMessage(c, b, a),
              !0) : !1
          },
          clearAll: i.clearAll
      })
  }),
  TDog.add("Daemon", function(b) {
      var d, e, f, g, h, i, j, k, l, m, n, o = !1, p = !1, q = 800, r = 1200;
      b.Daemon = {
          init: function() {
              a.log("\u521d\u59cb\u5316 Daemon \u6a21\u5757");
              var c = this;
              d = b.Util,
              e = b.EventCenter,
              f = b.LocalStorage,
              g = b.WebServer,
              h = b.DataManager,
              i = b.Config,
              j = b.StatusIcon,
              l = b.SysTips,
              k = b.NotifyDaemon,
              m = b.ChatDialog,
              n = b.EVENTS,
              c._bindEvent()
          },
          start: function() {
              var a = this;
              p = !0,
              o = !0,
              h.setAndGetFocusTime((new Date).getTime()),
              a.fire()
          },
          fire: function() {
              try {
                  var b = this;
                  b.timer && b.timer.cancel();
                  var c = m.isOpen() ? q : r
                    , d = null;
                  p && o ? (d = h.getCookieWHL(),
                  d.system > 0 && (h.setCookieWHL(d.messageStatus, 0, d.heartTime, d.focusTime),
                  1 == (1 & d.system) && e.fire(n.DAEMON_FIRE),
                  2 == (2 & d.system) && h.Message.checkCurrentUserMessage(!1, !0))) : b.notHaveFocusedPage() && (d = h.getCookieWHL(),
                  2 == (2 & d.system) && (h.setCookieWHL(d.messageStatus, 0, d.heartTime, d.focusTime),
                  h.Message.checkCurrentUserMessage(!1, !1))),
                  b.execute(d, c)
              } catch (f) {
                  a.log("\u8f6e\u8be2\u51fa\u9519\u4e86\u3002"),
                  b.timer && b.timer.cancel(),
                  b.timer = a.later(function() {
                      b.fire()
                  }, q)
              }
          },
          execute: function(b, c) {
              var d = this;
              return i.NOTIFY_STATUS.logout.value == b.messageStatus ? void e.fire(n.RECEIVE_LOGINOUT_SIGNAL, {
                  data: {
                      subType: 403
                  }
              }) : (b.messageStatus > 0 && (m.isOpen() || j.onNewMessage() || e.fire(n.RECEIVE_CHAT_MESSAGE, {
                  unreadMsgPersonCount: b.messageStatus
              })),
              void (d.timer = a.later(function() {
                  d.fire()
              }, c)))
          },
          stop: function() {
              var b = this;
              p && (a.log("\u505c\u6b62\u672c\u5730\u8f6e\u8be2\u3002"),
              b.timer && b.timer.cancel(),
              p = !1)
          },
          notHaveFocusedPage: function() {
              return h.haveNotFocusedPage()
          },
          isFocused: function() {
              return o
          },
          _bindEvent: function() {
              var d = this
                , f = window;
              o = !0,
              h.setAndGetFocusTime((new Date).getTime()),
              c.on(f, "focus", function() {
                  a.log("\u5f53\u524d\u7a97\u53e3\u83b7\u5f97\u7126\u70b9"),
                  o = !0,
                  h.isLogin() ? o && (d.notHaveFocusedPage() || (h.setAndGetFocusTime((new Date).getTime()),
                  h.Message.checkCurrentUserMessage(!1, !0)),
                  d.start(),
                  k.restart(),
                  l.hide(),
                  e.fire(n.RECEIVE_CHAT_MESSAGE, {
                      unreadMsgPersonCount: h.getTotalUnreadMsgCount()
                  })) : e.fire(b.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {
                      data: {
                          subType: 403
                      }
                  })
              }),
              c.on(f, "blur", function() {
                  a.log("\u5f53\u524d\u7a97\u53e3\u5931\u53bb\u7126\u70b9\u3002"),
                  o = !1
              })
          }
      };
      var s = 7e3
        , t = !1
        , u = -9
        , v = 15e3
        , w = 1
        , x = void 0;
      b.NotifyDaemon = {
          init: function() {
              var b = this;
              b.restart(),
              a.log("\u521d\u59cb\u5316\u957f\u8fde\u63a5\u90e8\u4efd.")
          },
          start: function() {
              var b = this;
              t = !0,
              h.startHeartTime(u),
              b.__createConnection(),
              a.log("\u767b\u5f55\u5b8c\u6210\uff0c\u5f00\u59cb\u957f\u8fde\u63a5.")
          },
          restart: function() {
              var a = this;
              t = !0,
              a.__heartTimeout()
          },
          stop: function() {
              var b = this;
              t && (a.log("\u505c\u6b62\u5916\u90e8\u957f\u94fe\u63a5\u68c0\u67e5\u3002"),
              b.heartTimeoutTimer && b.heartTimeoutTimer.cancel(),
              t = !1)
          },
          __createConnection: function() {
              try {
                  x = document.createElement("iframe"),
                  x.width = 0,
                  x.height = 0,
                  x.style.display = "none",
                  x.src = i.notifyUrl;
                  var b = document.getElementsByTagName("body")[0];
                  b.appendChild(x, b.lastChild)
              } catch (c) {
                  a.log("\u8fdc\u7a0b\u8fde\u63a5\u5f02\u5e38\u4e86\u2026\u2026" + c)
              }
          },
          __heartTimeout: function() {
              var b = this;
              b.heartTimeoutTimer && b.heartTimeoutTimer.cancel(),
              t && (b.heartTimeoutTimer = a.later(function() {
                  var c = h.getCookieWHL();
                  a.log("\u68c0\u67e5\u957f\u94fe\u63a5\uff0c\u91cd\u65b0\u5f00\u59cb:" + ((new Date).getTime() - c.heartTime > s) + "," + ((new Date).getTime() - c.heartTime) + "," + (new Date).getTime() + "," + c.heartTime),
                  (c.heartTime == u || (new Date).getTime() - c.heartTime > s && c.heartTime !== u && c.messageStatus !== i.NOTIFY_STATUS.logout.value) && (x ? (a.log("\u957f\u94fe\u63a5\u7684frame\u5df2\u7ecf\u5b58\u5728\u3002"),
                  x.src = i.notifyUrl) : (b.__createConnection(),
                  a.log("\u957f\u94fe\u63a5\u7684frame\u4e0d\u5df2\u7ecf\u5b58\u5728\u3002")),
                  h.setHeartTime(u),
                  t = !0,
                  b.__checkConnection()),
                  b.__heartTimeout()
              }, s))
          },
          __checkConnection: function() {
              var b = this;
              w++ < 4 && a.later(function() {
                  h.getHeartTime() === u && (x ? (a.log("\u957f\u94fe\u63a5\u7684frame\u5df2\u7ecf\u5b58\u5728\u3002"),
                  x.src = i.notifyUrl) : (b.__createConnection(),
                  a.log("\u957f\u94fe\u63a5\u7684frame\u4e0d\u5df2\u7ecf\u5b58\u5728\u3002")))
              }, v)
          }
      }
  }),
  TDog.add("WebServer", function(c) {
      var d = c.Config
        , f = c.DataManager
        , g = c.EVENTS
        , i = c.EventCenter
        , j = c.Daemon
        , k = 0
        , l = 5e3
        , m = c.SITES
        , n = m.TAOBAO
        , o = 1
        , p = 0
        , q = {
          getToken: {
              url: d.getTokenUrl,
              callback: "TDog.WebServer.globalToken"
          },
          login: {
              url: d.loginUrl,
              callback: "TDog.WebServer.prepareLogin"
          },
          checkautologin: {
              url: d.checkAutoLogin,
              callback: "TDog.WebServer.decideAutoLogin"
          },
          getloginresult: {
              url: d.getLoginResultUrl,
              callback: "TDog.WebServer.disposeLoginResult"
          },
          setstrangermsg: {
              url: d.setAutoLoginUrl,
              callback: "TDog.WebServer.setStrangerMsgData"
          },
          clearchatlist: {
              url: d.clearListUrl,
              callback: "TDog.WebServer.clearChatListData"
          },
          clearchatmessage: {
              url: d.clearListUrl,
              callback: "TDog.WebServer.handClearChatMessage"
          },
          setautologin: {
              url: d.setAutoLoginUrl,
              callback: "TDog.WebServer.setAutoLoginData"
          },
          start: {
              url: d.startUrl,
              callback: "TDog.DataManager.saveStartChatData"
          },
          receive: {
              url: d.startUrl,
              callback: "TDog.DataManager.handleReceiveMessage"
          },
          send: {
              url: d.sendUrl,
              callback: "TDog.WebServer.handleSendResult"
          },
          get: {
              url: d.getUrl,
              callback: "TDog.DataManager.Message.saveGetData"
          },
          getTalkUsers: {
              url: d.getTalkUsers,
              callback: "TDog.WebServer.handleTalkUsers"
          },
          ackGetMessage: {
              url: d.ackGetMessage,
              callback: "TDog.WebServer.handleAckResult"
          },
          checkUserSeting: {
              url: d.ackGetMessage,
              callback: "TDog.WebServer.handUserSeting"
          },
          getServerKey: {
              url: d,
              callback: "TDog.WebServer.handleLoginFirst"
          }
      };
      c.WebServer = {
          AUTO_LOGIN: {
              autoLoginAndTip: 1,
              autoLoginNotTip: 2,
              forcedLogin: 3
          },
          init: function() {
              var b = this;
              b.getTokenNum = 1,
              a.log("\u521d\u59cb\u5316 WebServer \u6a21\u5757"),
              b.getToken()
          },
          _request: function(b, e) {
              var g = f.getNickUrlComponent()
                , h = 0 == g.length ? "" : "&nkh=" + g;
              b = b + h + "&appId=" + d.appId,
              a.log("[" + new Date + "] " + b + "&t=" + +new Date, "info"),
              a.isFunction(e.onFailure) && (e.onFailure = e.onTimeout),
              c.Util.getScript(b + "&t=" + +new Date, {
                  onSuccess: function() {
                      a.isFunction(e.onSuccess) && e.onSuccess.call(this)
                  },
                  onFailure: function() {
                      a.isFunction(e.onFailure) && e.onFailure.call(this)
                  },
                  onTimeout: function() {
                      a.isFunction(e.onTimeout) && e.onTimeout.call(this)
                  },
                  success: function() {
                      "function" == typeof e.onSuccess && e.onSuccess.call(this)
                  },
                  error: function() {
                      "function" == typeof e.onFailure && e.onFailure.call(this)
                  },
                  scope: this,
                  charset: d.charset || "gbk",
                  timeout: l
              })
          },
          sitePrefix: function() {
              var a = [];
              for (var b in m)
                  a.push(m[b]);
              return new RegExp("^(" + a.join("|") + ")(.*)$","i")
          }(),
          formatNick: function(a) {
              var b = this
                , c = b.sitePrefix;
              return c.test(a) ? a : n + a
          },
          getNick: function(a) {
              if (a) {
                  var b = this
                    , c = b.sitePrefix
                    , d = a.match(c);
                  return d && "undefined" != typeof d[2] && d[2] ? d[2] : a
              }
          },
          getToken: function() {
              var b = this
                , c = "getToken"
                , e = a.param({
                  callback: q[c].callback
              });
              b._request(d.getTokenUrl + "?" + e, {})
          },
          setAutoLogin: function(b) {
              var c = this
                , e = "setautologin"
                , f = a.param({
                  token: c.token,
                  callback: q[e].callback
              });
              c._request(d.setAutoLoginUrl + "?act=" + b + "&" + f, {})
          },
          setAutoLoginData: function(a) {
              this.__handleErrorResult(a)
          },
          setStrangerMsg: function(b) {
              var c = this
                , e = "setstrangermsg"
                , f = a.param({
                  token: c.token,
                  callback: q[e].callback
              });
              c._request(d.setAutoLoginUrl + "?act=" + b + "&" + f, {})
          },
          setStrangerMsgData: function(a) {
              this.__handleErrorResult(a)
          },
          clearChatList: function() {
              var b = this
                , c = "clearchatlist"
                , e = a.param({
                  token: b.token,
                  callback: q[c].callback
              });
              b._request(d.clearListUrl + "&" + e, {})
          },
          clearChatListData: function(a) {
              this.__handleErrorResult(a)
          },
          clearChatMessage: function(b) {
              var c = this
                , e = "clearchatmessage"
                , f = a.param({
                  act: 1,
                  targetNick: b,
                  token: c.token,
                  callback: q[e].callback
              });
              c._request(d.clearUrl + "?" + f, {})
          },
          handClearChatMessage: function(a) {
              this.__handleErrorResult(a)
          },
          checkAutoLogin: function(b) {
              var c = this
                , e = "checkautologin"
                , f = a.param({
                  token: c.token,
                  callback: q[e].callback,
                  check: "1"
              });
              c._request(d.checkAutoLoginUrl + "?cat=-1&" + f, b || {})
          },
          checkUserSeting: function(b) {
              var c = this
                , e = "checkUserSeting"
                , f = a.param({
                  token: c.token,
                  callback: q[e].callback
              });
              c._request(d.checkAutoLoginUrl + "?cat=-1&" + f, b || {})
          },
          globalToken: function(b) {
              var d = this;
              d.getTokenNum > 3 || (d.getTokenNum++,
              "true" === b.success.toLowerCase() ? (d.token = b.result.token,
              j.init(),
              f.isLogin() ? (i.fire(g.LOGIN_SUCCESS),
              c.NotifyDaemon.init(),
              j.start()) : f.getNickName() ? (c.LocalStorage.init(),
              d.checkAutoLogin()) : (c.LocalStorage.init(),
              a.log("\u963f\u91cc\u65fa\u65fa\uff08\u672a\u767b\u5f55\uff09"),
              c.SysTips.setHoverTips("\u963f\u91cc\u65fa\u65fa\uff08\u672a\u767b\u5f55\uff09"))) : d.getToken())
          },
          handUserSeting: function(a) {
              var c = this;
              if (c.__handleErrorResult(a),
              "true" === a.success.toLowerCase()) {
                  var d = a.result
                    , e = !(8192 & parseInt(d.tag, 10))
                    , f = 16384 & parseInt(d.tag, 10);
                  e ? b.get("#tstart .tstart-settings-login").checked = !0 : b.get("#tstart .tstart-settings-login").checked = !1,
                  f ? b.get("#tstart .tstart-settings-msg").checked = !0 : b.get("#tstart .tstart-settings-msg").checked = !1
              }
          },
          decideAutoLogin: function(b) {
              var d = this;
              if (d.__handleErrorResult(b),
              "true" === b.success.toLowerCase())
                  if (-1 == b.result.tag)
                      d.__completeLogin();
                  else {
                      var f = b.result
                        , g = !(8192 & parseInt(f.tag, 10))
                        , h = c.Config.forceAutoLogin;
                      g && e.ie ? d.login(d.AUTO_LOGIN.autoLoginNotTip) : h ? (a.log("\u6ee1\u8db3\u81ea\u52a8\u767b\u5f55\u6761\u4ef6\uff0c\u53d1\u8d77\u767b\u5f55\u8bf7\u6c42"),
                      d.login()) : a.log("\u4e0d\u6ee1\u8db3\u81ea\u52a8\u767b\u5f55\u6761\u4ef6")
                  }
          },
          prepareLogin: function(a) {
              var b = this;
              if ("false" == a.success.toLowerCase()) {
                  var d = parseInt((a.result.error[0] || {}).code) || 0;
                  switch (d) {
                  case -15:
                      c.SysTips.showClientOnlineTips(),
                      c.Util.sendLog("wwweblog=logged"),
                      window.__userInfo && window.__userInfo.userId && (h("aliim:sendmsg?" + b._paramUserInfo(window.__userInfo)),
                      delete window.__userInfo);
                      break;
                  case -16:
                      break;
                  default:
                      i.fire(g.ERROR_LOGIN_FAILED, {
                          error: a.result.error[0]
                      })
                  }
              } else
                  b.getLoginResult()
          },
          _paramUserInfo: function(a) {
              var b = a.userId || a.siteid + a.touid;
              return "&touid=" + b + "&siteid=" + (a.fromSite || a.siteid) + "&status=" + a.status + "&portalId=" + (a.portalId || "") + "&gid=" + (a.itemId || "")
          },
          getLoginResult: function() {
              var b = this;
              a.log("\u767b\u5f55\u6210\u529f\uff0c\u8fc7 1 \u79d2\u949f\u83b7\u53d6\u767b\u5f55\u540e\u7684\u7ed3\u679c"),
              a.later(function() {
                  var e = a.param({
                      time: o,
                      token: b.token,
                      callback: q.getloginresult.callback
                  });
                  b._request(d.getLoginResultUrl + "?" + e, {
                      onSuccess: function() {
                          a.log("\u4e8c\u6b21\u8bf7\u6c42\u5f97\u5230\u767b\u5f55\u7ed3\u679c\u767b\u5f55\u5b8c\u6210"),
                          f.isLogin() && (b.get(),
                          c.NotifyDaemon.start(),
                          j.start(),
                          i.fire(g.LOGIN_SUCCESS),
                          c.SysTips.show("\u963f\u91cc\u65fa\u65fa - " + f.getNickName() + "(\u5728\u7ebf)", "150", 5),
                          k = (new Date).getTime(),
                          o = 1),
                          window.__userInfo && window.__userInfo.userId && (h("aliim:sendmsg?" + b._paramUserInfo(window.__userInfo)),
                          delete window.__userInfo)
                      },
                      onFailure: function() {
                          i.fire(g.RECEIVE_LOGINOUT_SIGNAL, {
                              data: {
                                  subType: 403
                              }
                          })
                      },
                      onTimeout: function() {
                          i.fire(g.RECEIVE_LOGINOUT_SIGNAL, {
                              data: {
                                  subType: 403
                              }
                          })
                      }
                  })
              }, 1e3 * o)
          },
          disposeLoginResult: function(b) {
              var c = this;
              a.log("\u767b\u5f55:" + b.success),
              "true" === b.success.toLowerCase() ? f.setLastLoginTime() : ++o < 4 && b.result.error && -99 == b.result.error[0].code ? c.getLoginResult() : (o = 1,
              f.resetLastLoginTime(),
              i.fire(g.ERROR_LOGIN_FAILED, {
                  error: (b.result.error || [])[0]
              }))
          },
          login: function(b, e) {
              var h, j = this, k = "login", l = j.__encrypt();
              if (l) {
                  if (h = a.param({
                      token: j.token,
                      callback: q[k].callback,
                      nickName: f.getNickName(),
                      autoLogin: b || j.AUTO_LOGIN.autoLoginAndTip,
                      loginTag: l
                  }),
                  !c.SysTips.isShown)
                      return setTimeout(function() {
                          c.SysTips.showUseWebwwConfirmTips({
                              isLogin: !0
                          })
                      }),
                      !1;
                  i.fire(g.LOGIN_START),
                  a.log("\u8bf7\u6c42\u767b\u5f55\u5f00\u59cb"),
                  j._request(d.loginUrl + "?" + h, e || {})
              }
          },
          startChat: function(b, c, e, g) {
              var h, i = this, j = "start";
              h = a.param({
                  token: i.token,
                  callback: q[j].callback,
                  userId: b,
                  itemId: c || "",
                  fromLight: g ? "true" : "false",
                  time: f.getMessageTime(b)
              }),
              i._request(d.startUrl + "?" + h, e || {})
          },
          receiveMessage: function(b, c, e, g) {
              var h, i = this, j = "receive";
              h = a.param({
                  token: i.token,
                  callback: q[j].callback,
                  targetUserChatId: b,
                  focused: c,
                  update: e,
                  time: f.getMessageTime(b)
              }),
              i._request(d.receiveUrl + "?" + h, g || {})
          },
          send: function(b, e, f) {
              var g, h = this;
              return b.length <= 8 || !e.length ? void c.ChatDialog.showSysTip("<p><span>\u6d88\u606f\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u6253\u5f00\u804a\u5929\u7a97\u53e3\uff01</span></p>") : (b = h.formatNick(b),
              g = a.param({
                  token: h.token,
                  callback: q.send.callback,
                  userId: b,
                  content: e
              }),
              void h._request(d.sendUrl + "?" + g, f || {}))
          },
          handleSendResult: function(a) {
              this.__handleErrorResult(a)
          },
          get: function(b) {
              var c, e = this, f = "get";
              a.log("\u8f6e\u8be2\u83b7\u53d6\u4fe1\u606f"),
              c = a.param({
                  token: e.token,
                  callback: q[f].callback
              }),
              e._request(d.getUrl + "?" + c, {})
          },
          getTalkUsers: function(b) {
              var c = this
                , e = "getTalkUsers"
                , f = a.param({
                  token: c.token,
                  callback: q[e].callback
              });
              c._request(d.getTalkUsers + "?" + f, b || {}),
              a.log("\u53d6\u804a\u5929\u4eba\u5217\u8868\u3002")
          },
          handleTalkUsers: function() {
              var b = 1;
              return function(d) {
                  var e = c.WebServer.__handleErrorResult(d);
                  "true" == d.success ? (a.log("\u66f4\u65b0\u8054\u7cfb\u4eba\u5217\u8868\u6210\u529f\uff1a" + b),
                  c.RecentList.updateRecentlist(d.result.person),
                  d.result.person.length > 0 && f.setRecentList(d.result.person),
                  f.forcedUpdateNumberOfPeople(d.result.size, 0)) : b++ < 4 && !e ? (a.log("\u66f4\u65b0\u8054\u7cfb\u4eba\u5217\u8868\u5931\u8d25\uff0c\u91cd\u8bd5\uff1a" + b),
                  c.WebServer.getTalkUsers({})) : a.log("\u66f4\u65b0\u8054\u7cfb\u4eba\u5217\u8868\u5931\u8d25\uff0c\u91cd\u8bd5\u4e09\u6b21\u6216\u9000\u51fa\u767b\u5f55\u7ed3\u675f\u3002")
              }
          }(),
          ack: function(b, c, e) {
              var f, g = this;
              f = a.param({
                  token: g.token,
                  callback: q.ackGetMessage.callback,
                  userId: b,
                  num: c
              }),
              g._request(d.ackGetMessage + "?" + f, e || {})
          },
          handleAckResult: function(b) {
              a.log("\u6536\u5230\u6d88\u606f\u5e94\u7b54:" + b.success),
              this.__handleErrorResult(b)
          },
          __handleErrorResult: function(a) {
              return "false" !== a.success || !a.result.error[0] || -100 != a.result.error[0].code && -101 != a.result.error[0].code && -12 != a.result.error[0].code ? !1 : (i.fire(c.EVENTS.RECEIVE_LOGINOUT_SIGNAL, {
                  data: {
                      subType: 403
                  }
              }),
              !0)
          },
          __encrypt: function() {
              var a = this
                , b = f.getLoginKey();
              return b.length ? a.__encryptKey() : void a.__getServerKey()
          },
          __getServerKey: function() {
              var b, c = this, e = "getServerKey";
              b = a.param({
                  token: c.token,
                  callback: q[e].callback
              }),
              c._request(d.TagKeyUrl + "?" + b, {})
          },
          __encryptKey: function() {
              for (var a = "", b = this, c = f.getLoginKey(), d = b.__make(), e = 0; e < d.length; e++)
                  a += c.charAt(d[e]);
              var g = encodeURIComponent(f.getNickName()).charAt(2);
              return g + a
          },
          handleLoginFirst: function(a) {
              var b = this;
              "true" == a.success ? (f.setLoginKey(a.result.tagKey),
              p++ < 3 && b.login()) : i.fire(g.ERROR_LOGIN_FAILED, {
                  error: a.result.error[0]
              })
          },
          __make: function() {
              for (var b = [], c = f.hash(), e = d.hash, g = 0; 16 > g; g++)
                  b.push(Math.floor(c[g] + e[g] / 7.3 * 100) % 32);
              return a.log("hash:" + b.join(",")),
              b
          },
          __completeLogin: function() {
              a.log("\u5df2\u7ecf\u767b\u5f55\u8fc7\u540e\uff0c\u5b8c\u6210\u767b\u5f55\u3002"),
              f.setLastLoginTime(),
              f.isLogin() && (this.get(),
              c.NotifyDaemon.start(),
              j.start(),
              i.fire(g.LOGIN_SUCCESS),
              k = (new Date).getTime(),
              o = 1)
          },
          uptime: function() {
              return k
          }
      }
  }),
  TDog.add("RecentList", function(d) {
      var e, f, g, h = d.DataManager, i = d.EventCenter, j = d.Util, k = '<div class="tdog-recentlist"><ul>{ITEMS}</ul></div>', l = '<li class="tdog-recentlist-item tdog-status-{status}"><i></i><span class="tdog-user-name" id="{userId}">{userName}</span><span class="tdog-msg-count">{msgCount}</span></li>';
      d.RecentList = {
          init: function() {
              f = d.hostEl,
              e = d.ChatDialog,
              g = b.get(".tstart-tdog-panel-bd", d.hostEl),
              this._bindUI()
          },
          update: function() {
              d.WebServer.getTalkUsers()
          },
          updateRecentlist: function(c) {
              var f, h = c.length, i = "";
              for (a.log("\u66f4\u65b0\u8054\u7cfb\u4eba\u5217\u8868"),
              0 === h ? (i = '<p class="tdog-recentlist-none">\u6682\u65e0\u8054\u7cfb\u4eba</p>',
              b.addClass(b.get(".tstart-tdog-panel-clearbtn", d.hostEl), "hidden")) : b.removeClass(b.get(".tstart-tdog-panel-clearbtn", d.hostEl), "hidden"),
              f = h - 1; f >= 0; --f)
                  0 == c[f].size || void 0 == c[f].size || c[f].userId == e.getCurrentChatUserId() ? c[f].size = "" : c[f].size = "(" + c[f].size + ")",
                  c[f].userName = d.Util.getUserName(c[f].userId),
                  c[f].status = c[f].statusType,
                  i += j.substitute(l, {
                      status: d.USER_STATUS[c[f].status][0],
                      userName: j.getUserName(c[f].userId),
                      msgCount: c[f].size,
                      userId: c[f].userId
                  });
              i = k.replace("{ITEMS}", i),
              g.innerHTML = i,
              b.removeClass(b.get(".tstart-tdog-panel-bd", "#tstart-plugin-tdog"), "tstart-panel-loading")
          },
          close: function() {
              b.removeClass(d.hostEl, "tstart-item-active"),
              d.DataManager.isLogin() && h.getTotalUnreadMsgCount() > 0 && d.StatusIcon.getmessage()
          },
          isOpen: function() {
              return b.hasClass(f, "tstart-item-active")
          },
          _bindUI: function() {
              var a, e = function(a) {
                  var b = a.target;
                  return "LI" == b.parentNode.nodeName.toUpperCase() && (b = b.parentNode),
                  "LI" == b.nodeName.toUpperCase() ? b : !1
              }, f = this;
              c.on(g, "click", function(c) {
                  if (a = e(c)) {
                      var f = b.get(".tdog-user-name", a).id;
                      if (d.ChatDialog.checkDialogOpen(f))
                          return;
                      var g = h.getUser(f);
                      g && (i.fire(d.EVENTS.SHOW_CHAT_DIALOG, {
                          userInfo: g
                      }),
                      b.get(".tdog-msg-count", a).innerHTML = "")
                  }
              }),
              c.on(g, "mouseover mouseout", function(c) {
                  a = e(c),
                  a && "true" != a.getAttribute("current") && b.toggleClass(a, "tdog-recentlist-hover")
              }),
              c.on(g, "mousedown mouseup", function(c) {
                  a = e(c),
                  a && b.toggleClass(a, "tdog-recentlist-select")
              }),
              c.on(window, "click", function() {
                  h.isLogin() && h.getTotalUnreadMsgCount() > 0 && d.StatusIcon.getmessage()
              }),
              c.on(d.hostEl, "click", function(a) {
                  var c = a.target;
                  b.hasClass(c, "tstart-tdog-panel-clearbtn") && (d.WebServer.clearChatList(),
                  b.get("#tstart .tdog-recentlist").innerHTML = '<ul><p class="tdog-recentlist-none">\u6682\u65e0\u8054\u7cfb\u4eba</p></ul>',
                  b.addClass(b.get(".tstart-tdog-panel-clearbtn", d.hostEl), "hidden")),
                  (b.hasClass(c, "tstart-tdog-panel-closebtn") || "img" === c.tagName.toLowerCase() && b.parent(c, ".tstart-tdog-panel-closebtn")) && f.close()
              })
          }
      }
  }),
  TDog.add("ChatDialog", function(d) {
      var f, g, h, i, j = TStart, k = encodeURIComponent, l = d.EventCenter, m = d.WebServer, n = d.Config, o = d.Util, p = document, q = window, r = (j.Config.DOMAIN,
      j.Config.isOnline,
      []), s = null, t = null, u = '<div class="tdog-popup-tms-bullet"><div class="tdog-popup-tms-bulletin"></div></div>', v = '<div class="tdog-popup tdog-popup-blue ' + (e.ie ? "tdog-ie" : "") + '" style="width:416px;bottom:40px;overflow:normal;"><div class="tdog-popup-head" ><div><i class="tdog-status-"></i><div><span class="tdog-popup-contact"></span></div></div><span class="tdog-popup-tools"><span title="\u5e2e\u52a9" class="tdog-popup-help"></span><span title="\u5173\u95ed" class="tdog-popup-close"></span></span></div><div class="tdog-popup-main"><div class="tdog-popup-talkleftouter"><div class="tdog-popup-talkleftinner"><div class="tdog-popup-talkcontainer">' + u + '<div class="tdog-popup-talkhistory"></div><div class="tdog-popup-talkbar">    <span title="\u8868\u60c5"></span>    <span class="tdog-popup-talkbar-clear" title="\u6e05\u7a7a\u804a\u5929\u8bb0\u5f55"></span></div><div class="tdog-popup-talkinput">    <textarea cols="5"></textarea></div><a title="\u9690\u85cf\u53f3\u8fb9\u680f" class="tdog-popup-pulloff" href="javascript:void(0);"><span></span></a></div><div class="tdog-popup-talkfoot"><span class="tdog-popup-tms-ad"></span>   <span class="tdog-popup-sendbut">     <span class="tdog-popup-send">\u53d1\u9001</span>     <span class="tdog-popup-changesend"></span><ul><li><i></i><span>\u6309Ctrl+Enter\u53d1\u9001</span></li><li class="tdog-send-mode"><i></i><span>\u6309Enter\u53d1\u9001</span></li></ul></span></div></div></div><div class="tdog-popup-talkright"></div><div class="tdog-popup-clear"></div></div><div class="tdog-popup-handle"></div><div class="tdog-popup-handle-x"></div><div class="tdog-popup-handle-y"></div></div>';
      d.ChatDialog = {
          init: function() {},
          showAdLink: function(a, c) {
              var d = b.get("a.tdog-popup-tms-link", c);
              d && a.href && a.title && (d.innerHTML = a.title,
              b.attr(d, "href", a.href),
              s = a)
          },
          showBulletin: function(c) {
              a.later(function() {
                  var a, d = b.get("div.tdog-popup-tms-bulletin", g), e = b.get("div.tdog-popup-talkhistory", g), f = b.get("div.tdog-popup-talkright", g), h = "none" != f.style.display ? "tdog-popup-pulloff" : "tdog-popup-pullon", i = (b.get("a." + h, g),
                  b.get("span.tdog-popup-tms-ad", g));
                  if (c = c[353289] && c[353289].value && c[353289].value.moduleinfo,
                  d && c && c.title && c.url && c.href) {
                      var j = p.createElement("div");
                      j.className = "tdog-popup-tms-bulletin-close",
                      d.innerHTML = "<i></i><a href=" + c.url + " target='_blank' class='J_downQT4'>" + c.title + "</a>",
                      d.appendChild(j),
                      b.css(d.parentNode, "display", "block"),
                      a = d.innerHTML && "block" == b.parent(d).style.display ? e.offsetHeight - 22 : e.offsetHeight,
                      b.css(e, "height", a),
                      t = c
                  }
                  i && c.adUrl && c.adText && (i.innerHTML = "<a href=" + c.adUrl + " target='_blank' class='J_downWW2'>" + c.adText + "</a>"),
                  e && (e.scrollTop = e.scrollHeight)
              }, 800, !1)
          },
          _create: function(g) {
              var h = m.formatNick(i.userId);
              if (g)
                  f = b.create(v);
              else {
                  var j, l, p = '<a title="\u9690\u85cf\u53f3\u8fb9\u680f" class="tdog-popup-pullon" style="display:none"></a></div></div><div class="tdog-popup-talkright" ></div>';
                  j = v.replace(p, "</div></div>"),
                  f = b.create(j),
                  b.css(f, "width", "253px"),
                  l = b.get("div.tdog-popup-talkleftinner", f),
                  b.css(b.get("div.tdog-popup-talkright", f), "display", "none"),
                  b.css(l, "margin-right", "6px"),
                  b.css(b.get("div.tdog-popup-talkhistory", f), "width", "auto")
              }
              r.push(new Array(h,f)),
              b.get("#tstart").appendChild(f),
              g || (b.get("a.tdog-popup-pulloff").style.display = "none"),
              b.css(f, "display", "block"),
              this._bindUI(f);
              var q = b.get("div.tdog-popup-talkbar", f).getElementsByTagName("a")[0]
                , s = k(k(k(d.DataManager.getNickName())))
                , u = k(k(k(h)))
                , w = "//webim.ww.taobao.com/webim/online/chat_record_search.htm?from_im=webwangwang&signmode=im&type=0&u_id=cntaobao" + s + "&t_id=" + u + "&sign_account=" + s;
              q && (q.href = "http://sign.im.alisoft.com/sign/aso?domain=taobao&target=" + w + "&_input_charset=utf-8");
              var x = new a.Drag(f,{
                  handle: ".tdog-popup-head",
                  not: [".tdog-popup-help", ".tdog-popup-close"],
                  scroll: !0
              });
              x.onStartDrag = function(a, c) {
                  b.css(c, "bottom", "auto")
              }
              ,
              c.on(b.get("div.tdog-popup-head", f), "selectstart", function(a) {
                  a.halt()
              }),
              DragFn = function(a, c, d, f, g, h) {
                  var i = h
                    , j = b.get("div.tdog-popup-talkhistory", i)
                    , k = b.get("div.tdog-popup-talkright", i)
                    , l = b.get("div.tdog-popup-main", i)
                    , m = b.get("a.tdog-popup-pulloff", i)
                    , n = b.get("span.tdog-popup-sendbut", i)
                    , o = b.get("a.tdog-popup-pullon", i)
                    , p = b.get("div.tdog-popup-tms-bullet", i)
                    , q = "block" == p.style.display ? c.offsetHeight - 163 + "px" : c.offsetHeight - 141 + "px";
                  b.hasClass(i, "tdog-popup-visible") && b.removeClass(i, "tdog-popup-visible"),
                  b.css(j, "width", "auto"),
                  b.css(j, "marginRight", "5px"),
                  b.css(l, "height", c.offsetHeight - 28 + "px"),
                  "none" !== b.css(k, "display") && b.css(k, "height", c.offsetHeight - 37 + "px"),
                  b.css(j, "height", q),
                  b.css(function() {
                      return m ? m : o
                  }(), "height", c.offsetHeight - 141 + "px"),
                  6 === e.ie && (b.addClass(n, "reflow-fix"),
                  b.removeClass(n, "reflow-fix"))
              }
              ;
              var y = new a.Drag(f,{
                  resize: !0,
                  handle: ".tdog-popup-handle",
                  resizefn: [417, 291]
              });
              y.onStartDrag = function(a, c, d) {
                  var e = b.get("div.tdog-popup-talkright", f);
                  d.resizefn = "none" === b.css(e, "display") ? [270, 291] : [417, 291]
              }
              ,
              y.onDrag = function(a, b, c, d, e, f) {
                  DragFn(a, b, c, d, e, f)
              }
              ;
              var z = new a.Drag(f,{
                  resize: !0,
                  handle: ".tdog-popup-handle-x",
                  resizefn: [!1, 291]
              });
              z.onDrag = function(a, b, c, d, e, f) {
                  DragFn(a, b, c, d, e, f)
              }
              ;
              var A = new a.Drag(f,{
                  resize: !0,
                  handle: ".tdog-popup-handle-y",
                  resizefn: [417, !1]
              });
              return A.onStartDrag = function(a, c, d, e, f, g) {
                  var h = g
                    , i = b.get("div.tdog-popup-talkright", h);
                  d.resizefn = "none" === b.css(i, "display") ? [270, !1] : [417, !1]
              }
              ,
              A.onDrag = function(a, b, c, d, e, f) {
                  DragFn(a, b, c, d, e, f)
              }
              ,
              o.getTmsContent([{
                  data: t,
                  link: n.tmsBulletinUrl,
                  callback: "tce_353289",
                  success: function() {
                      a.log("\u8bfb\u53d6 TMS \u6587\u5b57\u94fe\u8d44\u6e90\u6210\u529f")
                  },
                  hasDate: null,
                  notHasDate: null
              }]),
              f
          },
          show: function(c, e) {
              i = c;
              var f, h, j = this, k = m.formatNick(i.userId), l = !1;
              k.length <= 8 && d.Util.detect("ww.1.20.1.1.7", d.DataManager.getNickName());
              for (var n = 0; n < r.length; n++)
                  r[n][0] == k ? (r[n][1].style.display = "block",
                  g = r[n][1],
                  l = !0) : r[n][1].style.display = "none";
              if (l) {
                  var o, p = b.get("div.tdog-popup-head", g), q = b.get("div", p);
                  o = i.status ? " - " + d.USER_STATUS[c.status][1] : "";
                  i.relation ? "\u597d\u53cb" : "\u964c\u751f\u4eba";
                  q.innerHTML = '<i></i><div class="tdog-contact-info"><span class="tdog-popup-contact">' + i.userName + "</span>" + o + "</div>",
                  q.className = "tdog-status-" + d.USER_STATUS[c.status][0],
                  this.changeBut()
              } else
                  a.use("dragdrop", function() {
                      g = j._create(e),
                      f = b.viewportWidth(),
                      h = (f - 440) / 2,
                      g.style.left = h + "px";
                      var a, k = b.get("div.tdog-popup-head", g), l = b.get("div", k);
                      a = i.status ? " - " + d.USER_STATUS[c.status][1] : "";
                      i.relation ? "\u597d\u53cb" : "\u964c\u751f\u4eba";
                      l.innerHTML = '<i></i><div class="tdog-contact-info"><span class="tdog-popup-contact">' + i.userName + "</span>" + a + "</div>",
                      l.className = "tdog-status-" + d.USER_STATUS[c.status][0],
                      j.changeBut()
                  })
          },
          closeDialog: function() {
              o.css([[g, "display", "none"], ["tdog-face-container", "display", "none"]]),
              g = !1,
              i = ""
          },
          showInfo: function(c) {
              var d = b.get("div.tdog-popup-talkright", g)
                , e = 1 == n.appId;
              if (d)
                  if (!e && c.item && c.item.id) {
                      var f = c.item
                        , h = '<div class="tdog-popup-goodsinfo"><p class="tdog-goodsinfo-head">\u5b9d\u8d1d\u63cf\u8ff0</p><div><div class="tdog-goodsinfo-pic"><p class="tdog-goodsinfo-img"><a href="//item.taobao.com/item_detail-null-' + f.id + '.jhtml"  target = "_blank"><img src="' + f.imageUrl + '_80x80.jpg" title="' + f.title + '"/></a></p></div></div><p class="tdog-goodsinfo-title"><a href="//item.taobao.com/item_detail-null-' + f.id + '.jhtml"  target = "_blank">' + f.title + '</a></p><p class="tdog-goodsinfo-price">\u4e00\u53e3\u4ef7\uff1a<span>' + f.price + '</span>\u5143</p><p><a href="//buy.taobao.com/auction/buy_now.jhtml?auction_id=' + f.id + '" title="\u7acb\u523b\u8d2d\u4e70" class="tdog-goodsinfo-linkbuy" target = "_blank"></a></p></div>';
                      b.css(d, "background-image", "none"),
                      d.innerHTML = h
                  } else if (c.user && c.user.nick) {
                      var i = {
                          nick: "",
                          sex: "\u4fdd\u5bc6",
                          from: "\u4fdd\u5bc6",
                          registDate: "",
                          visitDate: "\u6ca1\u6709\u767b\u5f55",
                          sellNum: "",
                          buyNum: "",
                          certification: "",
                          relation: ""
                      };
                      switch (i = a.merge(i, c.user),
                      i.sex) {
                      case 1:
                          i.sex = "\u7537";
                          break;
                      case 2:
                          i.sex = "\u5973";
                          break;
                      default:
                          i.sex = "\u4fdd\u5bc6"
                      }
                      var j = i.sellNum
                        , k = i.buyNum
                        , l = "true" == i.certification;
                      0 != j && (j = '<img align="absmiddle" title="\u5356\u5bb6\u4fe1\u7528\u79ef\u5206" src="//assets.alicdn.com/sys/common/icon/rank/b_' + i.sellNum + '.gif" />'),
                      0 != k && (k = '<img align="absmiddle" title="\u4e70\u5bb6\u4fe1\u7528\u79ef\u5206" src="//assets.alicdn.com/sys/common/icon/rank/c_' + i.buyNum + '.gif" />'),
                      l && (l = '<img align="absmiddle" title="\u6dd8\u5b9d\u8ba4\u8bc1\u5546\u6237" src="//assets.alicdn.com/sys/common/icon/trade/mall_auth.png" />');
                      var m = "";
                      3 == c.user.suspended && (m = '<p class="tdog-userinfo-suspended">\u8be5\u7528\u6237\u5df2\u7ecf\u88ab\u67e5\u5c01</p>');
                      var o = '<div class="tdog-popup-userinfo">' + m + '<p class="tdog-userinfo-username">' + i.nick + '</p><p>\u6765\u81ea\uff1a<span class="tdog-popup-userinfo-from">' + i.from + "</span><br/> \u6027\u522b\uff1a" + i.sex + "</p><p>\u6ce8\u518c\u65f6\u95f4\uff1a" + i.registDate.split(" ")[0] + "</p><p>\u4e0a\u6b21\u767b\u5f55\uff1a" + i.visitDate.split(" ")[0] + "</p>" + ("" != j ? "<p>\u5356\u5bb6\uff1a" + j + "</p>" : "") + ("" != k ? "<p>\u4e70\u5bb6\uff1a" + k + "</p>" : "") + (l ? "<p>\u8ba4\u8bc1\uff1a" + l + "</p>" : "") + "</div>";
                      b.css(d, "background-image", "none"),
                      d.innerHTML = o,
                      1 == i.relation ? i.relation = "\u597d\u53cb" : i.relation = "\u964c\u751f\u4eba";
                      var p = b.get("div.tdog-popup-head", g);
                      d = b.get("div", p),
                      d.innerHTML = d.innerHTML.replace(/\u964c\u751f\u4eba/, i.relation)
                  }
          },
          checkDialogOpen: function(a) {
              return i ? m.formatNick(a) == m.formatNick(i.userName) : void 0;
          },
          isOpen: function() {
              return !!g
          },
          getTargetUser: function() {
              return i.userName
          },
          updateUserStatus: function(a, c) {
              if (m.formatNick(i.userName) == m.formatNick(a)) {
                  var e, f = b.get("div.tdog-popup-head", g), h = b.get("div", f), j = "", k = /\u597d\u53cb/;
                  c = d.USER_STATUS[c],
                  h && ("" != c[1] && (j = " - " + c[1]),
                  e = k.test(h.innerHTML) ? "(\u597d\u53cb)" : "(\u964c\u751f\u4eba)",
                  h.innerHTML = '<i></i><div class="tdog-contact-info"><span class="tdog-popup-contact">' + i.userName + "</span>" + j + "</div>",
                  h.className = "tdog-status-" + c[0])
              }
          },
          showMsg: function(c) {
              if (a.isArray(c)) {
                  for (var d = b.get("div.tdog-popup-talkhistory", g), e = (b.get("div.tdog-popup-talkcontainer", f),
                  0), h = ""; e < c.length; e++)
                      h += this.__getMessageRealContent(c[e]);
                  d.innerHTML += h,
                  a.later(function() {
                      d.scrollTop = d.scrollHeight
                  }, 200, !1)
              }
          },
          showSysTip: function(a, c) {
              if (g) {
                  var d;
                  c ? (d = b.get("div.tdog-popup-talkright", g),
                  d && (b.css(d, "background-image", "none"),
                  d.innerHTML = a)) : (d = b.get("div.tdog-popup-talkhistory", g),
                  d && (d.innerHTML += '<div class="tdog-talk-filetip"><i></i>' + a + "</div>",
                  d.scrollTop = d.scrollHeight))
              }
          },
          updateMsg: function() {
              if (g) {
                  var a = b.get("div.tdog-popup-talkhistory", g)
                    , c = d.DataManager.getAllMessages(i.userId);
                  a.innerHTML = "",
                  d.ChatDialog.showMsg(c),
                  l.fire(d.EVENTS.UPDATE_STATUS_ICON)
              }
          },
          getCurrentChatUserId: function() {
              return this.isOpen() && i && i.userId ? i.userId : ""
          },
          getCurrentChatUserInfo: function() {
              return this.isOpen() ? i : {}
          },
          clearCurrentChatUserId: function() {
              i && i.userId
          },
          sendMsg: function(a) {
              var b = d.DataManager.getNickName()
                , c = d.Util.charToFace(a.value, !0);
              this.showMsg([{
                  fromId: this.getCurrentChatUserId(),
                  userId: b,
                  sendTime: d.Util.formatDate(new Date),
                  content: d.Util.escapeHTML(c),
                  type: d.MESSAGE_TYPE.SELF
              }]),
              i.userId.length || d.Util.detect("ww.1.20.1.1.6", b);
              var e = m.formatNick(i.userId);
              l.fire(d.EVENTS.SEND_MESSAGE, {
                  userName: e,
                  content: c,
                  callback: {
                      onFailure: function() {
                          d.ChatDialog.showSysTip("<p><span>\u7f51\u7edc\u539f\u56e0\uff0c\u6d88\u606f\u53d1\u9001\u5931\u8d25\uff01</span></p>")
                      },
                      onTimeout: function() {
                          d.ChatDialog.showSysTip("<p><span>\u7f51\u7edc\u8d85\u65f6\uff01</span></p>")
                      }
                  }
              }),
              a.value = ""
          },
          changeBut: function() {
              var a = b.get("div.tdog-popup-talkinput", g).getElementsByTagName("textarea")[0]
                , c = b.get("span.tdog-popup-sendbut", g)
                , d = "tdog-popup-sendbut-off"
                , e = a.value;
              "" == e ? b.hasClass(c, d) || b.addClass(c, d) : "" != e && b.hasClass(c, d) && b.removeClass(c, d)
          },
          _bindUI: function(a) {
              var f = b.get("span.tdog-popup-help", a)
                , j = b.get("span.tdog-popup-close", a)
                , l = b.get("a.tdog-popup-pulloff", a)
                , n = b.get("div.tdog-popup-talkright", a)
                , r = b.get("div.tdog-popup-talkleftinner", a)
                , s = b.get("span.tdog-popup-changesend", a)
                , t = b.get("div.tdog-popup-talkbar", a)
                , u = b.get("span.tdog-popup-talkbar-clear", a)
                , v = b.get("div.tdog-popup-talkhistory", a)
                , w = (b.get("div.tdog-popup-tms-bullet", a),
              b.children(t)[0])
                , x = b.next(s)
                , y = x.getElementsByTagName("li")
                , z = b.get("span.tdog-popup-send", a)
                , A = b.get("div.tdog-popup-talkinput", a).getElementsByTagName("textarea")[0];
              c.on(a, "click", function(c) {
                  var e = c.target;
                  if (e != w && b.css(h, "display", "none"),
                  "tdog-popup-tms-bulletin-close" == e.className) {
                      var f = v.offsetHeight + 22;
                      b.get("div.tdog-popup-tms-bulletin-close", a).parentNode.parentNode.style.display = "none",
                      b.css([v, l], "height", f)
                  } else
                      b.hasClass(e, "J_downQT4") ? d.Util.detect("ww.14.5", d.DataManager.getNickName()) : b.hasClass(e, "J_downWW2") && d.Util.detect("ww.14.6", d.DataManager.getNickName())
              }),
              c.on(f, "click", function() {
                  var a = k(d.DataManager.getNickName())
                    , b = k("\u95ee\u9898\u54a8\u8be2");
                  q.open("http://im.robot.aliapp.com/all/aliqzg/webspace.jsp?id=4&userId=" + a + "&ask=" + b),
                  d.Util.sendLog("wwweblog=checkww")
              }),
              c.on(u, "click", function() {
                  var a = d.ChatDialog.getCurrentChatUserId();
                  v.innerHTML = "",
                  d.DataManager.deleteMessage(a),
                  m.clearChatMessage(a)
              }),
              c.on(j, "click", function() {
                  a.style.display = "none",
                  b.css(h, "display", "none"),
                  v.innerHTML = "",
                  g = !1,
                  i = ""
              }),
              c.on(l, "click", function() {
                  "none" != n.style.display ? (o.css([[n, "display", "none"], [a, "width", v.offsetWidth + (e.ie ? 6 : 2) + "px"], [r, "margin-right", "auto"], [v, "width", "auto"], [v, "marginRight", "6px"]]),
                  b.attr(l, "title", "\u663e\u793a\u4fa7\u8fb9\u680f"),
                  l.className = "tdog-popup-pullon",
                  b.get("div.tdog-popup-handle-y", a).style.height = "38%") : (o.css([[n, "display", "block"], [a, "width", a.offsetWidth + 147 + "px"], [r, "marginRight", "145px"]]),
                  n.style.height = parseInt(a.offsetHeight) - 37 + "px",
                  b.attr(l, "title", "\u9690\u85cf\u4fa7\u8fb9\u680f"),
                  l.className = "tdog-popup-pulloff",
                  b.get("div.tdog-popup-handle-y", a).style.height = "95%")
              }),
              c.on(z, "click", function() {
                  d.ChatDialog.__checkLength(A.value) && (this.sendMsg(A),
                  this.changeBut(),
                  b.css(x, "display", "none"))
              }, this, !0),
              c.on(s, "click", function() {
                  "none" == b.css(x, "display") ? (b.css(x, "display", "block"),
                  b.addClass(a, "tdog-popup-visible"),
                  6 == e.ie && b.css(a, "paddingBottom", "0")) : (b.css(x, "display", "none"),
                  b.hasClass(a, "tdog-popup-visible") && (b.removeClass(a, "tdog-popup-visible"),
                  6 == e.ie && b.css(a, "paddingBottom", "1px")))
              }),
              c.on(y[0], "click", function() {
                  "" == y[0].className && (y[0].className = "tdog-send-mode",
                  y[1].className = ""),
                  b.css(x, "display", "none")
              }),
              c.on(y[1], "click", function() {
                  "" == y[1].className && (y[1].className = "tdog-send-mode",
                  y[0].className = ""),
                  b.css(x, "display", "none")
              }),
              c.on(A, "mousedown", function(a) {
                  this.changeBut()
              }, this, !0),
              c.on(A, "paste", function(a) {
                  var b = this;
                  q.setTimeout(function() {
                      b.changeBut()
                  }, 100)
              }, this, !0),
              c.on(A, "keyup", function() {
                  this.changeBut()
              }, this, !0),
              c.on(A, "keydown", function(a) {
                  var b = this;
                  if (null != a) {
                      if (a.ctrlKey && 13 == a.keyCode) {
                          var c = A.value;
                          if ("tdog-send-mode" == y[0].className) {
                              if (!d.ChatDialog.__checkLength(c))
                                  return;
                              this.sendMsg(A)
                          } else if (p.selection) {
                              var e = p.selection.createRange();
                              e.text = "\r\n"
                          } else {
                              var f = c.length
                                , g = f - A.selectionEnd;
                              A.value = c.substr(0, A.selectionStart) + "\r\n" + c.substring(A.selectionEnd, f),
                              A.selectionEnd = f - g + 1
                          }
                      } else if (13 == a.keyCode && "tdog-send-mode" == y[1].className) {
                          if (a.preventDefault(),
                          !d.ChatDialog.__checkLength(A.value))
                              return;
                          this.sendMsg(A)
                      }
                      27 == a.keyCode && b.closeDialog()
                  }
              }, this, !0),
              c.on(w, "click", function() {
                  d.ChatDialog.Face.show(w, A)
              }),
              c.on(v, "click", function(a) {
                  var d = a.target;
                  if ("A" == d.nodeName.toUpperCase() && "webww-msg-unsafe-link" == d.parentNode.className) {
                      var e, f = b.get("div.tdog-popup-talkhistory", g), h = b.get("div.tdog-popup-tips");
                      h ? (h.style.top = f.offsetHeight + f.scrollTop - 150 + "px",
                      b.get("#__last__webww_msg_unsafe_link").href = d.href) : (h = '<div class="tdog-tips tdog-popup-tips"><div class="tdog-tipscontainer"><i class="tdog-tipsalert"></i><i class="tdog-tipsclose"></i><div class="tdog-tipsmain"><p>\u65e0\u6cd5\u786e\u8ba4\u94fe\u63a5\u7684\u5b89\u5168\u6027\uff0c\u8bf7\u53ea\u6253\u5f00\u6765\u6e90\u53ef\u9760\u7684\u7f51\u5740</p><p><a id="__last__webww_msg_unsafe_link" href="' + d.href + '" target="_blank">\u6253\u5f00\u94fe\u63a5</a>&nbsp;&nbsp;&nbsp;&nbsp;</p></div></div></div>',
                      h = b.create(h),
                      d.parentNode.appendChild(h),
                      f.scrollHeight - 150 > 0 && (h.style.top = f.offsetHeight + f.scrollTop - 150 + "px"),
                      h.style.zoom = 1,
                      e = b.get("i.tdog-tipsclose", h),
                      c.on(e, "click", function() {
                          d.parentNode.removeChild(h)
                      })),
                      a.preventDefault()
                  }
              })
          },
          __getMessageRealContent: function(b) {
              var c = parseInt(b.type);
              switch ("-" === b.userId && (b.userId = d.DataManager.getNickName()),
              c) {
              case d.MESSAGE_TYPE.SELF:
                  return this.__talkMessage(b, b.userId, !0);
              case d.MESSAGE_TYPE.OFFLINE:
                  return this.__talkMessage(b, b.fromId);
              case d.MESSAGE_TYPE.TALK:
                  var e = ""
                    , f = parseInt(b.subType);
                  switch (f) {
                  case d.MESSAGE_SUBTYPE.FAIL_ACK:
                      e = d.UNSUPPORT_MSG[f].replace("{content}", b.content);
                      break;
                  case d.MESSAGE_SUBTYPE.ILLEGALITY:
                      e = b.content;
                      break;
                  case d.MESSAGE_SUBTYPE.NEED_AUTH:
                      return "";
                  case d.MESSAGE_SUBTYPE.FILE_MESSAGE:
                  case d.MESSAGE_SUBTYPE.PIC_MESSAGE:
                  case d.MESSAGE_SUBTYPE.GRAFFITI:
                  case d.MESSAGE_SUBTYPE.REMOTE_ASSIST:
                  case d.MESSAGE_SUBTYPE.AV:
                  case d.MESSAGE_SUBTYPE.FOLDER:
                  case d.MESSAGE_SUBTYPE.PEER_VERIFY:
                      e = d.UNSUPPORT_MSG[f] + "</br>" + d.ERROR_MESSAGE[-4e4];
                      break;
                  case d.MESSAGE_SUBTYPE.TALK_MESSAGE:
                      return this.__talkMessage(b, b.fromId, void 0, void 0, !0);
                  case d.MESSAGE_SUBTYPE.AUTO_BACK_TALK_MESSAGE:
                      return this.__talkMessage(b, b.fromId, void 0, !0, !0);
                  default:
                      return a.log("\u51fa\u73b0\u672a\u5b9a\u4e49\u7684\u6d88\u606f\u7c7b\u578b\uff1a" + b.subType, "warn"),
                      ""
                  }
                  return '<div class="tdog-talk-filetip"><i></i><p><span>' + e + "</span></p></div>"
              }
              return a.log("\u6d88\u606f\u4e2d\u51fa\u73b0\u9519\u8bef:" + c, "warn"),
              ""
          },
          __talkMessage: function(a, b, c, e) {
              var f = a.content
                , g = a.sendTime.length <= 19 ? a.sendTime : a.sendTime.substring(0, 19);
              return f = d.Util.charToFace(a.content, null, c),
              f = f.replace(/\n/g, "<br />"),
              '<p class="tdog-talk-others"><span class="tdog-talk-username">' + d.Util.getUserName(b) + '</span><span class="tdog-talk-time">(' + g + '):</span></p><div class="tdog-talk-content">' + (e ? '<span class="tdog-auto-back-talk-message">[\u81ea\u52a8\u56de\u590d]</span>' : "") + f + "</div>"
          },
          __checkLength: function(a) {
              var d, e, g = '<div class="tdog-tips tdog-popup-tips"><div class="tdog-tipscontainer"><s class="tdog-tipsext"></s><i class="tdog-tipsimg"></i><i class="tdog-tipsclose"></i><div class="tdog-tipsmain"><p>\u4f60\u53d1\u9001\u7684\u6d88\u606f\u8fc7\u957f\uff0c\u8bf7\u4e0b\u8f7d\u652f\u6301\u53d1\u9001\u8d85\u957f\u4fe1\u606f\u7684<a href="' + n.downloadWangWangURLBuy + '" target="_blank">\u963f\u91cc\u65fa\u65fa\u5ba2\u6237\u7aef</a></p></div></div></div>', h = b.get("div.tdog-popup-talkcontainer", f);
              for (e = 0,
              d = 0; d < a.length; d++)
                  e += a.charCodeAt(d) >= 0 && a.charCodeAt(d) <= 255 ? 1 : 2;
              if (e > 300) {
                  if (1 == b.query("div.tdog-popup-tips", h).length)
                      return;
                  var i, j = b.create(g);
                  return h.appendChild(j),
                  i = b.get("i.tdog-tipsclose", j),
                  c.on(i, "click", function() {
                      h.removeChild(j)
                  }),
                  !1
              }
              return 0 == e ? !1 : !0
          }
      },
      d.ChatDialog.Face = {
          init: function(a) {
              h = p.createElement("div"),
              h.id = "tdog-face-container";
              for (var c = 0; 99 > c; c++)
                  h.innerHTML += '<span data-icon="' + c + '.gif"></span>';
              b.get("#tstart").appendChild(h),
              this._bindUI()
          },
          show: function(a, c) {
              h ? h.style.display = "block" : this.init(c);
              var d = [b.offset(a).left, b.offset(a).top - 237];
              b.offset(h, {
                  left: d[0],
                  top: d[1]
              }),
              c.focus()
          },
          _bindUI: function() {
              c.on(h, "click", function(a) {
                  var c = b.get("div.tdog-popup-talkinput", g).getElementsByTagName("textarea")[0]
                    , e = a.target
                    , f = b.attr(e, "data-icon");
                  if (f = d.Util.faceToChar(f),
                  c.focus(),
                  "undefined" != typeof p.selection)
                      p.selection.createRange().text = f;
                  else {
                      var i = c.value
                        , j = i.length
                        , k = j - c.selectionEnd;
                      c.value = i.substr(0, c.selectionStart) + f + i.substring(c.selectionEnd, c.value.length),
                      c.selectionEnd = c.value.length - k
                  }
                  h.style.display = "none",
                  d.ChatDialog.changeBut()
              })
          }
      }
  }),
  TDog.add("StatusIcon", function(c) {
      var d, e = 0;
      c.StatusIcon = {
          init: function() {
              a.log("init StatusIcon"),
              d = b.get("#tstart-plugin-tdog s.tstart-item-icon"),
              this.offline()
          },
          onlogin: function() {
              d.className = "tstart-item-icon tstart-tdog-login"
          },
          isLogining: function() {
              return b.hasClass(d, "tstart-tdog-login")
          },
          online: function() {
              "tstart-item-icon tstart-tdog-online" != d.className && (d.className = "tstart-item-icon tstart-tdog-online")
          },
          offline: function() {
              d.className = "tstart-item-icon tstart-tdog-offline"
          },
          isOffline: function() {
              return b.hasClass(d, "tstart-tdog-offline")
          },
          getmessage: function() {
              "tstart-item-icon tstart-tdog-mess" != d.className && (d.className = "tstart-item-icon tstart-tdog-mess")
          },
          onNewMessage: function() {
              return b.hasClass(d, "tstart-tdog-mess")
          },
          showcount: function(a) {
              e !== a && (0 == a ? (d.innerHTML = "",
              this.online()) : (d.innerHTML = '<span class="tdog-toolbar-msgnum">' + a + "</span>",
              this.getmessage()),
              e = a)
          },
          removeicon: function() {
              d.className = "tstart-item-icon"
          }
      }
  }),
  TDog.add("SysMessage", function(a) {
      var d, e, f, g = "none", h = "block", i = '<div id="tdog-sys-message" class="tdog-simplepop" style="display:none;"><div class="tdog-simplepop-head"><span>\u7cfb\u7edf\u6d88\u606f</span><span class="tdog-closebut"></span></div><div class="tdog-simplepop-main"><div class="tdog-sysinfo"><dl></dl></div><div class="tdog-sysinfo-foot"></div></div></div>';
      a.SysMessage = {
          init: function() {},
          _create: function() {
              d = b.create(i),
              b.get("#tstart").appendChild(d),
              e = b.get("dl", d),
              this._bindUI()
          },
          show: function(a) {
              return a ? (e || this._create(),
              this._loadData(a),
              void (d.style.display = h)) : !1
          },
          _loadData: function(a) {
              a.datetime = a.datetime.split(" ")[0];
              var b = (a.content || "").replace(/\r\n/gi, "<br />");
              e.innerHTML = '<dt><p><span class="tdog-info-mailicon"></span><span class="tdog-info-title">' + a.title + '</span><span class="tdog-info-time">' + a.datetime + '</span><span class="tdog-info-toolopen"></span></p></dt><dd style="display:none">' + b + "</dd>" + e.innerHTML
          },
          _bindUI: function() {
              c.on("#tdog-sys-message .tdog-closebut", "click", function() {
                  d.style.display = g
              }),
              c.on(e, "click", function(a) {
                  for (var c, d = a.target, i = d; "DT" !== i.nodeName && i !== e; )
                      i = i.parentNode;
                  "DT" === i.nodeName && (f && f != i && b.get(".tdog-info-toolclose", f) && (b.get(".tdog-info-toolclose", f).className = "tdog-info-toolopen",
                  f.nextSibling.style.display = g),
                  c = i.nextSibling,
                  c.style.display === h ? (b.get(".tdog-info-toolclose", i).className = "tdog-info-toolopen",
                  c.style.display = g) : (b.get(".tdog-info-toolopen", i).className = "tdog-info-toolclose",
                  c.style.display = h),
                  f = i)
              })
          }
      }
  }),
  TDog.add("SysPopup", function(d) {
      function e(a, b) {
          return a.replace(/\{([^}]+)\}/g, function(a, c) {
              return b[c] || ""
          })
      }
      var f = '<div class="tdog-simplepop" style="width:225px;"><div class="tdog-simplepop-head"><span class="tdog-simplepop-icon"></span><span>{title}</span><span class="tdog-closebut"></span> </div><div class="tdog-simplepop-main"><div class="tdog-remind"><div class="tdog-remind-inner">{content}</div></div> <div class="tdog-remind-foot"><span>{time}</span></div></div></div>';
      d.SysPopup = {
          init: function() {},
          show: function(c) {
              if (c.content) {
                  var g = {
                      title: "\u6dd8\u5b9d\u65fa\u65fa\u8ba2\u9605\u63d0\u9192",
                      width: "225px",
                      time: new Date,
                      staytime: 6e4
                  };
                  if (c.style) {
                      var h = a.unparam(c.style, ";");
                      g = Y.lang.merge(g, h)
                  }
                  c.time && (g.time = c.time),
                  g.content = c.content,
                  g.time = d.Util.formatDate(g.time);
                  var i = b.create(e(f, g));
                  b.get("#tstart").appendChild(i),
                  this._bindUI(i),
                  window.setTimeout(function() {
                      i && b.get("#tstart").removeChild(i)
                  }, g.staytime)
              }
          },
          _bindUI: function(a) {
              var d = b.get("span.tdog-closebut", a);
              c.on(d, "click", function(c) {
                  b.get("#tstart").removeChild(a)
              })
          }
      }
  }),
  TDog.add("SysTips", function(d) {
      var e, f, g, i = "tstart-item-hover-tips", j = "tstart-hidden", k = "tstart-tips-login-ok-btn", l = "tstart-client-oneline", m = "tstart-client-cancle-oneline", n = "tstart-client-help-oneline", o = '<span class="tstart-item-tips tdog-systips tstart-hidden"><i></i><s></s><div class="tdog-systips-content">{CONTENT}</div></span>', p = d.EventCenter, q = d.EVENTS, r = d.WebServer, s = "//download.alicdn.com/wangwang/AliIM2018_taobao(9.12.03C).exe";
      d.SysTips = {
          init: function() {
              a.log("init SysTips");
              var c = d.hostEl;
              f = b.create(o),
              g = b.get(".tdog-systips-content", f),
              c.appendChild(f),
              e = b.get(".tstart-tdog-trigger", c),
              this._bindUI()
          },
          show: function(c, e, h, k) {
              var l = c || d.ERROR_MESSAGE[-1];
              f.style.width = (e || 120) + "px",
              g.innerHTML = k ? l : '<div class="systip-inner-content">' + l + "<div>",
              b.removeClass(f, i),
              b.removeClass(f, j),
              h && a.later("hide", 1e3 * h, !1, this, f)
          },
          setHoverTips: function(a) {
              g.innerHTML = a,
              b.addClass(f, i)
          },
          hide: function() {
              b.addClass(f, j)
          },
          _bindUI: function() {
              var a = this;
              c.on(f, "click", function(c) {
                  var e = c.target;
                  b.hasClass(e, k) ? d.WebServer.login() : b.hasClass(e, l) ? (d.Login.online = !0,
                  d.Login.ready = !0,
                  d.WebServer.login(d.WebServer.AUTO_LOGIN.forcedLogin),
                  d.Util.sendLog("&wwweblog=confirm"),
                  d.Util.detect("wwgw.1.48", d.DataManager.getNickName())) : b.hasClass(e, n) ? window.open("http://im.robot.aliapp.com/all/aliqzg/webspace.jsp?id=4&ask=%E5%AE%89%E8%A3%85%E4%BA%86%E9%98%BF%E9%87%8C%E6%97%BA%E6%97%BA%EF%BC%8C%E7%82%B9%E2%80%9C%E5%92%8C%E6%88%91%E8%81%94%E7%B3%BB%E2%80%9D%E6%9C%AA%E5%BC%B9%E5%87%BA%E8%81%8A%E5%A4%A9%E7%AA%97%E5%8F%A3%EF%BC%9F&page=kjts", "") : b.hasClass(e, m) ? (d.StatusIcon.offline(),
                  d.Util.sendLog("&wwweblog=cancel"),
                  d.Util.detect("wwgw.1.49", d.DataManager.getNickName())) : b.hasClass(e, "J_useWebww") ? (a.isShown = !0,
                  d.Util.detect("wwgw.1.45", d.DataManager.getNickName()),
                  a.cachedUserInfo && a.cachedUserInfo.isLogin ? r.login() : p.fire(q.CLICK_LIGHT_ICON, a.cachedUserInfo)) : b.hasClass(e, "J_downQT1") ? d.Util.detect("ww.14.3", d.DataManager.getNickName()) : b.hasClass(e, "J_downQT2") && d.Util.detect("ww.14.7", d.DataManager.getNickName()),
                  a.hide()
              })
          },
          isShown: !1,
          cachedUserInfo: null,
          _paramUserInfo: function(a) {
              var b = a.userId || a.siteid + a.touid;
              return "&touid=" + b + "&siteid=" + (a.fromSite || a.siteid) + "&status=" + a.status + "&portalId=" + (a.portalId || "") + "&gid=" + (a.itemId || "")
          },
          showUseWebwwConfirmTips: function(a) {
              this.cachedUserInfo = a,
              this.show('<h3 class="systip-title">\u4e3a\u4e86\u4fdd\u969c\u4f60\u7684\u8d2d\u7269\u6c9f\u901a\u5b89\u5168,\u8bf7\u9009\u62e9\u5ba2\u6237\u7aef\u4e0e\u5356\u5bb6\u8054\u7cfb</h3><div class="systip-inner-con" style="position:relative;padding-bottom:16px;">   <a href="' + s + '" target="_blank" class="qt-download-btn J_downWW1">\u4e0b\u8f7d\u963f\u91cc\u65fa\u65fa</a>   <div><span style="color:#666">\u5efa\u8bae:</span>\u5b89\u88c5\u6210\u529f\u540e\u91cd\u542f\u6d4f\u89c8\u5668</div></div><div class="systip-inner-ft">   <a href="javascript:;" class="use-webww-btn J_useClient">\u3010\u6211\u5df2\u5b89\u88c5\u963f\u91cc\u65fa\u65fa,\u70b9\u51fb\u7acb\u5373\u4f7f\u7528\u3011</a>   <a href="javascript:;" class="use-webww-btn J_useWebww" style="color:#666;float:right;margin-right:14px;">\u7ee7\u7eed\u4f7f\u7528\u7f51\u9875\u7248</a></div>', 400, null, !0),
              window.__userInfo && window.__userInfo.userId && (h("aliim:sendmsg?" + this._paramUserInfo(window.__userInfo)),
              delete window.__userInfo),
              d.Util.detect("wwgw.1.42", d.DataManager.getNickName())
          },
          showLoginTips: function(a) {
              if (a || d.StatusIcon.isLogining())
                  this.show("\u963f\u91cc\u65fa\u65fa\u6b63\u5728\u767b\u5f55\uff0c\u8bf7\u7a0d\u5019\u2026\u2026", 110);
              else {
                  var b = d.DataManager.getNickName();
                  this.show("\u548c\u5bf9\u65b9\u804a\u5929\uff0c\u9700\u8981\u767b\u5f55\u963f\u91cc\u65fa\u65fa\uff0c\u786e\u5b9a\u7528\u5e10\u53f7\uff08" + b + '\uff09\u767b\u5f55\u5417\uff1f<hr><span class="tstart-item-tips-btn ' + k + '">\u786e\u5b9a</span><span class="tstart-item-tips-btn">\u53d6\u6d88</span>', 230)
              }
          },
          showClientOnlineTips: function() {
              var a = d.DataManager.getNickName();
              this.show('<h3 class="systip-title">\u60a8\u7684\u5e10\u53f7\uff08' + a + '\uff09\u5df2\u7ecf\u767b\u5f55\u963f\u91cc\u65fa\u65fa</h3><div class="systip-inner-con" style="position:relative;text-align:left;padding:10px 15px 0;">   <p>\u70b9\u51fb<span class="fake-link">\u3010\u786e\u5b9a\u3011</span>\u767b\u5f55\u7f51\u9875\u7248,\u767b\u5f55\u6210\u529f\u540e\u4f1a\u628a\u5df2\u767b\u5f55\u7684\u5ba2\u6237\u7aef\u8e22\u4e0b\u7ebf</p></div><div class="systip-inner-ft" style="margin:10px 0 49px;">   <div style="font-size:12px;color:#999;padding-left:5px;">\u4e3a\u4e86\u66f4\u5b89\u5168\u8d2d\u7269\u6c9f\u901a\uff0c\u8bf7\u4f7f\u7528\u5b98\u65b9\u63a8\u8350\u5ba2\u6237\u7aef<a href="' + s + '" target="_blank" class="J_downWW1">\u3010\u4e0b\u8f7d\u963f\u91cc\u65fa\u65fa\u3011</a></div></div><div class="systip-btn-wrap">   <span class="tstart-item-tips-btn ' + l + '">\u786e\u5b9a</span>   <span class="tstart-item-tips-btn ' + m + ' tstart-item-tips-last-btn">\u53d6\u6d88</span></div>', 400, null, !0),
              d.Util.detect("wwgw.1.46", d.DataManager.getNickName())
          },
          showLoginFailedTips: function(a) {
              var b = d.ERROR_MESSAGE[a] || "\u963f\u91cc\u65fa\u65fa\u6682\u65f6\u4e0d\u53ef\u7528\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5";
              this.show(b + '<hr><span class="tstart-item-tips-btn">\u786e\u5b9a</span>', 180)
          },
          showLogoutTips: function(a) {
              a = a || -1;
              var b = "\u963f\u91cc\u65fa\u65fa\u73b0\u5728\u79bb\u7ebf\u4e86\u3002<hr>\u662f\u5426\u91cd\u65b0\u767b\u5f55\uff1f";
              "402" == a && (b = "\u4f60\u7684\u5e10\u53f7(" + d.DataManager.getNickName() + ")\u5df2\u7ecf\u5728\u5176\u4ed6\u5730\u65b9\u767b\u5f55\uff01<hr>\u9700\u8981\u91cd\u65b0\u767b\u5f55\u5417\uff1f"),
              -1 != a && this.show(b + '<br /><span class="tstart-item-tips-btn ' + k + '">\u786e\u5b9a</span><span class="tstart-item-tips-btn">\u53d6\u6d88</span>', 180)
          },
          showWelcomeTips: function() {
              this.show("\u6b22\u8fce\u4f7f\u7528\u5168\u65b0\u963f\u91cc\u65fa\u65fa\u7f51\u9875\u7248\uff01", 100)
          },
          showLastTips: function() {
              b.hasClass(f, i) || b.removeClass(f, j)
          }
      }
  }),
  TStart.add("plugin~tdog", function(d) {
      var e = (d.PLUGIN_TYPE,
      TDog.EVENTS)
        , g = TDog.EventCenter
        , i = '<div class="tstart-tdog-panel"><div class="tstart-tdog-panel-hd"><span>\u6700\u8fd1\u8054\u7cfb\u4eba</span><s class="tstart-tdog-panel-closebtn"><img src="//gtd.alicdn.com/tps/i1/T1R6pOXoRyXXXXXXXX-15-15.png"></s></div><div class="tstart-tdog-panel-bd tstart-panel-loading" style="width:160px;height:160px"></div></div>';
      d.addPlugin("tdog", {
          type: "custom",
          tips: "\u963f\u91cc\u65fa\u65fa",
          html: '<span class="tstart-tdog-trigger"><s class="tstart-item-icon"></s></span>' + i,
          _paramUserInfo: function(a) {
              var b = a.userId || a.siteid + a.touid;
              return "&touid=" + b + "&siteid=" + (a.fromSite || a.siteid) + "&status=" + a.status + "&portalId=" + (a.portalId || "") + "&gid=" + (a.itemId || "")
          },
          init: function() {
              function i(a) {
                  return b.hasClass(a.target, "tstart-item-icon") ? g.fire(e.CLICK_STATUS_ICON) : !1
              }
              function j(a) {
                  TDog.DataManager.isLogin() && (TDog.WebServer.getTalkUsers(),
                  b.removeClass(b.get(".tstart-tdog-panel-bd", "#tstart-plugin-tdog"), "tstart-panel-loading"))
              }
              var k = this;
              c.on("#tstart-plugin-tdog", "click", function(c) {
                  var e, g = c.target;
                  if (b.hasClass(g, "tstart-item-icon"))
                      e = b.parent(g, ".tstart-item"),
                      b.hasClass(e, "tstart-item-active") ? b.removeClass(e, "tstart-item-active") : i(c) && (d.fire("closePanel"),
                      b.addClass(e, "tstart-item-active"),
                      j(c));
                  else if (b.hasClass(g, "J_downQT3"))
                      TDog.Util.detect("ww.14.8", TDog.DataManager.getNickName());
                  else if (b.hasClass(g, "J_downWW1"))
                      TDog.Util.detect("wwgw.1.43", TDog.DataManager.getNickName());
                  else if (b.hasClass(g, "J_useClient")) {
                      TDog.Util.detect("wwgw.1.44", TDog.DataManager.getNickName());
                      var l = a.unparam(f.get("x"));
                      l.c = encodeURIComponent("1");
                      var m = a.param(l);
                      f.set("x", m, 365, d.Config.DOMAIN, "/"),
                      Light && Light.__setIsOk && Light.__setIsOk(!0),
                      window.__userInfo && window.__userInfo.userId && (h("aliim:sendmsg?" + k._paramUserInfo(window.__userInfo)),
                      delete window.__userInfo);
                      var n = document.getElementById("tstart");
                      n.parentNode.removeChild(n)
                  }
              }),
              TDog.init(d, b.get("#tstart-plugin-tdog")),
              d.sendStatistic("1002.1.1")
          }
      })
  }),
  TStart.add("plugin~settings", function(a) {
      var d = (a.PLUGIN_TYPE,
      "tstart-item-active");
      a.Config.isOnline ? "taobao.com" : "daily.taobao.net";
      a.addPlugin("settings", {
          type: "custom",
          html: '<span class="tstart-settings-trigger" title="\u8bbe\u7f6e web \u65fa\u65fa"><s></s></span><div class="tstart-settings-panel"><div class="tstart-settings-panel-hd"></div><div class="tstart-settings-panel-bd"><p><input type="checkbox" class="tstart-settings-login"/><label>\u81ea\u52a8\u767b\u5f55</label></p><p><input type="checkbox" class="tstart-settings-msg"/><label>\u63a5\u53d7\u964c\u751f\u4eba\u6d88\u606f</label></p></div></div>',
          init: function() {
              var a = b.get("#tstart-plugin-settings")
                , e = b.get(".tstart-settings-panel", a)
                , f = b.get(".tstart-settings-login", a)
                , g = b.get("#tstart-plugin-tdog")
                , h = b.get(".tstart-settings-msg", a);
              c.on(a, "click", function(c) {
                  b.hasClass(a, d) || TDog.WebServer.checkUserSeting(),
                  b.hasClass(g, d) && b.removeClass(g, d),
                  TStart.fire("closePanel"),
                  b.toggleClass(a, d),
                  c.stopPropagation()
              }),
              c.on(e, "click", function(a) {
                  a.stopPropagation()
              }),
              c.on(document, "click", function() {
                  b.removeClass(a, d)
              }),
              c.on(f, "click", function() {
                  var a = -1;
                  a = f.checked ? 2 : 1,
                  TDog.WebServer.setAutoLogin(a)
              }),
              c.on(h, "click", function() {
                  var a = -1;
                  a = h.checked ? 3 : 4,
                  TDog.WebServer.setStrangerMsg(a)
              })
          }
      })
  }),
  TStart.initPlugins(),
  window.tce_353289 = TDog.ChatDialog.showBulletin
});
