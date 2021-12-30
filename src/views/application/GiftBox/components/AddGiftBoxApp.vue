<template>
    <div class="add-gift-box-edit">
        <div class="currentTitle">定制礼盒</div>
        <imgSelect ref="imgDataRefs" :options="{type: 'image', mode: 'diy'}" @listentoptpmfile="getimageData" ></imgSelect>
        <Card>
            <Form ref="formData" :model="formData" :rules="rulesFormData" :label-width="140">
                <FormItem label="名称" prop="boxName">
                    <Input v-model="formData.boxName" style="width: 350px"></Input>
                </FormItem>
                <FormItem label="价格" prop="boxMoney">
                    <Input v-model="formData.boxMoney" style="width: 350px"></Input>
                </FormItem>
                <FormItem label="CODE" prop="boxCode">
                    <Input v-model="formData.boxCode" style="width: 350px"></Input>
                </FormItem>
                <FormItem label="虚拟库存" prop="vituralStock">
                    <Input v-model="formData.vituralStock" style="width: 350px"></Input>
                </FormItem>
                <FormItem label="实际库存" prop="stock">
                    <Input v-model="formData.stock" :disabled="true" style="width: 350px"></Input>
                </FormItem>
                <FormItem label="礼盒图片" class="ivu-form-item-required" prop="stock">
                    <Input v-model="formData.boxImg" readonly @on-search="openImg" search enter-button="选择图片" style="width: 350px"></Input>
                    <div class="img-box" v-if="formData.boxImg != ''">
                        <img class="img-info" :src="formData.boxImg">
                        <span @click="delImg">x</span>
                    </div>
                </FormItem>
                <FormItem label="所属分活动" prop="activatyId">
                    <Select v-model="formData.activatyId" style="width: 350px">
                        <Option v-for="(item,index) in activityList" :value="item.id + ''" :key="index">{{ item.activatyName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="填写产品编码" prop="productCode">
                    <Input v-model="formData.productCode" style="width: 350px"></Input>
                    <p style="color: #aaa;">产品编码用,分割</p>
                </FormItem>
                <!-- class="ivu-form-item-required" -->
                <!-- <FormItem label="赠品管理" prop="giftDate">
                     <add-gift @listentgoodData="listentgoodDatafuc($event)"
                        :selectGoods="containerData"
                        res="+选择赠品"
                    ></add-gift>
                </FormItem> -->
            </Form>
        </Card>
        <div class="formBtn">
          <Button type="primary" class="comBtn" :loading="loading" @click.native="save('formData')">保存设置</Button>
        </div>
    </div>
</template>

<script>
import imgSelect from '@/components/imgSelect/imgselect'
import order from '@/api/request/order'
import goods from "@/api/request/goods"
// import addGift from "@/components/addGood/addGift"
export default {
    data() {
        let money = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
        // let title = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
        let code = /^[A-Za-z0-9]+$/
        let num = /^[0-9]+$/
        const validatePass = (rule, value, callback) => {
            if (!money.test(value)) {
                console.log('我是验证的结果',money.test(value))
                callback(new Error('价格格式不对'));
            } else {
                callback();
            }
        };
        const titleval = (rule, value, callback) => {
            // if (!title.test(value)) {
            //     callback(new Error('名字格式不对'));
            // } else {
            //     callback()
            // }
            callback()
        }
        const codeval = (rule, value, callback) => {
            // if (!code.test(value)) {
            //     callback(new Error('CODE格式不对'));
            // } else {
            //     callback()
            // }
            callback()
        }
        const vituralStockVal = (rule, value, callback) => {
            if (!num.test(value)) {
                callback(new Error('虚拟库存格式不对'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            formData: {
                boxName: '',
                boxMoney: '',
                boxCode: '',
                vituralStock: '',
                stock: '',
                boxImg: '',
                activatyId: '',
                productCode: '',
                // giftDate: []
            },
            containerData: [],
            activityList: [],
            rulesFormData: {
                boxName: [
                    {required: true, message: '名称不能为空', trigger: 'blur'},
                    {validator: titleval, trigger: 'blur'}
                ],
                boxMoney: [
                    {required: true, message: '价格不能为空', trigger: 'blur'},
                    {validator: validatePass, trigger: 'blur'}
                ],
                boxCode: [
                    {required: true, message: 'CODE不能为空', trigger: 'blur'},
                    {validator: true, trigger: 'blur'}
                ],
                vituralStock: [
                    {required: true, message: '虚拟库存不能为空', trigger: 'blur'},
                    {validator: vituralStockVal, trigger: 'blur'}
                ],
                activatyId: [
                    {required: true, message: '所属分活动不能为空', trigger: 'change'}
                ],
                productCode: [
                    {required: true, message: '产品编码不能为空', trigger: 'blur'}
                ]
            },
            tempId: '',
            activityId: ''
        }
    },
    components: {
        // addGift,
        imgSelect
    },
    mounted() {
        this.init()
        this.selectList()
        this.$refs.formData.resetFields();
        this.tempId = this.$route.query.id
        this.activityId = this.$route.query.activityId
        if (this.tempId) {
            this.getData()
        }
    },
    methods: {
        init() {

        },
        getData() {
            order.giftBoxDetail({
                'id': this.tempId
            }).then(res =>{
                if (res.code == 1) {
                    this.integration(res.data)
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        integration(data) {
            data.activatyId = data.activatyId + ''
            data.boxMoney = data.boxMoney + ''
            data.vituralStock = data.vituralStock + ''
            // data.stock = data.stock ? data.stock : ''
            this.formData = data
            // this.getGiftGoods(data.giftDate)
        },
        // getGiftGoods(data) {
        //     let gifts = [];
        //     let giftGoods = JSON.parse(data)
        //     giftGoods.map((v, i) => {
        //         gifts.push(v.goodsId);
        //     });

        //     goods.selGoodsIds({
        //         ids: gifts
        //     }).then(res => {
        //         if (res.code == 1) {
        //             let list = []
        //             res.data.map((v, i) => {
        //                 let obj = {}
        //                 obj.id = v.id
        //                 obj.thumb = v.thumb
        //                 obj.price = v.price
        //                 obj.title = v.title
        //                 obj.vituralStock = v.vituralStock
        //                 obj.goodsName = v.title
        //                 obj.goodsId = v.id
        //                 obj.pic = v.thumb
        //                 list.push(obj)
        //             })
        //             this.containerData = list
        //             this.reduForm.giftDate = list
        //         }
        //     });
        // },
        selectList() {
            order.selectAllActivity().then(res => {
                if (res.code == 1) {
                    this.activityList = res.data
                    this.formData.activatyId = res.data[0].id + ''
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        openImg() {
            this.$refs.imgDataRefs.uploadflg()
        },
        getimageData(data) {
            this.formData.boxImg = data[0].imgAddress
        },
        // listentgoodDatafuc(data) {
        //     console.log(data)
        //     let rulegoodslist = [];
        //     for (let item in data) {
        //         let obj = {};
        //         (obj.goodsId = data[item].id), 
        //         (obj.goodsName = data[item].title);
        //         obj.pic = data[item].thumb;
        //         rulegoodslist.push(obj);
        //     }
        //     console.log(rulegoodslist);
        //     this.formData.giftDate = rulegoodslist
        // },
        delImg() {
            this.formData.boxImg = ''
        },
        save(name) {
            if (!this.tempId) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        if (this.formData.boxImg == "") {
                            this.$Message.error('礼盒图片不能为空')
                            return false
                        }
                        this.loading = true
                        order.giftBoxAdd({
                            'activityId': this.formData.activityId,
                            'boxName': this.formData.boxName,
                            'vituralStock': this.formData.vituralStock,
                            'stock': this.formData.stock,
                            'productCode': this.formData.productCode,
                            // 'giftDate': this.formData.giftDate,
                            'boxMoney': this.formData.boxMoney,
                            'boxImg': this.formData.boxImg,
                            'boxCode': this.formData.boxCode,
                            'activatyId': this.formData.activatyId
                        }).then(res => {
                            this.loading = false
                            if (res.code == 1) {
                                this.$Message.success('保存成功')
                                this.callBack()
                            } else {
                                this.$Message.error(res.message)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error('保存失败')
                        })
                    }
                }); 
            } else {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        if (this.formData.boxImg == "") {
                            this.$Message.error('礼盒图片不能为空')
                            return false
                        }
                        this.loading = true
                        order.giftBoxUpdate({
                            'id': this.tempId,
                            'boxName': this.formData.boxName,
                            'vituralStock': this.formData.vituralStock,
                            'stock': this.formData.stock,
                            'productCode': this.formData.productCode,
                            // 'giftDate': this.formData.giftDate,
                            'boxMoney': this.formData.boxMoney,
                            'boxImg': this.formData.boxImg,
                            'boxCode': this.formData.boxCode,
                            'activatyId': this.formData.activatyId
                        }).then(res => {
                            this.loading = false
                            if (res.code == 1) {
                                this.$Message.success('保存成功')
                                this.callBack()
                            } else {
                                this.$Message.error(res.message)
                            }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error('保存失败')
                        })
                    }
                }); 
            }
        },
        callBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scoped>
@import './AddGiftBoxApp.less';
</style>
