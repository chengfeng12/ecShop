<template>
  <div class="container">
    <div class="currentTitle" v-if="role == 0">添加新店铺</div>
    <div class="currentTitle" v-if="role == 1">编辑店铺</div>
    <Card>
      <div class="tab-content">
        <div class="content-box">
          <div class="content-content">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
              <FormItem label="店铺名称" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入店铺名称" style="width: 300px;"></Input>
              </FormItem>
              <FormItem label="所属品牌" prop="brandId" style="width: 400px;">
                <Select v-model="formValidate.brandId" placeholder="请选择品牌">
                  <Option
                    v-for="(item,index) in brandListData"
                    :key="index"
                    :value="''+item.id"
                  >{{item.brandName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="店铺描述">
                <Input
                  v-model="formValidate.description"
                  placeholder="请输入店铺的描述信息"
                  style="width: 500px;"
                ></Input>
              </FormItem>
              <FormItem label="店铺类型" prop="typeId" style="width: 400px;">
                <Select v-model="formValidate.typeId" placeholder="请选择店铺类型">
                  <Option value="1">微信小程序</Option>
                </Select>
              </FormItem>
              <FormItem label="appId" prop="appId">
                <Input v-model="formValidate.appId" placeholder="请输入APPID" style="width: 300px;"></Input>
              </FormItem>
              <FormItem label="appSecret" prop="appSecret">
                <Input
                  v-model="formValidate.appSecret"
                  placeholder="请输入APPSECRET"
                  style="width: 300px;"
                ></Input>
              </FormItem>
              <FormItem label="原始ID" prop="originalId">
                <Input
                  v-model="formValidate.originalId"
                  placeholder="请输入原始ID"
                  style="width: 300px;"
                ></Input>
              </FormItem>
              <FormItem label="小程序头像">
                <div class="img-box">
                  <Button style="margin-bottom: 10px;" type="primary" @click="imgSleFun">+选择图片</Button>
                  <img-select
                    ref="imgSel"
                    class="img-select"
                    @listentoptpmfile="recommendFun"
                    :options="{typeId: 'image'}"
                  />
                </div>
                <div class="img" v-if="formValidate.appletThumb">
                  <img :src="formValidate.appletThumb">
                  <span @click="delImg"><Icon type="ios-close-circle"/></span>
                </div>
              </FormItem>
              <FormItem label="是否启用">
                <RadioGroup v-model="formValidate.status">
                  <Radio label="1">启用</Radio>
                  <Radio label="0">禁用</Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <div class="subBtn">
        <div class="btn-box">
          <Button type="primary" class="comBtn" :loading="loading" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="default" class="comBtn" @click="callBack">取消</Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import shopTwo from "@/api/request/shopTwo";
// 上传图片
import ImgSelect from "@/components/imgSelect/imgselect";
export default {
  name: "addStore",
  data() {
    return {
      loading: false,
      tab0: true,
      show: true,
      // 品牌列表数据
      brandListData: [],
      formValidate: {
        name: "",
        brandId: "1",
        description: "",
        typeId: "1",
        appId: "",
        appSecret: "",
        originalId: "",
        appletThumb: "",
        status: "1"
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "店铺名称不能为空",
            trigger: "blur"
          }
        ],
        brandId: [
          {
            required: true,
            message: "所属品牌不能为空",
            trigger: "change"
          }
        ],
        appId: [
          {
            required: true,
            message: "APPID不能为空",
            trigger: "blur"
          }
        ],
        appSecret: [
          {
            required: true,
            message: "APPSECRET不能为空",
            trigger: "blur"
          }
        ],
        originalId: [
          {
            required: true,
            message: "原始ID不能为空",
            trigger: "blur"
          }
        ],
        typeId: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "change"
          }
        ]
      },
      role: 0,
      tempId: ""
    };
  },
  created() {
    console.log(this.$route.query);
    this.role = this.$route.query.role;
    if (this.role != 0) {
      this.tempId = this.$route.query.id;
      console.log("我是编辑");
      // 调用接口
      this.getData();
    }
    // 获取品牌的接口
    this.brandListFun();
  },
  components: {
    ImgSelect
  },
  methods: {
    getData() {
      shopTwo
        .getShopAdminList({
          id: this.tempId
        })
        .then(res => {
          if (res.code == 1) {
            console.log(res);
            // 数据整合
            let data = res.data;
            this.formValidate.name = data.name + "";
            this.formValidate.brandId = data.brandId + "";
            this.formValidate.description = data.description;
            this.formValidate.typeId = data.typeId + "";
            this.formValidate.appId = data.appId + "";
            this.formValidate.appSecret = data.appSecret + "";
            this.formValidate.originalId = data.originalId + "";
            this.formValidate.appletThumb = data.appletThumb;
            this.formValidate.status = data.status + "";
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log("查询失败");
        });
    },
    //
    brandListFun() {
      shopTwo
        .brandList()
        .then(res => {
          if (res.code == 1) {
            this.brandListData = res.data;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {});
    },
    imgSleFun() {
      this.$refs.imgSel.uploadflg();
    },
    // 获取图片的
    recommendFun(data) {
      console.log(data);
      this.formValidate.appletThumb = data[0].imgAddress;
    },
    //保存
    handleSubmit(name) {
      let _this = this;
      if (this.role == 0) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.loading = true
            // 整理数据
            shopTwo.shopAdminSave(this.formValidate).then(res => {
                this.loading = false
                if (res.code == 1) {
                  this.$Message.success("保存成功");
                  this.callBack();
                } else {
                  this.$Message.error(res.message);
                }
              }).catch(err => {
                this.loading = false
                this.$Message.error("保存失败");
              });
          }
        });
      } else {
        this.$refs[name].validate(valid => {
          if (valid) {
            // 整理数据
            this.formValidate.id = this.tempId;
            console.log("我是编辑保存的", this.formValidate);
            this.loading = true
            shopTwo.shopAdminUpdate(this.formValidate).then(res => {
                this.loading = false
                if (res.code == 1) {
                  this.$Message.success("保存成功");
                  this.callBack();
                } else {
                  this.$Message.error(res.message);
                }
              }).catch(err => {
                this.loading = false
                this.$Message.error("保存失败");
              });
          }
        });
      }
    },
    delImg() {
      this.formValidate.appletThumb = "";
    },
    callBack() {
      this.$router.push(`/@/views/brand`);
    }
  }
};
</script>
<style scoped>
.container .tab {
  border: 1px solid #aeaeae;
  background: #f3f3f3;
}

.container .tab-content {
  margin: 30px 16px 50px 16px;
  background: #fff;
}

.container .imgselect-content-top {
  display: none;
}
.container .img-box {
  height: 40px;
  overflow: hidden;
}
.container .img {
  position: relative;
  display: inline-block;
  margin-top: 10px;
}
.container .img img {
  display: inline-block;
  width: 100px;
  height: 90px;
}
.container .img span {
  position: absolute;
  cursor: pointer;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  text-align: center;
  top: -10px;
  right: -10px;
  border-radius: 50%;
}
.container .img-box .img-select {
  width: 100px;
  height: 100px;
}
.container .btn-box {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.container .comBtn {
  margin: 0 10px;
  display: inline-block;
}
</style>
