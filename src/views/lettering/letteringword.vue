<template>
  <div class="container">
    <!-- 单选 -->
    <imgSelect ref="multichoice" :options="imgOptions" @listentoptpmfile="changeImg($event)"></imgSelect>
    <imgSelect ref="split" :options="imgOptions" @listentoptpmfile="changeSplit($event)"></imgSelect>
    <imgSelect ref="banner" :options="imgOptions" @listentoptpmfile="changeBanner($event)"></imgSelect>
   
    <div class="redu-box">
      <div class="redu-inset">
        <div class="currentTitle">卡片寄语</div>
        <Card>
 
          <Form
            class="formItem"
            ref="formInline"
            :label-width="100"
            style="border: 1px solid rgb(220, 220, 220);"
          >
            <div class="redu-title">基本信息</div>
            <div class="inset-content">
              <FormItem label="轮播图片" prop :label-width="100">
                <Button type="primary" @click="openImg('img')">+添加图片</Button>
              </FormItem>
              <FormItem :label-width="100">
                <div class="smallImg" v-if="img">
                  <span class="close" @click="handleClose('img')">&times;</span>
                  <img style="width:100%;height:100%;" :src="img" />
                </div>
                <p>图片尺寸建议宽度为450*750像素,并保持图片大小一致,图片大小依照首图尺寸显示</p>
              </FormItem>
            </div>
            <div class="redu-title">内容编辑</div>
            <div
              class="content"
              style="height:700px"
              v-for="(item,index) in splitList"
              :key="index"
            >
              <div class="content-top">
                <p style="margin-left:20px">拼图图片 图片尺寸建议宽度为450*750像素,并保持图片大小一致,图片大小依照首图尺寸显示</p>
              </div>
              <div class="box">
                <div class="box-left">
                  <FormItem label="完整图片" prop :label-width="100">
                    <Button type="primary" @click="openSplit('cutImg',index)">+选择图片</Button>
                  </FormItem>
                  <FormItem :label-width="100">
                    <div class="smallImg" v-if="item.cutImg">
                      <span class="close" @click="handleClose(index,cutImg.id)">&times;</span>
                      <img style="width:100%;height:100%;" :src="item.cutImg" />
                    </div>
                  </FormItem>
                </div>
                <div class="box-right">
                  <div class="boxa">
                    切割图片
                    <div class="box-x">
                      <img src="static\img\del.png" class="box-xx" @click="delx(index)" style="width:35px;height:35px"/>
                    </div>
                  </div>
                  <ul style="padding:20px 0px;">
                    <li v-for="(img,imgId) in item.completeImg" :key="imgId">
                      <div class="smallImg" v-if="img.img">
                        <span class="close" @click="completeDelete(index,imgId)">&times;</span>
                        <img
                          style="width:100%;height:100%;"
                          :src="img.img"
                          @click="openSplit('splitImg',index,imgId)"
                        />
                      </div>
                      <div
                        v-else
                        style="width:100%;height:100%;display:flex;flex-direciton:column;justify-content:center;align-items:center;border:1px solid #f1f1f1;"
                        @click="openSplit('splitImg',index,imgId)"
                      >请选择图片</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Button style="margin-top:25px;margin-left:45px" @click="addSplit">+添加拼图图片</Button>
            <div class="content-s" style="height:300px">
              <div class="content-top">卡片模板</div>
              <div class="boxs">
                <FormItem label="卡片模板" prop :label-width="100" style="margin-top:20px">
                  <Button type="primary" @click="openImg('cardId')">+选择图片</Button>
                </FormItem>
                <FormItem :label-width="100">
                  <div class="smallImg" v-if="cardId">
                    <span class="close" @click="handleClose('cardId')">&times;</span>
                    <img style="width:100%;height:100%;" :src="cardId" />
                  </div>
                </FormItem>
              </div>
            </div>
            <div class="redu-title">分享设置</div>
            <div class="inset-content">
              分享标题
              <Input v-model="shareTitle" placeholder style="width: 300px;margin-left:30px"/>
              <div class="share-img" style="margin-top:40px">
              分享图片
                <FormItem label="" prop :label-width="100" style="margin-left:-40px; margin-top:-30px">
                  <Button type="primary" @click="openImg('shareImg')" style="margin-left:30px ">+选择图片</Button>
                </FormItem>
                <FormItem :label-width="100">
                  <div class="smallImg" v-if="shareImg" style="margin-left:-10px">
                    <span class="close" @click="handleClose('shareImg')">&times;</span>
                    <img style="width:100%;height:100%;" :src="shareImg"  />
                  </div>
                </FormItem>
              </div>
            </div>
          </Form>
        </Card>
      </div>
      <!--保存 取消 -->
      <div class="formBtn">
        <Button v-if="hasRole(80502)" type="primary" :loading="loading" size="large" class="comBtn" @click="save">保存提交</Button>
        <Button type="default" size="large" class="comBtn" @click="back">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import imgSelect from "@/components/imgSelect/imgSelect";
