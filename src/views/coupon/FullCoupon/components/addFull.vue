<template>
  <div class="container">
    <div class="redu-box">
      <!-- 内容区域 -->
      <div class="redu-content">
        <!-- 内容区域内盒子 -->
        <div class="redu-inset">
          <div v-if="!tempId" class="currentTitle">满额发券/<label> 添加满额发券</label></div>
          <div v-else class="currentTitle">满额发券/<label> 编辑满额发券</label></div>
          <Card>
            <div class="redu-title">活动设置</div>
            <div class="inset-content">
              <!-- 表单区域 -->
              <Form :label-width="120" ref="reduForm" :model="reduForm" :rules="reduRule">
                <FormItem label="活动开启" prop="activitiesOpen">
                  <RadioGroup v-model="reduForm.activitiesOpen">
                      <Radio label="1">开启</Radio>
                      <Radio label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动名称" prop="activityName">
                  <Input style="width: 250px" :maxlength="12" v-model="reduForm.activityName"></Input>{{reduForm.activityName.length}}/12
                </FormItem>
                <FormItem label="满足金额" prop="meetAmount">
                  <Input v-model="reduForm.meetAmount" style="width: 150px"></Input>&nbsp;&nbsp;元
                  <span style="color: #cccccc">(即订单金额满足该金额))</span>
                </FormItem>
                <FormItem label="选择优惠" class="ivu-form-item-required">
                  <Button type="primary" class="select-discount" @click="selectDiscount">+选择优惠券</Button>
                  <addDiscount :setting="true" @listentDiscountData="listentDiscountData" :options="false" :optionsData="showData" :selectNum="selectNum" ref="discount" />
                </FormItem>
                <FormItem label="单次推券数量" prop="singleCoupon">
                  <Input style="width: 150px" v-model="reduForm.singleCoupon"></Input>&nbsp;&nbsp;张
                </FormItem>
                <FormItem label="发券库存" prop="inventory">
                  <Input style="width: 150px" v-model="reduForm.inventory"></Input>&nbsp;&nbsp;张
                  <span style="color: #cccccc">(当发券库存小于单次推券数量、或大于优惠券库存时,发送任务停止)</span>
                </FormItem>
                <FormItem label="推券节点" prop="node">
                  <RadioGroup v-model="reduForm.node">
                    <Radio label="1">订单完成后推送</Radio>
                    <Radio label="2">订单付款后推送</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="不参与发券商品" prop="couponGoods">
                  <RadioGroup v-model="reduForm.couponGoods" @on-change="couponGoodsChan">
                      <Radio label="1">无</Radio>
                      <Radio label="2">指定商品</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem v-if="reduForm.couponGoods == '2'" label="指定商品" porp="couponGoodsList">
                  <!-- {{showGoods}} -->
                    <couponAddgood class="addGoods-box" @listentgoodData="listentgoodDatafuc($event)" :options="showGoods"></couponAddgood>
                </FormItem>
                <FormItem label="活动有效期" class="ivu-form-item-required" porp="activityStatus">
                  <RadioGroup v-model="reduForm.activityStatus" @on-change="activityStatusFun">
                    <Radio label="1">开启</Radio>
                    <Radio label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动时间" 
                    :rules="[{required:(reduForm.activityStatus == 1),message: '请选择活动时间'},
                              {pattern: null, type: 'array', message: '日期'}]" 
                    prop="timeData">  
                    <!-- :disabled="fixationtimeflag" :options="optionsTime" -->
                    <DatePicker
                      type="datetimerange"
                      format="yyyy-MM-dd HH:mm"
                      placeholder="请选择日期"
                      :options="optionsTime"
                      :editable="false"
                      :disabled="reduForm.activityStatus == 2"
                      @on-change="timechange"
                      :value="reduForm.timeData"
                      style="width: 300px;"></DatePicker>
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
import couponAddgood from "@/components/couponAddgood/couponAddgood";
import marking from "@/api/request/marking"
import goodsUtils from "@/utils/goodsUtils.js"
import addDiscount from "@/components/addDiscount/addDiscount";
export default {
  name: "addFull",
  data() {
    return {
      loading: false,
      selectNum: {
        select: 1
      },
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      custonized_descs: [],
      show: false,
      flag: false,
      currentIndex: 0,
      showData: [],
      showGoods: [],
      tempId: '',
      reduForm: {
        activitiesOpen: '2',
        activityName: '',
        meetAmount: '',
        // 优惠券
        couponList: [],
        // 单次推券数量
        singleCoupon: '',
        inventory: '',
        // 推券节点
        node: '1',
        // 不参与发券商品
        couponGoods: '1',
        // 指定商品
        couponGoodsList: [],
        // 活动有效期
        activityStatus: '2',
        timeData: []
      },
      reduRule: {
        activitiesOpen: [
          {required: true, message: '活动开启不能为空', trigger: 'change'}
        ],
        activityName: [
          {required: true, message: '活动名称不能为空', trigger: 'blur'}
        ],
        meetAmount: [
          {required: true, message: '满足金额不能为空', trigger: 'blur'},
          {type: 'string', message: '请输入满足金额',  trigger: 'blur'},
          {pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,  message: '满足金额格式错误',  trigger: 'blur'}
        ],
        // 选择优惠券的没有
        singleCoupon: [
          {required: true, message: '单次推券数量不能为空', trigger: 'blur'},
          {type: 'string', message: '请输入单次推券数量',  trigger: 'blur'},
          {pattern: /^\+?[1-9][0-9]*$/,  message: '请输入大于0的整数',  trigger: 'blur'},
        ],
        inventory: [
          {required: true, message: '发券库存不能为空', trigger: 'blur'},
          {type: 'string', message: '请输入发券库存',  trigger: 'blur'},
          {pattern: /^\+?[1-9][0-9]*$/,  message: '请输入大于0的整数',  trigger: 'blur'},
        ],
        node: [
          {required: true, message: '推券节点不能为空', trigger: 'change'}
        ],
        couponGoods: [
          {required: true, message: '不参与发券商品不能为空', trigger: 'change'}
        ],
        activityStatus: [
          {required: true, message: '活动有效期不能为空', trigger: 'change'}
        ],
      }
    };
  },
  activated() {
    this.tempId = this.$route.query.id
    this.$refs['reduForm'].resetFields()
    this.init()
    if (this.tempId) {
      this.getData()
    }
  },
  components: {
    addDiscount,
    couponAddgood
  },
  methods: {
    init() {
      // this.custonized_descs = []
      // this.show = false
      // this.flag = false
      // this.currentIndex = 0
      this.showData = []
      this.showGoods = []
      this.reduForm = {
          activitiesOpen: '2',
          activityName: '',
          meetAmount: '',
          // 优惠券
          couponList: [],
          // 单次推券数量
          singleCoupon: '',
          inventory: '',
          // 推券节点
          node: '1',
          // 不参与发券商品
          couponGoods: '1',
          // 指定商品
          couponGoodsList: [],
          // 活动有效期
          activityStatus: '2',
          timeData: []
      }

      console.log(this.showGoods)
    },
    getData() {
      console.log('我是编辑的')
      marking.fullCouponDetail({
        'id': this.tempId
      }).then(res => {
          if (res.code == 1) {
            this.integrationData(res.data)
          }
      }).catch(err => {
          console.log(err)
          this.$Message.error('请求失败')
      })
    },
    integrationData(data) {
      if (data.activityStatus == 1) {
        if (data.startingTime && data.endTime) {
          data.timeData = []
          data.timeData.push(goodsUtils.timeFun(goodsUtils.timeStamp(data.startingTime)))
          data.timeData.push(goodsUtils.timeFun(goodsUtils.timeStamp(data.endTime)))
        }
      } else {
        data.timeData = []
      }
      let arr = []
      data.couponsList.forEach((element,index) => {
        let obj = {}
        obj.couponsName = element.couponName
        obj.stock = element.inventory
        obj.id = element.couponid
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
      this.reduForm.activitiesOpen = data.activitiesOpen + ''
      this.reduForm.activityName = data.activityName + ''
      this.reduForm.meetAmount = data.meetAmount + ''
      this.reduForm.couponList = arr
      console.log(arr,this.reduForm.couponList,'啊啊啊啊啊啊啊')
      // return false
      this.reduForm.singleCoupon = data.singleCoupon + ''
      this.reduForm.inventory = data.inventory + ''
      this.reduForm.node = data.node + ''
      this.reduForm.couponGoods = data.couponGoods + ''
      this.reduForm.couponGoodsList = data.couponGoodsList
     
      this.reduForm.activityStatus = data.activityStatus + ''
      this.reduForm.timeData = data.timeData
      let arrTwo = []
      data.couponsTopupGoodsList.forEach(element => {
        let obj = {}
        obj.goodsId = element.goodId,
        obj.id = element.id
        obj.specIds = element.specificationsId
        obj.publicGoodsid = element.publicGoodsid
        arrTwo.push(obj)
      });
      console.log('arrTwo',arrTwo)
      this.showGoods = arrTwo
      this.$forceUpdate()
      console.log('+++++',this.showGoods)
      // this.getSpecs()
    },
    selectDiscount() {
      this.$refs.discount.addDiscount()
    },
    listentgoodDatafuc(data) {
      console.log(data)
      let rulegoodslist = [];
      for (let item in data) {
          let obj = {};
          obj.specificationsId = data[item].hasOwnProperty('specsId') ? data[item].specsId.join(',') : ''
          obj.goodId = data[item].id,
          rulegoodslist.push(obj)
      }
      this.reduForm.couponGoodsList = rulegoodslist
    },
    couponGoodsChan(data) {
      console.log(data)
      if (data == 1) {
        this.showGoods = []
      }
    },
    listentDiscountData(data) {
      console.log('我是优惠券',data)
      // return false
      let arr = [];
      data.forEach(element => {
        let obj = {};
        obj.couponName = element.couponsName
        obj.couponid = element.id
        obj.inventory = element.stock
        obj.couponTypes = element.type
        arr.push(obj);
      });
      this.reduForm.couponList = arr;
      console.log('..?????????',this.reduForm.couponList)
    },
    activityStatusFun(data) {
      if (data == 2) {
        console.log('来了呀')
        // this.$refs['reduForm'].resetFields()
        this.reduForm.timeData = []
      } else {
        // this.$refs.reduForm.validateField('timeData')
      }
    },
    timechange(value) {
      this.reduForm.timeData = value;
    },
    save(name) {
      this.loading = true
      console.log('保存的数据',this.reduForm)
      // 验证
      if (this.reduForm.couponList.length == 0) {
        this.$Message.error('优惠券不能为空')
        this.loading = false
        return false
      }
      // 添加
      if (!this.tempId) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.reduForm.activityStatus == 1) {
              this.reduForm.timeData.forEach((element,index) => {
                this.reduForm.timeData[index] = goodsUtils.timeFun(goodsUtils.timeStamp(element))
              }); 
            }
            marking.fullCouponSave({
              'activitiesOpen': this.reduForm.activitiesOpen,
              'activityName': this.reduForm.activityName,
              'meetAmount': this.reduForm.meetAmount,
              'couponList': this.reduForm.couponList,
              'singleCoupon': this.reduForm.singleCoupon,
              'inventory': this.reduForm.inventory,
              'node': this.reduForm.node,
              'couponGoods': this.reduForm.couponGoods,
              'couponGoodsList': this.reduForm.couponGoodsList,
              'activityStatus': this.reduForm.activityStatus,
              'time': this.reduForm.timeData
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
            if (this.reduForm.activityStatus == 1) {
              this.reduForm.timeData.forEach((element,index) => {
                this.reduForm.timeData[index] = goodsUtils.timeFun(goodsUtils.timeStamp(element))
              }); 
            }
            marking.fullCouponUpdate({
              'id': this.tempId,
              'activitiesOpen': this.reduForm.activitiesOpen,
              'activityName': this.reduForm.activityName,
              'meetAmount': this.reduForm.meetAmount,
              'couponList': this.reduForm.couponList,
              'singleCoupon': this.reduForm.singleCoupon,
              'inventory': this.reduForm.inventory,
              'node': this.reduForm.node,
              'couponGoods': this.reduForm.couponGoods,
              'couponGoodsList': this.reduForm.couponGoodsList,
              'activityStatus': this.reduForm.activityStatus,
              'time': this.reduForm.timeData
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
