<template>
  <Layout class="logout-main">
    <Content>
      <Spin size="large"></Spin>
    </Content>
  </Layout>
</template>

<script>
export default {
  name: 'logout-main',
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'zztAuth',
        apiAction: 'Login',
        apiQuery: {}
      },
      apiData: null
    }
  },
  mounted () {
    this.logout()
  },
  methods: {
    logout (code) {
      this.apiItem = {
        apiHost: '',
        apiService: 'users',
        apiAction: 'logout', // this.$store.getters.token
        apiQuery: {}
      }
      this.apiData = {
      }
      this.$store.dispatch('setAPIStore', this.apiItem)
      var apiUrl = this.$store.getters.apiUrl
      this.$http.post(apiUrl, this.apiData).then(res => {
        if (res.data.status === 'ok') {
          this.$Modal.success({
            title: '您已成功登出!',
            content: null
          })
          this.$store.dispatch('setUserStore', res.data.data)
          if (this.$store.getters.sysIsExtension) {
            // this.$router.push({path: '/'})
            window.location.href = '/controls.html'
          } else {
            window.location.href = '/'
          }
        } else {
          this.$Modal.error({
            title: '登出失败!',
            content: res.data.message
          })
          this.$router.back(-1)
        }
      }).catch(err => {
        console.log(err)
        this.$Modal.error({
          title: '登出失败!',
          content: err.message
        })
        this.$router.back(-1)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
