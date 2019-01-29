<template>
  <Layout class="login-main" style="height:100%;">
    <Content class="login-content">
      <div class="login-box">
        <div class="login-title">
          <h2>欢迎使用淘易易订单管理系统</h2>
          <div class="padding-top-10"></div>
          <div class="padding-top-10"></div>
          <h1>系统检测到你还没有登录</h1>
        </div>
        <div class="login-form">
          <div class="padding-top-10"></div>
          <div class="padding-top-10"></div>
          <div class="padding-top-10"></div>
          <div class="padding-top-10"></div>
          <p class="font-grey">点击下方按钮并使用微信登录</p>
          <div class="padding-top-10"></div>
          <div class="padding-top-10"></div>
          <Button type="success" @click="LoginSubmit" long>点击登陆系统</Button>
        </div>
      </div>
    </Content>
  </Layout>
</template>

<script>
// import {
//   focusOrCreateTab
// } from '../../static/common'
export default {
  name: 'login-main',
  data () {
    return {
      appKey: '17'
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    LoginSubmit () {
      let localUrl = window.chrome.extension ? window.chrome.extension.getURL('/') + 'controls.html' : 'http://localhost:8080/'
      var url = window.encodeURIComponent(localUrl + '#/loggedin')
      window.location.href = 'http://login.tao11.la/login.html?redirect_uri=' + url + '&appkey=' + this.appKey
      // if (window.chrome.extension) {
      //   focusOrCreateTab('http://login.tao11.la/login.html?redirect_uri=' + url + '&appkey=' + this.appKey)
      // } else {
      //   window.open('http://login.tao11.la/login.html?redirect_uri=' + url + '&appkey=' + this.appKey, '_blank')
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.login-main {}
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
</style>
