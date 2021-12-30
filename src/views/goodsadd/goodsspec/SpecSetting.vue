<template>
    <div class="spec-seting">
        <div class="currentTitle">商品列表/<label> 规格设置</label></div>
         <imgSelect ref="imgRefsBanner" @listentoptpmfile="getimgrefreshtablebanner" :options="{type: 'multiimage',mode: 'diy'}"></imgSelect>
        <imgSelect ref="imgRefsThumb" @listentoptpmfile="getimgrefreshtablethumb"  :options="{type: 'image',mode: 'diy'}"></imgSelect>
        <imgSelect ref="imgRefsHareimg" @listentoptpmfile="getimgrefreshtableshareimg" :options="{type: 'image',mode: 'diy'}"></imgSelect>
        <Card>
            <div class="content">
                <div v-for="(item, index) in options" :key="index" class="content-line">
                    <div class="title-list">
                        <div v-if="index == 0" class="title-box">
                            <span class="span-title mar-right" v-for="(itemTitle, indexTitle) in headName" :key="indexTitle">{{itemTitle}}</span>
                        </div>
                        <div class="placeholder" v-if="index == 0"></div>
                        <div class="name-list">
                            <span class="span-title mar-right" v-for="(itemName, index) in item.title" :key="index">{{itemName}}</span>
                        </div>
                    </div>
                    <div class="img-list">
                        <p v-if="index == 0">图片上传</p>
                        <div class="item-cons">
                            <div class="banners img-boxs">
                                <div v-if="index == 0" class="placeholder img-titles">橱窗轮播图片</div>
                                <div class="img-row">
                                    <div class="temcontainers" v-for="(imgitem, imgitemindex) in item.banner" :key="imgitemindex">
                                        <div v-if="item.banner.length > 0">
                                            <img :src="imgitem">  
                                        </div>  
                                        <div v-if="item.banner.length > 0" class="del-icons"><span @click="imgdeletebanner(imgitemindex,index)">x</span></div>
                                    </div>
                                    <div class="imgselectbuttons" v-if="item.banner.length != 9">
                                        <Icon @click="imgBannerFun(index)"  type="md-add" style="font-size: 26px;" class="updata-imgs" />
                                    </div>   
                                </div>
                            </div>
                            <div class="thumb img-boxs">
                                <div v-if="index == 0" class="placeholder img-titles">分类 | 购物车图</div>
                                <div class="img-row img-center">
                                    <div class="temcontainers">
                                        <div v-if="item.thumb.length != ''">
                                            <img :src="item.thumb">  
                                        </div>  
                                        <div v-if="item.thumb.length > 0" class="del-icons"><span @click="imgdeletethumb(index)">x</span></div>
                                    </div>
                                     <div class="imgselectbuttons" v-if="item.thumb == ''">
                                        <Icon type="md-add" @click="imgThumbFun(index)"  style="font-size: 26px;" class="updata-imgs" />
                                    </div>   
                                </div>
                            </div>
                            <div class="shareimg img-boxs">
                                <div v-if="index == 0" class="placeholder img-titles">分享图</div>
                                <div class="img-row img-center">
                                    <div class="temcontainers">
                                    <div v-if="item.shareimg.length != ''">
                                            <img :src="item.shareimg" alt="">  
                                        </div>  
                                        <div v-if="item.shareimg.length > 0" class="del-icons"><span @click="imgdeleteshareimg(index)">x</span></div>
                                    </div>
                                    <div class="imgselectbuttons" v-if="item.shareimg == ''">
                                        <Icon type="md-add" style="font-size: 26px;" class="updata-imgs"  @click="imgHareimgFun(index)" />
                                    </div>   
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="virtual-stock-list mar-right">
                        <p v-if="index == 0">虚拟库存</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="virtualStocks" size="small" />
                            <div class="sync" @click="virtualStocksFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.virtualStock" size="small" style="width: 80px" />
                    </div>
                    <div class="stock-list mar-right">
                        <p v-if="index == 0">实际库存</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" :disabled="true" v-model="stocks" size="small" />
                            <div class="sync" @click="stocksFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.stock" :disabled="true" size="small" style="width: 80px" />
                    </div>
                    <div class="productprice-list mar-right">
                        <p v-if="index == 0">预售价</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="productprices" size="small" />
                            <div class="sync" @click="productpricesFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.productprice" size="small" style="width: 80px" />
                    </div>
                    <div class="marketprice-list mar-right">
                        <p v-if="index == 0">现价</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" :disabled="true" v-model="marketprices" size="small" />
                            <div class="sync" @click="marketpricesFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.marketprice" :disabled="true" size="small" style="width: 80px" />
                    </div>
                    <div class="costprice-list mar-right">
                        <p v-if="index == 0">原价</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="costprices" size="small" />
                            <div class="sync" @click="costpricesFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.costprice" size="small" style="width: 80px" />
                    </div>
                    <div class="suit-code-list mar-right">
                        <p v-if="index == 0">套装编码</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="suitCodes" size="small" />
                            <div class="sync" @click="suitCodesFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.suitCode" size="small" style="width: 80px" />
                    </div>
                    <div class="goods-code-list mar-right">
                        <p v-if="index == 0">规格编码</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="goodsCodes" size="small" />
                            <div class="sync" @click="goodsCodesFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.goodsCode" size="small" style="width: 80px" />
                    </div>
                    <div class="color-code-list mar-right">
                        <p v-if="index == 0">试色编码</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="colorTestCodes" size="small" />
                            <div class="sync" @click="colorTestCodesFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.colorTestCode" size="small" style="width: 80px" />
                    </div>
                    <div class="productsn-list mar-right">
                        <p v-if="index == 0">商品编码</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="productsns" size="small" />
                            <div class="sync" @click="productsnsFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.productsn" size="small" style="width: 80px" />
                    </div>
                    <div class="weight-list mar-right">
                        <p v-if="index == 0">重量</p>
                        <div class="placeholder" v-if="index == 0">
                            <Input style="width: 50px" v-model="weights" size="small" />
                            <div class="sync" @click="weightsFun" size="small">
                                <Icon type="md-done-all" size="8px" />
                            </div>
                        </div>
                        <Input v-model="item.weight" size="small" style="width: 80px" />
                    </div>
                    <div class="url-list mar-right">
                        <p v-if="index == 0">操作(点击获取)</p>
                        <div class="placeholder" v-if="index == 0"></div>
                        <span @click="linkFun(index)">小程序路径</span>
                    </div>
                    <div class="save-list">
                        <p v-if="index == 0">操作</p>
                        <div class="placeholder" v-if="index == 0"></div>
                        <span @click="saveFun(index)">保存</span>
                    </div>
                </div>
            </div>
            <div class="page">
                <Page
                :current="current"
                :total="total"
                :page-size="size"
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
                @on-change="pagefun"
                :show-elevator="true"
                :show-total="true"
                ></Page>
            </div>
        </Card>
        <Modal v-model="linkBoo">
            <Input style="width: 300px" v-model="linkData" />
            <div slot="footer"></div>
        </Modal>
        <div class="formBtn">
            <Button type="primary" class="comBtn" :disabled="options.length == 0" :loading="loading" @click="save">全部保存</Button>
            <Button type="default" class="comBtn" @click="callBack">返回列表</Button>
        </div>
    </div>
