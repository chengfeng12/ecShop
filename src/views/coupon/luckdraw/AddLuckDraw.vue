<template>
    <div id="LuckDraw-add">
        <Card>
            <div class="header">
                <div v-for="(item,index) in step" :key="index" :class="{'unchecked': true,'current-page': currentNum >= index}" @click="stepfuc(index)">
                    <p>{{item}}</p>
                </div>
            </div>
            <div class="main">
                <div v-if="currentNum==0">
                    <activity-one  @ActivityOnetemp="listentActivityone($event)" :prizeOptionone="stepDataOne"></activity-one>
                </div>
                
                <div v-else-if="currentNum==1">
                    <activity-tow @ActivityTowtemp="listentActivityTow($event)" :prizeOptiontow="stepDataTow"></activity-tow>
                </div>
                
                <div v-else-if="currentNum==2">
                    <activity-three @ActivityThreetemp="listentActivityThree($event)" :prizeOptionthree="stepDataThree"></activity-three>
                </div>
                
                <div v-else-if="currentNum==3">
                    <activity-four 
          
                    :prizeShow="prizeOption"

                    :prizeOptionFour="stepDataFour"
                    
                    :loading="loading"
                    @ActivityFourtemp="listentActivityFour($event)"></activity-four>
                </div>

            </div>
        </Card>
      
    </div>
</template>

