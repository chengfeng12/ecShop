<template>
  <div id="overview" class="data-box">
    <div class="currentTitle">数据概览</div>
    <Card>
      <div class="header">
        <div class="left">
          <div class="head-title">
            <span style="color: rgb(17, 148, 246)">实时看板</span>
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
                  <span class="num">{{Head.payCountByPeople}}</span>&nbsp;
                  <span class="company">人</span>
                </div>
                <p class="con-compare" :class="{'red': true}">
                  昨日全天：人
                  <Icon type="md-arrow-round-up" class="icon-jt red" />
                  <Icon type="md-arrow-round-down" class="icon-jt green" />
                </p>
              </div>
              <div class="con-box">
                <p class="item-title">付款订单数</p>
                <div>
                  <span class="num">{{Head.actualPayCount}}</span>&nbsp;
                  <span class="company">笔</span>
                </div>
                <p class="con-compare" :class="{'red': true}">
                  昨日全天：笔
                  <Icon type="md-arrow-round-up" class="icon-jt red" />
                  <Icon type="md-arrow-round-down" class="icon-jt green" />
                </p>
              </div>
            </div>
            <div class="content">
              <div class="con-box">
                <p class="item-title">付款转化率</p>
                <div>
                  <span class="num">无</span>&nbsp;
                  <span class="company">%</span>
                </div>
                <p class="con-compare" :class="{'red': true}">
                  昨日全天：%
                  <Icon type="md-arrow-round-up" class="icon-jt red" />
                  <Icon type="md-arrow-round-down" class="icon-jt green" />
                </p>
              </div>
              <div class="con-box">
                <p class="item-title">客单价</p>
                <div>
                  <span class="company">￥</span>&nbsp;
                  <span class="num">{{Head.unitPriceByOne}}</span>
                </div>
                <p class="con-compare" :class="{'red': true}">
                  昨日全天：￥
                  <Icon type="md-arrow-round-up" class="icon-jt red" />
                  <Icon type="md-arrow-round-down" class="icon-jt green" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="main-top">
          <div class="left">
            <span class="prefix">整体看板</span>
            <div slot="title" class="header">
              <Select
                size="small"
                v-model="dateRangeData"
                style="width:120px;"
                class="mar-le"
                @on-change="dateRangeFun"
              >
            
                <Option v-for="item in dateRange" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
              <Select
                size="small"
                v-if="dateRangeData == 1"
                v-model="timeData"
                style="width:150px;"
                @on-change="timeFun"
                class="mar-le"
              >
                <Option v-for="item in dateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>

              <!-- 按天 -->
              <span v-if="dateRangeData == 1">
                <DatePicker
                  size="small"
                  :editable="false"
                  :disabled="timeData != 2"
                  type="date"
                  format="yyyy-MM-dd"
                  class="mar-le"
                  :value="startTime"
                  @on-change="startTimeFun"
                  style="width: 150px;"
                  :clearable="false"
                ></DatePicker>
                <span class="mar-le">至</span>
                <DatePicker
                  size="small"
                  :editable="false"
                  :disabled="timeData != 2"
                  type="date"
                  format="yyyy-MM-dd"
                  class="mar-le"
                  :value="endTime"
                  @on-change="endTimeFun"
                  style="width: 150px;"
                  :clearable="false"
                ></DatePicker>
              </span>

              <!-- 按周 -->
              <span v-if="dateRangeData == 7">
                <DatePicker
                  size="small"
                  :editable="false"
                  :disabled="false"
                  type="date"
                  format="yyyy-MM-dd"
                  class="mar-le"
                  v-model="startTime"
                  @on-change="weekdayFun"
                  style="width: 200px;"
                  :clearable="false"
                ></DatePicker>
                <span class="mar-le">至</span>
                <DatePicker
                  size="small"
                  :editable="false"
                  :disabled="true"
                  type="date"
                  format="yyyy-MM-dd"
                  class="mar-le"
                  :value="endTime"
                  style="width: 200px;"
                  :clearable="false"
                ></DatePicker>
              </span>

              <!-- 按月 -->
              <DatePicker
                v-if="dateRangeData == 30"
                size="small"
                :editable="false"
                type="month"
                format="yyyy-MM"
                class="mar-le"
                v-model="startTimeMon"
                @on-change="monthTimeFun"
                style="width: 200px;"
                :clearable="false"
              ></DatePicker>
            </div>
          </div>
          <div class="right">
            <Select size="small" v-model="source" style="width:200px;" @on-change="selectFun">
              <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
        </div>
        <div class="main-head">
          <div class="con-item">
            <p class="con-title">浏览量</p>
            <div class="con-info">
              <span class="num">{{Header.lll}}</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">访客数</p>
            <div class="con-info">
              <span class="num">{{Header.fks}}</span>&nbsp;
              <span class="company">人</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">待发货订单数</p>
            <div class="con-info">
              <span class="num">{{Header.ddfhs}}</span>&nbsp;
              <span class="company">笔</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">付款人数</p>
            <div class="con-info">
              <span class="num">{{Header.payCountByPeople}}</span>&nbsp;
              <span class="company">人</span>
            </div>
            <p class="con-compare" :class="{'red': Header.beforeData.payCountByPeopleBeforeOnePerc * 1 > 0, 'green': Header.beforeData.payCountByPeopleBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.payCountByPeopleBeforeOnePerc}}%<Icon v-if="Header.beforeData.payCountByPeopleBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.payCountByPeopleBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
          </div>
          <div class="con-item">
            <p class="con-title">付款订单数</p>
            <div class="con-info">
              <span class="num">{{Header.actualPayCount}}</span>&nbsp;
              <span class="company">笔</span>
            </div>
            <p class="con-compare" :class="{'red': Header.beforeData.actualPayCountBeforeOnePerc * 1 > 0, 'green': Header.beforeData.actualPayCountBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.actualPayCountBeforeOnePerc}}%<Icon v-if="Header.beforeData.actualPayCountBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.actualPayCountBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
          </div>
          <div class="con-item">
            <p class="con-title">支付金额（元）</p>
            <div class="con-info">
              <span class="company">￥</span>&nbsp;
              <span class="num">{{Header.payAmount}}</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
        </div>
        <div class="main-head">
          <div class="con-item">
            <p class="con-title">加购物车人数</p>
            <div class="con-info">
              <span class="num">{{Header.jgwc}}</span>&nbsp;
              <span class="company">人</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">客单价（元）</p>
            <div class="con-info">
              <span class="company">￥</span>&nbsp;
              <span class="num">{{Header.unitPriceByOne}}</span>
            </div>
            <p class="con-compare" :class="{'red': Header.beforeData.unitPriceByOneBeforeOnePerc * 1 > 0, 'green': Header.beforeData.unitPriceByOneBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.unitPriceByOneBeforeOnePerc}}%<Icon v-if="Header.beforeData.unitPriceByOneBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.unitPriceByOneBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
          </div>
          <div class="con-item">
            <p class="con-title">人均购买件数</p>
            <div class="con-info">
              <span class="num">{{Header.rjgm}}</span>&nbsp;
              <span class="company">件</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">在售商品数</p>
            <div class="con-info">
              <span class="num">{{Header.zssp}}</span>&nbsp;
              <span class="company">件</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">售罄商品数</p>
            <div class="con-info">
              <span class="num">{{Header.sqsp}}</span>&nbsp;
              <span class="company">件</span>
            </div>
            <p class="con-compare" :class="{'red': true}">
              较前一日：%
              <Icon type="md-arrow-round-up" class="icon-jt red" />
              <Icon type="md-arrow-round-down" class="icon-jt green" />
            </p>
          </div>
          <div class="con-item">
            <p class="con-title">退款订单金额</p>
            <div class="con-info">
              <span class="company">￥</span>&nbsp;
              <span class="num">{{Header.refundPrice}}</span>
            </div>
            <p class="con-compare" :class="{'red': Header.beforeData.refundPriceBeforeOnePerc * 1 > 0, 'green': Header.beforeData.refundPriceBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.refundPriceBeforeOnePerc}}%<Icon v-if="Header.beforeData.refundPriceBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.refundPriceBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
          </div>
        </div>
      </div>
      <div class="main-echarts">
        <div class="echarts-box">
          <div class="main-top">
            <div class="left">
              <span class="prefix">订单相关趋势</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 120px;"
                class="mar-le"
                :editable="false"
                @on-change="trendTimeOneFun"
              ></DatePicker>
              <span class="mar-le">至</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 120px;"
                class="mar-le"
                :editable="false"
                @on-change="trendTimeTwoFun"
              ></DatePicker>
            </div>
            <div class="right">
              <Select size="small" class="mar-le" v-model="type" style="width:110px;">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
          </div>
          <div class="echart-data">
            <echarts :options="realTimeData" style="height: 500px;width:100%;" />
          </div>
        </div>
        <div class="echarts-box">
          <div class="main-top">
            <div class="left">
              <span class="prefix">购买转换率</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 120px;"
                class="mar-le"
                :editable="false"
                @on-change="detailStartOneFun"
              ></DatePicker>
              <span class="mar-le">至</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 120px;"
                class="mar-le"
                :editable="false"
                @on-change="detailStartTwoFun"
              ></DatePicker>
            </div>
            <div class="right">
              <Select size="small" class="mar-le" v-model="type" style="width:110px;">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
          </div>
          <div class="echart-data">
            <div class="echart-tit-box">
              <p>平均转换率：12%</p>
              <div class="echart-tit-btm">
                <div>
                  <p>
                    环比
                    <Icon type="md-arrow-dropup" class="icon-triangle green" />
                    <Icon type="md-arrow-dropdown" class="icon-triangle red" />
                    <span class="red">1.33%</span>
                  </p>
                  <p>
                    同比
                    <Icon type="md-arrow-dropup" class="icon-triangle green" />
                    <Icon type="md-arrow-dropdown" class="icon-triangle red" />
                    <span class="green">1.33%</span>
                  </p>
                </div>
              </div>
            </div>
            <echarts :options="realTimeData" style="height: 406px;width:100%;" />
          </div>
        </div>
      </div>
      <div class="main-echarts">
        <div class="echarts-box">
          <div class="main-top">
            <div class="left">
              <span class="prefix">客单价</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 105px;"
                class="mar-le"
                :editable="false"
                @on-change="PassUnitStartOneFun"
              ></DatePicker>
              <span class="mar-le">至</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 105px;"
                class="mar-le"
                :editable="false"
                @on-change="PassUnitStartTwoFun"
              ></DatePicker>
            </div>
            <div class="right">
              <Select size="small" class="mar-le" v-model="type" style="width:110px;">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
          </div>
          <div class="echart-data">
            <div class="echart-tit-box">
              <p>平均客单价：517</p>
              <div class="echart-tit-btm">
                <div>
                  <p>
                    环比
                    <Icon type="md-arrow-dropup" class="icon-triangle green" />
                    <Icon type="md-arrow-dropdown" class="icon-triangle red" />
                    <span class="red">1.33%</span>
                  </p>
                  <p>
                    同比
                    <Icon type="md-arrow-dropup" class="icon-triangle green" />
                    <Icon type="md-arrow-dropdown" class="icon-triangle red" />
                    <span class="green">1.33%</span>
                  </p>
                </div>
                <div>
                  <p>合计&nbsp;414</p>
                  <p>均值&nbsp;512</p>
                </div>
              </div>
            </div>
            <echarts :options="realTimeData" style="height: 406px;width:100%;" />
          </div>
        </div>
        <div class="echarts-box">
          <div class="main-top">
            <div class="left">
              <span class="prefix">浏览量及访客数趋势</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 105px;"
                class="mar-le"
                :editable="false"
                @on-change="browVolStartOneFun"
              ></DatePicker>
              <span class="mar-le">至</span>
              <DatePicker
                size="small"
                type="date"
                format="yyyy-MM-dd"
                style="width: 105px;"
                class="mar-le"
                :editable="false"
                @on-change="browVolStartOneFun"
              ></DatePicker>
            </div>
            <div class="right">
              <Select size="small" class="mar-le" v-model="type" style="width:110px;">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
          </div>
          <div class="echart-data">
            <echarts :options="realTimeData" style="height: 500px;width:100%;" />
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
      transactionStartTime: "",
      transactionEndTime: "",
      detailStartTime: "",
      detailEndTime: "",
      startTime: "",
      endTime: "",
      startTimeMon: "",
      Head: {
        payCountByPeople: 0,
        actualPayCount: 0,
        unitPriceByOne: 0,
        beforeData: []
      },
      /**
       * 上面的
       */
      Header: {
        lll: 0,
        fks: 0,
        ddfhs: 0,
        payCountByPeople: 0,
        actualPayCount: 0,
        payAmount: 0,
        jgwc: 0,
        unitPriceByOne: 0,
        rjgm: 0,
        zssp: 0,
        sqsp: 0,
        refundPrice: 0,
        beforeData: []
      },
      trendTimeStart: "",
      trendTimeEnd: "",
      purchaseTimeStart: "",
      purchaseTimeEnd: "",
      PassUnitPriceStart: "",
      PassUnitPriceEnd: "",
      browVolumeStart: "",
      browVolumeEnd: "",
      // 实时看板
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
      dataApi.transactionData({
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
        }).then(res => {
          if (res.code == 1) {
            this.integrationData(res.data);
          } else {
            this.$Message.error(res.message);
          }
        }).catch(err => {
          console.log(err);
        })
        let res = goodsUtils.selectData(1)
        let startTime = res.startTime
        let endTime = res.endTime
        dataApi.screeningData({
          'startTime': startTime,
          'endTime': endTime,
          'source': 1
        }).then(res => {
          if (res.code == 1) {
              console.log(res,res.data.newCustValue,res.data.oldCustValue,'我是搜索11111的数据')
              this.Head.payCountByPeople = res.data.payCountByPeople
              this.Head.actualPayCount = res.data.actualPayCount
              this.Head.unitPriceByOne = res.data.unitPriceByOne
              this.Head.beforeData = res.data.beforeData ? res.data.beforeData : []
          } else {
              this.$Message.error(res.message)
          }
        }).catch(err => {
            console.log(err)
        })
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
      let nameData = [
        "支付金额",
        "支付订单数",
        "付款人数",
        "付款订单数",
        "客单价"
      ];
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
      obj.title = "";
      obj.subTitle = "";
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
      } else if (this.timeData == 7) {
        let res = goodsUtils.selectData(7);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
      } else if (this.timeData == 15) {
        let res = goodsUtils.selectData(15);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
      } else if (this.timeData == 30) {
        let res = goodsUtils.selectData(30);
        this.startTime = res.startTime;
        this.endTime = res.endTime;
      } else {
        return false
      }
      // 请求接口
      this.getHeaderOne()
      console.log(this.startTime, this.endTime);
    },
    getHeaderOne() {
      console.log('123')
      dataApi.screeningData({
        'startTime': this.startTime,
        'endTime': this.endTime,
        'source': 1
      }).then(res => {
        if (res.code == 1) {
            console.log(res,'我是搜索2222的数据')
            this.Header.payAmount = goodsUtils.threeNumReplice(res.data.payAmount)
            this.Header.payCountByPeople = res.data.payCountByPeople
            this.Header.actualPayCount = res.data.actualPayCount
            this.Header.unitPriceByOne = res.data.unitPriceByOne
            this.Header.refundPrice = res.data.refundPrice,
            this.Header.beforeData = res.data.beforeData ? res.data.beforeData : []
        } else {
            this.$Message.error(res.message)
        }
      }).catch(err => {
          console.log(err)
      })
    },
    startTimeFun(value) {
      this.startTime = value;
      this.startTime = value
      if (this.endTime && this.startTime) {
        this.getHeaderOne()
      }
      // 请求
    },
    endTimeFun(value) {
      this.endTime = value;
      this.endTime = value
      if (this.endTime && this.startTime) {
        this.getHeaderOne()
      }
    },
    // 按周的时间
    weekdayFun(data) {
      let res = goodsUtils.callweekDay(data);
      console.log(res, "周的时间");
      this.startTime = res.mondayData;
      console.log("开始的时间", this.startTime);
      this.endTime = res.sundayData;
      this.getHeaderOne()
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
      this.getHeaderOne()
      console.log("处理后的", this.startTime, this.endTime);
    },
    /**
     * 上面的
     */
    // transactionStartTimeFun(value) {
    //     this.transactionStartTime = value
    //     if (this.transactionEndTime && this.transactionStartTime) {
    //         this.transactionData()
    //     }
    // },
    trendTimeOneFun(data) {
      console.log(data);
      this.trendTimeStart = data;
    },

    trendTimeTwoFun(data) {
      this.trendTimeEnd = data;
    },
    detailStartOneFun(data) {
      this.purchaseTimeStart = data;
    },
    detailStartTwoFun(data) {
      this.purchaseTimeEnd = data;
    },
    PassUnitStartOneFun(data) {
      this.PassUnitPriceStart = data;
    },
    PassUnitStartTwoFun(data) {
      this.PassUnitPriceEnd = data;
    },
    browVolStartOneFun(data) {
      this.browVolumeStart = data;
    },
    browVolStartTwoFun(data) {
      this.browVolumeEnd = data;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
@import "../style/index.less";
</style>

