<template>
  <div class="trades-deliver">
    <Row :gutter="16" class="fullheight-row">
      <Col span="6" class="left-col">
        <h3>
          查询历史
          <Tooltip class="pull-right">
            <Button type="ghost" shape="circle" icon="plus-round" size="small" @click="newTask"></Button>
            <div slot="content">新查询</div>
          </Tooltip>
        </h3>
        <ul class="history">
          <li v-for="(his, index) in history" :key="index" @click="viewHistory(his)">[{{new Date(his.timestamp).toLocaleString()}}]{{his.buyers.join(',')}}</li>
        </ul>
      </Col>
      <Col span="18">
        <Form ref="importForm" :label-width="160">
          <FormItem label="买手淘宝账号">
            <Input v-model="buyers" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入买手淘宝账号，以“,”“，”或“|”隔开" :disabled="tracing"></Input>
            <Button type="primary" :disabled="tracing" @click="submit">开始</Button>
          </FormItem>
        </Form>
        <div class="trace-results">
          <Tabs type="card" @on-click="switchTab">
            <TabPane label="任务日志" name="tasklogs">
              <ul>
                <li v-for="(log, index) in logs" :key="index">{{log}}</li>
              </ul>
            </TabPane>
            <TabPane label="发货日志" name="detailedlogs">
              <Table stripe :columns="detailedLogsTableCols" :data="detailedLogs"></Table>
            </TabPane>
          </Tabs>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  sleepES6
} from '../../../static/common'

