<template>
    <div id="template-message-add">
        <url-botton ref="linkselect" @SmallProFun="SmallProFun" @listenurldata="geturldata" :settings="linkSettings" />
        <Card>
            <h3 class="title">模板设置</h3>
            <div class="header">
                <span>模板消息</span>
                <Select v-model="modelMsg" style="width:200px" @on-change="modelFun" placeholder="选择所需的模板消息">
                    <Option v-for="(item,index) in modelMsgList" :value="index+''" :key="index">{{ item.title }}</Option>
                </Select>
                <p>请先使用“消息管理”模块同步小程序模板消息</p>
            </div>
            <div class="con-box">
                <div class="formList">
                    <Form :model="modelMsgDataList" :label-width="200" ref="smallData">
                        <FormItem label="标题" prop="title">
                            <Input v-model="modelMsgDataList.title" :disabled="true" style="width: 300px;"></Input>
                        </FormItem>
                        <FormItem :label="index == 0 ? '关键词' : ''" prop="appSecret" v-for="(item,index) in modelMsgDataList.data" :key="index">
                            <span class="key-span">{{item['title'+index]}}</span>
                            <Input v-model="item['number'+index]" @on-focus="inputFocus(index)" style="width: 150px;"></Input>
                            <!-- @on-change="colorFun" @on-open-change="clickColor"  -->
                            <ColorPicker @on-change="colorFun" v-model="item['color'+index]" style="margin-left: 10px;" />
                        </FormItem>
                    </Form>
                    <span class="link">跳转链接</span>
                    {{modelMsgDataList.linkUrl}}
                    <Button type="primary" @click="addLink">+添加跳转</Button>
                </div> 
                <div class="select-data">
                    <Select v-model="selectData" style="width:200px" placeholder="选择所需的模板消息">
                        <Option v-for="(item,index) in selectList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                    <div class="btn-s">
                        <Button class="btn-item" type="default" v-for="(item,index) in btns" :key="index" @click="btnsFun(item.name)">{{item.name}}</Button>
                    </div>
                </div>
            </div>
            <div class="status-box">
                <span>模板状态</span>
                <RadioGroup v-model="modelMsgDataList.status+''" @on-change="statusFun" class="status">
                    <Radio label="1">启用</Radio>
                    <Radio label="0">禁用</Radio>
                </RadioGroup>
            </div>
            <div class="footer">
                <div>
                    <Button type="primary" :loading="loading" style="width: 100px;margin-right: 10px" @click="keepFun">保存</Button>
                    <Button type="default" style="width: 100px;" @click="callBack">返回</Button>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import urlBotton from '@/components/urlbutton/urlbutton'
