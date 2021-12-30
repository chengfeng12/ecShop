<style lang="less" scoped>
@import "./adver.less";
</style>
<template :options="options">
  <div class="d-config">
    <Tabs value="content" class="d-tab">
      <TabPane label="启动广告设置" name="content">
        <div class="pannelcontent">
          <div class="pannelItem">
            <div class="tit">广告名称</div>
            <Input style="width: 300px;" @on-change="changeForm(0)" v-model="options.name"></Input>
            <p class="tit-p">广告名称仅供后台查找</p>
          </div>
          <div class="pannelItem">
            <div class="tit">广告背景</div>
            <ColorPicker placement="bottom-start" @on-change="changeColor" v-model="options.bgcolor" />
            <Button @click="clearBg">重置</Button>
          </div>
          <div class="pannelItem">
            <div class="tit">显示设置</div>
            <RadioGroup v-model="options.showSet" @on-change="changeShow">
              <Radio label="1">
                <span>仅显示一次</span>
              </Radio>
              <Radio label="2">
                <span>每次显示</span>
              </Radio>
              <Radio label="3">
                <span>间隔时间显示</span>
              </Radio>
            </RadioGroup>
            <div v-if="options.showSet == 3">
              <div class="tit">间隔时间</div>
              <div class="dis-ib" style="vertical-align: middle;">
               <div class="dis-flex">
                 <Slider @on-change="timeSlider" v-if="options.showSet == '3'" v-model="options.intervalTime" style="width: 200px;"></Slider><span>{{options.intervalTime}}分钟</span>
               </div>
              </div>
            </div>
          </div>
          <div class="pannelItem">
            <div class="tit">显示页面</div>
            <RadioGroup v-model="options.showPage" @on-change="changeShowPage">
              <Radio label="1">
                <span>仅首页显示</span>
              </Radio>
              <Radio label="2">
                <span>指定页面显示</span>
              </Radio>
              <Radio label="3">
                <span>全部页面</span>
              </Radio>
            </RadioGroup>
          </div>
          <div class="pannelItem" v-if="options.showPage == '2'">
            <div class="tit">指定页面</div>
            <div class="appoint-page">
              <Input
              v-model="options.specifiedPage"
              class="itemInput"
              style="width: 250px"
              disabled>
              <Button slot="append" @click="showPageSelect">选择页面</Button>
            </Input>
            </div>
          </div>
          <div class="pannelItem">
            <div class="tit">上传图片</div>
            <div class="colorGroup">
              <draggable v-model="options.colorGroup" v-bind="optionsAttr" handle=".handle" @change="changeDisplay">
                <div class="colorItem" v-for="(item,index) in options.colorGroup" :key="index">
                  <Icon
                      class="iconfont icon-drag handle"
                      size="24"
                      style="position:absolute;top:0px;right:25px;"
                    />
                  <Icon
                    type="ios-trash img-trash"
                    size="24"
                    @click="deleteColor(index)"
                    v-if="index != 0"
                  />
                  <img v-if="item.imgAddress" class="colorIcon" :src="item.imgAddress" alt>
                  <img v-else class="colorIcon" src="../../static/img/default_onegoods.jpg" alt>
                  <div class="colorInput">
                    <Input v-model="item.imgAddress" class="itemInput" disabled placeholder="请选择图片">
                      <Button slot="append" @click="showImgSelect(index)">选择图片</Button>
                    </Input>
                    <Input
                      v-model="item.jumpAddress"
                      class="itemInput"
                      disabled>
                      <Button slot="append" @click="showLinkSelect(index)">选择跳转</Button>
                    </Input>
                  </div>
                </div>
               </draggable>
            </div>

            <div class="colorAdd" @click="addAd">
              +
              <span class="colortips">添加广告图片</span>
            </div>
            <p class="p">最多添加10个广告，拖动选中的图片广告可对其排序</p>
            <div class="pannelItem">
              <div class="tit">是否启用</div>
              <RadioGroup v-model="options.showEnable" @on-change="statusFun">
                <Radio label="0">
                  <span>不启用</span>
                </Radio>
                <Radio label="1">
                  <span>立即启用</span>
                </Radio>
                <Radio label="2">
                  <span>定时启用</span>
                </Radio>
              </RadioGroup>
              <div style="padding-bottom: 30px;" v-if="options.showEnable == 2">
                <div class="tit">启用时间</div>
                <div class="dis-ib">
                  <DatePicker :editable="false" @on-change="timeChange" v-model="options.startTime" format="yyyy-MM-dd HH:mm" type="datetime" :options="optionsTime" placement="bottom-end" style="width: 280px;"></DatePicker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import shop from '@/api/request/shop'
