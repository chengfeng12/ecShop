<template>
  <div class="activitythree">
    <div class="activitythree_container">
      <div class="activitythree_header">
        <div>未中奖设置</div>
      </div>
      <div class="activitythree_content">
        <Form ref="ActivityThreeFrom" :model="ActivityThreeFrom" :label-width="120">
          <FormItem label="是否开启">
            <RadioGroup v-model="ActivityThreeFrom.notWinStatis">
              <Radio label="1">       
                开启
              </Radio>
              <Radio label="0">
                关闭
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="未中奖提示语">
            <Input v-model="ActivityThreeFrom.nowinTips" style="width: 300px;" :maxlength="15"/><span>{{ActivityThreeFrom.nowinTips.length}}/15</span>
          </FormItem>
          <FormItem style="display:none" label="提示跳转">
            <RadioGroup v-model="ActivityThreeFrom.jump">
              <Radio label="0">       
                无跳转
              </Radio>
              <Radio label="1">
                有跳转
              </Radio>
            </RadioGroup>
          </FormItem>
          
          <FormItem label="未中奖图片">
            <div class="img-box">
              <Button style="margin-bottom: 10px;" type="primary" @click="imgSleFun">+选择图片</Button>
              <img-select
                ref="imgSel"
                class="img-select"
                :options="{typeId: 'image'}"
                @listentoptpmfile="imgData($event)"/>
            </div>
            <div class="prize-img">
              <img :src="ActivityThreeFrom.nowinImg" alt="">
            </div>     
            <div class="formItem_ps">仅支持 jpg、png、 尺寸48*48 不超过1M</div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="stepbtn">
      <span>
        <Button
          @click="stepBtnfuc()"
          style="width: 100px;"
          type="primary"
          size="large"
        >下一步</Button>
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
  props:['prizeOptionthree'],
  components: {ImgSelect},
  data() {
    return {
        // 未中奖设置表单数据
        ActivityThreeFrom:{

          stepData:-1,

          notWinStatis:'1',
            // 跳转提示语
          nowinTips:"",
            // 是否跳转
          jump:"0",
            // 未中奖图片
          nowinImg:""
        }
    };
  },
  created() {
    if(this.prizeOptionthree.length>0){
      this.prizeOptionthreefuc(this.prizeOptionthree)
    }
  },

  methods: {
    // 回退编辑转态
    prizeOptionthreefuc:function(data){
      console.log("组件三",data)
      this.ActivityThreeFrom.notWinStatis=String(data[0].notWinStatis),

      this.ActivityThreeFrom.nowinTips=String(data[0].nowinTips),
      
      this.ActivityThreeFrom.jump=String(data[0].jump),
      
      this.ActivityThreeFrom.nowinImg=data[0].nowinImg
    },
    //下一步并且提交数据到父组件
    stepBtnfuc:function(){   
      this.ActivityThreeFrom.stepData=3
        this.$emit("ActivityThreetemp", this.ActivityThreeFrom);
    },
    // 上一步
    lastStep:function(){
      this.ActivityThreeFrom.stepData=1
      this.$emit("ActivityThreetemp", this.ActivityThreeFrom);
    },
    //激活图片选择 
    imgSleFun() {
       this.$refs.imgSel.uploadflg();
    },
    imgData:function(data){
      this.ActivityThreeFrom.nowinImg=data[0].imgAddress
      
    },
  },
  beforeDestroy(){
    if(!(this.ActivityThreeFrom.stepData==1||this.ActivityThreeFrom.stepData==3)){
      this.ActivityThreeFrom.stepData=-1
    }
    this.$emit("ActivityThreetemp", this.ActivityThreeFrom);
  },
};
</script>

<style scoped>
.activitythree .activitythree_header {
  width: 800px;
  height: 40px;
  border-bottom: 1px solid #ccc;
}
.activitythree .activitythree_header div {
  width: 120px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  background-color: #0083b0;
  color: #ffffff;
}
.activitythree .activitythree_container {
  width: 800px;
  margin-top: 30px;
  margin-left: 50px;
  background-color: rgb(242, 242, 242);
  border: 1px dashed #ccc;
}
.activitythree .activitythree_container .activitythree_content {
  padding-top: 20px;
}
.activitythree .formItem_ps {
  color: #868686;
}
.stepbtn {
  text-align: center;
  margin-top: 20px;
}
.stepbtn span {
  margin: 0 5px;
}
.prize-img{
  position: relative;
  width: 100px;
  height: 80px;
}

.prize-img img{
  position: absolute;
  width: 100px;
  height: 80px;
}
.activitythree_content .img-box{
  height: 40px;
  overflow: hidden;
}
</style>
