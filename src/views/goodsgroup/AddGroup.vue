<template>
  <div id="add-group">
    <div class="currentTitle" v-if="title === 'add'">商品分组/<label> 添加商品组</label></div>
    <div class="currentTitle" v-if="title === 'edit'">商品分组/<label> 编辑商品组</label></div>
    <Card>
      <div class="add-con-box">
        <div class="basic-content">
          <div class="content-war">
            <span class="content-war-span">
              商品组名称
              <i style="color:red;">*</i>
            </span>
            <Input
              class="title-right"
              v-model="searchName"
              placeholder="输入商品组名称"
              style="width: 220px"
            />
          </div>
        </div>

        <div class="content-war">
          <span class="content-war-span">状态</span>
          <RadioGroup v-model="forntShow">
            <Radio label="1">启用</Radio>
            <Radio label="0">禁用</Radio>
          </RadioGroup>
        </div>

        <div class="content-war">
          <span class="content-war-span">组内商品</span>
          <addGoodGroup :res="res" @listentgoodData="goodChange" :options="showData"></addGoodGroup>
        </div>
      </div>

      <div class="footer">
        <Button type="primary" @click="keepFun" :loading="loading">保存</Button>
        <Button type="primary" @click="goBack">返回</Button>
      </div>
    </card>
  </div>
</template>

<script>
// 商品推荐
import addGoodGroup from "@/components/addGood/addGoodGroup";
import goods from "@/api/request/goods";
export default {
  data() {
    return {
      res: "+选择商品",
      title: "",
      groupId: "",
      // 商品推荐图片数据
      searchName: "",
      // forntShow
      forntShow: "1",
      currentList: [],
      showData: [],
      tempLen: 0,
      loading: false
    };
  },
  created() {
    this.title = this.$route.query.title;
    if (this.title == "edit") {
      this.groupId = this.$route.query.groupId;
      this.init();
    }
  },
  components: {
    addGoodGroup
  },
  methods: {
    // 初始化
    init: function() {
      this.goodsDetail(this.groupId);
    },
    // 获取商品组详情
    goodsDetail: function(id) {
      let _this = this;
      goods
        .goodsGroupDetil({
          id: id
        })
        .then(res => {
          if (res.code == 1) {
            let data = res.data;
            _this.forntShow = "" + data.status;
            _this.searchName = data.name;
            _this.showData = data.listGoods;
          }
        });
    },
    keepFun: function() {
      this.loading = true
      if (this.searchName == "") {
        this.$Message.error("商品分组的名字不能为空");
        this.loading = false
        return;
      }
      let _this = this;
      console.log("保存");
      // 保存接口
      goods
        .goodsGroupAdd(
          {
            id: _this.groupId,
            name: _this.searchName,
            status: _this.forntShow,
            goodsIds: _this.currentList,
            goodsNum: _this.tempLen
          },
          this.title
        )
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.loading = false
            _this.$Message.success(res.message);
            _this.goBack();
          } else {
            this.loading = false
            _this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err);
        });
    },
    goBack: function() {
      this.$router.push({
        path: "/@/views/goodsgroup/GoodsGroup"
      });
    },
    delAdvImg: function(index) {
      console.log("图片删除", index);
      // 删除本地的数组,然后进行保存
      this.imgData.splice(index, 1);
    },
    goodChange: function(value) {
      let _this = this;
      if (value) {
        let ids = [];
        value.map((v, i) => {
          ids.push(v.id);
        });
        _this.currentList = ids;
        this.tempLen = value.length;
        console.log(this.tempLen);
      }
    }
  }
};
</script>

<style scoped>
#add-group {
  background-color: #fff;
  min-width: 1200px;
}
.add-con-box {
  padding: 10px;
}

.select-btn {
  margin-left: 122px;
  margin-bottom: 10px;
}
.select-single {
  position: relative;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
}
.img-left {
  float: left;
}
.img-left img {
  display: inline-block;
  height: 60px;
  width: 100px;
}
.img-box img {
  height: 100px;
  width: 130px;
}
.con-right {
  float: left;
  margin-left: 30px;
}
.input-box {
  font-size: 0;
}
.con-right .input {
  font-size: 14px;
  margin: 10px 0;
}
.con-right p {
  margin: 5px 0;
}
.select-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 25px;
  right: 0px;
  top: 0px;
}

.title {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
}
.content-war {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 15px;
}
.content-war span {
  font-size: 12px;
}
.content-war .content-war-span {
  display: inline-block;
  width: 108px;
  height: 32px;
  line-height: 32px;
  text-align: right;
  margin-right: 14px;
}
.content-war p {
  margin-left: 122px;
  padding: 8px 0 0 0;
  color: #888;
}

.footer {
  text-align: center;
  padding: 10px 0;
}
.footer button {
  margin-right: 5px;
  width: 80px;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
}
.currentTitle label{
  font-size: 14px;
  color: #000;
}
</style>
