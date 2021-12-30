<template>
  <div class="member-discount">
    <h3 class="title">会员折扣</h3>
    <div class="content-war">
      <span class="content-war-span">会员折扣</span>
      <Input type="number" v-model="discount.memberDiscount" style="width: 120px"/>&nbsp;折或者
      <Input type="number" v-model="discount.memberDiscountMoney" style="width: 120px"/>&nbsp;元
      <p>只有当折扣大于0，小于10的情况下才能生效，否则按自身会员等级折扣计算</p>
      <p>如果折扣为空或者0，则不设置折扣, 折扣和固定金额都有,则优先使用折扣</p>
      <p>如果会员价为空或者0，则不设置会员价</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["discount"],
  data() {
    return {};
  }
};
</script>

<style scoped>
@import "../../../assets/style/goodsAdd.css";
</style>
