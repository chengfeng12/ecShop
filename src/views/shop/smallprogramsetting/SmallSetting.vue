<template>
  <div id="small-setting">
    <div class="currentTitle">小程序设置</div>
    <Card>
      <!--  :rules="validateList" -->
      <Form :model="smallData" :label-width="200" ref="smallData" style="border: 1px solid #c9c9c9">
        <h3>基本设置</h3>
        <FormItem label="APPID（小程序）" prop="appid">
          <Input
            v-model="smallData.appid"
            :disabled="true"
            placeholder="请输入APPID"
            style="width: 300px;"
          ></Input>
        </FormItem>
        <FormItem label="AppSecret(小程序密钥)" prop="appSecret">
          <Input
            v-model="smallData.appSecret"
            :disabled="true"
            placeholder="请输入AppSecret"
            style="width: 300px;"
          ></Input>
        </FormItem>
        <FormItem label="小程序维护" prop="isVindicate">
          <RadioGroup v-model="smallData.isVindicate">
            <Radio label="0" :disabled="true">维护中</Radio>
            <Radio label="1" :disabled="true">正常</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="开启用户绑定" prop="isUserBinding">
          <RadioGroup v-model="smallData.isUserBinding">
            <Radio label="1" :disabled="true">开启</Radio>
            <Radio label="0" :disabled="true">关闭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="绑定节点" prop="bindingNodes">
          <RadioGroup v-model="smallData.bindingNodes">
            <Radio label="1">支付订单</Radio>
            <Radio label="2">确认订单</Radio>
            <Radio label="3">进入店铺</Radio>
            <Radio label="4">加入购物车</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="模板消息选择" prop="type">
          <RadioGroup v-model="smallData.type">
            <Radio label="1">小程序模板消息</Radio>
            <Radio label="2">公众号模板消息</Radio>
          </RadioGroup>
        </FormItem>
        <h3>客服设置</h3>
        <FormItem label="在线客服悬窗" prop="isShowCustomerService">
          <RadioGroup v-model="smallData.isShowCustomerService">
            <Radio label="1">开启</Radio>
            <Radio label="0">关闭</Radio>
          </RadioGroup>
          <p style="color: #aaa;">客服按钮显示位置：首页、商品详情页、会员中心页、订单详情页</p>
        </FormItem>
        <FormItem label="电话客服悬窗" prop="isShowPhoneService">
          <RadioGroup v-model="smallData.isShowPhoneService">
            <Radio label="1">开启</Radio>
            <Radio label="0">关闭</Radio>
          </RadioGroup>
          <p style="color: #aaa;">客服按钮显示位置：首页、商品详情页、会员中心页、订单详情页</p>
        </FormItem>
        <h3>模板消息设置</h3>
        <div class="text-explain">
          <p>模板消息下发条件说明：当用户在小程序内完成1次微信支付时，可向用户在7天内推送3条模板消息，余额支付则将不能触发</p>
          <span>买家通知 -- 订单通知</span>
        </div>
        <FormItem label="下单成功通知" prop="placeOrderInform">
          <Select v-model="smallData.placeOrderInform" placeholder="选择所需要的信息" style="width: 300px;">
            <Option v-for="item in listData" :key="item.id" :value="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="支付成功通知" prop="paySuccedInform">
          <Select v-model="smallData.paySuccedInform" placeholder="选择所需要的信息" style="width: 300px;">
            <Option v-for="item in listData" :key="item.id" :value="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单取消通知" prop="orderCancelInform">
          <Select
            v-model="smallData.orderCancelInform"
            placeholder="选择所需要的信息"
            style="width: 300px;"
          >
            <Option v-for="item in listData" :key="item.id" :value="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单发货通知" prop="orderShipmentsInform">
          <Select
            v-model="smallData.orderShipmentsInform"
            placeholder="选择所需要的信息"
            style="width: 300px;"
          >
            <Option v-for="item in listData" :key="item.id" :value="item.id">{{item.title}}</Option>
          </Select>
        </FormItem>
        <FormItem label="订单状态更新通知" prop="orderStatusInform">
          <Select
            v-model="smallData.orderStatusInform"
            placeholder="选择所需要的信息"
            style="width: 300px;"
          >
            <Option v-for="item in listData" :key="item.id" :value="item.id">{{item.title}}</Option>
          </Select>
          <span>（修改收货地址、修改价格）</span>
        </FormItem>
      </Form>
      <div class="footer">
        <Button v-if="hasRole(5010301)" class="btn btn-a" size="small" type="primary" :loading="loading" @click="keepFun">保存</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import shop from "@/api/request/shopModel";
