<template>
  <div class="container">
    <div class="redu-box">
      <div class="redu-content">
        <div class="redu-inset">
          <div v-if="!tempId" class="currentTitle">手工发券/<label> 添加新发券</label></div>
          <div v-else class="currentTitle">手工发券/<label> 编辑发券</label></div>
          <Card>
            <div class="redu-title">活动设置</div>
            <div class="inset-content">
              <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduRule">
                <FormItem label="活动名称" prop="activityName">
                  <Input v-model="reduForm.activityName" :maxlength="12" style="width: 300px" />{{reduForm.activityName.length}}/12
                </FormItem>
                <FormItem label="选择优惠券" class="ivu-form-item-required">
                  <Button type="primary" class="select-discount" @click="selectDiscount">+选择优惠券</Button>
                  <addDiscount :setting="true" @listentDiscountData="listentDiscountData" :options="false" :optionsData="showData" :selectNum="selectNum" ref="discount" />
                </FormItem>
                <FormItem label="每人推券数量" prop="stampsNumber" class="ivu-form-item-required">
                  <Input v-model="reduForm.stampsNumber" style="width: 150px" />&nbsp;&nbsp;张&nbsp;&nbsp;<span style="color: #aaa">（此处受总数限制，如果剩余张数不足以发放给选定会员数量，则无法发放）</span>
                </FormItem>
                <FormItem label="参与范围" class="ivu-form-item-required" prop="sendObject">
                  <!-- <Radio label="3">仅注册会员</Radio>
                        <Radio label="4">会员等级</Radio> -->
                    <RadioGroup v-model="reduForm.sendObject" @on-change="userFun">
                        <Radio label="1">全部用户</Radio>
                        <Radio label="2">指定用户</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-if="reduForm.sendObject == 2">
                  <Button type="primary" class="comBtn" style="position:relative;">
                    +上传用户
                    <input ref="file" type="file" @change="fileChange"
                    style="opacity:0;width:100%;height:100%;position:absolute;top:0;left:0;"
                    >
                    </Button><a v-if="reduForm.path != ''" :href="reduForm.path" style="color: #0083b0;text-decoration: underline;padding: 5px;">{{linkName}}</a>
                    <span style="color: #aaa">（批量上传CSV文件通过用户ID给指定用户发券）</span>
                    <a href="https://hrecminiprogramstorage.blob.core.chinacloudapi.cn/test-mini/file/01d4098ef6129b8a2d63c9863c9793f9.csv">下载模板</a>
                </FormItem>
                <!-- <FormItem v-if="reduForm.sendObject == 4" class="select-discount ivu-form-item-required" label="会员等级">
                  <Select v-model="reduForm.grouping" style="width:260px">
                    <Option v-for="(item,index) in vipList" :value="item.id" :key="index">{{ item.title }}</Option>
                  </Select>
                </FormItem> -->
                <FormItem label="发券节点" prop="message">
                  <RadioGroup v-model="reduForm.message">
                    <!-- <Radio label="1">订单完成后推送</Radio>
                    <Radio label="2">订单付款后推送</Radio> -->
                    <Radio label="3">立即推送</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动有效期" prop="activityOpen">
                  <RadioGroup v-model="reduForm.activityOpen" @on-change="activityOpenFun">
                    <Radio label="1">立即开启</Radio>
                    <Radio label="2">指定时间</Radio>
                    <Radio label="3">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem v-if="reduForm.activityOpen == 2" label="推送时间" 
                    :rules="[{required:(reduForm.activityOpen == 2),message: '请选择推送时间'},
                    {pattern: null, type: 'string', message: '日期'}]" 
                    prop="time">
                    <DatePicker
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="请选择日期"
                      :options="optionsTime"
                      :editable="false"
                      :disabled="reduForm.activitiesValidity == 2"
                      @on-change="timechange"
                      :value="reduForm.time"
                      style="width: 350px"></DatePicker>
                </FormItem>
              </Form>
            </div>
            <div class="formBtn">
              <Button type="primary" class="comBtn" :loading="loading" @click.native="save('reduForm')">保存</Button>
              <Button type="default" class="comBtn" @click="callBack">返回列表</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store"
