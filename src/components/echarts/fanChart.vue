<template>
  <div class="componentCharts">
    <v-chart :options="fanpolar"/>
  </div>
</template>
<script>
import api from "../../api/mock.js";
import ECharts from "vue-echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
export default {
  components: {
    "v-chart": ECharts
  },
  data() {
    return {
      fanpolar: {
        title: {
          text: "访问来源",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["转发", "扫码", "小程序"]
        },
        series: {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
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
        .mockdata("/fandata/index")
        .then(res => {
          let datashow = [];
          for (let keydata in res) {
            datashow.push(res[keydata].name);
          }
          this.fanpolar.legend.data = datashow;
          this.fanpolar.series.data = res;
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
