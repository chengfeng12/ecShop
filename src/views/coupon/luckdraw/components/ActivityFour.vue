<template>
  <div>
    <div class="ActivityFour">
      <div class="ActivityFour_container">
        <div class="ActivityFour_container_l">
          <div class="ActivityFour_item">
            <div class="img-title">背景图片</div>
           
            <div class="img-box">
              
              <Button style="margin-bottom: 10px;" type="primary" @click="imgSleFun">+选择背景图片</Button>
              
              <img-select
                ref="imgSel"
                class="img-select"
                :options="{typeId: 'image'}"
                @listentoptpmfile="imgData($event)"/>
            </div>
          </div>
          <div class="ActivityFour_item">
            <span>综合中奖率：</span><span>{{ActivityFourData.comWin}}<span v-if="ActivityFourData.comWin">%</span></span>
          </div>
          <div class="bg-img" v-if="ActivityFourData.backageImg">
            <img :src="ActivityFourData.backageImg" alt="">
          </div> 

          <div class="ActivityFour_item">
            <div class="prize_table">
              <div class="prize_table_header">
                <div>奖品位置</div>     
                <div>转盘图片</div>
                <div>中奖概率</div>
              </div>
              <div class="prize_table_item" v-for="(item,index) in ActivityFourData.smokeTemplate" :key="index">
                <div>
                  <Input @on-blur="inputBlur(item.location,index)" type="number" style="width:60px;" v-model="item.location"></Input>
                </div>                
                <div>
                  <img :src="item.img" alt="">
                </div>
                
                <div>
                  <Input @on-blur="winningBlur(item.winning,index)" v-model="item.winning" style="width: 80px;"/>%
                </div>
              </div> 
        
            </div>
          </div>


        </div>
        <div class="ActivityFour_container_r">   
            <div class="ActivityFour_bg">
              <div class="img_prize_bg">
                <img class="container_img" :src="ActivityFourData.backageImg" alt="">
                <div class="img_prize_container">
                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[0]">
                        <img :src="lotteryTemplate[0]" alt="">
                      </div>
                    </div>
                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[1]">
                        <img :src="lotteryTemplate[1]" alt="">
                      </div>
                    </div>
                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[2]">
                        <img :src="lotteryTemplate[2]" alt="">
                      </div> 
                    </div>
                   

                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[7]">
                        <img :src="lotteryTemplate[7]" alt="">
                      </div>
                    </div>
   
                    <div class="img_prize_item">
                   
                    </div>
                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[3]">
                        <img :src="lotteryTemplate[3]" alt="">
                      </div>
                    </div>
                   
                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[6]">
                        <img :src="lotteryTemplate[6]" alt="">
                      </div>
                    </div>

                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[5]">
                        <img :src="lotteryTemplate[5]" alt="">
                      </div>
                    </div>

                    <div class="img_prize_item">
                      <div v-if="lotteryTemplate[4]">
                        <img :src="lotteryTemplate[4]" alt="">
                      </div>
                    </div>
                   
                </div>
              </div>
            </div>
            <Button class="refresh-btn" type="primary" @click="refreshfuc">刷新位置</Button>
        </div>
      </div>
    </div>
    <div class="stepbtn">
      <span>
        <Button
          @click="stepBtnSave()"
          style="width: 100px;"
          type="primary"
          size="large" :loading="loading">保存</Button>
      </span>
      <span>
        <Button @click="lastStep()" style="width: 100px;" type="default" size="large">上一步</Button>
      </span>
    </div>
  </div>
</template>

