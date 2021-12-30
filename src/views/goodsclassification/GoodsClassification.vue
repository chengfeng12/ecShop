<template>
  <div id="goods-class">
    <div class="currentTitle">商品分类</div>
    <Card>
      <div class="content">
        <div class="con-title">
          <Button type="primary" v-if="hasRole(10201)" @click="toLink">
            <span class="title-span">添加新分类</span>
          </Button>
        </div>
        <div class="con-table">
          <div class="tables">
            <div class="header">
              <ul>
                <li>分类ID</li>
                <li>分类名称</li>
                <li>分类图片</li>
                <li>状态</li>
                <li>设置时间</li>
                <li>操作</li>
              </ul>
            </div>
            <div class="body">
              <draggable
                v-model="classDate"
                v-bind="dragOptions"
                handle=".handle"
                :move="changeLists"
              >
                <transition-group type="transition">
                  <div
                    v-for="(item,index) in classDate"
                    :key="index"
                    :class="item.level > 1 ? 'bg-color' : ''"
                  >
                    <ul>
                      <li class="center">{{item.id}}</li>
                      <li class="center">
                        <span>
                          <Icon v-if="item.level > 1" type="md-return-right" class="child-icon" />
                          {{item.name}}
                        </span>
                      </li>
                      <li class="center">
                        <img v-if="item.thumb != ''" :src="item.thumb" class="img" />
                        <span v-else>暂无</span>
                      </li>
                      <li class="center">
                        <span v-if="hasRole(1020102)">
                        <Button
                          v-if="item.status"
                          type="primary"
                          size="small"
                          @click="stateChange(item.id,item.status)"
                        >显示</Button>
                        <Button
                          v-else
                          type="error"
                          size="small"
                          @click="stateChange(item.id,item.status)"
                        >隐藏</Button>
                        </span>
                      </li>
                      <li class="center">{{item.lastTime}}</li>
                      <li class="center">
                        <div class="operationList">
                          <p class="border-right" 
                            v-if="item.id != 1 && hasRole(10201)" @click="addClass(index)">添加</p>
                          <p v-if="hasRole(10201)" @click="editClass(index)">编辑</p>
                          <p
                            :class="hasRole(10201)?'border-left': 'border: none'"
                            v-if="item.id != 1&&hasRole(1020103)"
                            @click="removeClass(item.id)"
                          >删除</p>
                          <!-- <p class="border-left handle" v-if="item.id != 1" @click="draggingFun(index)">移动</p> -->
                        </div>
                        <!--                        <div>-->
                        <!--                          <Icon-->
                        <!--                            v-if="item.id != 1"-->
                        <!--                            class="iconfont icon-plus-square"-->
                        <!--                            @click="addClass(index)"-->
                        <!--                          ></Icon>-->
                        <!--                          <Icon class="iconfont icon-edit-square" @click="editClass(index)"></Icon>-->
                        <!--                          <Icon-->
                        <!--                            v-if="item.id != 1"-->
                        <!--                            class="iconfont icon-close-square"-->
                        <!--                            @click="removeClass(item.id)"-->
                        <!--                          ></Icon>-->
                        <!--                          <Icon-->
                        <!--                            v-if="item.id != 1"-->
                        <!--                            class="iconfont icon-drag handle"-->
                        <!--                            @click="draggingFun(index)"-->
                        <!--                          ></Icon>-->
                        <!--                        </div>-->
                      </li>
                    </ul>
                    <div
                      v-if="item.listTwo"
                      v-for="(twoitem,twoindex) in item.listTwo"
                      :key="twoindex"
                      style="background:#f1f1f1;"
                    >
                      <ul>
                        <li class="center">{{twoitem.id}}</li>
                        <li class="center">
                          <span>
                            <Icon type="md-return-right" class="child-icon" />
                            {{twoitem.name}}
                          </span>
                        </li>
                        <li class="center">
                          <img v-if="twoitem.thumb != ''" :src="twoitem.thumb" class="img" />
                          <span v-else>暂无</span>
                        </li>
                        <li class="center">
                          <span v-if="hasRole(1020102)">
                            <Button
                              v-if="twoitem.status"
                              type="primary"
                              size="small"
                              @click="stateChange(twoitem.id,twoitem.status,)"
                            >显示</Button>

                            <Button
                              v-else
                              type="error"
                              size="small"
                              @click="stateChange(twoitem.id,twoitem.status)"
                            >隐藏</Button>
                          </span>
                        </li>
                        <li class="center">{{twoitem.lastTime}}</li>
                        <li class="center">
                          <!--                          二级-->
                          <div class="operationList">
                            <p
                              v-if="hasRole(10201)"
                              class="border-right"
                              @click="addThirdClass(twoitem.id,twoitem.name)"
                            >添加</p>

                            <p
                              v-if="hasRole(10201)"
                              :class="hasRole(1020103)?'border-right':'border-none'"
                              @click="editSecondClass(twoitem.id,item.name)"
                            >编辑</p>

                            <p v-if="hasRole(1020103)" @click="removeClass(twoitem.id)">删除</p>
                            <!--                            <Icon-->
                            <!--                              class="iconfont icon-plus-square"-->
                            <!--                              @click="addThirdClass(twoitem.id,twoitem.name)"-->
                            <!--                            ></Icon>-->
                            <!--                            <Icon-->
                            <!--                              class="iconfont icon-edit-square"-->
                            <!--                              @click="editSecondClass(twoitem.id,item.name)"-->
                            <!--                            ></Icon>-->
                            <!--                            <Icon-->
                            <!--                              class="iconfont icon-close-square"-->
                            <!--                              @click="removeClass(twoitem.id)"-->
                            <!--                            ></Icon>-->
                            <!-- <Icon class="icon-item handleTwo"  type="ios-expand" @click="draggingFun(index)"></Icon> -->
                          </div>
                        </li>
                      </ul>
                      <div
                        v-if="twoitem.listThree"
                        v-for="(threeitem,threeindex) in twoitem.listThree"
                        :key="threeindex"
                        style="background:#ccc;"
                      >
                        <ul>
                          <li class="center">{{threeitem.id}}</li>
                          <li class="center">
                            <span>
                              <Icon type="md-return-right" class="child-icon" />
                              {{threeitem.name}}
                            </span>
                          </li>
                          <li class="center">
                            <img v-if="threeitem.thumb != ''" :src="threeitem.thumb" class="img" />
                            <span v-else>暂无</span>
                          </li>
                          <li class="center">
                            <span v-if="hasRole(1020102)">
                              <Button
                                v-if="threeitem.status"
                                size="small"
                                type="primary"
                                @click="stateChange(threeitem.id,threeitem.status)"
                              >显示</Button>
                              <Button
                                v-else
                                type="error"
                                size="small"
                                @click="stateChange(threeitem.id,threeitem.status)"
                              >隐藏</Button>
                            </span>
                          </li>
                          <li class="center">{{threeitem.lastTime}}</li>
                          <li class="center">
                            <div class="operationList">
                              <p
                                :class="hasRole(1020103)?'border-right':'border-none'"
                                 v-if="hasRole(10201)"
                                @click="editThirdClass(threeitem.id,twoitem.name)"
                              >编辑</p>
                              <p v-if="hasRole(1020103)" @click="removeClass(threeitem.id,twoitem.name)">删除</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <!-- </transition-group> -->
                      <!-- </draggable> -->
                    </div>
                    <!-- </transition-group> -->
                    <!-- </draggable> -->
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <Modal
          v-model="delPop"
          title="确认提示"
          @on-ok="removeFun"
          width="400px"
          :scrollable="false"
          @on-cancel="removeCancel"
        >
          <div class="pop-i">
            <i class="tips"></i>
            <span>是否确认删除商品分类？</span>
          </div>
        </Modal>
      </div>

      <div class="footer">
        <div class="preserve">
          <div class="btn">
            <!-- <Button type="primary" @click="preserveFun">保存分类</Button> -->
          </div>
          <div class="page">
            <!-- show-sizer
              :page-size-opts="[10,15,20]"
            @on-page-size-change="pageSizeFun"-->
            <Page
              :current="current"
              :total="total"
              :page-size="size"
              @on-change="pagefun"
              show-sizer
              :page-size-opts="[10,15,20]"
              @on-page-size-change="pageSizeFun"
              :show-elevator="true"
              :show-total="true"
            ></Page>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import goods from "@/api/request/goods";
