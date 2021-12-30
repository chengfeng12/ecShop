<template>
  <div class="container">
    <div class="currentTitle">单品赠礼</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          <!-- 新赠单品赠礼 -->
          <router-link :to="{name:'CreateGift'}">
            <Button v-if="hasRole(40209)" type="primary" size="small" class="comBtn" style="margin-left:0;padding: 3px 8px">+新增单品赠礼</Button>
          </router-link>
        </div>
        <div class="item2">
          <!-- 表格  stripe斑马纹-->
          <Table :data="suzu" :columns="columns7" style="margin-right:16px;" border></Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                :total="total"
                :page-size="pageSize"
                :current="current"
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
                @on-change="changepage"
                show-elevator
                show-total
                style="margin-right:16px;"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>
     <Modal
        v-model="modalShow"
        title="确认提示"
        @on-ok="modalOK"
        @on-cancel="modalCancel">
        <p v-if="this.statuskey==1">
          确定启用此项活动吗？
        </p>
        <p v-else-if="this.statuskey==0">
          确定禁用此项活动吗？
        </p>
    </Modal>
  </div>
</template>

<script>
import marking from "@/api/request/marking";
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils";

export default {
  name: "GiftPresentation",
  data() {
    return {
      pageSize: 10, //每页显示多少条
      total: 0, //总条数
      current: 1, //当前页
      modalShow:false,
      statuskey:"",
      IDkey:"",
      tab0: true,
      suzu: [],
      tempId: "",
      goodID: [],
      columns7: [
        {
          title: "活动ID",
          key: "id",
          align: "center",
          width:100,
          render: (h, params) => {
            let id = params.row.id;
            return h("div", id);
            console.log(id);
          }
        },

        {
          title: "活动名称",
          key: "titles",
          align: "center",
          width:300,
          render: (h, params) => {
            let titles = params.row.titles;
            return h("div", titles);
          }
        },
        {
          title: "商品类型",
          key: "goodsMode",
          align: "center",
          width:150,
          render: (h, params) => {
            let type = params.row.goodsMode;
            let text = type === 1 ? "单品购买" : type === 2 ? "组合购买" : "";
            return h("div", text);
          }
        },
        {
          title: "活动时间",
          key: "time",
          align: "center",
          width:300,
          render: (h, params) => {
            console.log(params.row, "6");
            let expiryBeginTime = goodsUtilsFun.timeFun(
              new Date(params.row.expiryBeginTime).getTime()
            );
            let expiryEndTime = goodsUtilsFun.timeFun(
              new Date(params.row.expiryEndTime).getTime()
            );
            const time = expiryBeginTime + " 至 " + expiryEndTime;
            return h("div", time);
          }
        },

        {
          title: "状态",
          key: "status",
          align: "center",
          width:150,
          render: (h, params) => {
            let status = params.row.status;
            return h("div", [
              status == "0"
                ? h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size:'small'
                      },
                      style: {}
                    },
                    "已启用"
                  )
                : status == "1"
                ? h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size:'small'
                      }
                    },
                    "未启用"
                  )
                : null
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth:250,
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
              h('div', {
                class:'',
                style:{
                  'border-right': this.hasRole(4021002)?'1px solid #0083b0':'none',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(40210) ?'block':'none',
                },
                on: {
                  click: () => {
                    if (params.row.status == 1) {
                      this.editGroup(params.row.id);
                    } else {
                      this.$Message.error("启用状态无法修改");
                    }
                  }
                }
              },'编辑'),
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(4021001) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.statuskey=params.row.status,
                    this.IDkey=params.row.id,
                    this.modalShow=true             
                  }
                }
              },params.row.status==0? '禁用':'启用'),
              
              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(4021002) ?'block':'none',
                },
                on: {
                  click: (index) => {
                    if (params.row.status == false) {
                      this.$Modal.confirm({
                        title: "确认提示",
                        content:
                          "<p>该活动启用中，如需删除需先禁用活动！</p>",
                        okText: "确认禁用",
                        onOk: () => {
                          this.stateChange(params, index);
                          params.row.status == false;
                          console.log(params.row.status, "333");
                        },
                        onCancel: () => {}
                      });
                    } else {
                      this.$Modal.confirm({
                        title: "确认提示",
                        content: "<p>是否确认删除这个活动</p>",
                        onOk: () => {
                          this.removeDate(params, index);
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                }
              },'删除'),
            ]);
          }
        }
      ]
    };
  },
  methods: {
    //分页
    changepage(index) {
      this.current = index;
      this.switchFun();
      console.log(this.suzu);
    },
    // 分页
    pageSizeFun(data) {
      console.log(data)
      this.pageSize = data
      this.switchFun()
    },
    modalOK(){
      this.stateChange()
    },
    modalCancel(){
      this.IDkey="",
      this.statuskey=""
    },
    //修改状态
    stateChange() {
      let tempId = this.IDkey;
      let tempStatus = this.statuskey ? 0 : 1;
      marking
        .singleGiftUpdateStatus({
          id: tempId,
          status: tempStatus
        })
        .then(res => {
          if (res.code == 1) {
            //判断状态
       
            this.$Message.success("更改成功");
            this.switchFun();
          
           } else {
            this.$Message.error("更改失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //删除
    removeDate(params, index) {
      marking.singleGiftDelete({
          id: params.row.id
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.info("删除成功");
            this.switchFun();
          } else {
            this.$Message.info(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    },
    // 编辑
    editGroup(index) {
      console.log(index);
      this.$router.push({
        path: "/@/views/marking/GiftPresentation/components/EditGift",
        query: { id: index }
      });
    },
    // 请求数据的接口
    apiGet: function() {
      marking
        .singleGiftDetail({})
        .then(res => {
          this.addMsg(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取数据的接口函数
    switchFun(index) {
      marking
        .singleGiftList({
          current: this.current,
          size: this.pageSize,
          total: this.total
        })
        .then(res => {
          this.getDataFun(res);
          this.total = res.data.total;
          this.IDkey="";
          this.statuskey="";
        })
        .catch(err => {});
    },
    
    getDataFun(res) {
      this.suzu = [];
      let datas = res.data.rows;
      let tempReq = {};
      datas.forEach(item => {
        let {
          id,
          goodsMode,
          titles,
          expiryBeginTime,
          status,
          expiryEndTime,
          time
        } = item;
        tempReq.id = id;
        tempReq.goodsMode = goodsMode;
        tempReq.titles = titles;
        tempReq.time = time;

        tempReq.expiryBeginTime = expiryBeginTime;
        tempReq.status = status;
        tempReq.expiryEndTime = expiryEndTime;
        this.suzu.push(tempReq);
        tempReq = {};
        this.IDkey = id;
        console.log(id);
      });
    }
  },
  created() {
    console.log(1);
    this.switchFun();
  },
  watch: {
    $route() {
      this.switchFun();
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.container .title {
  height: 30px;
  line-height: 30px;
  text-indent: 20px;
  font-size: 16px;
}

.container .wrapper {
  /*margin: 0px 17px 0 17px;*/
  box-sizing: border-box;
  background: #fff;
  padding: 15px 0 50px 0;
  margin: -16px;
}

.container .tab {
  height: 1000px;
  background: #f3f3f3;
  padding-top: 16px;
  border-left: 1px solid #c9c9c9;
  border-right: 1px solid #c9c9c9;
}

.container .item1 {
  border-bottom: 1px solid #c9c9c9;
  padding-bottom: 10px;
  padding-left: 10px;
}

.container .comBtn {
  margin: 0 30px;
}

.container .fullBtn {
  margin-left: 230px;
}

.container .item2 {
  margin-top: 16px;
  margin-left: 10px;
}
.currentTitle{
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
</style>
