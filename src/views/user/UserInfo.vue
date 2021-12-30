<template>
  <div id="user-list">
    <Card>
      <div class="main">
        <div class="basic-content">
          <h3 class="second-title">基本信息</h3>
          <div class="content-war">
            <span class="content-war-span">用户头像：</span>
            <img v-if="userInfo.avatar != ''" :src="userInfo.avatar">
            <span v-else>暂无</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">昵称：</span>
            <span>{{userInfo.nickname ? userInfo.nickname : '暂无'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">来源渠道：</span>
            <span>{{userInfo.comeFrom ? userInfo.comeFrom : '暂无'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">Openid：</span>
            <span>{{userInfo.openid ? userInfo.openid : '暂无'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">Unionid：</span>
            <span>{{userInfo.Unionid ? userInfo.Unionid : '暂无'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">真实姓名：</span>
            <span>暂无</span>
            <!-- <span>{{userInfo.realname ? userInfo.realname : '暂无'}}</span> -->
          </div>
          <div class="content-war">
            <span class="content-war-span">性别：</span>
            <span>{{userInfo.sex ? (userInfo.sex == '1' ? '男' : '女') : '暂无'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">城市：</span>
            <span>{{userInfo.city ? userInfo.city : '暂无'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">出生年月日：</span>
            <span>{{userInfo.birthday ? userInfo.birthday : '暂无'}}</span>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="basic-content">
          <h3 class="second-title">用户绑定</h3>
          <div class="content-war">
            <span class="content-war-span">手机号码：</span>
            <span>{{userInfo.mobile ? userInfo.mobile : '空'}}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">是否绑定：</span>
            <RadioGroup v-model="userInfo.mobileVerified">
              <Radio :disabled="userInfo.mobileVerified == '1'" label="2">已绑定</Radio>
              <Radio :disabled="userInfo.mobileVerified == '2'" label="1">未绑定</Radio>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="basic-content">
          <h3 class="second-title">收货信息</h3>
          <div class="content-war">
            <span class="content-war-span">收货人姓名：</span>
            <span>{{ userInfoOrder.name ? userInfoOrder.name : '暂无' }}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">手机号码：</span>
            <span>{{ userInfoOrder.phone ? userInfoOrder.phone : '暂无' }}</span>
          </div>
          <div class="content-war">
            <span class="content-war-span">收货地址：</span>
            <span>{{ userInfoOrder.address ? userInfoOrder.address : '暂无' }}</span>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="basic-content">
          <h3 class="second-title">交易信息</h3>
          <div class="content-box receiv-info">
            <div class="deal-box">
              <p>累计订单数</p>
              <p>{{ deal.statusALl ? deal.statusALl : '暂无' }}</p>
            </div>
            <div class="deal-box">
              <p>累计订单金额</p>
              <p>{{ deal.payAmount ? deal.payAmount : '暂无' }}</p>
            </div>
            <div class="deal-box">
              <p>累计维权订单数</p>
              <p>{{ deal.statusRight ? deal.statusRight : '暂无' }}</p>
            </div>
            <div class="deal-box">
              <p>累计退款金额</p>
              <p>{{ deal.refundAmout ? deal.refundAmout : '暂无' }}</p>
            </div>
          </div>
          <h3 class="second-title">订单明细：</h3>
          <div class="content-war">
            <Table border :columns="orderColumns" :data="orderData"></Table>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import api from "@/api/request";
import users from "@/api/request/users";
import orderApi from "@/api/request/order";
import goodsUtils from "@/utils/goodsUtils";
export default {
  data() {
    return {
      // 用户信息
      userInfo: {
        mobileVerified: "1",
        avatar: ''
      },
      // 交易信息
      deal: {
        // 订单数量
        statusALl: null,
        // 累计订单金额
        payAmount: null,
        // 订单维权
        statusRight: null,
        // 累计退款
        refundAmout: null
      },
      orderColumns: [
        {
          title: "日期",
          key: "createTime"
        },
        {
          title: "订单编号",
          key: "orderNo"
        },
        {
          title: "购买渠道",
          key: "soureType"
        },
        {
          title: "订单金额",
          key: "payPrice"
        },
        {
          title: "订单状态",
          key: "status"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            // console.log('id.....',params.row.id)
            return h("div", [
              h(
                "span",
                {
                  style: {
                    cursor: "pointer",
                    color: "#03C"
                  },
                  on: {
                    click: () => {
                      this.seeOrder(
                        params.row.id,
                        params.row.payType,
                        params.row.status
                      );
                    }
                  }
                },
                "查看订单"
              )
            ]);
          }
        }
      ],
      orderData: [],
      userId: "",
      userInfoOrder: {}
    };
  },
  created() {
    console.log(this.$route.query.userId);
    this.userId = this.$route.query.userId;
    this.getUserInfo(this.userId);
  },
  methods: {
    getUserInfo(ids) {
      console.log(ids);
      users
        .usersDetail({
          id: ids
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.integrationUser(res);
          }
        })
        .catch(err => {
          this.$Message.error("用户查询失败");
        });
      // 请求订单的
      orderApi
        .getUserOrder({
          userId: ids
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.integrationOrder(res);
          }
        })
        .catch(err => {
          // this.$Message.error('服务器订单查询失败')
        });
        orderApi.getUserOrderAdd({
          userId: ids
        }).then(res => {
          if (res.code == 1) {
            console.log(res,'....')
            this.userInfoOrder = res.data ? res.data : {};
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 用户信息
    integrationUser(res) {
      if (res.data.mobileVerified) {
        res.data.mobileVerified += "";
        console.log("我是绑定德", typeof res.data.mobileVerified);
      } else {
        res.data.mobileVerified = "1";
      }
      switch (res.data.comeFrom) {
        case 1:
          res.data.comeFrom = "微信小程序";
          break;

        default:
          res.data.comeFrom = "其他";
          break;
      }
      this.userInfo = res.data;
    },
    integrationOrder(res) {
      console.log("啊啊功夫A股鹅服", res);
      let data = res.data;
      console.log(data.addressInfo);
      this.deal.statusALl = data.statusALl;
      this.deal.payAmount = data.payAmount.toFixed(2);
      this.deal.statusRight = data.statusRight;
      this.deal.refundAmout = data.refundAmout.toFixed(2);

      let result = {};
      data.orderList.forEach(element => {
        let { id, createTime, orderNo, soureType, payPrice, status } = element;
        result.id = id;
        result.createTime = goodsUtils.timeFun(
          goodsUtils.timeStamp(createTime)
        );
        result.orderNo = orderNo;
        switch (soureType) {
          case 1:
            result.soureType = "微信小程序";
            break;
          case 2:
            result.soureType = "其他 ";
            break;
        }
        result.payPrice = payPrice;
        switch (status) {
          case 0:
            result.status = "待付款";
            break;
          case 1:
            result.status = "待发货";
            break;
          case 2:
            result.status = "待收货";
            break;
          case 3:
            result.status = "已完成";
            break;
          case 4:
            result.status = "已退款";
            break;
          case 5:
            result.status = "维权中";
            break;
          case 6:
            result.status = "维权已完成";
            break;
          case 7:
            result.status = "已取消";
            break;
          case 8:
            result.status = "已关闭";
            break;
          case 9:
            result.status = "无效订单";
            break;
          case 10:
            result.status = "已删除";
            break;
        }
        this.orderData.push(result);
        result = {};
      });
      console.log(this.orderData);
    },
    seeOrder(id, payment, paymentState) {
      // console.log(index)
      this.$router.push(
        `/@/views/order/OrderInfo?orderId=${id}&payment=${payment}&paymentState=${paymentState}`
      );
    }
  }
};
</script>

<style scoped>
#user-list {
  background-color: #fff;
  /* padding: 10px; */
}
.main {
  padding: 0 10px;
}

.content-war {
  margin-bottom: 15px;
}
.receiv-info {
  padding-bottom: 20px;
}
.content-war img {
  width: 40px;
  height: 40px;
  vertical-align: top;
}
.content-war span:nth-child(1) {
  font-size: 12px;
}
.content-war .content-war-span {
  display: inline-block;
  width: 108px;
  height: 32px;
  line-height: 32px;
  text-align: right;
  margin-right: 14px;
}
.content-war p {
  margin-left: 122px;
  padding: 8px 0 0 0;
  color: #888;
}

.second-title {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  padding-left: 10px;
  background: #f1f1f1;
}

.content-box {
  font-size: 0;
}
.deal-box {
  position: relative;
  display: inline-block;
  width: 25%;
  text-align: center;
  height: 110px;
  /* background-color: #ccc; */
  border-right: 1px solid #ccc;
}
.content-box .deal-box:nth-last-child(1) {
  border: none;
}
.deal-box p:nth-child(1) {
  font-size: 16px;
  position: absolute;
  top: 25px;
  width: 100%;
}
.deal-box p:nth-child(2) {
  font-size: 24px;
  margin-top: 10px;
  position: absolute;
  top: 45px;
  width: 100%;
}
</style>
