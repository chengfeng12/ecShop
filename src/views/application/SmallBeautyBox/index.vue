<template>
    <div id="application">
        <div class="currentTitle">活动列表</div>
        <Modal
            v-model="delPop"
            title="确认提示"
            @on-ok="delConfirm"
            @on-cancel="reCancelFun"
            width="400px"
            :scrollable="false"
            >
            <div class="popConWra">
                <i class="tips"></i>
                <span>是否确认删除该活动?</span>
            </div>
            </Modal>
        <Card>
            <div slot="title" class="header">
                <Button  type="primary" size="small"  v-if="hasRole(110103)" @click="addActivity">创建活动</Button>
            </div>
            <div class="main">
                <Table border ref="selection" :columns="columns" :data="tableData"></Table>
            </div>
            <div class="footer">
                <div class="page">
                    <Page
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
            </div>
        </Card>
    </div>
</template>
<script>
import goodsUtils from '@/utils/goodsUtils'
import order from '@/api/request/order'
export default {
    data() {
        return {
            delPop: false,
            tableData: [],
            columns: [
                {
                    title: "名称",
                    align: "center",
                    key: "activatyName"
                },
                {
                    title: "创建时间",
                    align: "center",
                    render: (h, params) => {
                        return h('p',{
                        },goodsUtils.timeDayFun(goodsUtils.timeStamp(params.row.createTime)))
                    }
                },
                {
                    title: "上线时间",
                    align: "center",
                    render: (h, params) => {
                        return h('p',{

                        },goodsUtils.timeDayFun(params.row.startTime))
                    }
                },
                {
                    title: "下线时间",
                    align: "center",
                    render: (h, params) => {
                        return h('p',{

                        },goodsUtils.timeDayFun(params.row.endTime))
                    }
                },
                {
                    title: "操作",
                    align: "center",
                    width: 280,
                    render: (h, params) => {    
                        return h("div", {
                            style:{
                                display:'flex',
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'center',
                                color:'#0083b0',
                                'font-size':'13px'
                            }
                        }, [
                            h("div", {
                                class: {},
                                style: {
                                    borderRight: "1px solid #0083b0",
                                    paddingRight:"10px",
                                    cursor: "pointer",
                                     'display': this.hasRole(110103) ? 'block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        this.editFun(params.row.id)
                                    }
                                }
                            },"编辑"),
                            h("div", {
                                class: {},
                                style: {
                                    padding:"0 10px",
                                    cursor: "pointer",
                                    borderRight: "1px solid #0083b0",
                                    'display': this.hasRole(110102) ?'block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.addProducts(params.row)
                                    }
                                }
                            },"添加产品"),
                            h("div", {
                                class: {},
                                style: {
                                    padding:"0 10px",
                                    cursor: "pointer",
                                    borderRight: "1px solid #0083b0",
                                    'display': this.hasRole(110106) ?'block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.createBox(params.index)
                                    }
                                }
                            },"创建礼盒"),
                            h("div", {
                                class: {},
                                style: {
                                    padding:"0 10px",
                                    cursor: "pointer",
                                    'display': this.hasRole(110104) ?'block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.delActivity(params.index)
                                    }
                                }
                            },"删除")
                        ]);
                    }
                }
            ],
            total: 0,
            size: 10,
            current: 1,
            tempIndex: ''
        }
    },
    created() {
        this.getData()
        this.init()
    },
    methods: {
        init() {
            this.total = 0
            this.size = 10
            this.current = 1
        },
        getData() {
            order.beautyBoxList({
                'size': this.size,
                'current': this.current
            }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.total = res.data.total
                    this.tableData = res.data.rows
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                this.$Message.error('请求失败')
                console.log(err)
            })
        },
        delActivity(index) {
            console.log(index)
            this.tempIndex = index
            this.delPop = true
        },
        delConfirm() {
            console.log('确认了')
            order.beautyBoxDel({
                id: this.tableData[this.tempIndex].id
            }).then(res => {
                if (res.code == 1) {
                    if (this.tableData.length == 1) {
                        this.current--
                    }
                    if (this.current <= 1) {
                        this.current = 1
                    }
                    this.getData()
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        reCancelFun() {
            this.tempIndex = ''
        },
        createBox(index) {
            let id = this.tableData[index].id
            this.$router.push(`/@/views/application/GiftBoxApp?id=${id}`)
        },
        addActivity() {
            this.$router.push('/@/views/application/SmallBeautyBox/components/addSmallBeautyBox')
        },
        editFun(id) {
            this.$router.push(`/@/views/application/SmallBeautyBox/components/addSmallBeautyBox?id=${id}`)
        },
        addProducts(data) {
            console.log('我是新建的', data)
            localStorage.setItem('createTime', data.createTime)
            localStorage.setItem('uptime', data.startTime)
            localStorage.setItem('downtime', data.endTime)
            this.$router.push(`/@/views/application/SmallBeautyBox/components/AddingProducts?id=${data.id}`)
        },
        pagefun(index) {
            this.current = index;
            this.getData()
        },
        pageSizeFun(data) {
            this.size = data
            this.getData()
        },
    }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>

