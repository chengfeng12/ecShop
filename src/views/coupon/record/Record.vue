<template>
  <div class="containers">
    <div class="currentTitle">发放记录</div>
    <Card>
      <div class="wrapper">
        <div class="item1">
          <Select v-model="froms" style="width:120px" placeholder="全部获得方式">
            <Option v-for="item in ModeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <Select v-model="type" style="width:120px;margin-left:20px;" placeholder="全部券类型">
            <Option v-for="item in TypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <Select v-model="status" style="width:100px;margin-left:20px;" placeholder="全部状态">
            <Option v-for="item in chooseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <DatePicker type="date" @on-change="timesSelect" format="yyyy-MM-dd" placeholder="获得时间"  style="width: 200px;margin-left:20px;"></DatePicker>

          <DatePicker type="date" @on-change="timesSelect1" format="yyyy-MM-dd" placeholder="使用时间" style="width: 200px;margin-left:20px;"></DatePicker>

          <Input  v-model="couponsName" placeholder="请输入关键词搜索" style="width: 200px; margin-left: 20px"/>
          <Button type="primary" class="comBtn" @click="selectbtn()">搜索</Button>
        </div>

        <div class="datass">
          <div class="datass_t">今日发放数据</div>
          <div class="datass_b">
               <ul class="datass_bb" >
                 <li class="datass_b1" style="border:0;">
                    <p>有效优惠券</p>
                    <p><label>{{ numberss.effective }}</label>张</p>
                 </li>
                 <li class="datass_b1">
                    <p>发放数量</p>
                    <p><label>{{ numberss.couponid }}</label>张</p>
                 </li>
                 <li class="datass_b1">
                    <p>发放人数</p>
                    <p><label>{{ numberss.memberID }}</label>人</p>
                 </li>
                 <li class="datass_b1">
                    <p>使用数量</p>
                    <p>{{ numberss.status }}张</p>
                 </li>
               </ul>
          </div>
        </div>
        <div class="item2">
          <!-- 表格  stripe斑马纹-->
          <Table :data="suzu" :columns="tableColumns1" style="margin-right:16px;" border></Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
             <Button @click="exportFuc">导出</Button>
            <div style="float: right;">
             
              <!-- show-elevator 显示电梯，可以快速切换到某一页 -->
              <Page
                :total="total"
                :page-size="pageSize"
                :current="current"
                show-sizer
                :page-size-opts="[10,15,20]"
                @on-page-size-change="pageSizeFun"
                @on-change="changepage"
                show-elevator
                show-total
                style="margin-right:16px;"
              ></Page>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import marking from '@/api/request/marking'
  import api from '@/api/request'
  import goodsUtilsFun from '@/utils/goodsUtils'