import operation from "@/api/request/operation";
export default {
  name: "letteringword",
  components: {
    imgSelect
  },
  data() {
    return {
      loading:false,
      imgOptions: {
        type: "image",
        mode: "diy"
      },
      img: "",
      completeImg: "",//完整图
      banner: "",
      cardId: "",
      shareTitle: "",
      shareImg: "",
      splitList: [],
      currentPid: "",
      currentId: "",
      id: "",
      cutList:"",//拼接图
      cutImg:"",//切割图
      currentType:''
    };
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      //查询
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      operation.getSelCardMessage({

      }).then(res => {
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhh",res);
        if (res.code == 1) {
          this.img = res.data.banner,
          this.completeImg = res.data.completeImg,
          this.cutImg = res.data.cutImg,
          this.cardId = res.data.cardId,
          this.splitList=res.data.listCut,
          this.shareTitle = res.data.shareTitle,
          this.shareImg = res.data.shareImg;
          this.id = res.data.id;
        }
        else{
          this.$Message.error(res.message)
        }
        this.splitList.map((v,i) => {
          v.completeImg = JSON.parse(v.completeImg)
        })
      });
    },

    makeLists() {
      let lists = [];
      for (let i = 0; i < 9; i++) {
        lists.push({
          img: ""
        });
      }
      this.splitList.push({
        cutImg: "",
        completeImg: lists
      });
    },

    addSplit() {
      this.makeLists();
    },

    openSplit(type,pid, id) {
      this.currentType = type
      this.currentPid = pid;
      this.currentId = id;
      this.$refs.split.uploadflg();
    },
    //修改
    save() {
      console.log("123321");
      let _this = this;
      _this.loading=true;
      console.log(this.id);
      // 修改
      if (!_this.id) {
        console.log("123");
        operation
          .getInsCardMessage({
            banner: _this.img,
            completeImg: _this.completeImg,
            cutImg: _this.cutImg,
            cardId: _this.cardId,
            shareTitle: _this.shareTitle,
            shareImg: _this.shareImg,
            cutList:_this.splitList,
          })
          .then(res => {
            if (res.code == "1") {
               _this.loading=false;
              this.$Message.success("保存成功");
            } else {
               _this.loading=false;
              this.$Message.error(res.message);
            }
          });
      } else {
        _this.loading=true;
        operation
          .getUpdCardMessage({
            id: _this.id,
            banner: _this.img,
            completeImg: _this.completeImg,
            cutImg: _this.cutImg,
            cardId: _this.cardId,
            shareTitle: _this.shareTitle,
            shareImg: _this.shareImg,
            cutList:_this.splitList
          })
          .then(res => {
            if (res.code == "1") {
               _this.loading=false;
              this.$Message.success("保存成功");
            } else {
               _this.loading=false;
              this.$Message.error(res.message);
            }
          });
      }
    },

    // 上传图片单选
    openImg(type) {
      this.currentImg = type;
      this.$refs.multichoice.uploadflg();
    },
  
    // // 拼接图片
    // completeImgfuc() {
    //   this.$refs.completeImg.uploadflg();
    // },
    // // 删除bnner
    // bannerDelete(index) {
    //   this.banner.splice(index, 1);
    // },
    // 删除拼接图片
    completeDelete(pid, id) {
      this.splitList[pid].completeImg[id].img = "";
    },
    //删除
    delx(index) {
      this.splitList.splice(index, 1);
    },
    // 监听图片选择的事件
    changeImg(img) {
      console.log(this.currentImg);
      if (this.currentImg == "img") {
        this.img = img[0].imgAddress;
      }else if(this.currentImg=="cutImg"){
        this.cutImg=img[0].imgAddress;

      }else if(this.currentImg=="completeImg"){
              this.completeImg=img[0].imgAddress;
      } else if (this.currentImg == "cardId") {
        this.cardId = img[0].imgAddress;
      } else {
        this.shareImg = img[0].imgAddress;
      }
    },

    changeSplit(img) {
      let type = this.currentType
      let imgSrc = img[0].imgAddress
      let pid = this.currentPid;
      let splitImg = this.splitList;
      if(type == 'splitImg'){
        let id = this.currentId;
        splitImg[pid].completeImg[id].img = imgSrc;
      }else{
         splitImg[pid].cutImg = imgSrc;
      }

      // console.log(this.)
      
    },
   
    //关闭小图
    handleClose(type) {
      console.log(type);
      if (type == "banner") {
        this.banner = "";
      }else if(type=="cutImg"){

          this.cutImg="";
      }else if(type=="completeImg"){
        this.completeImg="";
      } else if (type == "img") {
        this.img = "";
      } else if (type == "cardId") {
        this.cardId = "";
      } else {
        this.shareImg = "";
      }
    },
    back() {}
  }
};
</script>

