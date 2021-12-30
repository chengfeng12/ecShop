<template>
  <div class="analyse">
    <div>商品分析</div>
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
          <Button type="primary" size="small" class="mar-le" @click="screen">搜索</Button>
        </div>
        <div class="content-box">
          <div class="fenbu">
            <div class="title">商品分布</div>
            <div class="info">
              <ul>
                <li>
                  <div>在售商品数</div>
                  <div>1280</div>
                </li>
                <li>
                  <div>仓库商品数</div>
                  <div>360</div>
                </li>
                <li>
                  <div>售罄商品数</div>
                  <div>8</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="gaishu">
            <div class="title">商品分布</div>
            <div class="info">
              <ul>
                <li>
                  <div>商品总销量</div>
                  <div>2222</div>
                  <div class="up">
                    较前一日:%
                    <Icon type="md-arrow-round-up" class="icon-jt red" />
                  </div>
                </li>
                <li>
                  <div>支付总金额(元)</div>
                  <div>2222</div>
                  <div class="up">
                    较前一日：%
                    <Icon type="md-arrow-round-up" class="icon-jt red" />
                  </div>
                </li>
               
            
              </ul>
            </div>
          </div>
        </div>

        <div class="part">
          <div class="part-t">
            <span class="word">商品趋势图</span>
             <DatePicker size="small" type="date" 
              :value="transactionStartTime" 
              class="mar-le" 
              :editable="false" 
              :clearable="false" 
              @on-change="transactionStartTimeFun"></DatePicker>
            <span class="mar-le">至</span>
            <DatePicker size="small" type="date" 
              :value="transactionEndTime" 
              class="mar-le" :editable="false" 
              :clearable="false" 
              @on-change="transactionEndTimeFun"></DatePicker>
          </div>
          <div class="right">
            <Select size="small" v-model="source" style="width:120px;">
              <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="shop-data">
            <Chart style="width:100%;height:400px;" :options="lineChart"></Chart>
          </div>
        </div>
        <div class="list">
          <div class="list-t">
            <span class="word">商品排行榜</span>
        <DatePicker size="small" type="date" 
        class="mar-le" 
        :value="detailStartTime" 
        :editable="false" 
        :clearable="false" 
        @on-change="detailStartTimeFun"></DatePicker>
        <span class="mar-le">至</span>
        <DatePicker size="small" 
        type="date" 
        class="mar-le" 
        :clearable="false" 
        :value="detailEndTime"
        :editable="false" 
       @on-change="detailEndTimeFun"></DatePicker>
           

            <div class="right-t">
              <Select size="small" v-model="source" style="width:120px;">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            
            </div>
          </div>
          <div class="lists">
            <div class="list-info">
              <span class="word">商品销量排行</span>
               <span class="download-left" style>
              <a href>数据下载</a>
              </span>
             <Table border :columns="columns" :data="data1" style="width:700px"></Table>
            </div>
            <div class="list-infos">
              <span class="word">商品支付金额排行</span>
                <span class="download-right">
                <a href>数据下载</a>
              </span>
              <Table border :columns="moneyColumns" :data="money" style="width:700px;"></Table>
            </div>
          </div>
        </div>
        <div class="detail">
          <div class="detail-t">
            <span class="word">商品排行明细</span>
             <DatePicker size="small" type="date" 
        class="mar-le" 
        :value="detailStartOneTime" 
        :editable="false" 
        :clearable="false" 
        @on-change="detailStartTimeOneFun"></DatePicker>
        <span class="mar-le">至</span>
        <DatePicker size="small" 
        type="date" 
        class="mar-le" 
        :clearable="false" 
        :value="detailEndOneTime"
        :editable="false" 
       @on-change="detailEndTimeOneFun"></DatePicker>

            <div class="select">
              <Select size="small" v-model="source" style="width:120px;margin-right:10px">
                <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
              <span class="download">
                <a href>数据下载</a>
              </span>
            </div>
          </div>
          <div class="detail-info">
            <Table border :columns="detail" :data="detailData"></Table>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import goodsUtils from "@/utils/goodsUtils";
