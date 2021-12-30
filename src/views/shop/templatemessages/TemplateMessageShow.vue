<template>
    <div id="template-message-show">
        <Card>
            <h3 class="title">模板详情</h3>
            <div class="header">
                <div class="con-box">
                    <span>模板id:</span>
                    <p>{{tamplateData.templateId}}</p>
                </div>
                <div class="con-box">
                    <span>标题:</span>
                    <p>{{tamplateData.title}}</p>
                </div>
                <div class="con-box">
                    <span class="keyword">关键词:</span>
                    <div class="keyword-box">
                        <div class="key-word" v-for="(item,index) in tamplateData.content" :key="index">
                            <span>{{item.name}}</span>
                            <p>{{item.template}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div>
                    <Button type="default" style="width: 100px;margin-right: 10px" @click="callBack">返回</Button>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import shop from '@/api/request/shopModel'
export default {
    data() {
        return {
            tamplateData: {
                templateId: '',
                title: '',
                content: [
                    {
                        name: '',
                        template: ''
                    }
                ]
            },
            tempId: ''
        }
    },
    activated() {
        this.tempId = this.$route.query.id
        this.getData()
    },
    methods: {
        getData() {
            console.log('详情')
            shop.templateMessagesDetail({
                id: this.tempId
            }).then(res => {
                this.integration(res)
            }).catch(err => {
                console.log(err)
            })
        },
        integration(data) {
            console.log(data)
            // 
            // console.log(data.content.split("\n"))
            data.content = data.content.split("\n")
            data.content.pop()
            let arr = []
            data.content.forEach(item => {
                let obj = {}
                obj.name = item.substr(0,item.indexOf('{{'))
                obj.template = item.substr(item.indexOf('{{'))
                arr.push(obj)
            });
            console.log(arr)
            data.content = arr
            console.log(data.content)
            this.tamplateData = data
        },
        callBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scoped>
#template-message-show {
    .header {
        margin-top: 25px;
        span {
            display: inline-block;
            width: 120px;
            text-align: right;
            margin-right: 15px;
        }
        .con-box {
            margin: 30px 0;
            .keyword-box {
                display: inline-block;
            }
            .key-word {
                margin: 20px 0;
                span {
                    text-align: left;
                    width: 90px;
                }
                p {
                    padding: 5px 10px;
                    background-color: #ccc;
                    display: inline-block;
                    width: 250px;
                }
            }
        }
        .keyword {
            vertical-align: top;
        }
        p {
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

