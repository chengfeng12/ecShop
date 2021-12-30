<style lang="less" scoped>
@import './AddRuleGoods.less';
</style>
<template>
    <div id="add-rule-goods">
      <div class="currentTitle">规则商品/
        <label>{{role == 1 ? '添加' : role == 2 ? '复制' : '编辑'}}规则商品</label>
      </div>
        <Card>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
                <FormItem label="商品名称" prop="title" style="position:relative;">
                    <Input type="text" v-model="formInline.title" @on-change="validTitle" style="width: 350px;" :maxlength="20" placeholder="请输入商品名称"></Input>
                    <span class="limitLength">{{titleLength}}/20</span>
                </FormItem>
                <FormItem label="商品价格" prop="price">
                    <Input type="text" style="width: 350px;" v-model="formInline.price" placeholder="请输入商品价格">
                        <Button slot="append">元</Button>
                    </Input>
                    
                </FormItem>
                <FormItem label="规则条件">
                    <RadioGroup v-model="formInline.rule">
                        <Radio label="1">搭配换购</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="商品范围">
                    <RadioGroup v-model="formInline.range">
                        <Radio label="1">参与换购商品</Radio>
                        <Radio label="2">不参与换购商品</Radio>
                    </RadioGroup>
                    
                </FormItem>
                <FormItem label="关联商品" prop="goodsRange">
                    <coupon-addgood
                        @listentgoodData="listentgoodDatafuc($event)"
                        :options="showData"
                    ></coupon-addgood>
                </FormItem>
                <FormItem>
                    <Button type="primary" class="comBtn" @click.native="save('formInline')" :loading="loading">保存</Button>
                    <Button type="default" class="comBtn" @click="prev()">返回列表</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import marking from '@/api/request/marking'
import goodsUtils from "@/utils/goodsUtils"
import couponAddgood from "@/components/couponAddgood/couponAddgood";

export default {
    components: {
      couponAddgood
    },
    data() {
        return {
            loading:false,
            titleLength:0,
            role: '',
            id: '',
            formInline: {
                title: '',
                price: '',
                rule:'1',
                range:'1',
                goodsRange:[],
            },
            ruleInline: {
                title: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { 
                        type: 'string', 
                        min: 1, 
                        message: '请输入商品名称', 
                        trigger: 'blur'
                    }
                ],
                price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                    { 
                        type: 'string',
                        message: '请输入商品价格', 
                        trigger: 'blur'
                    },{
                        pattern: /^\d+(\.\d+)?$/,
                        message: '请输入正数', 
                        trigger: 'blur'
                    }
                ],
                goodsRange:[
                    {
                        required:true, message:'请选择关联商品'
                    }
                ]
            },
            showData: [],
        }
    },
    activated() {
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
            marking.ruleGoodsDetail({
                id: this.id
            }).then(res => {
                if (res.code == 1) {
                    this.formInline = {
                        title: res.data.goodsname,
                        price: res.data.price + '',
                        rule:res.data.ruleConditions,
                        range:res.data.goodsScope,
                        goodsRange:[],
                    }
                    this.titleLength = Math.ceil((goodsUtils.getByteLen(res.data.goodsname).len3) / 2)

                    // 获取商品规格
                    this.getSpecs()

                }
            }).catch(err => {
                this.$Message.error('请求失败')
            })
        },

        // 获取商品规格
        getSpecs(){
            marking.ruleGoodsSpecs({
                rulesId:this.id
            }).then((res) => {
                console.log(res)
                this.showData = res.data
            })
        },

        // 校验名称
        validTitle(e){
            let val = e.srcElement.value
            let newLength = val.length
            this.titleLength = newLength
        },
        
        //接收商品数据
        listentgoodDatafuc: function(data) {

            let rulegoodslist = [];
            for (let item in data) {
                let obj = {};
                obj.specIds = data[item].hasOwnProperty('specsId') ? data[item].specsId.join(',') : ''
                obj.goodsId = data[item].id,
                rulegoodslist.push(obj)
            }

            this.formInline.goodsRange = rulegoodslist

            this.$forceUpdate()

            if (!data) {
                return false
            }

            this.$refs.formInline.validateField('goodsRange')
        },

        // 保存
        save(reduForm) {
           
            let _this = this
            let rulegoods = []
            this.formInline.goodsRange.map((v,i) => {
                let newObj = {
                    goodsId:v.goodsId,
                    specIds:v.specIds
                }
                rulegoods.push(newObj)
            })
            let dataParams = {
                price:_this.formInline.price,
                ruleConditions:_this.formInline.rule,
                goodsname:_this.formInline.title,
                goodsScope:_this.formInline.range,
                rulegoods:rulegoods
            }

            
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    if(this.role == 3){
                        // 编辑
                         this.loading=true
                        marking.ruleGoodsUpdate({
                            ...dataParams,
                            id:_this.id
                        }).then((res) => {
                            console.log(res)
                            if(res.code == 1){
                                this.loading=false
                                _this.$Message.success('保存成功')
                                _this.prev()
                            }else{
                                this.loading=false
                                _this.$Message.error(res.message)
                            }
                        })
                    }else{
                         this.loading=true
                        // 创建和复制
                        marking.ruleGoodsAdd({
                            ...dataParams
                        }).then((res) => {
                            console.log(res)
                            if(res.code == 1){
                                this.loading=false
                                this.$Message.success('保存成功')
                                this.prev()
                            }else{
                                this.loading=false
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
                rule:'1',
                range:'1',
                goodsRange:[],
            }
            this.showData = []
        }
    }
}
</script>

