<template>
  <div class="container">
    <div class="currentTitle">交易设置</div>
    <Card>
      <div class="redu-box">
        <div class="redu-content">
          <!-- 内容区域内盒子 -->
          <div class="redu-inset">
            <!-- 内容标题 -->
            <div class="redu-title">基础设置</div>
            <div class="redu-off" ref="reduForm">
              <div class="redu-zidong">
                <div class="redu-dingdan">自动关闭未付款订单：</div>
                <div class="redu-time">
                  下单后 &nbsp;
                  <!-- @on-change="regNumber('time')" -->
                  <Input :maxlength="2" v-model="reduForm.time" placeholder style="width: 100px"/>&nbsp;分钟，自动关闭未付款订单
                </div>
                <span>(订单下单未付款，在规定时间后自动关闭，0或者空为不自动关闭)</span>
              </div>
              <div class="redu-zidong">
                <div class="redu-dingdan">自动收货：</div>
                <div class="redu-time">
                  发货后 &nbsp;
                  <!-- @on-change="regNumber('data')" -->
                  <Input :maxlength="2" v-model="reduForm.data" placeholder style="width: 100px"/>&nbsp;天，自动变更订单为已完成
                </div>
                <span>(订单发货后，用户收货的天数，如果在期间未确认收货，系统自动完成收货，0或空为不自动收货)</span>
              </div>
              <div class="redu-zidong">
                <div class="redu-dingdan">获取微信收货地址：</div>
                <div class="redu-time">
                  <RadioGroup v-model="reduForm.address">
                    <Radio :label="0">开启</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Radio :label="1" disabled>关闭</Radio>
                  </RadioGroup>
                </div>
                <span>(是否在用户添加收货地址时候获取用户的微信收货地址)</span>
              </div>
            </div>
          </div>

          <center>
            <Button v-if="hasRole(6020101)" type="primary" class="baocun" :loading="loading" @click.native="addFull">保存</Button>
          </center>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import order from "@/api/request/order";
import api from "@/api/request";

export default {
  name: "PayTransaction",
  data() {
    return {
      loading: false,
      reduForm: {
        id:'',
        time: 0,
        data: "",
        address: ""
      },
      // reduRule: {
      //   time: [{
      //     required: false,
      //     message: '活动名称不能为空',
      //     trigger: 'blur',
      //   }]
      // }
    };
  },

  created() {
    this.checks();
  },
  methods: {
    //清空数据
    //   restore(){
    //     this.reduForm = {
    //       time: '',
    //       data: '',
    //       address:0,
    //     }
    //   },
    regNumber(type){
      if(type == 'time'){
        // this.reduForm.time = this.reduForm.time.replace(/[^\a-\z\A-\Z0-9]/g, '');
        // if (this.reduForm.time * 1  > 10) {
        //   this.$set(this.reduForm,'time',10)
        // }
      }else{
        // this.reduForm.data = this.reduForm.data.replace(/[^\a-\z\A-\Z0-9]/g, '');
      }
    },
    //查询数据
    checks() {
      order
        .settingsList()
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            console.log(res.data.autoCloseTime);
            this.reduForm.time = res.data.autoCloseTime;
            this.reduForm.data = res.data.autoFinshDay;
            this.reduForm.address = res.data.isGetAddress;
            this.reduForm.id = res.data.id
          } else {
          }
        })
        .catch(err => {});
    },

    //添加支付接口
    addFull(params) {
      // console.log(this.reduForm.data)
      console.log(typeof this.reduForm.data)
      // console.log(isNaN(this.reduForm.data))
        // let res = /^\+?[1-9][1-9]*$/
      let res = /^([1-9]\d*|0)(\.\d*[1-9])?$/
      if (this.reduForm.time != '') {
        if (!res.test(this.reduForm.time)) {
          this.$Message.error('下单时间格式错误')
          return false
        }
        if (this.reduForm.time < 5) {
            this.$Message.error('下单时间不能小于5')
            return false
        }
        if (this.reduForm.time > 10) {
            this.$Message.error('下单时间不能大于10')
            return false
        }
      }


      if (this.reduForm.data != '') {
        if (!res.test(this.reduForm.data)) {
          this.$Message.error('发货时间格式错误')
          return false
        }
        if (this.reduForm.data < 7) {
            this.$Message.error('发货时间不能小于7')
            return false
        }
        if (this.reduForm.data > 30) {
            this.$Message.error('发货时间不能大于30')
            return false
        }
      }
      this.loading = true
      order
        .settingsSave({
          autoCloseTime: this.reduForm.time ? this.reduForm.time : 0,
          autoFinshDay: this.reduForm.data ? this.reduForm.data : 0,
          isGetAddress: this.reduForm.address,
          id:this.reduForm.id
        })
        .then(res => {
          this.loading = false
          console.log(res);
          if (res.code == 1) {
            this.$Message.success("保存成功")
            this.checks()
          } else {
            this.$Message.error(res.message)
          }
        }).catch(err => {
          this.loading = false
          this.$Message.error("保存失败")
        });
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
}

.container .redu-box {
}

.container .redu-bread {
  line-height: 30px;
  height: 30px;
}
.container .redu-content {
  font-size: 12px;
  color: #515a6e;
}

.container .star {
  color: red;
  padding: 5px;
  font-size: 20px;
  margin-right: 10px;
}

.container .redu-title {
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  padding-left: 15px;
  background: #f1f1f1;
  color: #000;
}
.container .redu-off {
}
.container .redu-zidong {
  margin: 30px 0 0 50px;
}
.container .redu-zidong span {
  margin-left: 45px;
}
.container .redu-dingdan {
  color: #000;
  margin-bottom: 20px;
}
.container .redu-time {
  margin: 0 0 10px 45px;
  color: #000;
}
.container .baocun {
  text-align: center;
  position: absolute;
  margin-top: 30px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
</style>
