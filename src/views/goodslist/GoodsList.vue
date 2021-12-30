<template>
  <div id="goods-list">
    <div class="currentTitle">商品列表</div>
    <Card>
      <div class="goods-tables">
        <div class="header">
          <!-- <Row :gutter="8"> -->
          <div>
            <div>
              
              <Button
                type="primary"
                v-if="hasRole(10101)"
                :to="`/@/views/goodsadd/GoodsAdd?role=0&name=${name}`"
              >添加商品</Button>
            </div>
          </div>
          <div style="margin-left: 30px">
            <div style="width: 200px">
               <treeselect
                 size="small"
                v-model="categoryId"
                :clearable="false"
                :searchable="false"
                noOptionsText="暂无分类"
                placeholder="选择商品分类"
                :options="optionsData"
              ></treeselect>
            </div>
          </div>
          <div style="margin-left: 20px">
            <div>
              <Select v-model="putawayType" style="width:150px" >
                <Option
                  v-for="item in goodsBy"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div style="margin-left: 20px">
            <div>
              <div class="display">
                <i-input placeholder="请输入商品名称搜索"  v-model="idAndName"></i-input>
              </div>
              <div class="display">
                <Button @click="searchDate" type="primary" class="search">搜索</Button>
              </div>
            </div>
          </div>
          <!-- </Row> -->
        </div>
        <div class="mian">
          <div class="tab-wep">
            <Tabs type="card" @on-click="getGoodsData" v-model="tabsName" :animated="false">
              <Tab-pane label="出售中" name="1"></Tab-pane>
              <Tab-pane label="已售罄" name="3"></Tab-pane>
              <Tab-pane label="仓库中" name="-2"></Tab-pane>
              <Tab-pane label="回收站" name="-1"></Tab-pane>
              <i-table
                border
                ref="selection"
                :columns="columns"
                :loading="loadingData"
                :data="inSaleData"
                @on-select="selectFun"
                @on-select-cancel="selectCancelFun"
                @on-select-all-cancel="selectCancel"
                @on-select-all="selectAllFun"
              ></i-table>
              <!-- 上下架  单件恢复 -->
              <Modal
                v-model="upperPop"
                title="确认提示"
                @on-ok="stateConfirm"
                @on-cancel="reCancelFun"
                width="400px"
                :scrollable="false"
              >
                <div class="popConWra">
                  <i class="tips"></i>
                  <span>是否确认{{stateMsg}}商品?</span>
                </div>
              </Modal>
              <!-- 批量下架 上架 -->
              <Modal
                v-model="popupLower"
                title="确认提示"
                @on-ok="lowerOkFun"
                @on-cancel="reCancelFun"
                width="400px"
                :scrollable="false"
              >
                <div class="popConWra">
                  <i class="tips"></i>
                  <span>是否确认{{stateMsg}}商品?</span>
                </div>
              </Modal>

              <!-- 删除商品 -->
              <Modal
                v-model="delPop"
                title="确认提示"
                @on-ok="removeGoodsFun"
                @on-cancel="reCancelFun"
                width="400px"
                :scrollable="false"
              >
                <div class="popConWra">
                  <i class="tips"></i>
                  <span>是否确认{{stateMsg}}商品？</span>
                </div>
              </Modal>
              <!-- 批量删 恢复 -->
              <Modal
                v-model="recoveryData"
                @on-cancel="reCancelFun"
                title="确认提示"
                @on-ok="recoFunOK"
                width="400px"
                :scrollable="false"
              >
                <div class="popConWra">
                  <i class="tips"></i>
                  <span>是否确认{{stateMsg}}商品?</span>
                </div>
              </Modal>
            </Tabs>
          </div>
        </div>
        <div class="footer">
          <div class="operation">
            <Checkbox v-model="all" @on-change="allFun"></Checkbox>
            <Button v-if="this.name > 0 && hasRole(1010101)" type="default" @click="muiUpper('批量下架')" class="lower">下架</Button>
            <Button v-if="this.name == '-2' && hasRole(1010101)" type="default" @click="muiUpper('批量上架')" class="del">上架</Button>
            <Button
              v-if="this.name == '-1' && hasRole(1010105)"
              type="default"
              @click="muiRecoveryFun('批量恢复')"
              class="lower"
            >恢复</Button>
            <Button v-if="hasRole(1010104)" type="error" @click="removeGoodsMui('批量删除')" class="del">删除</Button>
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
      </div>
    </Card>
  </div>
