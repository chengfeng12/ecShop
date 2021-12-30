<template>
  <div>
    <!-- 公众账号 -->
    <FormItem label="公众账号appid" prop="appId">
      <Input v-model="formValidate.appId" placeholder style="width: 300px;"></Input>
    </FormItem>
    <!-- 商户号 -->
    <FormItem label="商户号" prop="merchantId">
      <Input v-model="formValidate.merchantId" placeholder style="width: 300px;"></Input>
    </FormItem>
    <!-- 支付密钥 -->
    <FormItem label="支付密钥" prop="paymentKey">
      <Input v-model="formValidate.paymentKey" placeholder style="width: 300px;"></Input>
    </FormItem>
    <!-- 商户证书 -->
    <FormItem label="商户证书" prop="merchantCertificate">
      <Input v-model="formValidate.merchantCertificate" placeholder="请选择文件" style="width: 300px;"></Input>
      <Upload action="//jsonplaceholder.typicode.com/posts/" class="upLoad">
        <Button class="upLoadBtn">选择文件</Button>
      </Upload>
    </FormItem>
    <!-- 商户key证书 -->
    <FormItem label="商户Key证书" prop="certificateKey">
      <Input v-model="formValidate.certificateKey" placeholder="请选择文件" style="width: 300px;"></Input>
      <Upload action="//jsonplaceholder.typicode.com/posts/" class="upLoad" show-upload-list>
        <Button class="upLoadBtn">选择文件</Button>
      </Upload>
    </FormItem>
  </div>
</template>

<script>
export default {
  name: "normalMerchant",
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
<style scoped>
.pay-content .upLoad {
  position: absolute;
  top: 0;
  left: 300px;
}

.pay-content .upLoadBtn {
  background: #f5f6fa;
}
</style>
