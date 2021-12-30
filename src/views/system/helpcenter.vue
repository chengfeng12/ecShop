<template>
  <div>
    <div>操作日志</div>
    <Card>
      <div class="content">
        <div class="time">
          <DatePicker
            size="small"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width: 300px"
            v-model="times"
          ></DatePicker>
          <Select size="small" v-model="opname" style="width:200px;margin-left:10px">
            <Option
              v-for="item in dateList"
              :value="item.operationType"
              :key="item.id"
            >{{item.operationType}}</Option>
          </Select>
          <Input size="small" v-model="inputName" placeholder="输入店员名称搜索" style="width:200px;margin-left:10px" />
          <Button size="small" type="primary" style="width:60px;margin-left:10px" @click="search">搜索</Button>
          <Button size="small" style="width:60px;float:right" @click="download">导出</Button>
        </div>
        <div class="time-box">
          <Table border :columns="time" :data="timeData"></Table>
        </div>
        <div class="page">
          <Page
            :current="current"
            :total="total"
            :page-size="size"
            show-sizer
            :page-size-opts="[10,15,20]"
            @on-page-size-change="pageSizeFun"
            @on-change="pagefun"
            :show-elevator="true"
            :show-total="true"/>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import api from "@/api/request";
import system from "@/api/request/system";
import goodsUtils from "@/utils/goodsUtils";

export default {
  name: "helpcenter",
  data() {
    return {
      total: 0,
      times: "",
      opname: "",
      module: "",
      params: "",
      inputName: "",
      size: 10,
      id: "2",
      current: 1,
      dateList: [],
      time: [
        {
          title: "ID",
          key: "id",
          align: "center"
        },
        {
          title: "店员",
          key: "keyword",
          align: "center"
        },
        {
          title: "操作类型",
          key: "opname",
          align: "center"
        },
        {
          title: "操作内容",
          key: "opcontent",
          align: "center"
        },
        {
          title: "操作IP",
          key: "opip",
          align: "center"
        },
        {
          title: "操作时间",
          key: "optime",
          align: "center"}
      ],
      timeData: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let _this = this;
      _this.getData();
      _this.select();
    },
    getData() {
      let _this = this;
      // 处理列表
      system
        .logList({
          size: _this.size,
          current: _this.current,
          startTime: _this.times[0]
            ? goodsUtils.timeFun(goodsUtils.timeStamp(_this.times[0]))
            : "",
          endTime: _this.times[1]
            ? goodsUtils.timeFun(goodsUtils.timeStamp(_this.times[1]))
            : "",
          operationTypeName: _this.opname,
          keyword: _this.inputName
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.size = res.data.size;
            this.current = res.data.current;
            this.total = res.data.total;
            this.timeData = res.data.rows;

            let arr = [];
            res.data.records.forEach((element, index) => {
              let obj = {};

              obj.id = element.id;
              obj.keyword = element.userName;
              obj.opname = element.module;
              obj.opcontent = element.method + this.params;
              obj.opip = element.ip;
              if (element.addTime) {
                obj.optime = goodsUtils.timeFun(
                  goodsUtils.timeStamp(element.addTime)
                );
              }
              arr.push(obj);
            });

            this.timeData = arr;
          }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("请求失败");
        });
    },

    // 导出所有操作日志的文件
    download: function() {
     
      api.exportFile("api/sys/log/exportLogList", "admin", {
          current: this.current,

          operationTypeName: this.opname,
          
          startTime: this.times[0]
            ? goodsUtils.timeFun(goodsUtils.timeStamp(_this.times[0]))
            : "",
          endTime: this.times[1]
            ? goodsUtils.timeFun(goodsUtils.timeStamp(_this.times[1]))
            : "",
          keyword: this.inputName,

          size: this.size,
        })
        .then(res => {


          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 搜索
    search() {
      this.getData();

      (this.opname = res.data.operationTypeName),
        // 姓名
        (this.inputName = res.data.keyword);
    },


    //选择下拉框
    select() {
      let _this = this;
      system
        .getLogTypeList({})
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.dateList = res.data;
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });
    },
    pagefun(index) {
      this.current = index;
      this.getData();
    },
    pageSizeFun(data) {
      this.size = data;
      this.getData();
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  overflow: hidden;

  .time {
    overflow: hidden;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 20px;
  }

  .time-box {
    margin-top: 20px;
  }

  .page {
    float: right;
    margin-top: 10px;
  }
}
</style>
