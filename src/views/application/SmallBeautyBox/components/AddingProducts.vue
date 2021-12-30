<template>
    <div class="add-product">
        <div class="currentTitle">添加产品</div>
        <Card>
            <Table border :columns="columns" :data="tableData"></Table>
        </Card>
    </div>
</template>

<script>
import goodsUtils from '@/utils/goodsUtils'
export default {
    data() {
        return {
            tableData: [],
            columns: [
                {
                    title: '阶段',
                    align: 'center',
                    render: (h, params) => {
                        return h('p',{},`STEP${params.index + 1}`)
                    }
                },
                {
                    title: '创建时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('p',{
                        },goodsUtils.timeDayFun(goodsUtils.timeStamp(params.row.createtime)))
                    }
                },
                {
                    title: '上线时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('p',{

                        },goodsUtils.timeDayFun(params.row.uptime))
                    }
                },
                {
                    title: '下线时间',
                    align: 'center',
                    render: (h, params) => {
                        return h('p',{

                        },goodsUtils.timeDayFun(params.row.downtime))
                    }
                },
                {
                    title: '添加产品',
                    align: 'center',
                    render: (h, params) => {
                        return h('span',{
                            style: {
                                color: '#0083b0', 
                                padding: '10px',
                                'cursor': "pointer",
                            },
                            on: {
                                click: () => {
                                    this.addItemProduct(params.index + 1)
                                }
                            }
                        },'添加')
                    }
                }
            ],
            createtime: '',
            uptime: '',
            downtime: '',
            tempId: ''
        }
    },
    created() {
        this.tempId = this.$route.query.id
        this.init()
        this.getData()
    },
    methods: {
        init() {
            this.tableData = []
            this.createtime = ''
            this.uptime = ''
            this.downtime = ''
        },
        getData() {
            this.createtime = localStorage.getItem('createTime')
            this.uptime = localStorage.getItem('uptime')
            this.downtime = localStorage.getItem('downtime')
            // console.log(this.createtime, this.uptime, this.downtime)
            for(let i = 0; i < 5; i++) {
                let obj = {}
                obj.createtime = this.createtime
                obj.uptime = this.uptime
                obj.downtime = this.downtime
                this.tableData.push(obj)
            }
            console.log(this.tableData)
        },
        addItemProduct(id) {
            if (this.tempId) {
                this.$router.push(`/@/views/application/SmallBeautyBox/components/AddProducts?id=${id}&activityId=${this.tempId}`)
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import './AddingProducts.less';
</style>
