<template>
  <div class="user">
    <div class="currentTitle">用户管理</div>
    <Card :bordered="false">
      <div slot="title">
        <div class="search-div">
          <div class="search-input">
            <div class="search-input-div">
              <div class="search-input-item">
                <span class="user-span">用户名</span>
                <Input size="small" v-model="usernamekey" style="width:220px" placeholder="请输入用户名" />
              </div>
              <div class="search-input-item">
                <span class="user-span">姓名</span>
                <Input size="small" v-model="namekey" style="width:220px" placeholder="姓名" />
              </div>
              <div class="search-input-item">
                <span class="user-span">手机号码</span>
                <Input size="small" v-model="mobilekey" style="width:220px" placeholder="手机号码" />
              </div>
            </div>

            <div class="search-input-div">
              <div class="search-input-item">
                <span class="user-span">性别</span>
                <Select size="small" v-model="sexkey" style="width:220px" placeholder="性别">
                  <Option value="-1">全部</Option>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                  <Option value="3">未知</Option>
                </Select>
              </div>
              <div class="search-input-item">
                <span class="user-span">状态</span>
                <Select size="small" v-model="statuskey" style="width:220px" placeholder="状态">
                  <Option value="-1">全部</Option>
                  <Option value="0">未锁定</Option>
                  <Option value="1">锁定</Option>
                </Select>
              </div>
            </div>
          </div>
          <div class="search-btn">
            <Button type="primary" size="small" @click="search" icon="ios-search">搜索</Button>
            <Button
              v-if="hasRole(70101)"
              type="primary"
              size="small"
              @click="adduser(2)"
              icon="md-add"
            >添加新用户</Button>
          </div>
        </div>
      </div>
      <div>
        <Table :columns="columnData" :data="usertabledata" stripe border></Table>
        <div class="useraction clear">
          <div class="useraction_r">
            <Page
            :total="total"
            :page-size="size"
            show-sizer
            :page-size-opts="[10,15,20]"
            @on-page-size-change="pageSizeFun"
            :current="current"
            :show-elevator="true"
            :show-total="true"
            @on-change="changePage"
            />
          </div>
        </div>
      </div>
    </Card>

    <Modal
      width="600px"
      v-model="usershow"
      @on-ok="assignRolefuc"
      @on-cancel="onCancelrole"
      :closable="false"
      title="分配角色"
    >
      <div class="usershow">
        <div>
          <div style="margin-left:10px">
            <RadioGroup vertical v-model="checkAllGroup">
              <Radio v-for="(item, index) in treedata" :key="index" :label="item.id">{{item.name}}</Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Modal>

    <Modal width="500px" v-model="psdshow" title="设置密码" :closable="false" footer-hide>
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
        <FormItem label="密码" :label-width="80" prop="passwd">
          <Input type="password" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem label="确认密码" :label-width="80" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck"></Input>
        </FormItem>
        <FormItem style="text-align: right">
          <Button style="margin-left: 8px" @click="cancel">取消</Button>
          <Button type="primary" @click="resetPassword('formCustom')">确认</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 确认删除弹窗 -->
    <Modal v-model="deleteflg" width="360" footer-hide>
      <p slot="header" style="text-align:left">
        <span>确认删除此用户吗</span>
      </p>
      <p style="text-align:right">
        <Button size="large" @click="cancelDelete">取消</Button>
        <Button size="large" type="primary" @click="deleteUserfuc">确定</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import store from "@/store";
