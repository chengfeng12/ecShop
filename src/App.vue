<template>
  <div id="app">
    <div class="loading" v-if="!isRouterAlive">
      <Spin fix>
        <Icon type="ios-loading" size=25 class="icon-load"></Icon>
        <div>加载中</div>
      </Spin>
    </div>
    <keep-alive>
      <router-view v-if="isRouterAlive"/>
    </keep-alive>
  </div>
</template>
<style>
  #app {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .loading{
    width:100%;
    height:100%;
    position: fixed;
    top:0px;
    left:0px;
    z-index:9999;
    background: rgba(0,0,0,0.3);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .icon-load{
      animation: ani-spin 1s linear infinite;
  }
  @keyframes ani-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  html {
    width: 100%;
    height: 100%;
  }

  body {
    width: 100%;
    height: 100%;
  }

</style>
<script>
  import {
    getRouterKey,
    removeToken
  } from '@/utils/auth'
  import store from "@/store";
  export default {
    created() {
      this.$Loading.config({
        height: 5,
        failedColor: '#f0ad4e',
      });

      localStorage.getItem("sidebar") &&
        this.$store.replaceState(
          Object.assign(
            this.$store.state,
            JSON.parse(localStorage.getItem("sidebar"))
          )
        );
    },
    data(){
      return {
        isRouterAlive:true,
        isRefresh:false
      }
    },
    methods: {
      fetchData: function () {
        let RouterKey = getRouterKey() ? JSON.parse(getRouterKey()) : [-2]

        console.log(this.$route.meta.roles)

        if (RouterKey.includes(+this.$route.meta.roles)) {

        } else {
          this.$router.push({
            path: '/@/views/noaccess/noaccess'
          })
        }
      },
      refresh(){
        this.isRouterAlive = false
        setTimeout(() => {
          // 强制重新渲染
          this.isRefresh = true
          this.isRouterAlive = true
          this.$router.go(0)
        },1000)
      }
    },
    watch: {
      $route(to,from){
        console.log(to,from)
        if(from.name == 'login' && to.name != 'login'){
          this.refresh()
        }else{
          this.fetchData()
        }
      }

    }
  };

</script>
