<template>
  <Layout class="login-main">
    <Content>
      <Spin size="large"></Spin>
    </Content>
  </Layout>
</template>

<script>
import {
  getQueryString, getYchAtiCookie
} from '../../static/common'
export default {
  name: 'login-main',
  data () {
    return {
      apiItem: {
        apiHost: '',
        apiService: 'zztAuth',
        apiAction: 'Login',
        apiQuery: {}
      },
      apiData: null,
      loginInCode: ''
    }
  },
  watch: {
    loginInCode: function (val) {
      if (val) {
        this.auth(val)
      }
    }
  },
  mounted () {
    this.loginInCode = getQueryString('code')
  },
  methods: {
    auth (code) {
      if (code) {
        this.apiItem = {
          apiHost: '',
          apiService: 'users',
          apiAction: 'auth', // this.$store.getters.token
          apiQuery: {}
        }
        this.apiData = {
          code: code,
          ati: getYchAtiCookie(),
          url: window.location.href
        }
        this.$store.dispatch('setAPIStore', this.apiItem)
        var apiUrl = this.$store.getters.apiUrl
        this.$http.post(apiUrl, this.apiData).then(res => {
          console.log(res)
          if (res.data.status === 'ok') {
            this.$Message.success('登陆成功！')
            this.$store.dispatch('setUserStore', res.data.data)
            if (this.$store.getters.sysIsExtension) {
              // this.$router.push({path: '/'})
              window.location.href = '/controls.html'
              window.chrome.cookies.set({
                url: 'http://192.168.99.1:3000/',
                name: 'tao11_buyer_token',
                value: res.data.data.token
              })
            } else {
              window.location.href = '/'
            }
          } else {
            this.$Message.error('登陆失败！(' + res.data.message + ')')
          }
        }).catch(err => {
          console.log(err)
          this.$Message.error('登陆失败，请重试。')
        })
      } else {
        this.$Message.error('登陆失败，请重试。')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
