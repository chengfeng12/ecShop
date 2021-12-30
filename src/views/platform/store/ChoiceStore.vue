<template>
  <div class="container">
    <div class="currentTitle">品牌管理</div>
    <Card>
      <!--<h3 class="title" slot="title">品牌管理</h3>-->
      <div class="nav">
        <!-- <Button type="primary" size="small" class="addBtn" @click="addShop">+添加新店铺</Button> -->
        <Select size="small"  v-model="typeId" class="select" style="width: 300px;margin-left: 20px;">
          <Option v-for="item in store" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
        <Input
          size="small"
          v-model="keyWord"
          class="nav-input"
          placeholder="输入品牌/店铺名称搜索搜索"
          style="width: 200px;margin-left: 20px;"
        />
        <Button type="primary" size="small" class="search" style="margin-left: 20px;" @click="getData">搜索</Button>
        <div style="border-bottom: 1px solid #c9c9c9;margin: 10px -16px"></div>
      </div>
      <div class="shop-content">
        <div class="content" v-for="(item, index) in tabs" :key="index">
          <div class="store-box">
            <div class="store-item" @mouseover="eNavOver(index)" @mouseout="eNavOut($event)">
              <div class="one-show">
                <div class="img-box">
                  <img v-if="item.appletThumb != ''" :src="item.appletThumb">
                </div>
                <div class="con-desc">
                  <p
                    class="con-text"
                  >品&nbsp;&nbsp;&nbsp;&nbsp;牌&nbsp;&nbsp;|&nbsp;&nbsp;{{item.brandName}}</p>
                  <p
                    class="con-text"
                  >店&nbsp;&nbsp;&nbsp;&nbsp;铺&nbsp;&nbsp;|&nbsp;&nbsp;{{item.name}}</p>
                  <p
                    class="con-text"
                  >类&nbsp;&nbsp;&nbsp;&nbsp;型&nbsp;&nbsp;|&nbsp;&nbsp;{{item.typeEn}}</p>
                  <p
                    class="con-text"
                  >状&nbsp;&nbsp;&nbsp;&nbsp;态&nbsp;&nbsp;|&nbsp;&nbsp;{{item.status == 1 ? '启用' : '未启用'}}</p>
                </div>
              </div>
              <div class="mask" :class="{'mask-hover': tempInde == index}">
                <div class="mask-ico">
                  <Icon
                    class="iconfont icon-edit-square"
                    @click="editFun(item.id)"
                  />
                  <Icon
                    :class="item.status == 1 ? 'icon-stop' : 'icon-play-circle'"
                    class="iconfont"
                    @click="enableFun(index)"
                  />
                  <!-- <Icon class="iconfont icon-delete" @click="delFun(item.id)"/> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal v-model="statusPop" title="确认提示" width="300px" @on-ok="statusFun">
        <p>确认{{tempMsg}}这个店铺?</p>
      </Modal>
      <Modal v-model="delPop" title="确认提示" width="300px" @on-ok="shopDelFun">
        <p>确认删除这个店铺?</p>
      </Modal>
    </Card>
  </div>
</template>

<script>
import shopTwo from "@/api/request/shopTwo";
export default {
  name: "ChoiceStore",
  data() {
    return {
      model1: "",
      showUpdate: -1,
      typeId: "-1",
      store: [
        {
          id: "-1",
          name: "店铺类型"
        },
        {
          id: "1",
          name: "微信小程序"
        }
      ],
      tabs: [],
      tempInde: -1,
      keyWord: "",
      tempId: "",
      tempStatus: "",
      tempMsg: "",
      statusPop: false,
      delPop: false
    };
  },
  created() {
    console.log("我是生命周期的");
    this.getData();
  },
  methods: {
    getData() {
      shopTwo
        .shopAdminList({
          typeId: this.typeId,
          keyWord: this.keyWord
        })
        .then(res => {
          if (res.code == 1) {
            console.log(res);
            this.integrationData(res);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
          console.log(err);
        });
    },
    integrationData(res) {
      this.tabs = [];
      let data = res.data.records;
      data.forEach(item => {
        let shopList = {};
        shopList.id = item.id;
        shopList.name = item.name;
        // shopList.name = item.name
        shopList.appletThumb = item.appletThumb;
        shopList.brandName = item.shopBrand.brandName;
        shopList.typeEn = item.typeEn;
        shopList.status = item.status;
        this.tabs.push(shopList);
      });
      console.log("..........", this.tabs);
      // this.tabs = data
    },
    eNavOver(index) {
      this.tempInde = index;
    },
    eNavOut(index) {
      this.tempInde = -1;
    },
    // 添加的
    addShop() {
      this.$router.push({ path: `/@/views/platform/store/AddStore?role=0` });
    },
    // 编辑
    editFun(id) {
      console.log("我是编辑的");
      this.$router.push({
        path: `/@/views/platform/store/AddStore?role=1&id=${id}`
      });
    },
    // 禁用
    enableFun(index) {
      this.statusPop = true;
      this.tempId = this.tabs[index].id;
      this.tempStatus = this.tabs[index].status == 1 ? 0 : 1;
      this.tempMsg = this.tabs[index].status == 1 ? "禁用" : "启用";
    },
    statusFun() {
      shopTwo
        .shopAdminUpdate({
          id: this.tempId,
          status: this.tempStatus
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success("切换成功");
            this.getData();
          } else {
            this.$Message.error("切换失败");
          }
        })
        .catch(err => {
          this.$Message.error("切换失败");
        });
    },
    // 删除
    delFun(id) {
      this.delPop = true;
      this.tempId = id;
    },
    shopDelFun() {
      shopTwo
        .shopAdminDel({
          id: this.tempId
        })
        .then(res => {
          if (res.code == 1) {
            this.$Message.success("删除成功");
            this.getData();
          } else {
            this.$Message.error("删除失败");
          }
        })
        .catch(err => {
          this.$Message.error("删除失败");
        });
    }
  }
};
</script>

<style scoped>
  .currentTitle{
    font-size: 13px;
    color: #000;
    padding: 4px 0;
    background: #f8fbfb;
  }
.container .title {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
}
.container .tab {
  border: 1px solid #aeaeae;
  background: #f3f3f3;
}
.container .shop-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.container .store-box {
  margin: 30px;
}
.container .store-item {
  position: relative;
  background: #fff;
  width: 200px;
  height: 200px;
  border: 1px solid #aeaeae;
  flex: 1 1 auto;
}
.container .one-show {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.container .img-box {
  height: 80px;
  padding: 10px;
}

.container .img-box img {
  display: block;
  width: 110px;
  margin: 0 auto;
  height: 80px;
}

.container .con-desc {
  color: #999;
  margin: 20px 20px 0;
}

.container .con-text {
  height: 20px;
  line-height: 20px;
}

.container .mask {
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  background: #000;
  width: 200px;
  height: 200px;
  opacity: 0.5;
  color: #fff;
  font-size: 14px;
  display: none;
}
.container .mask-hover {
  display: block;
}
.container .mask-ico {
  margin-top: 165px;
  width: 200px;
  height: 35px;
  font-size: 26px;
  line-height: 35px;
  display: flex;
  justify-content: flex-end;
}
.container .mask-ico .icon {
  font-size: 20px;
  margin: 0 5px;
  line-height: 35px;
  font-weight: 700;
}
</style>
