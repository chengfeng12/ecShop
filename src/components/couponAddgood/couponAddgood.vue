<template>
  <div class="tablepage">
    <div class="addGoods">
      <Button @click="addGoods()" type="primary">添加商品</Button>
    </div>
    <div class="table-popup-container" v-if="tableshow">
      <div class="table-popup-content"  :style="{'height':(clientHeight*0.9)+'px','width':(clientWidth*0.66)+'px'}">
        <div class="title-cag">
          <div>商品选择</div>
        </div>
        <div class="tablePage couponAddGood">
          <div class="search-con search-con-top" style="margin-bottom: 10px">
            <Row>
              <i-col span="2">商品分类</i-col>
              <i-col span="7">
                <treeselect
                  v-model="categoryId"
                  :clearable="false"
                  :searchable="false"
                  noOptionsText="暂无分类"
                  placeholder="选择商品分类"
                  :options="optionsData"
                ></treeselect>
              </i-col>
              <i-col span="9" style="margin-left: 10px">
                <Input placeholder="输入关键字搜索" class="search-input col-8" v-model="searchValue"/>
              </i-col>
              <i-col span="4" style="margin-left: 10px">
                <Button @click="getdata()" class="search-btn" type="primary">搜索</Button>
              </i-col>
            </Row>
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
          <div class="btnPage">
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
    </div>

    <div class="goodslist">
      <Table
        ref="tablesMain"
        :data="containerData"
        :columns="showcolumns"
        :border="true"
        :show-header="true"
      ></Table>
    </div>
    <Modal
      v-model="specificationModal"
      @on-ok="selectSpecsId()"
      width="700"
      title="规格选择"
      :closable="true">
      <div class="scrollBar-line" style="height:400px;">
        <div class="specificationtable">
          <div class="specificationthead">
            <div>规格名称</div>
            <div>价格</div>
            <div>库存</div>
            <div>
              <Checkbox
                :value="allKey"
                @on-change="Allselect($event)"
                size="large"
              >全选</Checkbox>
            </div>
          </div>
          <CheckboxGroup v-model="specsId" @on-change="selectIdfuc($event)">
            <div class="specificationtbody-item" v-for="(item,index) in specificationData" :key="index">
              <div>{{item.title}}</div>
              <div>{{item.price}}</div>
              <div>{{item.virtualStock}}</div>
              <div>
                <Checkbox
                  size="large"
                  :label="item.id"
                  :value="item.isSelect"
                >
                  <span></span>
                </Checkbox>
              </div>
            </div>
          </CheckboxGroup>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import goods from "@/api/request/goods";
