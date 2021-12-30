<template>
    <div id="regular-commodities">
        <Card>
            <div class="header">
                <Button type="primary" @click="add" class="mar-ri">+添加新商品</Button>
                <Input v-model="goodsname" placeholder="输入规则商品名称搜索" style="width: 220px;" class="mar-ri"/>
                <Button type="primary" class="mar-ri" @click="searchFun">搜索</Button>
            </div>
            <div class="main">
                <i-table
                    border
                    ref="selection"
                    :columns="columns"
                    :data="tableData"
                    @on-select="selectFun"
                    @on-select-cancel="selectCancelFun"
                    @on-select-all-cancel="selectCancel"
                    @on-select-all="selectAllFun"></i-table>
            </div>
            <!-- 删除 -->
            <Modal v-model="delPop" title="确认提示" @on-ok="delOkFun" width="400px" :scrollable="false">
                <div class="popConWra">
                    <i class="tips"></i>
                    <span>{{tempMsg}}</span>
                </div>
            </Modal>
            <Modal v-model="batchDelPop" title="确认提示" @on-ok="batchDelFun" width="400px" :scrollable="false">
                <div class="popConWra">
                    <i class="tips"></i>
                    <span>{{tempMsg}}</span>
                </div>
            </Modal>
            <div class="footer">
                <div class="operation">
                    <Button type="error" class="del" @click="batchDel()">删除</Button>
                </div>
                <div class="page">
                    <Page
                        :current="current"
                        :total="total"
                        :page-size="size"
                        @on-change="pagefun"
                        :show-elevator="true"
                        :show-total="true"></Page>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import marking from '@/api/request/marking'
import goodsUtils from "@/utils/goodsUtils"
export default {
    data() {
        return {
            goodsname: '',
            columns: [
                {
                    type: "selection",
                    width: 50,
                    align: "center"
                },
                {
                    title: "商品名称",
                    align: "center",
                    key: 'goodsname'
                },
                {
                    title: "价格",
                    align: "center",
                    key: 'price'
                },
                {
                    title: "创建时间",
                    align: "center",
                    render: (h,params) => {
                        let time = goodsUtils.timeFun(goodsUtils.timeStamp(params.row.createTime))
                        return h('p',{},time)
                    }
                },
                {
                    title: "操作",
                    align: "center",
                    render: (h,params) => {
                        let stateRes = params.row.status;
                        return h("div", {}, [
                        h("Icon", {
                            class: {
                                iconfont: true,
                                "icon-edit-square": true
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                    this.editFun(params.row.id);
                                }
                            }
                        }),
                        h("Icon", {
                            props: {
                                size: "20"
                            },
                            style: {
                                cursor: "pointer"
                            },
                            class: {
                                iconfont: true,
                                "icon-file-copy": true
                            },
                            on: {
                                click: () => {
                                    this.copyFun(params.row.id);
                                }
                            }
                        }),
                        h("Icon", {
                            class: {
                                iconfont: true,
                                "icon-delete": true
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                    this.delFun(params.row.id);
                                }
                            }
                        })
                    ]);
                    }
                },
            ],
            tableData: [],
            current: 1,
            total: 0,
            size: 10,
            // 暂存的数据
            tempMsg: '',
            tempId: '',
            tempStatus: '',
            statusPop: false,
            batchPop: false,
            delPop: false,
            batchDelPop: false,
            // 暂存数据
            tempTables: []
        }
    },
    activated() {
        this.getData()
    },
    methods: {
        getData() {
            marking.ruleGoodsList({
                'goodsname': this.goodsname,
                'current': this.current,
                'size': this.size
            }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.size = res.data.size
                    this.current = res.data.current
                    this.total = res.data.total
                    this.tableData = res.data.rows
                }
            }).catch(err => {
                this.$Message.error('请求失败')
            })
        },

        searchFun() {
            console.log('搜索')
            this.getData()
        },
        add() {
            console.log('添加')
            this.$router.push('/@/views/marking/regularcommodities/components/AddRuleGoods?role=1')
        },
        selectFun(params, row) {
            console.log(params,row)
            this.tempTables.push(row);
        },
        editFun(id) {
            this.$router.push('/@/views/marking/regularcommodities/components/AddRuleGoods?role=3&id=' + id)
        },
        delFun(id) {
            this.delPop = true
            this.tempMsg = '确认删除该规则商品?'
            this.tempId = id
        },
        // 批量判空
        batchEmpty() {
            if (this.tempTables.length == 0) {
                this.$Message.error('选择不能为空')
                return false
            } else {
                return 1
            }
        },
        batchDelFun() {
            this.splitArr()
            this.delOkFun()
        },
        splitArr() {
            let idData = "";
            for (let i = 0; i < this.tempTables.length; i++) {
                if (i < this.tempTables.length - 1) {
                    idData = idData + this.tempTables[i].id + ",";
                } else {
                    idData = idData + this.tempTables[i].id;
                }
            }
            this.tempId = idData
        },
        delOkFun() {
            // console.log(this.tempId)
            // return false
            marking.ruleGoodsDel({
                'id': this.tempId,
            }).then(res => {
                if (res.code == "1") {
                    this.$Message.success("删除成功");
                    if (this.tableData.length == this.tempTables.length) {
                        this.current = this.current - 1;
                    }
                    if (this.current <= "1") {
                        this.current = 1;
                    }
                    this.getData();
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                this.$Message.error('请求失败')
            })
        },
        copyFun(id) {
            console.log('复制')
            this.$router.push('/@/views/marking/regularcommodities/components/AddRuleGoods?role=2&id=' + id)
        },
        batchDel() {
            let res = this.batchEmpty()
            if (res) {
                this.batchDelPop = true
                this.tempMsg = "确认批量删除规则商品?"
            } else {
                return
            }  
        },
        // 单选取消事件
        selectCancelFun(data, row) {
            let id = row.id;
            this.tempTables = this.tempTables.filter(element => element.id !== id);
            let len = this.tempTables.length;
            // console.log(this.tempTables)
        },
        // 全选的方法
        selectAllFun(value) {
            console.log("quanxunazhixing", value);
            this.tempTables = value;
        },
        // 全选取消的时候触发
        selectCancel() {
            this.tempTables = [];
        },
        pagefun(index) {
            this.current = index
            this.getData()
        }
    }
}
</script>

<style lang="less" scoped>
#regular-commodities {
    .header {
        // padding-top: 15px;
        margin-bottom: 15px;
        .mar-ri {
            margin-right: 10px;
        }
    }
    .footer {
        margin-top: 15px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
}
</style>

