<template>
  <div class="container">
    <div class="currentTitle">支付设置</div>
    <Card>
      <Tabs type="card">
        <TabPane label="微信小程序">
          <div class="redu-box">
            <!-- 面包屑 -->
            <div class="redu-content">
              <!-- 内容区域内盒子 -->
              <div class="redu-inset">
                <!-- 内容标题 -->
                <div class="inset-content">
                  <!-- 表单区域 -->
                  <Form :model="reduForm" :rules="ruleCustom" :label-width="100" ref="reduForm">
                    <FormItem label="支付开启">
                      <RadioGroup v-model="reduForm.status">
                        <span>
                          <Radio :label="0">开启</Radio>
                        </span>
                        <span>
                          <Radio :label="1" :disabled="reduForm.status == 0">关闭</Radio>
                        </span>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="选择支付">
                      <Select style="width:300px" placeholder="选择支付" v-model="smallProgram">
                        <Option
                          v-for="(site,index) in suzu"
                          :key="index"
                          :value="site.title"                                                  
                        >{{ site.title }}</Option>
                      </Select>
                    </FormItem>
                  </Form>
                </div>
              </div>
              <center>
                <Button v-if="hasRole(6020201)" type="primary" class="baocun" @click.native="save(reduForm)">保存</Button>
              </center>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import order from "@/api/request/order";
import api from "@/api/request";

export default {
  name: "PaySetting",
  data() {
    return {
      smallProgram: "",
      suzu: [],
      reduForm: {
        id: "",
        status: "",
        title:''
      },
      // 验证规则
      ruleCustom: {}
    };
  },
  mounted() {
    this.editGroup();
  },

  activated() {
    this.restore();
  },
  methods: {
    //清空数据
    restore() {
      this.reduForm = {
        status: 0 //支付状态
      };
    },
    indexSelect() {
      console.log(123456); //在这里可以正确输出每个下拉框对应的下标值，当然输出值都是可以的
    },

    
    // 编辑接收参数
    editGroup() {
      let suzu = [];
      order.tradeList({
           
      }).then(res => {
        console.log(res.data.records[0].title,'33333333')
          if (res.code == 1) {
            // this.smallProgram = res.data.records.id
            this.suzu = res.data.records
            console.log(this.suzu)
            this.smallProgram = res.data.records[0].title
            // let datas = res.data.records;
            // let tempReq = {};
            // console.log(res.data.records, "555");
            // datas.map((v, i) => {
            //   tempReq.title = v.title;
            //   tempReq.id = v.id;
            //   tempReq.status = v.status;
            //   this.suzu.push(tempReq);
            //   tempReq = {};
            //   console.log(this.suzu)
            // });
          } else {
            // $Message.error(res.message)
          }
        }).catch(err => {
          // this.$Message.error('删除失败')
        });
    },

    //修改数据接口
    editFull(params) {
      console.log(this.suzu[this.smallProgram]);
      order
        .tradeUpdate({
          title: this.suzu[this.smallProgram].title,
          status: this.suzu[this.smallProgram].status, //支付状态
          id: this.suzu[this.smallProgram].id
        })
        .then(res => {
          console.log(res);
          //console.log(this.suzu)
          if (res.code == 1) {
            // this.backList();
          } else {
            this.$Message.error(res.message)
          }
          this.$Message.success("保存成功")
        })
        .catch(err => {
          this.$Message.error("保存失败")
        });
    },

    save(reduForm) {
      console.log(reduForm);
      // this.backList();
      this.editFull();
    },
    //保存跳转
    // backList() {
    //   this.$router.push("/@/views/payment/PayManagement");
    // }
  }
};
</script>

<style scoped>
.container {
  position: relative;
}
.container .redu-bread {
  line-height: 30px;
  height: 30px;
}
.container .star {
  color: red;
  padding: 5px;
  font-size: 20px;
  margin-right: 10px;
}
.container .redu-box {
  height: 400px;
}

.container .baocun {
  margin-top: 220px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
</style>
