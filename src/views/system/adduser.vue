<template>
    <div class="adduser">
        <div class="currentTitle" v-if="role == 1">用户管理/ 编辑用户</div>
        <div class="currentTitle" v-if="role == 2">用户管理/ 添加用户</div>
        <Card>
            <p title="基本信息"></p>
            <p>
                <div class="adduserform">
                    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                        <FormItem label="用户名" prop="username">
                            <Input :disabled="editflg" v-model="formCustom.username" placeholder="请输入用户名"></Input>
                            <span class="remark-span">不能输入系统现有用户相同用户名</span>
                        </FormItem>

                        <FormItem label="真实姓名" prop="name">
                            <Input v-model="formCustom.name" placeholder="请输入真实姓名" ></Input>
                        </FormItem>

                        <FormItem label="店员密码" prop="password">
                            <Input :disabled="editflg" type="password" placeholder="请输入密码" v-model="formCustom.password"></Input>
                        </FormItem>
                        <FormItem label="确认密码" prop="passwordCheck">
                            <Input :disabled="editflg" type="password" placeholder="请输入确认密码" v-model="formCustom.passwordCheck"></Input>
                        </FormItem>
<!-- 
                        <FormItem label="所属部门" placeholder="请选择所属部门" prop="dept">
                            <Input v-model="formCustom.dept"></Input>
                        </FormItem>
                          
                        <FormItem label="管理部门" prop="managedept"  placeholder="请选择管理部门">
                            <Input v-model="formCustom.managedept"></Input>
                        </FormItem>           -->
                        
                        <FormItem label="性别" prop="sex">
                            <Select v-model="formCustom.sex" placeholder="请选择性别">
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="出生日期" prop="birthday">
                            <DatePicker v-model="formCustom.birthday" @on-change="dataselect" type="date" placeholder="请选择出生日期" style="width: 200px"></DatePicker>
                        </FormItem>

                        <FormItem label="手机号码" placeholder="请输入手机号码" prop="mobile">
                            <Input v-model="formCustom.mobile"></Input>
                        </FormItem>

                        <FormItem label="邮箱" placeholder="请输入邮箱" prop="email">
                            <Input v-model="formCustom.email"></Input>
                        </FormItem>

                        <FormItem label="联系地址"  placeholder="请输入联系地址" prop="address">
                            <Input v-model="formCustom.address" :rows="6" type="textarea"/>
                        </FormItem>

                    </Form>
                </div>
                <div>
                    <Button
                        type="primary" 
                        :loading="loading"
                        @click="dataSave('formCustom')">
                    保存
                    </Button>
                    <Button @click="goback()">返回</Button>
                </div>
            </p>
        </Card>
    </div>
