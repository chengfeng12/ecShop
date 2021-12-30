<style lang="less" scoped>
@import './AddMeal.less';
</style>
<template>
    <div id="add-rule-goods">
        <imgSelect ref="imgSelect" :options="recImgOptions" v-on:listentoptpmfile="changeImg"></imgSelect>
        <div class="currentTitle">
            套餐商品/{{role == 1 ? '添加' : role == 2 ? '复制' : '编辑'}}套餐商品
        </div>
        <Card>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="150">
                <FormItem label="套餐类型">
                    <RadioGroup v-model="formInline.range" prop="mealtype" class="radioColumn">
                        <Radio label="1">
                            <span class="radiotitle">自组套餐</span>
                            <div class="radiocontent">以自组方式，选择所需商品完成套餐商品组合购买，可单选或多选自组套餐商品，以组合价格完成购买的套餐商品。<br>
自组套餐库存以套餐所包含单品的实际库存为准，当套餐包含的某单品规格库存不足则该规格单品自动售罄，如所有单品均库存不足，该套餐自动售罄。</div>
                        </Radio>
                        <Radio label="2">
                            <span class="radiotitle">固定套餐</span>
                            <div class="radiocontent">固定组合套餐商品，以固定的规格及价格完成购买的套餐商品。<br>
固定套餐库存以设置的虚拟库存为准，当套餐包含的单品库存不足该套餐自动售罄。</div>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="套餐名称" prop="title" style="position:relative;">
                    <Input type="text" v-model="formInline.title" @on-change="validTitle" style="width: 350px;" placeholder="请输入套餐名称"></Input>
                    <span class="limitLength">{{titleLength}}/30</span>
                </FormItem>
                <FormItem label="推荐商品图片" prop="recImg">
                    <div v-if="formInline.recImg" class="imgBox">
                        <img :src="formInline.recImg" class="recImg" alt="">
                        <div class="changeImg" @click="addRecImg('recImg')">更换图片</div>
                    </div>
                    <div v-else>
                        <Button @click="addRecImg('recImg')" type="primary">+选择图片</Button>
                    </div>
                </FormItem>
                <FormItem label="轮播图" prop="bannerImg">
                    <Button @click="addRecImg('bannerImg')" type="primary">+选择图片</Button>
                    <draggable v-model="formInline.bannerImg" v-bind="dragOptions">
                        <transition-group type="transition" class="flex-wrap">
                            <div class="bannerbox" v-for="(item,index) in formInline.bannerImg" :key="index">
                                <img :src="item.imgAddress" class="bannerImg" alt="">
                                <Icon class="iconClose" type="ios-close-circle" @click="deleteImg(index)" />
                            </div>
                        </transition-group>
                    </draggable>
                    <div class="radioCont">建议尺寸：750*750像素，轮播图可以拖拽图片调整顺序，最多上传10张，图片大小依照首张轮播图尺寸显示</div>
                </FormItem>

                <FormItem label="分类图 | 订单图片" prop="smallpic">
                    <div v-if="formInline.smallpic" class="imgBox">
                        <img :src="formInline.smallpic" class="recImg" alt="">
                        <Input class="hideInput" type="text" v-model="formInline.smallpic" style="width: 350px;"></Input>
                        <div class="changeImg" @click="addRecImg('smallpic')">更换图片</div>
                    </div>
                    <div v-else>
                        <Button @click="addRecImg('smallpic')" type="primary">+选择图片</Button>
                    </div>
                </FormItem>
                <FormItem label="指定商品" prop="mealsRange" v-if="formInline.range == 1">
                    <couponAddgoodPrice
                        @listentgoodData="listentgoodDatafucMeal($event)"
                        :optionss="showDataMeal"
                    ></couponAddgoodPrice>
                </FormItem>

                <FormItem label="指定商品" prop="goodsRange" v-if="formInline.range == 2">
                    <couponAddgood
                        @listentgoodData="listentgoodDatafuc($event)"
                        :options="showData"
                    ></couponAddgood>
                </FormItem>

                <div class="inputSpe" v-if="formInline.range == 2">
                    <FormItem label="套餐价格" prop="price">
                        <div>
                            <Input type="text" style="width:150px;" v-model="formInline.price" placeholder="请输入价格"></Input>
                            <span>元， </span>
                        </div>
                    </FormItem>
                    <FormItem label="原价" prop="originPrice">
                        <div>
                            <Input type="text" style="width:150px;" v-model="formInline.originPrice" placeholder="请输入原价"></Input>
                            <span>元， </span>
                        </div>
                    </FormItem>
                    <FormItem label="成本价" prop="costPrice">
                        <div>
                            <Input type="text" style="width:150px;" v-model="formInline.costPrice" placeholder="请输入成本价"></Input>
                            <span>元</span>
                        </div>
                    </FormItem>
                </div>
                
                <FormItem label="有效时间">
                    <DatePicker v-model="formInline.rangeTime" type="daterange" placement="bottom-start" placeholder="请选择有效日期" style="width: 200px"></DatePicker>
                </FormItem>

                <FormItem label="套餐启用">
                    <RadioGroup v-model="formInline.status">
                        <Radio label="1">启用</Radio>
                        <Radio label="2">禁用</Radio>
                    </RadioGroup>
                </FormItem>
                
                <FormItem>
                    <Button type="primary" class="comBtn" :loading="loading" @click.native="save('formInline')">保存</Button>
                    <Button type="default" class="comBtn" @click="prev()">返回列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import marking from '@/api/request/marking'
