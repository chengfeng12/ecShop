<template>
  <div id="two-code">
    <div class="currentTitle">商品二维码</div>
    <Card>
      <div id="header">
        <Button  v-if="hasRole(101)" type="primary" size="small" class="btn-a" @click="add">商品管理</Button>
        <div class="vue-treeselect mar-le">
          <treeselect
            size="small"
            :options="classOption"
            v-model="categoryId"
            :searchable="false"
            :clearable="false"
            placeholder="选择商品分类"
          />
        </div>
        <Input size="small" v-model="idAndName" placeholder="请输入商品名称进行搜索" style="width: 220px;" class="mar-le"/>
        <Button type="primary" size="small" class="mar-le btn-a" @click="search">搜索</Button>
        <div style="border-bottom: 1px solid #c9c9c9;margin: 10px -16px"></div>
      </div>
      <div class="main">
        <Table border ref="selection" :columns="columns" :data="tableData"></Table>
        <Modal v-model="link">
            <Input style="width: 300px" v-model="linkData" />
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="imgPop" class="qrmodel">
            <img class="img-base"  v-if="imgBaseData != ''" :src="imgBaseData">
            <div slot="footer">
              <a :href="imgBaseData" download="qrcode.jpg">点击下载</a>
            </div>
        </Modal>
      </div>
      <div class="footer">
        <div class="page">
          <Page
            :total="total"
            :page-size="size"
            :current="current"
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
import goods from "@/api/request/goods";
import shops from "@/api/request/shop";
import goodsUtils from "@/utils/goodsUtils";
// 引入分类
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    return {
      classOption: [],
      columns: [
        {
          title: "商品",
          align: "center",
          render: (h, params) => {
            let arr = [];
            if(params.row.name) {
              params.row.name.forEach(element => {
                arr.push(
                  h("p",{
                      style: {
                        marginBottom: "5px",
                        color: "red"
                      }
                    },
                    `[${element}]`
                  )
                );
              });
            }
            return h("div",{
                style: {
                  display: "flex",
                  flexDirection: "row"
                }
              },[params.row.thumb != "" ? h("img", {
                      style: {
                        display: "inline-block",
                        height: "70px",
                        width: "70px",
                        marginTop: "10px",
                        marginBottom: "10px",
                        verticalAlign: "middle",
                        marginRight: "10px"
                      },
                      attrs: {
                        //设置属性
                        src: params.row.thumb
                      }
                    })
                  : "", [h("div",{
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: 'center',
                        textAlign: "left"
                      }
                    }, [h("p", {
                          style: {
                            marginBottom: "5px"
                          }
                        },
                        params.row.title),arr
                    ]
                  )
                ]
              ]
            );
          }
        },
        {
          title: "价格",
          // key: 'price',
          width: 130,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {}
              },
              `￥${params.row.price}`
            );
          }
        },
        {
          title: "虚拟库存",
          key: "vituralStock",
          align: "center",
          width: 110,
        },
        {
          title: "实际库存",
          key: "stock",
          align: "center",
           width: 110,
        },
        {
          title: "上架时间",
          align: "center",
          key: "putawayTime"
        },
        {
          title: "操作",
          key: "operation",
          align: "center",
          render: (h, params) => {
            let arr = []
            let dom = h('Poptip', {
              attrs: {
                trigger: "hover",
                title: "/pages/goods/detail/index?id=" + params.row.id,
                placement: "left"
              }
            },[
            ])
            arr.push(dom)
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
              h("div", {
                class: {},
                style: {
                  borderRight: "1px solid #0083b0",
                  paddingRight:"10px",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.operationFun(params.row.id);
                  }
                }
              },"链接"),
              h("div", {
                class: {},
                style: {
                  padding:"0 10px",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.qrcodeFun(params.row.id);
                  }
                }
              },"二维码")
            ]);
          }
        }
      ],
      tableData: [],
      categoryId: "",
      idAndName: "",
      total: 10,
      size: 10,
      current: 1,
      link: false,
      imgPop: false,
      linkData: '/pages/goods/detail/index?id=',
      imgBaseData: ''
    };
  },
  activated() {
    this.getData();
    this.oneClassFun();
  },
  components: {
    Treeselect
  },
  methods: {
    oneClassFun() {
      goods.goodsClassAll()
        .then(res => {
          if (res.code == "1") {
            console.log(res);
            this.classOption = goodsUtils.classAllFun(res.data);
            this.categoryId = this.classOption[0].id;
            console.log(".............", this.categoryId);
          }
        })
        .catch(err => {
          console.log("分类查询失败");
        });
    },
    getData() {
      goods.goodsLists({
          status: 1,
          size: this.size,
          current: this.current ,
          categoryId: this.categoryId ? this.categoryId : 1,
          idAndName: this.idAndName
        }).then(res => {
          let code = res.code;
          if (code == "1") {
            this.getDataFun(res);
          } else {
            this.$Message.error(res.message);
          }
        }).catch(err => {
          this.$Message.error("请求失败");
          console.log(err);
        });
    },
    // 成功的数据处理
    getDataFun(res) {
      let backData = res.data.rows;
      this.total = res.data.total * 1;
      this.size = res.data.size * 1;
      this.current = res.data.current * 1;
      console.log(backData);
      let arrList = [];
      // // 数据
      backData.forEach(item => {
        let tempReq = {};
        let {
          id,
          displayOrder,
          thumb,
          title,
          price,
          vituralStock,
          stock,
          vituralSales,
          status,
          putawayType,
          putawayTime,
          selloutTime,
          deleteTime,
          createTime,
          categoryName,
          
        } = item;
        tempReq.id = id;
        tempReq.displayOrder = displayOrder;
        tempReq.thumb = thumb;
        tempReq.title = title;
        tempReq.price = price ? price.toFixed(2) : 0;
        tempReq.vituralStock = vituralStock;
        tempReq.stock = stock ? stock : "0";
        tempReq.vituralSales = vituralSales;
        tempReq.status = status;
        tempReq.putawayType = putawayType;
        let arr = [];
        if (categoryName) {
          tempReq.name = categoryName.split(',')
        }
        tempReq.putawayTime = goodsUtils.timeFun(putawayTime);
        // tempReq.$res = false;
        arrList.push(tempReq);
      });
      this.tableData = arrList;
      console.log(this.tableData);
    },
    search() {
      this.current = 1
      this.getData()
    },
    add() {
      this.$router.push(`/@/views/goodslist/GoodsList`);
    },
    operationFun(index) {
      // console.log('点击的链接',index)
      this.linkData = '/pages/goods/detail/index?id='
      this.link = true
      this.linkData = this.linkData + index
      console.log(this.linkData)
    },
    qrcodeFun(id) {
      console.log('id',id)
      shops.advertisementQrcode({
        'id': id
      }).then(res=> {
        if (res.code == 1) {
          console.log('我是',res)
          if (res.data.imgBase) {
            let imgBase = 'data:image/jpeg;base64,' + res.data.imgBase
            this.imgBaseData = imgBase
            this.imgPop = true
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
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
.currentTitle{
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
#two-code {
  #header {
    margin-bottom: 16px;
    .mar-le {
      margin-left: 20px;
    }
    .vue-treeselect {
      display: inline-block;
      vertical-align: middle;
      width: 350px;
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
    .img-base {
      max-width: 430px;
    }
    .qrmodel {
        a {
          color: #aaa;
        }
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
.center-left{
  float: left;
} 
</style>

