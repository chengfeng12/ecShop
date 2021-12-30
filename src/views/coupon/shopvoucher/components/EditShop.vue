<template>
  <div class="container">
    <div class="redu-box">
      <!-- 内容区域 -->
      <div class="redu-content">
        <!-- 内容区域内盒子 -->
        <div class="redu-inset">
          <Card>
            <div class="redu-title">活动设置</div>
            <div class="inset-content">
              <!-- 表单区域 -->
              <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduRule">
                <FormItem label="活动开启">
                  <span class="star">*</span>
                  <RadioGroup>
                    <Radio label="开启"></Radio>
                    <Radio label="关闭"></Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="参与范围">
                  <span class="star">*</span>
                  <RadioGroup>
                    <span @click="toggle3">
                      <Radio label="全部商品"></Radio>
                    </span>
                    <span @click="toggle4">
                      <Radio label="指定商品"></Radio>
                    </span>
                    <span @click="toggle5">
                      <Radio label="商品分类"></Radio>
                    </span>
                    <span @click="toggle6">
                      <Radio label="商品分组"></Radio>
                    </span>
                  </RadioGroup>
                </FormItem>
                <!--                   活动商品-->
                <FormItem label="活动商品" v-show="shop1">
                  <span class="star">*</span>
                  <add-good></add-good>
                </FormItem>
                <!--                商品分类-->
                <FormItem label="选择商品分类" v-show="shop2">
                  <span class="star">*</span>
                  <Select filterable multiple style="width: 300px">
                    <Option
                      v-for="item in reduForm.cityList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <!--                商品分组-->
                <FormItem label="选择商品分组" v-show="shop3">
                  <span class="star">*</span>
                  <Select filterable clearable style="width: 300px">
                    <Option
                      v-for="item in reduForm.cityList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <!--                参与条件-->
                <FormItem label="参与条件">
                  <span class="star">*</span>
                  <RadioGroup>
                    <div style="margin-bottom: 20px">
                      <Radio label="单品单次购买满">
                        单品单次购买满
                        <input> 件
                      </Radio>
                    </div>
                    <div>
                      <Radio label="单品累计购买满">
                        单品累计购买满
                        <input> 件
                      </Radio>
                    </div>
                  </RadioGroup>
                </FormItem>

                <!--                  选择优惠-->
                <FormItem label="选择优惠">
                  <Button type="primary" style="margin-left: 35px" @click="modal1 = true">+选择优惠券</Button>
                </FormItem>
                <Modal
                  width="1000px"
                  v-model="modal1"
                  title="优惠券选择"
                  @on-ok="ok"
                  @on-cancel="cancel"
                >
                  <div style="margin-bottom: 20px">
                    <Select
                      v-model="model2"
                      style="width:150px;margin-right: 20px"
                      placeholder="全部类型"
                    >
                      <Option
                        v-for="item in cityList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                    <span style="margin-right: 20px">
                      <Input placeholder="请输入优惠券名称搜索" style="width: 300px; "/>
                    </span>
                    <Button class="search-btn" type="primary" style="width: 60px;">搜索</Button>
                  </div>
                  <div>
                    <Table border :columns="columns1" :data="data1"></Table>
                  </div>
                </Modal>

                <FormItem label="单次推券数量">
                  <span class="star">*</span>
                  <Input style="width: 150px"></Input>&nbsp;&nbsp;张&nbsp;&nbsp;
                  <span>累计最多推送&nbsp;&nbsp;</span>
                  <input>&nbsp;&nbsp;张&nbsp;
                  <span style="color: #ccc">(0或为空则不无数量限制)</span>
                </FormItem>
                <FormItem label="发券库存">
                  <span class="star">*</span>
                  <Input style="width: 150px"></Input>&nbsp;&nbsp;张
                  <span style="color: #cccccc">(当发券库存大于单次推券数量时,发送任务停止)</span>
                </FormItem>

                <FormItem label="推券节点">
                  <span class="star">*</span>
                  <RadioGroup>
                    <Radio label="订单完成后推送"></Radio>
                    <Radio label="订单付款后推送"></Radio>
                  </RadioGroup>
                </FormItem>
                <!--                活动有效期-->
                <FormItem label="活动有效期">
                  <span class="star">*</span>
                  <RadioGroup>
                    <Radio label="开启"></Radio>
                    <Radio label="关闭"></Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="活动时间">
                  <span class="star">*</span>
                  <DatePicker
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="请选择日期"
                    style="width: 350px"
                  ></DatePicker>
                </FormItem>
              </Form>
            </div>
          </Card>
        </div>
        <!--保存 取消 -->
        <div class="formBtn">
          <router-link :to="{name:'marking'}">
            <Button type="primary" class="comBtn" @click.native="save('reduForm')">保存</Button>
          </router-link>
          <router-link :to="{name:'marking'}">
            <Button type="default" class="comBtn">取消</Button>
          </router-link>
        </div>
      </div>
    </div>
    <!-- 高级设置 -->
    <div class="mask" v-if="show">
      <div class="time-set">
        <div class="set-title">
          周期时段设置
          <span class="close" @click="handleCloseClick">X</span>
        </div>
        <div class="choose-week">
          <Form :label-width="100">
            <FormItem label="活动周期">
              <span class="star">*</span>
              <Button
                class="week-btn"
                v-for="(item,index) in weekList"
                :key="index"
                :class="{bgColor:item.flag}"
                @click="handleClick(item,index)"
              >
                {{item.week}}
                <Icon type="ios-checkmark" size="20"></Icon>
              </Button>
            </FormItem>
            <FormItem label="活动时段">
              <span class="star">*</span>
              <TimePicker
                confirm
                format="HH:mm"
                type="timerange"
                placement="bottom-end"
                placeholder="请选择时间段"
                style="width: 168px"
              ></TimePicker>
            </FormItem>
          </Form>
        </div>
        <div class="formBtn">
          <Button type="primary" class="comBtn" @click="handleCloseClick">确认</Button>
          <Button type="default" class="comBtn" @click="handleCloseClick">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addGood from "../../../../components/addGood/addGood";

