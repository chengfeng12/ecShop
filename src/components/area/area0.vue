<template>
  <div class="area clearfix">
    <div class="region-wrapper" v-for="(province,index) in data" :key="index">
      <Poptip placement="right-start" width="300" trigger="hover">
        <div class="provice-wrapper">
          <Checkbox :value="province.checkAll" @click.prevent.native="handleCheckProvince(province)">{{province.label}}</Checkbox>
        </div>
        <div class="city-wrapper" slot="content">
          <Checkbox class="city-item" v-for="(city,childIndex) in province.children" :key="childIndex" :value="city.isCheck" @click.prevent.native="handleCheckCity(province,city)">{{city.label}}</Checkbox>
        </div>
      </Poptip>
      <!-- <span class="select-count" v-if="province.childrenCount !== province.isCheckChildrenCount">{{province.isCheckChildrenCount}} / {{province.childrenCount}}</span> -->
    </div>
  </div>
</template>
<script>
import areaData from './area-producer.js';

export default {
  name: 'area-multi-selection',
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
    this.data = areaData.get2LevelArea();
    // console.log('我是生命周期',this.AreaData)
    // this.checklist()
    // if (this.AreaData.length !== 0 && this.AreaData.length !== 397) {
    //   for (let j in this.data) {
    //     console.log(this.data[j])
    //     let curValue = this.data[j].value + '';
    //     if (this.AreaData.indexOf(curValue) < 0) {
    //       this.data[j].checkAll = false;
    //     }
    //     let count = 0;
    //     for (let k in this.data[j].children) {
    //       let curChildValue = this.data[j].children[k].value + '';
    //       if (this.AreaData.indexOf(curChildValue) < 0) {
    //         this.data[j].children[k].isCheck = false;
    //       } else {
    //         ++count;
    //       }
    //     }
    //     this.data[j].isCheckChildrenCount = count;
    //   }
    // }
  },
  methods: {
    // 遍历数据
    checklist() {
      this.data = areaData.get2LevelArea();
      // vm.data[j].isCheckChildrenCount == vm.data[j].childrenCount
      // console.log('打开了',this.AreaData)
      if (this.AreaData.length != 0) {
        let len = this.data.length
        let lenArea = this.data.length
        for (let i = 0; i < len; i++) {
          // console.log('一级的',this.data[i])
          if (this.AreaData.indexOf(this.data[i].label) != -1) {
            this.data[i].checkAll = true
            this.data[i].isCheckChildrenCount = this.data[i].childrenCount
            // console.log('我是一级的勾选',this.data[i].checkAll)
            for (let j = 0; j < this.data[i].children.length; j++) {
              this.data[i].children[j].isCheck = true
            }
          } else {
            let con = 0
            for (let k = 0; k < this.data[i].children.length; k++) {
              if (this.AreaData.indexOf(this.data[i].children[k].label) != -1) {
                this.data[i].children[k].isCheck = true
                con++
              }
            }
            this.data[i].isCheckChildrenCount = con
          }
        }
      }
      this.emitData()
    },
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
    handleCheckCity(parent, param) {
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
      // console.log('点击的',count)
      parent.isCheckChildrenCount = count;
      this.emitData();
    },
    emitData() {
      console.log('我是第一次的',this.data)
      let vm = this;
      let rstAreaData = {
        name: []
      };
      for (let j in vm.data) {
        if (vm.data[j].checkAll === true) {
          if (vm.data[j].children.length == 1) {
            rstAreaData.name.push(vm.data[j].label);
          } else {
            for (let k in vm.data[j].children) {
              if (vm.data[j].children[k].isCheck === true) {
                console.log('查看的为true',vm.data[j].isCheckChildrenCount,vm.data[j].childrenCount,vm.data[j].isCheckChildrenCount == vm.data[j].childrenCount)
                if (vm.data[j].isCheckChildrenCount == vm.data[j].childrenCount) {
                  rstAreaData.name.push(vm.data[j].label)
                  break
                } else {
                  rstAreaData.name.push(vm.data[j].children[k].label)
                }
              }
            }
          }
        } else {
          for (let k in vm.data[j].children) {
            if (vm.data[j].children[k].isCheck === true) {
              console.log('查看的',vm.data[j].isCheckChildrenCount,vm.data[j].childrenCount,vm.data[j].isCheckChildrenCount == vm.data[j].childrenCount)
              if (vm.data[j].isCheckChildrenCount == vm.data[j].childrenCount) {
                rstAreaData.name.push(vm.data[j].label)
                break
              } else {
                rstAreaData.name.push(vm.data[j].children[k].label)
              }
            }
          }
        }
      }
      console.log('最后的数据', rstAreaData)
      this.tempAreaData = rstAreaData
    },
    transmitArea() {
      this.$emit('areaDataFun', this.tempAreaData);
    },
    transmitCanArea() {
      console.log('我是传递过来的数据',this.AreaData)
      this.tempAreaData = {name: this.AreaData}
      this.$emit('areaDataFun', {name: this.AreaData});
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
      margin: 5px 0 5px 45px;
      width: 80px;
    }
  }
  .select-count {
    color: #2d8cf0;
  } 
}
</style>