import shop from '@/api/request/shopModel'
export default {
    data() {
        return {
            loading: false,
            // 链接的配置信息
            linkSettings: {
                mode:'diy'
            },
            modelMsg: "0",
            modelMsgList: [],
            modelMsgDataList: {
                title: "",
                data: [],
                linkUrl: '',
                status: '1'
            },
            selectData: "1",
            selectList: [
                {
                    id: '1',
                    name: '订单消息'
                }
            ],
            // 暂存数据
            tempIndex: 0,
            btns: [
                {
                    name: '商品名称'
                },
                {
                    name: '粉丝昵称'
                },
                {
                    name: '订单号'
                },
                {
                    name: '订单金额'
                },
                {
                    name: '运费'
                },
                // {
                //     name: '商品详情'
                // },
                // {
                //     name: '单品详情'
                // },
                {
                    name: '快递公司'
                },
                {
                    name: '快递单号'
                },
                {
                    name: '购买者姓名'
                },
                {
                    name: '收货地址'
                },
                {
                    name: '下单时间'
                },
                {
                    name: '购买者电话'
                },
                {
                    name: '支付时间'
                },
                {
                    name: '发货时间'
                },
                {
                    name: '收货时间'
                },
                {
                    name: '备注信息'
                },
            ],
            tempId: '',
            tempRole: ''
        }
    },
    components: {
        urlBotton
    },
    watch: {
        modelMsgDataList: {
            handler:function(newVal,oldVal) {
                console.log('newVal',newVal)
    　　　　}, 
    　　　　deep: true
        }
    },
    activated() {
        let id = this.$route.query.id
        this.tempId = id
        let role = this.$route.query.role
        this.tempRole = role
        this.init()
        this.getModelMsgList()
        if (this.tempRole) {
            this.getData()
        }
    },
    methods: {
        init() {
            this.modelMsgDataList = {
                title: "",
                data: [],
                linkUrl: '',
                status: '1'
            }
        },
        getData() {
            console.log('我是编辑的')
            shop.shopTemplateMessageDetail({
                'id': this.tempId
            }).then(res => {
                if (res.code == 1) {
                    this.modelMsgDataList = res.data
                    this.modelMsgDataList.linkUrl = res.data.address
                    this.modelMsgDataList.status = res.data.status
                    console.log(this.modelMsgDataList)
                    this.modelMsgDataList.appletTemplatesList.forEach((element,index) => {
                        if (this.modelMsgDataList.templateId == element.id) {
                            this.modelMsg = index + ''
                        }
                    });
                    // this.modelMsg = res.data.templateId + ''
                    this.modelMsgDataList.data = JSON.parse(this.modelMsgDataList.template)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        getModelMsgList() {
            console.log('我是请求选择的数据')
            shop.shopTemplateMessageType().then(res => {
                this.integration(res.data)
            }).catch(err => {
                console.log(err)
            })
        },
        integration(data) {
            console.log('data',data)
            this.modelMsgList = data
            console.log(this.modelMsgDataList,'[[[[[[[[[[[[[[')
            let res = this.modelMsgList[0]
            res.data = res.content.split("\n")
            res.data.pop()
            let arr = []
            res.data.forEach((item,index) => {
                let obj = {}
                obj['title'+index] = item.substr(0,item.indexOf('{{'))
                obj['number'+index] = ''
                obj['color'+index] = "#000"
                arr.push(obj)
            });
            res.data = arr
            this.modelMsgDataList = res
        },
        modelFun(index) {
            let res = this.modelMsgList[index]
            res.data = res.content.split("\n")
            res.data.pop()
            let arr = []
            res.data.forEach((item,index) => {
                let obj = {}
                obj['title'+index] = item.substr(0,item.indexOf('{{'))
                obj['number'+index] = ''
                obj['color'+index] = "#000"
                arr.push(obj)
            });
            res.data = arr
            this.modelMsgDataList = res
        },
        addLink() {
            let _this = this
            let changeData = {
                mode: "diy",
                link: this.modelMsgDataList.linkUrl
            };
            this.linkSettings = changeData
            this.$forceUpdate()
            console.log('dianjile',this.linkSettings)
            _this.$refs.linkselect.cardShow()
        },
        // 获取小程的信息
        SmallProFun(SmallPro) {
            // this.addate[this.urlIndex].categoruAdaddress = "其他小程序"
        },
        inputFocus(index) {
            this.tempIndex = index
            console.log('我是input 的索引',this.tempIndex)
        },
        // 获取路径
        geturldata(links) {
            console.log(links,'我是链接')
            // this.modelMsgDataList.linkUrl = links
            this.$set(this.modelMsgDataList,'linkUrl',links)
            this.$forceUpdate()
            console.log(this.modelMsgDataList.linkUrl)
        },
        btnsFun(data) {
            console.log(data)
            this.$set(this.modelMsgDataList.data[this.tempIndex],'number'+this.tempIndex,"[" + data + "]")
            console.log(this.modelMsgDataList.data[this.tempIndex])
            this.$forceUpdate()
        },
        
        colorFun(value) {
            console.log(value)
            this.$forceUpdate()
        },
        clickColor(index) {
            console.log(index)
        },
        statusFun(status) {
            console.log(status)
            this.modelMsgDataList.status = status + ''
            this.$forceUpdate()
        },
        keepFun() {
            this.loading = true
            console.log(this.modelMsgDataList)
            let len = this.modelMsgDataList.data.length
            for (let i = 0; i < len; i++) {
                if (this.modelMsgDataList.data[i]['number'+i] == '') {
                    this.loading = false
                    this.$Message.error('关键词内容不能为空')
                    return false
                }
            }
            let _this = this
            console.log(this.modelMsgList[_this.modelMsg].id)
            if (_this.tempRole) {
                // 更新
                console.log('我是编辑的',_this.modelMsgDataList.status)
                shop.shopTemplateMessageUpdata({
                    'id': _this.tempId,
                    'title': _this.modelMsgDataList.title,
                    'status': _this.modelMsgDataList.status,
                    'address': _this.modelMsgDataList.linkUrl,
                    'template': _this.modelMsgDataList.data,
                    'templateId': _this.modelMsgList[_this.modelMsg].id
                }).then(res => {
                    if (res.code == 1) {
                        _this.loading = false
                        this.$Message.success('保存成功')
                        this.callBack()
                    } else {
                         _this.loading = false
                    }
                }).catch(err => {
                     _this.loading = false
                    this.$Message.error('保存失败')
                })
            } else {
                console.log('我是添加的',_this.modelMsgDataList.status)
                // 添加
                shop.shopTemplateMessageAdd({
                    'title': _this.modelMsgDataList.title,
                    'status': _this.modelMsgDataList.status,
                    'address': _this.modelMsgDataList.linkUrl,
                    'template': _this.modelMsgDataList.data,
                    'templateId': _this.modelMsgList[_this.modelMsg].id
                }).then(res => {
                    if (res.code == 1) {
                        _this.loading = false
                        this.$Message.success('保存成功')
                        this.callBack()
                    } else {
                         _this.loading = false
                    }
                }).catch(err => {
                    _this.loading = false
                    this.$Message.error('保存失败')
                })
            }
        }, 
        callBack() {
            this.$router.go(-1)
        }
        
    }
}
</script>

<style lang="less" scoped>
#template-message-add {
    .header {
        margin-top: 25px;
        span {
            display: inline-block;
            width: 120px;
            text-align: right;
            margin-right: 15px;
        }
        p {
            margin-left: 135px;
            margin-top: 15px;
            color: #aaa;
        }
    }
    .con-box {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: 20px 0;
        .formList {
            border-right: 1px dashed #aaa;
            padding: 0 30px 0 0;
            width: 60%;
            .key-span {
                display: inline-block;
                width: 80px;
                margin-right: 10px;
                margin-left: 10px;
            }
            .link {
                display: inline-block;
                width: 200px;
                text-align: right;
                text-align: right;
                vertical-align: middle;
                font-size: 12px;
                color: #515a6e;
                line-height: 1;
                padding: 10px 12px 10px 0;
                box-sizing: border-box;
            }
        }
        .select-data {
            width: 40%;
            padding: 0 0 0 30px;
            .btn-s {
                margin-top: 20px;
                .btn-item {
                    margin: 10px;
                }
            }
        }
    }
    .status-box {
        span {
            display: inline-block;
            width: 120px;
            text-align: right;
            margin-right: 15px;
        }
        .status {
            display: inline-block;
        }
    }
    .footer {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }
}
</style>


