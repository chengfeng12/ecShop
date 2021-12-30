<template>
  <div id="page-admin">
    <div  class="currentTitle">定制卡片</div>
    <Card style="height:1000px">
      
      <div class="main">
        <Tabs type="card" :animated="false">
          <TabPane label="定制卡片" name="1">
            <i-table border :columns="columns1" :data="tableData"></i-table>
            <div id="header">
              <Button type="primary" v-if="hasRole(80202)" class="btn-a" @click="addcard">+添加卡片</Button>
              <div class="page">
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
            </div>
            <!-- 删除 -->
            <Modal v-model="delPop" title="确认提示" @on-ok="Delete" width="400px" :scrollable="false">
              <div class="popConWra">
                <i class="tips"></i>
                <span>{{tempMsg}}</span>
              </div>
            </Modal>
          </TabPane>
          <TabPane label="卡片描述" name="2">
            <Card>
              <Form class="formItem" ref="formInline" :model="formInline" :rules="ruleInline">
                <FormItem label="卡片描述内容" :label-width="100">
                  <!-- 使用富文本 -->
                  <v-editor style="width: 900px;" v-model="formInline.sc" @change="changeEditor"></v-editor>
                </FormItem>
              </Form>
            </Card>
            <div class="savebtn">
              <Button type="primary" size="large" class="btnStyle" :loading="loading" @click="saveOk">保存</Button>
              <Button type="default" size="large" class="btnStyle" @click="back">返回</Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  </div>
</template>
<script>
import vEditor from "@/components/vEditor/vEditor";
import imgUpload from "@/components/imgSelect/imgSelect";
import goodsUtils from "@/utils/goodsUtils";
import operation from "@/api/request/operation";
export default {
  components: {
    vEditor,
    imgUpload
  },
  data() {
    return {
      loading:false,
      total: 10,
      columns1: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "卡片图片",
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
          title: "类型",
          key: "type",
          render: (h, params) => {
            console.log(params);
            return h("div", {},params.row.type == 1 ? '手写卡片' : '用户输入卡片');
          }
        },
        {
          title: "卡片提示语",
          key: "notice"
        },
        {
          title: "操作",
          key: "op",
          width: 160,
          align:"center",
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
            }, [
               h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(80202) ?'block':'none',
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
                  'display': this.hasRole(80201) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.removeGoods(params.row.id);
                  }
                },
              },'删除')
            ]);
          }
        }
      ],
      formInline: {
        sc:""
      },
      ruleInline: {
        title: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          },
          {
            type: "string",
            min: 1,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ]
      },
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
      // size: 10,
      // id: 1,
      content:"1",
    };
  },
  activated() {
    this.init();
  },
  methods: {
    changeEditor(e) {
        console.log(e)
        this.formInline.sc = e
      },
    addcard() {
      this.$router.push("/@/views/lettering/addCard?role=1");
    },
    init() {
      let _this = this;
      // 查询定制卡片列表
      operation
        .getCardList({
          size: _this.size,
          current: _this.current
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.size = res.data.size;
            this.current = res.data.current;
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });

      operation.getSelectDetailList({

      }).then((res) => {
        console.log(res)
        this.formInline.sc = res.data.code
      })
    },
    edit(){
      let _this = this;
      //定制卡片详情
      operation
        .getDetailCard({
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
        .getDeleteList({
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
    saveOk() {
      let _this = this;
      _this.loading=true;
      // 修改
     operation
        .getUpdateDetailList({
          content: _this.formInline.sc
        })
        .then(res => {
          console.log(res);
          if (res.code == "1") {
             _this.loading=false;
            this.$Message.success("保存成功");
            if (this.current == "1") {
              this.current = 1;
            }
            this.init();
          } else {
            _this.loading=false;
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          _this.loading=false;
          this.$Message.error("请求失败");
        });
    },
    operationFun(id) {
      this.$router.push("/@/views/lettering/addCard?role=2&id=" + id);
    },
    //返回
    back() {
      this.$router.go(-1);
    },
    //table移除
    removeGoods(id) {
      this.delPop = true;
      this.tempMsg = "确定删除该规则商品？";
      this.tempId = id;
    },
    pageSizeFun(value){
      this.size=value;
      this.init()
    },
    changePage(value){
      this.current=value;
      this.init()
    }
  }
};
</script>
<style lang="less" scoped>
.savebtn {
  text-align: center;
  margin-top: 25px;
}
#page-admin .main .ivu-tabs{
  overflow:initial;
}
// .letteringcard_tit {
//   height: 50px;
//   line-height: 50px;
//   font-size: 20px;
// }

#header {
  margin-top: 20px;
}

.formItem {
  margin-top: 20px;
}

.page {
  float: right;
}
</style>
