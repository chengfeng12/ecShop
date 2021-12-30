<template>
  <div class="container">
    <div class="currentTitle">短信模板</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          <Button type="primary" v-if="hasRole(60303)" size="small" class="comBtn" style="margin-left:0;" @click="add">+添加新模板</Button>
          <!--时间-->
          <DatePicker
            size="small"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期"
            style="width: 350px"
            @on-change="timeSelect"
          ></DatePicker>
          <!-- 渠道 -->
          <!-- <Select style="width:100px;margin-left:30px;" placeholder="全部服务商" v-model="name" >
            <Option value="">全部服务商</Option>
            <Option value="1">阿里短信</Option>
            <Option value="2">云片短信</Option>
          </Select> -->
           <!-- <Select style="width:100px;" placeholder="请选择服务商号" v-model="name">
                    <Option
                      v-for="(site,index) in arr"
                      :key="index"
                      :value="site.id"
                    >{{ site.name }}</Option>
                  </Select> -->
          <!-- 优惠券类型 -->
          <Select size="small" style="width:100px;margin-left:30px;" placeholder="全部状态" v-model="status">
            <Option
              v-for="item in chooseList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <!-- 搜索 -->
          <Input size="small" placeholder="输入关键词搜索" style="width: 200px; margin-left: 20px" v-model="smsName"/>
          <Button type="primary" size="small" class="comBtn"  @click="selectbtn()">搜索</Button>
        </div>
        <div class="item2">
          <!-- 表格  stripe斑马纹-->
          <Table :data="suzu" :columns="tableColumns1" style="margin-right:16px;" stripe border></Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                :total="total"
                :page-size="size"
                :current="current"
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
                @on-change="changepage"
                :show-elevator="true"
                :show-total="true"           
                style="margin-right:16px;"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import member from "@/api/request/sms";
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils";

