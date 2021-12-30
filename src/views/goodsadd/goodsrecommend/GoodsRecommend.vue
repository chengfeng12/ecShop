<template>
  <div id="goods-recommend">
    <div class="goods-spec-info">
      <h3 class="title">商品推荐</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">商品推荐</span>
          <RadioGroup v-model="recommend.recomType" @on-change="classChange">
            <Radio label="1">按商品分类</Radio>
            <Radio label="0">按单品分类</Radio>
          </RadioGroup>
        </div>
        <div v-if="recommend.recomType == '1'" class="single">
          <div class="content-war">
            <span class="content-war-span">选择商品分类</span>
            <!-- {{recommend.recomCategoryName}} -->
            <div class="treeselect">
              <treeselect
                v-model="recommend.recomCategoryName"
                :searchable="false"
                :clearable="false"
                noOptionsText="暂无分类"
                placeholder="选择商品分类"
                :options="classOption"
              ></treeselect>
            </div>
          </div>
          <div class="content-war">
            <span class="content-war-span">选择显示个数<i style="color:red;">*</i></span>
            <Input v-model="recommend.recomCategoryNum" style="width: 100px"/>
          </div>
        </div>
        <div v-if="recommend.recomType == '0'">
          <div class="select-btn">
            <addGood ref="clearGoods" @listentgoodData="listentgoodData" :options="recommend.recomList" :res="res"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/request.js";
import addGood from "@/components/addGood/addGood";
// 引入分类
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: ["recommend", "classOption"],
  data() {
    return {
      res: "+选择单品",
      // 弹框状态
      state: false
    };
  },
  components: {
    // GoodsTable,
    addGood,
    Treeselect
  },
  methods: {
    classChange(value) {
      // console.log(value)
      if (this.recommend.recomType == 1) {
        console.log(this.recommend)
         this.recommend.recomGoodsId = [];
        // this.recommend.recomList = []
        // this.$refs.clearGoods.clearData()
      } else {
        // this.recommend.recomCategoryName = ''
        // this.recommend.recomCategoryNum = 0

      }
    },
    // 数据
    listentgoodData(index) {
      console.log("jaefhjaihfiahfei ", index);
      this.recommend.recomList = index;
      this.recommend.recomGoodsId = [];
      index.forEach(element => {
        this.recommend.recomGoodsId.push(element.id);
      });
      // console.log(this.recommend.recomGoodsId)
    }
  }
};
</script>

<style scoped>
.goods-recommend {
  padding-bottom: 80px;
}

#goods-recommend .select-btn {
  margin-left: 138px;
  /* margin-bottom: 10px; */
}
#goods-recommend .select-single {
  position: relative;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
}
#goods-recommend .single {
  margin-bottom: 200px;
}
#goods-recommend .img-left {
  float: left;
}
#goods-recommend .img-left img {
  display: inline-block;
  height: 60px;
  width: 100px;
}
#goods-recommend .con-right {
  float: left;
  margin-left: 30px;
}
#goods-recommend .con-right p {
  margin: 5px 0;
}
#goods-recommend .select-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 25px;
  right: 0px;
  top: 0px;
}

#goods-recommend .table-popup-container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
#goods-recommend .table-popup-container .table-popup-content {
  width: 880px;
  height: 690px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
#goods-recommend .table-popup-tit {
  height: 30px;
  overflow: hidden;
}
#goods-recommend .tables {
  margin: 15px 0;
}
#goods-recommend .table-popup-tit div:nth-child(1) {
  float: left;
  height: 30px;
  line-height: 30px;
  width: 100px;
}
#goods-recommend .table-popup-tit div:nth-child(2) {
  float: right;
  width: 30px;
  height: 30px;
  font-size: 20px;
}
#goods-recommend .addGoods {
  margin-top: 15px;
  width: 200px;
}
#goods-recommend .treeselect {
  display: inline-block;
  width: 300px;
  vertical-align: middle;
}
</style>
