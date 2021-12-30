<template>
  <div id="contentoverview" class="data-box">
    <div class="currentTitle">概览</div>
    <Card>
      <div class="header">
        <div class="left">
          <div class="head-title">
            <span style="color: rgb(17, 148, 246)">实时概览</span>
            <span class="mar-le" style="color: #aaa;">更新时间：{{currentTime}}</span>
          </div>
          <div class="chart">
            <echarts :options="realTimeData" style="height: 350px;width:100%;" />
          </div>
        </div>
        <div class="right">
          <div class="head-title">
            <Select
              size="small"
              v-model="type"
              style="width:200px;"
              class="text-left"
              @on-change="selectFun"
            >
              <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="container-box">
            <div class="content">
              <div class="con-box">
                <p class="item-title">付款人数</p>
                <div>
                  <span class="num">360</span>&nbsp;
                  <span class="company">人</span>
                </div>
                <p>昨日全天：人</p>
              </div>
              <div class="con-box">
                <p class="item-title">付款订单数</p>
                <div>
                  <span class="num">360</span>&nbsp;
                  <span class="company">笔</span>
                </div>
                <p>昨日全天：笔</p>
              </div>
            </div>
            <div class="content">
              <div class="con-box">
                <p class="item-title">待付款订单数</p>
                <div>
                  <span class="num">360</span>&nbsp;
                  <span class="company">笔</span>
                </div>
                <!-- <p>昨日全天：%</p> -->
              </div>
              <div class="con-box">
                <p class="item-title">待发货订单数</p>
                <div>
                  <span class="num">360</span>
                  <span class="company">笔</span>&nbsp;
                </div>
                <!-- <p>昨日全天：￥</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="main-top"></div>
        <div class="main-head">
          <div class="con-item">
            <p class="con-title">浏览量</p>
            <div class="con-info">
              <span class="num">{{Header.payAmount}}</span>
            </div>
            <p class="con-compare">昨日全天:1230</p>
          </div>
          <div class="con-item">
            <p class="con-title">访客数</p>
            <div class="con-info">
              <span class="num">{{Header.payCount}}</span>&nbsp;
              <span class="company">人</span>
            </div>
            <p class="con-compare">昨日全天:1280</p>
          </div>
          <div class="con-item">
            <p class="con-title">累计客户数</p>
            <div class="con-info">
              <span class="num">{{Header.payCountByPeople}}</span>&nbsp;
              <span class="company">人</span>
            </div>
          </div>
          <div class="con-item">
            <p class="con-title">在售商品数</p>
            <div class="con-info">
              <span class="num">{{Header.actualPayCount}}</span>
              &nbsp;
            </div>
          </div>
          <div class="con-item">
            <p class="con-title">仓库商品数</p>
            <div class="con-info">
              <span class="num">{{Header.unitPriceByOne}}</span>
              &nbsp;
            </div>
          </div>
          <div class="con-item">
            <p class="con-title">售罄商品数</p>
            <div class="con-info">
              <span class="num">{{Header.refundPrice}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-echarts">
        <div class="echarts-box">
          <span class="word">常用功能</span>
          <div class="img">
            <div class="img-info">
              <div class="imgs" @click="addgoods">
                <img src="static/img/cart.png" width="50px"  />
              </div>
              <p>添加商品</p>
            </div>
            <div class="img-info" @click="addpage">
              <div class="imgs">
                <img src="static/img/page.png" width="50px"  />
              </div>
              <p>页面管理</p>
            </div>
            <div class="img-info">
              <div class="imgs" @click="addmoudle">
                <img src="static/img/message.png" width="50px"  />
              </div>
              <p>模板消息</p>
            </div>
            <div class="img-info">
              <div class="imgs" @click="addadverse" >
                <img src="static/img/adverse.png" width="50px" />
              </div>
              <p>启动广告</p>
            </div>
          </div>
        </div>
        <div class="echarts-box">
          <span class="word">营销功能</span>
          <div class="imgss">
            <div class="img-info">
              <div class="imgs" @click="reducemoney" >
                <img src="static/img/cheaps.png" width="50px" />
              </div>
              <p>满额立减</p>
            </div>
            <div class="img-info">
              <div class="imgs" @click="discount">
                <img src="static/img/discount.png" width="70px" />
              </div>
              <p>限时折扣</p>
            </div>
            <div class="img-info">
              <div class="imgs" @click="purchase" >
                <img src="static/img/present.png" width="50px" />
              </div>
              <p>首购礼</p>
            </div>
            <div class="img-info">
              <div class="imgs" @click="repurchase" >
                <img src="static/img/present.png" width="50px" />
              </div>
              <p>满赠礼</p>
            </div>
            <div class="img-info">
              <div class="imgs"  @click="coupon">
                <img src="static/img/cheap.png" width="50px" />
              </div>
              <p>优惠券</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import goodsUtils from "@/utils/goodsUtils";
import dataApi from "@/api/request/data.js";
import echarts from "@/components/newEcharts/chart";
export default {
  data() {
    return {
      /**
       * 下面的
       */
      type: 1,
      source: 1,
      currentTime: "",
      channelList: [
        {
          id: 1,
          name: "微信小程序"
        }
      ],
      dateRangeData: 1,
      dateRange: [
        {
          id: 1,
          name: "按天"
        },
        {
          id: 7,
          name: "按周"
        },
        {
          id: 30,
          name: "按月"
        }
      ],
      timeData: 2,
      dateList: [
        {
          id: 1,
          name: "昨天"
        },
        {
          id: 7,
          name: "最近7天"
        },
        {
          id: 15,
          name: "最近15天"
        },
        {
          id: 30,
          name: "最近30天"
        },
        {
          id: 2,
          name: "自定义范围"
        }
      ],

      startTime: "",
      endTime: "",
      startTimeMon: "",
      /**
       * 上面的
       */
      Header: {
        payAmount: 1200,
        payCount: 123,
        payCountByPeople: 1345,
        actualPayCount: 342,
        unitPriceByOne: 456,
        refundPrice: 412
      },

      //实时概览
      realTimeData: {}
    };
  },
  created() {
    this.currentTime = goodsUtils.timeFun(goodsUtils.timeStampFun());
    this.getRealTime();
  },
  components: {
    echarts
  },
  methods: {
    getRealTime() {
      // 交易数据的列表
      dataApi
        .transactionData({
          startTime: this.transactionStartTime
            ? goodsUtils.timeDayFun(
                goodsUtils.timeStamp(this.transactionStartTime)
              )
            : goodsUtils.selectData(30).startTime,
          endTime: this.transactionEndTime
            ? goodsUtils.timeDayFun(
                goodsUtils.timeStamp(this.transactionEndTime)
              )
            : goodsUtils.selectData(30).endTime,
          source: this.source
        })
        .then(res => {
          if (res.code == 1) {
            this.integrationData(res.data);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    integrationData(data) {
      console.log("我是", data);
      let payAmount = [];
      let payCount = [];
      let payCountByPeople = [];
      let actualPayCount = [];
      let unitPriceByOne = [];
      let timeData = [];
      let dataSource = [];
      data.forEach(element => {
        if (element.payAmount) {
          payAmount.push(element.payAmount);
        } else {
          payAmount.push(0);
        }
        if (element.payCount) {
          payCount.push(element.payCount);
        } else {
          payCount.push(0);
        }
        if (element.payCountByPeople) {
          payCountByPeople.push(element.payCountByPeople);
        } else {
          payCountByPeople.push(0);
        }
        if (element.actualPayCount) {
          actualPayCount.push(element.actualPayCount);
        } else {
          actualPayCount.push(0);
        }
        if (element.unitPriceByOne) {
          unitPriceByOne.push(element.unitPriceByOne);
        } else {
          unitPriceByOne.push(0);
        }
        if (element.relationDate) {
          timeData.push(element.relationDate);
        } else {
          timeData.push("没有日期");
        }
      });
      console.log(
        "图表数据",
        payAmount,
        payCount,
        payCountByPeople,
        actualPayCount,
        unitPriceByOne,
        timeData
      );
      let arr = [];
      arr.push(payAmount);
      arr.push(payCount);
      arr.push(payCountByPeople);
      arr.push(actualPayCount);
      arr.push(unitPriceByOne);
      let colorData = ["#289ffa", "#2fa", "#89f", "#29a", "#91c"];
      let typeData = ["solid", "dotted", "solid", "dotted", "dashed"];
      let nameData = ["今日数据", "昨日数据"];
      arr.forEach((element, index) => {
        console.log("shuju", element);
        let tempObj = {
          // 3-1-1 主题色(包括线的颜色)
          colorStyle: colorData[index],
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: typeData[index],
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图)为主 之后再扩充
          showType: "line",
          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: "path",
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: "",
          // 3-1-6 对应的数据
          xAxisData: element,
          // 3-1-7 该坐标的内容值
          name: nameData[index]
          // 3-1-8 饼图的颜色区分 只有设置type为
          // pieColor:['#289ffa','red','blue','pink','purple','yellow']
        };
        dataSource.push(tempObj);
      });

      let legend = {
        orient: "horizontal",
        position: {
          bottom: 0
        }
      };
      let obj = {};
      obj.title = "支付金额";
      obj.subTitle = "昨日全天:￥22,450";
      obj.dataSource = dataSource;
      obj.xAxis = timeData;
      obj.legend = legend;
      // 配置大小
      console.log("数据格式", obj);
      this.realTimeData = obj;
    },
    selectFun() {},
    dateRangeFun(data) {
      console.log(data);
    },
    screen() {
      console.log("筛选");
    },
    /**
     * 下面的
     */
    dateRangeFun(data) {
      this.startTime = "";
      this.endTime = "";
      this.timeData = 2;
    },
    timeFun(data) {
      console.log(goodsUtils.timeStampFun());
      if (data != 2) {
        this.startTime = "";
        this.endTime = "";
      }
      if (this.timeData == 1) {
        let res = goodsUtils.selectData(1);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
        console.log(res);
      } else if (this.timeData == 7) {
        let res = goodsUtils.selectData(7);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
        console.log(res);
      } else if (this.timeData == 15) {
        let res = goodsUtils.selectData(15);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
        console.log(res);
      } else if (this.timeData == 30) {
        let res = goodsUtils.selectData(30);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
      }
      console.log(this.startTime, this.endTime);
    },
    startTimeFun(value) {
      this.startTime = value;
      // 请求
    },
    endTimeFun(value) {
      this.endTime = value;
    },
    // 按周的时间
    weekdayFun(data) {
      let res = goodsUtils.callweekDay(data);
      console.log(res, "周的时间");
      this.startTime = res.mondayData;
      console.log("开始的时间", this.startTime);
      this.endTime = res.sundayData;
    },
    monthTimeFun(data) {
      if (data) {
        let con = data.substr(5);
        this.startTime = data + "-01";
        if (con) {
          let mon = con.replace(/\b(0+)/gi, "");
          let arr = ["1", "3", "5", "7", "8", "10", "12"];
          if (arr.indexOf(mon) != -1) {
            console.log(arr.indexOf(mon));
            this.endTime = data + "-31";
          } else if (mon == 2) {
            console.log(data.substr(0, 4));
            let fullYear = data.substr(0, 4);
            if (
              fullYear % 4 == 0 &&
              (fullYear % 100 != 0 || fullYear % 400 == 0)
            ) {
              this.endTime = data + "-29";
            } else {
              this.endTime = data + "-28";
            }
          } else {
            this.endTime = data + "-30";
          }
        }
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      console.log("处理后的", this.startTime, this.endTime);
    },
    addgoods() {
      this.$router.push("/@/views/goodsadd/GoodsAdd?role=0&name=1");
    },
    addpage() {
      this.$router.push("/@/views/shop/smallprogram/PageAdmin");
    },
    addmoudle() {
      this.$router.push("/@/views/shop/templatemessage/TemplateMessage");
    },
    addadverse() {
      this.$router.push("/@/views/shop/advertisement/Advertisement");
    },
    reducemoney() {
      this.$router.push("/@/views/marking/full/FullReduction");
    },
    discount() {
      this.$router.push("/@/views/marking/discount/Discount");
    },
    purchase() {
      this.$router.push("/@/views/marking/purchase/Purchase");
    },
    repurchase() {
      this.$router.push("/@/views/marking/give/Give");
    },
    coupon() {
      this.$router.push("/@/views/coupon/coupon/Coupon");
    }
  }
};
</script>

<style lang="less" scoped>
@import "./contentoverview.less";
@import "./index.less";
</style>
