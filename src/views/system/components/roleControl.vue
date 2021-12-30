<style lang="less">
@import "./roleControl.less";
</style>

<template>
  <div>
    <Card>
      <p slot="title">可用权限</p>
      <div class="group-content">
        <div class="group-item" v-for="(item,index) in roleLists" :key="index">
          <div class="group-title">
            <Checkbox
              :indeterminate="item.indeterminate"
              :value="item.isCheckAll"
              @click.prevent.native="checkOneAll(index)"
            >{{item.label}}</Checkbox>
          </div>
          <div class="group-check" v-if="item.children">
            <div class="group-secMainCheck" v-for="(role,roleix) in item.children" :key="roleix">
              <div class="group-secCheck">
                <Checkbox
                  :indeterminate="role.indeterminate"
                  :value="role.isCheckAll"
                  @click.prevent.native="checkTwoAll(index,roleix)"
                >{{role.label}}</Checkbox>
              </div>
              <div class="group-thirCheck" v-if="role.children">
                <CheckboxGroup
                  v-model="checkAllGroup"
                  @on-change="checkAllGroupChange"
                  v-for="(rolet,roletix) in role.children"
                  :key="roletix"
                >
                  <Checkbox :label="role.roles + '_' + rolet.roles">
                    <span>{{rolet.label}}</span>
                  </Checkbox>
                </CheckboxGroup>
              </div>


              <div class="group-check-radio">
                <RadioGroup v-model="role.roleRadio">
                  <span @click="changeRadio(index,roleix,1)">
                    <Radio label="1">
                      <span>全部店铺</span>
                    </Radio>
                  </span>
                  <span @click="changeRadio(index,roleix,2)">
                    <Radio label="2">
                      <span>上下级</span>
                    </Radio>
                  </span>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="action">
        <Button class="btn-action" @click="cancelBtn">取消</Button>
        <Button class="btn-action" type="primary" :loading="loading" @click="confrim">确认</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import router from "@/router/router.js";