import tableHead from "./tablecom";
import goodsUtils from "@/utils/goodsUtils";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      classDate: [],
      // 删除弹框
      delPop: false,
      // 暂存id
      tempId: "",

      // 翻页后端字段
      total: 0,
      // 每页显示条数
      size: 10,
      // 当前页数
      current: 1,
      currentDrag: 0
    };
  },

  created() {
    this.getGoods();
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  components: {
    tableHead,
    draggable
  },
  methods: {
    getGoods() {
      console.log("我被调用了");
      // return false
      goods.goodsCategorylist({
          current: this.current,
          size: this.size
        })
        .then(res => {
          if ((res.code = 1)) {
            this.goodsData(res);
            console.log(res);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 数据的处理
    goodsData(res) {
      // 清空数据
      this.classDate = [];
      // 获取翻页的数据
      this.total = res.data.total * 1;
      // this.size = res.data.size;
      this.current = res.data.current * 1;

      // 数据
      let backData = res.data.rows;
      let tempReq = {};
      backData.map((item, index) => {
        console.log(item.displayOrder);
        item.lastTime = goodsUtils.timeFun(new Date(item.lastTime).getTime());
        if (item.hasOwnProperty("listTwo")) {
          item.listTwo.map((v, i) => {
            v.lastTime = goodsUtils.timeFun(new Date(v.lastTime).getTime());
            if (v.hasOwnProperty("listThree")) {
              v.listThree.map((k, j) => {
                k.lastTime = goodsUtils.timeFun(new Date(k.lastTime).getTime());
              });
            }
          });
        }
      });
      this.classDate = backData;
    },

    // 切换状态
    stateChange(id, status) {
      this.tempId = id;
      let tempStatus = status ? 0 : 1;
      console.log(tempStatus);
      goods
        .updGoodsCategoryStatus({
          id: this.tempId,
          status: tempStatus
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$Message.success("更改成功");
            this.getGoods();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 添加
    addClass(index) {
      console.log("我是添加", index);
      console.log(this.classDate[index]);
      this.$router.push({
        path: "/@/views/goodsclassoperation/AddClass",
        query: {
          role: "2",
          classId: this.classDate[index].id,
          childName: this.classDate[index].name,
          level: this.classDate[index].level
        }
      });
    },
    // 添加三级分类
    addThirdClass(index, name) {
      console.log("我是添加", index);
      console.log(this.classDate[index]);
      this.$router.push({
        path: "/@/views/goodsclassoperation/AddClass",
        query: { role: "2", classId: index, childName: name, level: 1 }
      });
    },

    // 编辑
    editClass(index) {
      console.log("我是编辑", index);
      this.$router.push({
        path: "/@/views/goodsclassoperation/AddClass",
        query: {
          role: "0",
          classId: this.classDate[index].id,
          level: this.classDate[index].level
        }
      });
    },

    editSecondClass(index, name) {
      console.log("我是二级分类编辑", index);
      this.$router.push({
        path: "/@/views/goodsclassoperation/AddClass",
        query: { role: "second", classId: index, level: 1, childName: name }
      });
    },

    editThirdClass(index, name) {
      console.log("我是三级分类编辑", index);
      this.$router.push({
        path: "/@/views/goodsclassoperation/AddClass",
        query: { role: "second", classId: index, level: 2, childName: name }
      });
    },

    // 删除
    removeClass(id) {
      console.log("idddddd", id);
      this.delPop = true;
      this.tempId = id;
    },
    draggingFun(index) {},
    //  确认的方法
    removeFun() {
      // console.log('删除了')
      goods
        .delGoodsCategory({
          ids: this.tempId
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.$Message.success("删除成功");
            if (this.classDate.length == 1) {
              if (this.current <= 1) {
                this.current <= 1;
                this.getGoods();
                return;
              } else {
                this.current -= 1;
                this.getGoods();
                return;
              }
            }
            this.getGoods();
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除商品分类

    // 处理需要保存的数据
    integrationFun() {
      let arr = [];
      let obj = {};
      this.classDate.forEach(item => {
        obj.id = item.id;
        obj.displayOrder = item.displayOrder;
        arr.push(obj);
        // console.log(obj)
        obj = {};
      });
      return arr;
    },

    // 取消的方法
    removeCancel() {
      console.log("删除取消了");
      // this.$Message.success(res.message)
    },

    // 保存的方法
    preserveFun() {
      console.log(this.classDate);
      let data = JSON.stringify(this.classDate);
      console.log(data);
      console.log(this.classDate);
      goods
        .updateDisplayOrder({
          categoryList: data
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            console.log("1");
            this.$Message.success("保存成功");
            console.log("2");
            this.getGoods();
          } else {
            this.$Message.error(res.message);
          }
        });
    },

    // 分页逻辑
    pagefun(index) {
      console.log(index);
      this.current = index;
      this.getGoods();
    },
    pageSizeFun(data) {
      console.log("你是");
      this.size = data;
      this.getGoods();
    },
    // 跳转链接
    toLink() {
      this.$router.push({
        path: "/@/views/goodsclassoperation/AddClass",
        query: { role: "1" }
      });
    },

    /**
     * 监听拖拽事件
     */
    changeLists(e) {
      console.log(e);
      let dragIndex = e.draggedContext.index;
      let dragItem = e.draggedContext.element;
      let endIndex = e.relatedContext.index;
      let endItem = e.relatedContext.element;
      console.log(dragIndex, endIndex);

      let newDis = this.classDate[dragIndex].displayOrder;
      let oldDis = this.classDate[endIndex].displayOrder;
      this.classDate[dragIndex].displayOrder = oldDis;
      this.classDate[endIndex].displayOrder = newDis;

      this.currentDrag = endIndex;
      console.log(this.classDate);
    }
  }
};
</script>

<style scoped>
@import "./index.css";
</style>
