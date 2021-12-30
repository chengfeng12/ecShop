<template>
    <div class="addhelpshare">
        <imgSelect ref="imgselect" :options="imgOptions" @listentoptpmfile="changeImg($event)"></imgSelect>
        <div class="mask" v-if="show">
            <div class="time-set">
                <div class="set-title">
                    周期时段设置
                    <span class="close" @click="handleCloseClick">X</span>
                </div>
                <div class="choose-week">
                    <Form :label-width="100">
                        <FormItem label="活动周期">
                            <span class="star">*</span>
                            <Button
                                class="week-btn"
                                v-for="(item,index) in weekdays"
                                :key="index"
                                :disabled="item.disable"
                                :class="{bgColor:item.flag}"
                                @click="handleClick(item,index)">
                                {{item.week}}
                                <Icon type="ios-checkmark" size="20"></Icon>
                            </Button>
                        </FormItem>
                        <FormItem label="活动时段">
                            <span class="star">*</span>
                            <TimePicker 
                                confirm 
                                format="HH:mm:ss" 
                                type="timerange" 
                                v-model="formData.startEnd"
                                @on-change='formData.startEnd=$event'
                                placement="bottom-end"
                                placeholder="请选择时间段"
                                style="width: 168px">
                            </TimePicker>
                        </FormItem>
                    </Form>
                </div>
                <div class="formBtn">
                    <Button type="primary" class="comBtn" @click="handleSureClick">确认</Button>
                    <Button type="default" class="comBtn" @click="handleCloseClick">取消</Button>
                </div>
            </div>
        </div>
        <p>添加活动</p>
         <Form ref="formData" :model="formData" :rules="formDataRule" :label-width="100">
            <Card>        
                <Tabs type="card" :animated="false">
                        <TabPane label="基本信息">
                            <div class="formtab">
                                <div class="formtab_title">
                                    基础设置
                                </div>
                                <div class="formtab_content">
                                    <FormItem label="活动名称" prop="activityName">
                                        <Input v-model="formData.activityName" :maxlength="20" style="width:400px" /><span>{{formData.activityName.length}}</span>
                                    </FormItem>
                                    <FormItem label="活动有效期" prop="activityTime">
                                  
                                        <DatePicker 
                                            type="datetimerange"
                                            :editable="false"
                                            :options="optionsTime"
                                            :value="formData.activityTime"
                                            @on-change="changeTime"
                                            format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="请选择日期" style="width: 350px">
                                        </DatePicker>
                                        <span class="options" @click="handleShowClick">高级选项</span>
                                    </FormItem>
                                    <FormItem label="活动渠道" prop="channels">
                                       
                                        <Select v-model="formData.channels" style="width:400px">
                                            <Option value="1">微信小程序</Option>    
                                        </Select>
                                    </FormItem>

                                    <FormItem label="活动类型">
                                        <RadioGroup v-model="formData.activityType">
                                            <Radio label="1">好友助力</Radio>
                                            <Radio label="2">分享即得</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </div>
                            </div> 
                            <div class="formtab">
                                <div class="formtab_title">
                                    发起者设置
                                </div>
                                <div class="formtab_content">
                                <div class="condition">
                                    <div class="condition_title">获奖条件</div>
                                    <div class="condition_content">
                                            <div class="condition_item">
                                                <FormItem  prop="helpNumber" :label-width="0" >
                                                    <span v-if="formData.activityType==1">好友助力满</span>
                                                    <span v-else>每次成功分享获得</span>
                                                    <Input v-model="formData.helpNumber" style="width:100px"/>
                                                    <span v-if="formData.activityType==1">次,</span>
                                                    <span v-else>件,</span>
                                                </FormItem>
                                            </div>
                                            <div class="condition_item">
                                                <FormItem prop="giftNumber" :label-width="0">
                                                    <span v-if="formData.activityType==1">即可获赠</span>
                                                    <span v-else>累计最多获得</span>
                                                <Input v-model="formData.giftNumber" style="width:100px"/>件奖品</FormItem>
                                            </div>   
                                    </div>  
                                </div>
                                    <FormItem label="获赠奖品">
                                        <RadioGroup v-model="formData.giftPrize">
                                            <Radio label="1">优惠券</Radio>
                                            <Radio :disabled="true" label="2">赠品</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <div>
                                        <FormItem v-if="formData.giftPrize=='1'" label="">
                                            <!-- 发起者设置优惠券 -->
                                            <add-discount 
                                                :selectNum="selectNum"
                                                @listentDiscountData="listentDiscountData($event)"
                                                :optionsData="showgiftPrize"
                                            ></add-discount>
                                        </FormItem>
                                        <FormItem v-if="formData.giftPrize=='2'" label="">
                                            <add-gift 
                                                @listentgoodData="listentgifData($event)"
                                                :selectGoods="showGift"
                                                res="+选择赠品">
                                            </add-gift>

                                        </FormItem>
                                    </div>
                                    <FormItem label="能否重复发起">
                                        <RadioGroup v-model="formData.isRepeat">
                                            <Radio label="1">是</Radio>
                                            <Radio label="2">否</Radio>
                                        </RadioGroup>
                                        <div class="remark_div">同一发起对象同一次助力，是否允许助力者重复助力</div>
                                    </FormItem>
                                    <FormItem prop="memberNumber" :label-width="100" v-if="formData.isRepeat=='1'">
                                        单用户最多发起<Input v-model="formData.memberNumber" style="width:100px;margin:0 10px;"/>次
                                    </FormItem>
                                </div>
                            </div> 
                            <div class="formtab" v-if="formData.activityType=='1'">
                                <div class="formtab_title">
                                    助力者设置
                                </div>
                                <div class="formtab_content">
                                    <FormItem label="重复助力">
                                        <RadioGroup v-model="formData.isHelp">
                                            <Radio label="1">可以</Radio>
                                            <Radio label="2">不可以</Radio>
                                        </RadioGroup>
                                        <div class="remark_div">同一发起对象同一次助力，是否允许助力者重复助力</div>
                                    </FormItem>
                                    <FormItem  prop="repeatNumber" :label-width="100" v-if="formData.isHelp=='1'">
                                        最多重复助力<Input v-model="formData.repeatNumber" style="width:100px;margin:0 10px;"/>次
                                    </FormItem>

                                    <FormItem label="助力有奖">
                                        <RadioGroup v-model="formData.isPrize">
                                            <Radio label="1">有</Radio>
                                            <Radio label="2">无</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <div style="height:80px;" class="condition" v-if="formData.isPrize=='1'">
                                        <div class="condition_title"></div>
                                        <div class="condition_content">
                                            <div style="height:40px;">
                                                <div class="condition_item">
                                                    <FormItem prop="powerNumber" :label-width="0">
                                                        <span>好友助力满</span>
                                                        <Input v-model="formData.powerNumber" style="width:100px"/>
                                                        <span>次,</span>
                                                    </FormItem>
                                                </div>
                                                <div class="condition_item">
                                                    <FormItem prop="powerGiven" :label-width="0">
                                                        <span>即可获赠</span> 
                                                    <Input v-model="formData.powerGiven" style="width:100px"/>件奖品</FormItem>
                                                </div>
                                                
                                            </div> 
                                                <div style="margin-top: 20px;" class="remark_div">累计参与并助力好友满***次，即可获赠奖品</div>   
                                        </div>  
                                        
                                    </div>

                                    <div v-if="formData.isPrize=='1'">
                                        <FormItem label="获赠奖品">
                                            <RadioGroup v-model="formData.helpPrize">
                                                <Radio label="1">优惠券</Radio>
                                                <Radio :disabled="true" label="2">赠品</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                        <div>
                                        <FormItem v-if="formData.helpPrize=='1'" label="">
                                            <add-discount
                                                :selectNum="selectNum"
                                                @listentDiscountData="helplistentDiscountData($event)"
                                                :optionsData="showhelpPrize"
                                            ></add-discount>
                                        </FormItem>
                                        <FormItem v-if="formData.helpPrize=='2'" label="">
                                            <add-gift 
                                                @listentgoodData="helplistentgifData($event)"
                                                :selectGoods="showGift"
                                                res="+选择赠品">
                                            </add-gift>
                                        </FormItem>
                                    </div>
                                    </div>
                                </div>
                            </div> 
                        </TabPane>
                        
                        <TabPane label="内容设置">
                            <div class="formtab">
                                <div class="formtab_title">
                                    基础设置
                                </div>
                                <div class="formtab_content">
                                <div class="basicset">
                                    <div class="basic_img">
                                        <div class="basic_img_bg">
                                            <div class="basicset_tit">
                                                <img src="../../../assets/images/helpsharebg.png" alt="">
                                            </div>
                                            <div class="bgmsg_ps" 
                                            v-if="!(formData.bgimage||formData.topPicture||formData.shufflingPicture.length>0||formData.bottomPicture)"> 
                                                背景图片预览区域
                                            </div>
                                            <div class="basicset_con" :style="{backgroundImage: 'url(' + formData.bgimage + ')'}">
                                                
                                                <div class="basicset_content">
                                                    <div v-if="formData.topPicture" class="topPicture">
                                                        <img :src="formData.topPicture" alt="">
                                                    </div>
                                                    <div v-if="formData.shufflingPicture.length>0&&visibility" class="shufflingPicture">
                                                        <swiper :options="swiperOption" ref="shufflingswiper">
                                                            <swiper-slide v-for="(slide, index) in formData.shufflingPicture" :key="index">
                                                                <img class="slider" :src="slide" alt="">
                                                            </swiper-slide>
                                                            <div class="swiper-button-prev swiper_btn" slot="button-prev"></div>
                                                            <div class="swiper-button-next swiper_btn" slot="button-next"></div>
                                                        </swiper>  
                                                    </div>
                                                    <div class="activerule">活动规则</div>
                                                    <div v-if="formData.bottomPicture" class="bottomPicture">
                                                        <img :src="formData.bottomPicture" alt="">
                                                    </div>
                                                </div>
                                                <div class="sharebutton">分享好友助力</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="basic_msg">
                                            <div class="msg_item">
                                                <div class="msg_title">
                                                    背景图片
                                                </div>
                                                <div class="msg_content">
                                                        <div class="msg_content_btn">
                                                            <div class="msg_content_l">
                                                                <Button size="large"  @click="openImg('bgimage')" type="primary">+选择图片</Button>
                                                            </div>
                                                            <div class="msg_content_r">选择背景后可直接在左侧预览，建议尺寸 宽:640 高: 大于(等于)1135，图片比例请大于1:1.5</div>
                                                        </div>
                                                        <div v-if="formData.bgimage">
                                                            <div class="msgimg_bg">
                                                                <span @click="deletebgimage()">
                                                                    <Icon type="ios-close-circle" />
                                                                </span>
                                                                <img :src="formData.bgimage" alt="">
                                                            </div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div class="msg_item">
                                                <div class="msg_title">
                                                    顶部广告图
                                                </div>
                                                <div class="msg_content">
                                                        <div class="msg_content_btn">
                                                            <div class="msg_content_l">
                                                                <Button size="large"  @click="openImg('topPicture')" type="primary">+选择图片</Button>
                                                            </div>
                                                            <div class="msg_content_r">建议尺寸</div>
                                                        </div>
                                                        <div>
                                                            <div v-if="formData.topPicture" class="msgimg_bg">
                                                                <span @click="deletetopPicture()">
                                                                    <Icon type="ios-close-circle" />
                                                                </span>
                                                                <img :src="formData.topPicture" alt="">
                                                            </div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div class="msg_item">
                                                <div class="msg_title">轮播图</div>
                                                <div class="msg_content">
                                                    <div class="msg_content_btn">
                                                        <div class="msg_content_l">
                                                            <Button size="large"  @click="openImg('shufflingPicture')" type="primary">+选择图片</Button>
                                                        </div>
                                                            <div class="msg_content_r">建议尺寸</div>
                                                        </div>
                                                        <div>
                                                        <div v-if="formData.shufflingPicture.length>0" class="shuffling_bg">
                                                            <div v-for="item in formData.shufflingPicture" :key="item.index">
                                                                <span @click="deleteshufflingPicture(item.index)">
                                                                    <Icon type="ios-close-circle" />
                                                                </span>
                                                                <img class="shufflingPicture" :src="item" alt="">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="msg_item">
                                                <div class="msg_title">
                                                    底部广告图
                                                </div>
                                                <div class="msg_content">
                                                        <div class="msg_content_btn">
                                                            <div class="msg_content_l">
                                                            <Button size="large"  @click="openImg('bottomPicture')" type="primary">+选择图片</Button>
                                                            </div>
                                                            <div class="msg_content_r">建议尺寸</div>
                                                        </div>
                                                        <div>
                                                            <div class="msgimg_bg" v-if="formData.bottomPicture">
                                                                <span @click="deletebottomPicture()">
                                                                    <Icon type="ios-close-circle" />
                                                                </span>
                                                                <img :src="formData.bottomPicture" alt="">
                                                            </div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div class="msg_item">
                                                <div class="msg_title">
                                                    按钮文字
                                                </div>
                                                <div class="msg_content">
                                                    <Input v-model="formData.buttonText" placeholder="" style="100px" />
                                                </div>
                                            </div>

                                            <div class="msg_item">
                                            
                                                <div class="msg_content">
                                                    <span style="padding-right:38px">按钮颜色</span>
                                                    <ColorPicker v-model="formData.buttonColor" />
                                                    <span style="padding-right:15px;padding-left:15px">文字颜色</span>
                                                    <ColorPicker v-model="formData.textColor" />
                                                    
                                                </div>
                                            </div>

                                            <div class="msg_item">
                                                <div class="msg_title">
                                                    活动规则
                                                </div>
                                                <div class="msg_content">
                                                    <Input v-model="formData.activityRule" type="textarea" :rows="6" />
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div class="formtab">
                                <div class="formtab_title">
                                    奖品图片
                                </div>
                                <div class="formtab_content">
                                    <div class="imgsel_item">
                                        <div class="imgsel">
                                            <div class="imgsel_title">发起者奖品图片</div>

                                            <div class="imgsel_con">
                                                <div><Button @click="openImg('initiatorImage')" type="primary">+选择图片</Button></div>
                                                <div class="imgsel_bg">
                                                    <img :src="formData.initiatorImage" alt="">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="imgsel">
                                            <div class="imgsel_title">助力者奖品图片</div>

                                            <div class="imgsel_con">
                                                <div><Button @click="openImg('powerImage')" type="primary">+选择图片</Button></div>
                                                <div class="imgsel_bg">
                                                    <img :src="formData.powerImage" alt="">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                            <div class="formtab">
                                <div class="formtab_title">
                                    分享设置
                                </div>
                                <div class="formtab_content">
                                    <div class="imgsel_item">
                                        <div class="imgsel">
                                            <div class="imgsel_title">分享图片</div>
                                            <div class="imgsel_con">
                                                <div class="imgsel_btn">
                                                    <Button type="primary" @click="openImg('shareImage')">+选择图片</Button>
                                                    <span class="remark_span">尺寸：640*450px</span>
                                                </div>
                                                <div class="imgsel_bg">
                                                    <img :src="formData.shareImage" alt="">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <FormItem :label-width="143" label="分享标题">
                                        <Input v-model="formData.shareTitle" style="width:400px" />
                                        <div class="remark_div">分享标题文字不超过12个汉字</div>
                                    </FormItem>
                                </div>
                            </div>  
                        </TabPane>
                </Tabs>
            </Card>
            <div style="margin-top: 20px;text-align: center;">
                <Button :disabled="status" size="large" type="primary" @click="handleSubmit('formData')">保存</Button>
                <Button size="large" @click="handleReset('formData')" style="margin-left: 8px">取消</Button>
            </div>
        </Form>
    </div>
