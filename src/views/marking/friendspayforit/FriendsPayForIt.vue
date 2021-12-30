<template>
    <div id="friends-pay-for-it">
      <div class="currentTitle">朋友代付 </div>
        <Card>
            <div class="header">
                <div class="standard">
                    <p>启用代付功能后，代付发起人（买家）下单后，可将订单分享给小伙伴（朋友圈、微信群、微信好友），请他帮忙完成付款。</p>
                    <p>朋友代付可设置代付限额，默认为空（或填写0）即表示代付无限制。</p>
                    <p>代付开启后即店铺内所有商品仅可使用该代付功能。</p>
                </div>
                <div class="switch-box">
                    <i-switch size="default" v-model="status">
                    </i-switch>
                </div>
            </div>
            <div v-if="status" class="main">
                <h3 class="title">发起人设置</h3>
                <div>
                    <span>求助语句</span>
                    <div class="input-box">
                        <div v-for="(item,index) in helpStatment" class="inp-item" :key="index">
                            <Input v-model="item.msg" :maxlength="100" style="width: 450px" />
                        </div>
                        <div class="btn-box">
                            <Button type="primary" @click="addHelpMsg">+添加求助语句</Button>
                        </div>
                        <p>多句求助语句系统将随机选择出现以上一条求助语句。</p>
                    </div>
                </div>
                <h3 class="title">待付人设置</h3>
                <div>
                    <span>代付限制</span>
                    <Input v-model="paidMoney" style="width: 300px" />
                    <p>每人最多代付多少元 如果是空或0 则不限制。</p>
                </div>
                <h3 class="title">待付优惠设置</h3>
                <div>
                    <span>代付单笔金额满</span>
                    <Input v-model="topUp" style="width: 200px" />元，即可立减
                    <Input v-model="knock" style="width: 200px" />元
                </div>
            </div>
            <div class="footer">
                <Button v-if="hasRole(4010901)" type="primary" :loading="loading" @click="keep">保存</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import marking from "@/api/request/marking";
export default {
    data() {
        return {
            loading:false,
            status: false,
            helpStatment: [],
            paidMoney: '',
            topUp: '',
            knock: '',
            tempId: ''
        }
    },
    created() {
        // 查询详情
        this.getData()
    },
    methods: {
        getData() {
            marking.friendDetail().then(res => {
                if (res.code == 1) {
                    if (res.data) {
                        this.status = res.data.status == 1 ? true : false
                        this.helpStatment = JSON.parse(res.data.helpStatment)
                        this.paidMoney = res.data.paidMoney 
                        this.topUp = res.data.topUp
                        this.knock = res.data.knock
                        this.tempId = res.data.id
                    }
                } else {
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                this.$Message.error('请求失败')
                console.log(err)
            })
        },
        addHelpMsg() {
            let obj = {}
            obj.msg = ''
            this.helpStatment.push(obj)
        },
        rule() {
            let numReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
            if (this.paidMoney != '') {
                if (!numReg.test(this.paidMoney)) {
                    console.log(numReg.test(this.paidMoney))
                    this.$Message.error('代付限制输入错误')
                    return false
                }
            }
            if (this.topUp != '') {
                if (!numReg.test(this.topUp)) {
                    console.log(numReg.test(this.topUp))
                    this.$Message.error('代付单笔金额输入错误')
                    return false
                }
            }
            if (this.knock != '') {
                if (!numReg.test(this.knock)) {
                    console.log(numReg.test(this.knock))
                    this.$Message.error('代付单笔金额立减额输入错误')
                    return false
                }
            }
            return true
        },  
        keep() {
            let res = this.rule()
            if (!res) {
                return false
            }
            this.loading=true;
            // 判断验证
            marking.friendSave({
                'id': this.tempId,
                'status': this.status ? 1 : 0,
                'helpStatment': this.helpStatment,
                'paidMoney': this.paidMoney,
                'topUp': this.topUp,
                'knock': this.knock
            }).then(res => {
                if (res.code == 1) {
                    this.loading=false;
                    this.$Message.success('保存成功')
                    this.getData()
                } else {
                    this.loading=false;
                    this.$Message.error(res.message)
                }
            }).catch(err => {
                 this.loading=false;
                this.$Message.error('保存失败')
            })
        }
    }
}
</script>

<style lang="less" scoped>
  .standard{
    width: 95%;
  }
  .standard p{
    padding: 1px 0;
  }
#friends-pay-for-it {
    .header {
        display: flex;
        justify-content: space-between;
        background: #ffffcc;
        padding: 15px 10px;
        color: #555;
        // margin-bottom: 10px;
        border: 1px dashed #ffcc99;
        .text-p {
            padding: 10px;
            p {
                margin: 5px;
            }
        }
        .switch-box {
            display: flex;
            align-items: center;
        }
    }
    .main {
        padding-left: 10px;
        margin-top: 15px;
        // .con {
        //     display: inline-block;
        // }
        .title {
            font-weight: 400;
            font-size: 18px;
            height: 30px;
            line-height: 30px;
            margin-bottom: 20px;
            padding-left: 10px;
            background: #f1f1f1;
        }
        div {
            span {
                display: inline-block;
                width: 120px;
                text-align: right;
                margin-right: 20px;
                vertical-align: top;
            }
            p {
                margin-left: 140px;
                padding: 10px 0;
                color: #ccc;
            }
            .input-box {
                display: inline-block;
                .inp-item {
                    margin-bottom: 10px;
                }
                p {
                    margin: 0;
                }
            }
        }
    }
    .footer {
        margin-top: 40px;
        display: flex;
        justify-content: center;
    }
}
  .currentTitle{
    font-size: 13px;
    padding: 4px 0;
    background: #f8fbfb;
    color: #000;
  }
</style>

