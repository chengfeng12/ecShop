<template>
    <div id="template-message">
      <div class="currentTitle">套餐商品</div>
        <Card>
            <div class="header">
                <Button type="primary" size="small" @click="add" class="mar-ri">+添加套餐</Button>
                <!-- <Select v-model="model1" style="width:200px">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="model1" style="width:200px">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <Input v-model="title" placeholder="输入模板标题搜索" style="width: 220px;" class="mar-ri"/>
                <Button type="primary" size="small" class="mar-ri" @click="searchFun">搜索</Button>
                <div style="border-bottom: 1px solid #c9c9c9;margin: 10px -16px"></div>
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
            <!-- 状态切换 -->
            <Modal v-model="statusPop" title="确认提示" @on-ok="atatusOk" width="400px" :scrollable="false">
                <div class="popConWra">
                    <i class="tips"></i>
                    <span>{{tempMsg}}</span>
                </div>
            </Modal>
            <!-- 批量状态切换 -->
            <Modal v-model="batchPop" title="确认提示" @on-ok="batchStatusFun" width="400px" :scrollable="false">
                <div class="popConWra">
                    <i class="tips"></i>
                    <span>{{tempMsg}}</span>
                </div>
            </Modal>
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
                    <Button type="default" size="small" class="lower" @click="batchStatus()">启用</Button>
                    <Button type="default" size="small" class="del" @click="batchProhibit()">禁用</Button>
                    <!-- @click="removeGoodsMui('批量删除')" -->
                    <Button type="error" size="small" class="del" @click="batchDel()">删除</Button>
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
import shop from '@/api/request/shopModel'
import goodsUtils from "@/utils/goodsUtils"
export default {
    data() {
        return {
            title: '',
            columns: [
                {
                    type: "selection",
                    width: 50,
                    align: "center"
                },
                {
                    title: "序号",
                    align: "center",
                    key: 'id'
                },
                {
                    title: "模板标题",
                    align: "center",
                    key: 'title'
                },
                {
                    title: "模板id",
                    align: "center",
                    key: 'templateId'
                },
                {
                    title: "关键词",
                    align: "center",
                    key: 'keywordIdlist'
                },
                {
                    title: "状态",
                    align: "center",
                    render: (h,params) => {
                        return h('span',{},params.row.status == 1 ? '启用' : '禁用')
                        
                    }
                },
                {
                    title: "创建时间",
                    align: "center",
                    render: (h,params) => {
                        return h('span',{},goodsUtils.timeFun(goodsUtils.timeStampFun(params.row.createTime)))
                    }
                },
                {
                    title: "操作",
                    align: "center",
                    width: 200,
                    render: (h,params) => {
                        let stateRes = params.row.status;
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
                              cursor: "pointer"
                            },
                            on: {
                                click: () => {
                                    this.editFun(params.row.id);
                                }
                            }
                        },"编辑"),
                        h("div", {
                            class: {},
                            style: {
                              borderRight: "1px solid #0083b0",
                              padding:"0 10px",
                              cursor: "pointer"
                            },
                            on: {
                                click: () => {
                                    this.statusFun(params.index);
                                }
                            }
                        },stateRes == 1?"禁用":"启用"),
                        h("div", {
                            class: {},
                            style: {
                              padding:"0 10px",
                              cursor: "pointer"
                            },
                            on: {
                                click: () => {
                                    this.delFun(params.index);
                                }
                            }
                        },"删除")
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
        // 请求数据
        this.getData()
    },
    methods: {
        getData() {
            shop.shopTemplateMessage({
                title: this.title,
                current: this.current
            }).then(res => {
                if (res.code == 1) {
                    this.integrationData(res.data)
                }
            }).catch(err => {
                console.log(err)
                this.$Message.error('请求失败')
            })
        },
        integrationData(data) {
            console.log('家骄傲金额',data)
            this.current = data.current
            this.size = data.size
            this.total = data.total
            this.tableData = data.rows
        },
        searchFun() {
            this.getData()
        },
        add() {
            // console.log('添加跳转')
            this.$router.push('/@/views/shop/templatemessage/TemplateMessageAdd')
        },
        editFun(id) {
            this.$router.push('/@/views/shop/templatemessage/TemplateMessageAdd?id=' + id + '&role=2')
        },
        statusFun(index) {
            console.log('状态切换',index)
            this.statusPop = true;
            if (this.tableData[index].status == "1") {
                this.tempMsg = "确认禁用该模板?";
            } else {
                this.tempMsg = "确认启用该模板?";
            }
            this.tempId = this.tableData[index].id;
            this.tempStatus = this.tableData[index].status == 1 ? 0 : 1;
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
        // 批量
        batchStatus() {
            let res = this.batchEmpty()
            if (res) {
                this.batchPop = true
                this.tempMsg = "确认批量启用模板?"
            } else {
                return
            } 
        },
        // 批量启用的确认禁用方法
        batchStatusFun() {
            this.splitArr()
            this.tempStatus = this.tempMsg == "确认批量启用模板?" ? 1 : 0
            this.atatusOk()
        },
        // 批量禁用
        batchProhibit() {
            let res = this.batchEmpty()
            if (res) {
                this.batchPop = true
                this.tempMsg = "确认批量禁用模板?"
            } else {
                return
            }             
        },
        batchDel() {
            let res = this.batchEmpty()
            if (res) {
                this.batchDelPop = true
                this.tempMsg = "确认批量删除模板?"
            } else {
                return
            }   
        },
        batchDelFun() {
            this.splitArr()
            this.delOkFun()
        },
        splitArr() {
            // 对数组进行切割拼接
            let idData = "";
            // console.log(this.tempTables)
            for (let i = 0; i < this.tempTables.length; i++) {
                if (i < this.tempTables.length - 1) {
                    idData = idData + this.tempTables[i].id + ",";
                } else {
                    idData = idData + this.tempTables[i].id;
                }
            }
            this.tempId = idData
        },
        atatusOk() {
            console.log(this.tempId)
            shop.shopTemplateMessageUpdate({
                ids: this.tempId,
                status: this.tempStatus,
            }).then(res => {
                if (res.code == "1") {
                    this.$Message.success("切换成功");
                    this.getData();
                } else {
                    this.$Message.error(res.message);
                }
            }).catch(err => {
                this.$Message.error("状态切换失败");
            });
        },
        delFun(index) {
            this.tempId = this.tableData[index].id
            this.tempMsg = "确认删除该模板?"
            this.delPop = true
        },
        delOkFun() {
            shop.shopTemplateMessageDel({
                ids: this.tempId
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
                    this.$Message.error(res.message);
                }
            }).catch(err => {
                console.log(err)
                this.$Message.error("删除失败");
            });
        },
        // 单选行获取的数据 第一个数选中的集合 第二个是当前选中的
        selectFun(params, row) {
            // 通过索引进行更改数据 在data中添加一个商品的 id 字段
            console.log(params,row)
            this.tempTables.push(row);
            // console.log(this.tempTables)
            // 需要在data 中定义一个字段 用来存储多选的数据
        },
        // 单选取消事件
        selectCancelFun(data, row) {
            // 获取选中数据的id
            let id = row.id;
            // 数组条件过滤
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
        // 翻页
        pagefun(index) {
            this.current = index
            this.getData()
        }
    }
}
</script>

<style lang="less" scoped>
  .currentTitle{
    font-size: 13px;
    color: #000;
    padding: 4px 0;
    background: #f8fbfb;
  }
#template-message {
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

