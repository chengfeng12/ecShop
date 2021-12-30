<template>
  <div class="container">
    <div class="currentTitle" v-if="type === 'add'">添加新模板</div>
    <div class="currentTitle" v-if="type === 'edit'">编辑新模板</div>
    <Card>
      <div class="redu-box">
        <div class="redu-content">
          <div class="redu-inset">
            <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduSult">
              <div class="redu-title">模板设置</div>
              <div class="inset-content">
                <FormItem label="模板名称" prop="smsName">
                  <Input
                    placeholder="请输入模板名称"
                    :maxlength="12"
                    style="width: 350px;"
                    v-model="reduForm.smsName"
                  ></Input>
                  <div class="string">输入模板名称，如：手机验证码通知</div>
                </FormItem>
                <FormItem label="服务商" prop="serverId">
                  <Select style="width:350px;" placeholder="请选择服务商号" v-model="reduForm.serverId" @on-change="getItemName">
                    <Option
                      v-for="(site,index) in suzu"
                      :key="index"
                      :value="site.id"
                    >{{ site.name }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="模板ID" prop="smsTemplateId">
                  <Input placeholder="请输入模板ID" style="width: 350px;" v-model="reduForm.smsTemplateId"></Input>
                  <div class="string">短信服务商提供的模板ID</div>
                </FormItem>
                <FormItem label="短信签名" prop="titles">
                  <Input style="width: 350px;"  v-model="reduForm.smsSign" disabled ></Input>
                </FormItem>
                <FormItem label="模板内容" prop="content">
                  <Input
                    placeholder="请输入模板内容"
                    style="width: 350px;"
                    v-model="reduForm.content"
                    @on-change="smsFun"
                  ></Input>
                </FormItem>
               <FormItem label="模板变量" class="ivu-form-item-required" porp="data">
                  <div class="variable-box">
                      <Card class="variable-left">
                          <div class="input-list" v-for="(item,index) in reduForm.data" :key="index">
                            <Input v-model="item.name" @on-focus="variableFun(index)" style="width: 300px" placeholder="输入变量值" @on-change="watchInput(index)">
                              <span slot="prepend">{{item.variableName}}</span>
                            </Input>
                          </div>
                      </Card>
                      <Card class="variable-right">
                        <Select slot="title" @on-change="typeFun" style="width: 200px" v-model="typeData">
                            <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{ item.typeName }}</Option>
                        </Select>
                        <div class="btns-list">
                          <Button class="btn-item" v-for="(item,index) in btnList" :key="index" @click="btnFun(index)">{{item.functionName	}}</Button>
                        </div>
                        <p>点击变量后会自动插入选择的文本框的焦点位置，在发送给粉丝时系统会自动替换对应变量值。</p>
                      </Card>
                  </div>
               </FormItem>

                <FormItem label="状态" prop="status">
                  <RadioGroup v-model="reduForm.status">
                    <Radio label="1">启用</Radio>
                    <Radio label="0">禁用</Radio>
                  </RadioGroup>
                  <div class="string">关闭后该短信将不能调用</div>
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <!--保存 取消 -->
      <div class="formBtn">
        <Button type="primary" class="comBtn" :loading="loading" @click.native="save(reduForm)">保存</Button>
        <Button type="default" class="comBtn" @click="backList()">返回列表</Button>
      </div>
    </Card>
  </div>
</template>


<script>
import member from "@/api/request/sms";
import goodsUtilsFun from "@/utils/goodsUtils";

