<style lang="less" scoped>
@import "./index.less";
</style>
<template>
  <Layout style="height: 100%" class="main">
    <ImgSelect ref="imgselect" :options="imgOptions" v-on:listentoptpmfile="changeImg"></ImgSelect>
    <VideoSelect ref="videoselect" :options="videoOptions" v-on:listentoptpmfile="changeVideo"></VideoSelect>
    <UrlButton ref="linkselect" :settings="linkSettings" v-on:listenurldata="changeLink"></UrlButton>
    <IconLists ref="IconLists" v-on:listenicon="changeIcon"></IconLists>
    <AddGood
      ref="goodselect"
      :settings="goodSettings"
      v-on:listentgoodData="changeGood"
      :selectGoods="isSelect"
    ></AddGood>
    <div class="decorate-content">
      <div class="decorate-content-center" @click="cancelClick">
        <div class="diy-phone">
          <div
            class="phone-body"
            :style="{background:basicOption.backImg ? 'url('+basicOption.backImg+') repeat-y' : basicOption.backColor,backgroundSize:'cover'}"
          >
            <draggable v-model="currentTemplate" v-bind="dragOptions">
              <transition-group type="transition">
                <div
                  :hovera="item.hover"
                  :class="[item.hover ? 'drag-active' : '',item.click ? 'drag-active': '','bodyitem']"
                  v-for="(item,index) in currentTemplate"
                  :key="index"
                  @mouseover="hoverItem(item,index,'over')"
                  @mouseout="hoverItem(item,index,'out')"
                  @click.stop="clickItem(item,index)"
                >
                  <DanLieShangPin
                    v-if="item.components == 'danlieshangpin'"
                    :options="item.options"
                  />
                  <ShuangLieShangPin
                    v-if="item.components == 'shuanglieshangpin'"
                    :options="item.options"
                  />
                  <Mofang v-if="item.components == 'mofang'" :options="item.options"/>
                  <Banner v-if="item.components == 'banner'" :options="item.options"/>
                  <ShopInfo v-if="item.components == 'shangpinxiangqing'" :options="item.options"/>
                  <ImgTem v-if="item.components == 'imgGroup'" :options="item.options"/>
                  <DoubleImgTem v-if="item.components == 'doubleimgGroup'" :options="item.options"/>
                  <TabTem v-if="item.components == 'xuanxiangqia'" :options="item.options"/>
                  <SearchTem v-if="item.components == 'search'" :options="item.options"/>
                  <VideoTem v-if="item.components == 'video'" :options="item.options"/>
                  <MemberTem class="undraggable" v-if="item.components == 'member'" :options="item.options"/>
                  <OrderTem v-if="item.components == 'order'" :options="item.options"/>
                  <ListTem v-if="item.components == 'list'" :options="item.options"/>
                  <BlankTem v-if="item.components == 'blank'" :options="item.options"/>
                  <LineTem v-if="item.components == 'line'" :options="item.options"/>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>
      <div class="decorate-content-right">
        <!-- 页面的总体配置 -->
        <!-- <DefaultConfig
          v-if="!currentClick.components"
          v-on:listenToOption="changeOptions"
          :options="basicOption"
          v-on:listenToOpenImgSelect="openImgSelect"
        ></DefaultConfig> -->
        <!-- 模块对应的配置文件 -->
        <DanConfig
          v-if="currentClick.components == 'danlieshangpin'"
          v-on:deleteGoodSelect="deleteGood"
          v-on:listenToOpenGoodSelect="openGoodSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <ShuangConfig
          v-if="currentClick.components == 'shuanglieshangpin'"
          v-on:deleteGoodSelect="deleteGood"
          v-on:listenToOpenGoodSelect="openGoodSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <MofangConfig
          v-if="currentClick.components == 'mofang'"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <BannerConfig
          v-if="currentClick.components == 'banner'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <ShopInfoConfig
          v-if="currentClick.components == 'shangpinxiangqing'"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <ImgConfig
          v-if="currentClick.components == 'imgGroup'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <DoubleImgConfig
          v-if="currentClick.components == 'doubleimgGroup'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <TabConfig
          v-if="currentClick.components == 'xuanxiangqia'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <SearchConfig
          v-if="currentClick.components == 'search'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <VideoConfig
          v-if="currentClick.components == 'video'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToOpenVideoSelect="openVideoSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <MemberConfig
          v-if="currentClick.components == 'member'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenImgSelect="openImgSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <OrderConfig
          v-if="currentClick.components == 'order'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenIconSelect="openIconSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <ListConfig
          v-if="currentClick.components == 'list'"
          v-on:listenToOpenLinkSelect="openLinkSelect"
          v-on:listenToOpenIconSelect="openIconSelect"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
          :editable="editable"
        />
        <BlankConfig
          v-if="currentClick.components == 'blank'"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
        <LineConfig
          v-if="currentClick.components == 'line'"
          v-on:listenToForm="changeTemplate"
          :options="currentClick"
        />
      </div>
    </div>
  </Layout>
