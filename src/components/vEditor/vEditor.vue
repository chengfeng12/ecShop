<template>
  <div class="veditor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>
<script>
import api from "../../api/mock.js";
import E from "wangeditor";

export default {
  name: "vEditor",
  data() {
    return {
      uploadPath: "",
      editor: null,
      info_: null
    };
  },
  props:['value'],
  watch:{
    value(){
      console.log(this.value)
      this.editor.txt.html(this.value);
    }
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = this.uploadPath; // 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "files"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          for (let i = 0; i < result.data.length; i++) {
            var url = result.data[i].url;
            insertImg(url);
          }
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info = html;
        console.log(this.info)
        this.$emit("change", this.info);
      };
      this.editor.create();
    }
  }
};
</script>
<style scoped>
.veditor {
  width: 100%;
  height: 540px;
}
.veditor .text {
  z-index: 1 !important;
}
.veditor .toolbar .w-e-menu {
  z-index: 1 !important;
}
.text {
  border: 1px solid #ccc;
  height: 500px;
}
.toolbar {
  border: 1px solid #ccc;
  border-bottom: none;
}
</style>