</template>

<script>
    import marking from "@/api/request/marking";
    import imgSelect from "@/components/imgSelect/imgSelect";
    import addDiscount from "@/components/addDiscount/addDiscount";
    import addGift from "@/components/addGood/addGift";
    import utils from '@/utils/goodsUtils';
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
        name: 'addhelpshare',
        data() {
            return {
                visibility:true, 
                swiperOption: {
                    direction: 'horizontal', // 垂直切换选项
                    loop: true, // 循环模式选项
                    // 如果需要前进后退按钮
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                   
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true,//修改swiper的父元素时，自动初始化swiper
             
                },
                imgOptions: {
                    type: "image",
                    mode: "diy"
                },
                selectNum:{
                    select: 1
                },
                // 高级设置显示
                show:false,
                // 发起者设置获赠优惠券
                showgiftPrize: [],
                showhelpPrize:[],
                // 发起者设置获赠赠品
                showGift:[],
                //活动周期
                weekdayList:[],
                
                dateIntArr:[],
                weekdays: [
                    {
                    week: '周一',
                    flag: false,
                    id: 1,
                    disable: true
                    }, {
                        week: '周二',
                        flag: false,
                        id: 2,
                        disable: true
                    }, {
                        week: '周三',
                        flag: false,
                        id: 3,
                        disable: true
                    }, {
                        week: '周四',
                        flag: false,
                        id: 4,
                        disable: true
                    }, {
                        week: '周五',
                        flag: false,
                        id: 5,
                        disable: true
                    }, {
                        week: '周六',
                        flag: false,
                        id: 6,
                        disable: true
                    }, {
                        week: '周日',
                        flag: false,
                        id: 0,
                        disable: true
                    }
                ],
                status:false,
                optionsTime: {
                    disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                // 表单数据
                formData:{
                    /**基础设置 */
                    // 活动名称
                    activityName:"",
                    // 活动有效期
                    activityTime:[],
                    // 活动时间段
                    startEnd:[],
                    //  // 开始活动时间段
                    // startTime:"",
                    // // 结束活动时间段
                    // endTime:"",
                    // 活动渠道
                    channels:"1",
                    // 活动类型
                    activityType:"1",  
                    /**发起者设置 */
                    // 发起者好友助力满次
                    helpNumber:"",
                    // 可获赠件
                    giftNumber:"",
                    // 发起者获赠奖品  1,优惠 2赠品
                    giftPrize:"1",
                    // 发起者重复发起 1,是 2，否
                    isRepeat:"1",
                    // 发起者单用户最多发起次
                    memberNumber:"",
                    // 发起者优惠券或赠品ID
                    shareMapinitiate:[],
                     /**助力者设置 */
                    // 助力者重复助力 1,可以 2,不可以
                    isHelp:"1",
                    // 最多重复助力次数
                    repeatNumber:"",
                    // 助力有奖 1,有 2，无
                    isPrize:"1",
                    // 助力者好友满次数
                    powerNumber:"",
                    // 助力获赠件数,
                    powerGiven:"",
                    // 助力者获赠奖品   1,优惠  2,赠品
                    helpPrize:"1",
                    // 助力者 优惠券或赠品ID
                    sharehelp:[],
                    /* 内容设置*/
                    // 发起者图片
                    initiatorImage:"",
                    // 活动规则
                    activityRule:"",
                    // 分享图片
                    shareImage:"",
                    // 助力者图片
                    powerImage:"",
                    // 分享标题
                    shareTitle:"",
                    //背景图片
                    bgimage:"",
                    // 顶部广告图
                    topPicture:"",
                    // 轮播图
                    shufflingPicture:[],
                    // 底部广告图
                    bottomPicture:"",
                    // 按钮颜色
                    buttonColor:"#000000",
                    // 文字颜色
                    textColor:"#ffffff"
                    
                },
                // 表单规则 
                formDataRule:{
                
                    activityName:{
                        required: true,
                        message: "活动名称不能为空",
                        trigger: "blur"
                    },
                    
                    activityTime:{
                        type: 'array',
                        required:true,
                        fields: {
                            0: {required: true, message: '请输入活动有效期'},
                            1: {required: true, message: '请输入活动有效期'}
                        },
                        message:'请输入活动有效期'
                    },
                    
                    channels:{
                        required: true,
                        message: "请选择活动渠道",
                        trigger: "change"
                    },

                    helpNumber:{
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: "请输入一个正整数",
                        trigger: "blur"
                    },

                    giftNumber:{
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: "请输入一个正整数",
                        trigger: "blur"
                    },

                    memberNumber:{
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: "请输入一个正整数",
                        trigger: "blur"
                    },

                    repeatNumber:{
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: "请输入一个正整数",
                        trigger: "blur"
                    },

                    powerNumber:{
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: "请输入一个正整数",
                        trigger: "blur"
                    },

                    powerGiven:{
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: "请输入一个正整数",
                        trigger: "blur"
                    }

                },
                editId:"",
                role:""
            }
        },
        components:{
            imgSelect,
            addDiscount,
            addGift,
            swiper,
            swiperSlide
        },

        created() {
            this.fetchData(); 
           
        },
        methods: {
            // 路由变化时重新加载页面
            fetchData:function(){
                (this.editId = this.$route.query.id),
                (this.role = this.$route.query.role);  
                if (this.$route.query.role == 2) {
                    console.log("编辑")
                    this.clearform("formData");
                    this.shareDetailfuc(this.editId);
                } else if (this.$route.query.role == 1) {
                    console.log("添加")
                    this.clearform("formData");
                }
            },
            handleReset:function(){
                this.gotolink()
            },
            // 清空页面数据和错误信息
            clearform:function(){
             
                this.formData.activityName="",
                this.formData.activityTime=[],
                this.formData.startEnd=[],
                this.formData.activityType="1",
                this.formData.helpNumber="",
                this.formData.giftNumber="",
                this.formData.giftPrize="1",
                this.formData.isRepeat="1",
                this.formData.memberNumber="",
                this.formData.shareMapinitiate=[],
                this.formData.isHelp="1",
                this.formData.repeatNumber="",
                this.formData.isPrize="1",
                this.formData.powerNumber="",
                    // 助力获赠件数,
                this.formData.powerGiven="",
                this.formData.helpPrize="1",
                this.formData.sharehelp=[],
                this.formData.initiatorImage="",
                this.formData.activityRule="",
                this.formData.shareImage="",
                this.formData.powerImage="",
                this.formData.shareTitle="",
                this.formData.bgimage="",
                this.formData.buttonText="",
                this.formData.topPicture="",
                // 轮播图
                this.formData.shufflingPicture=[],
                // 底部广告图
                this.formData.bottomPicture="",
                    // 按钮颜色
                this.formData.buttonColor="#000000",
                    // 文字颜色
                this.formData.textColor="#ffffff"   
            },
            changeTime:function(e) {
                console.log(e)
                    // 判断当前时间处理
                if (new Date(e[0]).getTime() < new Date().getTime()) {
                    e[0] = new Date(new Date().getTime() + 300 * 1000).getTime()
                    e[0] = utils.timeFun(e[0])
                }
                this.formData.activityTime=e;
                    let day1 = new Date(e[0]);
                    let day2 = new Date(e[1]);
                    let dateIntArr = []
                    let dateArr = this.getDateArr(e[0].split(' ')[0], e[1].split(' ')[0])
                for (var i in dateArr) {
                    if (i < 7) {
                        dateIntArr.push(new Date(dateArr[i]).getDay())
                    } else {
                        continue
                    }
                }
                this.dateIntArr = dateIntArr
                this.weekdayList = []
                this.formData.startEnd = []
                if ((day2 - day1) / (1000 * 60 * 60 * 24) >= 6) {
                    //大于6天所有可点
                    for (var j in this.weekdays) {
                        this.weekdays[j].disable = false
                    }
                } 
                else {
                    this.checkWeekdays(dateIntArr)
                }
            },
            getDateArr(start,end) {
                let arr = []
                let start_ = start.split("-");
                let end_ = end.split("-");
                let startTime = new Date(start_[0], start_[1], start_[2]);
                let endTime = new Date(end_[0], end_[1], end_[2]);
                while ((endTime.getTime() - startTime.getTime()) >= 0) {
                let year = startTime.getFullYear();
                let month = startTime.getMonth().toString().length == 1 ? "0" + startTime.getMonth().toString() : startTime
                    .getMonth();
                let day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
                arr.push((year + "-" + month + "-" + day))
                startTime.setDate(startTime.getDate() + 1);
                }
                return arr
            },
            checkWeekdays(date) {
                for (let m in this.weekdays) {
                    this.weekdays[m].disable = true
                    this.weekdays[m].flag = false
                }
                for (let i in date) {
                    for (let j in this.weekdays) {
                        if (date[i] == this.weekdays[j].id) {
                        this.weekdays[j].disable = false
                        }
                    }
                }
            },
            viewModel:function(start, end) {
                console.log("sdfsfdsdfsdfsdf")
                let day1 = new Date(start);
                let day2 = new Date(end);
                let dateIntArr = [];
                let dateArr = this.getDateArr(start.split(" ")[0], end.split(" ")[0]);
                for (var i in dateArr) {
                dateIntArr.push(new Date(dateArr[i]).getDay());
                }
                console.log("day2-------",day2)
                console.log("day1-------",day1)
                if ((day2 - day1) / (1000 * 60 * 60 * 24) >= 6) {
                //大于6天所有可点
                    for (let j in this.weekdays) {
                        this.weekdays[j].disable = false;
                    }
                } 
                else {
                    this.checkWeekdays(dateIntArr);
                }
                for (let i in this.weekdayList) {
                for (let j in this.weekdays) {
                    if (this.weekdayList[i] == this.weekdays[j].id) {
                        this.weekdays[j].flag = true;
                    }
                }
                }
            },
            // 周期选择
            handleClick: function (item, index) {
                this.weekdays[index].flag = !this.weekdays[index].flag;
            },
            // 周期选择
            handleSureClick:function() {
                let list = []
                let arr = this.weekdays
                for (let i in arr) {
                if (arr[i].flag == true) {
                    list.push(arr[i].id)
                }
                }
                this.weekdayList = list
                this.show = false;
            },
            // 图品选择
            openImg:function(type) {
                this.imgtype=type
                this.$refs.imgselect.uploadflg();
            },

            // 发起者设置优惠券
            listentDiscountData: function(data) {
                console.log("data-------data",data)
                let arr = [];
                for (let i in data) {
                    let obj={}
                        obj.winningId=data[i].id
                    arr.push(obj);
                }
                this.formData.shareMapinitiate = arr;
                console.log("发起者设置优惠券", this.formData.shareMapinitiate);
            },
            // 发者设置赠品
            listentgifData: function(data) {
                console.log("赠品", data);
                let arr = [];
                for (let i in data) {
                    let obj={}
                        obj.winningId=data[i].id
                        obj.pic=data[i].thumb
                    arr.push(obj);
                }
                this.formData.shareMapinitiate = arr;
            },
            // 助力者设置优惠券
            helplistentDiscountData: function(data) {
                let arr = [];
                for (let i in data) {
                    let obj={}
                        obj.winningId=data[i].id
                    arr.push(obj);
                }
                this.formData.sharehelp = arr;
                console.log("助力者设置优惠券", this.formData.sharehelp);
            },
            // 助力者设置赠品
            helplistentgifData: function(data) {
                console.log("赠品", data);
                let arr = [];
                for (let i in data) {
                   let obj={}
                        obj.winningId=data[i].id
                        obj.pic=data[i].thumb
                        arr.push(obj);
                }
                this.formData.sharehelp = arr;
            },
            // 图片选择事件
            changeImg:function(img) {
                if (this.imgtype == "initiatorImage") {   
                    this.formData.initiatorImage = img[0].imgAddress;
                }else if(this.imgtype=="shareImage"){
                    this.formData.shareImage=img[0].imgAddress;
                }else if(this.imgtype=="powerImage"){
                    this.formData.powerImage=img[0].imgAddress;
                }else if (this.imgtype == "bgimage") {
                    this.formData.bgimage = img[0].imgAddress;
                }else if (this.imgtype == "topPicture") {
                    this.formData.topPicture = img[0].imgAddress;
                }else if (this.imgtype == "shufflingPicture") {
                    this.formData.shufflingPicture.push(img[0].imgAddress);
                } else if (this.imgtype == "bottomPicture") {
                    this.formData.bottomPicture = img[0].imgAddress;
                } 
            },
            //高级设置开启
            handleShowClick() {
                this.show = true;
            },          
            //高级设置关闭
            handleCloseClick() {
                this.show = false;
            },
            //提交表单 
            handleSubmit:function(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    //     console.log("this.formData.startEnd--------------",this.formData.startEnd)
                    //     console.log("this.weekdayList--------------",this.weekdayList)
                    //   if(this.formData.startEnd.length==0||this.formData.startEnd[0]==""|| this.formData.startEnd[0]==""){
                    //     this.$Message.error("请选择高级选项中的活动时间段");
                    //   }
                    //   else if(this.weekdayList.length==0){
                    //     this.$Message.error("请选择高级选项中的活动周期");
                    //   }
                    //   else{
                       
                    //   }

                        if(this.role==1){
                            this.addhelpsharefuc()
                        }
                        else if(this.role==2){
                            this.updatehelpsharefuc()
                        }
                    } 
                })
            },
            // 添加分享助力活动    
            addhelpsharefuc:function() {
                marking.addhelpshare({
                    // 活动名称
                    activityName:this.formData.activityName,
                     // 活动渠道
                    channels:this.formData.channels,
                    // 活动有效期
                    activityTime:this.formData.activityTime,
                    // 活动时间段
                    // startEnd:this.formData.startEnd,
                     // 开始活动时间段
                    startTime:this.formData.startEnd[0] == '' ? '00:00:01' : this.formData.startEnd[0],
                    // 结束活动时间段
                    endTime:this.formData.startEnd[1] == '' ? '23:59:59' : this.formData.startEnd[1],
                    // 活动周期
                    weekday:this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
                    // 活动类型
                    activityType:this.formData.activityType,  
                    /**发起者设置 */
                    // 发起者好友助力满次
                    helpNumber:this.formData.helpNumber,
                    // 可获赠件
                    giftNumber:this.formData.giftNumber,
                    // 发起者获赠奖品  1,优惠 2赠品
                    giftPrize:this.formData.giftPrize,
                    // 发起者重复发起 1,是 2，否
                    isRepeat:this.formData.isRepeat,
                    // 发起者单用户最多发起次
                    memberNumber:this.formData.memberNumber,
                    // 发起者优惠券或赠品ID
                    shareMapinitiate:this.formData.shareMapinitiate,
                     /**助力者设置 */
                    // 助力者重复助力 1,可以 2,不可以
                    isHelp:this.formData.isHelp,
                    // 最多重复助力次数
                    repeatNumber:this.formData.repeatNumber,
                    // 助力有奖 1,有 2，无
                    isPrize:this.formData.isPrize,

                    powerNumber:this.formData.powerNumber,
                    // 助力获赠件数,
                    powerGiven:this.formData.powerGiven,
                    // 助力者获赠奖品   1,优惠  2,赠品
                    helpPrize:this.formData.helpPrize,
                    // 助力者 优惠券或赠品ID
                    sharehelp:this.formData.sharehelp,
                    /* 内容设置*/
                    // 发起者图片
                    initiatorImage:this.formData.initiatorImage,
                    // 活动规则
                    activityRule:this.formData.activityRule,
                    // 分享图片
                    shareImage:this.formData.shareImage,
                    // 助力者图片
                    powerImage:this.formData.powerImage,
                    // 分享标题
                    shareTitle:this.formData.shareTitle,
                    // 背景图片
                    bgimage:this.formData.bgimage,

                    buttonText:this.formData.buttonText,

                    topPicture:this.formData.topPicture,
                    // 轮播图
                    shufflingPicture:this.formData.shufflingPicture,
                    // 底部广告图
                    bottomPicture:this.formData.bottomPicture,
                    // 按钮颜色
                    buttonColor:this.formData.buttonColor,
                    // 文字颜色
                    textColor:this.formData.textColor   
                })
                .then(res => {
            
                    if(res.code==1){
                        this.gotolink()
                    }
                    else{
                    this.$Message.error(res.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            },
            // 编辑分享助力活动
            updatehelpsharefuc:function(){
                marking.updateShare({
                    id:this.editId,

                    activityName:this.formData.activityName,
                    // 活动有效期
                    activityTime:this.formData.activityTime,
                    // 活动时间段
                    // startEnd:this.formData.startEnd,
                     // 开始活动时间段
                     startTime:this.formData.startEnd[0] == '' ? '00:00:01' : this.formData.startEnd[0],
                    // 结束活动时间段
                    endTime:this.formData.startEnd[1] == '' ? '23:59:59' : this.formData.startEnd[1],
                    // 活动周期
                    weekday:this.weekdayList.length == 0 ? this.dateIntArr : this.weekdayList,
                    // 活动渠道
                    channels:this.formData.channels,
    
                    // 活动类型
                    activityType:this.formData.activityType,  
                    /**发起者设置 */
                    // 发起者好友助力满次
                    helpNumber:this.formData.helpNumber,
                    // 可获赠件
                    giftNumber:this.formData.giftNumber,
                    // 发起者获赠奖品  1,优惠 2赠品
                    giftPrize:this.formData.giftPrize,
                    // 发起者重复发起 1,是 2，否
                    isRepeat:this.formData.isRepeat,
                    // 发起者单用户最多发起次
                    memberNumber:this.formData.memberNumber,
                    // 发起者优惠券或赠品ID
                    shareMapinitiate:this.formData.shareMapinitiate,
                     /**助力者设置 */
                    // 助力者重复助力 1,可以 2,不可以
                    isHelp:this.formData.isHelp,
                    // 最多重复助力次数
                    repeatNumber:this.formData.repeatNumber,
                    // 助力有奖 1,有 2，无
                    isPrize:this.formData.isPrize,
                     powerNumber:this.formData.powerNumber,
                    // 助力获赠件数,
                    powerGiven:this.formData.powerGiven,
                    // 助力者获赠奖品   1,优惠  2,赠品
                    helpPrize:this.formData.helpPrize,
                    // 助力者 优惠券或赠品ID
                    sharehelp:this.formData.sharehelp,
                    /* 内容设置*/
                    // 发起者图片
                    initiatorImage:this.formData.initiatorImage,
                    // 活动规则
                    activityRule:this.formData.activityRule,
                    // 分享图片
                    shareImage:this.formData.shareImage,
                    // 助力者图片
                    powerImage:this.formData.powerImage,
                    // 分享标题
                    shareTitle:this.formData.shareTitle,
                    // 背景图片
                    bgimage:this.formData.bgimage,
                    buttonText:this.formData.buttonText,
                    topPicture:this.formData.topPicture,
                    // 轮播图
                    shufflingPicture:this.formData.shufflingPicture,
                    // 底部广告图
                    bottomPicture:this.formData.bottomPicture,
                    // 按钮颜色
                    buttonColor:this.formData.buttonColor,
                    // 文字颜色
                    textColor:this.formData.textColor   
                })
                .then(res => {
                    if(res.code==1){
                        this.gotolink()
                    }
                    else{
                        this.$Message.error(res.message)
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            },
            //编辑获取数据表单数据绑定
            shareDetailfuc:function(ID){
                
                marking.shareDetail({
                   id:ID
                })
                .then(res => {
                    if(res.code==1){
                        console.log("数据----------------------------",res.data)
                        let data=res.data
                        this.formData.activityName=data.activityName,
                        this.formData.activityTime=data,
                        this.formData.activityTime = [],
                        this.formData.activityTime.push(utils.timeFun(utils.timeStamp(data.activitystartTime)));
                        this.formData.activityTime.push(utils.timeFun(utils.timeStamp(data.activityendTime)));
                
                        this.formData.startEnd=[],
                        this.formData.startEnd.push(data.startTime),
                        this.formData.startEnd.push(data.endTime),
                        this.formData.channels=String(data.channels),
                        this.formData.activityType=String(data.activityType),
                        this.formData.helpNumber=data.helpNumber,
                        this.formData.giftNumber=data.giftNumber,
                        // 发起者获赠奖品 1,优惠 2赠品
                        this.formData.giftPrize=String(data.giftPrize),
                        this.weekdayList=data.weekday.split(","),
                        console.log("this.weekdayList-----------",this.weekdayList)
                        this.formData.isRepeat=String(data.isRepeat),
                        this.formData.memberNumber=data.memberNumber,
                        this.formData.shareMapinitiate=data.shareMapinitiate,
                        this.formData.isHelp=String(data.isHelp),
                        this.formData.repeatNumber=data.repeatNumber,
                        this.formData.isPrize=String(data.isPrize),
                        this.formData.powerNumber=data.powerNumber,
                        // 助力获赠件数,
                        this.formData.powerGiven=data.powerGiven,
                        this.formData.helpPrize=String(data.helpPrize),
                        this.formData.sharehelp=data.sharehelp,
                        this.formData.initiatorImage=data.initiatorImage,
                        this.formData.activityRule=data.activityRule,
                        this.formData.shareImage=data.shareImage,
                        this.formData.powerImage=data.powerImage,
                        this.formData.shareTitle=data.shareTitle,
                        this.formData.bgimage=data.bgimage,
                        
                        this.formData.buttonText=data.buttonText,
                        
                        this.formData.topPicture=data.topPicture,
                        // 轮播图
                        this.formData.shufflingPicture=data.shufflingPicture.split(","),
                        // 底部广告图
                        this.formData.bottomPicture=data.bottomPicture,
                        // 按钮颜色
                        this.formData.buttonColor=data.buttonColor,
                        // 文字颜色
                        this.formData.textColor=data.textColor  
                        if(data.giftPrize==1){
                            this.dataSponsor(data.sharemapList)
                        }
                        if(data.helpPrize==1){
                            this.dataHelp(data.sharemapList2) 
                        }
                        this.viewModel(
                            utils.timeFun(new Date(data.activitystartTime).getTime()),
                            utils.timeFun(new Date(data.activityendTime).getTime())
                        );
                        if(data.status==1){
                            this.status=true
                        }
                        else{
                            this.status=false
                        }
                        
                    }
                    else{
                        this.$Message.error(res.message)
                    }
              
                })
                .catch(error => {
                    console.log(error)
                });
            },
            // 页面跳转
            gotolink:function(){
                this.$router.push({
                    path: "/@/views/appliedmanagement/helpshare/helpshare"
                });
            },

            // 发起者设置优惠券
            dataSponsor:function(data){   
                console.log("dataChangefuc--------------",data)
                let arr=[]
                for(let i in data){
                    arr.push(data[i].winningId)
                }
                marking.AllcouponDetail({
                    id:arr
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
                            this.showgiftPrize=arr
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            // 删除背景图片
            deletebgimage:function(){
                this.formData.bgimage=""
            },
            // 删除顶部广告图
            deletetopPicture:function(){
                this.formData.topPicture=""
            },
            // 删除底部广告图
            deletebottomPicture:function(){
                this.formData.bottomPicture=""
            },  
            deleteshufflingPicture:function(index){
                this.visibility=false
                this.formData.shufflingPicture.splice(index,1)
                this.$nextTick(() => {
                    this.visibility=true
                })   
            }, 
            // 助力者设置优惠券
            dataHelp:function(data){
                console.log("dataChangefuc--------------",data)
                let arr=[]
                for(let i in data){
                    arr.push(data[i].winningId)
                }
                marking.AllcouponDetail({
                    id:arr
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
                        this.showhelpPrize=arr
                    }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            swiperfuc:function(){
               console.log("1")
            }
        },
        
        
        
        watch: {
            'formData.shufflingPicture':'swiperfuc',
            $route: "fetchData"
        }
    }
</script>
<style lang="less" scoped>   
    .addhelpshare{
        width: 100%;
        .formtab{
            width: 100%;
            .formtab_title{
                widows: 100%;
                padding:8px 10px;
                font-size: 14px;
                background-color: rgb(242,242,242);
            }
            .formtab_content{
                padding-top: 20px;
                  &::after{
                                clear:both;
                                content:'';
                                display:block;
                                width:0;
                                height:0;
                                visibility:hidden; 
                            }  
                .options{
                    color: rgb(0, 114, 198);
                    cursor: pointer;
                }
                .remark_div{
                    color: rgb(153, 153, 153)
                }
                .condition{
                    width: 100%;
                    margin-bottom: 24px;
                    &::after{
                        clear:both;
                        content:'';
                        display:block;
                        width:0;
                        height:0;
                        visibility:hidden; 
                    }
                    .condition_title{
                        float: left;
                   
                    
                        padding: 10px 12px 10px 0;
                        width:100px;
                        text-align: right;
                    }
                    .condition_content{
                        float: left;
                        height: 32px;
                        .condition_item{
                            float: left;   
                            margin-top: 5px; 
                            .ivu-input-wrapper{
                                margin: 0 10px;
                            }
                            .ivu-form-item{
                                margin-bottom: 0;
                            }
                        }
                        &::after{
                            clear:both;
                            content:'';
                            display:block;
                            width:0;
                            height:0;
                            visibility:hidden; 
                        }
                    }
                }
                .basicset{
                    width: 946px;
                    overflow: hidden;
                    padding-bottom: 20px;
                    .basic_img{
                        width: 406px;
                        float: left;
          
                        .basic_img_bg{
                            margin-left: 55px;
                            width: 292px;
                            min-height: 522px;
                            text-align: center;
                            position: relative;
                           
                           
                            .bgmsg_ps{
                                color: #33CCFF;
                                width: 100%;
                                position: absolute;
                                height: 50px;
                                line-height: 50px;
                                top:200px; 
                                z-index: 20;
                            }
                            .basicset_tit{
                                position: absolute;
                                height: 50px;
                                width: 290px;
                                top: 0;
                                left: 0;
                                border-top: 1px solid rgb(174, 174, 174);
                                border-left: 1px solid rgb(174, 174, 174);
                                border-right: 1px solid rgb(174, 174, 174);
                                img{
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .basicset_con{
                                min-height: 420px;
                                width: 290px;
                                position: absolute;
                                top:50px;
                                border-bottom: 1px solid rgb(174, 174, 174);
                                border-left: 1px solid rgb(174, 174, 174);
                                border-right: 1px solid rgb(174, 174, 174);
                                background-color: rgb(237,248, 252);
                                .basicset_content{ 
                                    min-height: 390px;
                                    z-index: 20;
                                    width: 260px;
                                    margin-top:15px;
                                    margin-left: 15px;
                                    margin-bottom: 15px;
                                    .topPicture{
                                        width: 260px;
                                        height: 390px;
                                        img{
                                            width: 100%;
                                            height: 100%;
                                        }
                                    }
                                    .shufflingPicture{
                                        width: 260px;
                                        height: 240px;
                                        .swiper_btn{
                                            width: 25px;
                                            height: 17px;
                                        }
                                        img{
                                            width: 260px;
                                            height: 240px;
                                        }
                                    }
                                    .activerule{
                                        height: 45px;
                                        line-height: 45px;
                                        cursor: pointer;
                                        text-decoration: underline;
                                        color: #fff;
                                    }
                                    .bottomPicture{
                                        width: 260px;
                                        height: 390px;
                                        img{
                                            width: 100%;
                                            height: 100%;
                                        }
                                    }
                                }

                                .sharebutton{
                                    height: 45px;
                                    line-height: 45px;
                                    background: #000;
                                    text-align: center;
                                    cursor: pointer;
                                    color: #fff;
                                }
                            }
                        }
                    }
                    .basic_msg{
                        width: 540px;

                        float: left;
                        .msg_item{
                            &::after{
                                clear:both;
                                content:'';
                                display:block;
                                width:0;
                                height:0;
                                visibility:hidden; 
                            }
                            margin-bottom: 20px;
                            .msg_title{
                                width: 100px;
                                float: left;
                            }
                            .msg_content{
                                width: 440px;
                                float: left;
                                .msg_content_btn{   
                                    overflow: hidden;
                                    .msg_content_l{
                                        float: left;
                                        width: 100px;
                                    }
                                    .msg_content_r{
                                        float: left;
                                        width: 340px;
                                        height: 38px;
                                        line-height: 18px;
                                        font-size: 10px;
                                        color: #999999;
                                    }
                                }
                                .shuffling_bg{   
                                    ::after{
                                        clear: both;
                                        content: ''
                                    } 
                                    div{
                                        margin-top: 15px;
                                        width: 128px;
                                        height: 100px;
                                        float: left;
                                        margin-right: 15px;
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
                                            position: absolute;
                                            top: 0;
                                            right: 0;
                                            width: 100%;
                                            height: 100%;
                                        }
                                    }
                                }
                                .msgimg_bg{
                                    margin-top: 10px;
                                    width: 128px;
                                    height: 223px;
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
                                        position: absolute;
                                        top: 0;
                                        right: 0;
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                        }
                    }
                }
                .imgsel_item{
                    &::after{
                            clear:both;
                            content:'';
                            display:block;
                            width:0;
                            height:0;
                            visibility:hidden; 
                        }
                    .imgsel{
                        width: 325px;
                        overflow: hidden;
                        margin: 20px;
                        float: left;
                        .imgsel_title{
                            width: 125px;
                            float: left;
                            text-align: right;
                            padding-right: 15px;
                        }
                        .imgsel_con{
                            width: 200px;
                            float: left;
                            .imgsel_btn{
                                .ivu-btn{
                                    vertical-align: bottom;
                                }
                                .remark_span{
                                    font-size: 12px;
                                    color: #999999;
                                }
                            }
                            .imgsel_bg{
                                width: 130px;
                                height: 100px;
                                margin-top: 10px;
                                border: 1px solid rgb(228, 228, 228);
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                    }
                }
                
            }
        }
        .mask{
            width: 100%;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 99;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .time-set {
                width: 700px;
                height: 270px;
                border: 1px solid #aeaeae;
                background: #fff;
                .set-title{
                    padding: 8px;
                    font-size: 14px;
                    background: #0083b0;
                    color: #fff;
                    position: relative;
                    .close {
                        position: absolute;
                        right: 0;
                        top: 0;
                        padding: 8px 18px;
                        text-align: center;
                        background: rgba(0, 0, 0, 0.4);
                        cursor: pointer;
                    }
                }
                .choose-week{
                    border-bottom: 1px solid #aeaeae;
                    padding: 30px 0 0 0;
                    .bgColor {
                        background: #0083b0;
                        color: #fff;
                    }
                    .star{
                        color: red;
                    }
                }
                .week-btn{
                    width: 70px;
                    margin-right: 10px;
                }
                .formBtn {
                    width: 150px;
                    margin: 0 auto;
                    margin-top: 30px;
                    text-align: center;
                    .comBtn {
                        margin: 0 5px;
                    }
                }
            }
        }
    }
</style>