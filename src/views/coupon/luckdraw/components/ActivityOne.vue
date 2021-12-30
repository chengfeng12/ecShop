<template>
  <div>
    <div class="basic-info">
      <Form ref="ActivityOne" :model="ActivityOne" :rules="ActivityOneRule" :label-width="120">
        <FormItem label="活动名称" prop="name">
          <Input v-model="ActivityOne.name" placeholder style="width: 300px;" :maxlength="12"></Input><span>{{ActivityOne.name.length}}/12</span>
        </FormItem>
        <FormItem label="活动时间" prop="activityTime">
          <DatePicker 
            type="datetimerange"
            :editable="false"
            :options="optionsTime"
            :value="ActivityOne.activityTime"
            @on-change="timeChange"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期" style="width: 350px">
          </DatePicker>
        </FormItem>
        <FormItem label="抽奖形式" prop="smokeType">
          <Select v-model="ActivityOne.smokeType" style="width:200px">
            <Option :value=1>翻盘抽奖</Option>
          </Select>
        </FormItem>
        <FormItem label="活动规则" prop="activatyRule">
          <Input
            style="width: 450px;"
            v-model="ActivityOne.activatyRule"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder
          ></Input>
        </FormItem>
        <FormItem label="参与人群">
          <RadioGroup v-model="ActivityOne.participants">
            <Radio label="1">全部用户</Radio>
            <Radio :disabled="true" label="2">指定用户(尚未开通)</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="消耗积分">
          <RadioGroup v-model="ActivityOne.consumerIntegral">
            <Radio :disabled="true" label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="参与送积分">
          <RadioGroup v-model="ActivityOne.sendIntegral">
            <Radio :disabled="true" label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="单人中奖次数" prop="winNum">
          最多&nbsp;&nbsp;
          <Input style="width: 150px;" v-model="ActivityOne.winNum" placeholder></Input>&nbsp;&nbsp;次&nbsp;&nbsp;
          <span class="span-gry">(默认为0，即不限制单人中奖次数 )</span>
        </FormItem>
        <FormItem label="参与次数" prop="participantNum">
          单人参与总次数&nbsp;&nbsp;
          <Input style="width: 150px;" v-model="ActivityOne.participantNum" placeholder></Input>&nbsp;&nbsp;次&nbsp;&nbsp;
          <span class="span-gry">(默认为0，即不限制单人参与抽奖总次数 )</span>
        </FormItem>
        <FormItem label prop="everyoneParticipantNum">
          每人每天最多参与&nbsp;&nbsp;
          <Input style="width: 150px;" v-model="ActivityOne.everyoneParticipantNum" placeholder></Input>&nbsp;&nbsp;次&nbsp;&nbsp;
          <span class="span-gry">(默认为0，即不限制每天每天最多参与次数)</span>
        </FormItem>

        <FormItem label="奖项通知">
          <CheckboxGroup v-model="ActivityOne.prizeNotice">
            <div class="tempTable">
              <div class="header_tr">
                <div class="header_td">消息标题</div>
                <div class="header_td">模板id</div>
              </div>
              <div class="tempTable_tr" v-for="(item,index) in notification" :key="index">
                <div class="tempTable_td">
                  <Checkbox :label="item.id">{{item.title}}</Checkbox>
                </div>
                <div class="tempTable_td">{{item.id}}</div>
              </div>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </div>
    <div class="stepbtn">
      <span>
        <Button
          @click="stepBtnfuc('ActivityOne')"
          style="width: 100px;"
          type="primary"
          size="large"
        >下一步</Button>
      </span>
      <span>
        <Button @click="stepBgoback()" style="width: 100px;" type="default" size="large">返回列表</Button>
      </span>
    </div>
  </div>
</template>

<script>
import goodsUtilsFun from "@/utils/goodsUtils.js";

import orderApi from "@/api/request/order.js";

