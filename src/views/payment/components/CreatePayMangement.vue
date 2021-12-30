<template>
  <div class="container">
    <div class="currentTitle" v-if="type === 'add'">支付管理/<label> 添加支付</label></div>
    <div class="currentTitle" v-if="type === 'edit'">支付管理/<label> 编辑支付</label></div>
    <Card>
      <div class="redu-box">
        <div class="redu-content">
          <div class="redu-inset">
            <Form
              :label-width="100"
              ref="reduForm"
              :model="reduForm"
              :rules="ruleValidate"
              enctype="multipart/form-data"
            >
              <div class="redu-title">基础设置</div>
              <div class="inset-content">
                <FormItem label="支付名称" prop="titles">
                  <Input
                    v-model="reduForm.titles"
                    placeholder="请输入支付名称"
                    :maxlength="12"
                    style="width: 350px;"
                  ></Input>
                </FormItem>
                <FormItem label="支付方式">
                  <RadioGroup v-model="reduForm.mode">
                    <Radio :label="1">微信支付</Radio>
                    <Radio :label="2" disabled>支付宝支付</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="支付类型">
                  <RadioGroup v-model="reduForm.type">
                    <Radio :label="0">微信支付</Radio>
                    <Radio :label="1" disabled>微信支付子商户</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="服务商公众号(APPID)" v-if="reduForm.type == '1'">
                  <Input v-model="reduForm.appids" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="服务商支付商户号(Mch_Id)" v-if="reduForm.type == '1'">
                  <Input v-model="reduForm.mchids" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="公众号(APPID)" prop="appid">
                  <Input v-model="reduForm.appid" style="width:300px;" v-bind:disabled="reduForm.id !=0" ></Input>
                </FormItem>
                <FormItem label="支付商户号(Mch_Id)" prop="mchid">
                  <Input v-model="reduForm.mchid" style="width:300px;" v-bind:disabled="reduForm.id !=0"></Input>
                </FormItem>
                <FormItem label="支付密钥(APIKEY)" prop="apikey">
                  <Input v-model="reduForm.apikey" style="width:300px;" v-bind:disabled="reduForm.id !=0"></Input>
                  <div class="fonts">(服务商的 APIKEY,并不是子商户的APIKEY)</div>
                </FormItem>
                <FormItem label="CERT证书文件">
                  <Input style="width: 300px" type="textarea" :rows="4" v-model="reduForm.bookfile"></Input>
                  <!-- <div class="fonts">下载证书 cert.zip 中的 apiclient_cert.pem 文件</div> -->
                </FormItem>
                <FormItem label="KEY密钥文件">
                  <Input style="width: 300px" type="textarea" :rows="4" v-model="reduForm.keyfile"></Input>
                  <!-- <div class="fonts">下载证书 cert.zip 中的 apiclient_key.pem 文件</div> -->
                </FormItem>
                <FormItem label="支付状态" prop="status">
                  <RadioGroup v-model="reduForm.status">
                    <Radio :label="1">启用</Radio>
                    <Radio :label="0" disabled>禁用</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Card>
    <!--保存 取消 -->
    <div class="formBtn">
      <Button type="primary" class="comBtn" :loading="loading" @click.native="save(reduForm)">保存</Button>
      <Button type="default" class="comBtn" @click="prev()">返回列表</Button>
    </div>
  </div>
</template>

