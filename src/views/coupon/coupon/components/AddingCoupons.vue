<template>
  <div class="container">
    <url-button
      ref="linkselect"
      @SmallProFun="SmallProFun"
      @listenurldata="geturldata"
      :settings="linkSettings"
    ></url-button>
    <img-select
      ref="imgSel"
      class="img-select"
      :options="{typeId: 'image', mode: 'diy'}"
      @listentoptpmfile="couponImgData($event)"
    />
    <div class="redu-box">
      <!-- 面包屑 -->
      <div style="font-size:13px;color:#000;">
        <span v-if="this.role==1">创建优惠券</span>
        <span v-else-if="this.role==2">编辑优惠券</span>
      </div>
      <Card>
        <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="ruleValidate">
          <div class="redu-content">
            <Tabs type="card" :animated="false" v-model="tableName">
              <!-- 优惠券类型 -->
              <TabPane label="基本信息" name="tab1">
                <div class="inset-content">
                  <FormItem label="优惠券类型" prop="couponstype">
                    <Select
                      @on-change="couponstypefuc"
                      style="width:300px;"
                      placeholder="请选择类型"
                      v-model="reduForm.couponstype"
                    >
                      <Option value="1">现金券</Option>
                      <Option value="2">折扣券</Option>
                      <Option value="3">实物券</Option>
                      <Option value="4">赠品券</Option>
                    </Select>
                  </FormItem>

                  <!-- 优惠类型 -->
                  <div v-if="this.reduForm.couponstype==2" key="discount">
                    <FormItem label="享有折扣" prop="discount">
                      <Input v-model="reduForm.discount" style="width: 100px;"></Input>
                      <span style="margin-left: 5px">折</span>
                    </FormItem>
                  </div>

                  <div v-if="this.reduForm.couponstype==1" key="discountprice">
                    <FormItem label="金额" prop="discountprice">
                      <Input v-model="reduForm.discountprice" style="width: 100px;"></Input>
                      <span style="margin-left: 5px">元</span>
                    </FormItem>
                  </div>

                  <div v-if="this.reduForm.couponstype==3" key="couponaddgood">
                    <FormItem label="指定商品">
                      <coupon-addgood
                        @listentgoodData="listentGiftDatafuc($event)"
                        :options="showGift"
                      ></coupon-addgood>
                    </FormItem>
                  </div>

                  <div v-if="this.reduForm.couponstype==4" key="gift">
                    <FormItem label="指定赠品">
                      <div style="max-width: 1000px;">
                        <add-gift
                          @listentgoodData="listentData($event)"
                          :options="showGift"
                          res="+选择赠品"
                        ></add-gift>
                      </div>
                    </FormItem>
                  </div>

                  <FormItem label="优惠券名称" prop="couponsname">
                    <Input
                      v-model="reduForm.couponsname"
                      placeholder="不能超过12个字符"
                      :maxlength="12"
                      style="width: 300px;"
                    ></Input>
                  </FormItem>

                  <FormItem label="副标题">
                    <Input
                      v-model="reduForm.subheadname"
                      placeholder="不能超过12个字符"
                      :maxlength="12"
                      style="width: 300px;"
                    ></Input>
                  </FormItem>

                  <div class="couponImg">
                    <div class="couponImg_item">
                      <div class="couponImg_title">
                        <span>优惠券图片</span>
                        <span>未使用</span>
                      </div>

                      <div class="couponImg_content">
                        <span class="couponImg_add" @click="couponImgselect(1)">
                          <Icon type="md-add" />
                        </span>
                        <img v-if="reduForm.donUsePic" :src="reduForm.donUsePic" alt />
                        <span
                          v-if="reduForm.donUsePic"
                          class="couponImg_delete"
                          @click="couponImgDelete(1)"
                        >
                          <i class="ivu-icon ivu-icon-ios-close-circle"></i>
                        </span>
                      </div>
                    </div>

                    <div class="couponImg_item">
                      <div class="couponImg_title">
                        <span>优惠券图片</span>
                        <span>已使用</span>
                      </div>

                      <div class="couponImg_content">
                        <span class="couponImg_add" @click="couponImgselect(2)">
                          <Icon type="md-add" />
                        </span>
                        <img v-if="reduForm.toUsePic" :src="reduForm.toUsePic" alt />
                        <span
                          v-if="reduForm.toUsePic"
                          class="couponImg_delete"
                          @click="couponImgDelete(2)"
                        >
                          <i class="ivu-icon ivu-icon-ios-close-circle"></i>
                        </span>
                      </div>
                    </div>

                    <div class="couponImg_item">
                      <div class="couponImg_title">
                        <span>优惠券图片</span>
                        <span>已过期</span>
                      </div>

                      <div class="couponImg_content">
                        <span class="couponImg_add" @click="couponImgselect(3)">
                          <Icon type="md-add" />
                        </span>
                        <img v-if="reduForm.expiredPic" :src="reduForm.expiredPic" alt />
                        <span
                          v-if="reduForm.expiredPic"
                          class="couponImg_delete"
                          @click="couponImgDelete(3)"
                        >
                          <i class="ivu-icon ivu-icon-ios-close-circle"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <FormItem label="优惠券券号" prop="vouchernumber">
                    <RadioGroup v-model="reduForm.vouchernumber">
                      <Radio style="margin-left: 8px" label="1">系统默认</Radio>
                      <Radio style="margin-left: 8px" label="2">第三方券号</Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem label="使用渠道" prop="channel">
                    <Select style="width:300px;" placeholder="请选择使用渠道" v-model="reduForm.channel">
                      <Option value="1">微信小程序</Option>-
                    </Select>
                  </FormItem>

                  <div class="validity-div">
                    <div class="validity-left">
                      <FormItem label="有效期" prop="timeselect">
                        <RadioGroup
                          v-model="reduForm.timeselect"
                          vertical
                          @on-change="timeselectfuc(reduForm.timeselect)"
                        >
                          <div class="formItem-div">
                            <Radio label="1">固定有效期</Radio>
                          </div>

                          <div class="formItem-div">
                            <Radio style="margin-top:25px;" label="2">获得当日起</Radio>
                          </div>
                          <div class="formItem-div">
                            <Radio style="margin-top:25px;" label="3">获得次日起</Radio>
                          </div>
                        </RadioGroup>
                      </FormItem>
                    </div>

                    <div class="validity-right">
                      <FormItem
                        :label-width="0"
                        :rules="[
                          {
                            type: 'array',
                            required:(!this.fixationtimeflag),
                            fields: {
                              0: {required: !this.fixationtimeflag, message: '请输入固定有效期'},
                              1: {required: !this.fixationtimeflag, message: '请输入固定有效期'}
                            },
                            message:'请输入固定有效期'
                          }
                        ]"
                        prop="fixationtime"
                      >
                        <DatePicker
                          type="datetimerange"
                          :disabled="fixationtimeflag"
                          format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择日期"
                          :editable="false"
                          @on-change="timechange"
                          :options="optionsTime"
                          :value="reduForm.fixationtime"
                          style="width: 300px;margin-left: 20px"
                        ></DatePicker>
                      </FormItem>

                      <FormItem
                        :label-width="0"
                        :rules="{required:(!this.thatdaytimeflag),message:'天数不能为空且必须是一个正整数', pattern: /^[1-9]\d*$/,}"
                        prop="thatdaytime"
                      >
                        <Input
                          v-model="reduForm.thatdaytime"
                          :disabled="thatdaytimeflag"
                          style="width: 150px;margin-left: 20px"
                        ></Input>&nbsp;天内有效&nbsp;&nbsp;
                        <span>(不能输入为0，空为不限时间使用，该券长期有效)</span>
                      </FormItem>

                      <FormItem
                        :label-width="0"
                        :rules="{required:(!this.morrowtimeflag),message:'天数不能为空且必须是一个正整数',pattern: /^[1-9]\d*$/,}"
                        prop="morrowtime"
                      >
                        <Input
                          v-model="reduForm.morrowtime"
                          :disabled="morrowtimeflag"
                          style="width: 150px;margin-left: 20px"
                        ></Input>&nbsp;天内有效&nbsp;&nbsp;
                        <span>(不能输入为0，空为不限时间使用，该券长期有效)</span>
                      </FormItem>
                    </div>
                  </div>
                  <FormItem label="库存" prop="stock">
                    <Input v-model="reduForm.stock" style="width: 100px;"></Input>&nbsp;&nbsp;张
                  </FormItem>
                  <FormItem label="优惠说明" prop>
                    <Input
                      type="textarea"
                      v-model="reduForm.textareastate"
                      :rows="4"
                      placeholder
                      style="width: 400px;"
                    />
                  </FormItem>
                </div>
              </TabPane>
              <!-- 使用限制 -->
              <TabPane label="使用限制" name="tab2">
                <div class="inset-content">
                  <FormItem label="使用条件">
                    <RadioGroup @on-change="limitchange()" v-model="reduForm.limit">
                      <span>
                        <Radio style="margin-left: 8px" :label="1">无使用条件</Radio>
                      </span>
                      <span>
                        <Radio style="margin-left: 8px" :label="2">有使用条件</Radio>
                      </span>
                    </RadioGroup>
                  </FormItem>

                  <div class="rule-box" v-if="reduForm.limit==2">
                    <div class="rule-box-part" @click="conditionsfuc">
                      <div v-if="this.reduForm.fulldata.length==2 && andor==1">且</div>
                      <div v-else-if="this.reduForm.fulldata.length==2 && andor==2">或</div>
                    </div>

                    <div class="rule-left">
                      <FormItem prop="fulldata" :label-width="0">
                        <CheckboxGroup @on-change="fullfuc" v-model="reduForm.fulldata">
                          <div class="fulldata-div">
                            <Checkbox :label="1">单笔消费满</Checkbox>
                          </div>
                          <div class="fulldata-div">
                            <Checkbox :label="2">单笔购买满</Checkbox>
                          </div>
                        </CheckboxGroup>
                      </FormItem>
                    </div>

                    <!-- 满减值输入值 -->
                    <div class="rule-right">
                      <div>
                        <FormItem
                          ref="fulllimitvalue"
                          :rules="{required:this.fulllimitfalg,pattern: /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)$/,}"
                          :show-message="false"
                          :label-width="0"
                          prop="fulllimitvalue"
                        >
                          <Input
                            :disabled="(reduForm.fulldata.indexOf(1)==-1)"
                            v-model="reduForm.fulllimitvalue"
                            style="width: 80px;"
                          ></Input>&nbsp;&nbsp;元
                        </FormItem>
                      </div>
                      <div>
                        <FormItem
                          ref="fullunitsvalue"
                          :rules="{required:this.fullunitsfalg,pattern:/^[1-9]\d*$/,}"
                          :show-message="false"
                          :label-width="0"
                          prop="fullunitsvalue"
                        >
                          <Input
                            :disabled="(reduForm.fulldata.indexOf(2)==-1)"
                            v-model="reduForm.fullunitsvalue"
                            style="width: 80px;"
                          ></Input>&nbsp;&nbsp;件
                        </FormItem>
                      </div>
                    </div>
                    <div class="rule-rt">
                      <p>可使用优惠券</p>
                    </div>
                  </div>

                  <FormItem label="优惠使用限制">
                    <RadioGroup @on-change="couponLimitChange" v-model="reduForm.couponLimit">
                      <Radio style="margin-left: 8px" :label="1">无使用限制</Radio>
                      <Radio style="margin-left: 8px" :label="2">不与其他营销规则同时使用</Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem v-if="reduForm.couponLimit==2" :label-width="0">
                    <div class="rule-box">
                      <!-- 左边 -->
                      <div class="rule-lf" style="border: none;">
                        选择不与优惠券同时共享得营销规则：
                        <span>(即优先享有如下优惠规则，将不能再使用优惠券优惠)</span>
                        <div class="rule-lf-t">
                          <div>
                            <Checkbox
                              :indeterminate="indeterminateId"
                              :value="checkAllId"
                              @click.prevent.native="allMarketing"
                            >基本营销：</Checkbox>
                          </div>
                          <div>
                            <CheckboxGroup v-model="reduForm.marketingId" @on-change="checkAllGroupChangeId">
                              <Checkbox label="1">满额立减</Checkbox>
                              <Checkbox label="2">限时折扣</Checkbox>
                            </CheckboxGroup>
                          </div>
                        </div>

                        <div class="rule-lf-t">
                          <div>
                            <Checkbox
                              :value="checkAllGid"
                              :indeterminate="indeterminateGid"
                              @click.prevent.native="allComplimentary"
                            >赠品管理：</Checkbox>
                          </div>
                          <div>
                            <CheckboxGroup v-model="reduForm.marketingGid" @on-change="checkAllGroupChangeGid">
                              <Checkbox label="3">首购礼</Checkbox>
                              <Checkbox label="4">满赠礼</Checkbox>
                              <Checkbox label="5">单品赠礼</Checkbox>
                              <Checkbox label="6">验证码赠礼</Checkbox>
                            </CheckboxGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <FormItem label="商品使用限制">
                    <RadioGroup
                      @on-change="goodsLimitedIdChange"
                      v-model="reduForm.goodsLimitedId"
                      vertical
                    >
                      <Radio style="margin-left: 8px" :label="1">不添加商品使用限制</Radio>
                      <Radio style="margin-left: 8px" :label="2">
                        允许以下商品使用&nbsp;&nbsp;
                        <span style="color: #cccccc">(仅允许如下商品购买时可使用优惠券)</span>
                      </Radio>
                      <Radio style="margin-left: 8px" :label="3">
                        不允许以下商品使用&nbsp;&nbsp;
                        <span style="color: #cccccc">(仅不允许如下商品购买时可使用优惠券)</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <div v-show="reduForm.goodsLimitedId!=1">
                    <FormItem label="限制类型">
                      <RadioGroup @on-change="extrafuc" v-model="reduForm.extra">
                        <Radio style="margin-left: 8px" label="1">商品分类</Radio>
                        <Radio style="margin-left: 8px" label="2">指定商品</Radio>
                      </RadioGroup>
                    </FormItem>

                    <FormItem v-if="reduForm.extra==1">
                      <div class="treeselect">
                        <treeselect
                          v-model="reduForm.classificationId"
                          :multiple="true"
                          :options="classOption"
                          placeholder="请选择商品分类"
                        />
                      </div>
                    </FormItem>

                    <FormItem v-if="reduForm.extra==2" label="指定商品">
                      <coupon-addgood
                        @listentgoodData="listentgoodDatafuc($event)"
                        :options="showData"
                      ></coupon-addgood>
                    </FormItem>
                  </div>
                </div>
              </TabPane>
              <!-- 需求暂时不明确 -->
              <TabPane label="消息通知" name="tab3">
                <div class="inset-content">
                  <FormItem label="消息类型" prop="name">
                    <Checkbox v-model="single">&nbsp;小程序模板消息</Checkbox>
                  </FormItem>
                  <FormItem label="模板消息" prop="name">
                    <Select
                      style="width:300px"
                      v-model="reduForm.messageTemp"
                      placeholder="选择所需的模板消息"
                    >
                      <Option :value="1">礼品领取成功通知</Option>
                    </Select>
                    <div class="star_1">请先使用“消息管理”模块同步小程序模板消息</div>
                  </FormItem>
                  <FormItem label="模板状态">
                    <RadioGroup>
                      <Radio label="0">启用</Radio>
                      <Radio label="1">禁用</Radio>
                    </RadioGroup>
                  </FormItem>
                </div>
              </TabPane>
            </Tabs>
            <!--保存 取消 -->
            <div class="formBtn">
              <Button type="primary" class="comBtn" :loading="loading" @click="saveData('reduForm')">保存</Button>
              <Button type="default" class="comBtn" @click="goBack()">取消</Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import goodsUtilsFun from "@/utils/goodsUtils.js";
