<template>
    <div class="add-small-bea">
        <div class="currentTitle">小美盒活动</div>
        <Card>
            <Form :model="formData" :rules="reduRule" ref="formData" :label-width="120" >
                <FormItem label="名称" prop="activatyName">
                    <Input v-model="formData.activatyName" placeholder="请输入名称" style="width: 400px" />
                </FormItem>
                <FormItem label="时间范围" prop="timeData" :rules="[{required: true,message: '请选择时间'},
                              {pattern: null, type: 'array', message: '日期'}]">
                    <DatePicker
                        :editable="false"
                        type="datetimerange"
                        placement="bottom-end"
                        placeholder="选择时间"
                        :options="optionsTime"
                        style="width: 300px"
                        format="yyyy-MM-dd HH:mm:ss"
                        @on-change="timechange"
                        :value="formData.timeData"
                    ></DatePicker>
                </FormItem>
                <FormItem label="选择步数" prop="stepNumber" class="ivu-form-item-required">
                    <Select v-model="formData.stepNumber" :disabled="true" style="width: 400px">
                        <Option v-for="(item, index) in numList" :value="item.id" :key="index">{{item.value}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div class="formBtn">
              <Button type="primary" class="comBtn" :loading="loading" @click.native="save('formData')">保存</Button>
              <Button type="default" class="comBtn" @click="callBack">返回列表</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import order from '@/api/request/order'
import goodsUtils from '@/utils/goodsUtils'
export default {
    data() {
        return {
            loading: false,
            optionsTime: {
                disabledDate(date) {
                return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            reduRule: {
                activatyName: [
                    {required: true, message: '名称不能为空', trigger: 'blur'}
                ]
            },
            startTime: '',
            endTime: '',
            formData: {
                activatyName: '',
                timeData: [],
                stepNumber: 5
            },
            numList: [{
                id: 1,
                value: 1
            },
            {
                id: 2,
                value: 2
            },
            {
                id: 3,
                value: 3
            },
            {
                id: 4,
                value: 4
            },
            {
                id: 5,
                value: 5
            },
            {
                id: 6,
                value: 6
            },
            {
                id: 7,
                value: 7
            },
            {
                id: 8,
                value: 8
            },
            {
                id: 9,
                value: 9
            },
            {
                id: 10,
                value: 10
            }],
            tempId: ''
        }
    },
    mounted() {
        this.tempId = this.$route.query.id
        this.init()
        this.$refs.formData.resetFields()
        if (this.tempId) {
            this.getData()
        }
    },
    methods: {
        init() {
            this.startTime = ''
            this.endTime = ''
            this.formData = {
                activatyName: '',
                timeData: [],
                stepNumber: 5
            }
        },
        getData() {
            order.beautyBoxDetail({
                id: this.tempId
            }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.formData.activatyName = res.data.activatyName
                    this.startTime = res.data.startTime
                    this.endTime = res.data.endTime
                    this.formData.stepNumber = res.data.stepNumber
                    let arrList = []
                    arrList.push(goodsUtils.timeFun(res.data.startTime))
                    arrList.push(goodsUtils.timeFun(res.data.endTime))
                    console.log('啊哈哈哈哈',this.startTime,goodsUtils.timeStamp(this.startTime))
                    console.log('我是时间',arrList)
                    // return false

                    this.formData.timeData = arrList
                }
            }).catch(err => {
                console.log(err)
                this.$Message.error('请求失败')
            })
        },
        save(name) {
            if (!this.tempId) {
                this.$refs[name].validate(res => {
                    if (res) {
                        this.loading = true
                        order.beautyBoxAdd({
                            "activatyName": this.formData.activatyName,
                            "startTime": this.startTime,
                            "endTime": this.endTime,
                            "stepNumber": this.formData.stepNumber
                        }).then(res => {
                            if (res.code == 1) {
                                this.loading = false
                                this.callBack()
                            } else {
                                this.loading = false
                                this.$Message.error(res.message)
                            }
                        }).catch(err => {
                            this.loading = false
                            console.log(err)
                        })
                    } else {
                        console.log('hahha ')
                        this.$Message.error('保存失败')
                    }
                })
            } else {
                console.log('ajeaeif')
                this.$refs[name].validate(res => {
                    if (res) {
                        this.loading = true
                        order.beautyBoxUpdate({
                            "id": this.tempId,
                            "activatyName": this.formData.activatyName,
                            "startTime": this.startTime,
                            "endTime": this.endTime,
                            "stepNumber": this.formData.stepNumber
                        }).then(res => {
                            console.log(res)
                            if (res.code == 1) {
                                this.loading = false
                                this.callBack()
                            } else {
                                this.loading = false
                                this.$Message.error(res.message)
                            }
                        }).catch(err => {
                            this.loading = false
                            console.log(err)
                        })
                    } else {
                        this.$Message.error('保存失败')
                    }
                })
            }
        },
        timechange(time) {
            console.log(time)
            this.formData.timeData = time
            this.startTime = goodsUtils.timeStamp(time[0])
            this.endTime = goodsUtils.timeStamp(time[1])
        },
        callBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="less" scoped>
@import './addSmallBeautyBox.less';
</style>
