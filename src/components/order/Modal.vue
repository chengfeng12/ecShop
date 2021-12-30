<template>
  <div>
    <Modal
      v-model="modal"
      :title="title"
      @on-ok="ok"
      :scrollable="false"
      @on-cancel="cancel"
      width="600px"
    >
      <div class="con-box">
        <div class="con-items">
          <span class="first-span">收货人：</span>
          <span>{{address}},{{userName}},{{telNumber}}</span>
        </div>
        <div class="con-items">
          <span class="first-span">快递公司</span>
          <Select v-model="expressCompany" style="width:200px">
            <Option
              v-for="item in expressList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="con-items">
          <span class="first-span">快递单号</span>
          <Input v-model="telNumber" placeholder="Enter something..." style="width: 250px"/>
        </div>
        <div class="con-items">
          <span class="first-span">发货类型</span>
          <RadioGroup v-model="deliverGoodsType">
            <Radio label="0">按订单发货</Radio>
            <Radio label="1">商品分包裹发货</Radio>
          </RadioGroup>
        </div>
        <div v-if="deliverGoodsType === '1'" class="con-items">
          <span class="first-span feliver-goods">发货商品</span>
          <CheckboxGroup v-model="selectGoods" class="goods-list">
            <ul v-for="(item,index) in goodsList" :key="index">
              <Checkbox :label="item.label">
                <li>
                  <img :src="item.imgUrl" alt="goods">
                  <p>{{item.goodsName}}</p>
                </li>
              </Checkbox>
            </ul>
          </CheckboxGroup>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    modalBool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: this.modalBool,
      title: "订单发货",
      // 收货人信息
      address: "上海上号放的附近阿尔法嫁接法染发",
      userName: "小芳",
      telNumber: "15638111023",
      // 快递公司
      expressCompany: "sf",
      expressList: [
        {
          value: "sf",
          label: "顺丰快递"
        },
        {
          value: "zt",
          label: "中通"
        }
      ],
      // 快递单号
      expressNumber: "1563347875454587",
      // 发货类型
      deliverGoodsType: "0",
      // 选择商品数据列表
      goodsList: [
        {
          label: "1",
          imgUrl: require("@/assets/logo.png"),
          goodsName: "我是一件商品我又自己的规格"
        },
        {
          label: "2",
          imgUrl: require("@/assets/logo.png"),
          goodsName: "我是一件商品我又自己的规格"
        },
        {
          label: "3",
          imgUrl: require("@/assets/logo.png"),
          goodsName: "我是一件商品我又自己的规格"
        },
        {
          label: "4",
          imgUrl: require("@/assets/logo.png"),
          goodsName: "我是一件商品我又自己的规格"
        }
      ],
      selectGoods: []
    };
  },
  methods: {
    ok() {
      this.$emit("modalBoolFun", this.modal, this.$data);
    },
    cancel() {
      this.$emit("modalBoolFun", this.modal);
    }
  }
};
</script>

<style scoped>
.con-box {
  padding: 10px 15px;
}
.con-items {
  margin: 10px 0;
  font-size: 13px;
}
.con-items .first-span {
  display: inline-block;
  width: 60px;
  text-align: right;
  margin-right: 10px;
}
.feliver-goods {
  vertical-align: top;
  margin-top: 10px;
}
.goods-list {
  display: inline-block;
}
.goods-list li,
.goods-list p {
  display: inline-block;
  margin-left: 5px;
}
.goods-list img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.goods-list p {
  height: 40px;
  line-height: 40px;
}
</style>
