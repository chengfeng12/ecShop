<template>
  <div class="issuing-voucher">
    <div class="currentTitle">手工发券</div>
    <Card>
      <div class="item1" slot="title">
          <!-- 新增限时折扣 -->
        <Button v-if="hasRole(40312)" type="primary" class="comBtn" @click="add" style="margin-left:0;">+添加新活动</Button>
        <DatePicker
            class="mar-le"
            @on-change="timeChange"
            @on-clear="clearTime"
            :editable="false"
            type="datetimerange"
            placement="bottom-end"
            placeholder="选择时间"
            style="width: 300px"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="times"
          ></DatePicker>
          <Select v-model="couponTypes" class="mar-le" style="width:120px">
            <Option v-for="(item,index) in typeList" :key="index" :value="item.id">{{ item.name }}</Option>
          </Select>
          <Input class="mar-le" v-model="activityName" placeholder="输入关键词搜索" style="width: 200px" />
          <Button class="mar-le" type="primary" @click="searchData">搜索</Button>
      </div>
      <div class="wrapper-box">
        <div class="item2">
          <Table :data="tableData" :columns="columns7" style="margin-right:16px;" border></Table>
          <!-- 停止 -->
          <Modal v-model="statusPop" title="确认提示" @on-ok="atatusOk" width="400px" :scrollable="false">
              <div class="popConWra">
                  <i class="tips"></i>
                  <span>确认停止该活动?</span>
              </div>
          </Modal>
          <!-- 发送的 -->
          <Modal v-model="statusTwoPop" title="确认提示" @on-ok="atatusTwoOk" width="400px" :scrollable="false">
              <div class="popConWra">
                  <i class="tips"></i>
                  <span>确认启用该活动?</span>
              </div>
          </Modal>
          <!-- 删除 -->
          <Modal v-model="delPop" title="确认提示" width="400px" @on-ok="confirmFun" :scrollable="false">
              <div class="popConWra">
                  <i class="tips"></i>
                  <span>{{tempMsg}}</span>
              </div>
          </Modal>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page
                :current="current"
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
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import marking from "@/api/request/marking"
import goodsUtils from "@/utils/goodsUtils.js"
export default {
  name: "FullCoupon",
  data() {
    return {
      tab0: true,
      statusPop: false,
      statusTwoPop: false,
      couponTypes: '0',
      activityName: '',
      times: [],
      typeList: [
        {
          id: '0',
          name: '全部类型'
        },
        {
          id: '1',
          name: '现金'
        },
        {
          id: '2',
          name: '折扣'
        },
        {
          id: '3',
          name: '实物'
        },
        {
          id: '4',
          name: '赠品'
        }
      ],
      tableData: [],
      columns7: [
        {
          title: "序号",
          key: "id",
          align: "center"
        },

        {
          title: "活动名称",
          key: "activity_name",
          align: "center"
        },
        {
          title: "优惠券名称",
          key: "coupon_name",
          align: "center"
        },
        {
          title: "优惠券类型",
          // key: "coupon_types",
          align: "center",
          render: (h,params) => {
            let text = null
            if (params.row.coupon_types == 1) {
              text = '现金券'
            } else if (params.row.coupon_types == 2) {
              text = '折扣券'
            } else if (params.row.coupon_types == 3) {
              text = '实物券'
            } else if (params.row.coupon_types == 4) {
              text = '赠品券'
            }
            return h('p',{},text)
          }
        },
        {
          title: "发券对象",
          align: "center",
          render: (h,params) => {
            let text = null
            if (params.row.send_object == 1) {
              text = '全部用户'
            } else if (params.row.send_object == 2) {
              text = '指定用户'
            } else if (params.row.send_object == 3) {
              text = '仅会员'
            } else if (params.row.send_object == 4) {
              text = '会员等级'
            }
            return h('p',{},text)
          }
        },
        {
          title: "发放人数",
          // key: "send_number",
          align: "center",
          render: (h,params) => {
            return h('p',{},params.row.send_number ? params.row.send_number : '——')
          }
        },
        {
          title: "发券时间",
          align: "center",
          render: (h,params) => {
            return h('p',{},params.row.time ? goodsUtils.timeTwoFun(goodsUtils.timeStamp(params.row.time)) : '——')
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render: (h, params) => {
            let text = ''
            if (params.row.status == 1) {
              text = '已完成'
            } else if (params.row.status == 2) {
              text = '发送中'
            } else if (params.row.status == 3) {
              text = '未开始'
            } else if (params.row.status == 4) {
              text = '已停止'
            }
            return h("p",{}, text);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 180,
          render: (h,params) => {
              let stateRes = params.row.status;
              let time = params.row.time
              let arr = []
              if (time == '') {
                arr.push(h("div", {
                  style: {
                    borderRight: this.hasRole(4031301)? "1px solid #0083b0":"none",
                    paddingRight:"10px",
                    cursor: "pointer",
                    'display': this.hasRole(40312) ?'block':'none',
                  },
                  on: {
                      click: () => {
                          this.editFun(params.row.id,params.index);
                      }
                  }
                },"编辑"))
              }
              if (stateRes == 1) {
                arr.push(h("div", {
                  style: {
                    borderRight: "1px solid #0083b0",
                    padding:"0 5px",
                    color: "#aaa"
                  },
                }, '发送'))
              }
              if (stateRes != 1 && time != '' && stateRes != 4) {
                arr.push(h("div", {
                  style: {
                    borderRight: "1px solid #0083b0",
                    padding:"0 5px",
                    cursor: "pointer",
                    // 'display': this.hasRole(4031301) ?'block':'none',
                  },
                  on: {
                      click: () => {
                          this.statusFun(params.index);
                      }
                  }
                }, '停止'))
              }
              if (stateRes == 4) {
                arr.push(h("div", {
                  style: {
                    borderRight: "1px solid #0083b0",
                    padding:"0 5px",
                    cursor: "pointer",
                    // 'display': this.hasRole(4031301) ?'block':'none',
                  },
                  on: {
                      click: () => {
                          this.statusSendFun(params.index);
                      }
                  }
                }, '发送'))
              }
              arr.push(h("div", {
                  style: {
                    padding:"0 10px",
                    cursor: "pointer",
                    'display': this.hasRole(4031302) ?'block':'none',
                  },
                  on: {
                      click: () => {
                          this.delFun(params.index);
                      }
                  }
              },"删除"))
              // let statusTemp = params.row.statusissue
              // let text = ''
              // if (statusTemp == 1) {
              //   text = '停止'
              // } else if (statusTemp == 2) {
              //   text = '停止'
              // }
              // console.log('????', statusTemp,text)
              return h("div", {
                style:{
                  display:'flex',
                  flexDirection:'row',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#0083b0',
                  'font-size':'13px'
                }
              }, arr);
        }
        }
      ],
      total: 0,
      size: 10,
      current: 1,
      tempMsg: '',
      tempStatus: '',
      tempId: '',
      delPop: false,
      tempIndex: '',
      startingTime: '',
      endTime: ''
    };
  },
  activated() {
    this.getData()
  },
  methods: {
    getData() {
        marking.manualVouchersList({
          'size': this.size,
          'current': this.current
        }).then(res => {
            if (res.code == 1) {
                this.integrationData(res.data)
            }
        }).catch(err => {
            console.log(err)
            this.$Message.error('请求失败')
        })
    },
    timeChange(value) {
      console.log(value)
      if (value[0] || value[1]) {
        console.log('......',value)
        this.startingTime = value[0]
        this.endTime = value[1]
      }
    },
    clearTime(data) {
      this.startingTime = ''
      this.endTime = ''
      console.log(data, this.startingTime, this.endTime)
    },
    searchData() {
      this.current = 1
      marking.manualVouchersList({
        'activityName': this.activityName,
        'couponTypes': this.couponTypes != 0 ? this.couponTypes : '',
        'startingTime': this.startingTime,
        'endTime': this.endTime,
        'size': this.size,
        'current': this.current
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
      this.total = data.total
      this.size = data.size
      this.current = data.current
      this.tableData = data.rows
    },
    add() {
      this.$router.push('/@/views/coupon/ShouVoucher/components/AddShou')
    },
    editFun(id,index) {
      // let status = this.tableData[index].status
      // //  状态值
      // if (status != 1) {
      this.$router.push('/@/views/coupon/ShouVoucher/components/AddShou?id=' + id + '&role=2')
      // } else {
      //   this.$Message.error('启动中的活动不可编辑')
      // }
    },
    statusFun(index) {
      this.statusPop = true;
      // if (this.tableData[index].statusissue == "2") {
      //     this.tempMsg = "确认启用该活动?";
      // } else {
      //     this.tempMsg = "确认暂停该活动?";
      // }
      this.tempId = this.tableData[index].id;
      // this.tempStatus = this.tableData[index].statusissue == 2 ? 1 : 2;
      // this.tempStatus = 2
    },
    statusSendFun(index) {
      this.statusTwoPop = true
      this.tempId = this.tableData[index].id;
    },
    atatusOk() {
      // console.log('我是停止的')
      // return false
      marking.manualVouchersStatus({
        'id': this.tempId,
        'statusissue': 2
      }).then(res => {
        if (res.code == 1) {
          this.$Message.success('停止成功')
          this.statusPop = false
          this.delPop = false
          this.getData()
        } else {
           this.$Message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('停止失败')
      })
    },
    atatusTwoOk() {
      // console.log('我是发送的')
      // return false
      marking.manualVouchersStatus({
        'id': this.tempId,
        'statusissue': 1
      }).then(res => {
        if (res.code == 1) {
          this.$Message.success('启用成功')
          this.statusPop = false
          this.delPop = false
          this.getData()
        } else {
           this.$Message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('启用失败')
      })
    },
    delFun(index) {
      this.tempId = this.tableData[index].id
      this.tempMsg = '是否确认删除这张优惠券?'
      this.delPop = true
    },
    confirmFun() {
      marking.manualVouchersDel({
        'id': this.tempId,
      }).then(res => {
        if (res.code == 1) {
          this.$Message.success('删除成功')
          if (this.tableData.length == 1) {
            this.current = this.current - 1
          }
          if (this.current <= 1) {
            this.current = 1
          }
          this.getData()
        } else {
          this.$Message.error(res.message)
        }
      }).catch(err => {
        this.$Message.error('删除失败')
      })
  },
  pagefun(index) {
    this.current = index;
    this.getData();
  },
  pageSizeFun(data) {
    this.size = data
    this.getData()
  }
  }
};
</script>
<style scoped>
@import url('../style/voucher.css');
</style>
