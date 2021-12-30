<template>
  <div class="login-container" :style="{backgroundImage:'url('+bg+')'}">
    <div class="formcard">
      <div>后台管理系统</div>
      <div>
        <Form ref="loginForm" :model="loginForm" :rules="loginRules">
          <FormItem prop="userName">
            <Input v-model="loginForm.userName" placeholder="请输入用户名">
            <span slot="prepend">
              <Icon :size="16" type="ios-person"></Icon>
            </span>
            </Input>
          </FormItem>

          <FormItem prop="password">
            <Input type="password" @keyup.native.enter="handleSubmit('loginForm')" v-model="loginForm.password"
              placeholder="请输入密码">
            <span slot="prepend">
              <Icon :size="14" type="md-lock"></Icon>
            </span>
            </Input>
          </FormItem>
        </Form>
        <Button class="logintn" @click="handleSubmit('loginForm')" type="primary" long>登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '@/router/router.js'
  import store from "@/store";
  import jwt from "@/api/request/jwt.js";
  import system from '@/api/request/system'
  import Bg from "@/assets/images/login.jpg";

  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          userName: "",
          password: ""
        },
        loginRules: {
          userName: [{
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }]
        },
        bg: ""
      };
    },
    created() {
      this.bg = Bg;
    },
    methods: {
      handleSubmit: function (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.$Loading.start();
            this.$store
              .dispatch("user/login", this.loginForm)
              .then(res => {
                this.searchMenusfuc()
              })
          }
        });
      },
      searchMenusfuc: function () {
        jwt.searchMenus({
            token: store.getters.token,
            tenantId: store.getters.tenantId
          })
          .then(res => {
            if (res.code == 0) {
              this.getRouterData(res.data)
            } else {
              this.$Loading.error();
              this.$Message.error(res.msg)
            }
          })
      },
      getRouterData: function (data) {
        let arr = [-2]
        for (let i in data) {
          arr.push(data[i].menuId)
        }
        this.routedata = arr
        this.$store.dispatch("user/loginRole", this.routedata).then(res => {
          this.$Loading.finish();
          this.goLink()
        }).catch(err => {
          console.log(err);
        });
      },
      goLink: function () {
        let pathStr = ""
        for (let i = 0; i < router.options.routes.length; i++) {
          let routerkey = router.options.routes[i].meta.roles
          let routerkeyName = router.options.routes[i].name
          if (this.routedata.includes(routerkey * 1) && routerkeyName != "templateComponents" && routerkeyName != "login" && routerkeyName != "noaccess") {
            pathStr = router.options.routes[i].path
            break;
          }
        }
        this.$router.push({
          path: pathStr
        });
      },
    },
  }; 

</script>

<style scoped>
  .login-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-size: cover;
    background-position: center;
  }

  .formcard {
    position: absolute;
    top: 25%;
    right: 150px;
    width: 360px;
    height: 275px;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 30px;
    border-radius: 5px;
  }

  .formcard>div:nth-child(1) {
    text-align: center;
    margin-bottom: 20px;
    font-weight: 600;
    color: #ffffff;
    font-size: 20px;
  }

  .logintn {
    background-color: rgb(213, 27, 81);
    border-color: rgb(213, 27, 81);
  }

  .logintn:hover {
    opacity: 0.9;
  }

</style>
