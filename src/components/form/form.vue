<template>
  <div class="vform">
    <Form ref="formCustom" :model="formCustom" :label-width="40" label-position="left">
      <FormItem label="title" prop="title">
        <Input type="text" v-model="formCustom.title"></Input>
      </FormItem>
      <v-editor @change="editormsg"></v-editor>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
        <Button @click="handleReset('formCustom')" style="margin-left: 8px">清空</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import api from "../../api/mock.js";
import vEditor from "@/components/vEditor/vEditor";
export default {
  name: "Vform",
  components: {
    vEditor
  },
  data() {
    return {
      formCustom: {
        title: "",
        editor: ""
      }
    };
  },
  methods: {
    editormsg: function(data) {
      this.formCustom.editor = data;
    },
    handleSubmit(name) {
      api
        .mockdata("/url/data", {
          title: this.formCustom.title,
          editor: this.formCustom.editor
        })
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style scoped>
.vform {
  width: 650px;
  height: 655px;
}
</style>
