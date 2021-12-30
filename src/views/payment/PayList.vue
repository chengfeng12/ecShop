<template>
  <div class="container">
    <div class="playlist-top">支付列表</div>
    <div class="playlist-content">
      <div class="playlist-inset">
        <!-- 头部 -->
        <div class="header">
          <router-link to="/payTypeDetail">
            <Button type="default" class="comm btn">创建支付方式</Button>
          </router-link>
          <router-link to="/payretrieve">
            <Button type="default" class="comm retrieve">回收站</Button>
          </router-link>
        </div>
        <!-- 支付方式 -->
        <div class="playlist-table">
          <!-- <Table :columns="columns1" :data="data1"></Table> -->
          <div class="pay">
            微信支付
            <Select v-model="model1" class="select">
              <Option
                v-for="item in cityList"
                :value="site.id"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="pay">
            支付宝
            <Select v-model="model2" class="select">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="pay">
            威富通
            <Select v-model="model3" class="select">
              <Option
                v-for="item in cityList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
          <div class="pay">
            余额支付
            <i-switch v-model="switch1" @on-change="change" style="margin-left: 40px;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "paylistshow",
  data() {
    return {
      cityList: [
        {
          value: "开启",
          label: "开启"
        },
        {
          value: "不开启",
          label: "不开启"
        }
      ],
      model1: "",
      model2: "",
      model3: "",
      switch1: false
    };
  },
  methods: {
    change(status) {
      if (status == true) {
        this.$Message.info("已开启");
      } else {
        this.$Message.info("已关闭");
      }
      // this.$Message.info('开关状态：' + status);
    }
  }
};
</script>
<style scoped>
.container {
}

.container .playlist-top {
  height: 60px;
  line-height: 60px;
  background: #fff;
  font-size: 20px;
}

.container .playlist-content {
  padding: 20px;
  background: #f7f7f7;
}

.container .playlist-inset {
  padding: 20px;
  height: 1000px;
  background: #fff;
  border-radius: 5px;
}

.container .header {
  position: relative;
  height: 60px;
}

.container .comm {
  position: absolute;
}

.container .btn {
  top: 0;
  left: 0;
  background: #fb6638;
  color: #fff;
}

.container .retrieve {
  top: 0;
  right: 0;
}

.pay {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  position: relative;
}

.pay .select {
  width: 400px;
  margin-left: 30px;
  position: absolute;
  left: 80px;
  top: 14px;
}
</style>
