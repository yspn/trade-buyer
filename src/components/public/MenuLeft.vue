<template>
  <Menu active-name="1-1" accordion theme="light" width="auto" :open-names="['1']" class="menu-left" @on-select="selectMenu">
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-analytics"></Icon>
        数据统计
      </template>
      <MenuItem name="1-1">我的数据</MenuItem>
      <MenuItem name="1-2" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">监控中心</MenuItem>
      <MenuItem name="1-3" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">利润报表</MenuItem>
      <MenuItem name="1-4" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">盈亏分析</MenuItem>
      <MenuItem name="1-5" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">买手报表</MenuItem>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="ios-keypad"></Icon>
        我的订单
      </template>
      <MenuItem name="2-1">全部订单</MenuItem>
      <MenuItem name="2-6" v-if="['service'].indexOf($store.getters.user.role) < 0 && $store.getters.user.role==='boss'">未分配</MenuItem>
      <MenuItem name="2-2" v-if="['service'].indexOf($store.getters.user.role) < 0">已分配</MenuItem>
      <MenuItem name="2-3" v-if="['service'].indexOf($store.getters.user.role) < 0">已下单</MenuItem>
      <MenuItem name="2-4" v-if="['service'].indexOf($store.getters.user.role) < 0">已完成</MenuItem>
      <MenuItem name="2-5" v-if="['service'].indexOf($store.getters.user.role) < 0">已退单</MenuItem>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon type="ios-navigate"></Icon>
        系统设置
      </template>
      <MenuItem name="3-1">个人设置</MenuItem>
      <MenuItem name="3-3" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">买手设置</MenuItem>
      <MenuItem name="3-5" v-if="['god', 'boss'].indexOf($store.getters.user.role) > -1">店铺设置</MenuItem>
      <MenuItem name="3-6" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">店铺黑名单</MenuItem>
      <MenuItem name="3-7" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">历史下单管理</MenuItem>
      <MenuItem name="3-8" v-if="['god', 'boss', 'manager'].indexOf($store.getters.user.role) > -1">代发商品</MenuItem>
      <MenuItem name="3-4" v-if="['god', 'boss'].indexOf($store.getters.user.role) > -1">导入订单</MenuItem>
      <MenuItem name="3-2">退出登陆</MenuItem>
    </Submenu>
  </Menu>
</template>

<script>
export default {
  name: 'menu-left',
  data () {
    return {
    }
  },
  methods: {
    selectMenu (name) {
      let path = '/'
      switch (name) {
        case '1-1':
          path = '/today'
          break
        case '1-2':
          path = '/monitor'
          break
        case '1-3':
          path = '/reports/profit'
          break
        case '1-4':
          path = '/reports/lossanalysis'
          break
        case '1-5':
          path = '/reports/buyerreport'
          break
        case '2-1':
          path = '/trades'
          break
        case '2-2':
          path = '/trades/query/ASSIGNED'
          break
        case '2-3':
          path = '/trades/query/ORDEREDALL'
          break
        case '2-4':
          path = '/trades/query/FINISHEDALL'
          break
        case '2-5':
          path = '/trades/query/RESIGNED'
          break
        case '2-6':
          path = '/trades/query/UNASSIGNED'
          break
        case '3-1':
          path = '/buyer-settings'
          break
        case '3-2':
          path = '/logout'
          break
        case '3-3':
          path = '/buyers'
          break
        case '3-4':
          path = '/trades/import'
          break
        case '3-5':
          path = '/shops'
          break
        case '3-6':
          path = '/blacklistshops'
          break
        case '3-7':
          path = '/boughthistory'
          break
        case '3-8':
          path = '/daifa'
          break
      }
      this.$router.push({path: path})
    }
  }
}
</script>

<style lang="less" scoped>

</style>