<script>
import ActivityOne from './components/ActivityOne'
import ActivityTow from './components/ActivityTow'
import ActivityThree from './components/ActivityThree'
import ActivityFour from './components/ActivityFour'
import marking from "@/api/request/marking";
export default {
    data() {
        
        name:"AddLuckDraw"

        return {
            defaultNum: 1,
            loading:false,
            step: ['1、基础信息','2、奖项设置','3、未中奖设置','4、页面设置'],
            // 状态数
            currentNum: 0,  
            // 由子组件传递的状态数

            stepData:[0],
            // 基础信息的数据
            stepDataOne:[],

            stepDataTow:[],

            stepDataThree:[],

            stepDataFour:[],
        
            prizeOption:[],


            // 需要被编辑的ID
            editId:'',
            // 状态
            role:'',
        }
    },

    components: {
        ActivityOne,
        ActivityTow,
        ActivityThree,
        ActivityFour
    },

    created() {
        this.roleType()
    },
 
    methods: {
        // 切换状态
        stepfuc:function(data){
            console.log("数据",this.stepData)
            if(this.stepData.includes(data)){
                this.currentNum=data
            }
            else{
                 console.log(false)
            }   
        },    

        // 监听基础组件一信息的数据
        listentActivityone:function(data){
            console.log("监听基础组件一信息的数据",data)
            // 状态操作
            if(data.stepData!=-1){
                this.currentNum=data.stepData
            }
            this.stepData.push(data.stepData)
            this.deWeight(this.stepData)
            // 数据获取
            let arr =[];
            arr.push(data)
            this.stepDataOne=arr
        },
        // 监听基础组件二信息的数据
        listentActivityTow:function(data){
            console.log("监听基础组件二信息的数据",data) 
            if(data.stepData!=-1){
                this.currentNum=data.stepData
            }
            this.stepData.push(data.stepData)
            this.deWeight(this.stepData)
            // 数据获取 
            let arr =[];
            arr.push(data)
            this.stepDataTow=arr
            // 将奖品信息传递到组件四
            this.prizeOption=data
        }, 

        // 监听基础组件三信息的数据
        listentActivityThree:function(data){
            if(data.stepData!=-1){
                this.currentNum=data.stepData
            }
            this.stepData.push(data.stepData)
            this.deWeight(this.stepData)
            let arr=[]
            arr.push(data)
            this.stepDataThree=arr
         
            console.log("监听基础组件三信息的数据",this.stepDataThree)
        },

        // 监听基础组件四信息的数据
        listentActivityFour:function(data){
            let arr=[]    
            arr.push(data)  
            this.stepDataFour=arr
           
         
            if(data.stepData!=-1){
                if(data.stepData=="4"){
                
                    this.saveData()
                }
                else if(data.stepData=="2"){
                    this.currentNum=data.stepData
                    this.stepData.push(data.stepData)
                    this.deWeight(this.stepData)
                }     
            } 
        }, 
        // 保存数据
        saveData:function(){
          
            if(this.role==1){
                // 保存前补偿组件二
                this.stepDataTow[0].activatyPrize=this.stepDataFour[0].smokeTemplate
                this.addDatasave()
            }
            else{
                this.stepDataTow[0].activatyPrize=this.stepDataFour[0].smokeTemplate
                this.editDatasave()
            }
        },
        // 新增数据
        addDatasave:function(){
            this.loading=true;
            marking.addActivaty({
                // 组件一的数据
                name:this.stepDataOne[0].name,

                activatyRule:this.stepDataOne[0].activatyRule,

                activityEndTime:this.stepDataOne[0].activityEndTime,

                activityStartTime:this.stepDataOne[0].activityStartTime,

                consumerIntegral:this.stepDataOne[0].consumerIntegral,

                everyoneParticipantNum:this.stepDataOne[0].everyoneParticipantNum,

                participantNum:this.stepDataOne[0].participantNum,

                participants:this.stepDataOne[0].participants,

                prizeNotice:this.stepDataOne[0].prizeNotice,

                sendIntegral:this.stepDataOne[0].sendIntegral,

                smokeType:this.stepDataOne[0].smokeType,

                stepData:this.stepDataOne[0].stepData,

                winNum:this.stepDataOne[0].winNum,
                 // 组件二的数据

                activatyPrize:this.stepDataTow[0].activatyPrize,

                // 组件三的数据
                jump: this.stepDataThree[0].jump,

                nowinImg: this.stepDataThree[0].nowinImg,

                nowinTips: this.stepDataThree[0].nowinTips,
                
                notWinStatis:this.stepDataThree[0].notWinStatis,
                
                // 组件四                
                backageImg:this.stepDataFour[0].backageImg,

                smokeTemplate:this.stepDataFour[0].smokeTemplate,
                
                comWin:this.stepDataFour[0].comWin
                
            })
            .then(res => {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeee",res)
                if (res.code == 1) {
                    this.$Message.success("添加成功");
                    this.loading=false;
                    
                    this.goback();
                
                } else {
                    this.$Message.error("添加失败");
                    this.loading=false;
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        // 编辑修改
        editDatasave:function(){
             this.loading=true;
             marking.activatyUpdate({
                 id:this.editId,
                // 组件一的数据
                name:this.stepDataOne[0].name,

                activatyRule:this.stepDataOne[0].activatyRule,

                activityEndTime:this.stepDataOne[0].activityEndTime,

                activityStartTime:this.stepDataOne[0].activityStartTime,

                consumerIntegral:this.stepDataOne[0].consumerIntegral,

                everyoneParticipantNum:this.stepDataOne[0].everyoneParticipantNum,

                participantNum:this.stepDataOne[0].participantNum,

                participants:this.stepDataOne[0].participants,

                prizeNotice:this.stepDataOne[0].prizeNotice,

                sendIntegral:this.stepDataOne[0].sendIntegral,

                smokeType:this.stepDataOne[0].smokeType,

                stepData:this.stepDataOne[0].stepData,

                winNum:this.stepDataOne[0].winNum,
                 // 组件二的数据
                activatyPrize:this.stepDataTow[0].activatyPrize,
                // 组件三的数据
                jump: this.stepDataThree[0].jump,

                nowinImg: this.stepDataThree[0].nowinImg,

                nowinTips: this.stepDataThree[0].nowinTips,

                notWinStatis:this.stepDataThree[0].notWinStatis,
                // 组件四                
                backageImg:this.stepDataFour[0].backageImg,
                
                 comWin:this.stepDataFour[0].comWin,

                smokeTemplate:this.stepDataFour[0].smokeTemplate
            })
            .then(res => {
                console.log("编辑",res)
                if (res.code == 1) {
                    this.$Message.success("修改成功");
                    this.loading=false;
                    this.goback();
                } else {
                    this.$Message.error("修改失败");
                    this.loading=false;
                }
            })
            .catch(error => {
                console.log(error);
            });
        },       
        //返回列表
        goback:function(){
            this.$router.push({ path: "/@/views/coupon/luckdraw/luckdraw" });
        },
        // 数组去重复
        deWeight:function(data){
            let arr=data
            var hash=[];
            for (var i = 0; i < arr.length; i++) {
                for (var j = i+1; j < arr.length; j++) {
                    if(arr[i]===arr[j]){
                        ++i;
                    }
                }
                hash.push(arr[i]);
            }
            this.stepData=hash
            
        },     
        // 编辑状态获取数据
        editData:function(ID){
            marking.activatyDetail({
               id:ID
            }).then(res => {
                if (res.code == 1) {
                    this.editDataShow(res.data)
                } else {
                    this.$Message.error(res.message);
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        // 编辑数据显示
        editDataShow:function(data){
             
            // 组件1
            let arrOne=[]
            let objOne={}
                objOne.name=data.name,
                objOne.activityStartTime=data.activityStartTime,
                objOne.activityEndTime=data.activityEndTime,
                objOne.activatyRule=data.activatyRule,
                objOne.participants=data.participants,
                objOne.consumerIntegral=data.consumerIntegral,
                objOne.sendIntegral=data.sendIntegral,
                objOne.winNum=data.winNum,
                objOne.smokeType=data.smokeType,
                objOne.participantNum=data.participantNum,
                objOne.everyoneParticipantNum=data.everyoneParticipantNum,
                objOne.prizeNotice=data.prizeNotice.split(','),
                arrOne.push(objOne)
                this.stepDataOne=arrOne
            // 组件二
            let activatyPrize=[]
            let objTow={}
                objTow.activatyPrize=JSON.parse(data.smokeTemplate)
            this.stepDataTow.push(objTow)
            console.log("this.stepDataTow--------------------------",this.stepDataTow)
            
            // 组件三
            let objThree={}
                
                objThree.nowinTips=data.nowinTips,
                
                objThree.jump=data.jump,

                objThree.nowinImg=data.nowinImg,
                
                objThree.notWinStatis=data.notWinStatis,
            this.stepDataThree.push(objThree)
             // 组件四
            let objFour={}
                objFour.backageImg=data.backageImg,
                objFour.smokeTemplate= JSON.parse(data.smokeTemplate)
                
            this.stepDataFour.push(objFour)
        },
        // 根据路由变化改变状态
        roleType:function(){
            this.editId = this.$route.query.id, 
            
            this.role = this.$route.query.role  
            
            if (this.$route.query.role == 2) {  

                this.editData(this.$route.query.id,);    
            } 
            else{
                 this.currentNum= 0,  
                // 由子组件传递的状态数
                this.stepData=[0],
                // 基础信息的数据
                this.stepDataOne=[],

                this.stepDataTow=[],

                this.stepDataThree=[],

                this.stepDataFour=[],
            
                this.prizeOption=[]
            }
        },

        fetchData: function() {
            this.roleType()
        }
    },
    watch: {
        $route: "fetchData"
    }
  
}
</script>


<style lang="less" scoped>
#LuckDraw-add {
    .header {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        background-color: #ccc;
        overflow: hidden;
        div {
            width: 25%;
            cursor: pointer;
            position: relative;
            &::after {
                content: "";
                display: block;
                position: absolute;
                right: -40px;
                top: 0;
                width: 0;
                border-left: 40px solid #ccc;
                border-bottom: 21px solid transparent;
                border-top: 21px solid transparent;
                z-index: 2;
            }
            &::before {
                content: "";
                display: block;
                position: absolute;
                right: -44px;
                top: 0;
                width: 0;
                border-left: 42px solid #fff;
                border-bottom: 21px solid transparent;
                border-top: 21px solid transparent;
                z-index: 1;
            }
        }
        .current-page {
            &::after {
                content: "";
                border-left: 40px solid #0083b0;
            }
        }
        .current-page {
            background-color: #0083b0;
        }
        p {
            color: #fff;
            padding: 10px;
            text-align: center;
        }
    }
    
}
</style>