import Chart from "@/components/newEcharts/chart";
import goods from "@/api/request/goods"
export default {
  components: {
    Chart
  },
  data() {
    return {
      model2: "3",
      model3: "4",
      model: "2",
      lineChart: {},
    
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
     
      // 趋势
      transactionStartTime: '',
      transactionEndTime: '',

//排行榜
detailStartTime:'',
detailEndTime:'',
//明细

detailStartOneTime:'',
detailEndOneTime:'',

      startTime: "",
      endTime: "",
      startTimeMon: "",
      columns: [
        {
          title: "排名",
          key: "top",
          align: "center"
        },
        {
          title: "商品",
          align: "center",
          render: (h, params) => {
            return h('div',{}, [
              h('img',{
                attrs: {
                   src: params.row.thumb, 
                },
                style: {
                  height: "40px",
                  marginRight: "5px",
                  verticalAlign: "middle",
                  cursor: "pointer"
                }
              }),
              h('span',{},params.row.goodsNameAndOption)
            ]) 
          }
        },
        {
          title: "销量",
          key: "saleCount",
          align: "center"
        }
      ],
      data1: [],
      money: [],
      moneyColumns: [
        {
          title: "排名",
          key: "top",
          align: "center"
        },
        {
          title: "商品",
          align: "center",
            render: (h, params) => {
            return h('div',{}, [
              h('img',{
                attrs: {
                   src: params.row.thumb, 
                },
                style: {
                  height: "40px",
                  marginRight: "5px",
                  verticalAlign: "middle",
                  cursor: "pointer"
                }
              }),
              h('span',{},params.row.goodsNameAndOption)
            ]) 
          }
        },
        {
          title: "支付金额",
          key: "totalPayAmount",
          align: "center"
        }
      ],
      detail: [
        {
          title: "商品",
          key: "goodsNameAndOption",
          align: "center"
        },
        {
          title: "支付件数",
          key: "payCount",
          align: "center"
        },
        {
          title: "支付金额",
          key: "totalPayAmount",
          align: "center"
        },
        {
          title: "复购人数",
          key: "paiedPeopleCount",
          align: "center"
        },
        {
          title: "商品访客数",
          key: "goodsUV",
          align: "center"
        },
        {
          title: "商品浏览量",
          key: "gooodsPU",
          align: "center"
        }
      ],
      detailData: []
    };
  },
  mounted() {
    this.screen()
    this.transactionData(),
    this.part(),
    this.partOne(),
    this.partTwo()
  },
  methods: {
    // 趋势
    transactionStartTimeFun(value) {
      this.transactionStartTime = value
      if (this.transactionEndTime && this.transactionStartTime) {
          this.transactionData()
      }
    },
    transactionEndTimeFun(value) {
        this.transactionEndTime = value
        if (this.transactionEndTime && this.transactionStartTime) {
            this.transactionData()
        }
    },

    //排行榜
      detailStartTimeFun(value) {
            this.detailStartTime = value
            if (this.detailEndTime && this.detailStartTime) {
                this.part()
            }
        },
        detailEndTimeFun(value) {
            this.detailEndTime = value
            if (this.detailEndTime && this.detailStartTime) {
                this.part()
            }
        },

         //明细
         detailStartTimeOneFun(value) {
            this.detailStartOneTime = value
            if (this.detailEndOneTime && this.detailStartOneTime) {
                this.partTwo()
            }
        },  
        detailEndTimeOneFun(value) {
            this.detailEndOneTime = value
            if (this.detailEndOneTime && this.detailStartOneTime) {
                this.partTwo()
            }
        },

   part(){
  //商品销量排行榜
    goods.goodsAnalyseTableOne({
          'startTime': this.detailStartTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailStartTime)) : goodsUtils.selectData(30).startTime,
          'endTime': this.detailEndTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailEndTime)) : goodsUtils.selectData(30).endTime,
          'source': this.source
      }).then(res => {
          if (res.code == 1) {
            console.log(res, '22222')
            this.data1 = res.data
            // this.integrationData(res.data)
          } else {
              this.$Message.error(res.message)
          }
      }).catch(err => {
          console.log(err)
      })
   },
   
   partOne(){
     //支付金额排行榜
    goods.goodsAnalyseTableTwo({
          'startTime': this.detailStartTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailStartTime)) : goodsUtils.selectData(30).startTime,
          'endTime': this.detailEndTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailEndTime)) : goodsUtils.selectData(30).endTime,
          'source': this.source
      }).then(res => {
          if (res.code == 1) {
            console.log(res, '333333')
            this.money = res.data 
            // this.integrationData(res.data)
          } else {
              this.$Message.error(res.message)
          }
      }).catch(err => {
          console.log(err)
      
      })
   },

   partTwo(){
   //商品明细
    goods.goodsAnalyseTableThree({
          'startTime': this.detailStartOneTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailStartOneTime)) : goodsUtils.selectData(30).startTime,
          'endTime': this.detailEndOneTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailEndOneTime)) : goodsUtils.selectData(30).endTime,
          'source': this.source
      }).then(res => {
          if (res.code == 1) {
            console.log(res, '333333')
            this.detail = res.data
            // this.integrationData(res.data)
          } else {    
              this.$Message.error(res.message)
          }
      }).catch(err => {
          console.log(err)
      })
   },
   
    transactionData() { 
      // 交易数据的列表
      goods.goodsAnalyseMain({
          'startTime': this.transactionStartTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.transactionStartTime)) : goodsUtils.selectData(30).startTime,
          'endTime': this.transactionEndTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.transactionEndTime)) : goodsUtils.selectData(30).endTime,
          'source': this.source
      }).then(res => {
          if (res.code == 1) {
            console.log(res, '1211111')
            this.integrationData(res.data)
          } else {
              this.$Message.error(res.message)
          }
      }).catch(err => {
          console.log(err)
      })
  },
  integrationData(data) {
        console.log('我是',data)
        let goodsSaleTotalCount = []
        let goodsUvCount = []
        let relationDate = []
        let dataSource = []
        data.forEach(element => {
            if (element.goodsSaleTotalCount) {
                goodsSaleTotalCount.push(element.goodsSaleTotalCount)
            } else {
                goodsSaleTotalCount.push(0)
            }
            if (element.goodsUvCount) {
                goodsUvCount.push(element.goodsUvCount)
            } else {
                goodsUvCount.push(0)
            }
            if (element.relationDate) {
                relationDate.push(element.relationDate)
            } else {
                relationDate.push('没有日期')
            }
        });
        console.log('图表数据',goodsSaleTotalCount, goodsUvCount, relationDate)
        let arr = []
        arr.push(goodsSaleTotalCount)
        arr.push(goodsUvCount)
        let colorData = ['#289ffa','#2fa']
        let typeData = ['solid','dotted']
        let nameData = ['商品总销售量','商品访问量']
        arr.forEach((element,index) => {
            console.log('shuju',element)
            let tempObj = {
                // 3-1-1 主题色(包括线的颜色)
                colorStyle: colorData[index],
                // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
                lineType: typeData[index],
                // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图)为主 之后再扩充
                showType: 'line',
                // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
                iconType: 'path',
                // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
                iconPath: '',
                // 3-1-6 对应的数据
                xAxisData: element,
                // 3-1-7 该坐标的内容值
                name: nameData[index],
                // 3-1-8 饼图的颜色区分 只有设置type为
                pieColor:['#289ffa','red','blue','pink','purple','yellow']
            }
            dataSource.push(tempObj)
        });
    
        let legend = {
            orient: 'horizontal',
            position:{
                bottom:0
            }
        }
        let obj = {}
        obj.title = '商品趋势图'
        // 单位：人
        obj.subTitle = ''
        obj.dataSource = dataSource
        obj.xAxis = relationDate
        obj.legend = legend
        // 配置大小
        console.log('数据格式',obj)
        this.lineChart = obj
    },
    dateRangeFun(data) {
      console.log(data);
    },
    screen() {
      console.log("筛选");
      goods.goodsAnalyseHead({
        startTime: this.startTime,
        endTime: this.endTime,
        source: this.dateRangeData,
        shopId: 1
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
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
    }
  }
};
</script>
<style lang="less" scoped>
@import './shopanalyse.less';
</style>


