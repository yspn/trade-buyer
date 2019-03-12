<template>
  <div class="import-trades">
    <Row :gutter="16">
      <Col span="6">
        <h4>查询历史</h4>
        <ul class="history">
          <li v-for="(his, index) in history" :key="index">[{{new Date(his.timestamp).toLocaleString()}}]{{his.taskTraceId}}</li>
        </ul>
      </Col>
      <Col span="18">
        <Form ref="importForm" :label-width="160">
          <FormItem label="买手淘宝账号">
            <Input v-model="buyers" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入买手淘宝账号，以逗号隔开"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" :disabled="tracing" @click="submit">提交</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'trades-deliver',
  data () {
    return {
      buyers: '',
      history: [],
      tracing: false
    }
  },
  watch: {
  },
  mounted () {
    this.readHistory()
  },
  methods: {
    readHistory () {
      let tasks = window.localStorage.getItem('bulk_deliver_tasks')
      if (tasks) {
        this.history = JSON.parse(tasks).sort((a, b) => {
          return b.timestamp - a.timestamp
        })
      }
    },
    submit () {
      this.tracing = true
      try {
        let buyers = this.buyers.replace(/ /g, '').split(/,|，|\|/)
        this.apiItem = {
          apiHost: '',
          apiService: 'trades',
          apiAction: 'startbulkdeliver',
          apiQuery: {}
        }
        this.apiData = {
          buyers: this.buyers.replace(/ /g, '').split(/,|，|\|/)
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        // var apiUrl = this.$store.getters.apiUrl
        this.history.push({
          taskTraceId: 'f84937298389910dsf23',
          status: 'started',
          buyers: buyers,
          logs: [],
          timestamp: Date.now()
        })
        window.localStorage.setItem('bulk_deliver_tasks', JSON.stringify(this.history))
        this.readHistory()
        // this.$http.post(apiUrl, this.apiData).then(res => {
        //   if (res.data.status === 'ok') {
        //     this.$Modal.success({
        //       title: '提交成功!',
        //       content: res.data.message
        //     })
        //     this.tracing = true
        //   } else {
        //     this.$Modal.error({
        //       title: '提交失败!',
        //       content: res.data.message
        //     })
        //     this.tracing = false
        //   }
        // }).catch(err => {
        //   console.log(err)
        //   this.$Modal.error({
        //     title: '设置失败!',
        //     content: err.message
        //   })
        //   this.tracing = false
        // })
      } catch (err) {
        console.log(err)
        this.$Modal.error({
          title: '设置失败!',
          content: err.message
        })
        this.tracing = false
      }
      // }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