import store from "@/store";
import system from "@/api/request/system";
import jwt from "@/api/request/jwt.js";
export default {
  name: "rightControl",
  props: ["options"],
  data() {
    return {
      loading:false,
      checkAllGroup: [],
      roleLists: [],
      rolemsg: []
    };
  },
  mounted() {
    let _this = this;
    _this.init();
    this.getRoles(router.options.routes);
  },

  methods: {
    // 处理路由数据
    getRoles: function(data) {
      // 格式化
      let arr = [];
      let arrlevel;
      for (let i in data) {
        if(!data[i].meta.showrole){
          arr.push(data[i].meta);
        }
        
        if (data[i].children) {
          for (let j in data[i].children) {
            
            if(!data[i].children[j].meta.showrole){
              arr.push(data[i].children[j].meta);
            }

            if (data[i].children[j].children) {
              for (let k in data[i].children[j].children) {
                if(!data[i].children[j].children[k].showrole){
                  arr.push(data[i].children[j].children[k].meta);
                }
               
              }
            }
          }
        }
      }

      console.log("页面权限",arr)
      arrlevel = this.routerfuclevel1(arr);
      for (let i in arrlevel) {
        let arrlevel1 = arrlevel[i].children;
          arrlevel[i].children = this.routerfuclevel2(arrlevel1);
      }
      this.rolemsg = arrlevel;
      console.log("权限信息", this.rolemsg);
    },

    routerfuclevel1: function(arr) {
      let map = {},
        dest = [];

      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];

        if (!map[ai.level1]) {
          dest.push({
            level1: ai.level1,
            title: ai.title,
            roles: ai.roles,
            expand: true,
            children: [ai]
          });
          map[ai.level1] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j];
            if (dj.level1 == ai.level1) {
              dj.children.push(ai);
              break;
            }
          }
        }
      }
      console.log("数据", dest);
      for (let i in dest) {
        dest[i].children.shift();
      }
      return dest;
    },

    routerfuclevel2: function(arr) {
      let map = {},
        dest = [];
      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];
        if (!map[ai.level2]) {
          dest.push({
            level2: ai.level2,
            title: ai.title,
            roles: ai.roles,
            expand: true,
            children: [ai]
          });
          map[ai.level2] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j];
            if (dj.level2 == ai.level2) {
              dj.children.push(ai);
              break;
            }
          }
        }
      }
      for (let i in dest) {
        dest[i].children.shift();
      }

      return dest;
    },

    routerfuclevel3: function(arr) {
      let map = {},
        dest = [];
      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i];
        if (!map[ai.level3]) {
          dest.push({
            level3: ai.level3,
            title: ai.title,
            roles: ai.roles,
            data: [ai]
          });
          map[ai.level3] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j];
            if (dj.level3 == ai.level3) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
    },

    init() {
      let _this = this;
      // 查看角色的权限
      system
        .roleDetailList({
          roleId: this.options.id
        })
        .then(res => {
          //处理数据
          console.log(res);
          _this.calcData();
          _this.calcDetail(res);
        });
    },
    // 处理数据的逻辑处理
    calcData() {
      let _this = this;
      let roleLists = [];
      // 生成最新的数组
      this.rolemsg.map((v, i) => {
        roleLists.push({
          roles: v.roles,
          label: v.title,
          indeterminate: false,
          isCheckAll: false,
          children: v.children
            ? v.children.map((k, j) => {
                return {
                  roles: k.roles,
                  label: k.title,
                  indeterminate: false,
                  isCheckAll: false,
                  roleRadio: "1",
                  children: k.children
                    ? k.children.map((y, o) => {
                        return {
                          roles: y.roles,
                          label: y.title,
                          select: false
                        };
                      })
                    : []
                };
              })
            : []
        });
      });
      this.roleLists = roleLists;
    },
    cancelBtn() {
      this.$emit("ToListenCancel");
    },
    // 点击一级全选
    checkOneAll(ix) {
      let _this = this;
      if (this.roleLists[ix].isCheckAll) {
        _this.checkAllGroup = _this.uniqueAry(_this.checkAllGroup);
        this.roleLists[ix].isCheckAll = false;
        this.roleLists[ix].children.map((v, i) => {
          v.isCheckAll = false;
          let childLists = v.children;
          let roles = v.roles;
          childLists.map((k, j) => {
            _this.checkAllGroup.map((o, p) => {
              if (o == roles + "_" + k.roles) {
                k.select = false;
                _this.checkAllGroup.splice(p, 1);
              }
            });
          });
        });
      } else {
        this.roleLists[ix].isCheckAll = true;
        this.roleLists[ix].children.map((v, i) => {
          v.isCheckAll = true;
          let childLists = v.children;
          let roles = v.roles;
          childLists.map((k, j) => {
            k.select = true;
            _this.checkAllGroup.push(roles + "_" + k.roles);
          });
        });
      }

      _this.checkAllGroupChange(_this.checkAllGroup);
    },
    // 点击二级全选
    checkTwoAll(px, ix) {
      let _this = this;
      let childLists = this.roleLists[px].children[ix];
      console.log(childLists);
      if (childLists.isCheckAll) {
        _this.checkAllGroup = _this.uniqueAry(_this.checkAllGroup);
        let roles = childLists.roles;
        childLists.isCheckAll = false;
        childLists.children.map((k, j) => {
          _this.checkAllGroup.map((v, i) => {
            if (v == roles + "_" + k.roles) {
              k.select = false;
              _this.checkAllGroup.splice(i, 1);
            }
          });
        });
      } else {
        let roles = childLists.roles;
        childLists.isCheckAll = true;
        childLists.children.map((v, i) => {
          v.select = true;
          _this.checkAllGroup.push(roles + "_" + v.roles);
        });
      }

      _this.checkAllGroupChange(_this.checkAllGroup);
    },
    // 监听按钮触发事件
    checkAllGroupChange(data) {
      console.log(data);
      let _this = this;
      _this.calcData();
      _this.uniqueAry(_this.checkAllGroup);

      // 处理选择/取消三级权限
      if (data.length > 0) {
        let currentData = [];
        for (let i = 0; i < data.length; i++) {
          let key = data[i].split("_")[0];
          let value = data[i].split("_")[1];
          currentData.push({
            roles: key,
            value: value
          });
          for (let j = 0; j < _this.roleLists.length; j++) {
            for (let k = 0; k < _this.roleLists[j].children.length; k++) {
              // 判断是否某个一级下的二级是全选的
              let rc = _this.roleLists[j].children[k];
              let num = 0;
              for (let z = 0; z < currentData.length; z++) {
                if (currentData[z].roles == rc.roles) {
                  num++;
                }
              }
              if (num == "0") {
                rc.indeterminate = false;
              }
              if (rc.roles == key) {
                // 三级循环
                let isCheckAll = true;
                let isEmpty = true;
                for (let q = 0; q < rc.children.length; q++) {
                  if (rc.children[q].roles == value) {
                    rc.children[q].select = true;
                    _this.roleLists[j].indeterminate = true;
                  }
                  if (!rc.children[q].select) {
                    isCheckAll = false;
                  }
                }
                if (isCheckAll) {
                  rc.isCheckAll = isCheckAll;
                  rc.indeterminate = false;
                } else {
                  rc.isCheckAll = isCheckAll;
                  rc.indeterminate = true;
                }
              }
            }
          }
          // 判断是否全选
          _this.isAllCheck(_this.roleLists);
        }
      } else {
        _this.roleLists.map((v, i) => {
          // 二级循环
          v.children.map((k, j) => {
            // 三级循环
            k.children.map((q, w) => {
              q.select = false;
              k.indeterminate = false;
              v.indeterminate = false;
            });
          });
        });
      }
    },

    // 判断是否全选
    isAllCheck(roleLists) {
      let vlist = [];
      roleLists.map((v, i) => {
        let vlength = v.children.length;
        vlist.push({
          id: i,
          length: v.children.length,
          checkList: []
        });
        v.children.map((k, j) => {
          if (k.isCheckAll) {
            vlist[i].checkList.push(k.isCheckAll);
          }
        });
      });
      // 处理全选
      this.toCalCheck(vlist);
    },
    toCalCheck(vlist) {
      let _this = this;
      vlist.map((v, i) => {
        if (v.checkList.length == v.length) {
          _this.roleLists[v.id].isCheckAll = true;
          _this.roleLists[v.id].indeterminate = false;
        } else {
          _this.roleLists[v.id].isCheckAll = false;
        }
      });
    },
    // 数组去重
    uniqueAry(arr) {
      var x = new Set(arr);
      return [...x];
    },

    changeRadio(px, ix, status) {
      this.roleLists[px].children[ix].roleRadio = "" + status;
    },

    confrim() {
      
      let _this = this;
      _this.loading=true;
      let dataAuthStr = [];
      let menuIds = [-2];

      // 处理菜单权限
      this.roleLists.map((v, i) => {
        v.children.map((vs, is) => {
          if (vs.isCheckAll || vs.indeterminate) {
            dataAuthStr.push({
              roleId: _this.options.id,
              menuId: vs.roles,
              data_auth_level: vs.roleRadio
            });
          }
        });
      });

      // 处理所有权限
      this.roleLists.map((v, i) => {
        if (v.isCheckAll || v.indeterminate) {
          menuIds.push("" + v.roles);
          v.children.map((vs, is) => {
            if (vs.isCheckAll || vs.indeterminate) {
              menuIds.push("" + vs.roles);
            }
          });
        }
      });
      this.checkAllGroup.map((v, i) => {
        menuIds.push(v.split("_")[1]);
      });
      system
        .assignRole({
          roleId: _this.options.id,
          dataAuthStr: dataAuthStr,
          menuIds: menuIds
        })
        .then(res => {
          console.log(res);
          if (res.code == 0) {
            _this.loading=false;
            _this.$Message.success(res.msg);
            _this.cancelBtn();
            _this.$emit("toListenRefresh");
          } else {
            _this.$Message.error(res.msg);
            _this.cancelBtn();
            _this.$emit("toListenRefresh");
          }
        });
    },
    calcDetail(res) {
      console.log(res);

      let _this = this;
      console.log(_this.roleLists);
      let checkGroup = [];
      res.map((v, i) => {
        _this.roleLists.map((vs, is) => {
          vs.children.map((vi, ii) => {
            let roles = vi.roles;
            vi.children.map((vq, iq) => {
              if (v.menuId == vq.roles) {
                console.log(iq, "123123123", vq.roles, v.menuId);
                checkGroup.push(roles + "_" + vq.roles);
              }
            });
          });
        });
      });

      console.log(checkGroup);
      _this.checkAllGroup = checkGroup;
      // _this.checkAllGroupChange(_this.checkAllGroup)
      console.log(_this.checkAllGroup);
      _this.checkAllGroupChange(checkGroup);
    }
  }
};
</script>
