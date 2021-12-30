<template>
  <div class="container">
    <div class="redu-box">
      <!-- 内容区域 -->
      <div class="">
        <!-- 内容区域内盒子 -->
        <div class="redu-inset">
          <!-- 内容标题 -->
          <div class="currentTitle">限时折扣/<label> 创建限时折扣</label></div>
          <Card>
            <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduRule"
              style="border: 1px solid #dcdcdc;">
              <div class="redu-title">
                活动设置
              </div>
              <div class="inset-content">
                <FormItem label="活动名称" prop="titles">
                  <Input v-model="reduForm.titles" placeholder='请输入活动名称' :maxlength="20" style="width: 350px;"></Input>
                  <span class="limitLength">{{lenght}}/20</span>
                </FormItem>
                <FormItem label="活动时间" prop="time">
                  <DatePicker type="datetimerange" :editable="false" v-model="reduForm.time" :options="optionsTime"
                    @on-change='changeTime' format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期" style="width: 350px">
                  </DatePicker>
                  <span class="high-opation" @click="handleShowClick">高级选项</span>
                </FormItem>
                <FormItem label="活动渠道" prop="smallProgram">
                  <Select style="width:300px" v-model="reduForm.smallProgram = '微信小程序'">
                    <Option value="微信小程序">微信小程序</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="redu-title">
                规则设置
              </div>
              <div class="inset-content">
                <FormItem label="活动对象" prop="activityObject">
                  <RadioGroup v-model="reduForm.activityObject">
                    <Radio label="1">全部用户</Radio>
                    <Radio label="2">仅注册会员</Radio>
                    <!-- <Radio label="3">会员等级</Radio> -->
                  </RadioGroup>
                </FormItem>
                <FormItem label="会员等级" v-if="reduForm.activityObject==='3'" prop="member">

                  <Select style="width:300px" placeholder="请选择会员等级">
                    <Option value="" v-for="item in reduForm.grade" :key="item.value">{{item.label }}></Option>
                  </Select>
                </FormItem>
                <FormItem label="活动商品" prop="goodsMode">
                  <RadioGroup v-model="reduForm.goodsMode">
                    <Radio label="1">全部商品</Radio>
                    <Radio label="2">指定商品</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动商品" prop="goodlists" v-if="reduForm.goodsMode === '2'">
                  <coupon-addgood @listentgoodData="listentgoodDatafuc($event)" :options="showData"></coupon-addgood>
                </FormItem>
                <FormItem label="优惠类型" prop="type">

                  <RadioGroup v-model="reduForm.type" @on-change="chenge">
                    <Radio label="1">消费金额</Radio>
                    <Radio label="2">购买件数</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="优惠设置" v-if="reduForm.type == '1'">
                  <div class="set" v-for="(item,index) in cusAry" :key="index">
                    优惠{{index +1 }} <span class="star">*</span>
                    消费满&nbsp;&nbsp;<Input @blur.native.capture="testCusAry(index)" v-model="item.consumptionAmount"
                      style="width: 100px;" type="number"></Input> 元 &nbsp;&nbsp;
                    折扣&nbsp;&nbsp;<Input @blur.native.capture="testPrice(index)" v-model="item.discountAmount"
                      style="width: 100px;" type="number"></Input> 折
                    <div v-if="index > 0" @click="deleteCusAry(index)" class="delete"><i
                        class="ivu-icon ivu-icon-ios-close-circle"></i></div>
                  </div>
                </FormItem>
                <FormItem label="优惠设置" v-if="reduForm.type == '2'">
                  <div class="set" v-for="(item,index) in cusAry2" :key="index">
                    优惠{{index +1 }} <span class="star">*</span>
                    消费满&nbsp;&nbsp;<Input @blur.native.capture="testCusAry2(index)" v-model="item.consumptionAmount"
                      style="width: 100px;" type="number"></Input> 件 &nbsp;&nbsp;
                    折扣&nbsp;&nbsp;<Input @blur.native.capture="testPrice2(index)" v-model="item.discountAmount"
                      style="width: 100px;" type="number"></Input> 折
                    <div v-if="index > 0" @click="deleteCusAry2(index)" class="delete"><i
                        class="ivu-icon ivu-icon-ios-close-circle"></i></div>
                  </div>
                </FormItem>
                <FormItem v-if="reduForm.type == '1'">
                  <Button type="default" @click="addCustomizeDesc()">+添加优惠</Button>
                </FormItem>
                <FormItem v-if="reduForm.type == '2'">
                  <Button type="default" @click="addCustomizeDescs()">+添加优惠</Button>
                </FormItem>
              </div>
            </Form>
          </Card>
        </div>
        <!--保存 取消 -->
        <div class="formBtn">
          <Button type="primary" class="comBtn" :loading="loading" @click.native="save('reduForm')">保存</Button>
          <Button type="default" class="comBtn" @click="prev()">取消</Button>
        </div>
      </div>
    </div>
    <!-- 高级设置 -->
    <div class="mask" v-if="show">
      <div class="time-set">
        <div class="set-title">
          周期时段设置
          <span class="close" @click="handleCloseClick">X</span>
        </div>
        <div class="choose-week">
          <Form :label-width="100">
            <FormItem label="活动周期">
              <span class="star">*</span>
              <Button class="week-btn" v-for="(item,index) in reduForm.weekdays" :disabled="item.disable" :key="index"
                :class="{bgColor:item.flag}" @click="handleClick(item,index)">
                {{item.week}}
                <Icon type="ios-checkmark" size=20></Icon>
              </Button>
            </FormItem>
            <FormItem label="活动时段">
              <span class="star">*</span>
              <TimePicker confirm format="HH:mm:ss" v-model="reduForm.startEnd" type="timerange" placement="bottom-end"
                placeholder="请选择时间段" style="width: 168px"></TimePicker>
            </FormItem>
          </Form>
        </div>
        <div class="formBtn">
          <Button type="primary" class="comBtn" @click="handleSureClick">确认</Button>
          <Button type="default" class="comBtn" @click="handleCloseClick">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/request'
  import utils from '@/utils/goodsUtils'
  import marking from '@/api/request/marking'
  import couponAddgood from "@/components/couponAddgood/couponAddgood";

  export default {
    name: 'createReduction',
    components: {
      couponAddgood
    },
    data() {
      return {
        loading:false,
        dateIntArr: [],
        showData: [],
        lenght: 0,
        mLength: 40,
        weekdayList: [],
        optionsTime: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        // 商品添加要接受的值
        selectgoods: [],
        cusAry: [{
          consumptionAmount: '',
          discountAmount: ''
        }],
        cusAry2: [{
          consumptionAmount: '',
          discountAmount: ''
        }],
        model1: '',
        show: false,
        currentIndex: 0,
        //暂存ID
        tempId: '',
        // 临时数组
        suzu: [],
        rulegoodslist: [],
        smallProgram: [{
            value: '1',
            label: '微信小程序'
        }],
        reduForm: {
          smallProgram:'1',
          //活动名称
          startEnd: [],
          titles: '',
          //活动对象
          activityObject: '1',
          //活动商品
          goodsMode: '1',
          //优惠类型
          type: '1',
          goodlists: [],
          //商品ID
          goodsid: '',
          //商品规格ID
          specIds: '',
          //时间
          time: [],
          //活动周期
          weekdays: [{
            week: '周一',
            flag: false,
            id: 1,
            disable: true
          }, {
            week: '周二',
            flag: false,
            id: 2,
            disable: true
          }, {
            week: '周三',
            flag: false,
            id: 3,
            disable: true
          }, {
            week: '周四',
            flag: false,
            id: 4,
            disable: true
          }, {
            week: '周五',
            flag: false,
            id: 5,
            disable: true
          }, {
            week: '周六',
            flag: false,
            id: 6,
            disable: true
          }, {
            week: '周日',
            flag: false,
            id: 0,
            disable: true
          }],

          // 会员等级
          grade: [{
              value: '1',
              label: '1'
            },
            {
              value: '2',
              label: '2'
            },
          ],
        },
        reduRule: {
          // 对于单个字段来说，通常需要多个验证规则，这些规则以数组展示
          titles: [{
            required: true,
            message: '活动名称不能为空',
            trigger: 'blur'
          }],
          time: [{
              required: true,
              message: '活动时间不能为空'
            },
            {
              pattern: null,
              type: 'array',
              trigger: 'change'
            }
          ],
          smallProgram: [{
            required: true,
            message: '活动渠道不能为空',
            trigger: 'blur',
            type: 'string',
          }],
          activityObject: [{
            required: true,
            message: '活动对象不能为空',
            trigger: 'blur',
            type: 'string',
          }],
          goodsMode: [{
            required: true,
            message: '活动商品不能为空',
            trigger: 'blur',
            type: 'string',
          }],
          type: [{
            required: true,
            message: '活动名称不能为空',
            trigger: 'blur',
            type: 'string',
          }],
          fullyuan: [{
            required: true,
            message: '活动优惠不能为空',
            trigger: 'blur',
            type: 'string',
          }],
          goodlists: [{
            required: true,
            message: '请选择商品'
          }]
        }
      }
    },
    methods: {
      changeTime(e) {
        // 判断当前时间处理
        if (new Date(e[0]).getTime() < new Date().getTime()) {
          e[0] = new Date(new Date().getTime() + 300 * 1000).getTime()
          e[0] = utils.timeFun(e[0])
        }
        this.reduForm.time = e
        var day1 = new Date(e[0]);
        var day2 = new Date(e[1]);
        var dateIntArr = []
        var dateArr = this.getDateArr(e[0].split(' ')[0], e[1].split(' ')[0])
        for (var i in dateArr) {
          if (i < 7) {
            dateIntArr.push(new Date(dateArr[i]).getDay())
          } else {
            continue
          }
        }
        this.dateIntArr = dateIntArr
        this.weekdayList = []
        this.reduForm.startEnd = []
        if ((day2 - day1) / (1000 * 60 * 60 * 24) >= 6) {
          //大于6天所有可点
          for (var j in this.reduForm.weekdays) {
            this.reduForm.weekdays[j].disable = false
          }
        } else {
          this.checkWeekdays(dateIntArr)
        }
      },
      //接收商品数据
      listentgoodDatafuc: function (data) {
        this.rulegoodslist = [];
        for (let item in data) {
          let obj = {};
          obj.specIds = data[item].hasOwnProperty('specsId') ? data[item].specsId.join(',') : ''
          obj.goodsId = data[item].id
          this.rulegoodslist.push(obj)
        }

        this.reduForm.goodlists = this.rulegoodslist

        this.$forceUpdate()

        if (!data) {
          return false
        }

        this.$refs.reduForm.validateField('goodlists')
      },
      checkWeekdays(date) {
        for (var m in this.reduForm.weekdays) {
          this.reduForm.weekdays[m].disable = true
          this.reduForm.weekdays[m].flag = false
        }
        for (var i in date) {
          for (var j in this.reduForm.weekdays) {
            if (date[i] == this.reduForm.weekdays[j].id) {
              this.reduForm.weekdays[j].disable = false
            }
          }
        }
      },
      getDateArr(start, end) {
        var arr = []
        var start_ = start.split("-");
        var end_ = end.split("-");
        var startTime = new Date(start_[0], start_[1], start_[2]);
        var endTime = new Date(end_[0], end_[1], end_[2]);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
          var year = startTime.getFullYear();
          var month = startTime.getMonth().toString().length == 1 ? "0" + startTime.getMonth().toString() : startTime
            .getMonth();
          var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
          arr.push((year + "-" + month + "-" + day))
          startTime.setDate(startTime.getDate() + 1);
        }
        return arr
      },

      getByteLen(val) {
        var len = 0;
        var len2 = 0;
        var len3 = 0;
        for (var i = 0; i < val.length; i++) {
          var patt = new RegExp(/[^\x00-\xff]/ig);
          var a = val[i];
          if (patt.test(a)) {
            len += 2;
          } else {
            len2 += 1;
          }
        }
        len3 = len + len2
        return {
          len,
          len2,
          len3
        };
      },

      //删除优惠金额list
      deleteCusAry(index) {
        this.cusAry.splice(index, 1)
      },
      deleteCusAry2(index) {
        this.cusAry2.splice(index, 1)
      },
      //优惠设置test 下
      testCusAry(index) {
        if (this.cusAry[index].consumptionAmount == '') {
          return false
        }
        if (this.cusAry[index].consumptionAmount < 0) {
          this.$Message.error("不能输入负数")
          this.cusAry[index].consumptionAmount = ''
          return false
        }
        if (this.cusAry[index].consumptionAmount.indexOf(".") != -1) {
          this.cusAry[index].consumptionAmount = Number(this.cusAry[index].consumptionAmount).toFixed(2)
        }
        var arr = this.cusAry[index].consumptionAmount
        let flag = this.cusAry.some(function (item, idx) {
          if (index != idx) {
            return item.consumptionAmount == arr
          }
        })
        if (flag) {
          this.$Message.error("已存在相同设置条件，不能再设置")
          this.cusAry[index].consumptionAmount = ''
        }
      },

      testCusAry2(index) {
        if (this.cusAry2[index].consumptionAmount == '') {
          return false
        }
        if (this.cusAry2[index].consumptionAmount < 0) {
          this.$Message.error("不能输入负数")
          this.cusAry2[index].consumptionAmount = ''
          return false
        }
        if (this.cusAry2[index].consumptionAmount.indexOf(".") != -1) {
          this.cusAry2[index].consumptionAmount = Number(this.cusAry2[index].consumptionAmount).toFixed(0)
        }
        var arr = this.cusAry2[index].consumptionAmount
        let flag = this.cusAry2.some(function (item, idx) {
          if (index != idx) {
            return item.consumptionAmount == arr
          }
        })
        if (flag) {
          this.$Message.error("已存在相同设置条件，不能再设置")
          this.cusAry2[index].consumptionAmount = ''
        }
      },

      testPrice(index) {
        if (this.cusAry[index].discountAmount < 0) {
          this.$Message.error("不能输入负数")
          this.cusAry[index].discountAmount = ''
          return false
        }
        if (this.cusAry[index].discountAmount.indexOf(".") != -1) {
          this.cusAry[index].discountAmount = Number(this.cusAry[index].discountAmount).toFixed(1)
        }
      },
      testPrice2(index) {
        if (this.cusAry2[index].discountAmount < 0) {
          this.$Message.error("不能输入负数")
          this.cusAry2[index].discountAmount = ''
          return false
        }
        if (this.cusAry2[index].discountAmount.indexOf(".") != -1) {
          this.cusAry2[index].discountAmount = Number(this.cusAry2[index].discountAmount).toFixed(1)
        }
      },
      //优惠金额test

      // 处理整型
      calcInt(ary) {
        ary.map((v, i) => {
          v.consumptionAmount = parseInt(v.consumptionAmount),
            v.discountAmount = parseInt(v.discountAmount)
        })
      },

      //新增数据接口
      addFull(params) {
        this.loading=true
        let selectgoods = []
        this.rulegoodslist.map((v, i) => {
          let newObj = {
            goodsId: v.goodsId,
            specIds: v.specIds
          }
          selectgoods.push(newObj)
        })
        let timeAry = this.reduForm.time.map((v, i) => {
          return v = utils.timeFun(new Date(v).getTime())
        })

        marking.discountSave({
          'titles': this.reduForm.titles,
          'startTime': this.reduForm.startEnd.length == 0 || this.reduForm.startEnd[0] == '' ? '00:00:01' : this
            .reduForm.startEnd[0],
          'time': timeAry,
          'endTime': this.reduForm.startEnd.length == 0 || this.reduForm.startEnd[1] == '' ? '23:59:59' : this
            .reduForm.startEnd[1],
          'weekdays': this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
          'activityObject': this.reduForm.activityObject,
          'goodsMode': this.reduForm.goodsMode,
          'type': this.reduForm.type,
          'selectgoods': selectgoods,
          'smallProgram': '1',
          'selectrule': this.reduForm.type == 1 ? this.cusAry : this.cusAry2,
          'activity_type': this.reduForm.activity_type,
        }).then(res => {
          if (res.code == 1) {
            this.loading=false
            this.$Message.success("保存成功")
            this.backList()
          } else {
            this.loading=false
            this.$Message.error(res.message)
          }
        })
      },

      chenge(data) {
        if (data == 2) {
          this.cusAry.consumptionAmount = '';
          this.cusAry.discountAmount = '';
        }
      },

      // 添加优惠
      addCustomizeDesc() {
        this.cusAry.push({
          consumptionAmount: '',
          discountAmount: ''
        });
      },

      addCustomizeDescs() {
        this.cusAry2.push({
          consumptionAmount: '',
          discountAmount: ''
        });
      },

      //开启
      handleShowClick() {
        for (var i in this.reduForm.weekdays) {
          console.log('星期' + this.reduForm.weekdays[i].id + this.reduForm.weekdays[i].disable)
        }
        this.show = true
      },
      handleSureClick() {
        var list = []
        var arr = this.reduForm.weekdays
        for (var i in arr) {
          if (arr[i].flag == true) {
            list.push(arr[i].id)
          }
        }
        this.weekdayList = list
        this.show = false;
      },
      //关闭
      handleCloseClick() {
        this.show = false
      },
      handleClick: function (item, index) {
        item.flag = !item.flag
      },
      save(reduForm) {
        var arr = this.reduForm.type == 1 ? this.cusAry : this.cusAry2

        let flag = true
        arr.some(function (item, idx) {
          if (!flag) {
            flag = false
          } else {
            if (item.consumptionAmount || item.discountAmount) {
              flag = item.consumptionAmount && item.discountAmount ? true : false
            } else {
              flag = false
            }
          }
        })

        this.$refs.reduForm.validate((valid) => {
          if (valid) {
            if (!flag) {
              this.$Message.error('优惠条件设置错误')
              return false
            }
            this.addFull()
          } else {
            this.$Message.error('保存失败');
          }
        })
      },
      backList() {
        this.$router.push('/@/views/marking/discount/Discount')
      },
      prev() {
        this.$router.go(-1)
      },
      //清空数据
      restore() {
        this.showData = []
        this.reduForm = {
            smallProgram: "1",
            //活动名称
            titles: '',
            //活动对象
            activityObject: '1',
            //活动商品
            goodsMode: '1',
            //优惠类型
            type: '1',
            //商品ID
            goodsid: '',
            //商品规格ID
            specIds: '',
            //时间
            time: [],
            goodlists: [],
            //活动周期
            weekdays: [{
              week: '周一',
              flag: false
            }, {
              week: '周二',
              flag: false
            }, {
              week: '周三',
              flag: false
            }, {
              week: '周四',
              flag: false
            }, {
              week: '周五',
              flag: false
            }, {
              week: '周六',
              flag: false
            }, {
              week: '周日',
              flag: false
            }],

            // 会员等级
            grade: [{
                value: '1',
                label: '1'
              },
              {
                value: '2',
                label: '2'
              },
            ],
          },
          this.cusAry = [{
            consumptionAmount: '',
            discountAmount: ''
          }],
          this.cusAry2 = [{
            consumptionAmount: '',
            discountAmount: ''
          }]
      },
    },
    activated() {
      this.restore();
    },

    watch: {
      'reduForm.titles': function (val) {
        var that = this
        that._data.lenght = val.length
      }
    }
  }

