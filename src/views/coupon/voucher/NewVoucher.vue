<template>
  <div class="container">
    <div class="redu-box">
      <div class="currentTitle">新人发券</div>
      <Card>
        <!-- 内容区域 -->
        <div class="redu-content">
          <!-- 内容区域内盒子 -->
          <div class="redu-inset">
            <!-- 内容标题 -->
            <div class="inset-content">
              <div class="standard">
                <p>新人定义：无消费记录的用户即视为新人。</p>
                <p>优惠券选择：最多可选择三张优惠券且优惠券须是在有效期内,此处发放的优惠券数量不得大于相关优惠券库存，大于库存即停止该优惠券发放！</p>
                <p>活动有效期：活动有效期关闭则认为活动长期有效。若开启活动有效期，则优惠券在活动有效期内发放。</p>
              </div>
              <!-- 表单区域 -->
              <Form :label-width="100" ref="reduForm" :model="saveData" :rules="ruleValidate" style="border: 1px solid #dcdcdc">
                <div class="redu-title">活动设置</div>
                <FormItem label="活动开启" prop="status">
                  <RadioGroup
                    @on-change="activestatefuc(saveData.status)"
                    v-model="saveData.status"
                  >
                    <Radio style="margin-left: 8px" label="1">开启</Radio>
                    <Radio style="margin-left: 8px" label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <div>
                  <FormItem label="选择优惠券" class="ivu-form-item-required">
                    <add-discount
                      @listentDiscountData="listentDiscountData($event)"
                      :options="activestate"
                      :optionsData="showData"
                    ></add-discount>
                  </FormItem>
                </div>
                <FormItem label="单次推券数量" class="ivu-form-item-required">
                  <Input
                    :disabled="activestate"
                    v-model="saveData.singleCoupon"
                    style="width: 100px;margin-left: 5px"
                  ></Input>&nbsp;&nbsp;张
                </FormItem>
                <FormItem label="推券节点" prop="vouchersNode">
                  <RadioGroup v-model="saveData.vouchersNode">
                    <Radio :disabled="activestate" style="margin-left: 8px" label="1">首次进店</Radio>
                    <Radio :disabled="activestate" style="margin-left: 8px" label="2">首次下单</Radio>
                    <Radio :disabled="activestate" style="margin-left: 8px" label="3">首次支付</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动有效期" prop="activityId">
                  <RadioGroup
                    @on-change="activityfuc(saveData.activityId)"
                    v-model="saveData.activityId"
                  >
                    <Radio :disabled="activestate" style="margin-left: 8px" label="1">开启</Radio>
                    <Radio :disabled="activestate" style="margin-left: 8px" label="2">关闭</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动时间">
                  <DatePicker
                    :disabled="activestate||activesdate"
                    :editable="false"
                    :options="optionsTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    @on-change="timeChange"
                    placeholder="时间"
                    v-model="saveData.time"
                    style="width: 280px"
                  ></DatePicker>
                </FormItem>
              </Form>
            </div>
          </div>
          <!--保存 取消 -->
          <div class="formBtn">
            <Button
              :disabled="activestate"
              type="primary"
              class="comBtn"
              :loading="loading"
              @click="save('reduForm')"
            >保存
            </Button>


          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import addDiscount from "@/components/addDiscount/addDiscount";
