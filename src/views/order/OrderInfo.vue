<template>
  <div id="order-info">
    <Card>
      <div class="step-box">
        <Steps :current="stepState">
          <Step title="买家下单" :content="createTime"></Step>
          <Step title="买家付款" :content="stepState > 0 ? payTime : ''"></Step>
          <Step title="商家发货" :content="stepState > 1 && stepState <=3 ? sendTime : ''"></Step>
          <Step title="订单完成" :content="stepState == 3 ? finishTime : ''"></Step>
        </Steps>
      </div>
      <div class="order-box">
        <Row>
          <Col span="11">
            <ul class="info-box">
              <li>
                <span class="first-span">订单编号：</span>
                <span>{{orderInfo.orderNumber}}</span>
              </li>
            
              <li>
                <span class="first-span">订单来源：</span>
                <span v-if="orderInfo.channel==1">小程序</span>
                <span v-else-if="orderInfo.channel==2">小程序</span>  
              </li>
              <li>
                <span class="first-span">订单类型：</span>
                <span v-if="orderInfo.orderType==1">普通订单</span>
                <span v-else-if="orderInfo.orderType==2">好友赠礼</span>  
              </li>
              <li>
                <span class="first-span">付款方式：</span>
                <span v-if="orderInfo.payType==0">未付款</span>
                <span v-if="orderInfo.payType==1">微信支付</span>
                <span v-if="orderInfo.payType==2">支付宝</span>
                <span v-if="orderInfo.payType==3">后台支付</span>
              </li>
              <li>
                <span class="first-span">买家：</span>
                <span>{{orderInfo.buyer}}</span>
              </li>
              <li>
                <span class="first-span">配送方式：</span>
                <span>{{orderInfo.receiveType}}</span>
              </li>
              <li>
                <span class="first-span">收货人：</span>
                <span>{{orderInfo.addressDetail}},{{orderInfo.name}},{{orderInfo.tel}}</span>
              </li>
              <li class="remarkBuyer">
                <div class="first-span">买家备注：</div>
                <div>{{orderInfo.remarkBuyer}}</div>
              </li>
              <li>
                <Button
                  v-if="stepState <2 && stepState!=-2 && hasRole(30210)"
                  class="btn-a"
                  type="primary"
                  @click="modifyOrder()"
                >修改订单收货信息</Button>
              </li>
            </ul>
          </Col>
          <Col span="13">
            <ul class="info-box">
              <li>
                <span class="first-span">订单状态:</span>

                <span v-if="orderInfo.state == 0">待付款（等待买家付款）</span>

                <span v-if="orderInfo.state == 1">
                  <span v-if="orderInfo.orderType==1">待发货（买家已经付款，请商家尽快发货</span>
                  <span v-else-if="orderInfo.orderType==2">待领取（等待收货人填写信息）</span>
                </span>

                <span v-if="orderInfo.state == 2">
                  待收货（商家已发货，等待买家收货并交易完货
                </span>

                <span v-if="orderInfo.state == 3">已完成</span>

                <span v-if="orderInfo.state == -2">已关闭</span>

                <span v-if="orderInfo.state == 5">维权中</span>

                <span v-if="orderInfo.state == 6">维权已完成</span>
              </li>
              <li class="success-li" v-if="orderInfo.state>1">
                <span class="first-span">快递公司：</span>
                <span>{{orderInfo.expressName}}</span>
              </li>
              <li v-if="orderInfo.state >= 2">
                <span class="first-span">快递单号：</span>
                <span>{{orderInfo.expressSn}}</span>
              </li>
              <li v-if="orderInfo.state >= 2">
                <span class="first-span">发货时间：</span>
                <span>{{orderInfo.sendTime}}</span>
              </li>
              <li v-if="orderInfo.state == 3">
                <!-- <span class="first-span">送达时间：</span> -->
                <!-- <span>{{orderInfo.finishTime}}</span> -->
              </li>
              <li>
                <div v-if="stepState==-2">
                  <Button v-if="hasRole(30205)" @click="remarksshowfuc" class="btn-a" type="primary">添加备注</Button>
                </div>
                <div v-if="stepState==0">
                  <Button v-if="hasRole(30203)" @click="confirmPayment" class="btn-a" type="primary">确认付款</Button>
                  <Button v-if="hasRole(30207)" @click="orderMoneyModiy" class="btn-a" type="primary">订单改价</Button>
                  <Button v-if="hasRole(30205)" @click="remarksshowfuc" class="btn-a" type="primary">添加备注</Button>
                </div>

                <div v-if="stepState==1">
                  <Button v-if="hasRole(30205)" @click="remarksshowfuc" class="btn-a" type="primary">添加备注</Button>
                  <Button v-if="hasRole(30202)" @click="confirmSendOf(true)" class="btn-a" type="primary">确认发货</Button>
                </div>

                <div v-if="stepState==2">
                  <Button v-if="hasRole(30209)" @click="confirmReceipt" class="btn-a" type="primary">确认收货</Button>
                  <Button v-if="hasRole(30204)" type="primary">修改物流</Button>
                  <Button v-if="hasRole(30206)" @click="cancelGoods" class="btn-a" type="primary">取消发货</Button>
                  <Button v-if="hasRole(30205)" @click="remarksshowfuc" class="btn-a" type="primary">添加备注</Button>
                </div>
                <div v-if="stepState==3">
                  <Button v-if="hasRole(30205)" @click="remarksshowfuc" class="btn-a" type="primary">添加备注</Button>
                </div>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <!-- 包裹信息 -->
      <div class="order-box">
        <Row class="part-box" v-for="(item,index) in packageList" :key="index">
          <Col span="2">
            <div class="package-box">
              <p>包裹A</p>
            </div>
          </Col>
          <Col span="20" class="part-right">
            <ul class="part-info clear">
              <li>
                <span class="first-span">快递：</span>
                <span>{{item.delivery}}</span>
              </li>
              <li class="success-li">
                <span>订单号：</span>
                <span>{{item.expressSn}}</span>
              </li>
              <li>
                <Button size="small" type="default">查看物流</Button>
              </li>
              <li class="success-li">
                <span>发货时间：</span>
                <span>{{item.sendTime}}</span>
              </li>
            </ul>
            <div class="goods-box">
              <img :src="item.imgUrl" alt="goods" />
              <span class="name">{{item.goodsName}}</span>
              <span class="money">￥{{item.price}}</span>
            </div>
          </Col>
        </Row>
      </div>

      <div class="goods-info">
        <div class="table-box">
          <!-- Table -->
          <Table class="tables-data" border :columns="goodsColumns" :data="orderGoodsList"></Table>

          <!-- 赠品管理 -->
          <div class="table-bottom">
            <Row v-for="(item,index) in giftsData" :key="index">
              <Col span="3" class="activity-name">
                <p>{{item.type}}</p>
              </Col>
              <Col span="21" class="activity-img">
                <span v-for="(items,index) in item.data" :key="index">
                  <img
                    style=" display: block;width:60px;height:40px; background-color: #cccccc;"
                    :src="items.thumb"
                    alt
                  />
                </span>
              </Col>
            </Row>

            <Row>
              <Col span="24" class="footer">
                <p>商品小计:￥{{this.orderInfo.goodsPrice}}</p>

                <p>优惠金额:￥{{this.orderInfo.discountAmount}}</p>

                <p>定制服务费:￥{{this.orderInfo.custPrice}}</p>
                
                <p>运费:￥{{this.orderInfo.dispatchPrice}}</p>

                <p>实付款:￥{{this.orderInfo.payPrice}}</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <!-- 各种弹出框 -->
      <Modal
        id="updateshow"
        title="修改订单信息"
        v-model="updateshow"
        :closable="false"
        @on-ok="updateindent"
      >
        <div class="inputitem">
          <span>收货人</span>
          <Input placeholder="收货人" v-model="update.name" clearable style="width: 250px" />
        </div>

        <div class="inputitem">
          <span>收货人电话</span>
          <Input
            placeholder="收货人电话"
            type="text"
            v-model="update.tel"
            clearable
            style="width: 250px"
          />
        </div>
        <div class="inputitem">
          <span>收货地址</span>
          <Input placeholder="收货地址" v-model="update.addressDetail" clearable style="width: 250px" />
        </div>
      </Modal>
      <!-- 备注 -->
      <Modal
        id="remarksshow"
        title="备注"
        v-model="remarksshow"
        :closable="false"
        @on-ok="addremarks"
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
      <!-- 取消发货 -->
      <Modal id="waive" title="取消发货" v-model="waiveshow" :closable="false" @on-ok="addcancelGoods">
        <div class="inputitem">
          <Input :rows="6" type="textarea" v-model="waivetext" placeholder="请输入取消原因" />
        </div>
      </Modal>

      <!-- 订单发货 -->
      <Modal id="logisticsshow" title="订单发货" v-model="modalBool" :closable="false" footer-hide>
        <div class="inputitem" style="margin-bottom: 10px;">
          <span>收货地址：</span>
          <span>{{update.name}},{{update.tel}},{{update.addressDetail}}</span>
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
            <Button @click="confirmSendOf(false)">取消</Button>
            <Button class="btn-a" type="primary" @click="modalBoolFun('logisticsForm')">确定</Button>
          </FormItem>
        </Form>
      </Modal>
      <!-- 修改物流 -->
      <Modal
        id="logisticsShow"
        title="修改物流信息"
        v-model="logisticsShow"
        :closable="false"
        @on-ok="updatelogisticsfuc"
      >
        <div class="inputitem" style="ma">
          <span>收货人</span>
          <span>{{orderInfo.addressDetail}}{{orderInfo.name}}{{orderInfo.tel}}</span>
        </div>
        <div class="inputitem">
          <span>快递公司名</span>
          <Select placeholder="请选择快递" v-model="updatelogisticsdata.expressName" style="width:250px">
            <Option value="顺丰">顺丰</Option>
            <Option value="圆通">圆通</Option>
            <Option value="中通">中通</Option>
            <Option value="申通">申通</Option>
            <Option value="邮政">邮政</Option>
            <Option value="京东">京东</Option>
          </Select>
        </div>

        <div class="inputitem">
          <span>快递单号</span>
          <Input
            placeholder="请输入快递单号"
            v-model="updatelogisticsdata.expressSn"
            clearable
            style="width: 250px"
          />
        </div>
      </Modal>
      <!-- 修改订单价格 -->
      <Modal
        id="priceshow"
        title="修改价格"
        v-model="priceshow"
        :closable="false"
        @on-ok="modifyPriceFun"
      >
        <div class="inputitem">
          <Input :rows="6" type="number" v-model="priceupdata" placeholder="请输入价格" />
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import goodsUtilsFun from "@/utils/goodsUtils.js";
import orderApi from "@/api/request/order.js";
import VDistpicker from "v-distpicker";
export default {
  data() {
    return {
      priceupdata: "",
      priceshow: false,
      createTime: "",
      payTime: "",
      sendTime: "",
      stepState: 0,
      orderState: 0,
      finishTime: "",
      // 确认发货弹窗
      modalBool: false,
      orderInfo: {
        id: "",

        orderNumber: "",

        buyer: "",

        channel: "",

        orderType:"",
        
        payType: "",

        name: "",

        delivery: "",

        state: "",

        tel: "",

        receiveType: "",

        sendTime: "",

        expressSn: "",
        // 快递公司
        expressName: "",

        province: "",

        city: "",

        area: "",

        address: "",

        payPrice: "",

        dispatchPrice: "",

        discountAmount: "",

        custPrice:"",
        
        remarkBuyer: ""
      },

      // 更新订单显示
      updateshow: false,

      update: {
        // 收货人姓名
        name: "",
        // 收货人电话
        tel: "",
        // 地址
        addressDetail: ""
      },

      //确认收货弹出窗
      logisticsForm: {
        expressName: "",
        expressSn: "",
        batchType: ""
      },

      // 确认收货验证
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
        batchType: [
          {
            required: true,
            message: "请选择发货类型",
            trigger: "change"
          }
        ]
      },

      //备注显示
      remarksshow: false,
      waiveshow: false,
      waivetext: "",

      //添加备注
      remarkdata: "",

      //修改物流
      logisticsShow: false,

      updatelogisticsdata: {
        expressName: "",
        expressSn: ""
      },

      // 商品信息的数据
      orderGoodsList: [],

      giftsData: [],

      goodsColumns: [
        {
          title: "商品信息",
          key: "info",
          render: (h, params) => {
            return h("div", {}, [
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }
                },
                [
                  h("img", {
                    style: {
                      width: "40px",
                      height: "40px",
                      marginRight: "10px"
                    },
                    attrs: {
                      src: params.row.thumb
                    }
                  }),
                  h(
                    "p",
                    {
                      style: {}
                    },
                    params.row.title
                  )
                ]
              )
            ]);
          }
        },
         {
          title: "定制信息服务",
          render: (h, params) => {
            console.log("",params)
            let letterInfo = params.row.hasOwnProperty("makingInfo")?params.row.makingInfo.letterInfo:"无"
            let message = params.row.hasOwnProperty("makingInfo")?params.row.makingInfo.message:"无"
            let cardMessage=params.row.hasOwnProperty("makingInfo")?params.row.makingInfo.cardMessage:"无"
            let entire=params.row.hasOwnProperty("makingInfo")?params.row.makingInfo.entire:"0"
            let packing=params.row.hasOwnProperty("makingInfo")?params.row.makingInfo.packing:"无"

            return h("div", {}, [
              h(
                "div",
                {
                  class: "render-p"
                },
                [
                  h(
                    "span",{
                      style:{
                        "marginRight": "5px"
                      }
                    },
                    "刻字服务:"
                  ),
                  h(
                    "span",{},
                    letterInfo
                  )
                ]
              ),
              h(
                "div",
                {
                  class: "render-p"
                },
                [
                  h(
                    "span",{
                      style:{
                        "marginRight": "5px"
                      }
                    },
                    "留言:"
                  ),
                  h(
                    "span",{},
                    message
                  )
                ]
              ),
               h(
                "div",
                {
                  class: "render-p"
                },
                [
                  h(
                    "span",{
                      style:{
                        "marginRight": "5px"
                      }
                    },
                    "卡片寄语:"
                  ),
                  h(
                    "span",{},
                    cardMessage
                  )
                ]
              ),
              h(
                "div",
                {
                  class: "render-p",
                  style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }
                },
               
                [
                  h(
                    "span",{
                      style:{
                        "marginRight": "5px"
                      }
                    },
                   "封套:"
                  ),
                  h(
                    "span",{},
                    [
                       h("img", {
                        style: {
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                          display:entire==0?"none":"inline"
                        },
                        attrs: {
                          src: entire
                        }
                      }),
                    ]
                  
                  ),
                   h(
                    "span",{
                      style:{
                         display:entire==0?"inline":"none"
                      }
                    },
                   "无"
                  ),
                ]
              ),
             
              h(
                "div",
                {
                  class: "render-p"
                },
                 [
                  h(
                    "span",{
                      style:{
                        "marginRight": "5px"
                      }
                    },
                    "礼盒:"
                  ),
                  h(
                    "span",{},
                    packing
                  )
                ]
              )
            ]);
          }
        },
        {
          title: "规格、编码",
          // key: 'info',
          render: (h, params) => {
            console.log("规格、编码",params.row)
            let specs = "无";
            let goodsCode = "无";
            let productsn = "无";
            if(params.row.goods.hasOwnProperty('option')){
              typeof params.row.goods.option.specs == undefined ? (specs = "无") : (specs = params.row.goods.option.specs);
              typeof params.row.goods.option.goodsCode == undefined? (goodsCode = "无") : (goodsCode = params.row.goods.option.goodsCode);
              typeof params.row.goods.option.productsn == undefined? (productsn = "无") : (productsn = params.row.goods.option.productsn);
            }
            return h(
              "div",
              {
                style: {
                  height: "100%"
                }
              },
              [
                h("p", {}, `规格：${specs}`),
                h("p", {}, `编码：${goodsCode}`),
                h("p", {}, `条码：${productsn}`)
              ]
            );
          }
        },
        {
          title: "单价",
          // key: 'unitPrice',
          render: (h, params) => {
            return h("span", {}, `￥${params.row.priceUnit}`);
          }
        },
        {
          title: "数量",
          render: (h, params) => {
            return h("span", {}, `${params.row.count}`);
          }
        },
        {
          title: "原价",
          render: (h, params) => {
            return h("span", {}, `￥${params.row.priceOriginal}`);
          }
        },
        {
          title: "折扣后",
          render: (h, params) => {
            return h("span", {}, `￥${params.row.price}`);
          }
        }
      ],
      packageList: []
    };
  },
  // 拿到订单的编号初始化
  created() {
    let id = this.$route.query.orderId;
    this.getdetailItem(id);
  },
  // 联动
  components: { VDistpicker },

  methods: {
    // 获取商品信息
    getdetailItem: function(id) {
      orderApi
        .getdetailItem({
          id: id
        })
        .then(res => {
          console.log("商品信息", res);
          if (res.code == 1) {
            this.orderDatadetail(res);
            // 包裹信息
            this.packageList = res.data.packageList || [];
            // 商品详情
            this.orderGoodsList = res.data.orderGoodsList;

            this.giftsfuc(res.data);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 处理赠品信息
    giftsfuc: function(data) {
      console.log("allData", data);
      let arr = [];
      // 1 首购礼 2 满赠礼 3 单品礼赠 4 验证码赠品
      if (data.hasOwnProperty("gift1")) {
        let obj = {};
        obj.data = data.gift1;
        obj.type = "首购礼";
        arr.push(obj);
      }
      if (data.hasOwnProperty("gift2")) {
        let obj = {};
        obj.data = data.gift2;
        obj.type = "满赠礼";
        arr.push(obj);
      }
      if (data.hasOwnProperty("gift3")) {
        let obj = {};
        obj.data = data.gift3;
        obj.type = "单品礼赠";
        arr.push(obj);
      }
      if (data.hasOwnProperty("gift4")) {
        let obj = {};
        obj.data = data.gift4;
        obj.type = "验证码赠品";
        arr.push(obj);
      }
      if (data.hasOwnProperty("gift5")) {
        let obj = {};
        obj.data = data.gift5;
        obj.type = "赠品券赠品";
        arr.push(obj);
      }

      this.giftsData = arr;
      console.log("赠礼数据", this.giftsData);
    },
    // 获取订单详情数据并处理
    orderDatadetail: function(data) {
      if (data.data.status == 8) {
        data.data.status = -2;
      }
      (this.stepState = data.data.status),
        (this.orderInfo.id = data.data.id),
        (this.orderInfo.buyer = data.data.memberNickname),
        (this.orderInfo.orderNumber = data.data.orderNo),
        (this.orderInfo.channel = data.data.soureType),
        (this.orderInfo.orderType = data.data.orderType),
        // 配送方式
        (this.orderInfo.receiveType = data.data.receiveType),
        (this.orderInfo.payType = data.data.payType),
        (this.orderInfo.addressDetail = data.data.addressDetail),
        // 收货人姓名
        (this.orderInfo.name = data.data.buyerName),
        // 买家电话
        (this.orderInfo.tel = data.data.buyerMobile),
        // 支付状态
        (this.orderInfo.state = data.data.status),
        (this.orderInfo.sendTime = goodsUtilsFun.timeFun(
          goodsUtilsFun.timeStamp(data.data.sendTime)
        )),
        (this.createTime = goodsUtilsFun.timeFun(
          goodsUtilsFun.timeStamp(data.data.createTime)
        )),
        (this.payTime = goodsUtilsFun.timeFun(
          goodsUtilsFun.timeStamp(data.data.payTime)
        )),
        (this.sendTime = goodsUtilsFun.timeFun(
          goodsUtilsFun.timeStamp(data.data.sendTime)
        )),
        (this.finishTime = goodsUtilsFun.timeFun(
          goodsUtilsFun.timeStamp(data.data.finishTime)
        )),
        (this.orderInfo.payPrice = data.data.payPrice),
        (this.orderInfo.goodsPrice = data.data.goodsPrice);

      this.orderInfo.dispatchPrice = data.data.dispatchPrice;

      this.orderInfo.discountAmount = data.data.discountAmount;

      this.orderInfo.custPrice = data.data.custPrice;

      this.orderInfo.remarkBuyer = data.data.remarkBuyer;

      if (data.data.status == 2 || data.data.status == 3) {
        (this.orderInfo.expressSn = data.data.sendBatchDetail.expressSn),
        (this.orderInfo.expressName = data.data.sendBatchDetail.expressName);
      }
    },

    // 显示修改订单收货信息弹出框
    modifyOrder: function() {
      this.updateshow = true;

      this.update.tel = this.orderInfo.tel;

      this.update.name = this.orderInfo.name;

      this.update.addressDetail = this.orderInfo.addressDetail;

      console.log(this.update);
    },

    // 修改订单收货信息
    updateindent: function() {
      orderApi
        .updateindent({
          id: this.orderInfo.id,
          buyerName: this.update.name,
          buyerMobile: this.update.tel,
          addressDetail: this.update.addressDetail
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$Message.success("修改成功");
            this.getdetailItem(this.orderInfo.id);
          } else {
            this.$Message.error("修改失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    remarksshowfuc: function() {
      this.remarksshow = true;
    },

    addremarks: function() {
      orderApi
        .addremarks({
          id: this.orderInfo.id,
          remark: this.remarkdata
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.getdetailItem(this.orderInfo.id);
            this.$Message.success("添加成功");
          } else {
            this.$Message.error("添加失败");
          }
        })
        .catch(error => {
          this.$Message.error("添加失败");
        });
    },

    // 确认付款
    confirmPayment: function() {
      orderApi
        .confimPay({
          id: this.orderInfo.id
        })
        .then(res => {
          if (res.code == 1) {
            this.getdetailItem(this.orderInfo.id);
            this.$Message.success(res.message);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 确认发货显示弹窗
    confirmSendOf: function(flag) {
      this.modalBool = flag;

      this.update.tel = this.orderInfo.tel;

      this.update.name = this.orderInfo.name;

      this.update.addressDetail = this.orderInfo.addressDetail;
    },

    // 填写确认发货信息确认发货
    modalBoolFun: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          orderApi
            .Delivery({
              expressName: this.logisticsForm.expressName,

              expressSn: this.logisticsForm.expressSn,

              orderId: this.orderInfo.id,

              deliverType: this.logisticsForm.batchType
            })
            .then(res => {
              if (res.code == 1) {
                this.getdetailItem(this.orderInfo.id);
                this.confirmSendOf(false);
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

    // 确认收货
    confirmReceipt: function() {
      orderApi
        .confimDelivery({
          id: this.orderInfo.id
        })
        .then(res => {
          if (res.code == 1) {
            this.getdetailItem(this.orderInfo.id);
            this.$Message.success(res.message);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 订单改价
    orderMoneyModiy: function() {
      this.priceshow = true;
    },

    // 修改订单价格
    modifyPriceFun: function() {
      orderApi
        .updatePrice({
          id: this.orderInfo.id,
          price: this.priceupdata
        })
        .then(res => {
          this.getdetailItem(this.orderInfo.id);
          if (res.code == 1) {
            this.$Message.success(res.message);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 查看物流
    showLogistics: function() {
      console.log("查看物流");
    },
    // 取消发货对话弹出框
    cancelGoods: function() {
      this.waiveshow = true;
    },
    // 取消发货
    addcancelGoods: function() {
      orderApi
        .addcancelGoods({
          id: this.orderInfo.id,
          remark: this.waivetext,
          status: 1
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$Message.success("取消成功");
            this.getdetailItem(this.orderInfo.id);
          } else {
            this.$Message.error("取消失败");
          }
        })
        .catch(error => {
          this.$Message.error("取消失败");
          console.log(error);
        });
    },

    // 弹出修改物流信息对话框
    logisticsShowfuc: function() {
      (this.logisticsShow = true),
        (updatelogisticsdata.expressName = ""),
        (updatelogisticsdata.expressSn = "");
    },

    // 修改物流信息
    updatelogisticsfuc: function() {
      orderApi
        .updateDelivery({
          orderId: this.orderInfo.id,
          expressName: this.updatelogisticsdata.expressName,
          expressSn: this.updatelogisticsdata.expressSn
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success(res.message);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          this.$Message.error("数据请求失败");
          console.log(error);
        });
    }
  }
};
</script>

<style>
#order-info {
  min-width: 1200px;
}
#order-info .remarkBuyer {
  width: 475px;
  overflow: hidden;
}
#order-info .remarkBuyer > div:nth-child(1) {
  width: 70px;
  float: left;
}
#order-info .remarkBuyer > div:nth-child(2) {
  width: 350px;
  float: left;
  line-height: 24px;
}
#order-info .step-box {
  padding: 15px 300px;
}
#order-info .order-box {
  margin: 15px 20px 10px;
  border: 1px solid #ddd;
}
#order-info .info-box {
  padding: 10px 20px;
}
#order-info .info-box:nth-child(1) {
  border-right: 1px solid #ddd;
}
#order-info .info-box li {
  margin: 10px 0;
  font-size: 14px;
}
#order-info .info-box .success-li {
  margin-top: 25px;
}

/* 部分发货的样式 */
#order-info .part-box,
#order-info .goods-info {
  padding: 20px;
}
#order-info .package-box {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 20px;
  border-right: 1px solid #ccc;
  /* padding-right: 20px; */
}

#order-info .part-right {
  margin-left: 20px;
}
#order-info .part-info {
  font-size: 13px;
}
#order-info .part-info li {
  float: left;
  margin-right: 40px;
}
#order-info .goods-box {
  margin-top: 15px;
  font-size: 13px;
}
/* #order-info .tables-data {
      font-size: 13px;
  } */
#order-info .goods-box img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  margin-right: 10px;
}
#order-info .goods-box .name {
  margin-right: 10px;
}
#order-info .render-p {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 10px 5px 5px 0;
}
#order-info .table-bottom {
  border: 1px solid #e8eaec;
  border-top: none;
}
#order-info .activity-name p {
  padding: 0 18px;
  border-right: 1px solid #e8eaec;
  border-bottom: 1px solid #e8eaec;
  height: 80px;
  line-height: 80px;
  font-size: 14px;
  text-align: center;
}
#order-info .activity-img {
  padding: 0 18px;
  /* border-right: 1px solid #e8eaec; */
  border-bottom: 1px solid #e8eaec;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
#order-info .activity-img span {
  margin-right: 10px;
}
#order-info .activity-img img {
  width: 50px;
  height: 50px;
}
#order-info .footer {
  border-top: none;
  text-align: right;
  padding: 18px;
}

#order-info .footer p {
  margin: 10px 0;
  font-size: 14px;
}
#updateshow .inputitem > span {
  width: 65px;
  display: inline-block;
}
#updateshow .inputitem {
  margin-bottom: 10px;
}
#logisticsShow .inputitem {
  margin: 20px 0 !important;
}
</style>
