<template>
  <div class="update">
    <Button type="success" :disabled="begin" @click="start">开始</Button>
    <Button type="error" :disabled="!begin" @click="stop">停止</Button>
    lastId:<Input v-model="lastId"></Input>
    pageSize:<Input v-model="pageSize"></Input>
    page:<Input v-model="pageIdx"></Input>
    query:<Input v-model="query"></Input>
    <Input v-model="result" type="textarea" :autosize="{minRows: 8}"></Input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      begin: false,
      result: '',
      curPage: 1,
      pageSize: 1000,
      pageIdx: 1,
      lastId: '',
      query: ''
    }
  },
  methods: {
    async start () {
      this.begin = true
      await this.startProc()
    },
    stop () {
      this.begin = false
    },
    async startProc () {
      if (this.begin) {
        await this.update(this.curPage).then(() => {
          // this.curPage++
          this.pageIdx++
          this.curPage = 1
          return this.startProc()
        }).catch((err) => {
          this.begin = false
          console.log(err)
        })
      }
    },
    update (page) {
      this.result += `第${this.pageIdx}页，开始...`
      return new Promise((resolve, reject) => {
        this.apiItem = {
          apiHost: '',
          apiService: 'sys',
          apiAction: 'syncstatbatch', // syncstatbulk,syncstatbatch
          apiQuery: {}
        }
        this.apiData = {
          page: page,
          pagesize: this.pageSize,
          last_id: this.lastId,
          query: this.query ? JSON.parse(this.query) : {}
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(res => {
          if (res.data.status === 'ok') {
            this.result += `【成功】总量${res.data.data.total_count}，成功${res.data.data.suc_count}，失败${res.data.data.err_count}\r\n`
            this.lastId = res.data.data.last_id
            resolve()
          } else {
            this.result += `【失败】原因${res.data.message}\r\n`
            reject(new Error(res.data.message))
          }
        }).catch(err => {
          this.result += `【失败】原因${err.message}\r\n`
          reject(err)
        })
      })
    }
  }
}
</script>
