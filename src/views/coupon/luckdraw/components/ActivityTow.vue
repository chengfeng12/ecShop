<template>
  <div>
    <div class="basic-info">
      <div>
        <!-- 内层判断 -->
        <Form ref="prizeFrom" :model="prizeFrom" :rules="prizeFromRule" :label-width="120">
          <!-- 标题列 -->
          <div class="prize_container">
            <div class="prize_header" v-if="exportData.activatyPrize.length>0">
            <div
                class="prize_item"
                v-for="(item,index) in exportData.activatyPrize"
                :key="index"
                @click="alterPrize(item,index)"
              >{{item.name}}</div>
            </div>

            <div class="prize_content">
              <div v-if="!afterflag" class="deleteprize" @click="deleteprizeFuc()">&times;</div>
              <div style="width:450px;">
                <FormItem label="奖品名称" prop="name">
                  <Input v-model="prizeFrom.name" placeholder style="width: 300px;" :maxlength="8" /><span>{{prizeFrom.name.length}}/8</span>
                </FormItem>
              </div>
              <div>
                <FormItem label="奖品类型" prop="type">
                  <RadioGroup @on-change="typeChange" v-model="prizeFrom.type">
                    <Radio :disabled="true" label="1">赠品</Radio>
                    <Radio label="2">优惠券</Radio>
                    <Radio :disabled="true" label="3">
                      送积分
                      <span>（需对接CRM）</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </div>

              <FormItem v-if="prizeFrom.type==1" :key="1" :label-width="69" label="">
                <div class="formitem-div">
                    <div><span style="color:red">*</span><span>赠品</span></div>
                    <div>
                      <div class="typeitem">
                        <add-gift @listentgoodData="listentgifData($event)" :selectGoods="showGift" res="+选择赠品"></add-gift>
                        <span @click="createGift()" class="typespan">新建</span>
                      </div>
                    </div>
                </div>    
              </FormItem>

              <FormItem v-if="prizeFrom.type==2" :key="2" :label-width="69">
                <div class="formitem-div">
                  <div><span style="color:red">*</span><span>优惠券</span></div>
                  <div><add-discount :selectNum="selectNum" :optionsData="showData" @listentDiscountData="listentCouponData($event)" res="+选择优惠券"></add-discount></div>
                </div>
              </FormItem>

              <FormItem v-if="prizeFrom.type==1" label="奖品总数" prop="total">
                <Input v-model="prizeFrom.total" placeholder style="width: 100px;" /><span>件</span>
              </FormItem>
              
              <div class="minmost">
                <!-- <div class="minmost_l">
                  <FormItem label="单日最低发放" prop="minimum">
                    <Input v-model="prizeFrom.minimum" placeholder style="width: 100px;" />
                    <span>件</span>
                  </FormItem>
                </div> -->
                <div class="minmost_r">
                  <FormItem label="单日最多发放" prop="most">
                    <Input v-model="prizeFrom.most" placeholder style="width: 100px;" />
                    <span>件</span>
                  </FormItem>
                </div>
              </div>
              <FormItem label="单人中奖个数上限" prop="upperLimit">
                <Input v-model="prizeFrom.upperLimit" placeholder style="width: 100px;" />
                <span>件</span>
              </FormItem>

              <FormItem :label-width="50">
                <div class="img-box">
                  <span style="color:red">*</span>
                  <span style="margin-right:12px">奖品图片</span>
                  
                  <Button style="margin-bottom: 10px;" type="primary" @click="imgSleFun">+选择图片</Button>
                  <img-select
                    ref="imgSel"
                    class="img-select"
                    :options="{typeId: 'image'}"
                    @listentoptpmfile="imgData($event)"
                  />
                </div>
                <div class="prize-img" v-if="prizeFrom.img">
                  <img :src="prizeFrom.img" alt />
                </div>

                <div style="margin-left:69px">仅支持 jpg、png、 尺寸48*48 不超过1M</div>
              </FormItem>

              <FormItem label="奖品说明" prop="content">
                <Input v-model="prizeFrom.content" style="width: 400px;" type="textarea" />
              </FormItem>
            </div>
          </div>

          <FormItem :label-width="50">
            <Button type="primary" @click="addPrizeBtn('prizeFrom')" style="width: 100px;">
              <span v-if="afterflag">+添加奖品</span>
              <span v-else>保存奖品</span>  
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="stepbtn">
      <span>
        <Button @click="stepBtnfuc()" style="width: 100px;" type="primary" size="large">下一步</Button>
      </span>
      <span>
        <Button @click="lastStep()" style="width: 100px;" type="default" size="large">上一步</Button>
      </span>
    </div>
  </div>
