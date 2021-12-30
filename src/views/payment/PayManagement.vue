<template>
  <div class="container">
    <div class="currentTitle">支付管理</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          <Button
            type="primary"
            v-if="hasRole(60204)"
            class="comBtn"
            style="margin-left:0;"
            @click="add"
          >+添加支付</Button>
        </div>
        <div class="item2">
          <Table :data="suzu" :columns="columns7" style="margin-right:16px;" stripe border></Table>
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
import order from "@/api/request/order";
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils";

export default {
  name: "PayManagement",
  data() {
    return {
      size: 10, // 每页条数
      total: 0, // 总条数
      current: 1, // 页码
      tab0: true,
      suzu: [],
      columns7: [
        {
          title: "序号",
          key: "activeID",
          align: "center",
          render: (h, params) => {
            console.log(params.index);
            let activeID = params.index + 1;
            return h("div", activeID);
          }
        },

        {
          title: "支付名称",
          key: "title",
          align: "center",
          render: (h, params) => {
            let title = params.row.title;
            return h("div", title);
          }
        },
        {
          title: "支付类型",
          key: "payType",
          align: "center",
          render: (h, params) => {
            let type = params.row.payType;
            let text = type == 1 ? "微信支付" : type == 2 ? "支付宝支付" : "";
            return h("div", text);
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
          render: (h, params) => {
            let createTime = goodsUtilsFun.timeFun(
              new Date(params.row.createTime).getTime()
            );
            return h("div", createTime);
          }
        },

        {
          title: "状态",
          key: "status",
          align: "center",
          width: 80,
          render: (h, params) => {
            let status = params.row.status;
            let text = status == 0 ? "禁用" : status == 1 ? "启用" : "";
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: status == 0 ? "primary" : status == 1 ? "error" : "",
                    size: "small"
                  },
                  style: {
                    display: this.hasRole(60207) ? "block" : "none"
                  },
                  on: {
                    click: index => {
                      this.stateChange(params, index);
                    }
                  }
                },
                text
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
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
                      "border-right": "1px solid #0083b0",
                      "padding-right": "10px",
                      cursor: "pointer",
                      display: this.hasRole(60204) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.editGroup(params.row.id);
                      }
                    }
                  },
                  "编辑"
                ),
                // h(
                //   "Icon",
                //   {
                //     props: {
                //       type: "ios-create-outline",
                //       size: 24
                //     },
                //     class: {
                //       iconfont: true,
                //       "icon-edit-square": true
                //     },
                //     style: {
                //       cursor: "pointer"
                //     },
                //     on: {
                //       click: () => {
                //         console.log(params);
                //         this.editGroup(params.row.id);
                //       }
                //     }
                //   },
                //   "编辑"
                // ),
                // h(
                //   "Icon",
                //   {
                //     props: {
                //       type: "ios-trash",
                //       size: 24
                //     },
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
                //         this.$Modal.confirm({
                //           title: "确认提示",
                //           content: "<p>是否确认删除</p>",
                //           onOk: () => {
                //             this.removeDate(params, index);
                //           },
                //           onCancel: () => {}
                //         });
                //       }
                //     }
                //   },
                //   "删除"
                // )
                h(
                  "div",
                  {
                    class: "",
                    style: {
                      padding: "0 10px",
                      cursor: "pointer",
                      display: this.hasRole(60206) ? "block" : "none"
                    },
                    on: {
                      click: index => {
                        this.$Modal.confirm({
                          title: "确认提示",
                          content: "<p>是否确认删除</p>",
                          onOk: () => {
                            this.removeDate(params, index);
                          },
                          onCancel: () => {}
                        });
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
    this.switchFun();
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
    //删除
    removeDate(params, index) {
      console.log(params);
      order
        .tradeDelete({
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

    //修改状态
    stateChange(params, index) {
      this.tempId = this.suzu[params.index].id;
      let tempStatus = this.suzu[params.index].status ? 0 : 1;
      console.log(tempStatus, "33");
      order
        .tradeUpdate({
          id: this.tempId,
          status: tempStatus
        })
        .then(res => {
          console.log(res, "222");
          if (res.code == 1) {
            // console.log(this.suzu[params.index].status,'4444')
            tempStatus = !tempStatus;
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

    // 获取数据的接口函数
    switchFun(index) {
      order
        .tradeList({
          current: this.current,
          size: this.size,
          total: this.total
        })
        .then(res => {
          console.log(res, "555");
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
      console.log(res);
      let datas = res.data.records;
      let tempReq = {};
      console.log(datas, "444");
      datas.forEach(item => {
        let {
          id,
          key,
          title,
          type,
          keyCert,
          createTime,
          privateKey,
          publicKey,
          status,
          mchId,
          useCount,
          channelSupport,
          appid,
          shopId,
          payType,
          remainStaus,
          updateById
        } = item;
        tempReq.id = id;
        tempReq.key = key; //API秘钥
        tempReq.title = title; //支付名称
        tempReq.type = type; // 支付类型
        tempReq.keyCert = keyCert; // cert证书秘钥
        tempReq.createTime = createTime; // 创建时间
        tempReq.privateKey = privateKey; //  私钥
        tempReq.publicKey = publicKey; // 公钥
        tempReq.status = status; // 支付状态
        tempReq.mchId = mchId; // 服务商支付商户号
        tempReq.useCount = useCount; //使用次数
        tempReq.channelSupport = channelSupport; //支持渠道
        tempReq.appid = appid; //小程序id
        tempReq.shopId = shopId; //店铺id
        tempReq.payType = payType; //支付方式
        tempReq.remainStaus = remainStaus; //余额支付状态
        tempReq.updateById = updateById; //修改人id
        this.suzu.push(tempReq);
        tempReq = {};
        this.tempId = id;
        // console.log(type)
      });
    },
    // 编辑页面跳转
    editGroup(index) {
      // let gid = this.suzu[index].id
      this.$router.push({
        path: "/@/views/payment/components/CreatePayMangement",
        query: { title: "edit", id: index }
      });
    },
    // 添加页面跳转
    add() {
      this.$router.push({
        path: "/@/views/payment/components/CreatePayMangement",
        query: { title: "add" }
      });
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
  margin: 0px 17px 0 17px;
  box-sizing: border-box;
  /* background: #F3F3F3; */
  padding: 20px 0 100px 0;
  margin: -16px;
  /* border: 1px solid #aeaeae; */
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
  padding-bottom: 16px;
  padding-left: 16px;
}

.container .comBtn {
  margin: 0 30px;
}

.container .fullBtn {
  margin-left: 230px;
}
.currentTitle {
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
.container .item2 {
  margin-top: 20px;
  margin-left: 16px;
}
</style>
