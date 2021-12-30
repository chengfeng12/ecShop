<template>
  <div class="area clearfix">
    <div class="region-wrapper" v-for="(province,index) in data" :key="index">
      <Poptip placement="right-start" width="250" trigger="hover">
        <div class="provice-wrapper">
          <Checkbox :value="province.checkAll" @click.prevent.native="handleCheckProvince(province)">{{province.name}}</Checkbox>
        </div>
        <div class="city-wrapper" slot="content">
          <Checkbox class="city-item" v-for="(city,childIndex) in province.children" :key="childIndex" :value="city.isCheck" @click.prevent.native="handleCheckCity(province,city)">{{city.name}}</Checkbox>
        </div>
      </Poptip>
      <!-- <span class="select-count" v-if="province.childrenCount !== province.isCheckChildrenCount">{{province.isCheckChildrenCount}} / {{province.childrenCount}}</span> -->
    </div>
  </div>
</template>
<script>
import goods from "@/api/request/goods"
import goodsUtils from '@/utils/goodsUtils.js';
export default {
  props: {
    AreaData: Array
  },
  data() {
    return {
      data: [],
      rstAreaData: [],
      tempAreaData: []
    };
  },
  created() {
    // this.data = areaData.get2LevelArea();
    // console.log(this.data,'地址..................................',this.AreaData)
    // if (this.AreaData.length !== 0 && this.AreaData.length !== 397) {
    //   for (let j in this.data) {
    //     let curValue = this.data[j].codeId + '';
    //     if (this.AreaData.indexOf(curValue) < 0) {
    //       this.data[j].checkAll = false;
    //     }
    //     let count = 0;
    //     for (let k in this.data[j].children) {
    //       let curChildValue = this.data[j].children[k].codeId + '';
    //       if (this.AreaData.indexOf(curChildValue) < 0) {
    //         this.data[j].children[k].isCheck = false;
    //       } else {
    //         ++count;
    //       }
    //     }
    //     this.data[j].isCheckChildrenCount = count;
    //   }
    // }
    this.getData()
  },
  methods: {
    getData() {
      goods.goodsArea({
            level: 1
        }).then(res => {
            let code = res.code;
            if (code == "1") {
              this.data = goodsUtils.get2LevelArea(res.data)
              console.log(this.data,'地址..................................',this.AreaData)
              this.checklist()
            } else {
              console.log("获取失败");
            }
        }).catch(err => {
            console.log(err);
        })
    },
    checklist() {
      let len = this.data.length
      let lenArea = this.data.length
      for (let i = 0; i < len; i++) {
        if (this.AreaData.indexOf(this.data[i].name) != -1) {
          this.data[i].checkAll = true
          for (let j = 0; j < this.data[i].children.length; j++) {
            this.data[i].children[j].isCheck = true
          }
        } else {
          for (let k = 0; k < this.data[i].children.length; k++) {
            if (this.AreaData.indexOf(this.data[i].children[k].name) != -1) {
              this.data[i].children[k].isCheck = true
            }
          }
        }
      }
    },
    // 全选或者全部取消的
    handleCheckProvince(param) {
      if (!param.checkAll) {
        // children的isCheck全部设为true
        for (let i in param.children) {
          param.children[i].isCheck = true;
        }
        param.isCheckChildrenCount = param.childrenCount;
      } else {
        for (let i in param.children) {
          param.children[i].isCheck = false;
        }
        param.isCheckChildrenCount = 0;
      }
      param.checkAll = !param.checkAll;
      this.emitData();
    },
    // 内容勾选之后的数据
    handleCheckCity(parent, param) {
      console.log('市的勾选', parent, param)
      // 判断子数据勾选的长度
      param.isCheck = !param.isCheck;
      let childrenLen = parent.children.length;
      let count = 0;
      for (let i in parent.children) {
        if (parent.children[i].isCheck === true) {
          ++count;
        }
      }
      if (count === childrenLen) {
        parent.checkAll = true;
      } else {
        parent.checkAll = false;
      }
      parent.isCheckChildrenCount = count;
      this.emitData();
    },
    emitData() {
      let vm = this;
      let rstAreaData = {
        index: [],
        name: []
      };
      // 重点在返回的数据
      for (let j in vm.data) {
        if (vm.data[j].checkAll === true) {
          rstAreaData.index.push(vm.data[j].codeId);
          rstAreaData.name.push(vm.data[j].name);
        }
        for (let k in vm.data[j].children) {
          if (vm.data[j].children[k].isCheck === true) {
            rstAreaData.index.push(vm.data[j].children[k].codeId);
            rstAreaData.name.push(vm.data[j].children[k].name);
          }
        }
      }
      this.tempAreaData = rstAreaData
    },
    transmitArea() {
      this.$emit('areaDataFun', this.tempAreaData);
    }
  }
};
</script>
<style lang="less" scoped>
.clearfix{
  zoom: 1;

  &:after{
    content: ' ';
    display: block;
    height: 0;
    clear: both;
    overflow: hidden;
  }
}
.region-wrapper {
  float: left;
  margin-bottom: 15px;
  width: 25%;

  .city-pop {
    width: 200px;
  }
  .city-wrapper {
    overflow: hidden;

    .city-item {
      float: left;
      margin: 5px 0 5px 10px;
      width: 80px;
    }
  }
  .select-count {
    color: #2d8cf0;
  } 
}
</style>