</script>
<style scoped>
  .container {
    position: relative;
  }

  .container .redu-bread {
    line-height: 30px;
    height: 30px;
  }

  .container .redu-content {
    padding: 20px 20px 100px 20px;

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
    padding: 80px 0 80px 50px;
    background: #fff;
  }

  .container .high-opation {
    padding: 10px;
    color: #0083B0;
    cursor: pointer;
  }

  .container .set {
    width: 600px;
    padding: 20px 20px 20px 10px;
    margin-bottom: 10px;
    border: 1px dashed #aeaeae;
    background: #F2F2F2;
    position: relative;
  }

  .container .set .delete {
    position: absolute;
    height: 30px;
    width: 30px;
    top: -15px;
    right: -18px;
    font-size: 20px;
    cursor: pointer;
  }

  .container .formBtn {
    width: 150px;
    margin: 0 auto;
    margin-top: 30px;
    text-align: center;
  }

  .container .comBtn {
    margin: 0 5px;
  }

  .limitLength {
    position: absolute;
    margin-left: 10px;
    color: #bbb;
  }

  .container .mask {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .container .set .delete {
    position: absolute;
    height: 30px;
    width: 30px;
    top: -15px;
    right: -18px;
    font-size: 20px;
    cursor: pointer;
  }

  .container .time-set {
    width: 700px;
    height: 270px;
    border: 1px solid #aeaeae;
    background: #fff;
  }

  .container .set-title {
    padding: 8px;
    font-size: 14px;
    background: #0083b0;
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
    background: #0083b0;
    color: #fff;
  }

  .currentTitle {
    font-size: 13px;
    padding: 4px 0;
    background: #f8fbfb;
  }

  .currentTitle label {
    font-size: 14px;
    color: #000;
  }

</style>
