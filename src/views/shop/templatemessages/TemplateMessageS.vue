<template>
  <div id="template-messages">
    <div class="currentTitle">模板消息库</div>
    <Card>
      <div class="header">
        <Button  v-if="hasRole(5010600)" type="primary" size="small" @click="synchronization" class="mar-ri">同步模板消息</Button>
        <div style="border-bottom: 1px solid #c9c9c9;margin: 10px -16px"></div>
      </div>
      <div class="main">
        <i-table
          border
          ref="selection"
          :columns="columns"
          :data="tableData"
          @on-select="selectFun"
          @on-select-cancel="selectCancelFun"
          @on-select-all-cancel="selectCancel"
          @on-select-all="selectAllFun"
        ></i-table>
      </div>
      <Modal v-model="delPop" title="确认提示" @on-ok="delOkFun" width="400px" :scrollable="false">
        <div class="popConWra">
          <i class="tips"></i>
          <span>{{tempMsg}}</span>
        </div>
      </Modal>
      <Modal
        v-model="batchDelPop"
        title="确认提示"
        @on-ok="batchDelFun"
        width="400px"
        :scrollable="false"
      >
        <div class="popConWra">
          <i class="tips"></i>
          <span>{{tempMsg}}</span>
        </div>
      </Modal>
      <div class="footer">
        <div class="operation">
          <Button v-if="this.hasRole(5010603)" type="error" size="small" class="del" @click="batchDel()">删除</Button>
        </div>
        <div class="page">
          <Page
            :current="current"
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
import shop from "@/api/request/shopModel";
import goodsUtils from "@/utils/goodsUtils";
export default {
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "序号",
          align: "center",
          key: "id"
        },
        {
          title: "模板标题",
          align: "center",
          key: "title"
        },
        {
          title: "模板id",
          align: "center",
          key: "templateId"
        },
        {
          title: "关键词",
          align: "center",
          key: "keywordIdlist"
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            return h("span", {}, params.row.status == 1 ? "有效" : "无效");
          }
        },
        {
          title: "创建时间",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {},
              goodsUtils.timeFun(goodsUtils.timeStamp(params.row.createTime))
            );
          }
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            let stateRes = params.row.status;
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
                    class: {},
                    style: {
                      borderRight: "1px solid #0083b0",
                      paddingRight: "10px",
                      cursor: "pointer",
                      'display': this.hasRole(50108) ?'block':'none',
                    },
                    on: {
                      click: () => {
                        this.editFun(params.row.id);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "div",
                  {
                    class: {},
                    style: {
                      padding: "0 10px",
                      cursor: "pointer",
                      'display': this.hasRole(5010603) ?'block':'none',
                    },
                    on: {
                      click: () => {
                        this.delFun(params.index);
                      }
                    }
                  },
                  "删除"
                )
              ]
            );
          }
        }
      ],
      tableData: [],
      current: 1,
      total: 0,
      size: 10,
      // 暂存的数据
      tempMsg: "",
      tempId: "",
      tempStatus: "",
      delPop: false,
      batchDelPop: false,
      // 暂存数据
      tempTables: []
    };
  },
  activated() {
    // 请求数据
    this.getData();
  },
  methods: {
    getData() {
      shop
        .templateMessagesList({
          current: this.current,
          size: this.size
        })
        .then(res => {
          this.integrationData(res);
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("请求失败");
        });
    },
    integrationData(data) {
      this.current = data.current;
      this.size = data.size;
      this.total = data.total;
      this.tableData = data.rows;
    },
    synchronization() {
      shop
        .templateMessagesSynchro()
        .then(res => {
          if (res.code == 1) {
            this.getData();
          }
        })
        .catch(err => {
          console.log("同步失败");
        });
    },
    editFun(id) {
      this.$router.push(
        "/@/views/shop/templatemessages/TemplateMessageShow?id=" + id
      );
    },
    // 批量判空
    batchEmpty() {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return false;
      } else {
        return 1;
      }
    },
    batchDel() {
      let res = this.batchEmpty();
      if (res) {
        this.batchDelPop = true;
        this.tempMsg = "确认批量删除模板?";
      } else {
        return;
      }
    },
    batchDelFun() {
      this.splitArr();
      this.delOkFun();
    },
    splitArr() {
      // 对数组进行切割拼接
      let idData = "";
      for (let i = 0; i < this.tempTables.length; i++) {
        if (i < this.tempTables.length - 1) {
          idData = idData + this.tempTables[i].id + ",";
        } else {
          idData = idData + this.tempTables[i].id;
        }
      }
      this.tempId = idData;
    },
    delFun(index) {
      this.tempId = this.tableData[index].id;
      this.tempMsg = "确认删除该模板?";
      this.delPop = true;
    },
    delOkFun() {
      shop
        .templateMessagesDel({
          ids: this.tempId
        })
        .then(res => {
          if (res.code == "1") {
            this.$Message.success("删除成功");
            if (this.tableData.length == this.tempTables.length) {
              this.current = this.current - 1;
            }
            if (this.current <= "1") {
              this.current = 1;
            }
            this.tempId = ''
            this.getData();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    },
    // 单选行获取的数据 第一个数选中的集合 第二个是当前选中的
    selectFun(params, row) {
      // 通过索引进行更改数据 在data中添加一个商品的 id 字段
      console.log(params, row);
      this.tempTables.push(row);
      // console.log(this.tempTables)
      // 需要在data 中定义一个字段 用来存储多选的数据
    },
    // 单选取消事件
    selectCancelFun(data, row) {
      // 获取选中数据的id
      let id = row.id;
      // 数组条件过滤
      this.tempTables = this.tempTables.filter(element => element.id !== id);
      let len = this.tempTables.length;
      // console.log(this.tempTables)
    },
    // 全选的方法
    selectAllFun(value) {
      console.log("quanxunazhixing", value);
      this.tempTables = value;
    },
    // 全选取消的时候触发
    selectCancel() {
      this.tempTables = [];
    },
    // 翻页
    pagefun(index) {
      this.current = index;
      this.getData();
    },
    pageSizeFun(data) {
      this.size = data
      this.getData()
    }
  }
};
</script>

<style lang="less" scoped>
.currentTitle {
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
#template-messages {
  .header {
    // padding-top: 15px;
    margin-bottom: 15px;
    .mar-ri {
      margin-right: 10px;
    }
  }
  .footer {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
}
</style>

