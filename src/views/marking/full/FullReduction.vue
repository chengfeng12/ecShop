<template>
  <div class="container">
    <div class="currentTitle">满额立减</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          <!-- 新增满额立减 -->
          <router-link :to="{name:'CreateReduction'}">
            <Button type="primary" size="small" v-if="hasRole(40103)" class="comBtn" style="margin-left:0">+ 新增满额立减</Button>
          </router-link>

          <Button type="primary" size="small" @click="refresh" class="comBtn" style="margin-left:0;">刷新数据</Button>
        </div>
        <div class="item2">
          <!-- 表格  stripe斑马纹-->
          <Table :data="suzu" :columns="tableColumns1" style="margin-right:16px;" stripe border></Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                :total="total"
                :page-size="pageSize"
                :current="current"
                @on-change="changepage"
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
                show-elevator
                show-total
                style="margin-right:16px;"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <Modal v-model="modal2" title="确认提示" width="400" class="warp">
      <p slot="header" style="color:#000;text-align:center">
        <span>确认提示</span>
      </p>
      <div class="center_c">
        <span style="display: block;position: absolute;left: 20px;top: 80px;">
          <img src="@/assets/images/u368.png" style="width: 30px;height: 30px;">
        </span>
        <span style="font-size: 16px;margin-left: 50px;display: block">
          <p>是否启用该活动</p>
          <p>仅有一个活动可启用，请先禁用已启用活动。</p>
        </span>
      </div>
      <div slot="footer" class="footer">
        <Button size="large" @click="modal2=false">取消</Button>
        <Button size="large" disabled>确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import marking from "@/api/request/marking";
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils";

