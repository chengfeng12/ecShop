<template>
  <div class="container">
    <!-- 多选 -->
    <imgSelect ref="banner" :options="imgOptions" @listentoptpmfile="changeBanner($event)"></imgSelect>

    <!--单选-->
    <imgSelect ref="imgselect" :options="imgOptions" v-on:listentoptpmfile="changeImg"></imgSelect>
    <!-- 标题 -->
    <div class="currentTitle">刻字服务</div>
    <Card>
      <!-- 选项卡 -->
      <Tabs type="card" :animated="false">
        <!-- 选项卡1 -->
        <TabPane label="基本信息">
          <Card>
            <!-- <div class="base-position"> -->
            <!-- 表单 -->
            <Form
              ref="engravingService"
              :model="engravingService"
              :rules="ruleService"
              :label-width="700"
            >
              <FormItem label="刻字标题" prop="title" :label-width="100">
                <Input
                  v-model="engravingService.title"
                  placeholder
                  style="width: 430px;"
                  autofocus
                  :maxlength="20"
                ></Input>
                <div>刻字标题将显示在前端</div>
              </FormItem>
              <FormItem label="刻字服务费" prop :label-width="100">
                <Input
                  v-model="engravingService.cost"
                  placeholder
                  style="width: 100px;"
                  :maxlength="20"
                ></Input>&nbsp;&nbsp;元
              </FormItem>
              <FormItem label prop :label-width="100">
                <Checkbox v-model="engravingService.single">满额免费</Checkbox>&nbsp;&nbsp;满&nbsp;&nbsp;
                <Input
                  v-model="engravingService.fullyuan"
                  placeholder
                  style="width: 100px;"
                  :maxlength="20"
                ></Input>&nbsp;&nbsp;元免费
              </FormItem>
              <FormItem label="减免有效时间" prop :label-width="100">
                <DatePicker
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  placement="bottom-start"
                  split-panels
                  placeholder="请选择日期"
                  style="width: 430px"
                  v-model="engravingService.stime"
                  :editable="false"
                ></DatePicker>
              </FormItem>
              <FormItem label="刻字内容提示" prop :label-width="100">
                <Input
                  v-model="engravingService.content"
                  placeholder
                  style="width: 430px;"
                  :maxlength="20"
                ></Input>
              </FormItem>
              <FormItem label="刻字要求描述" prop :label-width="100">
                <Input
                  v-model="engravingService.desc"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  style="width: 430px;"
                  placeholder="请输入描述内容"
                  :maxlength="100 "
                ></Input>
              </FormItem>
              <FormItem label="样式图片" prop :label-width="100">
                <Input v-model="engravingService.img" placeholder disabled style="width: 430px;" />
                <Button type="primary" @click="openImg('img')">+添加图片</Button>
                <p>图片格式为png，尺寸50*50px，大小不超过10KB</p>
              </FormItem>
              <FormItem :label-width="100">
                <div class="smallImg" v-if="engravingService.img">
                  <span class="close" @click="handleClose('img')">X</span>
                  <img style="width:100%;height:100%;" :src="engravingService.img" />
                </div>
              </FormItem>
              <FormItem label="特殊符号标题" prop :label-width="100">
                <Input
                  v-model="engravingService.symbolTitle"
                  placeholder
                  style="width: 430px;"
                  :maxlength="20"
                ></Input>
                <div>特殊符号标题将显示在前端</div>
              </FormItem>
              <FormItem label="特殊符号描述" prop :label-width="100">
                <Input
                  v-model="engravingService.symbolDesc"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  placeholder="请描述特殊符号内容"
                  style="width: 430px;"
                  :maxlength="100"
                ></Input>
              </FormItem>
              <div class="content-war">
                <span class="content-war-span">特殊符号图片</span>
                <div class="but">
                  <img-select
                    ref="special"
                    @listentoptpmfile="specialFun"
                    :options="{type: 'multiimage'}"
                  />
                </div>
                <div class="image-area">
                  <ul class="banner-img">
                    <li v-for="(img,index) in imgList" :key="index">
                      <img :src="img" width="100px" height="100px" />
                      <div @click="removeSpecial(index)" style>
                        <Icon type="ios-close-circle" />
                      </div>
                    </li>
                  </ul>
                </div>
                <p>图片格式为png，尺寸50*50px，大小不超过10KB</p>
              </div>

              <FormItem label="留言框提示" prop :label-width="100">
                <Input
                  v-model="engravingService.MessageBox"
                  placeholder
                  style="width: 430px;"
                  :maxlength="20"
                ></Input>
              </FormItem>
              <FormItem label="刻字须知内容" prop :label-width="100">
                <!-- 使用富文本 -->
                <v-editor
                  style="width: 900px;"
                  v-model="engravingService.basicNotice"
                  @change="changeEditor"
                ></v-editor>
              </FormItem>
            </Form>
          </Card>
          <!-- 保存按钮 -->
          <div class="save" style="margin:0 auto;width: 60px; margin-top:30px;">
            <Button v-if="hasRole(80103)" type="primary" size="large" :loading="loading" @click="save">保存</Button>
          </div>
        </TabPane>

        <!-- 选项卡2 -->
        <TabPane label="样图上传">
          <!-- 表格 -->
          <div class="table">
            <Table border ref="selection" :columns="columns" :data="tableData"></Table>
          </div>
          <!-- 点击按钮 -->
          <div class="addBtn">
            <Button type="primary" v-if="hasRole(80102)" @click="addOperation">+添加样图</Button>
          </div>
          <!-- 上传模块 -->
          <div class="page">
            <!-- show-sizer  -->
            <Page
              :total="total"
              :page-size="size"
              :current="current"
              show-sizer
              :page-size-opts="[10,15,20]"
              @on-page-size-change="pageSizeFun"
              @on-change="pagefun"
              :show-elevator="true"
              :show-total="true"
            ></Page>
          </div>
        </TabPane>
      </Tabs>
      <!-- 删除 -->
      <Modal v-model="delPop" title="确认提示" @on-ok="Delete" width="400px" :scrollable="false">
        <div class="popConWra">
          <i class="tips"></i>
          <span>{{tempMsg}}</span>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import vEditor from "@/components/vEditor/vEditor";
