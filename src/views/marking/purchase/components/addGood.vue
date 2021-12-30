<template>
  <div class="tablepage">
    <div class="addGoods">
      <Button @click="addGoods()" type="primary">添加商品</Button>
    </div>
    <div class="table-popup-container" v-if="tableshow">
      <div class="table-popup-content">
        <div class="table-popup-tit">
          <div>请选择商品</div>
        </div>

        <div class="tablePage">
          <div class="search-con search-con-top">
            <Row>
              <i-col span="10">
                <Select v-model="searchKey" class="search-col">
                  <Option :value="1">商品名称</Option>
                  <Option :value="2">商品价格</Option>
                  <Option :value="3">虚拟库存</Option>
                </Select>
              </i-col>
              <i-col span="10">
                <Input placeholder="输入关键字搜索" class="search-input col-8" v-model="searchValue"/>
              </i-col>
              <i-col span="4">
                <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
              </i-col>
            </Row>
          </div>
          <Table
            ref="tablesMain"
            :data="showData"
            :columns="columns"
            :border="true"
            :show-header="true"
          ></Table>
        </div>
        <div class="tablePage-bottom">
          <Button type="primary" @click="tableEnsure()">确定</Button>
          <Button type="primary" @click="tableCancel()">取消</Button>
          <Page
            style="float:right"
            :total="dataCount"
            :page-size="pageSize"
            show-total
            @on-change="changepage"
          ></Page>
        </div>
      </div>
    </div>
    <tables ref="tables-container" v-model="containerData" :columns="columnscontainer" class="tables"  border />
  </div>
</template>

