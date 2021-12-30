<template>
  <div id="page-model">
    <div class="currentTitle">启动广告</div>
    <Card>
      <div id="header">
        <Button v-if="hasRole(5010501)" type="primary" size="small" class="btn-a" @click="add">+添加启动广告图</Button>
        <Input size="small" v-model="advertName" placeholder=" 输入关键词搜索" style="width: 220px;" class="mar-le"/>
        <Button type="primary" size="small" class="mar-le btn-a" @click="getData">搜索</Button>
        <div style="border-bottom: 1px solid #c9c9c9;margin: 10px -16px"></div>
      </div>
      <div class="main">
        <Table border ref="selection" :columns="columns" :data="tableData"></Table>

        <Modal
          v-model="upperPop"
          title="确认提示"
          @on-ok="stateConfirm"
          width="400px"
          :scrollable="false"
        >
          <div class="popConWra">
            <i class="tips"></i>
            <span>{{tempMsg}}</span>
          </div>
        </Modal>
        <Modal v-model="statusPop" title="确认提示" @on-ok="atatusOk" width="400px" :scrollable="false">
          <div class="popConWra">
            <i class="tips"></i>
            <span>{{tempMsg}}</span>
          </div>
        </Modal>
        <Modal
          v-model="staLengthPop"
          title="确认提示"
          @on-ok="atatusOk"
          width="400px"
          :scrollable="false"
        >
          <div class="popConWra">
            <i class="tips"></i>
            <div class="con-box">
              <p>{{tempTitle}}我是标题的</p>
              <span>{{tempMsg}}我是内容的</span>
            </div>
          </div>
          <div slot="footer" style="text-align: center">
            <Button type="default" size="large" @click="staLengthPop = false">返回</Button>
          </div>
        </Modal>
      </div>
      <div class="footer">
        <div class="page">
          <Page
            :total="total"
            :page-size="size"
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
  </div>
</template>

