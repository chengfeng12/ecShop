<template>
  <div class="container">
    <div class="redu-box">
      <div class="redu-inset">
        <div class="currentTitle">
          首购礼/
          <label>编辑首购礼</label>
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
              <FormItem label="活动时间" prop="timess">
                <DatePicker
                  type="datetimerange"
                  :editable="false"
                  :options="optionsTime"
                  @on-change="changeTime"
                  :value="reduForm.timess"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择日期"
                  style="width: 350px"
                ></DatePicker>
                <span class="high-opation" @click="handleShowClick">高级选项</span>
              </FormItem>
              <FormItem label="活动渠道" prop="smallProgramItem">
                <Select style="width:300px" v-model="reduForm.smallProgramItem">
                  <Option
                    v-for="item in reduForm.smallProgram"
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
                  <Radio :label="1">全部用户</Radio>
                  <Radio :label="2">仅注册会员</Radio>
                  <!-- <Radio :label="3">会员等级</Radio> -->
                </RadioGroup>
              </FormItem>
              <FormItem label="会员等级" v-if="reduForm.activityObject=='3'" prop="member">
                <Select style="width:300px" placeholder="请选择会员等级">
                  <Option value></Option>
                </Select>
              </FormItem>
              <FormItem label="活动商品" prop="goodsMode">
                <RadioGroup v-model="reduForm.goodsMode">
                  <Radio :label="1">全部商品</Radio>
                  <Radio :label="2">指定商品</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="活动商品" prop="goodlists" v-if="reduForm.goodsMode == '2'">
                <coupon-addgood @listentgoodData="listentgoodDatafuc($event)" :options="showData"></coupon-addgood>
              </FormItem>
              <FormItem label="获取类型" prop="type">
                <RadioGroup v-model="reduForm.type">
                  <Radio :label="1">第一单获取</Radio>
                  <Radio :label="2">所有订单获取</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="选择赠品" prop="giftlists">
                <add-gift
                  @listentgoodData="listentgoodDatafuc1($event)"
                  :selectGoods="containerData"
                  res="+选择赠品"
                ></add-gift>
              </FormItem>
            </div>
          </Form>
        </Card>
      </div>
      <!--保存 取消 -->
      <div class="formBtn">
        <Button type="primary" class="comBtn" :loading="loading" @click.native="save(reduForm)">保存</Button>
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
                style="width: 168px"
                v-model="reduForm.startEnd"
                @on-change="reduForm.startEnd=$event"
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
import marking from "@/api/request/marking";
import goodsUtilsFun from "@/utils/goodsUtils";
import goods from "@/api/request/goods";
import utils from "@/utils/goodsUtils";
import couponAddgood from "@/components/couponAddgood/couponAddgood";

