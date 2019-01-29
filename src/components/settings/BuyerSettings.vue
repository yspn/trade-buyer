<template>
  <div class="buyer-settings">
    <Form ref="buyerSettingForm" :model="settings" :label-width="160">
      <!-- <FormItem label="上线接单" prop="isEnable">
        <i-switch v-model="settings.isEnable"></i-switch>
      </FormItem> -->
      <FormItem label="发货跟踪">
        <i-switch v-model="autoTracerSwitch"></i-switch>
      </FormItem>
      <FormItem label="发货检查间隔(min)">
        <Input v-model="autoTracerInterval" style="width: 80px"></Input>
      </FormItem>
      <FormItem label="下单留言内容" prop="defaultBuyerMessage">
        <Input type="textarea" :rows="3" placeholder="填写下单留言内容" v-model="settings.defaultBuyerMessage"></Input>
        <p class="font-grey">例：买来用作赠礼，请核对好订单信息和商品数量，不要漏发或少发。不要放价格清单、店铺信息进去，谢谢，定会五星好评。</p>
        <Button type="primary" @click="setDefaultBuyerMessage">更新</Button>
      </FormItem>
      <FormItem label="下单备注颜色" prop="defaultMemoFlag">
        <RadioGroup v-model="settings.defaultMemoFlag">
          <Radio :label="0"><span :style="{color:getMemoColor(0)}">灰色</span></Radio>
          <Radio :label="1"><span :style="{color:getMemoColor(1)}">红色</span></Radio>
          <Radio :label="2"><span :style="{color:getMemoColor(2)}">黄色</span></Radio>
          <Radio :label="3"><span :style="{color:getMemoColor(3)}">绿色</span></Radio>
          <Radio :label="4"><span :style="{color:getMemoColor(4)}">蓝色</span></Radio>
          <Radio :label="5"><span :style="{color:getMemoColor(5)}">粉色</span></Radio>
        </RadioGroup>
        <p class="font-grey">设置对买手下单订单进行备注标注的颜色。备注标注的格式为：“买手旺旺：订单编号”</p>
        <Button type="primary" @click="setDefaultMemoFlag">更新</Button>
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
        isEnable: true,
        defaultBuyerMessage: '买来用作赠礼，请核对好订单信息和商品数量，不要漏发或少发。不要放价格清单、店铺信息进去，谢谢，定会五星好评。',
        defaultMemoFlag: 3 // 备注颜色0-5,灰红黄绿蓝粉
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
    this.settings.defaultBuyerMessage = this.$store.getters.defaultBuyerMessage || ''
    this.settings.defaultMemoFlag = this.$store.getters.defaultMemoFlag || 0
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
    },
    setDefaultBuyerMessage () {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'setdefaultbuyermessage',
        apiQuery: {}
      }
      this.apiData = {
        userid: this.$store.getters.user.userid,
        defaultbuyermessage: this.settings.defaultBuyerMessage
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
          this.$store.dispatch('setDefaultBuyerMessage', this.settings.defaultBuyerMessage)
        } else {
          this.$Modal.error({
            title: '设置失败!',
            content: res.data.message
          })
          this.succeed = false
        }
      }).catch(err => {
        console.log(err)
        this.$Modal.error({
          title: '设置失败!',
          content: err.message
        })
        this.succeed = false
      })
    },
    getMemoColor (flag) {
      // 0-5 灰、红、黄、绿、蓝、紫
      switch (flag) {
        case 0:
          return '#666'
        case 1:
          return 'red'
        case 2:
          return 'orange'
        case 3:
          return 'forestgreen'
        case 4:
          return 'blue'
        case 5:
          return 'deeppink'
        default:
          return '#666'
      }
    },
    setDefaultMemoFlag () {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'setdefaultmemoflag',
        apiQuery: {}
      }
      this.apiData = {
        userid: this.$store.getters.user.userid,
        defaultmemoflag: this.settings.defaultMemoFlag
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
          this.$store.dispatch('setDefaultMemoFlag', this.settings.defaultMemoFlag)
        } else {
          this.$Modal.error({
            title: '设置失败!',
            content: res.data.message
          })
          this.succeed = false
        }
      }).catch(err => {
        console.log(err)
        this.$Modal.error({
          title: '设置失败!',
          content: err.message
        })
        this.succeed = false
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