import draggable from "vuedraggable";
export default {
  props: ["options"],
  data() {
    return {
      optionsAttr: {
        animation: 500
      },
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
    };
  },
  created() {
    let _this = this
  },
  watch: {
    options: {
      handler(value){
        let _this = this;
        _this.newOptions = _this.options;
        console.log('__________',this.options)
        console.log(_this.options)
        _this.init(_this.newOptions);
      },
      deep:true
      
    },
  },
  components: {
    draggable
  },
  methods: {
    // 初始化
    init(op) {
      let _this = this;
      console.log(op,'jjjjjjjj');
      let optionsParams = op;
      console.log('nnnnnnnnnnnnn',optionsParams);
      if (!optionsParams || JSON.stringify(optionsParams) == "{}") {
        console.log('走了清空')
        _this.restore();
      } else {
        console.log('走了',optionsParams.colorGroup)
        // return false
        _this.options.name = optionsParams.name;
        _this.options.bgcolor = optionsParams.bgcolor;
        _this.options.showSet = optionsParams.showSet;
        _this.options.showPage = optionsParams.showPage;
        _this.options.showEnable = optionsParams.showEnable;
        _this.options.colorGroup = optionsParams.colorGroup;
        _this.options.intervalTime = Number(optionsParams.intervalTime)
        _this.options.specifiedPage = optionsParams.specifiedPage
      }
    },
    // 恢复初始状态
    restore() {
      console.log("我是第一次");
      let _this = this;
      _this.options.name = "";
      _this.options.bgcolor = "#999";
      _this.options.showSet = "1";
      _this.options.showPage = "1";
      _this.options.showEnable = "1";
      _this.options.intervalTime = 0
      _this.options.specifiedPage = ''
      _this.options.colorGroup = [
        {
          imgAddress: "",
          jumpAddress: ""
        }
      ];
      _this.changeForm();
    },
    // 改变背景颜色
    changeColor(value) {
      console.log(value);
      let _this = this;
      _this.options.bgcolor = value;
      _this.changeForm();
    },
    clearBg() {
      let _this = this;
      _this.options.bgcolor = "";
      _this.changeForm();
    },
    // 时间的
    timeSlider(time) {
      console.log(time,'time')
      this.options.intervalTime = time
      this.changeForm();
    },

    //改变值并且给父组件传递事件
    changeForm(index) {
      console.log('我是改变的',this.options)
      let _this = this;
      let changeData;
      console.log(index)
      if (index) {
        changeData = {
          addIndex: index - 1,
          name: _this.options.name,
          bgcolor: _this.options.bgcolor,
          showSet: _this.options.showSet,
          showPage: _this.options.showPage,
          showEnable: _this.options.showEnable,
          colorGroup: _this.options.colorGroup,
          intervalTime: _this.options.intervalTime,
          specifiedPage: _this.options.specifiedPage,
          startTime: _this.options.startTime
        };
      } else {
        // console.log('走的是没有索引的')
        console.log('单独查看',this.options.showSet)
        changeData = {
          name: this.options.name,
          bgcolor: this.options.bgcolor,
          showSet: this.options.showSet,
          showPage: this.options.showPage,
          showEnable: this.options.showEnable,
          colorGroup: this.options.colorGroup,
          intervalTime: _this.options.intervalTime,
          specifiedPage: _this.options.specifiedPage,
          startTime: _this.options.startTime
        };
      }
      console.log(changeData)
      _this.$emit("listenToForm", changeData);
    },
    changeShow() {
      if (this.options.showSet != 3) {
        this.options.intervalTime = 0
      }
      this.changeForm()
    },
    changeShowPage() {
      if (this.options.showPage != 2) {
        this.options.specifiedPage = ""
      }
      this.changeForm()
    },

    //删除广告图片
    deleteColor(index) {
      let _this = this;
      _this.options.colorGroup.splice(index, 1);
      _this.changeForm();
    },

    // 添加广告图片

    addAd() {
      let _this = this;
      // 判断数量
      let length = _this.options.colorGroup.length;
      if (length >= 10) {
        _this.$Message.error("不能超过10个");
        return false;
      }
      _this.options.colorGroup.push({
        imgAddress: "",
        jumpAddress: ""
      });
      _this.changeForm(0);
    },

    // 点击显示图片的选择弹框
    showImgSelect(index) {
      let _this = this;
      _this.changeForm(index + 1);
      let changeData = {
        openImg: true,
        mode: "diy",
        type: "image",
        id: "banner"
      };
      _this.$emit("listenToOpenImgSelect", changeData);
    },

    // 点击显示链接的选择弹框
    showLinkSelect(index) {
      let _this = this;
      _this.changeForm(index + 1);
      let changeData = {
        mode: "diy",
        id: "banner",
        link: _this.options.colorGroup[index].jumpAddress
      };
      _this.$emit("listenToOpenLinkSelect", changeData);
    },
    showPageSelect() {
      let _this = this;
      _this.changeForm();
      let changeData = {
        mode: "diy",
        id: "banner",
        link: _this.options.specifiedPage
      };
      this.$emit("showPageSelectFun", changeData);
    },
    statusFun(value) {
      if (value != 2) {
        this.options.startTime = ''
      }
      this.changeForm()
    },
    timeChange(time) {
      this.changeForm()
    },

    // 更换位置
    changeDisplay(e){
      this.changeForm();
    }
  }
};
</script>
