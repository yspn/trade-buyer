!function(a) {
  a.use("cookie,ajax", function(a, b, c) {
      function d() {
          var a = /daily/i;
          return a.test(location.host)
      }
      function e() {
          return o.g_config
      }
      function f() {
          var a = e();
          return a ? a.webww || -1 !== location.host.indexOf(".taobao.") : !1
      }
      function g() {
          var b = (e(),
          f());
          return a.isBoolean(b) && b && m ? !0 : !1
      }
      function h() {
          if ("undefined" == typeof TStart) {
              var a = !d();
              o.TStart = {
                  isOnline: a,
                  isDebug: l,
                  cdnPath: "//" + (a ? "g.alicdn.com" : "assets.daily.taobao.net/g") + "/" + n,
                  version: k
              }
          }
          return TStart
      }
      function i(b) {
          if ("1.30" != a.version)
              c.getScript(b);
          else
              try {
                  a.use("dom, event, ajax, anim, json", function(a, c, d, e, f, g) {
                      e.getScript(b)
                  })
              } catch (d) {}
      }
      function j() {
          if ("undefined" != typeof Light && !Light.addonIsOK()) {
              var b = "0.2.1";
              n = "/aliww/web.ww.im/" + b + "/";
              var c = h()
                , e = !d();
              if (c.cdnPath = location.protocol + "//" + (e ? "g.alicdn.com" : "assets.daily.taobao.net/g") + n,
              !c._Loaded) {
                  c._Loaded = !0,
                  i(c.cdnPath + "scripts/tstart.js");
                  try {
                      a.use("dom", function(a, b) {
                          b.get("#J_miniCartPlugin") && b.css("#J_miniCartPlugin", "right", "65px")
                      })
                  } catch (f) {}
              }
          }
      }
      c = c || a.IO || a.Ajax,
      b = b || a.Cookie;
      var k = "131022"
        , l = -1 !== location.search.indexOf("ts-debug")
        , m = b.get("_nk_") || b.get("lgc")
        , n = "apps/stargate/tstart/release/" + (l ? "debug" : k) + "/"
        , o = window;
      document;
      o._TOOLBAR_TIME_STAMP = {
          tstart: "20120406",
          tdog: "20110726",
          startTime: "2012/02/06",
          endTime: "2012/02/15"
      },
      a.ready(function() {
          g() && setTimeout(j, 1e3)
      })
  })
}(KISSY);
