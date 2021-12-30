<template>
  <div class="container">
    <Tabs type="card" closable @on-tab-remove="handleTabRemove">
      <TabPane label="我的账户" v-if="tab0" class="tabStyle">
        <div class="tab-content">
          <div class="content-box">
            <div class="content-title">账号设置</div>
            <div class="content-content">
              <Form :label-width="100">
                <FormItem label="用户名">
                  <Input placeholder="请输入用户名" style="width: 300px;"></Input>
                </FormItem>
                <FormItem label="密码">
                  <Input placeholder="请输入密码" type="password" style="width: 300px;"></Input>
                  <span class="edit">修改</span>
                </FormItem>
              </Form>
            </div>
            <div class="content-title">基础信息</div>
            <div class="content-content">
              <Form :label-width="100">
                <FormItem label="真实姓名">
                  <Input placeholder="请输入姓名" style="width: 300px;"></Input>
                  <span class="edit">修改</span>
                </FormItem>
                <FormItem label="联系方式">
                  <Input placeholder="请输入电话" style="width: 300px;"></Input>
                  <span class="edit">修改</span>
                </FormItem>
                <FormItem label="微信昵称">
                  <Input placeholder="请输入微信昵称" type="password" style="width: 300px;"></Input>
                  <span class="edit">修改</span>
                  <div>仅限微信绑定用户获取</div>
                </FormItem>
                <FormItem label="注册时间">
                  <span>2018-11-24 12:28:47</span>
                </FormItem>
                <FormItem label="上次登录时间">
                  <span>2018-11-24 12:28:47</span>
                </FormItem>
                <FormItem label="上次登陆IP">
                  <span>112.65.137</span>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: "myAccount",
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
.container .tabStyle {
  background: #f3f3f3;
  /* height: 1000px; */
}

.container .tab-content {
  margin: 30px 16px 50px 16px;
  background: #fff;
}

.container .content-box {
  border: 1px solid #aeaeae;
}

.container .content-title {
  height: 50px;
  line-height: 50px;
  background: #2688fb;
  text-indent: 30px;
  color: #fff;
  font-size: 16px;
}

.container .content-content {
  padding: 20px 0 0 80px;
}

.container .edit {
  margin-left: 10px;
}
</style>