import system from "@/api/request/system";
export default {
  name: "usermanagement",

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };

    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("两次密码不同"));
      } else {
        callback();
      }
    };

    return {
      deleteflg: false,

      indeterminate: true,

      checkAllGroup: "",
      // 角色树
      treedata: [],

      // 页码
      current: 1,
      // 分配角色
      usershow: false,
      // 重置密码
      psdshow: false,

      total: 0,
      size: 10,
      // 选中项的
      id: "",
      // 搜索相关
      usernamekey: "",
      // 姓名
      namekey: "",
      //性别
      sexkey: "",
      // 手机号
      mobilekey: "",
      // 状态
      statuskey: "",

      columnData: [
        {
          title: "用户名",
          align: "center",
          key: "username"
        },
        {
          title: "姓名",
          align: "center",
          key: "name"
        },
        {
          title: "手机号码",
          align: "center",
          key: "mobile"
        },
        {
          title: "性别",
          width: 70,
          align: "center",
          key: "sex"
        },
        {
          title: "创建时间",
          align: "center",
          key: "createDate"
        },
        {
          title: "状态",
          align: "center",
          width: 80,
          key: "status",
          render: (h, params) => {
            console.log(params);
            let status = params.row.status;
            return h("div", [
              h(
                "span",
                {
                  style: {}
                },
                status == 1 ? "锁定" : "未锁定"
              )
            ]);
          }
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          width: 300,
          render: (h, params) => {
            let status = params.row.status == 0 ? 1 : 0;
            let username = params.row.username;
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "div",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0083b0"
                }
              },
              [
                h(
                  "div",
                  {
                    class: "cursoruser userBtn",

                    style:{
                      'display': this.hasRole(70106) ?'block':'none',
                    },

                    on: {
                      click: () => {
                        this.updateStatusfuc(status, params.row.username);
                      }
                    }
                  },
                  status == 1 ? "锁定" : "启用"
                ),

                h(
                  "div",
                  {
                    class: "cursoruser userBtn",
                    style: {
                      display: this.hasRole(70102) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.edituser(params.row.id, 1);
                      }
                    }
                  },
                  "编辑"
                ),

                h(
                  "div",
                  {
                    class: "cursoruser userBtn",
                    style: {
                      display: this.hasRole(70103) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.userManage(params.row.id);
                      }
                    }
                  },
                  "角色分配"
                ),

                h(
                  "div",
                  {
                    class: "cursoruser userBtn",
                    style: {
                      display: this.hasRole(70104) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.changepsdfuc(params.row.id);
                      }
                    }
                  },
                  "重置密码"
                ),

                h(
                  "div",
                  {
                    class: "cursoruser",
                    style: {
                      display: this.hasRole(70105) ? "block" : "none"
                    },
                    on: {
                      click: () => {
                        this.deletefuc(params.row.id);
                      }
                    }
                  },
                  "删除"
                )
              ]
            );
          }
        }
      ],
      usertabledata: [],
      // 角色
      userdata: [
        {
          title: "全选",
          expand: true,
          children: []
        }
      ],
      //修改密码
      formCustom: {
        passwd: "",
        passwdCheck: ""
      },
      // 密码验证
      ruleCustom: {
        passwd: [
          { validator: validatePass, trigger: "blur" },
          {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{15,30}$/,
            message: "请输入一个正确的密码格式，15到30位，数字和字母组合",
            trigger: "blur"
          }
        ],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }]
      }
    };
  },

  created() {
    this.getUserdata();
  },

  methods: {
    //获取数据默认第一页

    getUserdata() {
      console.log(store.getters.tenantId);
      console.log(store.getters.db);

      system
        .getUserByPage({
          token: store.getters.token,

          tenantId: store.getters.tenantId,

          db: store.getters.db,

          current: this.current,

          username: this.usernamekey,

          name: this.namekey,

          sex: this.sexkey,

          mobile: this.mobilekey,

          status: this.statuskey,

          size: this.size
        })
        .then(res => {
          this.total = res.total;

          this.usertabledata = res.rows;
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 显示确定删除弹窗
    deletefuc: function(id) {
      this.deleteflg = true;
      this.id = id;
    },
    // 用户状态
    updateStatusfuc: function(status, username) {
      system
        .updatestatus({
          status: String(status),
          username: username
        })
        .then(res => {
          console.log(res);
          this.getUserdata();
        })
        .catch(error => {
          console.log(error);
        });
    },

    cancelDelete: function() {
      this.deleteflg = false;
      this.id = "";
    },

    // 取消更改密码
    cancel: function() {
      this.psdshow = false;
      this.$refs.formCustom.resetFields();
    },

    // 重置密码
    resetPassword: function(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          system
            .resetPsd({
              id: this.id,
              password: this.formCustom.passwd
            })
            .then(res => {
              (this.id = ""), this.getUserdata(), (this.psdshow = false);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },

    // 更改密码
    changepsdfuc: function(id) {
      this.psdshow = true;
      this.id = id;
    },

    // 删除用户
    deleteUserfuc: function() {
      system
        .deleteUser({
          id: this.id
        })
        .then(res => {
          this.id = "";
          this.getUserdata();
          this.deleteflg = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 添加用户
    adduser: function(role) {
      this.$router.push({
        path: "/@/views/system/adduser",
        query: {
          role: role
        }
      });
    },

    //  编辑用户
    edituser: function(id, role) {
      this.$router.push({
        path: "/@/views/system/adduser",
        query: {
          role: role,
          id: id
        }
      });
    },

    //添加用户角色
    userManage: function(id) {
      this.usershow = true;
      this.id = id;
      system
        .getRoletree({
          userId: this.id
        })
        .then(res => {
          this.treedata = res;
          for (let i in res) {
            if (res[i].checked) {
              this.checkAllGroup = res[i].id;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 分配角色
    assignRolefuc: function() {
      system
        .assignRoleSpec({
          userId: this.id,
          roleIds: this.checkAllGroup
        })
        .then(res => {
          console.log(res);
          (this.id = ""), (this.checkAllGroup = ""), this.getUserdata();
        })
        .catch(error => {
          console.log(error);
        });
    },

    onCancelrole: function() {
      this.checkAllGroup = "";
    },

    // 搜索
    search: function() {
      this.current=1,
      this.getUserdata();
      // 搜索相关
      // (this.usernamekey = ""),
      // 姓名
      // (this.namekey = ""),
      //性别
      // (this.sexkey = ""),
      // 手机号
      // (this.mobilekey = ""),
      // 状态
      // (this.statuskey = "");
    },

    // 分页
    changePage(page) {
      this.current = page;
      this.getUserdata();
    },
    pageSizeFun(data) {
      this.size = data;
      this.getUserdata();
    }
  }
};
</script>

<style>
@import "./usermanagement.css";
</style>