import goodsUtils from "@/utils/goodsUtils"
// 引入分类
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "addCoupon",
  props: ["options"],
  data() {
    return {
      columns: [
        {
          title: "图片",
          key: "thumb",
          width: "120px",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  style: "height: 40px;weight:35px;"
                }
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
              ]
            );
          }
        },
        { 
          title: "商品名称", 
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.title
                }
              }, params.row.title)
            ]);
          }
        },
        { title: "商品价格", key: "price", align: "center" },
        { title: "库存", key: "vituralStock", align: "center" },
        // { title: "实际库存", key: "stock", align: "center" },
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
      showcolumns: [
        {
          title: "商品",
          width: "200px",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  style: "height: 40px;justify-content: center;display:flex;align-items: center;"
                }
              },
              [
                h("img", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  attrs: {
                    src: params.row.thumb,
                    style:
                      "height: 40px;weight:35px;vertical-align: middle;margin-right: 5px;"
                  }
                }),
                h("span", {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.title
                  }
                }, params.row.title)
              ]
            );
          }
        },
        {
          title: "规格",
          align: "center",
          render: (h, params) => {
            console.log('----------我是规格',params)
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small"
                  },
                  style: {
                    display: params.row.specsId ? params.row.specsId.length > 0 ? "none" : "inline" : 'inline'
                  },
                  on: {
                    click: () => {
                      this.selectSpecification(params);
                    }
                  }
                },
                "设置规格"
              ),
              h(
                "span",
                {
                  style: {
                    border: "1px solid #e8eaec",
                    cursor: "pointer",
                    borderRadius: "5px",
                    display: params.row.specsId ? params.row.specsId.length > 0 ? "block" : "none" : 'none'
                  },
                  on: {
                    click: () => {
                      this.selectSpecification(params);
                    }
                  }
                },
                params.row.specsName
              )
            ]);
          }
        },
        // { title: "库存", key: "vituralStock", align: "center" },
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
                    type: !status ? "primary" : "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.cancelSelect(params);
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
      categoryId: '1',
      optionsData: [],
      specificationData: [],
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
      searchKeylist: [],
      // 商品ID
      goodidlist: [],
      goodidlistts: [],
      //列表显示的数据
      containerData: [],
      // 商品组暂存
      containerDatats: [],
      // 商品ID
      IDindex: "",
      // 规格ID
      specsId: [],
      specsName: [],
      // 弹出窗选择规格
      specificationModal: false,
      // 暂存单选框中的数据
      selectdata: [],
  
      selectTitle: [],

      // 是否全选
      allKey:false
    };
  },
  components: {
    Treeselect
  },
  mounted() {
    // 获取浏览器可视区域高度
    this.clientHeight = `${document.documentElement.clientHeight}`;
    this.clientWidth = `${document.documentElement.clientWidth}`;
    let tableHeight = `${document.documentElement.clientHeight}`;
    this.tableHeight = tableHeight*0.65
    this.selGoodsIds(this.options)
    console.log(this.options)
  },
  methods: {
    // 商品分类的多选接口
    oneClassFun() {
      goods.goodsClassAll({}).then(res => {
        if(res.code == '1') {
          this.optionsData = goodsUtils.classAllFun(res.data)
        }
      }).catch(err => {
        console.log('分类查询失败')
      })
    },
    // 数组去空置
    arrayToEmpty(ary){
      let newAry = []
      ary.map((v,i) => {
        if(v){
          newAry.push(v)
        }
      })
      return newAry
    },
    // 选择规格ID
    selectIdfuc: function(data) {
      this.allKey = false
      let allSpecs = []
      
      this.specificationData.map((v,i) => {
        allSpecs.push(v.id)
      })
      let key = false
      for (let i = 0; i < allSpecs.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if(data[j] == allSpecs[i]){
            this.specificationData[i].isSelected = true
            delete allSpecs[i]
            continue
          }
        }
      }

      allSpecs = this.arrayToEmpty(allSpecs)
      //两数组相等
      if(allSpecs.length == 0){
        key = true
      }

      if(key){
        this.allKey = true
      }
      
      this.selectdata=data;   
      let arr=[];
      for(let i in this.specificationData){
        if(this.selectdata.indexOf(this.specificationData[i].id)!=-1){
          arr.push(this.specificationData[i].title)
        } 
      }
      this.selectTitle=arr
    },

    // 选择规格ID确认按钮
    selectSpecsId: function() {
      //  添加ID
      this.containerData[this.IDindex].specsId = this.selectdata;
      
      // 添加规格名称，用于显示
      this.containerData[this.IDindex].specsName = this.selectTitle;
      
      console.log("修改之后的",this.containerData)

      this.$emit("listentgoodData", this.containerData); 
      this.selectTitle=[],
      this.specsId=[],
      this.selectdata=[]
      this.allKey = false
    },

    // 获取规格信息
    selectSpecification: function(data) {    
      
      let _this = this
      _this.specsId = []
      this.specificationData = []
      console.log('当前的商品数据--------------',data)
      this.specificationModal = true; 

      goods.selGoodsSKU({
        goodsId: data.row.id
      })
      .then(res => {
        if (res.code == 1) {

            this.IDindex = data.index, 
            res.data.map((v,i) => {
              this.specificationData.push({
                ...v,
                isSelect:false
              })
            })



            if(data.row.specsId.length == 0){
              this.selectIdfuc(data.row.specsId)
            }else{
              let newSpec = []
              data.row.specsId.map((v,i) => {
                newSpec.push(v)
              })
              _this.specsId = newSpec
              _this.$forceUpdate()
              this.selectIdfuc(data.row.specsId)
            }
            
            console.log("规格信息",res.data) 
        } else {
          this.$Message.error(res.message);
        }
      })
      .catch(error => {
        console.log(error);
      });

      console.log('已选择的规格',this.containerData)
      
    },

    //全选
    Allselect: function() {   
      console.log(this.allKey)
      if(!this.allKey){
        let arr=[];
        for(let i in this.specificationData){
          arr.push(this.specificationData[i].id)
        }
        this.selectIdfuc(arr)
        this.specsId=arr 
        this.allKey = true
      }
      else{
        // 已经选择的ID数组
        this.specsId=[],
        //
        this.selectdata=[],
        // 
        this.selectTitle=[]    
        this.allKey = false 
      }
    },

    // 获取数据
    getdata: function(page) {
      let _this = this;
      goods
        .getGoodsUpper({
          idAndName: this.searchValue,
          categoryId: this.categoryId,
          size: _this.pageSize,
          current: page || 0
        })
        .then(res => {
          let data = res.data;
          _this.dataCount = data.total;
          let goods = [];

          console.log(this.goodidlist,this.goodidlistts)
          data.rows.map((v, i) => {
            if (
              this.goodidlist.indexOf(v.id) === -1 &&
              this.goodidlistts.indexOf(v.id) === -1
            ) {
              goods.push({
                ...v,
                isSelected: false,
                specsId: [],
                specsName: []
              });
            } else {
              goods.push({
                ...v,
                isSelected: true,
                specsId: [],
                specsName: []
              });
            }
          });

          _this.showData = goods || [];
          console.log(goods);
          // this.searchKeylist=goods.categoryId.split(',')
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
    cancelSelect: function(params) {

      let newData = this.containerData || []

      newData.map((v, i) => {
        if (v.id == params.row.id) {
          this.containerData.splice(i, 1);
        }
      });

      this.containerDatats.map((v, i) => {
        if (v.id == params.row.id) {
          this.containerDatats.splice(i, 1);
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
      this.goodidlistts.splice(index, 1);
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
      this.containerData = this.containerData ? this.containerData.concat(this.containerDatats) : [].concat(this.containerDatats);
      this.goodidlist = this.goodidlist.concat(this.goodidlistts);
      this.goodidlistts = []
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
      this.oneClassFun()
    },

    // 搜索列表
    handleSearch: function() {
      console.log("搜索关键字");
      console.log(this.categoryId,this.searchValue,this.optionsData)
    },

    // 分页逻辑
    changepage: function(page) {
      this.getdata(page);
    },

    // 获取id数组
    optionsfuc: function() {
      console.log('optionsfucoptionsfuc',this.containerData)
      let arr = [];
      for (let item in this.containerData) {
        arr.push(this.containerData[item].id);
      }
      this.goodidlist = arr;
    },

    // 根据父组件的id数组查出商品
    selGoodsIds: function(data) {
      console.log(data)
      let idarr=[]
      for(let i in data){
        idarr.push(this.options[i].goodsId)
      }
      console.log("ID信息",idarr)
      goods
        .selGoodsIds({
          ids: idarr || []
        })
        .then(res => {
          console.log('我是批量查的',res)
          this.containerDatafuc(res,data);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 将查询selGoodsIds查询出的数组渲染到页面上
    containerDatafuc: function(data,editAry) {
      this.containerData = data.data;
      this.getSpecIds(data.data,editAry)
    },
    //获取规格
    getSpecIds(data,editAry){
      let newContainer = []
      let newData = {}
      if(!data){
        data = []
      }
      console.log('data-=--=-',data,editAry)
      data.map((v,i) => {
        goods.selGoodsSKU({
          goodsId: v.id
        })
        .then(res => {
          let goodsIdItem = editAry.find(vs => vs.goodsId == v.id)
          console.log(goodsIdItem)
          goodsIdItem = goodsIdItem.specIds ? editAry.find(vs => vs.goodsId == v.id).specIds.split(',').map((ui,us) => {
            return ui = Number(ui)
          }) : []
          console.log(goodsIdItem)
          if(res.code == 1){
            let newSpecsId = []
            let newSpecsName = ''
            res.data.map((vi,ii) => {
              goodsIdItem.map((vo,io) => {
                if(vo == vi.id){
                  newSpecsId.push(vi.id)
                  newSpecsName = newSpecsName+vi.title
                }
              })
            })
            newData = {
              ...v,
              specsId:newSpecsId,
              specsName:newSpecsName
            }
            newContainer.push(newData)
            this.containerData = newContainer
          }
        })
      }) 
    }
  },
  watch: {
    containerData: function() {
      console.log("发送的数据",this.containerData)
      this.$emit("listentgoodData", this.containerData);
    },
    options: {
      handler(newValue,oldValue) {
        console.log(newValue)
        console.log("父ID",this.options)
        this.selGoodsIds(this.options);
      }, 
      deep: true
    }
  }
};
</script>
<style scoped>
@import "./couponAddgood.css";
</style>
