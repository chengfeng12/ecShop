<template>
  <div class="tablepage">
    <div class="addDiscount" v-if="!setting">
      <Button :disabled=options @click="addDiscount()" type="primary">添加优惠券</Button>
    </div>
    <div class="table-popup-container" v-if="tableshow">
      <div class="table-popup-content" :style="{'height':(clientHeight*0.9)+'px','width':(clientWidth*0.66)+'px'}">
        <div class="title-cag">
          <div>优惠券选择</div>
        </div>

        <div class="tablePage couponAddGood">
          <div class="search-con search-con-top" style="margin-bottom: 10px">
            <Row>
              <i-col span="10">
                <Select v-model="searchKey" class="search-col">
                  <Option value="">全部类型</Option>
                  <Option value="1">现金券</Option>
                  <Option value="2">折扣券</Option>
                  <Option value="3">实物券</Option>
                  <Option value="4">赠品券</Option>
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
          <div>
          </div>
          <Table
            :height="tableHeight"
            ref="tablesMain"
            :data="showData"
            :columns="columns"
            :border="true"
            :show-header="true"
          ></Table> 
        </div>
        <div class="tablePage-bottomall">
          <div class="btnAction">
            <Button type="primary" @click="tableEnsure()" style="margin-right:10px;">确定</Button>
            <Button type="primary" @click="tableCancel()">取消</Button>
          </div>
          <div class="btnPage" style="position: absolute; right: 20px;">
            <Page
              :total="dataCount"
              :page-size="pageSize"
              show-total
              @on-change="changepage"
            ></Page>
          </div>
        </div>
      </div>
    </div>
    <div v-if="containerData.length>0" class="tableshow">
         <Table
            ref="tablesShow"
            :data="containerData"
            :columns="columnsshow"
            :border="true"
            :show-header="true"
          ></Table>
    </div>
    
  </div>
</template>

