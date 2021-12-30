<template>
  <div id="user-list">
    <div class="currentTitle">用户列表</div>
    <Card>
      <div class="header" slot="title">
        <div class="header-box line-bottom">
          <Select size="small" placeholder="请选择渠道" v-model="openidWxapp" style="width:150px;margin-right: 5px;">
            <Option v-for="item in channel" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select size="small" placeholder="请选择成交次数" v-model="buyCount" style="width:150px;margin-right: 5px;">
            <Option v-for="item in dealNum" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select size="small" placeholder="请选择性别" v-model="sex" style="width:150px;margin-right: 5px;">
            <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input
            size="small"
            placeholder="请输入手机号查询"
            :maxlength="11"
            v-model="mobile"
            style="width: 200px;margin-right: 5px;"
          />
          <Button size="small" type="primary" @click="userSearch">查询</Button>
          <Button size="small" type="primary" @click="refresh" :loading="loading" style="margin-left: 5px;">刷新订单状态</Button>
        </div>
      </div>
      <div>
        <div class="main">
          <Table border :columns="userColumns" :data="userData"></Table>
        </div>
        <div class="page">
          <Page
            :total="total"
            :page-size="size"
            show-sizer
            :page-size-opts="[10,15,20]"
            @on-page-size-change="pageSizeFun"
            @on-change="pagefun"
            :current="current"
            :show-elevator="true"
            :show-total="true"
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import api from "@/api/request";
import users from "@/api/request/users";
import goodsUtils from "@/utils/goodsUtils";
export default {
  data() {
    return {
      loading: false,
      // 渠道
      channel: [
        {
          value: "2",
          label: "全部渠道"
        },
        {
          value: "微信小程序",
          label: "微信小程序"
        }
      ],
      openidWxapp: "2",
      // 成交次数
      dealNum: [
        {
          value: "4",
          label: "成交次数"
        },
        {
          value: "0",
          label: "0"
        },
        {
          value: "1",
          label: "1+"
        },
        {
          value: "2",
          label: "2+"
        },
        {
          value: "3",
          label: "3+"
        },
        {
          value: "5",
          label: "5+"
        },
        {
          value: "10",
          label: "10+"
        }
      ],
      buyCount: "4",
      // 性别
      sexList: [
        {
          value: "3",
          label: "全部性别"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      sex: "3",
      // 用户搜索手机号
      mobile: "",
      // 用户数据
      userColumns: [
        {
          title: "用户",
          key: "nickname",
          width: 250,
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.avatar,
                  style: "width: 40px;height: 40px;vertical-align: middle;"
                },
                style: {},
                on: {
                  click: () => {
                    this.editUser(params.row.id);
                  }
                }
              }),
              h(
                "span",
                {
                  style: {
                    display: 'inline-block',
                    height: '40px',
                    lineHeight: '40px',
                    textAlign: 'left',
                    marginLeft: '5px',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }
                },
                params.row.nickname
              )
            ]);
          }
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center"
        },
        {
          title: "性别",
          align: "center",
          width: 70,
          render: (h, params) => {
            return h("div", params.row.sex == 1 ? "男" : "女");
          }
        },
        {
          title: "城市",
          key: "city",
          align: "center"
        },
        {
          title: "时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "订单信息",
          key: "orderInfo",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    display: "block"
                  }
                },
                `订单成交数：${params.row.buyCount}`
              ),
              h(
                "span",
                {
                  style: {
                    display: "block"
                  }
                },
                `金额：${params.row.buyMoney}`
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "operation",
          width: 140,
          align: "center",
          render: (h, params) => {
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
                  'border-right':this.hasRole(302)?'1px solid #0083b0':'none',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(20101) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.editUser(params.row.id);
                  }
                }
              },'编辑'),
              h('div', {
                class:'',
                style:{
                  'padding-left':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(302) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.orderList(params.row.id);
                  }
                }
              },'订单记录'),
              // h("Icon", {
              //   class: {
              //     iconfont: true,
              //     "icon-edit-square": true
              //   },
              //   style: {
              //     width: "22px",
              //     height: "22px",
              //     textAlign: "center",
              //     lineHeight: "22px"
              //   },
              //   on: {
              //     click: () => {
              //       this.editUser(params.row.id);
              //     }
              //   }
              // }),
              // h("Icon", {
              //   class: {
              //     iconfont: true,
              //     "icon-warning-circle": true
              //   },
              //   style: {
              //     width: "22px",
              //     height: "22px",
              //     textAlign: "center",
              //     lineHeight: "22px"
              //   },
              //   on: {
              //     click: () => {
              //       this.orderList(params.row.id);
              //     }
              //   }
              // })
            ]);
          }
        }
      ],
      userData: [],
      // 分页的数据
      total: null,
      current: 1,
      size: 10
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    refresh() {
      this.loading = true
      users.usersBuyCount().then(res => {
        this.loading = false
        // console.log('我是订单数量请求的',res)
        if (res.code == 1) {
          this.getUserData();
        }
      }).catch(res => {
        this.loading = false
        console.log("查询失败");
      });
    },
    getUserData() {
      this.userData = [];
      let channels = this.openidWxapp == "2" ? "" : this.openidWxapp;
      let sexs = this.sex == "3" ? "" : this.sex;
      users
        .usersList({
          openidWxapp: channels,
          buyCount: this.buyCount,
          sex: sexs,
          mobile: this.mobile,
          current: this.current,
          mnames: this.mnames,
          size: this.size
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.integration(res.data);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(res => {
          this.$Message.error("查询失败");
        });
    },
    // 整合数据
    integration(res) {
      console.log(res);
      this.total = res.total;
      this.current = res.current;
      // this.size = res.size;
      let req = {};
      res.records.forEach(element => {
        let {
          id,
          nickname,
          avatar,
          mobile,
          sex,
          city,
          createTime,
          buyCount,
          buyMoney
        } = element;
        req.id = id;
        req.nickname = nickname;
        req.avatar = avatar;
        req.mobile = mobile;
        req.sex = sex;
        req.city = city;
        req.createTime = goodsUtils.timeFun(goodsUtils.timeStamp(createTime));
        req.buyCount = buyCount;
        req.buyMoney = buyMoney;
        this.userData.push(req);
        req = {};
      });
      console.log(this.userData);
    },
    // 跳转用户编辑列表
    editUser(id) {
      // 根据用户id进行传递
      console.log("我是id", id);
      this.$router.push({
        path: "/@/views/user/UserInfo",
        query: { userId: id }
      });
    },
    // 跳转订单页面
    orderList(id) {
      this.$router.push({
        path: "/@/views/order/OrderAdmin",
        query: { userId: id }
      });
    },
    // 搜索
    userSearch() {
      if (this.mobile != "") {
        if (isNaN(this.mobile)) {
          this.$Message.error("手机号必须是数字");
          return;
        } else {
          let res = /^1[3456789]\d{9}$/;
          if (!res.test(this.mobile)) {
            this.$Message.error("手机号输入不正确");
            return;
          }
        }
      }
      this.current = 1;
      this.getUserData();
    },
    // 翻页
    pagefun(index) {
      this.current = index;
      this.getUserData();
    },
    pageSizeFun(data) {
      console.log(data)
      this.size = data
      this.getUserData()
    }
  }
};
</script>

<style scoped>
#user-list {
  background-color: #fff;
}
#user-list .page {
  display: flex;
  justify-content: flex-end;
  padding: 20px 10px 0 0;
}
#user-list .user-name {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  text-align: left;
  margin-left: 5px;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
</style>
