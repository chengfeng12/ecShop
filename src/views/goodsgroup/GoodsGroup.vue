<template>
  <div id="goods-group">
    <div class="currentTitle">商品分组</div>
    <div class="bg-box">
      <div class="goods-group-box">
        <div class="basic-content">
          <Button v-if="hasRole(10301)" type="primary" class="title-right" @click="toLink">
            <span style="color: #fff;">添加商品组</span>
          </Button>
          <Input
            class="title-right"
            v-model="searchName"
            placeholder="输入商品组名称搜索"
            style="width: 220px"
          />
          <Button @click="searchFun" class="title-right" type="primary">搜索</Button>
        </div>
      </div>
      <div style="padding: 0 10px">
          <div class="table-con">
            <Table
              border
              ref="selection"
              :columns="columnsGroup"
              :data="groupData"
              @on-select="selectFun"
              @on-select-all="selectAllFun"
              @on-select-cancel="selectCancelFun"
              @on-select-all-cancel="selectCancel"
            ></Table>
            <Modal
              v-model="delPop"
              title="确认提示"
              @on-ok="removeFun"
              @on-cancel="reCancelFun"
              width="400px"
              :scrollable="false"
            >
              <div class="popConWra">
                <i class="tips"></i>
                <span>是否确认{{tempRes}}商品组？</span>
              </div>
            </Modal>
            <!-- 启用禁用 -->
            <Modal
              v-model="startPop"
              title="确认提示"
              @on-ok="changeFun"
              @on-cancel="reCancelFun"
              width="400px"
              :scrollable="false"
            >
              <div class="popConWra">
                <i class="tips"></i>
                <span>是否确认{{tempRes}}商品组？</span>
              </div>
            </Modal>
          </div>
          <div class="footer">
            <div class="btn-box">
              <Button v-if="hasRole(1030103)" class="title-right" type="primary" @click="startState">启用</Button>
              <Button v-if="hasRole(1030103)" class="title-right" type="primary" @click="prohibitState">禁用</Button>
              <Button v-if="hasRole(1030102)" class="title-right" type="primary" @click="removeGroupArr">删除</Button>
            </div>
            <div class="dis">
              <div class="page">
                <Page
                  :total="total"
                  :page-size="size"
                  @on-change="pagefun"
                  show-sizer
                  :page-size-opts="[10,15,20]"
                  @on-page-size-change="pageSizeFun"
                  :show-elevator="true"
                  :show-total="true"
                ></Page>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/request";
