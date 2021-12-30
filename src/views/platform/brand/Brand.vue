<template>
  <div class="container">
    <Tabs type="card" closable @on-tab-remove="handleTabRemove">
      <!-- 品牌管理 -->
      <TabPane label="品牌管理" class="tab" v-if="tab0">
        <div class="nav">
          <Button type="primary" class="addBtn">添加品牌</Button>
          <Input class="nav-input" placeholder="商品编号/名称/商品标签搜索"/>
          <Button type="primary" class="search">搜索</Button>
        </div>
        <div class="content">
          <!-- 表格  stripe斑马纹-->
          <Table style="margin-right:16px;" stripe border></Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <!-- show-elevator 显示电梯，可以快速切换到某一页 -->
              <Page
                :total="1000"
                :page-size="10"
                :current="1"
                show-elevator   
                show-total
                prev-text="上一页"
                next-text="下一页"
                :page-size-opts="[10]"
                style="margin-right:16px;"
              ></Page>
            </div>
          </div>
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
}

.container .nav {
  margin-top: 20px;
  padding: 0 10px 20px 10px;
  position: relative;
  border-bottom: 1px solid #aeaeae;
}

.container .nav-input {
  width: 300px;
  margin-left: 30px;
}

.container .search {
  margin-left: 20px;
}

.container .content {
  margin-top: 20px;
  padding: 0 10px;
  height: 1000px;
}
</style>