export default {
  data() {
    return {
      loading: false,
      smallData: {
        id: "",
        appid: "",
        appSecret: "",
        isVindicate: "1",
        isUserBinding: "1",
        bindingNodes: "1",
        type: "1",
        isShowCustomerService: "0",
        isShowPhoneService: "0",
        placeOrderInform: "",
        paySuccedInform: "",
        orderCancelInform: "",
        orderShipmentsInform: "",
        orderStatusInform: ""
      },
      id: "",
      // 获取的模板消息设置列表
      placeOrderInformList: [],
      paySuccedInformList: [],
      orderCancelInformList: [],
      orderShipmentsInformList: [],
      orderStatusInformList: [],
      listData: []
    };
  },
  activated() {
    this.getData();
    this.getTempList();
  },
  methods: {
    getData() {
      shop
        .getSmallAdmin()
        .then(res => {
          if (res.code == 1) {
            console.log("查询更改", res);
            this.integrationData(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    integrationData(data) {
      console.log(data);
      // return false
      // this.smallData = data[0]
      // data.forEach(element => {
      let objList = {};
      // console.log(element.id,'41545454544545')
      this.smallData.id = data.id;
      this.smallData.appid = data.appid;
      this.smallData.appSecret = data.appSecret + "";
      this.smallData.isVindicate = data.isVindicate + "";
      this.smallData.isUserBinding = data.isUserBinding + "";
      this.smallData.bindingNodes = data.bindingNodes + "";
      this.smallData.type = data.type + "";
      this.smallData.isShowCustomerService = data.isShowCustomerService + "";
      this.smallData.isShowPhoneService = data.isShowPhoneService + "";

      this.smallData.placeOrderInform = data.placeOrderInform;
      this.smallData.paySuccedInform = data.paySuccedInform;
      this.smallData.orderCancelInform = data.orderCancelInform;
      this.smallData.orderShipmentsInform = data.orderShipmentsInform;
      this.smallData.orderStatusInform = data.orderStatusInform;
      // this.placeOrderInformList = this.forFun(
      //   element.listOrderSuccessNotification
      // );
      // this.paySuccedInformList = this.forFun(element.listOrderPaySuccess);
      // this.orderCancelInformList = this.forFun(
      // element.listOrderCancellationNotice
      // );
      // this.orderShipmentsInformList = this.forFun(element.listOrderSend);
      // this.orderStatusInformList = this.forFun(
      //   element.listOrderStatusChangeNotification
      // );
      // });
    },
    getTempList() {
      shop
        .templateList()
        .then(res => {
          if (res.code == 1) {
            this.listData = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 循环处理
    forFun(data) {
      let arr = [];
      data.forEach(item => {
        let obj = {};
        obj.id = item.id + "";
        obj.title = item.title;
        arr.push(obj);
      });
      return arr;
    },
    keepFun() {
      this.loading = true
      if (this.smallData.id) {
        shop.smallAdminUpdate(this.smallData).then(res => {
            if (res.code == 1) {
              this.loading = false
              this.$Message.success("保存成功");
              this.getData();
            } else {
              this.loading = false
              this.$Message.error(res.message);
            }
          }).catch(err => {
            this.loading = false
            console.log(err);
          });
      } else {
        shop.smallAdminSave(this.smallData).then(res => {
            if (res.code == 1) {
              this.loading = false
              this.$Message.success("保存成功");
              this.getData();
            } else {
              this.loading = false
              this.$Message.error(res.message);
            }
          }).catch(err => {
            this.loading = false
            console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.currentTitle {
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
#small-setting {
  h3 {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
    padding-left: 10px;
    background: #f1f1f1;
  }
  .text-explain {
    p {
      margin: 20px 50px;
      padding: 10px 10px 10px 30px;
      border: 1px dashed #fc9;
      background: #ffffcc;
    }
    span {
      margin: 20px 100px;
      display: block;
      padding: 10px 10px 10px 30px;
      color: #000;
      background: rgba(230, 230, 230, 0.5);
    }
  }
  .footer {
    padding: 20px;
    text-align: center;
  }
}
</style>

