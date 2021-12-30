<template>
  <div id="add-class">
    <div class="currentTitle" v-if="role !== '0'">商品分类/<label> 添加新分类</label></div>
    <div class="currentTitle" v-if="role === '0'">商品分类/<label> 编辑分类</label></div>
    <url-button ref="linkselect" @SmallProFun="SmallProFun" @listenurldata="geturldata" :settings="linkSettings"></url-button>
    <Card>
      <div class="add-con-box">
        <div class="basic-content">
          <div class="content-war" v-if="role === '2' || role == 'second'">
            <span class="content-war-span">上级分类</span>
            <p style="display: inline-block;margin: 0;">{{childName}}</p>
          </div>
          <div class="content-war" v-if="classId !='1'">
            <span class="content-war-span">分类排序</span>
            <Input :maxlength="6" v-model="displayOrder" style="width: 260px"/>
            <p>为空或者0即默认排序在最后</p>
          </div>
          <div class="content-war">
            <span class="content-war-span">
              分类名称
              <i style="color:red;">*</i>
            </span>
            <!-- <Input v-if="role == 0 && classId =='1'" disabled v-model="name" style="width: 260px"/>
            <Input v-if="classId !='1'" v-model="name" style="width: 260px"/>-->
            <Input v-model="name" style="width: 260px"/>
          </div>
          <div class="content-war">
            <span class="content-war-span">是否前端显示</span>
            <RadioGroup v-model="statuskey">
              <Radio label="1">显示</Radio>
              <Radio label="0">隐藏</Radio>
            </RadioGroup>
          </div>
          <div v-if="classId !='1'" class="content-war">
            <span class="content-war-span">分类图片</span>
            <div class="img-add">
              <div class="imgcalssify-content">
                <div class="imgcalssify" v-if="imgcalssify != ''">
                  <div class="calssifydelete" @click="removecalss">
                    <Icon type="ios-close-circle"/>
                  </div>
                  <img :src="imgcalssify">
                </div>
                <div class="imgcalssifyselect">
                  <img-select @listentoptpmfile="getimgcalssify($event)" :options="{type: 'image'}"></img-select>
                </div>
              </div>
            </div>
          </div>
          <div v-if="classId !='1'" class="content-war">
            <span class="content-war-span">广告图片</span>
            <p style="display: inline-block;margin: 0;">单张图片尺寸建议750*350</p>

            <div class="select-btn select-single-box">
              <!-- 图片显示模板 -->
              <Row>
                <Col span="16">
                  <draggable :list="addate" @start="dragging = true" @end="dragging = false">
                    <div class="ad-item" v-for="(item,index) in addate" :key="index">
                      <div class="ad-item-delete" @click="adDatedelete(index)">
                        <Icon type="md-trash"/>
                      </div>

                      <div class="ad-item-l">
                        <img :src="item.categoruAdimg" alt>
                      </div>
                      <div class="ad-item-r">
                        <div class="adimgurl">
                          <div class="adimgurl-l">
                            <Input
                              :value="item.categoruAdimg"
                              disabled="disabled"
                              style="width: 300px;margin-right: 10px;"
                            />
                          </div>

                          <div class="getchangeadbtn">
                            <div class="getchangeadbtn-txt">选择图片</div>
                            <img-select
                              @listentoptpmfile="getchangead($event,index)"
                              :options="{type: 'image'}"
                            ></img-select>
                          </div>
                        </div>
                        <div class="adbuttonurl">
                          <Input
                            :value="item.categoruAdaddress"
                            disabled="disabled"
                            style="width: 300px"/><Button @click="urlFun(index)" type="primary">选择链接</Button>
                        </div>
                      </div>
                    </div>
                  </draggable>
                </Col>
              </Row>
            </div>

            <!-- 图片添加按钮 -->
            <div class="add-img">
              <Row>
                <Col span="16">
                  <div class="border-img">
                    <div class="md-add-icon">
                      <Icon type="md-add"/>添加广告图片
                    </div>
                    <div class="getimgad">
                      <img-select
                        @listentoptpmfile="getimgad($event)"
                        :options="{type: 'multiimage'}"
                      ></img-select>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <p>最多添加10个广告，拖动选中的图片广告可对其排序</p>
          </div>
          <div v-if="classId !='1'" class="content-war">
            <span class="content-war-span">商品推荐</span>
            <div class="content-good">
              <add-good :res="res" @listentgoodData="getgoodDatafuc($event)" :options="showData"></add-good>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <Button type="primary" @click="keepFun" :loading="loading">
            <span>保存</span>
        </Button>
        <Button type="primary" @click="goBack">返回</Button>
      </div>
    </card>
  </div>
