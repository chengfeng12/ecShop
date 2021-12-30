<template>
  <div id="order-admin">
    <div class="currentTitle" v-if="this.status == 1">待发货</div>
    <div class="currentTitle" v-else-if="this.status == 2">待收货</div>
    <div class="currentTitle" v-else-if="this.status == 0">待付款</div>
    <div class="currentTitle" v-else-if="this.status == 3">已完成</div>
    <div class="currentTitle" v-else-if="this.status == 8">已关闭</div>
    <div class="currentTitle" v-else>全部订单</div>
    <Card>
      <div class="main">
        <!-- 搜索 -->
        <div class="main-head">
          <Select
            class="mar-rig"
            v-model="selectType"
            @on-change="selectdatetype"
            style="width:150px"
          >
            <Option v-for="item in typeData" :value="item.value" :key="item.index">{{ item.label }}</Option>
          </Select>

          <DatePicker
            :editable="false"
            class="mar-rig"
            :value="timesData"
            format="yyyy/MM/dd HH:mm:ss"
            type="datetimerange"
            placement="bottom-end"
            placeholder="时间"
            @on-change="timeChange"
            style="width: 280px"
          ></DatePicker>
          <!-- 订单来源 -->
          <Select
            class="mar-rig"
            v-model="channelData"
            style="width:160px"
            @on-change="selectchannel"
          >
            <Option
              v-for="item in channelList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <!-- 订单类型 -->
           <Select
            class="mar-rig"
            v-model="OrderTypeData"
            style="width:160px"
           
          >
            <Option
              v-for="item in OrderTypeList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <!-- 关键字类型 -->
          <Select
            class="mar-rig"
            v-model="orderData"
            style="width:150px"
            @on-change="selectkeyworld"
          >
            <Option v-for="item in orderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- 关键字 -->
          <Input class="mar-rig" v-model="keyword" placeholder="请输入关键词搜索" style="width: 200px"/>
          <Button class="mar-rig btn-a" type="primary" @click="serchFun">搜索</Button>
          <Button class="mar-rig btn-a" type="primary" @click="exportFuc">导出</Button>
        </div>
        <!-- 表格主体 -->
        <div class="main-body">
          <div>
            <Row class="main-title">
              <ul>
                <Col span="6">
                  <li class="first-li">商品</li>
                </Col>
                <Col span="2">
                  <li>订单来源</li>
                </Col>
                <Col span="2">
                  <li>订单类型</li>
                </Col>
                <Col span="3">
                  <li>买家</li>
                </Col>
                <Col span="3">
                  <li>支付/配送</li>
                </Col>
                <Col span="2">
                  <li>价格</li>
                </Col>
                <Col span="2">
                  <li>操作</li>
                </Col>
                <Col span="4">
                  <li>状态</li>
                </Col>
              </ul>
            </Row>
            <div class="body-box" v-for="(item,index) in orderDataList" :key="index">
              <Row class="body-head" type="flex" justify="space-between">
                <Col span="15" class="body-head-left">
                  <span>{{ item.createTime }}</span>
                  <span>订单编号：{{ item.orderNumber }}</span>
                </Col>
                <!-- 操作 -->
                <Col span="6" class="body-head-right">
                  <Row type="flex" justify="end">
                    <!-- 订单备注 -->
                    <Col span="6" class="head-ibox">
                      <div @click="remarksshowfuc(item.id)" v-if="hasRole(30205)">
                        <i>
                          <Icon class="iconfont icon-edit"/>
                        </i>
                        <span>备注</span>
                      </div>
                    </Col>
                    <!-- 修改价格 -->

                    <!-- paymentState ：订单状态 -->

                    <!-- payment：支付类型 -->
                    <Col v-if="item.paymentState == 0 && hasRole(30207)" span="8" class="head-ibox">
                      <div @click="modifyPriceshow(item.id,true)">
                        <i>
                          <Icon class="iconfont icon-edit-square"/>
                        </i>
                        <span>修改价格</span>
                      </div>
                    </Col>

                    <!-- 订单状态 -->
                    <Col v-if="item.paymentState == 0 &&  hasRole(30208)" span="8" class="head-ibox">
                      <div @click="closeOrder(item.id,index)">
                        <i>
                          <Icon class="iconfont icon-poweroff"/>
                        </i>
                        <span>关闭订单</span>
                      </div>
                    </Col>

                    <Col
                      v-if="item.payment != 0 && item.paymentState == 2 && hasRole(30204)"
                      span="8"
                      class="head-ibox"
                    >
                      <div>
                        <svg
                          t="1556093742698"
                          class="icon alter"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="2113"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                        >
                          <path
                            d="M962.289 839.413h-73.422c-8.889-71.183-69.5-126.297-143.088-126.297s-134.199 55.114-143.089 126.297h-55.376c-29.892 0-54.129-24.243-54.129-54.126v-487.149c0-29.9 24.236-54.127 54.129-54.127h414.976c29.891 0 54.128 24.227 54.128 54.127v487.149c0 29.883-24.236 54.126-54.128 54.126zM402.974 839.413h-37.327c-8.898-71.183-69.509-126.297-143.098-126.297-73.591 0-134.194 55.114-143.092 126.297h-37.332c-19.926 0-36.084-16.157-36.084-36.086 0 0 0-87.973 0-198.467 0-72.099 123.421-252.594 180.423-252.594 110.501 0 216.51 0 216.51 0 19.929 0 36.084 16.157 36.084 36.084v414.976c0.001 19.931-16.157 36.087-36.083 36.087zM330.804 442.479c0 0-56.876-2.625-125.135 0-29.125 1.11-109.418 107.374-109.418 162.382 0 14.079 0 17.392 0 18.043h234.553v-180.425zM222.548 767.244c49.82 0 90.212 40.384 90.212 90.212 0 49.81-40.393 90.211-90.212 90.211-49.824 0-90.212-40.403-90.212-90.211 0-49.828 40.389-90.212 90.212-90.212zM750.29 767.244c52.311 0 94.723 42.411 94.723 94.724s-42.412 94.721-94.723 94.721c-52.313 0-94.723-42.411-94.723-94.721 0-52.314 42.412-94.724 94.723-94.724z"
                            p-id="2114"
                            fill="#707070"
                          ></path>
                        </svg>

                        <span>修改物流</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row class="body-content">
                
                <Col span="6" class="body-content-col">
                  <div class="col-con">
                    <!-- 我是商品名字 -->
                    <div v-for="(item,index) in item.goods" :key="index">
                      <img :src="item.thumb" alt>

                      <span class="name">{{ item.title }}</span>

                      <span>X</span>

                      <span>{{ item.count }}</span>
                    </div>
                  </div>
                </Col>

                <Col span="2" class="body-content-col">
                  <div class="col-con">
                    <p>
                      <span v-if="item.channel==1">小程序</span>
                      <span v-else>小程序</span>
                    </p>
                  </div>
                </Col>
                <!-- 好友赠礼 -->
                <Col span="2" class="body-content-col">
                  <div class="col-con">
                    <p>
                      <span v-if="item.orderType==1">普通订单</span>
                      <span v-else-if="item.orderType==2">好友赠礼</span>
                    </p>
                  </div>
                </Col>
                
                <Col span="3" class="body-content-col">
                  <div class="col-con">
                    <div>
                      <p class="buyer-name">{{ item.memberNickname }}</p>
                      <p>{{ item.telNum }}</p>
                    </div>
                  </div>
                </Col>
                <Col span="3" class="body-content-col">
                  <div class="col-con">
                    <span v-if="item.payment == 0" class="pay unpaid">未支付</span>
                    <span v-else-if="item.payment == 1" class="pay wecat-payment">微信支付</span>
                    <span v-else-if="item.payment == 2" class="pay wecat-payment">支付宝</span>
                    <span v-else-if="item.payment == 3" class="pay wecat-payment">后台支付</span>
                    <p>{{ item.receiveType }}</p>
                  </div>
                </Col>
                <Col span="2" class="body-content-col">
                  <div class="col-con">￥{{ item.price }}</div>
                </Col>
                <Col span="2" class="body-content-col">
                  <div class="col-con" v-if="hasRole(30201)">
                    <router-link
                      :to="{path: '/@/views/order/OrderInfo', 
                      query:{
                        orderId: item.id,
                        payment: item.payment,
                        paymentState: item.paymentState
                        }
                      }"
                    >查看详情</router-link>
                  </div>
                </Col>
                <Col span="6" class="body-content-col">
                  <!-- 按钮显示规则 -->
                  <div class="col-con">
                                        
                    <p class="color-red" v-if="item.paymentState ==2 || item.paymentState ==1">
                      <span v-if="item.orderType==2">待领取</span>
                      <span v-if="item.orderType==1">部分发货</span>
                    </p>
                    
                    <p class="margin-style color-red" v-if="item.paymentState == 0">待付款</p>
                    
                    <p class="margin-style color-red" v-if="item.paymentState == 8">已关闭</p>

                    <p class="margin-style color-red" v-if="item.paymentState == 5">维权中</p>

                    <p class="margin-style color-red" v-if="item.paymentState == 6">维权已完成</p>
                    
                    <p class="margin-style color-red" v-if="item.paymentState == 9">无效订单</p>
                    
                    <p class="margin-style color-red" v-if="item.paymentState == 3">已完成</p>

                    <p>
                      <Button
                        class="margin-style btn-a"
                        type="primary"
                        v-if="item.paymentState == 1 && hasRole(30202)"
                        @click="confirmSendOf(true,item.id,index)"
                      >确认发货</Button>
                    </p>
                    <p class="margin-style color-red" v-if="item.paymentState == 1">
                      <span v-if="item.orderType==1">待发货</span>
                    </p>

                    <p>
                      <Button
                        class="margin-style btn-a"
                        type="primary"
                        v-if="item.paymentState==0 && hasRole(30203)"
                        @click="confirmPay(item.id,index)"
                      >确认付款</Button>
                    </p>
                    <p class="margin-style color-red" v-if="item.paymentState == 2">待收货</p>
                    <p class="margin-style color-blue" v-if="item.paymentState == 2 && hasRole(30206)">
                      <!-- <Button
                        class="margin-style btn-a"
                        type="primary"
                        @click="closeReceivingGoods(item.id,index)"
                      >取消发货</Button> -->
                      取消发货
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="page-box">
          <Page
            :current="current"
            style="float:right"
            :total="total"
            :page-size="pageSize"
            show-elevator
            @on-change="pagechange"
            show-sizer
            :page-size-opts="[10,15,20]"
            @on-page-size-change="pageSizeFun"
            :show-total="true"
          />
          <div style="clear:both"></div>
        </div>
      </div>
      <!-- 备注 -->
      <Modal
        id="remarksshow"
        title="备注"
        v-model="remarksshow"
        :closable="false"
        @on-ok="addremarksfuc"
      >
        <div class="inputitem">
          <Input
            :rows="6"
            type="textarea"
            v-model="remarkdata"
            :value="remarkdata"
            placeholder="请输入备注信息"
          />
        </div>
      </Modal>
      <!-- 修改物流信息 -->
      <Modal
        id="logisticsshow"
        title="修改物流信息"
        v-model="logisticsshow"
        :closable="false"
        @on-ok="modifylogisticsFun">
        <div class="inputitem">
          <span>收货地址：</span>
          <span>{{address}},{{buyer}},{{buyerMobile}},</span>
        </div>
        <div class="inputitem">
          <span>快递名称：</span>
          <Select placeholder="请选择快递" v-model="expressName" style="width:250px">
            <Option value="顺丰">顺丰</Option>
            <Option value="圆通">圆通</Option>
            <Option value="中通">中通</Option>
            <Option value="申通">申通</Option>
            <Option value="邮政">邮政</Option>
          </Select>
        </div>

        <div class="inputitem">
          <span>快递单号：</span>
          <Input placeholder="请输入快递单号" v-model="expressSn" clearable style="width: 250px"/>
        </div>

        <div class="inputitem">
          <span>发货类型：</span>
          <RadioGroup v-model="batchType">
            <Radio label="1">按订单发货</Radio>
            <Radio label="2">商品分包裹发货</Radio>
          </RadioGroup>
        </div>
      </Modal>
      <!-- 修改价格 -->
      <Modal id="priceshow" title="修改价格" v-model="priceshow" :closable="false" footer-hide>
        <Form ref="priceForm" :model="priceForm" :rules="rule">
          <FormItem prop="price">
            <Input
              :rows="6"
              @on-blur="datachange(priceForm.price)"
              type="number"
              v-model="priceForm.price"
              placeholder="请输入价格"
            />
          </FormItem>
          <FormItem style="text-align: right">
            <Button @click="modifyPriceshow('',false)">取消</Button>
            <Button class="btn-a" type="primary" @click="modifyPriceFun('priceForm')">确定</Button>
          </FormItem>
        </Form>
      </Modal>


      <!-- 订单发货 -->
      <Modal id="logisticsshow" title="订单发货" v-model="modalBool" :closable="false" footer-hide>
        <div class="inputitem">
          <span>收货地址：</span>
          <span>{{address}},{{buyer}},{{buyerMobile}},</span>
        </div>
        <Form ref="logisticsForm" :model="logisticsForm" :rules="rule">
          <FormItem prop="expressName">
            <span>快递名称：</span>
            <Select placeholder="请选择快递" v-model="logisticsForm.expressName" style="width:250px">
              <Option value="顺丰">顺丰</Option>
              <Option value="圆通">圆通</Option>
              <Option value="中通">中通</Option>
              <Option value="申通">申通</Option>
              <Option value="邮政">邮政</Option>
            </Select>
          </FormItem>
          <FormItem prop="expressSn">
            <span>快递单号：</span>
            <Input
              placeholder="请输入快递单号"
              v-model="logisticsForm.expressSn"
              clearable
              style="width: 250px"
              :maxlength="20"
            />
          </FormItem>
          <FormItem prop="batchType">
            <span>发货类型：</span>
            <RadioGroup v-model="logisticsForm.batchType">
              <Radio label="1">按订单发货</Radio>
              <Radio label="2">商品分包裹发货</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem style="text-align: right">
            <Button @click="confirmSendOf(false,'','',)">取消</Button>
            <Button class="btn-a" type="primary" @click="modalBoolFun('logisticsForm')">确定</Button>
          </FormItem>
        </Form>
      </Modal>
  
    </Card>
  </div>
