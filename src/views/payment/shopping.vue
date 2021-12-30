<template>
  <div class="container">
    <img-select ref="imgTem" @listentoptpmfile="listentoptpmfile" :options="{mode:'diy'}"></img-select>
    <div class="currentTitle">
      
    </div>
    <div class="redu-box">
      <div class="redu-inset">
        <Card>
          <Form :label-width="100" ref="reduForm" :model="reduForm" :rules="reduRule" style="border: 1px solid rgb(220, 220, 220)">
            <div class="redu-title">基本设置</div>
            <div class="inset-content">
              <FormItem label="店铺名称" prop="titles">
                <Input :maxlength="20" style="width: 300px;" v-model="reduForm.name" disabled></Input>
              </FormItem>
              <FormItem label="店铺编号" prop="time">
                <!--  v-model="reduForm.id" -->
                <span>{{reduForm.id}}</span>
<!--                <input v-model="reduForm.id" style="border: 0;width: 100px"></input>-->
<!--                <Button class="tag-read" style="border: 0;color: #2f54eb" :data-clipboard-text="reduForm.id">复制</Button>-->
              </FormItem>
              <FormItem label="创建时间" prop="smallProgram">
                <!-- v-model="reduForm.createTime" -->
                <span>{{reduForm.createTime}}</span>
              </FormItem>
              <FormItem label="店铺logo" prop="smallProgram">
                <!-- v-model="reduForm.appletThumb" -->
                <span><img :src="reduForm.appletThumb" style="width: 100px;height: 50px;verticalAlign:middle"/></span>
                <span>
                  <Button style="border: 0;color: #2f54eb" @click="openImg">修改</Button>
                </span>
              </FormItem>
              <FormItem label="店铺简介" prop="smallProgram">
                <Input type="textarea" :autosize="true" :maxlength="100" style="width: 300px" v-model="reduForm.description"></Input>
              </FormItem>
            </div>
            <div class="redu-title">店铺设置</div>
            <div class="inset-content">
              <FormItem label="购物门槛" prop="activityObject">
                <RadioGroup v-model="reduForm.shoppingThreshold">
                  <Radio :label="0">不限制</Radio>
                  <Radio :label="1" disabled>仅限会员</Radio>
                </RadioGroup>
                <div>开启购物门槛限制后，不满足条件用户将不可浏览店铺商品及购买</div>
              </FormItem>
              <FormItem label="购物车" prop="activityObject">
                <RadioGroup v-model="reduForm.isShowshopCart">
                  <Radio :label="1">开启</Radio>
                  <Radio :label="0" disabled>关闭</Radio>
                </RadioGroup>
                <div>关闭购物车后，商品仅支持单独购买并结算</div>
              </FormItem>
            </div>
            <div class="redu-title">商品设置</div>
            <div class="inset-content">
              <FormItem label="售罄商品" prop="activityObject">
                <RadioGroup v-model="reduForm.isShowGoodsSoldOut">
                  <Radio :label="1">展示</Radio>
                  <Radio :label="0" disabled>不展示</Radio>
                </RadioGroup>
                <div>展示后，售罄商品会在店铺中展示，并显示“已售罄”标记</div>
              </FormItem>
              <FormItem label="商品评价" prop="activityObject">
                <RadioGroup v-model="reduForm.isShowGoodsEvaluate">
                  <Radio :label="1">开启</Radio>
                  <Radio :label="0" disabled>关闭</Radio>
                </RadioGroup>
      <div>开启商品评价将在商品详情页对买家进行展示</div>
      </FormItem>
      </div>
      </Form>
      </Card>
      </div>
      <!--保存 取消 -->
      <div class="formBtn">
      <Button v-if="hasRole(6010101)" type="primary" class="comBtn" :loading="loading" @click.native="save">保存</Button>
      </div>
      </div>
      </div>