export default {
  name: "addLetter",
  data() {
    return {
      loading: false,
      suzu:[],
      typeList: [],
      typeData: '',

      reduForm: {
        smsTemplateId:'',
        smsName: "", //模板名称
        serverId: '',//服务商名称
        id: "",
        smsSign: "",// 短信签名
        content: "", // 模板内容
        status: '0',
        data: [],
      },
      btnList: [],
      type: "add",
      reduSult: {
          smsName: [
              { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],
          serverId: [
              { required: true, message: '服务商不能为空', trigger: 'change' }
          ],
          smsTemplateId: [
              { required: true, message: '模板ID不能为空', trigger: 'change' }
          ],
          content: [
              { required: true, message: '模板内容不能为空', trigger: 'blur' }
          ]
      },
      tempIndex: 0
    };
  },
  created() {
    // this.type = this.$route.query.title;
    // if (this.type == "edit") {
    //   this.id = this.$route.query.id;
    //   this.init();
    // }
  },
  activated() {  
    this.restore();
    this.type = this.$route.query.title;
    this.smsTypeList()
    this.smsServerList()
    if (this.type == "edit") {
      this.id = this.$route.query.id;
      this.editGroup(this.id);
    }
  },
  watch: {
    reduForm: {
      handler(newValue) {
        console.log(newValue)
      },
      deep: true
    }
  },
  methods: {
    // 查询短信类型列表 底部的
    smsTypeList() {
      member.smsSelSmstypeList().then(res => {
        if (res.code == 1) {
          this.typeData = res.data[0].id
          this.typeList = res.data
          this.smsTypeBtnsList(res.data[0].id)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询短信类型列表 根据id查下面的按钮
    smsTypeBtnsList(id) {
      member.smsSelSmstypeBtnsList({
        'smsTypeId': id
      }).then(res => {
        if (res.code == 1) {
         console.log(res,'我是btns')
         this.btnList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    btnFun(index) {
      if (this.reduForm.data[0]) {
        // console.log(this.btnList[index].id)
        // return false
        let text = this.btnList[index].functionName	
        this.reduForm.data[this.tempIndex].name = "{" + text + "}"
        // this.reduForm.data[this.tempIndex].name = "{" + text + "}"
        this.reduForm.data[this.tempIndex].smsTypeFunctionId = this.btnList[index].id
        this.$forceUpdate()
        console.log(this.reduForm.data[this.tempIndex])
      }
    },
    typeFun(id) {
      console.log(id)
      this.smsTypeBtnsList(id)
    },
    // 输入框的定位
    variableFun(index) {
      this.tempIndex = index
    },
    watchInput(index) {
      // console.log('改变了',index)
      this.reduForm.data[index].smsTypeFunctionId = ''
      // console.log('this.reduForm.data', this.reduForm.data[index])
    },
    // 短信模板名字监听
    smsFun() {
      console.log(this.reduForm.content.split('}'))
      if (this.reduForm.content.indexOf('${') != -1 && this.reduForm.content.indexOf('}') != -1) {
        console.log('我是都有的',this.reduForm.content.indexOf('${'),this.reduForm.content.indexOf('}'))
        let arr = this.reduForm.content.split('}')
        // 截取
        let _this = this
        _this.reduForm.data = []
        arr.forEach((item,index) => {
            if (item.indexOf('${') != -1) {
              let left = item.indexOf('${')
              console.log('我是成立的,截取的内容',left,item.substr(left+2))
              let obj = {
                variableName: '',
                smsTypeFunctionId: '',
                name: ''
              }
              let tempData = item.substr(left+2)
              obj.variableName = tempData
              // obj.name = tempData
              if (obj.variableName) {
                _this.reduForm.data.push(obj)
                // ^[A-Za-z0-9]+$ 
                // let reg = /^[A-Za-z0-9-_]+$/
                // if (reg.test(obj.name)) {
                //   console.log('我是合法的',obj.name)
                //   _this.reduForm.data.push(obj)
                // } else {
                //   this.$Message.error('变量格式')
                //   console.log('我是不合法的',obj.name)
                //   // _this.reduForm.data.push(obj)
                // }
              }
              // _this.reduForm.data[index].variableName = item.substr(left+2)
              console.log(_this.reduForm)
            }
        }); 
      } else {
        console.log('我试试生死时')
        this.reduForm.data = []
      }
      
    },
    //清空数据
    restore() {
      this.reduForm = {
        smsTemplateId:'',
        smsName: "", 
        serverId: '',
        id: "",
        smsSign: "",
        content: "",
        status: '0',
        data: [],
      };
    },

    //绑定服务商数据
    getItemName (val) {
       console.log("数据",this.suzu[this.reduForm.serverId])
       console.log(val,'afheihfaiewhf')
      this.suzu.forEach((element,index) => {
          if(val == element.id) {
              this.reduForm.smsTemplateId = element.templateId
              this.reduForm.smsSign = element.name
          }
      });
    },
    //模板服务商接口
    smsServerList() {
      member.smsSelSmsServerList({}).then(res => {
          if (res.code == 1) {
            console.log('请求*************',res.data)
            // this.suzu = res.data
            res.data.forEach((element,index) => {
              console.log(element)
              res.data[index].id = element.id + ''
            })
            this.reduForm.serverId = res.data[0].id + ''
            this.reduForm.smsTemplateId = res.data[0].templateId
            this.reduForm.smsSign = res.data[0].name
            this.suzu = res.data
          }
        }).catch(err => {
           this.$Message.error(res.message);
        });
    },
    // 查看详情
    editGroup() {
      console.log(this.id);
      member.smsSelectById({
          id: this.id
        }).then(res => {
          let datas = res.data
          console.log(res.data.serverInfo.id, "444");
          if (res.code == 1) {      
              this.reduForm.smsName = res.data.smsName //模板名称 
              this.reduForm.serverId	= res.data.serverId + ''     
              this.reduForm.smsTemplateId = res.data.smsTemplateId // 模板ID
              this.reduForm.smsSign = res.data.smsSign //短信签名
              this.reduForm.content = res.data.content //模板内容
              this.reduForm.data = JSON.parse(res.data.data)
              // this.reduForm.id = res.data.id
              this.reduForm.status = res.data.status + '' //支付状态
          } else {
            this.$Message.error(res.message)
          }
        }).catch(err => {
          // this.$Message.error('请求失败')
        });
    },

    //修改数据接口
    editFull(params) {
      console.log('this.reduForm.',this.reduForm)
      // return false
      member.smsUpdate({
          smsName: this.reduForm.smsName, // 模板名称
          serverId: this.reduForm.serverId,
          smsTemplateId: this.reduForm.smsTemplateId, //模板ID
          smsSign: this.reduForm.smsSign, // 短信签名
          content:this.reduForm.content, //模板内容
          data: this.reduForm.data,
          status: this.reduForm.status, //支付状态
          id: this.id,
        }).then(res => {
          this.loading = false
          if (res.code == 1) {
            this.$Message.success("修改成功");
            this.backList();
          } else {
            this.$Message.error(res.message);
          }
        }).catch(err => {
          this.loading = false
          console.log(err)
          this.$Message.error('保存失败')
        });
    },

    //添加短信接口
    addFull(params) {
      console.log('添加了')
      member.smsSave({
          smsName: this.reduForm.smsName, // 模板名称
          serverId: this.reduForm.serverId,
          smsTemplateId: this.reduForm.smsTemplateId, //模板ID
          smsSign: this.reduForm.smsSign, // 短信签名
          content:this.reduForm.content, //模板内容
          data: this.reduForm.data,
          status: this.reduForm.status, //支付状态
        }).then(res => {
          this.loading = false
           console.log(res,'保存数据')
          if (res.code == 1) {
            this.$Message.success("保存成功");
            this.backList();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false
          this.$Message.error("保存失败")
        });
    },

    //添加保存
    save(reduForm) {
      console.log(reduForm);
      this.$refs.reduForm.validate((valid) => {
        console.log(valid)
        // return false
        if (valid) {
          if (this.reduForm.data.length == 0) {
            this.$Message.error('模板变量不能为空')
            return
          } else {
            let num = 0
            this.reduForm.data.forEach((element,index) => {
              console.log(element);
              // element.smsTypeFunctionId == '' 
              if (element.variableName == '' || element.name == '') {
                num = num + 1
                console.log('num',num)
              }
            })
            if (num > 0) {
              this.$Message.error('模板变量内容不能为空')
              return
            }
          }
          this.loading = true
          if (this.type == "edit") {
            this.editFull();
          } else {
            this.addFull();
          }
        }
      });
    },
    //保存跳转
    backList() {
      this.$router.push("/@/views/payment/letter");
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
}

.container .redu-box {
  padding: 0 20px;
}

.container .redu-content {
  padding: 20px 20px 100px 20px;
}

.container .redu-inset {
  background: #fff;
}

.container .string {
  color: #aeaeae;
}

.container .redu-title {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  padding-left: 10px;
  background: #f1f1f1;
}

.container .inset-content {
  padding: 40px 0 30px 50px;

  background: #fff;
}

.container .formBtn {
  width: 300px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}

.container .comBtn {
  width: 120px;
  margin: 0 5px;
}

.variable-box .btns-list {
  height: 120px;
  overflow: auto;
  margin: 15px 0;
}
.variable-box .btn-item {
  margin: 10px;
}
.variable-box {
  display: flex;
  /* justify-content: space-between; */
}
.variable-left .input-list {
  margin-bottom: 10px;
}
.variable-right {
  width: 260px;
  margin-left: 30px;
}
.variable-right p {
  color: #ccc;
}
</style>
