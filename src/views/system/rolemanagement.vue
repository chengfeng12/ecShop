<style lang="less">
  @import './rolemanagement.less';
</style>
<template>
    <div class="role">
      <div class="currentTitle">角色管理</div>
       <Card :bordered="false">
            <p slot="title">
                <Button type="primary" v-if="hasRole(70101)" size="small" @click="addrole"  icon="md-add">添加新角色</Button>
                <!-- <Select style="width:200px" placeholder="状态">
                    <Option value="1" >启用</Option>
                    <Option value="2" >禁用</Option>
                </Select> -->
                <Input size="small" v-model="name" placeholder="输入角色名称搜索" />
                <Button type="primary" @click="search()" size="small" icon="ios-search">搜索</Button>
            </p>
                 <Table
                 :columns="columnsrole"
                 :data="roletabledata"
                 stripe border
                 ></Table>
                 <div class="roleaction">
                    <div  class="roleaction_r">
                        <Page 
                            :current="current" 
                            :total="total" 
                            :page-size="pageSize" 
                            show-sizer
                            :page-size-opts="[10,15,20]"
                            @on-page-size-change="pageSizeFun"
                            @on-change="changePage" 
                            :show-elevator="true" 
                            :show-total="true" />
                    </div>  
                 </div>
        </Card>
       
        <div class="roleedit" v-if="rightcontrolshow">
            <div class="roleeditcontent">
                <right-control @ToListenCancel="cancelBox" @toListenRefresh="refresh" :options="showOption"></right-control>   
            </div>
        </div>

        <div class="roleedit" v-if="roleShow">
            <div class="roleManageContent">
                <role-control @ToListenCancel="cancelRole" @toListenRefresh="refresh" :options="showOption"></role-control>   
            </div>
        </div>

        <Modal
            v-model="popupLower"
            title="确认提示"
            @on-ok="lowerOkFun"
            @on-cancel="reCancelFun"
            width="400px"
            :scrollable="false">
            <div class="popConWra">
                <i class="tips"></i>
                <span>是否确认删除该角色?</span>
            </div>
        </Modal>
       
    </div>
</template>
<script>
import store from "@/store";
import {asyncRoutes} from '@/router/router.js'
import rightControl from "./components/rightcontrol";
import roleControl from "./components/rolecontrol";
import system from '@/api/request/system'
export default {
    name:'rolemanagement',
    data() {
        return {
            current:1,
            name:"",
            pageSize:10,
            popupLower:false,
            currentId:'',
            total:0,
            showOption:{
                id:'',
                description:'',
                rolename:''

            },
            columnsrole: [
                {
                    title: '角色名称',
                    key: 'rolename'
                },
                {
                    title: '描述',
                    key: 'description'
                },
                {
                    title: '创建时间',
                    key: 'createtime'
                },
                {
                    title: '操作',
                    key:'action',
                       render: (h, params) => {
                        return h('div',{
                            style:{
                                display:'flex',
                                flexDirection:'row',
                                alignItems:'center',
                                color:'#0083b0'
                            }
                        },[
                            h('div', {
                                class:'cursorRole',
                                style:{
                                    'display': this.hasRole(70202) ?'block':'none',
                                },
                                on: {
                                    click: () => {
                                        this.editRole(params.row)
                                    }
                                }
                            },'编辑'),
                            h('div', {
                                class:'roleBtn cursorRole',
                                style:{
                                    // 'display': this.hasRole(70203) ?'block':'none',
                                },
                                on: {
                                    click: () => {
                                        this.roleManage(params.row.id)
                                    }
                                }
                            },'权限分配'),

                            h ('div', {
                                class:'cursorRole',
                                style:{
                                    'display': this.hasRole(70204) ?'block':'none',
                                },
                                on: {
                                    click: () => {
                                        this.removeRole(params.row.id)
                                    }
                                }
                            },'删除')
                        ])
                    },
                }
            ],
            roletabledata:[],
            rightcontrolshow:false,
            roleShow:false
        }
    },
    components:{
        rightControl,
        roleControl
    },
    created(){
        this.init()
    },
    methods: {
        init(){
            console.log("1213213")
            let _this = this
            system.getRoleList({
                name:this.name,
                size:this.pageSize,
                current:this.current,
            }).then((res) => {
                _this.total = res.total
                if(res.rows){
                    let newRole = []
                    res.rows.map((v,i) => {
                        let date = v.createDate ? v.createDate.substring(0,4) + '-' + v.createDate.substring(4,6) + '-' + v.createDate.substring(6,8) : ''
                        let time = v.createTime ? v.createTime.substring(0,2) + ':' + v.createTime.substring(2,4) + ':' + v.createTime.substring(4,6) : ''
                        newRole.push({
                            id:v.id,
                            rolename: v.name,
                            description: v.description,
                            state: v.status == "1" ? true : false,
                            createtime:date + ' ' + time
                        })
                    })
                    _this.roletabledata = newRole
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 查询
        search:function(){
            this.current=1,
            this.init()
        },
        stateFun:function(index){
            this.groupData[index].state = !this.groupData[index].state
        },
        addrole:function(){
            this.showOption = {
                id:''
            }
            this.rightcontrolshow = true
        },
        roleclose:function(){
            this.rightcontrolshow = false
        },
        // 删除角色
        removeRole(id){
            let _this = this
            console.log(id)
            _this.currentId = id
            console.log(_this.currentId)
            _this.popupLower = true
        },
        // 分页
        changePage(page){
            console.log(page)
           
            this.current = page
            this.init()
        },
        pageSizeFun(data) {
            this.pageSize = data
            this.init()
        },
        // 确认删除
        lowerOkFun(){
            let _this = this
            console.log(_this.currentId)
            system.delRote({
                id:_this.currentId
            }).then((res) => {
                console.log(res)
                if(res.code == 0){
                    _this.init()
                    _this.$Message.success(res.msg)
                }else{
                    _this.$Message.error(res.msg)
                }
            })
        },
        // 取消删除
        reCancelFun(){
            let _this = this
            _this.currentId = ''
            _this.popupLower = false
        },
        // 编辑用户
        editRole(data){
            console.log(data)
            let _this = this
            _this.rightcontrolshow = true

            _this.showOption = {
                id:data.id,
                rolename:data.rolename,
                description:data.description||""
            }

            console.log(_this.showOption)
        },
        cancelBox(){
            this.rightcontrolshow=false
        },
        roleManage(id){
            let _this = this
            this.roleShow = true
            _this.showOption = {
                id:id
            }
        },
        cancelRole(){
            this.roleShow = false
        },
        refresh(){
            this.init()
        }
    },  
}
</script>

