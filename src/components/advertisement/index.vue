<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <Layout style="height: 100%" class="main">
    <ImgSelect ref="imgselect" :options="imgOptions" v-on:listentoptpmfile="changeImg"></ImgSelect>
    <UrlButton ref="linkselect" :settings="linkSettings" v-on:listenurldata="changeLink"></UrlButton>
    <UrlButton ref="pageselect" :settings="linkSettings" :hide="hide" v-on:listenurldata="changePage"></UrlButton>
    <div class="decorate-content">
      <!--  @click="cancelClick" -->
      <div class="decorate-content-center">
        <div class="diy-phone">
          <div class="phone-body" :style="{background: currentTemplate[0].options.bgcolor}">
            <draggable v-model="currentTemplate" v-bind="dragOptions">
                  <div :class="[item.hover ? 'drag-active' : '',item.click ? 'drag-active': '','bodyitem']" v-for="(item,index) in currentTemplate" :key="index" @mouseover="hoverItem(item,index,'over')" @mouseout="hoverItem(item,index,'out')">
                    <!-- {{item.options}} -->
                      <AdverTem :options="item.options" />
                  </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="decorate-content-right">
         <!-- <Card> -->
            <AdverConfig ref="adverFun" v-on:showPageSelectFun="showPageSelectFun" v-on:listenToOpenLinkSelect="openLinkSelect" v-on:listenToOpenImgSelect="openImgSelect" v-on:listenToForm="changeTemplate" :options="currentTemplate[0].options" />
         <!-- </Card> -->
      </div>
    </div>
    <div class="saveAction">
      <Button class="btn comfrimBtn" type="primary" :loading="loading" @click="saveTemplate">保存</Button>
      <Button class="btn" @click="back">取消</Button>
    </div>
  </Layout>
