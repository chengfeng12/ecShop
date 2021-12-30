<template>
  <div>
    <p>分享助力</p>
    <Card>
      <div slot="title">
        <Button v-if="hasRole(11020101)" @click="gotolink(1,'')" type="primary">+添加新活动</Button>
      </div>
      <div>
        <div class="main">
          
          <Table border :columns="columns" :data="tableData"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <!-- show-elevator 显示电梯，可以快速切换到某一页 -->
              <Page
                :total="total"
                :page-size="size"
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
    <Modal title="确认提示"
      v-model="deleteModel" 
      :closable="false"
      @on-ok="dataDelete">
        <p>是否确认删除这个活动</p>
    </Modal>
  </div>
</template>

<script>
import marking from "@/api/request/marking";
import goodsUtilsFun from "@/utils/goodsUtils.js";
export default {
  name: "helpshare",
  data() {
    return {
      urlModel:false,
      imgModel:false,
      deleteModel:false,
      baseImg:"",
      linkData:"",
      tableData:[],
      current:1,
      size:10,
      total:0, 
      status:"",
      ID:"",
      columns: [
        {
          title: "助力活动名称",
          align: "center",
          key: "activityName",
        },
        {
          title: "活动有效期时间",
          align: "center",
           width:"280", 
          render: (h, params) => {
            
            let startTime = goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(params.row.activityendTime));
            let endTime = goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(params.row.activitystartTime));
       
            return h("div", [
              // 禁用启用
              h(
                "span",
                {  
                },
                startTime
              ),
              h(
                "span",
                {  
                },
                "至"
              ),
              h(
                "span",
                {  
                },
                endTime
              )
            ]);
          }
        },
        {
          title: "活动类型",
          align: "center",
          render: (h, params) => {
            let activityType = params.row.activityType==1 ? "好友助力" : "分享即得"
            return h("div", [
              // 禁用启用   
              h(
                "span",
                {  
                },
                activityType
              )
            ]);
          }
        },
        {
          title: "活动渠道",
          align: "center",
          render: (h, params) => {
            let channels = params.row.channels==1 ? "微信小程序" : ""
            return h("div", [
              // 禁用启用   
              h(
                "span",
                {  
                },
                channels
              )
            ]);
          }
        },
        {
          title: "状态",
          align: "center",
         
          render: (h, params) => {
            let status = params.row.status==1 ? "启用" : "禁用"
            return h("div", [
              // 禁用启用   
              h(
                "Button",
                { 
                  props: {
                    type: params.row.status==1 ? "primary" : "default",
                    size: "small"
                  }, 
                },
                status
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: "290px",
          render: (h, params) => {
            let status = params.row;

            return h(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0083b0",
                  "font-size": "13px"
                }
              },
              [
                h(
                  "div",
                  {
                    class: "",
                    style: {
                      "border-right": "1px solid #0083b0",
                      "padding-left": "5px",
                      "padding-right": "5px",
                      cursor: "pointer",
                      display: this.hasRole(11020101) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.gotolink(2,params.row.id);
                      }
                    }
                  },
                  params.row.status==1 ? "查看": "编辑"
                ), 

                h(
                  "div",
                  {
                    class: "",
                    style: {
                      "border-right": "1px solid #0083b0",
                      padding: "0 5px",
                      cursor: "pointer",
                      display: this.hasRole(11020102) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.ID=params.row.id
                        this.status=params.row.status
                        if(params.row.status==1){
                          this.updatestatusfuc()
                        }
                        else{
                          this.selectStatusfuc()
                        }
                        
                      }
                    }
                  },
                  params.row.status==1?" 禁用":"启用"
                ),

                h(
                  "div",
                  {
                    class: "",
                    style: {
                      "border-right": "1px solid #0083b0",
                      padding: "0 5px",
                      cursor: "pointer",
                      color:params.row.status==1?"rgb(0, 131, 176)":"#999999"
                    },
                    on: {
                      click: () => {
                        if(params.row.status==1){
                          this.operationFun(params.row.id);
                        }
                        
                      }
                    }
                  },
                  "链接"
                ),
                h(
                  "div",
                  {
                    class: "",
                    style: {
                      "border-right": "1px solid #0083b0",
                      padding: "0 5px",
                      cursor: "pointer",
                      color:params.row.status==1?"rgb(0, 131, 176)":"#999999"
                    },
                    on: {
                      click: () => {
                        if(params.row.status==1){
                          this.qrcodeFun(params.row.id);
                        }
                      }
                    }
                  },
                  "二维码"
                ),

                h(
                  "div",
                  {
                    class: "",
                    style: {
                      padding: "0 5px",
                      cursor: "pointer",
                      display: this.hasRole(11020103) ? "block" : "none",
                      
                    },
                    on: {
                      click: () => {
                        if(params.row.status==1){
                          this.$Message.error("启用状态下无法删除")
                        }
                        else{
                          this.deleteModel=true;
                          this.ID=params.row.id
                        

                        }
                      }
                    }
                  },
                  "删除"
                ) 
              ]
            );
          }
        }
      ]
    };
  },
  created() {
    this.helpsharelistfuc()
  },
  methods:{
    gotolink:function(role,id){
        this.$router.push({
            path: "/@/views/appliedmanagement/helpshare/addhelpshare",
            query: { 
              role:role,
              id:id
            }
        });
    },
    dataDelete:function(){
      this.ActivatyDeletefuc(this.ID);
    },
    // 链接
    operationFun:function(ID) {
      this.linkData = '/add/shareHelp/index/index?id='
      this.linkData = this.linkData + ID
      this.urlModel = true
      console.log(this.linkData)
    },
    // 分享助力活动列表
    helpsharelistfuc:function(){
      marking.helpsharelist({
        current: this.current,
        size:this.size
      }).then(res => {   
        if(res.code==1){
          this.tableData=res.data.rows,
          console.log(" this.tableData",this.tableData)
          this.total=res.data.total
        }else{
           this.$Message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      });
    },
    // 判断是否可以开启
    selectStatusfuc:function(){
      marking.selectStatus({
        status:1
      }).then(res => {   
          if(res.code==1){
            if(res.data==4){
               this.updatestatusfuc()
            }
            else{
              this.$Message.error("分享助力活动只能开启一个")
            }
          }else{
            this.$Message.error(res.message)
          }

        }).catch(error => {
          console.log(error)
        });
    },
    // 改变状态
    updatestatusfuc:function(){
      let statuskey=(this.status==1 ? 2 : 1)
      marking.updatestatus({
        id: this.ID,
        status:statuskey
      }).then(res => {   
        if(res.code==1){
          this.helpsharelistfuc()
        }else{
          this.$Message.error(res.message)
        }
        }).catch(error => {
          console.log(error)
        });
    },
    // 分页
    changePage:function(value){
      this.current=value,
      this.helpsharelistfuc()
    },
    // 每页最大条数
    pageSizeFun(data) {
      this.size = data
      this.helpsharelistfuc()
    },
    // 二维码
    qrcodeFun:function(ID){
     marking.shareCode({
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
    // 删除活动
    ActivatyDeletefuc:function(ID){
       marking.shareDelete({
        id:ID
      }).then(res => {
  
        if (res.code == 1) {
          this.helpsharelistfuc()
          this.ID="";
        } else {
         
          this.$Message.error(res.message);
        }
        }).catch(error => {
          console.log(error);
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>