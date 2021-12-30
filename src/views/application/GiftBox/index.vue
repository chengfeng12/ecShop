<template>
    <div class="gift-box-app">
        <div class="currentTitle">定制礼盒</div>
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
                <span>是否确认删除该礼盒?</span>
            </div>
            </Modal>
        <Modal
            v-model="copyPop"
            title="确认提示"
            @on-ok="copyConfirm"
            @on-cancel="reCancelFun"
            width="400px"
            :scrollable="false"
            >
            <div class="popConWra">
                <i class="tips"></i>
                <span>是否确认复制该礼盒?</span>
            </div>
            </Modal>
        <Card>
            <div slot="title" class="header">
                <Button type="primary" size="small" @click="addGiftBox">创建定制礼盒</Button>
            </div>
            <div class="main">
                <Table border ref="selection" :columns="columns" :data="tableData"></Table>
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
            copyPop: false,
            tableData: [],
            columns: [
                {
                    title: "名称",
                    align: "center",
                    key: "boxName"
                },
                {
                    title: "CODE",
                    align: "center",
                    key: "boxCode"
                },
                {
                    title: "虚拟仓库",
                    align: "center",
                    key: "vituralStock"
                },
                {
                    title: "实际仓库",
                    align: "center",
                    key: "stock"
                },
                {
                    title: "所属活动",
                    align: "center",
                    key: "activatyName"
                },
                {
                    title: "创建时间",
                    align: "center",
                    render: (h, params) => {
                        return h('p', {}, goodsUtils.timeFun(goodsUtils.timeStamp(params.row.createTime)))
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
                                    // 'display': this.hasRole(5010501) ? 'block' : 'none'
                                },
                                on: {
                                    click: () => {
                                        this.editGiftBox(params.row.id)
                                    }
                                }
                            },"编辑"),
                            h("div", {
                                class: {},
                                style: {
                                    padding:"0 10px",
                                    cursor: "pointer",
                                    borderRight: "1px solid #0083b0",
                                    // 'display': this.hasRole(5010503) ?'block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.copyGiftBox(params.index)
                                    }
                                }
                            },"复制"),
                            h("div", {
                                class: {},
                                style: {
                                    padding:"0 10px",
                                    cursor: "pointer",
                                    // 'display': this.hasRole(5010503) ?'block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.delGiftBox(params.index)
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
            tempIndex: '',
            tempId: ''
        }
    },
    created() {
        this.init()
        this.tempId = this.$route.query.id
        this.getData()
    },
    methods: {
        init() {

        },
        getData() {
            order.giftBoxList({
                'activatyId': this.tempId
            }).then(res => {
                if (res.code == 1) {
                    console.log(res)
                    this.tableData = res.data
                }
            }).catch(err => {
                console.log(err)
            })
        },
        addGiftBox() {
            this.$router.push(`/@/views/application/GiftBox/components/AddGiftBoxApp`)
        },
        editGiftBox(id) {
            this.$router.push(`/@/views/application/GiftBox/components/AddGiftBoxApp?id=${id}`)
        },
        delGiftBox(index) {
            this.tempIndex = index
            this.delPop = true
        },
        reCancelFun() {
            this.tempIndex = ''
        },
        delConfirm() {
            // console.log('我是删除')
            // return false
            order.giftBoxDel({
                'id': this.tableData[this.tempIndex].id
            }).then(res => {
                if (res.code == 1) {
                    this.$Message.success('删除成功')
                    this.getData()
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        copyGiftBox(index) {
            this.tempIndex = index
            this.copyPop = true
        },
        copyConfirm(index) {
            // console.log('我是复制')
            // return false
            order.giftBoxCopy({
                'id': this.tableData[this.tempIndex].id
            }).then(res => {
                if (res.code == 1) {
                    console.log(res)
                    this.$Message.success('复制成功')
                    this.getData()
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },

    }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
