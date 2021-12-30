<template>
  <div class="addBox">
    <imgSelect ref="imgselect" :options="imgOptions" v-on:listentoptpmfile="changeImg"></imgSelect>
    <div class="currentTitle" v-if="role == 1">包装盒/添加包装盒</div>
    <div class="currentTitle" v-if="role == 2">包装盒/编辑包装盒</div>
    <Card style="height:500px">
      <div class="box">
        <div class="border" style="width:300px;height:300px">
          <img style="width:100%;height:100%;" :src="formInline.img" alt />
        </div>
        <div class="form">
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem label="包装盒名称" prop="title" :label-width="150">
              <Input v-model="formInline.title" placeholder style="width: 430px;" :maxlength="20" />
            </FormItem>
            <FormItem label="选择包装盒图片" prop :label-width="150">
              <Input v-model="formInline.img" placeholder disabled style="width: 430px;" />
              <Button type="primary" @click="openImg">+添加图片</Button>
            </FormItem>
            <FormItem label="包装盒编号" prop="title" :label-width="150">
              <Input v-model="formInline.code" placeholder style="width: 430px;" :maxlength="20" />
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
import operation from "@/api/request/operation";
export default {
  data() {
    return {
      loading:false,
      type: 1,
      imgOptions: {
        type: "image",
        mode: "diy"
      },
      formInline: {
        title: "",
        img: "",
        code: ""
      },
      ruleInline: {
        title: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          },
          {
            type: "string",
            min: 1,
            message: "请输入商品名称",
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
    edit() {
      operation
        .getPackageDetail({
          type: 2,
          id: this.id
        })
        .then(res => {
          console.log(res);
          let formInline = {
            title: res.data.name,
            img: res.data.img,
            code: res.data.code
          };

          this.formInline = formInline;
        });
    },
    // 打开图片
    openImg() {
      this.$refs.imgselect.uploadflg();
    },
    // 监听图片选择的事件
    changeImg(img) {
      console.log(img);
      this.formInline.img = img[0].imgAddress;
    },
    save() {
      let _this = this;

      this.$refs.formInline.validate(valid => {
        if (valid) {
          // 修改
          if (_this.role == 1) {
            this.loading=true;
            operation
              .getPackageSave({
                type: 2,
                img: _this.formInline.img,
                code: _this.formInline.code,
                name: _this.formInline.title
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
              .getPackageUpdate({
                type: 2,
                img: _this.formInline.img,
                code: _this.formInline.code,
                name: _this.formInline.title,
                id: _this.id
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
      this.formInline.title="",
      this.formInline.img="",
      this.formInline.code=""     
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
</style>

