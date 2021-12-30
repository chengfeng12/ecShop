<template>
  <div class="container">
    <imgSelect ref="imgselect" :options="imgOptions" v-on:listentoptpmfile="changeImg"></imgSelect>
    <div>
      <!-- 上传盒子 -->
      <div class="upload-box">
        <!-- 左边盒子 -->
        <div class="upload-lf">
          <div
            class="large-img"
            style="text-align:center;line-height:400px;"
            v-if="!sampleUpload.inputImg"
          >请选择图片</div>
          <div v-else style="position:relative;">
            <vue-draggable-resizable :x="x" :y="y" :w="width" :h="height" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true" v-if="textShow">
              <span :style="{color:sampleUpload.writeColor,fontSize:sampleUpload.writeSize + 'px',writingMode:sampleUpload.writeShow == '1' ? 'lr-tb':'tb-rl'}">文字</span>    
            </vue-draggable-resizable>
            <img class="large-img" :src="sampleUpload.inputImg">
          </div>
        </div>
        <!-- 右边盒子 -->
        <div class="upload-rt clearfix">
          <Form ref="sampleUpload" :model="sampleUpload" :rules="ruleUpload" :label-width="80">
            <FormItem label="刻字标题" prop="input" :label-width="150">
              <Input
                v-model="sampleUpload.input"
                placeholder="请输入内容"
                autofocus
                :maxlength="20"
                style="width: 200px;"
              ></Input>
            </FormItem>
            <FormItem label="图片预览" prop="img" :label-width="150">
              <Input
                v-model="sampleUpload.inputImg"
                placeholder="请输入图片地址"
                disabled
                style="width: 200px;"
              ></Input>
              <Button type="primary" @click="openImg" style="margin-left:20px;">+添加图片</Button>
            </FormItem>
            <FormItem :label-width="150">
              <div class="smallImg" v-if="sampleUpload.inputImg">
                <span class="close" @click="handleClose">X</span>
                <img style="width:100%;height:100%;" :src="sampleUpload.inputImg">
              </div>
            </FormItem>
            <FormItem label="刻字内容" :label-width="150">
              <Button :type="textShow ? 'primary' : 'default'" style="cursor:pointer" @click="showText">文字</Button>
            </FormItem>
            <FormItem label="文字颜色 " :label-width="150" v-model="sampleUpload.writeColor">
              <ColorPicker v-model="sampleUpload.writeColor" hue alpha/>
            </FormItem>
            <FormItem label="文字大小" :label-width="150">
              <Input
                v-model="sampleUpload.writeSize"
                placeholder="像素"
                autofocus
                :maxlength="5"
                style="width: 50px;"
              ></Input>&nbsp;&nbsp;&nbsp;&nbsp;px
            </FormItem>
            <FormItem label="文字显示排版" :label-width="150">
              <RadioGroup v-model="sampleUpload.writeShow" @on-change="changeWirteShow">
                <Radio label="1">横排</Radio>
                <Radio label="2">竖排</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <!-- 保存 取消 -->
    <div class="formBtn">
      <Button type="primary" size="large" class="btnStyle" :loading="loading" @click="save">保存</Button>
      <Button type="default" size="large" class="btnStyle" @click="back">返回</Button>
    </div>
  </div>