</template>

<script>
// 引入请求文件
import goods from "@/api/request/goods"
import goodsUtils from "@/utils/goodsUtils"
// 引入分类
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "GoodsList",
  data() {
    return {
      all: false,
      // dis: true,
      loadingData: true,
      // 商品分类
      formId: "1",
      categoryId: '',
      optionsData: [],
      // 渠道
      putawayType: "0",
      goodsBy: [
        {
          value: "0",
          label: "全部渠道"
        },
        {
          value: "微信小程序",
          label: "微信小程序"
        }
      ],
      // 确认删除弹出框
      delPop: false,
      // 删除暂存的单多选择
      tempChoice: "",
      // 搜索数据
      idAndName: "",
      // tab切换的name 记录
      name: "",
      // tab切换的标题名称
      tabTitle: "",
      // 记录 出售 售罄 仓库 回收站的状态(可删)
      // batchShow: '',
      // tabs 切换的name
      tabsName: "1",
      // tab切换的数params.row.title: '',
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "排序",
          // key: 'displayOrder',
          sortable: true,
          align: "center",
          width: 80,
          render: (h, params) => {
            if (params.row.$res) {
              return h("div", [
                h("input", {
                  style: {
                    width: "50px",
                    height: "30px",
                    textIndent: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                  },
                  domProps: {
                    value: params.row.displayOrder
                  },
                  on: {
                    input: function(event) {
                      params.row.displayOrder = event.target.value;
                    }
                  }
                }),
                h("Icon", {
                  class: {
                    iconfont: true,
                    "icon-save": true
                  },

                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      console.log("我是保存的");
                      this.keepDisOrder(params.row);
                    }
                  }
                })
              ]);
            } else {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      width: "50px",
                      whiteSpace: "nowrap",
                      // 文本溢出显示省略号
                      textOverflow: "ellipsis",
                      // 溢出的部分隐藏
                      overflow: "hidden"
                    }
                  },
                  params.row.displayOrder
                ),
                h("Icon", {
                  class: {
                    iconfont: true,
                    "icon-edit-square": true
                  },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      console.log("我是编辑的");
                      this.changeDisOrder(params.row);
                    }
                  }
                })
              ]);
            }
          }
        },
        {
          title: "商品图片",
          align: "center",
          width: 145,
          render: (h, params) => {
            return params.row.thumb ? h("div", {}, [
              params.row.thumb != ""
                ? h("img", {
                    style: {
                      display: "inline-block",
                      height: "70px",
                      width: "70px",
                      marginTop: "10px",
                      marginBottom: "10px",
                      verticalAlign: "middle"
                    },
                    attrs: {
                      //设置属性
                      src: params.row.thumb
                    }
                  })
                : ""
            ]) : '';
          }
        },
        {
          title: "商品名称",
          key: "goodsName",
          width:200,
          render: (h, params) => {
            let arr = [];
            (params.row.names).forEach(element => {
              console.log('获取每行的信息----',params,element)
              arr.push(
                h(
                  "p",
                  {
                    style: {
                      marginBottom: "2px",
                      color: "red"
                    }
                  },
                  `[${element}]`
                )
              );
            });
            return h(
              "div",
              {
                style: {
                  padding: "10px 0"
                }
              },
              [
                h(
                  "div",
                  {
                    class: {
                      box: true
                    }
                  },
                  [
                    h(
                      "p",
                      {
                        style: {
                          marginBottom: "5px"
                        }
                      },
                      params.row.title
                    )
                  ]
                ),
                arr
              ]
            );
          }
        },
        {
          title: "商品类型",
          align: "center",
          width: 90,
          render: (h, params) => {
            let content
            if (params.row.type == '1') {
              content = '实体商品'
            } else if (params.row.type == '3') {
              content = '赠品'
            } else if (params.row.type == '4') {
              content = '规则商品'
            } else if (params.row.type == '5') {
              content = '套餐商品'
            }
            return h("p",content);
          }
        },
        {
          title: "价格",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("p",
              `￥${params.row.price}`
            );
          }
        },
        {
          title: "虚库",
          key: "vituralStock",
          align: "center",
          width: 70
        },
        {
          title: "实库",
          key: "stock",
          align: "center",
          width: 70
        },
        {
          title: "销量",
          key: "salesCount",
          align: "center",
          width: 70
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 110,
          render: (h, params) => {
            let status = params.row.status;
            console.log('我是',params.row.isPutawayTime,this.name)
            return h("div", [
              status > 0 ? h(
                    "Button",{
                      props: {
                        type: params.row.isPutawayTime == 1 ? "error" : "primary",
                      },
                      style: {
                        marginRight: "5px",
                        'display': this.hasRole(1010101) ?'block':'none',
                      },
                      on: {
                        click: () => {
                          this.upperPopFun(params.index, "下架");
                        }
                      }
                    }, params.row.isPutawayTime == 1 ? "定时上架" : "上架")
                : status == "-1"
                ? h(
                    "span",
                    {
                      style: {
                        display: "inline-block",
                        width: "40px",
                        height: "20px",
                        lineHeight: "20px",
                        backgroundColor: "#eee"
                      }
                    },
                    "下架"
                  )
                : h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small"
                      },
                      style: {
                        marginRight: "5px"
                      },
                      on: {
                        click: () => {
                          this.upperPopFun(params.index, "上架");
                        }
                      }
                    },
                    "下架"
                  )
            ]);
          }
        },
        {
          title: "销售渠道",
          key: "putawayType",
          align: "center",
          width: 120
        },
        {
          align: "center",
          width: 150,
          renderHeader: (h, params) => {
            return h("span", this.tabTitle);
          },
          render: (h, params) => {
            console.log("我是render", this.name);
            if (this.name == "1") {
              return h("p", params.row.putawayTime);
            } else if (this.name == "3") {
              return h("p", params.row.selloutTime);
            } else if (this.name == "-2") {
              return h("p", params.row.createTime);
            } else if (this.name == "-1") {
              return h("p", params.row.deleteTime);
            }
          }
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 250,
          render: (h, params) => {
            let name = this.name;
            return h("div", {
              style:{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                color:'#0083b0',
                'font-size':'13px'
              }
            },[
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-right':'10px',
                  cursor: "pointer",
                  'display': this.hasRole(10101) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.operationFun(params.index);
                  }
                }
              },'编辑'),
              name === "-1"
                ?h('div', {
                  class:'',
                  style:{
                    'border-right':this.hasRole(1010104)?'1px solid #0083b0':'none',
                    'padding-right':'10px',
                    'padding-left':'10px',
                    'cursor': "pointer",
                    'display': this.hasRole(1010105) ?'block':'none',
                  },
                  on: {
                    click: () => {
                      this.recoveryFun(params.index, "恢复");
                    }
                  }
                },'恢复')
                : h('div', {
                  class:'',
                  style:{
                    'border-right':this.hasRole(1010104)?'1px solid #0083b0':'none',
                    'padding': '0 10px',
                    'cursor': "pointer",
                    'display': this.hasRole(10101) ?'block':'none',
                  },
                  on: {
                    click: () => {
                      this.copyFun(params.index);
                    }
                  }
                },'复制'),
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding':' 0 10px',
                  cursor: "pointer",
                  // 'display': this.hasRole(10101) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.specOpen(params.index);
                  }
                }
              },'规格设置'),
              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(1010104) ?'block':'none',
                },
                on: {
                  click: (index) => {
                    this.removeGoods(params.index, "删除");
                  }
                }
              },'删除'),
            ]);
          }
        }
      ],
      // 暂时存储的数组,用来select 选择的存储数据
      tempTables: [],
      inSaleData: [],

      // warehouseData: [],
      // 上架的弹出框
      upperPop: false,
      // // tab切换的判断
      // tab: 'inSale',

      // 上下架的显示提示
      // 上下架的 id(或者索引) 值
      // 下架的弹出框
      statusShelves: "",
      stateMsg: "",

      // 批量操作的记录状态
      statusMui: "",

      popupLower: false,
      // 恢复的弹框
      recoveryData: false,
      // 删除记录ids 的值
      idsData: "",
      // 选中删除的弹框
      popupRemove: false,
      // 弹出框的内容显示
      // popupContent: '',

      // 点击分页显示的数据
      showData: [],
      // 翻页后端字段
      total: null,
      // 每页显示条数
      size: 10,
      // 当前页数
      current: 1
    };
  },
  mounted() {
    // console.log(this.$route.query.status)
    let status = this.$route.query.status ? this.$route.query.status : "1";
    // console.log(status)
    this.getGoodsData(status);
    // 调用分类
     this.oneClassFun()
  },
  components: {
    Treeselect
  },
  methods: {
    // tabs切换 请求处理判断
    getGoodsData(name) {
      this.all = false;
      // 切换的时候清空数据
      this.tempTables = [];
      // console.log('我看看传的页面数' + this.current)
      // console.log(this.tabsName)
      this.tabsName = name;
      this.categoryId = this.tempCategoryId
      this.current = 1;
      console.log("我是tab的", this.name);
      this.formId = this.tabsName;
      this.name = name;
      console.log(this.name);
      if (name === "1") {
        this.tabTitle = "上架时间";
      } else if (name === "3") {
        this.tabTitle = "售罄时间";
      } else if (name === "-2") {
        this.tabTitle = "创建时间";
      } else if (name === "-1") {
        this.tabTitle = "删除日期";
      }
      // 请求接口
      this.switchFun();
    },
    // 获取数据的接口函数
    switchFun() {
      this.tempTables = []
      this.all = false
      goods.goodsLists({
          status: this.formId,
          oneClassData: this.oneClassData,
          putawayType: this.putawayType == "0" ? -1 : this.putawayType,
          idAndName: this.idAndName,
          status: this.name,
          size: this.tempSize,
          current: this.current,
          categoryId: this.categoryId
        })
        .then(res => {
          // console.log('我是接口的',res)
          // console.log(res)
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            this.getDataFun(res);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
          console.log(err);
        });
    },
    // 商品分类的多选接口
    oneClassFun() {
        goods.goodsClassAll({}).then(res => {
          console.log('fenle ide ............................',res)
            if(res.code == '1') {
                this.optionsData = goodsUtils.classAllFun(res.data)
                this.categoryId = this.optionsData[0].id + ''
                this.tempCategoryId = this.optionsData[0].id + ''
            }
        }).catch(err => {
            console.log('分类查询失败')
        })
    },
    // 搜索数据
    searchDate() {
      // console.log(this.idAndName)
      console.log(this.putawayType);
      this.tempTables = []
      this.all = false
      goods
        .goodsLists({
          status: this.formId,
          oneClassData: this.oneClassData,
          putawayType: this.putawayType == "0" ? -1 : this.putawayType,
          idAndName: this.idAndName,
          size: this.tempSize,
          current: 1,
          categoryId: this.categoryId
        })
        .then(res => {
          // 让选择的跟tab切换统一
          this.tabsName = this.formId;
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            this.getDataFun(res);
          } else {
            this.$Message.error("搜索失败");
          }
        })
        .catch(err => {
          this.$Message.error("搜索失败");
          console.log(err);
        });
    },
    allFun() {
      console.log(this.all);
      if (this.all) {
        this.$refs.selection.selectAll(true);
      } else {
        // this.selectCancel(false)
        this.$refs.selection.selectAll(false);
      }
    },
    // 成功的数据处理
    getDataFun(res) {
      // console.log('woshi chulishuju', res)
      this.inSaleData = [];
      let backData = res.data.rows;
      // console.log(backData)

      // 获取翻页的数据
      this.total = res.data.total * 1;
      this.size = res.data.size * 1;
      this.tempSize = res.data.size * 1
      this.current = res.data.current * 1;
      console.log("我是返回的页码数", this.current);
      let tempReq = {};
      // 数据
      backData.forEach(item => {
        // console.log(item)
        let {
          id,
          displayOrder,
          thumb,
          title,
          price,
          vituralStock,
          stock,
          salesCount,
          status,
          putawayType,
          putawayTime,
          selloutTime,
          deleteTime,
          createTime,
          categoryName,
          isPutawayTime,
          type
        } = item;
        // createTime = goodsUtils.timeFun(createTime)
        tempReq.id = id;
        tempReq.displayOrder = displayOrder;
        tempReq.thumb = thumb;
        tempReq.title = title;
        tempReq.price = price ? price.toFixed(2) : 0;
        tempReq.vituralStock = vituralStock;
        tempReq.stock = stock ? stock : "0";
        // console.log('库存的',vituralStock,tempReq.stock)
        tempReq.salesCount = salesCount;
        tempReq.status = status;
        tempReq.putawayType = putawayType;
        let arr = [];
        if (categoryName) {
          console.log('分类的名字',categoryName)
          arr = categoryName.split(',')
        }
        tempReq.isPutawayTime = isPutawayTime
        tempReq.type = type
        console.log('arrrrrrrrrrrrrrr',arr);
        tempReq.names = arr;
        // console.log('putawaytime:'+putawayTime)
        if (this.name == "1") {
          // 上架时间
          tempReq.putawayTime = goodsUtils.timeFun(putawayTime);
        } else if (this.name == "3") {
          // 售罄时间
          console.log("", selloutTime);
          tempReq.selloutTime = goodsUtils.timeFun(
            new Date(selloutTime).getTime()
          );
        } else if (this.name == "-2") {
          // 创建时间
          tempReq.createTime = goodsUtils.timeFun(
            new Date(createTime).getTime()
          );
        } else if (this.name == "-1") {
          // 删除时间
          // tempReq.deleteTime = goodsUtils.timeFun(deleteTime)
          tempReq.deleteTime = goodsUtils.timeFun(
            new Date(deleteTime).getTime()
          );
        }
        tempReq.$res = false;
        this.inSaleData.push(tempReq);
        tempReq = {};
      });
      let allData = this.inSaleData.length;
    },
    // 上下架弹出框的方法
    upperPopFun(index, msg) {
      // console.log(index,msg)
      this.stateMsg = msg;
      this.upperPop = true;
      // // 索引值
      this.statusShelves = index;
    },
    // 上\下架的方法处理
    stateConfirm() {
      // console.log("我是上下架的", this.inSaleData[this.statusShelves].stock);
      let stockStatus = this.name > 0 ? "-2" : "1";
      goods
        .singleUpper({
          ids: `${this.inSaleData[this.statusShelves].id}`,
          status: stockStatus
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            if (this.inSaleData.length == "1") {
              this.current = this.current - 1;
            }
            if (this.current <= "1") {
              this.current = 1;
            }
            this.$Message.success("状态更换成功");
            this.getGoodsData(this.name);
          }
        })
        .catch(err => {
          this.$Message.error("更换失败了");
        });
    },
    // 可以不用写
    stateCancel() {
      // this.$Message.info('点击了取消')
    },

    // 上/下架多选
    muiUpper(msg) {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return;
      }
      // console.log(msg)
      this.stateMsg = msg;
      this.popupLower = true;
    },
    // 批量上/下架的方法(处理方法)
    lowerOkFun() {
      // console.log(this.stateMsg)
      if (this.stateMsg === "批量上架") {
        this.statusMui = "1";
      } else if (this.stateMsg === "批量下架" || this.stateMsg === "批量恢复") {
        this.statusMui = "0";
      }
      // 调用接口
      this.getMuiFun();
    },
    getMuiFun() {
      // 对数组进行切割拼接
      let idData = "";
      let statusData = "";
      // console.log(this.tempTables)
      for (let i = 0; i < this.tempTables.length; i++) {
        if (i < this.tempTables.length - 1) {
          idData = idData + this.tempTables[i].id + ",";
        } else {
          idData = idData + this.tempTables[i].id;
        }
      }
      // 判断操作类型,进行传值
      if (this.statusMui === "1") {
        statusData = "1";
      } else if (this.statusMui === "0") {
        statusData = "-2";
      }
      goods
        .goodsMuiltiple({
          ids: idData,
          status: statusData
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            this.tempTables = [];
            if (this.inSaleData.length == this.tempTables.length) {
              this.current = this.current - 1;
            }
            if (this.current <= "1") {
              this.current = 1;
            }
            this.$Message.success("状态更换成功");
            this.getGoodsData(this.name);
          } else {
            this.$Message.error("状态更换失败");
          }
        })
        .catch(err => {
          this.$Message.error("状态更换失败");
        });
    },

    // 删除商品的弹框方法
    removeGoods(index, msg) {
      console.log(index, msg);
      this.delPop = true;
      this.tempChoice = "0";
      this.stateMsg = msg;

      this.idsData = this.inSaleData[index].id;
      console.log(this.idsData);
    },
    // 批量删除的弹框
    removeGoodsMui(msg) {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return;
      }
      // console.log(msg)
      this.delPop = true;
      this.tempChoice = "1";
      this.stateMsg = msg;
      console.log(this.tempTables);
      let idData = "";
      for (let i = 0; i < this.tempTables.length; i++) {
        if (i < this.tempTables.length - 1) {
          idData = idData + this.tempTables[i].id + ",";
        } else {
          idData = idData + this.tempTables[i].id;
        }
      }
      this.idsData = idData;
    },
    // 删除商品确定
    removeGoodsFun() {
      // 不是回收站的删除
      // let statusData = '-1'
      var url = "/api/goods/updShopDelID";
      if (this.name === "-1") {
        console.log("wwowoow", url);
        url = "/api/goods/delRecycleShop";
      }
      goods
        .goodsSingleRemove(
          {
            ids: this.idsData
          },
          url
        ).then(res => {
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            this.$Message.success("删除成功");
            // console.log('我是删除成功' + this.current)
            if (this.tempChoice == "0") {
              if (this.inSaleData.length == "1") {
                this.current = this.current - 1;
              }
            } else {
              console.log('我是多删')
              if (this.inSaleData.length == this.tempTables.length) {
                this.current = this.current - 1;
                console.log('我是相等的',this.current)
              }
            }
            if (this.current <= "1") {
              this.current = 1;
            }
            this.tempTables = [];
            // this.getGoodsData(this.name)
            this.switchFun();
          } else {
            this.$Message.error("删除失败");
          }
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    },
    removeCancel() {
      // this.$Message.info('取消了')
    },

    // 单个 商品恢复api/goods/updRecycleShopStatus
    recoveryFun(index, msg) {
      this.stateMsg = msg;
      this.recoveryData = true;
      this.statusShelves = index;
      this.idsData = this.inSaleData[this.statusShelves].id;
    },
    // 批量恢复
    muiRecoveryFun(msg) {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return;
      }
      this.stateMsg = msg;
      this.recoveryData = true;
      let idData = "";
      for (let i = 0; i < this.tempTables.length; i++) {
        console.log(this.tempTables[i].stock);
        if (i < this.tempTables.length - 1) {
          idData = idData + this.tempTables[i].id + ",";
        } else {
          idData = idData + this.tempTables[i].id;
        }
      }
      console.log(idData);
      this.idsData = idData;
    },
    recoFunOK() {
      goods
        .goodsRecovery({
          ids: this.idsData,
          status: "-2"
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            this.tempTables = [];
            this.$Message.success("恢复成功");
            // if (this.inSaleData.length == '1') {
            //     this.current = this.current - 1
            // }
            if (this.inSaleData.length == this.idsData.length) {
              this.current = this.current - 1;
            }
            if (this.current <= "1") {
              this.current = 1;
            }
            this.getGoodsData(this.name);
          } else {
            this.$Message.error("恢复失败");
          }
        })
        .catch(err => {
          this.$Message.error("恢复失败");
        });
    },
    // 取消
    recoCancelFun() {
      // this.$Message.info('取消恢复')
    },

    // 单选行获取的数据 第一个数选中的集合 第二个是当前选中的
    selectFun(params, row) {
      // 通过索引进行更改数据 在data中添加一个商品的 id 字段
      // console.log(params,row)
      this.tempTables.push(row);
      let len = this.tempTables.length;
      if (len == 10) {
        this.all = true;
      } else {
        this.all = false;
      }
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
      if (len == 10) {
        this.all = true;
      } else {
        this.all = false;
      }
      // console.log(this.tempTables)
    },
    // 全选的方法
    selectAllFun(value) {
      console.log("quanxunazhixing", value);
      this.tempTables = value;
      this.all = true;
    },
    // 全选取消的时候触发
    selectCancel() {
      this.tempTables = [];
      this.all = false;
    },

    // 操作
    operationFun(index) {
      // 应该是路由跳转 传递一个商品的id 或者是传递商品的信息
      this.$router.push({
        path: `/@/views/goodsadd/GoodsAdd?role=1&id=${
          this.inSaleData[index].id
        }&name=${this.name}`
      });
    },
    // 复制
    copyFun(index) {
      this.$router.push({
        path: `/@/views/goodsadd/GoodsAdd?role=2&id=${
          this.inSaleData[index].id
        }&name=${this.name}`
      });
    },
    specOpen(index) {
      console.log(index)
      let id = this.inSaleData[index].id
      this.$router.push(`/@/views/goodsadd/spec?id=${id}&name=${this.name}`)
    },
    changeDisOrder(row) {
      console.log(row);
      this.$set(row, "$res", true);
    },
    keepDisOrder(row) {
      console.log(row);
      if (isNaN(row.displayOrder)) {
        this.$Message.error("排序必须是一个数字");
        return;
      } else {
        if (row.displayOrder * 1 <= 0) {
          this.$Message.error("排序必须大于0");
          return;
        } else {
          if ((row.displayOrder + "").indexOf(".") > -1) {
            this.$Message.error("排序不能为小数");
            return;
          }
          if (row.displayOrder * 1 > 9999) {
            this.$Message.error("排序不能超过9999");
            return;
          }
        }
        let res = /^\+?[0-9][0-9]*$/
        if (!res.test(row.displayOrder)) {
            this.$Message.error('排序不能带符号')
            return false
        }
      }
      this.$set(row, "$res", false);
      console.log("我是排序正常的");
      // 请求的接口
      goods
        .goodsListDis({
          id: row.id,
          displayOrder: row.displayOrder
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.loadingData = false;
            this.$Message.success("保存成功");
            this.getGoodsData(this.name);
          } else {
            this.$Message.error("保存失败");
          }
        })
        .catch(err => {
          this.$Message.error("保存失败");
          this.getGoodsData(this.name);
        });
    },
    reCancelFun() {
      this.idsData = "";
      console.log("我是取消后的id", this.idsData);
    },
    // 翻页的方法
    // 参数是当前页码数
    pagefun(index) {
      this.current = index;
      // console.log('我是翻页的页码数',this.current)
      this.switchFun();
    },
    pageSizeFun(data) {
      console.log(data)
      this.tempSize = data
      this.size = data
      this.switchFun()
    }
  }
};
</script>

<style scoped>
@import "./index.css";
</style>
