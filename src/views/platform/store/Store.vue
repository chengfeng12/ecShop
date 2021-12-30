


<template>
  <div class="container">
    <Tabs type="card">
      <TabPane label="品牌管理" class="tab">
        <div class="nav">
          <Button type="primary" class="addBtn">添加品牌</Button>
          <Select v-model="model1" class="select">
            <Option v-for="item in store" :value="item.value" :key="item.value"></Option>
          </Select>
          <Input class="nav-input" placeholder="输入品牌/店铺名称搜索"/>
          <Button type="primary" class="search">搜索</Button>
        </div>
        <div class="content">
          <div class="store-box">
            <div
              class="store-item"
              v-for="(item, index) in tabs"
              @mouseenter="isHide(index)"
              @mouseleave="showUpdate = -1"
            >
              <div class="img-box">
                <img src="http://pic30.nipic.com/20130605/12949204_213054651194_2.jpg" alt>
              </div>
              <div class="con-desc">
                <p class="con-text">品 牌 | {{tabs[index].title}}</p>
                <p class="con-text">店 铺 | {{tabs[index].shop}}</p>
                <p class="con-text">类 型 | {{tabs[index].type}}</p>
                <p class="con-text">状 态 | {{tabs[index].state}}</p>
              </div>
              <div class="mask" v-show="showUpdate == index">
                <router-link to>进入店铺 ></router-link>
                <div class="mask-ico">
                  <Icon type="ios-trash-outline clearfix"/>
                  <Icon type="ios-remove-circle-outline clearfix"/>
                  <router-link to="/editStore">
                    <Icon type="ios-open-outline clearfix"/>
                  </router-link>
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
export default {
  name: "store",
  data() {
    return {
      showUpdate: -1,
      tabs: [
        {
          title: "植村秀",
          shop: "植村秀官方商城",
          type: "微信小程序",
          state: "未启用"
        },
        {
          title: "植村秀",
          shop: "植村秀官方商城",
          type: "微信小程序",
          state: "未启用"
        },
        {
          title: "植村秀",
          shop: "植村秀官方商城",
          type: "微信小程序",
          state: "未启用"
        },
        {
          title: "植村秀",
          shop: "植村秀官方商城",
          type: "微信小程序",
          state: "未启用"
        }
      ],
      store: [
        {
          value: "店铺类型"
        },
        {
          value: "微信小程序"
        }
      ],
      model1: ""
    };
  },
  methods: {
    isHide(index) {
      console.log(index);
      this.showUpdate = index;
    }
  }
};
</script>
<style scoped>
.ivu-icon {
  float: right !important;
  padding: 0 5px;
}

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

.container .addBtn {
  /* position: absolute; */
}

.container .select {
  width: 300px;
  margin-left: 20px;
}

.container .nav-input {
  width: 300px;
  margin-left: 30px;
  /* position: absolute; */
}

.container .search {
  margin-left: 20px;
}

.container .content {
  margin-top: 20px;
  padding: 0 10px;
  height: 1000px;
}

.container .store-box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.container .store-item {
  position: relative;
  background: #fff;
  width: 200px;
  height: 200px;
  border: 1px solid #aeaeae;
  margin: 10px;
  /* flex: 1 1 auto; */
}

.container .img-box {
  width: 100%;
  height: 80px;
}

.container .img-box img {
  width: 100%;
  height: 100%;
}

.container .con-desc {
  padding: 30px 0 0 15px;
}

.container .con-text {
  height: 20px;
  line-height: 20px;
}

.container .mask {
  /* display: none; */
  position: absolute;
  z-index: 99;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  opacity: 0.5;
  color: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 200px;
}

.container .mask-ico {
  position: absolute;
  width: 200px;
  height: 20px;
  right: 0;
  bottom: 10px;
  font-size: 26px;
}
</style>