</template>
<script>
// import imgSelect from "@/components/imgSelect/imgSelect";
import imgSelect from "@/components/imgSelect/imgSelect";
import vEditor from "@/components/vEditor/vEditor";
import operation from "@/api/request/operation";
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
export default {
  name: "operation",
  components: {
    vEditor,
    imgSelect,
    VueDraggableResizable
  },
  data() {
    return {
      loading:false,
      width: 200,
      height: 70,
      x: 0,
      y: 0,
      img: "",
      id:"1",
      role:'1',
      createTime: "",
      title: "",
      show: true,
      close: true,
      textShow:false,
      //选项卡1-刻字服务输入数据
      engravingService: {
        title: "",
        cost: "",
        single: true,
        fullyuan: "",
        content: "",
        desc: "",
        symbolTitle: "",
        symbolDesc: "",
        MessageBox: ""
      },
      //刻字服务规则验证
      ruleService: {
        title: [
          {
            required: true,
            message: "刻字标题不能为空",
            trigger: "blur"
          }
        ]
      },

      imgOptions: {
        type: "image",
        mode: "diy"
      },

      //样图上传数据
      sampleUpload: {
        inputImg:"",
        input:"",
        content: "",
        writeColor: "#289ffa",
        writeSize: "12",
        writeShow: "1",
      },
      //样图上传验证
      ruleUpload: {
        input: [
          {
            required: true,
            message: "刻字标题不能为空",
            trigger: "blur"
          }
        ],
        inputImg: [
          {
            required: true,
            message: "图片地址不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      let _this = this;
      let id = this.$route.query.id;
      let role = this.$route.query.role;
      this.id = id;
      this.role = role;
      if (role == 2) {
        this.edit();
      }
    },
    // 显示文字
    showText(){
      if(this.sampleUpload.inputImg){
        this.textShow = !this.textShow
      }else{
        this.$Message.error('请上传图片')
      }
    },
    changeWirteShow(e){
      let width = this.width
      let height = this.height
      this.width = height
      this.height = width
    },
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
    },
      //编辑
    edit() {
      operation
        .getDetailLegend({
          id: this.id
        })
        .then((res) => {
          let sampleUpload = {
            id:res.data.id,
            inputImg: res.data.img,
            input: res.data.title,
            writeColor: res.data.writeColor,
            writeSize: res.data.writeSize,
            writeShow: res.data.writeShow + ''
          }
          this.sampleUpload = sampleUpload
          let position = res.data.position
          if(position){
            position = JSON.parse(position)
            this.textShow = position.textShow
            this.x = position.x
            this.y = position.y
            this.width = position.width
            this.height = position.height
          }
        })
    },
  
    //刻字服务保存
    save() {
      let _this = this;
    
      this.$refs.sampleUpload.validate(valid => {
        if (valid) {
          // 位置信息
          let position =  {
              x:this.x,
              y:this.y,
              width:this.width,
              height:this.height,
              textShow:this.textShow
            }
          position = JSON.stringify(position)
          // 创建
          if (_this.role == 1) {
            _this.loading=true;
            operation
              .getInsertLegend({
                id:_this.sampleUpload.id,
                img: _this.sampleUpload.inputImg,
                title: _this.sampleUpload.input,
                content: _this.sampleUpload.content,
                writeColor: _this.sampleUpload.writeColor,
                writeSize: _this.sampleUpload.writeSize,
                writeShow: _this.sampleUpload.writeShow,
                position:position
              })
              .then(res => {
                console.log(res);
                if (res.code == "1") {
                  this.$Message.success("保存成功");
                   _this.loading=false;
                  this.back();
                } else {
                  _this.loading=false;
                  this.$Message.error(res.message);
                }
              })
              .catch(err => {
                this.$Message.error("请求失败");
              });
          } else {
            // 修改
            _this.loading=true;
            operation
              .getUpdateLegend({
                id: _this.id,
                img: _this.sampleUpload.inputImg,
                title: _this.sampleUpload.input,
                content: _this.sampleUpload.content,
                writeColor: _this.sampleUpload.writeColor,
                writeSize: _this.sampleUpload.writeSize,
                writeShow: _this.sampleUpload.writeShow,
                position:position
              })
              .then(res => {
                console.log(res);
                if (res.code == "1") {
                  this.loading=false;
                  this.$Message.success("保存成功");
                  this.back();
                } else {
                  this.loading=false;
                  this.$Message.error(res.message);
                }
              })
              .catch(err => {
                this.loading=false;
                this.$Message.error("请求失败");
              });
          }
        }
      });
    },
    //返回
    back() {
      this.$router.go(-1);
    },

    // 打开图片
    openImg() {
      this.$refs.imgselect.uploadflg();
    },
    // 监听图片选择的事件
    changeImg(img) {
      console.log(img);
      this.sampleUpload.inputImg = img[0].imgAddress;
    },
    //table移除
    remove(index) {
      this.data1.splice(index, 1);
    },
    //切换显示隐藏
    toggleClick() {
      this.show = !this.show;
    },
    //关闭小图
    handleClose() {
      this.close = false;
    },
    fetchData(){
      this.sampleUpload.inputImg="",
      this.sampleUpload.input="",
      this.sampleUpload.content="",
      this.sampleUpload.writeColor="#289ffa",
      this.sampleUpload.content="12",
      this.sampleUpload.content="1"
    }
  },
  watch: {
    $route: "fetchData"
  }
};
</script>
<style scoped>
.container .upload-box {
  width: 100%;
  background: #fff;
  height: 700px;
  position: relative;
  padding: 80px 350px 0 80px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.container .upload-lf {
}
 
.container .large-img {
  display: block;
  width: 400px;
  height: 400px;
  border: 1px solid #aeaeae;
}

.container .upload-rt {
}

.container .smallImg {
  width: 100px;
  height: 100px;
  border: 1px solid #aeaeae;
  position: relative;
}

.container .close {
  width: 15px;
  height: 15px;
  line-height: 15px;
  font-size: 6px;
  border: 1px solid #aeaeae;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  right: -6px;
  text-align: center;
  background: #333;
  color: #fff;
}

.container .formBtn {
  width: 600px;
  margin: 0 auto;
  text-align: center;
  margin-top: 50px;
}

.container .btnStyle {
  margin: 0 10px;
}
</style>