</template>

<script>
import imgSelect from '@/components/imgSelect/imgselect'
import goods from '@/api/request/goods'
export default {
    data() {
        return {
            virtualStocks: '',
            stocks: '',
            productprices: '',
            marketprices: '',
            costprices: '',
            suitCodes: '',
            goodsCodes: '',
            colorTestCodes: '',
            productsns: '',
            weights: '',
            linkBoo: false,
            loading: false,
            headName: [],
            options: [],
            current: 1,
            total: 0,
            size: 10,
            bannerItemIndex: '',
            thumbItemIndex: '',
            hareimgItemIndex: '',
            skuIds: '',
            linkData: '',
            status: '',
            posiIntZeros: /^(0|[1-9][0-9]*)$/,
            priceRes: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
        }
    },
    components: {
        imgSelect,
    },
    mounted() {
        this.skuIds = this.$route.query.id
        this.status = this.$route.query.name
        this.getData()
    },
    methods: {
        virtualStocksFun() {
            console.log(typeof this.virtualStocks)
            if (!this.posiIntZeros.test(this.virtualStocks)) {
                this.$Message.error('虚拟库存同步的格式不正确')
                return false
            }
            console.log(this.options)
            this.options.forEach((element, index) => {
                this.options[index].virtualStock = this.virtualStocks
            })
        },
        stocksFun() {
            
        },
        productpricesFun() {
            if (!this.priceRes.test(this.productprices)) {
                this.$Message.error('预售价同步的格式不正确')
                return false
            }
            this.options.forEach((element, index) => {
                this.options[index].productprice = this.productprices
            })
        },
        marketpricesFun() {
            
        },
        costpricesFun() {
            if (!this.priceRes.test(this.costprices)) {
                this.$Message.error('原价同步的格式不正确')
                return false
            }
            this.options.forEach((element, index) => {
                this.options[index].costprice = this.costprices
            })
        },
        suitCodesFun() {
            this.options.forEach((element, index) => {
                this.options[index].suitCode = this.suitCodes
            })
        },
        goodsCodesFun() {
            this.options.forEach((element, index) => {
                this.options[index].goodsCode = this.goodsCodes
            })
        },
        colorTestCodesFun() {
            this.options.forEach((element, index) => {
                this.options[index].colorTestCode = this.colorTestCodes
            })
        },
        productsnsFun() {
            this.options.forEach((element, index) => {
                this.options[index].productsn = this.productsns
            })
        },
        weightsFun() {
            if (!this.priceRes.test(this.costprices)) {
                this.$Message.error('重量同步的格式不正确')
                return false
            }
            this.options.forEach((element, index) => {
                this.options[index].weight = this.weights
            })
        },
        getData() {
            this.options = []
            this.headName = []
            goods.skuDetail({
                'goodsId': this.skuIds,
                'size': this.size,
                'current': this.current
            }).then(res => {
                // console.log(res,'请求的数据')
                if (res.code == 1) {
                    this.total = res.data.total
                    this.current = res.data.current
                    this.size = res.data.size

                    this.integration(res.data.rows)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        integration(data) {
            data.forEach((element, index) => {
                data[index].title = element.title != '' ? element.title.split(',') : []
                let arr = []
                arr = data[index].specs ? data[index].specs.split(',') : []
                arr.forEach((ele, indexs) => {
                    let titleList = ele ? ele.split(':') : []
                    if (index == 0) {
                        if (titleList.length != 0) {
                            this.headName.push(titleList[0])
                        }
                    }
                    console.log(this.headName,'ahahahah')
                })
                let obj = {}
                obj.costprice = element.costprice ? element.costprice : ''
                obj.goodsId = element.goodsId
                obj.id = element.id
                obj.marketprice = element.marketprice ? element.marketprice : ''
                obj.specs = element.specs ? element.specs : ''
                obj.stock = element.stock ? element.stock : ''
                obj.stockWarning = element.stockWarning ? element.stockWarning : ''
                obj.title = element.title
                // 默认值
                obj.banner = element.banner ? JSON.parse(element.banner) : []
                obj.thumb = element.thumb ? element.thumb : ''
                obj.shareimg = element.shareimg ? element.shareimg : ''

                obj.virtualStock = element.virtualStock ? element.virtualStock : 0
                obj.productprice = element.productprice ? element.productprice : ''
                obj.suitCode = element.suitCode ? element.suitCode : ''
                obj.goodsCode = element.goodsCode ? element.goodsCode : ''
                obj.colorTestCode = element.colorTestCode ? element.colorTestCode : ''
                obj.productsn = element.productsn ? element.productsn : ''
                obj.weight = element.weight ? element.weight : 0
                // obj.linkBoo = false
                this.options.push(obj)
                // {
                //     names: ['N9','普通管'],
                //     banner: ['https://shuminiprogstorage.blob.core.chinacloudapi.cn/shuminiprogstorage/attachment/images/2/2019/04/Bp4F9FzLFIg9o9OZdlLliI47lirEid.jpg','https://shuminiprogstorage.blob.core.chinacloudapi.cn/shuminiprogstorage/attachment/images/2/2019/04/Bp4F9FzLFIg9o9OZdlLliI47lirEid.jpg'],
                //     thumb: 'https://shuminiprogstorage.blob.core.chinacloudapi.cn/shuminiprogstorage/attachment/images/2/2019/04/Bp4F9FzLFIg9o9OZdlLliI47lirEid.jpg',
                //     shareimg: 'https://shuminiprogstorage.blob.core.chinacloudapi.cn/shuminiprogstorage/attachment/images/2/2019/04/Bp4F9FzLFIg9o9OZdlLliI47lirEid.jpg',
                //     stock: '3',
                //     virtualStock: '3',
                //     productprice: '123',
                //     costprice: '123',
                //     suitCode: '123',
                //     goodsCode: '123',
                //     colorTestCode: '123',
                //     productsn: '123',
                //     weight: '123',
                //     linkBoo :  false
                // },
                // costprice: 0
                // current: 1
                // goodsId: 50370
                // id: 50373
                // marketprice: 3
                // size: 10
                // specs: "规格1:规1,规格2:规3"
                // stock: 0
                // stockWarning: 0
                // title: "规1,规3"
                // let {costprice, goodsId, id, marketprice, specs, stock, stockWarning, title} = element
            })
            console.log(data)
        },
        imgBannerFun(index) {
            this.bannerItemIndex = index
            this.$refs.imgRefsBanner.uploadflg();
        },
        imgThumbFun(index) {
            this.thumbItemIndex = index
            this.$refs.imgRefsThumb.uploadflg();
        },
        imgHareimgFun(index) {
            this.hareimgItemIndex = index
            this.$refs.imgRefsHareimg.uploadflg();
        },
        getimgrefreshtablebanner(data) {
            data.forEach((element,index) => {
                if (this.options[this.bannerItemIndex].banner.length < 9) {
                    this.options[this.bannerItemIndex].banner.push(data[index].imgAddress)
                } else {
                    this.$Message.error('轮播图最多上传九个')
                    return
                }
            });
        },
        getimgrefreshtablethumb(data) {
            this.options[this.thumbItemIndex].thumb = data[0].imgAddress
        },
        getimgrefreshtableshareimg(data) {
            this.options[this.hareimgItemIndex].shareimg = data[0].imgAddress
        },
        imgdeletebanner(imgitemindex, index) {
            console.log(imgitemindex, index)
            console.log(this.options[index].banner)
            this.options[index].banner.splice(imgitemindex,1)
        },
        imgdeletethumb(index) {
            console.log(index)
            this.options[index].thumb = ''
        },
        imgdeleteshareimg(index) {
            console.log(index)
            this.options[index].shareimg = ''
        },
        linkFun(index) {
            if (this.options[index].id) {
                this.linkBoo = true
                this.linkData = '/pages/goods/detail/index?id=' + this.skuIds + '&goodsSkuid=' + this.options[index].id
            }
        },
        verification(data) {
            console.log(data, '我是验证的数据')
            let len = data.length
            let posiIntZeros = /^(0|[1-9][0-9]*)$/
            let priceRes = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
            for (let i = 0; i < len.length; i++) {
                console.log(data[i])
                console.log('我是虚拟的:',data[i].virtualStock != '','我是预售价' )
                if (data[i].virtualStock != '') {
                    console.log('我是虚拟的')
                    if (!posiIntZeros.test(data[i].virtualStock)) {
                        this.$Message.error('虚拟库存格式不对')
                        return false
                    }
                }
                if (data[i].productprice != '') {
                    if (!priceRes.test(data[i].productprice)) {
                        this.$Message.error('预售价格式不对')
                        return false
                    }
                }
                if (data[i].costprice != '') {
                    if (!priceRes.test(data[i].costprice)) {
                        this.$Message.error('原价格式不对')
                        return false
                    }
                }
                if (data[i].weight != '') {
                    if (!priceRes.test(data[i].weight)) {
                        this.$Message.error('重量格式不对')
                        return false
                    }
                }
            }
            return true
        },
        saveFun(index) {
            console.log(index, this.options[index])
            let data = JSON.parse(JSON.stringify(this.options))
            let content = data[index]
            if (content.title.length != 0) {
                content.title = content.title.join(',')
            } else {
                content.title = ''
            }
            let obj = []
            obj.push(content)
            let res = this.verification(obj)
            if (!res) {
                return
            }
            // return false
            this.loading = true
            goods.skuSaveAll({
                'id': content.id,
                'goodsId': this.skuIds,
                'optionList': obj
            }).then(res => {
                console.log(res)
                this.loading = false
                if (res.code == 1) {
                    this.$Message.success('保存成功')
                    this.getData()
                    // this.callBack()
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        save() {
            console.log(this.options)
            let data = JSON.parse(JSON.stringify(this.options))
            data.forEach((ele, index) => {
                if (ele.title.length != 0) {
                    data[index].title = ele.title.join(',')
                } else {
                    data[index].title = ''
                }
                console.log(data[index].title, index)
            })
            let res = this.verification(data)
            if (!res) {
                return
            }
            // return false
            this.loading = true
            goods.skuSaveAll({
                'goodsId': this.skuIds,
                'optionList': data
            }).then(res => {
                console.log(res)
                this.loading = false
                if (res.code == 1) {
                    this.$Message.success('保存成功')
                    this.callBack()
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        callBack() {
            this.$router.push(`/@/views/goodslist/GoodsList?status=${this.status}`)
        },  
        pagefun(index) {
            this.current = index;
            this.getData();
        },
        pageSizeFun(data) {
            this.size = data
            this.getData()
        }
    }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
