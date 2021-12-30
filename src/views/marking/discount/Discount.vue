<template>
  <div class="container">
    <div class="currentTitle">限时折扣</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          <!-- 新增限时折扣 -->
          <router-link :to="{name:'CreateDiscount'}">
            <Button
              v-if="hasRole(40102)"
              type="primary"
              size="small"
              class="comBtn"
              style="margin-left:0;"
            >+ 限时折扣</Button>
          </router-link>

          <Button
            type="primary"
            size="small"
            @click="refresh"
            class="comBtn"
            style="margin-left:0;"
          >刷新数据</Button>
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
                @on-change="changepage"
                show-elevator
                show-total
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
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
          <img src="@/assets/images/u368.png" style="width: 30px;height: 30px;" />
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
  name: "Discount",
  // inject:['reload'],
  data() {
    return {
      pageSize: 10, //每页显示多少条
      total: 0, //总条数
      current: 1, //当前页
      tableData1: [],
      modal2: false,
      suzu: [],
      //临时存放id
      tempId: "",
      // 商品ID
      goodID: [],
      columns7: [
        {
          title: "优惠类型",
          key: "type",
          align: "center",
          width: 90,
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
          width: 200,
          render: (h, params) => {
            let titles = params.row.titles;
            return h("div", titles);
          }
        },
        {
          title: "活动时间",
          key: "time",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
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
          width: 100,
          render: (h, params) => {
            let payOrderCount = params.row.payOrderCount;
            return h("div", payOrderCount);
          }
        },
        {
          title: "参与客户数",
          key: "attendUserCount",
          align: "center",
          width: 100,
          render: (h, params) => {
            let attendUserCount = params.row.attendUserCount;
            return h("div", attendUserCount);
          }
        },
        {
          title: "实付金额(元)",
          key: "payAmount",
          align: "center",
          width: 120,
          render: (h, params) => {
            let payAmount = params.row.payAmount;
            return h("div", "￥" + payAmount);
          }
        },
        {
          title: "笔单价(元)",
          key: "unitPrice",
          align: "center",
          width: 100,
          render: (h, params) => {
            let unitPrice = params.row.unitPrice;
            return h("div", unitPrice);
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 80,
          render: (h, params) => {
            let status = params.row.status;
            return h("div", [
              status == "0"
                ? h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
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
                        size: "small"
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
          key: "time",
          align: "center",
          width: 200,
          render: (h, params) => {
            let status = params.row.status;
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
                      "border-right": this.hasRole(4010601)
                        ? "1px solid #0083b0"
                        : "none",
                      "padding-right": "10px",
                      cursor: "pointer",
                      display: this.hasRole(40106) ? "block" : "none"
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
                  },
                  "编辑"
                ),
                h(
                  "div",
                  {
                    class: "",
                    style: {
                      "border-right": "1px solid #0083b0",
                      padding: "0 10px",
                      cursor: "pointer",
                      display: this.hasRole(4010601) ? "block" : "none"
                    },
                    on: {
                      click: index => {
                        console.log(params.row.status);
                        this.xiugai(params, index);
                      }
                    }
                  },
                  params.row.status == 0 ? "禁用" : "启用"
                ),
                h(
                  "div",
                  {
                    class: "",
                    style: {
                      padding: "0 10px",
                      cursor: "pointer",
                      display: this.hasRole(4010602) ? "block" : "none"
                    },
                    on: {
                      click: index => {
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
                              this.switchFun();
                            },
                            onCancel: () => {}
                          });
                        }
                      }
                    }
                  },
                  "删除"
                )
              ]
              //   [h(
              //     "Icon",
              //     {
              //       class: {
              //         iconfont: true,
              //         "icon-edit-square": true
              //       },
              //       style: {
              //         cursor: "pointer"
              //       },
              //       on: {
              //         click: () => {
              //           if (params.row.status == 1) {
              //             this.editGroup(params.row.id);
              //           } else {
              //             this.$Message.error("启用状态无法修改");
              //           }
              //         }
              //       }
              //     },
              //     "编辑"
              //   ),
              //   h(
              //     "Icon",
              //     {
              //       class: {
              //         iconfont: true,
              //         "icon-warning-circle": true
              //       },
              //       style: {
              //         cursor: "pointer",
              //         marginLeft: "15px",
              //         marginRight: "15px"
              //       },
              //       on: {
              //         click: index => {
              //           this.xiugai(params, index);
              //         }
              //       }
              //     },
              //     "禁用"
              //   ),
              //   h(
              //     "Icon",
              //     {
              //       class: {
              //         iconfont: true,
              //         "icon-delete": true
              //       },
              //       style: {
              //         cursor: "pointer"
              //       },
              //       // 删除提示
              //       on: {
              //         click: index => {
              //           if (params.row.status == false) {
              //             this.$Modal.confirm({
              //               title: "确认提示",
              //               content:
              //                 "<p>该活动启用中，如需删除需先禁用活动！</p>",
              //               okText: "确认禁用",
              //               onOk: () => {
              //                 this.stateChange(params, index);
              //                 params.row.status == false;
              //                 console.log(params.row.status, "333");
              //               },
              //               onCancel: () => {}
              //             });
              //           } else {
              //             this.$Modal.confirm({
              //               title: "确认提示",
              //               content: "<p>是否确认删除这个活动</p>",
              //               onOk: () => {
              //                 this.removeDate(params, index);
              //                 this.switchFun();
              //               },
              //               onCancel: () => {}
              //             });
              //           }
              //         }
              //       }
              //     },
              //     "删除"
              //   )
              // ]
            );
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
      // console.log(this.current)
    },
    pageSizeFun(data) {
      console.log(data)
      this.pageSize = data
      this.switchFun()
    },
    // 刷新
    refresh() {
      marking.refreshDiscount({}).then(res => {});
    },

    // 弹出框接口
    xiugai(params, index) {
      this.tempId = this.suzu[params.index].id;
      let tempStatus = this.suzu[params.index].status ? 0 : 1;
      if (tempStatus == 1) {
        // 直接执行更改状态
        console.log("123123");
        // tempStatus = !tempStatus
        this.stateChange(params, index);
      } else {
        marking
          .discountStatus({
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
    //修改状态
    stateChange(params, index) {
      this.tempId = this.suzu[params.index].id;
      let tempStatus = this.suzu[params.index].status ? 0 : 1;
      marking
        .discountUpdeteStatus({
          id: this.tempId,
          status: tempStatus
        })
        .then(res => {
          console.log(res, "222");
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

    // 获取商品组详情
    goodsDetail: function(id) {
      let _this = this;
      marking
        .discountDetail({
          id: id
        })
        .then(res => {
          if (res.code == 1) {
            let data = res.data.rows;
            // _this.forntShow = ''+data.status
            // _this.searchName = data.name
            // _this.showData = data.listGoods
          }
        });
    },

    //删除
    removeDate(params, index) {
      marking
        .discountDelete({
          id: params.row.id
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success("删除成功");
            // this.reload()
            this.switchFun();
          } else {
            // this.$Message.info(res.message)
          }
        })
        .catch(err => {
          // this.$Message.error('删除失败')
        });
    },

    // 编辑

    editGroup(index) {
      console.log(index);
      this.$router.push({
        path: "/@/views/marking/discount/components/EditDiscount",
        query: { id: index }
      });
    },

    // 获取数据的接口函数
    switchFun(index) {
      marking
        .discountList({
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
      let datas = res.data.rows;
      let tempReq = {};
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
          expiryEndTime,
          time
        } = item;
        tempReq.id = id;
        tempReq.type = type;
        tempReq.titles = titles;
        tempReq.expiryBeginTime = expiryBeginTime;
        tempReq.expiryEndTime = expiryEndTime;
        tempReq.time = time;
        tempReq.payOrderCount = payOrderCount;
        tempReq.payAmount = payAmount;
        tempReq.unitPrice = unitPrice;
        tempReq.status = status;
        tempReq.attendUserCount = attendUserCount;
        this.suzu.push(tempReq);
        tempReq = {};
        this.tempId = id;
      });
    },

    //删除
    remove(index) {
      this.tableData1.splice(index, 1);
    }
  },
  activated() {
    console.log('234234234');
    this.switchFun();
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
.ivu-card-body {
}
.currentTitle {
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
</style>