export default {
  data() {
    return {
      // 查询相关
      size: 10, // 每页条数
      total: 0, // 总条数
      current: 1, // 页码
      status: "", //状态
      name: "",
      timeDate:'',
      smsName: "", //搜索关键词
      arr:[],
      suzu: [],
      ModeList: [
        {
          value: "",
          label: "全部服务商"
        },
        {
          value: "1",
          label: "阿里短信"
        },
        {
          value: "2",
          label: "云片短信"
        }
    
      ],
      chooseList: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "禁用"
        }
      ],
      tableColumns1: [
        {
          title: "序号",
          key: "activeID",
          align: "center",
          width: 60,
          render: (h, params) => {
            // console.log(params.index);
            let activeID = params.index + 1;
            return h("div", activeID);
          }
        },
        {
          title: "模板名称",
          key: "smsName",
          align: "center",
          width: 150,
          render: (h, params) => {
            let smsName = params.row.smsName;
            return h("div", smsName);
          }
        },
        {
          title: "服务商",
          key: "name",
          align: "center",
          render: (h, params) => {
            // console.log(params,'服务商')
            let name = params.row.name;
            return h("div", name);
          }
        },
        {
          title: "模板ID",
          key: "smsTemplateId",
          align: "center",
          render: (h, params) => {
            let smsTemplateId = params.row.smsTemplateId;
            return h("div", smsTemplateId);
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
          render: (h, params) => {
            let createTime = goodsUtilsFun.timeFun(new Date(params.row.createTime).getTime()
            );
            return h("div", createTime);
          }
        },

        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, params) => {
            let status = params.row.status;
            return h("div", [
              status == "1"
                ? h(
                    "Button",
                    {
                      props: {
                        type: "primary"
                      },
                      style: {}
                    },
                    "启用"
                  )
                : status == "0"
                ? h(
                    "Button",
                    {
                      props: {
                        type: "error"
                      }
                    },
                    "禁用"
                  )
                : null
            ]);
          }
        },
        {
          title: "操作",
          key: "mark",
          width: 250,
          align: "center",
          render: (h, params) => {
            let status = params.row.status;
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
                  'padding-right':'10px',
                  cursor: "pointer",
                  'display': this.hasRole(60303) ?'inline':'none',
                },
                on: {
                  click: () => {
                    this.editGroup(params.row.id)
                  }
                }
              },'编辑'),
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-right':'10px',
                  'padding-left':'10px',
                  cursor: "pointer",
                  'display': this.hasRole(6030302) ?'inline':'none',
                },
                on: {
                  click: index => {
                    console.log(this.suzu[params.index].status);
                    if (this.suzu[params.index].status == 1) {
                      this.$Modal.confirm({
                        title: "确认提示",
                        content: "<p>是否确认禁用该模板?</p>",
                        onOk: () => {
                          this.stateChange(params, index);
                        },
                        onCancel: () => {}
                      });
                    } else {
                      this.stateChange(params, index);
                    }
                  }
                }
              },'禁用'),
              h('div', {
                class:'',
                style:{
                  'padding-left':'10px',
                  cursor: "pointer",
                  'display': this.hasRole(6030303) ?'inline':'none',
                },
                on: {
                  click: index => {
                    if (this.suzu[params.index].status == 1) {
                      this.$Modal.confirm({
                        title: "确认提示",
                        content:
                          "<p>已启用的模板不得直接删除，请先禁用该模板</p><p>是否禁用？</p>",
                        onOk: () => {
                          this.stateChange(params, index);
                        },
                        onCancel: () => {}
                      });
                    } else {
                      this.$Modal.confirm({
                        title: "确认提示",
                        content: "<p>是否确认删除该模板?</p>",
                        onOk: () => {
                          this.removeDate(params, index);
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                }
              },'删除')
            ]);
          }
        }
      ]
    };
  },
  activated() {
    console.log(1);
    this.switchFun();
    this.smsServerList()
  },
  methods: {
    //分页
    changepage(index) {
      this.current = index;
      this.switchFun();
      console.log(this.suzu, "3333");
    },
    pageSizeFun(data) {
      this.size = data
      this.switchFun()
    },
     //模板服务商接口
    smsServerList() {
      member.smsSelSmsServerList({
        }).then(res => {
          console.log(res)
          if (res.code == 1) {
            console.log('请求',res.data)
            this.arr = res.data
            console.log(this.arr,'返回')
          }
        }).catch(err => {
           this.$Message.error(res.message);
        });
    },


    //搜索
    selectbtn() {
      console.log(this.name,'服务')
      console.log(this.smsName);
      this.suzu = [];
      this.arr = [];
      this.smsServerList();
      this.switchFun();
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



    //删除
    removeDate(params,index){
      console.log(params)
      member.smsDelete({
        id : params.row.id
      }).then(res =>{
        if(res.code==1){
          this.$Message.success('删除成功')
          this.switchFun()
        }
        else{
          // this.$Message.info(res.message)
    
        }
      }).catch(err=>{
        // this.$Message.error('删除失败')
      })
    },
    
    //修改状态
    stateChange(params, index) {
      this.tempId = this.suzu[params.index].id;
      let tempStatus = this.suzu[params.index].status ? 0 : 1;
      console.log(tempStatus, "33");
      member
        .smsUpdate({
          id: this.tempId,
          status: tempStatus
        })
        .then(res => {
          console.log(res, "222");
          if (res.code == 1) {
            tempStatus = !tempStatus;
            this.switchFun();
            this.$Message.success(res.message);
          } else {
            // this.$Message.error(res.message)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取数据的接口函数
    switchFun(index) {  
      console.log(this.suzu,'数据')

      member.smsList({
          startTime:this.timeDate,
          current: this.current,
          size: this.size,
          total: this.total,
          name: this.name,
          smsName: this.smsName,
          status: this.status
        }).then(res => {         
          console.log(res.data.records, "555");
          if ((res.code = 1)) {
            this.getDataFun(res);
            console.log(res, "111");
            this.total = res.data.total;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {});
    },

    getDataFun(res) {
      this.suzu = [];
      let datas = res.data.records;
      let tempReq = {};
      datas.forEach(item => {
        let { id, smsName, smsTemplateId, createTime, name, status } = item;
        tempReq.id = id;
        tempReq.smsName = smsName; //模板名称
        tempReq.smsTemplateId = item.serverInfo.templateId; //服务商模板ID
        tempReq.createTime = createTime; // 模板创建时间
        tempReq.name = item.serverInfo.name; // 服务商名称
        tempReq.status = status; // 支付状态
        this.suzu.push(tempReq);
        tempReq = {};
        this.tempId = id;
      });
      console.log(this.suzu,'数组')
    },
    // 编辑页面跳转
    editGroup(index) {
      // let gid = this.suzu[index].id
      this.$router.push({
        path: "/@/views/payment/components/addLetter",
        query: { title: "edit", id: index }
      });
    },
    // 添加页面跳转
    add() {
      this.$router.push({
        path: "/@/views/payment/components/addLetter",
        query: { title: "add" }
      });
    }
  }
};
</script>

<style scoped>
  .currentTitle{
    font-size: 13px;
    color: #000;
    padding: 4px 0;
    background: #f8fbfb;
  }
.container {
  width: 100%;
  height: 100%;
}

.container .wrapper {
  margin: 0px 17px 0 17px;
  box-sizing: border-box;
  /* background: #F3F3F3; */
  padding: 20px 0 20px 0;
  /* border: 1px solid #aeaeae; */
  margin: -16px;
}

.container .item1 {
  border-bottom: 1px solid #c9c9c9;
  padding-bottom: 16px;
  padding-left: 16px;
}

.container .comBtn {
  margin: 0 30px;
}

.container .item2 {
  margin-top: 30px;
  margin-left: 16px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
</style>
