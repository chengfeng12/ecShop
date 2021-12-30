<template>
    <div id="transaction" class="data-box">
        <div class="currentTitle">交易分析</div>
        <Card>
            <div slot="title" class="header">
                <Select size="small" v-model="source" style="width:120px;">
                    <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select size="small" v-model="dateRangeData" style="width:120px;" class="mar-le" @on-change="dateRangeFun">
                    <Option v-for="item in dateRange" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <!-- v-if="dateRangeData == 1" -->
                <Select size="small" v-if="dateRangeData == 1" v-model="timeData" style="width:170px;" @on-change="timeFun" class="mar-le">
                    <Option v-for="item in dateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                
                <!-- 按天 -->
                <span v-if="dateRangeData == 1">
                    <DatePicker size="small" :editable="false" :disabled="timeData != 2" type="date" format="yyyy-MM-dd" class="mar-le" :value="startTime" @on-change="startTimeFun" :clearable="false"></DatePicker>
                    <span class="mar-le">至</span>
                    <DatePicker size="small" :editable="false" :disabled="timeData != 2" type="date" format="yyyy-MM-dd" class="mar-le" :value="endTime" @on-change="endTimeFun" :clearable="false"></DatePicker>
                </span>
                
                <!-- 按周 -->
                <span v-if="dateRangeData == 7">
                    <DatePicker size="small" :editable="false" :disabled="false" type="date" format="yyyy-MM-dd" class="mar-le" v-model="startTime" @on-change="weekdayFun" :clearable="false"></DatePicker>
                    <span class="mar-le">至</span>
                    <DatePicker size="small" :editable="false" :disabled="true" type="date" format="yyyy-MM-dd" class="mar-le" :value="endTime" :clearable="false"></DatePicker>
                </span>

                <!-- 按月 -->
                <DatePicker v-if="dateRangeData == 30" size="small" :editable="false" type="month" format="yyyy-MM" class="mar-le" v-model="startTimeMon" @on-change="monthTimeFun" :clearable="false"></DatePicker>
                <Button type="primary" size="small" class="mar-le" @click="screen">筛选</Button>

            </div>
            <div class="main">
                <div class="main-head">
                    <div class="con-item">
                        <p class="con-title">支付金额</p>
                        <div class="con-info">
                            <span class="company">￥</span>&nbsp;<span class="num">{{Header.payAmount}}</span>
                        </div>
                        <p class="con-compare" :class="{'red': Header.beforeData.payAmountBeforeOnePerc * 1 > 0, 'green': Header.beforeData.payAmountBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.payAmountBeforeOnePerc}}%<Icon v-if="Header.beforeData.payAmountBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.payAmountBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
                    </div>
                    <div class="con-item">
                        <p class="con-title">支付订单数</p>
                        <div class="con-info">
                            <span class="num">{{Header.payCount}}</span>&nbsp;<span class="company">笔</span>
                        </div>
                        <p class="con-compare" :class="{'red': Header.beforeData.payCountBeforeOnePerc * 1 > 0, 'green': Header.beforeData.payCountBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.payCountBeforeOnePerc}}%<Icon v-if="Header.beforeData.payCountBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.payCountBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
                    </div>
                    <div class="con-item">
                        <p class="con-title">付款人数</p>
                        <div class="con-info">
                            <span class="num">{{Header.payCountByPeople}}</span>&nbsp;<span class="company">人</span>
                        </div>
                        <p class="con-compare" :class="{'red': Header.beforeData.payCountByPeopleBeforeOnePerc * 1 > 0, 'green': Header.beforeData.payCountByPeopleBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.payCountByPeopleBeforeOnePerc}}%<Icon v-if="Header.beforeData.payCountByPeopleBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.payCountByPeopleBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
                    </div>
                    <div class="con-item">
                        <p class="con-title">付款订单数</p>
                        <div class="con-info">
                            <span class="num">{{Header.actualPayCount}}</span>&nbsp;<span class="company">次</span>
                        </div>
                        <p class="con-compare" :class="{'red': Header.beforeData.actualPayCountBeforeOnePerc * 1 > 0, 'green': Header.beforeData.actualPayCountBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.actualPayCountBeforeOnePerc}}%<Icon v-if="Header.beforeData.actualPayCountBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.actualPayCountBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
                    </div>
                    <div class="con-item">
                        <p class="con-title">客单价</p>
                        <div class="con-info">
                            <span class="num">{{Header.unitPriceByOne}}</span>&nbsp;<span class="company">元</span>
                        </div>
                        <p class="con-compare" :class="{'red': Header.beforeData.unitPriceByOneBeforeOnePerc * 1 > 0, 'green': Header.beforeData.unitPriceByOneBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.unitPriceByOneBeforeOnePerc}}%<Icon v-if="Header.beforeData.unitPriceByOneBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.unitPriceByOneBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
                    </div>
                    <div class="con-item">
                        <p class="con-title">退款订单金额</p>
                        <div class="con-info">
                            <span class="num">{{Header.refundPrice}}</span>&nbsp;<span class="company">元</span>
                        </div>
                        <p class="con-compare" :class="{'red': Header.beforeData.refundPriceBeforeOnePerc * 1 > 0, 'green': Header.beforeData.refundPriceBeforeOnePerc * 1 < 0}" v-if="Header.beforeData.length != 0">较前一日：{{Header.beforeData.refundPriceBeforeOnePerc}}%<Icon v-if="Header.beforeData.refundPriceBeforeOnePerc * 1 > 0" type="md-arrow-round-up" class="icon-jt red" /><Icon v-if="Header.beforeData.refundPriceBeforeOnePerc * 1 < 0" type="md-arrow-round-down" class="icon-jt green" /></p>
                    </div>
                </div>
                <div class="main-chart">
                    <!-- {{pieData}} -->
                    <v-chart :options="pieData" :autoresize="true" style="height: 400px;width:100%;" />
                    <!-- <echarts :options="pieChart" style="height: 400px;width:100%;" /> -->
                </div>
                <div class="main-broken-line chart-box">
                    <Card>
                        <div slot="title" class="head">
                            <div class="left">
                                <span class="title-span">交易数据</span>
                                <DatePicker size="small" type="date" :value="transactionStartTime" class="mar-le" :editable="false" :clearable="false" @on-change="transactionStartTimeFun"></DatePicker>
                                <span class="mar-le">至</span>
                                <DatePicker size="small" type="date" :value="transactionEndTime" class="mar-le" :editable="false" :clearable="false" @on-change="transactionEndTimeFun"></DatePicker>
                            </div>
                            <div class="right">
                                <Select size="small" v-model="type" style="width:150px;" @on-change="selectFun">
                                    <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </div>
                        </div>
                        <div class="test">
                            <echarts :options="settings" style="height: 500px;width:100%;" />
                        </div>
                    </Card>
                </div>
                <div class="main-broken-line chart-box">
                    <Card>
                        <div slot="title" class="head">
                            <div class="left">
                                <span class="title-span">详细数据</span>
                                <DatePicker size="small" type="date" class="mar-le" :value="detailStartTime" :editable="false" :clearable="false" @on-change="detailStartTimeFun"></DatePicker>
                                <span class="mar-le">至</span>
                                <DatePicker size="small" type="date" class="mar-le" :clearable="false" :value="detailEndTime" :editable="false" @on-change="detailEndTimeFun"></DatePicker>
                            </div>
                            <div class="right">
                                <Select size="small" v-model="type" style="width:150px;" @on-change="selectFun">
                                    <Option v-for="item in channelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                                <span class="download mar-le" @click="download">数据下载</span>
                            </div>
                        </div>
                        <div>
                            <Table border :columns="columnsTable" :data="detailData"></Table>
                        </div>
                    </Card>
                </div>
            </div>
        </Card>
    </div>
