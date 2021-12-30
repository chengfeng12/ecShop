<template>
  <div id="addCard">
    <imgSelect ref="imgselect" :options="imgOptions" v-on:listentoptpmfile="changeImg"></imgSelect>
    <div class="currentTitle" v-if="role == 1">定制卡片/添加卡片</div>
    <div class="currentTitle" v-if="role == 2">定制卡片/编辑卡片</div>
    <Card style="height:500px">
      <div class="box">
        <div class="border" style="width:300px;height:300px">
          <img style="width:100%; height:100%" :src="formInline.img" alt />
        </div>
        <div class="form">
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem label="选择卡片图片" prop="img" :label-width="150">
              <Input v-model="formInline.img" placeholder disabled style="width: 430px;" />
              <Button type="primary" @click="openImg">+添加图片</Button>
            </FormItem>
            <FormItem label="卡片类型" prop="type" :label-width="150">
              <RadioGroup v-model="formInline.type">
                <Radio label="1">
                  <span>手写卡片</span>
                </Radio>
                <Radio label="2">
                  <span>用户输入卡片</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="卡片提示语" :label-width="150" v-if="formInline.type == 2">
              <Input v-model="formInline.notice" placeholder style="width: 430px;" :maxlength="20" />
            </FormItem>
          </Form>
        </div>
      </div>
    </Card>
    <div class="savebtn">
      <Button type="primary" size="large" class="btnStyle" :loading="loading" @click="save">保存</Button>
      <Button type="default" size="large" class="btnStyle" @click="back">返回</Button>
    </div>
  </div>
</template>
<script>
import imgSelect from "@/components/imgSelect/imgSelect";
import shop from "@/api/request/shop";
import goodsUtils from "@/utils/goodsUtils";
import operation from "@/api/request/operation";
export default {
  data() {
    return {
      loading:false,
      id: 0,
      role: 0,
      imgOptions: {
        type: "image",
        mode: "diy"
      },
      formInline: {
        img: "",
        type: "1",
        notice: ""
      },

      ruleInline: {
        img: [
          {
            required: true,
            message: "请选择卡片图片",
            trigger: "blur"
          },
          {
            type: "string",
            min: 1,
            message: "请选择卡片图片",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    imgSelect
  },
  activated() {
    this.init();
  },
  methods: {
    //返回
    back() {
      this.$router.go(-1);
    },
    init() {
      let _this = this;
      let id = this.$route.query.id;
      let role = this.$route.query.role;
      this.id = id;
      this.role = role;
      if (role == 2) {
        this.edit();
      }
    },
    //编辑
    edit() {
    
      operation
        .getDetailCard({
          id: this.id
        })
        .then(res => {
          let formInline = {
            title: res.data.name,
            img: res.data.img,
            code: res.data.code,
            type: res.data.type + ""
          };

          if (res.data.type == 2) {
            formInline = {
              ...formInline,
              notice: res.data.notice
            };
          }

          this.formInline = formInline;
        });
    },
    //打开图片
    openImg() {
      this.$refs.imgselect.uploadflg();
    },
    //监听图片点击事件
    changeImg(img) {
      this.formInline.img = img[0].imgAddress;
    },
    save() {
      let _this = this;
      // 修改
      this.$refs.formInline.validate(valid => {
        if (valid) {
          let rawData;
          if (_this.formInline.type == 1) {
            rawData = {
              img: _this.formInline.img,
              type: _this.formInline.type
            };
          } else {
            rawData = {
              img: _this.formInline.img,
              type: _this.formInline.type,
              notice: _this.formInline.notice
            };
          }
          if (_this.role == 1) {
            this.loading=true;
            operation
              .getSaveCard({
                ...rawData
              })
              .then(res => {
                console.log(res);
                if (res.code == "1") {
                  this.loading=false;
                  this.$Message.success("保存成功");
                  this.back();
                } else {
                   this.loading=false;
                  this.$Message.error(res.message);
                }
              })
              .catch(err => {
                 this.loading=false;
                this.$Message.error("请求失败");
              });
          } else {
            this.loading=true;
            operation
              .getUpdateCard({
                ...rawData,
                id: this.id
              })
              .then(res => {
                console.log(res);
                if (res.code == "1") {
                  this.loading=false;
                  this.$Message.success("保存成功");
                  this.back();
                } else {
                  this.loading=false;
                  this.$Message.error(res.message);
                }
              })
              .catch(err => {
                this.loading=false;
                this.$Message.error("请求失败");
              });
          }
        }
      });
    },
    fetchData(){
      this.formInline.img="",
      this.formInline.type="1",
      this.formInline.notice=""
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style lang="less" scoped>
.box {
  .border {
    float: left;
    border: 1px solid #aeaeae;
    box-sizing: border-box;
    margin-left: 10px;
  }
  .form {
    float: left;
    margin-left: 150px;
  }
}
.savebtn {
  text-align: center;
  padding: 10px 0;
}

.card_tit {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
}

.border {
  border: 1px solid #aeaeae;
  box-sizing: border-box;
}

.card-t {
  font-size: 15px;
  margin-left: 35px;
  margin-top: 30px;
}
</style>
