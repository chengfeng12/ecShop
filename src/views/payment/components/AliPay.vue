<template>
  <div>
    <!-- Alipay模块 -->
    <FormItem label="应用ID" prop>
      <Input placeholder style="width: 300px;"></Input>
    </FormItem>
    <FormItem label="支付宝公钥" prop="aliKey">
      <Input placeholder="请输入内容" style="width: 300px;"></Input>
    </FormItem>
    <FormItem label="应用私钥" prop="applykey">
      <Input placeholder="请输入内容" style="width: 300px;"></Input>
    </FormItem>
  </div>
</template>

<script>
export default {
  name: "alipay",
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