</template>

<script>
import api from "@/api/request";
import goodsUtilsFun from "@/utils/goodsUtils.js";
import orderApi from "@/api/request/order.js";

export default {
  data() {
    return {
      // 完后时间 选择框中的下拉选项
      typeData: [
        {
          value: -1,
          label: "不按时间"
        },
        {
          value: 1,
          label: "下单时间"
        },
        {
          value: 2,
          label: "付款时间"
        },
        {
          value: 3,
          label: "发货时间"
        },
        {
          value: 4,
          label: "完成时间"
        }
      ],
      OrderTypeList:[
         {
          value: -1,
          label: "全部订单类型"
        },
        {
          value: 2,
          label: "好友赠礼"
        },
        {
          value: 1,
          label: "普通订单"
        },
      ],


      // 选择的数据形式
      selectType: "complete",
      // 日期 的数据
      timesData: [],
      // 渠道来源
      channelList: [
        {
          value: "-1",
          label: "全部订单来源"
        },
        {
          value: "1",
          label: "微信小程序"
        }  
      ],
      // 备注信息
      remarksshow: false,
      remarkdata: "",
      // 修改物流信息
      logisticsshow: false,
      expressName: "",
      expressSn: "",
      batchType: "",
      OrderTypeData:"",
      // 收货信息
      address: "",
      buyer: "",
      buyerMobile: "",

      //价格信息
      priceshow: false,

      priceForm: {
        price: ""
      },
      rule: {
        price: [
          {
            required: true,
            message: "价格不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入一个正数",
            trigger: "blur"
          }
        ],
        expressName: [
          {
            required: true,
            message: "请选择快递公司",
            trigger: "change"
          }
        ],
        expressSn: [
          {
            required: true,
            message: "请填写快递单号",
            trigger: "blur"
          },
           {
            pattern: /^[A-Za-z0-9]{0,20}$/,
            message: "格式不正确",
            trigger: "blur"
          }
        ],
        batchType:[
           { required: true, message: '请选择发货类型', trigger: 'change' }
        ]
      },

      logisticsForm: {
        expressName: "",
        expressSn: "",
        batchType: ""
      },

      channelData: "all",
      // 订单号
      orderList: [
        {
          value: "1",
          label: "订单号"
        },
        {
          value: "2",
          label: "收件人信息"
        },
        {
          value: "3",
          label: "快递单号"
        },
        {
          value: "4",
          label: "商品名称"
        },
        {
          value: "5",
          label: "商品编号"
        }
      ],
      loading: true,

      orderData: "orderNum",
      // 订单数据
      orderDataList: [],
      // 弹框的状态
      modalBool: false,
      // 页码默认获取第一页
      current: 1,
      // 每页条数默认0条
      pageSize: 10,
      // 总数默认
      total: 0,
      // 开始时间
      startTime: "",
      //结束时间
      endTime: "",
      // 订单来源
      source: 0,
      // 关键字类型,
      keyType: 0,
      // 关键字
      keyword: "",
      // 时间类型
      timeType: 0,

      status: undefined,
      // 订单ID暂存
      id: "",
      // 订单Index暂存
      Itemindex: "",
      // 页码暂存
      userId:"",
    
      hasRolefag:true,
    };
  },
  created() {
    console.log(123);
    if (this.$route.query.status) {
      this.status = this.$route.query.status;
    }
    if (this.$route.query.userId) {
      this.userId = this.$route.query.userId;
    }
    this.getData();
  },

  methods: {
    // 获取数据默认获取第一页

    getData: function() {
      console.log("userId",this.userId)
      orderApi
        .getOrderlist({
          userId:this.userId,
          orderType:this.OrderTypeData,
          current: this.current,
          timeType: this.timeType,
          startTime: this.startTime,
          endTime: this.endTime,
          source: this.source,
          keyType: this.keyType,
          keyword: this.keyword,
          status: typeof this.status == "undefined" ? -1 : this.status,
          size: this.pageSize
        })
        .then(res => {
          console.log("返回值", res);
          if (res.code == 1) {
            this.gettabledata(res);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error("数据请求失败");
        });
    },

    // 渲染表格数据
    gettabledata: function(data) {
      let orderList = [];
      
      console.log("订单列表", data);
      
      this.pageSize = data.data.size;

      this.total = data.data.total;
      console.log("数据----------------------------------------------------",this.total)
      for (let item in data.data.records) {
        let object = {
          createTime: "",
          orderNumber: "",
          id: "",
          goods: [],
          channel: "",
          memberNickname: "",
          telNum: "",
          
          payment: "",
          delivery: "",
          price: "",
          orderId: "",
          paymentState: "",
          receiveType: ""
        };

        (object.createTime = goodsUtilsFun.timeFun(
          goodsUtilsFun.timeStamp(data.data.records[item].createTime)
        )),
          //订单编号
          (object.orderNumber = data.data.records[item].orderNo),
          //id
          (object.id = data.data.records[item].id),
          // 商品信息
          (object.goods = data.data.records[item].orderGoodsList),
          // 订单来源
          (object.channel = data.data.records[item].soureType),
          
          (object.orderType=data.data.records[item].orderType),
          // 买家姓名
          (object.memberNickname = data.data.records[item].memberNickname),
          // 买家电话

          (object.telNum = data.data.records[item].memberMobile || ""),
          // 支付类型
          (object.payment = data.data.records[item].payType),
          // 快递信息
          (object.receiveType = data.data.records[item].receiveType),
          // 价格
          (object.price = (data.data.records[item].payPrice).toFixed(2)),
          // 订单ID
          (object.orderId = data.data.records[item].tradeNo),
          // 支付状态
          (object.paymentState = data.data.records[item].status),
          // 收货人信息
          (object.address = data.data.records[item].addressDetail),
          (object.buyer = data.data.records[item].buyerName),
          (object.buyerMobile = data.data.records[item].buyerMobile),
          orderList.push(object);
      }
      this.orderDataList = orderList;
      console.log("订单信息", this.orderDataList);
    },

    //分页
    pagechange: function(index) {
      this.current = index;
      this.getData();
    },
    pageSizeFun(data) {
      this.pageSize = data
      this.getData()
    },
    // 订单来源
    selectchannel: function(value) {
      console.log(value);
      this.source = value;
      this.getData();
    },

    // 显示备注弹窗
    remarksshowfuc: function(id) {
      this.remarksshow = true;
      this.id = id;
    },
    // 添加备注
    addremarksfuc: function() {
      orderApi
        .addremarks({
          id: this.id,
          remark: this.remarkdata
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$Message.success(res.message);
            this.id = "";
            this.remarkdata = "";
          } else {
            this.$Message.error("添加失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //显示修改价格信息
    modifyPriceshow: function(id, flag) {
      (this.priceshow = flag), (this.id = id);
    },

    modifyPriceFun: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          orderApi
            .updatePrice({
              id: this.id,
              price: this.priceForm.price
            })
            .then(res => {
              console.log(res);
              if (res.code == 1) {
                this.id = "";

                this.priceForm.price = "";

                this.getData();

                this.priceshow = false;
              } else {
                this.$Message.error(res.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },

    // 修改物流信息
    modifylogisticsFun: function() {
      orderApi
        .updateDelivery({
          orderId: this.id,
          expressName: this.expressName,
          expressSn: this.expressSn,
          batchType: this.batchType
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success(res.message);
            this.id = "";
            this.expressName = "";
            this.expressSn = "";
            this.batchType = "";
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          this.$Message.error("数据请求失败");
          console.log(error);
        });
    },

    // 显示修改物流信息弹窗并且加载收货地址信息
    modifyLogistics: function(id) {
      this.logisticsshow = true;
      this.id = id;
      // 加载收货信息
      orderApi
        .getOrderData({
          id: id
        })
        .then(res => {
          if (res.code == 1) {
            (this.address = res.data.addressDetail),
              (this.buyer = res.data.buyerName),
              (this.buyerMobile = res.data.buyerMobile);
          } else {
            this.$Message.error(res.message);
          }
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 关闭订单
    closeOrder: function(id, index) {
      orderApi
        .closeOrder({
          id: id
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success(res.message),
              (this.orderDataList[index].paymentState = 8);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 确认付款
    confirmPay: function(id) {
      orderApi
        .confimPay({
          id: id
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success(res.message);
            console.log(this.current);
            this.getData();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 确认发货显示弹窗
    confirmSendOf: function(flag, id, index) {
      this.$refs.logisticsForm.resetFields();
      this.modalBool = flag;
      console.log("id", id);
      console.log("index", index);
      console.log("订单信息", this.orderDataList[index]);
      (this.id = id),
      (this.address = this.orderDataList[index].address),
      (this.buyer = this.orderDataList[index].buyer),
      (this.buyerMobile = this.orderDataList[index].buyerMobile);
    },

    // 填写确认发货信息确认发货
    modalBoolFun: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          orderApi
            .Delivery({
              expressName: this.logisticsForm.expressName,

              expressSn: this.logisticsForm.expressSn,

              orderId: this.id,

              deliverType: this.logisticsForm.batchType

            })
            .then(res => {
              if (res.code == 1) {
                  this.id = "";
                  (this.address = ""),
                  (this.buyer = ""),
                  (this.buyerMobile = ""),
                  (this.logisticsForm.batchType = "");
                  (this.logisticsForm.expressName = ""),
                  (this.logisticsForm.expressSn = ""),
                  (this.modalBool = false),
                  this.getData(),
                  this.$refs[name].resetFields();
              } else {
                this.$Message.error(res.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },

    // 取消发货
    closeReceivingGoods: function(id, index) {
      orderApi
        .addcancelGoods({
          id: id,
          status: 1
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success(res.message);
            this.orderDataList[index].paymentState = 1;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //定义关键字搜索
    selectkeyworld: function(value) {
      this.keyType = value;
    },

    // 关键字搜索
    serchFun: function() {
      this.getData();
    },

    // 选择日期
    selectdatetype: function(value) {
      this.timeType = value;
    },

    // 时间组件的事件
    timeChange: function(index) {
      this.startTime = index[0];
      this.endTime = index[1];
      console.log(index);
      this.getData();
    },


    // 导出文件
    exportFuc: function() {
       api.exportFile(
         "/api/order/export",
          "order",
         {
          current: this.current,
          timeType: this.timeType,
          startTime: this.startTime,
          endTime: this.endTime,
          source: this.source,
          keyType: this.keyType,
          keyword: this.keyword,
          status: typeof this.status == "undefined" ? -1 : this.status,
          size: this.pageSize
       })
        .then(res => {    
          console.log(res);
        }).catch(error => {
          console.log(error);
        });
    },

    // 根据状态修改下拉选项
    typeDatachange: function(data) {
      console.log("全部订单", data);
      let datatype = typeof data == "undefined" ? -1 : data;
      // 全部订单
      if (datatype == -1) {
        this.typeData = [
          {
            value: "",
            label: "不按时间"
          },
          {
            value: 1,
            label: "下单时间"
          },
          {
            value: 2,
            label: "付款时间"
          },
          {
            value: 3,
            label: "发货时间"
          },
          {
            value: 4,
            label: "完成时间"
          }
        ];
      }
      // 0->待付款；
      else if (datatype == 0) {
        this.typeData = [
          {
            value: "",
            label: "不按时间"
          },
          {
            value: 1,
            label: "下单时间"
          }
        ];
      }
      // 1->待发货；
      else if (datatype == 1) {
        this.typeData = [
          {
            value: "",
            label: "不按时间"
          },
          {
            value: 1,
            label: "下单时间"
          },
          {
            value: 2,
            label: "付款时间"
          }
        ];
      }

      // 2->待收货；
      else if (datatype == 2) {
        this.typeData = [
          {
            value: "",
            label: "不按时间"
          },
          {
            value: 1,
            label: "下单时间"
          },
          {
            value: 2,
            label: "付款时间"
          }
        ];
      }

      // 3->已完成
      else if (datatype == 3) {
        this.typeData = [
          {
            value: "",
            label: "不按时间"
          },
          {
            value: 1,
            label: "下单时间"
          },
          {
            value: 2,
            label: "付款时间"
          },
          {
            value: 3,
            label: "发货时间"
          },
          {
            value: 4,
            label: "完成时间"
          }
        ];
      }
      else if (datatype == 8) {
        this.typeData = [
          {
            value: "",
            label: "不按时间"
          },
          {
            value: 1,
            label: "下单时间"
          }
        ];
      }
    },


    // 保留两位小数
    datachange: function(data) {
      console.log(data);
      this.priceForm.price = (data * 1).toFixed(2);
    },

    fetchData: function() {
      this.typeDatachange(this.$route.query.status);
      this.current = 1;
      this.timeType="",
      this.startTime="",
      this.endTime="",
      this.source="",
      this.keyType= "",
      this.keyword= "",
      this.pageSize= 10
      this.status = this.$route.query.status;
      if (this.$route.query.userId) {
        this.userId = this.$route.query.userId;
      }
      else{
        this.userId =""
      }
      this.getData();

    }
  },
  watch: {
    $route: "fetchData"

  }
};
</script>

<style scoped>
#order-admin {
  min-width: 1200px;
}
.main {
  padding: 10px;
}
#order-admin .display-inblo {
  display: inline-block；;
}
.mar-rig {
  margin-right: 10px;
}
.main-head {
  margin: 0 0 20px 10px;
}

.main-body {
  padding: 10px;
}
.main-title ul li {
  text-align: center;
  height: 30px;
  line-height: 30px;
  border: 1px solid #ccc;
  border-left: none;
}
.main-title ul .first-li {
  border-left: 1px solid #ccc;
}
/* 表格中见的 */
.body-box {
  border: 1px solid #ccc;
  border-top: none;
  /* height: 100%; */
}
.body-head {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #eee;
}
.body-head-left {
  padding-left: 10px;
}
.body-head-left span {
  margin-right: 30px;
}
.head-ibox {
  text-align: center;
  cursor: pointer;
}
.body-head-right i,
.alter {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 18px;
}
.body-head-right .alter {
  vertical-align: middle;
}
.body-content {
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  /* height: 100%; */
}
/* .body-content-col {
    height: 100%;
    border-right: 1px solid #ccc; 
} */
.col-con div > img {
  width: 40px;
  vertical-align: middle;
  margin: 0 5px 5px 0;
}
.col-con div .name {
  margin-right: 10px;
}
.col-con .buyer-name {
  margin-bottom: 5px;
}
/* 支付的状态显示 */
.pay {
  display: inline-block;
  color: #fff;
  padding: 4px 10px;
  margin-bottom: 5px;
}
.unpaid {
  background-color: #ccc;
}
.wecat-payment {
  background-color: rgb(30, 172, 11);
}

.margin-style {
  margin-top: 5px;
}
.color-red {
  color: red;
}
.color-blue {
  color: #0083b0;
}

.page-box {
  margin: 10px 0 0 10px;
}

#logisticsshow .inputitem {
  margin: 20px 0;
}
.currentTitle{
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
</style>
