<template>
  <div class="lotterylist">
    <Card>
      <div slot="title">
        <Row>
          <Col class="lotterytitle" span="4">
            {{lotteryName}}
          </Col>
          <Col span="20">
            <DatePicker
              :editable="false"
              @on-change="timeChange"
              format="yyyy-MM-dd HH:mm"
              type="datetimerange"
              placement="bottom-end"
              style="width: 280px;"
              class="mar-le"
            ></DatePicker>

            <Select  v-model="isWin" style="width:200px;" class="mar-le">
              <Option value="1">中奖</Option>
              <Option value="0">未中奖</Option>
            </Select>

             <Button type="primary" class="mar-le btn-a" @click="search()">搜索</Button>

             <Button type="primary" class="mar-le btn-a" @click="excelDownloadsfunc()">导出</Button>
          </Col>
        </Row>
      </div>
      <div>
        <Table border ref="lotteryTable" :columns="lotteryColumns" :data="lotteryData"></Table>
        <div class="footer">
          <div class="page">
            <Page
              :total="total"
              :page-size="size"
              show-sizer
              :page-size-opts="[10,15,20]"
              :current="current"
              @on-change="pagefun"
              @on-page-size-change="pageSizeFun"
              :show-elevator="true"
              :show-total="true"
            ></Page>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import api from "@/api/request";
import marking from "@/api/request/marking";
import goodsUtilsFun from "@/utils/goodsUtils.js";
export default {
  name: "lotterylist",
  data() {
    return {
      timeData:[],
      lotteryColumns: [
        {
          title: "序号",
          align: "center",
          key: "id"
        },
        {
          title: "时间",
          align: "center",
          render: (h, params) => {
            let createTime = goodsUtilsFun.timeFun(
              goodsUtilsFun.timeStamp(params.row.createTime)
            );
            return h("div", {}, [h("span", createTime)]);
          }
        },
         {
          title: "昵称",
          align: "center",
          key: "nickName"
        },
        {
          title: "openid",
          align: "center",
          key: "openId"
        },

        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let isWin = params.row.isWin;
            let Text = (isWin == 0 ? "未中奖" : "中奖");
            return h("div", {}, [
              h("span", Text)
            ]);
          }
        },

        {
          title: "奖项",
          align: "center",
          key: "prizeName"
        },

        {
          title: "奖品",
          align: "center",
          key: ""
        }
      ],
      lotteryData: [],
      // 列表
      total: 0,
      size: 10,
      current: 1,
      isWin: "",
      beginTimeS: "",
      endTimeS: "",
      lotteryID:"",
      lotteryName:""
    };
  },
  created() {
    this.lotteryName = this.$route.query.name;
    this.lotteryID = this.$route.query.id;
    this.selPageListMember();
  },
  activated() {
    this.lotteryName = this.$route.query.name;
    this.lotteryID = this.$route.query.id;
    this.selPageListMember();
  },
  methods: {
    pagefun: function(value) {
      this.current=value,
     
      this.selPageListMember();
    },
      
    pageSizeFun:function(value){
      this.size=value,
      this.selPageListMember();
    },
    // 抽奖列表
    selPageListMember: function() {
      marking
        .selPageListMember({
          activatyId:this.lotteryID,
          isWin: this.isWin,
          beginTimeS: this.beginTimeS,
          endTimeS: this.endTimeS,
          current: this.current,
          size: this.size
        })
        .then(res => {
          if (res.code == 1) {
            console.log("数据", res);
            this.total = res.data.total;
            this.getlotteryData(res.data.rows);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取表格数据
    getlotteryData: function(data) {
      this.lotteryData = data;
    },
    // 获取时间
    timeChange:function(value) {
      this.beginTimeS=goodsUtilsFun.timeStamp(value[0]),
      this.endTimeS=goodsUtilsFun.timeStamp(value[1]),
      console.log(value)
    },
    // 改变状态

    // 搜索
    search:function(){
        this.selPageListMember()
    },
    // 数据导出
    excelDownloadsfunc: function() {
          api.exportFile(
            "/api/activaty/excelDownloads",
            "marking",
            {
              isWin: this.current,
              beginTimeS: this.beginTimeS,
              startTime: this.startTime,
              endTimeS: this.endTimeS,
              activatyId:this.lotteryID,
              current: this.current,
          })
            .then(res => {    
              console.log(res);
            }).catch(error => {
              console.log(error);
            });
    },
    fetchData: function() {
     
      
    }
  },
   watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="css" scoped>
  .lotterytitle{
    color: #0083b0;
    line-height: 32px;
  }
  .footer{
    margin-top: 20px;
  }
  .footer::after{
    content: "";
    display: block;
    clear: both;
  }
  .page{
    float: right;
  }
</style>