</template>
<script>
  import tools from './tools'
  import ImgSelect from '../imgSelect/imgselect'
  import UrlButton from '../urlbutton/urlbutton'
  import draggable from 'vuedraggable'
  import AdverTem from './components/adverTem/adverTem'
  import AdverConfig from './componentConfig/adverConfig/adver'
  import shop from '@/api/request/shop'
  import goodsUtils from '@/utils/goodsUtils'
  export default {
    name: 'templatePage',
    components: {
      ImgSelect,
      UrlButton,
      draggable,
      AdverTem,
      AdverConfig,
    },
    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    },
    data() {
      return {
        loading: false,
        hide: true,
        // 是否验证成功
        collapseLeft: '1',
        colleftContent: [],
        collists:[],
        currentTemplate:[{
          all: 0,
          click: true,
          components: "banner",
          current: 1,
          hover: false,
          icon: "icon-banner",
          id: 2,
          name: "图片轮播",
          options:{
            colorGroup: [{
              imgAddress:'',
              jumpAddress:''
            }],
            name: "",
            bgcolor: "#999",
            showSet: "1",
            showPage: "1",
            showEnable: "0",
            intervalTime: 0,
            specifiedPage: '',
            startTime: ''
          }
        }],
        currentClick:{},
        currentOption:[],
        showConfrim:false,
        basicOption:{},
        tempId:'',
        type:1,
        // 图片的配置信息
        imgOptions:{
          type:'image',
          mode:'diy'
        },
        // 链接的配置信息
        linkSettings:{
          mode:'diy'
        },
        role: '',
        tempId: ''
      }
    },
    computed: {
      // 拖拽的配置
      dragOptions() {
        return {
          animation: 200,
          group: "description",
          disabled: false,
          ghostClass: "ghost"
        };
      }
    },
    created() {
      // let _this = this
      // let tempId = this.$route.query.id
      // let type = this.$route.query.type
      // _this.tempId = tempId
      // _this.type = type
      // if ( _this.type == 2) {
      //   console.log('我执行了')
      //   _this.getData()
      // }
    },
    activated: function () {
      // console.log('aefhahfeuahfeuhaf')
      // let _this = this
      //执行清空
      // console.log('我是路由的',this.$route)
      this.restore()
      // console.log(this.$route.query.type,'0000000000000')
      this.type = this.$route.query.type
      this.tempId = this.$route.query.id
      if (this.type == 2) {
        // console.log('我执行了')
        this.getData()
      }
    },
    methods: {
      getData() {
        // console.log('我看看谁先,getdata')
        let _this = this
        // 请求数据
        shop.advertisementDetial({
          'id': _this.tempId
        }).then(res => {
          console.log('我是请求')
          if(res.code == 1) {
            console.log('请求的数据',res)
            let data = res.data
            let arr = []
            arr.push(data)
            arr.forEach(element => {
              _this.currentTemplate[0].options.name = element.advertName
              _this.currentTemplate[0].options.bgcolor = element.advertBackaground
              _this.currentTemplate[0].options.showSet = element.displaySetup + ''
              _this.currentTemplate[0].options.showPage = element.displayPage + ''
              _this.currentTemplate[0].options.showEnable = element.isStart + ''
              _this.currentTemplate[0].options.colorGroup = element.listAdvertImg
              _this.currentTemplate[0].options.intervalTime = element.intervalTime
              _this.currentTemplate[0].options.specifiedPage = element.specifiedPage
              _this.currentTemplate[0].options.startTime = element.startTime ? goodsUtils.timeFun(element.startTime) : ''
            });
            // console.log('右侧的数据',this.currentTemplate[0].options)
            // return false

            this.$refs.adverFun.init(this.currentTemplate[0].options)
          } else {
            _this.$Message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
          // _this.$Message.error('请求失败')
        })
      },
      // 清空初始
      restore(){
        console.log('我是清空的')
        this.collapseLeft = '1',
        this.colleftContent = [],
        this.collists = [],
        this.currentTemplate = [{
          all: 0,
          click: true,
          components: "banner",
          current: 1,
          hover: false,
          icon: "icon-banner",
          id: 2,
          name: "图片轮播",
          options:{
            colorGroup: [{
              imgAddress:'',
              jumpAddress:''
            }],
            name: "",
            bgcolor: "#999",
            showSet: "1",
            showPage: "1",
            showEnable: "0",
            intervalTime: 0,
            specifiedPage: '',
            startTime: ''
          }
        }],
        this.currentClick = {},
        this.currentOption = [],
        this.showConfrim = false,
        this.basicOption = {},
        this.type = 1
        // console.log('2',this.currentTemplate)
      },

      // 取消点击选中
      cancelClick(){
        let _this = this
        _this.currentClick = {}
        _this.currentTemplate.map((v,i) => {
          v.click = false
        })
      },
      // 鼠标hover效果 or 移除效果
      hoverItem(item,index,type){
        let _this = this
        if(type == 'over'){
          _this.currentTemplate[index].hover = true
        }else{
          _this.currentTemplate[index].hover = false
        }
      },

      // 监听右侧属性的改变
      changeTemplate(data){
        console.log('我被触发了',data)
        let _this = this
        let id = _this.currentClick.id
        // 给当前点击的配置options
        _this.currentClick = {
          ..._this.currentClick,
          options:data
        }
        // 给template数组 配置对应的options
        _this.currentTemplate[0] = {
          ..._this.currentTemplate[0],
          options:data
        }
        console.log('我被触发了',_this.currentTemplate)
      },

      // 监听打开图片选择框
      openImgSelect(options){
        let _this = this
        _this.imgOptions = options
        _this.$refs.imgselect.uploadflg()
      },

      // 监听图片返回值
      changeImg(imgs){
        
        let _this = this
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options
        console.log(options)
        let index = options.addIndex
        console.log(index)
        let colorGroup = options.colorGroup

        console.log(colorGroup)
        colorGroup[index].imgAddress = imgs[0].imgAddress

        _this.currentClick = {
          ..._this.currentClick,
          options:options
        }

        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options:options
        }
      },

      // 监听打开链接选择框
      openLinkSelect(options){
        console.log('子组件点击链接的数据',options)
        let _this = this
        _this.linkSettings = options
        _this.$refs.linkselect.cardShow()
      },

      // 监听链接返回值
      changeLink(links){
        let _this = this
        if(_this.linkSettings.id == 'mofang'){
          let currentId = _this.currentClick.id
          let options = _this.currentClick.options
          let cid = options.currentId
          let currentCombineLists = options.combineLists
          currentCombineLists.map((v,i) => {
            if(v.id == cid){
              v.linkUrl = links
            }
          })
          _this.currentClick = {
            ..._this.currentClick,
            options:options
          }
          _this.currentTemplate[currentId] = {
            ..._this.currentTemplate[currentId],
            options:options
          }
        }else{
          console.log('我不是模仿')
          let currentId = _this.currentClick.id
          let options = _this.currentClick.options
          let index = options.addIndex
          console.log('我是index',index)
          let colorGroup = options.colorGroup
          colorGroup[index].jumpAddress = links

          _this.currentClick = {
            ..._this.currentClick,
            options:options
          }

          _this.currentTemplate[currentId] = {
            ..._this.currentTemplate[currentId],
            options:options
          }
        }
      },
      changePage(links) {
        console.log('llllllllllllllllll',links)
          let _this = this
          console.log(_this.currentClick)
          console.log(_this.currentTemplate)
          // let currentId = _this.currentClick.id
          let options = _this.currentClick.options
          console.log('我是index',links)
          // _this.currentTemplate[0].options.specifiedPage = links
          // _this.$set(_this.currentTemplate[0].options,'specifiedPage',links)

          console.log('我是123123', _this.currentTemplate)
          // return false
          // _this.changeTemplate(_this.currentTemplate[0].options)
          // return false
          // let colorGroup = options.colorGroup
          // colorGroup[index].jumpAddress = links

          // options = {
          //   ...options,
          //   specifiedPage:links
          // }

          // _this.currentClick = {
          //   ..._this.currentClick,
          //   options:options
          // }

          // _this.currentTemplate[0] = {
          //   ..._this.currentTemplate[0],
          //   options:options
          // }
          _this.currentTemplate[0].options.specifiedPage = links
          _this.$forceUpdate()
      },
      showPageSelectFun(options) {
        console.log('子组件点击链接的数据',options)
        let _this = this
        _this.linkSettings = options
        this.$refs.pageselect.cardShow()
      },

      //保存前校验
    validateData(){
        let _this = this
        let key = true
        // 判断地址的
        if (this.currentTemplate[0].options.showPage == '2') {
          if (!this.currentTemplate[0].options.specifiedPage) {
            this.$Message.error('指定页面不能为空')
            key = false
            return key
          }
        }
        // 保存前的校验
        for (let j = 0; j < _this.currentTemplate.length; j++) {
          let v = _this.currentTemplate[j]
        
          if(v.components == "banner" && v.options.hasOwnProperty('colorGroup')){
            let imgGroup = v.options.colorGroup
            for (let i = 0; i < imgGroup.length; i++) {
              // || !imgGroup[i].jumpAddress
              if(!imgGroup[i].imgAddress){
                // 或链接
                _this.$Message.error('轮播图图片不能为空')
                key = false
                break
              }
            }
          }else if(v.components == "banner" && !v.options.hasOwnProperty('colorGroup')){
            _this.$Message.error('请添加轮播图数据')
            key = false
            break
          }
        }
        // 验证时间
        if (this.currentTemplate[0].options.showEnable == '2') {
          if (this.currentTemplate[0].options.startTime == '') {
            console.log('222222222222222',this.currentTemplate[0].options)
            this.$Message.error('启用时间不能为空')
            key = false
            return key
          }
        }
        return key
      },
      // 保存自定义模板
      saveTemplate(){
        let _this = this
        let data =  _this.currentTemplate[0].options
        console.log('广告名',data.name)
        if (data.name == '') {
          this.$Message.error('广告名不能为空')
          return
        }
        let validate = _this.validateData()

        if(!validate){
          return false
        }
        console.log('时间的时间',data.startTime)
        console.log('时间的时间',goodsUtils.timeStamp(data.startTime))
        // 判断时间是否为空
        if (data.showEnable == 2) {
          console.log('进来了')
          console.log('123456',data.startTime)
          if (data.startTime != '') {
            console.log('我是定时的空的',data.startTime)
            data.startTime = goodsUtils.timeStamp(data.startTime)
            console.log('我是定时的空的,转化之后的',data.startTime)
          }
        }
        // return false
        if(_this.tempId){
          console.log('更新')
          // 更新
          this.loading = true
          shop.advertisementUpdata({
            'id': _this.tempId,
            'advertName': data.name,
            'advertBackaground': data.bgcolor,
            'displaySetup': data.showSet,
            'displayPage': data.showPage,
            'isStart': data.showEnable,
            'advertImg': data.colorGroup,
            'intervalTime': data.intervalTime,
            'specifiedPage': data.specifiedPage,
            'startTime': data.startTime ? goodsUtils.timeStamp(data.startTime) : ''
          }).then((res) => {
            if(res.code == 1){
              this.loading = false
              _this.$Message.success('保存成功')
              _this.back()
            }else{
              this.loading = false
              _this.$Message.error(res.message)
            }
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        }else{
          console.log('新增')
          // 新增
          this.loading = true
          shop.advertisementSave({
            'advertName': data.name,
            'advertBackaground': data.bgcolor,
            'displaySetup': data.showSet,
            'displayPage': data.showPage,
            'isStart': data.showEnable,
            'advertImg': data.colorGroup,
            'intervalTime': data.intervalTime,
            'specifiedPage': data.specifiedPage,
            'startTime': data.startTime ? goodsUtils.timeStamp(data.startTime) : ''
          }).then((res) => {
            if(res.code == 1){
              this.loading = false
              _this.$Message.success('保存成功')
              this.back()
            }else{
              this.loading = false
              _this.$Message.error(res.message)
            }
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        }
      },

      back(){
        this.$router.go(-1)
      }
    }
  }
</script>
