<template>
  <div id="goods-details">
    <div class="goods-details-setting">
      <h3 class="title">商品试色</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">显示试色</span>
          <RadioGroup v-model="details.isColorShow">
            <Radio label="0">不显示(默认)</Radio>
            <Radio label="1">显示</Radio>
          </RadioGroup>
        </div>
        <div class="content-war">
          <span class="content-war-span">Icon图片</span>
          <!-- icon 图片显示的区域  iconImg 数据 -->
          <Button type="primary" class="btn-a" @click="imgPopFun">+选择图片</Button>
          <div class="image-area">
            <ul class="banner-img">
              <li v-if="details.iconImg != ''">
                <img :src="details.iconImg" width="100" height="100">
                <div @click="removeThumb(index)">
                  <Icon type="ios-close-circle"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="goods-details-setting">
      <h3 class="title">商品详情</h3>
      <div class="basic-content">
        <div class="content-war">
          <span class="content-war-span">详情模板</span>
          <Select v-model="details.diyPageId" style="width:200px" @on-change="changeTemId">
            <Option
              v-for="item in details.templatesList"
              :value="''+item.id"
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <shopCom ref="shopcm" v-on:listenToTempValue="changeData"/>
      </div>
    </div>
    <div class="img-select-box">
      <img-select @listentoptpmfile="recommendFun" ref="addDetail" :options="{type: 'image'}"/>
    </div>
  </div>
</template>

<script>
// 上传图片
import ImgSelect from "@/components/imgSelect/imgselect";
import shopCom from "@/components/shopDetail";
export default {
  props: ["details"],
  data() {
    return {
      // tempId: 0
    };
  },
  components: {
    ImgSelect,
    shopCom
  },
  mounted(){

  },
  watch:{
    details:{
      handler(){
        console.log('__+_+_+_+_+_++_+_+_+detail',this.details.data)
        this.$refs.shopcm.detailTemplate(this.details.data)
      },
      deep:true
    }
  },
  methods: {
    imgPopFun() {
      // console.log('选择图片')
      this.$refs.addDetail.uploadflg();
    },
    removeThumb(index) {
      this.details.iconImg = ''
    },
    recommendFun(data) {
      this.details.iconImg = data[0].imgAddress
    },
    changeTemId(e) {
      this.details.tempId = e;
      this.details.templatesList.map((v,i) => {
        if(v.id == e){
          // console.log('vvvvvvvvvvv',v)
          this.details.data = v.data
          // return false
          this.details.diyPageId = v.id + ''
          // console.log('ttttttttttttt',this.details.data,this.details.diyPageId)
        }
      })
    },
    changeData(value) {
      console.log('value?????????????????',value)
      this.$emit("comData", value);
    },
    // 调用验证的方法
    getValidateData() {
      let res = this.$refs.shopcm.validateData()
      this.$emit('detailValidateData',res)
    }
  }
};
</script>

<style>
@import "../../../assets/style/goodsAdd.css";
#goods-details {
  padding-bottom: 80px;
}
#goods-details .goods-details {
  padding-bottom: 60px;
}
#goods-details .img-select-box .info {
  display: none;
}
#goods-details .banner-img {
  list-style: none;
  overflow: hidden;
  margin-left: 100px;
}
#goods-details .banner-img li {
  display: block;
  width: 100px;
  height: 100px;
  margin: 21px 21px 21px 0px;
  float: left;
  position: relative;
}
#goods-details .banner-img li img {
  position: absolute;
  top: 0;
  right: 0;
}
#goods-details .banner-img li div {
  position: absolute;
  height: 10px;
  width: 10px;
  top: -15px;
  right: 0;
  font-size: 18px;
}
</style>

