<template>
  <div class="noaccess">
    <div class="noaccess_h1">
      <h1>抱歉您无此页面权限.....</h1>
      <h1><Button @click="goLink">返回首页</Button></h1>
    </div>
  </div>
</template>

<script>
import router from "@/router/router.js";
import { getRouterKey, removeToken } from "@/utils/auth";
export default {
  name: "noaccess",
  data() {
    return {
      routedata: []
    };
  },
  created() {
    console.log(getRouterKey())
    this.routedata = getRouterKey() ? JSON.parse(getRouterKey()) : [];
  },
  methods: {
    goLink: function() {
      // 找到第一个可以进入的页面
      // let pathStr = "";

      // for (let i = 0; i < router.options.routes.length; i++) {
      //   let routerkey = router.options.routes[i].meta.roles;
      //   if (this.routedata.includes(routerkey * 1) && routerkey * 1 != -2) {
      //     pathStr = router.options.routes[i].path;

      //     console.log("路径", pathStr);

      //     break;
      //   }
      // }

      this.$router.push({
        path: "/@/views/content/contentoverview/contentoverview"
      });
    },
  }

};
</script>
<style>
.noaccess {
  width: 100%;
  height: 100%;
  position: relative;
}
.noaccess_h1 {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 20%;
}
</style>

