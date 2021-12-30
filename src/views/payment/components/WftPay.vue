<template>
  <div>
    <!-- wft模块 -->
    <FormItem label="商户号" prop>
      <Input placeholder style="width: 300px;"></Input>
    </FormItem>
    <FormItem label="appid" prop="appId">
      <Input placeholder style="width: 300px;"></Input>
    </FormItem>
    <FormItem label="支付密钥" prop="paymentKey">
      <Input placeholder style="width: 300px;"></Input>
    </FormItem>
    <FormItem label="支付渠道" prop="payqudao">
      <RadioGroup>
        <Radio label="仅支持微信支付"></Radio>
        <Radio label="仅支持支付宝支付"></Radio>
        <Radio label="支持微信支付和支付宝支付"></Radio>
      </RadioGroup>
    </FormItem>
  </div>
</template>

<script>
export default {
  name: "wftPay",
  data() {
    return {
      formValidate: {
        title: "",
        appId: "",
        merchantId: "",
        paymentKey: "",
        merchantCertificate: "",
        certificateKey: "",
        childmerchant: ""
      }
    };
  }
};
</script>
<style>
</style>
