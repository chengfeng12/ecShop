<template>
  <div class="marketing-setup">
    <div class="goods-spec-info">
      <h3 class="title">促销方式</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">促销标题</span>
          <Input
            v-model="setup.promotionTitle"
            placeholder="单次最多购买"
            :maxlength="5"
            style="width: 260px"
          />
          <p>可以输入5个字，不输入默认为“促销”</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">上架时间</span>
          <Date-picker
            :editable="false"
            :options="optionsTime"
            type="datetimerange"
            placeholder="选择日期和时间"
            style="width: 300px"
            format="yyyy-MM-dd HH:mm"
            v-model="setup.promotionTime"
          ></Date-picker>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">会员促销价格</span>
          <Input
            v-model="setup.promotionMoney"
            placeholder="会员促销价格单位：元"
            style="width: 260px"
          />
        </div>
      </div>
    </div>

    <div class="goods-spec-info">
      <h3 class="title">满返设置</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">积分赠送</span>
          <Input
            type="number"
            v-model="setup.presentIntegral"
            placeholder="单次最多购买"
            style="width: 260px"
          />&nbsp;分
          <p>会员购物赠送的积分，如果不填写或者填0，则默认为不赠送积分，如果带%则为按成交价格的比例计算积分</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">余额返现</span>
          <Input
            type="number"
            v-model="setup.returnMoney"
            placeholder="单次最低购买"
            style="width: 260px"
          />&nbsp;元
          <p>会员购物返现，如果不填写或者填0，则默认为不返现，如果带%则为按成交价格的比例计算返现</p>
        </div>
      </div>
    </div>

    <div class="goods-spec-info">
      <h3 class="title">重复购买</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">重复购买折扣</span>
          <Input v-model="setup.discount" :maxlength="1" placeholder="重复购买折扣" style="width: 260px"/>&nbsp;折
          <p>重复购买此商品的折扣</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">持续使用</span>
          <RadioGroup v-model="setup.isSustainedUse">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
          <p>购买一次后以后都使用这个折扣价</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">使用条件</span>
          <RadioGroup v-model="setup.serviceConditions">
            <Radio label="1">订单付款后</Radio>
            <Radio label="0">订单完成后</Radio>
          </RadioGroup>
          <p>重复购买使用条件,是付款后还是完成后 , 默认是付款后</p>
        </div>
      </div>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">与其他优惠共享</span>
          <RadioGroup v-model="setup.isShare">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
          <p>重复购买时,是否与其他优惠共享!其他优惠享受后,在使用这个折扣</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["setup"],
  data() {
    return {
      optionsTime: {
          disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000;
          }
      }
    };
  }
};
</script>

<style scoped>
@import "../../../assets/style/goodsAdd.css";
</style>
