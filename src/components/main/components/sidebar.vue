<template>
  <div class="side-menu-wrapper">
    <Menu :theme="theme" :active-name="showTab" :open-names="[showOpen]" ref="side_menu">
      <template v-for="item in childroute">
        <template v-if="item.children">
          <Submenu :name="item.name" :key="item.name" v-if="item.newRole.length != 0">
            <template slot="title">
              <Icon :type="getIcon(item.name)" />
              {{item.meta.title}}
            </template>
            <MenuItem v-for="items in item.children" :name="items.name" :key="items.name" :to="items.path"
              v-if="items.meta.showflg&&roleskey.includes(items.meta.roles)">{{items.meta.title}}</MenuItem>
          </Submenu>
        </template>

        <template v-else>
          <MenuItem :name="item.name" :key="item.name" v-if="item.meta.showflg&&roleskey.includes(item.meta.roles)"
            :to="item.path">
          <Icon :type="getIcon(item.name)" />
          {{item.meta.title}}
          </MenuItem>
        </template>
      </template>
    </Menu>
  </div>
</template>
<script>
  import {
    getRouterKey
  } from "@/utils/auth";
  export default {
    name: "esMenu",
    props: ["childrenroutemsg"],
    data() {
      return {
        theme: "light",
        childroute: [],
        roleskey: [],
        showTab: "",
        showOpen: ""
      };
    },
    methods: {
      //临时放置 route meta里面icon
      getIcon(str) {
        let itype;
        switch (str) {
          //商品
          case "goodsList":
            itype = "ios-briefcase";
            break;
          case "GoodsClassification":
            itype = "md-apps";
            break;
          case "GoodsGroup":
            itype = "ios-folder-open";
            break;
            //  用户
          case "UserList":
            itype = "ios-people";
            break;
            //  订单
          case "OrderOverview":
            itype = "ios-paper";
            break;
          case "OrderAdmin":
            itype = "ios-arrow-forward";
            break;
          case "DropShippingOrders":
            itype = "ios-arrow-forward";
            break;
          case "WaitOrders":
            itype = "ios-arrow-forward";
            break;
          case "ObligationOrders":
            itype = "ios-arrow-forward";
            break;
          case "FinishOrders":
            itype = "ios-arrow-forward";
            break;
          case "CloseOrders":
            itype = "ios-arrow-forward";
            break;
            //  营销
          case "baseMarketing":
            itype = "ios-podium";
            break;
          case "adhibition_c14":
            itype = "ios-archive";
            break;
          case "Coupon_parent":
            itype = "md-card";
            break;
            //  店铺
          case "smallProgram":
            itype = "ios-construct";
            break;
            //  设置
          case "PaySettparent":
            itype = "ios-card";
            break;
            //  用户
          case "":
            itype = "ios-people";
            break;
          default:
            itype = "ios-arrow-forward";
            break;
        }
        return itype;
      },

      routerfuc: function (data) {
        let _this = this

        data = data || []
        let roleskey = this.roleskey
        let newMap = []
        data.map((v, i) => {
          // 同理 此处一样
          JSON.parse(this.roleskey).map((vi, ii) => {
            if (v.meta.roles == vi) {
              newMap.push(v)
            }
          })
        })

        newMap = [...new Set(newMap)]

        newMap.map((v, i) => {
          if (v.hasOwnProperty('children')) {
            let newRole = []
            v.children.map((vi, ii) => {
              if (this.roleskey.includes(vi.meta.roles)) {
                newRole.push(vi.meta.roles)
              }
            })
            newMap[i] = {
              ...newMap[i],
              newRole: newRole
            }
          }
        })

        console.log(newMap)

        this.childroute = newMap

      }
    },
    watch: {
      childrenroutemsg: {
        handler(oldvalue, newValue) {
          this.roleskey = getRouterKey()
          let arrrouter = this.childrenroutemsg;
          this.routerfuc(arrrouter)
        },
        deep: true
      }
    },
    created() {
      this.roleskey = getRouterKey()

      let childroute = JSON.parse(localStorage.getItem("sidebar"))

      let arrrouter = this.childrenroutemsg

      if (arrrouter.length == 0) {
        this.routerfuc(childroute)
      } else {
        this.routerfuc(arrrouter)
      }
    }
  };

</script>
<style scoped>
  .side-menu-wrapper {
    width: 155px;
  }

  .ivu-menu {
    height: 100%;
    width: 155px !important;
    font-size: 13px;
  }

  .side-menu-wrapper>>>.ivu-menu-submenu-title-icon {
    right: 18px !important;
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
    background: #CCE6EF;
    color: #0083B0;
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    background: #0083B0;
  }

  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item:hover {
    color: #0083B0;
  }

  .side-menu-wrapper>>>.ivu-menu-submenu-title:hover {
    color: #0083B0 !important;
  }

</style>
