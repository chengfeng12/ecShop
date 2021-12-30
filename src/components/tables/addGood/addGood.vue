<template>
  <div class="tablepage">
    <div class="addGoods">
      <Button @click="addGoods()" type="primary">添加商品</Button>
    </div>
    <div class="table-popup-container" v-if="tableshow">
      <div class="table-popup-content">
        <div class="table-popup-tit">
          <div>请选择商品</div>
          <div class="table-close" @click="tableClose()">
            <Icon type="ios-close-circle"/>
          </div>
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
        <Page :total="dataCount" :page-size="pageSize" show-total @on-change="changepage"></Page>
      </div>
    </div>
    <div class="goodslist">
      <div class="goodslist-item" v-for="(item,index) in containerData" :key="index">
        <div class="goodslist-delete" @click="delectSelect(item,index)">
          <Icon type="ios-close-circle"/>
        </div>
        <div class="goodslist-item-l">
          <img :src="item.thumb" alt>
        </div>
        <div class="goodslist-item-r">
          <div>
            <span>商品名称:</span>
            <span>{{item.title}}</span>
          </div>
          <div>
            <span>商品价格:</span>
            <span>{{item.price}}</span>
          </div>
          <div>
            <span>虚拟库存</span>
            <span>{{item.stock}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/request.js";
export default {
  name: "addGood",
  props: ["options"],
  data() {
    return {
      columns: [
        { title: "商品名称", key: "title", sortable: true },
        { title: "商品价格", key: "price", editable: false },
        { title: "虚拟库存", key: "stock" },
        {
          title: "操作",
          key: "action",
          width: 100,
          align: "center",
          render: (h, params) => {
            let status = params.row.isSelected;
            console.log(status);
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
                        this.handleSelect(params);
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

      // 要显示的数据
      showData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 10,
      containerData: [],
      temporarygoods: [],
      tableshow: false,
      // 弹出框中的数据
      edittingCellId: "",
      searchValue: "",
      searchKey: "",
      // 商品ID
      goodidlist: []
    };
  },
  methods: {
    // 获取数据
    getdata: function(page) {
      let _this = this;
      api
        .request("api/goods/list", "POST", {
          status: 1,
          size: _this.pageSize,
          current: page || 0
        })
        .then(res => {
          let data = res.data;
          _this.dataCount = data.total;
          let goods = [];
          data.rows.map((v, i) => {
            if (this.goodidlist.indexOf(v.id) === -1) {
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

          _this.temporarygoods = goods;

          _this.showData = goods;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 选择数据
    handleSelect: function(params) {
      this.containerData.push(params.row);
      this.temporarygoods.map((v, i) => {
        if (v.id == params.row.id) {
          this.temporarygoods[i].isSelected = true;
        }
      });
    },
    // 删除选择的数据
    delectSelect: function(data, index) {
      let _this = this;
      this.goodidlist.splice(index, 1);
      this.containerData.splice(index, 1);

      this.temporarygoods.map((v, i) => {
        if (v.id == data.id) {
          _this.temporarygoods[i].isSelected = false;
        }
      });
    },

    // 关闭弹窗
    tableClose: function() {
      this.tableshow = false;
    },

    // 添加商品
    addGoods: function() {
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
      for (let item in this.containerData) {
        this.goodidlist.push(this.containerData[item].id);
      }
    }
  },
  created() {
    this.containerData = this.options;
  },
  watch: {
    containerData: function() {
      this.$emit("listentgoodData", this.containerData);
    },
    options: function() {
      this.containerData = this.options;
      console.log("商品列表", this.containerData);
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
