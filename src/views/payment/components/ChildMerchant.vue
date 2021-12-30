<template>
  <div>
    <!-- 子商户appId 模块-->
    <FormItem label="子商户appId" prop="childmerchant">
      <Input v-model="formValidate.childmerchant" placeholder="子商户appId" style="width: 300px;"></Input>
    </FormItem>
  </div>
</template>

<script>
export default {
  name: "childMerchant",
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
