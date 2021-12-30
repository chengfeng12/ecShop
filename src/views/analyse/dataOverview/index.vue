<style lang="less" scoped>
@import './index.less';
</style>

<template>
  <div class="container">
    <div class="currentTitle">数据概览</div>
    <Card>
      <Chart style="width:100%;height:600px;" :options="settings"></Chart>
    </Card>
    <Button type="primary" @click="exportFile">导出文件</Button>
  </div>
</template>

<script>
import Chart from '@/components/newEcharts/chart'
import marking from '@/api/request/marking'
import store from "@/store"
import api from '@/api/request'
export default {
  name: "dataOverview",
  components:{
    Chart
  },
  data: function () {
    return {
      settings:{
        
      }
    }
  },
  mounted(){
    this.init()
  },
  methods: {
    exportFile(){
      api.exportFile('api/activaty/excelDownloads','marking',{
        activatyId:'123'
      })
    },
    init(){
      console.log('123')
      let newSettings = {}
      // 生成数据
      // 1.title 标题
      let title = '标题'
      // 2.副标题
      let subTitle = '副标题'
      // 3.主要数据源
      let dataSource = [

      ]

      // 4.类型 分为地图和图表
      let chartType = 'map'

      // 模拟数据
      let data,
          legend,
          dataMap,
          // x轴坐标title
          xAxis = ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      for (let i = 0; i < 2; i++) {
        // 3-1 数据源
        data = {
          // 3-1-1 主题色(包括线的颜色)
          colorStyle: i == 1 ? '#289ffa' : 'red',
          // 3-1-2 线的类型 分为 1、solid 2、dashed 3、dotted
          lineType: i == 1 ? 'solid' : 'dashed',
          // 3-1-3 展示的类型 以line(折线图) bar(柱状图) pie(饼图) funnel(漏斗图) round(环图)为主 之后再扩充
          showType: 'line',
          // 3-1-4 icon显示类型 分为1、path路径 默认定义的实线和虚线 2、default 默认的线
          iconType: 'path',
          // 3-1-5 支持自定义svg 如果iconType为1 那么这个选项属性有用，不填则为默认的线 根据line的实线虚线自定义
          iconPath: '',
          // 3-1-6 对应的数据
          xAxisData: [
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100,
            Math.random()*100
          ],
          // 3-1-7 该坐标的内容值
          name:'销量'+i,
          // 3-1-8 饼图的颜色区分 只有设置type为
          pieColor:['#289ffa','red','blue','pink','purple','yellow']
        }

        // 3-2 地图
        dataMap = {
          // 3-2-1 对应的数据 [{name:'地址',value:'对应的值'}]
          xAxisData: [{
            name: '北京',
            value: Math.round(Math.random() * 1000)
          },
          {
            name: '天津',
            value: Math.round(Math.random() * 1000)
          },
          {
            name: '上海',
            value: Math.round(Math.random() * 1000)
          },
          {
            name: '重庆',
            value: Math.round(Math.random() * 1000)
          }],
          // 3-2-1 产品的名字
          name:'销量'+i,
        }

        // 4.图例
        legend = {
          // 4-1 图例  horizontal(水平) or vertical(垂直)
          orient:'horizontal',
          // 4-2 位置 [top,right,bottom,left]
          position:{
            bottom:0
          }
        }

        dataSource.push(dataMap)
      }
      console.log(dataSource)

      newSettings = {
        title,
        subTitle,
        dataSource,
        legend,
        xAxis,
        chartType
      }
      
      this.settings = newSettings
    }
  },
  
  watch: {
    
  }
}
</script>
