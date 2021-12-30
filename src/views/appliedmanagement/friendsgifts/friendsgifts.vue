<template>
    <div>
        <url-button ref="linkselect" @SmallProFun="SmallProFun" @listenurldata="geturldata" :settings="linkSettings"></url-button>
        <imgSelect ref="imgselect" :options="imgOptions" @listentoptpmfile="changeImg($event)"></imgSelect>
        <imgSelect ref="cardselect" @listentoptpmfile="cardselectimg($event)" :options="{ mode: 'diy', type: 'image'}"></imgSelect>
        <p>好友赠礼</p>
        <Card>
            <div class="friendsgifts">
                <div class="friendsgifts_off">
                    <div class="friendsgifts_msg"> 
                        <p>启用好友赠礼功能后，买家下单后并完成付款后，需将订单分享给送礼小伙伴（朋友圈、微信群、微信好友），由好友完成收货地址信息填写。</p>
                        <p>仅有完善收货地址信息的订单，才会被后续订单流程处理。</p>
                        <p>好友赠礼功能开启后即店铺内所有商品仅可使用该送礼功能，送礼功能可与正常购买流程同时存在。</p>
                    </div>
                    <div class="friendsgifts_btn">
                        <i-switch v-model="formData.status" true-value="1" false-value="2" @on-change="switchChange" size="large"> </i-switch>
                    </div>   
                </div>
                <div class="friendsgifts_container" v-if="formData.status=='1'">
                   <div class="friendsgifts_content">
                        <div>
                            <div class="friendsgifts_title">送礼设置</div>
                            <div class="formitem">
                                <div class="formitem_title">送礼卡片</div>
                                <div class="formitem_cont">
                                    <div class="formitem_btn"><Button @click="cardselectfuc('card')" type="primary">+选择图片</Button></div>   
                                    <div class="card_bg">
                                        <div v-for="(item,index) in formData.giftCardList" :key="index" class="card_bg_item"> 
                                            <div class="l">
                                                <span @click="deleteDard(index)">
                                                   <Icon type="ios-close-circle" />
                                                </span>
                                                <img :src="item.giftPicture" alt="">
                                            </div>
                                            <div class="r">
                                                <div class="title">卡片名称</div>
                                                <div class="Input">
                                                    <Input v-model="item.title" :maxlength="6" style="width: 150px" />
                                                    <span>不超过6个汉字</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="formitem">
                                <div class="formitem_title">送礼规则标题</div>
                                <div class="formitem_cont">
                                    <div class="formitem_input">
                                        <Input v-model="formData.giftTitle" :maxlength="6" style="width: 540px" />
                                    </div>
                                    <span>标题文字不超过6个汉字</span>
                                </div>
                            </div>

                            <div class="formitem">
                                <div class="formitem_title">规则跳转</div>
                                <div class="formitem_cont">
                                    <div class="formitem_input">
                                        <Input :value="formData.rulesLink" style="width: 452px" disabled="disabled"/>
                                        <Button type="primary" @click="urlFun()">选择跳转</Button>
                                    </div>
                                    <span>选择规格内容页面路径跳转</span>
                                </div>
                            </div>
                            
                            <div class="formitem">
                                <div class="formitem_title">文字提示</div>
                                <div class="formitem_cont">
                                    <div class="formitem_input">
                                        <Input v-model="formData.tooltip" style="width: 540px" />
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="friendsgifts_title">分享设置</div>
                            <div class="formitem">
                                <div class="formitem_title">分享图片</div>
                                <div class="formitem_cont">
                                    <div class="formitem_btn">
                                        <Button @click="openImg('share')" type="primary">+选择图片</Button>
                                        <span>尺寸：640*450px</span>
                                    </div>   
                                    <div class="img_bg">
                                        <span @click="deleteShare" v-if="formData.sharePhotos">
                                            <Icon type="ios-close-circle" />
                                        </span>
                                        <img :src="formData.sharePhotos" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="formitem">
                                <div class="formitem_title">分享标题</div>
                                <div class="formitem_cont">
                                    <div class="formitem_input">
                                        <Input v-model="formData.shareTitle" :maxlength="12" style="width: 540px" />
                                    </div>
                                    <span>分享标题文字不超过12个汉字</span>
                                </div>
                            </div>
                       </div>

                       <div>
                            <div class="friendsgifts_title">收礼设置</div>
                            <div class="formitem">
                                <div class="formitem_title">收礼提示图片</div>
                                <div class="formitem_cont">
                                    <div class="formitem_btn">
                                        <Button @click="openImg('reminder')" type="primary">+选择图片</Button>
                                        <span>好友未收礼时提示图片，尺寸：600*400px</span>
                                    </div>   
                                    <div class="img_bg">
                                        <span @click="deleteReminder" v-if="formData.acceptCard">
                                            <Icon type="ios-close-circle" />
                                        </span>
                                        <img :src="formData.acceptCard" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="formitem">
                                <div class="formitem_title">已领取提示图片</div>
                                <div class="formitem_cont">
                                    <div class="formitem_btn">
                                        <Button @click="openImg('draw')" type="primary">+选择图片</Button>
                                        <span>好友已领取时提示图片，尺寸：600*400px</span>
                                    </div>   
                                    <div class="img_bg">
                                        <span @click="deleteDraw" v-if="formData.receiveCard">
                                            <Icon type="ios-close-circle" />
                                        </span>
                                         <img :src="formData.receiveCard" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="formitem">
                                <div class="formitem_title">收礼页面提示语</div>
                                <div class="formitem_cont">
                                    <div class="formitem_input">
                                        <Input v-model="formData.receivingGifts" :maxlength="12" style="width: 540px" />
                                    </div>
                                    <span>文字不超过12个汉字</span>
                                </div>
                            </div>
                       </div>
                   </div> 
           
                </div>
            </div>
        </Card>
        <p v-if="formData.status=='1'" class="save">
            <Button style="width: 100px" @click="save()" size="large" type="primary">保存</Button>
        </p>
    </div>
