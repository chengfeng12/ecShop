<template>
  <keep-alive>
    <router-view ref="child"/>
  </keep-alive>
</template>
<script>
export default {
  name: "ParentView",
  data() {
    return {
      path: ""
    };
  },
  watch: {
    $route(to, from) {
      this.path = from.path;
    }
  }
};
</script>