export default {
  name: "EditShop",
  components: { addGood },
  data() {
    return {
      custonized_descs: [],
      modal1: false,
      model2: "",
      shop: false,
      shop1: false,
      shop2: false,
      shop3: false,
      show: false,
      flag: false,
      currentIndex: 0,
      weekList: [
        {
          week: "周一",
          flag: false
        },
        {
          week: "周二",
          flag: false
        },
        {
          week: "周三",
          flag: false
        },
        {
          week: "周四",
          flag: false
        },
        {
          week: "周五",
          flag: false
        },
        {
          week: "周六",
          flag: false
        },
        {
          week: "周日",
          flag: false
        }
      ],
      reduForm: {
        name: "",
        fullyuan: "",
        yuan: "",
        cityList: [
          {
            value: "现金券",
            label: "现金券"
          },
          {
            value: "折扣券",
            label: "折扣券"
          },
          {
            value: "实物券",
            label: "实物券"
          }
        ]
      },
      reduRule: {
        name: [
          {
            required: false,
            message: "活动名称不能为空",
            trigger: "blur"
          }
        ]
      },
      cityList: [
        {
          value: "现金券",
          label: "现金券"
        },
        {
          value: "折扣券",
          label: "折扣券"
        },
        {
          value: "实物券",
          label: "实物券"
        }
      ],

      data1: [
        {
          title: "订单满赠50元优惠券",
          type: "现金券",
          stock: 1200,
          status: "有效",
          operation: 1200
        },
        {
          title: "订单满赠50元优惠券",
          type: "现金券",
          stock: 1200,
          status: "有效",
          operation: 1200
        },
        {
          title: "订单满赠50元优惠券",
          type: "现金券",
          stock: 1200,
          status: "有效",
          operation: 1200
        },
        {
          title: "订单满赠50元优惠券",
          type: "现金券",
          stock: 1200,
          status: "有效",
          operation: 1200
        }
      ],
      columns1: [
        {
          title: "优惠券名称",
          key: "title"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "库存",
          key: "stock"
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "操作",
          key: "operation"
        }
      ]
    };
  },
  methods: {
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    // 添加优惠
    addCustomizeDesc(index) {
      this.custonized_descs.push(1);
      console.log(this.custonized_descs);
    },
    // 商品显示隐藏
    toggle1: function() {
      this.shop = false;
    },
    toggle2: function() {
      this.shop = true;
    },
    toggle3: function() {
      this.shop1 = false;
      this.shop2 = false;
      this.shop3 = false;
    },
    toggle4: function() {
      this.shop1 = true;
      this.shop2 = false;
      this.shop3 = false;
    },
    toggle5: function() {
      this.shop2 = true;
      this.shop1 = false;
      this.shop3 = false;
    },
    toggle6: function() {
      this.shop3 = true;
      this.shop1 = false;
      this.shop2 = false;
    },

    // handleModal:function(){
    //   this.isShow = !this.isShow;
    // },
    //开启
    handleShowClick() {
      this.show = true;
    },
    //关闭
    handleCloseClick() {
      this.show = false;
    },
    handleClick: function(item, index) {
      this.weekList[index].flag = !this.weekList[index].flag;
      console.log(this.weekList[index]);
    },
    save(name) {
      // console.log(name)
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("保存成功");
        } else {
          this.$Message.error("保存失败");
        }
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
  padding: 0 20px;
}

.container .redu-bread {
  line-height: 30px;
  height: 30px;
}

.container .redu-content {
  padding: 20px 20px 100px 20px;
}

.container .redu-inset {
  background: #fff;
}

.container .star {
  color: red;
  padding: 5px;
  font-size: 20px;
  margin-right: 10px;
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
  padding: 80px 0 80px 50px;
  background: #fff;
}

.container .high-opation {
  padding: 10px;
  cursor: pointer;
}

.container .set {
  width: 600px;
  padding: 20px 20px 20px 10px;
  border: 1px dashed #aeaeae;
  background: #f2f2f2;
}

.container .formBtn {
  width: 150px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}

.container .comBtn {
  margin: 0 5px;
}

.container .mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

.container .time-set {
  width: 700px;
  height: 300px;
  border: 1px solid #aeaeae;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -300px;
}

.container .set-title {
  padding: 8px;
  font-size: 14px;
  background: #2688fb;
  color: #fff;
}

.container .close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px 10px;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.container .choose-week {
  border-bottom: 1px solid #aeaeae;
  padding: 30px 0 0 0;
}

.container .week-btn {
  width: 70px;
  margin-right: 10px;
}

.bgColor {
  background: #2688fb;
  color: #fff;
}

.container .rule-box {
  width: 500px;
  height: 110px;
  border: 1px dashed #aeaeae;
  background: #f2f2f2;
  margin-bottom: 10px;
  position: relative;
  padding: 10px 0;
  box-sizing: border-box;
}

.container .rule-lf,
.container .rule-rt {
  position: absolute;
}

.container .rule-lf {
  left: 10px;
  /* background: yellow; */
  padding-right: 30px;
  border-right: 1px dashed #aeaeae;
}

.container .rule-lf > p {
  padding: 5px;
}

.container .rule-rt {
  right: 46px;
  top: 38px;
}
</style>

