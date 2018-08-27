# Tao11 BuyerTrade API 说明
## Users服务
### 登陆
* 接口： `/api/users/auth`
* 方法： `POST`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`code`|`true`|`string`|微信登陆code

* 返回： 

```
{
  code: 0,
  data: {
    "id" : "5ae1f103067459001126071c",
    "user_id" : 5311,
    "name" : "用户5311",
    "role" : "boss",
    "group" : 1,
    "session" : "yulwew9e6z7thyjdgorixr5u5urln9zndf5fsroykeccr85ckf3vn6ksju87io",
    "username" : null,
    "mobile" : null,
    "email" : null,
    "sex" : "男",
    "cardid" : null,
    "powers" : 0,
    "msg_revice_method" : 0,
    "service" : "users",
    "action" : "add-inner",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTFmMTAzMDY3NDU5MDAxMTI2MDcxYyIsInVzZXJfaWQiOjUzMTEsIm5hbWUiOiLnlKjmiLc1MzExIiwicm9sZSI6ImJvc3MiLCJncm91cCI6MSwic2Vzc2lvbiI6Inl1bHdldzllNno3dGh5amRnb3JpeHI1dTV1cmxuOXpuZGY1ZnNyb3lrZWNjcjg1Y2tmM3ZuNmtzanU4N2lvIiwiaWF0IjoxNTMzNDQwMjMyfQ.cttjBEAmRlNIUXJfwvlI7ptb24Hgt0PoEgIeeDy-O_M",
    "token_create_time" : 1533476842209.0
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 验证登陆状态
* 接口： `/api/users/renew`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 无
* 返回： 

```
{
  code: 0,
  data: {
    "id" : "5ae1f103067459001126071c",
    "user_id" : 5311,
    "name" : "用户5311",
    "role" : "boss",
    "group" : 1,
    "session" : "yulwew9e6z7thyjdgorixr5u5urln9zndf5fsroykeccr85ckf3vn6ksju87io",
    "username" : null,
    "mobile" : null,
    "email" : null,
    "sex" : "男",
    "cardid" : null,
    "powers" : 0,
    "msg_revice_method" : 0,
    "service" : "users",
    "action" : "add-inner",
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhZTFmMTAzMDY3NDU5MDAxMTI2MDcxYyIsInVzZXJfaWQiOjUzMTEsIm5hbWUiOiLnlKjmiLc1MzExIiwicm9sZSI6ImJvc3MiLCJncm91cCI6MSwic2Vzc2lvbiI6Inl1bHdldzllNno3dGh5amRnb3JpeHI1dTV1cmxuOXpuZGY1ZnNyb3lrZWNjcjg1Y2tmM3ZuNmtzanU4N2lvIiwiaWF0IjoxNTMzNDQwMjMyfQ.cttjBEAmRlNIUXJfwvlI7ptb24Hgt0PoEgIeeDy-O_M",
    "token_create_time" : 1533476842209.0
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```
若登陆信息无效则返回401状态

### 获取用户选择列表
* 接口： `/api/users/selectlist`
* 方法： `POST` | `GET`
* 是否必须登陆： `true`
* 入参： 无

* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5ae830cedXXXXXXXXXXXXXXXXX",
      "group" : 1,
      "name" : "张XX",
      "role" : "employer"
    },
    {...},
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

## Shops服务
### 获取店铺选择列表
* 接口： `/api/shops/selectlist`
* 方法： `POST` | `GET`
* 是否必须登陆： `true`
* 入参： 无

* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5ae830cedXXXXXXXXXXXXXXXXX",
      "group" : 1,
      "name" : "店铺昵称"
    },
    {...},
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取下单店铺黑名单列表
* 接口： `/api/shops/getblacklist`
* 方法： `GET`|`POST`
* 是否必须登陆： `true`
* 入参： 无
* 返回： 

```
{
  code: 0,
  data: [...],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 新增下单店铺黑名单
* 接口： `/api/shops/addblacklist`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 
  
入参|必填|类型|说明
-|-|-|-
`name`|`true`|`string`|店铺ID
`group`|`true`|`int`|店群ID

* 返回： 

```
{
  code: 0,
  data: {...},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 删除下单店铺黑名单
* 接口： `/api/shops/deleteblacklist`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 
  
入参|必填|类型|说明
-|-|-|-
`id`|`true`|`string`|黑名单记录id序号

* 返回： 

```
{
  code: 0,
  data: {...},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 检查店铺是否在黑名单
* 接口： `/api/shops/checkblacklist`
* 方法： `GET`|`POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`name`|`true`|`string`|待查询的店铺ID

* 返回： 

```
{
  code: 0,
  data: {
    "in" : true|false
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

## Buyers服务
### 买手列表
* 接口： `/api/buyers/listall`
* 方法： `POST` | `GET`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`search`|`false`|`array`|条件查询，例```[{id:'xxx'}]```
`filterShop`|`false`|`string`|根据店铺id检索，例`5ae129d6bb8c0800113836e4`

* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5ae830cedXXXXXXXXXXXXXXXXX",
      "group" : 1,
      "name" : "张XX",
      "userid" : "5ae33XXXXXXXXXXXXXXXXXXX",
      "shopid" : "5ae12XXXXXXXXXXXXXXXXXXX",
      "weight" : 0,
      "is_enable" : true,
      "today_assigned" : 0,
      "total_assigned" : 108,
      "monthly_assigned" : 5,
      "today_finished" : 0,
      "today_ordered" : 0,
      "today_failed" : 0,
      "total_finished" : 0,
      "total_ordered" : 33,
      "total_failed" : 69,
      "monthly_finished" : 0,
      "monthly_ordered" : 0,
      "monthly_failed" : 5,
      "today_dismissed" : 0,
      "monthly_dismissed" : 0
    },
    {...},
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 新增买手
* 接口： `/api/buyers/add`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`group`|`true`|`int`|店群ID
`name`|`true`|`string`|买手姓名
`userid`|`true`|`string`|买手对应的userid,例`5ae33XXXXXXXXXXXXXXXXXXX`
`shopid`|`true`|`string`|店铺id，例`5ae33XXXXXXXXXXXXXXXXXXX`
`weight`|`false`|`number`|买手配单权重（取值范围0-1）
`is_enable`|`false`|`boolean`|是否接单（默认`true`）

* 返回： 

```
{
  code: 0,
  data: {
    "id" : "5ae830cedXXXXXXXXXXXXXXXXX",
    "group" : 1,
    "name" : "张XX",
    "userid" : "5ae33XXXXXXXXXXXXXXXXXXX",
    "shopid" : "5ae12XXXXXXXXXXXXXXXXXXX",
    "weight" : 0,
    "is_enable" : true,
    "today_assigned" : 0,
    "total_assigned" : 108,
    "monthly_assigned" : 5,
    "today_finished" : 0,
    "today_ordered" : 0,
    "today_failed" : 0,
    "total_finished" : 0,
    "total_ordered" : 33,
    "total_failed" : 69,
    "monthly_finished" : 0,
    "monthly_ordered" : 0,
    "monthly_failed" : 5,
    "today_dismissed" : 0,
    "monthly_dismissed" : 0
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 修改买手
* 接口： `/api/buyers/edit`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`id`|`true`|`string`|买手id
`name`|`false`|`string`|买手姓名
`userid`|`true`|`string`|买手对应的userid,例`5ae33XXXXXXXXXXXXXXXXXXX`
`shopid`|`true`|`string`|店铺id，例`5ae33XXXXXXXXXXXXXXXXXXX`
`weight`|`false`|`number`|买手配单权重（取值范围0-1）
`is_enable`|`false`|`boolean`|是否接单（默认`true`）

* 返回： 

```
{
  code: 0,
  data: {
    "id" : "5ae830cedXXXXXXXXXXXXXXXXX",
    "group" : 1,
    "name" : "张XX",
    "userid" : "5ae33XXXXXXXXXXXXXXXXXXX",
    "shopid" : "5ae12XXXXXXXXXXXXXXXXXXX",
    "weight" : 0,
    "is_enable" : true,
    "today_assigned" : 0,
    "total_assigned" : 108,
    "monthly_assigned" : 5,
    "today_finished" : 0,
    "today_ordered" : 0,
    "today_failed" : 0,
    "total_finished" : 0,
    "total_ordered" : 33,
    "total_failed" : 69,
    "monthly_finished" : 0,
    "monthly_ordered" : 0,
    "monthly_failed" : 5,
    "today_dismissed" : 0,
    "monthly_dismissed" : 0
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 删除买手
* 接口： `/api/buyers/delete`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`id`|`true`|`string`|买手id

* 返回： 

```
{
  code: 0,
  data: {
    ...
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 买手更名
* 接口： `/api/buyers/rename`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`id`|`true`|`string`|买手id
`name`|`true`|`string`|买手姓名

此接口将同时修改users表姓名

* 返回： 

```
{
  code: 0,
  data: {
    ...
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

## Trades服务
### 订单列表
* 接口： `/api/trades/list`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`search`|`false`|`array`|条件查询，例```[{id:'xxx'}]```
`filterShop`|`false`|`string`|根据店铺id检索，例`5ae129d6bb8c0800113836e4`
`order_status`|`false`|`string`|订单状态```['ORDERED':'已下单', 'PARTLY_ORDERED':'部分下单', 'FINISHED':'已完成', 'PARTLY_FINISHED':'部分完成', 'ASSIGNED':'已派单', 'RESIGNED':'已撤销', 'UNASSIGNED':'未指派']```
`status`|`false`|`string`|淘宝订单状态```['WAIT_BUYER_PAY':'待付款', 'WAIT_SELLER_SEND_GOODS':'待发货', 'WAIT_BUYER_CONFIRM_GOODS':'已发货', 'TRADE_FINISHED':'已完成', 'TRADE_CLOSED':'用户退款', 'TRADE_CLOSED_BY_TAOBAO':'交易关闭']```
`shops`|`false`|`array`|按店铺检索，string[] shopid
`limit$`|`false`|`int`|每页条数，默认10条
`skip$`|`false`|`int`|跳过条数（翻页用）

* 返回： 

```
{
  code: 0,
  data: [trade_fullinfo],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取历史下单列表

* 接口： `/api/trades/gethistoryboughts`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`numiid`|`true`|`string`|商品ID（淘宝ID）

* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5ae7c95e9d21d10017840c81",
      "oid_str" : "153132921433379215",
      "post_fee" : 0, // 邮费，分
      "buyer_fee" : 4800, // 购买支付总额，分
      "buy_url" : "https://item.taobao.com/item.htm?id=558448281748",
      "order_number" : "140792851571823149",
      "name" : "陈xx",
      "buyer_nick" : "甜xxxx", // 买手旺旺id
      "userid" : "5ae28383xxxxxxxxxxxxxxxx",
      "time" : "2018-05-01T01:56:46.256Z",
      "tradeid" : "5ae779c05f014000178eae76",
      "tid" : "153132921433379215",
      "group" : 1.0
    },
    {...},
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 解密买家信息

* 接口： `/api/tao11/decrypt`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`tradeid`|`true`|`string`|订单id
`nick`|`true`|`string`|卖家旺旺昵称
`ciopher`|`true`|`string`|待解密密文
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {同tao11相关接口},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取买家收货地址

* 接口： `/api/tao11/receiver`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`tradeid`|`true`|`string`|订单id
`tid`|`true`|`string`|淘宝订单编号
`nick`|`true`|`string`|卖家旺旺
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {同tao11相关接口},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取物流商列表

* 接口： `/api/tao11/logiscompanies`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {同tao11相关接口},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 备注订单

* 接口： `/api/tao11/setmemo`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`memo`|`true`|`string`|备注内容
`tid`|`true`|`string`|淘宝订单编号
`flag`|`false`|`int`|备注颜色0-5,灰红黄绿蓝粉
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {同tao11相关接口},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 解除订单关联

* 接口： `/api/trades/dismiss`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`tradeid`|`true`|`string`|订单id
`tid`|`true`|`string`|淘宝主订单编号
`oid`|`true`|`string`|淘宝子订单编号
`reason`|`true`|`string`|解除原因
`reason_other`|`false`|`string`|解除原因（其他）
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {trade_fullinfo},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 退回配单

* 接口： `/api/trades/resign`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`tradeid`|`true`|`string`|订单id
`reason`|`true`|`string`|解除原因
`reason_other`|`false`|`string`|解除原因（其他）
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {trade_fullinfo},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 手动分配订单给买手

* 接口： `/api/trades/assigntobuyer`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`tradeid`|`true`|`string`|订单id
`buyerid`|`true`|`string`|买手id

* 返回： 

```
{
  code: 0,
  data: {trade_fullinfo},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 手动关联订单

* 接口： `/api/trades/joinorder`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`tradeid`|`true`|`string`|订单id
`oid_str`|`true`|`string`|子订单oid
`orderBought`|`true`|`object`|``` {
        tradeid: null,
        tid: null,
        oid: null,
        buyer: '',
        buyerTid: null,
        buyerOid: null,
        buyerFee: 0,
        buyUrl: '',
        buyerPostFee: 0
      } ```
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {trade_fullinfo},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 下单成功

* 接口： `/api/trades/success`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`num_iid`|`true`|`string`|商品淘宝id
`tradeid`|`true`|`string`|订单id
`oid_str`|`true`|`string`|子订单oid
`orderBought`|`true`|`object`|``` {
        tradeid: null,
        tid: null,
        oid: null,
        buyer: '',
        buyerTid: null,
        buyerOid: null,
        buyerFee: 0,
        buyUrl: '',
        buyerPostFee: 0
      } ```
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {trade_fullinfo},
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 发货成功

* 接口： `/api/trades/finish`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`logisNumber`|`true`|`string`|物流单号
`companyCode`|`true`|`string`|物流商编码
`tradeid`|`true`|`string`|订单id
`tid`|`true`|`string`|主订单tid
`oid`|`true`|`string`|子订单oid
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: {
    trade: trade_fullinfo
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取转链链接

* 接口： `/api/trades/gettranslink`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`numiid`|`true`|`string`|淘宝商品id

* 返回： 

```
{
  code: 0,
  data: {
    num_iid: numiid,
    data: {
      {
        "max_commission_rate":"12.00","coupon_total_count":"",
        "item_id":561031594621,"coupon_start_time":"",
        "coupon_type":"",
        "coupon_remain_count":"",
        "category_id":21,
        "coupon_info":"","url":"https://uland.taobao.com/coupon/edetail?e=Bx1CBs093AkGQASttHIRqcAIN22j5PtNtgCWEpM%2FFK1CPhzX0bLqkwuNIpiz8s1Nd8Z2pi%2BfNp3zPRetHQmKcJQ5wfGz%2Fu%2BNJzbB7ddzPNkFjaZhgpTjjWuFqp8TFaHMx5Q7%2FvT%2FZtDTZU%2FIHinq3Q%3D%3D&traceId=0ab2507a15335441499758621&src=lxs_lxsweb&tj1=0&tj2=0&tjrank=0",
        "coupon_end_time":""
      }
    },
    created_time: timestamp
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取可取单量

* 接口： `/api/trades/assignables`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参：
*  
入参|必填|类型|说明
-|-|-|-
`session`|`true`|`string`|tao11 session

* 返回： 

```
{
  code: 0,
  data: [{trade_fullinfo}],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 取单

* 接口： `/api/trades/assignbatch`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 无

* 返回： 

```
{
  code: 0,
  data: {
    data: [{trade_fullinfo}],
    length: int
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

## 统计相关
### 获取今日、昨日全部汇总数据

* 接口： `/api/sys/getDetailedStats`
* 方法： `POST` | `GET `
* 是否必须登陆： `true`
* 入参： 无
* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5af3c3c02146be780d524777",
      "time" : "2018-05-10T04:00:00.200Z", // 统计时间
      "group" : 1,
      "newTradeCount" : 154, // 新订单
      "finishTradeCount" : 75, // 完成订单数量（发货）
      "orderedTradeCount" : 147, // 下单订单数量
      "resignedTradeCount" : 14 // 退单数量
    },
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取最近七日统计数据

* 接口： `/api/sys/getRecentDailyStats`
* 方法： `POST` | `GET `
* 是否必须登陆： `true`
* 入参： 无
* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5af3c3c02146be780d524777",
      "time" : "2018-05-10T16:00:00.200Z", // 统计时间
      "group" : 1,
      "newTradeCount" : 154, // 新订单
      "finishTradeCount" : 75, // 完成订单数量（发货）
      "orderedTradeCount" : 147, // 下单订单数量
      "resignedTradeCount" : 14 // 退单数量
    },
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取昨日买手统计数据

* 接口： `/api/buyerStats/getYesterdayRank`
* 方法： `POST` | `GET `
* 是否必须登陆： `true`
* 入参： 无
* 返回： 

```
{
  code: 0,
  data: [
    {
      "id" : "5af5cd7dff0cec0011d2da54",
      "year" : 2018,
      "month" : 4, // 4=5月
      "day" : 11,
      "name" : "李xx",
      "userid" : "5ae28302aa9e9000112b73b1",
      "group" : 1,
      "assigned" : 0,
      "dismissed" : 0,
      "failed" : 0,
      "finished" : 0,
      "ordered" : 0
  },
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取消息队列最新消息

* 接口： `/api/trades/readfromqueue`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 无

* 返回： 

```
{
  code: 0,
  data: [
    {
      "action": "trade-new", // "trade-new"-最新订单，"ordered-new"-最新下单，"shipped-new"-最新发货
      "value": {
        "group": 1,
        "tid_str": "12345677890",
        "seller_nick": "卖家旺旺",
        "payment": 123.12,
        "buyer_area": "买家所在地区",
        "title": "商品标题",
        "is_daixiao": false, // 是否代销宝贝
        "num": 1,
        "created": "订单创建时间",
        "pushtime": "订单推送时间"
      },
      "pushtime": "订单推送时间"
    }
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取已成交订单（计算到账利润用）
* 接口： `/api/trades/listfinished`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`timespan`|`false`|`string`|查询周期[`today`今日|`monthly`本月|`daterange`日期区间]
`startdate`|`false`|`string`|查询起始日期（仅当`timespan`为`daterange`时生效）
`enddate`|`false`|`string`|查询截止日期（仅当`timespan`为`daterange`时生效）
`byshop`|`false`|`boolean`|是否输出按店铺统计结果
`bybuyer`|`false`|`boolean`|是否输出按买手统计结果

* 返回： 

```
{
  code: 0,
  data: {
    "tradeCount": 356,
    "orderCount": 351,
    "daixiaoTradeCount": 5,
    "tradePaymentTotal": 12095.610000000002,
    "orderPaymentTotal": 8274.509999999997,
    "daixiaoPaymentTotal": 338.59000000000003,
    "shops": [
      {
        "name": "xxxx1",
        "tradeCount": 20,
        "tradeAmount": 571.23,
        "orderCount": 20,
        "orderAmount": 407.47,
        "daixiaoCount": 0,
        "daixiaoAmount": 0
      },
      {
        "name": "xxxxx2",
        "tradeCount": 117,
        "tradeAmount": 3705.0800000000017,
        "orderCount": 117,
        "orderAmount": 2380.950000000001,
        "daixiaoCount": 0,
        "daixiaoAmount": 0
      },
      ...
    ],
    "buyers": [
      {
        "name": "XXX雨",
        "userid": "5ae3ecb75c499b001132daea",
        "tradeCount": 251,
        "tradeAmount": 8319.529999999995,
        "orderCount": 250,
        "orderAmount": 5786.010000000002
      },
      ...
    ]
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取已发货订单（计算入账利润用）
* 接口： `/api/trades/listshipped`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`timespan`|`false`|`string`|查询周期[`today`今日|`monthly`本月|`daterange`日期区间]
`startdate`|`false`|`string`|查询起始日期（仅当`timespan`为`daterange`时生效）
`enddate`|`false`|`string`|查询截止日期（仅当`timespan`为`daterange`时生效）
`byshop`|`false`|`boolean`|是否输出按店铺统计结果
`bybuyer`|`false`|`boolean`|是否输出按买手统计结果

* 返回： 

```
{
  code: 0,
  data: {
    "tradeCount": 356,
    "orderCount": 351,
    "daixiaoTradeCount": 5,
    "tradePaymentTotal": 12095.610000000002,
    "orderPaymentTotal": 8274.509999999997,
    "daixiaoPaymentTotal": 338.59000000000003,
    "shops": [
      {
        "name": "xxxx1",
        "tradeCount": 20,
        "tradeAmount": 571.23,
        "orderCount": 20,
        "orderAmount": 407.47,
        "daixiaoCount": 0,
        "daixiaoAmount": 0
      },
      {
        "name": "xxxxx2",
        "tradeCount": 117,
        "tradeAmount": 3705.0800000000017,
        "orderCount": 117,
        "orderAmount": 2380.950000000001,
        "daixiaoCount": 0,
        "daixiaoAmount": 0
      },
      ...
    ],
    "buyers": [
      {
        "name": "XXX雨",
        "userid": "5ae3ecb75c499b001132daea",
        "tradeCount": 251,
        "tradeAmount": 8319.529999999995,
        "orderCount": 250,
        "orderAmount": 5786.010000000002
      },
      ...
    ]
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取已下单订单（计算实时利润用）
* 接口： `/api/trades/listordered`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`timespan`|`false`|`string`|查询周期[`today`今日|`monthly`本月|`daterange`日期区间]
`startdate`|`false`|`string`|查询起始日期（仅当`timespan`为`daterange`时生效）
`enddate`|`false`|`string`|查询截止日期（仅当`timespan`为`daterange`时生效）
`byshop`|`false`|`boolean`|是否输出按店铺统计结果
`bybuyer`|`false`|`boolean`|是否输出按买手统计结果

* 返回： 

```
{
  code: 0,
  data: {
    "tradeCount": 356,
    "orderCount": 351,
    "daixiaoTradeCount": 5,
    "tradePaymentTotal": 12095.610000000002,
    "orderPaymentTotal": 8274.509999999997,
    "daixiaoPaymentTotal": 338.59000000000003,
    "shops": [
      {
        "name": "xxxx1",
        "tradeCount": 20,
        "tradeAmount": 571.23,
        "orderCount": 20,
        "orderAmount": 407.47,
        "daixiaoCount": 0,
        "daixiaoAmount": 0
      },
      {
        "name": "xxxxx2",
        "tradeCount": 117,
        "tradeAmount": 3705.0800000000017,
        "orderCount": 117,
        "orderAmount": 2380.950000000001,
        "daixiaoCount": 0,
        "daixiaoAmount": 0
      },
      ...
    ],
    "buyers": [
      {
        "name": "XXX雨",
        "userid": "5ae3ecb75c499b001132daea",
        "tradeCount": 251,
        "tradeAmount": 8319.529999999995,
        "orderCount": 250,
        "orderAmount": 5786.010000000002
      },
      ...
    ]
  },
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```

### 获取利润列表（亏损检查，运营用）
* 接口： `/api/trades/losscheck`
* 方法： `POST`
* 是否必须登陆： `true`
* 入参： 

入参|必填|类型|说明
-|-|-|-
`timespan`|`false`|`string`|查询周期[`today`今日|`monthly`本月|`daterange`日期区间]
`profitstart`|`false`|`number`|查询利润起始额
`profitend`|`false`|`number`|查询利润截止额

* 返回： 

```
{
  code: 0,
  data: [
    {
      "_id": "5b67e9c273433f00174fc6ce",
      "shop": {
        "id": "5ae0a7be550c960011dd0b2a",
        "name": "xxxxxxxx",
        "group": 1
      },
      "shopid": "5ae0a7be550c960011dd0b2a",
      "tid_str": "196076085034242859",
      "orders": {
        "order": [
          {
            "adjust_fee": -15.58,
            "buyer_rate": false,
            "cid": 50000671,
            "discount_fee": 77.62,
            "divide_order_fee": "59.00",
            "is_daixiao": false,
            "is_oversold": false,
            "nr_outer_iid": "572013962176",
            "num": 1,
            "num_iid": 574612203672,
            "oid": 196076085034242850,
            "oid_str": "196076085034242859",
            "order_from": "WAP,WAP",
            "outer_iid": "572013962176",
            "payment": 59,
            "pic_path": "https://img.alicdn.com/bao/uploaded/i1/3357622617/TB2fwOoy5CYBuNkHFCcXXcHtVXa_!!3357622617.jpg",
            "price": 152.2,
            "refund_status": "NO_REFUND",
            "seller_rate": false,
            "seller_type": "C",
            "sku_id": "3759761869413",
            "sku_properties_name": "主要颜色:爱心手势白 心花怒放粉;尺码:XL",
            "snapshot_url": "n:196076085034242859_1",
            "status": "WAIT_SELLER_SEND_GOODS",
            "title": "【2件59元】夏装短袖t恤女纯棉2018新款学生上衣服修身白色半袖衫",
            "total_fee": 59
          }
        ]
      },
      "payment": 59,
      "last_assignbuyer": {
        "buyerid": "5ae9a8552f449d00116b58f2",
        "group": 1,
        "name": "陈xxxx",
        "shopid": "5ae0a7be550c960011dd0b2a",
        "userid": "5ae28383aa9e9000112b73d8",
        "time": "2018-08-06T08:40:13.373Z",
        "is_passive": true
      },
      "lastorder_time": "2018-08-06T08:49:08.605Z",
      "ordered_temp": {
        "oid_str": "196076085034242859",
        "post_fee": 0,
        "buyer_fee": 5900,
        "buy_url": "https://detail.tmall.com/item.htm?id=567185679411",
        "num": "1",
        "order_number": "175072691195823149",
        "name": "陈xxxx",
        "buyer_nick": "甜xxxxx",
        "userid": "5ae28383aa9e9000112b73d8",
        "time": "2018-08-06T08:49:08.605Z"
      },
      "ordered_sum": 5900,
      "profit": 0,
      "profit_ratio": 0
    },
    ...
  ],
  status: "ok",
  success: true
}
```

* 错误返回：

```
{
  status: "fail",
  success: false,
  code: 0,
  message: "错误信息"
}
```