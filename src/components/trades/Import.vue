<template>
  <div class="import-trades">
    <Form ref="importForm" :model="importModel" :label-width="160">
      <FormItem label="导入" prop="jsonFile">
        <Upload :before-upload="processJSONUploadFile" action="#">
          <Button type="ghost" icon="ios-cloud-upload-outline" :disabled="!succeed">导入JSON文件</Button>
        </Upload>
      </FormItem>
      <FormItem label="粘贴JSON内容">
        <Input v-model="importModel.jsonContent" type="textarea" :autosize="{minRows: 8,maxRows: 30}" placeholder="将订单原始JSON数据粘贴在此" :disabled="!succeed"></Input>
        <Button type="text" @click="importModel.jsonContent=''">清空</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" :disabled="!succeed" @click="submitContent">提交</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'import-trades',
  data () {
    return {
      importModel: {
        jsonFile: '',
        jsonContent: ''
      },
      succeed: true
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    processJSONUploadFile (file) {
      this.readFile(file)
      return false
    },
    readFile (file) {
      let reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        let content = reader.result
        this.importModel.jsonContent = content
      }
    },
    submitContent () {
      this.succeed = false
      if (!this.importModel.jsonContent) {
        this.$Modal.error({
          title: '提交失败!',
          content: 'JSON内容不能为空'
        })
        this.succeed = true
        return false
      } else {
        let modelConv = null
        try {
          modelConv = JSON.parse(this.importModel.jsonContent)
          console.log(modelConv)
        } catch (err) {
          this.$Modal.error({
            title: '提交失败!',
            content: '请提交JSON格式内容'
          })
          this.succeed = true
          return false
        }
        // if (!(modelConv instanceof Array) || !modelConv.length) {
        //   this.$Modal.error({
        //     title: '提交失败!',
        //     content: 'JSON不合法，请提交原始淘宝订单列表输出内容格式[trade_fullinfo_get_response:{trade: {...}}]'
        //   })
        //   this.succeed = true
        //   return false
        // } else {
        try {
          this.apiItem = {
            apiHost: '',
            apiService: 'trades',
            apiAction: 'push', // push: tao11.la | update: 手动
            apiQuery: {}
          }
          this.apiData = JSON.parse(this.importModel.jsonContent)
          this.$store.dispatch('setAPIStore', this.apiItem)
          var apiUrl = this.$store.getters.apiUrl
          this.$http.post(apiUrl, this.apiData).then(res => {
            if (res.data.status === 'ok') {
              this.$Modal.success({
                title: '提交成功!',
                content: res.data.message
              })
              this.succeed = true
            } else {
              this.$Modal.error({
                title: '提交失败!',
                content: res.data.message
              })
              this.succeed = true
            }
          }).catch(err => {
            console.log(err)
            this.$Modal.error({
              title: '设置失败!',
              content: err.message
            })
            this.succeed = true
          })
        } catch (err) {
          console.log(err)
          this.$Modal.error({
            title: '设置失败!',
            content: err.message
          })
          this.succeed = true
        }
        // }
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
