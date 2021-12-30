<template>
  <div class="componentCharts-xc">
    <v-chart :options="settings" :autoresize="true" />
  </div>
</template>
<style>
  .componentCharts-xc .echarts {
    width: 100%;
    height: 100%;
  }

</style>
<script>
  import ECharts from "vue-echarts"
  import "echarts/lib/component/title"
  import "echarts/lib/component/tooltip"
  import "echarts/lib/component/legend"
  import "echarts/lib/chart/line"
  import "echarts/lib/chart/bar"
  import "echarts/lib/chart/pie"
  import "echarts/lib/chart/funnel"
  import "echarts/map/js/china"
  export default {
    components: {
      "v-chart": ECharts
    },
    props: ["options"],
    data() {
      return {
        primaryColor: '#0083b0',
        solidLine: 'path://M934.4 490.666667H81.066667a25.6 25.6 0 1 0 0 51.2h853.333333a25.6 25.6 0 1 0 0-51.2z',
        dashedLine: 'path://M234.666667 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2zM473.6 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2zM934.4 490.666667h-136.533333a25.6 25.6 0 1 0 0 51.2h136.533333a25.6 25.6 0 1 0 0-51.2zM712.533333 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2z',
        settings: {

        }
      };
    },
    methods: {

      // 地图绘制
      makeMap: function (data) {
        console.log(data.dataSource)
        let datas = []
        data.dataSource.map((v,i) => {
          console.log(v)
          let newObj = {
              name: v.name,
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              symbolSize: 0,
              itemStyle:{
                areaColor:'#E7FCFF',
                borderWidth:0,
                color:'rgba(0,0,0,0)'
              },
              data: v.xAxisData
          }
          datas.push(newObj)
        })
        console.log(data.legend)
        let option = {
          title: {
            text: data.title,
            subtext: data.subTitle,
            left: 'center'
          },
          tooltip : {
            show:true,
            trigger: 'item'
          },
          label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
          },
          legend: {
            orient: data.legend.orient,
            ...data.legend.position,
            data:data.legend.data
          },
          visualMap: {
            min: 0,
            max: 2500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            show:false
          },
          series: datas
        };

        this.settings = option
      },

      // 图标绘制
      makeData: function (data) {

        console.log(data)
        if (!data) {
          return false
        }

        let title = data.title || '',
          subTitle = data.subTitle || '',
          datas = data.dataSource,
          xAxis = data.xAxis,
          color = [],
          xAxisData = [],
          legends = [],
          legendsOptions = {}

        datas.map((v, i) => {
          if (!v.hasOwnProperty('colorStyle')) {
            color.push(this.primaryColor)
          } else {
            color.push(v.colorStyle)
          }


          let newXaxis = {
            name: v.name,
            type: v.showType == 'round' ? 'pie' : v.showType || 'line',
            data: v.xAxisData,
            lineStyle: {
              width: 2,
              type: v.lineType,
              color: v.colorStyle
            }
          }

          if (v.showType == 'round') {
            newXaxis = {
              ...newXaxis,
              radius: ['50%', '70%']
            }
          }

          let newLegend

          // 区分折线&柱状图 和 饼图&漏斗图&环图
          if (v.showType != 'line' && v.showType != 'bar') {

            xAxis.map((vi, ii) => {
              newLegend = {
                name: xAxis[ii],
                icon: 'rect',
                textStyle: {
                  color: datas[0].pieColor[ii]
                }
              }

              legends.push(newLegend)
            })

          } else {
            if (v.iconType == 'path') {
              newLegend = {
                name: v.name,
                icon: v.iconPath ? v.iconPath : v.lineType == 'solid' ? this.solidLine : this.dashedLine,
                textStyle: {
                  color: v.colorStyle
                }
              }
            } else {
              newLegend = {
                name: v.name,
                textStyle: {
                  color: v.colorStyle
                }
              }
            }

            legends.push(newLegend)
          }


          xAxisData.push(newXaxis)

        })

        legendsOptions = {
          orient: data.legend.orient,
          ...data.legend.position,
          data: legends
        }


        // 配置信息
        this.settings = {
          title: {
            text: title,
            subtext: subTitle
          },
          tooltip: {
              trigger: 'axis'
          },
          color: color,
          legend: legendsOptions,
          series: xAxisData
        }


        // 处理饼状图，漏斗图 针对饼状图和漏斗图 只能有1个数组 没有多个
        // 所以以第1个为主来判断
        if (datas[0].showType != 'line' && datas[0].showType != 'bar') {
          console.log(datas[0].showType)
          let newXaxisData = []
          xAxisData[0].data.map((v, i) => {
            let newObj = {
              value: v,
              name: xAxis[i],
              itemStyle: {
                color: datas[0].pieColor[i]
              }
            }
            newXaxisData.push(newObj)
          })

          xAxisData[0].data = newXaxisData

          this.settings = {
            ...this.settings,
            series: xAxisData
          }
        } else {
          this.settings = {
            ...this.settings,
            xAxis: {
              data: xAxis
            },
            yAxis: {},
          }
        }

      }
    },
    watch: {
      options: {
        handler() {
          console.log(this.options)
          let type = this.options.chartType
          console.log(type)
          if (type == 'map') {
            this.makeMap(this.options)
          } else {
            this.makeData(this.options);
          }
        },
        deep: true
      }
    }
  };

</script>
