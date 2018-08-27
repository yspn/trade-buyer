<template>
  <div class="buyer-settings">
    <Form ref="buyerSettingForm" :model="settings" :label-width="160">
      <FormItem label="上线接单" prop="isEnable">
        <i-switch v-model="settings.isEnable"></i-switch>
      </FormItem>
      <FormItem label="发货跟踪">
        <i-switch v-model="autoTracerSwitch"></i-switch>
      </FormItem>
      <FormItem label="发货检查间隔(min)">
        <Input v-model="autoTracerInterval" style="width: 80px"></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'buyer-settings',
  data () {
    return {
      settings: {
        // 是否接单
        isEnable: true
      },
      succeed: false,
      autoTracerInterval: 10, // 十分钟开始一次物流查询遍历
      autoTracerSwitch: this.$store.getters.user.tracelogisticsEnable
    }
  },
  watch: {
    'settings.isEnable': function (newVal) {
      if (this.succeed) {
        this.setEnable(newVal)
      }
    },
    'autoTracerInterval': function (newVal) {
      this.$emit('on-autotracerinterval', newVal)
    },
    'autoTracerSwitch': function (newVal) {
      this.$emit('on-autotracerswitch', newVal)
    }
  },
  mounted () {
    this.getBuyer()
  },
  methods: {
    async getBuyer () {
      this.apiItem = {
        apiHost: '',
        apiService: 'buyers',
        apiAction: 'getbyuserid',
        apiQuery: {}
      }
      this.apiData = {
        userid: this.$store.getters.user.userid
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.succeed = false
      await this.$http.post(apiUrl, this.apiData).then(res => {
        if (res.data.status === 'ok') {
          let buyer = res.data.data[0]
          this.settings.isEnable = buyer.is_enable
        } else {
          this.$Message.error('获取买手信息失败！(' + res.data.message + ')')
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('获取买手信息失败,请重试。')
      })
      this.succeed = true
    },
    setEnable (val) {
      this.apiItem = {
        apiHost: '',
        apiService: 'buyers',
        apiAction: 'enable',
        apiQuery: {}
      }
      this.apiData = {
        userid: this.$store.getters.user.userid,
        is_enable: val
      }
      this.succeed = true
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.$http.post(apiUrl, this.apiData).then(res => {
        if (res.data.status === 'ok') {
          this.$Modal.success({
            title: '设置成功!',
            content: null
          })
          this.succeed = true
        } else {
          this.$Modal.error({
            title: '设置失败!',
            content: res.data.message
          })
          this.succeed = false
          this.settings.isEnable = !val
        }
      }).catch(err => {
        console.log(err)
        this.$Modal.error({
          title: '设置失败!',
          content: err.message
        })
        this.succeed = false
        this.settings.isEnable = !val
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
