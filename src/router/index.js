import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import Monitor from '@/components/Monitor'
import LoginAcceptance from '@/components/LoginAcceptance'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import TradeList from '@/components/trades/List'
import TradeImport from '@/components/trades/Import'
import StatisticsToday from '@/components/statistics/Today'
import BuyerSettings from '@/components/settings/BuyerSettings'
import Buyers from '@/components/settings/Buyers'
import Shops from '@/components/settings/Shops'
import Groups from '@/components/settings/Groups'
import Daifa from '@/components/settings/Daifa'
import Users from '@/components/settings/Users'
import BlackListShops from '@/components/settings/BlackListShops'
import BoughtHistoryList from '@/components/settings/BoughtHistory'
import ReportProfit from '@/components/reports/Profits'
import ReportLossAnalysis from '@/components/reports/LossAnalysis'
import BuyerReport from '@/components/reports/BuyerReport'
import Update from '@/components/Update'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/monitor',
          name: 'monitor',
          component: Monitor
        },
        {
          path: '/trades',
          name: 'trade-list',
          component: TradeList
        },
        {
          path: '/trades/query/:status',
          name: 'trade-list',
          component: TradeList
        },
        {
          path: '/today',
          name: 'stat-today',
          component: StatisticsToday
        },
        {
          path: '/buyer-settings',
          name: 'buyer-settings',
          component: BuyerSettings
        },
        {
          path: '/buyers',
          name: 'buyers',
          component: Buyers
        },
        {
          path: '/shops',
          name: 'shops',
          component: Shops
        },
        {
          path: '/groups',
          name: 'groups',
          component: Groups
        },
        {
          path: '/daifa',
          name: 'daifa',
          component: Daifa
        },
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/blacklistshops',
          name: 'blacklist-shops',
          component: BlackListShops
        },
        {
          path: '/boughthistory',
          name: 'bought-history-list',
          component: BoughtHistoryList
        },
        {
          path: '/trades/import',
          name: 'import-trades',
          component: TradeImport
        },
        {
          path: '/reports/profit',
          name: 'report-profit',
          component: ReportProfit
        },
        {
          path: '/reports/lossanalysis',
          name: 'loss-analysis',
          component: ReportLossAnalysis
        },
        {
          path: '/reports/buyerreport',
          name: 'buyer-report',
          component: BuyerReport
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/loggedin',
      name: 'loggedin',
      component: LoginAcceptance
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/update',
      name: 'update',
      component: Update
    }
  ]
})
