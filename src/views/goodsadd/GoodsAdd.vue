<template>
    <div id="goods-add">
      <div class="currentTitle" v-if="role == 1">商品列表/<label> 编辑商品</label></div>
      <div class="currentTitle" v-if="role == 2">商品列表/<label> 添加商品</label></div>
        <Card>
            <Tabs type="card" class="tabs" v-model="tabsName" :animated="false" @on-click="tabChange">
                <TabPane label="基本信息" name="基本信息">
                    <!--  @thumbFun="thumbFun" @thumbsFun="thumbsFun" -->
                    <basic-info :info="info" :role='role' :classOption="classOption" />
                </TabPane>
                <TabPane label="库存规格" name="库存规格">
                    <goods-spec :spec="spec" :id="id" :role='role' @specStartFun="specStartFun" />
                </TabPane>
                <TabPane label="商品详情" name="商品详情">
                    <goods-details ref="details" @comData="comData" @detailValidateData="detailValidateData" :details="details" />
                </TabPane>
                <TabPane label="购买权限" name="购买权限">
                    <goods-buy-power :buyPower="buyPower" />
                </TabPane>
                <TabPane label="营销设置" name="营销设置">
                    <marketing-setup :setup="setup" />
                </TabPane>
                <TabPane label="会员折扣" name="会员折扣">
                    <member-discount :discount="discount" />
                </TabPane>
                <TabPane label="商品推荐" name="商品推荐">
                    <goods-recommend :recommend="recommend" :classOption="classOption" />
                </TabPane>
                <TabPane label="定制服务" name="定制服务">
                    <!-- ref="cuService" -->
                    <customized-service :server="server" />
                </TabPane>
            </Tabs>
            <div class="tail">
                <div>
                    <Button type="primary" @click="keepGoods" :loading="loading">
                        <span v-if="!loading">保存商品</span>
                        <span v-else>保存中...</span></Button>
                    <Button @click="backList">返回列表</Button>
                </div>
            </div>
        </Card>
        <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
    </div>
</template>

