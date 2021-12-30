<template>
    <div id="basic-info">
        <!-- 商品的基本信息 -->
        <div class="basic-info-child">
            <h3 class="title">基本信息</h3>
            <div class="basic-content">
                <div class="content-war">
                    <span class="content-war-span">商品排序</span>
                    <!-- @on-change="displayOrderFun" -->
                    <Input v-model="info.displayOrder" placeholder="商品排序" style="width: 260px"/>
                    <p>数字越大，排名越靠前，如果为空，默认排序方式为创建时间。</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">商品名称<i style="color:red;">*</i></span>
                    <Input v-model="info.title" :maxlength="60" placeholder="商品名称" style="width: 400px" />
                    <span>{{info.title.length}}</span>
                    <p>商品名称最长60个字符,30个汉字</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">副标题</span>
                    <Input v-model="info.subTitle" placeholder="副标题"  style="width: 300px" :maxlength="40"/>
                    <p>副标题的长度请控制在20字以内。</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">英文副标题</span>
                    <Input v-model="info.englishSubTitle" placeholder="英文副标题"  style="width: 300px" />
                </div>
                <div class="content-war">
                    <span class="content-war-span">关键字</span>
                    <Input v-model="info.keyword" placeholder="关键字"  style="width: 300px" />
                    <p>商品关键字,能准确搜到商品的,比如 : 海尔电视;电视 之类,多关键字以半角分号";"间隔</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">商品类型</span>
                    <RadioGroup v-if="role == '0'" v-model="info.type">
                        <Radio label='1'>实体商品</Radio>
                        <Radio label='3'>赠品</Radio>
                        <Radio disabled label='4'>规则商品</Radio>
                        <Radio disabled label='5'>套餐商品</Radio>
                    </RadioGroup>
                    <RadioGroup v-if="role != '0' && info.type == '1'" v-model="info.type">
                        <Radio label='1'>实体商品</Radio>
                        <Radio disabled label='3'>赠品</Radio>
                        <Radio disabled label='4'>规则商品</Radio>
                        <Radio disabled label='5'>套餐商品</Radio>
                    </RadioGroup>
                    <RadioGroup v-if="role != '0' && info.type == '3'" v-model="info.type">
                        <Radio disabled label='1'>实体商品</Radio>
                        <Radio label='3'>赠品</Radio>
                        <Radio disabled label='4'>规则商品</Radio>
                        <Radio disabled label='5'>套餐商品</Radio>
                    </RadioGroup>
                    <RadioGroup v-if="role != '0' && info.type == '4'" v-model="info.type">
                        <Radio disabled label='1'>实体商品</Radio>
                        <Radio disabled label='3'>赠品</Radio>
                        <Radio disabled label='4'>规则商品</Radio>
                        <Radio disabled label='5'>套餐商品</Radio>
                    </RadioGroup>
                    <RadioGroup v-if="role != '0' && info.type == '5'" v-model="info.type">
                        <Radio disabled label='1'>实体商品</Radio>
                        <Radio disabled label='3'>赠品</Radio>
                        <Radio disabled label='4'>规则商品</Radio>
                        <Radio disabled label='5'>套餐商品</Radio>
                    </RadioGroup>
                    <p>商品类型，商品保存后无法修改，请谨慎选择</p>
                </div>
            </div>
        </div>
        <!-- 商品信息 -->
        <div class="goods-info">
            <h3 class="title">商品信息</h3>
            <div class="basic-content">
                <div class="goods-sort content-war">
                    <span class="content-war-span" style="vertical-align: top;">商品分类</span>
                        <div style="display: inline-block;width: 500px;">
                            <!-- @deselect="delOption"
                                @input="selectClass" -->
                            <treeselect
                                v-model="info.categoryId" 
                                :multiple="true"
                                :searchable="false"
                                noOptionsText="暂无分类"
                                placeholder="选择商品分类"
                                @deselect="delOption"
                                @input="selectClass"
                                :options="classOption" ></treeselect>
                        </div>
                </div>
                <div class="content-war">
                    <span class="content-war-span">商品价格<i style="color:red;">*</i></span>
                    <Input v-model="info.price" style="width: 120px"/>&nbsp;元，原价
                    <Input v-model="info.originalCost" style="width: 120px"/>&nbsp;元，成本价
                    <Input v-model="info.costPrice" style="width: 120px"/>&nbsp;元
                    <p>推荐商品时所使用价格的显示</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">推荐商品图片</span>
                    <div class="but">
                        <!-- thumb 这个没写 -->
                        <img-select @listentoptpmfile="recommendFun" v-if="info.thumb == ''"/>
                    </div>
                    <div class="image-area">
                        <!-- 方法还没定 -->
                        <ul class="banner-img" v-if="info.thumb != ''">
                            <li>
                                <img :src="info.thumb" width="100" height="100">
                                <div @click="removeThumb"><Icon type="ios-close-circle" /></div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="content-war">
                    <span class="content-war-span">通用轮播图片</span>
                    <div class="but">
                        <img-select  @listentoptpmfile="bannerFun" :options="{type: 'multiimage'}"/>
                    </div>
                    <div class="image-area">
                        <!-- 方法还没定 -->
                        <ul class="banner-img">
                            <draggable :list="info.thumbs">
                                <li v-for="(file,index) in info.thumbs" :key="index">
                                    <img :src="file" width="100" height="100">
                                    <div @click="removeThumbs(index)"><Icon type="ios-close-circle" /></div>
                                </li>
                            </draggable>
                        </ul>
                    </div>
                    <p>建议尺寸：750*750像素，轮播图可以拖拽图片调整顺序，最多上传9张，图片大小依照首张轮播图尺寸显示</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">首页视频</span>
                    <div class="but">
                        <videoTel v-if="info.video == ''" @listentoptpmfile="videoFun" />
                        <div v-if="info.video != ''" class="video-box">
                            <video controls="controls" :src="info.video" preload="auto" width="120px" height="80px"></video>
                            <div @click="removeVideo(index)"><Icon type="ios-close-circle" class="del-icon"/></div>
                        </div>
                    </div>
                </div>
                <div class="content-war">
                    <span class="content-war-span">库存扣减</span>
                    <div class="video area-war">
                        <RadioGroup v-model="info.stockCnf">
                            <Radio label='0'>拍下立即减库存</Radio>
                            <Radio label='1'>付款减库存</Radio>
                            <Radio label='2'>永不减库存</Radio>
                        </RadioGroup>
                    </div>
                </div>
                <div class="content-war">
                    <span class="content-war-span">已售出数</span>
                    <div class="video area-war">
                        <Input v-model="info.vituralSales" placeholder="已售" style="width: 300px" />件
                    </div>件
                    <Checkbox v-model="info.isShowSalesCount">显示销量</Checkbox>
                </div>
            </div>
        </div>
        <!-- 商品属性 -->
        <div class="goods-attr">
            <h3 class="title">商品属性</h3>
            <div class="basic-content">
                <div class="content-war">
                    <span class="content-war-span">单品满件包邮</span>
                    满&nbsp;<Input v-model="info.ednum" style="width: 100px"/>&nbsp;件包邮
                    <p>如果设置0或空，则不支持满件包邮</p>
                </div>
                <div class="content-war">
                    <span class="content-war-span">单品满额包邮</span>
                    满&nbsp;<Input v-model="info.edmoney" style="width: 100px"/>&nbsp;元包邮
                    <p>如果设置0或空，则不支持满额包邮</p>
                </div>
                <div class="content-war">
                    <span>不参与单品包邮地区</span>
                    <!-- 显示区域 -->
                    <p class="add-long-p">
                        <span class="area-span" v-for="(item, index) in info.edareas" :key="index">{{item}}</span>
                    </p>
                    <br>
                    <!-- 添加地区 -->
                    <!-- <Button class="area" type="primary" @click="addArea">添加地区</Button> -->

                    <Button class="area" type="primary" @click="openAreaFun">添加地区</Button>
                    <Modal v-model="isShowAreaModel" title="选择区域" :mask-closable="false" :scrollable="false" @on-ok="conArea" @on-cancel="cancelArea">
                        <div class="area-wrapper">
                            <areaMultiSelection ref="areaRef" @areaDataFun="stateCon" :AreaData="info.edareas" />
                        </div>
                    </Modal>

                    <!-- 添加地区的弹出框 -->
                    <!-- <area-tel v-if="addAreaBol" :edareas="info.edareas" :addAreaBol="addAreaBol" @stateCon="stateCon" @choiceFun='choiceFun' /> -->
                </div>
            </div>
            <div class="content-war">
                <span class="content-war-span" style="verticalAlign: top;">运费设置</span>
                 <RadioGroup v-model="info.dispatchStatus">
                    <Radio label='0'>运费模板</Radio>
                    <Select v-model="info.templateId" style="width:200px;margin-left: 20px;">
                        <Option v-for="item in info.freightModule" :value="item.id" :key="item.value">{{ item.name }}</Option>
                    </Select>
                    <p style="margin: 10px 0;">如果开启了同城配送，系统优先使用同城配送方式，如果未开启同城配送或者超出同城配送范围则使用普通快递方式计算运费</p>
                    <Radio label='1'>统一邮费</Radio>
                    <!-- type="number" -->
                    <Input v-model="info.uniformPostagePrice" style="width: 100px;margin-left: 20px;"/>&nbsp;元
                    <p style="margin: 10px 0;">如果开启了同城配送，同城运费根据统一邮费进行计算</p>
                </RadioGroup>
            </div>
            <div class="content-war">
                <span class="content-war-span">是否付邮使用</span>
                <RadioGroup v-model="info.payByPost" @on-change="upperTimeFun">
                    <Radio label='1'>是</Radio>
                    <Radio label='0'>否</Radio>
                </RadioGroup>
            </div>
            <div class="content-war">
                <span class="content-war-span">发票</span>
                <Checkbox v-model="info.isInvoiceSupport">支持</Checkbox>
            </div>
            <div class="content-war">
                <span class="content-war-span">上架</span>
                <RadioGroup v-model="info.isPutaway" @on-change="upperFun">
                    <div>
                        <Radio label='0'>否</Radio>
                        <Radio label='1'>上架</Radio>
                    </div>
                </RadioGroup>
            </div>
            <div v-if="info.isPutaway != '0'" class="content-war">
                <span class="content-war-span"></span>
                <div style="display: inline-block;">
                    <Checkbox true-value="微信小程序" false-value="" v-model="info.putawayType">微信小程序</Checkbox>
                </div>
            </div>
        </div>
        <div class="content-war" v-if="info.isPutaway != '0'">
            <span class="content-war-span">是否定时上架</span>
            <RadioGroup v-model="info.isPutawayTime" @on-change="upperTimeFun">
                <Radio label='1'>是</Radio>
                <Radio label='0'>否</Radio>
            </RadioGroup>
            <p>商品将在该选择时间自动上架</p>
        </div>
        <div class="content-war"  v-if="info.isPutaway != '0' && info.isPutawayTime == '1'">
            <span class="content-war-span">定时上架时间</span>
            <div class="display-in-blo upper-shelf-time">
                <Row>
                    <Col span="20">
                        <!-- 只有上架时间,没有下架时间v-model="info.putawayTime" -->
                        <!-- @on-change="upperChange" -->
                        <DatePicker
                            v-model="info.putawayTime"
                            :options="optionsTime"
                            :editable="false"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss" 
                            placement="bottom-end" 
                            placeholder="上架时间"
                            style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>
        </div>
        <div class="content-war">
            <span>主商城搜索结果是否显示</span>
            <RadioGroup v-model="info.searchShow">
                <Radio label='1'>显示</Radio>
                <Radio label='0'>隐藏</Radio>
            </RadioGroup>
            <p>隐藏后,在主商城搜索结果中,将不会显示该商品</p>
        </div>
        <div class="content-war">
            <span class="content-war-span">是否支持退换货</span>
            <RadioGroup v-model="info.isSales">
                <Radio label='1'>是</Radio>
                <Radio label='0'>否</Radio>
            </RadioGroup>
        </div>
        <div class="content-war">
            <span class="content-war-span">确认收货时间</span>
            发货后&nbsp;<Input style="width: 100px" v-model="info.cargoTime" />&nbsp;天
            <p>0读取系统设置 -1为不自动收货</p>
        </div>
    </div>