export default {
  name: 'trades-deliver',
  data () {
    return {
      taskTraceId: '',
      buyers: '',
      logs: [], // 发货任务记录
      detailedLogs: [], // 详细发货记录
      history: [],
      tracing: false,
      detailedLogsTableCols: [
        {
          title: '订单编号',
          key: 'tid',
          width: 160,
          sortable: true,
          searchable: true
        },
        {
          title: '下单编号',
          key: 'tb_order_number',
          width: 160,
          sortable: true,
          searchable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          }
        },
        {
          title: '店铺',
          key: 'shop_name',
          width: 160,
          sortable: true,
          searchable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          }
        },
        {
          title: '买家号',
          key: 'buyer_nick',
          width: 160,
          sortable: true,
          searchable: true,
          sortMethod: (a, b, type) => {
            if (type === 'asc') {
              return a.localeCompare(b, 'zh-CN')
            } else {
              return b.localeCompare(a, 'zh-CN')
            }
          }
        },
        {
          title: '状态',
          key: 'status',
          width: 90,
          ellipsis: true,
          filters: [
            {
              label: '成功',
              value: 'success'
            },
            {
              label: '失败',
              value: 'failed'
            }
          ],
          filterMultiple: false,
          filterMethod (value, row) {
            if (value === 'success') {
              return row.status === 'success'
            } else if (value === 'failed') {
              return row.status === 'failed'
            }
          },
          render: (h, params) => {
            return h('Tag', {
              props: {
                // type: 'dot',
                color: params.row.status === 'success' ? 'green' : 'red'
              }
            }, params.row.status === 'success' ? '成功' : '失败')
          }
        },
        {
          title: '',
          key: 'message',
          render: (h, params) => {
            if (params.row.status === 'success') {
              if (params.row.message instanceof Array) {
                let hArr = []
                params.row.message.forEach((msg) => {
                  let msgBody = ''
                  if (msg.logisNumber) { // 发货信息
                    msgBody = `快递公司：${msg.companyCode} 快递单：${msg.logisNumber}`
                  } else if (msg.actualFee) { // 改价信息
                    msgBody = `改价：${msg.actualFee / 100}`
                  }
                  let outputH = h('div', {
                    attrs: {
                      class: 'detailedlog-message',
                      title: msgBody
                    }
                  }, msgBody)
                  hArr.push(outputH)
                })
                return h('div', {}, hArr)
              } else if (typeof params.row.message === 'object') {
                return h('span', {
                  attrs: {
                    title: JSON.stringify(params.row.message)
                  }
                }, JSON.stringify(params.row.message))
              } else {
                return h('span', {}, params.row.message)
              }
            } else {
              return h('span', {
                attrs: {
                  title: params.row.message
                },
                style: {
                  fontSize: '12px',
                  color: '#999'
                }
              }, params.row.message)
            }
          }
        }
      ]
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
        }).filter((item) => {
          return Date.now() - item.timestamp <= 1000 * 60 * 60 * 24 * 7 // 只读取最近7天的
        })
      }
    },
    viewHistory (his) {
      this.tracing = true
      this.buyers = his.buyers.join(',')
      this.taskTraceId = his.taskTraceId
      this.logs = []
      this.detailedLogs = []
      this.traceTask()
      this.traceLogsTask()
    },
    newTask () {
      this.tracing = false
      this.buyers = ''
    },
    switchTab (name) {
      if (name === 'detailedlogs') {
        this.traceLogsTask()
      }
    },
    // submit () {
    //   if (this.buyers) {
    //     this.logs = []
    //     this.detailedLogs = []
    //     this.tracing = true
    //     try {
    //       let buyers = this.buyers.replace(/ /g, '').split(/,|，|\|/)
    //       this.apiItem = {
    //         apiHost: '',
    //         apiService: 'trades',
    //         apiAction: 'startbulkdeliver',
    //         apiQuery: {}
    //       }
    //       this.apiData = {
    //         buyers: this.buyers.replace(/ /g, '').split(/,|，|\|/)
    //       }
    //       this.$store.dispatch('setAPIStore', this.apiItem)
    //       var apiUrl = this.$store.getters.apiUrl
    //       this.$http.post(apiUrl, this.apiData).then(async (res) => {
    //         if (res.data.status === 'ok') {
    //           this.taskTraceId = res.data.data.taskTraceId
    //           this.$Modal.success({
    //             title: '提交成功!',
    //             content: res.data.data.taskTraceId
    //           })
    //           this.history.push({
    //             taskTraceId: res.data.data.taskTraceId,
    //             status: 'start',
    //             buyers: buyers,
    //             logs: [],
    //             timestamp: Date.now()
    //           })
    //           window.localStorage.setItem('bulk_deliver_tasks', JSON.stringify(this.history))
    //           this.readHistory()
    //           await this.traceTask()
    //         } else {
    //           this.$Modal.error({
    //             title: '提交失败!',
    //             content: res.data.message
    //           })
    //           this.tracing = false
    //         }
    //       }).catch(err => {
    //         console.log(err)
    //         this.$Modal.error({
    //           title: '设置失败!',
    //           content: err.message
    //         })
    //         this.tracing = false
    //       })
    //     } catch (err) {
    //       console.log(err)
    //       this.$Modal.error({
    //         title: '设置失败!',
    //         content: err.message
    //       })
    //       this.tracing = false
    //     }
    //   } else {
    //     this.$Message.error('买家号不能为空')
    //   }
    // },
    submit () {
      if (this.buyers) {
        this.logs = []
        this.detailedLogs = []
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
          var apiUrl = this.$store.getters.apiUrl
          this.$http.post(apiUrl, this.apiData).then(async (res) => {
            if (res.data.status === 'ok') {
              this.taskTraceId = res.data.data.taskTraceId
              this.$Modal.success({
                title: '提交成功!',
                content: res.data.data.taskTraceId
              })
              this.history.push({
                taskTraceId: res.data.data.taskTraceId,
                status: 'start',
                buyers: buyers,
                logs: [],
                timestamp: Date.now()
              })
              window.localStorage.setItem('bulk_deliver_tasks', JSON.stringify(this.history))
              this.readHistory()
              await this.traceTask()
            } else {
              this.$Modal.error({
                title: '提交失败!',
                content: res.data.message
              })
              this.tracing = false
            }
          }).catch(err => {
            console.log(err)
            this.$Modal.error({
              title: '设置失败!',
              content: err.message
            })
            this.tracing = false
          })
        } catch (err) {
          console.log(err)
          this.$Modal.error({
            title: '设置失败!',
            content: err.message
          })
          this.tracing = false
        }
      } else {
        this.$Message.error('买家号不能为空')
      }
    },
    async traceTask () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'bulkdelivertaskcheck',
        apiQuery: {}
      }
      this.apiData = {
        taskid: this.taskTraceId
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            this.tracing = false
            this.$Message.error('追踪请求失败！(' + respBody.message + ')')
            reject(new Error('追踪请求失败！(' + respBody.message + ')'))
          } else {
            this.logs = respBody.data.logs
            // this.traceLogsTask()
            if (respBody.data.status === 'finished') {
              this.$Message.success('发货跟踪完毕')
              // this.taskTraceId = null
              this.tracing = false
              resolve()
            } else {
              await sleepES6(3000)
              return this.traceTask()
            }
          }
        }).catch(err => {
          this.$store.dispatch('setAPILastResponse', err)
          reject(err)
        })
      })
    },
    async traceLogsTask () {
      this.apiItem = {
        apiHost: '',
        apiService: 'trades',
        apiAction: 'bulkdeliverlogcheck',
        apiQuery: {}
      }
      this.apiData = {
        taskid: this.taskTraceId
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      return new Promise(async (resolve, reject) => {
        await this.$http.post(apiUrl, this.apiData).then(async (response) => {
          var respBody = response.data
          if (respBody.status === 'fail') {
            reject(new Error('追踪请求失败！(' + respBody.message + ')'))
          } else {
            this.detailedLogs = respBody.data
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
</script>

<style lang="less" scoped>
.trades-deliver {
  height: 100%;
}
.fullheight-row {
  display: flex;
  height: 100%;
}
.left-col {
  // background: #f4f4f4;
  padding: 5px;
  border-right: 1px solid #efefef;
}
ul.history {
  margin-top: 20px;
  li {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    line-height: 24px;
    padding: 10px;
    transition: all .3s linear;
    &:hover {
      cursor: pointer;
      background: #e4f1ff;
    }
  }
}
.trace-results {
}
</style>