<script>
// 引入请求文件
import api from '@/api/request'
import goods from '@/api/request/goods'
// 基本信息
import BasicInfo from './goodsbasicinfo/BasicInfo'
// 规格
import GoodsSpec from './goodsspec/GoodsSpec'
// 详情
import GoodsDetails from './goodsdetails/GoodsDetails'
// 购买权限
import GoodsBuyPower from './goodsbuypower/GoodsBuyPower'
// 营销设置
import MarketingSetup from './marketingsetup/MarketingSetup'
// 会员折扣
import MemberDiscount from './memberdiscount/MemberDiscount'
// 商品推荐
import GoodsRecommend from './goodsrecommend/GoodsRecommend'
// 定制服务
import CustomizedService from './customizedservice/CustomizedService'
// 引入工具
import goodsUtils from '@/utils/goodsUtils'
export default {
    name: 'GoodsAdd',
    data() {
        return {
            spinShow: false,
            loading: false,
            tabsName: '基本信息',
            classOption: [],
            priceRes: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
            titleRes: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            posiIntZeros: /^\+?[0-9][0-9]*$/,
            posiInt: /^\+?[1-9][0-9]*$/,
            // percentage: /^(([0-9]?\d(\.\d\d?\d?)?)%)|([0-9]\d*(\.\d{1,2})?)|(^0(\.\d{1,2})?))$/,
            // 基本信息
            info: {
                // 商品排序 (有)
                displayOrder: '',
                // 商品名称 (有)
                title: '',
                // 副标题 (有)
                subTitle: '',
                // 英文副标题 (有)
                englishSubTitle: '',
                // 关键字 (有)
                keyword: '',
                // 商品类型 checkbox (有)
                type: '1',
                
                // 商品信息中的类型数据 多选列表 (有)
                categoryId: [],
                // 分类的列表
                options: [],
                // categoryId: [],
                // 一级分类
                // oneClass: [],
                // tempOneClass: '',
                // 二级分类
                // twoClass: [],
                // tempTwoClass: '',

                // 商品价格 (有)
                price: '',
                // 商品原价 (有)
                originalCost: '',
                // 商品成本价格 (有)
                costPrice: '',
                
                // 商品推荐图      上传图片的显示地址  (有)
                thumb: '',
                // 图片信息轮播（添加） (有)
                thumbs: [],
                // 视频 (有)
                video: '',

                // 库存扣减分类 (有)
                stockCnf: '0',
                // 已售出数 (有)

                // numberSales
                vituralSales: '',
                // 显示销量 (有)
                isShowSalesCount: false,
                // 单品满件包邮 (有)
                ednum: '',
                // 单品满额包邮 (有)
                edmoney: '',
                // 包邮地区 (有)
                edareas: [],

                // 邮费模板的状态(有)
                dispatchStatus: '1', 
                // 运费模板选择的数据 (有)
                templateId: '1',
                // 运费模板显示的数据 (没有)
                freightModule: [
                    {
                        id: '1',
                        name: '默认模板'
                    }
                ],
                
                // 统一邮费的数据(元)  (有)
                uniformPostagePrice: '',
                payByPost: '0',

                // 发票 (有)
                isInvoiceSupport: false,
                // 上架方式(微信小程序 (有)
                putawayType: '微信小程序',
                // 上架的单选
                isPutaway: '1',

                // 是否选择上架的时间(与上面的字段一样) (没有************)
                isPutawayTime: '0',
                
                // 上架时间 (有)
                putawayTime: '',
                // 主商城头部 (有)
                searchShow: '0',
                // 是否支持换货 (有)
                isSales: '0',
                // 确认收货时间 (有)
                cargoTime: ''
            },
            // 规格
            spec: {
                // 商品编码 (有)
                goodsCode: '',
                // 商品编码 (有)
                barCode: '',
                // 商品重量 (有)
                weight: 0,
                // 商品虚拟库存 (有)
                vituralStock: 0,
                // 是否显示库存
                isShowStock: true,
                // 启用商品规格 (有)
                enableSpec: false,
                // 规格是否前端显示
                // showSpec: '0',
                // 规格的数据
                specificationData: [],
                // 项目数据值
                defaultSpec: '',

                // // 规格数据
                // goodsSpecItemList: [],
                // // 暂存
                // tempSpecName: [],
                // specData: [],
            },
            // 详情
            details: {
                // 显示颜色
                isColorShow: '0',
                // 模板选择
                diyPageId: '',
                templatesList: [],
                templates: [],
                // icon
                iconImg: '',
                // 模板数据
                data: '',
                tempId: '',
                data:[]
            },
            // 权限
            buyPower: {
                // 单次最多购买
                numMax: '',
                // 单次最低购买
                numMin: '',
                // 最多购买
                mostPurchases: '',
                // 会员等级浏览权限
                jurisdictionMemberBrowse: '',
                vipBorwse: [
                    {
                        value: 'vip1',
                        label: '会员1'
                    },
                    {
                        value: 'vip1',
                        label: '会员2'
                    }
                ],
                // 会员等级购买权限
                jurisdictionMemberPurchase: '',
                vipBuy: [
                    {
                        value: 'vip1',
                        label: '会员1'
                    },
                    {
                        value: 'vip1',
                        label: '会员2'
                    }
                ],
                // 标签组浏览权限
                jurisdictionLabsBrowse: '',
                labelBorwse: [
                    {
                        value: 'vip1',
                        label: '会员1'
                    },
                    {
                        value: 'vip2',
                        label: '会员2'
                    }
                ],
                // 会员标签组购买权限
                jurisdictionLabsPurchase: '',
                vipLabelBuy: [
                    {
                        value: 'vip1',
                        label: '会员1'
                    },
                    {
                        value: 'vip2',
                        label: '会员2'
                    }
                ]
            },
            // 营销
            setup: {
                // 促销标题
                promotionTitle: '促销',
                // 上架时间
                promotionTime: [],
                // 会员促销价格
                promotionMoney: '',

                // 积分赠送
                presentIntegral: '',
                // 余额返现
                returnMoney: '',

                // 重复购买
                discount: '',
                // 持续使用
                isSustainedUse: '1',
                // 使用条件 1 付款 0 完成
                serviceConditions: '1',
                // 与其他优惠共享
                isShare: '1'
            },
            // 会员
            discount: {
                // 会员折扣 折
                memberDiscount: '',
                // 元
                memberDiscountMoney: ''
            },
            // 商品推荐
            recommend: {
                // 商品推荐
                recomType: '0',

                // 商品分类
                recomCategoryName: '',
                // selevtClass: [],
                // 显示个数
                recomCategoryNum: '',
                // 商品推荐的id
                recomGoodsId: [],
                recomList: []
            },
            // 定制服务
            server: {
                // 刻字服务
                letterStatus: 2,
                // 限时免费
                letterFree: '2',
                // 限免时间  '2019-01-01 12:00', '2019-02-15 12:10'
                letterTime: [],

                letterCheckData: [],
                // 选中卡片的数据
                letterContent: '',

                // 卡片
                cardStatus: 2,
                // 全选
                cardType: '2',
                // 卡片数据
                cardCheckData: [],
                // 选中卡片的数据
                cardContent: [],

                // 套装数据
                packetStatus: 2,
                // 全选
                packetType: '2',
                suitCheckData: [],
                // 选中卡片的数据
                packetContent: [],

                // 包装数据
                packBoxStatus: 2,
                // 全选
                packBoxType: '2',
                packBoxData: [],
                // 选包装的数据
                packBoxContent: '',
            },

            // 记录值
            role: '' ,
            id: '',
            status: '',
            // 虚拟库存
            virtualBol: false,
            virtualData: false,
            specPrice: false,
            specBlo: false,
            specPriceJust: false,
            // 模板图片的验证
            detialsBool: true,
            specEmpty: false
        }
    },
    components: {
        BasicInfo,
        GoodsSpec,
        GoodsDetails,
        GoodsBuyPower,
        MarketingSetup,
        MemberDiscount,
        GoodsRecommend,
        CustomizedService
    },
    created() {
        this.startFun()
    },
    methods: {
        startFun() {
            // 初始化数据 根据传递的状态进行判断是否发起请求 1 为编辑 0 为添加 2 为复制
            // 获取路由参数
            this.role = this.$route.query.role
            this.id = this.$route.query.id
            this.status = this.$route.query.name
            this.init()
            // 必须请求的数据
            // 商品分类的多选接口
            this.initRes()
            this.oneClassFun()
            if (this.role !== '0') {
                this.spinShow = true
                // 请求
                this.getGoods(this.id)
            }
            goods.customizedServiceList().then(res => {
                console.log('获取定制服务的数据',res)
                if (res.code == 1) {
                    this.server.letterCheckData = res.data.legend
                    this.server.cardCheckData = res.data.card
                    this.server.suitCheckData = res.data.package
                    this.server.packBoxData = res.data.packBox
                }
            }).catch(err => {
                console.log('获取定制失败')
                this.$Message.error('获取定制失败')
            })
        },
        initRes() {
            this.tabsName = '基本信息'
        },
        tabChange(index) {
            console.log(index,'啊啊啊啊啊啊啊啊啊啊啊啊啊1')
            if (index == '库存规格') {
                localStorage.setItem('tabName',index)
            }
            // if (index == '定制服务') {
            //     console.log(index,'啊啊啊啊啊啊啊啊啊啊啊啊啊')
            //     this.$refs.cuService.getData()
            // }
        },
        // 初始化
        init(){
            let _this = this
            goods.getTems({}).then((res) => {

                if(res.code == 1){
                    _this.details.templatesList = res.data
                    this.details.templatesList.map((v,i) => {
                        // console.log('**11111',JSON.parse(v.data).currentTemplate)
                        // console.log('**222222',this.details.templatesList[i].data)
                        // console.log('我是请求的模板',v)
                        if (v.data) {
                            this.details.templatesList[i].data = JSON.parse(v.data).currentTemplate
                        } else {
                            this.details.templatesList[i].data = []
                        }
                    });
                    // console.log('thismuban',this.details.templatesList)
                    _this.details.templates = res.data[0]
                    // console.log('[][][][]', _this.details.templatesList[0].data)
                    _this.details.data = _this.details.templatesList[0].data
                    console.log('我是data',_this.details.data)
                    _this.details.diyPageId = res.data[0].id + ''
                    _this.details.tempId = res.data[0].id + ''
                    // console.log('模板init',this.details.data)
                }else{
                    _this.$Message.error(res.message)
                }
            })
        },
        // 商品分类的多选接口
        oneClassFun() {
            // api/goods/selCategoryAll   api/goods/selShopGoodsCategoryOne
            goods.goodsClassAll({}).then(res => {
                if(res.code == '1') {
                    console.log('我像看看谁先?2')
                    this.classOption = goodsUtils.classFun(res.data)
                    if (this.role == 0) {
                        this.recommend.recomCategoryName = this.recommend.recomCategoryName ? this.recommend.recomCategoryName : this.classOption[0].id + ''
                    }
                    // this.recommend.recomCategoryName = goodsUtils.classFun(res.data,'12')
                }
            }).catch(err => {
                console.log('分类查询失败')
            })
        },
        // 保存商品 (因为有复制,所以要考虑保存时的参数,是添加,编辑,还是复制添加新的商品)
        keepGoods() {
            if (this.role == '1') {
                this.editFun()
                return ''
            }
            this.addFun()
        },
        // 判断的条件
        judgeFun(goodsData) {
            if (goodsData.title == '') {
                this.$Message.error('商品名称不能为空')
                return ''
            } else {
                // var re = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/gi
                // if (!re.test(goodsData.title)) {
                //     this.$Message.error('商品名称格式不正确')
                //     return ''
                // }
            }
            let count = 0
            for (let i = 0; i < goodsData.title.length; i++) {
                let charCode = goodsData.title.charCodeAt(i)
                if (charCode >= 0 && charCode <= 128) {
                    count++
                } else {
                    count+=2
                }
                if (count > 60) {
                    this.$Message.error('商品名称过长')
                    return ''
                }
            }
            if (!this.spec.enableSpec) {
                if (this.info.type != 3) {
                    if (goodsData.price === '') {
                        this.$Message.error('商品价格不能为空')
                        return ''
                    } else {
                        if (!this.priceRes.test(goodsData.price)) {
                            this.$Message.error('商品价格格式不正确')
                            return ''
                        }
                    }
                } else {
                    if (goodsData.price === '') {
                        this.$Message.error('商品价格不能为空')
                        return ''
                    } else {
                        if (!this.priceRes.test(goodsData.price)) {
                            this.$Message.error('商品价格格式不正确')
                            return ''
                        }
                    }
                }
            }

            if (goodsData.enableSpec == '0') {
                // if(goodsData.vituralStock * 1 < 0) {
                //     this.$Message.error('库存不能小于0')
                //     return ''
                // }
            } else {
                console.log(this.spec.specificationData,'规格的值')
                let len = this.spec.specificationData.length
                if (len == 0) {
                    this.$Message.error('规格启用,规格不能为空')
                    return false
                }
                for (let i = 0; i < len; i++) {
                    console.log('规格名字',this.spec.specificationData[i].title)
                    if (!this.spec.specificationData[i].title) {
                        this.$Message.error('规格名字不能为空')
                        return false
                    }
                    if (this.spec.specificationData[i].specificationitem.length == 0) {
                        this.$Message.error('规格项不能为空')
                        return false
                    }
                }
                let nameList = []
                for (let i = 0; i < len; i++) {
                    nameList.push(this.spec.specificationData[i].title)
                }
                for (let i = 0; i < nameList.length; i++) {
                    if (nameList[i] == nameList[i + 1]) {
                        this.$Message.error('规格项名字不能重复')
                        return false
                    }         
                }

                let specItem = []
                for (let i = 0; i < nameList.length; i++) {
                    for (let j = 0; j < this.spec.specificationData[i].specificationitem.length; j++) {
                        specItem.push(this.spec.specificationData[i].specificationitem[j].title)
                    }
                    for (let j = 0; j < specItem.length - 1; j++) {
                        if (specItem[j] == specItem[j + 1]) {
                            this.$Message.error('同一规格下规格项名字不能重复')
                            return false
                        }
                    }
                    specItem = []
                }


                for (let i = 0; i < len; i++) {
                    for (let j = 0; j < this.spec.specificationData[i].specificationitem.length; j++) {
                        // 判断规格项的
                        if (!this.spec.specificationData[i].specificationitem[j].title) {
                            this.$Message.error('规格项名字不能为空')
                            return false
                        }
                        if (!(this.spec.specificationData[i].specificationitem[j].money + '')) {
                            this.$Message.error('规格项价格不能为空')
                            return false
                        } else {
                            let res = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
                            if (!res.test(this.spec.specificationData[i].specificationitem[j].money)) {
                                this.$Message.error('规格项价格输入错误')
                                return false
                            }
                        }
                    }
                }
                // if (goodsData.goodsSpecItemList.length == 0) {
                //     this.$Message.error('规格启用,规格值不能为空')
                //     return ''
                // }
                // if (this.specEmpty) {
                //     this.$Message.error('规格项不能为空')
                //     return ''
                // }
            }
            if (this.specBlo) {
                 this.$Message.error('规格不能为空')
                return ''
            }
            if (goodsData.recomType == '1') {
                if (goodsData.recomCategoryNum != '') {
                    if (!this.posiInt.test(goodsData.recomCategoryNum)) {
                        this.$Message.error('商品推荐中选择显示个数格式错误')
                        return ''
                    }
                } else {
                    this.$Message.error('商品推荐中选择显示个数不能为空')
                    return ''
                }
            }
            // 加判断 大于 0
            if(goodsData.displayOrder != ''){
                let res = /^\+?[0-9][0-9]*$/
                if (!res.test(goodsData.displayOrder)) {
                    this.$Message.error('排序格式错误')
                    return false
                }
                 // 判断排序不能为小数
                if ((goodsData.displayOrder + '').indexOf('.') > -1) {
                    this.$Message.error('排序格式错误')
                    return ''
                }
                if (goodsData.displayOrder * 1 > 9999) {
                    this.$Message.error('排序不能超过9999')
                    return ''
                }
            }
            
            // 判断副标题长度
            let subTitleCount = 0
            for (let i = 0; i < goodsData.subTitle.length; i++) {
                let charCode = goodsData.subTitle.charCodeAt(i)
                if (charCode >= 0 && charCode <= 128) {
                    subTitleCount++
                } else {
                    subTitleCount+=2
                }
                if (subTitleCount > 40) {
                    this.$Message.error('副标题长度太长')
                    return ''
                }
            }
            // 判断原价
            if (goodsData.originalCost != '') {
                if (goodsData.originalCost * 1 < 0) {
                    this.$Message.error('商品原价不能小于0')
                    return ''
                }
                if (!this.priceRes.test(goodsData.originalCost)) {
                    this.$Message.error('商品原价格式不正确')
                    return ''
                }
            }
            // 判断成本价
            if (goodsData.costPrice != '') {
                if (goodsData.costPrice * 1 < 0) {
                    this.$Message.error('商品成本价不能小于0')
                    return ''
                }
                if (!this.priceRes.test(goodsData.costPrice)) {
                    this.$Message.error('商品成本价格式不正确')
                    return ''
                }
            }

            // 判断已出售件数
            if (goodsData.vituralSales != '') {
                if (goodsData.vituralSales * 1 < 0) {
                    this.$Message.error('出售件数不能小于0')
                    return ''
                }
                if (!this.posiIntZeros.test(goodsData.vituralSales)) {
                    this.$Message.error('出售件数格式不正确')
                    return ''
                }
            }

            // 判断满件包邮
            if (goodsData.ednum != '') {
                if (goodsData.ednum * 1 < 0) {
                    this.$Message.error('单品满件包邮不能小于0')
                    return ''
                }
                if (!this.posiIntZeros.test(goodsData.ednum)) {
                    this.$Message.error('单品满件包邮格式不正确')
                    return ''
                }
            }
            // 判断满元包邮
            if (goodsData.edmoney != '') {
                if (goodsData.edmoney * 1 < 0) {
                    this.$Message.error('单品满额包邮不能小于0')
                    return ''
                }
                if (!this.priceRes.test(goodsData.edmoney)) {
                    this.$Message.error('单品满额包邮格式不正确')
                    return ''
                }
            }
            // 判断统一邮费
            if (goodsData.uniformPostagePrice * 1 < 0 ) {
                this.$Message.error('统一邮费不能小于0')
                return ''
            }
            // 判断商品是否选择上架
            if (goodsData.isPutawayTime == '1') {
                console.log('sahngjiadeshijian',goodsData.putawayTime)
                if (goodsData.putawayTime == '') {
                    console.log('我是空的时间啊')
                    this.$Message.error('上架时间不能为空')
                    return ''
                }
            }
            // 判断发货天数
            if (goodsData.cargoTime != '') {
                if (isNaN(goodsData.cargoTime)) {
                    this.$Message.error('确认收货时间格式错误')
                    return ''
                }
                if (goodsData.cargoTime * 1 < -1 ) {
                    this.$Message.error('确认收货时间格式错误')
                    return ''
                }
                if (goodsData.cargoTime * 1 != -1) {
                    if (!this.posiIntZeros.test(goodsData.cargoTime)) {
                        this.$Message.error('确认收货时间格式错误')
                        return false
                    }
                }
            }

            // 判断商品重量
            if (goodsData.weight != '') {
                if (goodsData.weight * 1 < 0) {
                    this.$Message.error('商品重量格式不正确')
                    return ''
                }
                if (!this.priceRes.test(goodsData.weight)) {
                    this.$Message.error('商品重量格式不正确')
                    return ''
                }
            }
            if (goodsData.vituralStock != '') {
                if (goodsData.vituralStock * 1 < 0) {
                    this.$Message.error('虚拟库存格式不正确')
                    return ''
                }
                if (!this.posiIntZeros.test(goodsData.vituralStock)) {
                    this.$Message.error('虚拟库存格式不正确')
                    return ''
                }
            }
            // 购买权限判断
            // 判断最多单次购买
            if (goodsData.numMax != '') {
                if (!this.posiIntZeros.test(goodsData.numMax)) {
                    this.$Message.error('单次最多购买格式错误')
                    return false
                }
            }
            if (goodsData.numMin != '') {
                if (!this.posiIntZeros.test(goodsData.numMin)) {
                    this.$Message.error('单次最低购买格式错误')
                    return false
                }
            }
            if (goodsData.mostPurchases != '') {
                if (!this.posiIntZeros.test(goodsData.mostPurchases)) {
                    this.$Message.error('最多购买格式错误')
                    return false
                }
            }
            // 营销
            // 会员促销价格
            if (goodsData.promotionMoney != '') {
                if (goodsData.promotionMoney * 1 < 0) {
                    this.$Message.error('会员促销价格不能小于0')
                    return ''
                }
                if (!this.priceRes.test(goodsData.promotionMoney)) {
                    this.$Message.error('会员促销价格格式不正确')
                    return ''
                }
            }
            if (goodsData.presentIntegral != '') {
                // if (goodsData.presentIntegral * 1 < 0) {
                //     this.$Message.error('积分赠送必须大于0')
                //     return ''
                // }
                // let res = 
                // if (!this.priceRes.test(goodsData.presentIntegral)) {
                //     this.$Message.error('积分赠送格式不正确')
                //     return ''
                // }
            }
            // 余额返现
            // 重复购买折数
            if (goodsData.discount != '') {
                // if (!isNaN(goodsData.discount)) {
                //     this.$Message.error('重复购买折扣格式不正确')
                //     return ''
                // }
                // if ((goodsData.discount * 1) >= 10) {
                //     this.$Message.error('重复购买折扣不能大于10')
                //     return ''
                // }
                // if ((goodsData.discount * 1) <= 0) {
                //     this.$Message.error('重复购买折扣不能大于10')
                //     return ''
                // }
                if (!this.posiIntZeros.test(goodsData.discount)) {
                    this.$Message.error('重复购买折扣格式不正确')
                    return ''
                }
            }
            // 会员折扣件
            // if (goodsData.memberDiscount != '') {
            //     if (!isNaN(goodsData.memberDiscount)) {
            //         this.$Message.error('会员折扣格式不正确')
            //         return ''
            //     }
            //     if ((goodsData.memberDiscount * 1) >= 10) {
            //         this.$Message.error('会员折扣不能大于10')
            //         return ''
            //     }
            //     if ((goodsData.memberDiscount * 1) <= 0) {
            //         this.$Message.error('会员折扣不能大于10')
            //         return ''
            //     }
            //     if (!this.res.test(goodsData.memberDiscount)) {
            //         this.$Message.error('会员折扣格式不正确')
            //         return ''
            //     }
            // }
            // 会员折扣元
            // 选择显示个数
            // var re =  /^[0-9a-zA-Z]*$/ 
            // if (!re.test(goodsData.goodsCode)) {
            //     this.$Message.error('商品编码格式不对')
            //     return ''
            // }
            // if (!re.test(goodsData.barCode)) {
            //     this.$Message.error('商品条码格式不对')
            //     return ''
            // }

                        // console.log(goodsData.promotionTime,'营销的查看........')
            // if (goodsData.promotionTime || goodsData.promotionTime[0] == '') {
            //     this.$Message.error('商品重量不能小于0')
            //     return ''
            // }
            if (goodsData.letterFree == 1) {
                if (goodsData.letterTimeNum != 2) {
                    this.$Message.error('刻字服务限免时间不能为空')
                    return ''
                }
            }
            console.log(goodsData.letterStatus, goodsData.letterContent,  goodsData.letterContent == '', '{{{{{{{{{}}}}}}}}}}}}}}}')
            if (goodsData.letterStatus == 1) {
                if (goodsData.letterContent == '') {
                    this.$Message.error('刻字服务选择样图不能为空')
                    return ''
                }
            }
            if (goodsData.cardStatus == 1) {
                if (goodsData.cardContent.length == 0) {
                    this.$Message.error('专属卡片开启,内容不能为空')
                    return ''
                }
            }

            if (goodsData.packetStatus == 1) {
                if (goodsData.packetContent.length == 0) {
                    this.$Message.error('个性套装开启,内容不能为空')
                    return ''
                }
            }

            if (goodsData.packBoxStatus == 1) {
                if (goodsData.packBoxContent == 0) {
                    this.$Message.error('包装盒开启,内容不能为空')
                    return ''
                }
            }

            return true
        },
        // 不同的保存接口
        addFun () {
            this.virtualBol = false
            this.virtualData = false
            this.specPrice = false
            this.specBlo = false
            this.specPriceJust = false
            this.detialsBool = true
            this.specEmpty = false
            console.log('tianjiade ')
            // console.log('我是添加')
            // 整合数据调用方法
            let goodsData = this.integrationFun('1')
            let result = this.judgeFun(goodsData)
            if (result == '') {
                return
            }
            // return false
            this.$refs.details.getValidateData()
            if (!this.detialsBool) {
                this.loading = false
                console.log('我是详情',this.detialsBool)
                return 
            }
            // return false
            // 判断status的值 上架的值
            let tempStatus = null
            if(goodsData.isPutaway * 1 >= 1) {
                // console.log('我是上架,我要看库存')
                tempStatus = 1
            }
            tempStatus = goodsData.isPutaway == '0' ? -2 : 1
            // 判断库存的状态
            if (goodsData.enableSpec == '0') {
                if (goodsData.vituralStock == '0') {
                    tempStatus = 3
                }
            } else {
                if(this.virtualBol) {
                    tempStatus = 1
                } else {
                    tempStatus = 3
                }
            }
            // 判断 下架的值
            if(goodsData.isPutaway == '0') {
                // console.log('我是下架,我是老大,听我的')
                tempStatus = -2
            }
            // 判断是否是否有上架时间
            if (goodsData.putawayTime == '') {
                goodsData.putawayTime = Date.parse(new Date())
            }
            console.log('我是最终的状态',tempStatus)
            // return false
            this.loading = true
            goods.goodsAdd({
                'status': tempStatus,
                // 商品详情
                'displayOrder': goodsData.displayOrder,
                'title': goodsData.title,
                'subTitle': goodsData.subTitle,
                'englishSubTitle': goodsData.englishSubTitle,
                'keyword': goodsData.keyword,
                'type': goodsData.type,
                'categoryId': goodsData.categoryId,
                // 多选列表,
                'price': goodsData.price,
                'originalCost': goodsData.originalCost,
                'costPrice': goodsData.costPrice,
                'thumb': goodsData.thumb,
                'thumbs': goodsData.thumbs,
                'video': goodsData.video,
                'stockCnf': goodsData.stockCnf,
                'vituralSales': goodsData.vituralSales,
                'isShowSalesCount': goodsData.isShowSalesCount,
                'ednum': goodsData.ednum,
                'edmoney': goodsData.edmoney,
                'edareas': goodsData.edareas,
                'dispatchStatus': goodsData.dispatchStatus,
                'templateId': goodsData.templateId,
                'uniformPostagePrice': goodsData.uniformPostagePrice,
                'payByPost': goodsData.payByPost,
                'isInvoiceSupport': goodsData.isInvoiceSupport,
                'putawayType': goodsData.putawayType,
                'isPutaway': goodsData.isPutaway,
                'isPutawayTime': goodsData.isPutawayTime,
                'putawayTime': goodsData.putawayTime,
                'searchShow': goodsData.searchShow,
                'isSales': goodsData.isSales,
                'cargoTime': goodsData.cargoTime,

                // 商品规格
                'goodsCode': goodsData.goodsCode,
                'barCode': goodsData.barCode,
                'weight': goodsData.weight,
                'vituralStock': goodsData.vituralStock,
                'isShowStock': goodsData.isShowStock ? 1 : 0,
                'showSpec': goodsData.showSpec,
                // 具体规格
                'enableSpec': goodsData.enableSpec,
                // 规格名称
                'specList': goodsData.goodsSpecList,
                // 规格的属性
                'specItem': goodsData.goodsSpecItemList,
                'defaultSpec': goodsData.defaultSpec,
                
                // 详情
                'isColorShow': goodsData.isColorShow,
                'iconImg': goodsData.iconImg,
                'data': goodsData.data,
                'diyPageId': goodsData.diyPageId,

                // // 权限
                'numMax': goodsData.numMax,
                'numMin': goodsData.numMin,
                'mostPurchases': goodsData.mostPurchases,
                'jurisdictionMemberBrowse': goodsData.jurisdictionMemberBrowse,
                'jurisdictionMemberPurchase': goodsData.jurisdictionMemberPurchase,
                'jurisdictionLabsBrowse': goodsData.jurisdictionLabsBrowse,
                'jurisdictionLabsPurchase': goodsData.jurisdictionLabsPurchase,

                // // 营销
                'promotionTitle': goodsData.promotionTitle,
                'promotionTime': goodsData.promotionTime,
                'promotionMoney': goodsData.promotionMoney,
                'presentIntegral': goodsData.presentIntegral,
                'returnMoney': goodsData.returnMoney,
                'discount': goodsData.discount,
                'isSustainedUse': goodsData.isSustainedUse,
                'serviceConditions': goodsData.serviceConditions,
                'isShare': goodsData.isShare,

                // // 会员
                'memberDiscount': goodsData.memberDiscount,
                'memberDiscountMoney': goodsData.memberDiscountMoney,

                // 商品推荐
                'recomType':  goodsData.recomType,
                // // 选择商品分类
                'recomCategoryName':  goodsData.recomCategoryName,
                // // 选择显示个数
                'recomCategoryNum':  goodsData.recomCategoryNum,
                // 商品推荐的id 
                'recomGoodsId': goodsData.recomGoodsId,

                // 服务
                // 刻字服务的状态
                'letterStatus': goodsData.letterStatus,
                // 限时免费
                'letterFree': goodsData.letterFree,
                // 限时免费的时间
                'letterTime': goodsData.letterTime,
                'letterContent': goodsData.letterContent,
                // 卡片类型
                'cardType': goodsData.cardType,
                // 选择卡片内容
                'cardContent': goodsData.cardContent,
                // 卡片状态
                'cardStatus': goodsData.cardStatus,
                
                // 套装类型
                'packetType': goodsData.packetType,
                // 选择套装状态
                'packetStatus': goodsData.packetStatus,
                // 套装
                'packetContent': goodsData.packetContent,

                // 选择包装盒状态
                'packBoxStatus': goodsData.packBoxStatus,
                // 包装盒
                'packBoxContent': goodsData.packBoxContent
            }).then(res => {
                let code = res.code
                this.loading = false
                if(code == '1') {
                    // 跳转到主页
                    this.$Message.success('保存成功')
                    this.backList()
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.$Message.error('保存失败')
            })
        },
        // 编辑和复制
        editFun () {
            this.virtualBol = false
            this.virtualData = false
            this.specPrice = false
            this.specBlo = false
            this.specPriceJust = false
            this.detialsBool = true
            this.specEmpty = false
            console.log('tianjiade ')
            // console.log('我是添加')
            // 整合数据调用方法
            let goodsData = this.integrationFun('0')
            let result = this.judgeFun(goodsData)
            // return false
            if (result == '') {
                this.loading = false
                return
            }
            // return false
            this.$refs.details.getValidateData()
            if (!this.detialsBool) {
                this.loading = false
                console.log('我是详情',this.detialsBool)
                return 
            }
            // 判断status的值 上架的值
            let tempStatus = null
            if(goodsData.isPutaway * 1 >= 1) {
                // console.log('我是上架,我要看库存')
                tempStatus = 1
            }
            tempStatus = goodsData.isPutaway == '0' ? -2 : 1
            // 判断库存的状态
            if (goodsData.enableSpec == '0') {
                if (goodsData.vituralStock == '0') {
                    tempStatus = 3
                }
            } else {
                if(this.virtualBol) {
                    tempStatus = 1
                } else {
                    tempStatus = 3
                }
            }
            // 判断 下架的值
            if(goodsData.isPutaway == '0') {
                // console.log('我是下架,我是老大,听我的')
                tempStatus = -2
            }
            // 判断是否是否有上架时间
            if (goodsData.putawayTime == '') {
                goodsData.putawayTime = Date.parse(new Date())
            } else {
            }
            console.log('我是最终的状态',goodsData)
            // return false
            this.loading = true
            goods.goodsUpdate({
                'status': tempStatus,
                'id': goodsData.id,
                // 商品详情
                'displayOrder': goodsData.displayOrder,
                'title': goodsData.title,
                'subTitle': goodsData.subTitle,
                'englishSubTitle': goodsData.englishSubTitle,
                'keyword': goodsData.keyword,
                'type': goodsData.type,
                'categoryId': goodsData.categoryId,
                // 多选列表,
                'price': goodsData.price,
                'originalCost': goodsData.originalCost,
                'costPrice': goodsData.costPrice,
                'thumb': goodsData.thumb,
                'thumbs': goodsData.thumbs,
                'video': goodsData.video,
                'stockCnf': goodsData.stockCnf,
                'vituralSales': goodsData.vituralSales,
                'isShowSalesCount': goodsData.isShowSalesCount,
                'ednum': goodsData.ednum,
                'edmoney': goodsData.edmoney,
                'edareas': goodsData.edareas,
                'dispatchStatus': goodsData.dispatchStatus,
                'templateId': goodsData.templateId,
                'uniformPostagePrice': goodsData.uniformPostagePrice,
                'payByPost': goodsData.payByPost,
                'isInvoiceSupport': goodsData.isInvoiceSupport,
                'putawayType': goodsData.putawayType,
                'isPutaway': goodsData.isPutaway,
                'isPutawayTime': goodsData.isPutawayTime,
                'putawayTime': goodsData.putawayTime,
                'searchShow': goodsData.searchShow,
                'isSales': goodsData.isSales,
                'cargoTime': goodsData.cargoTime,

                // 商品规格
                'goodsCode': goodsData.goodsCode,
                'barCode': goodsData.barCode,
                'weight': goodsData.weight,
                'vituralStock': goodsData.vituralStock,
                'isShowStock': goodsData.isShowStock ? 1 : 0,
                // 'showSpec': goodsData.showSpec,
                // 具体规格
                'enableSpec': goodsData.enableSpec,
                // 规格名称
                'specList': goodsData.goodsSpecList,
                // 规格的属性
                'specItem': goodsData.goodsSpecItemList,
                'defaultSpec': goodsData.defaultSpec,
                
                // 详情
                'isColorShow': goodsData.isColorShow,
                'iconImg': goodsData.iconImg,
                'data': goodsData.data,
                'diyPageId': goodsData.diyPageId,

                // // 权限
                'numMax': goodsData.numMax,
                'numMin': goodsData.numMin,
                'mostPurchases': goodsData.mostPurchases,
                'jurisdictionMemberBrowse': goodsData.jurisdictionMemberBrowse,
                'jurisdictionMemberPurchase': goodsData.jurisdictionMemberPurchase,
                'jurisdictionLabsBrowse': goodsData.jurisdictionLabsBrowse,
                'jurisdictionLabsPurchase': goodsData.jurisdictionLabsPurchase,

                // // 营销
                'promotionTitle': goodsData.promotionTitle,
                'promotionTime': goodsData.promotionTime,
                'promotionMoney': goodsData.promotionMoney,
                'presentIntegral': goodsData.presentIntegral,
                'returnMoney': goodsData.returnMoney,
                'discount': goodsData.discount,
                'isSustainedUse': goodsData.isSustainedUse,
                'serviceConditions': goodsData.serviceConditions,
                'isShare': goodsData.isShare,

                // // 会员
                'memberDiscount': goodsData.memberDiscount,
                'memberDiscountMoney': goodsData.memberDiscountMoney,

                // 商品推荐
                'recomType':  goodsData.recomType,
                // // 选择商品分类
                'recomCategoryName':  goodsData.recomCategoryName,
                // // 选择显示个数
                'recomCategoryNum':  goodsData.recomCategoryNum,
                // 商品推荐的id 
                'recomGoodsId': goodsData.recomGoodsId,

                // 服务
                // 刻字服务的状态
                'letterStatus': goodsData.letterStatus,
                // 限时免费
                'letterFree': goodsData.letterFree,
                // 限时免费的时间
                'letterTime': goodsData.letterTime,
                'letterContent': goodsData.letterContent,
                // 卡片类型
                'cardType': goodsData.cardType,
                // 选择卡片内容
                'cardContent': goodsData.cardContent,
                // 卡片状态
                'cardStatus': goodsData.cardStatus,
                
                // 套装类型
                'packetType': goodsData.packetType,
                // 选择套装状态
                'packetStatus': goodsData.packetStatus,
                // 套装
                'packetContent': goodsData.packetContent,

                // 选择包装盒状态
                'packBoxStatus': goodsData.packBoxStatus,
                // 包装盒
                'packBoxContent': goodsData.packBoxContent
            }).then(res => {
                console.log(res)
                this.loading = false
                let code = res.code
                if(code == '1') {
                    // 跳转到主页
                    console.log(res)
                    
                    this.$Message.success('保存成功')
                    this.backList()
                } else {
                    console.log(res)
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.$Message.error('保存失败')
            })
        },

        // 数据整合保存
        integrationFun (index) {
            let dataList = {}
            console.log('我是基本信息',this.info)
            // 商品的基本信息
            if (index == '0') {
                dataList.id = this.id
            }
            let { displayOrder, title, subTitle, englishSubTitle, keyword, type, categoryId, price, originalCost, costPrice, thumb, thumbs, video, stockCnf, vituralSales, isShowSalesCount, ednum, edmoney, edareas, dispatchStatus, templateId, uniformPostagePrice, payByPost, isInvoiceSupport, putawayType, isPutaway, isPutawayTime, putawayTime, searchShow, isSales, cargoTime } = this.info
            dataList.displayOrder = displayOrder
            dataList.title = title
            dataList.subTitle = subTitle
            dataList.englishSubTitle = englishSubTitle
            dataList.keyword = keyword
            dataList.type = type
            dataList.categoryId = categoryId
            // dataList.categoryId = categoryId

            // 多选列表
            dataList.price = price
            dataList.originalCost = originalCost ? originalCost : 0
            dataList.costPrice = costPrice ? costPrice : 0
            dataList.thumb = thumb
            dataList.thumbs = thumbs
            dataList.video = video
            dataList.stockCnf = stockCnf
            dataList.vituralSales = vituralSales ? vituralSales : 0
            dataList.isShowSalesCount = isShowSalesCount == true ? 1 : 0
            dataList.ednum = ednum ? ednum : 0
            dataList.edmoney = edmoney ? edmoney : 0
            dataList.edareas = edareas
            dataList.dispatchStatus = dispatchStatus
            dataList.templateId = templateId
            
            // 统一邮费的价格
            // dataList.uniformPostagePrice = uniformPostagePrice
            dataList.uniformPostagePrice = uniformPostagePrice ? uniformPostagePrice : 0
            dataList.payByPost = payByPost ? payByPost : '0'

            dataList.isInvoiceSupport = isInvoiceSupport == true ? 1 : 0
            dataList.putawayType = putawayType
            dataList.isPutaway = isPutaway
            dataList.isPutawayTime = isPutawayTime
            console.log('我是上架的时间', putawayTime)
            dataList.putawayTime = goodsUtils.timeStamp(putawayTime)
            console.log('转化的时间戳',dataList.putawayTime)
            dataList.searchShow = searchShow
            dataList.isSales = isSales
            dataList.cargoTime = cargoTime
            
            // 规格
            // console.log('我是规格的信息',this.spec)
            // showSpec
            let { goodsCode, barCode, weight, vituralStock, isShowStock, enableSpec,  specificationData, defaultSpec } = this.spec
            // console.log(goodsOptionList,'哈哈哈')
            // return false

            dataList.goodsCode = goodsCode ? goodsCode : 0
            dataList.barCode = barCode ? barCode : 0
            dataList.weight = weight ? weight : 0
            dataList.vituralStock = vituralStock ? vituralStock : 0
            console.log('保存的',isShowStock)
            dataList.isShowStock = isShowStock ? 1 : 0
            /* 规格 */
            // 启用规格的状态
            dataList.enableSpec = enableSpec ? 1 : 0
            // console.log('tyhis',showSpec)
            // dataList.showSpec = showSpec
            // console.log('tyhi.............s',showSpec)
            console.log('我是规格的header',specificationData)
            let specNameList = []
            specificationData.forEach(item => {
                let obj = {}
                console.log(item)
                obj.title = item.title
                obj.isMainSpec = item.isMainSpec
                obj.goodsId = item.goodsId
                obj.id = item.id
                specNameList.push(obj)
            });
            dataList.goodsSpecList = specNameList
            console.log('我是规格的名称', specNameList)
            // 规格数据
            let goodsSpecItems = []
            for (let i = 0; i < specificationData.length; i++) {
                specificationData[i].displayOrder = i + 1
                if (specificationData[i].specificationitem.length == 0) {
                    this.specEmpty = true
                }
                for (let j = 0; j < specificationData[i].specificationitem.length; j++) {
                    specificationData[i].specificationitem[j].titleItem = specificationData[i].title
                    specificationData[i].specificationitem[j].displayOrder = j + 1
                    specificationData[i].specificationitem[j].status = specificationData[i].specificationitem[j].status
                    specificationData[i].specificationitem[j].type =  specificationData[i].specificationitem[j].type ?  specificationData[i].specificationitem[j].type : '1'
                    goodsSpecItems.push(specificationData[i].specificationitem[j])
                    console.log('我是规格123',specificationData[i].specificationitem[j])
                }
            }
            let specArrs = JSON.parse(JSON.stringify(goodsSpecItems))
            specArrs.forEach((element, index) => {
                specArrs[index].status = element.status ? 1 :0
            });
            console.log(specArrs, '===========')
            dataList.goodsSpecItemList = specArrs
            let leng = this.spec.specificationData.length
            let namearr = []
            for (let i = 0; i < leng; i++) {
                if (this.spec.specificationData[i].isMainSpec == 1) {
                    let name = this.spec.specificationData[i].title
                    for (let j = 0; j < this.spec.specificationData[i].specificationitem.length; j++) {
                        if (this.spec.specificationData[i].specificationitem[j].show == 1) {
                            if (this.spec.specificationData[i].specificationitem[j].status) {
                                name = name + ':' + this.spec.specificationData[i].specificationitem[j].title
                                namearr.push(name)
                            }
                        }
                    }
                }
            }
            defaultSpec = namearr.join(',')
            dataList.defaultSpec = defaultSpec
            // console.log('sku',dataList.defaultSpec)
            // console.log('我是真的规格item',dataList.goodsSpecItemList)


            // // 详情
            let { isColorShow, iconImg, data, diyPageId } = this.details
            dataList.isColorShow = isColorShow
            dataList.iconImg = iconImg
            dataList.data = data
            dataList.diyPageId = diyPageId

            // // 权限
            let { numMax, numMin, mostPurchases, jurisdictionMemberBrowse, jurisdictionMemberPurchase, jurisdictionLabsBrowse, jurisdictionLabsPurchase } = this.buyPower
            dataList.numMax = numMax ? numMax : 0
            dataList.numMin = numMin ? numMin : 0
            dataList.mostPurchases = mostPurchases ? mostPurchases : 0
            dataList.jurisdictionMemberBrowse = jurisdictionMemberBrowse
            dataList.jurisdictionMemberPurchase = jurisdictionMemberPurchase
            dataList.jurisdictionLabsBrowse = jurisdictionLabsBrowse
            dataList.jurisdictionLabsPurchase = jurisdictionLabsPurchase

            // // 营销
            let { promotionTitle, promotionTime, promotionMoney, presentIntegral, returnMoney, discount, isSustainedUse, serviceConditions, isShare } = this.setup

            dataList.promotionTitle = promotionTitle ? promotionTitle : '促销'

            dataList.promotionTime = promotionTime
            dataList.promotionMoney = promotionMoney ? promotionMoney : 0
            // 加到这
            dataList.presentIntegral = presentIntegral 
            dataList.returnMoney = returnMoney
            dataList.discount = discount
            dataList.isSustainedUse = isSustainedUse + ''
            dataList.serviceConditions = serviceConditions + ''
            dataList.isShare = isShare

            // 会员
            let { memberDiscount, memberDiscountMoney } = this.discount
            dataList.memberDiscount = memberDiscount
            dataList.memberDiscountMoney = memberDiscountMoney

            // 商品推荐
            let { recomType, recomCategoryName, recomCategoryNum, recomGoodsId } = this.recommend

            // // 商品推荐
            dataList.recomType = recomType
            // // 选择商品分类
            dataList.recomCategoryName = recomCategoryName
            // // 选择显示个数
            dataList.recomCategoryNum = recomCategoryNum ? recomCategoryNum : 0
            // 商品ids
            dataList.recomGoodsId = recomGoodsId

            // 定制服务
            let { letterStatus, letterFree, letterTime, letterContent, cardType, cardContent, cardStatus, packetType, packetStatus, packetContent, packBoxStatus, packBoxContent } = this.server

            // return false
            // 刻字服务的状态
            dataList.letterStatus = letterStatus
            // 限时免费
            dataList.letterFree = letterFree
            // 限时免费的时间
            let letter = ''
            let resNum = 0
            letterTime.forEach((element,index) => {
                if (letterTime[index]) {
                    resNum++
                    letterTime[index] = goodsUtils.timeStamp(element)
                }
            }); 
            dataList.letterTimeNum = resNum          
            dataList.letterTime = letterTime.join(',')
            dataList.letterContent = letterContent


            // 卡片状态
            dataList.cardStatus = cardStatus
            // 卡片类型
            dataList.cardType = cardType
            // 选择卡片内容
            dataList.cardContent = cardContent
            
            // 选择套装状态
            dataList.packetStatus = packetStatus
             // 套装类型
            dataList.packetType = packetType
            // 套装
            dataList.packetContent = packetContent

            dataList.packBoxStatus = packBoxStatus

            dataList.packBoxContent = packBoxContent
            return dataList
        },
        // 返回列表
        backList() {
            // 记录一个值返回
            this.$router.push(`/@/views/goodslist/GoodsList?status=${this.status}`)
        },
        // 获取商品数据
        getGoods(id) {
            console.log(id)
            goods.goodsEdit({
                id: id
            }).then(res => {
                // promotionTime
                let code = res.code
                if (code == '1') {
                    let resData = res.data
                    this.handleGoods(resData)
                    this.spinShow = false
                }else {
                    this.$Message.error('请求失败')
                }
            }).catch(err => {
                console.log(err)
                console.log('我是编辑的时候出错了')
            })
        },
        handleGoods(res) {
            // 商品详情的数据
            let { displayOrder, title, subTitle, englishSubTitle, keyword, type, categoryId, price, originalCost, costPrice, thumb, thumbs, video, stockCnf, vituralSales, isShowSalesCount, ednum, edmoney, edareas, dispatchStatus, templateId, isInvoiceSupport, putawayType, isPutaway, isPutawayTime, putawayTime, searchShow, isSales, cargoTime, uniformPostagePrice, payByPost } = res
            this.info.displayOrder = displayOrder ? displayOrder : 0
            this.info.title = title ? title : ''
            this.info.subTitle = subTitle ? subTitle : ''
            this.info.englishSubTitle = englishSubTitle ? englishSubTitle : ''
            this.info.keyword = keyword ? keyword : ''
            this.info.type = type ? type + '' : ''
            if (categoryId == undefined) {
                this.info.categoryId = []
            } else if (categoryId == '') {
                this.info.categoryId = []
            } else {
                let con = categoryId.split(',')
                this.info.categoryId = con
            }

            // 多选列表
            this.info.price = price ? price : 0
            this.info.originalCost = originalCost ? originalCost : ''
            this.info.costPrice = costPrice ? costPrice : ''
            // 判断图片的信息
            this.info.thumb = thumb ? thumb : ''
            
             if (!thumbs) {
                this.info.thumbs = []
            } else {
                this.info.thumbs = thumbs.split(',')
            }
            this.info.video = video ? video : ''
            this.info.stockCnf = stockCnf ? stockCnf + '' : '0'
            this.info.vituralSales = vituralSales
            this.info.isShowSalesCount = isShowSalesCount ? true : false
            this.info.ednum = ednum ? ednum : ''
            this.info.edmoney = edmoney ? edmoney : ''
            if (!edareas) {
               this.info.edareas = []
            } else {
                this.info.edareas = edareas.split(',')
            }
            // 运费状态的模板
            this.info.dispatchStatus = dispatchStatus ? dispatchStatus : '1'
            console.log('难受',templateId)
            this.info.templateId = templateId ? templateId + '' : '1'
            
            // 统一邮费的价格
            this.info.uniformPostagePrice = uniformPostagePrice ? uniformPostagePrice : ''
            this.info.payByPost = payByPost ? payByPost + '' : '0'
            this.info.isInvoiceSupport = isInvoiceSupport ? true : false
            this.info.putawayType = putawayType ? putawayType : '微信小程序'
            this.info.isPutawayTime = isPutawayTime ? isPutawayTime + '' : '0'
            // 是否选择上架时间
            if (this.status < 0) {
                this.info.isPutaway = '0'
                console.log('仓库或回收站,时间',this.info.putawayTime)
            } else {
                // this.info.putawayTime = goodsUtils.timeFun(putawayTime)
            }
            if (this.role == '2') {
                console.log('我不是添加的时间',putawayTime)
                if (putawayTime) {
                    if (putawayTime > goodsUtils.timeStampFun()) {
                        this.info.putawayTime = goodsUtils.timeFun(putawayTime)
                    } else {
                        this.info.putawayTime = goodsUtils.timeFun(goodsUtils.timeStampFun())
                    }
                }
            } else {
                if (putawayTime) {
                    this.info.putawayTime = goodsUtils.timeFun(putawayTime)
                }
            }
            this.info.searchShow = searchShow ? searchShow : '0'
            this.info.isSales = isSales ? isSales + '' : '0'
            this.info.cargoTime = cargoTime ? cargoTime : ''

            // 商品规格的信息 (规格的数据没有写)
            let { goodsCode, barCode, weight, vituralStock, isShowStock, enableSpec, specs, options, defaultSpec } = res
            this.spec.goodsCode = goodsCode ? goodsCode : ''
            this.spec.barCode = barCode ? barCode : ''
            this.spec.weight = weight ? weight : 0
            this.spec.isShowStock = isShowStock ? true : false
            // console.log('请求的',this.spec.isShowStock)
            // this.spec.showSpec = showSpec == 0 ? '0' : '1'

            // 启用规格的状态 
            this.spec.enableSpec = !enableSpec ? false : true
            // 判断复制的
            if (this.role == '2' && this.spec.enableSpec) {
                this.virtualStock = 0
            } else {
                this.spec.vituralStock = vituralStock
            }
            // 判断编辑 和 复制的
            if (this.spec.enableSpec) {
                this.spec.vituralStock = 0
            }
            // 规格信息
            // this.spec.goodsOptionList = specs
            specs.forEach((element,i) => {
                let arrList = {}
                arrList.title = element.title
                console.log(',.......是的',element)
                arrList.isMainSpec = element.isMainSpec ? element.isMainSpec + '' : '0'
                element.itemList.forEach((item,index) => {
                    element.itemList[index].status = element.itemList[index].status == 1 ? true : false 
                    element.itemList[index].type = element.itemList[index].type + ''
                });
                arrList.goodsId = element.goodsId
                arrList.id = element.id
                arrList.specificationitem = element.itemList
                this.spec.specificationData.push(arrList)
            });
            console.log('规格的东西',this.spec.specificationData)
            
            this.spec.defaultSpec = defaultSpec ? defaultSpec : ''


            // 商品详情 data(详情模板)
            let { isColorShow, iconImg, data, diypageALl } = res
            this.details.isColorShow = isColorShow ? isColorShow : '0'
            // console.log(iconImg)
            this.details.iconImg = ''
            
            if(diypageALl){
                this.details.diyPageId = diypageALl ? diypageALl.diyPageId + "" : this.details.templatesList[0].id + ''
                this.details.tempId = diypageALl ? diypageALl.diyPageId + "" : this.details.templatesList[0].id + ''
                // 模板的数据
                this.details.templatesList.map((v,i) => {
                    // console.log('**',v)
                    if (v.id == this.details.diyPageId) {
                        console.log('id的.....',v.id,diypageALl)
                        this.details.templatesList[i].data = diypageALl.data ? JSON.parse(diypageALl.data) : ''
                        this.details.data = diypageALl.data ? JSON.parse(diypageALl.data) : ''
                    }
                });
                console.log('我是第二个',this.details.data)
            } else {
                console.log('222222222222222')
                let newObj = {
                    diyPageId:this.details.templatesList[0].id+'',
                    tempId:this.details.templatesList[0].id+'',
                    templatesList:this.details.templatesList,
                    data:this.details.templatesList[0].data
                }
                this.details.diyPageId = newObj.diyPageId
                this.details.tempId = newObj.tempId
                this.details.templatesList = newObj.templatesList
                this.details.data = newObj.data
                console.log('模板的..........',this.details)
            }
            
            // 购买权限
            let { numMax, numMin, mostPurchases, jurisdictionMemberBrowse, jurisdictionMemberPurchase, jurisdictionLabsBrowse, jurisdictionLabsPurchase } = res
            this.buyPower.numMax = numMax
            this.buyPower.numMin = numMin
            this.buyPower.mostPurchases = mostPurchases
            this.buyPower.jurisdictionMemberBrowse = jurisdictionMemberBrowse
            this.buyPower.jurisdictionMemberPurchase = jurisdictionMemberPurchase
            this.buyPower.jurisdictionLabsBrowse = jurisdictionLabsBrowse
            this.buyPower.jurisdictionLabsPurchase = jurisdictionLabsPurchase

            // 商品营销
            let { promotionTitle, promotionTime, promotionMoney, presentIntegral, returnMoney, discount, isSustainedUse, serviceConditions, isShare } = res
            this.setup.promotionTitle = promotionTitle
            if (!promotionTime) {
                this.setup.promotionTime = []
            } else {
                this.setup.promotionTime = promotionTime.split(',')
            }
            this.setup.promotionMoney = promotionMoney
            this.setup.presentIntegral = presentIntegral
            this.setup.returnMoney = returnMoney
            this.setup.discount = discount ? discount : 0
            this.setup.isSustainedUse = isSustainedUse ? isSustainedUse + '' : '0'
            this.setup.serviceConditions = serviceConditions ? serviceConditions + '' : '0'
            this.setup.isShare = isShare ? isShare : '0'


            // 会员
            let { memberDiscount, memberDiscountMoney } = res
            this.discount.memberDiscount = memberDiscount
            this.discount.memberDiscountMoney = memberDiscountMoney

            // 商品推荐  onlyData 暂时还没有
            let { recomType, recomCategoryName, recomCategoryNum, recomGoodsId, recomList } = res
            // // 商品推荐
            this.recommend.recomType = recomType ? recomType : '0'
            // // 选择商品分类
            this.recommend.recomCategoryName = recomCategoryName ? recomCategoryName + '' : ''
            console.log('我像看看谁先?1')
            // // 选择显示个数
            this.recommend.recomCategoryNum = recomCategoryNum
            // 选择单品  判断是空 还是 undefined
            if(recomGoodsId ? recomGoodsId : '' == '') {
                this.recommend.recomGoodsId = []
            } else {
                this.recommend.recomGoodsId = recomGoodsId.split(',')
            }
            if (recomList) {
                this.recommend.recomList = recomList
            } else {
                this.recommend.recomList = []
            }
            // 获取的商品推荐的信息
            console.log(recomList)
            // this.recommend.recomList = recomListv
            


            // 定制服务
            let { letterStatus, letterFree, letterTime, letterContent, cardType, cardContent, cardStatus, packetType, packetStatus, packetContent, packBoxStatus, packBoxContent  } = res
            
            console.log(letterTime,'-----------')
            // 刻字服务的状态
            this.server.letterStatus = letterStatus ? letterStatus : 2
            // 限时免费
            this.server.letterFree = letterFree ? letterFree + '' : '2'
            // 限时免费的时间
            let time = []
            if (!letterTime) {
                time = []
            } else {
                time = letterTime.split(',')
            }
            time.forEach((element,index) => {
                if (element) {
                    time[index] = goodsUtils.timeFun(element)
                }
            });
            this.server.letterTime = time
            this.server.letterContent = letterContent ? letterContent : ''

            // 卡片类型
            this.server.cardType = cardType ? cardType + '' : '2'
            // 选择卡片内容
            if (!cardContent) {
                this.server.cardContent =[]
            } else {
                this.server.cardContent = cardContent.split(',')
            }
            
            
            // 卡片状态
            this.server.cardStatus = cardStatus ? cardStatus : 2
            
            // 套装类型
            this.server.packetType = packetType ? packetType + '' : '2'
            // 选择套装状态
            this.server.packetStatus = packetStatus ? packetStatus : 2
            // 套装
            if (!packetContent) {
                this.server.packetContent =[]
            } else {
                this.server.packetContent = packetContent.split(',')
            }


            // 选择包装盒状态
            this.server.packBoxStatus = packBoxStatus ? packBoxStatus : 2
            // 包装盒
            this.server.packBoxContent = packBoxContent
        },
        comData(data) {
            this.details.data = data
            console.log('我是子组件传递的值',this.details.data,this.details.diyPageId)
        },
        detailValidateData(value) {
            this.detialsBool = value
        },
        specStartFun() {
            console.log('我是调用的哈哈哈')
            this.spec = {
                goodsCode: '',
                barCode: '',
                weight: 0,
                vituralStock: 0,
                isShowStock: true,
                enableSpec: false,
                // 规格是否前端显示
                // showSpec: '0',
                // 规格的数据
                specificationData: [],
                // 项目数据值
                defaultSpec: ''
            },
            this.startFun()
            this.tabsName = localStorage.getItem('tabName') ? localStorage.getItem('tabName') : '基本信息'
        }
    }
}
</script>

<style scoped>
#goods-add {
  background-color: #fff;
  min-width: 700px;
}
.tabs {
  padding: 15px 10px;
  margin: -16px;
}

.tail {
    height: 40px;
    margin-top: 20px;
}
.tail div{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.tail div button {
    margin-right: 10px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
}
.currentTitle label{
  font-size: 14px;
  color: #000;
}
</style>