<script>
import marking from "@/api/request/marking.js";
export default {
  name: "addDiscount",

  props: ["options","optionsData","setting",'selectNum'],
  
  data() {
    return {
      columns: [
        { title: "优惠券名称", key: "couponsName",},
        { 
          title: "类型",
          render: (h, params) => {
            let text = ''
            if(params.row.type==2){
              text="折扣券"
            } else if(params.row.type==1){
              text="现金券"
            } else if(params.row.type==3){
              text="实物券"
            }
            else if(params.row.type==4){
              text="赠品券"
            }
            return h('p', {},text)
          }
        },
        { title: "库存", key: "stock" },
        { title: "状态", key: "status"
        
        },
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
                      } else {
                        this.cancelSelect(params);
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
      columnsshow:[
        { title: "优惠券名称", key: "couponsName", sortable: true },
        // { title: "类型", key: "type", editable: false },
        { title: "库存", key: "stock" },
        {
          title: "操作",
          key: "action",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled:this.options
                  },
                  on: {
                    click: () => {
                      this.delectSelect(params.row,params.index)
                    }
                  }
                },
               "删除"
              )
            ]);
          }
        }
      ],
      clientHeight:'',
      tableHeight:"",
      clientWidth:'',
      // 要显示的数据
      showData: [],
      // 初始化信息总条数
      dataCount: 0,
      // 每页显示多少条
      pageSize: 5,

      //

      // 控制表格显示
      tableshow: false,
      // 弹出框中的数据
      searchValue: "",
      searchKey: "",
   
      // 商品ID
      discountidlist: [],
      discountidlistts: [],

      //列表显示的数据
      containerData: [],
      // 商品组暂存
      containerDatats: []
    };
  },
  created() {

  },
  mounted() {
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`;
    this.clientWidth = `${document.documentElement.clientWidth}`;
    let tableHeight = `${document.documentElement.clientHeight}`;
    this.tableHeight = tableHeight*0.65
    console.log(this.clientHeight ,this.clientWidth)
  },
  methods: {
    // 获取数据
    getdata: function(page) {
      let _this = this;
      marking.Discountslist({
          size: _this.pageSize,
          couponsName:this.searchValue,
          type:this.searchKey,
          current: page || 1
        })
        .then(res => {
          console.log('longlonglogn',res)
          if (res.code==1) {
            console.log("查询的数据",res.data)
            let data = res.data;
             _this.dataCount = data.total;
            let discounts = [];
  
            data.rows.map((v, i) => {
              console.log(v)
              if (this.discountidlist.indexOf(v.id) === -1 && this.discountidlistts.indexOf(v.id) === -1) {
                discounts.push({
                  ...v,
                  isSelected: false
                });
              
              } else {
                discounts.push({
                  ...v,
                  isSelected: true
                });
              }
            });
            for(let i in discounts){
              
              if(discounts[i].status==1){
                discounts[i].status="有效"
              } else if(discounts[i].status==2){
                discounts[i].status="未生效"
              } else if(discounts[i].status==3){
                discounts[i].status="失效"
              }
              
              // if(discounts[i].type==2){
              //    discounts[i].type="折扣券"
              // } else if(discounts[i].type==1){
              //   discounts[i].type="现金券"
              // } else if(discounts[i].type==3){
              //   discounts[i].type="实物券"
              // }

            } 
        
            console.log(discounts)
            _this.showData = discounts || [];
          }
          else{
            $Message.error(res.message)
          } 
        }
        ).catch(err => {
          console.log(err);
        });
    },
    // 选择数据
    handleSelect: function(params) {
      console.log('你好')
      if (this.selectNum) {
        console.log('你好进来了',this.selectNum)
        this.containerDatats = []
        this.discountidlistts = []
        this.containerData = []
        this.containerDatats = []
        this.containerDatats.push(params.row);
        this.discountidlistts.push(params.row.id);
        this.showData.map((v, i) => {
          this.showData[i].isSelected = false
          if (v.id == params.row.id) {
            this.showData[i].isSelected = true;
          }
        });
      } else {
        console.log('你好多选的',this.selectNum)
        let con = 0
        this.showData.forEach((element,index) => {
          if (element.isSelected) {
            con = con + 1
          }
        });

        if (con <= 2) {
          // console.log(con)
          this.containerDatats.push(params.row);
          this.discountidlistts.push(params.row.id);
          this.showData.map((v, i) => {
            if (v.id == params.row.id) {
              this.showData[i].isSelected = true
            }
          });
        } else {
          console.log(this.containerData,'LLLLLL')
          this.$Message.error('最多选择3张优惠券')
        }
      }
    },
    // 按钮取消选择
    cancelSelect: function(params) {
      if (this.selectNum) {
        this.containerDatats = []
        this.discountidlistts = []
        this.containerData = []
        this.containerDatats = []
        this.showData.map((v, i) => {
          if (v.id == params.row.id) {
            this.showData[i].isSelected = false;
          }
        });
        // console.log(this.showData,'清除了',this.containerDatats,this.discountidlistts)
        // return false
      } else {
        console.log('多选取消')
        // this.containerDatats.pop();
        this.containerDatats.map((v, i) => {
          if (v.id == params.row.id) {
            this.containerDatats.splice(i, 1);
          }
        });
        this.discountidlistts.map((v, i) => {
          if (v.id == params.row.id) {
            this.discountidlistts.splice(i, 1);
          }
        });
        // this.discountidlistts.pop();
        // 改变按钮状态
        this.containerData.map((v, i) => {
          if (v.id == params.row.id) {
            this.containerData.splice(i, 1);
          }
        });
        this.showData.map((v, i) => {
          if (v.id == params.row.id) {
            this.showData[i].isSelected = false;
          }
        });
      }
    },
    // 删除选择的数据
    delectSelect: function(data, index) {
      let _this = this;
      this.discountidlist.splice(index, 1);
      this.discountidlistts.splice(index, 1);
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
      // console.log('确定的',this.discountidlistts,this.containerDatats)
      // return false
      this.containerData = this.containerData.concat(this.containerDatats);
      // console.log(this.con)
      // return false
        for(let i in this.containerData){
              if(this.containerData[i].status==1){
                this.containerData[i].status="生效"
              } else if(this.containerData[i].status==2){
                this.containerData[i].status="未生效"
              } else if(this.containerData[i].status==3){
                this.containerData[i].status="失效"
              }
            } 
      this.discountidlist = this.discountidlist.concat(this.discountidlistts);
    },
    // 取消按钮
    tableCancel: function() {
      this.containerDatats = [];
      this.discountidlistts = [];
      this.tableshow = false;
    },
    // 添加推荐商品按钮
    addDiscount: function() {
      
      this.containerDatats = [];
      this.tableshow = true;
      this.optionsfuc();
      this.getdata();
    },
    // 搜索列表
    handleSearch: function() {
      this.getdata();
    },
    // 分页逻辑
    changepage: function(page) {
      this.getdata(page);
    },
    // 获取id数组
    optionsfuc: function() {
      let arr = [];
      for (let item in this.containerData) {
        arr.push(this.containerData[item].id);
      }
      this.discountidlist = arr;
    }
  },
  watch: {
    containerData: function() {
      console.log("导出的数据--------------------",this.containerData)
      this.$emit("listentDiscountData", this.containerData);
    },
    optionsData:function(){
      this.containerData=this.optionsData
      console.log("外部导入数据",this.optionsData)
      this.optionsfuc()
    },
    $route(to,from){
      this.showData = []
      this.discountidlist = []
      this.discountidlistts = []
      this.containerData = []
      this.containerDatats = []
    }
  }
};
</script>
<style>
@import "./addDiscount.css";
</style>
