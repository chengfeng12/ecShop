<template>
    <div>    
        应用管理
        <Card>
            <!-- <p slot="title"></p> -->
            <div class="appliedmanagement">
                <div class="appliedmanagement_title">营销玩法</div>

                <div class="appliedmanagement_content">
                    <div class="appliedmanagement_btn" v-if="hasRole(110201)" @click="gotolink('/@/views/appliedmanagement/helpshare/helpshare')">
                        <div class="l">
                            <img src="../../assets/images/fxzl.png">
                        </div>
                        <div class="r">
                            <p>分享助力</p>
                            <p>通过微信小程序助力分享活动</p>
                        </div>
                    </div>
                    <div class="appliedmanagement_btn" v-if="hasRole(110202)" @click="gotolink('/@/views/appliedmanagement/friendsgifts/friendsgifts')">
                        <div class="l">
                            <img src="../../assets/images/hyzl.png">
                        </div>
                        <div class="r">
                            <p>好友赠礼</p>
                            <p>通过微信小程序购买并赠送给好友</p>
                        </div>
                    </div>
                    <div class="appliedmanagement_btn" v-if="hasRole(110101)" @click="gotolink('/@/views/application/SmallBeautyBox')">
                        <div class="l">
                            <img src="../../assets/images/hyzl.png">
                        </div>
                        <div class="r">
                            <p>定制礼盒</p>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>  
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'appliedmanagement',
        data() {
            return {
                
            }
        },
        methods:{
            gotolink:function(url){
                 this.$router.push({
                    path: url
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .appliedmanagement{
        width: 100%;
        padding: 10px;
        .appliedmanagement_title{
            width: 100%;
            color: rgb(0, 131, 176);
            padding-bottom: 5px;
            border-bottom:1px solid rgb(217, 217, 217);
        }
        .appliedmanagement_content{
            margin-top: 25px;
            width: 100%;
            overflow: hidden;
            .appliedmanagement_btn{
                cursor: pointer;
                float: left;
                width: 231px;
                height: 106px;
                padding: 16px;
                margin-left: 15px;
                border: 1px solid rgb(201, 201, 201);
                &:hover{
                     border: 1px solid rgb(0, 131, 176);
                }
                .l{
                    width: 72px;
                    height: 72px;
                    float: left;
                    background-color: rgb(0,131,176);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    img{
                        width: 100%;
                        height: 100%;
                        display: block;
                        width: 36px;
                        height: 36px;
                  
                    }
                }   
                .r{
                    float: left;
                    width: 118px;
                    margin-left: 7px;
                    height: 72px;
                    p:nth-child(1){
                        color: #333; 
                        margin-bottom: 5px;
                        &:hover{
                            color: rgb(0, 131, 176);
                        }         
                    }
                    p:nth-child(2){
                        font-size: 12px;
                        color: rgb(153, 153, 153);
                        &:hover{
                            color: rgb(0, 131, 176);
                        }   
                    }
                }       
            }
        }
    }
</style>