<script>
import shop from "@/api/request/shop";
import goodsUtils from "@/utils/goodsUtils";
export default {
  data() {
    return {
      name: "",
      tableData: [],
      columns: [
        {
          title: "广告名称",
          align: "center",
          key: "advertName"
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let stateRes = params.row.isStart;
            let tempDOM = [];
            if (stateRes == 0) {
              tempDOM.push(
                h(
                  "span",
                  {
                    style: {
                      padding: "10px",
                      background: "#bbb!important",
                      color: "#fff"
                    }
                  },
                  "未启用"
                )
              );
            } else if (stateRes == 1) {
              tempDOM.push(
                h(
                  "span",
                  {
                    style: {
                      padding: "10px",
                      backgroundColor: "#0083b0!important",
                      color: "#fff"
                    }
                  },
                  "启用"
                )
              );
            } else {
              tempDOM.push(
                h(
                  "span",
                  {
                    style: {
                      padding: "10px",
                      backgroundColor: "#0083b0!important",
                      color: "#fff"
                    }
                  },
                  "定时启用"
                )
              );
            }
            // console.log(tempDOM);
            return h("div", {}, tempDOM);
          }
        },
        {
          title: "创建时间",
          align: "center",
          key: "createTime"
        },
        {
          title: "最后修改时间",
          align: "center",
          key: "lastTime"
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            let stateRes = params.row.status;
            return h("div", {
              style:{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                color:'#0083b0',
                'font-size':'13px'
              }
            }, [
              h("div", {
                class: {},
                style: {
                  borderRight: "1px solid #0083b0",
                  paddingRight:"10px",
                  cursor: "pointer",
                  'display': this.hasRole(5010501) ?'block':'none'
                },
                on: {
                  click: () => {
                    this.operationFun(params.index);
                  }
                }
              },"编辑"),
              h("div", {
                class: {},
                style: {
                  padding:"0 10px",
                  cursor: "pointer",
                  'display': this.hasRole(5010503) ?'block':'none'
                },
                on: {
                  click: () => {
                    this.delFun(params.index);
                  }
                }
              },"删除")
            ]);
          }
        }
      ],
      total: 10,
      size: 10,
      current: 1,
      advertName: "",
      // 暂存的数据
      tempId: "",
      tempStatus: "",
      tempModelType: "",
      // 删除的弹框
      upperPop: false,
      // 删除显示的内容
      tempMsg: "",
      // 是否可以删除的状态
      tempDel: false,
      // 状态切换
      statusPop: false,
      tempType: "",
      // 长度大于的弹框
      staLengthPop: false,
      // 启用大于10 的信息
      tempTitle: ""
    };
  },
  created() {
    // 请求数据
    this.getData();
  },
  activated() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      shop
        .advertisementList({
          advertName: this.advertName,
          current: this.current,
          size: this.size
        })
        .then(res => {
          if (res.code == "1") {
            this.integrationData(res.data);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });
    },
    // 整合数据
    integrationData(data) {
      // console.log(data);
      this.size = data.size;
      this.current = data.current;
      this.total = data.total;
      let rows = data.rows;
      rows.forEach(item => {
        item.createTime = goodsUtils.timeFun(
          new Date(item.createTime).getTime()
        );
        item.lastTime = goodsUtils.timeFun(new Date(item.lastTime).getTime());
        // item.lasteditTime = goodsUtils.timeFun(new Date(item.lasteditTime).getTime())
      });
      this.tableData = rows;
      // console.log("rows", rows);
    },
    add() {
      this.$router.push(`/@/components/advertisement`);
    },
    // 状态更换
    statusFun(index) {
      // console.log(index)
      let con = 0;
      this.tableData.forEach(element => {
        if (element.stateRes == 1) {
          con += 1;
        }
        // console.log(con);
      });
      if (con == 10) {
        this.staLengthPop = true;
        this.tempTitle = "不能启用该页面模板！";
        this.tempMsg = "仅能启用10个页面模板，请先停用已启用模板。";
      } else {
        this.statusPop = true;
        if (this.tableData[index].status == "1") {
          this.tempMsg = "确认禁用该页面模板？";
        } else {
          this.tempMsg = "确认启用该页面模板";
        }
        this.tempId = this.tableData[index].id;
        this.tempStatus = this.tableData[index].status == 1 ? 0 : 1;
        this.tempType = this.tableData[index].type;
      }
    },
    atatusOk() {
      // console.log(this.tempId,this.tempStatus,this.tempType)
      shop
        .pageAdminUpdate({
          id: this.tempId,
          status: this.tempStatus,
          typeId: this.tempType
        })
        .then(res => {
          if (res.code == "1") {
            this.$Message.success("切换成功");
            this.current = this.current;
            this.getData();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("状态切换失败");
        });
    },

    pagefun(index) {
      this.current = index;
      this.getData()
    },
    pageSizeFun(data) {
      this.size = data
      this.getData()
    },
    // 编辑的
    operationFun(index) {
      let id = this.tableData[index].id;
      // console.log('编辑',id)
      this.$router.push(`/@/components/advertisement?id=${id}&type=2`);
    },
    delFun(index) {
      this.tempDel = false;
      let status = this.tableData[index].status;
      this.upperPop = true;
      if (status == "1") {
        this.tempMsg = "该页面模板启用中，如需删除需先禁用！";
        this.tempDel = true;
      } else {
        this.tempMsg = "是否确认删除这个页面模板?";
      }
      this.tempId = this.tableData[index].id;
    },
    // 删除
    stateConfirm() {
      if (this.tempDel) {
        this.$Message.error(this.tempMsg);
        return;
      } else {
        shop
          .advertisementDel({
            id: this.tempId
          })
          .then(res => {
            if (res.code == "1") {
              this.$Message.success("删除成功");
              if (this.tableData.length == 1) {
                this.current = this.current - 1;
              }
              if (this.current == 0) {
                this.current = 0;
              }
              this.getData();
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(err => {
            this.$Message.error("删除失败");
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .currentTitle{
    font-size: 13px;
    color: #000;
    padding: 4px 0;
    background: #f8fbfb;
  }
#page-model {
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
// .ivu-modal-footer {
//     border-top: 1px solid #e8eaec;
//     padding: 12px 18px 12px 18px;
//     text-align: right;
// }
// .ivu-btn-large {
//   padding: 6px 15px 6px 15px;
//   font-size: 14px;
//   border-radius: 4px;
// }
// .ivu-btn {
//   display: inline-block;
//   font-weight: 400;
//   text-align: center;
//   vertical-align: middle;
//   touch-action: manipulation;
//   cursor: pointer;
// }
</style>
