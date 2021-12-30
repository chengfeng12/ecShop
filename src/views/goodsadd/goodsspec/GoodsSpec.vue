<template>
    <div class="goods-spec">
        <imgSelect ref="imgRefs" :options="{type: 'image', mode: 'diy'}" @listentoptpmfile="getimgdata" ></imgSelect>
        <div class="goods-spec-info">
            <h3 class="title">库存设置</h3>
            <div class="basic-content">
                <div class="content-war">
                    <span class="content-war-span">商品编码</span>
                    <Input :maxlength="20" :disabled="isDisable ? true : false" v-model="spec.goodsCode" placeholder="商品编码" style="width: 260px"/>
                </div>
            </div>
            <div class="basic-content">
                <div class="content-war">
                    <span class="content-war-span">商品条码</span>
                    <Input :maxlength="20" :disabled="isDisable ? true : false" v-model="spec.barCode" placeholder="商品条码" style="width: 260px"/>
                </div>
            </div>
            <div class="basic-content">
                <div class="content-war">
                    <span class="content-war-span">商品重量</span>
                    <Input v-model="spec.weight" :disabled="isDisable ? true : false" placeholder="商品重量" style="width: 260px"/>&nbsp;克
                </div>
            </div>
            <div class="basic-content">
                <div class="content-war">
                    <span class="content-war-span">虚拟库存</span>
                    <Input v-model="spec.vituralStock" :disabled="isDisable ? true : false" placeholder="库存" style="width: 260px"/>
                    <Checkbox v-model="spec.isShowStock">显示库存</Checkbox>
                    <p>商品的剩余数量, 如启用多规格或为虚拟卡密产品，则此处设置无效.</p>
                </div>
            </div>
        </div>
        <div class="goods-spec-info">
            <h3 class="title">规格信息</h3>
            <div class="basic-content">
                <div class="content-war">
                    <Checkbox class="checkbox-spec" v-model="spec.enableSpec" @on-change="specFun">启用商品规格</Checkbox>
                    <p>启用商品规格后，商品的价格及库存以商品规格为准,库存设置为0则会到”已售罄“中，手机也不会显示, -1为不限制。</p>
                </div>
            </div>
            <div v-if="spec.enableSpec" class="basic-content">
                <div class="basic-content">
                    <div class="content-war">
                        <div class="prompt-information">
                            <ul>
                                <li>1.拖动规格可调整规格显示顺序, 更改规格及规格项后请点击下方的【刷新规格项目表】来更新数据。</li>
                                <li>2.每一种规格代表不同型号，例如颜色为一种规格，尺寸为一种规格，如果设置多规格，手机用户必须每一种规格都选择一个规格项，才能添加购物车或购买。</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="addspecification">
                <Card class="additem">
                    <p slot="title">启用规格</p>
                    <div>
                        <draggable v-model="spec.specificationData" :move="draggingFun" handle=".handle" v-bind="dragOptions" class="specification-container">
                            <transition-group type="transition">
                                <div class="specification-content" v-for="(item,index) in spec.specificationData" :key="index">
                                    <div class="specification-header">
                                        <Row>
                                        <Col span="1">
                                            <div style="padding: 5px;">
                                                <Checkbox true-value="1" false-value="0" v-model="item.isMainSpec" size="large"></Checkbox>
                                            </div></Col>
                                        <Col span="8">
                                        <Input v-model="item.title" placeholder="规格名称" /></Col>
                                        <Col span="3"><Button @click="specificationItemadd(item)" type="primary" long>+添加规格项</Button></Col>
                                        <Col span="1"><div @click="specificationDelete(item,index)" class="deletebutton"><Icon class="iconfont icon-delete" /></div></Col>
                                        <Col span="1"><div class="movebutton btn-a handle"><Icon class="iconfont icon-drag" /></div></Col>
                                        </Row> 
                                    </div>
                                    <div class="specification-body">
                                        <draggable v-model="item.specificationitem" handle=".handle-item" :move="draggableFun" v-bind="dragOptions"  class="specification-container">
                                            <transition-group type="transition">
                                                <div class="specification-item"  v-for="(items,indexs) in item.specificationitem" :key="indexs">
                                                    <div class="specification-item-top" >
                                                        <div><Checkbox true-value="1" false-value="0" 
                                                        @on-change="defaultShow(index,indexs)" :disabled="items.status" v-model="items.show" size="large"></Checkbox></div>
                                                        <div><input v-model="items.title" class="specification-item-input"/></div>
                                                        <div class="specification-radio">
                                                            <Radio @on-change="onchange(index,indexs)" v-model="items.status"></Radio>
                                                        </div>
                                                        <div @click="specificationItemDelete(item.specificationitem,indexs,index)">
                                                        <Icon class="iconfont icon-delete" /></div>
                                                        <div class="movebutton btn-a handle-item"><Icon class="iconfont icon-drag" /></div>
                                                    </div>
                                                    <div class="specification-item-bottom">
                                                        <div>
                                                            <Select @on-change="selectchange(items,indexs)" v-model="items.type">
                                                                <Option value='1'>输入</Option>
                                                                <Option value="2">颜色</Option>
                                                                <Option value="3">图片</Option>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Input class="specification-item-input" :disabled="!(items.type==1)" v-model="items.typeword" 
                                                            @on-change.stop="urlFun" />
                                                        </div>
                                                        <div v-show="items.type==2"><ColorPicker v-model="items.typeword" placement="top-start" /></div>
                                                        <div v-show="items.type==3">
                                                            <div class="imgselectbutton">
                                                            <Icon type="md-add" @click="imgFunSpec(index,indexs)" style="font-size: 26px;" />
                                                                <div class="sfmgshow" v-if="items.typeword">
                                                                    <img :src="items.typeword">  
                                                                </div>  
                                                                <div class="sfmgshowup" v-if="items.typeword" @click="imgdelete(items)">
                                                                    <Icon class="iconfont icon-delete" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="specification-item-money" style="margin-top: 5px">
                                                        <Input v-model="items.money" style="width: 300px"></Input>&nbsp;&nbsp;元
                                                    </div>
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </div>
                            </transition-group>
                        </draggable >
                        <div class="specification-add">
                            <div><Button @click="specificationAdd()" type="primary">+添加规格</Button></div>
                            <!-- <div><Button type="primary" @click="refreshtable()">刷新规格项目列表</Button></div> -->
                        </div>
                    </div>
                </Card>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import Sortable from "sortablejs";
