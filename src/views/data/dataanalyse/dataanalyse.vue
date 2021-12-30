<template>
  <div class="data">
    <div>流量分析</div>
    <Card>
      <div class="content">
        <div slot="title" class="header">
          <Select size="small" v-model="source" style="width:120px;margin-left:10px">
            <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select
            size="small"
            v-model="dateRangeData"
            style="width:120px;"
            class="mar-le"
            @on-change="dateRangeFun"
          >
            <Option v-for="item in dateRange" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <!-- v-if="dateRangeData == 1" -->
          <Select
            size="small"
            v-if="dateRangeData == 1"
            v-model="timeData"
            style="width:170px;"
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
            :clearable="false"
          ></DatePicker>
          <Button type="primary" size="small" class="mar-le" @click="screen">筛选</Button>
        </div>

        <div class="main">
          <div class="main-head">
            <div class="con-item">
              <p class="con-title">访客数</p>
              <div class="con-info">
                <span class="num">{{Header.payAmount}}</span>
              </div>
              <p class="up">
                较前一日：%
                <Icon type="md-arrow-round-up" class="icon-jt red" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">浏览量</p>
              <div class="con-info">
                <span class="num">{{Header.payCount}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="up">
                较前一日：%
                <Icon type="md-arrow-round-up" class="icon-jt red" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">商品访客数</p>
              <div class="con-info">
                <span class="num">{{Header.payCountByPeople}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="re">
                较前一日：
                <Icon type="md-arrow-round-down" class="icon-jt green" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">商品浏览量</p>
              <div class="con-info">
                <span class="num">{{Header.actualPayCount}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="re">
                较前一日：
                <Icon type="md-arrow-round-down" class="icon-jt green" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">分享访问人数</p>
              <div class="con-info">
                <span class="num">{{Header.unitPriceByOne}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="up">
                较前一日：%
                <Icon type="md-arrow-round-up" class="icon-jt red" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">分享访问次数</p>
              <div class="con-info">
                <span class="num">{{Header.refundPrice}}</span>
                <span class="company">%</span>&nbsp;
              </div>
              <p class="up">
                较前一日：%
                <Icon type="md-arrow-round-up" class="icon-jt red" />
              </p>
            </div>
          </div>
        </div>
        <div class="main-echarts">
          <div class="echarts-box">
           
            <div class="echart-data">
              <v-chart :options="flowData" :autoresize="true" style="height:400px;width:100%;" />
              <!-- <Chart style="width:100%;height:300px;" :options="option"></Chart> -->
            </div>
          </div>
          <div class="echarts-box">
            <div class="main-top"></div>
            <div class="echart-data">
              <v-chart :options="flowData" :autoresize="true" style="height:400px;width:100%;" />
              <!-- <Chart style="width:100%;height:300px;" :options="settings"></Chart> -->
            </div>
          </div>
        </div>
        <div class="main-echarts">
          <div class="echarts-box">
            <div class="main-top">
              <div class="left">
                <span class="prefix">页面流量数据</span>
                <Select size="small" v-model="source" style="width:120px;margin-left:10px">
                  <Option
                    v-for="item in channelList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
                <DatePicker size="small" type="date" style="width: 105px;margin-left:10px" :editable="false"></DatePicker>
                <span style="margin-left:10px">至</span>
                <DatePicker size="small" type="date" style="width: 105px;margin-left:10px" :editable="false"></DatePicker>
              </div>
            </div>
            <div class="echart-data">
              <Chart style="width:100%;height:300px;" :options="lineChart"></Chart>
            </div>
          </div>
          <div class="echarts-box">
            <div class="main-top">
              <div class="left">
                <span class="prefix">页面跳出率</span>
                <Select size="small" v-model="source" style="width:120px;margin-left:10px">
                  <Option
                    v-for="item in channelList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
                <DatePicker size="small" type="date" style="width: 105px;margin-left:10px" :editable="false"></DatePicker>
                <span style="margin-left:10px">至</span>
                <DatePicker size="small" type="date" style="width: 105px;margin-left:10px"  :editable="false"></DatePicker>
              </div>
            </div>
            <div class="echart-data">
              <Chart style="width:100%;height:300px;" :options="lineList"></Chart>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="bottoms">
            <div class="bottom-a">
              <span class="word">详细数据</span>
              <Date-picker
                size="small"
                type="date"
                placeholder="选择日期"
                style="width:200px;margin-right:10px"
                :editable="false"
              ></Date-picker>至
              <Date-picker
                size="small"
                type="date"
                placeholder="选择日期"
                style="width:200px;margin-right:10px"
                 :editable="false"
              ></Date-picker>

              <div class="select">
                <Select size="small" v-model="source" style="width:120px;">
                  <Option
                    v-for="item in channelList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
                <span class="download">
                  <a href>数据下载</a>
                </span>
              </div>
            </div>
          </div>
          <div class="bottom-info">
            <Table border :columns="bottom" :data="bottomData"></Table>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import Chart from "@/components/newEcharts/chart";
import ECharts from "vue-echarts"
import goodsUtils from "@/utils/goodsUtils";
export default {
  components: {
    Chart,
    "v-chart": ECharts
  },
  data() {
    return {
      model2: "3",
      model3: "4",
      model: "2",
      type: "",
      flowData: {


          title : {
              text: '访问来源',
              subtext: '2019-07-12',
              x:'left',
              y: 'top'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              // left: 'left',
              x: '80%',
              y: '100',
              data: ['小程序渠道','分享渠道','扫码渠道','其他渠道']
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:335, name:'小程序渠道'},
                      {value:310, name:'分享渠道'},
                      {value:234, name:'扫码渠道'},
                      {value:135, name:'其他渠道'},
                   
                  ],
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
          
          
        },

      settings: {},
      lineChart: {},
      lineList:{},

      Header: {
        payAmount: 1200,
        payCount: 123,
        payCountByPeople: 1345,
        actualPayCount: 342,
        unitPriceByOne: 456,
        refundPrice: 412
      },
   
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

      pageDay: [
        {
          value: "1",
          label: "全部页面"
        },
        {
          value: "2",
          label: "店铺首页"
        },
        {
          value: "3",
          label: "购物车"
        },
        {
          value: "4",
          label: "分类页"
        },
        {
          value: "5",
          label: "会员中心"
        }
      ],
      bottom: [
        {
          title: "日期",
          key: "date",
          align: "center"
        },
        {
          title: "浏览量",
          key: "scanNum",
          align: "center"
        },
        {
          title: "访客数",
          key: "visitNum",
          align: "center"
        },
        {
          title: "分享访问次数",
          key: "shareNum",
          align: "center"
        },
        {
          title: "分享访问人数",
          key: "shareperNum",
          align: "center"
        },
        {
          title: "商品浏览量",
          key: "scan",
          align: "center"
        },
        {
          title: "商品访客数",
          key: "personNum",
          align: "center"
        }
      ],
      bottomData: [
        {
          date: "2015-10-12",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        },
        {
          date: "",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        },
        {
          date: "",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        },
        {
          date: "",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        },
        {
          date: "",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        },
        {
          date: "",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        },
        {
          date: "",
          scanNum: 18,
          visitNum: "北京市朝阳区芍药居",
          shareNum: "2",
          sharepersonNum: "2",
          scan: "2",
          personNum: ""
        }
      ]
    };
  },
  mounted() {
    this.init();
    this.set();
    this.pagePersent();
  },

  methods: {

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
   
    init() {
      console.log("123");
//  let newSettings = {};

//       // 生成数据
//       // 1.title 标题
//       let title = "访问来源";
//       // 2.副标题
//       let subTitle = "2015-05-06";
//       // 3.主要数据源
//       let dataSource = [];

//       // 4.类型 分为地图和图表
//       let chartType = "pie";

//       // 模拟数据
//       let data,
//         legend,
//         dataMap,
//         // x轴坐标title
//         xAxis = ["小程序渠道", "分享渠道", "扫码渠道", "其他渠道"];
//       for (let i = 0; i < 1; i++) {
//         // 3-1 数据源
//         data = {
//           colorStyle: "",
//           // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
//           lineType: "solid",
//           // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
//           showType: "pie",
//           // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
//           iconType: "path",
//           // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
//           iconPath: "",
//           // 3-1-6 对应的数据
//           xAxisData: [
//             Math.random() * 100,
//             Math.random() * 100,
//             Math.random() * 100,
//             Math.random() * 100
//           ],
//           // 3-1-7 该坐标的内容值
//           name: "销量" + i,
//           // 3-1-8 饼图的颜色区分 只有设置type为
//           pieColor: ["#228B22", "#EF8633", "#244AFC", "	#FFD700"]
//         };

//         // 4.图例
//         legend = {
//           // 4-1 图例  horizontal(水平) or vertical(垂直)
//           orient: "vertical",
//           // 4-2 位置 [top,right,bottom,left]
//           position: {
//               top:0,
//               right:0
//           }
//         };

//         dataSource.push(data);
//       }
//       console.log(dataSource);

//       newSettings = {
//         title,
//         subTitle,
//         dataSource,
//         legend,
//         xAxis,
//         chartType
//       };
//       this.settings = newSettings;
//     },

    },
 set() {
      console.log("123");
      let newSettings = {};

      // 生成数据
      // 1.title 标题
      let title = "访问来源";
      // 2.副标题
      let subTitle = "2015-05-06";
      // 3.主要数据源
      let dataSource = [];

      // 4.类型 分为地图和图表
      let chartType = "line";

      // 模拟数据
      let data,
        legend,
        dataMap,
        // x轴坐标title
        xAxis = ["1", "2", "3", "4"];
      for (let i = 0; i < 1; i++) {
        // 3-1 数据源
        data = {
          colorStyle: "",
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: "solid",
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
          showType: "line",
          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: "path",
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: "",
          // 3-1-6 对应的数据
          xAxisData: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ],
          // 3-1-7 该坐标的内容值
          name: "销量" + i,
          // 3-1-8 饼图的颜色区分 只有设置type为
          pieColor: ["#228B22", "#EF8633", "#244AFC", "	#FFD700"]
        };

        // 4.图例
        legend = {
          // 4-1 图例  horizontal(水平) or vertical(垂直)
          orient: "vertical",
          // 4-2 位置 [top,right,bottom,left]
          position: {
            bottom: 0
          }
        };

        dataSource.push(data);
      }
      console.log(dataSource);

      newSettings = {
        title,
        subTitle,
        dataSource,
        legend,
        xAxis,
        chartType
      };
      this.lineChart = newSettings;
    },
      pagePersent() {
      console.log("123");
      let newSettings = {};

      // 生成数据
      // 1.title 标题
      let title = "昨日";
      // 2.副标题
      let subTitle = "99.06%";
      // 3.主要数据源
      let dataSource = [];

      // 4.类型 分为地图和图表
      let chartType = "line";

      // 模拟数据
      let data,
        legend,
        dataMap,
        // x轴坐标title
        xAxis = ["1", "2", "3", "4"];
      for (let i = 0; i < 1; i++) {
        // 3-1 数据源
        data = {
          colorStyle: "",
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: "solid",
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
          showType: "line",
          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: "path",
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: "",
          // 3-1-6 对应的数据
          xAxisData: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ],
          // 3-1-7 该坐标的内容值
          name: "销量" + i,
          // 3-1-8 饼图的颜色区分 只有设置type为
          pieColor: ["#228B22", "#EF8633", "#244AFC", "	#FFD700"]
        };

        // 4.图例
        legend = {
          // 4-1 图例  horizontal(水平) or vertical(垂直)
          orient: "vertical",
          // 4-2 位置 [top,right,bottom,left]
          position: {
            bottom: 0
          }
        };

        dataSource.push(data);
      }
      console.log(dataSource);

      newSettings = {
        title,
        subTitle,
        dataSource,
        legend,
        xAxis,
        chartType
      };
      this.lineList = newSettings;
    },
  }
};
</script>
<style lang="less" scoped>
@import "./dataanalyse.less";
</style>

    