<script>
import api from "@/api/good.js";
import tables from  "./tables"
export default {
  name: "addGood",
  props: ["options"],
  components:{tables},
  data() {
    return {
      containerData:[],
      columns: [
        {
          title: "图片",
          key: "thumb",
          width: "120px",
          align: "center",
          render: (h, params) => {
            return h("div", {
              attrs:{
                style:"height: 40px;weight:35px;"
              },
            },
            [
              h("img", {
                props: {
                  type: "primary",
                  size: "small"
                },
                attrs: {
                  src: params.row.thumb,
                  style: "height: 40px;weight:35px;"
                }
              })

            ]);
          }
        },
        { title: "商品名称", key: "title", sortable: true },
        { title: "商品价格", key: "price", editable: false },
        { title: "虚拟库存", key: "vituralStock" },
        { title: "库存", key: "stock" },
        {
          title: "操作",
          key: "action",
          width: 100,
          align: "center",
          render: (h, params) => {
            let status = params.row.isSelected;

            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: !status ? "primary" : "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      if (!status) {
                        console.log(status);
                        this.handleSelect(params);
                      }
                      else{
                        this.cancelSelect(params)
                      }
                    }
                  }
                },
                !status ? "选择" : "已选择"
              )
            ]);
          }
        }
      ],
      columnscontainer: [
        {
          title: "图片",
          key: "thumb",
          width: "120px",
          align: "center",
          render: (h, params) => {
            return h("div", {
                attrs:{
                  style:"height: 40px;weight:35px;"
                },
              },
              [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  attrs: {
                    src: params.row.thumb,
                    style: "height: 40px;weight:35px;"
                  }
                })

              ]);
          }
        },
        {
        title: "商品",
        key: "title",
        sortable: true,

      },
        {
          title: "规格",
          key: "specifications",
          editable: false,
          align: "center",
          render: (h, params) => {
            let _this = this
            return h("div",
              [
                h(
                  "Button", {
                    class:'btn',
                    props: {
                      type:"text",
                      size: "small"
                    },
                    style:{

                    },
                    on: {
                      click: () => {
                        _this.isSHow = true
                        _this.model1 = true
                      }
                    },
                  },
                  "设置规格"
                ),
                h(
                  "div", {
                    props: {
                      type:"text",
                      size: "small"
                    },
                    style:{
                      display:'none'
                    },
                    on: {
                      click: () => {
                        _this.isSHow = true
                        _this.model1 = true
                        console.log(_this.data1)
                      }
                    },
                  },
                  // _this.data1
                ),
              ]);
          }
        },
        {
          title: "商品价格",
          key: "price",
          editable: false
        },
        {
          title: "库存",
          key: "stock"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button", {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.delectSelect(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],

      // 要显示的数据
      showData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 10,

      // 控制表格显示
      tableshow: false,
      // 弹出框中的数据
      searchValue: "",
      searchKey: "",

      // 商品ID
      goodidlist: [],
      goodidlistts: [],

      //列表显示的数据
      containerData: [],
      // 商品组暂存
      containerDatats: []
    };
  },
  methods: {
    // 获取数据
    getdata: function(page) {
      let _this = this;
      api.request("api/goods/list", "POST", {
          status: 1,
          size: _this.pageSize,
          current: page || 0
        })
        .then(res => {

          let data = res.data;
          _this.dataCount = data.total;
          let goods = [];
          data.rows.map((v, i) => {

            if (this.goodidlist.indexOf(v.id) === -1 && this.goodidlistts.indexOf(v.id) === -1) {
              goods.push({
                ...v,
                isSelected: false
              });
            } else {
              goods.push({
                ...v,
                isSelected: true
              });
            }
          });

          _this.showData = goods || [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择数据
    handleSelect: function(params) {
      this.containerDatats.push(params.row);
      this.goodidlistts.push(params.row.id);
      this.showData.map((v, i) => {
        if (v.id == params.row.id) {
          this.showData[i].isSelected = true;
        }
      });

    },

    // 按钮取消选择
    cancelSelect:function(params){
      console.log("cancelSelect")
      console.log(params)
      this.containerDatats.pop();
      this.goodidlistts.pop();
      console.log(this.containerData);
      // 改变按钮状态
      this.containerData.map((v,i)=>{
        if(v.id==params.row.id){
            this.containerData.splice(i,1)
        }
      });

      this.showData.map((v, i) => {
        if (v.id == params.row.id) {
          this.showData[i].isSelected = false;
        }
      });
    },

    // 删除选择的数据
    delectSelect: function(data, index) {
      let _this = this;
      this.goodidlist.splice(index, 1);
      this.goodidlistts.splice(index,1);
      this.containerData.splice(index, 1);
      this.containerDatats.splice(index, 1);
      this.showData.map((v, i) => {
        if (v.id == data.id) {
          _this.showData[i].isSelected = false;
        }
      });
    },

    // 确定按钮
    tableEnsure: function() {
      this.tableshow = false;
      this.containerData = this.containerData.concat(this.containerDatats);
      console.log("长度", this.containerDatats);
      this.goodidlist = this.goodidlist.concat(this.goodidlistts);
    },

    // 取消按钮
    tableCancel: function() {
      this.containerDatats = [];
      this.goodidlistts = [];
      this.tableshow = false;
    },

    // 添加推荐商品按钮
    addGoods: function() {
      this.containerDatats = [];
      this.tableshow = true;
      this.optionsfuc();

      this.getdata();
    },

    // 搜索列表
    handleSearch: function() {
      console.log("搜索关键字");
    },

    // 分页逻辑
    changepage: function(page) {
      this.getdata(page - 1);
    },

    // 获取id数组
    optionsfuc: function() {
      let arr = [];
      for (let item in this.containerData) {
        arr.push(this.containerData[item].id);
      }
      this.goodidlist = arr;
    }
  },
  created() {},
  watch: {
    containerData: function() {
      this.$emit("listentgoodData", this.containerData);
    },
    options: function() {
      this.containerData = this.options || [];
    }
  }
};
</script>
<style>
.tablepage .goodslist .goodslist-item {
  width: 760px;
  height: 120px;
  padding: 10px;

  border: 1px solid #ddd;
  position: relative;
  margin-bottom: 20px;
}
.tablepage .goodslist .goodslist-item .goodslist-delete {
  position: absolute;
  right: -5px;
  top: -12px;
  width: 20px;
  height: 20px;
  line-height: 0;
  font-size: 25px;
  background-color: #fff;
  cursor: pointer;
}
.tablepage .goodslist .goodslist-item .goodslist-item-l {
  height: 100px;
  width: 100px;
  float: left;
}
.tablepage .goodslist .goodslist-item .goodslist-item-l img {
  height: 100px;
  width: 100px;
}
.tablepage .goodslist .goodslist-item .goodslist-item-r {
  float: left;
  margin-left: 10px;
}
.tablepage .goodslist .goodslist-item .goodslist-item-r div {
  margin-bottom: 12px;
  height: 20px;
  line-height: 20px;
}
.table-popup-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.table-popup-container .table-popup-content {
  width: 880px;
  height: 690px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
.table-popup-container .table-popup-content .tablePage-bottom {
  overflow: hidden;
}
.table-popup-tit {
  height: 30px;
  overflow: hidden;
}
.tables {
  margin: 15px 0;
}
.table-popup-tit div:nth-child(1) {
  float: left;
  height: 30px;
  line-height: 30px;
  width: 100px;
}
.table-popup-tit div:nth-child(2) {
  float: right;
  width: 30px;
  height: 30px;
  font-size: 20px;
}
.addGoods {
  margin-top: 15px;
  margin-bottom: 15px;
  width: 200px;
}
.tablePage .search-btn {
  width: 100%;
  text-align: center;
}
</style>