export default {
  name: "EditPurchase",
  components: {
    couponAddgood,
    addGift
  },
  data() {
    return {
      loading:false,
      dateIntArr: [],
      rulegoodslist: [],
      arrList: [],
      rulegoodslist1: [],
      showData: [],
      containerData: [],
      weekdayList: [],
      lenght: 0,
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      // 商品添加要接受的值
      selectgoods: [],
      custonized_descs: [],
      model1: "",
      show: false,
      currentIndex: 0,
      //暂存ID
      tempId: "",
      // 临时数组
      suzu: [],
      //  smallProgram:'',
      reduForm: {
        smallProgram: [
          {
            value: "1", // 后台传过来的1，2,3
            label: "微信小程序"
          }
        ],
        smallProgramItem: "1",
        //赠品ID
        giftsId: "",
        //活动名称
        titles: "",
        //活动对象
        activityObject: "",
        //活动商品
        goodsMode: "",
        //优惠类型
        type: "",
        //商品ID
        goodsid: "",
        goodsName: "",
        pic: "",
        //商品规格ID
        specIds: "",
        //库存
        repertory: "",
        //图片
        imgShop: "",
        //店铺ID
        shopId: "",
        //时间
        time: [],
        timess: [],
        // 结束时间
        expiryEndTime: "",
        // 开始时间
        expiryBeginTime: "",
        startEnd: [],

        giftlists: [],
        goodlists: [],

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
        // 对于单个字段来说，通常需要多个验证规则，这些规则以数组展示
        titles: [
          {
            required: true,
            message: "活动名称不能为空",
            trigger: "blur"
          }
        ],
        timess: [
          {
            type: 'array',
            required:true,
            fields: {
              0: {required: true, message: '活动时间不能为空'},
              1: {required: true, message: '活动时间不能为空'}
            },
            message:'活动时间不能为空'
          }
        ],
        smallProgramItem: [
          {
            required: true,
            message: "活动渠道不能为空",
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
    //高级选项判断
    changeTime(e) {
      if (new Date(e[0]).getTime() < new Date().getTime()) {
        e[0] = new Date(new Date().getTime() + 300 * 1000).getTime();
        e[0] = utils.timeFun(e[0]);
      }
      this.reduForm.timess = e;
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
      this.weekdayList = [];
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
    //高级选项渲染
    viewModel(start, end) {
      var day1 = new Date(start);
      var day2 = new Date(end);
      var dateIntArr = [];
      var dateArr = this.getDateArr(start.split(" ")[0], end.split(" ")[0]);
      for (var i in dateArr) {
        dateIntArr.push(new Date(dateArr[i]).getDay());
      }

      if ((day2 - day1) / (1000 * 60 * 60 * 24) >= 6) {
        //大于6天所有可点
        for (var j in this.reduForm.weekdays) {
          this.reduForm.weekdays[j].disable = false;
        }
      } else {
        this.checkWeekdays(dateIntArr);
      }
      for (var i in this.weekdayList) {
        for (var j in this.reduForm.weekdays) {
          if (this.weekdayList[i] == this.reduForm.weekdays[j].id) {
            this.reduForm.weekdays[j].flag = true;
          }
        }
      }
    },

    // 获取商品的规格
    getManJianGoods(id) {
      let _this = this;
      marking
        .firstPurchaseDetailGoods({
          firstPurchaseId: id
        })
        .then(res => {
          if (res.code == 1) {
            _this.showData = res.data;
            _this.reduForm.goodlists = res.data;
          }
        });
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

    //优惠接口
    fullDetail() {
      marking
        .fullGiftDetailGiftGift({
          fullGiftId: this.$route.query.id
        })
        .then(res => {
          let _this = this;
          if (res.code == 1) {
            _this.cusAry = res.data;
          } else {
            $Message.error(res.message);
          }
        });
    },

    //接收赠品数据
    listentgoodDatafuc1: function(data) {
      this.rulegoodslist1 = [];
      for (let item in data) {
        let obj = {};
        obj.giftsId = data[item].id;
        obj.goodsName = data[item].goodsName;
        obj.pic = data[item].pic;
        this.rulegoodslist1.push(obj);
      }

      this.reduForm.giftlists = this.rulegoodslist1;

      if (!data) {
        return false;
      }

      this.$refs.reduForm.validateField("giftlists");
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

      if (!data) {
        return false;
      }

      this.$refs.reduForm.validateField("goodlists");
    },

    // 渲染礼商品明细
    editDetailGoods(id) {
      var arr = [];
      marking
        .firstPurchaseDetailGoods({
          firstPurchaseId: this.$route.query.id
        })
        .then(res => {
          if (res.code == 1) {
            this.selGoodsIds(res.data);
          } else {
            this.$Message.error(res.message);
          }
        });
    },

    // 渲染礼商品明细数据整合
    selGoodsIds(data) {
      var arr = [];
      var list = [];
      if (data.length > 0) {
        for (let i in data) {
          arr.push(data[i].goodsId);
        }
      }
      goods
        .selGoodsIds({
          ids: arr
        })
        .then(res => {
          for (var i in res.data) {
            let obj = {};
            obj.thumb = res.data[i].thumb;
            obj.title = res.data[i].title;
            list.push(obj);
          }
          this.arrList = list;
        });
    },

    //批量查询赠品信息
    editcoupon() {
      let containerData = [];
      marking
        .firstPurchaseDetailCouponId({
          firstPurchaseId: this.$route.query.id
        })
        .then(res => {
          let _this = this;
          if (res.code == 1) {
            let arr = [];
            res.data.map((v, i) => {
              arr.push(v.giftsId);
            });
            _this.containerData = arr;

            goods
              .selGoodsIds({
                ids: _this.containerData
              })
              .then(res => {
                let list = [];
                for (let i in res.data) {
                  let obj = {};
                  obj.id = res.data[i].id;
                  obj.thumb = res.data[i].thumb;
                  obj.price = res.data[i].price;
                  obj.title = res.data[i].title;
                  obj.vituralStock = res.data[i].vituralStock;
                  obj.goodsName = res.data[i].title;
                  obj.pic = res.data[i].thumb;
                  list.push(obj);
                }
                _this.containerData = list;
                _this.reduForm.giftlists = res.data;
              });
          } else {
            _this.$Message.error(res.message);
          }
        })
        .catch(err => {});
    },

    //首购明细数据接口
    editGroup() {
      var that = this;
      console.log(this.$route.query.id);
      marking
        .firstPurchaseDetail({
          id: this.$route.query.id
        })
        .then(res => {
          if (res.code == 1) {
            this.reduForm.timess = [
              goodsUtilsFun.timeFun(
                new Date(res.data.expiryBeginTime).getTime()
              ),
              goodsUtilsFun.timeFun(new Date(res.data.expiryEndTime).getTime())
            ];
            this.reduForm.time = [
              goodsUtilsFun.timeFun(
                new Date(res.data.expiryBeginTime).getTime()
              ),
              goodsUtilsFun.timeFun(new Date(res.data.expiryEndTime).getTime())
            ];
            this.weekdayList = res.data.weekdays.split(",");
            this.reduForm.activityObject = res.data.activityObject;
            this.reduForm.type = res.data.type;
            this.reduForm.titles = res.data.titles;
            this.reduForm.goodsMode = res.data.goodsMode;
            this.reduForm.goodsid = res.data.goodsid;
            this.reduForm.specIds = res.data.specIds;
            this.reduForm.giftsId = res.data.giftsId;
            this.reduForm.expiryBeginTime = res.data.expiryBeginTime;
            this.reduForm.expiryEndTime = res.data.expiryEndTime;
            this.reduForm.smallProgramItem = "" + res.data.smallProgram;
            this.reduForm.startEnd = [
              new Date("2019-6-11 " + res.data.startTime),
              new Date("2019-6-11 " + res.data.endTime)
            ];
            this.viewModel(
              goodsUtilsFun.timeFun(
                new Date(res.data.expiryBeginTime).getTime()
              ),
              goodsUtilsFun.timeFun(new Date(res.data.expiryEndTime).getTime())
            );
            this.editDetailGoods(this.$route.query.id);
            this.editcoupon();
            this.getManJianGoods(this.$route.query.id);
          } else {
            $Message.error(res.message);
          }
        });
    },

    //修改数据接口
    editFull(params) {
      this.loading=true;
      let selectgoods = [];
      let purchaseRuleList = [];
      this.rulegoodslist.map((v, i) => {
        let newObj = {
          goodsId: v.goodsId,
          specIds: v.specIds
        };
        selectgoods.push(newObj);
      });
      this.rulegoodslist1.map((v, i) => {
        let newObj = {
          goodsName: v.goodsName,
          pic: v.pic,
          giftsId: v.giftsId
        };
        purchaseRuleList.push(newObj);
      });
      let timeAry = this.reduForm.timess.map((v, i) => {
        return (v = utils.timeFun(new Date(v).getTime()));
      });
      let temp = this.reduForm.startEnd[0];
      this.reduForm.startEnd =
        temp == undefined || temp.length == undefined
          ? []
          : this.reduForm.startEnd;
      marking
        .firstPurchaseUpdate({
          endTime:
            this.reduForm.startEnd.length == 0 ||
            this.reduForm.startEnd[1] == ""
              ? "23:59:59"
              : this.reduForm.startEnd[1],
          weekdays:
            this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
          startTime:
            this.reduForm.startEnd.length == 0 ||
            this.reduForm.startEnd[0] == ""
              ? "00:00:01"
              : this.reduForm.startEnd[0],
          id: this.$route.query.id,
          titles: this.reduForm.titles,
          time: timeAry,
          activityObject: this.reduForm.activityObject,
          goodsMode: this.reduForm.goodsMode,
          type: this.reduForm.type,
          goodsid: this.reduForm.goodsid,
          specIds: this.reduForm.specIds,
          giftsId: this.reduForm.giftsId,
          selectgoods: selectgoods,
          purchaseRuleList: purchaseRuleList,
          smallProgram: this.reduForm.smallProgramItem,
          selectrule: this.reduForm.type == 1 ? this.cusAry : this.cusAry2
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

    addCustomizeDesc(index) {
      this.custonized_descs.push(1);
    },

    //开启
    handleShowClick() {
      this.show = true;
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
    //关闭
    handleCloseClick() {
      this.show = false;
    },
    handleClick: function(item, index) {
      this.reduForm.weekdays[index].flag = !this.reduForm.weekdays[index].flag;
    },

    save(reduForm) {
      this.$refs.reduForm.validate(valid => {
        if (valid) {
          this.editFull(reduForm);
        }
      });
    },
    backList() {
      this.$router.push("/@/views/marking/purchase/Purchase");
    },
    prev() {
      this.$router.go(-1);
    },
    init: function() {
      this.editGroup(this.id);
    },
    restore() {
      this.containerData = [];
      this.showData = [];
      this.reduForm = {
        dateIntArr: [],
        rulegoodslist: [],
        arrList: [],
        rulegoodslist1: [],
        showData: [],
        containerData: [],
        weekdayList: [],
        lenght: 0,
        optionsTime: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        // 商品添加要接受的值
        selectgoods: [],
        custonized_descs: [],
        model1: "",
        show: false,
        currentIndex: 0,
        //暂存ID
        tempId: "",
        // 临时数组
        suzu: [],
        //  smallProgram:'',
        reduForm: {
          smallProgram: [
            {
              value: "1", // 后台传过来的1，2,3
              label: "微信小程序"
            }
          ],
          smallProgramItem: "1",
          //赠品ID
          giftsId: "",
          //活动名称
          titles: "",
          //活动对象
          activityObject: "",
          //活动商品
          goodsMode: "",
          //优惠类型
          type: "",
          //商品ID
          goodsid: "",
          goodsName: "",
          pic: "",
          //商品规格ID
          specIds: "",
          //库存
          repertory: "",
          //图片
          imgShop: "",
          //店铺ID
          shopId: "",
          //时间
          time: [],
          timess: [],
          // 结束时间
          expiryEndTime: "",
          // 开始时间
          expiryBeginTime: "",
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
        }
      };
    }
  },
  activated() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.init();
    } else {
      this.restore();
    }
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

.limitLength {
  position: absolute;
  margin-left: 10px;
  color: #bbb;
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
