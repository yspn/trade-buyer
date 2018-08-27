<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
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
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Microsoft Yahei', 'PingFang SC', 'Tahoma', 'Arial';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.ivu-table-wrapper {
  border: 0 !important;
  clear: both;
}
.ivu-table:after, .ivu-table:before {
  background: transparent !important;
}
.ivu-table th {
  background: #fff !important;
  border-bottom: 2px solid #e9eaec !important;
}
.ivu-table-body .ivu-table-row:last-child td {
  border-bottom: 0 !important;
}
.ivu-table-cell {
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  padding: 0 8px;
}
.info-table {
  border: 0;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
.info-table td  {
  padding: 5px 8px;
  border: 1px solid #e2e2e2;
  color: #999;
}
.info-table .td-header {
  background: #efefef;
  text-align: right;
  font-weight: 700;
  color: #666;
}
.info-table th {
  background: #efefef;
  text-align: center;
  font-weight: 700;
  color: #666;
  padding: 5px 8px;
  border: 1px solid #e2e2e2;
}
.brief-table {
  border: 0;
  border-collapse: collapse;
  border-spacing: 1px;
  width: 100%;
  tbody tr {
    transition: all .3s ease-in-out;
    &:hover {
      background:#e9f0f8;
      td {
        color: #555;
      }
    }
  }
  tbody tr:not(:last-child) {
    border-bottom: 1px solid #e2e2e2;
  }
  td  {
    padding: 5px 8px;
    transition: all .3s ease-in-out;
    // border-bottom: 1px solid #e2e2e2;
    color: #999;
  }
  .td-header {
    background: #efefef;
    text-align: right;
    font-weight: 700;
    color: #666;
  }
  th {
    // background: #efefef;
    text-align: center;
    font-weight: 700;
    color: #666;
    padding: 5px 8px;
    border-bottom: 2px solid #888888;
  }
}
.box-tools {
  display: flex;
}
.table-search {
  transition: width 0.3s ease-in-out;
  width: 0 !important;
  overflow: hidden;
}
.table-search.on {
  width: 180px !important;
}
.font-grey {
  color: #aaa;
}
.font-red {
  color: #ed3f14;
}
.pull-right {
  float: right !important;
}
.pull-left {
  float: left !important;
}
.text-right {
  text-align: right !important;
}
.text-center {
  text-align: center !important;
  justify-content: center !important;
}
.text-left {
  text-align: left !important;
}
.rotate-135 {
  transform: rotate(135deg);
}
.padding-top-10 {
  padding-top: 10px;
}
.padding-top-20 {
  padding-top: 20px;
}

</style>
