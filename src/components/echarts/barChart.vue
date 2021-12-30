<template>
  <div class="componentCharts">
    <v-chart :options="barpolar"/>
  </div>
</template>
<script>
import api from "../../api/mock.js";
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      barpolar: {
        color: ["#3398DB"],
        title: {
          text: "柱形图",
          x: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value"
        },
        series: {
          name: "直接访问",
          type: "bar",
          barWidth: "60%",
          data: []
        }
      }
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    getdata: function() {
      api
        .mockdata("/bardata/index")
        .then(res => {
          let datashow = [];
          let xAxisdata = [];
          for (let keydata in res) {
            datashow.push(res[keydata].Integer);
            xAxisdata.push(res[keydata].date);
          }
          this.barpolar.series.data = datashow;
          this.barpolar.xAxis.data = xAxisdata;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
.componentCharts {
}
</style>
