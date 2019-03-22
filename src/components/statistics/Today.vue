<template>
  <div class="stat-today-container">
    <Button type="ghost" @click="entrance">刷新</Button>
    <div class="stat-today">
      <ul>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">今日派单：</span>
          <span class="num">{{today.today_assigned}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">今日完成：</span>
          <span class="num">{{today.today_finished}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">今日下单：</span>
          <span class="num">{{today.today_ordered}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">今日退单：</span>
          <span class="num">{{today.today_failed}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">今日撤销：</span>
          <span class="num">{{today.today_dismissed}}</span>
        </li>
      </ul>
      <ul>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">本月派单：</span>
          <span class="num">{{today.monthly_assigned}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">本月完成：</span>
          <span class="num">{{today.monthly_finished}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">本月下单：</span>
          <span class="num">{{today.monthly_ordered}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">本月退单：</span>
          <span class="num">{{today.monthly_failed}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">本月撤销：</span>
          <span class="num">{{today.monthly_dismissed}}</span>
        </li>
      </ul>
      <ul>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">全部派单：</span>
          <span class="num">{{today.total_assigned}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">全部完成：</span>
          <span class="num">{{today.total_finished}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">全部下单：</span>
          <span class="num">{{today.total_ordered}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">全部退单：</span>
          <span class="num">{{today.total_failed}}</span>
        </li>
        <li :style="{background: colorSelections[Math.round(Math.random() * 8)]}">
          <span class="title">全部撤销：</span>
          <span class="num">{{today.total_dismissed}}</span>
        </li>
      </ul>
    </div>
    <div class="today-shop-trades" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role)>-1">
      <div class="today-trade-total">
        <span class="title">今日订单：</span>
        <span class="num">{{todayShopTradeTotal}}</span>
      </div>
      <ul class="shop-ul">
        <li v-for="(shop, index) in todayShopTrades" :key="index" @mouseenter="drawRecentShopTradesChart(index)">
          <span class="title">{{shop.shop}}：</span>
          <span class="num">{{shop.tradeCount}}</span>
          <span class="num-yesterday" v-if="$store.getters.user.role==='god'">
            昨:{{recentShopTrades.day1.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day1.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}
          </span>
          <div class="recent" :id="'recentShopTable-'+index" v-if="$store.getters.user.role==='god'">
            <ul>
              <li><span class="recent-title">今日:</span><span class="recent-digit">{{shop.tradeCount}}</span></li>
              <li>&nbsp;</li>
              <li><span class="recent-title">昨日:</span><span class="recent-digit">{{recentShopTrades.day1.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day1.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}</span></li>
              <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{recentShopTrades.day2.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day2.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}</span></li>
              <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{recentShopTrades.day3.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day3.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}</span></li>
              <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{recentShopTrades.day4.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day4.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}</span></li>
              <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{recentShopTrades.day5.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day5.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}</span></li>
              <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{recentShopTrades.day6.shops.filter((item)=>{return item.shop===shop.shop})[0]?recentShopTrades.day6.shops.filter((item)=>{return item.shop===shop.shop})[0].tradeCount:0}}</span></li>
            </ul>
          </div>
          <div class="recent-chart" :id="'recentShopChart-'+index" v-if="$store.getters.user.role==='god'"></div>
          <div class="recent-table-visibility" v-if="$store.getters.user.role==='god'" @click="toggleRecentShopChart(index)">
            <Icon type="ios-glasses-outline"></Icon>
          </div>
        </li>
      </ul>
    </div>
    <div class="shop-ranks" v-if="['god'].indexOf($store.getters.user.role)>-1">
      <Card class="today">
        <p slot="title">
          <Icon type="podium"></Icon>
          今日店铺订单排行
        </p>
        <ul>
          <li>
            <span class="rank-index"></span>
            <span class="rank-shopname">店铺</span>
            <span class="rank-group"><b>店群</b></span>
            <span class="rank-tradecount">
              订单数
            </span>
            <span class="rank-shift">
              对比
            </span>
          </li>
          <li v-for="(shop, idx) in todayShopRank" :key="idx">
            <span class="rank-index">{{ idx + 1 }}.</span>
            <span class="rank-shopname">
              <Poptip trigger="hover" :title="shop.shop" @on-popper-show="getRankPoptipContent(shop.shop)" @on-popper-hide="clearRankPoptipContent">
                {{ shop.shop }}
                <div class="rank-shop-recent" slot="content" :ref="'rank-today-poptip-content-' + idx">
                  <div v-if="!rankShopRecentTrades.shop">加载中...</div>
                  <div class="recent" v-if="rankShopRecentTrades.shop">
                    <div class="shop-tags">
                      <Tag type="border" closable color="green" v-for="(tag, idx) in rankShopTags" :key="idx">{{tag}}</Tag>
                      <Button type="ghost" @click="editShopTags(shop.shop)" size="small" icon="plus">标签</Button>
                    </div>
                    <ul>
                      <li><span class="recent-title">昨日:</span><span class="recent-digit">{{rankShopRecentTrades.day1}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day2}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day3}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day4}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day5}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day6}}</span></li>
                    </ul>
                  </div>
                  <div class="recent-chart" id="rankShopRecentChart" v-if="rankShopRecentTrades.shop"></div>
                </div>
              </Poptip>
            </span>
            <span class="rank-group">{{ shop.group }}</span>
            <span class="rank-tradecount">
              {{shop.tradeCount}}
            </span>
            <span class="rank-shift">
              <span v-if="shop.yesterdayRank==='300+'" class="font-green">↑300+</span>
              <span v-else-if="shop.yesterdayRank > shop.rank" class="font-green">↑{{shop.yesterdayRank - shop.rank}}</span>
              <span v-else-if="shop.rank > shop.yesterdayRank" class="font-red">↓{{shop.rank - shop.yesterdayRank}}</span>
              <span v-else>--</span>
            </span>
          </li>
        </ul>
      </Card>
      <Card class="yesterday">
        <p slot="title">
          <Icon type="podium"></Icon>
          昨日店铺订单排行
        </p>
        <ul>
          <li>
            <span class="rank-index"></span>
            <span class="rank-shopname">店铺</span>
            <span class="rank-group"><b>店群</b></span>
            <span class="rank-tradecount">
              订单数
            </span>
            <span class="rank-shift">
              对比
            </span>
          </li>
          <li v-for="(shop, idx) in yesterdayShopRank" :key="idx">
            <span class="rank-index">{{ idx + 1 }}.</span>
            <span class="rank-shopname">
              <Poptip trigger="hover" :title="shop.shop" @on-popper-show="getRankPoptipContent(shop.shop)" @on-popper-hide="clearRankPoptipContent">
                {{ shop.shop }}
                <div class="rank-shop-recent" slot="content" :ref="'rank-yesterday-poptip-content-' + idx">
                  <div v-if="!rankShopRecentTrades.shop">加载中...</div>
                  <div class="recent" v-if="rankShopRecentTrades.shop">
                    <ul>
                      <li><span class="recent-title">昨日:</span><span class="recent-digit">{{rankShopRecentTrades.day1}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day2}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day3}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day4}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day5}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day6}}</span></li>
                    </ul>
                  </div>
                  <div class="recent-chart" id="rankShopRecentChart" v-if="rankShopRecentTrades.shop"></div>
                </div>
              </Poptip>
            </span>
            <span class="rank-group">{{ shop.group }}</span>
            <span class="rank-tradecount">
              {{shop.tradeCount}}
            </span>
            <span class="rank-shift">
              <span v-if="shop.yesterdayRank==='300+'" class="font-green">↑300+</span>
              <span v-else-if="shop.yesterdayRank > shop.rank" class="font-green">↑{{shop.yesterdayRank - shop.rank}}</span>
              <span v-else-if="shop.rank > shop.yesterdayRank" class="font-red">↓{{shop.rank - shop.yesterdayRank}}</span>
              <span v-else>--</span>
            </span>
          </li>
        </ul>
      </Card>
      <Card class="daybeforeyesterday">
        <p slot="title">
          <Icon type="podium"></Icon>
          前天店铺订单排行
        </p>
        <ul>
          <li>
            <span class="rank-index"></span>
            <span class="rank-shopname">店铺</span>
            <span class="rank-group"><b>店群</b></span>
            <span class="rank-tradecount">
              订单数
            </span>
            <span class="rank-shift">
              对比
            </span>
          </li>
          <li v-for="(shop, idx) in daybeforeyesterdayShopRank" :key="idx">
            <span class="rank-index">{{ idx + 1 }}.</span>
            <span class="rank-shopname">
              <Poptip trigger="hover" :title="shop.shop" @on-popper-show="getRankPoptipContent(shop.shop)" @on-popper-hide="clearRankPoptipContent">
                {{ shop.shop }}
                <div class="rank-shop-recent" slot="content" :ref="'rank-daybeforeyesterday-poptip-content-' + idx">
                  <div v-if="!rankShopRecentTrades.shop">加载中...</div>
                  <div class="recent" v-if="rankShopRecentTrades.shop">
                    <ul>
                      <li><span class="recent-title">昨日:</span><span class="recent-digit">{{rankShopRecentTrades.day1}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day2}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day3}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day4}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day5}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day6}}</span></li>
                    </ul>
                  </div>
                  <div class="recent-chart" id="rankShopRecentChart" v-if="rankShopRecentTrades.shop"></div>
                </div>
              </Poptip>
            </span>
            <span class="rank-group">{{ shop.group }}</span>
            <span class="rank-tradecount">
              {{shop.tradeCount}}
            </span>
            <span class="rank-shift">
              <span v-if="shop.yesterdayRank==='300+'" class="font-green">↑300+</span>
              <span v-else-if="shop.yesterdayRank > shop.rank" class="font-green">↑{{shop.yesterdayRank - shop.rank}}</span>
              <span v-else-if="shop.rank > shop.yesterdayRank" class="font-red">↓{{shop.rank - shop.yesterdayRank}}</span>
              <span v-else>--</span>
            </span>
          </li>
        </ul>
      </Card>
    </div>
    <div class="shop-ranks pets-rank" v-if="['god'].indexOf($store.getters.user.role)>-1">
      <Card class="today">
        <p slot="title">
          <Icon type="podium"></Icon>
          【宠物】今日店铺订单排行
        </p>
        <ul>
          <li>
            <span class="rank-index"></span>
            <span class="rank-shopname">店铺</span>
            <span class="rank-group"><b>店群</b></span>
            <span class="rank-tradecount">
              订单数
            </span>
            <span class="rank-shift">
              对比
            </span>
          </li>
          <li v-for="(shop, idx) in todayShopRank_Pets" :key="idx">
            <span class="rank-index">{{ idx + 1 }}.</span>
            <span class="rank-shopname">
              <Poptip trigger="hover" :title="shop.shop" @on-popper-show="getRankPoptipContent(shop.shop)" @on-popper-hide="clearRankPoptipContent">
                {{ shop.shop }}
                <div class="rank-shop-recent" slot="content" :ref="'rank-today-poptip-content-' + idx">
                  <div v-if="!rankShopRecentTrades.shop">加载中...</div>
                  <div class="recent" v-if="rankShopRecentTrades.shop">
                    <ul>
                      <li><span class="recent-title">昨日:</span><span class="recent-digit">{{rankShopRecentTrades.day1}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day2}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day3}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day4}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day5}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day6}}</span></li>
                    </ul>
                  </div>
                  <div class="recent-chart" id="rankShopRecentChart" v-if="rankShopRecentTrades.shop"></div>
                </div>
              </Poptip>
            </span>
            <span class="rank-group">{{ shop.group }}</span>
            <span class="rank-tradecount">
              {{shop.tradeCount}}
            </span>
            <span class="rank-shift">
              <span v-if="shop.yesterdayRank==='300+'" class="font-green">↑300+</span>
              <span v-else-if="shop.yesterdayRank > shop.rank" class="font-green">↑{{shop.yesterdayRank - shop.rank}}</span>
              <span v-else-if="shop.rank > shop.yesterdayRank" class="font-red">↓{{shop.rank - shop.yesterdayRank}}</span>
              <span v-else>--</span>
            </span>
          </li>
        </ul>
      </Card>
      <Card class="yesterday">
        <p slot="title">
          <Icon type="podium"></Icon>
          【宠物】昨日店铺订单排行
        </p>
        <ul>
          <li>
            <span class="rank-index"></span>
            <span class="rank-shopname">店铺</span>
            <span class="rank-group"><b>店群</b></span>
            <span class="rank-tradecount">
              订单数
            </span>
            <span class="rank-shift">
              对比
            </span>
          </li>
          <li v-for="(shop, idx) in yesterdayShopRank_Pets" :key="idx">
            <span class="rank-index">{{ idx + 1 }}.</span>
            <span class="rank-shopname">
              <Poptip trigger="hover" :title="shop.shop" @on-popper-show="getRankPoptipContent(shop.shop)" @on-popper-hide="clearRankPoptipContent">
                {{ shop.shop }}
                <div class="rank-shop-recent" slot="content" :ref="'rank-yesterday-poptip-content-' + idx">
                  <div v-if="!rankShopRecentTrades.shop">加载中...</div>
                  <div class="recent" v-if="rankShopRecentTrades.shop">
                    <ul>
                      <li><span class="recent-title">昨日:</span><span class="recent-digit">{{rankShopRecentTrades.day1}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day2}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day3}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day4}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day5}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day6}}</span></li>
                    </ul>
                  </div>
                  <div class="recent-chart" id="rankShopRecentChart" v-if="rankShopRecentTrades.shop"></div>
                </div>
              </Poptip>
            </span>
            <span class="rank-group">{{ shop.group }}</span>
            <span class="rank-tradecount">
              {{shop.tradeCount}}
            </span>
            <span class="rank-shift">
              <span v-if="shop.yesterdayRank==='300+'" class="font-green">↑300+</span>
              <span v-else-if="shop.yesterdayRank > shop.rank" class="font-green">↑{{shop.yesterdayRank - shop.rank}}</span>
              <span v-else-if="shop.rank > shop.yesterdayRank" class="font-red">↓{{shop.rank - shop.yesterdayRank}}</span>
              <span v-else>--</span>
            </span>
          </li>
        </ul>
      </Card>
      <Card class="daybeforeyesterday">
        <p slot="title">
          <Icon type="podium"></Icon>
          【宠物】前天店铺订单排行
        </p>
        <ul>
          <li>
            <span class="rank-index"></span>
            <span class="rank-shopname">店铺</span>
            <span class="rank-group"><b>店群</b></span>
            <span class="rank-tradecount">
              订单数
            </span>
            <span class="rank-shift">
              对比
            </span>
          </li>
          <li v-for="(shop, idx) in daybeforeyesterdayShopRank_Pets" :key="idx">
            <span class="rank-index">{{ idx + 1 }}.</span>
            <span class="rank-shopname">
              <Poptip trigger="hover" :title="shop.shop" @on-popper-show="getRankPoptipContent(shop.shop)" @on-popper-hide="clearRankPoptipContent">
                {{ shop.shop }}
                <div class="rank-shop-recent" slot="content" :ref="'rank-daybeforeyesterday-poptip-content-' + idx">
                  <div v-if="!rankShopRecentTrades.shop">加载中...</div>
                  <div class="recent" v-if="rankShopRecentTrades.shop">
                    <ul>
                      <li><span class="recent-title">昨日:</span><span class="recent-digit">{{rankShopRecentTrades.day1}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*2)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day2}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*3)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day3}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*4)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day4}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*5)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day5}}</span></li>
                      <li><span class="recent-title">{{new Date(new Date().setUTCHours(-24*6)).Format('MM-dd')}}:</span><span class="recent-digit">{{rankShopRecentTrades.day6}}</span></li>
                    </ul>
                  </div>
                  <div class="recent-chart" id="rankShopRecentChart" v-if="rankShopRecentTrades.shop"></div>
                </div>
              </Poptip>
            </span>
            <span class="rank-group">{{ shop.group }}</span>
            <span class="rank-tradecount">
              {{shop.tradeCount}}
            </span>
            <span class="rank-shift">
              <span v-if="shop.yesterdayRank==='300+'" class="font-green">↑300+</span>
              <span v-else-if="shop.yesterdayRank > shop.rank" class="font-green">↑{{shop.yesterdayRank - shop.rank}}</span>
              <span v-else-if="shop.rank > shop.yesterdayRank" class="font-red">↓{{shop.rank - shop.yesterdayRank}}</span>
              <span v-else>--</span>
            </span>
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'stat-today',
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'zztAuth',
        apiAction: 'Login',
        apiQuery: {}
      },
      apiData: null,
      colorSelections: ['#f2b98e', '#56bced', '#f4afcb', '#5fb985', '#e27719', '#0193de', '#dd1e6c', '#2ac56a'],
      filterShop: null,
      buyers: [],
      today: {
        today_assigned: 0,
        today_finished: 0,
        today_ordered: 0,
        today_failed: 0,
        today_dismissed: 0,
        total_assigned: 0,
        total_finished: 0,
        total_ordered: 0,
        total_failed: 0,
        total_dismissed: 0,
        monthly_assigned: 0,
        monthly_finished: 0,
        monthly_ordered: 0,
        monthly_failed: 0,
        monthly_dismissed: 0
      },
      finishedTrades: null,
      todayProfit: 0,
      todayShopTrades: [],
      recentShopTrades: {
        day1: {
          total: 0,
          shops: []
        },
        day2: {
          total: 0,
          shops: []
        },
        day3: {
          total: 0,
          shops: []
        },
        day4: {
          total: 0,
          shops: []
        },
        day5: {
          total: 0,
          shops: []
        },
        day6: {
          total: 0,
          shops: []
        }
      },
      todayShopRank: [],
      yesterdayShopRank: [],
      daybeforeyesterdayShopRank: [],
      todayShopRank_Pets: [],
      yesterdayShopRank_Pets: [],
      daybeforeyesterdayShopRank_Pets: [],
      rankShopRecentTrades: {
        shop: '',
        day1: 0,
        day2: 0,
        day3: 0,
        day4: 0,
        day5: 0,
        day6: 0
      },
      rankShopTags: [],
      shopTagDic: ['男装', '女装', '男鞋', '女鞋', '内衣', '童装', '童鞋', '收纳整理', '宠物', '餐饮具', '家居饰品', '流行饰品', '家具', '园艺', '成人', '车品', '3C'],
      shopTagInOp: '' // 当前操作中的tag(增删改)
    }
  },
  mounted () {
    this.colorSelections.sort(randomSort) // 随机排序颜色
    this.entrance()
    // this.calcTodayProfit('today')
    // this.calcTodayProfit('monthly')
    // this.calcTodayProfit('total')
  },
  computed: {
    todayShopTradeTotal: function () {
      let total = 0
      this.todayShopTrades.forEach((item) => {
        total += item.tradeCount
      })
      return total
    }
  },
  methods: {
    async entrance () {
      if (!this.$store.getters.user.role) {
        this.$emit('on-checkauth', this.$route.path)
        setTimeout(() => {
          this.entrance()
        }, 2000)
      } else if (this.$store.getters.user.role === 'service') { // 售后
      } else if (this.$store.getters.user.role === 'employee') { // 买手
        this.getTodayBuyerStatistics(this.$store.getters.user.userid)
      } else {
        this.getTodayStatistics()
        await this.getTodayShopTrades().then(async () => {
          if (this.$store.getters.user.role === 'god') {
            await this.getRecentShopTrades().then(() => {
              // for (let i = 0; i < this.todayShopTrades.length; i++) {
              //   this.drawRecentShopTradesChart(i)
              // }
            })
            await this.getDateShopTradesRank().then((list) => {
              this.todayShopRank = list.sort((a, b) => {
                return b.tradeCount - a.tradeCount
              })
            })
            await this.getDateShopTradesRank(new Date(new Date().setUTCHours(-24 * 1)).toISOString()).then((list) => {
              this.yesterdayShopRank = list.sort((a, b) => {
                return b.tradeCount - a.tradeCount
              })
            })
            await this.getDateShopTradesRank(new Date(new Date().setUTCHours(-24 * 2)).toISOString()).then((list) => {
              this.daybeforeyesterdayShopRank = list.sort((a, b) => {
                return b.tradeCount - a.tradeCount
              })
            })
            await this.getDateShopTradesRank(new Date().toISOString(), ['宠物']).then((list) => {
              this.todayShopRank_Pets = list.sort((a, b) => {
                return b.tradeCount - a.tradeCount
              })
            })
            await this.getDateShopTradesRank(new Date(new Date().setUTCHours(-24 * 1)).toISOString(), ['宠物']).then((list) => {
              this.yesterdayShopRank_Pets = list.sort((a, b) => {
                return b.tradeCount - a.tradeCount
              })
            })
            await this.getDateShopTradesRank(new Date(new Date().setUTCHours(-24 * 2)).toISOString(), ['宠物']).then((list) => {
              this.daybeforeyesterdayShopRank_Pets = list.sort((a, b) => {
                return b.tradeCount - a.tradeCount
              })
            })
          }
        })
      }
    },
    async getBuyers () {
      this.loading = true
      this.apiItem = {
        apiHost: '',
        apiService: 'buyers',
        apiAction: 'listall',
        apiQuery: {}
      }
      this.apiData = {}
      if (this.filterShop) {
        this.apiData.filterShop = this.filterShop
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('买手列表获取失败！(' + respBody.message + ')')
            reject(new Error('买手列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.buyers = respBody.data
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async getTodayStatistics () {
      this.today = {
        today_assigned: 0,
        today_finished: 0,
        today_ordered: 0,
        today_failed: 0,
        today_dismissed: 0,
        total_assigned: 0,
        total_finished: 0,
        total_ordered: 0,
        total_failed: 0,
        total_dismissed: 0,
        monthly_assigned: 0,
        monthly_finished: 0,
        monthly_ordered: 0,
        monthly_failed: 0,
        monthly_dismissed: 0
      }
      await this.getBuyers().then((buyers) => {
        buyers.forEach(buyer => {
          this.today.today_assigned += buyer.today_assigned ? buyer.today_assigned : 0
          this.today.today_finished += buyer.today_finished ? buyer.today_finished : 0
          this.today.today_ordered += buyer.today_ordered ? buyer.today_ordered : 0
          this.today.today_failed += buyer.today_failed ? buyer.today_failed : 0
          this.today.today_dismissed += buyer.today_dismissed ? buyer.today_dismissed : 0
          this.today.total_assigned += buyer.total_assigned ? buyer.total_assigned : 0
          this.today.total_finished += buyer.total_finished ? buyer.total_finished : 0
          this.today.total_ordered += buyer.total_ordered ? buyer.total_ordered : 0
          this.today.total_failed += buyer.total_failed ? buyer.total_failed : 0
          this.today.total_dismissed += buyer.total_dismissed ? buyer.total_dismissed : 0
          this.today.monthly_assigned += buyer.monthly_assigned ? buyer.monthly_assigned : 0
          this.today.monthly_finished += buyer.monthly_finished ? buyer.monthly_finished : 0
          this.today.monthly_ordered += buyer.monthly_ordered ? buyer.monthly_ordered : 0
          this.today.monthly_failed += buyer.monthly_failed ? buyer.monthly_failed : 0
          this.today.monthly_dismissed += buyer.monthly_dismissed ? buyer.monthly_dismissed : 0
        })
      })
    },
    getTodayBuyerStatistics (userid) {
      this.today = {
        today_assigned: 0,
        today_finished: 0,
        today_ordered: 0,
        today_failed: 0,
        today_dismissed: 0,
        total_assigned: 0,
        total_finished: 0,
        total_ordered: 0,
        total_failed: 0,
        total_dismissed: 0,
        monthly_assigned: 0,
        monthly_finished: 0,
        monthly_ordered: 0,
        monthly_failed: 0,
        monthly_dismissed: 0
      }
      this.apiItem = {
        apiHost: '',
        apiService: 'buyers',
        apiAction: 'getbyuserid',
        apiQuery: {}
      }
      this.apiData = {
        userid: userid
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.$http.post(apiUrl, this.apiData).then(res => {
        if (res.data.status === 'ok') {
          res.data.data.forEach(buyer => {
            this.today.today_assigned += buyer.today_assigned ? buyer.today_assigned : 0
            this.today.today_finished += buyer.today_finished ? buyer.today_finished : 0
            this.today.today_ordered += buyer.today_ordered ? buyer.today_ordered : 0
            this.today.today_failed += buyer.today_failed ? buyer.today_failed : 0
            this.today.today_dismissed += buyer.today_dismissed ? buyer.today_dismissed : 0
            this.today.total_assigned += buyer.total_assigned ? buyer.total_assigned : 0
            this.today.total_finished += buyer.total_finished ? buyer.total_finished : 0
            this.today.total_ordered += buyer.total_ordered ? buyer.total_ordered : 0
            this.today.total_failed += buyer.total_failed ? buyer.total_failed : 0
            this.today.total_dismissed += buyer.total_dismissed ? buyer.total_dismissed : 0
            this.today.monthly_assigned += buyer.monthly_assigned ? buyer.monthly_assigned : 0
            this.today.monthly_finished += buyer.monthly_finished ? buyer.monthly_finished : 0
            this.today.monthly_ordered += buyer.monthly_ordered ? buyer.monthly_ordered : 0
            this.today.monthly_failed += buyer.monthly_failed ? buyer.monthly_failed : 0
            this.today.monthly_dismissed += buyer.monthly_dismissed ? buyer.monthly_dismissed : 0
          })
        } else {
          this.$Message.error('获取统计信息失败！(' + res.data.message + ')')
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('获取统计信息失败,请重试。')
      })
    },
    getFinishedTrades (timespan) {
      this.loading = true
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'listfinished',
        apiQuery: {}
      }
      this.apiData = {
        timespan: timespan
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('订单列表获取失败！(' + respBody.message + ')')
            reject(new Error('订单列表获取失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            this.finishedTrades = respBody.data
            // console.log(respBody.data)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async calcTodayProfit (timespan) {
      await this.getFinishedTrades(timespan).then((trades) => {
        // console.log(trades)
        this.todayProfit = (trades.tradePaymentTotal - trades.orderPaymentTotal).toFixed(2)
        console.log('[' + timespan + '] income: ' + trades.tradePaymentTotal.toFixed(2) + ' | expenditure: ' + trades.orderPaymentTotal.toFixed(2) + ' | gross: ' + (trades.tradePaymentTotal - trades.orderPaymentTotal).toFixed(2))
      })
    },
    getTodayShopTrades () {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'gettodayshoptrades',
          apiQuery: {}
        }
        this.apiData = {
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.$Message.error('今日店铺订单获取失败！(' + respBody.message + ')')
            reject(new Error(respBody.message))
          } else {
            // this.$Message.success('列表载入成功!')
            this.todayShopTrades = respBody.data.sort((a, b) => {
              return b.tradeCount - a.tradeCount
            })
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(this.todayShopTradeTotal)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async getRankPoptipContent (shop) {
      this.rankShopTags = []
      return new Promise(async (resolve, reject) => {
        this.rankShopRecentTrades = {
          shop: '',
          day1: 0,
          day2: 0,
          day3: 0,
          day4: 0,
          day5: 0,
          day6: 0
        }
        this.getShopTags(shop).then(tags => {
          this.rankShopTags = tags
        })
        let date = new Date()
        for (let i = 1; i <= 6; i++) {
          let curDate = new Date(date).setUTCHours(-24 * i)
          await this.getDateShopTrades(curDate, [shop]).then(list => {
            if (list.length) {
              let shopData = list[0]
              this.rankShopRecentTrades['day' + i] = shopData.tradeCount
            } else {
              this.rankShopRecentTrades['day' + i] = 0
            }
          })
          if (i === 6) {
            this.rankShopRecentTrades.shop = shop
            this.$nextTick(() => {
              // this.drawRankShopRecentTradesChart()
              resolve()
            })
          }
        }
      })
    },
    clearRankPoptipContent () {
      this.rankShopRecentTrades = {
        shop: '',
        day1: 0,
        day2: 0,
        day3: 0,
        day4: 0,
        day5: 0,
        day6: 0
      }
    },
    /**
     * 获取最近7天店铺订单统计数据
     */
    async getRecentShopTrades () {
      return new Promise(async (resolve, reject) => {
        this.recentShopTrades = {
          day1: {
            total: 0,
            shops: []
          },
          day2: {
            total: 0,
            shops: []
          },
          day3: {
            total: 0,
            shops: []
          },
          day4: {
            total: 0,
            shops: []
          },
          day5: {
            total: 0,
            shops: []
          },
          day6: {
            total: 0,
            shops: []
          }
        }
        let date = new Date()
        for (let i = 1; i <= 6; i++) {
          let curDate = new Date(date).setUTCHours(-24 * i)
          await this.getDateShopTrades(curDate).then(list => {
            list.forEach((item) => {
              this.recentShopTrades['day' + i].total += item.tradeCount
              this.recentShopTrades['day' + i].shops.push(item)
            })
          })
          if (i === 6) {
            resolve()
          }
        }
      })
    },
    getDateShopTrades (date, shops) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'getdateshoptrades',
          apiQuery: {}
        }
        this.apiData = {
          date: date || new Date().toUTCString()
        }
        if (shops && shops instanceof Array && shops.length) {
          this.apiData.shops = shops
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error(respBody.message))
            // this.$Message.error('今日店铺订单获取失败！(' + respBody.message + ')')
          } else {
            // this.$Message.success('列表载入成功!')
            resolve(respBody.data)
            this.$store.dispatch('setAPILastResponse', respBody)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDateShopTradesRank (date, tags) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'getdateshoptradesrank',
          apiQuery: {}
        }
        this.apiData = {
          date: date || new Date().toUTCString()
        }
        if (tags && tags instanceof Array && tags.length) {
          this.apiData.tags = tags
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error(respBody.message))
            // this.$Message.error('今日店铺订单获取失败！(' + respBody.message + ')')
          } else {
            // this.$Message.success('列表载入成功!')
            resolve(respBody.data)
            this.$store.dispatch('setAPILastResponse', respBody)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    toggleRecentShopChart (index) {
      let target = document.getElementById('recentShopTable-' + index)
      let height = window.getComputedStyle(target, null).height
      console.log(height)
      if (height === '16px') {
        target.style.top = '0px'
      } else {
        target.style.top = height
      }
    },
    drawRecentShopTradesChart (index) {
      let shop = this.todayShopTrades[index].shop
      let xAxisData = [
        new Date(new Date().setUTCHours(-24 * 6)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 5)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 4)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 3)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 2)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 1)).Format('MM-dd')
      ]
      let seriesData = [
        this.recentShopTrades.day6.shops.filter((item) => { return item.shop === shop })[0] ? this.recentShopTrades.day6.shops.filter((item) => { return item.shop === shop })[0].tradeCount : 0,
        this.recentShopTrades.day5.shops.filter((item) => { return item.shop === shop })[0] ? this.recentShopTrades.day5.shops.filter((item) => { return item.shop === shop })[0].tradeCount : 0,
        this.recentShopTrades.day4.shops.filter((item) => { return item.shop === shop })[0] ? this.recentShopTrades.day4.shops.filter((item) => { return item.shop === shop })[0].tradeCount : 0,
        this.recentShopTrades.day3.shops.filter((item) => { return item.shop === shop })[0] ? this.recentShopTrades.day3.shops.filter((item) => { return item.shop === shop })[0].tradeCount : 0,
        this.recentShopTrades.day2.shops.filter((item) => { return item.shop === shop })[0] ? this.recentShopTrades.day2.shops.filter((item) => { return item.shop === shop })[0].tradeCount : 0,
        this.recentShopTrades.day1.shops.filter((item) => { return item.shop === shop })[0] ? this.recentShopTrades.day1.shops.filter((item) => { return item.shop === shop })[0].tradeCount : 0
      ]
      var myChart = echarts.getInstanceByDom(document.getElementById('recentShopChart-' + index))
      if (!myChart) {
        myChart = echarts.init(document.getElementById('recentShopChart-' + index))
      }
      // 绘制图表
      myChart.setOption({
        color: ['#fddc3c'],
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          show: false
        },
        title: {
          show: false
        },
        legend: {
          show: false
        },
        grid: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 20
        },
        series: [{
          data: seriesData,
          type: 'line',
          smooth: true
        }]
      })
    },
    drawRankShopRecentTradesChart () {
      let xAxisData = [
        new Date(new Date().setUTCHours(-24 * 6)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 5)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 4)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 3)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 2)).Format('MM-dd'),
        new Date(new Date().setUTCHours(-24 * 1)).Format('MM-dd')
      ]
      let seriesData = [
        this.rankShopRecentTrades.day6,
        this.rankShopRecentTrades.day5,
        this.rankShopRecentTrades.day4,
        this.rankShopRecentTrades.day3,
        this.rankShopRecentTrades.day2,
        this.rankShopRecentTrades.day1
      ]
      var myChart = echarts.getInstanceByDom(document.getElementById('rankShopRecentChart'))
      if (!myChart) {
        myChart = echarts.init(document.getElementById('rankShopRecentChart'))
      }
      // 绘制图表
      myChart.setOption({
        color: ['#fddc3c'],
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          show: false
        },
        title: {
          show: false
        },
        legend: {
          show: false
        },
        grid: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 20
        },
        series: [{
          data: seriesData,
          type: 'line',
          smooth: true
        }]
      })
    },
    getShopTags (shop) {
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'shops',
          apiAction: 'listshoptagsbyname',
          apiQuery: {}
        }
        this.apiData = {
          name: shop
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error(respBody.message))
            // this.$Message.error('今日店铺订单获取失败！(' + respBody.message + ')')
          } else {
            // this.$Message.success('列表载入成功!')
            resolve(respBody.data)
            this.$store.dispatch('setAPILastResponse', respBody)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    editShopTags (shop) {
      this.$Modal.confirm({
        title: '店铺标签',
        render: (h) => {
          let tags = []
          if (this.rankShopTags instanceof Array) {
            this.rankShopTags.forEach((tag) => {
              tags.push(h('Tag', {
                props: {
                  type: 'border',
                  closable: true,
                  color: 'green'
                }
              }, tag))
            })
          }
          return h('div', {}, [
            h('div', {}, '店铺名称：' + shop), // <Tag type="border" closable color="green" v-for="(tag, idx) in rankShopTags" :key="idx">{{tag}}</Tag>
            tags
          ])
        },
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.addShopSpecTagsDic(this.shopTagInOp).then(() => {
              this.shopTagDic.push(this.shopTagInOp)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    addNewTagSpec () {
      this.$Modal.confirm({
        title: '新增标签',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.shopTagInOp,
              autofocus: true,
              placeholder: '分类标签名称'
            },
            on: {
              input: (val) => {
                this.shopTagInOp = val
              }
            }
          })
        },
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.addShopSpecTagsDic(this.shopTagInOp).then(() => {
              this.shopTagDic.push(this.shopTagInOp)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    editTagSpec (tag) {
      this.shopTagInOp = tag
      this.$Modal.confirm({
        title: '修改标签',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.shopTagInOp,
              autofocus: true,
              placeholder: '分类标签名称'
            },
            on: {
              input: (val) => {
                this.shopTagInOp = val
              }
            }
          })
        },
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.editShopSpecTagsDic(tag, this.shopTagInOp).then(() => {
              this.shopTagDic.splice(this.shopTagDic.indexOf(tag), 1)
              this.shopTagDic.push(this.shopTagInOp)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    deleteTagSpec (tag) {
      this.shopTagInOp = tag
      this.$Modal.confirm({
        title: '删除标签',
        content: '确认删除标签\'' + tag + '\'么?',
        onOk: () => {
          if (!this.shopTagInOp) {
            this.$Message.error('分类标签不能为空')
          } else {
            this.deleteShopSpecTagsDic(tag).then(() => {
              this.shopTagDic.splice(this.shopTagDic.indexOf(tag), 1)
              this.shopTagInOp = ''
            }).catch((err) => {
              this.$Message.error(err.message)
            })
          }
        },
        onCancel: () => {
          this.shopTagInOp = ''
        }
      })
    },
    async getShopSpecTagsDic () {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'listshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async addShopSpecTagsDic (tag) {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'addshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
        tag: tag
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async editShopSpecTagsDic (tag, tagNew) {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'editshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
        tag: tag,
        tag_new: tagNew
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async deleteShopSpecTagsDic (tag) {
      this.apiItem = {
        apiHost: '',
        apiService: 'groups',
        apiAction: 'deleteshoptagdic',
        apiQuery: {}
      }
      this.apiData = {
        tag: tag
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            // this.$Message.error('授权信息获取失败！(' + respBody.message + ')')
            reject(new Error('失败！(' + respBody.message + ')'))
          } else {
            // this.$Message.success('列表载入成功!')
            this.$store.dispatch('setAPILastResponse', respBody)
            resolve(respBody.data)
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    }
  }
}
function randomSort (a, b) {
  return Math.random() > 0.5 ? -1 : 1
}
</script>

<style lang="less" scoped>
ul {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  li {
    font-size: 20px;
    position: relative;
    color: #fff;
    display: inline-block;
    position: relative;
    min-height: 90px;
    padding: 10px;
    background:cadetblue;
    width: 19%;
    .title {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 18px;
      font-weight: 300;
    }
    .num {
      position: absolute;
      bottom: 10px;
      right: 20px;
      font-size: 36px;
      font-weight: 800;
    }
  }
  &.shop-ul {
    flex-wrap: wrap;
    li {
      margin-bottom: 10px;
      background: #fff;
      border: 2px dotted cadetblue;
      color: cadetblue;
    }
  }
}
.today-shop-trades {
  margin-top: 50px;
  .today-trade-total {
    font-size: 20px;
    position: relative;
    color: #fff;
    display: inline-block;
    position: relative;
    min-height: 90px;
    padding: 10px;
    background:cadetblue;
    width: 100%;
    .title {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 18px;
      font-weight: 300;
    }
    .num {
      position: absolute;
      bottom: 10px;
      right: 20px;
      font-size: 36px;
      font-weight: 800;
    }
  }
  .shop-ul {
    & > li {
      overflow: hidden;
      .num-yesterday {
        position: absolute;
        bottom: 5px;
        font-size: 14px;
        color: #999;
      }
      .recent {
        display: none;
        position: absolute;
        top: 0;
        bottom:0;
        left: 0;
        right: 0;
        padding: 8px;
        overflow: hidden;
        transition: all .3s linear;
        ul {
          display: flex;
          margin: 0;
          flex-wrap: wrap;
          justify-content: flex-start;
          li {
            display: inline-flex;
            flex-basis: 50%;
            border: none;
            font-size: 12px !important;
            line-height: 16px !important;
            color: #fff;
            background: none;
            min-height: initial;
            padding: 0;
            margin: 0 !important;
            padding-right: 5px;
            justify-content: space-between;
            .recent-digit {
              font-weight: bold;
            }
          }
        }
      }
      .recent-chart {
        display: none;
        position: absolute;
        top: 0;
        bottom:0;
        left: 0;
        right: 0;
        overflow: hidden;
        transition: all .3s linear;
      }
      .recent-table-visibility {
        display: none;
        position: absolute;
        top: 3px;
        right: 3px;
        z-index: 101;
        color: #e2e2e2;
      }
      &:hover {
        .num {
          display: none;
        }
        .num-yesterday {
          display: none;
        }
        .recent {
          display: block;
          // position: absolute;
          // top: 80px;
          background: rgba(0, 0, 0, .3);
          z-index: 100;
        }
        .recent-chart {
          display: block;
          background:cornflowerblue;
          z-index: 99;
        }
        .recent-table-visibility {
          display: block;
          &:hover {
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.shop-ranks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  .today {
    flex-basis: 33%;
    // margin: 10px 5px;
  }
  .yesterday {
    flex-basis: 33%;
    // margin: 10px 5px;
  }
  .daybeforeyesterday {
    flex-basis: 33%;
    // margin: 10px 5px;
  }
  ul {
    margin: 0;
    padding: 0;
    display: block;
    & > li {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      padding: 5px;
      width: 100%;
      background: initial;
      min-height: initial;
      color: #000;
      .rank-index {
        width: 18px;
        text-align: right;
        margin-right: 10px;
      }
      .rank-shopname {
        flex: 1;
        font-weight: bold;
      }
      .rank-group {
        width: 40px;
        text-align: center;
      }
      .rank-tradecount {
        width: 60px;
        text-align: right;
        font-weight: bold;
      }
      .rank-shift {
        width: 50px;
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>
