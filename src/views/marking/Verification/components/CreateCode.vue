<style lang="less" scoped>
@import "./CreateCode.less";
</style>

<template>
  <div class="container">
    <div class="redu-box">
      <!-- 内容区域 -->
      <div class>
        <!-- 内容区域内盒子 -->
        <div class="redu-inset">
          <!-- 内容标题 -->
          <div class="currentTitle">
            验证码赠礼 /
            <label>{{role == 1 ? '创建' : '编辑'}}验证码赠礼</label>
          </div>
          <Card>
            <Form
              :label-width="150"
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
                  <span class="limitLength">{{titlesLength}}/20</span>
                </FormItem>
                <FormItem label="活动时间" prop="time">
                  <DatePicker
                    type="datetimerange"
                    :editable="false"
                    v-model="reduForm.time"
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
                    <!-- <Radio label="3">会员等级</Radio> -->
                  </RadioGroup>
                </FormItem>
                <!-- <FormItem label="会员等级" v-if="reduForm.activityObject==='3'" prop="member">
                  <Select style="width:300px" placeholder="请选择会员等级">
                    <Option value="" v-for="item in reduForm.grade" :key="item.value">{{item.label }}></Option>
                  </Select>
                </FormItem>-->
                <FormItem label="活动商品" prop="goodsMode">
                  <RadioGroup v-model="reduForm.goodsMode">
                    <Radio label="1">全部商品</Radio>
                    <Radio label="2">指定商品</Radio>
                    <Radio label="3">不参与商品</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动商品" prop="showData" v-if="reduForm.goodsMode === '2'">
                  <coupon-addgood @listentgoodData="listentgoodDatafuc($event)" :options="showData"></coupon-addgood>
                </FormItem>
                <FormItem label="活动商品" prop="showDataDel" v-if="reduForm.goodsMode === '3'">
                  <coupon-addgood
                    @listentgoodData="listentgoodDatafucDel($event)"
                    :options="showDataDel"
                  ></coupon-addgood>
                </FormItem>

                <FormItem label="核销类型" prop="type" style="margin-bottom:0px;">
                  <RadioGroup v-model="reduForm.type" @on-change="changeType">
                    <Radio label="1">唯一验证码</Radio>
                    <Radio label="2">批量验证码</Radio>
                  </RadioGroup>
                  <div class="tipsicon" v-if="reduForm.type == 1">在活动有效期内，该验证码始终有效。</div>
                  <div class="tipsicon" v-else>在活动有效期内，每个验证码仅可核销一次。</div>
                </FormItem>
                <FormItem prop="notice" v-if="reduForm.type == 1">
                  <Input
                    v-model="reduForm.notice"
                    placeholder="请输入验证码，不可使用汉字、空格及特殊符号"
                    style="width: 350px;"
                  ></Input>
                </FormItem>
                <FormItem prop="notice" v-else>
                  <Input v-model="reduForm.notice" style="width: 0px;opacity:0;"></Input>
                  <Button
                    v-if="!reduForm.notice"
                    type="primary"
                    class="comBtn"
                    style="position:relative;"
                  >
                    + 上传验证码
                    <input
                      ref="file"
                      type="file"
                      @change="fileChange"
                      style="opacity:0;width:100%;height:100%;position:absolute;top:0;left:0;"
                    />
                  </Button>
                  <div v-else>
                    <a :href="reduForm.notice">{{noticeUrl}}</a>
                    <span class="delete-action" @click="removeCsv">删除</span>
                  </div>
                  <div>
                    <a href="https://hrecminiprogramstorage.blob.core.chinacloudapi.cn/test-mini/file/01d4098ef6129b8a2d63c9863c9793f9.csv">下载模板</a>
                  </div>
                </FormItem>
                <FormItem label="活动规则说明" prop="ruleContent">
                  <Input
                    v-model="reduForm.ruleContent"
                    type="textarea"
                    :maxlength="100"
                    :rows="4"
                    placeholder="请输入活动规则说明"
                    style="width: 350px;"
                  ></Input>
                  <span class="limitLength">{{ruleLength}}/100</span>
                </FormItem>
                <FormItem label="选择赠品" prop="containerData">
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
          <Button type="primary" class="comBtn" :loading="btnloading" @click.native="save('reduForm')">保存</Button>
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
              <Button
                class="week-btn"
                v-for="(item,index) in reduForm.weekdays"
                :disabled="item.disable"
                :key="index"
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
                v-model="reduForm.startEnd"
                type="timerange"
                placement="bottom-end"
                placeholder="请选择时间段"
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
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils";
import marking from "@/api/request/marking";
import couponAddgood from "@/components/couponAddgood/couponAddgood";
import addGift from "@/components/addGood/addGift";
import goods from "@/api/request/goods";
import store from "@/store";

