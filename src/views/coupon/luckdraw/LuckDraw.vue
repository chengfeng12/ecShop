<template>
  <div id="luck-draw">
    <Card>
      <div id="header">
        <Button v-if="hasRole(40402)" type="primary" class="btn-a" @click="toLink(1,'')">+新建抽奖活动</Button>
        
        <DatePicker :editable="false" v-model="timeData" @on-change="timeChange" format="yyyy-MM-dd HH:mm" type="datetimerange" placement="bottom-end" style="width: 280px;" class="mar-le"></DatePicker>


        <Select v-model="statusData" style="width:200px;" class="mar-le">
          <Option v-for="item in statusOption" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        
        <Input v-model="name" placeholder=" 活动名称关键词搜索" style="width: 220px;" class="mar-le"/>
        
        <Button type="primary" class="mar-le btn-a" @click="search()">搜索</Button>

      </div>
      <div class="main">
        <Table border ref="selection" :columns="columns" :data="tableData"></Table>
      </div>
      <div class="footer">
        
        <div class="page">
          <Page
            :total="total"
            :page-size="size"
            :current="current"
            show-sizer
            :page-size-opts="[10,15,20]"
            @on-page-size-change="pageSizeFun"
            @on-change="pagefun"
            :show-elevator="true"
            :show-total="true"
          ></Page>
        </div>
      </div>
    </Card>
    <!-- 显示二维码 -->
    <Modal v-model="imgModel" title="二维码" :footer-hide="true" :closable="true">
      <div class="img-base" style="text-align: center;">
        <img v-if="baseImg != ''" :src="baseImg">
      </div>
    </Modal>

    <!-- 显示链接 -->
    <Modal v-model="urlModel" title="链接" :footer-hide="true" :closable="true">
      <div class="img-base" style="text-align: center;">
        <Input v-model="linkData"></Input>
      </div>
    </Modal>

  </div>
</template>