import imgSelect from '@/components/imgSelect/imgselect';
import { constants } from 'crypto';
import goodsUtils from '@/utils/goodsUtils'
import goods from '@/api/request/goods'
export default {
    props: ['spec', 'id', 'role'],
    name: "addSpecification",
    components: {
        imgSelect,
        draggable,
        Sortable,
    },
    data () {
        return {
            // 规格数据
            // spec.specificationData:[],
            data:[],
            sfmgshowup:false,
            isDisable:this.spec.enableSpec,
            dragOptions: {
                animation: 200
            },
            specificationData: [],
            refresh: true,
            tempType: false,
            // 规格项中的暂存数据
            specItemIndex: '',
            specItemIndexs: '',
        }
    },
    watch:{
        spec:{
            handler(newValue,oldValue){
                // console.log('我是你你你你',newValue)
                if(newValue){
                    this.isDisable = newValue.enableSpec
                }
            },
            immediate:true,
            deep:true
        },
        // 要监听规格的内容变化
    },
    created() {

    },
    methods: {
        urlFun(e) {
            // e.stopPropagation()
        },
        imgFunSpec(index, indexs) {
            this.specItemIndex = index
            this.specItemIndexs = indexs
            this.$refs.imgRefs.uploadflg();
        },
        // 选择改变输入方式时清空输入框
        selectchange(items, indexs) {
            items.typeword = ""
        },

        // 删除选择的图片
        imgdelete(items) {
            items.typeword = ""
        },

        // 获取选择的图片并渲染、单选
        getimgdata(data) {
            this.spec.specificationData[this.specItemIndex].specificationitem[this.specItemIndexs].typeword = data[0].imgAddress
        },

        draggableFun(data) {},
        // 添加规格种类
        specificationAdd() {
            let obj = {}
            // 规格种类名
            obj.title = ""
            obj.isMainSpec = '1'
            // 规格种类内容
            obj.specificationitem = []
            this.spec.specificationData.push(obj)
        },

        // 添加规格项
        specificationItemadd(item) {
            let obj={};
            // 规格名称
            obj.title=""
            if (item.specificationitem.length == 0) {
                obj.status = true
            } else {
                obj.status = false
            }
            // 是否启用
            obj.show = '1'
            // 输入类型
            obj.type=''
            // 输入框内容
            obj.typeword=''
            obj.money = ''
            item.specificationitem.push(obj)
        },
        // 删除规格种类
        specificationDelete(item, index) {
            console.log(item,index)
            let goodsId = item.goodsId
            let id = item.id
            if (id) {
                // 删除的接口
                goods.specDel({
                    goodsId,
                    id
                }).then(res => {
                    if (res.code) {
                        this.$Message.success('删除成功')
                //         // 其他的方法
                        this.$emit('specStartFun')
                    } else {
                        this.$Message.error(res.message)
                    }
                }).catch(err => {
                    this.$Message.error('删除失败')
                })
            } else {
                this.spec.specificationData.splice(index,1) 
            }
        },

        draggingFun(item,index) {},

        // 删除规格
        specificationItemDelete(items, indexs, index) {
            if (this.spec.specificationData[index].specificationitem[indexs].status) {
                this.$Message.error('该规格项未默认规格项不能删除')
                return false
            }
            let goodsId = items[indexs].goodsId
            let specId = items[indexs].specId
            let id = items[indexs].id
            console.log(goodsId, specId, id)
            if (id) {
                // 请求接口
                goods.specItemDel({
                    goodsId,
                    specId,
                    id
                }).then(res => {
                    if (res.code) {
                        this.$Message.success('删除成功')
                //         // 其他的方法
                        this.$emit('specStartFun')
                    } else {
                        this.$Message.error(res.message)
                    }
                }).catch(err => {
                    this.$Message.error('删除失败')
                })
            } else {
                items.splice(indexs,1)
            }
        },
        defaultShow(index, indexs) {
            if (this.spec.specificationData[index].specificationitem[indexs].show == 0) {
                this.spec.specificationData[index].specificationitem[indexs].status == false
            }
        },
        //  单选按钮
        onchange(id, ids) {
            let _this = this
            _this.spec.specificationData[id] ? 
            _this.spec.specificationData[id].specificationitem.map((v,i) => {
                if(i == ids){
                    v.status = true
                }else{
                    v.status = false
                }
            }) : null
        },
        
        // 验证必填的
        // ruleFun() {
        //     let len = this.spec.specificationData.length
        //     for (let i = 0; i < len; i++) {
        //         if (!this.spec.specificationData[i].title) {
        //             this.$Message.error('规格名字不能为空')
        //             return false
        //         }
        //     }
        //     let nameList = []
        //     for (let i = 0; i < len; i++) {
        //         nameList.push(this.spec.specificationData[i].title)
        //     }
        //     for (let i = 0; i < nameList.length; i++) {
        //         if (nameList[i] == nameList[i + 1]) {
        //             this.$Message.error('规格项名字不能重复')
        //             return false
        //         }         
        //     }

        //     let specItem = []
        //     for (let i = 0; i < nameList.length; i++) {
        //         for (let j = 0; j < this.spec.specificationData[i].specificationitem.length; j++) {
        //             specItem.push(this.spec.specificationData[i].specificationitem[j].title)
        //         }
        //         for (let j = 0; j < specItem.length - 1; j++) {
        //             if (specItem[j] == specItem[j + 1]) {
        //                 this.$Message.error('同一规格下规格项名字不能重复')
        //                 return false
        //             }
        //         }
        //         specItem = []
        //     }


        //     for (let i = 0; i < len; i++) {
        //         for (let j = 0; j < this.spec.specificationData[i].specificationitem.length; j++) {
        //             // 判断规格项的
        //             if (!this.spec.specificationData[i].specificationitem[j].title) {
        //                 this.$Message.error('规格项名字不能为空')
        //                 return false
        //             }
        //             if (!(this.spec.specificationData[i].specificationitem[j].money + '')) {
        //                 this.$Message.error('规格项价格不能为空')
        //                 return false
        //             } else {
        //                 let res = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
        //                 if (!res.test(this.spec.specificationData[i].specificationitem[j].money)) {
        //                     this.$Message.error('规格项价格输入错误')
        //                     return false
        //                 }
        //             }
        //         }
        //     }
        //     return true
        // },
        // 显示规格的清空信息
        specFun() {
            if (!this.spec.enableSpec) {
                // 清空的是规格的数据
                this.spec.specificationData = []
                this.spec.goodsOptionList.theaddata = []
                this.spec.goodsOptionList.tbodydata = []
                this.isDisable = false
                this.refresh = false
            } else {
                this.spec.goodsCode = ''
                this.spec.barCode = ''
                this.spec.isShowStock = false
                this.spec.productsn = ''
                this.spec.suitCode = ''
                this.spec.colorTestCode = ''
                this.spec.weight = 0
                this.spec.vituralStock = 0
                this.isDisable = true
                this.refresh = true
            }
        }
  },
}
</script>

<style scoped>
@import "../../../assets/style/goodsAdd.css";
@import "../../../assets/style/addspecification.css";
.checkbox-spec {
    margin-left: 100px;
}
.prompt-information {
    margin-top: 10px;
    padding: 10px 30px;
    border: 1px solid #ccc;
}
.prompt-information li {
    margin-top: 5px;
    font-size: 11px;
}
</style>
