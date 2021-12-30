<template>
  <div id="order-list">
    <div class="currentTitle">订单概览</div>
    <Card>
      <div class="header">
        <h3 class="title">基本信息</h3>
        <div class="main-box">
          <div class="header">
            <div class="header-title clear">
              <h3 class="second-title">今日订单</h3>
            </div>
            <div class="basic-content">
              <div class="content-box">
                <div class="order-box">
                  <p>待付款</p>
                  <p>{{ todayOrder.waitPayment }}</p>
                </div>
                <div class="order-box">
                  <p>待发货</p>
                  <p>{{ todayOrder.waitSendOut }}</p>
                </div>
                <div class="order-box">
                  <p>待收货</p>
                  <p>{{ todayOrder.waitRec }}</p>
                </div>
                <div class="order-box">
                  <p>维权中</p>
                  <p>{{ todayOrder.waitMaintain }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="main clear">
            <div class="left">
              <div class="header-title clear">
                <h3 class="second-title">今日成交</h3>
                <div>
                  <span>人均消费：￥{{ todaySuccess.taverageConume }}</span>
                </div>
              </div>
              <div class="basic-content">
                <div class="content-box">
                  <div class="order-box success">
                    <p>下单数/成交数</p>
                    <p>
                      {{ todaySuccess.nowOrderCount}}/{{ todaySuccess.nowPayCount}}
                      <span>（单）</span>
                    </p>
                  </div>
                  <div class="order-box success">
                    <p>交易额/成交额</p>
                    <p>￥{{ todaySuccess.nowOrderAmount }}/￥{{ todaySuccess.nowPayAmount }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="header-title clear">
                <h3 class="second-title">昨日成交</h3>
                <div>
                  <span>人均消费：￥{{ yesterSuccess.yaverageConume }}</span>
                </div>
              </div>
              <div class="basic-content">
                <div class="content-box">
                  <div class="order-box success">
                    <p>下单数/成交数</p>
                    <p>
                      {{ yesterSuccess.yesOrderCount }}/{{ yesterSuccess.yesPayCount }}
                      <span>（单）</span>
                    </p>
                  </div>
                  <div class="order-box success">
                    <p>交易额/成交额</p>
                    <p>￥{{ yesterSuccess.yesOrderAmount }}/￥{{ yesterSuccess.yesPayAmount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="foot-title">
              <h3 class>交易趋势分析</h3>
            </div>
            <div>
              <h3 class="foot-title-t">近7日交易数据</h3>
              <line-chart :orderList="orderStaticList"></line-chart>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import LineChart from "@/components/echarts/lineChart";
import orderApi from "@/api/request/order.js";
export default {
  components: {
    LineChart
  },
  data() {
    return {
      todayOrder: {
        waitPayment: "",
        waitSendOut: "",
        waitRec: "",
        waitMaintain: ""
      },
      //今日成交
      todaySuccess: {
        nowPayAmount: "",
        nowOrderAmount: "",
        nowPartCount: "",
        nowOrderCount: "",
        // 今日人均消费
        taverageConume: ""
      },
      //昨日日成交
      yesterSuccess: {
        yesPayAmount: "",
        yesOrderAmount: "",
        yesOrderCount: "",
        yesPayCount: "",
        // 昨日人均消费
        yaverageConume: ""
      },
      orderStaticList: ""
    };
  },
  created() {
    orderApi
      .getData()
      .then(res => {
        if (res.code == 1) {
          this.getorderdata(res);
        } else {
          this.$Message.error("数据加载失败");
        }
      })
      .catch(error => {
        console.log(error);
      });
  },
  
  methods: {
    getorderdata: function(data) {
      console.log(data);
      (this.todayOrder.waitPayment = data.data.status0),
      (this.todayOrder.waitSendOut = data.data.status1),
      (this.todayOrder.waitRec = data.data.status2),
      (this.todayOrder.waitMaintain = data.data.status3),
        //今日成交

      (this.todaySuccess.nowPayAmount = data.data.nowPayAmount),
      (this.todaySuccess.nowPayCount = data.data.nowPayCount),
      (this.todaySuccess.nowOrderAmount = data.data.nowOrderAmount),
      (this.todaySuccess.nowOrderCount = data.data.nowOrderCount);

      if (data.data.nowPayCount == 0) {
        this.todaySuccess.taverageConume = 0;
      } else {
        this.todaySuccess.taverageConume = (
          data.data.nowPayAmount / data.data.nowPayCount
        ).toFixed(2);
      }
        //昨日成交
        (this.yesterSuccess.yesPayAmount = data.data.yesPayAmount),
        (this.yesterSuccess.yesOrderAmount = data.data.yesOrderAmount),
        (this.yesterSuccess.yesOrderCount = data.data.yesOrderCount),
        (this.yesterSuccess.yesPayCount = data.data.yesPayCount);

      if (data.data.yesPayCount == 0) {
        this.yesterSuccess.yaverageConume = 0;
      } else {
        this.yesterSuccess.yaverageConume = (
          data.data.yesPayAmount / data.data.yesPayCount
        ).toFixed(2);
      }
      console.log(data.data.yesPayAmount);
      console.log(data.data.yesPayCount);
      this.orderStaticList = data.data.orderStaticList;
    }
  }
};
</script>

<style scoped>
#order-list {
  min-width: 700px;
}
.title {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
}
.main-box {
  margin-top: 20px;
}
.header-title {
  padding: 0 10px;
  border: 1px solid #ccc;
  border-bottom: none;
  background-color: #0083b0;
  color: #fff;
}
.header-title .second-title {
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: 400;
  float: left;
}
.header-title div span {
  float: right;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
}
.content-box {
  border: 1px solid #ccc;
  border-top: none;
  font-size: 0;
  padding: 0px 0;
}
.order-box {
  position: relative;
  display: inline-block;
  width: 25%;
  text-align: center;
  height: 100px;
  /* background-color: #ccc; */
  border-right: 1px solid #ccc;
}

.success {
  width: 50%;
}
.content-box .order-box:nth-last-child(1) {
  border: none;
}

.order-box p:nth-child(1) {
  font-size: 16px;
  position: absolute;
  top: 25px;
  width: 100%;
}

.order-box p:nth-child(2) {
  font-size: 22px;
  margin-top: 10px;
  position: absolute;
  top: 45px;
  width: 100%;
}
.content-box .order-box span {
  font-size: 18px;
}

.main {
  margin: 30px 0;
}
.main .left {
  float: left;
  width: 49%;
}
.main .right {
  width: 49%;
  float: left;
  margin-left: 2%;
}

.foot-title {
  padding: 0 10px;
}
.foot-title h3 {
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  font-weight: 400;
  border-bottom: 1px solid #ccc;
}
.foot-title-t {
  font-size: 15px;
  font-weight: 400;
  padding: 10px 0 0 10px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
</style>
