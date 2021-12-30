<template>
  <div class="container">
    <div class="redu-box">
      <div class="redu-inset">
        <div class="currentTitle">
          单品赠礼/
          <label>创建单品赠礼</label>
        </div>
        <Card>
          <Form
            :label-width="100"
            ref="reduForm"
            :model="reduForm"
            :rules="reduRule"
            style="border: 1px solid #dcdcdc;"
          >
            <div class="redu-title">活动设置</div>
            <div class="inset-content">
              <FormItem label="活动名称" prop="titles">
                <Input
                  v-model="reduForm.titles"
                  placeholder="请输入活动名称"
                  :maxlength="20"
                  style="width: 350px;"
                ></Input>
                <span class="limitLength">{{lenght}}/20</span>
              </FormItem>
              <FormItem
                label="活动时间"
                prop="time">

                <DatePicker
                  type="datetimerange"
                  :editable="false"
                  :value="reduForm.time"
                  :options="optionsTime"
                  @on-change="changeTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择日期"
                  style="width: 350px"
                ></DatePicker>
                <span class="high-opation" @click="handleShowClick">高级选项</span>
              </FormItem>
              <FormItem label="活动渠道" prop="smallProgram">
                <Select style="width:300px" v-model="reduForm.smallProgram">
                  <Option
                    v-for="item in smallProgram"
                    :key="item.value"
                    :value="item.value"
                  >{{item.label}}</Option>
                </Select>
              </FormItem>
            </div>
            <div class="redu-title">规则设置</div>
            <div class="inset-content">
              <FormItem label="活动对象" prop="activityObject">
                <RadioGroup v-model="reduForm.activityObject">
                  <Radio label="1">全部用户</Radio>
                  <Radio label="2">仅注册会员</Radio>
                  <!--<Radio label="3">会员等级</Radio>-->
                </RadioGroup>
              </FormItem>
              <FormItem label="会员等级" v-if="reduForm.activityObject==='3'" prop="member">
                <Select style="width:300px" v-model="model1">
                  <Option
                    v-for="item in member"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="商品类型" prop="goodsMode">
                <RadioGroup v-model="reduForm.goodsMode" @change="changeGoods">
                  <Radio label="1">单品购买</Radio>
                  <Radio label="2">组合购买</Radio>
                </RadioGroup>
                <span v-if="reduForm.goodsMode == 2" style="color: #bbb;">（必须购买完整组合商品方可获赠）</span>
              </FormItem>
              <FormItem label="活动商品" prop="goodlists" v-if="reduForm.goodsMode === '1'">
                <coupon-addgood @listentgoodData="listentgoodDatafuc($event)" :options="showData"></coupon-addgood>
              </FormItem>
              <FormItem label="活动商品1" prop="goodlists1" v-if="reduForm.goodsMode === '2'">
                <coupon-addgood @listentgoodData="listentgoodDatafuc2($event)" :options="showData1"></coupon-addgood>
              </FormItem>
              <FormItem label="活动商品2" prop="goodlists2" v-if="reduForm.goodsMode === '2'">
                <coupon-addgood @listentgoodData="listentgoodDatafuc3($event)" :options="showData2"></coupon-addgood>
              </FormItem>
              <FormItem label="获取规则" prop="type">
                <RadioGroup v-model="reduForm.type">
                  <Radio label="1">仅送一件</Radio>
                  <Radio label="2">按购买件数送</Radio>
                  <Radio label="3">指定件数送</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem v-if="reduForm.type==='1'">
                <strong class="set" style="font:12px/24px  ''; color: #aeaeae">(无论购买多少件仅送一件)</strong>
              </FormItem>
              <FormItem v-if="reduForm.type==='2'">
                <strong class="set" v-for="(item,index) in cusAry2" :key="index">
                  最多赠&nbsp;&nbsp;
                  <Input v-model="item.maxAmount" style="width: 100px;"></Input>件
                  <span style="color: #aeaeae">（0或为空则不无数量限制）</span>
                </strong>
              </FormItem>
              <FormItem v-if="reduForm.type==='3'">
                <strong class="set" v-for="(item,index) in cusAry" :key="index">
                  单品购买满&nbsp;&nbsp;
                  <Input v-model="item.alreadAmount" style="width: 100px;"></Input>件 &nbsp;&nbsp;
                  增送&nbsp;&nbsp;
                  <Input v-model="item.songAmount" style="width: 100px;"></Input>件 &nbsp;&nbsp;
                  最多赠&nbsp;&nbsp;
                  <Input v-model="item.maxAmount" style="width: 100px;"></Input>件
                  <span style="color: #aeaeae">（0或为空则不无数量限制）</span>
                </strong>
              </FormItem>
              <FormItem label="活动规则说明">
                <Input
                  type="textarea"
                  :rows="4"
                  placeholder
                  v-model="reduForm.description"
                  style="width: 400px;"
                />
              </FormItem>
              <FormItem label="选择赠品" prop="giftlists">
                <add-gift @listentgoodData="listentgoodDatafuc1($event)" res="+选择赠品"></add-gift>
              </FormItem>
            </div>
          </Form>
        </Card>
      </div>
      <!--保存 取消 -->
      <div class="formBtn">
        <Button type="primary" :loading="loading" class="comBtn" @click.native="save('reduForm')">保存</Button>
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
              <Button
                class="week-btn"
                v-for="(item,index) in reduForm.weekdays"
                :key="index"
                :disabled="item.disable"
                :class="{bgColor:item.flag}"
                @click="handleClick(item,index)"
              >
                {{item.week}}
                <Icon type="ios-checkmark" size="20"></Icon>
              </Button>
            </FormItem>
            <FormItem label="活动时段">
              <span class="star">*</span>
              <TimePicker
                confirm
                format="HH:mm:ss"
                type="timerange"
                placement="bottom-end"
                placeholder="请选择时间段"
                v-model="reduForm.startEnd"
                @on-change="reduForm.startEnd=$event"
                style="width: 168px"
              ></TimePicker>
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
import utils from "@/utils/goodsUtils";
import marking from "@/api/request/marking";
import goods from "@/api/request/goods";
import couponAddgood from "@/components/couponAddgood/couponAddgood";

