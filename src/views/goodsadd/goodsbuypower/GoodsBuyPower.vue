<template>
  <div class="goods-buy-power">
    <div class="goods-spec-info">
      <h3 class="title">购买权限</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">单次最多购买</span>
          <Input v-model="buyPower.numMax" placeholder="单次最多购买" style="width: 260px"/>&nbsp;件
          <p>用户单次购买此商品数量限制,0或为空则没有限制</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">单次最低购买</span>
          <Input v-model="buyPower.numMin" placeholder="单次最低购买" style="width: 260px"/>&nbsp;件
          <p>用户单次必须最少购买此商品数量限制，0或为空则没有限制</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">最多购买</span>
          <Input
          
            v-model="buyPower.mostPurchases"
            placeholder="最多购买"
            style="width: 260px"
          />&nbsp;件
          <p>用户购买过的此商品数量限制，0或为空则没有限制</p>
        </div>
      </div>
    </div>

    <div class="goods-spec-info">
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">会员等级浏览权限</span>
          <i-select v-model="buyPower.jurisdictionMemberBrowse" style="width:200px">
            <i-option
              v-for="(item,index) in buyPower.vipBorwse"
              :value="item.value"
              :key="index"
            >{{ item.label }}</i-option>
          </i-select>
          <p>不设置默认全部会员等级</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">会员等级购买权限</span>
          <i-select v-model="buyPower.jurisdictionMemberPurchase" style="width:200px">
            <i-option
              v-for="(item,index) in buyPower.vipBuy"
              :value="item.value"
              :key="index"
            >{{ item.label }}</i-option>
          </i-select>
          <p>不设置默认全部会员等级</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">标签组浏览权限</span>
          <i-select v-model="buyPower.jurisdictionLabsBrowse" style="width:200px">
            <i-option
              v-for="(item,index) in buyPower.labelBorwse"
              :value="item.value"
              :key="index"
            >{{ item.label }}</i-option>
          </i-select>
          <p>不设置默认全部标签等级</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">会员标签组购买权限</span>
          <i-select v-model="buyPower.jurisdictionLabsPurchase" style="width:200px">
            <i-option
              v-for="(item,index) in buyPower.vipLabelBuy"
              :value="item.value"
              :key="index"
            >{{ item.label }}</i-option>
          </i-select>
          <p>不设置默认全部会员等级</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["buyPower"],
  data() {
    return {};
  }
};
</script>

<style scoped>
@import "../../../assets/style/goodsAdd.css";
.goods-buy-power {
  padding-bottom: 60px;
}
</style>
