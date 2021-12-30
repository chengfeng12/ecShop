<template>
  <div class="letteringbox">
    <div class="currentTitle">包装盒</div>
    <Card style="min-height:1000px">
      <i-table border :columns="columns1" :data="tableData"></i-table>
      <div class="addBtn">
        <Button type="primary" v-if="hasRole(80402)" style="margin-top:20px;" @click="addbox">+添加包装盒</Button>
      </div>
      <div class="page">
        <!-- show-sizer  -->
        <Page
          :total="total"
          :page-size="size"
          :current="current"
          :show-elevator="true"
          :show-total="true"
          show-sizer
          :page-size-opts="[10,15,20]"
          @on-change="changePage($event)"
          @on-page-size-change="pageSizeFun"
        ></Page>
      </div>
      <!-- 删除 -->
      <Modal v-model="delPop" title="确认提示" @on-ok="Delete" width="400px" :scrollable="false">
        <div class="popConWra">
          <i class="tips"></i>
          <span>{{tempMsg}}</span>
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import operation from "@/api/request/operation";
export default {
  name: "letteringbox",
  data() {
    return {
      show: "true",
      total: 10,
      columns1: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "包装盒名称",
          key: "name"
        },
        {
          title: "包装盒图片",
          key: "img",
          render: (h, params) => {
            console.log(params);
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.img
                },
                style: {
                  width: "70px",
                  height:"70px",
              
                  "border-radius": "5%",
                  "vertical-align": "middle",
                  margin: "5px 0"
                }
              })
            ]);
          }
        },
        {
          title: "包装盒编号",
          key: "code"
        },

        {
          title: "操作",
          key: "op",
          width: 160,
          align:'center',
          render: (h, params) => {
            let name = this.name;
            return h("div",{
              style:{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                color:'#0083b0',
                'font-size':'13px'
              }
            },[
              // 编辑
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(80402) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.operationFun(params.row.id);
                  }
                }
              },'编辑'),
              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(80403) ?'block':'none',
                },
                on: {
                  click: () => {
                     this.removeGoods(params.row.id);
                  }
                },
              },'删除'),
            ]);
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
      statusPop: false,
      batchPop: false,
      delPop: false,
      batchDelPop: false,
      // 暂存数据
      tempTables: [],
      type: 2,
      id: 1
    };
  },
  activated() {
    this.init();
  },
  methods: {
    addbox() {
      this.$router.push("/@/views/lettering/addBox?role=1");
    },
    init() {
      let _this = this;
      // 处理列表
      console.log(_this.type);
      operation
        .getPackageList({
          type: 2,
          current: _this.current,
          size: _this.size,
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.type = res.data.type;
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });
    },
    edit() {
      let _this = this;
      //
      operation
        .getPackageDetail({
          id: _this.id
        })
        .then(res => {
          console.log(res);
        });
    },
    Delete() {
      let _this = this;
      //定制卡片删除
      operation
        .getPackageDelete({
          id: this.tempId
        })
        .then(res => {
          console.log(res);
          if (res.code == "1") {
            this.$Message.success("删除成功");
            if (this.tableData.length == this.tempTables.length) {
              this.current = this.current - 1;
            }
            if (this.current == "1") {
              this.current = 1;
            }
            this.init();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });
    },
    operationFun(id) {
      this.$router.push("/@/views/lettering/addBox?role=2&id=" + id);
    },
    //table移除
    removeGoods(id) {
      this.delPop = true;
      this.tempMsg = "确定删除该规则商品？";
      this.tempId = id;
    },
    // 分页函数
    changePage(value){
      this.current=value;
      this.init();
    },
    // 每页条数
    pageSizeFun(value){
      this.size=value;
      this.init();
    }
  }
};
</script>
<style scoped>
.letteringbox_tit {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
}

.page {
  float: right;
  margin-top: -20px;
}
</style>