export default {
  name: "CreateGift",
  components: {
    addGift,
    couponAddgood
  },
  data() {
    return {
      loading:false,
      lenght: 0,
      weekdayList: [],
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      // 商品添加要接受的值
      SepcVoList1: [],
      SepcVoList2: [],
      cusAry: [
        {
          alreadAmount: "",
          songAmount: "",
          maxAmount: ""
        }
      ],
      cusAry2: [
        {
          alreadAmount: "",
          songAmount: "",
          maxAmount: ""
        }
      ],

      model1: "",
      show: false,
      currentIndex: 0,
      //暂存ID
      tempId: "",
      // 临时数组
      suzu: [],
      showData: [],

      showData1: [],
      showData2: [],
      rulegoodslist: [],
      rulegoodslist1: [],
      rulegoodslist2: [],

      rulegoodslist3: [],
      smallProgram: [
        {
          value: "1",
          label: "微信小程序"
        }
      ],
      reduForm: {
        smallProgram: "1",
        description: "",
        maxAmount: "",
        //活动名称
        titles: "",
        //活动对象
        activityObject: "1",
        //活动商品
        goodsMode: "1",

        goodlists: [],
        goodlists1: [],
        goodlists2: [],
        giftlists: [],

        goodsName: "",
        pic: "",
        //优惠类型
        type: "1",
        //商品ID
        goodsid: "",
        //商品规格ID
        specIds: "",
        //时间
        time: [],
        startEnd: [],

        //活动周期
        weekdays: [
          {
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
        smallProgram: [
          {
            value: "1",
            label: "微信小程序"
          }
        ],
        SepcVoList1: [],
        // SepcVoList2: [],
        //选赠
        songAmount: "",
        //购赠
        amount: "",
        // 会员等级
        grade: [
          {
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
        titles: [
          {
            required: true,
            message: "活动名称不能为空",
            trigger: "blur"
          }
        ],
        time: [
          {
            type: 'array',
            required:(!this.fixationtimeflag),
            fields: {
              0: {required: !this.fixationtimeflag, message: '活动时间不能为空'},
              1: {required: !this.fixationtimeflag, message: '活动时间不能为空'}
            },
            message:'活动时间不能为空'
          }
        ],
        smallProgram: [
          {
            required: true,
            message: "活动渠道不能为空",
            trigger: "blur",
            type: "string"
          }
        ],
        activityObject: [
          {
            required: true,
            message: "活动对象不能为空",
            trigger: "blur",
            type: "string"
          }
        ],
        goodsMode: [
          {
            required: true,
            message: "活动商品不能为空",
            trigger: "blur",
            type: "string"
          }
        ],
        type: [
          {
            required: true,
            message: "活动名称不能为空",
            trigger: "blur",
            type: "string"
          }
        ],
        goodlists: [
          {
            required: true,
            message: "请选择商品"
          }
        ],
        goodlists1: [
          {
            required: true,
            message: "请选择商品"
          }
        ],
        goodlists2: [
          {
            required: true,
            message: "请选择商品"
          }
        ],
        giftlists: [
          {
            required: true,
            message: "请选择赠品"
          }
        ]
      }
    };
  },
  methods: {
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
    changeGoods() {
      this.rulegoodslist = [];
      this.rulegoodslist1 = [];
      this.rulegoodslist2 = [];
      this.rulegoodslist3 = [];
      this.showData = [];
      this.showData1 = [];
      this.showData2 = [];
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
          startTime.getMonth().toString().length == 1
            ? "0" + startTime.getMonth().toString()
            : startTime.getMonth();
        var day =
          startTime.getDate().toString().length == 1
            ? "0" + startTime.getDate()
            : startTime.getDate();
        arr.push(year + "-" + month + "-" + day);
        startTime.setDate(startTime.getDate() + 1);
      }
      return arr;
    },

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
    //接收商品数据
    listentgoodDatafuc: function(data) {
      this.rulegoodslist = [];
      for (let item in data) {
        let obj = {};
        obj.specIds = data[item].hasOwnProperty("specsId")
          ? data[item].specsId.join(",")
          : "";
        (obj.goodsId = data[item].id), this.rulegoodslist.push(obj);
      }
      this.reduForm.goodlists = this.rulegoodslist;

      this.$forceUpdate();
      if (!data) {
        return false;
      }
      this.$refs.reduForm.validateField("goodlists");
    },
    //接收商品数据 商品1
    listentgoodDatafuc2: function(data) {
      this.rulegoodslist2 = [];
      for (let item in data) {
        let obj = {};
        obj.specIds = data[item].hasOwnProperty("specsId")
          ? data[item].specsId.join(",")
          : "";
        (obj.goodsId = data[item].id), this.rulegoodslist2.push(obj);
      }
      this.reduForm.goodlists1 = this.rulegoodslist2;

      this.$forceUpdate();

      if (!data) {
        return false;
      }
      this.$refs.reduForm.validateField("goodlists1");
    },
    //接收商品数据 商品2
    listentgoodDatafuc3: function(data) {
      this.rulegoodslist3 = [];
      for (let item in data) {
        let obj = {};
        obj.specIds = data[item].hasOwnProperty("specsId")
          ? data[item].specsId.join(",")
          : "";
        (obj.goodsId = data[item].id), this.rulegoodslist3.push(obj);
      }
      this.reduForm.goodlists2 = this.rulegoodslist3;

      this.$forceUpdate();

      if (!data) {
        return false;
      }
      this.$refs.reduForm.validateField("goodlists2");
    },
    //接收赠品数据
    listentgoodDatafuc1: function(data) {
      this.rulegoodslist1 = [];
      for (let item in data) {
        let obj = {};
        (obj.goodsId = data[item].id), (obj.goodsName = data[item].title);
        obj.pic = data[item].thumb;
        this.rulegoodslist1.push(obj);
      }

      this.reduForm.giftlists = this.rulegoodslist1;
      this.$forceUpdate();

      if (!data) {
        return false;
      }
      this.$refs.reduForm.validateField("giftlists");
    },

    //新增数据接口
    addFull(params) {
      this.loading=true;
      let SepcVoList1 = [];
      let giftList = [];
      let SepcVoList2 = [];

      this.rulegoodslist.map((v, i) => {
        let newObj = {
          goodsId: v.goodsId,
          specIds: v.specIds
        };
        SepcVoList1.push(newObj);
      });

      this.rulegoodslist2.map((v, i) => {
        let newObj = {
          goodsId: v.goodsId,
          specIds: v.specIds
        };
        SepcVoList1.push(newObj);
      });

      this.rulegoodslist3.map((v, i) => {
        let newObj = {
          goodsId: v.goodsId,
          specIds: v.specIds
        };
        SepcVoList2.push(newObj);
      });

      //选择赠品
      this.rulegoodslist1.map((v, i) => {
        let newObj = {
          goodsId: v.goodsId,
          goodsName: v.goodsName,
          pic: v.pic
        };
        giftList.push(newObj);
      });

      let timeAry = this.reduForm.time.map((v, i) => {
        return (v = utils.timeFun(new Date(v).getTime()));
      });

      let selectrule = this.reduForm.type == 3 ? this.cusAry : this.cusAry2;

      let allowKey = false;
      // 正整数的匹配
      let regNum = /^\+?[0-9][0-9]*$/;
      // 正浮点数
      let regMoney = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;

      if (this.reduForm.type == 2) {
        console.log(selectrule[0].maxAmount);
        // 赠送的数量限制
        if (!regNum.test(selectrule[0].maxAmount) && selectrule[0].maxAmount) {
          allowKey = true;
          this.$Message.error("获取规则设置错误");
          return false;
        }
      } else if (this.reduForm.type == 3) {
        // 赠送的数量限制
        if (!regNum.test(selectrule[0].alreadAmount)) {
          allowKey = true;
          this.$Message.error("获取规则设置错误");
          return false;
        }
        if (!regNum.test(selectrule[0].maxAmount)) {
          allowKey = true;
          this.$Message.error("获取规则设置错误");
          return false;
        }
        if (!regNum.test(selectrule[0].songAmount)) {
          allowKey = true;
          this.$Message.error("获取规则设置错误");
          return false;
        }
      }

      if (allowKey) {
        return false;
      }

      marking
        .singleGiftSave({
          titles: this.reduForm.titles,
          time: this.reduForm.time,
          startTime:
            this.reduForm.startEnd.length == 0 ||
            this.reduForm.startEnd[0] == ""
              ? "00:00:01"
              : this.reduForm.startEnd[0],
          time: timeAry,
          endTime:
            this.reduForm.startEnd.length == 0 ||
            this.reduForm.startEnd[1] == ""
              ? "23:59:59"
              : this.reduForm.startEnd[1],
          weekdays:
            this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
          activityObject: this.reduForm.activityObject,
          goodsMode: this.reduForm.goodsMode,
          type: this.reduForm.type,
          description: this.reduForm.description,
          giftList: giftList,

          SepcVoList1: SepcVoList1,
          SepcVoList2: SepcVoList2,
          smallProgram: "1",

          selectrule: selectrule
        })
        .then(res => {
          if (res.code == 1) {
            this.backList();
            this.loading=false;
            this.$Message.success("保存成功");
          } else {
            this.loading=false;
            this.$Message.error(res.message);
          }
        });
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
      this.weekdayList = list;
      this.show = false;
    },

    handleClick: function(item, index) {
      this.reduForm.weekdays[index].flag = !this.reduForm.weekdays[index].flag;
    },

    save(reduForm) {
      this.$refs.reduForm.validate(valid => {
        if (valid) {
          if (!this.reduForm.weekdays) {
            this.$Message.error("活动周期不能为空");
            return false;
          }
          if (!this.reduForm.startEnd) {
            this.$Message.error("活动时间段不能为空");
            return false;
          }
          this.addFull();
        }
      });
    },
    backList() {
      this.$router.push("/@/views/marking/GiftPresentation/GiftPresentation");
    },
    prev() {
      this.$router.go(-1);
    },
    //清空数据
    restore(name) {
       this.$refs[name].resetFields();
      this.showData = [];
      this.showData1 = [];
      this.showData2 = [];
      this.rulegoodslist = [];
      this.rulegoodslist1 = [];
      this.rulegoodslist2 = [];
      this.rulegoodslist3 = [];
      this.giftlists = [];
      this.reduForm = {
        smallProgram: "1",
        //商品
        selectrule: "",
        giftList: [],
        //活动名称
        titles: "",
        //活动对象
        activityObject: "1",
        //活动商品
        goodsMode: "1",
        //优惠类型
        type: "1",
        //时间
        time: [],
        goodlists: [],
        goodlists1: [],
        goodlists2: [],
        giftlists: [],
        //活动周期
        weekdays: [
          {
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
        //消费满件、元
        consumptionAmount: "",
        //优惠金额
        couponAmount: ""
      };
    }
  },
  activated() {
    this.restore('reduForm');
  },
  watch: {
    "reduForm.titles": function(val) {
      var that = this;
      that._data.lenght = val.length;
    }
  }
};
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
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  padding-left: 10px;
  background: #f1f1f1;
}

.container .inset-content {
  padding: 80px 0 80px 50px;
  background: #fff;
}

.container .high-opation {
  padding: 10px;
  cursor: pointer;
  color: #0083b0;
}

.container .set {
  width: 600px;
  padding: 20px 20px 20px 10px;
  border: 1px dashed #aeaeae;
  background: #f2f2f2;
}

.container .formBtn {
  width: 200px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}

.container .comBtn {
  margin: 0 5px;
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

.limitLength {
  position: absolute;
  margin-left: 10px;
  color: #bbb;
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
