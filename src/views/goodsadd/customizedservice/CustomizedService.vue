<template>
  <div class="customized-service">
    <div class="goods-spec-info">
      <h3 class="title">定制服务</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">定制服务</span>
          <Checkbox v-model="server.letterStatus" :true-value="1" :false-value="2" @click.native="customizedFun">刻字服务</Checkbox>
        </div>
      </div>

      <div class="basic-content" v-if="server.letterStatus == 1">
        <Row>
          <Col span="16" class="cus-con">
            <div class="lettering">
              <span class="content-war-span">限时免费</span>
              <RadioGroup v-model="server.letterFree" @on-change="customizedTimeFun">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
              </RadioGroup>
            </div>
            <div class="lettering" v-if="server.letterFree == '1'">
              <span class="content-war-span">限免时间</span>
              <DatePicker
                :editable="false"
                type="datetimerange"
                placement="bottom-end"
                placeholder="选择时间"
                :options="optionsTime"
                style="width: 300px"
                format="yyyy-MM-dd HH:mm"
                v-model="server.letterTime"
              ></DatePicker>
            </div>
            <div class="lettering">
              <span>选择样图</span>
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;margin-left:15px;display:inline-block;"></div>
              <RadioGroup  v-model="server.letterContent">
                <Radio v-for="(item,index) in server.letterCheckData"
                  :key="index"
                  :label="item.id + ''" >
                  {{ item.title }}
                </Radio>
              </RadioGroup>
            </div>
          </Col>
        </Row>
      </div>

      <div class="basic-content">
        <div class="check-box">
          <Checkbox v-model="server.cardStatus" @click.native="cardFun" :true-value="1" :false-value="2">专属卡片</Checkbox>
        </div>
      </div>

      <div class="basic-content" v-if="server.cardStatus == 1">
        <Row>
          <Col span="16" class="cus-con">
            <div class="lettering">
              <span>选择卡片</span>
              <div
                style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;margin-left:15px;display:inline-block;"
              >
                <RadioGroup v-model="server.cardType" @on-change="handleCheckAll">
                  <Radio label="1">全选</Radio>
                  <Radio label="2">指定卡片</Radio>
                </RadioGroup>
              </div>
              <CheckboxGroup v-model="server.cardContent" @on-change="checkAllGroupChange">
                <Checkbox
                  v-for="(item,index) in server.cardCheckData"
                  :key="index"
                  :label="item.id + ''"
                >{{ item.notice }}</Checkbox>
              </CheckboxGroup>
            </div>
          </Col>
        </Row>
      </div>

      <div class="basic-content">
        <div class="check-box">
          <Checkbox v-model="server.packetStatus" @click.native="suitFun" :true-value="1" :false-value="2">个性套装</Checkbox>
        </div>
      </div>

      <div class="basic-content" v-if="server.packetStatus == 1">
        <Row>
          <Col span="16" class="cus-con">
            <div class="lettering">
              <span>选择套装</span>
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;margin-left:15px;display:inline-block;">
                <RadioGroup v-model="server.packetType" @on-change="handCheckAllSuit">
                  <Radio label="1">全选</Radio>
                  <Radio label="2">指定套装</Radio>
                </RadioGroup>
              </div>
              <CheckboxGroup v-model="server.packetContent" @on-change="checkGroupChagSuit">
                <Checkbox
                  v-for="(item,index) in server.suitCheckData"
                  :key="index"
                  :label="item.id + ''"
                >{{ item.name }}</Checkbox>
              </CheckboxGroup>
            </div>
          </Col>
        </Row>
      </div>

      <div class="basic-content">
        <div class="check-box">
          <Checkbox v-model="server.packBoxStatus" @click.native="packBoxFun" :true-value="1" :false-value="2">包装盒</Checkbox>
        </div>
      </div>

      <div class="basic-content" v-if="server.packBoxStatus == 1">
        <Row>
          <Col span="16" class="cus-con">
            <div class="lettering">
              <span>选择包装盒</span>
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;margin-left:15px;display:inline-block;">
              </div>
              <RadioGroup  v-model="server.packBoxContent">
                <Radio v-for="(item,index) in server.packBoxData"
                  :key="index"
                  :label="item.id + ''" >
                  {{ item.name }}
                </Radio>
            </RadioGroup>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import goods from '@/api/request/goods'