import goods from "@/api/request/goods";
import goodsUtils from "@/utils/goodsUtils";
export default {
  data() {
    return {
      // 选中的数据
      data: "",
      // 搜索商品的数据
      searchName: "",
      columnsGroup: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "商品组名称",
          key: "name"
        },
        {
          title: "商品数量",
          key: "goodsNum",
          width: 150,
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 160,
          render: (h, params) => {
            let stateRes = params.row.status;
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: stateRes ? "primary" : "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    'display': this.hasRole(1030103) ?'block':'none',
             
                  },
                  on: {
                    click: () => {
                      this.stateFun(params.index, stateRes ? "禁用" : "启用");
                    }
                  }
                },
                stateRes ? "启用" : "禁用"
              )
            ]);
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "操作",
          width: 140,
          key: "operation",
          align: "center",
          render: (h, params) => {
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
                  'border-right':this.hasRole(1030102)?'1px solid #0083b0':'none',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(10301) ?'block':'none',
                  
                },
                on: {
                  click: () => {
                    this.editGroup(params.index);
                  }
                }
              },'编辑'),
              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(1030102) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.removeGroup(params.index, "删除");
                  }
                }
              },'删除'),
              // h("Icon", {
              //   class: {
              //     iconfont: true,
              //     "icon-edit-square": true
              //   },
              //
              //   on: {
              //     click: () => {
              //       this.editGroup(params.index);
              //     }
              //   }
              // }),
              // h("Icon", {
              //   class: {
              //     iconfont: true,
              //     "icon-delete": true
              //   },
              //
              //   on: {
              //     click: () => {
              //       this.removeGroup(params.index, "删除");
              //     }
              //   }
              // })
            ]);
          }
        }
      ],
      groupData: [],
      // 弹框
      delPop: false,
      startPop: false,

      // 暂存id
      tempId: "",
      tempStatus: "",
      tempRes: "",
      // 判断单选还是多选的变量
      tempChoice: "",

      // 翻页后端字段
      total: null,
      // 每页显示条数
      size: 10,
      // 当前页数
      current: 1,

      // tables 暂时存的数组
      tempTables: []
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    // 获取数据请求
    getGoods(page) {
      let _this = this;
      _this.tempTables = [];
      _this.tempId = "";
      _this.tempChoice = "0";
      goods
        .goodsGroupList({
          current: page || _this.current,
          size: _this.size
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            _this.groupData = [];
            _this.groupDataFun(res);
            _this.total = res.data.total;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {});
    },
    // 处理数据
    groupDataFun(res) {
      this.groupData = [];
      console.log(res);
      let backData = res.data.rows;
      // console.log(backData)
      let tempReq = {};
      backData.forEach(item => {
        let { id, name, counts, status, createTime, goodsNum } = item;
        tempReq.id = id;
        tempReq.name = name;
        tempReq.goodsNum = goodsNum ? goodsNum : 0;
        tempReq.counts = counts;
        tempReq.status = status;
        tempReq.createTime = goodsUtils.timeFun(new Date(createTime).getTime());
        this.groupData.push(tempReq);
        tempReq = {};
      });
      console.log(this.groupData);
    },
    // 搜索列表
    searchFun() {
      goods
        .goodsGroupList({
          name: this.searchName
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            console.log(res);
            this.groupDataFun(res);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {});
    },
    editGroup(index) {
      let gid = this.groupData[index].id;
      this.$router.push({
        path: "/@/views/goodsgroup/AddGroup",
        query: { title: "edit", groupId: gid }
      });
    },

    // 删除的弹框
    removeGroup(index, res) {
      this.tempId = this.groupData[index].id;
      this.delPop = true;
      this.tempChoice = "0";
      this.tempRes = res;
      console.log(index);
    },
    // 确定删除
    removeFun() {
      let _this = this;
      // 删除的接口没写
      console.log(this.tempId);
      goods.goodsGroupDel({
          ids: _this.tempId
        })
        .then(res => {
          console.log(res);
          let code = res.code;
          if (code == "1") {
            // 判断单选还是多选
            if (_this.tempChoice == "0") {
              // console.log('我是单选',_this.current)
              if (_this.groupData.length == "1") {
                _this.current = _this.current - 1;
                // console.log('我是最后一个数',_this.current)
              }
            } else {
              // console.log('我是多选',_this.current)
              if (_this.groupData.length == _this.tempTables.length) {
                _this.current = _this.current - 1;
                //    console.log('我刚好等于那个数组长度',_this.current)
              }
            }
            if (_this.current <= 1) {
              _this.current = 1;
            }
            _this.$Message.success("删除成功");
            _this.tempId = ''
            _this.getGoods(_this.current);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    },
    reCancelFun() {
      this.tempId = "";
      console.log("我是取消后的", this.tempId);
    },
    // 改变状态
    stateFun(index, res) {
      console.log(this.groupData[index]);
      this.startPop = true;
      this.tempId = this.groupData[index].id;
      this.tempStatus = this.groupData[index].status ? 0 : 1;
      this.tempRes = res;
    },

    // 更改状态的方法
    changeFun() {
      goods
        .goodsGroupUpdate({
          ids: this.tempId,
          status: this.tempStatus
        })
        .then(res => {
          // console.log('我是返回值',res)
          let code = res.code;
          if (code == "1") {
            this.$Message.success("更改成功");
            this.tempId = ''
            this.getGoods(this.current);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("更改失败");
        });
    },
    // 处理数据的方法
    integrationFun(index) {
      console.log("我是", index);
      let len = this.tempTables.length;
      for (let i = 0; i < len; i++) {
        if (i < len - 1) {
          this.tempId = this.tempId + this.tempTables[i].id + ",";
        } else {
          this.tempId += this.tempTables[i].id;
        }
      }
      console.log("ids", this.tempId);
      this.tempStatus = index ? 1 : 0;
      // this.changeFun(this.tempId, statusRes)
    },
    // 启用状态
    startState() {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return;
      }
      this.startPop = true;
      this.tempChoice = "1";
      this.integrationFun(1);
      this.tempRes = "批量启用";
    },
    // 禁用状态
    prohibitState() {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return;
      }
      this.startPop = true;
      this.tempChoice = "1";
      this.integrationFun(0);
      this.tempRes = "批量禁用";
    },
    // 删除
    removeGroupArr() {
      if (this.tempTables.length == 0) {
        this.$Message.error("选择不能为空");
        return;
      }
      this.delPop = true;
      this.tempChoice = "1";
      this.integrationFun(0);
      this.tempRes = "批量删除";
    },

    // 翻页方法
    pagefun(page) {
      this.current = page;
      this.getGoods(this.current);
    },
    pageSizeFun(data) {
      this.size = data
      this.getGoods(this.current);
    },
    // 单选行获取的数据 第一个数选中的集合 第二个是当前选中的
    selectFun(params, row) {
      console.log(params, row);
      this.tempTables.push(row);
      // console.log(this.tempTables)
      // 需要在data 中定义一个字段 用来存储多选的数据
    },
    // 单选取消事件
    selectCancelFun(data, row) {
      console.log(row);
      // 获取选中数据的id
      let id = row.id;
      // 数组条件过滤
      this.tempTables = this.tempTables.filter(element => element.id !== id);
      // console.log(this.tempTables)
    },
    // 全选的方法
    selectAllFun(value) {
      this.tempTables = value;
      console.log("我是全选", this.tempTables);
    },
    // 全选取消的时候触发
    selectCancel() {
      this.tempTables = [];
      console.log("我是全不选", this.tempTables);
    },
    // 跳转链接
    toLink() {
      this.$router.push({
        path: "/@/views/goodsgroup/AddGroup",
        query: { title: "add" }
      });
    }
  }
};
</script>

<style scoped>
@import './index.css'
</style>