import goods from "@/api/request/goods";
import marking from "@/api/request/marking";
import couponAddgood from "@/components/couponAddgood/couponAddgood";
import addGift from "@/components/addGood/addGift";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import urlButton from "@/components/urlbutton/urlbutton";
import ImgSelect from "@/components/imgSelect/imgSelect";
export default {
  name: "AddingCouppons",
  data() {
    return {
      
      linkSettings: {
        mode: "diy"
      },
      
      tableName:"tab1",

      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      // 满减条件1或2且
      loading:false,
      // 显示的商品规格
      showData: [],
      // 实物券
      showGift: [],

      // 编辑id
      editId: "",
      //保存按钮类型
      role: "",
      // 分类数据
      classOption: [],
      // 单笔消费
      fulllimit: false,
      // 单笔购买
      fullunits: false,
      // 可使用优惠券的类型
      andor: 3,
      // 小程序消息模板
      single: "flase",
      //禁用时间选择输入框
      fixationtime: "",

      fixationtimeflag: false,

      thatdaytimeflag: true,

      morrowtimeflag: true,

      // 动态满减

      fullunitsfalg: true,

      fulllimitfalg: true,

      // 全选
      indeterminateId: false,
      indeterminateGid: false,
      checkAllId: false,
      checkAllGid: false,

      imgselkey: 1,
      reduForm: {
        fulldata: [],
        // 优惠券类型
        couponstype: "1",
        // 实物券&&赠品券

        goodsarr: [],
        //现金券
        discountprice: "",
        // 折扣
        discount: "",
        // 库存
        stock: "",
        //选择有效期时间类型
        timeselect: "1",

        // 固定有效期
        fixationtime: [],

        // 获得当日起
        thatdaytime: "",

        // 活动次日起
        morrowtime: "",

        timeInterval: "",
        // 优惠券类型
        couponsname: "",
        // 副标题
        subheadname: "",
        // 券号
        vouchernumber: "1",
        // 渠道
        channel: "",
        // 说明
        textareastate: "",
        // 商品
        limit: 1,
        // 优惠限制
        couponLimit: 1,
        // 商品使用限制1,2,3
        goodsLimitedId: 1,
        // 商品限制类型1,2
        extra: 1,
        // 优惠方式 1或2且0无
        conditions: 0,
        // 基本营销
        marketingId: [],
        // 赠品管理
        marketingGid: [],
        // 分类
        classOptionvalue: [],
        // 满额
        fulllimitvalue: "",
        // 满件
        fullunitsvalue: "",
        // 添加指定列表
        rulegoodslist: [],
        // 分类ID
        classificationId: null,
        // 模板消息
        messageTemp: "",
        // 未使用
        donUsePic: "",
        // 已使用
        toUsePic: "",
        // 已过期
        expiredPic: "",
        // 消息通知
        // 路径
        urldata: ""
      },

      ruleValidate: {
        couponstype: [
          {
            required: true,
            message: "优惠券类型不能为空",
            trigger: "change"
          }
        ],

        discount: [
          {
            required: true,
            message: "折扣不能为空",
            trigger: "blur"
          },
          {
            pattern: /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/,
            message: "请输入一个正确的折扣格式大于0小于10且小数不超过一位",
            trigger: "blur"
          }
        ],
        discountprice: [
          {
            required: true,
            message: "金额不能为空",
            trigger: "blur"
          },

          {
            pattern: /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)$/,
            message: "请输入一个正确的金额格式大于0且小数不超过两位",
            trigger: "blur"
          }
        ],

        fulllimitvalue: [
          {
            pattern: /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)$/,
            message: "请输入一个正确的金额格式大于0且小数不超过两位",
            trigger: "blur"
          }
        ],

        fullunitsvalue: [
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入一个正整数",
            trigger: "blur"
          }
        ],

        couponsname: [
          {
            required: true,
            message: "优惠券名称不能为空",
            trigger: "blur"
          }
        ],

        vouchernumber: [
          {
            required: true,
            message: "优惠券券号不能为空",
            trigger: "change"
          }
        ],

        channel: [
          {
            required: true,
            message: "使用渠道不能为空",
            trigger: "change"
          }
        ],

        stock: [
          {
            required: true,

            message: "库存不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入一个正整数",
            trigger: "blur"
          }
        ],

        timeselect: [
          {
            required: true,
            message: "有效期不能为空",
            trigger: "change"
          }
        ],

        fulldata: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "请至少选择一项",
            trigger: "change"
          }
        ],

        DatePicker: [
          {
            required: true,
            message: "请选择固定有效期",
            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {
    couponAddgood,
    addGift,
    Treeselect,
    ImgSelect,
    urlButton
  },
  created() {
    this.oneClassFun();

    this.fetchData();
  },

  methods: {
    // 清除部分域
    clearfield: function(data) {
      this.$refs.reduForm.fields.forEach(e => {
        if (e.prop == data) {
          e.resetField();
        }
      });
    },

    fullfuc: function() {
      if (this.reduForm.fulldata.length == 2) {
        this.andor = 1;
        this.reduForm.conditions = 1;
      } else if (this.reduForm.fulldata.length == 1) {
        this.reduForm.conditions = 0;
        this.andor = 3;
      } else {
        this.reduForm.conditions = 3;
        this.andor = 3;
      }
      if (this.reduForm.fulldata.indexOf(1) == -1) {
        this.clearfield("fulllimitvalue");
        this.reduForm.fulllimitvalue = "";

        this.fulllimitfalg = false;
      } else {
        this.fulllimitfalg = true;
      }

      if (this.reduForm.fulldata.indexOf(2) == -1) {
        this.clearfield("fullunitsvalue");
        this.reduForm.fullunitsvalue = "";

        this.fullunitsfalg = false;
      } else {
        this.fullunitsfalg = true;
      }
    },
    // 图片数据
    couponImgData: function(data) {
      console.log("imgselset", data);
      if (this.imgselkey == 1) {
        this.reduForm.donUsePic = data[0].imgAddress;
      } else if (this.imgselkey == 2) {
        this.reduForm.toUsePic = data[0].imgAddress;
      } else if (this.imgselkey == 3) {
        this.reduForm.expiredPic = data[0].imgAddress;
      }
    },

    couponImgDelete: function(data) {
      if (data == 1) {
        this.reduForm.donUsePic = "";
      } else if (data == 2) {
        this.reduForm.toUsePic = "";
      } else if (data == 3) {
        this.reduForm.expiredPic = "";
      }
    },
    // 图片选择
    couponImgselect: function(value) {
      this.imgselkey = value;
      this.$refs.imgSel.uploadflg();
    },
    // 清空其他优惠类型
    couponstypefuc: function(value) {
      this.reduForm.discountprice = "";
      this.reduForm.discount = "";
      this.goodsarr = [];
    },

    // 固定日期时间选择
    timechange: function(value) {
      this.reduForm.fixationtime = value;
    },

    // 时间类型选择
    timeselectfuc: function(data) {
      if (data == 1) {
        (this.fixationtimeflag = false),
          (this.thatdaytimeflag = true),
          (this.morrowtimeflag = true),
          (this.reduForm.thatdaytime = ""),
          (this.reduForm.morrowtime = "");

        this.clearfield("morrowtime");

        this.clearfield("thatdaytime");
      } else if (data == 2) {
        (this.reduForm.timeInterval = this.reduForm.thatdaytime),
          (this.timeInterval = true),
          (this.fixationtimeflag = true),
          (this.thatdaytimeflag = false),
          (this.morrowtimeflag = true),
          (this.reduForm.fixationtime = []),
          (this.reduForm.morrowtime = ""),
          this.clearfield("morrowtime");

        this.clearfield("fixationtime");
      } else if (data == 3) {
        (this.reduForm.timeInterval = this.reduForm.morrowtime),
          (this.fixationtimeflag = true),
          (this.thatdaytimeflag = true),
          (this.morrowtimeflag = false),
          (this.reduForm.fixationtime = []),
          (this.reduForm.thatdaytime = ""),
          this.clearfield("thatdaytime");
        this.clearfield("fixationtime");
      }
    },

    // 优惠券使用方式
    conditionsfuc: function() {
      if (this.andor == 1) {
        this.andor = 2;
        this.reduForm.conditions = 2;
      } else if (this.andor == 2) {
        this.andor = 1;
        this.reduForm.conditions = 1;
      }
    },

    limitchange: function() {
      (this.reduForm.fulldata = []),
        (this.reduForm.fulllimitvalue = ""),
        (this.reduForm.fullunitsvalue = "");
    },

    couponLimitChange: function() {
      (this.reduForm.marketingGid = []), (this.reduForm.marketingId = []);
    },

    goodsLimitedIdChange: function(value) {
      if (value == 1) {
        (this.reduForm.extra = "1"),
          (this.reduForm.classificationId = null),
          (this.reduForm.rulegoodslist = []);
      }
    },
    // 营销全选&Q取消全选
    allMarketing: function() {
      console.log(this.indeterminateId)
      if (this.indeterminateId) {
        this.checkAllId = false;
      } else {
        this.checkAllId = !this.checkAllId;
      }
      this.indeterminateId = false;

      if (this.checkAllId) {
        console.log("123321")
        this.reduForm.marketingId = ["1", "2"];
      } else {
        this.reduForm.marketingId = [];
      }
    },
    checkAllGroupChangeId:function (value) {
                if (value.length === 2) {
                    this.indeterminateId = false;
                    this.checkAllId = true;
                } else if (value.length > 0) {
                    this.indeterminateId = true;
                    this.checkAllId = false;
                } else {
                    this.indeterminateId = false;
                    this.checkAllId = false;
                }
    },
    //赠品全选&Q取消全选
    allComplimentary: function() {
      if (this.indeterminateGid) {
        this.checkAllGid = false;
      } else {
        this.checkAllGid = !this.checkAllGid;
      }
      this.indeterminateGid = false;

      if (this.checkAllGid) {
        this.reduForm.marketingGid = ["3", "4","5","6"];
      } else {
        this.reduForm.marketingGid = [];
      }
    },

   checkAllGroupChangeGid:function (value) {
      if (value.length === 4) {
        this.indeterminateGid = false;
        this.checkAllGid = true;
      } else if (value.length > 0) {
        this.indeterminateGid = true;
        this.checkAllGid = false;
      } else {
        this.indeterminateGid = false;
        this.checkAllGid = false;
      }
    },


    //接收商品数据
    listentgoodDatafuc: function(data) {
      this.reduForm.rulegoodslist = [];
      for (let item in data) {
        let obj = {};
        (obj.specIds = data[item].specsId.join()),
        (obj.goodsId = data[item].id),
        this.reduForm.rulegoodslist.push(obj);
      }
    },

    // 实物券
    listentGiftDatafuc: function(data) {
      this.reduForm.goodsarr = [];
      for (let i in data) {
        let obj = {};
          (obj.specIds = data[i].specsId.join()),
          (obj.goodsId = data[i].id),
          (obj.goodsName = data[i].title),
          (obj.pic = data[i].thumb),
          this.reduForm.goodsarr.push(obj);
      }
    },
    // 赠品券
    listentData: function(data) {
      console.log("赠品券", data);
      this.reduForm.giftarr = [];
      for (let i in data) {
        let obj = {};
        obj.goodsName = data[i].goodsName;
        obj.pic = data[i].thumb;
        (obj.goodsId = data[i].id), this.reduForm.goodsarr.push(obj);
      }
    },

    // 查询分类数据
    oneClassFun: function() {
      goods
        .goodsClassAll({})
        .then(res => {
          if (res.code == 1) {
            this.integrationClassFun(res.data);
          }
        })
        .catch(err => {
          // console.log('分类查询失败')
          // this.$Message.error('分类查询失败')
        });
    },

    //处理分类数据
    integrationClassFun: function(data) {
      data.forEach(element => {
        let objOne = {};
        objOne.id = element.id;
        objOne.label = element.name;
        objOne.level = element.level;
        if (element.hasOwnProperty("listTwo")) {
          if (element.listTwo.length != 0) {
            objOne.children = [];
            element.listTwo.forEach((elementTwo, i) => {
              let objTwo = {};
              objTwo.id = elementTwo.id;
              objTwo.label = elementTwo.name;
              objTwo.level = elementTwo.level;
              objOne.children.push(objTwo);
              if (elementTwo.hasOwnProperty("listThree")) {
                if (elementTwo.listThree.length != 0) {
                  objOne.children[i].children = [];
                  elementTwo.listThree.forEach((elementThree, index) => {
                    let objThree = {};
                    objThree.id = elementThree.id;
                    objThree.label = elementThree.name;
                    objThree.level = elementThree.level;
                    objOne.children[i].children.push(objThree);
                  });
                }
              }
            });
          }
        }
        this.classOption.push(objOne);
      });
    },

    goBack: function() {
      this.$router.push({
        path: "/@/views/coupon/coupon/Coupon"
      });
    },

    // 编辑提交数据
    saveData: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) { 
          console.log(this.reduForm.extra)
          console.log(this.reduForm.goodsLimitedId)
          console.log(this.reduForm.classificationId)
          if(this.reduForm.extra==1&&this.reduForm.goodsLimitedId!=1&& (this.reduForm.classificationId==null || this.reduForm.classificationId.length==0)){
            this.$Message.error("商品分类不能为空")
            console.log("sdkjfhskjdfhsdkjf-----------------------------1")
          }else{
            console.log("sdkjfhskjdfhsdkjf-----------------------------2")
            if (this.role == "1") {           
              this.loading=true;  
              this.savefuc(this.reduForm);
            }
            // 编辑2
            else if (this.role == "2") {
              this.loading=true;
              this.editfucsave(this.reduForm);
            }
          }
        } 
        else {
          this.$Message.error("请按正确格式填写内容");
        }
      });
    },

    // 新增提交数据
    savefuc: function(data) {
      marking
        .Addcoupon({
          // 优惠券类型
          type: this.reduForm.couponstype,
          //折扣或金额
          enough: this.reduForm.discountprice || this.reduForm.discount || "",
          // 实物券
          goodsList: this.reduForm.goodsarr.length > 0 ? this.reduForm.goodsarr : "",
          // 库存
          stock: this.reduForm.stock,
          //选择有效期时间类型
          amount: this.reduForm.timeselect,
          // 固定有效期
          time: this.reduForm.fixationtime,
          // 获得当日起
          // 活动次日起、
          timeInterval: this.reduForm.thatdaytime || this.reduForm.morrowtime,
          // 优惠券名称
          couponsName: this.reduForm.couponsname,
          // 副标题
          title: this.reduForm.subheadname,
          // 券号
          couponNumber: this.reduForm.vouchernumber,
          // 渠道
          channelId: this.reduForm.channel,
          // 说明
          description: this.reduForm.textareastate,
          // 限制 1，2
          limit: this.reduForm.limit,
          //  优惠使用限制 1,2
          couponLimit: this.reduForm.couponLimit,
          // 商品使用限制1，2，3
          goodsLimitedId: this.reduForm.goodsLimitedId,
          // 商品限制类型1,2
          extra: this.reduForm.extra,
          // 优惠或且
          conditions: this.reduForm.conditions,
          // 满件赠
          singleBatch: this.reduForm.fullunitsvalue,
          // 满额赠品
          singleConsumer: this.reduForm.fulllimitvalue,
          // 基本营销
          marketingId: this.reduForm.marketingId.concat(
            this.reduForm.marketingGid
          ),
          // 赠品管理
          // marketingGid: this.reduForm.marketingGid,
          // 分类ID
          classificationId: this.reduForm.classificationId,
          // 指定商品
          rulegoodslist: this.reduForm.rulegoodslist.length>0 ? this.reduForm.rulegoodslist.length:"",

          donUsePic: this.reduForm.donUsePic,

          toUsePic: this.reduForm.toUsePic,

          expiredPic: this.reduForm.expiredPic
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$Message.success(res.message);
            this.loading=false
            this.goBack();
          } else {
            this.loading=false
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 清空表单
    clearfuc: function(name) {
      (this.fixationtimeflag = false),
      (this.thatdaytimeflag = true),
      (this.morrowtimeflag = true),
      (this.showData = []),
      (this.showGift = []),
    
      this.reduForm.couponsname = "";

      this.reduForm.subheadname = "";

      this.fulllimit = false;

      this.fullunits = false;

      this.reduForm.fulllimitvalue = "";

      this.reduForm.fullunitsvalue = "";

      this.reduForm.marketingId = [];

      this.reduForm.marketingGid = [];

      this.reduForm.couponLimit = 1;

      this.reduForm.goodsLimitedId = 1;

      this.reduForm.classificationId = null;

      this.reduForm.fixationtime = [];

      this.reduForm.textareastate = "";

      this.reduForm.limit = 1;
      
      this.reduForm.donUsePic="",

      this.reduForm.toUsePic="",

      this.reduForm.expiredPic=""


      if (this.$refs[name] !== undefined) {
        this.$refs[name].resetFields();
      }
    },

    // 编辑获取数据
    editfuc: function() {
      // 编辑详情
      marking
        .Discountsdetail({
          id: this.editId
        })
        .then(res => {
          console.log("数据", res);
          let data = res.data.rows[0];

          if (res.code == 1) {
            (this.reduForm.stock = String(data.stock)),
              (this.reduForm.timeselect = String(data.amount)),
              // 使用渠道
              (this.reduForm.channel = data.channel_id),
              (this.reduForm.couponNumber = data.coupon_number),
              (this.reduForm.couponsname = data.coupons_name),
              // 说明
              (this.reduForm.textareastate = data.description),
              (this.reduForm.donUsePic = data.don_use_pic),
              (this.reduForm.toUsePic = data.to_use_pic),
              (this.reduForm.expiredPic = data.expired_pic),
              // 折扣
              (this.reduForm.classificationId =
                data.classification_id.split(",")[0] == "null"
                  ? null
                  : data.classification_id.split(",")),
              (this.reduForm.couponstype = String(data.type));

            if (data.type == 2) {
              this.reduForm.discount = String(data.enough);
            } else if (data.type == 1) {
              this.reduForm.discountprice = String(data.enough);
            } else {
              this.reduForm.discountprice = "";

              this.reduForm.discount = "";
              this.couponstypefuc(data.type);
            }

            (this.reduForm.limit = data.limit),
              (this.reduForm.subheadname = data.title),
              (this.reduForm.limit = data.limit);

            if (data.amount == 2) {
              
              (this.reduForm.thatdaytime = data.time_interval),
              
              (this.reduForm.morrowtime = ""),
              
              (this.reduForm.fixationtime = []),
              
              (this.fixationtimeflag = true),
              
              (this.thatdaytimeflag = false),
              
              (this.morrowtimeflag = true);
            
            } else if (data.amount == 3) {
              
              (this.reduForm.thatdaytime = ""),
              
              (this.reduForm.fixationtime = []),
              
              (this.reduForm.morrowtime = data.time_interval),
              
              (this.fixationtimeflag = true),
              
              (this.thatdaytimeflag = true),
              
              (this.morrowtimeflag = false);
            
            } else {
              (this.reduForm.morrowtime = ""), (this.reduForm.thatdaytime = "");
              
              let arr = [2];
              
              arr[0] = goodsUtilsFun.timeFun(
                goodsUtilsFun.timeStamp(data.expiry_begin_time)
              );
              
              arr[1] = goodsUtilsFun.timeFun(
                goodsUtilsFun.timeStamp(data.expiry_end_time)
              );
              
              this.reduForm.fixationtime = arr;
              
              (this.fixationtimeflag = false),
              
              (this.thatdaytimeflag = true),
              
              (this.morrowtimeflag = true);
            }

            // 且
              (this.reduForm.conditions = data.conditions),
              
              (this.reduForm.extra = data.extra);

            //满元
            if (data.single_consumer != 0 && data.single_batch == 0) {
              
              (this.reduForm.fulllimitvalue = String(data.single_consumer)),
              
              (this.reduForm.fullunitsvalue = ""),
              
              (this.reduForm.fulldata = [1]);
              
              this.fulllimitfalg = true;
              
              this.fullunitsfalg = false;
            }
            // 满件
            else if (data.single_consumer == 0 && data.single_batch != 0) {
              
              (this.reduForm.fullunitsvalue = String(data.single_batch)),
              
              (this.reduForm.fulllimitvalue = ""),
              
              (this.reduForm.fulldata = [2]);
              
              this.fullunitsfalg = true;
              
              this.fulllimitfalg = false;
            } else if (data.single_consumer != 0 && data.single_batch != 0) {
              
              (this.reduForm.fullunitsvalue = String(data.single_batch)),
              
              (this.reduForm.fulllimitvalue = String(data.single_consumer)),
              
              (this.reduForm.fulldata = [1, 2]);
              
              this.fullunitsfalg = true;
              
              this.fulllimitfalg = true;
            }
            console.log(this.reduForm.fulldata);

            if (data.conditions == 1) {
              
              this.andor = 1;
            } else if (data.conditions == 2) {
              
              this.andor = 2;
            }

              (this.reduForm.couponLimit = data.coupon_limit),
              
              (this.reduForm.goodsLimitedId = data.goods_limited_id);

              let Id = [];
              let IdArr = data.marketing_id.split(",");
              let marketingId = [];
              let marketingGid = [];
              for (let itemid in IdArr) {
                Id.push(IdArr[itemid]);
              }

              for (let item in Id) {
                if (Id[item] > 2) {
                  marketingGid.push(Id[item]);
                } else {
                  marketingId.push(Id[item]);
                }
              }

            this.reduForm.marketingId = marketingId;
            this.reduForm.marketingGid = marketingGid;
            console.log("数据", this.reduForm.marketingId);
            console.log("数据", this.reduForm.marketingGid);
            // let Gid = [];
            // let GidArr=data.marketing_gid.split(",")
            // for (let itemgid in GidArr) {
            //   Gid.push(+GidArr[itemgid]);
            // }
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });

      // 指定商品
      marking
        .coupongoods({
          couponId: this.editId
        })
        .then(res => {
          if (res.code == 1) {
            console.log(
              "指定商品----------------------------------------优惠",
              res.data
            );

            this.showData = res.data;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {});

      //判断填充实物券或者赠品券
    },
    // 获取赠品详情
    couponstypefuc: function(datatype) {
      if (datatype == "3") {
        marking
          .physicalgoods({
            couponId: this.editId
          })
          .then(res => {
            if (res.code == 1) {
              this.showGift = res.data;
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(error => {});
      } else if (datatype == "4") {
        marking
          .selectcoupongoods({
            couponId: this.editId
          })
          .then(res => {
            if (res.code == 1) {
              let arr = [];
              for (let i in res.data) {
                arr.push(res.data[i].goodsId);
              }
              console.log("赠品id", arr);
              goods
                .selGoodsIds({
                  ids: arr
                })
                .then(res => {
                  let showArr = [];

                  for (let i in res.data) {
                    let obj = {};
                    obj.id = res.data[i].id;
                    (obj.title = res.data[i].title),
                      (obj.price = res.data[i].price),
                      (obj.vituralStock = res.data[i].vituralStock),
                      (obj.thumb = res.data[i].thumb),
                      showArr.push(obj);
                  }
                  this.showGift = showArr;
                  console.log("赠品", res.data);
                })
                .catch(error => {
                  console.log(err);
                });
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(error => {});
      }
    },
    // 编辑保存数据
    editfucsave: function() {
      console.log(this.editId);
      marking
        .Discountsupdate({
          id: this.editId,
          // 优惠券类型
          type: this.reduForm.couponstype,
          //折扣或金额
          enough: this.reduForm.discountprice || this.reduForm.discount || "",
          // 商品组
          goodsList: this.reduForm.goodsarr,
          // 库存
          stock: this.reduForm.stock,
          //选择有效期时间类型
          amount: this.reduForm.timeselect,
          // 固定有效期
          time: this.reduForm.fixationtime,
          // 获得当日起

          // 活动次日起
          timeInterval: this.reduForm.thatdaytime || this.reduForm.morrowtime,
          // 优惠券名称
          couponsName: this.reduForm.couponsname,
          // 副标题
          title: this.reduForm.subheadname,
          // 券号
          couponNumber: this.reduForm.vouchernumber,
          // 渠道
          channelId: this.reduForm.channel,
          // 说明
          description: this.reduForm.textareastate,
          // 限制 1，2
          limit: this.reduForm.limit,
          //  优惠使用限制 1,2
          couponLimit: this.reduForm.couponLimit,
          // 商品使用限制1，2，3
          goodsLimitedId: this.reduForm.goodsLimitedId,
          // 商品限制类型1,2
          extra: this.reduForm.extra,
          // 优惠或且
          conditions: this.reduForm.conditions,
          // 满件赠
          singleConsumer: this.reduForm.fulllimitvalue,
          // 满额赠品
          singleBatch: this.reduForm.fullunitsvalue,
          // 基本营销
          marketingId: this.reduForm.marketingId.concat(
            this.reduForm.marketingGid
          ),
          // 赠品管理
          // marketingGid: this.reduForm.marketingGid,
          // 分类ID
          classificationId: this.reduForm.classificationId,
          // 商品id
          rulegoodslist: this.reduForm.rulegoodslist,

          donUsePic: this.reduForm.donUsePic,

          toUsePic: this.reduForm.toUsePic,

          expiredPic: this.reduForm.expiredPic
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success(res.message);
            this.loading=false;
            this.goBack();
          } else {
            this.loading=false;
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 获取链接数据
    geturldata: function(links) {
      this.reduForm.urldata = links;
    },
    // 获取小程的信息
    SmallProFun(SmallPro) {
      console.log("小程序", SmallPro);
    },
    // 启用组件
    urlFun() {
      this.$refs.linkselect.cardShow();
    },

    // 限制类型
    extrafuc: function(value) {
      if (value == 1) {
        this.reduForm.rulegoodslist = [];
      } else if (value == 2) {
        this.reduForm.classificationId = null;
      }
      console.log(value);
    },

    fetchData: function() {
      (this.editId = this.$route.query.id),
      (this.role = this.$route.query.role);
      this.tableName="tab1"
      console.log("role-----------------------------", this.$route.query.role);
      if (this.$route.query.role == 2) {
        this.clearfuc("reduForm");
        this.editfuc();
      } else if (this.$route.query.role == 1) {
        this.clearfuc("reduForm");
      }
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>

<style scoped>
@import "./AddingCoupons.css";
</style>

