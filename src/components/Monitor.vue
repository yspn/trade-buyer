<template>
  <div class="monitor" :class="{fullscreen: fullscreenMode}">
    <div class="header">
      <div class="col left"></div>
      <div class="col middle">
        <div class="title">
          <!-- <div class="sub-title">河南益易信息技术有限公司</div> -->
          <div class="main-title">运维统计中心</div>
        </div>
      </div>
      <div class="col right">
        <div class="time">
          <Icon type="ios-clock-outline"></Icon>
          {{new Date(time).toLocaleString()}}
        </div>
      </div>
    </div>
    <div class="container">
      <div class="col left">
        <div class="module-normal today-new-trades">
          <div class="title">
            <div class="pull-left">
              今日订单：<b>{{todayNewTradesCount.toLocaleString()}}</b>
            </div>
            <div class="pull-right">
              <span :style="{color:todayNewTradesRatio?'#70ff70':'#ff4f4f'}"><b>{{todayNewTradesRatio>=0?'+'+todayNewTradesRatio:todayNewTradesRatio}} %</b></span>
            </div>
          </div>
          <div class="content">
            <div id="todayNewTradesChart"></div>
          </div>
        </div>
        <div class="module-normal narrow today-shipped-trades">
          <div class="title">
            今日发货
          </div>
          <div class="content">
            <div class="emphasis">
              <div class="big pull-left">
                {{todayFinishTradeCount.toLocaleString()}}
              </div>
              <div class="pull-right">
                同比：<span :style="{color:todayFinishTradesRatio?'#70ff70':'#ff4f4f'}"><b>{{todayFinishTradesRatio>=0?'+'+todayFinishTradesRatio:todayFinishTradesRatio}} %</b></span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="module-normal">
          <div class="title">
            完成度
          </div>
          <div class="content">
            <div id="fulfilmentChart"></div>
          </div>
        </div> -->
        <div class="module-normal col-2">
          <div class="half">
            <div class="title">
              已下单
            </div>
            <div class="content">
              <div class="big">{{todayOrderedTradesCount}}</div>
              <div id="fulfilmentChart"></div>
            </div>
          </div>
          <div class="half">
            <div class="title">
              退单量
            </div>
            <div class="content">
              <div class="big">{{todayResignedTradesCount}}</div>
              <div id="resignmentChart"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col middle">
        <div class="buyer-rank-today">
          <div class="title">本日下单排行榜</div>
          <div class="content"><div id="todayBuyerRankChart"></div></div>
        </div>
        <div class="new-list-area">
          <div class="new-trade">
            <div class="title">最新订单</div>
            <div class="content">
              <table class="table-noborder unit-table">
                <thead>
                  <tr>
                    <th class="no"></th>
                    <th class="area">地区</th>
                    <th class="amount">金额</th>
                    <th class="trade-title">标题</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(msg, index) in newTrades" :key="index" class="blink-in">
                    <td class="no"><div>{{index + 1}}</div></td>
                    <td class="area"><div>{{msg.buyer_area}}</div></td>
                    <td class="amount"><div>{{msg.payment}}</div></td>
                    <td class="trade-title"><div>{{msg.title}}</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="new-ordered">
            <div class="title">最新下单</div>
            <div class="content">
              <table class="table-noborder unit-table">
                <thead>
                  <tr>
                    <th class="no"></th>
                    <th class="area">员工</th>
                    <th class="amount">金额</th>
                    <th class="trade-title">标题</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(msg, index) in newOrdereds" :key="index" class="blink-in">
                    <td class="no"><div>{{index + 1}}</div></td>
                    <td class="area"><div>{{msg.name}}</div></td>
                    <td class="amount"><div>{{msg.buyer_fee / 100}}</div></td>
                    <td class="trade-title"><div>{{msg.title}}</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col right">
        <div class="module-normal half recent-daily-trend">
          <div class="title">
            业务走势
          </div>
          <div class="content">
            <div id="recentDailyTrendChart"></div>
          </div>
        </div>
        <div class="module-normal half buyer-yesterday-rank">
          <div class="title">
            昨日最佳
          </div>
          <div class="content">
            <div id="buyerYesterdayRankChart"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      Copyright © 2018 tao11.la | Last update at: {{lastUpdatedAt ? new Date(lastUpdatedAt).toISOString() : ''}}
      <Button size="small" title="全屏" icon="arrow-expand" @click="fullscreenMode=true" v-if="!fullscreenMode"></Button>
      <Button size="small" title="退出全屏" icon="arrow-shrink" @click="fullscreenMode=false" v-else></Button>
      <Button size="small" icon="refresh" title="刷新" :loading="synchronizing" @click="syncData"></Button>
    </div>
    <div class="bg-mask"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import leftPad from 'left-pad'
