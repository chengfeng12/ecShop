<template>
  <div class="letteringServices">
    <div class="letteringServices_tit">刻字服务</div>
    <div class="letteringServices_cont">
      <div class="letteringServices-l">
        <div class="letteringServices-container">
          <img class="letteringServicesbg" :src="tpmfile.url" alt />
          <vue-draggable-resizable
            :class="textdrag"
            :w="100"
            :h="50"
            @dragging="onDrag"
            @resizing="onResize"
            :parent="true"
            :style="{color:textcolor,fontSize: txtfont + 'px'}"
          >{{txtcont}}</vue-draggable-resizable>
        </div>
      </div>
      <div class="letteringServices-r">
        <div>
          <Form :label-width="100">
            <FormItem label="刻字标题">
              <Input></Input>
            </FormItem>
            <FormItem label="top">
              <Input v-model="txttop"></Input>
            </FormItem>
            <FormItem label="left">
              <Input v-model="txtleft"></Input>
            </FormItem>
            <FormItem label="刻字内容">
              <Input v-model="txtcont"></Input>
            </FormItem>
            <FormItem label="颜色选择">
              <ColorPicker v-model="textcolor" />
            </FormItem>
            <FormItem label="文字大小">
              <Input v-model="txtfont">
                <span slot="append">px</span>
              </Input>
            </FormItem>
            <FormItem label="文字显示排版">
              <RadioGroup v-model="textdrag">
                <Radio label="textdraghorizontal">横排</Radio>
                <Radio label="textdragvertical">竖排</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="选择图片">
              <imgSelect @listentoptpmfile="tpmfileshow"></imgSelect>
              <div class="img-temp">
                <div>
                  <img :src="tpmfile.url" alt />
                </div>
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import imgSelect from "@/components/imgSelect/imgselect";
export default {
  name: "letteringServices",
  components: {
    VueDraggableResizable,
    imgSelect
  },
  data() {
    return {
      textcolor: "#000000",
      txttop: 0,
      txtleft: 0,
      txtcont: "文字",
      txtfont: "",
      textdrag: "textdraghorizontal",
      dragwidth: 0,
      dragheight: 0,
      tpmfile: []
    };
  },
  methods: {
    onResize: function(x, y, width, height) {
      this.txtleft = x;
      this.txttop = y;
      this.dragwidth = width;
      this.dragheight = height;
    },
    onDrag: function(x, y) {
      this.txttop = x;
      this.txtleft = y;
    },
    handleSubmit: function(formValidate) {},
    tpmfileshow: function(data) {
      if (data) {
        this.tpmfile = data[0];
        console.log(this.tpmfile);
      } else {
      }
    }
  }
};
</script>
<style scoped>
.letteringServices {
  width: 100%;
}
.letteringServices .letteringServices_tit {
  width: 100%;
}
.letteringServices .letteringServices_cont {
  width: 100%;
  overflow: hidden;
  cursor: pointer;
}
.letteringServices .letteringServices_cont > div {
  float: left;
}
.letteringServices .letteringServices_cont > .letteringServices-l {
  width: 40%;
  min-height: 500px;
}
.letteringServices .letteringServices_cont > .letteringServices-r {
  width: 40%;
  min-height: 700px;
}
.letteringServices-container {
  width: 350px;
  height: 450px;
  background-color: #dbdbdb;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
}
.letteringServices-container img {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: block;
}
.textdraghorizontal {
  width: 100px;
  height: 50px;
  position: absolute;
  left: 0;
  top: 0;
}
.textdragvertical {
  width: 50px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  transform: rotate(90deg);
}
.img-temp {
  margin-top: 15px;
  overflow: hidden;
}
.img-temp > div {
  width: 110px;
  height: 80px;
  float: left;
  margin-left: 5px;
  position: relative;
}
.img-temp div img {
  width: 110px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