import imgSelect from "@/components/imgSelect/imgSelect";
import operation from "@/api/request/operation";
import goodsUtils from "@/utils/goodsUtils";

export default {
  name: "operation",
  components: {
    vEditor,
    imgSelect
  },
  data() {
    return {
      loading:false,
      id: "",
      imgOptions: {
        type: "image",
        mode: "diy"
      },
      maxlength: "",
      currentPic: "",
      total: 0,
      size: 10,
      current: 1,
      tempMsg: "",
      tableData: [],
      current: 1,
      total: 0,
      size: 10,
      // 暂存的max
      tempMsg: "",
      tempId: "",
      tempStatus: "",
      statusPop: false,
      batchPop: false,
      delPop: false,
      batchDelPop: false,
      // 暂存max
      tempTables: [],
      imgList: [],

      //选项卡1-刻字服务输入max
      engravingService: {
        title: "",
        cost: "",
        single: true,
        fullyuan: "",
        content: "",
        desc: "",
        symbolTitle: "",
        symbolDesc: "",
        MessageBox: "",
        img: "",
        basicNotice: ""
      },
      //刻字服务规则验证
      ruleService: {
        title: [
          {
            required: true,
            message: "刻字标题不能为空",
            trigger: "blur"
          }
        ]
      },

      //样图上传max
      sampleUpload: {
        input: "",
        inputImg: "",
        inputPx: "",
        color: "#19be6b"
      },
      //样图上传验证
      ruleUpload: {
        input: [
          {
            required: true,
            message: "刻字标题不能为空",
            trigger: "blur"
          }
        ],
        inputImg: [
          {
            required: true,
            message: "图片地址不能为空",
            trigger: "blur"
          }
        ]
      },
      // //表格max
      tableData: [],
      //表格配置
      columns: [
        {
          title: "Id",
          key: "id",
          align: "center",
          width: 100
        },
        {
          title: "名称",
          key: "title",
          align: "center"
        },
        {
          title: "图片",
          key: "img",
          align: "center",
          render: (h, params) => {
            console.log(params);
            return h("img", {
              style: {
                //设置样式
                width: "70px",
                height: "70px",
                "border-radius": "5%",
                "vertical-align": "middle",
                margin: "5px 0"
              },
              attrs: {
                //设置属性
                src: params.row.img
              }
            });
          }
        },
        {
          title: "创建时间",
          align: "center",
          render: (h, params) => {
            let time = goodsUtils.timeFun(
              goodsUtils.timeStamp(params.row.createTime)
            );
            return h("p", {}, time);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {

            return h("div", {
               style:{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                color:'#0083b0',
                'font-size':'13px'
              }
            },[
              h('div', {
                class:'',
                style:{
                  'border-right':'1px solid #0083b0',
                  'padding-right':'10px',
                  'cursor': "pointer",
                  'display': this.hasRole(80102) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.editFun(params.row.id);
                  }
                }
              },'编辑'),
              // 删除
              h('div', {
                class:'',
                style:{
                  'padding':'0 10px',
                  'cursor': "pointer",
                  'display': this.hasRole(80101) ?'block':'none',
                },
                on: {
                  click: () => {
                    this.remove(params.row.id);
                  }
                },
              },'删除'),   
            ]);
          }
        }
      ]
    };
  },
  activated() {
    //获取刻字服务基本信息
    this.detail();
    //获取max
    this.getData();
  },
  methods: {
    specialFun(data) {
      let imgList = [];
      console.log("我是符号");
      for (let i = 0; i < data.length; i++) {
        if (this.imgList.length > 8) {
        }
        this.imgList.push(data[i].imgAddress);
      }

      // this.$refs.special.uploadflg()
    },
  

    // 打开图片
    openImg(type) {
      this.currentPic = type;
      console.log(this.currentPic);
      this.$refs.imgselect.uploadflg();
    },

    changeEditor(e) {
      console.log(e);
      this.engravingService.basicNotice = e;
    },
    // 删除图片
    removeSpecial(index) {
      this.imgList.splice(index, 1);
    },
    // 监听图片选择的事件
    changeImg(img) {
      console.log(this.currentPic);
      if (this.currentPic == "img") {
        console.log("123");
        this.engravingService.img = img[0].imgAddress;
      } else if (this.currentPic == "imgList") {
        console.log("234");
        this.engravingService.imgList = img[0].imgAddress;
      }

      console.log(this.engravingService);
      this.$forceUpdate();
    },
    //关闭小图
    handleClose(type) {
      if (type == "img") {
        this.engravingService.img = "";
      } else if (type == "imgList") {
        this.engravingService.imgList = "";
      }
    },
    //
    detail() {
      operation.getDetailBasic({}).then(res => {
        console.log(res);
        if (res.code == 1) {
          let engravingService = {
            title: res.data.title,
            cost: res.data.price,
            single: res.data.isFull == 1 ? true : false,
            fullyuan: res.data.fullPrice,
            stime: [
              goodsUtils.timeFun(res.data.startTime),
              goodsUtils.timeFun(res.data.endTime)
            ],
            content: res.data.basicContentTip,
            desc: res.data.basicRqeDesc,
            img: res.data.legendImg,
            symbolTitle: res.data.specSymTitle,
            symbolDesc: res.data.specSymDesc,
            imgList: res.data.specSymImg,
            MessageBox: res.data.boxMessage,
            basicNotice: res.data.basicNotice
          };
          this.id = res.data.id;

          this.engravingService = engravingService;
        }
      });
    },
    //修改
    save() {
      console.log("123");
      let _this = this;
    
      this.$refs.engravingService.validate(valid => {
        if (valid) {
          // 修改
          if (!_this.id) {
              _this.loading=true;
            operation
              .getSaveBasic({
                title: _this.engravingService.title,
                price: _this.engravingService.price,
                isFull: _this.engravingService.single ? 1 : 0,
                fullyuan: _this.engravingService.fullyuan,
                basicContentTip: _this.engravingService.content,
                basicRqeDesc: _this.engravingService.desc,
                legendImg: _this.engravingService.img,
                specSymTitle: _this.engravingService.symbolTitle,
                specSymDesc: _this.engravingService.symbolDesc,
                specSymImg: _this.imgList,
                boxMessage: _this.engravingService.MessageBox,
                basicNotice: _this.engravingService.basicNotice
              })
              .then(res => {
                if (res.code == "1") {
                   _this.loading=false;
                  this.$Message.success("保存成功");
                } else {
                   _this.loading=false;
                  this.$Message.error(res.message);
                }
              });
          } else {
              _this.loading=true;
            operation
              .getUpdateBasic({
                id: _this.id,
                title: _this.engravingService.title,
                price: _this.engravingService.price,
                isFull: _this.engravingService.single ? 1 : 0,
                fullyuan: _this.engravingService.fullyuan,
                basicContentTip: _this.engravingService.content,
                basicRqeDesc: _this.engravingService.desc,
                legendImg: _this.engravingService.img,
                specSymTitle: _this.engravingService.symbolTitle,
                specSymDesc: _this.engravingService.symbolDesc,
                specSymImg: _this.imgList,
                boxMessage: _this.engravingService.MessageBox,
                basicNotice: _this.engravingService.basicNotice
              })
              .then(res => {
                if (res.code == "1") {
                   _this.loading=false;
                  this.$Message.success("保存成功");
                } else {
                   _this.loading=false;
                  this.$Message.error(res.message);
                }
              });
          }
        }
      });
    },
    // 获取列表
    getData() {
      operation
        .getLetterList({
          current: this.current,
          size: this.size
        })
        .then(res => {
          console.log(res);
          if (res.code == 1) {
            this.size = res.data.size;
            this.current = res.data.current;
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        })
        .catch(err => {
          this.$Message.error("请求失败");
        });
    },
    //编辑
    edit() {
      let _this = this;
      operation
        .getDetailLegend({
          id: _this.id
        })
        .then(res => {
          console.log(res);
        });
    },

    Delete() {
      let _this = this;
      //刻字服务删除
      operation
        .getDeleteLegend({
          id: this.tempId
        })
        .then(res => {
          console.log(res);
          if (res.code == "1") {
            this.$Message.success("删除成功");
            if (this.tableData.length == this.tempTables.length) {
              this.current = this.current - 1;
            }
            if (this.current == "1") {
              this.current = 1;
            }
            this.getData();
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    // 添加样图
    addOperation() {
      this.$router.push("/@/views/operation/oadd?role=1");
    },
    // 编辑样图
    editFun(id) {
      this.$router.push("/@/views/operation/oadd?role=2&id=" + id);
    },
    // 切换页面
    pagefun(page) {
      this.current = page;
      this.getData();
    },
    pageSizeFun(data) {
      this.size = data
      this.getData()
    },
    //table移除
    remove(id) {
      this.delPop = true;
      this.tempMsg = "确定删除该规则商品？";
      this.tempId = id;
    }
  }
};
</script>
<style scoped>
.ivu-tabs {
  overflow: initial !important;
}

.container .ope-title {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
}

.container .smallImg {
  width: 100px;
  height: 100px;
  border: 1px solid #aeaeae;
  position: relative;
}

.container .close {
  width: 15px;
  height: 15px;
  line-height: 15px;
  font-size: 6px;
  border: 1px solid #aeaeae;
  border-radius: 50%;
  position: absolute;
  top: -6px;
  right: -6px;
  text-align: center;
  background: #333;
  color: #fff;
}

.container .base-box {
  padding: 80px 0 0 80px;
  background: #fff;
  height: 100%;
  position: relative;
  border: 1px solid #aeaeae;
}

.container .loadding {
  margin-bottom: 10px;
}

.container .upload {
  width: 80px;
  height: 80px;
  border: 1px dashed #aeaeae;
  text-align: center;
  float: left;
  margin-right: 30px;
  font-size: 16px;
}

.container .addBtn {
  margin-top: 10px;
}

.page {
  float: right;
  margin-top: -20px;
}
.content-war {
  margin-bottom: 15px;
}

.content-war span {
  font-size: 12px;
}

.content-war .content-war-div {
  display: inline-block;
}

.content-war .content-war-span {
  display: inline-block;
  width: 84px;
  height: 32px;
  line-height: 32px;
  text-align: right;
  margin-right: 14px;
}

.content-war p {
  margin-left: 100px;
  padding: 8px 0 0 0;
  color: #888;
}

.but,
.display-in-blo {
  display: inline-block;
}
.but .info {
  width: 60px;
  height: 60px;
  line-height: 60px;
}
/* 图片 */
.banner-img {
  list-style: none;
  overflow: hidden;
  margin-left: 100px;
}

.banner-img li {
  display: block;
  width: 100px;
  height: 100px;
  margin: 21px 21px 21px 0px;
  float: left;
  position: relative;
}

.banner-img li img {
  position: absolute;
  top: 0;
  right: 0;
}

.banner-img li div {
  position: absolute;
  height: 10px;
  width: 10px;
  top: -15px;
  right: 0;
  font-size: 18px;
}
/* .upload-img-but {
  float: right;
} */
</style>