import imgSelect from '@/components/imgSelect/imgSelect'
import goodsUtils from "@/utils/goodsUtils"
import couponAddgood from "@/components/couponAddgood/couponAddgood";
import couponAddgoodPrice from "@/components/couponAddgoodPrice/couponAddgoodPrice";
import draggable from "vuedraggable";

export default {
    components: {
      couponAddgood,
      imgSelect,
      draggable,
      couponAddgoodPrice
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        }
    },
    data() {
        return {
            loading:false,
            titleLength:0,
            role: '',
            id: '',
            currentType:'',
            bannerValidate:'',
            formInline: {
                title: '',
                price: '',
                originPrice:'',
                costPrice:'',
                range:'1',
                mealsRange:[],
                recImg:'',
                bannerImg:[],
                smallpic:'',
                rangeTime:[],
                status:'1',
                goodsRange:[]
            },
            recImgOptions:{
                type:"image",
                mode:"diy"
            },
            
            ruleInline: {
                mealtype:[
                    { required: true, message: '请选择套餐类型', trigger: 'blur' },
                    { 
                        type: 'string', 
                        min: 1, 
                        message: '请选择套餐类型', 
                        trigger: 'blur'
                    }
                ],  
                recImg:[
                    { required: true, message: '请添加推荐商品图片'}
                ],
                bannerImg:[
                    { required: true, message: '请添加轮播图',type: 'array', min: 1, trigger: 'change' },
                ],
                smallpic:[
                    { required: true, message: '请添加分类图 | 订单图片'}
                ],
                title: [
                    { required: true, message: '请添加商品名称', trigger: 'blur' },
                    { 
                        type: 'string', 
                        min: 1, 
                        message: '请输入商品名称', 
                        trigger: 'blur'
                    }
                ],
                price: [
                    { required: true, message: '请输入套餐价格', trigger: 'blur' },
                    { 
                        type: 'string',
                        message: '请输入套餐价格', 
                        trigger: 'blur'
                    },{
                        pattern: /^\d+(\.\d+)?$/,
                        message: '请输入正数', 
                        trigger: 'blur'
                    }
                ],
                originPrice:[
                    { required: false },
                    {
                        pattern: /^\d+(\.\d+)?$/,
                        message: '请输入正数', 
                        trigger: 'blur'
                    }
                ],
                costPrice:[
                    { required: false},
                    {
                        pattern: /^\d+(\.\d+)?$/,
                        message: '请输入正数', 
                        trigger: 'blur'
                    }
                ],
                mealsRange:[
                    {
                        required:true, message:'请选择指定商品'
                    }
                ],
                goodsRange:[
                    {
                        required:true, message:'请选择指定商品'
                    }
                ]
            },
            showData: [],
            showDataMeal: [],
        }
    },
    activated() {
        console.log('123123123')
        let role = this.$route.query.role
        let id = this.$route.query.id
        this.role = role
        this.id = id
        this.restore()
        if (role > 1) {
            this.getData()
        }
    },
    methods: {
        getData() {
            marking.mealGoodsDetail({
                id: this.id
            }).then(res => {
                if (res.code == 1) {
                    let bannerImgs = res.data.byPicture ? res.data.byPicture.split(',').map((v,i) => {
                        return {
                            imgAddress:v
                        }
                    }) : []
                    let formInline = {
                        title: res.data.packageName,
                        range: res.data.packageType + '',
                        recImg: res.data.picture,
                        bannerImg: bannerImgs,
                        smallpic: res.data.orderPicture,
                        rangeTime: [res.data.startingTime,res.data.endTime],
                        status: res.data.status + '',
                    }
                    if(res.data.packageType == 1){
                        formInline = {
                            ...formInline,
                            mealsRange: res.data.PackageGoodsSpecList,
                        }

                        // 获取商品规格
                        this.getSpecs(res.data.PackageGoodsSpecList)
                    }else{
                        formInline = {
                            ...formInline,
                            goodsRange: res.data.PackageGoodsSpecList,
                            price: res.data.packagePrice + '',
                            originPrice:res.data.price,
                            costPrice:res.data.costPrice,
                        }

                        this.getGoods(res.data.PackageGoodsSpecList)
                    }
                    this.formInline = formInline
                    this.titleLength = Math.ceil((goodsUtils.getByteLen(res.data.packageName).len3) / 2)

                    

                }
            }).catch(err => {
                this.$Message.error('请求失败')
            })
        },

        // 打开推荐图片
        addRecImg(imgtype){
            if(imgtype == 'bannerImg'){
                this.recImgOptions = {
                    type:"multiimage",
                    mode:"diy"
                }
            }else{
                this.recImgOptions = {
                    type:"image",
                    mode:"diy"
                }
            }
            this.currentType = imgtype
            this.$refs.imgSelect.uploadflg()
        },

        

        // 监听图片选择
        changeImg(img){
            let currentType = this.currentType

            if(currentType == 'bannerImg'){
                this.formInline[this.currentType].push(...img)
            }else{
                this.formInline[this.currentType] = img[0].imgAddress
            }

            this.$forceUpdate()

            this.$refs.formInline.validateField(currentType)
        },

        deleteImg(index){
            let newForm = {...this.formInline}
            newForm['bannerImg'].splice(index,1)
            this.formInline = newForm
        },
        // 获取商品规格
        getSpecs(data){
            let newData = []
            for (let i = 0; i < data.length; i++) {
                let newObj = {
                    goodsId:data[i].goodsId,
                    specIds:data[i].specsId,
                    mealprices:data[i].packagePrice
                }
                for (let j = i + 1; j < data.length; j++) {
                    if(data[i].goodsId == data[j].goodsId){
                        newObj.specIds += ',' + data[j].specsId
                        newObj.mealprices += ',' + data[j].packagePrice
                        data.splice(j,1)
                    }
                }
                newData.push(newObj)
            }   
            this.showDataMeal = newData
        },

        // 获取商品规格
        getGoods(data){
            let newData = []
            data.map((v,i) => {
                newData.push({
                    goodsId:v.goodsId,
                    packageId:v.packageId,
                    specIds:v.specsId
                })
            })
            this.showData = newData
        },

        // 校验名称
        validTitle(e){
            let val = e.srcElement.value
            let newLength = Math.ceil((goodsUtils.getByteLen(val).len3) / 2)
            this.titleLength = newLength
            if(newLength > 30){
                console.log(val.length)
                return false
            }
            
        },
        
        //接收商品数据
        listentgoodDatafuc: function(data) {

            console.log(data)

            let rulegoodslist = [];

            for (let item in data) {
                let obj = {};
                obj.specIds = data[item].hasOwnProperty('specsId') ? data[item].specsId.join(',') : ''
                obj.goodsId = data[item].id
                rulegoodslist.push(obj)
            }

            this.formInline.goodsRange = rulegoodslist

            console.log(this.formInline.goodsRange)

            this.$forceUpdate()

            if(!data){
                return false
            }

            this.$refs.formInline.validateField('goodsRange')
        },

        listentgoodDatafucMeal(data){

            let rulegoodslist = [];
            for (let item in data) {
                let obj = {};
                obj.specIds = data[item].specsId
                obj.goodsId = data[item].id,
                obj.mealPrice = data[item].mealprice
                
                rulegoodslist.push(obj)
            }


            this.formInline.mealsRange = rulegoodslist

            this.$forceUpdate()

            if(!data){
                return false
            }

            this.$refs.formInline.validateField('mealsRange')
        },

        // 保存
        save(reduForm) {
            let _this = this
            let rulegoods = []
            let goodList = []
            let dataParams
            let bannerImg = []
            if(this.titleLength > 30){
                this.$Message.error('套餐商品名称过长')
                return false
            }
            _this.formInline.bannerImg.map((v,i) => {
                bannerImg.push(v.imgAddress)
            })
            if(_this.formInline.range == 1){
                this.formInline.mealsRange.map((v,i) => {
                    let newObj = {
                        goodsId:v.goodsId,
                        specsId:v.specIds ? v.specIds.join() : '',
                        specprice:v.mealPrice ? v.mealPrice.join() : ''
                    }
                    rulegoods.push(newObj)
                })

                dataParams = {
                    packageType:_this.formInline.range,
                    packageName:_this.formInline.title,
                    picture:_this.formInline.recImg,
                    byPicture:bannerImg,
                    orderPicture:_this.formInline.smallpic,
                    time:[goodsUtils.timeFun(goodsUtils.timeStamp(_this.formInline.rangeTime[0])),goodsUtils.timeFun(goodsUtils.timeStamp(_this.formInline.rangeTime[1]))],
                    status:_this.formInline.status,
                    packagespecList:rulegoods
                }
            }else{
                this.formInline.goodsRange.map((v,i) => {
                    console.log(v)
                    let newObj = {
                        goodsId:v.goodsId,
                        specsId:v.specIds
                    }
                    goodList.push(newObj)
                })

                dataParams = {
                    packageType:_this.formInline.range,
                    packageName:_this.formInline.title,
                    picture:_this.formInline.recImg,
                    byPicture:bannerImg,
                    orderPicture:_this.formInline.smallpic,
                    time:[goodsUtils.timeFun(goodsUtils.timeStamp(_this.formInline.rangeTime[0])),goodsUtils.timeFun(goodsUtils.timeStamp(_this.formInline.rangeTime[1]))],
                    status:_this.formInline.status,
                    packagePrice:_this.formInline.price,
                    price:_this.formInline.originPrice,
                    costPrice:_this.formInline.costPrice,
                    packagespecList:goodList
                }
            }

            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    if(this.role == 3){
                        // 编辑
                        this.loading=true;
                        marking.mealGoodsUpdate({
                            ...dataParams,
                            id:_this.id
                        }).then((res) => {
                            console.log(res)
                            if(res.code == 1){
                                this.loading=false;
                                _this.$Message.success('保存成功')
                                _this.prev()
                            }else{
                                this.loading=false;
                                _this.$Message.error(res.message)
                            }
                        })
                    }else{
                        // 创建和复制
                         this.loading=true;
                        marking.mealGoodsAdd({
                            ...dataParams
                        }).then((res) => {
                            console.log(res)
                            if(res.code == 1){
                                 this.loading=false;
                                this.$Message.success('保存成功')
                                this.prev()
                            }else{
                                this.loading=false;
                                this.$Message.error(res.message)
                            }
                        })
                    }
                }
            })
        },

        // 返回列表
        prev(){
            this.$router.go(-1);
        },

        // 重置
        restore(){
            this.formInline = {
                title: '',
                price: '',
                range:'1',
                mealsRange:[],
                goodsRange:[],
                recImg:'',
                bannerImg:[],
                smallpic:'',
                rangeTime:[],
                status:'1',
                showData: [],
                showDataMeal: [],
                originPrice:'',
                costPrice:'',
            }

            this.showData = []
            this.showDataMeal = []

            this.$refs.formInline.resetFields()
        }
    }
}
</script>

