<template>
    <div class="add-products">
        <div class="currentTitle">添加产品</div>
        <imgSelect ref="imgDataRefs" :options="{type: 'image', mode: 'diy'}" @listentoptpmfile="getimageData" ></imgSelect>
        <Card>
            <Table border :columns="columns" :data="tableData"></Table>
            <div class="addPro-mar-top">
                <Button type="primary" class="comBtn" @click="addItem()">添加产品</Button>
            </div>
            <div class="formBtn">
                <Button type="primary" class="comBtn" @click.native="save('formData')">保存</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import imgSelect from '@/components/imgSelect/imgselect'
import order from '@/api/request/order'
export default {
    data() {
        return {
            tableData: [],
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    // sortable: true,
                    render: (h, params) => {
                        return h('p',{},params.index + 1)
                    }
                },
                {
                    title: '名称',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this
                        return h('input', {
                            style: {
                                width: "120px",
                                height: "30px",
                                textIndent: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                outline: 'none'
                            },
                            domProps: {
                                value: params.row.productName
                            },
                            on: {
                                input(event) {
                                    _this.titleFun(params.index, event.target.value)
                                }
                            }
                        })
                    }
                },
                {
                    title: '副标题',
                    align: 'center',
                    render: (h, params) => {
                        let _this = this
                        return h('input', {
                             style: {
                                width: "120px",
                                height: "30px",
                                textIndent: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                outline: 'none'
                            },
                            domProps: {
                                value: params.row.subtitle
                            },
                            on: {
                                input: (event) => {
                                     _this.subtitleFun(params.index, event.target.value)
                                }
                            }
                        })
                    }
                },
                {
                    title: 'CODE',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        let _this = this
                        return h('input', {
                             style: {
                                width: "150px",
                                height: "30px",
                                textIndent: "12px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                outline: 'none'
                            },
                            domProps: {
                                value: params.row.productCode
                            },
                            on: {
                                input: (event) => {
                                     _this.codeFun(params.index, event.target.value)
                                }
                            }
                        })
                    }
                },
                {
                    title: '图片',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        let imgData = params.row.productImg
                        return imgData == "" ? h('div', [
                            h('Icon', {
                                props: {
                                    type: 'md-add',
                                    size: 'small'
                                },
                                style: {
                                    width: '60px',
                                    height: '60px',
                                    fontSize: '32px',
                                    textAlign: 'center',
                                    lineHeight: '40px',
                                    margin: '15px 0',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '10px',
                                },
                                on: {
                                    click: () => {
                                        this.openImg(params.index)
                                    }
                                }
                            })
                        ]) : h('div', {
                            style: {
                                position: 'relative',
                            }
                        }, [
                            h('img', {
                                style: {
                                    display: "inline-block",
                                    height: "60px",
                                    width: "60px",
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    borderRadius: '10px'
                                },
                                attrs: {
                                    src: params.row.productImg
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: 'md-close',
                                    size: 'small'
                                },
                                style: {
                                    position: 'absolute',
                                    top: '2px',
                                    right: '32px',
                                    color: '#fff',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    background: '#444',
                                    lineHeight: '20px',
                                    borderRadius: '50%',
                                },
                                on: {
                                    click: () => {
                                        this.removeImg(params.index)
                                    }
                                }
                            })
                        ])
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
                                    this.delItemProduct(params.index)
                                }
                            }
                        },'删除')
                    }
                }
            ],
            codeItemIndex: '',
            tempId: '',
            activityId: ''
        }
    },
    components: {
        imgSelect
    },
    created() {
        this.init()
        this.tempId = this.$route.query.id
        this.activityId = this.$route.query.activityId
        this.getData()
    },
    methods: {
        init() {
            this.tableData = []
        },
        getData() {
            console.log('我是请求')
            order.activityList({
                'product': this.tempId,
                'activatyId': this.activityId
            }).then(res => {
                if (res.code == 1) {
                    this.tableData = res.data.rows
                }
            }).catch(err => {
                console.log(err)
            })
        },
        addItem() {
            if (this.tableData) {
                this.tableData.push({activatyId: this.activityId,productId: this.tempId,productName: '', subtitle: '', productCode: '', productImg: ''})
            }
        },
        removeImg(index) {
            this.tableData[index].productImg = ''
        },
        delItemProduct(index) {
            let id = this.tableData[index].id
            console.log('idssss',id)
            if (id) {
                order.activityDel({
                    'id': id
                }).then(res => {
                    if (res.code == 1) {
                        this.$Message.success('删除成功')
                        this.getData()
                    } else {
                        this.$Message.error(res.message)
                    }
                })
            } else {
                this.tableData.splice(index,1)
            }
        },
        getimageData(data) {
            this.tableData[this.codeItemIndex].productImg = data[0].imgAddress;
        },
        titleFun(index,data) {
            console.log(index,data)
            this.tableData[index].productName = data
        },
        subtitleFun(index, data) {
            this.tableData[index].subtitle = data
        },
        codeFun(index,data) {
            this.tableData[index].productCode = data
        },
        openImg(index) {
            this.codeItemIndex = index
            this.$refs.imgDataRefs.uploadflg();
        },
        ruleFun() {
            console.log(this.tableData)
            let len = this.tableData.length
            for(let i = 0; i < len; i++) {
                if (this.tableData[i].productName == '') {
                    this.$Message.error('产品名字不能为空')
                    return false
                }
                if (this.tableData[i].subtitle == '') {
                    this.$Message.error('产品副标题不能为空')
                    return false
                }
                if (this.tableData[i].productCode == '') {
                    this.$Message.error('产品编码不能为空')
                    return false
                }
            }
            return true
        },
        save() {
            let result = this.ruleFun()
            if (!result) {
                return false
            }
            // this.tableData.forEach((element,index) => {
            //     element.productId = index + 1
            //     console.log(element)
            // });

            order.activityAdd({
                'product': this.tempId,
                'activatyId': this.activityId,
                'date': this.tableData
            }).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.$Message.success('保存成功')
                    this.$router.push(`/@/views/application/SmallBeautyBox/components/AddingProducts?id=${this.activityId}`)
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import './AddProducts.less';
</style>