</template>

<script>
    import marking from "@/api/request/marking";
    import urlButton from "@/components/urlbutton/urlbutton";
    import imgSelect from "@/components/imgSelect/imgSelect";
    export default {
        name: 'friendsgifts',
        components:{
            urlButton,
            imgSelect
        },
        data() {
            return {
                // DIY设计选择框
                linkSettings:{
                    mode:'diy'
                }, 
                // 图片选择器属性
                imgOptions: {
                    type: "image",
                    // type:"multiimage",
                    mode: "diy"
                },
                imgtype:"",
                savetype:true,   
                ID:"",             
                formData:{
                    // 状态
                    status:"1", 
                    // 送礼规则标题
                    giftTitle:"",	
                    // 规则跳转
                    rulesLink:"",
                    // 文字提示
                    tooltip:"",
                    // 送礼卡片名称和图片
                    giftCardList:[],
                    // 分享图片
                    sharePhotos:"",
                    // 分享标题
                    shareTitle:"",
                    // 收礼卡图
                    acceptCard:"",
                    // 已领取卡图
                    receiveCard:"",
                    // 收礼提示语
                    receivingGifts:""
                }
            }
        },
        created() {
            this.friendgiftSearchfuc()
            
        },
        methods: {
            // 开启、关闭
            switchChange:function(value){
                console.log(value)
            },
            // 选择地址
            geturldata: function(links) {
                this.formData.rulesLink = links
            },
            // 获取小程序信息
            SmallProFun:function(SmallPro) {
                this.formData.rulesLink = "其他小程序"
            },
            // 选择路径
            urlFun:function() {    
                this.$refs.linkselect.cardShow()
            },
            // 图片选择
            openImg:function(type) {
                this.imgtype=type
                this.$refs.imgselect.uploadflg();
            },
            // 删除分享图片
            deleteShare:function(){
                this.formData.sharePhotos=""
            },
            // 删除收礼卡图
            deleteReminder:function(){
                this.formData.acceptCard=""
            },
            //删除title已领取卡图
            deleteDraw:function(){
                this.formData.receiveCard=""
            },
            // 卡片选择
            cardselectfuc:function(){
                this.$refs.cardselect.uploadflg();
            },
            //删除卡片
            deleteDard:function(index){
                this.formData.giftCardList.splice(index,1)
            },
            // 送礼卡片列表
            cardselectimg:function(data){
                let arr=[]
                for(let item in data){
                    let obj ={}
                        obj.giftPicture =data[item].imgAddress
                        obj.title=""
                    // arr.push(obj)
                     this.formData.giftCardList.push(obj)
                }
                // this.formData.giftCardList=arr
            },
            // 图片选择事件
            changeImg:function(img) {
                console.log(this.imgtype);
                if (this.imgtype == "card") {
                    this.img = img[0].imgAddress;
                }else if(this.imgtype=="share"){
                    this.formData.sharePhotos=img[0].imgAddress;
                }else if(this.imgtype=="reminder"){
                    this.formData.acceptCard=img[0].imgAddress;
                }else if (this.imgtype == "draw") {
                    this.formData.receiveCard = img[0].imgAddress;
                } 
            },
            // 保存并判断状态
            save:function(){
                if(this.savetype){
                    this.friendgiftSavefuc()
                }
                else{
                    this.friendgiftUpdatefuc()
                }
            },     
            // 查询好友赠礼
            friendgiftSearchfuc:function(){
                marking.friendgiftSearch({})
                .then(res => {
                   if(res.code==1){
                       if(typeof(res.data)=="undefined"){
                            this.savetype=true
                       }
                       else{
                            this.savetype=false

                            this.statusfuc(res.data)
                       }    
                   }
                }).catch(error => {
                    console.log(error)
                });
            },
            
            // 判断状态
            statusfuc:function(data){
                this.formData.acceptCard=data.acceptCard,
                this.formData.giftCardList=data.friendgifcard,
                
                this.formData.giftTitle=data.giftTitle,
                this.ID=data.id,
                this.formData.receiveCard=data.receiveCard,
                this.formData.receivingGifts=data.receivingGifts,
                this.formData.rulesLink=data.rulesLink,
                this.formData.sharePhotos=data.sharePhotos,
                this.formData.shareTitle=data.shareTitle,
                this.formData.status=data.status,
                this.formData.tooltip=data.tooltip
            },

            // 修改赠礼
            friendgiftUpdatefuc:function(){
                marking.friendgiftUpdate({
                    id:this.ID,

                    status:this.formData.status,

                    giftTitle:this.formData.giftTitle,
              
                    rulesLink:this.formData.rulesLink,
                
                    tooltip:this.formData.tooltip,
                  
                    sharePhotos:this.formData.sharePhotos,
                 
                    shareTitle:this.formData.shareTitle,
                   
                    acceptCard:this.formData.acceptCard,
                
                    receiveCard:this.formData.receiveCard,
               
                    receivingGifts:this.formData.receivingGifts,
               
                    giftCardList:this.formData.giftCardList 
                })
                .then(res => {
                    if(res.code==1){
                        this.$Message.success(res.message)
                    }
                    else{
                       this.$Message.error(res.message) 
                    }
                     
                })
                .catch(error => {
                    console.log(error)
                });
            },
            // 添加好友赠礼
            friendgiftSavefuc:function() {
                marking.friendgiftSave({
            

                    status:this.formData.status,

                    giftTitle:this.formData.giftTitle,
              
                    rulesLink:this.formData.rulesLink,
                
                    tooltip:this.formData.tooltip,
                  
                    sharePhotos:this.formData.sharePhotos,
                 
                    shareTitle:this.formData.shareTitle,
                   
                    acceptCard:this.formData.acceptCard,
                
                    receiveCard:this.formData.receiveCard,
               
                    receivingGifts:this.formData.receivingGifts,
               
                    giftCardList:this.formData.giftCardList
                })
                .then(res => {
                    console.log(res)
                    if(res.code==1){
                        this.$Message.success(res.message)
                    }
                    else{
                        this.$Message.error(res.message)  
                    }
                   
                })
                .catch(error => {
                    console.log(error)
                });
            },
        },
    }
