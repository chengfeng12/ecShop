<template>
  <div class="container">
    <Tabs type="card" closable @on-tab-remove="handleTabRemove">
      <!-- 添加品牌 -->
      <TabPane label="添加品牌" class="tab" v-if="tab0">
        <div class="add-box">
          <div class="add-title">添加新品牌</div>
          <div class="add-content">
            <Form label-position="left" :label-width="100" class="form-style">
              <FormItem label="品牌名称">
                <Input style="width:350px;"></Input>
              </FormItem>
              <FormItem label="品牌联系人">
                <Input style="width:350px;"></Input>
                <span class="edit">修改</span>
              </FormItem>
              <FormItem label="联系方式">
                <Input style="width:350px;"></Input>
                <span class="edit">修改</span>
              </FormItem>
              <FormItem label="品牌标识">
                <Button type="primary">+选择图片</Button>
                <div class="img-box">
                  <span class="close">X</span>
                </div>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="subBtn">
          <Button type="primary" class="comBtn">保存</Button>
          <Button type="default" class="comBtn">取消</Button>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: "brand",
  data() {
    return {
      tab0: true
    };
  },
  methods: {
    handleTabRemove(name) {
      this["tab" + name] = false;
    }
  }
};
</script>
<style scoped>
.container {
  padding: 0 20px;
}

.container .tab {
  border: 1px solid #aeaeae;
  background: #f3f3f3;
  padding-bottom: 100px;
}

.container .add-box {
  border: 1px solid #aeaeae;
  margin: 30px 20px 0 20px;
  box-sizing: border-box;
  background: #fff;
}

.container .add-title {
  color: #fff;
  height: 50px;
  line-height: 50px;
  background: #2688fb;
  text-indent: 20px;
  font-size: 16px;
}

.container .form-style {
  margin: 50px 0 0 50px;
  width: 500px;
  padding-bottom: 100px;
}

.container .img-box {
  position: relative;
  width: 150px;
  height: 120px;
  border: 1px solid #aeaeae;
  margin-top: 20px;
}

.container .close {
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: #ccc;
  text-align: center;
  right: -10px;
  top: -10px;
  border-radius: 50%;
}

.container .subBtn {
  width: 200px;
  margin: 0 auto;
  text-align: center;
  margin-top: 50px;
}

.container .comBtn {
  margin: 0 10px;
}

.container .edit {
  margin-left: 10px;
}
</style>