export default {
  props: ["server"],
  data() {
    return {
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    };
  },
  methods: {
    // 获取数据
    getData() {
      console.log('获取定制服务的数据.............')
      // goods.customizedServiceList().then(res => {
      //   console.log('获取定制服务的数据',res)
      //   if (res.code == 1) {
      //     this.server.letterCheckData = res.data.legend
      //     this.server.cardCheckData = res.data.card
      //     this.server.suitCheckData = res.data.package
      //     this.server.packBoxData = res.data.packBox
      //   }
      // }).catch(err => {
      //   console.log('获取定制失败')
      //   this.$Message.error('获取定制失败')
      // })
      
    },
    // 刻字方法显示
    // 清空
    customizedFun() {
      console.log('我触发了',)
      if (this.server.letterStatus == 2) {
        this.server.letterTime = [];
        this.server.letterFree = "2"
      }
    },
    // 清空时间
    customizedTimeFun() {
      this.server.letterTime = [];
    },
    // 卡片方法
    cardFun() {
      if (this.server.cardStatus == 2) {
        this.server.cardContent = [];
        this.server.cardType = "2";
      }
    },
    handleCheckAll() {
      if (this.server.cardType == "1") {
        this.server.cardContent = []
        this.server.cardCheckData.map((v,i) => {
          this.server.cardContent.push(v.id + '')
        })
        console.log(this.server.cardContent)
      } else if (this.server.cardType == '2') {
        this.server.cardContent = [];
      }
      
    },

    checkAllGroupChange(data) {
      console.log(data)
      if (data.length == this.server.cardCheckData.length) {
        this.server.cardType = "1";
      } else {
        this.server.cardType = "2";
      }
    },

    // 套装方法
    suitFun() {
      console.log('123',this.server.packetStatus)
      if (this.server.packetStatus == 2) {
        this.server.packetContent = [];
        this.server.packetType = "2";
      }
    },
    handCheckAllSuit() {
      console.log("fawefa ");
      if (this.server.packetType == "1") {
        this.server.packetContent = []
        this.server.suitCheckData.map((v,i) => {
          this.server.packetContent.push(v.id + '')
        })
        console.log(this.server.packetContent)
      } else if (this.server.packetType == "2") {
        this.server.packetContent = [];
      }
    },

    checkGroupChagSuit(data) {
      if (data.length === this.server.suitCheckData.length) {
        console.log(data.length,this.server.suitCheckData.length)
        this.server.packetType = "1";
      } else {
        this.server.packetType = "2";
      }
    },

    packBoxFun() {
      if (this.server.packBoxStatus == 2) {
        this.server.packBoxContent = '';
      }
      // //  else {
      //   this.server.packBoxContent = this.server.packBoxData[0].id
      //   console.log('123',this.server.packBoxStatus,this.server.packBoxContent,this.server.packBoxData[0].id)
      // }
    },
    // handCheckAllPackBox() {
    //   console.log("fawefa ");
    //   if (this.server.packBoxType == "1") {
    //     this.server.packBoxContent = []
    //     this.server.packBoxData.map((v,i) => {
    //       this.server.packBoxContent.push(v.id + '')
    //     })
    //     console.log(this.server.packBoxContent)
    //   } else if (this.server.packBoxType == "2") {
    //     this.server.packBoxContent = [];
    //   }
    // },

    // checkGroupChanPackBox(data) {
    //   if (data.length === this.server.packBoxData.length) {
    //     this.server.packBoxType = "1";
    //   } else {
    //     this.server.packBoxType = "2";
    //   }
    // }
  }
};
</script>

<style soped>
@import "../../../assets/style/goodsAdd.css";
.customized-service {
  padding-bottom: 200px;
}

.cus-con {
  margin-bottom: 10px;
  margin-left: 134px;
  border: 1px solid #ddd;
}
.lettering {
  padding: 10px 20px;
}
.letter-box {
  padding: 0px 20px 10px;
}
.lettering .content-war-span {
  width: 108px;
  height: 32px;
  line-height: 32px;
  text-align: right;
  margin-right: 14px;
}
.check-box {
  margin-bottom: 10px;
  margin-left: 134px;
}
.checkbox {
  margin-top: 10px;
}
</style>
