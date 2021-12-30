<template>
  <div class="container">
    <div class="currentTitle">全部优惠券</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          
          <!-- 新增满额立减 -->
          <Button type="primary" @click="toLink(1,'')" class="comBtn" v-if="hasRole(4030700)" style="margin-left:0;">+新增优惠券</Button>
          <!--时间-->
          <DatePicker
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期"
            style="width: 200px"
            @on-change="timeSelect">
          </DatePicker>
          <!-- 渠道 -->
          <Select v-model="channelId" style="width:100px;margin-left:15px;" placeholder="全部渠道">
            <Option value="">全部渠道</Option>
            <Option value="1">微信小程序</Option>
          </Select>
          <!-- 优惠券类型 -->
          <Select v-model="type" style="width:100px;margin-left:15px;" placeholder="全部类型">
            <Option value="">全部优惠券</Option>
            <Option value="1">现金券</Option>
            <Option value="2">折扣券</Option>
            <Option value="3">实物券</Option>
            <Option value="4">赠品券</Option>
          </Select>
          <!-- 搜索 -->
          <Input
            v-model="couponsName"
            placeholder="输入关键词搜索"
            style="width: 200px; margin-left: 15px"/>
          <Button type="primary" @click="selectbtn()" class="comBtn">搜索</Button>
        </div>

        <div class="item2">
          <!-- 表格  stripe斑马纹-->
          <Table :data="tableData" :columns="tableColumns" style="margin-right:16px;" border></Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <!-- show-elevator 显示电梯，可以快速切换到某一页 -->
              <Page
                :total="total"
                :page-size="pageSize"
                :current="current"
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
                @on-change="changePage($event)"
                :show-elevator="true"
                :show-total="true"
                
                style="margin-right:16px;"></Page>
            </div>
          </div>
        </div>
        <Modal title="确认提示" v-model="deleteModel" :closable="false" @on-ok="dataDelete">
          <p v-if="deletetextflg">已发放的优惠券删除将导致使用失败，是否确认删除这张优惠券?</p>
          <p v-else>是否确认删除这张优惠券</p>
        </Modal>
      </div>
    </Card>
  </div>
</template>