</template>

<script>
import marking from "@/api/request/marking";
import goods from "@/api/request/goods";
import addGift from "@/components/addGood/addGift";
import addDiscount from "@/components/addDiscount/addDiscount";
import ImgSelect from "@/components/imgSelect/imgselect";
export default {
  name: "ActivityTow",
  components: { addGift, addDiscount, ImgSelect },
  props: ["prizeOptiontow"],
  data() {
    return {
      // 要修改项目的下表
      indexID: "",
      // 判断修改或添加
      afterflag: true,
      // 单选
      selectNum:{
        select: 1
      },
      // 奖品数组
      prizeFrom: {
        // 奖品名称
        name: "",
        //奖品类型
        type: "2",

        //奖品数据优惠券或者赠品
        goodsContent: [],
        //奖品数目
        total: "",
        //单日最低发放
        minimum: "0",
        //单日最多发放
        most: "0",

        // 单人奖品说明最多发放
        upperLimit: "",

        // 奖品图片

        img: "",

        // 奖品说明
        content: ""
      },

      // 添加奖品校验规则
      prizeFromRule: {
        name: {
          required: true,
          message: "奖品名称不能为空",
          trigger: "blur"
        },
        //奖品数目
        total: [{
          required: true,
          message: "奖品总数不能为空",
          trigger: "blur"
        },
        {
            required: false,
            pattern: /^[1-9]\d*$/,
            message: "请输入一个整数",
            trigger: "blur"
        }],
        minimum:{
            required: false,
            pattern: /^([0]|[1-9][0-9]*)$/,
            message: "请输入一个非负整数",
            trigger: "blur"
          },
        most:{
            required: false,
            pattern: /^([0]|[1-9][0-9]*)$/,
            message: "请输入一个非负整数",
            trigger: "blur"
          },
        // 单人中奖个数上限
         upperLimit:[
          {
            required: true,
            message: "单人中奖个数上限不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入一个正整数",
            trigger: "blur"
          }],

        // 奖品说明
        content: {
          required: true,
          message: "奖品说明不能为空",
          trigger: "blur"
        }
      },
      // 最终导出数据
      exportData: {
        stepData: -1,
        activatyPrize: []
      },
      showGift:[],

      showData:[]
    };
  },

  created() {
    console.log("this.prizeOptiontow",this.prizeOptiontow)
    if (this.prizeOptiontow.length > 0) {
      console.log("this.prizeOptiontow",this.prizeOptiontow)
      this.prizeOptiontowfuc(this.prizeOptiontow);
    }
  },

  methods: {
    // 回退编辑
    prizeOptiontowfuc: function(data) {
      (this.exportData.activatyPrize = data[0].activatyPrize)
    },

    // 添加奖品
    addPrize: function() {
      console.log("数据格式", this.prizeFrom.goodsContent);
      if (this.afterflag) {
        console.log("1231321321");
        let obj = {};
          (obj.name = this.prizeFrom.name),
          //奖品类型
          (obj.type = this.prizeFrom.type),
          // 赠品||优惠券ID
          
          (obj.goodsContent = this.prizeFrom.goodsContent.join(',')),

          //奖品数目
          (obj.total = this.prizeFrom.total),
          //单日最低发放
          (obj.minimum = this.prizeFrom.minimum||0),
          //单日最多发放
          (obj.most = this.prizeFrom.most||0),
          // 单人奖品说明最多发放
          (obj.upperLimit = this.prizeFrom.upperLimit),
          // 奖品图片
          (obj.img = this.prizeFrom.img),
          //  奖品说明
          (obj.content = this.prizeFrom.content);
          // 奖品位置
          obj.location="",
          // 中奖率
          obj.winning="",
          // 将奖品导入暂存区
          this.exportData.activatyPrize.push(obj);
          
         
      } else {


        // 修改数据
        this.exportData.activatyPrize[this.indexID].name = this.prizeFrom.name,

        this.exportData.activatyPrize[this.indexID].type = this.prizeFrom.type,
        
        this.exportData.activatyPrize[this.indexID].total = this.prizeFrom.total,
    
        this.exportData.activatyPrize[this.indexID].minimum = this.prizeFrom.minimum||0,
        
        this.exportData.activatyPrize[this.indexID].goodsContent = this.prizeFrom.goodsContent.join(',');

        this.exportData.activatyPrize[this.indexID].most = this.prizeFrom.most||0,

        this.exportData.activatyPrize[this.indexID].upperLimit = this.prizeFrom.upperLimit,

        this.exportData.activatyPrize[this.indexID].content = this.prizeFrom.content;
        
        this.exportData.activatyPrize[this.indexID].img=this.prizeFrom.img;

        

        this.indexID = "";

        this.afterflag = true;
      }
      this.showData=[];
      this.clearform();
    },

    // 修改奖品显示数据
    alterPrize: function(data, index) {
        this.$refs.prizeFrom.resetFields();

        this.clearform();

        this.afterflag = false;

        this.indexID = index;

        (this.prizeFrom.name = data.name),
        
        (this.prizeFrom.type = String(data.type)),
        
        (this.prizeFrom.total = String(data.total)),
        
        (this.prizeFrom.minimum = data.minimum),
        
        (this.prizeFrom.most = data.most),
        
        (this.prizeFrom.upperLimit = data.upperLimit),
        
        (this.prizeFrom.content = data.content);

        (this.prizeFrom.img = data.img);
   

        if(this.prizeFrom.type==1){
          this.prizeFrom.goodsContent=data.goodsContent;
          this.showGiftfuc(this.prizeFrom.goodsContent)
        }
        else if(this.prizeFrom.type==2){
          console.log("data.goodsContent------------------------",data.goodsContent)
          this.prizeFrom.goodsContent=data.goodsContent;
          this.showCouponfuc(this.prizeFrom.goodsContent)
        }
    },
    // 赠品显示
    showGiftfuc:function(data){
      console.log("data---------------------",data)
      goods.selGoodsIds({
        ids: data
      }).then(res => {
        let showArr=[]
        for(let i in res.data){
          let obj={}
          obj.id=res.data[i].id
          obj.title=res.data[i].title,
          obj.price=res.data[i].price,  
          obj.thumb=res.data[i].thumb,
          showArr.push(obj)
        }
          this.showGift = showArr;
          console.log("赠品---------------",res)                  
       }).catch(error => {
          console.log(err)
        });
    },
    // 优惠券显示
    showCouponfuc:function(data){
      marking.AllcouponDetail({
          id: data
        }).then(res => {
          
          let data=res.data
          
          let arr=[]
          console.log("data----",data)
          for(let i in data){
            let obj={}
            obj.couponsName=data[i].couponsName,

            obj.id=data[i].id,
            
            obj.stock=data[i].stock,
            
            arr.push(obj)
          }
          this.showData=arr
          console.log("All优惠券",this.showData)  
        }).catch(error => {
          console.log(error)
      });
    },
    //删除当前表单
    deleteprizeFuc: function() {

      this.exportData.activatyPrize.splice(this.indexID,1);
      
      this.afterflag=true;
      
      this.clearform();
    },

    createGift: function() {
      this.$router.push({ path: "/@/views/goodsadd/GoodsAdd?role=0&name=1" });
    },

    stepBtnfuc: function(name) {
      if (this.exportData.activatyPrize.length > 0) {
        this.setData();
      } else {
        this.$Message.error("请至少添加一个奖品");
      }
    },
    typeChange: function(value) {},
    // 弹出图片编辑
    imgSleFun() {
      this.$refs.imgSel.uploadflg();
    },
    // 获取商品数据
    imgData: function(data) {
      this.prizeFrom.img = data[0].imgAddress;
      console.log(data);
    },
    // 监听赠品
    listentgifData: function(data) {
      console.log("赠品", data);
      let arr = [];
      for (let i in data) {
        arr.push(data[i].id);
      }
      this.prizeFrom.goodsContent = arr;
    },
    // 监听优惠券
    listentCouponData: function(data) {
      console.log("优惠券", data);
      console.log("赠品", data);
      let arr = [];
      for (let i in data) {
        arr.push(data[i].id);
      }
      this.prizeFrom.goodsContent = arr;
    }, 
    //导出数据 下一步
    setData: function() {
      this.exportData.stepData=2
      this.$emit("ActivityTowtemp", this.exportData);
    },
    // 导出数据 上一步
    lastStep: function() {
      this.exportData.stepData=0
      this.$emit("ActivityTowtemp",this.exportData);
    },
    // 验证提交
    addPrizeBtn: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if(this.prizeFrom.goodsContent.length>0){
            console.log(this.prizeFrom.img)
            if(this.prizeFrom.img.length>0){
              if(this.prizeFrom.most*1 <this.prizeFrom.minimum*1){
                this.$Message.error("单日最多发放数量不应小于单日最低发放数量");
              }
              else{
                this.addPrize();
              }
              
            }
            else{
              this.$Message.error("请选择奖品图片");
            }    
          }
          else{
            if(this.prizeFrom.type==1){
              this.$Message.error("请至少选择一个赠品");
            }
            else if(this.prizeFrom.type==2){
              this.$Message.error("请至少选择一个优惠券");
            }
          }   
        } else {
          this.$Message.error("请按正确格式填写内容");
        }
      });
    },
    // 清空表单
    clearform: function() {
      (this.prizeFrom.name = ""),
      (this.prizeFrom.type = "2"),
      (this.prizeFrom.total = ""),
      (this.prizeFrom.minimum = "0"),
      (this.prizeFrom.most = "0"),
      (this.prizeFrom.upperLimit = ""),
      (this.prizeFrom.content = "");
      (this.prizeFrom.img = "");
      this.showData=[];

      this.showGift=[];
    }
  },
  beforeDestroy(){
    if(!(this.exportData.stepData==0||this.exportData.stepData==2)){
      this.exportData.stepData=-1
    }
    this.$emit("ActivityTowtemp",this.exportData);
  },
};
</script>