export default {
  props:['prizeOptionone'],
  data() {
    return {
      notification: [],


      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      ActivityOne: {
        stepData: -1,
        // 活动名称
        name: "",
        activityTime:[],
        // 活动时间
        // 活动开始时间
        activityStartTime: "",
        // 活动结束时间
        activityEndTime: "",
        //活动规则
        activatyRule: "",
        // 参与人群
        participants: "1",
        // 消耗积分
        consumerIntegral: "0",
        // 参与送积分
        sendIntegral: "0",
        // 单人中奖次数
        winNum: "",
        // 单人参与总次数
        participantNum: "",
        // 每人每天最多参与
        everyoneParticipantNum: "",
        //抽奖模板     
        smokeType:1,
        // 奖项模板ID
        prizeNotice: []
      },
      // 规则 验证
      ActivityOneRule: {
        activityTime:[{
            type: 'array',
            required:true,
              fields: {
                0: {required: true, message: '活动时间不能为空'},
                1: {required: true, message: '活动时间不能为空'}
              },
              message:'活动时间不能为空'
            }],
        smokeType:{
          type: "number",
          required: true,
          message: "抽奖形式不能为空",
          trigger: "change"
        },
        name: {
          required: true,
          message: "活动名称不能为空",
          trigger: "blur"
        },
        activatyRule: {
          required: true,
          message: "活动规则不能为空",
          trigger: "blur"
        },
        winNum: [{
          required: true,
          message: "单人中奖次数不能为空",
          trigger: "blur"
        },
         {
            pattern: /^([0]|[1-9][0-9]*)$/,
            message: "单人中奖次数必须是0或正整数",
            trigger: "blur"
          }]
        ,
        participantNum: [
          {
            required: true,
            message: "单人参与总次数不能为空",
            trigger: "blur"
          },
          {
            pattern: /^([0]|[1-9][0-9]*)$/,
            message: "单人参与总次数必须是0或正整数",
            trigger: "blur"
          }
        ],
        everyoneParticipantNum:[
          {
          required: true,
          message: "每人每天最多参与次数不能为空",
          trigger: "blur"
          },
          {
            pattern: /^([0]|[1-9][0-9]*)$/,
            message: "每人每天最多参与次数必须是0或正整数",
            trigger: "blur"
          }
        ]
        
      }
    };
  },
  created() {
  
    console.log("新建",this.prizeOptionone)
    
    if(this.prizeOptionone.length>0){

      console.log("编辑",this.prizeOptionone)
      
      this.prizeOptiononefuc(this.prizeOptionone)
    
    }   
    this.getMsgTempData();
  },
 
  methods: {
    // 回退编辑
    prizeOptiononefuc:function(data){
 
      this.ActivityOne.name=data[0].name,
      this.ActivityOne.activityStartTime=data[0].activityStartTime,
      this.ActivityOne.activityEndTime=data[0].activityEndTime,
      
      
      this.ActivityOne.activityTime.push(goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(data[0].activityStartTime))),
      this.ActivityOne.activityTime.push(goodsUtilsFun.timeFun(goodsUtilsFun.timeStamp(data[0].activityEndTime))),


      this.ActivityOne.activatyRule=data[0].activatyRule,
      this.ActivityOne.participants= String(data[0].participants),
      this.ActivityOne.consumerIntegral= String(data[0].consumerIntegral),
      this.ActivityOne.sendIntegral=String(data[0].sendIntegral),
      this.ActivityOne.winNum=String(data[0].winNum),
      this.ActivityOne.smokeType=data[0].smokeType,
      this.ActivityOne.participantNum=String(data[0].participantNum),
      this.ActivityOne.everyoneParticipantNum=String(data[0].everyoneParticipantNum)
      let arr=[]
      for(let i in data[0].prizeNotice){
        arr.push(Number(data[0].prizeNotice[i]))
      }
      console.log(arr)
      this.ActivityOne.prizeNotice=arr
    },
    // 清空数据
    handleReset:function (name) {
      this.$refs[name].resetFields();
    },
    // 获取模板消息
    getMsgTempData: function() {
      orderApi
        .messageTemplate({})
        .then(res => {
          if (res.code == 1) {
            console.log("模板消息", res);
            this.notification = res.data;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {});
    },
    // 获取时间
    timeChange(value) {
      this.ActivityOne.activityStartTime = goodsUtilsFun.timeStamp(value[0]),
      this.ActivityOne.activityEndTime = goodsUtilsFun.timeStamp(value[1]),
      this.ActivityOne.activityTime=value
      // 活动开始时间    
      console.log( this.ActivityOne.activityStartTime)

      console.log( this.ActivityOne.activityEndTime)
    },

    //通过按钮切换状态下一步
    stepBtnfuc: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.setData();
        } else {
          this.$Message.error("请按正确格式填写内容");
        }
      });
    },

    //提交导出数据
    setData: function() {
      this.ActivityOne.stepData=1
      this.$emit("ActivityOnetemp", this.ActivityOne);
    },

    // 返回列表
    stepBgoback: function(bool) {
      this.$router.push({ path: "/@/views/coupon/luckdraw/luckdraw" });
    }
  },
  // 销毁前导出防止编辑时不保存
  beforeDestroy(){
    if(this.ActivityOne.stepData!=1){
      console.log("erererererer")
      this.ActivityOne.stepData=-1
    }
    this.$emit("ActivityOnetemp", this.ActivityOne);
  },

  watch: {
    prizeOptionone:function(){
      if(this.prizeOptionone.length>0){
      this.prizeOptiononefuc(this.prizeOptionone)
      }
      else{
        this.handleReset('ActivityOne')
        this.ActivityOne.activityTime=[],
        this.ActivityOne.stepData="-1",
        this.ActivityOne.name="",
        this.ActivityOne.activityStartTime="",
        this.ActivityOne.activityEndTime="",
        this.ActivityOne.activatyRule="",
        this.ActivityOne.participants="1",
        this.ActivityOne.consumerIntegral="0",
        this.ActivityOne.sendIntegral="0",
        this.ActivityOne.winNum="",
        this.ActivityOne.participantNum="",
        this.ActivityOne.everyoneParticipantNum="",
        this.ActivityOne.smokeType=1,
        this.ActivityOne.prizeNotice=[]
      }     
    }

  },
};
</script>

<style scope>
.basic-info {
  width: 70%;
  margin-top: 20px;
}
.basic-info .span-gry {
  color: #aaa;
}
.stepbtn {
  text-align: center;
  margin-top: 20px;
}
.stepbtn span {
  margin: 0 5px;
}
.tempTable {
  width: 461px;
  border-top: 1px solid #e8eaec;
  border-left: 1px solid #e8eaec;
}
.tempTable > .header_tr {
  width: 461px;
  background-color: rgb(248, 248, 249);
  overflow: hidden;
}

.tempTable .header_tr > .header_td {
  width: 230px;
  height: 45px;
  padding: 5px 10px;
  float: left;
  line-height: 35px;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  text-align: center;
}

.tempTable > .tempTable_tr {
  width: 461px;
  overflow: hidden;
}
.tempTable .tempTable_tr > .tempTable_td {
  width: 230px;
  height: 45px;
  padding: 5px 10px;
  float: left;
  line-height: 35px;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
}
.tempTable .tempTable_tr > .tempTable_td:nth-child(1) {
  padding-left: 30px;
  width: 230px;
}
.tempTable .tempTable_tr > .tempTable_td:nth-child(2) {
  text-align: center;
}
</style>
