<template>
  <div class="container">
    <div class="redu-box">
      <div class="redu-inset">
        <div class="currentTitle">
          选赠礼/
          <label>创建选赠礼</label>
        </div>
        <Card>
          <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduRule"
            style="border: 1px solid #dcdcdc;">
            <!-- 内容标题 -->
            <div class="redu-title">活动设置</div>
            <div class="inset-content">
              <FormItem label="活动名称" prop="titles">
                <Input v-model="reduForm.titles" placeholder="请输入活动名称" :maxlength="20" style="width: 350px;"></Input>
                <span class="limitLength">{{lenght}}/20</span>
              </FormItem>
              <FormItem label="活动时间" prop="time">
                <DatePicker type="datetimerange" :editable="false" :options="optionsTime" v-model="reduForm.time"
                  @on-change="changeTime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期" style="width: 350px">
                </DatePicker>
                <span class="high-opation" @click="handleShowClick">高级选项</span>
              </FormItem>
              <FormItem label="活动渠道" prop="smallProgram">
                <Select style="width:300px" v-model="reduForm.smallProgram">
                  <Option value="1">微信小程序</Option>
                </Select>
              </FormItem>
            </div>
            <div class="redu-title">规则设置</div>
            <div class="inset-content">
              <FormItem label="活动对象" prop="activityObject">
                <RadioGroup v-model="reduForm.activityObject">
                  <Radio label="1">全部用户</Radio>
                  <Radio label="2">仅注册会员</Radio>
                  <!--                    <Radio label="3">会员等级</Radio>-->
                </RadioGroup>
              </FormItem>
              <FormItem label="会员等级" v-if="reduForm.activityObject=='3'" prop="member">
                <Select style="width:300px" placeholder="请选择会员等级">
                  <Option value></Option>
                </Select>
              </FormItem>
              <FormItem label="活动商品" prop="goodsMode">
                <RadioGroup v-model="reduForm.goodsMode" @on-change="changeMode">
                  <Radio label="1">全部商品</Radio>
                  <Radio label="2">指定商品</Radio>
                  <Radio label="3">不参与商品</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="活动商品" prop="goodlists" v-if="reduForm.goodsMode != '1'">
                <coupon-addgood style="width: 800px" @listentgoodData="listentgoodDatafuc($event)" :options="showData">
                </coupon-addgood>
              </FormItem>
              <!-- <FormItem label="赠礼规则" prop="type">
                <RadioGroup v-model="reduForm.type">
                  <Radio label="1">选赠礼</Radio>
                  <Radio label="2">满赠礼</Radio>
                </RadioGroup>
              </FormItem> -->
              <!-- v-if="reduForm.type == '1'" -->
              <!-- <FormItem label="优惠设置" v-model="customized_descs">
                <div v-for="(item,index) in customized_descs" :key="index">
                  <div class="rule-box1">
                    <div class="rule-lf">
                      <div class="zeng-l">
                        <CheckboxGroup v-model="item.checkAllGroup" @on-change="changeBox">
                          <p style="margin-bottom:10px;">
                            <Checkbox label="满额赠">满额赠：</Checkbox>消费满&nbsp;&nbsp;
                            <Input style="width: 80px;" v-model="item.price"
                              :disabled="!item.checkAllGroup.includes('满额赠')"></Input>&nbsp;&nbsp;元
                          </p>
                          <p>
                            <Checkbox label="满件赠">满件赠：</Checkbox>购买满&nbsp;&nbsp;
                            <Input style="width: 80px;" v-model="item.amount"
                              :disabled="!item.checkAllGroup.includes('满件赠')"></Input>&nbsp;&nbsp;件
                          </p>
                        </CheckboxGroup>
                      </div>
                      <div class="zeng-r" v-show="item.showPrise">
                        <div @click="showToggle(index)">
                          <div v-show="item.flags==true" class="variety">{{item.btnText}}</div>
                        </div>
                      </div>
                    </div>
                    <div class="rule-rt">
                      <p>
                        选赠&nbsp;&nbsp;
                        <Input style="width: 80px;" v-model="item.songAmount"></Input>&nbsp;&nbsp;件
                      </p>
                    </div>
                    <div v-if="index > 0" @click="deleteCusAry(index)" class="delete">
                      <i class="ivu-icon ivu-icon-ios-close-circle"></i>
                    </div>
                  </div>
                </div>
              </FormItem> -->

              <!-- v-if="reduForm.type == '2'" -->
              <FormItem label="优惠设置" v-model="customized_descs">
                <div v-for="(item,index) in customized_descs" :key=" item.index" :value="item.index">
                  <div class="rule-box">
                    <!-- 左边 -->
                    <div style="width:800px">
                      <div class="rule-lf">
                        <div class="zeng-l" style="margin-bottom:10px;">
                          <div>
                            <CheckboxGroup v-model="item.checkAllGroup" @on-change="changeBox2(index,$event)">
                              <p style="margin-bottom:10px;">
                                <Checkbox label="满额赠">满额赠：</Checkbox>消费满&nbsp;&nbsp;
                                <Input style="width: 80px;" v-model="item.price"
                                  :disabled="!item.checkAllGroup.includes('满额赠')"></Input>&nbsp;&nbsp;元
                              </p>
                              <p>
                                <Checkbox label="满件赠">满件赠：</Checkbox>购买满&nbsp;&nbsp;
                                <Input style="width: 80px;" v-model="item.amount"
                                  :disabled="!item.checkAllGroup.includes('满件赠')"></Input>&nbsp;&nbsp;件
                              </p>
                            </CheckboxGroup>
                          </div>
                        </div>

                        <div class="zeng-r" v-show="item.showPrise">
                          <div @click="showToggle2(index)">
                            <div v-show="item.flags==true" class="variety">{{item.btnText}}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="rule-rt">
                          <p>
                            选赠&nbsp;&nbsp;
                            <Input style="width: 80px;" v-model="item.songAmount"></Input>&nbsp;&nbsp;件
                          </p>
                        </div>
                        <div class="rule-sort">
                          <span>排序</span>
                          <Input v-model="item.fullLevel" style="width: 80px;"></Input>
                        </div>

                        <div class="zengp">
                          <div class="zengp_title">选择赠品：</div>
                          <div class="zengp_gift">
                            <add-gift @listentgoodData="listentgoodDatafucZp($event,index)" res="+选择赠品"
                              style="width: 700px;"></add-gift>
                          </div>

                        </div>

                      </div>
                      <div v-if="index > 0" @click="deleteCusAry2(index)" class="delete">
                        <i class="ivu-icon ivu-icon-ios-close-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </FormItem>
              <!--  v-if="reduForm.type == '1'" -->
              <!-- <FormItem>
                <Button type="default" @click="addCustomizeDesc()">+添加优惠</Button>
              </FormItem> -->
              <!--  v-if="reduForm.type == '2'" -->
              <FormItem>
                <Button type="default" @click="addCustomizeDescs()">+添加优惠</Button>
              </FormItem>

              <FormItem label="活动规则说明">
                <Input type="textarea" v-model="reduForm.description" :rows="4" placeholder style="width: 400px;" />
              </FormItem>
              <!-- <FormItem label="选择赠品" prop="giftlists" v-if="reduForm.type == '1'">
                <add-gift @listentgoodData="listentgoodDatafuc1($event)" :selectGoods="rulegoodslist" res="+选择赠品" ></add-gift>
              </FormItem> -->
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
                <Icon type="ios-checkmark" size="20"></Icon>
              </Button>
            </FormItem>
            <FormItem label="活动时段">
              <span class="star">*</span>
              <TimePicker confirm format="HH:mm:ss" type="timerange" placement="bottom-end" placeholder="请选择时间段"
                v-model="reduForm.startEnd" @on-change="reduForm.startEnd=$event" style="width: 168px"></TimePicker>
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
  import addGift from "@/components/addGood/addGift";
  import api from "@/api/request";
  import couponAddgood from "@/components/couponAddgood/couponAddgood";
  import marking from "@/api/request/marking";
  import utils from "@/utils/goodsUtils";

  export default {
    name: "CreateGive",
    props: ["recommend"],
    components: {
      couponAddgood,
      addGift
    },
    data() {
      return {
        loading:false,
        showData: [],
        lenght: 0,
        dateIntArr: [],
        weekdayList: [],
        rulegoodslist: [],
        rulegoodslist1: [],
        selectfullgift: [],
        optionsTime: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        // 商品添加要接受的值
        selectgoods: [],

        customized_descs: [{
          btnText: "或",
          checkAllGroup: ["满额赠"],
          flags: false,
          showPrise: false,
          conditions: "",
          price: "",
          description: "",
          amount: "",
          fullLevel: "",
        }],
        show: false,
        currentIndex: 0,
        //暂存ID
        tempId: "",
        // 临时数组
        suzu: [],
        reduForm: {
          startEnd: [],
          //活动名称
          titles: "",
          //活动对象
          activityObject: "1",
          //活动商品
          goodsMode: "1",
          //优惠类型
          // type: "1",
          //商品ID
          goodsid: "",
          //商品规格ID
          specIds: "",
          description: "",
          //时间
          time: [],
          // giftlists: [],
          goodlists: [],

          //活动周期
          weekdays: [{
              week: "周一",
              flag: false,
              id: 1,
              disable: true
            },
            {
              week: "周二",
              flag: false,
              id: 2,
              disable: true
            },
            {
              week: "周三",
              flag: false,
              id: 3,
              disable: true
            },
            {
              week: "周四",
              flag: false,
              id: 4,
              disable: true
            },
            {
              week: "周五",
              flag: false,
              id: 5,
              disable: true
            },
            {
              week: "周六",
              flag: false,
              id: 6,
              disable: true
            },
            {
              week: "周日",
              flag: false,
              id: 0,
              disable: true
            }
          ],
          fullyuan: "",
          nimei: "",
          smallProgram: "1",
          selectgoods: [],

          // 会员等级
          grade: [{
              value: "1",
              label: "1"
            },
            {
              value: "2",
              label: "2"
            }
          ]
        },
        reduRule: {
          // 对于单个字段来说，通常需要多个验证规则，这些规则以数组展示
          titles: [{
            required: true,
            message: "活动名称不能为空",
            trigger: "blur"
          }],
          time: [{
              required: true,
              message: "活动时间不能为空"
            },
            {
              pattern: null,
              type: "array",
              trigger: "change"
            }
          ],
          smallProgram: [{
            required: true,
            message: "活动渠道不能为空",
            trigger: "blur",
            type: "string"
          }],
          activityObject: [{
            required: true,
            message: "活动对象不能为空",
            trigger: "blur",
            type: "string"
          }],
          goodsMode: [{
            required: true,
            message: "活动商品不能为空",
            trigger: "blur",
            type: "string"
          }],
          // type: [{
          //   required: true,
          //   message: "活动名称不能为空",
          //   trigger: "blur",
          //   type: "string"
          // }],
          goodlists: [{
            required: true,
            message: '请选择商品'
          }],
          // giftlists: [{
          //   required: true,
          //   message: '请选择赠品'
          // }]
        }
      };
    },
    activated(){
      this.restore()
      this.$refs.reduForm.resetFields()
      // this.$refs.addGift.resetData()
    },
    methods: {
      changeMode(e) {
        console.log(e);
        this.showData = [];
      },
      changeTime(e) {
        console.log(e);
        // 判断当前时间处理
        if (new Date(e[0]).getTime() < new Date().getTime()) {
          e[0] = new Date(new Date().getTime() + 300 * 1000).getTime();
          e[0] = utils.timeFun(e[0]);
        }
        this.reduForm.time = e;
        var day1 = new Date(e[0]);
        var day2 = new Date(e[1]);
        var dateIntArr = [];
        var dateArr = this.getDateArr(e[0].split(" ")[0], e[1].split(" ")[0]);
        for (var i in dateArr) {
          if (i < 7) {
            dateIntArr.push(new Date(dateArr[i]).getDay());
          } else {
            continue;
          }
        }
        this.dateIntArr = dateIntArr;
        this.weekdayList = [];
        this.reduForm.startEnd = [];
        if ((day2 - day1) / (1000 * 60 * 60 * 24) >= 6) {
          //大于6天所有可点
          for (var j in this.reduForm.weekdays) {
            this.reduForm.weekdays[j].disable = false;
          }
        } else {
          this.checkWeekdays(dateIntArr);
        }
      },
      checkWeekdays(date) {
        for (var m in this.reduForm.weekdays) {
          this.reduForm.weekdays[m].disable = true;
          this.reduForm.weekdays[m].flag = false;
        }
        for (var i in date) {
          for (var j in this.reduForm.weekdays) {
            if (date[i] == this.reduForm.weekdays[j].id) {
              this.reduForm.weekdays[j].disable = false;
            }
          }
        }
        console.log(this.reduForm.weekdays);
      },
      getDateArr(start, end) {
        var arr = [];
        var start_ = start.split("-");
        var end_ = end.split("-");
        var startTime = new Date(start_[0], start_[1], start_[2]);
        var endTime = new Date(end_[0], end_[1], end_[2]);
        while (endTime.getTime() - startTime.getTime() >= 0) {
          var year = startTime.getFullYear();
          var month =
            startTime.getMonth().toString().length == 1 ?
            "0" + startTime.getMonth().toString() :
            startTime.getMonth();
          var day =
            startTime.getDate().toString().length == 1 ?
            "0" + startTime.getDate() :
            startTime.getDate();
          console.log(year + "-" + month + "-" + day);
          arr.push(year + "-" + month + "-" + day);
          startTime.setDate(startTime.getDate() + 1);
        }
        return arr;
      },
      //接收商品数据
      listentgoodDatafuc: function (data) {
        let rulegoodslist = [];
        for (let item in data) {
          let obj = {};
          obj.specIds = data[item].hasOwnProperty("specsId") ?
            data[item].specsId.join(",") :
            "";
          (obj.goodsId = data[item].id), rulegoodslist.push(obj);
        }
        this.rulegoodslist1 = rulegoodslist
        this.reduForm.goodlists = rulegoodslist

        if(!data){
          return false
        }

        this.$forceUpdate()

        this.$refs.reduForm.validateField('goodlists');
      },
      listentgoodDatafucZp(data, index) {
        let rulegoodslist = []
        for (let item in data) {
          let obj = {};
          (obj.goodsId = data[item].id), (obj.goodsName = data[item].title);
          obj.pic = data[item].thumb;
          rulegoodslist.push(obj)
        }
        // this.customized_descs[index] = {
        //   ...this.customized_descs[index],
        //   gifts: rulegoodslist
        // };
        this.customized_descs[index].gifts = rulegoodslist
        this.$forceUpdate()
        console.log(this.customized_descs)
      },

      //接收赠品数据
      // listentgoodDatafuc1: function (data) {
      //   this.rulegoodslist = [];
      //   for (let item in data) {
      //     let obj = {};
      //     obj.id = data[item].id
      //     obj.goodsId = data[item].id,
      //     obj.goodsName = data[item].title
      //     obj.pic = data[item].thumb
      //     obj.thumb = data[item].thumb
      //     obj.price = data[item].price
      //     obj.title = data[item].title
      //     obj.vituralStock = data[item].vituralStock

      //     this.rulegoodslist.push(obj);
      //   }
      //   this.reduForm.giftlists = this.rulegoodslist

      //   if(!data){
      //     return false
      //   }

      //   this.$forceUpdate()

      //   this.$refs.reduForm.validateField('giftlists');
      // },

      getByteLen(val) {
        var len = 0;
        var len2 = 0;
        var len3 = 0;
        for (var i = 0; i < val.length; i++) {
          var patt = new RegExp(/[^\x00-\xff]/gi);
          var a = val[i];
          if (patt.test(a)) {
            len += 2;
          } else {
            len2 += 1;
          }
        }
        len3 = len + len2;
        return {
          len,
          len2,
          len3
        };
      },
      //关联变化
      // showToggle(index) {
      //   if (this.customized_descs[index].btnText == "或") {
      //     this.customized_descs[index].btnText = "且";
      //     this.customized_descs[index].conditions = 1;
      //   } else {
      //     this.customized_descs[index].btnText = "或";
      //     this.customized_descs[index].conditions = 2;
      //   }
      // },

      showToggle2(index) {
        if (this.customized_descs[index].btnText == "或") {
          this.customized_descs[index].btnText = "且";
          this.customized_descs[index].conditions = 1;
        } else {
          this.customized_descs[index].btnText = "或";
          this.customized_descs[index].conditions = 2;
        }
        this.$forceUpdate();
      },
      // changeBox(e) {
      //   // 检查单个对象的数组是否选满
      //   this.checkCusAry();
      // },
      changeBox2(index,e) {
        this.customized_descs[index].checkAllGroup = e
        // 检查单个对象的数组是否选满
        this.checkCusAry2();
      },
      // 检查单个对象的数组是否选满
      // checkCusAry() {
      //   let newCusAry = [];
      //   console.log('customized_descs',this.customized_descs)
      //   this.customized_descs.map((v, i) => {
      //     console.log(v)
      //     if(v.hasOwnProperty('checkAllGroup')){
      //       if (v.checkAllGroup.length == 2) {
      //         if(v.conditions == 1){
      //           this.customized_descs[i].conditions = 1;
      //           this.customized_descs[i].btnText = "且";
      //         }else{
      //           this.customized_descs[i].conditions = 2;
      //           this.customized_descs[i].btnText = "或";
      //         }
      //         this.customized_descs[i].showPrise = true;
      //         this.customized_descs[i].flags = true;
      //       } else {
      //         this.customized_descs[i].btnText = "";
      //         this.customized_descs[i].showPrise = false;
      //         this.customized_descs[i].flags = false;
      //         this.customized_descs[i].conditions = 0;
      //       }
      //     }
          
      //     newCusAry.push(this.customized_descs[i]);
      //   });
      //   this.customized_descs = newCusAry;
      // },

      checkCusAry2() {
        let newCusAry = [];
        this.customized_descs.map((v, i) => {
          if (v.checkAllGroup.length == 2) {
            if(v.conditions == 1){
              this.customized_descs[i].conditions = 1;
              this.customized_descs[i].btnText = "且";
            }else{
              this.customized_descs[i].conditions = 2;
              this.customized_descs[i].btnText = "或";
            }
            this.customized_descs[i].showPrise = true;
            this.customized_descs[i].flags = true;
          } else {
            this.customized_descs[i].btnText = "";
            this.customized_descs[i].showPrise = false;
            this.customized_descs[i].flags = false;
            this.customized_descs[i].conditions = 0;
          }
          newCusAry.push(this.customized_descs[i]);
        });
        this.customized_descs = newCusAry;
      },

      //新增数据接口
      addFull(params) {
        // 处理优惠设置
        let cusData = [];
        let cusData1 = [];
        let selectgoods = [];
        let selectfullgift = [];

        this.rulegoodslist1.map((v, i) => {
          let newObj = {
            goodsId: v.goodsId,
            specIds: v.specIds
          };
          selectgoods.push(newObj);
        });

        let timeAry = this.reduForm.time.map((v, i) => {
          return (v = utils.timeFun(new Date(v).getTime()));
        });

        let allowKey = false

        // 正整数的匹配
        let regNum = /^\+?[0-9][0-9]*$/;
        // 正浮点数
        let regMoney = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
        
        // if (this.reduForm.type == 1) {
        //   this.customized_descs.map((v, i) => {

        //     // 赠送的数量限制
        //     if (!regNum.test(v.songAmount)) {
        //       allowKey = true
        //       this.$Message.error('优惠条件设置错误')
        //       return false
        //     }

        //     if (v.checkAllGroup.length == 2) {

        //       // 价格限制
        //       if (!regMoney.test(v.price)) {
        //         allowKey = true
        //         this.$Message.error('优惠条件设置错误')
        //         return false
        //       }
        //       // 数量限制
        //       console.log(regNum.test(v.amount))
        //       if (!regNum.test(v.amount)) {
        //         allowKey = true
        //         this.$Message.error('优惠条件设置错误')
        //         return false
        //       }

        //       cusData.push({
        //         price: v.price,
        //         amount: v.amount,
        //         songAmount: v.songAmount,
        //         conditions: v.conditions
        //       });

        //     } else {
        //       if (v.checkAllGroup.includes("满额赠")) {
        //         // 价格限制
        //         if (!regMoney.test(v.price)) {
        //           allowKey = true
        //           this.$Message.error('优惠条件设置错误')
        //           return false
        //         }
        //         cusData.push({
        //           price: v.price,
        //           songAmount: v.songAmount,
        //           conditions: v.conditions
        //         });
        //       } else if (v.checkAllGroup.includes("满件赠")) {
        //         // 数量限制
        //         if (!regNum.test(v.amount)) {
        //           allowKey = true
        //           this.$Message.error('优惠条件设置错误')
        //           return false
        //         }
        //         cusData.push({
        //           amount: v.amount,
        //           songAmount: v.songAmount,
        //           conditions: v.conditions
        //         });
        //       }
        //     }
        //   });
        // } else {
          this.customized_descs.map((v, i) => {

            if(!v.hasOwnProperty('gifts') || v.gifts.length == 0){
              allowKey = true
              this.$Message.error('优惠条件赠品不能为空')
              return false
            }
            // 赠送的数量限制
            if(v.fullLevel > 9999){
              allowKey = true
              this.$Message.error('优惠条件排序不能大于9999')
              return false
            }
            if (!regNum.test(v.fullLevel)) {
              allowKey = true
              this.$Message.error('优惠条件排序设置错误')
              return false
            }

            if (v.checkAllGroup.length == 2) {

              // 价格限制
              if (!regMoney.test(v.price)) {
                allowKey = true
                this.$Message.error('优惠条件设置错误')
                return false
              }
              // 数量限制
              if (!regNum.test(v.amount)) {
                allowKey = true
                this.$Message.error('优惠条件设置错误')
                return false
              }

              let newObj = {
                ruleList: [{
                  price: v.price,
                  amount: v.amount,
                  conditions: v.conditions,
                  songAmount: v.songAmount,
                  fullLevel:v.fullLevel
                }],
                fullGiftGoodsList: v.gifts
              };
              cusData1.push(newObj);
            } else {
              if (v.checkAllGroup.includes("满额赠")) {
                // 价格限制
                if (!regMoney.test(v.price)) {
                  allowKey = true
                  this.$Message.error('优惠条件价格设置错误')
                  return false
                }

                let newObj = {
                  ruleList: [{
                    price: v.price,
                    conditions: v.conditions,
                    songAmount: v.songAmount,
                    fullLevel:v.fullLevel
                  }],
                  fullGiftGoodsList: v.gifts
                };

                cusData1.push(newObj);

              } else if (v.checkAllGroup.includes("满件赠")) {

                // 数量限制
                if (!regNum.test(v.amount)) {
                  allowKey = true
                  this.$Message.error('优惠条件设置错误')
                  return false
                }

                let newObj = {
                  ruleList: [{
                    amount: v.amount,
                    conditions: v.conditions,
                    songAmount: v.songAmount,
                    fullLevel:v.fullLevel
                  }],
                  fullGiftGoodsList: v.gifts
                };
                cusData1.push(newObj);
              }
            }
          });
        // }

        if(allowKey){
          return false
        }

        //选择赠品
        this.rulegoodslist.map((v, i) => {
          let newObj = {
            goodsId: v.goodsId,
            goodsName: v.goodsName,
            pic: v.pic
          };
          selectfullgift.push(newObj);
        });

        let rawData;

        // if (this.reduForm.type == 1) {
        //   rawData = {
        //     titles: this.reduForm.titles,
        //     startTime: this.reduForm.startEnd.length == 0 ||
        //       this.reduForm.startEnd[0] == "" ?
        //       "00:00:01" : this.reduForm.startEnd[0],
        //     time: timeAry,
        //     endTime: this.reduForm.startEnd.length == 0 ||
        //       this.reduForm.startEnd[1] == "" ?
        //       "23:59:59" : this.reduForm.startEnd[1],
        //     weekdays: this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
        //     activityObject: this.reduForm.activityObject,
        //     goodsMode: this.reduForm.goodsMode,
        //     type: this.reduForm.type,
        //     smallProgram: "1",
        //     description:this.reduForm.description,
        //     selectfullgift: selectfullgift,
        //     selectgoods: selectgoods,
        //     smallProgram: this.reduForm.smallProgram,
        //     selectrule: cusData
        //   };
        // } else {
          rawData = {
            titles: this.reduForm.titles,
            startTime: this.reduForm.startEnd.length == 0 ||
              this.reduForm.startEnd[0] == "" ?
              "00:00:01" : this.reduForm.startEnd[0],
            time: timeAry,
            endTime: this.reduForm.startEnd.length == 0 ||
              this.reduForm.startEnd[1] == "" ?
              "23:59:59" : this.reduForm.startEnd[1],
            weekdays: this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
            activityObject: this.reduForm.activityObject,
            goodsMode: this.reduForm.goodsMode,
            type: this.reduForm.type,
            smallProgram: "1",
            description:this.reduForm.description,
            selectfullgift: selectfullgift,
            selectgoods: selectgoods,
            smallProgram: this.reduForm.smallProgram,
            selectfullList: cusData1,
            type: 1
          };
        // }
        this.loading = true;
        marking
          .selGiftSave({
            ...rawData
          })
          .then(res => {
            this.loading=false;
            if (res.code == 1) {
              this.backList();
              this.$Message.success("保存成功");
            } else {
              this.$Message.error(res.message);
            }
          }).catch(err => {
            this.loading=false;
          });
      },

      //删除优惠金额list
      // deleteCusAry(index) {
      //   this.customized_descs.splice(index, 1);
      // },
      deleteCusAry2(index) {
        this.customized_descs.splice(index, 1);
      },

      // 添加优惠
      // addCustomizeDesc(index) {
      //   this.customized_descs.push({
      //     btnText: "或",
      //     checkAllGroup: ["满额赠"],
      //     flags: false,
      //     showPrise: false,
      //     conditions: "",
      //     price: "",
      //     description: ""
      //   });
      // },
      addCustomizeDescs(index) {
        this.customized_descs.push({
          btnText: "或",
          checkAllGroup: ["满额赠"],
          flags: false,
          showPrise: false,
          conditions: "",
          price: "",
          description: ""
        });
      },

      //添加商品

      listentgoodData: function (data) {
        // console.log("select data",data[i].specTitleList)
        let _this = this;
        let arr = [];
        for (let i in data) {
          let obj = {};
          obj.goodsid = data[i].id;
          // obj.specIds=data[i].specTitleList
          arr.push(obj);
        }
        _this.selectgoods = arr;
        console.log("优惠券", _this.selectgoods);
      },

      //开启
      handleShowClick() {
        this.show = true;
      },
      //关闭
      handleCloseClick() {
        this.show = false;
      },
      handleSureClick() {
        var list = [];
        var arr = this.reduForm.weekdays;
        for (var i in arr) {
          if (arr[i].flag == true) {
            list.push(arr[i].id);
          }
        }
        console.log(list);
        console.log(this.startEnd);
        this.weekdayList = list;
        this.show = false;
      },
      handleClick: function (item, index) {
        this.reduForm.weekdays[index].flag = !this.reduForm.weekdays[index].flag;
      },
      save(reduForm) {
        this.$refs.reduForm.validate(valid => {
          if (valid) {
            this.addFull();
          }
        });
      },
      backList() {
        this.$router.push("/@/views/marking/give/SelectGive");
      },
      prev() {
        this.$router.go(-1);
      },
      restore(){
        this.showData = []
        this.dateIntArr = []
        this.weekdayList = []
        this.rulegoodslist = []
        this.rulegoodslist1 = []
        this.selectfullgift = []
        this.optionsTime = {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        }
        // 商品添加要接受的值
        this.selectgoods = []

        // this.customized_descs = [{
        //   btnText: "或",
        //   checkAllGroup: ["满额赠"],
        //   flags: false,
        //   showPrise: false,
        //   conditions: "",
        //   price: "",
        //   description: "",
        //   songAmount: "",
        //   amount: ""
        // }]
        this.customized_descs = [{
          btnText: "或",
          checkAllGroup: ["满额赠"],
          flags: false,
          showPrise: false,
          conditions: "",
          price: "",
          description: "",
          amount: "",
          fullLevel: "",
        }]

        this.reduForm = {
          startEnd: [],
          //活动名称
          titles: "",
          //活动对象
          activityObject: "1",
          //活动商品
          goodsMode: "1",
          //优惠类型
          // type: "1",
          //商品ID
          goodsid: "",
          //商品规格ID
          specIds: "",
          //时间
          time: [],
          // giftlists: [],
          goodlists: [],
          description:'',

          //活动周期
          weekdays: [{
              week: "周一",
              flag: false,
              id: 1,
              disable: true
            },
            {
              week: "周二",
              flag: false,
              id: 2,
              disable: true
            },
            {
              week: "周三",
              flag: false,
              id: 3,
              disable: true
            },
            {
              week: "周四",
              flag: false,
              id: 4,
              disable: true
            },
            {
              week: "周五",
              flag: false,
              id: 5,
              disable: true
            },
            {
              week: "周六",
              flag: false,
              id: 6,
              disable: true
            },
            {
              week: "周日",
              flag: false,
              id: 0,
              disable: true
            }
          ],
          fullyuan: "",
          nimei: "",
          smallProgram: "1",
          selectgoods: [],

          // 会员等级
          grade: [{
              value: "1",
              label: "1"
            },
            {
              value: "2",
              label: "2"
            }
          ]
        };


      }
    },
    watch: {
      "reduForm.titles": function (val) {
        var that = this;
        that._data.lenght = val.length;
      }
    }
  };

</script>
<style scoped>
@import './index.css';
</style>
