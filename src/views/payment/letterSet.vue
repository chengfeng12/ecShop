<template>
  <div class="container">
    <div class="currentTitle">短信接口设置</div>
    <Card>
      <!-- <BreadcrumbItem>短信接口设置</BreadcrumbItem> -->
      <div class="redu-box">
        <div class="redu-content">
          <div class="redu-inset">
              <div class="redu-title">短信接口</div>
              <!-- v-model="smallProgram" -->
              <div class="inset-content">
                     <div v-for="(site,index) in suzu"
                          :key="index"
                          :value="index"
                          :name="site.name"
                          :account="site.account"
                          :password="site.password"
                          :id="site.id"
                          :status="site.status"
                          >
                         <div class="smsName">
                           <span style="margin-right: 30px">{{site.name}}</span><i-switch v-model="site.status" @on-change="change1" style="position: absolute;left:300px ;"/>
                         </div>
                         <div>
                           <div class="tetx">
                             <span class="passwrod">账号</span>
                             <Input placeholder="" :maxlength="12" style="width: 250px;" v-model="site.account"></Input>
                           </div>
                           <div class="tetx">
                             <span class="passwrod">密码</span>
                             <Input placeholder="" :maxlength="12" style="width: 250px;" v-model="site.password"></Input>
                           </div>
                         </div>
                     </div>
              </div>
          </div>
        </div>
      </div>
      <div class="formBtn">
        <Button v-if="hasRole(6030201)" type="primary" class="comBtn" :loading="loading" @click="save">保存</Button>
      </div>
    </Card>
    <!--保存 取消 -->

  </div>
</template>


<script>
  import member from "@/api/request/sms";
  import api from "@/api/request";

export default {
  name: "letterSet",
  data() {
    return {
      loading: false,
      smallProgram:'',
      flag:false,
      suzu:[],
      reduForm:{

      },
      ruleValidate:{

      },
    };
  },
  created(){
      this.smsServerList()
  },
  methods: {
    change1(status){
       
    },

    //模板服务商接口
    smsServerList() {
      let suzu = [];
      member.smsSelSmsServerList({

        }).then(res => {
          console.log(res)
          if (res.code == 1) {
            let datas = res.data;
            let tempReq = {};
            console.log(datas, "555");
            datas.map((v, i) => {
              tempReq.name = v.name; //服务商名称
              tempReq.id = v.id;
              tempReq.account = v.account;  // 账号
              tempReq.password = v.password;  // 密码
              tempReq.status = v.status == 1 ? true : false;
              this.suzu.push(tempReq);
              tempReq = {};
              console.log(this.suzu,'333');
            });

          }else{

          }
        }).catch(err => {

      });
    },

    save(){
      this.loading = true
      console.log(this.suzu)
      let rawData = [...this.suzu]
      let newRawData = []
      rawData.map((v,i) => {
        newRawData.push({
          ...v,
          status:v.status ? 1 : 0
        })
      })

      console.log(newRawData)
      member.saveSmsServer({
        serverInfoListS:newRawData
      }).then((res) => {
        this.loading = false
        console.log(res)
        if(res.code == 1){
          this.$Message.success(res.message)
        }else{
          this.$Message.error(res.message)
        }
      }).catch(er => {
        this.loading = false
      })
    },
  }
};
</script>

<style scoped>
.container {
  position: relative;
}

.container .redu-box {
  margin: -16px;
}

.container .redu-content {
  padding: 20px 20px 100px 20px;
}

.container .redu-inset {
  background: #fff;
  border: 1px solid #c9c9c9;
}

.container .redu-title {
  height: 30px;
  line-height: 30px;
  color: #000;
  padding-left: 15px;
  background-color: #f2f2f2;
}

.container .inset-content {
  padding: 40px 0 30px 50px;

  background: #fff;
}

.container .formBtn {
  width: 250px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}

.container .comBtn {
  margin: 0 5px;
}
  .container .passwrod{
    margin-right: 20px;
  }
  .container .tetx{
    margin: 0 0 25px 40px;
  }
  .container .smsName{
    margin-bottom: 50px;
  }
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
</style>