import api from '@/api/request'
import marking from "@/api/request/marking"
import goods from "@/api/request/goods"
import goodsUtils from "@/utils/goodsUtils.js"
import addDiscount from "@/components/addDiscount/addDiscount";
export default {
  name: "addFull",
  data() {
    // const validateName = (rule, value, callback) => {
    //     for (let i = 0; i < value.length; i++) {
    //         let charCode = value.charCodeAt(i)
    //         if (charCode >= 0 && charCode <= 128) {
    //             this.subTitleCount++
    //         } else {
    //             this.subTitleCount+=2
    //         }
    //         if (this.subTitleCount < 24) {
    //           console.log('短的',this.subTitleCount)
    //           callback()
    //         } else {
    //           console.log('长的',this.subTitleCount)
    //           callback(new Error('活动名称过长'));
    //           this.subTitleCount = this.subTitleCount
    //         }
    //     }
    // };
    return {
      loading: false,
      // subTitleCount: 0,
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      selectNum: {
        select: 1 
      },
      res: "+选择商品",
      linkName: '',
      showData: [],
      showGoods: [],
      tempId: '',
      vipList: [],
      // 会员等级列表
      reduForm: {
        path: '',
        activityName: '',
        stampsNumber: '',
        // 指定对象
        sendObject: '1',
        message: '3',
        
        activityOpen: '1',
        time: '',

        // 上传用户
        userOpen: [],
        // 优惠券
        RuleList: []
      },
      reduRule: {
        activityName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur'},
        ],
        stampsNumber: [
          {required: true, message: '单次推券数量不能为空', trigger: 'blur'},
          {type: 'string', message: '请输入单次推券数量',  trigger: 'blur'},
          {pattern: /^[1-9][0-9]*$/,  message: '请输入大于0的整数',  trigger: 'blur'},
        ],
        sendObject: [
          {required: true, message: '发券库存不能为空', trigger: 'change'},
        ],
        message: [
          {required: true, message: '推送消息不能为空', trigger: 'change'}
        ],
        activityOpen: [
          {required: true, message: '活动开启不能为空', trigger: 'change'}
        ]
      }
    };
  },
  activated() {
    this.tempId = this.$route.query.id
    this.$refs['reduForm'].resetFields()
    // this.role = this.$route.query.role
    console.log(this.tempId,'ninininninnnnnini')
    this.init()
    if (this.tempId) {
      this.getData()
    }
  },
  components: {
    addDiscount
  },
  methods: {
    init() {
      this.showData = []
      this.showGoods = []
      this.vipList = []
      this.linkName = ''
      // 会员等级列表
      this.reduForm = {
        path: '',
        activityName: '',
        stampsNumber: '',
        // 指定对象
        sendObject: '1',
        message: '3',
        
        activityOpen: '1',
        time: '',

        // 上传用户
        userOpen: [],
        // 优惠券
        RuleList: []
      }
    },
    getData() {
      console.log('我是编辑的')
      marking.manualVouchersDetail({
        'id': this.tempId
      }).then(res => {
          if (res.code == 1) {
            console.log('手工发券',res)
            this.integrationData(res.data)
          } else {
            this.$Message.error(res.message)
          }
      }).catch(err => {
          console.log(err)
          this.$Message.error('请求失败')
      })
    },
    integrationData(data) {
      this.reduForm.activityName = data.activityName
      this.reduForm.stampsNumber = data.stampsNumber + ''
      this.reduForm.sendObject = data.sendObject + ''
      this.reduForm.message = data.message + ''
      this.reduForm.activityOpen = data.activityOpen + ''
      if (data.sendObject == 2) {
        this.reduForm.path = data.path + ''
        if (data.path != '') {
          let obj = data.path.lastIndexOf("/");
          let noticeUrl = data.path.substr(obj + 1)
          this.linkName = noticeUrl
        }
      }
      if (this.reduForm.activityOpen == 2) {
        this.reduForm.time = data.time ? goodsUtils.timeTwoFun(goodsUtils.timeStamp(data.time)) : ''
      } else {
        this.reduForm.time = ''
      }
      let arr = []
      data.newRuleList.forEach((element,index) => {
        let obj = {}
        obj.couponsName = element.couponName
        obj.stock = element.inventory
        obj.id = element.couponid
        console.log('hahahha......',element.couponTypes)
        obj.type = element.couponTypes 
        arr.push(obj)
      });
      marking.AllcouponDetail({
        'id': arr[0].id
      }).then(res => {
        if (res.code == 1) {
          arr[0].couponsName = res.data[0].couponsName
          arr[0].stock = res.data[0].stock
          this.showData = arr
          console.log('最后的值',arr)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectDiscount() {
      this.$refs.discount.addDiscount()
    },
    userFun(data) {
      if (this.reduForm.sendObject != 2) {
        this.reduForm.path = ''
      }
    },
    /**
    * 上传文件
    */
    fileChange(e) {
      let _this = this;
      let file = e.target.files[0];
      if(file.type != 'application/vnd.ms-excel'){
        this.$Message.error('请上传csv格式的文件')
        return false
      }
      let userInfo = this.$store.getters.user
      userInfo = JSON.parse(userInfo)

      _this.loading = true;

      let formData = new FormData();
      formData.append("file", file);
      formData.append("id", "test-mini");
      formData.append("type", 1);
      formData.append("uid",userInfo.id)
      formData.append("fileType",'file')
      formData.append("token",store.getters.token)
      formData.append("tenantId",store.getters.tenantId)

      api.uploadFile("POST", formData).then(res => {
        _this.loading = false;
        console.log(res)
        if (res.code == 1) {
          _this.reduForm.path = res.data.imgAddress
          _this.linkName = res.data.name
          _this.$Message.success('上传成功')
        } else {
          _this.$Message.error(res.message);
        }
      });
    },
    // 数据
    listentgoodData(data) {
      console.log("jaefhjaihfiahfei ", data);
      data.forEach((element,index) => {
        let obj = {}
        obj.goodId = element.id
        console.log(element.id)
        this.reduForm.couponsGoodsList.push(obj)
      });
      // console.log(this.reduForm.couponsGoodsList,'你你你')
    },
    listentDiscountData(data) {
      console.log('我是优惠券',data)
      let arr = [];
      data.forEach(element => {
        let obj = {};
        obj.couponName = element.couponsName
        obj.couponid = element.id
        obj.inventory = element.stock
        obj.couponTypes = element.type
        console.log(element.type,'你你你妮妮')
        arr.push(obj);
      });
      this.reduForm.RuleList = arr;
      console.log('..?????????',this.reduForm.RuleList)
    },
    activityOpenFun(data) {
      if (data != 2) {
        this.reduForm.time = ''
      }
    },
    timechange(value) {
      this.reduForm.time = value;
    },
    ruleFun() {
      // 参与范围判断
      console.log('哈哈哈',this.reduForm.scopeId,this.reduForm.classification)
      // 判断优惠券
      if (this.reduForm.sendObject == 2) {
          if (!this.reduForm.path) {
            this.$Message.error('指定用户不能为空')
            return false
          }
      }
      if (this.reduForm.RuleList.length == 0) {
        this.$Message.error('优惠券不能为空')
        return false
      }
      return true
    },
    save(name) {
      
      console.log('保存的数据',this.reduForm)
      // return false
      let result = this.ruleFun()
      if (!result) {
        this.loading = false
        return false
      }
      this.loading = true
      // console.log('时间',this.reduForm.time)
      // return false
      // 添加
      if (!this.tempId) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.reduForm.activityOpen == 2) {
              this.reduForm.time = goodsUtils.timeTwoFun(goodsUtils.timeStamp(this.reduForm.time))
            }
            marking.manualVouchersAdd({
              // 少数据
              'activityName': this.reduForm.activityName,
              'stampsNumber': this.reduForm.stampsNumber,
              'sendObject': this.reduForm.sendObject,
              'message': this.reduForm.message,
              'activityOpen': this.reduForm.activityOpen,
              'time': this.reduForm.time,
              'userOpen': this.reduForm.userOpen,
              'RuleList': this.reduForm.RuleList,
              'path': this.reduForm.path
            }).then(res => {
              if (res.code == 1) {
                this.loading = false
                this.$Message.success('保存成功')
                this.callBack()
              } else {
                this.loading = false
                this.$Message.error(res.message)
              }
            }).catch(err => {
              this.loading = false
              this.$Message.error('保存失败')
            })
          } else {
            this.loading = false
          }
        }); 
      } else {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.reduForm.activityOpen == 2) {
              this.reduForm.time = goodsUtils.timeTwoFun(goodsUtils.timeStamp(this.reduForm.time))
            }
            marking.manualVouchersUp({
              'id': this.tempId,
              'activityName': this.reduForm.activityName,
              'stampsNumber': this.reduForm.stampsNumber,
              'sendObject': this.reduForm.sendObject,
              'message': this.reduForm.message,
              'activityOpen': this.reduForm.activityOpen,
              'time': this.reduForm.time,
              'userOpen': this.reduForm.userOpen,
              'RuleList': this.reduForm.RuleList,
              'path': this.reduForm.path
            }).then(res => {
              if (res.code == 1) {
                this.loading = false
                this.$Message.success('保存成功')
                this.callBack()
              } else {
                this.loading = false
                this.$Message.error(res.message)
              }
            }).catch(err => {
              this.loading = false
              this.$Message.error('保存失败')
            })
          } else {
            this.loading = false
          }
        }); 
      }
    },
    callBack() {
      this.$router.go(-1)
    }
  }
};
</script>
<style scoped>
@import url('./index.css');
</style>
