<template>
  <div class="container">
    <div class="redu-box">
      <div class="redu-content">
        <div class="redu-inset">
          <div v-if="!tempId" class="currentTitle">购物发券/<label> 添加购物发券</label></div>
          <div v-else class="currentTitle">购物发券/<label> 编辑购物发券</label></div>
          <Card>
            <div class="redu-title">活动设置</div>
            <div class="inset-content">
              <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduRule">
                <FormItem label="活动开启" prop="activitiesOpen">
                  <RadioGroup v-model="reduForm.activitiesOpen">
                      <Radio label="1">开启</Radio>
                      <Radio label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="参与范围" class="ivu-form-item-required" prop="scopeId">
                    <RadioGroup v-model="reduForm.scopeId" @on-change="rangeFun">
                        <Radio label="1">全部商品</Radio>
                        <Radio label="2">指定商品</Radio>
                        <Radio label="3">商品分类</Radio>
                        <Radio label="4">商品分组</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-if="reduForm.scopeId == 2" class="select-discount ivu-form-item-required" label="选择商品">
                  <!-- ref="clearGoods" -->
                  <addGood :styleData="true" @listentgoodData="listentgoodData" :selectGoods="showGoods" :res="res"/>
                </FormItem>
                <FormItem v-if="reduForm.scopeId == 3" class="select-discount ivu-form-item-required" label="选择商品分类">
                  <div style="width: 500px">
                    <treeselect
                      size="small"
                      v-model="reduForm.classification" 
                      :searchable="false"
                      :multiple="true"
                      noOptionsText="暂无分类"
                      placeholder="选择商品分类"
                      @deselect="delOption"
                      @input="selectClass"
                      :options="optionsDataList" ></treeselect>
                  </div>
                </FormItem>
                <FormItem v-if="reduForm.scopeId == 4" class="select-discount ivu-form-item-required" label="选择商品分组">
                  <Select v-model="reduForm.grouping" style="width:260px">
                    <Option v-for="(item,index) in groupList" :value="item.id" :key="index">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="参与条件" prop="singleBuy" class="ivu-form-item-required">
                      <Radio v-model="radioOne" @on-change="radioOneFun">
                         单品单次购买满&nbsp;&nbsp;<Input v-model="reduForm.singleBuy" :disabled="radioTwo" style="width: 150px" />&nbsp;&nbsp;件
                      </Radio>
                </FormItem>
                 <FormItem prop="cumulativeBuy">
                      <Radio v-model="radioTwo" @on-change="radioTwoFun">
                        单品累计购买满&nbsp;&nbsp;<Input v-model="reduForm.cumulativeBuy" :disabled="radioOne" style="width: 150px" />&nbsp;&nbsp;件
                      </Radio>
                </FormItem>
                <FormItem label="选择优惠券" class="ivu-form-item-required">
                  <Button type="primary" class="select-discount" @click="selectDiscount">+选择优惠券</Button>
                  <addDiscount :setting="true" @listentDiscountData="listentDiscountData" :options="false" :optionsData="showData" :selectNum="selectNum" ref="discount" />
                </FormItem>
                <div class="issuing-voucher-one">
                  <FormItem label="单次推券数量" prop="singleNumber">
                    <Input v-model="reduForm.singleNumber" style="width: 150px" />&nbsp;&nbsp;张
                  </FormItem>
                </div>
                <div class="issuing-voucher-two">
                  <FormItem label="累计最多推送" prop="cumulativeNumber">
                    <Input v-model="reduForm.cumulativeNumber" style="width: 150px" />&nbsp;&nbsp;<span style="color: #ccc;">（0或为空则无数量限制）</span>
                  </FormItem>
                </div>
                <FormItem label="发券库存" prop="repertory">
                  <Input v-model="reduForm.repertory" style="width: 150px" />&nbsp;&nbsp;张&nbsp;&nbsp;<span style="color: #ccc;">（当发券库存小于单次推券数量、或大于优惠券库存时,发送任务停止）</span>
                </FormItem>
                <FormItem label="推券节点" prop="pushId">
                  <RadioGroup v-model="reduForm.pushId">
                    <Radio label="1">订单完成后推送</Radio>
                    <Radio label="2">订单付款后推送</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动有效期" prop="activitiesValidity">
                  <RadioGroup v-model="reduForm.activitiesValidity" @on-change="activeTime">
                    <Radio label="1">开启</Radio>
                    <Radio label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动时间" 
                    :rules="[{required:(reduForm.activitiesValidity == 1),message: '请选择活动时间'},
                              {pattern: null, type: 'array', message: '日期'}]" 
                    prop="time">  
                    <DatePicker
                      type="datetimerange"
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
import addGood from "@/components/addGood/goodsSelect";
import marking from "@/api/request/marking"
import goods from "@/api/request/goods"
import goodsUtils from "@/utils/goodsUtils.js"
import addDiscount from "@/components/addDiscount/addDiscount";
// 引入分类
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
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
      res: "+选择商品",
      custonized_descs: [],
      show: false,
      flag: false,
      currentIndex: 0,
      showData: [],
      showGoods: [],
      tempId: '',
      radioOne: true,
      radioTwo: false,
      groupList: [],
      optionsDataList: [],
      reduForm: {
        activitiesOpen: '1',
        scopeId: '1',
        // 商品
        couponsGoodsList: [],
        classification: [],
        // 分组
        grouping: '',
        singleBuy: '',
        cumulativeBuy: '',
        conponlist: [],
        singleNumber: '',
        cumulativeNumber: '',
        repertory: '',
        pushId: '1',
        activitiesValidity: '1',
        time: []
      },
      posiInt: /^\+?[1-9][0-9]*$/,
      reduRule: {
        activitiesOpen: [
          {required: true, message: '活动开启不能为空', trigger: 'change'}
        ],
        singleNumber: [
          {required: true, message: '单次推券数量不能为空', trigger: 'blur'},
          {type: 'string', message: '请输入单次推券数量',  trigger: 'blur'},
          {pattern: /^\+?[1-9][0-9]*$/,  message: '请输入大于0的整数',  trigger: 'blur'},
        ],
        repertory: [
          {required: true, message: '发券库存不能为空', trigger: 'blur'},
          {type: 'string', message: '请输入发券库存',  trigger: 'blur'},
          {pattern: /^\+?[1-9][0-9]*$/,  message: '请输入大于0的整数',  trigger: 'blur'},
        ],
        pushId: [
          {required: true, message: '推券节点不能为空', trigger: 'change'}
        ],
        activitiesValidity: [
          {required: true, message: '活动有效期不能为空', trigger: 'change'}
        ]
      }
    };
  },
  activated() {
    this.tempId = this.$route.query.id
    this.$refs['reduForm'].resetFields()
    // this.role = this.$route.query.role
    this.init()
    if (this.tempId) {
      this.getData()
    }
    // 调用分类
    this.oneClassFun()
    // 分组的
    this.groupListFun()
  },
  components: {
    addDiscount,
    addGood,
    Treeselect
  },
  methods: {
    init() {
      this.showData = []
      this.radioOne = true
      this.radioTwo = false
      this.reduForm = {
        activitiesOpen: '1',
        scopeId: '1',
        // 商品
        couponsGoodsList: [],
        classification: [],
        // 分组
        grouping: '',
        singleBuy: '',
        cumulativeBuy: '',
        conponlist: [],
        singleNumber: '',
        cumulativeNumber: '',
        repertory: '',
        pushId: '1',
        activitiesValidity: '1',
        time: []
      }
    },
    oneClassFun() {
      goods.goodsClassAll({}).then(res => {
        console.log('fenle ide ............................',res)
          if(res.code == '1') {
              this.optionsDataList = goodsUtils.classFun(res.data)
              // this.reduForm.classification[0] = this.optionsDataList[0].id + ''
          }
      }).catch(err => {
          console.log('分类查询失败')
      })
    },
    groupListFun() {
      goods.queryGroupList({}).then(res => {
        console.log('启用的分组............................',res)
          if(res.code == '1') {
              this.groupList = res.data
              // this.classification = this.optionsData[0].id + ''
          }
      }).catch(err => {
          console.log('分组查询失败')
      })
    },
    getData() {
      console.log('我是编辑的')
      marking.shoppingVouchersDetail({
        'id': this.tempId
      }).then(res => {
          if (res.code == 1) {
            console.log('购物发券',res)
            this.integrationData(res.data)
          }
      }).catch(err => {
          console.log(err)
          this.$Message.error('请求失败')
      })
    },
    integrationData(data) {
      this.reduForm.activitiesOpen = data.activitiesOpen + ''
      this.reduForm.scopeId = data.scopeId + ''
      // 商品的
      if (data.scopeId == 2) {
        this.getGoodsData()
      }
      // 分类
      if (data.scopeId == 3) {
        if (data.classification == undefined) {
          this.reduForm.classification = []
        } else if (data.classification == '') {
            this.reduForm.classification = []
        } else {
            let con = data.classification.split(',')
            this.reduForm.classification = con
        }
      }
      // 分组
      if (data.scopeId == 4) {
        this.reduForm.grouping = data.grouping * 1
      }
      if (data.singleBuy) {
        this.radioOne = true
        console.log('我是有值的',data.singleBuy)
        this.reduForm.singleBuy = data.singleBuy + ''
      } else {
        this.radioOne = false
      }
      if (data.cumulativeBuy) {
        this.radioTwo = true
        this.reduForm.cumulativeBuy = data.cumulativeBuy + ''
      } else {
        this.radioTwo = false
      }
      if (!data.singleBuy && !data.cumulativeBuy) {
        this.radioOne = true
        this.radioTwo = false
      }
      // 优惠券
      this.reduForm.conponlist = data.conponlist
      this.reduForm.singleNumber = data.singleNumber + ''
      this.reduForm.cumulativeNumber = data.cumulativeNumber + ''
      this.reduForm.repertory = data.repertory + ''
      this.reduForm.pushId = data.pushId + ''
      this.reduForm.activitiesValidity = data.activitiesValidity + ''
      if (data.activitiesValidity == 1) {
        if (data.startingTime && data.endTime) {
          data.time = []
          data.time.push(goodsUtils.timeFun(goodsUtils.timeStamp(data.startingTime)))
          data.time.push(goodsUtils.timeFun(goodsUtils.timeStamp(data.endTime)))
        }
      } else {
        data.time = []
      }
      this.reduForm.time = data.time
      let arr = []
      data.couponShopList.forEach((element,index) => {
        let obj = {}
        // obj.couponsName = element.couponName
        // obj.stock = element.inventory
        obj.id = element.couponid
        obj.type = element.couponTypes
        arr.push(obj)
      });
      console.log('我是编辑的...........',arr)
      marking.AllcouponDetail({
        'id': arr[0].id
      }).then(res => {
        if (res.code == 1) {
          console.log('我是返回的哈哈哈',res)
          arr[0].couponsName = res.data[0].couponsName
          arr[0].stock = res.data[0].stock
          this.showData = arr
          console.log('最后的值',arr)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getGoodsData() {
      marking.shoppingVouchersDetailId({
        'id': this.tempId
      }).then(res => {
        if (res.code == 1) {
          this.getGoodsInfo(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getGoodsInfo(data) {
      let arr = []
      data.forEach((element,index) => {
          arr.push(element.goodId)
      });
      let idList = arr.splice(',')
      idList = idList.join(',')
      console.log('我是调用',idList)
      goods.selGoodsIds({
        'ids': idList
      }).then(res => {
        if (res.code == 1) {
          let list = []
          let goodsListArr =[]
          console.log(res,"数据饿12322222")
          for( let i in res.data){
            let obj = {}
            let goodsListObj = {}
            obj.id = res.data[i].id
            goodsListObj.goodId = res.data[i].id
            obj.thumb = res.data[i].thumb
            obj.price = res.data[i].price
            obj.title = res.data[i].title
            obj.vituralStock = res.data[i].vituralStock
            obj.goodsName = res.data[i].title
            obj.pic = res.data[i].thumb
            list.push(obj)
            goodsListArr.push(goodsListObj)       
          }
          this.showGoods = list
          this.reduForm.couponsGoodsList = goodsListArr
          // this.$refs.addGiftRed.calcHasData(this.reduForm.couponsGoodsList)
          // this.$forceUpdate();
          console.log('保存数据111',this.reduForm.couponsGoodsList)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    radioOneFun(value) {
      this.radioOne = true
      this.radioTwo= false
      this.reduForm.cumulativeBuy = ''
    },
    radioTwoFun(value) {
      this.radioTwo = true
      this.radioOne= false
      this.reduForm.singleBuy = ''
    },
    selectDiscount() {
      this.$refs.discount.addDiscount()
    },
    // 数据
    listentgoodData(data) {
      console.log("jaefhjaihfiahfei ", data);
      let arr = []
      data.forEach((element,index) => {
        if (element.id) {
          let obj = {}
          obj.goodId = element.id
          console.log(element.id)
          arr.push(obj)
        }
      });
      this.reduForm.couponsGoodsList = arr
    },
    delOption(value,index){
      let _this = this
      console.log(value,index)
      // console.log(_this.info.categoryId)
      _this.reduForm.classification ? _this.reduForm.classification.map((v,i) => {
          if(value.id == v){
              _this.reduForm.classification.splice(i,1)
          }
      }) : []
    },
    selectClass(value) {
      console.log('value',value)
      // let res = value.filter((v,i)=>{
      //     console.log('vvvvvvvvvv',(v))
      //     return v != value[i+1] + ''
      // })
      // this.reduForm.classification = res
      // console.log('zuihou de',this.reduForm.classification)
    },
    rangeFun(data) {
      if (data != 1) {
        this.reduForm.couponsGoodsList = []
        this.showGoods = []
        this.reduForm.classification = []
        this.reduForm.grouping = ''
      } else {
        this.reduForm.singleBuy = ''
        this.radioOne = true
        this.radioTwo = false
        this.reduForm.cumulativeBuy = ''
      }
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
        arr.push(obj);
      });
      this.reduForm.conponlist = arr;
      console.log('..?????????',this.reduForm.conponlist)
    },
    activeTime(data) {
        console.log(data)
      if (data == 2) {
        this.reduForm.time = []
      }
    },
    timechange(value) {
      this.reduForm.time = value;
    },
    ruleFun() {
      let key = true
      // 参与范围判断
      console.log('哈哈哈',this.reduForm.scopeId,this.reduForm.classification)
      if (this.reduForm.scopeId == 2) {
        if (this.reduForm.couponsGoodsList.length == 0) {
          this.$Message.error('指定商品不能为空')
          key = false
          return key
        }
      } else if (this.reduForm.scopeId == 3) {
        if (this.reduForm.classification.length == 0) {
          this.$Message.error('商品分类不能为空')
          key = false
          return key 
        }
      } else if (this.reduForm.scopeId == 4) {
        if (!this.reduForm.grouping) {
          this.$Message.error('商品分组不能为空')
          key = false
          return key
        }
      }
      // 判断参与条件
      if (this.radioOne) {
        if (this.reduForm.singleBuy == '') {
          this.$Message.error('单品单次购买不能为空')
          key = false
          return key
        } else {
          if (!this.posiInt.test(this.reduForm.singleBuy)) {
            this.$Message.error('单品单次购买格式不正确')
            key = false
            return key
          }
        }
      }
      if (this.radioTwo) {
        if (this.reduForm.cumulativeBuy == '') {
          this.$Message.error('单品累计购买不能为空')
          key = false
          return key
        } else {
          if (!this.posiInt.test(this.reduForm.cumulativeBuy)) {
            this.$Message.error('单品累计购买格式不正确')
            key = false
            return key
          }
        }
      }
      // 判断优惠券
      if (this.reduForm.conponlist.length == 0) {
          this.$Message.error('优惠券不能为空')
          key = false
          return key
      }
      return true
    },
    save(name) {
      console.log('保存的数据',this.reduForm)
      // return false
      let result = this.ruleFun()
      console.log(result,'>?????')
      if (!result) {
        this.loading = false
        console.log('我能进来???',result)
        return false
      }
       console.log(result,'>?????')
      // 添加
      this.loading = true
      if (!this.tempId) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.reduForm.activitiesValidity == 1) {
              this.reduForm.time.forEach((element,index) => {
                this.reduForm.time[index] = goodsUtils.timeFun(goodsUtils.timeStamp(element))
              }); 
            }
            marking.shoppingVouchersSave({
              'activitiesOpen': this.reduForm.activitiesOpen,
              'scopeId': this.reduForm.scopeId,
              'couponsGoodsList': this.reduForm.couponsGoodsList,
              'classification': this.reduForm.classification,
              'grouping': this.reduForm.grouping,
              'singleBuy': this.reduForm.singleBuy ? this.reduForm.singleBuy : 0,
              'cumulativeBuy': this.reduForm.cumulativeBuy ? this.reduForm.cumulativeBuy : 0,
              'conponlist': this.reduForm.conponlist,
              'singleNumber': this.reduForm.singleNumber,
              'cumulativeNumber': this.reduForm.cumulativeNumber,
              'repertory': this.reduForm.repertory,
              'pushId': this.reduForm.pushId,
              'activitiesValidity': this.reduForm.activitiesValidity,
              'time': this.reduForm.time
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
            if (this.reduForm.activitiesValidity == 1) {
              this.reduForm.time.forEach((element,index) => {
                this.reduForm.time[index] = goodsUtils.timeFun(goodsUtils.timeStamp(element))
              }); 
            }
            marking.shoppingVouchersUp({
              'id': this.tempId,
              'activitiesOpen': this.reduForm.activitiesOpen,
              'scopeId': this.reduForm.scopeId,
              'couponsGoodsList': this.reduForm.couponsGoodsList,
              'classification': this.reduForm.classification,
              'grouping': this.reduForm.grouping,
              'singleBuy': this.reduForm.singleBuy ? this.reduForm.singleBuy : 0,
              'cumulativeBuy': this.reduForm.cumulativeBuy ? this.reduForm.cumulativeBuy : 0,
              'conponlist': this.reduForm.conponlist,
              'singleNumber': this.reduForm.singleNumber,
              'cumulativeNumber': this.reduForm.cumulativeNumber ? this.reduForm.cumulativeNumber : 0,
              'repertory': this.reduForm.repertory,
              'pushId': this.reduForm.pushId,
              'activitiesValidity': this.reduForm.activitiesValidity,
              'time': this.reduForm.time
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
