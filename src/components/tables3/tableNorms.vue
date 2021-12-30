<template>
  <div class="tablepage">
    <div class="addGoods">
      <Button @click="addGoods()" type="primary">添加商品</Button>
    </div>
    <!-- <div class="addGoods">
      <Button @click="addgifts()" type="error" long>添加赠品</Button>
    </div>-->
    <div class="table-popup-container" v-if="tableshow">
      <div class="table-popup-content">
        <div class="table-popup-tit">
          <div>请选择商品</div>
          <div class="table-close" @click="tableClose()">
            <Icon type="ios-close-circle"/>
          </div>
        </div>
        <tables
          ref="tables"
          editable
          searchable
          search-place="top"
          v-model="showData"
          :columns="columns"
          @on-slelect="handleSelect"
          class="tables"
        />
        <!-- <Page :total="dataCount" :page-size="pageSize" show-total @on-change="changepage"></Page> -->
      </div>
    </div>
    <tables
      ref="tables-container"
      v-model="containerData"
      :columns="columnscontainer"
      class="tables"
      border
    />
    <!--    // 规格选择-->
    <Modal v-model="model1" title="规格选择" width="1000" @on-ok="ok" @on-cancel="cancel">
      <Table border ref="selection" :columns="columns4" :data="data1" on-select="onSlesct"></Table>
    </Modal>
  </div>
</template>

<script>
import api from "../../api/request.js";
import Tables from "./ctable/tables";
import { type } from "os";
export default {
  name: "tableNorms",
  components: {
    Tables
  },
  data() {
    return {
      model1: false,
      index: 0,
      isSHow: false,
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "规格名称",
          key: "name"
        },
        {
          title: "价格",
          key: "age"
        },
        {
          title: "库存",
          key: "address"
        }
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      columns: [
        {
          title: "",
          key: "name",
          sortable: true
        },
        {
          title: "",
          key: "price",
          editable: false
        },
        {
          title: "库存",
          key: "inventory"
        },
        {
          title: "操作",
          key: "action",
          width: 100,
          align: "center",
          render: (h, params) => {
            let status = params.row.status;
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
      // addnorms:[{
      //
      // }],
      columnscontainer: [
        {
          title: "商品",
          key: "name",
          sortable: true
        },
        {
          title: "规格",
          key: "specifications",
          editable: false,
          align: "center",
          render: (h, params) => {
            let _this = this;
            return h("div", [
              h(
                "Button",
                {
                  class: "btn",
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                      _this.isSHow = true;
                      _this.model1 = true;
                    }
                  }
                },
                "设置规格"
              ),
              h(
                "div",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    display: "none"
                  },
                  on: {
                    click: () => {
                      _this.isSHow = true;
                      _this.model1 = true;
                      console.log(_this.data1);
                    }
                  }
                }
                // _this.data1
              )
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
          key: "inventory"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
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
      // 总数
      tableData: [],

      // 要显示的数据
      showData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 7,
      containerData: [],
      giftsdata: [],
      goodsdata: [],
      temporarygoods: [],
      temporarygift: [],
      tableshow: false,
      normsdata: [],
      normsname: []
    };
  },
  methods: {
    // ok(item,index){
    //   this.index = index;
    //   this.data1.forEach(data1Item => {
    //     data1Item.checkbox = this.data1.indexOf(data1Item.name) > -1
    //     // console.log(this.$refs.selection.getSelection())
    //   });
    //   this.isSHow = true;
    // },
    cancel() {
      this.isSHow = false;
    },
    ok(item, index) {
      let arr = [];
      let str = "";
      this.data1.forEach((item, index) => {});
      console.log(this.$refs.selection.getSelection(this.data1));
      // console.log(this.data1);
      // console.log(this.columnscontainer);
      // console.log(this.goodsdata);
      /* this.data1.forEach((item,index) => {
          this.data1 ? arr.push(this.data1) : arr.splice(index,1);
          // console.log(this.data1[item,index].name)
        });
        if (arr.length !== 0) {
          str = arr.join('、');
          this.columns4[this.index] = str;
        } else {
          this.columns4[this.index] = '设置规格'
        }
        this.cancel();*/
    },
    // onReset() {
    //   this.motalList = this.motalList.map( item => {
    //     item.checkbox = false;
    //     return item;
    //   });
    // },

    // ok (item,index) {
    //   this.index = index;
    //   this.data1.forEach(data1 => {
    //       motalItem.checkbox = item.btn.indexOf(motalItem.mark) > -1
    //   console.log(this.$refs.selection.getSelection())
    //
    // },
    // cancel () {
    //   this.$Message.info('Clicked cancel');
    // },
    handleSelect(params) {
      if (params.row.type == "s") {
        this.goodsdata.push(params.row);
        this.tableData[params.row.id].status = true;
      } else {
        this.giftsdata.push(params.row);
        this.tableData[params.row.id].status = true;
      }
    },
    delectSelect(params) {
      if (params.row.type == "s") {
        this.goodsdata.splice(params.index, 1);
        this.tableData[params.row.id].status = false;
      } else {
        this.giftsdata.splice(params.index, 1);
        this.tableData[params.row.id].status = false;
      }
    },
    //设置规格
    tableClose() {
      this.tableshow = false;
    },

    addGoods() {
      this.tableshow = true;
      this.tableData = this.temporarygoods;
      this.handleListApproveHistory();
      this.columns[0].title = "商品";
      this.columns[1].title = "商品价格";
      // this.columnscontainer[0].title = "商品";
      // this.columnscontainer[1].title = "商品价格";
      this.containerData = this.goodsdata;
    },
    addgifts() {
      this.tableshow = true;
      this.tableData = this.temporarygift;
      this.handleListApproveHistory();
      this.columns[0].title = "赠品";
      this.columns[1].title = "赠品价格";
      this.columnscontainer[0].title = "赠品";
      this.columnscontainer[1].title = "赠品价格";
      this.containerData = this.giftsdata;
    },
    handleListApproveHistory() {
      // 保存取到的所有数据
      this.dataCount = this.tableData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.tableData.length < this.pageSize) {
        this.showData = this.tableData;
      } else {
        this.showData = this.tableData.slice(0, this.pageSize);
      }
    },
    changepage(index) {
      var _start = (index - 1) * this.pageSize;
      var _end = index * this.pageSize;
      this.showData = this.tableData.slice(_start, _end);
    },
    getdata() {
      api
        .mockdata("/tabledata/index")
        .then(res => {
          this.temporarygoods = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getgiftdata() {
      api
        .mockdata("/giftdata/index")
        .then(res => {
          this.temporarygift = res;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getdata();
    this.getgiftdata();
  }
};
</script>

<style scoped>
.table-popup-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
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
  /*margin-top: 15px;*/
  margin-left: 30px;
  margin-top: -35px;
  width: 200px;
}
</style>