require('./../../static/js/dark')
export default {
  name: 'monitor',
  components: {
  },
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'zztAuth',
        apiAction: 'Login',
        apiQuery: {}
      },
      apiData: null,
      screenWidth: document.body.clientWidth,
      timer: false,
      time: Date.now(),
      fullscreenMode: true,
      buyersStat: [],
      buyersToday: {
        buyers: [],
        today: []
      },
      syncTask: null,
      synchronizing: false,
      lastUpdatedAt: null,
      newTrades: [],
      newOrdereds: [],
      sysStats: [],
      sysStatsData: {
        categories: [],
        yesterday: [],
        today: []
      },
      buyerYesterdayData: [],
      recentDailyData: []
    }
  },
  watch: {
    screenWidth (val) {
      if (!this.timer) {
        this.screenWidth = val
        this.timer = true
        let that = this
        setTimeout(function () {
          // that.screenWidth = that.$store.state.canvasWidth
          console.log(that.screenWidth)
          that.redraw()
          that.timer = false
        }, 400)
      }
    }
  },
  created () {
    // 如果页面刷新，则emit到Layout组件获取最新session
    if (!this.$store.getters.session) {
      this.$emit('on-checkauth', this.$route.path)
    }
    setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  computed: {
    todayNewTradesCount: function () {
      let lastVal = 0
      for (let i = this.sysStatsData.today.length; i > 0; i--) {
        if (this.sysStatsData.today[i - 1] && this.sysStatsData.today[i - 1].newTradeCount) {
          lastVal = this.sysStatsData.today[i - 1].newTradeCount
          break
        }
      }
      return lastVal
    },
    todayNewTradesRatio: function () {
      let nowHr = leftPad(new Date().getHours(), 2, '0')
      let nowMin = new Date().getMinutes() >= 30 ? '30' : '00'
      let index = this.sysStatsData.categories.indexOf(nowHr + ':' + nowMin)
      let yestVal = this.sysStatsData.yesterday[index]
      let todayVal = this.sysStatsData.today[index]
      if (yestVal && todayVal) {
        return ((todayVal.newTradeCount - yestVal.newTradeCount) / yestVal.newTradeCount * 100).toFixed(2)
      } else {
        return 0
      }
    },
    todayFinishTradeCount: function () {
      let lastVal = 0
      for (let i = this.sysStatsData.today.length; i > 0; i--) {
        if (this.sysStatsData.today[i - 1] && this.sysStatsData.today[i - 1].finishTradeCount) {
          lastVal = this.sysStatsData.today[i - 1].finishTradeCount
          break
        }
      }
      return lastVal
    },
    todayFinishTradesRatio: function () {
      let nowHr = leftPad(new Date().getHours(), 2, '0')
      let nowMin = new Date().getMinutes() >= 30 ? '30' : '00'
      let index = this.sysStatsData.categories.indexOf(nowHr + ':' + nowMin)
      let yestVal = this.sysStatsData.yesterday[index]
      let todayVal = this.sysStatsData.today[index]
      if (yestVal && todayVal) {
        return ((todayVal.finishTradeCount - yestVal.finishTradeCount) / yestVal.finishTradeCount * 100).toFixed(2)
      } else {
        return 0
      }
    },
    todayOrderedTradesCount: function () {
      let lastVal = 0
      for (let i = this.sysStatsData.today.length; i > 0; i--) {
        if (this.sysStatsData.today[i - 1] && this.sysStatsData.today[i - 1].orderedTradeCount) {
          lastVal = this.sysStatsData.today[i - 1].orderedTradeCount
          break
        }
      }
      return lastVal
    },
    todayResignedTradesCount: function () {
      let lastVal = 0
      for (let i = this.sysStatsData.today.length; i > 0; i--) {
        if (this.sysStatsData.today[i - 1] && this.sysStatsData.today[i - 1].resignedTradeCount) {
          lastVal = this.sysStatsData.today[i - 1].resignedTradeCount
          break
        }
      }
      return lastVal
    }
  },
  mounted () {
    this.renewTodayBuyerRank().then((buyersToday) => {
      this.drawTodayBuyerRankChart()
      if (this.syncTask) {
        clearInterval(this.syncTask)
      }
      this.syncData()
      this.syncTask = setInterval(() => {
        this.syncData()
      }, 1000 * 10) // 自动刷新队列
      this.syncSysStats().then((stats) => {
        this.drawTodayNewTradesChart()
        this.drawRecentDailyTrendChart()
        this.drawFulfilmentChart()
        this.drawResignmentChart()
      })
      this.syncTask = setInterval(() => {
        this.syncSysStats().then((stats) => {
          this.drawTodayNewTradesChart()
          this.drawRecentDailyTrendChart()
          this.drawFulfilmentChart()
          this.drawResignmentChart()
        })
      }, 1000 * 60 * 30) // 30分钟刷新一次系统统计
      this.syncYesterdayBuyerStats().then((stats) => {
        this.drawBuyerYesterdayRankChart()
      })
      this.syncRecentDailyStats().then(stats => {
        this.drawRecentDailyTrendChart()
      })
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          this.screenWidth = window.screenWidth
        })()
      }
    }).catch(err => {
      console.log(err)
      this.$Message.error(err.message)
    })
  },
  methods: {
    refreshTime () {
      this.time = Date.now()
      if (new Date().getHours() === 0 && new Date().getMinutes() === 0 && new Date().getSeconds() === 0) {
        window.location.reload()
      }
    },
    redraw () {
      // console.log('redraw start')
      // this.$nextTick()
      this.drawTodayNewTradesChart()
      this.drawRecentDailyTrendChart()
      this.drawFulfilmentChart()
      this.drawResignmentChart()
      // console.log('redrew')
    },
    renewTodayBuyerRank () {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'buyers',
          apiAction: 'listall',
          apiQuery: {}
        }
        this.apiData = {}
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(res => {
          if (res.data.status === 'ok') {
            let buyers = res.data.data
            buyers.forEach((buyer) => {
              let exist = this.buyersStat.filter((item) => {
                return item.userid === buyer.userid
              })
              if (exist.length) {
                exist[0].todayAssigned += buyer.today_assigned || 0
                exist[0].todayFinished += buyer.today_finished || 0
                exist[0].todayOrdered += buyer.today_ordered || 0
                exist[0].todayFailed += buyer.today_failed || 0
                exist[0].todayDismissed += buyer.today_dismissed || 0
                exist[0].monthlyAssigned += buyer.monthly_assigned || 0
                exist[0].monthlyFinished += buyer.monthly_finished || 0
                exist[0].monthlyOrdered += buyer.monthly_ordered || 0
                exist[0].monthlyFailed += buyer.monthly_failed || 0
                exist[0].monthlyDismissed += buyer.monthly_dismissed || 0
                exist[0].totalAssigned += buyer.total_assigned || 0
                exist[0].totalFinished += buyer.total_finished || 0
                exist[0].totalOrdered += buyer.total_ordered || 0
                exist[0].totalFailed += buyer.total_failed || 0
                exist[0].totalDismissed += buyer.total_dismissed || 0
              } else {
                this.buyersStat.push({
                  name: buyer.name,
                  userid: buyer.userid,
                  group: buyer.group,
                  todayAssigned: buyer.today_assigned || 0,
                  todayFinished: buyer.today_finished || 0,
                  todayOrdered: buyer.today_ordered || 0,
                  todayFailed: buyer.today_failed || 0,
                  todayDismissed: buyer.today_dismissed || 0,
                  monthlyAssigned: buyer.monthly_assigned || 0,
                  monthlyFinished: buyer.monthly_finished || 0,
                  monthlyOrdered: buyer.monthly_ordered || 0,
                  monthlyFailed: buyer.monthly_failed || 0,
                  monthlyDismissed: buyer.monthly_dismissed || 0,
                  totalAssigned: buyer.total_assigned || 0,
                  totalFinished: buyer.total_finished || 0,
                  totalOrdered: buyer.total_ordered || 0,
                  totalFailed: buyer.total_failed || 0,
                  totalDismissed: buyer.total_dismissed || 0
                })
              }
            })
            // this.buyersToday = res.data.data
            resolve(this.buyersStat)
          } else {
            reject(new Error('获取今日下单排行失败！'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    drawTodayBuyerRankChart () {
      if (this.buyersStat.length) {
        let buyers = []
        let today = []
        this.buyersStat.sort((a, b) => {
          return b.todayOrdered - a.todayOrdered
        }).forEach((item) => {
          buyers.push(item.name)
          today.push(item.todayOrdered)
        })
        this.buyersToday = {
          buyers: buyers,
          today: today
        }
      }
      var myChart = echarts.getInstanceByDom(document.getElementById('todayBuyerRankChart'))
      if (!myChart) {
        myChart = echarts.init(document.getElementById('todayBuyerRankChart'))
      }
      // 绘制图表
      myChart.setOption({
        color: '#66ffff',
        textStyle: {
          color: '#74bdff'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.buyersToday.buyers
        },
        yAxis: {
          type: 'value',
          min: 0,
          minInterval: 1,
          splitLine: {
            lineStyle: {
              color: '#444',
              type: 'dotted'
            }
          }
        },
        series: [{
          type: 'pictorialBar',
          symbol: 'rect',
          symbolRepeat: true,
          symbolSize: ['60%', '5%'],
          symbolMargin: '20%',
          data: this.buyersToday.today,
          label: {
            show: true,
            position: 'top',
            color: '#66ffff'
          },
          animationEasing: 'elasticOut',
          animationDelay: function (dataIndex, params) {
            return params.index * 30
          }
        }]
      })
    },
    async drawTodayNewTradesChart () {
      if (this.sysStats.length) {
        let cats = [
          '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
          '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
          '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
        ]
        let yesterday = []
        let today = []
        let timeZone = 480 // 加上时差,min
        let yestDate = new Date()
        yestDate.setUTCMinutes(timeZone)
        yestDate.setUTCHours(-48)
        // if (new Date().getUTCHours() >= 16) {
        //   yestDate.setUTCHours(-72)
        // } else {
        //   yestDate.setUTCHours(-48)
        // }
        yestDate.setUTCHours(16)
        yestDate.setUTCMinutes(0)
        yestDate.setUTCSeconds(0)
        yestDate.setUTCMilliseconds(0)
        console.log('[init]yesterday:' + yestDate.toISOString())
        let todayDate = new Date()
        todayDate.setUTCMinutes(timeZone)
        todayDate.setUTCHours(-24)
        // if (new Date().getUTCHours() >= 16) {
        //   todayDate.setUTCHours(-48)
        // } else {
        //   todayDate.setUTCHours(-24)
        // }
        todayDate.setUTCHours(16)
        todayDate.setUTCMinutes(0)
        todayDate.setUTCSeconds(0)
        todayDate.setUTCMilliseconds(0)
        console.log('[init]today' + todayDate.toISOString())
        for (let i = 0; i < cats.length; i++) {
          await (() => {
            return new Promise((resolve, reject) => {
              try {
                let hr = cats[i].split(':')[0]
                let min = cats[i].split(':')[1]
                yestDate.setHours(hr)
                yestDate.setMinutes(min)
                todayDate.setHours(hr)
                todayDate.setMinutes(min)
                // console.log('now:' + new Date().toISOString())
                // console.log('yestday:' + yestDate.toISOString().substr(0, 16))
                // console.log('today:' + todayDate.toISOString())
                let yestData = this.sysStats.filter((item) => {
                  return item.time.indexOf(yestDate.toISOString().substr(0, 16)) > -1
                })
                // if (yestData.length) {
                //   console.log('#yestData:' + yestData[0].newTradeCount)
                // }
                // let yestVal = yestData.length ? yestData[0].newTradeCount : yesterday[yesterday.length - 1]
                // if (i === 0 && !yestData.length) {
                //   yestVal = 0
                // }
                let yestVal
                if (yestData.length) {
                  yestVal = {
                    newTradeCount: yestData[0].newTradeCount,
                    finishTradeCount: yestData[0].finishTradeCount,
                    orderedTradeCount: yestData[0].orderedTradeCount,
                    resignedTradeCount: yestData[0].resignedTradeCount
                  }
                } else {
                  if (i === 0) {
                    yestVal = {
                      newTradeCount: 0,
                      finishTradeCount: 0,
                      orderedTradeCount: 0,
                      resignedTradeCount: 0
                    }
                  } else {
                    yestVal = {
                      newTradeCount: yesterday[yesterday.length - 1].newTradeCount,
                      finishTradeCount: yesterday[yesterday.length - 1].finishTradeCount,
                      orderedTradeCount: yesterday[yesterday.length - 1].orderedTradeCount,
                      resignedTradeCount: yesterday[yesterday.length - 1].resignedTradeCount
                    }
                  }
                }
                yesterday.push(yestVal)
                // console.log(todayDate.toISOString().substr(0, 16))
                let todayData = this.sysStats.filter((item) => {
                  return item.time.indexOf(todayDate.toISOString().substr(0, 16)) > -1
                })
                // if (todayData.length) {
                //   console.log('#todayData:' + todayData[0].newTradeCount)
                // }
                // let todayVal = todayData.length ? todayData[0].newTradeCount : today[today.length - 1]
                // if (i === 0 && !todayData.length) {
                //   todayVal = 0
                // }
                let todayVal
                if (todayData.length) {
                  todayVal = {
                    newTradeCount: todayData[0].newTradeCount,
                    finishTradeCount: todayData[0].finishTradeCount,
                    orderedTradeCount: todayData[0].orderedTradeCount,
                    resignedTradeCount: todayData[0].resignedTradeCount
                  }
                } else {
                  if (i === 0) {
                    todayVal = {
                      newTradeCount: 0,
                      finishTradeCount: 0,
                      orderedTradeCount: 0,
                      resignedTradeCount: 0
                    }
                  } else {
                    // todayVal = {
                    //   newTradeCount: today[today.length - 1].newTradeCount,
                    //   finishTradeCount: today[today.length - 1].finishTradeCount,
                    //   orderedTradeCount: today[today.length - 1].orderedTradeCount,
                    //   resignedTradeCount: today[today.length - 1].resignedTradeCount
                    // }
                    todayVal = {
                      newTradeCount: null,
                      finishTradeCount: null,
                      orderedTradeCount: null,
                      resignedTradeCount: null
                    }
                  }
                }
                today.push(todayVal)
                resolve()
              } catch (err) {
                reject(err)
              }
            })
          })(i)
        }
        this.sysStatsData = {
          categories: cats,
          yesterday: yesterday,
          today: today
        }
      }
      var myChart = echarts.getInstanceByDom(document.getElementById('todayNewTradesChart'))
      if (!myChart) {
        myChart = echarts.init(document.getElementById('todayNewTradesChart'))
      }
      // 绘制图表
      myChart.setOption({
        color: ['#66ffff', '#286189'],
        textStyle: {
          color: '#74bdff'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        title: {
          show: false
        },
        legend: {
          show: false
        },
        grid: {
          top: 20,
          right: 10,
          bottom: 30
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.sysStatsData.categories
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            minInterval: 1,
            splitLine: {
              lineStyle: {
                color: '#444',
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '今天',
            type: 'line',
            areaStyle: {
              color: 'rgba(102, 255, 255, 0.1)'
            },
            smooth: true,
            showSymbol: false,
            data: this.sysStatsData.today.map((item) => {
              return item.newTradeCount
            })
          },
          {
            name: '昨天',
            type: 'line',
            areaStyle: {
              color: 'rgba(40, 97, 137, 0.1)'
            },
            smooth: true,
            showSymbol: false,
            data: this.sysStatsData.yesterday.map((item) => {
              return item.newTradeCount
            })
          }
        ]
      })
    },
    async drawBuyerYesterdayRankChart () {
      if (this.buyerYesterdayData.length) {
        var myChart = echarts.getInstanceByDom(document.getElementById('buyerYesterdayRankChart'))
        if (!myChart) {
          myChart = echarts.init(document.getElementById('buyerYesterdayRankChart'))
        }
        // 绘制图表
        myChart.setOption({
          color: ['#66ffff', '#286189'],
          textStyle: {
            color: '#74bdff'
          },
          title: {
            show: false
          },
          grid: {
            top: 20,
            right: 10
          },
          legend: {
            show: true,
            left: 5,
            top: 5,
            orient: 'vertical',
            textStyle: {
              color: '#74bdff'
            }
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          radar: {
            shape: 'circle',
            indicator: this.buyerYesterdayData.map(item => {
              return {
                name: item.name,
                max: 300
              }
            }),
            axisLine: {
              lineStyle: {
                color: '#444',
                type: 'dotted'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#444',
                type: 'dotted'
              }
            },
            splitArea: {
              show: false
            }
          },
          series: [{
            name: '昨日最佳',
            type: 'radar',
            areaStyle: {
              normal: {
                opacity: 0.2
              }
            },
            label: {
              show: true
            },
            data: [
              {
                value: this.buyerYesterdayData.map(item => {
                  return item.ordered
                }),
                name: '下单'
              },
              {
                value: this.buyerYesterdayData.map(item => {
                  return item.assigned
                }),
                name: '分配'
              }
            ]
          }]
        })
      }
    },
    async drawRecentDailyTrendChart () {
      if (this.recentDailyData.length) {
        let cats = []
        let yesterday = new Date()
        yesterday.setUTCSeconds(0)
        yesterday.setUTCMilliseconds(0)
        for (let i = 0; i < 7; i++) {
          if (new Date().getUTCHours() < 16 || i > 0) {
            yesterday.setUTCHours(-24)
          }
          yesterday.setUTCHours(15)
          yesterday.setUTCMinutes(30)
          cats.push(leftPad((yesterday.getUTCMonth() + 1), 2, '0') + '/' + leftPad(yesterday.getUTCDate(), 2, '0'))
        }
        if (this.sysStatsData.today.length) {
          cats.push((new Date().getMonth() + 1) + '/' + new Date().getDate())
        }
        cats = cats.sort()
        // console.log(cats)
        let data = []
        for (let i = 0; i < cats.length; i++) {
          await (() => {
            return new Promise((resolve, reject) => {
              try {
                let month = cats[i].split('/')[0]
                let date = cats[i].split('/')[1]
                let curData = this.recentDailyData.filter((item) => {
                  let dateParse = new Date(item.time)
                  return dateParse.getUTCMonth() === parseInt(month) - 1 && dateParse.getUTCDate() === parseInt(date)
                })
                if (curData.length) {
                  data.push({
                    newTradeCount: curData[0].newTradeCount,
                    finishTradeCount: curData[0].finishTradeCount,
                    orderedTradeCount: curData[0].orderedTradeCount,
                    resignedTradeCount: curData[0].resignedTradeCount
                  })
                } else {
                  data.push({
                    newTradeCount: 0,
                    finishTradeCount: 0,
                    orderedTradeCount: 0,
                    resignedTradeCount: 0
                  })
                }
                resolve()
              } catch (err) {
                reject(err)
              }
            })
          })(i)
        }
        if (this.sysStatsData.today.length) {
          let todayStat = this.sysStats.filter((item) => {
            return new Date(item.time).getUTCMonth() === new Date().getUTCMonth() && new Date(item.time).getUTCDate() === new Date().getUTCDate()
          })
          data[data.length - 1] = {
            newTradeCount: todayStat.length ? todayStat[todayStat.length - 1].newTradeCount : 0,
            finishTradeCount: todayStat.length ? todayStat[todayStat.length - 1].finishTradeCount : 0,
            orderedTradeCount: todayStat.length ? todayStat[todayStat.length - 1].orderedTradeCount : 0,
            resignedTradeCount: todayStat.length ? todayStat[todayStat.length - 1].resignedTradeCount : 0
          }
        }
        // console.log(cats)
        // console.log(data.map((item) => {
        //   return item.newTradeCount
        // }))
        var myChart = echarts.getInstanceByDom(document.getElementById('recentDailyTrendChart'))
        if (!myChart) {
          myChart = echarts.init(document.getElementById('recentDailyTrendChart'))
        }
        // 绘制图表
        myChart.setOption({
          color: ['#66ffff', '#286189', '#c23531', '#d48265'],
          textStyle: {
            color: '#74bdff'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          title: {
            show: false
          },
          legend: {
            show: true,
            textStyle: {
              color: '#74bdff'
            }
          },
          grid: {
            // top: 20,
            right: 20,
            bottom: 30
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: cats
            }
          ],
          yAxis: [
            {
              type: 'value',
              min: 0,
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  color: '#444',
                  type: 'dotted'
                }
              }
            }
          ],
          series: [
            {
              name: '下单数量',
              type: 'line',
              areaStyle: {
                color: 'rgba(102, 255, 255, 0.1)'
              },
              showSymbol: false,
              data: data.map((item) => {
                return item.orderedTradeCount
              })
            },
            {
              name: '订单数量',
              type: 'line',
              areaStyle: {
                color: 'rgba(40, 97, 137, 0.1)'
              },
              showSymbol: false,
              data: data.map((item) => {
                return item.newTradeCount
              })
            },
            {
              name: '发货数量',
              type: 'line',
              areaStyle: {
                color: 'rgba(40, 97, 137, 0.1)'
              },
              showSymbol: false,
              data: data.map((item) => {
                return item.finishTradeCount
              })
            },
            {
              name: '退单数量',
              type: 'line',
              areaStyle: {
                color: 'rgba(40, 97, 137, 0.1)'
              },
              showSymbol: false,
              data: data.map((item) => {
                return item.resignedTradeCount
              })
            }
          ]
        })
      }
    },
    drawFulfilmentChart () {
      var myChart = echarts.getInstanceByDom(document.getElementById('fulfilmentChart'))
      if (!myChart) {
        myChart = echarts.init(document.getElementById('fulfilmentChart'))
      }
      let fulfiled = 0
      let unfulfiled = 0
      let todayStat = this.sysStats.filter((item) => {
        return new Date(item.time).getUTCMonth() === new Date().getUTCMonth() && new Date(item.time).getUTCDate() === new Date().getUTCDate()
      })
      // console.log(todayStat)
      if (todayStat.length) {
        fulfiled = todayStat[todayStat.length - 1].orderedTradeCount
        unfulfiled = todayStat[todayStat.length - 1].newTradeCount -
          todayStat[todayStat.length - 1].finishedTradeCount
      }
      // 绘制图表
      myChart.setOption({
        color: ['#70ff70', '#666'],
        legend: {
          show: false,
          textStyle: {
            color: '#74bdff'
          }
        },
        series: [
          {
            name: '完成度',
            type: 'pie',
            radius: ['40%', '70%'],
            roseType: 'radius',
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                },
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: fulfiled,
                name: '已完成'
              },
              {
                value: unfulfiled,
                name: '未完成',
                label: {
                  show: false
                }
              }
            ]
          }
        ]
      })
    },
    drawResignmentChart () {
      var myChart = echarts.getInstanceByDom(document.getElementById('resignmentChart'))
      if (!myChart) {
        myChart = echarts.init(document.getElementById('resignmentChart'))
      }
      let resigned = 0
      let normal = 0
      let todayStat = this.sysStats.filter((item) => {
        return new Date(item.time).getMonth() === new Date().getMonth() && new Date(item.time).getDate() === new Date().getDate()
      })
      if (todayStat.length) {
        resigned = todayStat[todayStat.length - 1].resignedTradeCount
        normal = todayStat[todayStat.length - 1].newTradeCount -
          todayStat[todayStat.length - 1].resignedTradeCount
      }
      // 绘制图表
      myChart.setOption({
        color: ['#c23531', '#666'],
        legend: {
          show: false,
          textStyle: {
            color: '#74bdff'
          }
        },
        grid: {
          top: 0,
          bottom: 0
        },
        series: [
          {
            name: '退单比',
            type: 'pie',
            radius: ['40%', '70%'],
            roseType: 'radius',
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                },
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: resigned,
                name: '退单'
              },
              {
                value: normal,
                name: '正常',
                label: {
                  show: false
                }
              }
            ]
          }
        ]
      })
    },
    async syncData () {
      this.synchronizing = true
      await this.syncQueue().then(async (msgs) => {
        this.synchronizing = false
        for (let i = 0; i < msgs.length; i++) {
          let msg = msgs[i]
          console.log('new msg accquired')
          console.log(msg)
          await (() => {
            return new Promise((resolve, reject) => {
              if (msg && msg.action === 'trade-new') {
                if (this.newTrades.length >= 20) {
                  this.newTrades = this.newTrades.slice(this.newTrades.length - 19, 19)
                }
                this.newTrades.push(msg.value)
                this.newTrades.sort((a, b) => {
                  return new Date(b.pushtime) - new Date(a.pushtime)
                })
                let today = new Date()
                today.setUTCHours(-24)
                today.setUTCHours(16)
                today.setUTCMinutes(0)
                today.setUTCSeconds(0)
                today.setUTCMilliseconds(0)
                if (this.sysStats.length) {
                  let todayLast = this.sysStats.filter((item) => {
                    return item.time >= today.toISOString()
                  })
                  if (todayLast.length) {
                    todayLast[todayLast.length - 1].newTradeCount = todayLast[todayLast.length - 1].newTradeCount ? todayLast[todayLast.length - 1].newTradeCount + 1 : 1
                  } else {
                    this.sysStats.push({
                      finishTradeCount: 0,
                      group: this.$store.getters.user.group,
                      newTradeCount: 1,
                      orderedTradeCount: 0,
                      resignedTradeCount: 0,
                      time: new Date().toISOString()
                    })
                  }
                } else {
                  this.sysStats = [{
                    finishTradeCount: 0,
                    group: this.$store.getters.user.group,
                    newTradeCount: 1,
                    orderedTradeCount: 0,
                    resignedTradeCount: 0,
                    time: new Date().toISOString()
                  }]
                }
                this.$nextTick()
                this.drawTodayNewTradesChart()
                this.drawRecentDailyTrendChart()
                this.drawFulfilmentChart()
                this.drawResignmentChart()
              } else if (msg && msg.action === 'ordered-new') {
                if (this.newOrdereds.length >= 20) {
                  this.newOrdereds = this.newOrdereds.slice(this.newOrdereds.length - 19, 19)
                }
                this.newOrdereds.push(msg.value)
                this.newOrdereds.sort((a, b) => {
                  return new Date(b.pushtime) - new Date(a.pushtime)
                })
                let buyer = this.buyersStat.filter((item) => {
                  return item.userid === msg.value.userid
                })
                if (buyer) {
                  buyer[0].todayOrdered += 1
                  buyer[0].monthlyOrdered += 1
                  buyer[0].totalOrdered += 1
                }
                let today = new Date()
                today.setUTCHours(-24)
                today.setUTCHours(16)
                today.setUTCMinutes(0)
                today.setUTCSeconds(0)
                today.setUTCMilliseconds(0)
                if (this.sysStats.length) {
                  let todayLast = this.sysStats.filter((item) => {
                    return item.time >= today.toISOString()
                  })
                  if (todayLast.length) {
                    todayLast[todayLast.length - 1].orderedTradeCount = todayLast[todayLast.length - 1].orderedTradeCount ? todayLast[todayLast.length - 1].orderedTradeCount + 1 : 1
                  } else {
                    this.sysStats.push({
                      finishTradeCount: 0,
                      group: this.$store.getters.user.group,
                      newTradeCount: 0,
                      orderedTradeCount: 1,
                      resignedTradeCount: 0,
                      time: new Date().toISOString()
                    })
                  }
                } else {
                  this.sysStats = [{
                    finishTradeCount: 0,
                    group: this.$store.getters.user.group,
                    newTradeCount: 0,
                    orderedTradeCount: 1,
                    resignedTradeCount: 0,
                    time: new Date().toISOString()
                  }]
                }
                this.$nextTick()
                this.drawTodayBuyerRankChart()
                this.drawRecentDailyTrendChart()
                this.drawFulfilmentChart()
                this.drawResignmentChart()
              } else if (msg && msg.action === 'shipped-new') {
                let buyer = this.buyersStat.filter((item) => {
                  return item.userid === msg.value.userid
                })
                if (buyer) {
                  buyer[0].todayFinished += 1
                  buyer[0].monthlyFinished += 1
                  buyer[0].totalFinished += 1
                }
                let today = new Date()
                today.setUTCHours(-24)
                today.setUTCHours(16)
                today.setUTCMinutes(0)
                today.setUTCSeconds(0)
                today.setUTCMilliseconds(0)
                if (this.sysStats.length) {
                  let todayLast = this.sysStats.filter((item) => {
                    return item.time >= today.toISOString()
                  })
                  if (todayLast.length) {
                    todayLast[todayLast.length - 1].orderedTradeCount = todayLast[todayLast.length - 1].finishTradeCount ? todayLast[todayLast.length - 1].finishTradeCount + 1 : 1
                  } else {
                    this.sysStats.push({
                      finishTradeCount: 1,
                      group: this.$store.getters.user.group,
                      newTradeCount: 0,
                      orderedTradeCount: 0,
                      resignedTradeCount: 0,
                      time: new Date().toISOString()
                    })
                  }
                } else {
                  this.sysStats = [{
                    finishTradeCount: 1,
                    group: this.$store.getters.user.group,
                    newTradeCount: 0,
                    orderedTradeCount: 0,
                    resignedTradeCount: 0,
                    time: new Date().toISOString()
                  }]
                }
                this.$nextTick()
                // this.drawTodayNewTradesChart()
                this.drawRecentDailyTrendChart()
                this.drawFulfilmentChart()
              }
              resolve()
            })
          })(i)
        }
      }).catch(() => {
        // console.log(err)
        // this.$Message.error('数据同步失败!' + err.message)
        this.synchronizing = false
      })
    },
    /**
     * 获取消息队列最新消息
     */
    async syncQueue () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'readfromqueue', // getqueue
        apiQuery: {}
      }
      this.apiData = {}
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error('队列获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('数据同步成功!')
            this.lastUpdatedAt = Date.now()
            this.$store.dispatch('setAPILastResponse', respBody)
            // console.log(respBody.data)
            if (respBody.data.length) {
              resolve(respBody.data)
            } else {
              resolve()
            }
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          resolve()
        })
      })
    },
    /**
     * 获取系统统计数据
     */
    async syncSysStats () {
      this.apiItem = {
        apiHost: '',
        apiService: 'sys',
        apiAction: 'getDetailedStats',
        apiQuery: {}
      }
      this.apiData = {}
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error('系统统计同步失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('数据同步成功!')
            this.sysStats = respBody.data
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    /**
     * 获取昨日买手统计数据
     */
    async syncYesterdayBuyerStats () {
      this.apiItem = {
        apiHost: '',
        apiService: 'buyerStats',
        apiAction: 'getYesterdayRank',
        apiQuery: {}
      }
      this.apiData = {}
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error('买手昨日排行同步失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('数据同步成功!')
            this.buyerYesterdayData = respBody.data
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    /**
     * 获取最近七日统计数据
     */
    async syncRecentDailyStats () {
      this.apiItem = {
        apiHost: '',
        apiService: 'sys',
        apiAction: 'getRecentDailyStats',
        apiQuery: {}
      }
      this.apiData = {}
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error('七日统计同步失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('数据同步成功!')
            this.recentDailyData = respBody.data
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.syncTask)
  }
}
</script>

<style lang="less" scoped>
.monitor {
  background: url('../assets/monitor_bg_1.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  position: relative;
  color: #eee;
  font-family: 'Microsoft Yahei', 'PingFang SC', 'Tahoma', 'Arial';
  display: flex;
  flex-direction: column;
  transition: all .5s ease-in-out;
  &.fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
  }
  .header {
    position: relative;
    z-index: 1000;
    width: 100;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 15px;
    }
    .left {
      width: 25%;
    }
    .middle {
      width: 45%;
      .title {
        text-align: center;
        font-size: 22px;
        .main-title {
          font-weight: 800;
          font-size: 28px;
        }
      }
    }
    .right {
      width: 25%;
      .time {
        font-size: 18px;
      }
    }
  }
  .container {
    position: relative;
    z-index: 1000;
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .title {
      line-height: 32px;
      padding: 0 16px;
      font-size: 16px;
      border: 1px solid #000;
      background: linear-gradient(to right, #336699, #000);
    }
    .content {
      margin-top: 10px;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .emphasis {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .module-normal {
      width: 100%;
      height: 33%;
      text-align: center;
      display: flex;
      flex-direction: column;
      &.half {
        height: 50%;
      }
      &.narrow {
        height: 16%;
      }
      .title {
        text-align: left;
      }
      .content {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
      }
      &.col-2 {
        flex-direction: row;
        justify-content: space-between;
        .half {
          width: 48%;
        }
      }
    }
    .col {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 15px;
    }
    .left {
      width: 25%;
      display: flex;
      flex-direction: column;
      #todayNewTradesChart {
        height: 100%;
        width: 100%;
      }
      #fulfilmentChart, #resignmentChart {
        flex: 1
      }
    }
    .middle {
      width: 45%;
      display: flex;
      flex-direction: column;
      .buyer-rank-today {
        width: 100%;
        height: 50%;
        background: url('./../assets/border.png');
        background-size: 100% 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        .title {
          line-height: 32px;
          font-size: 16px;
          padding: 0;
          border: none;
          background: none;
        }
        .content {
          flex: 1;
          margin-top: 20px;
          position: relative;
          #todayBuyerRankChart {
            height: 100%;
            width: 100%;
          }
        }
      }
      .new-list-area {
        margin-top: 20px;
        flex: 1;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        & > div {
          width: 50%;
          padding: 10px;
        }
        .no {
          width: 24px;
        }
        .trade-title {
          text-align: left;
        }
        .amount {
          width: 60px;
        }
        .area {
          width: 60px;
        }
      }
    }
    .right {
      width: 25%;
      display: flex;
      flex-direction: column;
      #recentDailyTrendChart {
        height: 100%;
        width: 100%;
      }
      #buyerYesterdayRankChart {
        height: 100%;
        width: 100%;
      }
    }
  }
  .footer {
    z-index: 1000;
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
  .bg-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .6);
  }
}
.unit-table {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  border: none;
  color: #74bdff;
  overflow: hidden;
  table-layout:fixed;
  th {
    background: rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    overflow: hidden;
    height: 40px;
    border-bottom: 1px solid #74bdff;
  }
  td {
    line-height: 32px;
    color: #74bdff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    background-color: rgba(0, 0, 85, 0.6);
    border-bottom: 1px solid #000;
  }
  tr:nth-child(2n) td {
    background-color: rgba(0, 68, 187, 0.4);
  }
}
.blink-in {
  animation-name: blinkIn;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
/*.fade-slide-in {
  animation: fadeSlideIn 0.3s ease-in-out;
}*/
@keyframes blinkIn {
  0% {
    opacity: 0;
    color: #666;
    background: #000;
  }
  50% {
    opacity: 1;
    color: #2c3e50;
    background: #efefef;
  }
  100% {
    opacity: 1;
    color: #fff;
    background: transparent;
  }
}
.big {
  font-size: 32px;
  font-weight: 800;
}
</style>