<script>
import order from "@/api/request/order";
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils";
export default {
  name: "CreatePayMangement",
  data() {
    return {
      loading: false,
      reduForm: {
        id: "", //id
        titles: "", //支付名称
        mode: "", //支付方式
        type: "", //支付类型
        appids: "", //服务商公众号
        appid: "", //公众号(APPID)
        mchids: "", //服务商支付商户号(Mch_Id)
        mchid: "", //支付商户号(Mch_Id)
        apikey: "", //支付密钥(APIKEY)
        bookfile: "", //CERT证书文件
        keyfile: "", //KEY密钥文件
        status: 1 //支付状态
      },
      ruleValidate: {
        titles: [
          {
            required: true,
            message: "请输入支付名称",
            trigger: "blur"
          }
        ],
        mode: [
          {
            required: false,
            message: "请选择支付方式",
            trigger: "blur"
          }
        ],
        appid: [
          {
            required: true,
            message: "请填写公众号信息",
            trigger: "blur"
          }
        ],
        mchid: [
          {
            required: true,
            message: "请填写商户号",
            trigger: "blur"
          }
        ],
        apikey: [
          {
            required: true,
            message: "请填写支付密钥",
            trigger: "blur"
          }
        ],
        bookfile: [
          {
            required: true,
            message: "请选择商户证书",
            trigger: "blur"
          }
        ],
        keyfile: [
          {
            required: true,
            message: "请选择商户Key证书",
            trigger: "blur"
          }
        ],
        mchids: [
          {
            required: true,
            message: "请填写子商户号",
            trigger: "blur"
          }
        ],
        appids: [
          {
            required: true,
            message: "请填写服务商公众号",
            trigger: "blur"
          }
        ],
        aliKey: [
          {
            required: true,
            message: "请填写公钥",
            trigger: "blur"
          }
        ],
        applykey: [
          {
            required: true,
            message: "请填写私钥",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: false,
            message: "请选择支付类型",
            trigger: "blur"
          }
        ]
      },
      type: "add"
    };
  },

  mounted() {
    this.type = this.$route.query.title;
    if (this.type == "edit") {
      this.id = this.$route.query.id;
      this.init();
    }
  },
  activated() {
    this.restore();
    this.type = this.$route.query.title;
    if (this.type == "edit") {
      this.id = this.$route.query.id;
      this.init();
    }
  },
  methods: {
    //清空数据
    restore() {
      this.reduForm = {
        id: "", //id
        titles: "", //支付名称
        mode: 1, //支付方式
        type: 0, //支付类型
        appids: "", //服务商公众号
        appid: "", //公众号(APPID)
        mchids: "", //服务商支付商户号(Mch_Id)
        mchid: "", //支付商户号(Mch_Id)
        apikey: "", //支付密钥(APIKEY)
        bookfile: "", //CERT证书文件
        keyfile: "", //KEY密钥文件
        status: 1 //支付状态
      };
    },

    // 初始化
    init: function() {
      //  if(this.$route.query.title == "edit"){
           
      //  }
      this.editGroup(this.id);
    },

    // 编辑接收参数
    editGroup() {
      console.log(this.$route.query.id);
      order
        .tradeSelectById({
          id: this.$route.query.id
        })
        .then(res => {
          console.log(res.data, "444");
          if (res.code == 1) {
            (this.reduForm.titles = res.data.title), //支付名称
              (this.reduForm.mode = res.data.payType), //支付方式
              (this.reduForm.type = res.data.type), //支付类型
              (this.reduForm.appids = res.data.subAppid), //服务商公众号
              (this.reduForm.appid = res.data.appid), //公众号
              (this.reduForm.mchids = res.data.subMchId), //服务商支付商户号
              (this.reduForm.mchid = res.data.mchId), //支付商户号
              (this.reduForm.apikey = res.data.key), //支付密钥
              (this.reduForm.keyfile = res.data.keyCert), //KEY密钥文件
              (this.reduForm.bookfile = res.data.cert); //CERT证书文件
            this.reduForm.status = res.data.status; //支付状态
            this.reduForm.id = res.data.id;
            console.log(this.reduForm.mchids, "555");
          } else {
            // $Message.error(res.message)
          }
        })
        .catch(err => {
          // this.$Message.error('删除失败')
        });
    },

    //修改数据接口
    editFull(params) {
      console.log(this.reduForm);
      order
        .tradeUpdate({
          title: this.reduForm.titles, // 支付名称
          payType: this.reduForm.mode, // 支付方式
          type: this.reduForm.type, // 支付类型
          subAppid: this.reduForm.appids, //服务商公众号
          appid: this.reduForm.appid, // 公众号
          subMchId: this.reduForm.mchids, // 服务商支付商户号
          mchId: this.reduForm.mchid, //支付商户号
          key: this.reduForm.apikey, //支付密钥
          keyCert: this.reduForm.keyfile, //KEY密钥文件
          cert: this.reduForm.bookfile, //CERT证书文件
          status: this.reduForm.status, //支付状态
          id: this.reduForm.id
        })
        .then(res => {
           this.loading = false
          if (res.code == 1) {
            this.$Message.success("修改成功");
            this.backList();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
           this.loading = false
        });
    },

    //添加支付接口
    addFull(params) {
      order
        .tradeSave({
          title: this.reduForm.titles, // 支付名称
          payType: this.reduForm.mode, // 支付方式
          type: this.reduForm.type, // 支付类型
          subAppid: this.reduForm.appids, //服务商公众号
          appid: this.reduForm.appid, // 公众号
          subMchId: this.reduForm.mchids, // 服务商支付商户号
          mchId: this.reduForm.mchid, //支付商户号
          key: this.reduForm.apikey, //支付密钥
          keyCert: this.reduForm.keyfile, //KEY密钥文件
          cert: this.reduForm.bookfile, //CERT证书文件
          status: this.reduForm.status //支付状态
        })
        .then(res => {
          this.loading = false
          if (res.code == 1) {
            this.$Message.success("保存成功");
            this.backList();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false
          // this.$Message.error("保存失败")
        });
    },

    //添加保存
    save(reduForm) {
      console.log(reduForm);
      this.$refs.reduForm.validate(valid => {
        if (valid) {
          console.log(reduForm);
          console.log(this.$route.query.title);
          this.loading = true
          if (this.$route.query.title == "edit") {
            // 判断当前是 修改还是新增
            this.editFull(); // 修改
          } else {
            this.addFull(); // 新增
          }
          //
          //
        } else {
          this.$Message.error("保存失败");
        }
      });
    },
    //保存跳转
    backList() {
      this.$router.push("/@/views/payment/PayManagement");
    },
    //回退
    prev() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.container .ivu-form .ivu-form-item-label {
  width: 250px;
}

.container {
  position: relative;
}

.container .redu-box {
  margin: -16px;
}

.container .redu-bread {
  line-height: 30px;
  height: 30px;
}

.container .redu-content {
  padding: 16px;
}

.container .redu-inset {
  background: #fff;
}

.container .star {
  color: red;
  padding: 5px;
  font-size: 20px;
  margin-right: 10px;
}

.container .redu-title {
  height: 30px;
  line-height: 30px;
  color: #000;
  padding-left: 15px;
  background-color: #f2f2f2;
}

.container .inset-content {
  padding: 40px 0 30px 50px;

  background: #fff;
}

.container .high-opation {
  padding: 10px;
  cursor: pointer;
}

.container .set {
  width: 600px;
  padding: 20px 20px 20px 10px;
  border: 1px dashed #aeaeae;
  background: #f2f2f2;
}

.container .formBtn {
  width: 250px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}

.container .comBtn {
  margin: 0 5px;
}

.container .mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

.container .time-set {
  width: 700px;
  height: 300px;
  border: 1px solid #aeaeae;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -300px;
}

.container .set-title {
  padding: 8px;
  font-size: 14px;
  background: #2688fb;
  color: #fff;
}

.container .close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px 10px;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.container .choose-week {
  border-bottom: 1px solid #aeaeae;
  padding: 30px 0 0 0;
}

.container .week-btn {
  width: 70px;
  margin-right: 10px;
}

.bgColor {
  background: #2688fb;
  color: #fff;
}

.container .fonts {
  color: #c0c0c0;
}
.container .shangchuan {
  position: absolute;
  left: 330px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
}
.currentTitle label{
  font-size: 14px;
  color: #000;
}
</style>