</template>

      <script>
    import admin from "@/api/request/admin";
    import api from "@/api/request";
    import goodsUtilsFun from "@/utils/goodsUtils";
    import imgSelect from  "@/components/imgSelect/imgSelect"

    export default {
      name: "shopping",
      components:{imgSelect},
      data() {
        return {
          loading: false,
          shopId:3,
          reduForm:{
            name:"",               //商铺名称
            id:"",                 //商品编号
            createTime:'',         //创建时间
            appletThumb:'',        //店铺logo
            description:'',        //店铺描述
            shoppingThreshold:'',  //购物门槛
            isShowshopCart:'',     //是否显示购物车
            isShowGoodsSoldOut:'', //是否显示售罄商品
            isShowGoodsEvaluate:'',//是否显示评价
          },
          reduRule:{

      },
    }
  },
  created() {
      this.shopDetail()
  },
  methods:{
    // //复制
    // copy() {
    //   var clipboard = new Clipboard('.tag-read')
    //   clipboard.on('success', e => {
    //     console.log('复制成功')
    //     // 释放内存
    //     clipboard.destroy()
    //   })
    //
    // },

    // 上传图片
    openImg(){
      this.$refs.imgTem.uploadflg()
    },
      //查询数据接口
      shopDetail(){
        console.log(admin)
        admin.shopSelShopDetail({
              shopId:12,
        }).then((res)=>{
            console.log(res)
            if(res.code == 1){
              this.shopId = res.data.shopId
              this.reduForm.name = res.data.name
              this.reduForm.id = res.data.id
              this.reduForm.createTime = goodsUtilsFun.timeFun(new Date(res.data.createTime).getTime())
              this.reduForm.appletThumb = res.data.appletThumb
              this.reduForm.description = res.data.description
              this.reduForm.shoppingThreshold = res.data.shoppingThreshold
              this.reduForm.isShowshopCart = res.data.isShowshopCart
              this.reduForm.isShowGoodsSoldOut = res.data.isShowGoodsSoldOut
              this.reduForm.isShowGoodsEvaluate = res.data.isShowGoodsEvaluate
            }else{

            }
        }).catch((err)=>{

        })
      },

    //修改数据接口
    editShop(params) {
      console.log(this.reduForm);
      this.loading = true
      admin.shopAdminUpdate({
        shopId: 3,
        // name: this.reduForm.name,
        id: this.reduForm.id,
        // createTime: this.reduForm.createTime,
        appletThumb: this.reduForm.appletThumb,
        description: this.reduForm.description,
        shoppingThreshold: this.reduForm.shoppingThreshold,
        isShowshopCart: this.reduForm.isShowshopCart,
        isShowGoodsSoldOut: this.reduForm.isShowGoodsSoldOut,
        isShowGoodsEvaluate: this.reduForm.isShowGoodsEvaluate,
        }).then(res => {
          this.loading = false
          if (res.code == 1) {
            this.$Message.success("修改成功");
            // this.backList();
          } else {
            this.$Message.error(res.message);
          }
        }).catch(err => {
          this.loading = false
          console.log(err)
        });
    },
    listentoptpmfile(data) {
      this.reduForm.appletThumb = data[0].imgAddress
    },
    save(){
      this.editShop()
     }
  },
};
</script>

<style scoped>
.container {
  position: relative;
}

.container .redu-box {
  padding: 0 20px 0 0 ;
}

.container .redu-inset {
  background: #fff;
}

.container .redu-title {
  height: 30px;
  line-height: 30px;
  color: #000;
  padding-left: 15px;
  background-color: #f2f2f2;
}

.container .inset-content {
  padding: 40px 0 30px 50px;
  background: #fff;
}
.currentTitle{
  font-size: 13px;
  padding: 4px 0;
  background: #f8fbfb;
  color: #000;
}
.container .formBtn {
  width: 150px;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}

.container .comBtn {
  margin: 0 5px;
}
</style>