<script>
import ImgSelect from "@/components/imgSelect/imgselect";
export default {
  components: {ImgSelect},

  props:['prizeShow','prizeOptionFour',"loading"],

  data() {
    return {
      refFlg:false,
      ActivityFourData:{
          stepData:-1,
          //背景图片 
          backageImg:"",
          // 综合中奖率
          comWin:"",
          // 抽奖模板
          smokeTemplate:[],
      },
      lotteryTemplate:[]
    };
  },

  created() {
    if(this.prizeOptionFour.length>0){
      this.prizeOptionFourfuc(this.prizeOptionFour)  
    }
    
    this.prizeShowfuc(this.prizeShow) 
  },

  methods: {
    // 获取编辑数据
    prizeOptionFourfuc:function(data){
       console.log("data--------------------------",data)
      this.ActivityFourData.stepData=data[0].data,
      this.ActivityFourData.backageImg=data[0].backageImg

    },
    // 处理组件二传来的数据
    prizeShowfuc:function(data){  
      this.ActivityFourData.smokeTemplate=data.activatyPrize
    
    },
    //激活图片选择 
    imgSleFun() {
       this.$refs.imgSel.uploadflg();
    },
    // 接受图片信息
    imgData:function(data){
      this.ActivityFourData.backageImg=data[0].imgAddress
    },

    // 奖品位置
    inputBlur:function(value,index){
     
      if(value>8){
        this.$Message.error("当前模板下位置不能超过8")
        console.log(this.ActivityFourData.smokeTemplate[index].location="")
      }
      let RegExp=/^[0-9]*[1-9][0-9]*$/
      if(!RegExp.test(value)){
        this.$Message.error("模板下位置只能是正整数")
        console.log(this.ActivityFourData.smokeTemplate[index].location="")
      }
    },

    // 中奖概率
    winningBlur:function(value,index){
      if(value>100){
        this.$Message.error("中奖概率不能大于100%")
        console.log(this.ActivityFourData.smokeTemplate[index].winning="")
      }
      let RegExp=/^\d+(\.\d+)?$/
      if(!RegExp.test(value)){
        this.$Message.error("中奖概率只能是数字")
        console.log(this.ActivityFourData.smokeTemplate[index].winning="")
      }
    },

    // 刷新位置
    refreshfuc:function(){
      let data=this.ActivityFourData.smokeTemplate;

      let flglocation=true;

      let flgwinning=true;

      let winningnull=true;

      let locationarr=[];

      for(let item in data){
        locationarr.push(data[item].location)
      }
      console.log(data)
      for(let i in data){
        if(data[i].location==""){
          flglocation=false
        }
      }

      let sum=0
      for(let j in data){
        sum=data[j].winning*1+sum
      }

      for(let k in data){
        if(data[k].winning==""){
          winningnull=false
        }
      }

      if(sum>100){
        flgwinning=false
      }

      if(!flglocation){
        this.$Message.error("请补全奖品位置");
        return false
      }
      else if(!flgwinning){

        this.$Message.error("中奖概率不能大于100%");
        return false
      }
      else if(!winningnull){
        this.$Message.error("请补全中奖概率");
        return false
      }
      else if(this.isRepeat(locationarr)){
        this.$Message.error("位置不能有重复");
        return false
      }
      else{    
        let arr=[]
        for(let i=0;i<8;i++){
          arr.push("")
        } 
        
        for(let i in data){
          let j=data[i].location*1-1
          arr[j]=data[i].img
        }
        this.lotteryTemplate=arr
        this.ActivityFourData.comWin=sum
        return true
      }
    },

    // 保存向父组件导出数据并且触发全局保存
    stepBtnSave:function(){
      if(this.refreshfuc()){   
        if(this.ActivityFourData.backageImg){
          this.ActivityFourData.stepData=4,
          this.$emit("ActivityFourtemp", this.ActivityFourData);
        }
        else{
          this.$Message.error("请选择背景图片");
        }
      }
    },
    

    isRepeat:function(arr){

      let hash = {};

      for(let i in arr) {

      if(hash[arr[i]]) //hash 哈希

      return true;

      hash[arr[i]] = true;

      }

      return false;

    },
    // 上一步导出数据但是不保存
    lastStep:function(){
      this.ActivityFourData.stepData=2,
      this.$emit("ActivityFourtemp", this.ActivityFourData);
    },
    

  },

  beforeDestroy(){
    if(!(this.ActivityFourData.stepData==2||this.ActivityFourData.stepData==4)){
      this.ActivityFourData.stepData=-1
    }
    this.$emit("ActivityFourtemp", this.ActivityFourData);
  },

  
  

};
</script>

<style scoped>
.ActivityFour {
  width: 100%;
}
.ActivityFour_container {
  width: 900px;
  overflow: hidden;
  margin-left: 5%;
}
.ActivityFour_container .ActivityFour_item{
margin:20px 0px;
}
.ActivityFour .prize_table {
  width: 451px;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.ActivityFour .prize_table .prize_table_header {
  width: 451px;
  height: 30px;
  overflow: hidden;
}
.ActivityFour .prize_table .prize_table_header div {
  width: 150px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  float: left;
  background-color: rgb(242, 242, 242);
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.ActivityFour .prize_table .prize_table_item {
   width: 451px;
  overflow: hidden;
}
.ActivityFour .prize_table .prize_table_item>div {
  overflow: hidden;
  width: 150px;
  height: 80px;
  line-height: 80px;
  padding: 0 5px;
  text-align: center;
  float: left;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.ActivityFour .prize_table .prize_table_item>div img{
  width: 100px;
  height: 70px;
  margin-top: 5px;
}
.ActivityFour_container .ActivityFour_container_l {
  float: left;
}
.ActivityFour_container .ActivityFour_container_r {
  float: left;
  width:396px; 
  height: 550px;
  position: relative;
}
.ActivityFour_container .ActivityFour_container_r .refresh-btn{
  position: absolute;
  left:52px;
  bottom: 0;
  
}
.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 435px;
    width: 290px;
    background-color: #ccc;
}
.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg .img_prize_bg{
  position: relative;
  width: 100%;
  height: 100%;

}
.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg .img_prize_bg .img_prize_container{
  position: absolute;
  width: 238px;
  height: 238px;
  background: #ffffff;
  left: 0;
  right: 0;
  top: 80px;
  bottom: 0;
  margin: auto;
   border-top: 1px dashed #cccccc;
  border-left: 1px dashed #cccccc;

}

.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg .img_prize_bg .container_img{
  width: 100%;
  height: 100%;
}
.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg .img_prize_bg .img_prize_container .img_prize_item{
  width: 79px;
  height: 79px;
  border-bottom: 1px dashed #cccccc;
  border-right: 1px dashed #cccccc;
  float: left;
}
.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg .img_prize_bg .img_prize_container .img_prize_item div{
  width: 100%;
  height: 100%;
  
}
.ActivityFour_container .ActivityFour_container_r .ActivityFour_bg .img_prize_bg .img_prize_container .img_prize_item div img{
  width: 100%;
  height: 100%;
  
}
.stepbtn {
  text-align: center;
  margin-top: 20px;
}
.stepbtn span {
  margin: 0 5px;
}
.ActivityFour_container .ActivityFour_item{
  overflow: hidden;
}
.ActivityFour_container .ActivityFour_item .img-title{
  float: left;
  width: 75px;
  height: 34px;
  line-height: 34px;
}

.img-box{
  width: 150px;
    float: left;
  height: 40px;
  overflow: hidden;
}
.bg-img{
  width: 145px;
  height: 216px;
  position: relative;
  margin-left: 78px;
}
.bg-img img{
  position: absolute;
  width: 145px;
  height: 210px;
  top: 0;
  right: 0;
}

</style>
