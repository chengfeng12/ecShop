<style lang="less">
@import './roleControl.less';
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
                            @click.prevent.native="checkOneAll(index)">{{item.label}}</Checkbox>
                    </div>
                    <div class="group-check" v-if="item.children">
                        <div class="group-secMainCheck" v-for="(role,roleix) in item.children" :key="roleix">
                            <div class="group-secCheck">
                                <Checkbox
                                :indeterminate="role.indeterminate"
                                :value="role.isCheckAll"
                                @click.prevent.native="checkTwoAll(index,roleix)">{{role.label}}</Checkbox>
                            </div>
                            <div class="group-thirCheck" v-if="role.children">
                                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" v-for="(rolet,roletix) in role.children" :key="roletix">
                                    <Checkbox :label="role.title + '_' + rolet.title">
                                        <span>{{rolet.label}}</span>
                                    </Checkbox>
                                </CheckboxGroup>
                            </div>

                            <div class="group-check-radio">
                                <RadioGroup v-model="item.roleRadio">
                                    <span @click="changeRadio(index,1)">
                                        <Radio label="1">
                                            <span>全部店铺</span>
                                        </Radio>
                                    </span>
                                    <span @click="changeRadio(index,2)">
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
                <Button class="btn-action" type="primary">确认</Button>
            </div>
        </Card>
    </div>
    
</template>

<script>