<script>
import goodsUtilsFun from "@/utils/goodsUtils.js";
import marking from "@/api/request/marking";
export default {
  name: "Coupon",
  data() {
    return {
      // 确认删除对话框
      deleteModel:false,
      deleteId:'',
      deletetextflg:true,
      // 表格数据
      tableData: [],
      tableColumns: [
        { title: "序号", key: "id", align: "center", width: 80 },
        { title: "优惠券名称", key: "coupons_name", align: "center"},
        {
          title: "使用渠道",    
          align: "center",
          width: 110,
          render: (h, params) => {
              let type = params.row.channel_id
              let text = (type == 1 ? '微信小程序':'')
              return h('span', text);
          }
        },
        { title: "优惠券类型",
          key: "type",
          align: "center",
          width: 110,
          render: (h, params) => {
          
              let type = params.row.type
            
              let text = (type == 2 ? '折扣券':type ==  1 ? '现金券':type == 3 ? '实物券':type == 4 ? '赠品券':'')
              return h('span', text);
          }
        },
        { 
          title: "使用条件", 
          align: "center",
          key: "conditions" 
        },
        
        { title: "库存", key: "stock", align: "center",width: 80, },
        { title: "创建时间", key: "create_time", align: "center",width: 150, },

        {
          title: "是否有效",
          align: "center",
          width: 100,
          render: (h, params) => {
            let status = params.row.status;
            let statuscontent = params.row.statuscontent;
            
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
          title: "状态",
          align: "center",
          width: 100,
          render: (h, params) => {
            
            let statusopen = params.row.status_open;

            let statuscontent =  params.row.status_open==1?"开启":"禁用";
            
            return h("div", [
              // 禁用启用
              h(
                "Button",
                {
                  props: {
                    type: statusopen == 1 ? "primary" : "default",
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
          render: (h, params) => {          
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
              // 编辑
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(4030700) ?'block':'none',
                },
                on: {
                  click: () => {
                    let statusopen = params.row.status_open;
                    if(statusopen==1){
                      this.$Message.error("开启状态下无法编辑")
                    }
                    else{
                      this.toLink(2,params.row.id)
                    }
                    
                  }
                }
              },'编辑'),
              // 状态值修改
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(4030702) ?'block':'none',
                },
                on: {
                  click: () => {

                    console.log("状态",params)
                    
                    let statusOp=(params.row.status_open==1)?"2":"1"

                    this.changeSelect(params.row.id,statusOp);
                  }
                }
              },params.row.status_open==1? '禁用':"启用"),
            
              // 删除

              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(4030703) ?'block':'none',
                },
                on: {
                  click: () => {
                    let statusopen = params.row.status_open;
                    if(statusopen==1){
                      this.$Message.error("开启状态下无法删除")
                    }
                    else{
                      this.deleteModel=true;
                      this.deleteId=params.row.id
                      console.log(params.row.status)
                      if(params.row.status==1){
                        this.deletetextflg=true
                      }
                      else{
                        this.deletetextflg=false
                      } 
                    }
                  }
                },
              },'删除'),
            ]);
          }
        }
      ],
      tableShow: [],
      // 查询相关
      timeDate:'',
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 页码
      current: 1,
      // 渠道
      channelId:'',
      // 优惠券类型
      type:'',
      // 优惠券类型
      couponsName:'',
      // 状态
      statusOpen:""
    };
  },
  created() {
    this.getcouponlist();
  },
  
  methods: {
    // 获取数据
    getcouponlist: function() {
      marking.Allcouponlist({
          current: this.current,
          channelId:this.channelId,
          type:this.type,
          size:this.pageSize,
          time:this.timeDate,
          couponsName:this.couponsName,
          statusOpen:this.statusOpen,  
        })
        .then(res => {   
          console.log("datasdjfbsadfjbasdnf",res)     
          if (res.code == 1) {
            this.total=res.data.total,
            this.pageSize=res.data.size
            this.tableShowfuc(res.data.rows);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 处理获得表格显示数据
    tableShowfuc: function(data) {
      let arr=[]
      for (let i in data) {
        let obj = {};
        // 序号
        (obj.id = data[i].id),
          // 优惠券名称
          (obj.coupons_name = data[i].coupons_name),
          // 使用渠道
          (obj.channel_id = data[i].channel_id),
          // 优惠券类型
          (obj.type = data[i].type),
          // 库存
          (obj.stock = data[i].stock),
          // 创建时间
          (obj.create_time = goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(data[i].create_time))),
          // 状态
          (obj.status = data[i].status);

          (obj.status_open = data[i].status_open);

          if (data[i].status == 1) {
            obj.statuscontent = "有效";
          } else if (data[i].status == 2) {
            obj.statuscontent = "未生效";
          } else if (data[i].status == 3) {
            obj.statuscontent = "失效";
          }
        // 使用条件

        let str = "";
        if (data[i].conditions == 0) {
          if (data[i].single_batch == 0) {
            str = "单笔满" + data[i].single_consumer + "元";   
          
          } else {
             str = "单笔满" + data[i].single_batch + "件";
        
          }
        } else if (data[i].conditions == 1) {
          str =
            "单笔满" +
            data[i].single_consumer +
            "元且单笔满" +
            data[i].single_batch +
            "件";
        } else if (data[i].conditions == 2) {
          str =
            "单笔满" +
            data[i].single_consumer +
            "元或单笔满" +
            data[i].single_batch +
            "件";
        }
        else if (data[i].conditions == 3) {
          str ="———"  
        }
        obj.conditions = str;
        arr.push(obj)
        
      }
      this.tableData=arr;
      console.log("data", this.tableData);
    },
    // 分页逻辑
    changePage: function(current) {
      this.current=current,
      this.getcouponlist()
    },
    pageSizeFun(data) {
      this.pageSize = data

      this.getcouponlist()
    },
    // 改变状态
    // handleSelect: function(data) {

    //   console.log(data);
    //   console.log(this.tableData);
    //   if (data.row.status == 1) {

    //     this.tableData[data.index].status = 3;

    //     this.tableData[data.index].statuscontent = "失效";

    //     this.changeSelect(3,data.row.id)

    //   } 
    //   else {
    //     // this.tableData[data.index].status = 1;
    //     // this.tableData[data.index].statuscontent = "生效";
    //     this.changeSelect(1,data.row.id)
    //   }
    // },

    // 改变状态
    changeSelect:function(id,data){
      marking.Discountsupdatestatus({
        id:id,
        statusOpen:data
      }).then(res=>{
        if(res.code==1){
          this.$Message.success(res.message)
          this.getcouponlist();
        }
        else{
          this.$Message.error(res.message)
        }
      }).catch(error=>{
          console.log(error)
      })
    },

    // 删除数据并刷新
    dataDelete:function(){
        marking.Deletecoupon({
          id: this.deleteId
        }).then(res => {
          if (res.code == 1) {

            this.$Message.success(res.message);
            this.tableData=[];
            this.getcouponlist();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 搜索框
    selectbtn:function()
    {
      console.log(this.channelId)
      this.tableData=[];
      this.getcouponlist()
    },
    timeSelect:function(value){
      if(value[0]==""&&value[0]==""){
          this.timeDate=""
      }
      else{
        this.timeDate=value
      }
      console.log("时间日期",this.timeDate)
    },
    // 跳转规则
    toLink(role,id){ 
     this.$router.push({ path: '/@/views/coupon/coupon/components/AddingCoupons', 
          query: { 
            role:role,
            id:id
          }
      })
    },
    fetchData: function() {
      this.getcouponlist();
    }

  },
  
  watch: {
    $route: "fetchData"
  }
};
</script>

<style scoped>
@import "./Coupon.css";
.currentTitle{
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
.container .wrapper {
  /*margin: 0px 17px 0 17px;*/
  box-sizing: border-box;
  background: #fff;
  padding: 15px 0 50px 0;
  margin: -16px;
}
</style>
