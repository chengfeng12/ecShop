<template>
  <div id="area">
    <Modal
      v-model="areaBol"
      title="选择区域"
      ok-text="确定"
      cancel-text="取消"
      @on-ok="stateConfirm"
      width="700"
      :scrollable="false"
      @on-cancel="stateCancel"
    >
      <div class="area-main">
        <Select v-model="provinceData" style="width:200px" @on-change="province">
          <Option v-for="item in provinceList" :value="item.name" :key="item.id">{{ item.name }}</Option>
        </Select>
        <div class="show-main">
          <CheckboxGroup v-model="cityData" v-if="provinceData.length > 0">
            <Checkbox
              class="city-list"
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
            >{{ item.name }}</Checkbox>
          </CheckboxGroup>
          <div class="nothing-box" v-if="provinceData.length == 0">
            <p class="nothing">暂无数据</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
// 引入请求文件
// import api from '@/api/request'
import goods from "@/api/request/goods";
export default {
  props: ["addAreaBol", "edareas"],
  data() {
    return {
      areaBol: this.addAreaBol,
      // 省
      provinceList: [],
      provinceData: "",
      selectValue: "",
      // 市
      cityList: {},
      cityData: this.edareas,
      tempparentId: "",
      level: 1
    };
  },
  created() {
    console.log(this.cityData);
    this.getArea();
  },
  methods: {
    // 获取地区的请求
    getArea() {
      // console.log('我是输出')
      // this.cityData = []
      // 请求省的接口
      goods
        .goodsArea({
          level: 1
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            // this.provinceList = res.data;
            // this.tempparentId = res.data[0].codeId;
            // this.provinceData = res.data[0].name;
            // this.level = res.data[0].level + 1;
            console.log(res.data,'地址的');
            // this.getCity(this.tempparentId);
            console.log(this.tempparentId);
          } else {
            console.log("获取失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCity(ids) {
      goods
        .goodsArea({
          parentId: ids,
          level: this.level
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            this.cityList = res.data;
            console.log(this.cityList);
          } else {
            console.log("获取失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    province(index) {
      // console.log(index)
      let tempid = "";
      this.provinceList.forEach(element => {
        if (element.name == index) {
          tempid = element.codeId;
          this.level = element.level + 1;
        }
      });
      this.getCity(tempid);
    },
    // 确认
    stateConfirm() {
      // this.cityData.forEach(item => {
      //     console.log(item)
      // });
      console.log("我是地址的选择", this.cityData);
      // console.log(this.cityList)
      // console.log('woshiqian面的地址',this.edareas)
      // this.edareas = this.cityData
      // console.log('我是arrreq' + result)
      this.$emit("stateCon", this.areaBol, this.cityData);
    },
    stateCancel() {
      this.$emit("choiceFun", this.areaBol);
    }
  }
};
</script>

<style scoped>
.show-main {
  margin-top: 20px;
  height: 300px;
}
.city-list {
  font-size: 14px;
  /* width: 120px; */
  padding: 20px 10px;
}
.nothing-box {
  height: 100%;
}
.nothing {
  font-size: 18px;
  text-align: center;
  color: #999;
  line-height: 250px;
}
</style>