</template>
<script>
import system from '@/api/request/system'
export default {
    name:'adduser',
    
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.formCustom.passwordCheck !== '') {
                        // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField('passwordCheck');
                }
                    callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formCustom.password) {
                callback(new Error('两次密码不同'));
            } else {
                callback();
            }
        };
        return {
            loading:false,
            // 编辑项ID
            editId:'',
            // 当前状态
            role:'', 
            // 禁用状态
            editflg:false,

            formCustom: {

                username:'',

                name:'',
                
                password: '',
                
                passwordCheck: '',

                sex:'3',
                
                birthday:'',
                
                dept:1,
                
                managedept:1,

                mobile:'',

                email:'',
                
                address:'', 
            }, 

            ruleCustom: {

                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' },

                    { pattern: /^[a-zA-Z0-9_]{3,16}$/ , message: "请输入3-16为用户名，不可为中文、标点符号（除下划线）等", trigger: "blur"}
                ],

                name: [
                    { required: true, message: '真实姓名不能为空', trigger: 'blur' }
                   
                ],
                
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },

                    { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{15,30}$/, message: "请输入一个正确的密码格式，15到30位，数字和大小写字母组合", trigger: "blur"},
                    
                    // { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{15,30}$/, message: "请输入一个正确的密码格式，15到30位，数字和字母组合", trigger: "blur"},
                    { validator: validatePass, trigger: 'blur' }
                ],

                passwordCheck: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validatePassCheck, trigger: 'blur' }
                ],
            
                email:[
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, message: "请输入一个正确的邮箱格式", trigger: "blur"}
                ],
                
                address:[
                    { required: true, message: '联系地址不能为空', trigger: 'blur' },
                ],

                mobile: [
                    { required: true, message: '请输入11位手机号码', trigger: 'blur' },
                ]                
            }
        }
    },

    created(){
        this.fetchData()
    },

    methods: {
        
        // 保存验证
        dataSave:function(name){
                this.$refs[name].validate((valid) => {
                        if (valid) {
                            if(this.role=='1'){
                                this.loading=true;
                                this.editSave()
                            }
                            else{
                                this.loading=true;
                                this.addSave();    
                            }
                                
                        }
                })
        },
        // 新增保存
        addSave:function(){

                console.log("保存")

                system.saveUserData({

                    username:this.formCustom.username,

                    password:this.formCustom.password,

                    name:this.formCustom.name,

                    sex:this.formCustom.sex,

                    mobile:this.formCustom.mobile,

                    // status:this.formCustom.status,

                    deptId:1,

                    manageDeptId:1,

                    email:this.formCustom.email,

                    address:this.formCustom.address,

                    birthday:this.formCustom.birthday

                }).then((res) => {

                    if(res.code==0){
                        this.loading=false;
                        this.$Message.success(res.msg);

                        this.goback();  

                        console.log(res)

                    }

                    else{

                    this.$Message.error(res.msg);

                    }

                }).catch(error => {

                    console.log(error);
                    
                });
        },
        // 编辑保存
        editSave:function(){
            system.seveEditdata({

                id:this.editId,

                username:this.formCustom.username,

                name:this.formCustom.name,

                sex:String(this.formCustom.sex),

                mobile:this.formCustom.mobile,

                deptId:this.formCustom.dept,

                manageDeptId:this.formCustom.managedept,

                email:this.formCustom.email,

                address:this.formCustom.address,

                birthday:this.formCustom.birthday

            }).then((res) => {
                if(res.code==0){
                    this.loading=false;
                    this.$Message.success(res.msg);
                    this.goback();
                }
                else{
                   this.$Message.error(res.msg);  
                }
            }).catch(error => {
                console.log(error);
            });
        },
       //编辑获取数据
       getEditdatafuc:function(){
            system.getEditdata({
                id:this.editId
            }).then((res) => {
                console.log(res)
                    
                    this.formCustom.username=res.userInfo.username,

                    this.formCustom.name=res.userInfo.name,

                    this.formCustom.password="Qwert123456789123",
                    
                    this.formCustom.passwordCheck="Qwert123456789123",
                    
                    this.formCustom.sex=res.userInfo.sex
                    
                    if(typeof(res.userInfo.birthday)!=undefined){
                        this.formCustom.birthday=res.userInfo.birthday
                    } 

                    this.formCustom.mobile=res.userInfo.mobile,

                    this.formCustom.email=res.userInfo.email,
                    
                    this.formCustom.address=res.userInfo.address
               
            }).catch(error => {
                console.log(error);     
            });
       },

        //返回列表页
        goback:function(){
                this.$router.push({
                    path: "/@/views/system/usermanagement"
                });
        },
        //清空表单    
        clearfuc:function(){
                    this.formCustom.username='',

                    this.formCustom.name='',
                    
                    this.formCustom.password='',
                    
                    this.formCustom.passwordCheck='',

                    this.formCustom.sex='3',
                    
                    this.formCustom.birthday='',
                    
                    this.formCustom.dept='',
                    
                    this.formCustom.managedept='',

                    this.formCustom.mobile='',

                    this.formCustom.email='',
                    
                    this.formCustom.address='' 
        },
        // 生日选择日期
        dataselect:function(value){
            this.formCustom.birthday=value
        },
        // 判断状态1是编辑2是新增
        fetchData: function() {
            let querydata = this.$route.query;
            this.editId = querydata.id;
            this.role = querydata.role;
            if (this.role == '1') {
                this.editflg=true
                this.getEditdatafuc()
            } else if (this.role == '2') {
                this.clearfuc("reduForm");
            }
        } 
    },
    
    watch: {
        $route: "fetchData"
    }   
}
</script>

<style scoped>
    .adduser .adduserform{
        width: 100%;
        max-width: 600px;
    }
    .adduser .adduserform .remark-span{
        font-size: 12px;
        color: silver;
    }
</style>