<script>
import marking from "@/api/request/marking";
import goodsUtilsFun from "@/utils/goodsUtils.js";
export default {
  name: "LuckDraw",
  data() {
    return {
      
      timeData: [],
      statusData: '-1',
      statusOption: [
        {
            id: '-1',
            name: '全部状态'
        },
        {
            id: '1',
            name: '进行中'
        },
        {
            id: '2',
            name: '未开始'
        },
        {
            id: '3',
            name: '已结束'
        }
      ],
      tableData: [],
      columns: [
        {
          title: "活动名称",
          align: "center",
          key: "name"
        },
        {
          title: "活动有效期时间",
          align: "center",
          width:"260px",
          render: (h, params) => {
            console.log(params.row.activityEndTime)
            let activityEndTime = goodsUtilsFun.timeFun(params.row.activityEndTime);
            let activityStartTime= goodsUtilsFun.timeFun(params.row.activityStartTime);
            return h("div", {}, [
              h(
                "span",
                activityStartTime+" 至 "+activityEndTime
                )
            ]);
          }
        },
        
        {
          title: "参与人群",
          align: "center",
          width:"150px",
          render: (h, params) => {
            let participants = params.row.participants;
            let participantstext=participants==1?"全部用户":"指定用户"
            return h("div", {}, [
              h(
                "span",
                participantstext
                )
            ]);
          }
        },
        {
          title: "参与人/次",
          align: "center",
           render: (h, params) => {
            // 参与人数
            let totalNumber = params.row.totalNumber;
            // 参与次数
            let totalFrequency = params.row.totalFrequency;
            return h("div", [
              // 禁用启用
              h(
                "span",
                {
                  style:{
                   
                  },
                },
                totalNumber+'/'+totalFrequency
              )
            ]);
          }
        },
        {
          title: "中奖/未中奖(人)",
          align: "center",
          render: (h, params) => {
            // 中奖人数
            let winPrizeNumber = params.row.winPrizeNumber;
            // 参与人数
            let noWinPrizeNumber = params.row.noWinPrizeNumber;
            return h("div", [
              // 禁用启用
              h(
                "span",
                {
                  style:{
                   
                  },
                },
                winPrizeNumber+'/'+noWinPrizeNumber
              )
            ]);
          }
        },
        {
          title: "状态",
          key: "statuscontent",
          align: "center",
          
          render: (h, params) => {
            let status = params.row.status;
            
            let statuscontent=(status == 1 ? "进行中" : (status == 2 ? "未开始":"已结束"));
            return h("div", [
              // 禁用启用
              h(
                "Button",
                {
                  props: {
                    type: status == 1 ? "primary" : "default",
                    size: "small"
                  },
                  on: {
                    click: () => {}
                  }
                },
                statuscontent
              )
            ]);
          }
        },  
        {
          title: "操作",
          key: "action",
          align: "center",
          width:"290px",
          render: (h, params) => {
            let status = params.row;
           
            return h("div",{
              style:{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                color:'#0083b0',
                'font-size':'13px'
              }
            }, [
        
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-left':'5px',
                  'padding-right':'5px',
                  'cursor': "pointer",
                  'display': this.hasRole(40402) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.toLink(2,params.row.id)
                  }
                }
              },'编辑'),

              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding':'0 5px',
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.operationFun(status.id);
                  }
                }
              },'链接地址'),

              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding':'0 5px',
                  'cursor': "pointer",
                  'display': this.hasRole(40405) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.lotteryInformation(status.id,status.name);
                  }
                }
              },'开奖信息'),


              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding':'0 5px',
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.qrcodeFun(status.id);
                  }
                }
              },'二维码'),

              h('div', {
                class:'',
                style:{
                  'padding':'0 5px',
                  'cursor': "pointer",
                  'display': this.hasRole(40404) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.ActivatyDeletefuc(status.id)
                  }
                },
              },'删除'),
              
            ]);
          }
        }
      ],
      // 查询相关
      total: 0,
      size: 10,
      current: 1,
      activityStartTime:"",
      activityEndTime:"",
      status:"-1",
      name:"",
      // 图片
      baseImg:"",
      imgModel:false,
      // 链接
      linkData:"",
      urlModel:false,
    };
  },
  created() {
    // 请求数据
    this.getData();
  },
  
  methods: {
    // 获取时间
    timeChange:function(value) {
      this.activityStartTime=goodsUtilsFun.timeStamp(value[0]),
      this.activityEndTime=goodsUtilsFun.timeStamp(value[1]),
      console.log(value)
    },
    
    // 获取数据
    getData:function() {
      marking.Activatylist({
        current:this.current,
        size:this.size,
        activityStartTime:this.activityStartTime,
        activityEndTime:this.activityEndTime,
        status:this.statusData,
        name:this.name
      }).then(res => {
        console.log("数据",res)
        if (res.code == 1) {
          this.total=res.data.total
          this.tableDatafuc(res.data.rows)
        } 
        else {
          this.$Message.error(res.message);
        }

        }).catch(error => {
          console.log(error);
      });
    },
    
    // 处理数据渲染表格
    tableDatafuc:function(data){
      this.tableData=data
      console.log("表格数据",this.tableData)
    },
    
    // 查询
    search:function() {
      this.current = 1,
      this.getData()
    },
    
    // 跳转链接
    toLink:function(role,id){ 
     this.$router.push({ path: '/@/views/coupon/luckdraw/AddLuckDraw', 
          query: { 
            role:role,
            id:id
          }
      })
    },

    // 链接
    operationFun:function(ID) {
      this.linkData = '/marking/luckyDraw/index?id='
      this.linkData = this.linkData + ID
      this.urlModel = true
      console.log(this.linkData)
    },

    // 跳至开奖列表
    lotteryInformation:function(ID,name){
      this.$router.push({ path: '/@/views/coupon/luckdraw/lotterylist', 
          query: { 
            id:ID,
            name:name
          }
      })
    },

    //二维码
    qrcodeFun:function(ID){
     marking.activatyQRCode({
        id:ID
      }).then(res => {
        console.log("数据",res)
        if (res.code == 1) {
          console.log(res)
          let baseimg = 'data:image/jpeg;base64,' + res.data
          this.baseImg=baseimg
          this.imgModel = true
        } else {

          this.$Message.error(res.message);
        }
        }).catch(error => {
          console.log(error);
      });
    },
    
    // 删除抽奖活动
    ActivatyDeletefuc:function(ID){
      console.log(ID);
       marking.ActivatyDelete({
         id:ID
      }).then(res => {
        if (res.code == 1) {
          this.$Message.success(res.message);
          this.getData()
        } else {
          this.$Message.error(res.message);
        }
        }).catch(error => {
          console.log(error);
      });
    },

    // 翻页
    pagefun:function(index) {
      this.current = index;
      this.getData()
    },
    pageSizeFun(data) {
      this.size = data
      this.getData()
    },    
    // 退回时刷新表格
    fetchData:function(){
      this.getData();
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="less" scoped>
#luck-draw {
  #header {
    margin-bottom: 16px;
    .mar-le {
      margin-left: 20px;
    }
  }
  .main {
    .tips {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-right: 14px;
      background-image: url("../../../assets/images/u368.png");
      background-size: 100% 100%;
      vertical-align: middle;
    }
  }
  .img-base{
    text-align: center;
  }
  .footer {
    margin-top: 20px;
    .page {
      float: right;
    }
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }
}
</style>