</script>

<style lang="less" scoped>
    .save{
        width: 100%;
        text-align: center;
        margin-top: 25px;
    }
    .friendsgifts{
        width: 100%;
        min-height: 700px;
        .friendsgifts_off{
            width: 100%;
            height: 100px;
            background-color:rgb(255,255,204);
            padding: 15px;
            border: 1px dashed rgb(255,204,153);
            overflow: hidden;
            .friendsgifts_msg{
                float: left;
                p{
                    font-size: 13px;
                    margin-bottom: 5px;
                }    
            }
            .friendsgifts_btn{
                float: left;
                height: 70px;
                width: 70px;
                margin-left: 15px; 
                text-align: center;
                display: flex;
                align-items:center;
            }
        }
        .friendsgifts_container{
            margin-top: 15px;
             border: 1px solid rgb(201, 201, 201);
            .friendsgifts_content{
                width: 100%;
                .friendsgifts_title{
                    background-color: rgb(0,131,176);
                    color: #ffffff;
                    padding: 10px;
                    padding-left: 15px;
               
                }
                .formitem{
                    margin: 30px 0;
                    width: 100%;
                    overflow: hidden;
                    .formitem_title{
                        width: 125px;
                        text-align: right;
                        margin-right: 15px;
                        margin-top: 5px;
                        float: left;
                    }
                    .formitem_cont{
                        float: left;
                        .formitem_btn{
                            margin-bottom: 15px;
                            .ivu-btn{
                                vertical-align:bottom;
                            }
                        }
                        .card_bg{
                            width: 560px;
                            padding: 15px;
                            min-height: 120px;
                            background-color:rgb(246,246,246);
                            border: 1px dashed rgb(228, 228, 228);
                            .card_bg_item{
                              width: 530px;
                              height: 120px;
                              margin-bottom: 30px;
                              .l{
                                height: 120px;
                                width: 170px;
                                float: left;
                                border: 1px solid rgb(228, 228, 228);
                                position: relative;
                                margin-right: 10px;
                                span{
                                    position: absolute;
                                    font-size: 20px;
                                    right:-10px;
                                    top: -15px; 
                                    cursor: pointer; 
                                    z-index: 15;
                                }
                                img{
                                    width: 100%;
                                    height: 100%;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    z-index: 10;
                                } 
                              }
                              .r{
                                float: left;
                                .title{
                                  margin-top: 65px;   
                                }
                                .Input{
                                    .ivu-input-wrapper{
                                        vertical-align: bottom;
                                        margin-right: 5px;
                                    }
                                    span{
                                        color:rgb(134,134,134);
                                        font-size: 12px;
                                    }
                                }
                              }
                            }
                        }
                        .img_bg{
                            width: 120px;
                            height: 80px;
                            border: 1px solid rgb(228, 228, 228);
                            position: relative;
                            span{
                                position: absolute;
                                font-size: 20px;
                                right:-10px;
                                top: -15px; 
                                cursor: pointer; 
                                z-index: 15;
                            }
                            img{
                                position:absolute;
                                top: 0;
                                right: 0;
                                width: 100%;
                                height: 100%;
                                z-index: 10;
                            }
                        }
                        span{
                            color:rgb(134,134,134);
                            font-size: 12px;
                        }
                    }
                }

            }
        }
    }
</style>