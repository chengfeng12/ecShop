<template>
  <div class="issuing-voucher">
    <div class="currentTitle">满额发券</div>
    <Card>
      <div class="item1" slot="title">
          <!-- 新增限时折扣 -->
        <Button v-if="hasRole(40308)" type="primary" @click="add" class="comBtn" style="margin-left:0;">+添加新活动</Button>
      </div>
      <div class="wrapper-box">
        <div class="item2">
          <Table :data="tableData" :columns="columns7" style="margin-right:16px;" border></Table>
          <!-- 状态切换 -->
          <Modal v-model="statusPop" title="确认提示" @on-ok="atatusOk" width="400px" :scrollable="false">
              <div class="popConWra">
                  <i class="tips"></i>
                  <span>{{tempMsg}}</span>
              </div>
          </Modal>
          <!-- 删除 -->
          <Modal v-model="delPop" title="确认提示" width="400px" :scrollable="false">
              <div class="popConWra">
                  <i class="tips"></i>
                  <span>{{tempMsg}}</span>
              </div>
              <div slot="footer">
                <Button type="default" @click="delPop = false">取消</Button>
                <Button type="primary" @click="confirmFun">{{tempText}}</Button>
              </div>
          </Modal>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <!-- show-elevator 显示电梯，可以快速切换到某一页 -->
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
          title: "满足条件",
          key: "meet_amount",
          align: "center"
        },
        {
          title: "发券存库",
          key: "inventory",
          align: "center"
        },
        {
          title: "活动时间",
          align: "center",
          render: (h,params) => {
            return h('p',{},params.row.timeData ? params.row.timeData : '——')
          }
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            return h("Button",{
              props: {
                type: params.row.activities_open == 2 ? 'error' : 'primary',
                size: "small"
              },
              on: {
                click: () => {
                  this.statusFun(params.index);
                }
              }
            },params.row.activities_open == 2 ? '未启用' : '启用');
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h,params) => {
              let stateRes = params.row.activities_open;
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
                    'display': this.hasRole(40308) ?'block':'none',
                  },
                  on: {
                      click: () => {
                          this.editFun(params.row.id,params.index);
                      }
                  }
              },"编辑"),
              h("div", {
                  class: {},
                  style: {
                    borderRight: "1px solid #0083b0",
                    padding:"0 10px",
                    cursor: "pointer",
                    'display': this.hasRole(4030802) ?'block':'none',
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
                    cursor: "pointer",
                    'display': this.hasRole(4030803) ?'block':'none',
                  },
                  on: {
                      click: () => {
                          this.delFun(params.index);
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
      tempMsg: '',
      tempStatus: '',
      tempId: '',
      tempText: '',
      delPop: false,
      tempIndex: ''
    };
  },
  activated() {
    this.getData()
  },
  methods: {
    getData() {
        marking.fullCouponList({
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
      data.rows.forEach((element,index) => {
          console.log(element)
          if (element.starting_time && element.end_time) {
            data.rows[index].timeData = goodsUtils.timeFun(goodsUtils.timeStamp(element.starting_time)) + '~' + goodsUtils.timeFun(goodsUtils.timeStamp(element.end_time))
          }
      })
      this.tableData = data.rows
    },
    add() {
      this.$router.push('/@/views/coupon/FullCoupon/components/addFull?role=1')
    },
    editFun(id,index) {
      let status = this.tableData[index].activities_open
      if (status == 2) {
        this.$router.push('/@/views/coupon/FullCoupon/components/addFull?id=' + id + '&role=2')
      } else {
        this.$Message.error('启动中的活动不可编辑')
      }
    },
    statusFun(index) {
      // console.log('状态切换',this.tableData[index].activities_open)
      this.statusPop = true;
      if (this.tableData[index].activities_open == "2") {
          this.tempMsg = "确认启用该活动?";
      } else {
          this.tempMsg = "确认禁用该活动?";
      }
      this.tempId = this.tableData[index].id;
      this.tempStatus = this.tableData[index].activities_open == 2 ? 1 : 2;
    },
    atatusOk() {
      marking.fullCouponStatus({
        'id': this.tempId,
        'activitiesOpen': this.tempStatus
      }).then(res => {
        if (res.code == 1) {
          this.$Message.success('切换成功')
          this.statusPop = false
          this.delPop = false
          this.getData()
        } else {
           this.$Message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('状态切换失败')
      })
    },
    delFun(index) {
      this.tempId = this.tableData[index].id
      this.tempStatus = this.tableData[index].activities_open == 2 ? 1 : 2;
      this.tempIndex = index
      if (this.tableData[index].activities_open == '2') {
        this.tempText = '确定'
        this.tempMsg = '是否确认删除这个活动?'
      } else {
        this.tempText = '确定禁用'
        this.tempMsg = '该活动启用中，如需删除需先禁用活动！'
      }
      this.delPop = true
    },
    confirmFun() {
      if (this.tableData[ this.tempIndex].activities_open == '2') {
        marking.fullCouponDel({
          'id': this.tempId,
        }).then(res => {
          if (res.code == 1) {
            // console.log(res)
            this.$Message.success('删除成功')
            this.delPop = false
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
      } else {
        this.atatusOk()
      }
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
