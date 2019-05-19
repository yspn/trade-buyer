KISSY.use("dom,event,ajax,ua,cookie,json", function(a, b, c, d, e, f, g) {
  b = b || a.DOM,
  c = c || a.Event,
  d = d || a.IO || a.Ajax,
  e = e || a.UA,
  f = f || a.Cookie,
  g = g || a.JSON;
  var h = a.EventTarget || c.Target;
  KISSY.add("swf-ua", function(a) {
      function b() {
          var a, b, d = 0, e = "ShockwaveFlash", f = navigator.mimeTypes["application/x-shockwave-flash"];
          if (f)
              (b = f.enabledPlugin) && (d = c(b.description.replace(/\s[rd]/g, ".").replace(/[a-z\s]+/gi, "").split(".")));
          else {
              try {
                  a = new ActiveXObject(e + "." + e + ".6"),
                  a.AllowScriptAccess = "always"
              } catch (g) {
                  null !== a && (d = 6)
              }
              if (0 === d)
                  try {
                      d = c(new ActiveXObject(e + "." + e).GetVariable("$version").replace(/[A-Za-z\s]+/g, "").split(","))
                  } catch (g) {}
          }
          return parseFloat(d)
      }
      function c(a) {
          var b = a[0] + ".";
          switch (a[2].toString().length) {
          case 1:
              b += "00";
              break;
          case 2:
              b += "0"
          }
          return b += a[2]
      }
      e.flash = b()
  }),
  KISSY.add("swf", function(a) {
      function c(a, h, m) {
          var n = this
            , o = "ks-swf-" + d++
            , p = parseFloat(m.version) || f
            , q = e.flash >= p
            , r = e.flash >= 8
            , s = r && m.useExpressInstall && !q
            , t = s ? j : h
            , u = "YUISwfId=" + o + "&YUIBridgeCallback=" + k
            , v = "<object ";
          if (n.id = o,
          c.instances[o] = n,
          (a = b.get(a)) && (q || s) && t) {
              v += 'id="' + o + '" ',
              v += e.ie ? 'classid="' + g + '" ' : 'type="' + i + '" data="' + t + '" ',
              v += 'width="100%" height="100%">',
              e.ie && (v += '<param name="movie" value="' + t + '"/>');
              for (var w in m.fixedAttributes)
                  l.hasOwnProperty(w) && (v += '<param name="' + w + '" value="' + m.fixedAttributes[w] + '"/>');
              for (var x in m.flashVars) {
                  var y = m.flashVars[x];
                  "string" == typeof y && (u += "&" + x + "=" + encodeURIComponent(y))
              }
              v += '<param name="flashVars" value="' + u + '"/>',
              v += "</object>",
              a.innerHTML = v,
              n.swf = b.get("#" + o)
          }
      }
      var d = a.now()
        , f = 10.22
        , g = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
        , i = "application/x-shockwave-flash"
        , j = "http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?" + d
        , k = "KISSY.SWF.eventHandler"
        , l = {
          align: "",
          allowNetworking: "",
          allowScriptAccess: "",
          base: "",
          bgcolor: "",
          menu: "",
          name: "",
          quality: "",
          salign: "",
          scale: "",
          tabindex: "",
          wmode: ""
      };
      c.instances = (a.SWF || {}).instances || {},
      c.eventHandler = function(a, b) {
          c.instances[a]._eventHandler(b)
      }
      ,
      a.augment(c, h),
      a.augment(c, {
          _eventHandler: function(b) {
              var c = b.type;
              "log" === c ? a.log(b.message) : c && setTimeout(function() {
                  h.fire(c, b)
              }, 100)
          },
          callSWF: function(a, b) {
              var c = this;
              return c.swf[a] ? c.swf[a].apply(c.swf, b || []) : void 0
          }
      }),
      a.SWF = c
  }),
  KISSY.add("swfstore", function(a, c) {
      function d(d, g, h, k) {
          a.use("swf", function() {
              var l, m = "other", n = f.get(i), o = this;
              h = (h !== c ? h : !0) + "",
              k = (k !== c ? k : !0) + "",
              e.ie ? m = "ie" : e.gecko ? m = "gecko" : e.webkit ? m = "webkit" : e.opera && (m = "opera"),
              n && "null" !== n || f.set(i, n = Math.round(Math.random() * Math.PI * 1e5)),
              l = {
                  version: 9.115,
                  useExpressInstall: !1,
                  fixedAttributes: {
                      allowScriptAccess: "always",
                      allowNetworking: "all",
                      scale: "noScale"
                  },
                  flashVars: {
                      allowedDomain: j.location.hostname,
                      shareData: h,
                      browser: n,
                      useCompression: k
                  }
              },
              g || (g = j.body.appendChild(b.create('<div style="height:0;width:0;overflow:hidden"></div>')));
              try {
                  o.embeddedSWF = new a.SWF(g,d || "swfstore.swf",l),
                  o.embeddedSWF._eventHandler = function(b) {
                      a.SWF.prototype._eventHandler.call(o, b)
                  }
              } catch (p) {}
          })
      }
      var i = "swfstore"
        , j = document;
      a.augment(d, h),
      a.augment(d, {
          setItem: function(b, c) {
              if (c = "string" == typeof c ? c.replace(/\\/g, "\\\\") : g.stringify(c) + "",
              b = a.trim(b + ""))
                  try {
                      return this.embeddedSWF.callSWF("setItem", [b, c])
                  } catch (d) {
                      this.fire("error", {
                          message: d
                      })
                  }
          },
          getItem: function(a) {
              try {
                  return this.embeddedSWF.callSWF("getValueOf", [a])
              } catch (b) {}
          }
      }),
      a.each(["getValueAt", "getNameAt", "getValueOf", "getItems", "getLength", "removeItem", "removeItemAt", "clear", "calculateCurrentSize", "hasAdequateDimensions", "setSize", "getModificationDate", "displaySettings"], function(b) {
          d.prototype[b] = function() {
              try {
                  return this.embeddedSWF.callSWF(b, a.makeArray(arguments))
              } catch (c) {
                  this.fire("error", {
                      message: c
                  })
              }
          }
      }),
      a.SWFStore = d
  }),
  a.mix(TStart, {
      _MODS: {},
      add: function(a, b) {
          return this._MODS[a] = b(TStart)
      },
      _Queue: [],
      _isReady: !1,
      isTmall: -1 !== location.host.indexOf("tmall."),
      sendStatistic: function(b, c) {
          b && ((new Image).src = "//go.mmstat.com/" + (c || "tbapp") + "." + b + "?t=" + a.now() + "&url=" + encodeURI(location.href.replace(location.hash, "")))
      },
      ready: function(a) {
          this._isReady ? a() : this._Queue.push(a)
      },
      log: function(a) {
          if (this.isDebug && "undefined" != typeof console)
              try {
                  console.log(a)
              } catch (b) {}
      }
  }),
  TStart.add("template", function(a) {
      function b(a) {
          if (!d[a]) {
              var b, e, f = c.guid(i), g = [o, f, p, e = u(a), q];
              try {
                  b = new Function(f,g.join(""))
              } catch (h) {
                  g[3] = k + l + m + "," + h.message + k + l,
                  b = new Function(f,g.join(""))
              }
              d[a] = {
                  name: f,
                  o: e,
                  parser: g.join(""),
                  render: b
              }
          }
          return d[a]
      }
      var c = KISSY
        , d = {}
        , e = {
          "#": "start",
          "/": "end"
      }
        , f = "KS_TEMPL_STAT_PARAM"
        , g = new RegExp(f,"g")
        , h = "KS_TEMPL"
        , i = "KS_DATA_"
        , j = "as"
        , k = '");'
        , l = h + '.push("'
        , m = "KISSY.Template: Syntax Error. "
        , n = "KISSY.Template: Render Error. "
        , o = "var " + h + "=[]," + f + "=false;with("
        , p = "||{}){try{" + h + '.push("'
        , q = '");}catch(e){' + h + '=["' + n + '" + e.message]}};return ' + h + '.join("");'
        , r = function(a) {
          return a.replace(/\\"/g, '"')
      }
        , s = function(a) {
          return a.replace(/"/g, '\\"')
      }
        , t = c.trim
        , u = function(a) {
          var b, d;
          return s(t(a).replace(/[\r\t\n]/g, " ").replace(/\\/g, "\\\\")).replace(/\{\{([#\/]?)(?!\}\})([^}]*)\}\}/g, function(a, f, i) {
              if (b = "",
              i = r(t(i)),
              f) {
                  d = i.indexOf(" "),
                  i = -1 === d ? [i, ""] : [i.substring(0, d), i.substring(d)];
                  var j, m = i[0], n = t(i[1]), o = v[m];
                  o && e[f] && (j = o[e[f]],
                  b = String(c.isFunction(j) ? j.apply(this, n.split(/\s+/)) : j.replace(g, n)))
              } else
                  b = h + ".push(typeof (" + i + ') ==="undefined"?"":' + i + ");";
              return k + b + l
          })
      }
        , v = {
          "if": {
              start: "if(typeof (" + f + ') !=="undefined" && ' + f + "){",
              end: "}"
          },
          "else": {
              start: "}else{"
          },
          elseif: {
              start: "}else if(" + f + "){"
          },
          each: {
              start: function(a, b, c, d) {
                  var e = "_ks_value"
                    , f = "_ks_index";
                  return b === j && c && (e = c || e,
                  f = d || f),
                  "KISSY.each(" + a + ", function(" + e + ", " + f + "){"
              },
              end: "});"
          },
          "!": {
              start: "/*" + f + "*/"
          }
      };
      c.mix(b, {
          log: function(a) {
              a in d ? "js_beautify"in window || c.log(d[a].parser, "info") : (b(a),
              this.log(a))
          },
          addStatement: function(a, b) {
              c.isString(a) ? v[a] = b : c.mix(v, a)
          }
      }),
      a.Template = b
  }),
  TStart.add("url", function(a) {
      function b(a) {
          var b = c.isString(a) ? a : a.join(",")
            , d = b.split(/\.(?:css|js)/)
            , e = "";
          return d.length > 2 && (e = "??"),
          e + b
      }
      var c = KISSY;
      c.mix(a, {
          buildUri: function(b, d, e) {
              var f = a.checkQmark(b)
                , g = "?";
              return f && (g = "&"),
              b + g + (c.isString(d) ? d : c.param(d)) + (e ? "&t=" + c.now() : "")
          },
          checkQmark: function(a) {
              return -1 !== a.indexOf("?")
          },
          getHost: function(a) {
              var b = -1 !== location.host.indexOf("daily")
                , c = -1 !== a.indexOf("alipay");
              return b ? c ? a.replace(/\{(\w+)\}/, "$1.net") : a.replace(/\{(\w+)\}/, "daily.$1.net") : a.replace(/\{(\w+)\}/, "$1.com")
          },
          getCdn: function(b) {
              var c = a.isOnline ? "assets.alicdn.com" : "assets.daily.taobao.net";
              return location.protocol + "//" + c + (b || "")
          },
          addTimeStamp: function(b) {
              return b + (a.checkQmark(b) ? "&" : "?") + "t=" + (new Date).getTime()
          },
          combo: function(c, d) {
              var e = a.cdnPath + (c.path || "")
                , f = c.css || ""
                , g = c.js || "";
              f && a.addStyleSheet(e + b(f) + (d ? "?t=" + d + ".css" : "")),
              g && a.IO.getScript(e + b(g) + (d ? "?t=" + d + ".js" : ""))
          }
      })
  }),
  TStart.add("tstart~user", function(c) {
      window;
      a.mix(c, {
          getNick: function() {
              return f.get("_nk_")
          },
          openLogin: function() {
              location.href = c.getHost("https://login.{taobao}/member/login.jhtml?redirectURL=" + encodeURIComponent(location.href))
          },
          closeLogin: function() {
              var a = b.get("#tstartLogin");
              a && b.css(a, "display", "none")
          }
      })
  }),
  TStart.add("hitch", function(a) {
      function b(a, b) {
          var d = arguments
            , e = c.makeArray(d, 2)
            , f = a || window
            , g = c.isString(b) ? a[b] : b
            , h = Function.prototype.bind;
          return h ? h.apply(g, [a].concat(e)) : function() {
              var a = c.makeArray(arguments);
              return g && g.apply(f, e.concat(a))
          }
      }
      var c = KISSY;
      return a.hitch = b
  }),
  TStart.add("eventTarget", function(a) {
      function b(a, b, c) {
          a = a || win;
          var d, e = a._listener;
          return e || (e = a._listener = {}),
          d = e[b],
          d || (d = e[b] = []),
          d.push(c)
      }
      var c = KISSY;
      a.EventTarget = {
          on: function(a, c) {
              return b(this, a, c)
          },
          fire: function(a) {
              var b, d = this, e = c.makeArray(arguments), f = [], g = d._listener;
              return g && (b = g[a],
              b && b.length && (e.length > 1 && (f = e.slice(1)),
              c.each(b, function(a) {
                  a.apply(d, f)
              }))),
              !0
          }
      }
  }),
  TStart.add("loader", function(c) {
      a.mix(c, {
          _DPLLoaded: !1,
          addStyleSheet: function(a) {
              var c;
              b.get("head");
              /\.css$/.test(a) ? (c = document.createElement("link"),
              b.attr(c, {
                  rel: "stylesheet",
                  href: a
              }),
              b.append(c, b.get("head"))) : b.addStyleSheet(a)
          },
          IO: {
              getScript: d.getScript,
              jsonp: function(b, c) {
                  var e = this;
                  return a.isString(c) ? e.getScript(b + (b.indexOf("?") > -1 ? "&" : "?") + "callback=" + c) : d.jsonp(b, c)
              }
          },
          loadDPL: function() {
              var a = this;
              a._DPLLoaded || (a._DPLLoaded = !0,
              a.addStyleSheet(a.cdnPath + "styles/tstart.css"))
          },
          fetchLater: function(a, b) {
              var c = this
                , d = c.cdnPath + a + "/later.";
              c.loadDPL(),
              b && c.addStyleSheet(d + "css"),
              c.IO.getScript(d + "js")
          }
      })
  }),
  TStart.add("core~config", function(a) {
      var b = KISSY
        , c = a.getCdn("/apps/lifeas/js/tdog/");
      a.Config = {
          timeStamp: window._TOOLBAR_TIME_STAMP || {},
          isOnline: a.isOnline,
          ASSETS_URL: c,
          hasFlash: !e.flash || parseInt(e.flash) < 9 ? !1 : !0,
          DOMAIN: function() {
              var a = location.hostname;
              return a = a.indexOf("tmall.com") > 0 ? "tmall.com" : a.indexOf("tmall.net") > 0 ? "tmall.net" : location.hostname.indexOf("taobao.com") > 0 ? "taobao.com" : "taobao.net"
          }()
      },
      b.use("swfstore", function(b, c) {
          try {
              a.traceStore = new b.SWFStore(a.getCdn("/p/tstart/1.0/") + "plugins/trace/swfstore.swf?t=20100629"),
              a.store = a.traceStore
          } catch (d) {}
          try {
              a.log("swfstore\uff1apreload swfstore!"),
              a.traceStore.on("contentReady", function() {
                  a.traceStore.isReady = !0,
                  a.log("swfstore\uff1aswfstore is ready!")
              })
          } catch (d) {
              a.log("trace: flash \u62a5\u9519, \u65e0\u6cd5\u5b8c\u6210 contentReady.")
          }
      })
  }),
  TStart.add("tstart~container", function(d) {
      var f, g = (d.Template,
      '<div id="tstart"><div class="tstart-toolbar"><div class="tstart-bd"><div class="tstart-areas">{{inner}}</div></div></div></div>');
      a.mix(d, d.EventTarget),
      d._Container = {
          render: function(a, c) {
              var d = this;
              if (f) {
                  var e = b.get(".tstart-areas", f);
                  e.appendChild(b.create(a))
              } else
                  f = b.create(g.replace(/\{\{inner\}\}/, a)),
                  document.body.appendChild(f),
                  d.bindEvent(),
                  d._fix()
          },
          bindEvent: function() {
              var a = this;
              c.on("#tstart", "click", a.clickEvent, a),
              c.on(document.body, "click", function(a) {
                  var c = a.target
                    , e = b.hasClass(c, "tdog-user-del");
                  e || b.contains("#tstart", c) || d.fire("closePanel")
              })
          },
          clickEvent: function(a) {
              var c, e, f = a.target, g = b.parent(f, ".tstart-drop-item") || f, h = b.parent(f, ".tstart-drop-panel") || b.hasClass(f, "tstart-drop-panel"), i = b.contains(".tdog-popup", f), j = /tstart-plugin-/, k = b.attr(f, "data-ts-static"), l = b.hasClass(f, "tdog-user-del");
              return k && d.sendStatistic(k, "tbtoolbar"),
              b.hasClass(f, "tstart-icon-close") ? (e = g.id.replace(j, ""),
              d.fire("closePanel", e)) : (g && b.hasClass(g, "tstart-drop-item") && !h ? (a.preventDefault(),
              e = g.id.replace(j, ""),
              c = !b.hasClass(g, "tstart-item-active"),
              d.fire("closePanel"),
              c && d.fire("openPanel", e)) : l || h || i || b.contains("#tstart-plugin-tdog", f) || d.fire("closePanel"),
              void (b.hasClass(f, "J_GotoLogin") && (a.preventDefault(),
              setTimeout(function() {
                  d.openLogin()
              }, 50))))
          },
          _fix: function() {
              var d, f = b.get("#tstart");
              return f ? void (e.ie < 7 && (a.each(b.query("#tstart span.tstart-item"), function(a) {
                  c.on(a, "mouseenter mouseleave", function() {
                      b.toggleClass(a, "tstart-item-hover")
                  })
              }),
              c.on(window, "scroll resize", function() {
                  d && clearTimeout(d),
                  d = setTimeout(function() {
                      var a = (b.scrollTop(),
                      b.viewportHeight(),
                      b.scrollTop() + b.viewportHeight() - 40)
                        , c = parseInt(b.css(f, "top"), 10);
                      return c && a - c > 0 && 3 > a - c ? !1 : void (f.style.top = a + "px")
                  }, 100)
              }))) : !1
          }
      }
  }),
  TStart.add("Panel", function(a) {
      function c(a) {}
      var d = a.Template;
      return c.prototype = {
          constructor: c,
          createTabPanel: function(a, b) {
              var c = '<ul class="panel-tab">{{#each tabs as tab index}}<li class="{{#if tab.cls}}{{tab.cls}}{{/if}}"{{#if tab.config}} {{tab.config}}{{/if}}><span>{{tab.title}}</span></li>{{/each}}</ul><div class="panel-content">{{#each tabs as tab}}<div{{#if tab.cls}} class="{{tab.cls}}-panel"{{/if}}></div>{{/each}}</div>'
                , e = new d(c).render(a);
              return b && (b.innerHTML = e),
              e
          },
          showLoading: function() {
              var a = b.get(".tstart-drop-panel-bd", this.getRoot());
              a && b.addClass(a, "tstart-panel-loading")
          },
          hideLoading: function() {
              var a = b.get(".tstart-panel-loading", this.getRoot());
              a && b.removeClass(a, "tstart-panel-loading")
          },
          getRoot: function() {
              var a = this
                , c = a.root;
              return c ? c : a.root = b.get("#tstart-plugin-" + a.name)
          },
          renderLoginNotice: function(a) {
              var c = this
                , e = c.loginNotice
                , f = '<div class="login-notice"><div class="title">\u4eb2\uff0c\u60a8\u8fd8\u6ca1\u6709\u767b\u5f55\uff0c\u3010{{name}}\u3011\u9700\u8981<a href="" class="J_GotoLogin" data-ts-static="{{staticCode}}">\u767b\u5f55</a>\u624d\u53ef\u4ee5\u4f7f\u7528\u54e6</div><div class="intro"><dl><dt>\u5728\u8fd9\u91cc\u53ef\u4ee5\u5e72\u4ec0\u4e48\uff1f</dt>{{#each list as l}}<dd><i class="tstart-icon tstart-icon-rhombus"></i> {{l}}</dd>{{/each}}</dl><p class="goto"><a href="" class="J_GotoLogin" data-ts-static="{{staticCode}}">\u70b9\u51fb\u767b\u5f55</a></p></div></div>'
                , g = new d(f).render(e);
              a = a || b.get(".tstart-drop-panel-bd", c.getRoot()),
              b.html(a, g),
              c.hideLoading()
          }
      },
      a.Panel = c
  }),
  TStart.add("tstart~Plugin", function(a) {
      function b(a, b) {
          this._setup(a, b)
      }
      var c = KISSY;
      b._Plugins = [],
      b.Plugins = {},
      b.prototype = {
          constructor: b,
          _setup: function(d, e) {
              var f = b
                , g = c.merge({
                  type: "normal",
                  name: d.toString()
              }, e, new a.Panel, a.EventTarget);
              return f._Plugins.push(g),
              f.Plugins[d] = g,
              this.Config = g
          },
          getConfig: function() {
              return this.Config
          }
      },
      a.Plugin = b,
      c.mix(a, b)
  }),
  TStart.add("tstart~plugins", function(c) {
      var d = c.Template
        , e = c._Container
        , f = '<span class="tstart-item tstart-{{type}}-item" id="tstart-plugin-{{name}}">{{#if type !== "custom"}}<span class="tstart-{{type}}-trigger">{{html}}</span>{{#else}}{{html}}{{/if}}</span>';
      a.mix(c, {
          addPlugin: function(a, b) {
              return new c.Plugin(a,b)
          },
          initPlugins: function(b) {
              var g = this
                , h = g._Plugins
                , i = []
                , j = [];
              b || (a.each(h, function(a) {
                  a._installed || (j.push(new d(f).render(a)),
                  a._installed = !0,
                  a.init && i.push([a.init, a]))
              }),
              e.render(j.join("")),
              c.fire("ready"),
              i && a.each(i, function(a) {
                  a[0].call(a[1])
              }))
          },
          getConfig: function(c) {
              if (!c)
                  return !1;
              var d, e;
              return a.isString(c) ? d = c : (e = b.parent(c, ".tstart-item") || c,
              d = e.id.replace("tstart-plugin-", "")),
              this.Plugins[d]
          }
      })
  }),
  TStart.add("tstart~panel", function(c) {
      function d(c, d) {
          var e = a.isString(c) ? b.get("#tstart-plugin-" + c) : c
            , f = b.offset(e)
            , g = e.offsetWidth
            , j = document.body.offsetWidth
            , k = j - g - f.left
            , l = d.width - g;
          return a.mix(d, {
              right: "-" + Math.min(k, l)
          }),
          e.appendChild(b.create(new h(i).render(d)))
      }
      function f(a) {
          var e, f = c.getConfig(a), g = f.Panel, h = f.getRoot();
          f.staticCode && c.sendStatistic(f.staticCode),
          c.loadDPL(),
          f.fire("beforeOpen", f) && (g && (e = b.get(".tstart-drop-panel", h),
          e || (e = d(a, g))),
          b.addClass(h, "tstart-item-active"),
          f.fire("open", f))
      }
      function g(a) {
          var d = b.get("#tstart-plugin-" + a) || b.get(".tstart-item-active", "#tstart")
            , e = c.getConfig(d);
          return d && e ? (e.fire("beforeClose", e),
          b.removeClass(d, "tstart-item-active"),
          void e.fire("close", e)) : !1
      }
      var h = c.Template
        , i = '<div class="tstart-drop-panel" style="width:{{width+2}}px;right:{{right}}px"><div class="tstart-drop-panel-hd"><h2>{{title}}</h2></div><div class="tstart-drop-panel-bd tstart-panel-loading" style="width:{{width}}px;height:{{height}}px"></div><div class="ft">{{#if setting}}<a href="{{setting}}" target="_blank" class="tstart-icon tstart-icon-setting" title="\u8bbe\u7f6e">\u8bbe\u7f6e</a>{{/if}}<a class="tstart-icon tstart-icon-feedback" title="\u610f\u89c1\u53cd\u9988" href="//ur.taobao.com/survey/view.htm?id=1244" target="_blank"></a><s class="tstart-icon tstart-icon-close" title="\u6700\u5c0f\u5316"></s></div>' + (6 === e.ie ? '<iframe frameborder="0" scroolling="no" width="{{width}}" height="300" style="z-index:-1;position:absolute;left:0;top:0" src="about:blank"></iframe>' : "") + "</div>";
      c.on("openPanel", f),
      c.on("closePanel", g),
      c.closePanel = g
  }),
  TStart.add("style", function(a) {
      a.addStyleSheet("#tstart-plugin-switch .tstart-item-icon,.tstart-minimized .switch-mini,#tstart .i-arrow,#tstart .msg-count,#tstart .msg-count span,#tstart .icon-new,#tstart-plugin-news .t-msg-count .arrow,#tstart .switch-mini-tip{background-image:url(//img.alicdn.com/tps/i3/T1zYneXXlqXXaloVr4-167-122.png);background-repeat:no-repeat}body,#tstart h1,#tstart h2,#tstart h3,#tstart h4,#tstart h5,#tstart h6,#tstart hr,#tstart p,#tstart dl,#tstart dt,#tstart dd,#tstart ul,#tstart ol,#tstart li,#tstart pre,#tstart form,#tstart fieldset,#tstart legend,#tstart button,#tstart input,#tstart th,#tstart td{margin:0;padding:0}body,#tstart button,#start input,#tstart select{font:12px/1.5 tahoma,arial,b8bf53,sans-serif}#tstart h1,#tstart h2,#tstart h3,#tstart h4,#tstart h5,#tstart h6{font-size:100%}#tstart address,#tstart em{font-style:normal}#tstart code,#tstart pre{font-family:courier new,courier,monospace}#tstart small{font-size:12px}#tstart ul,#tstart ol{list-style:none}#tstart a{text-decoration:none}#tstart sup{vertical-align:text-top}#tstart sub{vertical-align:text-bottom}#tstart legend{color:#000}#tstart fieldset,#tstart img{border:0;margin:0;float:none}#tstart button,#tstart input,#tstart select{font-size:100%}#tstart .hidden,#tstart .tstart-hidden{display:none!important}#tstart .invisible,#tstart .tstart-invisible{visibility:hidden!important}#tstart{position:fixed;right:0;bottom:0;z-index:100000;_position:absolute;height:28px;color:#3e3e3e;text-align:left;_right:1px}#tstart .tstart-toolbar{height:28px;float:right;right:0}#tstart a{color:#000;text-decoration:none}#tstart .tstart-bd{height:28px;margin:0}#tstart .tstart-areas{position:relative;zoom:1;height:28px;line-height:28px;float:right;}#tstart .tstart-item{position:relative;zoom:1;float:left;display:block;height:28px;}#tstart .tstart-link-item a{float:left;padding:0 8px}#tstart a:hover{color:#f60;text-decoration:underline}#tstart .tstart-normal-trigger,#tstart .tstart-drop-trigger{cursor:pointer;padding:0 8px}#tstart .i-arrow{width:5px;height:3px;position:absolute;right:0;top:12px;background-position:-134px -59px}#tstart .tstart-item-active .i-arrow{display:none}#tstart i{background:0;display:inline-block;height:auto;line-height:1;margin:auto;overflow:hidden;text-indent:0;vertical-align:middle;width:auto}#tstart-plugin-switch{height:25px}#tstart-plugin-switch .toggle-area{cursor:pointer}#tstart-plugin-switch a{display:none}#tstart-plugin-switch .tstart-item-icon{display:inline-block;width:19px;height:25px;line-height:100px;overflow:hidden;zoom:1;background-position:0 -59px;vertical-align:middle;font-size:0;margin-top:0;vertical-align:top}.tstart-minimized #tstart-plugin-switch .tstart-item-icon{background-position:-18px -59px}#tstart .switch-mini-tip{display:none;width:135px;height:28px;overflow:hidden;position:absolute;top:-30px;margin-left:-160px;background-position:0 -94px}.tstart-minimized .hover .switch-mini-tip{display:inline-block!important}.tstart-minimized .switch-mini{display:inline-block!important;width:17px;height:17px;overflow:hidden;vertical-align:middle;margin:0 5px;background-position:-47px -59px;*margin-top:5px}.tstart-minimized .hover .switch-mini{background-position:-69px -59px}.tstart-minimized .tstart-bd{float:right;width:auto;display:inline}.tstart-minimized .tstart-areas{float:left;background:green}.tstart-minimized .tstart-item{display:none}.tstart-minimized #tstart-plugin-tdog,.tstart-minimized #tstart-plugin-settings,.tstart-minimized #tstart-plugin-switch{display:block}.tstart-news-tip{position:absolute;bottom:0;left:0}#tstart-plugin-news .t-msg-count{position:absolute;bottom:-30px;right:5px;color:#fff;display:inline-block;text-align:right;*width:132px}#tstart-plugin-news .t-msg-count .tip{display:inline-block;text-decoration:none;border:1px solid #fbce67;background-color:#fee195;color:#3f4537;height:21px;line-height:21px;white-space:nowrap;padding:0 15px;font-weight:400;background-repeat:repeat-x;background-position:0 -134px}#tstart-plugin-news .t-msg-count em{color:#ff4300;font-weight:400;text-decoration:none;font-style:normal;margin:0 3px}#tstart-plugin-news .t-msg-count .arrow{width:11px;height:6px;right:10px;top:23px;position:absolute;z-index:2;background-position:-112px -59px}#tstart .tstart-item-active .t-msg-count{visibility:hidden}#tstart .msg-count,#tstart .msg-count span{display:inline-block;height:22px}#tstart .msg-count{padding-right:5px;background-position:right -32px;position:absolute;top:-15px;right:0;color:#fff;font-weight:600;line-height:16px}#tstart .msg-count span{padding-left:5px;background-position:0 0}#tstart .tstart-item-active .msg-count{display:none}#tstart-plugin-myapps .tip-intro{background:none repeat scroll 0 0 #ffffc5;border:1px solid #d4d4d4;height:24px;left:0;line-height:23px;overflow:visible;position:absolute;top:-30px;width:290px;z-index:60}#tstart-plugin-myapps .tip-intro i,#tstart-plugin-myapps .tip-intro .close,#tstart-plugin-myapps .tip-intro s{background:url(//img.alicdn.com/tps/i4/T1m4KGXi8jXXXXXXXX-120-213.png) no-repeat 0 0}#tstart-plugin-myapps .tip-intro i,#tstart-plugin-myapps .tip-intro .close{width:23px;height:23px;line-height:23px;display:inline-block}#tstart-plugin-myapps .tip-intro i{background-position:0 -190px}#tstart-plugin-myapps .tip-intro .close{background-position:-23px -190px;display:block;overflow:hidden;position:absolute;right:0;text-indent:-1000px;top:0;cursor:pointer}#tstart-plugin-myapps .tip-intro s{background-position:-46px -190px;display:block;height:13px;left:20px;position:absolute;top:24px;width:23px;z-index:100}#tstart-plugin-myapps .tip-intro a{color:#004d99}#tstart .icon-new{width:21px;height:16px;position:absolute;top:-7px;right:0;background-position:-96px -76px}#tstart .tstart-item-active .tip-new{display:none}#tstart .tstart-drop-panel{position:absolute}")
  }),
  TStart.add("core~init", function(a) {
      var b = KISSY;
      a.init = function() {
          a.log("\u5f00\u59cb\u521d\u59cb\u5316\u6dd8\u5b9d\u5de5\u5177\u6761"),
          a.on("ready", function(c) {
              a._Queue.length && !a._isReady && (b.each(a._Queue, function(a) {
                  a()
              }),
              a._Queue = [],
              a._isReady = !0)
          }),
          a.initPlugins(),
          (new Image).src = "//ac.mmstat.com/tbapp.1000.0.0?t=" + b.now() + "&url=" + encodeURI(location.href.replace(location.hash, ""))
      }
  }),
  TStart.add("plugin~deploy", function(b) {
      var c = {
          pickDomain: function(a, b) {
              b = b || location.hostname;
              var c = "."
                , d = b.split(c)
                , e = d.length;
              return 2 >= e ? b : (a = a || 1,
              a > e - 2 && (a = e - 2),
              d.slice(a).join(c))
          }
      };
      a.ready(function(e) {
          b.log("\u5f00\u59cb\u90e8\u7f72\u6dd8\u5b9d\u5de5\u5177\u6761");
          var g = "taobao.com" == b.Config.DOMAIN ? "x" : "otherx"
            , h = location
            , i = a.merge({
              e: 0,
              p: "*",
              s: 0,
              c: 0,
              f: 0,
              g: 0,
              t: 0
          }, a.unparam(f.get(g)))
            , j = window.g_config || {}
            , k = (a.unparam(h.search.substring(1)),
          j.appId === e ? -1 : parseInt(j.appId, 10),
          unescape((f.get("_nk_") || "").replace(/\\u/g, "%u")))
            , l = (f.get("_l_g_") && k,
          c.pickDomain(2))
            , m = function() {
              f.set(g, a.param(i), 365, l, "/")
          };
          i.e = 1,
          i.p = "*",
          m(),
          b.init(),
          b.loadDPL();
          var n = "0.2.1"
            , o = navigator.userAgent
            , p = /ipad/i.test(o)
            , q = location.protocol + "//" + (-1 === location.host.indexOf("daily") ? "g.alicdn.com" : "assets.daily.taobao.net/g") + "/aliww/web.ww.im/" + n + "/";
          b.addStyleSheet(q + "styles/tdog" + (p ? "-pad" : "") + ".css"),
          d.getScript(q + "scripts/tdog" + (p ? "-pad" : "") + ".js"),
          b.sendStatistic("1001.0.2")
      })
  })
});