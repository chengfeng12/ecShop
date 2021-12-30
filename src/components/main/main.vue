<template>
  <div class="main">
    <Layout>
      <Header>
        <div class="header">
          <div class="log">
            <Icon class="iconfont icon-arvato-logo-black" style="font-size:36px"/>
          </div>
          <router-link
            class="header-item"
            v-for="item in routesmap"
            :name="item.name"
            :key="item.name"
            @click.native="menulfuc(item)"    
            :to="item.path"
            tag="div"
            :data-url="item.path"
          >
          <!-- :to="item.children[0].path" -->
            <div>
              {{item.meta.title}}</div>
          </router-link>

          <div class="header_right">
            <Dropdown>
              <a href="javascript:void(0)">
                Arvato商城
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem>品牌切换</DropdownItem>
                <DropdownItem>权限管理</DropdownItem>
                <DropdownItem>返回系统</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div class="login_exit">
              <div @click.stop="modelShowfuc">退出</div>
            </div>
          </div>
        </div>
      </Header>
      <Layout class="main-container">
        <Sider v-show="siderflg" style="width:155px;min-width: 155px;max-width: 155px;flex: 0 0 155px;">
          <keep-alive>
            <es-menu :childrenroutemsg="menul"></es-menu>
          </keep-alive>
        </Sider>
        <Layout>
          <Content class="main-content">
            <router-view/>
          </Content>
        </Layout>
      </Layout>
    </Layout>

    <Modal v-model="modelShow" width="360" footer-hide>
        <div slot="header" style="text-align:center;height: 33px;line-height: 33px;">
            <span style="color:#0083b0;font-size:30px;"><Icon type="ios-information-circle"></Icon></span>
            
            <span style="font-size:14px;">是否确认退出系统</span>
        </div>
        <div style="text-align:center">
            <div>
              <Button @click="logoutCancel">取消</Button> <Button @click="logout" type="primary">确认</Button>
            </div>
        </div>
    </Modal>

  </div>
</template>
<script>
import {getRouterKey,removeToken} from '@/utils/auth'
import esMenu from "./components/sidebar";
export default {
  name: "Main",
  components: {
    esMenu
  },
  data() {
    return {
      modelShow:false,
      theme: "light",
      menul: [],
      routesmap: [],
      siderflg: false,
      roleskey:[]
    };
  },
  methods: {

    menulfuc(item) {
      let roleskey = getRouterKey()

      let newMap=[]
      item.children.map((v,i) => {
        JSON.parse(roleskey).map((vi,ii) =>{
          
          if(v.meta.roles == vi){
            newMap.push(v)
          }
        })
      })

      newMap = [...new Set(newMap)]

      this.menul = newMap;

      this.$forceUpdate()

      localStorage.setItem("sidebar",JSON.stringify(newMap))

      let newLink

      for (let i = 0; i < newMap.length; i++) {
        if(roleskey.includes(newMap[i].meta.roles)){
          if(newMap[i].hasOwnProperty('children')){
            let newChildren = newMap[i].children
            for (let j = 0; j < newChildren.length; j++) {
              if(roleskey.includes(newChildren[j].meta.roles)){
                newLink = newChildren[j].path
                break;
              }
            }
          }else{
            newLink = newMap[i].path
            break;
          }
        }
        if(newLink){
          break;
        }
      }

      this.$router.push({
          path: newLink
      });
    },

    logoutCancel:function(){
      this.modelShow=false
    },

    modelShowfuc:function(){
      this.modelShow=true
    },

    // 注销
    logout(){
      this.modelShow=false

      removeToken()
      
      localStorage.clear()
      
      this.$router.push('/')
    },

    // 处理路由
    calRouter(){
      let roleskey = getRouterKey()
    
      let routesmap = this.$router.options.routes;

      console.log(roleskey,routesmap)
      
      let newsidebar

      let newMap = []

      let newRolesKey = roleskey ? JSON.parse(roleskey) : []

      routesmap.map((v,i) => {

        // 同理 此处循环不正确
        newRolesKey.map((vi,ii) =>{
          if(v.meta.roles == vi){
            newMap.push(v)
          }
        })
      })
      
      newMap = [...new Set(newMap)]

      console.log('1newMap',newMap)

      let newMaps = []
      newMap.map((v,i) => {
        if (v.name != "templateComponents" && v.name != "login" && v.name != "noaccess") {
          newMaps.push(v)
        }
      })

      console.log('2newMap',newMap)

      this.routesmap = newMaps
      
      // 处理已选择的以及导航栏
      let originUrl = window.location.href.split('#')[1]
      let redirectUrl = this.$router.history.current.redirectedFrom || originUrl

      console.log('3newMaps',redirectUrl,newMaps)

      newMaps.map((v,i) => {
        if(v.path == redirectUrl){
          this.menulfuc(v)
          newsidebar = v.children
        }
      })

      this.siderflg = true;
    }

  },
  created() {
    this.calRouter()
  },
  watch:{
    '$route'(to,from){
      this.calRouter()
    }
  }
};
</script>
<style scoped>
.log {
  width: 155px;
  float: left;
  text-align: center;
}
a {
  color: #0083b0;
}
.header {
  width: 100%;
  height: 64px;
  line-height: 64px;
  cursor: pointer;
  min-width: 1150px;
  background-color: #fff;
  color: #0083b0;
  font-size: 14px;
  font-weight: bold;
}
.ivu-layout-header {
  padding: 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.8);
  background: #f8fbfb;
}
.header > div {
  float: left;
}
.header-item {
  height: 60px;
  line-height: 60px;
  padding: 0 24px;
  font-size: 14px;
}
.header > .header_right {
  float: right;
}
.login_exit {
  float: right;
  padding: 0 20px;
}

.main {
  height: 100%;
  width: 100%;
  min-width: 1200px;
  background-color: #0083b0;
}
.main-container {
  height: 100%;
}
.main .ivu-layout-sider {
  height: 100%;
  background-color: #0083b0;
  position: relative;
  z-index: 1;
}
.main .ivu-layout {
  height: 98%;
  background-color: #f8fbfb;
}
.main-content {
  padding: 24px;
  overflow-y: scroll;
  background-color: #f8fbfb;
  border-top-left-radius: 5px;
}

.router-link-active{
  position: relative;
}
.router-link-active:after{
  content:'';
  width:80%;
  height:4px;
  background: #0083b0;
  position: absolute;
  bottom:0px;
  left:50%;
  margin-left:-40%;
}
</style>