</template>
<script>
import ECharts from "vue-echarts"
import 'echarts/src/chart/pie';
import goodsUtils from '@/utils/goodsUtils'
import dataApi from '@/api/request/data.js'
import echarts from '@/components/newEcharts/chart'
import api from '@/api/request'
export default {
    data() {
        return {
            // app.title = '环形图';

            pieData: {},

            transactionStartTime: '',
            transactionEndTime: '',
            detailStartTime: '',
            detailEndTime: '',
            settings: {},
            pieChart: {},
            source: 1,
            type: 1,
            currentTime: '',
            channelList: [
                {
                    id: 1,
                    name: '微信小程序'
                }
            ],
            dateRangeData: 1,
            dateRange: [
                {
                    id: 1,
                    name: '按天'
                },
                {
                    id: 7,
                    name: '按周'
                },
                {
                    id: 30,
                    name: '按月'
                }
            ],
            timeData: 2,
            dateList: [
                {
                    id: 1,
                    name: '昨天'
                },
                {
                    id: 7,
                    name: '最近7天'
                },
                {
                    id: 15,
                    name: '最近15天'
                },
                {
                    id: 30,
                    name: '最近30天'
                },
                {
                    id: 2,
                    name: '自定义范围'
                },
            ],
            startTime: '',
            endTime: '',
            startTimeMon: '',
            Header: {
                payAmount: 0,
                payCount: 0,
                payCountByPeople: 0,
                actualPayCount: 0,
                unitPriceByOne: 0,
                refundPrice: 0,
                beforeData: []
            },
            detailData: [],
            columnsTable: [
                {
                    title: '日期',
                    align: 'center',
                    key: 'relationDate'
                },
                {
                    title: '支付金额（元）',
                    align: 'center',
                    key: 'payAmount'
                },
                {
                    title: '支付订单数',
                    align: 'center',
                    key: 'payCount'
                },
                {
                    title: '付款人数',
                    align: 'center',
                    key: 'payCountByPeople'
                },
                {
                    title: '付款订单数',
                    align: 'center',
                    key: 'actualPayCount'
                },
                {
                    title: '客单价（元）',
                    align: 'center',
                    key: 'unitPriceByOne'
                },
                {
                    title: '退款订单金额（元）',
                    // key: 'refundPrice',
                    align: 'center',
                    render: (h, params) => {
                        return h('p',{},params.row.refundPrice.toFixed(2))
                    }
                }
            ]
        }
    },
    created() {
        this.getTransactionData()
        this.currentTime = goodsUtils.timeFun(goodsUtils.timeStampFun())
    },
    components: {
        echarts,
        "v-chart": ECharts
    },
    methods: {
        getTransactionData() {
            this.screenOne()
            this.detailFun()
            this.transactionData()
            
        },
        dateReturn() {
            this.startTime = this.startTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.startTime)) : goodsUtils.selectData(30).startTime
            this.endTime = this.endTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.endTime)) : goodsUtils.selectData(30).endTime
        },
        transactionData() {
            // 交易数据的列表
            dataApi.transactionData({
                'startTime': this.transactionStartTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.transactionStartTime)) : goodsUtils.selectData(30).startTime,
                'endTime': this.transactionEndTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.transactionEndTime)) : goodsUtils.selectData(30).endTime,
                'source': this.source
            }).then(res => {
                if (res.code == 1) {
                    this.integrationData(res.data)
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        detailFun() {
            dataApi.detailData({
                'startTime': this.detailStartTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailStartTime)) : goodsUtils.selectData(30).startTime,
                'endTime': this.detailEndTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailEndTime)) : goodsUtils.selectData(30).endTime,
                'source': this.source
            }).then(res => {
                if (res.code == 1) {
                    // console.log('我是详细的数据',res.data)
                    let con = []
                    res.data.forEach((element,index) => {
                        let obj = {}
                        if (element.relationDate) {
                            obj.relationDate = element.relationDate
                        } else {
                            obj.relationDate = ''
                        }
                        obj.payAmount = element.payAmount
                        obj.payCount = element.payCount
                        obj.payCountByPeople = element.payCountByPeople
                        obj.actualPayCount = element.actualPayCount
                        obj.unitPriceByOne = element.unitPriceByOne
                        obj.refundPrice = element.refundPrice
                        con.push(obj)
                    });
                    this.detailData = con
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        screenOne() {
            this.dateReturn()
            dataApi.screeningData({
                'startTime': this.startTime,
                'endTime': this.endTime,
                'source': this.source
            }).then(res => {
                if (res.code == 1) {
                    console.log(res,'haha')
                    this.Header.payAmount = goodsUtils.threeNumReplice(res.data.payAmount)
                    this.Header.payCount = res.data.payCount
                    this.Header.payCountByPeople = res.data.payCountByPeople
                    this.Header.actualPayCount = res.data.actualPayCount
                    this.Header.unitPriceByOne = res.data.unitPriceByOne
                    this.Header.refundPrice = res.data.refundPrice

                    // let dataSource = []
                    // let dataList = {}
                    // dataList = {
                    //     colorStyle: '',
                    //     lineType: 'solid',
                    //     showType: 'round',
                    //     iconType: 'path',
                    //     iconPath: '',
                    //     // 3-1-6 对应的数据
                    //     xAxisData: [res.data.newConsumeAmount,res.data.oldConsumeAmount],
                    //     // 3-1-7 该坐标的内容值
                    //     name: [],
                    //     // 3-1-8 饼图的颜色区分 只有设置type为
                    //     pieColor:['#0083b0','#2d8cf9']
                    // }
                    // dataSource.push(dataList)
                    // let timeData = []
                    // let legend = {
                    //     orient:'vertical',
                    //     position:{
                    //         bottom:0,
                    //         right: 250
                    //     }
                    // }
                    // + this.currentTime
                    // let obj = {}
                    // obj.title = '交易构成'
                    // obj.subTitle = '日期：' + this.startTime + ' - ' + this.endTime
                    // obj.dataSource = dataSource
                    // obj.xAxis = ['新客','老客']
                    // obj.legend = legend
                    // console.log('环状图数据格式',obj)
                    // this.pieChart = obj

                    this.pieData = {
                        title: {text: "交易构成", subtext: `日期：${this.startTime} - ${this.endTime}`}, 
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b}:￥{c}({d}%)"
                        },
                        legend: {
                           data: [ 
                                {name: "新客", icon: "rect", textStyle: {color: "#0083b0"}}, 
                                {name: "老客", icon: "rect", textStyle: {color: "#2d8cf9"}} 
                            ],
                            x: '70%',
                            y: '300',
                            orient: 'vertical',
                        },
                        series: [
                            {
                                // name:'访问来源',
                                type:'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        formatter: "{b}{c}{d}%",
                                        textStyle: {
                                            fontSize: '22',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data:[
                                    {
                                        value: res.data.newConsumeAmount, 
                                        name: "新客", 
                                        itemStyle: { 
                                            "color": "#0083b0"
                                        }
                                    }, 
                                    {
                                        value: res.data.oldConsumeAmount, 
                                        name: "老客", 
                                        itemStyle: { 
                                            "color": "#2d8cf9"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        screen() {
            this.Header.beforeData = []
            console.log('赛选了',this.startTime,this.endTime)
            if (this.dateRangeData != 30) {
                if (this.timeData) {
                    if (!this.startTime) {
                        this.$Message.error('开始时间不能为空')
                        return false
                    }
                    if (!this.endTime) {
                        this.$Message.error('结束时间不能为空')
                        return false
                    }
                }
            } else {
                if (!this.startTime || !this.endTime) {
                    this.$Message.error('时间不能为空')
                    return false
                }
            }
            this.dateReturn()
            dataApi.screeningData({
                'startTime': this.startTime,
                'endTime': this.endTime,
                'source': this.source
            }).then(res => {
                if (res.code == 1) {
                    console.log(res,res.data.newCustValue,res.data.oldCustValue,'我是搜索的数据')
                    this.Header.payAmount = goodsUtils.threeNumReplice(res.data.payAmount)
                    this.Header.payCount = res.data.payCount
                    this.Header.payCountByPeople = res.data.payCountByPeople
                    this.Header.actualPayCount = res.data.actualPayCount
                    this.Header.unitPriceByOne = res.data.unitPriceByOne
                    this.Header.refundPrice = res.data.refundPrice
                    this.Header.beforeData = res.data.beforeData ? res.data.beforeData : []
                    // let dataSource = []
                    // let dataList = {}
                    // dataList = {
                    //     colorStyle: '',
                    //     lineType: 'solid',
                    //     showType: 'round',
                    //     iconType: 'path',
                    //     iconPath: '',
                    //     // 3-1-6 对应的数据
                    //     xAxisData: [res.data.newConsumeAmount,res.data.oldConsumeAmount],
                    //     // 3-1-7 该坐标的内容值
                    //     name: [],
                    //     // 3-1-8 饼图的颜色区分 只有设置type为
                    //     pieColor:['#289ffa','#89f']
                    // }
                    // dataSource.push(dataList)
                    // let timeData = []
                    // let legend = {
                    //     orient:'vertical',
                    //     position:{
                    //         bottom:0,
                    //         right: 250
                    //     }
                    // }

                    // let obj = {}
                    // obj.title = '交易构成'
                    // obj.subTitle = '日期：' + this.startTime + ' - ' + this.endTime
                    // obj.dataSource = dataSource
                    // obj.xAxis = ['新客','老客']
                    // obj.legend = legend
                    // console.log('环状图数据格式',obj)
                    // this.pieChart = obj
                    this.pieData = {
                        title: {text: "交易构成", subtext: `日期：${this.startTime} - ${this.endTime}`}, 
                        color: [""],
                        tooltip: {
                            trigger: 'item',
                            formatter: "{b}:￥{c}({d}%)"
                        },
                        legend: {
                           data: [ 
                                {name: "新客", icon: "rect", textStyle: {color: "#0083b0"}}, 
                                {name: "老客", icon: "rect", textStyle: {color: "#2d8cf9"}} 
                            ],
                            position:{
                                bottom:0,
                                right: 250
                            }
                        },
                        series: [
                            {
                                // name:'访问来源',
                                type:'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: false,
                                        formatter: "{b}{c}{d}%",
                                        textStyle: {
                                            fontSize: '22',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data:[
                                    {
                                        value: res.data.newConsumeAmount, 
                                        name: "新客", 
                                        itemStyle: { 
                                            "color": "#0083b0"
                                        }
                                    }, 
                                    {
                                        value: res.data.oldConsumeAmount, 
                                        name: "老客", 
                                        itemStyle: { 
                                            "color": "#2d8cf9"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        integrationData(data) {
            console.log('我是',data)
            let payAmount = []
            let payCount = []
            let payCountByPeople = []
            let actualPayCount = []
            let unitPriceByOne = []
            let timeData = []
            let dataSource = []
            data.forEach(element => {
                if (element.payAmount) {
                    payAmount.push(element.payAmount)
                } else {
                    payAmount.push(0)
                }
                if (element.payCount) {
                    payCount.push(element.payCount)
                } else {
                    payCount.push(0)
                }
                if (element.payCountByPeople) {
                    payCountByPeople.push(element.payCountByPeople)
                } else {
                    payCountByPeople.push(0)
                }
                if (element.actualPayCount) {
                    actualPayCount.push(element.actualPayCount)
                } else {
                    actualPayCount.push(0)
                }
                if (element.unitPriceByOne) {
                    unitPriceByOne.push(element.unitPriceByOne)
                } else {
                    unitPriceByOne.push(0)
                }
                if (element.relationDate) {
                    timeData.push(element.relationDate)
                } else {
                    timeData.push('没有日期')
                }
            });
            console.log('图表数据',payAmount, payCount, payCountByPeople, actualPayCount, unitPriceByOne, timeData)
            let arr = []
            arr.push(payAmount)
            arr.push(payCount)
            arr.push(payCountByPeople)
            arr.push(actualPayCount)
            arr.push(unitPriceByOne)
            let colorData = ['#289ffa','#2fa','#89f','#29a','#91c']
            let typeData = ['solid','dotted','solid','dotted','dashed']
            let nameData = ['支付金额','支付订单数','付款人数','付款订单数','客单价']
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
            obj.title = '交易数据'
            // 单位：人
            obj.subTitle = ''
            obj.dataSource = dataSource
            obj.xAxis = timeData
            obj.legend = legend
            // 配置大小
            console.log('数据格式',obj)
            this.settings = obj
        },
        download() {
            api.exportFile('api/data/trade/exportDetailData', 'order', {
                'startTime': this.detailStartTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailStartTime)) : goodsUtils.selectData(30).startTime,
                'endTime': this.detailEndTime ? goodsUtils.timeDayFun(goodsUtils.timeStamp(this.detailEndTime)) : goodsUtils.selectData(30).endTime,
                'source': this.source
            }).then(res => {
                console.log(res);
            }).catch(error => {
                console.log(error);
            });
        },
        dateRangeFun(data) {
            this.startTime = ''
            this.endTime = ''
            this.timeData = 2
        },
        timeFun(data) {
            console.log(goodsUtils.timeStampFun())
            if (data != 2) {
                this.startTime = ''
                this.endTime = ''
            }
            if (this.timeData == 1) {
                let res = goodsUtils.selectData(1)
                this.startTime = res.startTime
                this.endTime = res.endTime
                console.log(res)
            } else if (this.timeData == 7) {
                let res = goodsUtils.selectData(7)
                this.startTime = res.startTime
                this.endTime = res.endTime
                console.log(res)
            } else if (this.timeData == 15) {
                let res = goodsUtils.selectData(15)
                this.startTime = res.startTime
                this.endTime = res.endTime
                console.log(res)                
            } else if (this.timeData == 30) {
                let res = goodsUtils.selectData(30)
                this.startTime = res.startTime
                this.endTime = res.endTime
            }
            console.log(this.startTime,this.endTime)
        },
        selectFun() {},
        startTimeFun(value) {
            this.startTime = value
        },
        endTimeFun(value) {
            this.endTime = value
        },
        // 按周的时间
        weekdayFun(data) {
            let res = goodsUtils.callweekDay(data)
            console.log(res,'周的时间')
            this.startTime = res.mondayData
            console.log('开始的时间',this.startTime)
            this.endTime = res.sundayData
        },
        monthTimeFun(data) {
            if (data) {
                let con = data.substr(5)
                this.startTime = data + '-01'
                if (con) {
                    let mon = con.replace(/\b(0+)/gi,"")
                    let arr = ['1','3','5','7','8','10','12']
                    if (arr.indexOf(mon) != -1) {
                        console.log(arr.indexOf(mon))
                        this.endTime = data + '-31'
                    } else if (mon == 2) {
                        console.log(data.substr(0,4))
                        let fullYear = data.substr(0,4)
                        if (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0)) {
                            this.endTime = data + '-29'
                        } else {
                            this.endTime = data + '-28'
                        }
                    } else {
                        this.endTime = data + '-30'
                    }
                }
            } else {
                this.startTime = ''
                this.endTime = ''
            }
            console.log('处理后的',this.startTime,this.endTime)
        },
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
        detailStartTimeFun(value) {
            this.detailStartTime = value
            if (this.detailEndTime && this.detailStartTime) {
                this.detailFun()
            }
        },
        detailEndTimeFun(value) {
            this.detailEndTime = value
            if (this.detailEndTime && this.detailStartTime) {
                this.detailFun()
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import './index.less';
@import '../style/index.less';
</style>