export default {
  name: "marking",

  data() {
    return {
      modal2: false,
      tableData1: [],
      pageSize: 10, //每页显示多少条
      total: 0, //总条数
      current: 1, //当前页
      // 临时数据存放
      suzu: [],
      //临时存放id
      tempId: "",
      // 商品ID
      goodID: [],
      // 表头
      tableColumns1: [
        {
          title: "优惠类型",
          key: "type",
          align: "center",
          width: 100,
          render: (h, params) => {
            let type = params.row.type;
            let text = type === 1 ? "消费金额" : type === 2 ? "购买件数" : "";
            return h("div", text);
          }
        },
        {
          title: "活动名称",
          key: "titles",
          align: "center",
          width:200,
          render: (h, params) => {
            let titles = params.row.titles;
            return h("div", titles);
          }
        },
        {
          title: "活动时间",
          key: "time",
          align: "center",
          width:250,
          render: (h, params) => {
            // console.log(params.row,'6')
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
          title: "支付订单数",
          key: "payOrderCount",
          align: "center",
          width:150,
          render: (h, params) => {
            let payOrderCount = params.row.payOrderCount;
            return h("div", payOrderCount);
          }
        },
        {
          title: "参与客户数",
          key: "attendUserCount",
          align: "center",
          width:150,
          render: (h, params) => {
            let attendUserCount = params.row.attendUserCount;
            return h("div", attendUserCount);
          }
        },
        {
          title: "实付金额(元)",
          key: "payAmount",
          align: "center",
          width:150,
          render: (h, params) => {
            let payAmount = params.row.payAmount;
            return h("div", '￥'+payAmount);
          }
        },
        {
          title: "笔单价(元)",
          key: "unitPrice",
          align: "center",
          width:150,
          render: (h, params) => {
            let unitPrice = params.row.unitPrice;
            return h("div", '￥'+unitPrice);
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
          key: "mark",
          align: "center",
          width:250,
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
                  'border-right': this.hasRole(4010402)?'1px solid #0083b0':'none',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(40104) ?'block':'none',    
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
                  'display': this.hasRole(4010402) ?'block':'none', 
                },
                on: {
                  click: index => {
                    console.log(params.row.status)
                    this.xiugai(params, index);
                  }
                }
              },params.row.status==0? '禁用':'启用'),
              
              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(4010401) ?'block':'none',  
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
              //   h(
              //   "Icon",
              //   {
              //     class: {
              //       iconfont: true,
              //       "icon-edit-square": true
              //     },
              //     style: {
              //       cursor: "pointer"
              //     },
              //     on: {
              //       click: () => {
              //         if (params.row.status == 1) {
              //           this.editGroup(params.row.id);
              //         } else {
              //           this.$Message.error("启用状态无法修改");
              //         }
              //       }
              //     }
              //   },
              //   "编辑"
              // ),
              // h(
              //   "Icon",
              //   {
              //     class: {
              //       iconfont: true,
              //       "icon-warning-circle": true
              //     },
              //     style: {
              //       cursor: "pointer",
              //       marginLeft: "15px",
              //       marginRight: "15px"
              //     },
              //     on: {
              //       click: index => {
              //         this.xiugai(params, index);
              //       }
              //     }
              //   },
              //   "禁用"
              // ),
              // h(
              //   "Icon",
              //   {
              //     class: {
              //       iconfont: true,
              //       "icon-delete": true
              //     },
              //     style: {
              //       cursor: "pointer"
              //     },
              //     // 删除提示
              //     on: {
              //       click: index => {
              //         if (params.row.status == false) {
              //           this.$Modal.confirm({
              //             title: "确认提示",
              //             content:
              //               "<p>该活动启用中，如需删除需先禁用活动！</p>",
              //             okText: "确认禁用",
              //             onOk: () => {
              //               this.stateChange(params, index);
              //               params.row.status == false;
              //               console.log(params.row.status, "333");
              //             },
              //             onCancel: () => {}
              //           });
              //         } else {
              //           this.$Modal.confirm({
              //             title: "确认提示",
              //             content: "<p>是否确认删除这个活动</p>",
              //             onOk: () => {
              //               this.removeDate(params, index);
              //             },
              //             onCancel: () => {}
              //           });
              //         }
              //       }
              //     }
              //   },
              //   "删除"
              // )
            ]);
          }
        }
      ]
    };
  },
  created() {},

  methods: {
    // 初始化
    init: function() {
      // this.goodsDetail(this.this.suzu[index].id)
    },


    // 刷新
    refresh(){
      marking
        .refreshFull({})
        .then(res => {
          
        });
    },
    //分页
    changepage(index) {
      this.current = index;
      this.switchFun()
      console.log(this.suzu);
    },
    pageSizeFun(data) {
      console.log(data)
      this.pageSize = data
      this.switchFun()
    },
    // 获取商品组详情
    goodsDetail: function(id) {
      let _this = this;
      marking
        .manJianDetail({
          id: id
        })
        .then(res => {
          if (res.code == 1) {
            let data = res.data.rows;
            console.log(data, "2");
          }
        });
    },

    // 弹出框接口
    xiugai(params, index) {
      this.tempId = this.suzu[params.index].id;
      let tempStatus = this.suzu[params.index].status ? 0 : 1;
      if (tempStatus == 1) {
        // 直接执行更改状态
        console.log("123123");
        this.stateChange(params, index);
      } else {
        marking
          .manJianStatus({
            id: this.tempId,
            status: tempStatus
          })
          .then(res => {
            // console.log(status)
            if (res.code == 1) {
              // console.log(tempStatus)
              if (res.data == 3) {
                this.modal2 = true;
              } else if (res.data == 4) {
                this.modal1 = true;
                this.$Modal.confirm({
                  title: "确认提示",
                  content:
                    "<p>确认启用该活动</p><p>仅有一个活动可启用，请先禁用已启用活动。</p>",
                  okText: "确认",
                  onOk: () => {
                    this.stateChange(params, index);
                  },
                  onCancel: () => {}
                });
              }
            }
          })
          .catch(err => {});
      }
    },

    // 修改状态
    stateChange(params, index) {
      // console.log(params)
      //  console.log(index)
      this.tempId = this.suzu[params.index].id;
      let tempStatus = this.suzu[params.index].status ? 0 : 1;
      marking
        .manJianUpdateStatus({
          id: this.tempId,
          status: tempStatus
        })
        .then(res => {
          console.log(res, "222");
          console.log(tempStatus, "444");
          if (res.code == 1) {
            this.switchFun();
            this.$Message.success(res.message);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //删除
    removeDate(params, index) {
      marking
        .manJianDelete({
          id: params.row.id
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success("删除成功");
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
        path: "/@/views/marking/full/components/EditReduction",
        query: { id: index }
      });
    },

    // 获取数据的接口函数
    switchFun(index) {
      marking
        .manJianList({
          current: this.current,
          size: this.pageSize,
          total: this.total
        })
        .then(res => {
          if ((res.code = 1)) {
            this.getDataFun(res);
            console.log(res);
            this.total = res.data.total;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {});
    },

    getDataFun(res) {
      this.suzu = [];
      // console.log(res.data.rows)
      let datas = res.data.rows;
      let tempReq = {};
      // console.log(goodsUtilsFun.timeFun(expiryBeginTime),'222')
      datas.forEach(item => {
        let {
          id,
          type,
          titles,
          expiryBeginTime,
          payOrderCount,
          payAmount,
          unitPrice,
          status,
          attendUserCount,
          time,
          expiryEndTime
        } = item;
        tempReq.id = id;
        tempReq.time = time;
        tempReq.type = type;
        tempReq.titles = titles;
        tempReq.expiryBeginTime = expiryBeginTime;
        tempReq.expiryEndTime = expiryEndTime;
        tempReq.payOrderCount = payOrderCount;
        tempReq.payAmount = payAmount;
        tempReq.unitPrice = unitPrice;
        tempReq.status = status;
        tempReq.attendUserCount = attendUserCount;
        this.suzu.push(tempReq);
        tempReq = {};
        this.tempId = id;
      });
    }
  },
  activated() {
    console.log('123123123')
    this.switchFun(); //再次调用获取列表数据方法
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
  background: #fff;
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
.ivu-card-body{
  padding: 0px;
}
.currentTitle{
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
</style>
