<template>
    <div>
        <Card class="basicmsg">
            <p slot="title">基本信息</p>

             <Form ref="roleForm" :model="roleForm" :rules="ruleCustom" :label-width="80">

                <FormItem label="角色名称" prop="name">
                    <Input v-model="roleForm.name" style="width:350px" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="描述" prop="username">
                    <Input type="textarea" v-model="roleForm.desc" style="width:350px;" placeholder="请输入描述"></Input>
                </FormItem>
            </Form>
            <div class="action">
                <Button class="btn-action" @click="cancelBtn">取消</Button>
                <Button class="btn-action" type="primary" @click="saveBtn('roleForm')" :loading="loading">确认</Button>
            </div>
        </Card>
    </div>
    
</template>

<script>
import system from '@/api/request/system'
export default {
    name:'rightControl',
    props:['options'],
    data () {
        return {
            loading:false,
            roleForm:{
                desc:'',
                name:''
            },
            ruleCustom:{
                name:{
                    required: true,
                    message: "角色名称不能为空",
                    trigger: "blur"
                }
            }
        }
    },
    mounted(){
        console.log(this.options)
        let _this = this
        _this.init()
    },

    methods: {
        init(){
            let _this = this
            let id = this.options.id
            console.log(id)
            system.roleDetail({
                id:id,
            }).then((res) => {
                _this.roleForm.name = res.name
                _this.roleForm.desc = res.description
            })
        },
        // 导出数据
        cancelBtn(){
            this.$emit('ToListenCancel')
        },

        // 保存按钮
        saveBtn(name){
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.saveRole()
                }
            });
        },

        // 提交数据
        saveRole(){
            let _this = this
            // 判断用户Id
            _this.loading=true
            console.log(_this.options.id)

            if(_this.options.id){
                system.updateRole({
                    id:_this.options.id,
                    name:_this.roleForm.name,
                    description:_this.roleForm.desc
                }).then((res) => {
                    if(res.code == 0){
                        _this.$Message.success(res.msg)
                        _this.loading=false;
                        _this.cancelBtn()
                        _this.$emit('toListenRefresh')
                    }else{
                        _this.loading=false;
                        _this.$Message.error(res.msg)
                    }
                })

            }else{
                system.createRole({
                    name:_this.roleForm.name,
                    description:_this.roleForm.desc
                }).then((res) => {
                    if(res.code == 0){
                        _this.$Message.success(res.msg)
                        _this.loading=false;
                        _this.cancelBtn()
                        _this.$emit('toListenRefresh')
                    }else{
                        _this.$Message.error(res.msg)
                        _this.loading=false;
                    }
                })
            }
            
        }
    },
}
</script>

<style scoped>
    .basicmsg{
        margin-bottom: 50px;
    }
    .basicmsg-item{
        margin-bottom: 20px;
    }
    .basicmsg-item span{
        margin-right: 25px;
        width: 20px;
    }
    .basicmsg-item:nth-child(3) span{
        margin-right: 50px;
    }
</style>