</template>

<script>
import goods from "@/api/request/goods.js";

// 上传选择
import ImgSelect from "@/components/imgSelect/imgselect";
// 地址选择
import urlButton from "@/components/urlbutton/urlbutton";

// 局部组件添加商品
import addGood from "@/components/addGood/addGood";
import draggable from "vuedraggable";

export default {
  data() {
    return {
      // 链接的配置信息
      loading: false,
      linkSettings:{
        mode:'diy'
      },
      res: "+选择商品",
      // url 测试
      url: "sdfsdfsdf",
      // 分类排序
      displayOrder: "",

      // 分类名称
      name: "",
      childName: "",

      // 是否前端显示
      statuskey: "1",

      // 广告信息
      addate: [],

      // 商品推荐图片数据
      getgoodData: [],

      // 暂存角色
      role: "",

      // 分类的id
      classId: "",

      // 图片分类
      imgcalssify: '',

      goodID: [],

      // 广告图片
      categoruAdimg: [],

      // 广告地址
      categoruAdaddress: [],

      // 商品添加要接受的值
      showData: [],

      // 分类的等级
      level: 0,
      dragging: false,
      // 记录地址的索引
      urlIndex: ''
    };
  },

  created() {
    // 0 是编辑 1 是添加 2 是添加子分类
    let { ...res } = this.$route.query;
    this.role = res.role;
    this.classId = res.classId;
    this.childName = res.childName;
    this.level = res.level;
    console.log(this.role, this.classId, this.childName);
    if (this.role === "0") {
      // 进行请求
      this.apiGet();
    } else if (this.role === "second" && this.childName) {
      this.apiGet();
    }
    console.log(this.statuskey);
  },

  components: {
    ImgSelect,
    urlButton,
    addGood,
    draggable
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    // 获取商品ID
    getgoodDatafuc: function(data) {
      this.getgoodData = data;
      this.goodID = [];
      for (let item in data) {
        this.goodID.push(data[item].id);
      }
      console.log(this.goodID);
    },

    // 请求数据的接口
    apiGet: function() {
      goods
        .goodsCategoryDetail({
          id: this.classId
        })
        .then(res => {
          let code = res.code;
          if (code == "1") {
            console.log('************123456',res);
            this.addMsg(res);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 添加编辑信息
    addMsg: function(data) {
      console.log("编辑信息", data);
      this.name = data.data.name;
      this.addate = data.data.categoryAdvert;
      this.imgcalssify = data.data.thumb;
      this.showData = data.data.goodsList;
      this.displayOrder = data.data.displayOrder;
      this.statuskey = data.data.status + "";
    },

    // 添加分类图片
    getimgcalssify: function(data) {
      console.log('我是图片的地址',data[0].imgAddress);
      let tempdata = [];
      tempdata.push(data[0].imgAddress);

      this.imgcalssify = tempdata;
    },

    // 改变广告图片
    getchangead: function(data, index) {
      this.addate[index].categoruAdimg = data[0].imgAddress;
    },

    urlFun(index) {
      // console.log('我是url组件',this.$refs.linkselect.cardShow())
      let _this = this
      _this.urlIndex = index
      _this.$refs.linkselect.cardShow()
    },
    // 删除广告图片
    adDatedelete: function(index) {
      this.addate.splice(index, 1);
      console.log(this.addate);
    },
    // 获取小程的信息
    SmallProFun(SmallPro) {
      this.addate[this.urlIndex].categoruAdaddress = "其他小程序"
    },
    // 获取路径
    geturldata: function(links) {
      console.log(links,'我是链接')
      this.addate[this.urlIndex].categoruAdaddress = links
    },

    // 删除分类图片
    removecalss: function(data) {
      this.imgcalssify = ""
    },

    //添加广告图片
    getimgad: function(data) {
      let adarr = [];

      console.log("我按广告", data);
      console.log(this.addate.length);
      // let len =
      let adobj = {};
      for (let i = 0; i < data.length; i++) {
        if (this.addate.length < 10) {
          adobj.categoruAdimg = data[i].imgAddress;
          adobj.categoruAdaddress = "";
          this.addate.push(adobj);
          adobj = {};
        } else {
          this.$Message.error("轮播最多10张图片");
          return;
        }
      }
    },
    // // 分割对象
    categoryAdvertfunc: function() {
      for (let item in this.addate) {
        this.categoruAdimg.push(this.addate[item].categoruAdimg);
      }
      for (let item in this.addate) {
        this.categoruAdaddress.push(this.addate[item].categoruAdaddress);
      }
    },

    // 商品分类保存
    keepFun: function() {
      this.loading = true
      console.log('查看我是谁',this.role)
      if (this.name == "") {
        this.$Message.error("商品分类名称不能为空");
        return;
      }
      this.categoryAdvertfunc();

      if (this.role === "1") {
        this.addclass();
      } else if (this.role === "0") {
        this.editfuntion();
      } else if (this.role == "2") {
        this.subclassification();
      } else if (this.role == "second") {
        this.editfuntion();
      }
    },
    verificationFun() {
        // if ((this.displayOrder + '').indexOf('e') != -1) {
        //   this.$Message.error('分类排序只能是数字')
        //   return false
        // }
        // if ((this.displayOrder + '').indexOf('e') != -1) {
        //   this.$Message.error('分类排序只能是数字')
        //   return false
        // }
        let res = /^\+?[0-9][0-9]*$/
        if (this.displayOrder != '') {
          if (!res.test(this.displayOrder)) {
            this.$Message.error('分类排序只能是正整数')
            return false
          }
        }
        // console.log((this.displayOrder + '').indexOf('.') != -1)
        // return false
        if ((this.displayOrder + '').indexOf('.') != -1) {
          this.$Message.error('分类排序不能为小数')
          return false
        }
        if (this.displayOrder >= 1000000) {
          this.$Message.error('分类排序不能大于等于1000000')
          return false
        }
        return true
    },
    // 商品保存分类
    addclass: function() {
      if(this.displayOrder){
        let req = this.verificationFun()
        if (!req) {
          this.loading = false
          return
        }
      }
      
      goods
        .goodsCategorySave({
          displayOrder: this.displayOrder ? this.displayOrder : 0,
          name: this.name,
          status: this.statuskey,
          thumb: this.imgcalssify,
          advertAddress: this.categoruAdaddress,
          advertImg: this.categoruAdimg,
          goodsIds: this.goodID,
          level: this.level
        })
        .then(res => {
          if (res.code == 1) {
            this.loading = false
            this.$Message.success("保存成功");
            this.goBack();
          } else {
            this.loading = false
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          this.loading = false
          console.log(error);
        });
    },

    // 返回首页
    goBack: function() {
      this.$router.push({
        path: "/@/views/goodsclassification/GoodsClassification"
      });
    },

    // 编辑分类
    editfuntion: function() {
      let req = this.verificationFun()
      if (!req) {
        this.loading = false
        return
      }
      goods
        .goodsCategoryUpdate({
          id: this.classId,
          displayOrder: this.displayOrder ? this.displayOrder : 0,
          name: this.name,
          status: this.statuskey,
          thumb: this.imgcalssify,
          advertAddress: this.categoruAdaddress,
          advertImg: this.categoruAdimg,
          goodsIds: this.goodID,
          level: this.level
        })
        .then(res => {
          if (res.code == 1) {
            this.loading = false
            this.goBack();
            this.$Message.success("编辑成功");
          } else {
            this.loading = false
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 添加子分类
    subclassification: function() {
      let req = this.verificationFun()
      if (!req) {
        this.loading = false
        return
      }
      goods
        .categorySave({
          parentId: this.classId,
          displayOrder: this.displayOrder ? this.displayOrder : 0,
          name: this.name,
          status: this.statuskey,
          thumb: this.imgcalssify,
          advertAddress: this.categoruAdaddress,
          advertImg: this.categoruAdimg,
          goodsIds: this.goodID,
          level: this.level + 1
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.loading = false
            this.$Message.success("保存成功");
            this.goBack();
          } else {
            this.loading = false
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          this.loading = false
          console.log(error);
        });
    }
  }
};
</script>

<style>
@import "./AddClass.css";
</style>