export default {
  name: "createReduction",
  components: {
    couponAddgood,
    addGift
  },
  data() {
    return {
      btnloading:false,
      role: 1,
      id: 0,
      noticeUrl: "",
      dateIntArr: [],
      titlesLength: 0,
      ruleLength: 0,
      showData: [],
      showDataDel: [],
      containerData: [],
      weekdayList: [],
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      show: false,

      reduForm: {
        titles: "",
        price: "",
        rule: "1",
        activityObject: "1",
        smallProgram: "1",
        goodsMode: "1",
        type: "1",
        time: [],
        startEnd: [],
        notice: "",
        noticeUrl: "",
        grade: "1",
        ruleContent: "",
        showData: [],
        showDataDel: [],
        containerData: [],
        weekdayList: [],
        dateIntArr: [],

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
            required: true,
            message: "活动时间不能为空"
          },
          {
            pattern: null,
            type: "array",
            trigger: "change"
          }
        ],
        notice: [
          {
            required: true,
            message: "验证码不能为空"
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
        showData: [
          {
            required: true,
            message: "活动商品不能为空"
          }
        ],
        showDataDel: [
          {
            required: true,
            message: "活动商品不能为空"
          }
        ],
        showData: [
          {
            required: true,
            message: "活动商品不能为空"
          }
        ],
        containerData: [
          {
            required: true,
            message: "赠品不能为空"
          }
        ]
      }
    };
  },
  activated() {
    this.init();
  },
  watch: {
    "reduForm.titles"() {
      let length = this.reduForm.titles.length;
      this.titlesLength = length;
    },
    "reduForm.ruleContent"() {
      let length = this.reduForm.ruleContent.length;
      this.ruleLength = length;
    }
  },
  methods: {
    init() {
      let _this = this;
      let role = _this.$route.query.role;
      let id = _this.$route.query.id;
      _this.role = role;
      _this.id = id;
      this.restore();
      if (role > 1) {
        this.getData();
      }
    },

    // 删除验证码
    removeCsv() {
      this.noticeUrl = "";
      this.reduForm.notice = "";
    },

    changeType() {
      this.noticeUrl = "";
      this.reduForm.notice = "";
    },

    // 详情
    getData() {
      marking
        .codeGiftDetail({
          id: this.id
        })
        .then(res => {
          this.reduForm.time = [
            goodsUtilsFun.timeFun(new Date(res.data.expiryBeginTime).getTime()),
            goodsUtilsFun.timeFun(new Date(res.data.expiryEndTime).getTime())
          ];
          this.weekdayList = res.data.weekdays.split(",");
          this.reduForm.titles = res.data.titles;
          this.reduForm.activityObject = res.data.activityObject + "";
          this.reduForm.goodsMode = res.data.goodsMode + "";
          this.reduForm.type = res.data.type + "";
          this.reduForm.ruleContent = res.data.description;
          this.reduForm.smallProgramItem = "" + res.data.smallProgram;
          this.reduForm.notice = res.data.CoderuleList.length == 0 ? "" : res.data.type == 1 ? res.data.CoderuleList[0].code : res.data.CoderuleList[0].codeOpenid;
          this.reduForm.startEnd = [
            new Date("2019-6-11 " + res.data.startTime),
            new Date("2019-6-11 " + res.data.endTime)
          ];
          this.viewModel(
            goodsUtilsFun.timeFun(new Date(res.data.expiryBeginTime).getTime()),
            goodsUtilsFun.timeFun(new Date(res.data.expiryEndTime).getTime())
          );
          this.getSku(res.data.goodsCouponList);

          if (this.reduForm.type == 2) {
            if (!res.data.CoderuleList[0].codeOpenid) {
              this.noticeUrl = "";
            } else {
              let obj = res.data.CoderuleList[0].codeOpenid.lastIndexOf("/");
              let noticeUrl = res.data.CoderuleList[0].codeOpenid.substr(obj + 1);
              this.noticeUrl = noticeUrl;
            }
          }
        });
    },
    //高级选项渲染
    viewModel(start, end) {
      console.log(start, end);
      var day1 = new Date(start);
      var day2 = new Date(end);
      var dateIntArr = [];
      var dateArr = this.getDateArr(start.split(" ")[0], end.split(" ")[0]);
      console.log(dateArr);
      for (var i in dateArr) {
        dateIntArr.push(new Date(dateArr[i]).getDay());
      }
      if ((day2 - day1) / (1000 * 60 * 60 * 24) >= 6) {
        //大于6天所有可点
        console.log("大于6", dateIntArr, this.reduForm.weekdays);
        for (var j in this.reduForm.weekdays) {
          this.reduForm.weekdays[j].disable = false;
        }
      } else {
        console.log("小于6", dateIntArr);
        this.checkWeekdays(dateIntArr);
      }
      for (var i in this.weekdayList) {
        for (var j in this.reduForm.weekdays) {
          if (this.weekdayList[i] == this.reduForm.weekdays[j].id) {
            this.reduForm.weekdays[j].flag = true;
          }
        }
      }

      console.log("weekdays", this.reduForm.weekdays);
    },
    getSku(data) {
      // 指定商品
      let goodsary = [];
      // 赠品
      let gifts = [];

      data.map((v, i) => {
        if (v.goodsType == 1) {
          goodsary.push(v);
        } else if (v.goodsType == 2) {
          gifts.push(v.goodsId);
        }
      });

      // 处理商品

      if (this.reduForm.goodsMode == "2") {
        this.showData = goodsary;
      } else if (this.reduForm.goodsMode == "3") {
        this.showDataDel = goodsary;
      }

      // 处理赠品
      goods
        .selGoodsIds({
          ids: gifts
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
            (obj.goodsName = res.data[i].title), (obj.goodsId = res.data[i].id);
            obj.pic = res.data[i].thumb;
            list.push(obj);
          }
          this.containerData = list;
          this.reduForm.containerData = list;
        });
    },
    changeTime(e) {
      // 判断当前时间处理
      if (new Date(e[0]).getTime() < new Date().getTime()) {
        e[0] = new Date(new Date().getTime() + 300 * 1000).getTime();
        e[0] = goodsUtilsFun.timeFun(e[0]);
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

      console.log(dateIntArr);
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
    //接收商品数据
    listentgoodDatafuc: function(data) {
      let rulegoodslist = [];
      for (let item in data) {
        let obj = {};
        obj.specIds = data[item].hasOwnProperty("specsId")
          ? data[item].specsId.join(",")
          : "";
        (obj.goodsId = data[item].id), rulegoodslist.push(obj);
      }

      this.reduForm.showData = rulegoodslist;

      if(!data){
        return false
      }

      this.$refs.reduForm.validateField('showData');
    },

    //接收商品数据
    listentgoodDatafucDel: function(data) {
      let rulegoodslist = [];

      for (let item in data) {
        let obj = {};
        obj.specIds = data[item].hasOwnProperty("specsId")
          ? data[item].specsId.join(",")
          : "";
        (obj.goodsId = data[item].id), rulegoodslist.push(obj);
      }

      this.reduForm.showDataDel = rulegoodslist;

      if(!data){
        return false
      }

      this.$refs.reduForm.validateField('showDataDel');
    },

    //接收赠品数据
    listentgoodDatafuc1: function(data) {
      let rulegoodslist = [];
      for (let item in data) {
        let obj = {};
        (obj.goodsId = data[item].id), (obj.goodsName = data[item].title);
        obj.pic = data[item].thumb;
        rulegoodslist.push(obj);
      }

      console.log(rulegoodslist);

      this.reduForm.containerData = rulegoodslist;

      if(!data){
        return false
      }

      this.$refs.reduForm.validateField('containerData');
    },

    checkWeekdays(date) {
      console.log(this.reduForm.weekdays);
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
          startTime.getMonth().toString().length == 1
            ? "0" + startTime.getMonth().toString()
            : startTime.getMonth();
        var day =
          startTime.getDate().toString().length == 1
            ? "0" + startTime.getDate()
            : startTime.getDate();
        console.log(year + "-" + month + "-" + day);
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

    //开启
    handleShowClick() {
      console.log(this.reduForm.weekdays);
      for (var i in this.reduForm.weekdays) {
        console.log(
          "星期" +
            this.reduForm.weekdays[i].id +
            this.reduForm.weekdays[i].disable
        );
      }
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

    /**
     * 上传文件
     */
    fileChange(e) {
      let _this = this;
      let file = e.target.files[0];
      console.log(file)
      if(file.type != 'application/vnd.ms-excel'){
        this.$Message.error('请上传csv格式的文件')
        return false
      }
      let userInfo = this.$store.getters.user;
      userInfo = JSON.parse(userInfo);

      _this.loading = true;

      let formData = new FormData();
      formData.append("file", file);
      formData.append("id", "test-mini");
      formData.append("type", 1);
      formData.append("uid", userInfo.id);
      formData.append("fileType", "file");
      formData.append("token", store.getters.token);
      formData.append("tenantId",store.getters.tenantId)

      api.uploadFile("POST", formData).then(res => {
        _this.loading = false;
        console.log(res);
        if (res.code == 1) {
          _this.reduForm.notice = res.data.imgAddress;
          _this.$Message.success("上传成功");
          _this.noticeUrl = res.data.name;
          // _this.getImg(_this.selectedId);
        } else {
          _this.$Message.error(res.message);
        }
      });
    },

    handleClick: function(item, index) {
      item.flag = !item.flag;
    },

    save(reduForm) {
      this.$refs.reduForm.validate(valid => {
        if (valid) {
          if (this.titlesLength > 20) {
            this.$Message.error("活动名称超过20个字符");
            return false;
          }

          if (this.ruleLength > 100) {
            this.$Message.error("活动规则说明超过100个字符");
            return false;
          }

          let showData = []; // 活动商品
          this.reduForm.showData.map((v, i) => {
            let newObj = {
              goodsId: v.goodsId,
              specIds: v.specIds
            };
            showData.push(newObj);
          });

          let showDataDel = []; // 不参与活动商品
          this.reduForm.showDataDel.map((v, i) => {
            let newObj = {
              goodsId: v.goodsId,
              specIds: v.specIds
            };
            showDataDel.push(newObj);
          });

          let containerData = []; // 赠品
          this.reduForm.containerData.map((v, i) => {
            containerData.push(v);
          });

          let timeAry = this.reduForm.time.map((v, i) => {
            return (v = goodsUtilsFun.timeFun(new Date(v).getTime()));
          });
          let goodSpecList;

          if (this.reduForm.goodsMode == 2) {
            goodSpecList = showData;
          } else {
            goodSpecList = showDataDel;
          }
          let startEnd = this.reduForm.startEnd;

          if(this.role == 2){
            startEnd = startEnd.map((v, i) => {
              return v = goodsUtilsFun.timeFun(new Date(v).getTime())
            })
          }

          let startTime, endTime;

          if (this.reduForm.startEnd.length == 0 || this.reduForm.startEnd[0] == "") {
            startTime = "00:00:01";
          } else if (this.reduForm.startEnd.length != 0 && this.reduForm.startEnd[0] != "") {
            if(this.role == 2){
              startTime = startEnd[0].split(' ')[1];
            }else{
              startTime = startEnd[0];
            }
          }

          if (this.reduForm.startEnd.length == 0 || this.reduForm.startEnd[1] == "") {
            endTime = "23:59:59";
          } else if (this.reduForm.startEnd.length != 0 && this.reduForm.startEnd[1] != "") {
            if(this.role == 2){
              endTime = startEnd[1].split(' ')[1];
            }else{
              endTime = startEnd[1];
            }
            
          }

          let rawData = {
            titles: this.reduForm.titles,
            time: timeAry,
            startTime: startTime,
            endTime: endTime,
            weekdays: this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
            activityObject: this.reduForm.activityObject,
            goodsMode: this.reduForm.goodsMode,
            type: this.reduForm.type,
            description: this.reduForm.ruleContent,
            smallProgram: this.reduForm.smallProgram,
            goodSpecList: goodSpecList,
            songGoodsIds: containerData
          };

          if(this.reduForm.type == 1){
            rawData = {
              ...rawData,
              codeList:[{ code: this.reduForm.notice }]
            }
          }else{
            rawData = {
              ...rawData,
              codeList:[{ codeOpenid: this.reduForm.notice }]
            }
          }

          if (this.role == 1) {
            // 创建
            this.btnloading=true;
            marking.codeGiftSave(rawData).then(res => {
              if (res.code == 1) {
                this.btnloading=false;
                this.$Message.success("保存成功");
                this.prev();
              } else {
                this.$Message.error(res.message);
              }
            });
          } else {
            // 更新
            this.btnloading=true;
            marking
              .codeGiftUpdate({
                ...rawData,
                id: this.id
              })
              .then(res => {
                if (res.code == 1) {
                  this.btnloading=false;
                  this.$Message.success("保存成功");
                  this.prev();
                } else {
                  this.$Message.error(res.message);
                }
              });
          }
        }
      });
    },
    prev() {
      this.$router.go(-1);
    },
    //清空数据
    restore() {
      this.$refs.reduForm.resetFields();
      this.containerData = []
      this.showDataDel = []
      this.showData = []
      this.reduForm = {
        titles: "",
        price: "",
        rule: "1",
        activityObject: "1",
        smallProgram: "1",
        goodsMode: "1",
        type: "1",
        time: [],
        notice: "",
        grade: "1",
        ruleContent: "",
        showData: [],
        showDataDel: [],
        containerData: [],

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
        ]
      };
    }
  }
};
</script>
