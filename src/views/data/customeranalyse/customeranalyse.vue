<template>

  <div class="customeranalyse">
    <div>客群分析</div>
    <Card>
      <div class="content">
        <div slot="title" class="header">
          <Select size="small" v-model="source" style="width:120px;">
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
          <Button type="primary" size="small" class="mar-le" @click="screen">搜索</Button>
        </div>
        <div class="main">
          <div class="main-head">
            <div class="con-item">
              <p class="con-title">访客数</p>
              <div class="con-info">
                <span class="num">{{Header.payAmount}}</span>
                <span class="company">人</span>
              </div>
              <p class="up">
                较前一日：{{custDataBeforeVo.uvCountBeforeOnePerc}}%
                <Icon type="md-arrow-round-up" class="icon-jt red" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">新增客户数</p>
              <div class="con-info">
                <span class="num">{{Header.payCount}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="up">
                较前一日：{{custDataBeforeVo.uvCountBeforeOnePerc}}%
                <Icon type="md-arrow-round-up" class="icon-jt red" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">累计客户数</p>
              <div class="con-info">
                <span class="num">{{Header.payCountByPeople}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="re">
                较前一日：{{custDataBeforeVo.uvCountBeforeOnePerc}}
                <Icon type="md-arrow-round-down" class="icon-jt green" />
              </p>
            </div>
            <div class="con-item">
              <p class="con-title">新增会员数</p>
              <div class="con-info">
                <span class="num">{{Header.actualPayCount}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="refund">较前一日：{{custDataBeforeVo.uvCountBeforeOnePerc}}</p>
            </div>
            <div class="con-item">
              <p class="con-title">累计会员数</p>
              <div class="con-info">
                <span class="num">{{Header.unitPriceByOne}}</span>&nbsp;
                <span class="company">人</span>
              </div>
              <p class="refund">较前一日：{{custDataBeforeVo.uvCountBeforeOnePerc}}</p>
            </div>
            <div class="con-item">
              <p class="con-title">累计会员占比</p>
              <div class="con-info">
                <span class="num">{{Header.refundPrice}}</span>
                <span class="company">%</span>&nbsp;
              </div>
              <p class="refund">较前一日：{{custDataBeforeVo.uvCountBeforeOnePerc}}</p>
            </div>
          </div>
        </div>
        <div class="center-t">
          <div slot="title" class="header">
            <Select size="small" v-model="source" style="width:120px;">
              <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>

            <Select size="small" v-if="dateRangeData == 1" v-model="dateRangeTowData" style="width:170px;" @on-change="timeFun" class="mar-le">
                <Option v-for="item in dateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>

             <span>
                  <DatePicker size="small" :editable="false" :disabled="true" type="date" format="yyyy-MM-dd" class="mar-le" :value="startTimeTow" @on-change="startTimeTwoFun" :clearable="false"></DatePicker>
                  <span class="mar-le">至</span>
                  <DatePicker size="small" :editable="false" :disabled="true" type="date" format="yyyy-MM-dd" class="mar-le" :value="endTimeTow" @on-change="endTimeTwoFun" :clearable="false"></DatePicker>
              </span>
          </div>
        </div>
        <div class="center">
          <p class="word-tit">客户属性</p>
          <p style="margin-left:30px">{{custPropSexInfoVo.refDate}}</p>
          <p class="sexA" style="margin-left:50px">性别分析</p>
          <div class="container">
            <div class="sex">
              <div class="image-item">
                <Poptip trigger="hover" placement="right-start">
                  <img src="static/img/man.png" style="width:50px" />
                  <div slot="content">男性性别占比：{{custPropSexInfoVo.maleToScale}}%</div>
                  <div slot="content">男性性别：{{custPropSexInfoVo.maleCount}}人</div>
                  <div slot="content">总客户数：{{custPropSexInfoVo.totalCustCount}} 人</div>
                </Poptip>
                <p style="margin-left:7px">{{custPropSexInfoVo.maleToScale}}%</p>
              </div>
              <div class="image-item">
                <Poptip trigger="hover" placement="right-start">
                  <img src="static/img/woman.png" style="width:50px" />
                  <div slot="content">女性性别占比：{{custPropSexInfoVo.femaleToScale}}%</div>
                  <div slot="content">女性性别：{{custPropSexInfoVo.femaleCount}}人</div>
                  <div slot="content">总客户数：{{custPropSexInfoVo.totalCustCount}} 人</div>
                </Poptip>
                <p style="margin-left:7px">{{custPropSexInfoVo.femaleToScale}}%</p>
              </div>
              <div class="image-item">
                <Poptip trigger="hover" placement="right-start">
                  <img src="static/img/childern.png" style="width:50px;" />
                  <div slot="content">未知性别占比：{{custPropSexInfoVo.unknownToScale}}%</div>
                  <div slot="content">未知性别：{{custPropSexInfoVo.unknownCount}}人</div>
                  <div slot="content">总客户数：{{custPropSexInfoVo.totalCustCount}} 人</div>
                </Poptip>
                <p style="margin-left:17px">{{custPropSexInfoVo.unknownToScale}}%</p>
              </div>
            </div>
            <div class="age">
              <p class="ageA">年龄分析</p>
              <div class="age-data">
                <Chart style="width:100%;height:300px;" :options="barChart"></Chart>
              </div>
            </div>
          </div>
          <div class="middle">
            <p class="word-tit">地域分析</p>
            <p style="margin-left:30px">{{custPropSexInfoVo.refDate}}</p>
            <div class="echart">
              <div class="echart-data">
                <Chart style="width:100%;height:500px;" :options="settings"></Chart>
              </div>
              <div class="part-info">
                <Table border :columns="part" :data="partData" style="width:300px;"></Table>
              </div>
            </div>
          </div>
        </div>
        <div class="customer">
          <p>成交客户分析</p>
          <span style="margin-left:30px">{{all.refDate}}</span>
          <div slot="title" class="customer-header">
            <Select size="small" v-model="source" style="width:120px;margin-left:50px;">
              <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        
           <Date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              style="width: 200px;margin-right:10px"
              :editable="false"
              v-model="startTimeThree"
              @on-change="changeTime($event,'startTimeThree')"
            ></Date-picker>至
            <Date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              style="width: 200px;margin-right:10px"
              :editable="false"
              v-model="endTimeThree"
              @on-change="changeTime($event,'endTimeThree')"
            ></Date-picker>
          

           
          </div>
          <span class="download">
            <a href>数据下载</a>
          </span>
          <div class="customer-info">
            <Table border :columns="customer" :data="customerData"></Table>
          </div>
        </div>
        <div class="custend">
          <div class="left">
            <span class="word">客户趋势图</span>
            <Select size="small" @on-change="changeKhType" v-model="khtype" style="width:100px;margin-right:10px">
              <Option
                v-for="item in customerList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
            <Date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              style="width: 200px;margin-right:10px"
              :editable="false"
              v-model="startcust"
              @on-change="changeKhTime($event,'startcust')"
            ></Date-picker>至
            <Date-picker
              size="small"
              type="date"
              placeholder="选择日期"
              style="width: 200px;margin-right:10px"
              :editable="false"
              v-model="endcust"
              @on-change="changeKhTime($event,'endcust')"
            ></Date-picker>
          </div>
          <div class="right-t">
            <Select size="small" v-model="source" style="width:120px;">
              <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="test">
            <Chart style="width:100%;height:400px;" :options="lineChart"></Chart>
          </div>
        </div>

    
      </div>
    </Card>
  </div>
</template>
<script>
import Chart from "@/components/newEcharts/chart";
import goodsUtils from "@/utils/goodsUtils";
import dataApi from "@/api/request/users.js";
export default {
  components: {
    Chart
  },
  data() {
    return {
      model2: "3",
      model3: "4",
      khtype: "2",
      ktype:"1",
 
      Header: {
        payAmount: "",
        payCount: "",
        payCountByPeople: "",
        actualPayCount: "",
        unitPriceByOne: "",
        refundPrice: "",
    
      },

      custDataBeforeVo:{
uvCountBeforeOnePerc:"",
      },
      // 客户属性性别
      custPropSexInfoVo: {
        //  总客户数
        totalCustCount: "",
        // 男性总数量
        maleCount: "",
        // 男性占比
        maleToScale: "",
        // 女性总数量
        femaleCount: "",
        // 女性占比
        femaleToScale: "",
        // 未知总数量
        unknownCount: "",
        // 未知占比
        unknownToScale: "",
        // 关系日期
        refDate: ""
      },
      all: {
        refDate: ""
      },
      settings: {},
      lineChart: {},
      barChart: {},

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
      dateRangeTowData: 1,
      dateRangeThreeData: 1,
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
          name: "最近一天"
        },
        {
          id: 7,
          name: "最近7天"
        },

        {
          id: 30,
          name: "最近30天"
        }
      ],
      startcust: "2019-07-30",
      endcust: "2019-07-30",
      content: "",
      startTime: "2019-07-30",
      endTime: "2019-07-30",
      startTimeMon: "",
      startTimeMonTow: "",
      startTimeThreeMon: "",
      startTimeTow: "",
      endTimeTow: "",

      startTimeThree: "",
      endTimeThree: "",

      timeDataTow: 1,

      shopId: 1,
      tab: [
        {
          title: "成交时间",
          key: "time",
          align: "center"
        },
        {
          title: "新成交客户数",
          key: "timeName",
          align: "center"
        },
        {
          title: "第1月留存",
          key: "timeSave",
          align: "center"
        },
        {
          title: "第2月留存",
          key: "timeSecond",
          align: "center"
        },
        {
          title: "第3月留存",
          key: "timeThree",
          align: "center"
        },
        {
          title: "第4月留存",
          key: "timeFour",
          align: "center"
        },
        {
          title: "第5月留存",
          key: "timeFive",
          align: "center"
        }
      ],
      tabData: [
        {
          time: 0,
          timeName: "",
          timeSave: "222",
          timeSecond: "333",
          timeThree: "",
          timeFour: "",
          timeFive: ""
        },
        {},
        {},
        {},
        {}
      ],
      mothday: [
        {
          value: "1",
          label: "月留存"
        },
        {
          value: "2",
          label: "周留存"
        }
      ],
      customerList: [
        {
          value: "1",
          label: "成交客户数"
        },
        {
          value: "2",
          label: "支付订单数"
        },
        {
          value: "3",
          label: "客单价"
        },
        {
          value: "4",
          label: "支付金额"
        }
      ],

      day: [
        {
          id: 1,
          name: "最近1天"
        },
        {
          id: 7,
          name: "最近7天"
        },
        {
          id: 30,
          name: "最近30天"
        }
      ],
      dayList: [
        {
          id: 1,
          name: "昨天"
        },
        {
          id: 7,
          name: "最近7天"
        },

        {
          id: 30,
          name: "最近30天"
        }
      ],
      customer: [
        {
          title: "客户类型",
          key: "custTypeEn",
          align: "center"
        },
        {
          title: "成交客户数",
          key: "tradeSuccessCount",
          align: "center"
        },
        {
          title: "客户数占比",
          key: "custCountToScale",
          align: "center",
          render: (h, params) => {
            let text = params.row.custCountToScale;
            let type = params.row.custCountToScale > 0 ? "%" : "";
            return h("span", text + type);
          }
        },
        {
          title: "支付订单数",
          key: "payCount",
          align: "center"
        },
        {
          title: "客单价(元)",
          key: "unitPriceByOne",
          align: "center"
        },
        {
          title: "支付金额(元)",
          key: "payAmount",
          align: "center"
        },
        {
          title: "支付金额占比",

          align: "center",
          render: (h, params) => {
            let text = params.row.payAmountToScale;
            let type = params.row.payAmountToScale > 0 ? "%" : "";
            return h("span", text + type);
          }
        }
      ],
      customerData: [],
      part: [
        {
          title: "TOP",
          key: "partType",
          align: "center"
        },
        {
          title: "地区",
          key: "partArea",
          align: "center"
        },
        {
          title: "客户数",
          key: "partNum",
          align: "center"
        }
      ],
      partData: []
    };
  },
  mounted() {
    // 图表控件
    this.init();
    // 访问数据
    this.custData();
    // 客户属性
    this.selectcustomer();
    // 成交客户分析
    this.analyse();
    // 客户趋势图
    this.analydata();
  },
  methods: {
    dateRangeThreeFun(data) {
      console.log(data);
    },
    screen() {
      console.log("筛选");
      this.custData()
      
    },
    
 changeTime(e,type){
      this[type] = e
      this. analyse()
    },


    changeKhTime(e,type){
      this[type] = e
      this.analydata()
    },
    changeKhType(e){
      console.log(e)
      this.khtype = e
      this.analydata()
    },

    //查询访问数据
    custData() {
      console.log("123");
      dataApi
        .visitData({
          startTime: this.startTime
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.startTime))
            : goodsUtils.selectData(30).startTime,
          endTime: this.endTime
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.endTime))
            : goodsUtils.selectData(30).endTime,
          source: this.source,
          shopId: this.shopId
        })
        .then(res => {
          if (res.code == 1) {
            console.log(res, "haha");
            this.Header.payAmount = goodsUtils.threeNumReplice(
              res.data.uvCount
            );
            this.Header.payCount = res.data.newAddCustCount;
            this.Header.payCountByPeople = res.data.totalCustCount;
            this.Header.actualPayCount = res.data.newAddMemberCount;
            this.Header.unitPriceByOne = res.data.totalMemberCount;
            this.Header.refundPrice = res.data.totalMemberToPerc;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //查询客户分析数据
    selectcustomer() {
      dataApi
        .selCustAnalyData({
          startTime: this.startTimeTow
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.startTimeTow))
            : goodsUtils.selectData(30).startTimeTow,
          endTime: this.endTimeTow
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.endTimeTow))
            : goodsUtils.selectData(30).endTimeTow,
          source: this.source,
          shopId: this.shopId
        })
        .then(res => {
          // console.log("res----------------------------- ",res)
          if (res.code == 1) {
            this.makeMap(res.data.areaAnalyzeInfoVoList);
            this.age(res.data.wxCustAgeList);

            let con = [];
            res.data.areaAnalyzeInfoVoList.forEach((element, index) => {
              let obj = {};
              if (element.partType) {
                obj.partType = element.top;
              } else {
                obj.partType = "";
              }
              obj.partType = element.top;
              obj.partArea = element.area;
              obj.partNum = element.custCountByArea;

              con.push(obj);
            });
            this.partData = con;
            this.custPropSexInfoVo.totalCustCount =
              res.data.custPropSexInfoVo.totalCustCount;
            this.custPropSexInfoVo.maleCount =
              res.data.custPropSexInfoVo.maleCount;
            this.custPropSexInfoVo.maleToScale =
              res.data.custPropSexInfoVo.maleToScale;
            this.custPropSexInfoVo.femaleCount =
              res.data.custPropSexInfoVo.femaleCount;
            this.custPropSexInfoVo.femaleToScale =
              res.data.custPropSexInfoVo.femaleToScale;
            this.custPropSexInfoVo.unknownCount =
              res.data.custPropSexInfoVo.unknownCount;

            this.custPropSexInfoVo.unknownToScale =
              res.data.custPropSexInfoVo.unknownToScale;
            this.custPropSexInfoVo.refDate = res.data.refDate;
            
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //客户趋势图
    analydata() {
      dataApi
        .getTendencyMapData({
          startTime: this.startcust
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.startcust))
            : goodsUtils.selectData(30).startcust,
          endTime: this.endcust
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.endcust))
            : goodsUtils.selectData(30).endcust,
          source: this.source,
          shopId: this.shopId,
          dataType: this.khtype
        })
        .then(res => {
          if (res.code == 1) {
            console.log(res.data)
            this.set(res.data)
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //成交客户分析
    analyse() {
      console.log("-----------------this.startTimeThree",this.startTimeThree)
      dataApi
        .getTradeScuInfo({
          startTime: this.startTimeThree ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.startTimeThree)) : goodsUtils.selectData(30).startTimeThree,
          endTime: this.endTimeThree
            ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.endTimeThree))
            : goodsUtils.selectData(30).endTimeThree,
          source: this.source,
          shopId: this.shopId
        })
        .then(res => {
          
          if (res.code == 1) {
            //将后台数据转换成数组形式
            this.all.refDate = res.data.all.refDate;
            this.customerData=[]
            this.customerData.push(res.data.all);
            this.customerData.push(res.data.newCust);
            this.customerData.push(res.data.oldCust);
            console.log("res-------------------", this.customerData);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    /**
     * 访客数
     */
    dateRangeFun(data) {
      console.log("data-------------------------",data)
      if(data==1){
        let timeList = goodsUtils.selectData(1);
        this.startTime = timeList.startTime;
        this.endTime = timeList.endTime;
      }
      else{
        this.startTime = "";
        this.endTime = "";
       
      }
       this.timeData = 2;
     
    },
    timeFun(data) {
      console.log(goodsUtils.timeStampFun());
      // if (data != 2) {
      //   this.startTime = "";
      //   this.endTime = "";
      // }
      if (data == 1) {
        let res = goodsUtils.selectData(1);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
        console.log(res);
      } else if (data == 7) {
        let res = goodsUtils.selectData(7);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
        console.log(res);
      } else if (data == 15) {
        let res = goodsUtils.selectData(15);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
        console.log(res);
      } else if (data == 30) {
        let res = goodsUtils.selectData(30);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
      }
      this.selectcustomer()
      // console.log(this.startTimeTow, this.endTimeTow, '123123123');
    },
    startTimeFun(value) {
      this.startTime = value;
      this.endTime = value;
      // 请求
      this.custData()

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
       this.custData()
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
      this.custData()     
    },



    timeTowFun(data) {
      console.log(goodsUtils.timeStampFun());
      if (data != 2) {
        this.startTimeTow = "";
        this.endTimeTow = "";
      }
      if (this.timeDataTow == 1) {
        let res = goodsUtils.selectData(1);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
        console.log(res);
      } else if (this.timeDataTow == 7) {
        let res = goodsUtils.selectData(7);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
        console.log(res);
      } else if (this.timeDataTow == 15) {
        let res = goodsUtils.selectData(15);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
        console.log(res);
      } else if (this.timeDataTow == 30) {
        let res = goodsUtils.selectData(30);
        this.startTimeTow = res.startTime;
        this.endTimeTow = res.endTime;
      }
      console.log(this.startTimeTow, this.endTimeTow);
    },


    endTimeTowFun(value) {
      this.endTimeTow = value;
    },
  



    init() {
      let timeList = goodsUtils.selectData(1);
      this.startTime = timeList.startTime;
      this.endTime = timeList.endTime;
      console.log(this.startTime, this.endTime);

      let timeListTwo = goodsUtils.selectData(1);
      this.startTimeTow = timeListTwo.startTime;
      this.endTimeTow = timeListTwo.endTime;
      console.log(this.startTimeTow, this.endTimeTow);

      let timeLists = goodsUtils.selectData(1);
      this.startTimeThree = timeLists.startTime;
      this.endTimeThree = timeLists.endTime;
      console.log(this.startTimeThree, this.endTimeThree);

      // return false
      console.log("123");
      let newSettings = {};

      // 生成数据
      // 1.title 标题
      let title = "";
      // 2.副标题
      let subTitle = "";
      // 3.主要数据源
      let dataSource = [];

      // 4.类型 分为地图和图表
      let chartType = "map";

      // 模拟数据
      let data,
        legend,
        dataMap,
        // x轴坐标title
        xAxis = [];
      for (let i = 0; i < 2
      
    ; i++) {
        // 3-1 数据源
        data = {
          // 3-1-1 主题色(包括线的颜色)
          colorStyle: i == 1 ? "#289ffa" : "red",
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: "solid",
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
          showType: "line",

          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: "path",
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: "",
          // 3-1-6 对应的数据
          xAxisData: [Math.random() * 100],
          // 3-1-7 该坐标的内容值
          name: "销量" + i,
          // 3-1-8 饼图的颜色区分 只有设置type为
          pieColor: ["#289ffa", "red", "blue", "pink", "purple", "yellow"]
        };

        // 3-2 地图
        dataMap = {
          // 3-2-1 对应的数据 [{name:'地址',value:'对应的值'}]
          xAxisData: [
            {
              name: "北京",
              value: Math.round(Math.random() * 1000)
            },
            {
              name: "天津",
              value: Math.round(Math.random() * 1000)
            },
            {
              name: "上海",
              value: Math.round(Math.random() * 1000)
            },
            {
              name: "重庆",
              value: Math.round(Math.random() * 1000)
            }
          ],
          // 3-2-1 产品的名字
          name: "销量" + i
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

      this.settings = newSettings;
    },

    // 绘制地图
    makeMap(data) {
      let newSettings = {};
      let title = "";
      // 2.副标题
      let subTitle = "";
      // 3.主要数据源
      let dataSource = [];

      // 4.类型 分为地图和图表
      let chartType = "map";

      let dataMap,
        legend,
        xAxisData = [];
      for (let i = 0; i < data.length; i++) {
        xAxisData.push({
          name: data[i].area,
          value: data[i].custCountByArea
        });
      }
      dataMap = {
        xAxisData: xAxisData,
        name: "客户数量"
      };
      dataSource.push(dataMap);

      // 4.图例
      legend = {
        // 4-1 图例  horizontal(水平) or vertical(垂直)
        orient: "vertical",
        // 4-2 位置 [top,right,bottom,left]
        position: {
          bottom: 0
        },

        data: ["客户数量"]
      };

      newSettings = {
        title,
        subTitle,
        dataSource,
        legend,
        chartType
      };

      this.settings = newSettings;
    },

    set(dataAry) {
      let newSettings = {};

      // 生成数据
      // 1.title 标题
      let title = "";
      // 2.副标题
      let subTitle = "";
      // 3.主要数据源
      let dataSource = [];
      // 4.类型 分为地图和图表
      let chartType = "line";

      // 模拟数据
      let data,
        legend,
        dataMap,
        // x轴坐标title
        xAxis = [];

      let newCustValue = [],
          oldCustValue = [],
          allValue = []
      dataAry.map((v,i) => {
        xAxis.push(v.refDate)
        newCustValue.push(v.newCustValue)
        oldCustValue.push(v.oldCustValue)
      })
      allValue = [{
        title:'新客户',
        data:newCustValue
      },
      {
        title:'老客户',
        data:oldCustValue
      }]

      console.log(allValue)
      for (let i = 0; i < allValue.length; i++) {
        // 3-1 数据源
        data = {
          // 3-1-1 主题色(包括线的颜色)
          colorStyle: i == 1 ? "#289ffa" : "red",
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: "solid",
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
          showType: "line",
          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: "1",
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: "solid",
          // 3-1-6 对应的数据
          xAxisData: allValue[i].data,
          // 3-1-7 该坐标的内容值
          name: allValue[i].title,
          // 3-1-8 饼图的颜色区分 只有设置type为
          pieColor: ["red", "blue"]
        };
        // 4.图例
        legend = {
          // 4-1 图例  horizontal(水平) or vertical(垂直)
          orient: "horizontal",
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
    age(dataAry) {
      console.log(dataAry);
      let newSettings = {};

      // 生成数据
      // 1.title 标题
      let title = "";
      // 2.副标题
      let subTitle = "";
      // 3.主要数据源
      let dataSource = [];
      // 4.类型 分为地图和图表
      let chartType = "line";

      // 模拟数据
      let data,
        legend,
        dataMap,
        // x轴坐标title
        xAxis = [],
        xAxisData = [];

      dataAry.map((v, i) => {
        xAxis.push(v.name);
        xAxisData.push(v.value);
      });
      for (let i = 0; i < 1; i++) {
        // 3-1 数据源
        data = {
          // 3-1-1 主题色(包括线的颜色)
          // colorStyle: i == 1 ? "blue" : "red",
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: "solid",
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
          showType: "bar",
          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: "1",
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: "solid",
          // 3-1-6 对应的数据
          xAxisData: xAxisData
        };
        // 4.图例
        legend = {
          // 4-1 图例  horizontal(水平) or vertical(垂直)
          orient: "horizontal",
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

      this.barChart = newSettings;
    },
    startTimeTwoFun(data) {
      this.startTwoTime = value
    },
    endTimeTwoFun(data) {
      this.endTwoTime = value
    }
  }
};
</script>
<style lang="less" scoped>
@import "./customeranalyse.less";
</style>