<style lang="less" scoped>
.box-right {
  margin-top: 10px;
  box-sizing: border-box;
}

.box-x {
  float: right;
  width: 40px;
  height: 40px;
  line-height: 35px;
  margin-top: -25px;
  margin-right: -120px;
  // background-color: rgb(242, 242, 242);
  position: relative;
  .box-xx {
    font-size: 40px;
    position: absolute;
    margin-left: 3px;
  }
}

.box {
  margin: 0px 20px 0px 20px;
  .box-left {
    float: left;
    margin-top: 50px;
    margin-left: 10px;
  }

  .box-right {
    float: right;
    margin-top: 50px;
    margin-right: 150px;
  }

  .box-right ul {
    width: 450px;
    height: 100%;
    overflow: hidden;
  }

  .box-right ul li {
    float: left;
    width: 127px;
    height: 168px;
    margin-right: 13px;
    margin-bottom: 15px;
  }

  .box-right ul li:nth-child(3n) {
    margin-right: 0;
  }

  .box-right ul li a {
    display: block;
    width: 100%;
    height: 100%;
  }

  .box-right ul li a img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .formItem {
    margin-left: -5px;
  }
}

.container .smallImg {
  width: 127px;
  height: 100%;
  position: relative;
}

.container .close {
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 14px;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  right: -6px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  cursor: pointer;
}

.container .redu-box {
  padding: 0 20px 0 0;
}

.container .redu-inset {
  background: #fff;
}

.container .content {
  margin: 20px 20px 20px 30px;
}

.container .content-s {
  margin: 20px 20px 20px 30px;
}

.content-s .boxs {
  height: 250px;
  margin: 0px 20px 0px 20px;
  border: 1px solid rgb(242, 242, 242);
}

.share-img {
  margin-top: 10px;
}

.container .redu-title {
  height: 30px;
  line-height: 30px;
  color: #000;
  padding-left: 15px;
  background-color:rgb(242, 242, 242); 
}

.box {
  .border {
    float: left;
    border: 1px solid #aeaeae;
    box-sizing: border-box;
    margin-left: 10px;
  }
  .form {
    float: left;
    margin-left: 150px;
  }
}
.container .content-top {
  height: 35px;
  line-height: 35px;
  margin: 30px 20px 0px 20px;
  background-color: rgb(242, 242, 242);
}

.container .box {
  height: 700px;
  border: 1px solid rgb(242, 242, 242);
}

.container .inset-content {
  padding: 40px 0 30px 50px;
  background: #fff;
}

.currentTitle {
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}

.formBtn {
  text-align: center;
  margin-top: 25px;
}

.container .comBtn {
  margin: 0 5px;
}
</style>