import marking from "@/api/request/marking";
import goodsUtilsFun from "@/utils/goodsUtils.js";
export default {
  name: "NewVoucher",
  components: {
    addDiscount
  },
  data() {
    return {
      loading:false,
      ID:"",
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      activesdate: false,
      activestate: false,
      // 当前状态1为新增,2为编辑
      preservation:1,
      custonized_descs: [],
      // 已经选择的优惠券
      showData: [],
      saveData: {
        // 活动开启
        status: "1",
        // 单次推券数量
        singleCoupon: "",
        // 推券节点1,进店2下单,3支付
        vouchersNode: "1",
        // 活动有效期
        activityId: "1",
        // 活动时间
        time: [],
        // 优惠券
        selectrule: []
      },
      ruleValidate: {
        status: [
          {
            required: true,
            message: "请选择活动状态",
            trigger: "change"
          }
        ],
        singleCoupon: [
          {
            required: true,
            message: "单次推券数量不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入一个正整数",
            trigger: "blur"
          }
        ],
        vouchersNode: [
          {
            required: true,
            message: "请选择推券节点",
            trigger: "change"
          }
        ],
        activityId: [
          {
            required: true,
            message: "请选择活动有效期",
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    console.log("----------------------------------创建")
    this.listCouponnewfuc()
  },
  methods: {
    activestatefuc: function(data) {
      if (data == 1) {
        this.activestate = false;
      } else {
        this.activestate = true;
        this.save('reduForm');
        
      }
    },
    activityfuc: function(data) {
      if (data == 1) {
        this.activesdate = false;
      } else {  
        this.activesdate = true;
        this.saveData.time=[];
       
      }
    },
    // 提交数据
    save: function(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let RegExp=/^[1-9]\d*$/
             console.log("this.activestate-----------------",this.activestate);
            if ((!this.activestate)&&this.saveData.selectrule.length == 0) {
              this.$Message.error("请选择优惠券");
            } 
            else if((!this.activestate)&&!RegExp.test(this.saveData.singleCoupon)){
             
              this.$Message.error("推券数量必须为正整数");
            }
            else if((!this.activestate)&&this.saveData.singleCoupon==""){
              this.$Message.error("推券数量不能为空");
            }
            else{
             
              if(this.preservation=="1"){
                this.loading=true;
                this.addCouponnewfuc();
              }
              else if(this.preservation=="2"){
                this.loading=true;
                this.couponnewUpdatefuc(this.ID);
              }
            }
          }
        }); 
    },
    // 编辑查询新人券，以判断是目前是编辑还是新增状态
    listCouponnewfuc: function() {
      marking
        .listCouponnew({})
        .then(res => {
          console.log("编辑状态",res);
          if (res.code == 1) {

            if(res.data.id==""){
              this.preservation=1
            } 
            else{
              this.preservation=2
              
              this.saveData.status=String(res.data.status)
              console.log("tttttttttttttttttttttttttttttttttt",res.data.status)
              if(res.data.status==2){
                this.activestate=true
              }
              else{
                this.activesdate=false
              }
              this.saveData.singleCoupon=String(res.data.singleCoupon),
              
              this.saveData.vouchersNode=String(res.data.vouchersNode),
              
              this.saveData.activityId=String(res.data.activityId)

              this.ID=res.data.id
              
              let arr=[2]
              
              arr[0]=goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(res.data.startingTime)),
              
              arr[1]=goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(res.data.endTime))
             
              if(res.data.activityId==2){

                this.activesdate = true;
               
                this.saveData.time =[];
              }
              else{
                this.activesdate = false;
                  
                this.saveData.time =arr;
              }
              
              console.log("赠品券",res.data.rulesList)
              let rulesListArr=[]
              for(let i in res.data.rulesList){
                rulesListArr.push(res.data.rulesList[i].couponid)
              }
              this.dataChangefuc(rulesListArr)

            }
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //修改数据类型
    dataChangefuc:function(data){   
      marking.AllcouponDetail({
          id:data
        })
        .then(res => {
          console.log("优惠券",res)
          if(res.code==1){
              let arr=[]
              for(let i in res.data){
                let obj={}
                obj.couponsName=res.data[i].couponsName,
                obj.id=res.data[i].id,
                obj.stock=res.data[i].stock,
                arr.push(obj)
              }
              this.showData=arr
          }
         
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 编辑保存新人券
    couponnewUpdatefuc: function(id) {
      console.log(this.saveData.time)
      let timearr=[]
      if(this.saveData.time.length==0){
          timearr=""
      }
      else if(this.saveData.time[0].length!=0 && this.saveData.time[1].length!=0){
        let arr=[2]
        arr[0]=goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(this.saveData.time[0]))
        arr[1]=goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(this.saveData.time[1]))
        timearr=arr
      }else{
        timearr=""
      }
      marking.couponnewUpdate({
          id:id,
          status: this.saveData.status,
          singleCoupon: this.saveData.singleCoupon,
          vouchersNode: this.saveData.vouchersNode,
          activityId: this.saveData.activityId,
          
          time:timearr,
              
          selectrule: this.saveData.selectrule
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.loading=false;
            this.$Message.success(res.message);
            // this.goBack()
          } else {
             this.loading=false;

            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    
    // 新增保存新人券
    addCouponnewfuc: function() {
       let timearr=[]
       if(this.saveData.time.length==0){
          timearr=""
        }
       else if(this.saveData.time[0].length!=0 && this.saveData.time[1].length!=0){
          let arr=[2]
          arr[0]=goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(this.saveData.time[0]))
          arr[1]=goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(this.saveData.time[1]))
          timearr=arr
        }else{
          timearr=""
        }
      marking
        .Addcouponnew({
          status: this.saveData.status,
          singleCoupon: this.saveData.singleCoupon,
          vouchersNode: this.saveData.vouchersNode,
          activityId: this.saveData.activityId,
          time: timearr,
          selectrule: this.saveData.selectrule
        })
        .then(res => {
          console.log(res);
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
    
    // 返回列表页
    goBack: function() {
      this.$router.push({
        path: "/@/views/coupon/coupon/Coupon"
      });
    },

    listentDiscountData: function(data) {
      console.log("select data", data);
      let arr = [];
      for (let i in data) {
        let obj = {};
        obj.couponName = data[i].couponsName;
        obj.couponid = data[i].id;
        obj.couponTypes = data[i].type;
        obj.inventory = data[i].stock;
        arr.push(obj);
      }
      this.saveData.selectrule = arr;
      console.log("优惠券", this.saveData.selectrule);
    },

    timeChange: function(date) {
      this.saveData.time = date;
    },
    routerfunc:function(data){
      this.listCouponnewfuc()
    }
    
  },
  watch: {
    $route:'routerfunc'
  },
};
</script>

<style scoped>
@import "./NewVoucher.css";
</style>
