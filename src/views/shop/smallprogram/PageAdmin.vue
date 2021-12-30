<template>
  <div id="page-admin">
    <div class="currentTitle">页面管理</div>
    <Card>
      <div class="header">
        <Button type="primary" v-if="hasRole(5010101)" size="small"  @click="add">+添加新页面</Button>
        <Select size="small" v-model="type" style="width:200px;" @on-change="selectFun" class="mar-le">
          <Option v-for="item in pageOption" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Input size="small" v-model="name" placeholder="输入页面关键词搜索" style="width: 220px;" class="mar-le"/>
        <Button type="primary" size="small" class="mar-le" @click="searchFun">搜索</Button>
        <div style="border-bottom: 1px solid #c9c9c9;margin: 10px -16px"></div>
        <Modal v-model="addPop" width="650">
          <p slot="header">
            <span>选择链接</span>
          </p>
          <div
            style="display: flex;flex-direction: row;flex-wrap: nowrap;justify-content:space-around;margin: 20px 0;"
          >
            <div
              style="text-align: center;padding: 20px;border: 1px dashed #ccc;cursor:pointer"
              @click="addPage(2)"
              onmouseover="this.style.cursor='pointer'"
            >
              <Icon size="24" style="padding: 10px" class="iconfont icon-CRM_icon_shouye"/>
              <p style="padding: 0 0 10px 0;">商城首页</p>
              <Button type="primary">立即创建</Button>
            </div>
            <!-- <div
              style="text-align: center;padding: 20px;border: 1px dashed #ccc;cursor:pointer"
              @click="addPage(4)"
              onmouseover="this.style.cursor='pointer'"
            >
              <Icon size="24" style="padding: 10px" class="iconfont icon-CRM_icon_liebiao"/>
              <p style="padding: 0 0 10px 0;">商品详情</p>
              <Button type="primary">立即创建</Button>
            </div> -->
            <div
              style="text-align: center;padding: 20px;border: 1px dashed #ccc;cursor:pointer"
              @click="addPage(3)"
              onmouseover="this.style.cursor='pointer'"
            >
              <Icon size="24" style="padding: 10px" class="iconfont icon-CRM_icon_wode"/>
              <p style="padding: 0 0 10px 0;">个人中心</p>
              <Button type="primary">立即创建</Button>
            </div>
            <div
              style="text-align: center;padding: 20px;border: 1px dashed #ccc;cursor:pointer"
              @click="addPage(5)"
              onmouseover="this.style.cursor='pointer'"
            >
              <Icon size="24" style="padding: 10px" class="iconfont icon-CRM_icon_bianji"/>
              <p style="padding: 0 0 10px 0;">自定义页</p>
              <Button type="primary">立即创建</Button>
            </div>
          </div>
          <div slot="footer"></div>
        </Modal>
      </div>
      <div class="main">
        <Tabs  type="card" @on-click="tabFun" v-model="tabData">
          <TabPane label="全部页面" name="1"></TabPane>
          <TabPane label="商城首页" name="2"></TabPane>
          <TabPane label="会员中心页" name="3"></TabPane>
          <!-- <TabPane label="商品详情页" name="4"></TabPane> -->
          <TabPane label="自定义页" name="5"></TabPane>
        </Tabs>
        <Table border ref="selection" :columns="columns" :data="tableData"></Table>
        <Modal
          v-model="upperPop"
          title="确认提示"
          @on-ok="stateConfirm"
          width="400px"
          :scrollable="false"
        >
          <div class="popConWra">
            <i class="tips"></i>
            <span>{{tempMsg}}</span>
          </div>
        </Modal>
        <Modal v-model="statusPop" title="确认提示" @on-ok="atatusOk" width="400px" :scrollable="false">
          <div class="popConWra">
            <i class="tips"></i>
            <span>{{tempMsg}}</span>
          </div>
        </Modal>
        <Modal
          v-model="staLengthPop"
          title="确认提示"
          @on-ok="atatusOk"
          width="400px"
          :scrollable="false"
        >
          <div class="popConWra">
            <i class="tips"></i>
            <div class="con-box">
              <p>{{tempTitle}}我是标题的</p>
              <span>{{tempMsg}}我是内容的</span>
            </div>
          </div>
          <div slot="footer" style="text-align: center">
            <Button type="default" size="large" @click="staLengthPop = false">返回</Button>
          </div>
        </Modal>
        <Modal v-model="link">
            <Input style="width: 300px" v-model="linkData" />
            <div slot="footer"></div>
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
import shop from "@/api/request/shop";
import goodsUtils from "@/utils/goodsUtils";
export default {
  data() {
    return {
      type: "1",
      // 添加弹框
      addPop: false,
      pageOption: [],
      name: "",
      tabData: "1",
      tableColumns: [],
      tableData: [],
      columns: [
        {
          title: "页面名称",
          align: "center",
          key: "name"
        },
        {
          title: "页面类型",
          align: "center",
          render: (h, params) => {
            let type = params.row.type;
            let res;
            switch (type) {
              case 2:
                res = "商城首页";
                break;
              case 3:
                res = "个人中心页";
                break;
              case 4:
                res = "商品详情页";
                break;
              case 5:
                res = "自定义页";
                break;
            }
            return h("span", {}, res);
          }
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let stateRes = params.row.status;
            return h("div", {}, [
              h(
                "Button",
                {
                  props: {
                    type: stateRes == "1" ? "primary" : "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    backgroundColor: stateRes ? "#0083b0!important" : "",
                    color: stateRes ? "#fff" : ""
                  },
                  on: {
                    click: () => {
                      //  stateRes  ? '未启用' : '启用'
                      this.statusFun(params.index);
                    }
                  }
                },
                stateRes ? "已启用" : "未启用"
              )
            ]);
          }
        },
        {
          title: "创建时间",
          align: "center",
          key: "createTime"
        },
        {
          title: "最后修改时间",
          align: "center",
          key: "lasteditTime"
        },
        {
          title: "操作",
          align: "center",
          width: 300,
          render: (h, params) => {
            let stateRes = params.row.status;
            let type = this.tabData;
            return h("div", {
              style:{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                color:'#0083b0',
                fontSize:'13px'
              }
            }, [
              h("div", {
                class: {},
                style: {
                  borderRight: "1px solid #0083b0",
                  paddingRight:"10px",
                  cursor: "pointer",
                  'display': this.hasRole(5010101) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.operationFun(params.row.id, params.row.type, params.index);
                  }
                }
              },"编辑"),

              h("div", {
                class:{},
                style: {
                  borderRight: "1px solid #0083b0",
                  padding:"0 10px",
                  cursor: "pointer",
                  'display': this.hasRole(5010103) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.statusFun(params.index);
                  }
                }
              },stateRes == 1?"禁用":"启用"),

              h("div", {
                class: {},
                style: {
                  borderRight: "1px solid #0083b0",
                  padding:"0 10px",
                  cursor: "pointer",
                  'display': this.hasRole(5010104) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.copyFun(params.row.id, params.row.type);
                  }
                }
              },"复制"),


              params.row.statusRes
                ? h("div", {
                    class: {
                    },
                    style: {
                      borderRight: "1px solid #0083b0",
                      padding:"0 10px",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.openLink(params.index, params.row.id);
                      }
                    }
                  },"链接")
                : "",

              h("div", {
                class: {},
                style: {
                  padding:"0 10px",
                  cursor: "pointer",
                  'display': this.hasRole(5010105) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.delFun(params.index);
                  }
                }
              },"删除")
            ]);
          }
        }
      ],
      total: 10,
      size: 10,
      tempSize: 10,
      current: 1,
      tempName: "1",
      // 暂存的数据
      tempId: "",
      tempStatus: "",
      tempModelType: "",
      // 删除的弹框
      upperPop: false,
      // 删除显示的内容
      tempMsg: "",
      // 是否可以删除的状态
      tempDel: false,
      // 状态切换
      statusPop: false,
      tempType: "",
      // 长度大于的弹框
      staLengthPop: false,
      // 启用大于10 的信息
      tempTitle: "",
      link: false,
      linkData: '',
      tabStatus: ''
    };
  },
  // created() {
  //   this.tabData = '1'
  //   this.type = '1'
  //   this.tempName = '1'
  //   // 请求的类型
  //   this.getType();
  //   // 请求数据
  //   this.getData();
  //   console.log('生命周期')
  // },
  activated() {
    console.log('activated..............')
    this.tabStatus = this.$route.query.tabstatus
    if (this.tabStatus) {
      this.tabData = this.tabStatus
      this.type = this.tabStatus
      this.tempName = this.tabStatus
    } else {
      this.tabData = '1'
      this.type = '1'
      this.tempName = '1'
    }
    this.size = 10
    this.getType();
    this.getData();
    console.log('activated..............',this.tabData,this.type)
  },
  methods: {
    // 请求类型
    getType() {
      shop
        .pageAdminType()
        .then(res => {
          console.log(res);
          let con = res.data;
          if (res.code == "1") {
            let arr = []
            con.forEach((element, index) => {
              // console.log('我是类',element)
              if (element.id != 4) {
                con[index].id = element.id + "";
                arr.push(element)
              }
            });
            this.pageOption = arr;
          } else {
            console.log("类型请求失败");
          }
        })
        .catch(err => {
          console.log("类型请求失败");
        });
    },
    // tab切换
    tabFun(names) {
      this.tempName = names;
      this.type = names;
      this.tabData = names;
      this.current = 1
      this.name = ''
      // 切换tab请求的
      console.log('我是tab切换的',this.current)
      this.getData();
    },
    selectFun(data) {
      this.tempName = data;
    },
    // 获取数据
    getData() {
      console.log("我是查看的页码数", this.current);
      shop
        .pageAdmin({
          type: this.tempName,
          name: this.name,
          current: this.current,
          size: this.size
        })
        .then(res => {
          if (res.code == "1") {
            this.integrationData(res.data);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });
    },
    // 整合数据
    integrationData(data) {
      console.log(data);
      this.size = data.size;
      this.current = data.current;
      console.log('测试',this.current)
      this.total = data.total;
      let rows = data.rows;
      rows.forEach(item => {
        console.log('我是状态的',item.status)
        switch (item.type) {
          case 2:
          item.link = '/pages/index/index?id='
          item.statusRes = true
            break;
          case 3:
          item.link = '/pages/member/index/index?id='
          item.statusRes = true
            break;
        }
        item.createTime = goodsUtils.timeFun(
          new Date(item.createTime).getTime()
        );
        item.establishTime = goodsUtils.timeFun(
          new Date(item.establishTime).getTime()
        );
        item.lasteditTime = goodsUtils.timeFun(
          new Date(item.lasteditTime).getTime()
        );
      });
      this.tableData = rows;
      console.log("rows", rows);
    },
    searchFun() {
      this.tabData = this.type;
      this.current = 1
      this.getData();
    },
    add() {
      this.addPop = true;
    },
    addPage(res) {
      this.$router.push(`/@/components/templatePage?type=` + res);
      this.addPop = false;
    },
    // 状态更换
    statusFun(index) {
      this.statusPop = true;
      if (this.tableData[index].status == "1") {
        this.tempMsg = "确认禁用该页面模板？";
      } else {
        this.tempMsg = "确认启用该页面模板";
      }
      this.tempId = this.tableData[index].id;
      this.tempStatus = this.tableData[index].status == 1 ? 0 : 1;
      console.log('我是切换的状态')
      this.tempType = this.tableData[index].type;
    },
    atatusOk() {
      // console.log(this.tempId,this.tempStatus,this.tempType)
      shop
        .pageAdminUpdate({
          id: this.tempId,
          status: this.tempStatus,
          typeId: this.tempType
        }).then(res => {
          if (res.code == "1") {
            this.$Message.success("切换成功");
            this.current = this.current;
            this.getData();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("状态切换失败");
        });
    },

    pagefun(index) {
      this.current = index;
      this.getData()
    },
    pageSizeFun(data) {
      this.size = data
      this.tempSize = data
      this.getData()
    },
    // 编辑的
    operationFun(id, type, index) {
      console.log("bianji");
      let status = this.tableData[index].status
      console.log(status)
      this.$router.push(`/@/components/templatePage?type=` + type + "&id=" + id + "&status=" + status + '&tabstatus=' + this.tabData);
    },
    // 复制
    copyFun(id, type) {
      console.log('复制的')
      this.$router.push(`/@/components/templatePage?role=1&type=` + type + "&id=" + id + '&tabstatus=' + this.tabData);
    },
    openLink(index,id) {
      console.log('我是id',this.tableData[index])
      let linka = this.tableData[index].link
      this.link = true
      // console.log('我是链接',linkData)
      this.linkData = linka + id
    },
    delFun(index) {
      this.tempDel = false;
      let status = this.tableData[index].status;
      this.upperPop = true;
      if (status == "1") {
        this.tempMsg = "该页面模板启用中，如需删除需先禁用！";
        this.tempDel = true;
      } else {
        this.tempMsg = "是否确认删除这个页面模板?";
      }
      this.tempId = this.tableData[index].id;
    },
    // 删除
    stateConfirm() {
      if (this.tempDel) {
        this.$Message.error(this.tempMsg);
        return;
      } else {
        shop.pageAdminDel({
            id: this.tempId
          }).then(res => {
            if (res.code == "1") {
              this.$Message.success("删除成功");
              if (this.tableData.length == 1) {
                this.current = this.current - 1;
              }
              if (this.current <= 1) {
                this.current = 1;
              }
              this.getData();
            } else {
              this.$Message.error(res.message);
            }
          }).catch(err => {
            // console.log(err)
            this.$Message.error("删除失败");
          });
      }
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
#page-admin {
  .header {
    margin-bottom: 16px;
    .mar-le {
      margin-left: 20px;
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
</style>