<style scoped>
.basic-info {
  margin-top: 20px;
}
.basic-info .span-gry {
  color: #aaa;
}
.basic-info .prize_container {
  width: 860px;
  background-color: rgb(242, 242, 242);
  margin-left: 50px;
  margin-bottom: 15px;
}
.basic-info .prize_container .prize_header {
  width: 860px;
  overflow-y: hidden; /* 超出内容不可见 */
  white-space: nowrap;
  border-top: 1px solid #cccccc;
  border-left: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
}

.basic-info .prize_ps {
  font-size: 12px;
  margin-left: 50px;
  margin-bottom: 20px;
  line-height: 20px;
  width: 800px;
}
.basic-info .prize_unit {
  margin-left: 8px;
  font: 12px;
}
.formitem-div::after{
  content: "";
  clear:both;
}
.formitem-div>div:nth-child(1){
  width: 54px;
  float: left;
}
.formitem-div>div:nth-child(2){
  width: 700px;
  float: left;
}
.basic-info .prize_container .prize_header .prize_item {
  text-align: center;
  height: 40px;
  line-height: 40px;
  width: 126px;
  border-right: 1px solid rgb(201, 201, 201);
  font-weight: 800;
  font-size: 14px;
  display: inline-block;
  margin-left: -3px;
  cursor: pointer;
}
.basic-info .prize_container .prize_content {
  padding-top: 20px;
  position: relative;
  border:1px dashed #cccccc;
  
}
.basic-info .prize_container .prize_content .img-box {
  height: 35px;
  overflow: hidden;
}
.basic-info .prize_container .prize_content .prize-img {
  position: relative;
  width: 100px;
  height: 80px;
  margin-left: 69px;
}
.basic-info .prize_container .prize_content .minmost{
  width: 100%;  
  overflow: hidden;
}
.basic-info .prize_container .prize_content .minmost .minmost_l{
  float: left;
}
.basic-info .prize_container .prize_content .minmost .minmost_r{
  float: left;
}

.basic-info .prize_container .prize_content .prize-img > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 80px;
}

.basic-info .prize_container .prize_content .typeitem {
  position: relative;
}
.basic-info .prize_container .prize_content .typeitem .typespan {
  position: absolute;
  top: 0;
  left: 100px;
  line-height: 45px;
  color: rgb(0, 114, 198);
  text-decoration: underline;
  cursor: pointer;
}
.basic-info .prize_container .prize_content .deleteprize {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 30px;
  background-color: rgb(174, 174, 174);
  color: #ffffff;
  cursor: pointer;
}

.basic-info .prize_container .prize_header .prize_item_content .prize_item:nth-child(1) {
  border-left: 1px solid rgb(201, 201, 201);
}

.basic-info .prize_container .prize_header .prize_item_content .prize_item{

}
.stepbtn {
  text-align: center;
  margin-top: 20px;
}
.stepbtn span {
  margin: 0 5px;
}
</style>