</template>

<script>
import goods from '@/api/request/goods'
// 上传图片
import ImgSelect from '@/components/imgSelect/imgselect'
// 引入视频组件
import videoTel from '@/components/videoSelect/videoselect'
// 引入分类
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// 地区包邮组件
import areaMultiSelection from '@/components/area/area0'
import draggable from "vuedraggable";
export default {
    props: ['info','role','classOption'],
    data() {
        return {
            // basicInfo: {
            // input 显示隐藏
            eyeType: 'text',
            eyeBlo: true,
            // 添加地址弹出框
            isShowAreaModel: false,
            
            // 图片上传弹出框
            // imgPop: true,
            // classOption: [],
            optionsTime: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            }
        }
    },
    components: {
        ImgSelect,
        areaMultiSelection,
        Treeselect,
        draggable,
        videoTel
    },
    created(){
        // this.oneClassFun()
    },
    methods: {
        // 图片选择的方法
        recommendFun(data) {
            console.log('我是推荐',data)
            this.info.thumb = data[0].imgAddress
        },
        bannerFun(data) {
            console.log('我是轮播',data)
            console.log(this.info.thumbs.length);
            for(let i = 0; i < data.length; i++) {
               if(this.info.thumbs.length > 8){
                    this.$Message.error('轮播最多9张图片')
                    return
               }
               this.info.thumbs.push(data[i].imgAddress)
            }
        },
        videoFun(data) {
            console.log(data)
            this.info.video = data[0].imgAddress
            // for(let i = 0; i < data.length; i++) {
            //     if(this.info.video.length >= 1){
            //         return
            //    }
            //    this.info.video.push(data[0].imgAddress)
            // }
            // this.info.video = data[0].imgAddress
        },
        // 商品的分类
        // oneClassFun() {
        //     let res = {}
        //     goods.goodsOneClass({}).then(res => {
        //         console.log('饿啊法尔范啊额',res)
        //         res.forEach(item => {
        //             res.id = item.id
        //             res.label = item.name
        //             this.classOption.push(res)
        //             res = {}
        //         });
        //         // this.classOption = res
        //     }).catch(err => {
        //         console.log('详情分类的',err)
        //     })
        // },

        // twoClassFun(index) {
        //     console.log(index)
        // },
        // twoClassFun(index) {
        //     console.log(index)
        // },
        // 商品类的显示
        moreClass(num) {
            return 'more '+ num;
        },
        // 推荐商品图
        removeThumb(index) {
            // this.info.thumb.splice(index,1)
            this.info.thumb = ''
            console.log('空的',this.info.thumb)
        },
        // 删除轮播图片
        removeThumbs(index) {
            this.info.thumbs.splice(index,1)
        },
        // 删除视频
        removeVideo(index) {
            this.info.video = ''
        },

        delVideo(index) {
            console.log(index)
        },
        // 添加地区
        // addArea() {
        //     // console.log(this.addAreaBol)
        //     this.addAreaBol = true
        // },
        openAreaFun() {
            this.isShowAreaModel = !this.isShowAreaModel
            this.$refs.areaRef.checklist()
        },
        // 添加地区的子组件的确定
        stateCon(value) {
            // 接收了数据进行显示
            console.log(value.name,'地址传递过来的数据')
            this.info.edareas = value.name
        },
        conArea() {
            console.log('地区点击了确认')
            this.$refs.areaRef.transmitArea()
            // this.isShowAreaModel = !this.isShowAreaModel
        },
        cancelArea() {
            // 地址取消的方法清空数据
            this.$refs.areaRef.transmitCanArea()
            // this.isShowAreaModel = !this.isShowAreaModel
        },  
        // 地址取消的方法
        // choiceFun(bol) {
        //     console.log('取消',bol)
        //     this.addAreaBol = bol
        // },
        // 上架时间的方法
        // upperChange(index) {
        //     console.log('我是上架时间的时间',index)
        //     this.info.putawayTime = index
        // },
        // 上架的处理
        upperFun() {
            console.log(this.info.isPutaway)
            if(this.info.isPutaway == '0'){
                this.info.isPutawayTime = '0'
                this.info.putawayTime = ''
            }
        },
        // 上架时间
        upperTimeFun() {
            if(this.info.isPutawayTime == '0') {
                this.info.putawayTime = ''
            }
        },
        delOption(value,index){
            let _this = this
            console.log(value,index)
            console.log(_this.info.categoryId)
            _this.info.categoryId ? _this.info.categoryId.map((v,i) => {
                if(value.id == v){
                    _this.info.categoryId.splice(i,1)
                }
            }) : []
        },
        selectClass(value) {
            console.log('value',value)
            
            let res = value.filter((v,i)=>{
                console.log('vvvvvvvvvv',(v))
                return v != value[i+1] + ''
            })
            this.info.categoryId = res
            console.log('zuihou de',this.info.categoryId)
        },
        // displayOrderFun(e) {
        //     console.log(e.srcElement.value)
        //     if (e.srcElement.value.length >= 4) {
        //         this.info.displayOrder = 9999
        //     }
        // }
    }
}
</script>

<style scoped>
@import'./index.css'
</style>