export default {
    name:'rightControl',
    data () {
        return {
            checkAllGroup:[],
            roleLists:[],
            rolemsg: [
                {
                    title: '商品',
                    id:1,
                    expand: true,
                    children: [
                        {
                            title: '商品列表',
                            id:2,
                            expand: true,
                            children: [
                                {
                                    id:3,
                                    title: '浏览列表'
                                },
                                {
                                    id:4,
                                    title: '查看详情'
                                },
                                {
                                    id:5,
                                    title: '添加'
                                },
                                {
                                    id:6,
                                    title: '编辑'
                                },
                                {
                                    id:7,
                                    title:'删除'
                                },
                                {
                                    id:8,
                                    title: '彻底删除'
                                },
                                {
                                    id:9,
                                    title: '放回仓库'
                                }
                            ]
                        },
                        {
                            title: '商品分类',
                            id:10,
                            expand: true,
                            children: [
                                {
                                    id:11,
                                    title: '添加'
                                },
                                {
                                    id:12,
                                    title: '编辑'
                                },
                                {   
                                    id:13,
                                    title:'删除'
                                }
                            ]
                        },
                        {
                            title: '商品组',
                            id:14,
                            expand: true,
                            children: [
                                {
                                    id:15,
                                    title: '添加'
                                },
                                {
                                    id:16,
                                    title: '修改'
                                },
                                {   
                                    id:17,
                                    title:'删除'
                                }
                            ]
                        },

                    ]
                },
                {
                    title: '用户',
                    id:18,
                    expand: true,
                    children: [
                        {
                            title: '用户列表',
                            id:19,
                            expand: true,
                            children: [
                                {
                                    id:20,
                                    title: '浏览列表'
                                },
                                {
                                    id:21,
                                    title: '查看详情'
                                },
                            ]
                        },
                    ]
                },
                // {
                //     title: '订单',
                //     expand: true,
                //     children: [
                //         {
                //             title: '订单列表',
                //             expand: true,
                //             children: [
                //                 {
                //                     id:
                //                     title: '浏览全部订单'
                //                 },
                //                 {
                //                     title: '浏览待发货订单'
                //                 },
                //                 {
                //                     title: '浏览待付款订单'
                //                 },
                //                 {
                //                     title: '浏览已完成订单'
                //                 },
                //                 {
                //                     title: '浏览已关闭订单'
                //                 },
                //                 {
                //                     title: '浏览已退货订单'
                //                 },
                //             ]
                //         },
                //     ]
                // }
            ]
        }
    },
    created(){
        this.init()
    },
    methods: {
        init(){
            this.calcData()
        },
        // 处理数据的逻辑处理
        calcData(){
            let roleLists = []
            // 生成最新的数组
            this.rolemsg.map((v,i) => {
                roleLists.push({
                    title:v.id,
                    label:v.title,
                    indeterminate:false,
                    isCheckAll:false,
                    roleRadio:'1',
                    children: v.children ? v.children.map((k,j) => {
                        return {
                            title:k.id,
                            label:k.title,
                            indeterminate:false,
                            isCheckAll:false,
                            children:k.children ? k.children.map((y,o) => {
                                return {
                                    title:y.id,
                                    label:y.title,
                                    select:false
                                }
                            }) : []
                        }
                    }) : []
                })
            })
            this.roleLists = roleLists
        },
        cancelBtn(){
            this.$emit('ToListenCancel')
        },
        // 点击一级全选
        checkOneAll(ix){
            let _this = this
            if(this.roleLists[ix].isCheckAll){
                _this.checkAllGroup = _this.uniqueAry(_this.checkAllGroup)
                this.roleLists[ix].isCheckAll = false
                this.roleLists[ix].children.map((v,i) => {
                    v.isCheckAll = false
                    let childLists = v.children
                    let title = v.title
                    childLists.map((k,j) => {
                        _this.checkAllGroup.map((o,p) => {
                            if(o == title + '_' + k.title){
                                k.select = false
                                _this.checkAllGroup.splice(p,1)
                            }
                        })
                    })
                })
            }else{
                this.roleLists[ix].isCheckAll = true
                this.roleLists[ix].children.map((v,i) => {
                    v.isCheckAll = true
                    let childLists = v.children
                    let title = v.title
                    childLists.map((k,j) => {
                        k.select = true
                        _this.checkAllGroup.push(title + '_' + k.title)
                    })
                })
            }
            

            _this.checkAllGroupChange(_this.checkAllGroup)
        },
        // 点击二级全选
        checkTwoAll(px,ix){
            let _this = this
            let childLists = this.roleLists[px].children[ix]
            if(childLists.isCheckAll){
                _this.checkAllGroup = _this.uniqueAry(_this.checkAllGroup)
                let title = childLists.title
                childLists.isCheckAll = false
                childLists.children.map((k,j) => {
                    _this.checkAllGroup.map((v,i) => {
                        if(v == title + '_' + k.title){
                            k.select = false
                            _this.checkAllGroup.splice(i,1)
                        }
                    })
                })
                
            }else{
                let title = childLists.title
                childLists.isCheckAll = true
                childLists.children.map((v,i) => {
                    v.select = true
                    _this.checkAllGroup.push(title + '_' + v.title)
                })
            }
            

            _this.checkAllGroupChange(_this.checkAllGroup)
            
        },
        // 监听按钮触发事件
        checkAllGroupChange (data) {
            console.log(data)
            let _this = this
            _this.calcData()
            _this.uniqueAry(_this.checkAllGroup)

            // 处理选择/取消三级权限
            if(data.length > 0){
                let currentData = []
                for (let i = 0; i < data.length; i++) {
                    let key = data[i].split('_')[0]
                    let value = data[i].split('_')[1]
                    currentData.push({
                        title:key,
                        value:value
                    })
                    for (let j = 0; j < _this.roleLists.length; j++) {
                        for (let k = 0; k < _this.roleLists[j].children.length; k++) {
                            // 判断是否某个一级下的二级是全选的
                            let rc = _this.roleLists[j].children[k]
                            let num = 0
                            for (let z = 0; z < currentData.length; z++) {
                                if(currentData[z].title == rc.title){
                                    num ++
                                }
                            }
                            if(num == '0'){
                                rc.indeterminate = false
                            }
                            if(rc.title == key){
                                // 三级循环
                                let isCheckAll = true
                                let isEmpty = true
                                for (let q = 0; q < rc.children.length; q++) {
                                    if(rc.children[q].title == value){
                                        rc.children[q].select = true
                                        _this.roleLists[j].indeterminate = true
                                    }
                                    if(!rc.children[q].select){
                                        isCheckAll = false
                                    }
                                }
                                if(isCheckAll){
                                    rc.isCheckAll = isCheckAll
                                    rc.indeterminate = false
                                }else{
                                    rc.isCheckAll = isCheckAll
                                    rc.indeterminate = true
                                }
                            }
                        }
                    }
                    // 判断是否全选
                    _this.isAllCheck(_this.roleLists)
                }
            }else{
                _this.roleLists.map((v,i) => {
                    // 二级循环
                    v.children.map((k,j) => {
                        // 三级循环
                        k.children.map((q,w) => {
                            q.select = false
                            k.indeterminate = false
                            v.indeterminate = false
                        })
                    })
                })
            }
        },

        // 判断是否全选
        isAllCheck(roleLists){
            let vlist = []
            roleLists.map((v,i) => {
                let vlength = v.children.length
                vlist.push({
                    id:i,
                    length:v.children.length,
                    checkList:[]
                })
                v.children.map((k,j) => {
                    if(k.isCheckAll){
                        vlist[i].checkList.push(k.isCheckAll)
                    }
                })
            })
            // 处理全选
            this.toCalCheck(vlist)
           
        },
        toCalCheck(vlist){
            let _this = this
            vlist.map((v,i) => {
                if(v.checkList.length == v.length){
                    _this.roleLists[v.id].isCheckAll = true
                    _this.roleLists[v.id].indeterminate = false
                }else{
                    _this.roleLists[v.id].isCheckAll = false
                }
            })
        },
        // 数组去重
        uniqueAry(arr){
            var x = new Set(arr);
            return [...x];
        },
        changeRadio(px,status){
            this.roleLists[px].roleRadio = '' + status
        }
       
    },
       
}
</script>
