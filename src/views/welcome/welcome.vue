<template>
  <div class="welcome">
      <h1><Button @click="synchronizationfuc" type="primary">同步路由</Button></h1>
  </div>
</template>

<script>

import router from '@/router/router.js'
export default {
    name: "welcome",
    
    data(){
        return {
            routedata:[]
        }
    },

    created(){

    },
    
    methods:{
        synchronizationfuc:function(){  
            console.log(router.options.routes)
        }
    },   
};
</script>
<style>
.welcome{
    width: 100%;
}
</style>

