<template>
  <div class="componentCharts">
    <v-chart ref="linecharts" autoresize  :options="linepolar" />
  </div>
</template>
<script>
import api from "@/api/mock.js";
import ECharts from "vue-echarts";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/chart/line";
export default {
  components: {
    "v-chart": ECharts
  },
  props: ["orderList"],
  data() {
    return {
      linepolar: {
        tooltip: {
          trigger: "axis"
        },
        
        legend: {
          data: ["订单数量", "订单金额"],
          bottom: 0
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
         
          type: "value"
        },
        series: [
          {
            name: "订单数量",
            type: "line",
            data: [],
            smooth: true
          },
          {
            name: "订单金额",
            type: "line",
            data: [],
            smooth: true
          }
        ],
        // dataZoom: [
        //   {
        //     //Y轴固定,让内容滚动
        //     type: "inside",
        //     show: false,
        //     xAxisIndex: [0],
        //     start: 1,
        //     end: 80, //设置X轴刻度之间的间隔(根据数据量来调整)
        //     zoomLock: true //锁定区域禁止缩放(鼠标滚动会缩放,所以禁止)
        //   },
        //   {
        //     type: "inside",
        //     xAxisIndex: [0],
        //     start: 1,
        //     end: 80,
        //     zoomLock: true //锁定区域禁止缩放
        //   }
        // ]
      },
     
    };
  },

  methods: {
    getlinedata: function(data) {
      console.log("sdfsdfsdf")
      for (let item in data) {
        this.linepolar.xAxis.data.push(data[item].date);
        this.linepolar.series[1].data.push(data[item].payTotal);
        this.linepolar.series[0].data.push(data[item].payCount);
      }
    }
  },
  watch: {
    orderList: function() {
      this.getlinedata(this.orderList);
    }
  }
};
</script>
<style>
.componentCharts {
  width: 100%;
}
.componentCharts>.echarts{
  width:100%;
  height: 500px;
}
/* .componentCharts>.echarts>div:nth-child(1){
  width:100%!important;
}
.componentCharts>.echarts>div:nth-child(1) canvas{
  width:100%!important;
} */
</style>