export default {
  name: "Record",
  data() {
    return {
      //发放数量
      numberss:{
          effective:'',
          status:'',
          memberID:'',
          couponid:'',
      },
       // 查询相关
      used_time:'',//使用时间
      title:"",
      pageSize: 10,  // 每页条数
      total: 0, // 总条数
      current: 1, // 页码
      create_time:'',// 获得时间
      froms:'',//获得方式
      status:'',//状态
      type:'',// 优惠券类型
      couponsName:'',//搜索关键词
      suzu:[], //临时数据
      chooseList: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "0",
          label: "已使用"
        },
        {
          value: "1",
          label: "未使用"
        }
      ],
      ModeList: [
        {
          value: "",
          label: "全部获得方式"
        },
        {
          value: "2",
          label: "新人发券"
        },
        {
          value: "3",
          label: "满额发券"
        },
        {
          value: "4",
          label: "购物发券"
        },
        {
          value: "5",
          label: "手动发券"
        },
      ],
      //选择类型
      TypeList: [
        {
          value: "",
          label: "全部类型券"
        },
        {
          value: "1",
          label: "现金券"
        },
        {
          value: "2",
          label: "折扣券"
        },
        {
          value: "3",
          label: "实物券"
        },
         {
          value: "4",
          label: "赠品券"
        }
      ],
      //表格逻辑
      tableColumns1: [
        {
          title: "优惠券类型",
          key: "type",
          align: "center",
          width: 150,
          render: (h, params) => {
              let type = params.row.type
              let text = type === 1 ? '现金券':type === 2 ? '折扣券':type === 3 ? '实物券': type === 4 ? '赠品券':''
              return h('div', text);
            }
        },
        {
          title: "优惠券名称",
          key: "title",
          align: "center",
          //width: 50
          render: (h, params) => {
              let title = params.row.title
              return h('div', title);
            }
        },
        {
          title: "用户信息",
          key: "nickname",
          //width: 220,
          align: "center",
          render: (h, params) => {
                        return h ('div', [
                            h ('img', {
                                attrs: {
                                    src: params.row.avatar,
                                    // style: 'width: 40px;height: 40px;'
                                },
                                style: {
                                    width:'40px',
                                    height:'40px',
                                    verticalAlign:'middle'
                                },
                            }),
                            h ('span', {
                                class: {
                                  'user-name': true,
                                },
                                style: {
                                  // 'verticalAlign': top

                                }
                            }, params.row.nickname)
                        ])
                    }
        },
        {
          title: "获得方式",
          key: "froms",
          //width: 220,
          align: "center",
            render: (h, params) => {
              let froms = params.row.froms
              let text = froms === 5 ? '手动发券':froms === 2 ? '新人发券':froms === 3 ? '满额发券': froms === 4 ? '购物发券':froms === 6 ? '抽奖发券':""
              return h('div', text);
            }
        },

        {
          title: "获得时间",
          key: "create_time",
          //width: 220,
          align: "center",
          render: (h, params) => {
              let create_time = goodsUtilsFun.timeFun(new Date(params.row.create_time).getTime())
              return h('div', create_time);
            }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          // width: 120,
          render: (h, params) => {
              let status = params.row.status
              return h('div', [
                status == '0' ?
                  h('div', {
                    props: {
                      type: '',
                    },
                    style:{
                    }
                  }, '已使用') :
                  status == '1' ? h('div', {
                    props: {
                      type:'',
                    },
                  }, '未使用') : null
              ]);
                  }
        },
        {
          title: "使用时间",
          key: "used_time",
          //width: 120,
          align: "center",
          render: (h, params) => {
              let used_time = goodsUtilsFun.timeFun(new Date(params.row.used_time).getTime())
              return h('div', used_time);
            }
        },

        {
          title: "使用订单号",
          key: "order_no",
          //width: 120,
          align: "center",
         render: (h, params) => {
              let order_no = params.row.order_no
              return h('div', order_no);
            }
        }
      ]
    };
  },


  methods: {
            //分页
      changepage(index){
        this.current = index;
        this.switchFun()
        console.log(this.suzu,'3333')
      },
      pageSizeFun(data) {
        this.pageSize = data
        this.switchFun()
      },
      //发放记录数量显示
      numberRecords(){
          marking.memberCouponRecord({
          }).then(res =>{
              if(res.code == 1){
                  this.numberss.effective = res.data.rows.effective
                  this.numberss.couponid = res.data.rows3.couponId
                  this.numberss.memberID = res.data.rows3.memberId
                  this.numberss.status = res.data.rows2.status
              }else{

              }
          }).catch(err=>{

          })
      },

      //搜索
       selectbtn(){
         console.log(this.froms)
         console.log(this.type)
         console.log(this.status)
         console.log(this.create_time)
          this.suzu=[];
          this.switchFun()
        },
        exportFuc: function() {
          api.exportFile(
            "/api/membercoupon/excllist",
            "marking",
            {
              current: this.current,         
              type:this.type,
              createTime:this.create_time,
              usedTime : this.used_time,
              status:this.status,
              froms:this.froms,
              nickname:this.couponsName
          })
            .then(res => {    
              console.log(res);
            }).catch(error => {
              console.log(error);
            });
        },
        timesSelect:function(value){
          console.log("获得时间----------------",value)
          this.create_time=value
        
        },

        timesSelect1:function(value){
          this.used_time=value
          console.log("使用时间---------------------",value)
        },

          // 获取数据的接口函数
      switchFun(index) {
        marking.memberCouponLisetMemberCoupon({
           current: this.current,
           size: this.pageSize,
           total:this.total,
           type:this.type,

           createTime:this.create_time,
           usedTime : this.used_time,  
           status:this.status,
           froms:this.froms,
           title:this.couponsName
        }).then(res => {
          console.log("数据",res)
          if(res.code=1){
            this.getDataFun(res)   
            this.total = res.data.total
          }
          else{
            this.$Message.error(res.message)
          }
        }).catch(err => {
          console.log((err))
        })
      },
      getDataFun(res) {
        this.suzu = []
        console.log(res.data.rows)
        let datas = res.data.rows
        let tempReq = {}
        console.log(datas,'444')
        datas.forEach((item) => {
          let { id,froms,title,type,create_time,nickname,order_no,status,avatar,used_time} = item
          tempReq.id = id
          tempReq.froms = froms //获取方式
          tempReq.title = title //优惠券名称
          tempReq.type = type // 优惠券类型
          tempReq.used_time = used_time  // 使用时间
          tempReq.create_time = create_time // 获得时间
          tempReq.nickname = nickname  //  用户昵称
          tempReq.order_no = order_no // 订单编号
          tempReq.status = status  // 使用状态
          tempReq.avatar = avatar // 头像
          this.suzu.push(tempReq)
          tempReq = {}
          this.tempId = id
          // console.log(type)
        })

      },
  },

  created(){
      this.switchFun()
      this.numberRecords()
  },
};
</script>

<style scoped>
.containers {
  width: 100%;
  height: 100%;
}

.containers .title {
  height: 30px;
  line-height: 30px;
  text-indent: 20px;
  font-size: 16px;
}

.containers .wrapper {
  box-sizing: border-box;
  background: #fff;
  margin: -16px;
  padding-top: 20px;
}

.containers .tab {
  height: 1000px;
  background: #fff;
  padding-top: 16px;
  border-left: 1px solid #c9c9c9;
  border-right: 1px solid #c9c9c9;
}

.containers .item1 {
  border-bottom: 1px solid #e8eaec;
  padding-bottom: 16px;
  padding-left: 16px;
}

.containers .comBtn {
  margin: 0 30px;
}

.containers .fullBtn {
  margin-left: 230px;
}

.containers .item2 {
  margin-top: 30px;
  margin-left: 16px;
}

.containers .datass{
  margin-top: 10px;
  margin-left: 1%;
  width: 98%;
  border: 1px solid rgb(220, 220, 220);
}
.containers .datass_t{
  height: 30px;
  background:#0083B0;
  font-size: 14px;
  line-height: 28px;
  color: #fff;
  padding-left: 10px;
}
.containers .datass_bb{
 /* overflow: hidden; */
 display: flex;
 text-align: center
}
.containers .datass_b1{
flex: 1;
font-size: 18px;
color:#808080;
border-left:1px solid #c0c0c0;
padding: 20px 0;
}
.containers .datass_b1 p{
  padding: 5px 0;
}
.containers .user-name {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    text-align: left;
    margin-left: 5px;
    vertical-align: top;
    width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.containers .user-name:hover {
    width: 150px;
}
.currentTitle{
  font-size: 13px;
  color: #000;
  padding: 4px 0;
  background: #f8fbfb;
}
</style>
