<style lang="less" scoped>
  @import './adverTem.less';
</style>

<template>
  <div class="adver diyitem">
    <Carousel
        class="adveritem"
        v-model="options.bannerActive"
        dots="none"
        @on-change="changeSwiper"
        >
        <CarouselItem v-for="(item,index) in bannerLists" :key="index">
            <div class="carousel">
                <!-- {{item.imgAddress}} -->
                <img v-if="item.imgAddress" :src="item.imgAddress" alt="">
                <div v-else class="img-box"></div>
            </div>
        </CarouselItem>
    </Carousel>
    <div class="dots">
      <div :class="[dot_type]" :style="{background:index == currentId ? '#fff' : 'rgba(0,0,0,0.2)',margin:'0px 6px'}" v-for="(item,index) in bannerLists" :key="index"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props:['options'],
    data() {
      return {
        // dot_isshow:'dot_show',
        dot_type:'dot_rectangle',
        dot_color:'#fff',
        currentId:0,
        bannerLists:[{
          imgAddress:'',
          jumpAddress:''
        }],
        name: '为了触发的东西'
      }
    },
    watch:{
      options:{
        handler(){
          let _this = this
          let newOptions = _this.options
          _this.init(newOptions)
          console.log('11111+++++++++....',newOptions)
        },
        deep:true
      }
    },
    // created() {
    //   let _this = this
    //   console.log('banner创建',_this.options)
    //   _this.init(_this.options)
    // },
    methods: {
      // 初始化
      init(options) {
        let _this = this
        console.log('2222可爱的尹宝+++++++',options.hasOwnProperty('colorGroup'))
        if(JSON.stringify(options) == "{}"){
          console.log('3333可爱的尹宝+++++++123123',options)
          _this.restore()
        }else{
          console.log('**************',options)
          // _this.dot_isshow = options.dot_isshow
          this.name = options.name
          // _this.dot_type = options.dot_type
          // _this.dot_color = options.dot_color
          let newBannerList = []
          options.colorGroup.map((v,i) => {
            newBannerList.push(v)
          })
          this.bannerLists = newBannerList
          console.log(options,options.colorGroup,this.bannerLists,newBannerList,'banner')
        }
      },
      // 恢复初始
      restore(){
        console.log('走了恢复')
        let _this = this
        // _this.dot_isshow = 'dot_show'
        // _this.dot_type = 'dot_rectangle'
        // _this.dot_color = '#fff'
        _this.bannerLists = [{
          imgAddress:'',
          jumpAddress:''
        }]
      },
      // 更换banner
      changeSwiper(oldvalue,value){
        let _this = this
        _this.currentId = value
      }
    }
  }

</script>