</template>
<script>
import Common from "@/api/request/common";
import DanLieShangPin from "./components/danlieshangpin/danlieTem";
import DanConfig from "./componentConfig/danlieshangpin/danlieshangpin";
import ShuangLieShangPin from "./components/shuanglieshangpin/shuanglieTem";
import ShuangConfig from "./componentConfig/shuanglieshangpin/shuanglieshangpin";
import Mofang from "./components/mofang/mofangTem";
import MofangConfig from "./componentConfig/mofang/mofang";
import Banner from "./components/banner/bannerTem";
import BannerConfig from "./componentConfig/banner/banner";
import ShopInfo from "./components/shopinfo/shopinfoTem";
import ShopInfoConfig from "./componentConfig/shopinfo/shopinfo";
import DefaultConfig from "./componentConfig/default/default";
import ImgTem from "./components/imgTem/imgTem";
import ImgConfig from "./componentConfig/imgConfig/imgConfig";
import DoubleImgTem from "./components/doubleImgTem/doubleImgTem";
import DoubleImgConfig from "./componentConfig/doubleImgConfig/doubleImgConfig";
import TabTem from "./components/tabTem/tabTem";
import TabConfig from "./componentConfig/tabConfig/tabConfig";
import SearchTem from "./components/searchTem/searchTem";
import SearchConfig from "./componentConfig/searchConfig/searchConfig";
import BlankTem from "./components/blankTem/blankTem";
import BlankConfig from "./componentConfig/blankConfig/blankConfig";
import LineTem from "./components/lineTem/lineTem";
import LineConfig from "./componentConfig/lineConfig/lineConfig";
import VideoTem from './components/videoTem/videoTem';
import VideoConfig from './componentConfig/videoConfig/videoConfig';
import MemberTem from './components/memberTem/memberTem';
import MemberConfig from './componentConfig/memberConfig/memberConfig';
import OrderTem from './components/orderTem/orderTem';
import OrderConfig from './componentConfig/orderConfig/orderConfig';
import ListTem from './components/listTem/listTem';
import ListConfig from './componentConfig/listConfig/listConfig';
import IconLists from "../templatePage/otherComponents/IconList/IconList"
import ImgSelect from "../imgSelect/imgselect";
import VideoSelect from "../videoSelect/videoselect";
import UrlButton from "../urlbutton/urlbutton";
import AddGood from "../addGood/addGood";
import draggable from "vuedraggable";
export default {
  name: "templatePage",
  components: {
    IconLists,
    ImgSelect,
    VideoSelect,
    UrlButton,
    draggable,
    DanLieShangPin,
    DanConfig,
    ShuangLieShangPin,
    ShuangConfig,
    Mofang,
    MofangConfig,
    Banner,
    BannerConfig,
    ShopInfo,
    ShopInfoConfig,
    ImgConfig,
    ImgTem,
    DoubleImgTem,
    DoubleImgConfig,
    TabTem,
    TabConfig,
    SearchTem,
    SearchConfig,
    BlankTem,
    BlankConfig,
    LineTem,
    LineConfig,
    VideoTem,
    VideoConfig,
    MemberTem,
    MemberConfig,
    OrderTem,
    OrderConfig,
    ListTem,
    ListConfig,
    DefaultConfig,
    AddGood
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
      collapseLeft: "1",
      colleftContent: [],
      collists: [],
      currentTemplate: [],
      currentClick: {},
      currentOption: [],
      showConfrim: false,
      basicOption: {},
      tempId: "",
      type: 1,
      imgOptions: {
        type: "image",
        mode: "diy"
      },
      videoOptions: {
        type: "image",
        mode: "diy"
      },
      linkSettings: {
        mode: "diy"
      },
      goodSettings: {
        mode: "diy"
      },
      isSelect: [],
      editable:'enable',
      role: '',
      status: ''
    };
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
  mounted() {
    let _this = this;
    _this.init();
  },
  activated: function() {
    let _this = this
    _this.restore();
    _this.init();
  },
  methods: {
    restore() {
      this.collapseLeft = "1"
      this.colleftContent = []
      this.collists = []
      this.currentTemplate = []
      this.currentClick = {}
      this.currentOption = []
      this.showConfrim = false
      this.basicOption = {}
    },
    async init() {
      let _this = this;
      _this.makeTools();
    },
    async makeTools() {
      let _this = this;
    },
    detailTemplate(data) {
      let _this = this;
      if(data){
        let newcurrentTemplate = []
        _this.currentTemplate = data
      }else{
        _this.currentTemplate = []
      }
    },
    toggleList(pid, toggle) {
      let _this = this;
      if (toggle == "open") {
        _this.collists[pid].toolsCollapse = "close";
      } else {
        _this.collists[pid].toolsCollapse = "open";
      }
    },
    cancelClick() {
      let _this = this;
      _this.currentClick = {};
      _this.currentTemplate.map((v, i) => {
        v.click = false;
        v.hover = false;
      });
    },
    addGoodsItem(item) {
      let _this = this;
      let com = item.components;
      _this.collists.map((v, i) => {
        v.toolsChildren.map((vs, is) => {
          if (vs.hasOwnProperty("components")) {
            if (com == vs.components) {
              if (vs.all == 0) {
                vs.current++;
                _this.collists[i].toolsChildren[is] = vs;
                _this.currentTemplate.push({
                  ...vs,
                  hover: false,
                  click: false,
                  options: {}
                });
              } else if (vs.current < vs.all) {
                vs.current++;
                _this.collists[i].toolsChildren[is] = vs;
                _this.currentTemplate.push({
                  ...vs,
                  hover: false,
                  click: false,
                  options: {}
                });
              } else {
                _this.$Message.warning("该元素只能添加" + vs.all + "个");
              }
            }
          }
        });
      });
    },
    hoverItem(item, index, type) {
      let _this = this;
      if (type == "over") {
        _this.currentTemplate[index].hover = true;
      } else {
        _this.currentTemplate[index].hover = false;
      }
      _this.$forceUpdate();
    },
    clickItem(item, index) {
      let _this = this;
      if (_this.currentClick == "{}" || _this.currentClick.id != index) {
        _this.showConfrim = false;
      }
      _this.currentTemplate.map((v, i) => {
        if (i == index) {
          let selects = [];
          if (
            v.components == "danlieshangpin" ||
            v.components == "shuanglieshangpin"
          ) {
            if (
              v.options.hasOwnProperty("colorGroup") &&
              v.options.colorGroup.length > 0
            ) {
              v.options.colorGroup.map((vi, ii) => {
                selects.push(vi);
              });
            }
            _this.isSelect = selects;
          }

          v.click = true;
          _this.currentClick = {
            id: index,
            components: v.components,
            options: JSON.stringify(v).includes("options") ? v.options : {}
          };
        } else {
          v.click = false;
        }
      });
    },
    changeOptions(data) {
      let _this = this;
      _this.basicOption = data;
    },
    changeTemplate(data) {
      let _this = this;
      let id = _this.currentClick.id;
      _this.currentClick = {
        ..._this.currentClick,
        options: data
      };
      _this.currentTemplate[id] = {
        ..._this.currentTemplate[id],
        options: data
      };
      _this.$emit("listenToTempValue", _this.currentTemplate);
    },
    showConfrimModel() {
      let _this = this;
      _this.showConfrim = true;
    },
    confrimCancel() {
      let _this = this;
      _this.showConfrim = false;
    },
    confrimDelete(item, index) {
      let _this = this;
      _this.currentTemplate.splice(index, 1);
      _this.showConfrim = false;
      let itemname = item.components;
      _this.currentClick = {};
      _this.collists.map((v, i) => {
        v.toolsChildren.map((vs, is) => {
          if (vs.hasOwnProperty("components")) {
            let comname = vs.components;
            if (comname == itemname) {
              if (vs.current <= 0) {
                vs.current = 0;
              } else {
                vs.current--;
              }
              _this.collists[i].toolsChildren[is] = vs;
            }
          }
        });
      });
    },
    openIconSelect(){
      let _this = this;
      _this.$refs.IconLists.toggleIcon();
    },
    openImgSelect(options) {
      let _this = this;
      _this.imgOptions = options;
      _this.$refs.imgselect.uploadflg();
    },
    openVideoSelect(options){
      let _this = this;
      _this.videoOptions = options;
      _this.$refs.videoselect.uploadflg();
    },
    changeIcon(icons){
      let _this = this
      let currentId = _this.currentClick.id;
      let options = _this.currentClick.options;
      let index = options.addIndex
      options.colorGroup[index].adImg = icons
    },
    changeVideo(video){
      let _this = this
      console.log(_this.videoOptions.id)
      if(_this.videoOptions.id == 'video'){
        let currentId = _this.currentClick.id;
        let options = _this.currentClick.options;
        options.video_link = video[0].imgAddress

        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };


        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };

        console.log(_this.currentClick,_this.currentTemplate)
        _this.$emit("listenToTempValue", _this.currentTemplate);
      }
    },
    changeImg(imgs) {
      let _this = this;
      if (_this.imgOptions.id == "mofang") {
        let currentTimgs = imgs;
        let currentId = _this.currentClick.id;
        let options = _this.currentClick.options;
        let cid = options.currentId;
        let currentCombineLists = options.combineLists;
        currentCombineLists.map((v, i) => {
          if (v.id == cid) {
            v.imageUrl = currentTimgs[0].imgAddress;
          }
        });
        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      } else if (_this.imgOptions.id == "options") {
        let options = { ..._this.basicOption };
        options.backImg = imgs[0].imgAddress;
        _this.basicOption = options;
      } else if (_this.imgOptions.id == "search"){
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options
        options = {
          ...options,
          search_img:imgs[0].imgAddress
        };
        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      } else if (_this.imgOptions.id == "member"){
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options
        options = {
          ...options,
          member_img:imgs[0].imgAddress
        };
        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      } else if (_this.imgOptions.id == "video"){
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options
        options = {
          ...options,
          video_img:imgs[0].imgAddress
        };
        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      } else if(_this.imgOptions.id == 'tabs'){
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options
        let cid = options.addChildIndex
        let pid = options.addIndex
        let colorGroup = options.colorGroup
        colorGroup[pid].tabContent[cid].tabImg = imgs[0].imgAddress

        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };

      }else{
        let currentId = _this.currentClick.id;
        let options = _this.currentClick.options;
        let index = options.addIndex;
        let colorGroup = options.colorGroup;
        colorGroup[index].adImg = imgs[0].imgAddress;

        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };

        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      }
      _this.$emit("listenToTempValue", _this.currentTemplate);
    },
    openLinkSelect(options) {
      let _this = this;
      if(_this.type == 3 && options.id == 'list'){
        _this.linkSettings = {
          ...options,
          showService:true
        }
      }else{
        _this.linkSettings = {
          ...options,
          showService:false
        }
      }
      _this.$refs.linkselect.cardShow();
    },
    openGoodSelect(options) {
      let _this = this;
      _this.goodSettings = options;
      _this.$refs.goodselect.addGoods();
    },
    deleteGood(value, index) {
      this.$refs.goodselect.delectSelect(value, index);
    },

    changeGood(goods) {
      let _this = this;
      let currentId = _this.currentClick.id;
      let options = _this.currentClick.options;
      let newGroup = [];
      let colorGroup = options.colorGroup;

      goods.map((v, i) => {
        newGroup.push(v);
      });

      options.colorGroup = newGroup;

      _this.currentClick = {
        ..._this.currentClick,
        options: options
      };

      _this.currentTemplate[currentId] = {
        ..._this.currentTemplate[currentId],
        options: options
      };

      _this.$forceUpdate();
      _this.$emit("listenToTempValue", _this.currentTemplate);
    },
    changeLink(links) {
      let _this = this;
      if (_this.linkSettings.id == "mofang") {
        let currentId = _this.currentClick.id;
        let options = _this.currentClick.options;
        let cid = options.currentId;
        let currentCombineLists = options.combineLists;
        currentCombineLists.map((v, i) => {
          if (v.id == cid) {
            v.linkUrl = links;
          }
        });
        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      } else if(_this.linkSettings.id == "tabs"){
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options
        let cid = options.addChildIndex
        let pid = options.addIndex
        let colorGroup = options.colorGroup
        colorGroup[pid].tabContent[cid].tabLink = links

        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      }else if(_this.linkSettings.id == "member"){
        let currentId = _this.currentClick.id
        let options = _this.currentClick.options

        options.member_link = links

        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };
        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      }else {
        let currentId = _this.currentClick.id;
        let options = _this.currentClick.options;
        let index = options.addIndex;
        let colorGroup = options.colorGroup;
        colorGroup[index].adLink = links;

        _this.currentClick = {
          ..._this.currentClick,
          options: options
        };

        _this.currentTemplate[currentId] = {
          ..._this.currentTemplate[currentId],
          options: options
        };
      }
      _this.$emit("listenToTempValue", _this.currentTemplate);
    },
    validateData(){
      let _this = this
      let key = true
      for (let j = 0; j < _this.currentTemplate.length; j++) {
        let v = _this.currentTemplate[j]
        if(v.components == "imgGroup" && v.options.hasOwnProperty('colorGroup')){
          let imgGroup = v.options.colorGroup
          for (let i = 0; i < imgGroup.length; i++) {
            if(!imgGroup[i].adImg){
              _this.$Message.error('图片组图片不能为空')
              key = false
              return key
            }
          }
        }else if(v.components == "imgGroup" && !v.options.hasOwnProperty('colorGroup')){
          _this.$Message.error('请添加图片组数据')
          key = false
          return key
        }
        
        if(v.components == "banner" && v.options.hasOwnProperty('colorGroup')){
          let imgGroup = v.options.colorGroup
          for (let i = 0; i < imgGroup.length; i++) {
            if(!imgGroup[i].adImg){
              _this.$Message.error('轮播图图片不能为空')
              key = false
              return key
            }
          }
        }else if(v.components == "banner" && !v.options.hasOwnProperty('colorGroup')){
          _this.$Message.error('请添加轮播图数据')
          key = false
          return key
        }
        
        if(v.components == 'mofang' && v.options.hasOwnProperty('combineLists')){
          let imgGroup = v.options.combineLists
          for (let i = 0; i < imgGroup.length; i++) {
            if(!imgGroup[i].imageUrl){
              _this.$Message.error('魔方图片不能为空')
              key = false
              return key
            }
          }
        }else if(v.components == 'mofang' && !v.options.hasOwnProperty('combineLists')){
          _this.$Message.error('请添加魔方数据')
          key = false
          return key
        }
      }
      return key
    },
    saveTemplate() {
      let _this = this;
      
      let validate = _this.validateData()

      if(!validate){
        return false
      }

      if (_this.tempId) {
        Common.editTemplate({
          id: _this.tempId,
          type: _this.type,
          status: 1,
          name: _this.basicOption.pageName,
          title: _this.basicOption.pageTitle,
          data: {
            currentTemplate: _this.currentTemplate,
            basicOption: _this.basicOption
          }
        }).then(res => {
          if (res.code == 1) {
            _this.$Message.success("保存成功");
            _this.back();
          } else {
            _this.$Message.error(res.message);
          }
        });
      } else {
        Common.saveTemplate({
          type: _this.type,
          status: 1,
          name: _this.basicOption.pageName,
          title: _this.basicOption.pageTitle,
          data: {
            currentTemplate: _this.currentTemplate,
            basicOption: _this.basicOption
          }
        }).then(res => {
          if (res.code == 1) {
            _this.$Message.success("保存成功");
            _this.back();
          } else {
            _this.$Message.error(res.message);
          }
        });
      }
    },
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
