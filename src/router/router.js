import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main/main'
import parentView from '@/components/parentView/parentView'
import { Z_ASCII } from 'zlib';

Vue.use(Router)

// 不需要要权限的页面默认挂载
export default new Router({
    mode: 'hash',
    routes: [{
            path: '/',
            name: 'login',
            meta: {
                title: '登录',
                showrole: true,
                roles: "-2",
                level1: 'common',
            },
            component: () =>
                import ('@/views/login/login'),
        },

        {
            path: '/@/components/templatePage',
            name: 'templateComponents',
            meta: {
                title: '组件测试',
                showflg: true,
                showrole: true,
                roles: "-2",
                level1: 'common',
            },
            component: () =>
                import ('@/components/templatePage'),
        },

        {
            path: '/@/views/noaccess/noaccess',
            name: 'noaccess',
            meta: {
                title: '404',
                showflg: true,
                showrole: true,
                level1: 'common',
                roles: "-2"

            },
            component: () =>
                import ('@/views/noaccess/noaccess'),
        },


        // 概览相关
        {
            path: '/@/views/content/contentoverview/contentoverview',
            name: 'content',
            component: Main,
            meta: {
                title: '概览',
                showrole: true,
                showflg: true,
                roles: '-2',
                level1: "contentoverview_level",
            },
            children: [{
                path: '/@/views/content/contentoverview/contentoverview',
                name: 'contentoverview',
                meta: {
                    title: '概览详情',
                    showflg: true,
                    showrole: true,
                    roles: "-2",
                    level1: "contentoverview_level",
                    level2: "contentoverview"
                },
                component: () =>
                    import ('@/views/content/contentoverview/contentoverview'),
            }, ]
        },


        {
            path: '/@/views/goodslist/GoodsList',
            name: 'goods',
            component: Main,
            redirect: '/@/views/goodslist/GoodsList',
            meta: {
                title: '商品',
                showflg: true,
                roles: "1",
                level1: 'goods_level'
            },
            children: [{
                    path: '/@/views/goodslist/GoodsList',
                    name: 'goodsList',
                    meta: {
                        title: '商品列表',
                        showflg: true,
                        roles: "101",
                        level1: 'goods_level',
                        level2: 'goodsList',

                    },
                    component: () =>
                        import ('@/views/goodslist/GoodsList'),
                },
                // 列表按钮级
                {
                    path: '/@/views/goodsadd/GoodsAdd',
                    name: 'GoodsAdd',
                    meta: {
                        title: '添加/编辑/复制商品',
                        showflg: false,
                        roles: "10101",
                        level1: 'goods_level',
                        level2: 'goodsList',

                    },
                    component: () =>
                        import ('@/views/goodsadd/GoodsAdd'),
                },
                {
                    path: '/@/views/goodsadd/spec',
                    name: 'GoodsSpec',
                    meta: {
                        title: '规格设置',
                        showflg: false,
                        roles: "10102",
                        level1: 'goods_level',
                        level2: 'goodsList',

                    },
                    component: () =>
                        import ('@/views/goodsadd/goodsspec/SpecSetting'),
                },
                {
                    path: '',
                    name: '1010101',
                    meta: {
                        title: '商品上架/下架',
                        showflg: false,
                        roles: "1010101",
                        level1: 'goods_level',
                        level2: 'goodsList',
                    },
                },
                {
                    path: '',
                    name: '1010104',
                    meta: {
                        title: '商品删除',
                        showflg: false,
                        roles: "1010104",
                        level1: 'goods_level',
                        level2: 'goodsList',
                    },
                },
                {
                    path: '',
                    name: '1010105',
                    meta: {
                        title: '商品恢复',
                        showflg: false,
                        roles: "1010105",
                        level1: 'goods_level',
                        level2: 'goodsList',
                    },
                },


                // 分类
                {
                    path: '/@/views/goodsclassification/GoodsClassification',
                    name: 'GoodsClassification',
                    meta: {
                        title: '商品分类',
                        showflg: true,
                        roles: "102",
                        level1: 'goods_level',
                        level2: 'GoodsClassification'
                    },
                    component: () =>
                        import ('@/views/goodsclassification/GoodsClassification'),
                },

                {
                    path: '/@/views/goodsclassoperation/AddClass',
                    name: 'AddClass',
                    meta: {
                        title: '添加/编辑商品分类',
                        showflg: false,
                        roles: "10201",
                        level1: 'goods_level',
                        level2: 'GoodsClassification'
                    },
                    component: () =>
                        import ('@/views/goodsclassoperation/AddClass'),
                },
                {
                    path: '',
                    name: '1020102',
                    meta: {
                        title: '显示/隐藏商品分类',
                        showflg: false,
                        roles: "1020102",
                        level1: 'goods_level',
                        level2: 'GoodsClassification'
                    },

                },
                {
                    path: '',
                    name: '1020103',
                    meta: {
                        title: '商品分类删除',
                        showflg: false,
                        roles: "1020103",
                        level1: 'goods_level',
                        level2: 'GoodsClassification'
                    },

                },

                {
                    path: '/@/views/goodsgroup/GoodsGroup',
                    name: 'GoodsGroup',
                    meta: {
                        title: '商品分组',
                        showflg: true,
                        roles: "103",
                        level1: 'goods_level',
                        level2: 'GoodsGroup'
                    },
                    component: () =>
                        import ('@/views/goodsgroup/GoodsGroup'),
                },
                {
                    path: '/@/views/goodsgroup/AddGroup',
                    name: 'AddGroup',
                    meta: {
                        title: '添加/编辑商品组',
                        showflg: false,
                        roles: "10301",
                        level1: 'goods_level',
                        level2: 'GoodsGroup'
                    },
                    component: () =>
                        import ('@/views/goodsgroup/AddGroup'),
                },
                {
                    path: '',
                    name: '1030102',
                    meta: {
                        title: '商品组删除',
                        showflg: false,
                        roles: "1030102",
                        level1: 'goods_level',
                        level2: 'GoodsGroup',
                    },
                },
                {
                    path: '',
                    name: '1030103',
                    meta: {
                        title: '商品组启用/禁用',
                        showflg: false,
                        roles: "1030103",
                        level1: 'goods_level',
                        level2: 'GoodsGroup',
                    },
                },

            ]
        },

        // 用户相关
        {
            path: '/@/views/user/UserList',
            name: 'user',
            component: Main,
            meta: {
                title: '用户',
                roles: '2',
                level1: "user_level"
            },
            children: [{
                    path: '/@/views/user/UserList',
                    name: 'UserList',
                    meta: {
                        title: '用户列表',
                        showflg: true,
                        roles: "201",
                        level1: "user_level",
                        level2: "UserInfo"
                    },
                    component: () =>
                        import ('@/views/user/UserList'),
                },
                {
                    path: '/@/views/user/UserInfo',
                    name: 'UserInfo',
                    meta: {
                        title: '基本信息',
                        showflg: false,
                        roles: "20101",
                        level1: "user_level",
                        level2: 'UserInfo',
                    },
                    component: () =>
                        import ('@/views/user/UserInfo'),
                },
                // {
                //     path: '',
                //     name: '302',
                //     meta: {
                //         title: '订单记录',
                //         showflg: false,
                //         roles: "302",
                //         level1: 'user_level',
                //         level2: 'UserInfo'
                //     },
                // },
            ]
        },
        // 订单相关
        {
            path: '/@/views/order/OrderOverview',
            name: 'indent',
            component: Main,
            meta: {
                title: '订单',
                roles: '3',
                level1: "indent_level"
            },
            children: [{
                    path: '/@/views/order/OrderOverview',
                    name: 'OrderOverview',
                    meta: {
                        title: '订单概览',
                        showflg: true,
                        roles: "301",
                        level1: "indent_level",
                        level2: "OrderOverview_level"
                    },
                    component: () =>
                        import ('@/views/order/OrderOverview')
                },
                {
                    path: '',
                    name: '30101',
                    meta: {
                        title: '查看订单概览',
                        showflg: false,
                        roles: "30101",
                        level1: "indent_level",
                        level2: "OrderOverview_level"
                    },
                },
                {
                    path: '/@/views/order/OrderAdmin',
                    name: 'OrderAdmin',
                    meta: {
                        title: '全部订单',
                        showflg: true,
                        roles: "302",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },

                {
                    path: '/@/views/order/OrderInfo',
                    name: '30201',
                    meta: {
                        title: '查看订单详情',
                        showflg: false,
                        roles: "30201",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                    component: () =>
                        import ('@/views/order/OrderInfo'),
                },
                {
                    path: '',
                    name: '30202',
                    meta: {
                        title: '确认发货',
                        showflg: false,
                        roles: "30202",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },

                },
                {
                    path: '',
                    name: '30203',
                    meta: {
                        title: '确认付款',
                        showflg: false,
                        roles: "30203",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },

                },
                {
                    path: '',
                    name: '30204',
                    meta: {
                        title: '修改物流',
                        showflg: false,
                        roles: "30204",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },

                },

                {
                    path: '',
                    name: '30205',
                    meta: {
                        title: '备注',
                        showflg: false,
                        roles: "30205",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                },
                {
                    path: '',
                    name: '30206',
                    meta: {
                        title: '取消发货',
                        showflg: false,
                        roles: "30206",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                },
                {
                    path: '',
                    name: '30207',
                    meta: {
                        title: '修改价格',
                        showflg: false,
                        roles: "30207",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                },
                {
                    path: '',
                    name: '30208',
                    meta: {
                        title: '关闭订单',
                        showflg: false,
                        roles: "30208",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                },
                {
                    path: '',
                    name: '30209',
                    meta: {
                        title: '确认收货',
                        showflg: false,
                        roles: "30209",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                },
                {
                    path: '',
                    name: '30210',
                    meta: {
                        title: '修改订单收货信息',
                        showflg: false,
                        roles: "30210",
                        level1: "indent_level",
                        level2: "OrderAdmin_level"
                    },
                },



                {
                    path: '/@/views/order/OrderAdmin?status=1',
                    name: 'DropShippingOrders',
                    meta: {
                        title: '待发货',
                        showflg: true,
                        showrole: true,
                        roles: "302",
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },
                {
                    path: '/@/views/order/OrderAdmin?status=2',
                    name: 'WaitOrders',
                    meta: {
                        title: '待收货',
                        showflg: true,
                        showrole: true,
                        roles: "302",
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },
                {
                    path: '/@/views/order/OrderAdmin?status=0',
                    name: 'ObligationOrders',
                    meta: {
                        title: '待付款',
                        showflg: true,
                        showrole: true,
                        roles: "302",
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },
                {
                    path: '/@/views/order/OrderAdmin?status=3',
                    name: 'FinishOrders',
                    meta: {
                        title: '已完成',
                        showflg: true,
                        roles: "302",
                        showrole: true,
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },
                {
                    path: '/@/views/order/OrderAdmin?status=8',
                    name: 'CloseOrders',
                    meta: {
                        title: '已关闭',
                        showflg: true,
                        showrole: true,
                        roles: "302",
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },
                {
                    path: '/@/views/order/OrderAdmin?status=5',
                    name: 'ApplyOrders',
                    meta: {
                        title: '维权申请',
                        showflg: false,
                        showrole: true,
                        roles: "302",
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },
                {
                    path: '/@/views/order/OrderAdmin?status=6',
                    name: 'UygurPowerOrder',
                    meta: {
                        title: '维权订单',
                        showflg: false,
                        showrole: true,
                        roles: "302",
                        level1: "indent_level",

                    },
                    component: () =>
                        import ('@/views/order/OrderAdmin'),
                },


            ]
        },


        // 运营相关
        {
            path: '/@/views/operation/operationAll',
            name: 'operation',
            redirect: '/@/views/operation/operationAll',
            component: Main,
            meta: {
                title: '运营',
                level1: "operation_level",
                roles: "8"
            },
            children: [{
                    path: '/@/views/operation',
                    name: 'LetterOperation',
                    meta: {
                        title: '定制服务',
                        showflg: true,
                        showrole: true,
                        level1: "operation_level",
                        roles: "-2"
                    },
                    component: parentView,

                    children: [{
                            path: '/@/views/operation/operationAll',
                            name: 'Letter',
                            meta: {
                                title: '刻字服务',
                                showflg: true,
                                level1: "operation_level",
                                level2: "Letter_level",
                                roles: "801",
                            },
                            component: () =>
                                import ('@/views/operation/Operation')
                        },

                        {
                            path: '',
                            name: '80101',
                            meta: {
                                title: '删除样图',
                                showflg: false,
                                level1: "operation_level",
                                level2: "Letter_level",
                                roles: "80101",
                            },
                        },
                        {
                            path: '/@/views/operation/oadd',
                            name: 'add',
                            meta: {
                                title: '添加样图/编辑样图',
                                showflg: false,
                                level1: "operation_level",
                                level2: "Letter_level",
                                roles: "80102",
                            },
                            component: () =>
                                import ('@/views/operation/oadd')
                        },
                        {
                            path: '',
                            name: '80103',
                            meta: {
                                title: '保存基本信息',
                                showflg: false,
                                level1: "operation_level",
                                level2: "Letter_level",
                                roles: "80103",
                            },
                        },
                        {
                            path: '/@/views/lettering/letteringcard',
                            name: 'letteringcard',
                            meta: {
                                title: '定制卡片',
                                showflg: true,
                                level1: "operation_level",
                                level2: 'letteringcard_level',
                                roles: "802",
                            },
                            component: () =>
                                import ('@/views/lettering/letteringcard')
                        },
                        {
                            path: '',
                            name: '80201',
                            meta: {
                                title: '定制卡片删除',
                                showflg: false,
                                roles: "80201",
                                level1: 'operation_level',
                                level2: 'letteringcard_level'
                            },
                        },
                        {
                            path: '/@/views/lettering/addCard',
                            name: 'addCard',
                            meta: {
                                title: '添加/编辑定制卡片',
                                level1: "operation_level",
                                level2: 'letteringcard_level',
                                roles: "80202",
                            },
                            component: () =>
                                import ('@/views/lettering/addCard')
                        },
                        {
                            path: '/@/views/lettering/letteringspecial',
                            name: 'letteringspecial',
                            meta: {
                                title: '特殊封套',
                                showflg: true,
                                level1: "operation_level",
                                level2: 'letteringspecial_level',
                                roles: "803",
                            },
                            component: () =>
                                import ('@/views/lettering/letteringspecial')
                        },
                        {
                            path: '/@/views/lettering/addSpecial',
                            name: 'addSpecial',
                            meta: {
                                title: '添加/编辑特殊封套',
                                showflg: false,
                                level1: "operation_level",
                                level2: 'letteringspecial_level',
                                roles: "80301",
                            },
                            component: () =>
                                import ('@/views/lettering/addSpecial')
                        },
                        {
                            path: '',
                            name: '80302',
                            meta: {
                                title: '删除特殊封套',
                                showflg: false,
                                roles: "80302",
                                level1: 'operation_level',
                                level2: 'letteringspecial_level'

                            },
                        },
                        {
                            path: '/@/views/lettering/letteringbox',
                            name: 'letteringbox',
                            meta: {
                                title: '包装盒',
                                showflg: true,
                                level1: "operation_level",
                                level2: "letteringbox_level",
                                roles: "80401",
                            },
                            component: () =>
                                import ('@/views/lettering/letteringbox')
                        },
                        {
                            path: '/@/views/lettering/addBox',
                            name: 'addBox',
                            meta: {
                                title: '添加/编辑包装盒',
                                showflg: false,
                                level1: "operation_level",
                                level2: "letteringbox_level",
                                roles: "80402",
                            },
                            component: () =>
                                import ('@/views/lettering/addBox')
                        },

                        {
                            path: '',
                            name: '80403',
                            meta: {
                                title: '删除包装盒',
                                showflg: false,
                                roles: "80403",
                                level1: 'operation_level',
                                level2: 'letteringbox_level'
                            },
                        },
                    ]
                },

                {
                    path: '/@/views/lettering',
                    name: 'letteringword',
                    meta: {
                        title: '卡片寄语',
                        showflg: true,
                        showrole: true,
                        roles: "-2",
                        level1: "operation_level",
                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/lettering/letteringword',
                            name: 'letteringwordadd',
                            meta: {
                                title: '卡片寄语',
                                showflg: true,
                                roles: "80501",
                                level1: "operation_level",
                                level2: "letteringwordadd_level",
                            },
                            component: () =>
                                import ('@/views/lettering/letteringword')
                        },
                        {
                            path: '',
                            name: '80502',
                            meta: {
                                title: '保存卡片寄语',
                                showflg: false,
                                roles: "80502",
                                level1: "operation_level",
                                level2: "letteringwordadd_level",
                            },
                        }

                    ]
                }

            ]
        },


        // 营销相关
        {
            path: '/@/views/marking/full/FullReduction',
            name: 'marking',
            component: Main,
            redirect: '/@/views/marking/full/FullReduction',
            meta: {
                title: '营销',
                roles: "4",
                level1: "marking_level"
            },
            children: [{
                    path: '/@/views/marking',
                    name: 'baseMarketing',
                    meta: {
                        title: '基本营销',
                        roles: "-2",
                        showrole: true,
                        level1: "marking_level",

                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/marking/full/FullReduction',
                            name: 'full',
                            meta: {
                                title: '满额立减',
                                showflg: true,
                                roles: "40101",
                                level1: "marking_level",
                                level2: "full_level"
                            },
                            component: () =>
                                import ('@/views/marking/full/FullReduction'),
                        },

                        {
                            path: '/@/views/marking/full/components/CreateReduction',
                            name: 'CreateReduction',
                            meta: {
                                title: '新增满额立减',
                                showflg: false,
                                roles: "40103",
                                level1: "marking_level",
                                level2: "full_level"
                            },
                            component: () =>
                                import ('@/views/marking/full/components/CreateReduction'),
                        },
                        {
                            path: '/@/views/marking/full/components/EditReduction',
                            name: 'EditReduction',
                            meta: {
                                title: '编辑满额立减',
                                showflg: false,
                                roles: "40104",
                                level1: "marking_level",
                                level2: "full_level"
                            },
                            component: () =>
                                import ('@/views/marking/full/components/EditReduction'),
                        },

                        {
                            path: '',
                            name: '4010401',
                            meta: {
                                title: '删除满额立减',
                                showflg: false,
                                roles: "4010401",
                                level1: "marking_level",
                                level2: "full_level"
                            },
                        },
                        {
                            path: '',
                            name: '4010402',
                            meta: {
                                title: '启用/禁用满额立减',
                                showflg: false,
                                roles: "4010402",
                                level1: "marking_level",
                                level2: "full_level"
                            },
                        },





                        {
                            path: '/@/views/marking/discount/Discount',
                            name: 'discount',
                            meta: {
                                title: '限时折扣',
                                showflg: true,
                                roles: "40102",
                                level1: "marking_level",
                                level2: "discount_level"
                            },
                            component: () =>
                                import ('@/views/marking/discount/Discount'),
                        },

                        {
                            path: '/@/views/marking/discount/components/CreateDiscount',
                            name: 'CreateDiscount',
                            meta: {
                                title: '新增限时折扣',
                                showflg: false,
                                roles: "40105",
                                level1: "marking_level",
                                level2: "discount_level"
                            },
                            component: () =>
                                import ('@/views/marking/discount/components/CreateDiscount'),
                        },
                        {
                            path: '/@/views/marking/discount/components/EditDiscount',
                            name: 'EditDiscount',
                            meta: {
                                title: '编辑限时折扣',
                                showflg: false,
                                roles: "40106",
                                level1: "marking_level",
                                level2: "discount_level"
                            },
                            component: () =>
                                import ('@/views/marking/discount/components/EditDiscount'),
                        },

                        {
                            path: '',
                            name: '4010601',
                            meta: {
                                title: '启用/禁用限时折扣',
                                showflg: false,
                                roles: "4010601",
                                level1: "marking_level",
                                level2: "discount_level"
                            },
                        },
                        {
                            path: '',
                            name: '4010602',
                            meta: {
                                title: '删除限时折扣',
                                showflg: false,
                                roles: "4010602",
                                level1: "marking_level",
                                level2: "discount_level"
                            },
                        },


                        {
                            path: '/@/views/marking/mealshop/MealShop',
                            name: 'MealShop',
                            meta: {
                                title: '套餐商品',
                                showflg: true,
                                roles: '40110',
                                level1: "marking_level",
                                level2: "MealShop_level"
                            },
                            component: () =>
                                import ('@/views/marking/mealshop/MealShop'),
                        },

                        {
                            path: '/@/views/marking/mealshop/components/AddMeal',
                            name: 'AddRuleGoods',
                            meta: {
                                title: '套餐商品添加/编辑',
                                showflg: false,
                                roles: "40111",
                                level1: "marking_level",
                                level2: "MealShop_level"
                            },
                            component: () =>
                                import ('@/views/marking/mealshop/components/AddMeal'),
                        },

                        {
                            path: '',
                            name: '4011101',
                            meta: {
                                title: '编辑套餐商品',
                                showflg: false,
                                roles: "4011101",
                                level1: "marking_level",
                                level2: "MealShop_level"
                            },
                        },

                        {
                            path: '',
                            name: '4011102',
                            meta: {
                                title: '复制套餐商品',
                                showflg: false,
                                roles: "4011102",
                                level1: "marking_level",
                                level2: "MealShop_level"
                            },
                        },

                        {
                            path: '',
                            name: '4011103',
                            meta: {
                                title: '删除套餐商品',
                                showflg: false,
                                roles: "4011103",
                                level1: "marking_level",
                                level2: "MealShop_level"
                            },
                        },




                        {
                            path: '/@/views/marking/regularcommodities/RegularCommodities',
                            name: 'RegularCommodities',
                            meta: {
                                title: '规则商品',
                                showflg: true,
                                roles: '40107',
                                level1: "marking_level",
                                level2: "RegularCommodities_level"
                            },
                            component: () =>
                                import ('@/views/marking/regularcommodities/RegularCommodities'),
                        },
                        {
                            path: '/@/views/marking/regularcommodities/components/AddRuleGoods',
                            name: 'AddRuleGoods',
                            meta: {
                                title: '规则商品添加/编辑',
                                showflg: false,
                                roles: "40108",
                                level1: "marking_level",
                                level2: "RegularCommodities_level"
                            },
                            component: () =>
                                import ('@/views/marking/regularcommodities/components/AddRuleGoods'),
                        },

                        {
                            path: '',
                            name: '4010802',
                            meta: {
                                title: '规则商品复制',
                                showflg: false,
                                roles: "4010802",
                                level1: "marking_level",
                                level2: "RegularCommodities_level"
                            }
                        },
                        {
                            path: '',
                            name: '4010803',
                            meta: {
                                title: '规则商品删除',
                                showflg: false,
                                roles: "4010803",
                                level1: "marking_level",
                                level2: "RegularCommodities_level"
                            }
                        },


                        {
                            path: '/@/views/marking/friendspayforit/FriendsPayForIt',
                            name: 'RegularFriendsPayForItCommodities',
                            meta: {
                                title: '朋友代付',
                                showflg: true,
                                roles: "40109",
                                level1: "marking_level",
                                level2: "FriendsPayForIt_level"
                            },
                            component: () =>
                                import ('@/views/marking/friendspayforit/FriendsPayForIt'),
                        },
                        {
                            path: '',
                            name: '4010901',
                            meta: {
                                title: '保存朋友代付',
                                showflg: false,
                                roles: "4010901",
                                level1: "marking_level",
                                level2: "FriendsPayForIt_level"
                            }
                        },
                    ]
                },


                {
                    path: '@/views/marking/purchase/Purchase',
                    name: 'adhibition_c14',
                    meta: {
                        title: '赠品管理',
                        showflg: true,
                        showrole: true,
                        roles: "-2",
                        level1: "marking_level",

                    },

                    component: parentView,
                    children: [{
                            path: '/@/views/marking/purchase/Purchase',
                            name: 'Purchase',
                            meta: {
                                title: '首购礼',
                                showflg: true,
                                roles: "40201",
                                level1: "marking_level",
                                level2: "Purchase_level"
                            },
                            component: () =>
                                import ('@/views/marking/purchase/Purchase'),
                        },
                        {
                            path: '/@/views/marking/purchase/components/CreatePurchase',
                            name: 'CreatePurchase',
                            meta: {
                                title: '新增首购礼',
                                showflg: false,
                                roles: "40205",
                                level1: "marking_level",
                                level2: "Purchase_level"
                            },
                            component: () =>
                                import ('@/views/marking/purchase/components/CreatePurchase'),
                        },
                        {
                            path: '/@/views/marking/purchase/components/EditPurchase',
                            name: 'EditPurchase',
                            meta: {
                                title: '编辑首购礼',
                                showflg: false,
                                roles: "40206",
                                level1: "marking_level",
                                level2: "Purchase_level"
                            },
                            component: () =>
                                import ('@/views/marking/purchase/components/EditPurchase'),
                        },
                        {
                            path: '',
                            name: '4020601',
                            meta: {
                                title: '编辑首购礼',
                                showflg: false,
                                roles: "4020601",
                                level1: "marking_level",
                                level2: "Purchase_level"
                            },
                        },
                        {
                            path: '',
                            name: '4020602',
                            meta: {
                                title: '编辑首购礼',
                                showflg: false,
                                roles: "4020602",
                                level1: "marking_level",
                                level2: "Purchase_level"
                            },
                        },


                        {
                            path: '/@/views/marking/give/Give',
                            name: 'Give',
                            meta: {
                                title: '满赠礼',
                                showflg: true,
                                roles: "40202",
                                level1: "marking_level",
                                level2: "Give_level"
                            },
                            component: () =>
                                import ('@/views/marking/give/Give'),
                        },

                        {
                            path: '/@/views/marking/give/components/CreateGive',
                            name: 'CreateGive',
                            meta: {
                                title: '新增满赠礼',
                                showflg: false,
                                roles: "40207",
                                level1: "marking_level",
                                level2: "Give_level"
                            },
                            component: () =>
                                import ('@/views/marking/give/components/CreateGive'),
                        },

                        {
                            path: '/@/views/marking/give/components/EditGive',
                            name: 'EditGive',
                            meta: {
                                title: '编辑满增礼',
                                showflg: false,
                                roles: "40208",
                                level1: "marking_level",
                                level2: "Give_level"
                            },
                            component: () =>
                                import ('@/views/marking/give/components/EditGive'),
                        },
                        {
                            path: '',
                            name: '4020801',
                            meta: {
                                title: '启用满增礼',
                                showflg: false,
                                roles: "4020801",
                                level1: "marking_level",
                                level2: "Give_level"
                            },
                        },
                        {
                            path: '',
                            name: '4020802',
                            meta: {
                                title: '删除满增礼',
                                showflg: false,
                                roles: "4020802",
                                level1: "marking_level",
                                level2: "Give_level"
                            },
                        },


                        {
                            path: '/@/views/marking/give/SelectGive',
                            name: 'SelectGive',
                            meta: {
                                title: '选赠礼',
                                showflg: true,
                                roles: "402099",
                                level1: "marking_level",
                                level2: "SelectGive_level"
                            },
                            component: () =>
                                import ('@/views/marking/give/SelectGive'),
                        },

                        {
                            path: '/@/views/marking/give/SelectGive/CreateGive',
                            name: 'SelectCreateGive',
                            meta: {
                                title: '新增选赠礼',
                                showflg: false,
                                roles: "4020100",
                                level1: "marking_level",
                                level2: "SelectGive_level"
                            },
                            component: () =>
                                import ('@/views/marking/give/SelectGive/CreateGive'),
                        },
                        {
                            path: '/@/views/marking/give/SelectGive/EditGive',
                            name: 'EditGive',
                            meta: {
                                title: '编辑选增礼',
                                showflg: false,
                                roles: "4020101",
                                level1: "marking_level",
                                level2: "SelectGive_level"
                            },
                            component: () =>
                                import ('@/views/marking/give/SelectGive/EditGive'),
                        },
                        {
                            path: '',
                            name: '4020801',
                            meta: {
                                title: '启用选增礼',
                                showflg: false,
                                roles: "4020102",
                                level1: "marking_level",
                                level2: "SelectGive_level"
                            },
                        },
                        {
                            path: '',
                            name: '4020103',
                            meta: {
                                title: '删除选增礼',
                                showflg: false,
                                roles: "4020103",
                                level1: "marking_level",
                                level2: "SelectGive_level"
                            },
                        },


                        {
                            path: '/@/views/marking/GiftPresentation/GiftPresentation',
                            name: 'GiftPresentation',
                            meta: {
                                title: '单品赠礼',
                                showflg: true,
                                roles: "40203",
                                level1: "marking_level",
                                level2: "GiftPresentation_level"
                            },
                            component: () =>
                                import ('@/views/marking/GiftPresentation/GiftPresentation'),
                        },

                        {
                            path: '/@/views/marking/GiftPresentation/components/CreateGift',
                            name: 'CreateGift',
                            meta: {
                                title: '新增单品赠礼',
                                showflg: false,
                                roles: "40209",
                                level1: "marking_level",
                                level2: "GiftPresentation_level"
                            },
                            component: () =>
                                import ('@/views/marking/GiftPresentation/components/CreateGift'),
                        },


                        {
                            path: '/@/views/marking/GiftPresentation/components/EditGift',
                            name: 'EditGift',
                            meta: {
                                title: '编辑单品赠礼',
                                showflg: false,
                                roles: "40210",
                                level1: "marking_level",
                                level2: "GiftPresentation_level"
                            },
                            component: () =>
                                import ('@/views/marking/GiftPresentation/components/EditGift'),
                        },
                        {
                            path: '',
                            name: 'EditG4021001ift',
                            meta: {
                                title: '启用单品赠礼',
                                showflg: false,
                                roles: "4021001",
                                level1: "marking_level",
                                level2: "GiftPresentation_level"
                            },
                        },
                        {
                            path: '/@/views/marking/GiftPresentation/components/EditGift',
                            name: 'EditGift',
                            meta: {
                                title: '删除单品赠礼',
                                showflg: false,
                                roles: "4021002",
                                level1: "marking_level",
                                level2: "GiftPresentation_level"
                            },
                            component: () =>
                                import ('@/views/marking/GiftPresentation/components/EditGift'),
                        },



                        {
                            path: '/@/views/marking/Verification/Verification',
                            name: 'Verification',
                            meta: {
                                title: '验证码赠礼',
                                showflg: true,
                                roles: "40204",
                                level1: "marking_level",
                                level2: "Verification_level"
                            },
                            component: () =>
                                import ('@/views/marking/Verification/Verification'),
                        },

                        {
                            path: '/@/views/marking/Verification/components/CreateCode',
                            name: 'CreateCode',
                            meta: {
                                title: '新增/编辑验证码赠礼',
                                showflg: false,
                                roles: "40211",
                                level1: "marking_level",
                                level2: "Verification_level"
                            },
                            component: () =>
                                import ('@/views/marking/Verification/components/CreateCode'),
                        },

                        {
                            path: '',
                            roles: "40212",
                            name: 'CreateCode',
                            meta: {
                                title: '删除验证码赠礼',
                                showflg: false,
                                roles: "40212",
                                level1: "marking_level",
                                level2: "Verification_level"
                            },
                        },


                        {
                            path: '',
                            name: '40213',
                            meta: {
                                title: '开启/禁用验证码赠礼',
                                showflg: false,
                                roles: "40213",
                                level1: "marking_level",
                                level2: "Verification_level"
                            },

                        },
                    ]
                },

                {
                    path: '@/views/coupon/coupon/Coupon',
                    name: 'Coupon_parent',
                    meta: {
                        title: '优惠券管理',
                        showflg: true,
                        showrole: true,
                        roles: "-2",
                        level1: "marking_level"
                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/coupon/coupon/Coupon',
                            name: 'Coupon',
                            meta: {
                                title: '全部优惠券',
                                showflg: true,
                                roles: "40301",
                                level1: "marking_level",
                                level2: "Coupon_level"

                            },
                            component: () =>
                                import ('@/views/coupon/coupon/Coupon'),
                        },
                        {
                            path: '/@/views/coupon/coupon/components/AddingCoupons',
                            name: 'AddingCoupons',
                            meta: {
                                title: '新增/编辑优惠券',
                                showflg: false,
                                roles: "4030700",
                                level1: "marking_level",
                                level2: "Coupon_level"
                            },
                            component: () =>
                                import ('@/views/coupon/coupon/components/AddingCoupons'),
                        },

                        {
                            path: '',
                            name: '4030702',
                            meta: {
                                title: '启用或禁用优惠券',
                                showflg: false,
                                roles: "4030702",
                                level1: "marking_level",
                                level2: "Coupon_level"
                            },
                        },
                        {
                            path: '',
                            name: '4030703',
                            meta: {
                                title: '删除优惠券',
                                showflg: false,
                                roles: "4030703",
                                level1: "marking_level",
                                level2: "Coupon_level"
                            },
                        },

                        {
                            path: '/@/views/coupon/voucher/NewVoucher',
                            name: 'NewVoucher',
                            meta: {
                                title: '新人发券',
                                showflg: true,
                                roles: "40302",
                                level1: "marking_level",
                                level2: "NewVoucher_level"
                            },
                            component: () =>
                                import ('@/views/coupon/voucher/NewVoucher'),
                        },

                        {
                            path: '',
                            name: '4030201',
                            meta: {
                                title: '保存新人发券',
                                showflg: false,
                                roles: "4030201",
                                level1: "marking_level",
                                level2: "NewVoucher_level"
                            }
                        },

                        {
                            path: '/@/views/coupon/FullCoupon/FullCoupon',
                            name: 'FullCoupon',
                            meta: {
                                title: '满额发券',
                                showflg: true,
                                roles: "40303",
                                level1: "marking_level",
                                level2: "FullCoupon_level"
                            },
                            component: () =>
                                import ('@/views/coupon/FullCoupon/FullCoupon'),
                        },
                        {
                            path: '/@/views/coupon/FullCoupon/components/addFull',
                            name: 'addFull',
                            meta: {
                                title: '新增/编辑满额发券',
                                showflg: false,
                                roles: "40308",
                                level1: "marking_level",
                                level2: "FullCoupon_level"
                            },
                            component: () =>
                                import ('@/views/coupon/FullCoupon/components/addFull'),
                        },

                        // {
                        //     path: '',
                        //     name: '4030801',
                        //     meta: {
                        //         title: '编辑满额发券',
                        //         showflg: false,
                        //         roles: "4030801",
                        //         level1: "marking_level",
                        //         level2: "FullCoupon_level"
                        //     },
                        // },
                        {
                            path: '',
                            name: '4030802',
                            meta: {
                                title: '启用/禁用满额发券',
                                showflg: false,
                                roles: "4030802",
                                level1: "marking_level",
                                level2: "FullCoupon_level"
                            },
                        },
                        {
                            path: '',
                            name: '4030803',
                            meta: {
                                title: '删除满额发券',
                                showflg: false,
                                roles: "4030803",
                                level1: "marking_level",
                                level2: "FullCoupon_level"
                            },
                        },




                        {
                            path: '/@/views/coupon/shopvoucher/ShopVoucher',
                            name: 'ShopVoucher',
                            meta: {
                                title: '购物发券',
                                showflg: true,
                                roles: "40304",
                                level1: "marking_level",
                                level2: "ShopVoucher_level"
                            },
                            component: () =>
                                import ('@/views/coupon/shopvoucher/ShopVoucher'),
                        },

                        {
                            path: '/@/views/coupon/shopvoucher/components/AddShop',
                            name: 'AddShop',
                            meta: {
                                title: '新增/编辑购物发券',
                                showflg: false,
                                roles: "4030401",
                                level1: "marking_level",
                                level2: "ShopVoucher_level"
                            },
                            component: () =>
                                import ('@/views/coupon/shopvoucher/components/AddShop'),
                        },

                        {
                            path: '',
                            name: '4031101',
                            meta: {
                                title: '启用/禁用购物发券',
                                showflg: false,
                                roles: "4031101",
                                level1: "marking_level",
                                level2: "ShopVoucher_level"
                            },
                        },

                        {
                            path: '',
                            name: '4031102',
                            meta: {
                                title: '删除购物发券',
                                showflg: false,
                                roles: "4031102",
                                level1: "marking_level",
                                level2: "ShopVoucher_level"
                            },
                        },


                        {
                            path: '/@/views/coupon/ShouVoucher/ShouVoucher',
                            name: 'ShouVoucher',
                            meta: {
                                title: '手工发券',
                                showflg: true,
                                roles: "40305",
                                level1: "marking_level",
                                level2: "ShouVoucher_level"
                            },
                            component: () =>
                                import ('@/views/coupon/ShouVoucher/ShouVoucher'),
                        },
                        {
                            path: '/@/views/coupon/ShouVoucher/components/AddShou',
                            name: 'AddShou',
                            meta: {
                                title: '新增/编辑手动发券',
                                showflg: false,
                                roles: "40312",
                                level1: "marking_level",
                                level2: "ShouVoucher_level"
                            },
                            component: () =>
                                import ('@/views/coupon/ShouVoucher/components/AddShou'),
                        },
                        {
                            path: '',
                            name: '4031301',
                            meta: {
                                title: '改变手动发券状态',
                                showflg: false,
                                roles: "4031301",
                                level1: "marking_level",
                                level2: "ShouVoucher_level"
                            },
                        },
                        {
                            path: '',
                            name: '4031302',
                            meta: {
                                title: '删除手动发券',
                                showflg: false,
                                roles: "4031302",
                                level1: "marking_level",
                                level2: "ShouVoucher_level"
                            },

                        },

                        {
                            path: '/@/views/coupon/record/Record',
                            name: 'Record',
                            meta: {
                                title: '发放记录',
                                showflg: true,
                                roles: "4030601",
                                level1: "marking_level",
                                level2: "Record_level"
                            },
                            component: () =>
                                import ('@/views/coupon/record/Record'),
                        },
                        {
                            path: '',
                            name: '4030601',
                            meta: {
                                title: '查看发放记录',
                                showflg: false,
                                roles: "4030601",
                                level1: "marking_level",
                                level2: "Record_level"
                            },
                        },
                    ]
                },

                {
                    path: '/@/views/coupon/luckdraw/LuckDraw',
                    name: 'LuckDrawlist',
                    meta: {
                        title: '抽奖有礼',
                        showflg: true,
                        showrole: true,
                        roles: "-2",
                        level1: "marking_level",
                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/coupon/luckdraw/luckdraw',
                            name: 'LuckDraw',
                            meta: {
                                title: '活动列表',
                                showflg: true,
                                roles: "40401",
                                level1: "marking_level",
                                level2: "LuckDrawlist_level"
                            },
                            component: () =>
                                import ('@/views/coupon/luckdraw/LuckDraw'),
                        },

                        {
                            path: '/@/views/coupon/luckdraw/AddLuckDraw',
                            name: 'AddLuckDraw',
                            meta: {
                                title: '新建/编辑抽奖活动',
                                showflg: false,
                                roles: "40402",
                                level1: "marking_level",
                                level2: "LuckDrawlist_level"
                            },
                            component: () =>
                                import ('@/views/coupon/luckdraw/AddLuckDraw'),
                        },
                        {
                            path: '',
                            name: '40404',
                            meta: {
                                title: '删除抽奖活动',
                                showflg: false,
                                roles: "40404",
                                level1: "marking_level",
                                level2: "LuckDrawlist_level"
                            },

                        },
                        {
                            path: '/@/views/coupon/luckdraw/lotterylist',
                            name: 'lotterylist',
                            meta: {
                                title: '开奖信息',
                                showflg: false,
                                roles: "40405",
                                level1: "marking_level",
                                level2: "LuckDrawlist_level"
                            },
                            component: () =>
                                import ('@/views/coupon/luckdraw/lotterylist'),
                        }
                    ]
                }
            ]
        },
        {
            path: '/@/views/application',
            name: 'Application',
            component: Main,
            redirect: 'SmallBeautyBox',
            meta: {
                title: '应用',
                roles: "11",
                level1: "application_level"
            },
            children: [{
                    path: '/@/views/appliedmanagement/appliedmanagement',
                    name: 'appliedmanagement',
                    meta: {
                        title: '应用管理',
                        roles: "-2",
                        showflg: true,
                        showrole: true,
                    },
                    component: () =>
                        import ('@/views/appliedmanagement/appliedmanagement')
                },


                {
                    path: '/@/views/application/SmallBeautyBox',
                    name: 'SmallBeautyBox',
                    meta: {
                        title: "定制礼盒",
                        showflg: false,
                        roles: "110101",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                    component: () =>
                        import ('@/views/application/SmallBeautyBox')
                },

                {
                    path: '/@/views/application/SmallBeautyBox/components/AddingProducts',
                    name: 'AddingProducts',
                    meta: {
                        title: '添加产品',
                        showflg: false,
                        roles: "110102",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                    component: () =>
                        import ('@/views/application/SmallBeautyBox/components/AddingProducts')
                },

                {
                    path: '/@/views/application/SmallBeautyBox/components/addSmallBeautyBox',
                    name: 'addSmallBeautyBox',
                    meta: {
                        title: '创建/编辑活动列表',
                        showflg: false,
                        roles: "110103",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                    component: () =>
                        import ('@/views/application/SmallBeautyBox/components/addSmallBeautyBox')
                },
                {
                    path: '',
                    name: '110104',
                    meta: {
                        title: '删除活动',
                        showflg: false,
                        roles: "110104",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                },
                {
                    path: '/@/views/application/SmallBeautyBox/components/AddProducts',
                    name: 'AddProducts',
                    meta: {
                        title: '小美盒添加产品',
                        showflg: false,
                        showrole: true,
                        roles: "-2",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                    component: () =>
                        import ('@/views/application/SmallBeautyBox/components/AddProducts')
                },

                {
                    path: '/@/views/application/GiftBoxApp',
                    name: 'GiftBoxApp',
                    meta: {
                        title: '创建礼盒',
                        showflg: false,
                        roles: "110106",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                    component: () =>
                        import ('@/views/application/GiftBox')
                },
                {
                    path: '/@/views/application/GiftBox/components/AddGiftBoxApp',
                    name: 'AddGiftBoxApp',
                    meta: {
                        title: '添加礼盒',
                        showflg: false,
                        roles: "110107",
                        level1: "application_level",
                        level2: "appliedmanagement_level2"
                    },
                    component: () =>
                        import ('@/views/application/GiftBox/components/AddGiftBoxApp')
                },


                {
                    path: '/@/views/appliedmanagement/helpshare/helpshare',
                    name: 'helpshare',
                    meta: {
                        title: '分享助力',
                        showflg: false,
                        roles: "110201",
                        level1: "application_level",
                        level2: "helpshare_level2"
                    },
                    component: () =>
                        import ('@/views/appliedmanagement/helpshare/helpshare')
                },
                {
                    path: '/@/views/appliedmanagement/helpshare/addhelpshare',
                    name: 'addhelpshare',
                    meta: {
                        title: '添加/编辑/查看分享助力活动',
                        showflg: false,
                        roles: "11020101",
                        level1: "application_level",
                        level2: "helpshare_level2"
                    },
                    component: () =>
                        import ('@/views/appliedmanagement/helpshare/addhelpshare')
                },
                {
                    path: '',
                    name: '11020102',
                    meta: {
                        title: '启用/禁用分享助力活动',
                        showflg: false,
                        roles: "11020102",
                        level1: "application_level",
                        level2: "helpshare_level2"
                    },
                },
                {
                    path: '',
                    name: '11020103',
                    meta: {
                        title: '删除分享助力活动',
                        showflg: false,
                        roles: "11020103",
                        level1: "application_level",
                        level2: "helpshare_level2"
                    },
                },
                {
                    path: '/@/views/appliedmanagement/friendsgifts/friendsgifts',
                    name: 'friendsgifts',
                    meta: {
                        title: '好友赠礼',
                        showflg: false,
                        roles: "110202",
                        level1: "application_level",
                        level2: "friendsgifts_level2"
                    },
                    component: () =>
                        import ('@/views/appliedmanagement/friendsgifts/friendsgifts')
                },
                {
                    path: '',
                    name: '11020201',
                    meta: {
                        title: '保存好友赠礼',
                        showflg: false,
                        roles: "11020201",
                        level1: "application_level",
                        level2: "friendsgifts_level2"
                    },
                },
            ]
        },
        {
            path: '/@/views/shop',
            name: 'shop',
            component: Main,
            redirect: '/@/views/shop/index',
            meta: {
                title: '店铺',
                roles: "5",
                level1: "shop_level"
            },
            children: [{
                path: '/@/views/shop/index',
                name: 'smallProgram',
                meta: {
                    title: '小程序管理',
                    roles: "-2",
                    showrole: true,
                    level1: "shop_level"
                },
                component: parentView,
                redirect: '/@/views/shop/smallprogram/pageAdmin',
                children: [{
                        path: '/@/views/shop/smallprogram/PageAdmin',
                        name: 'PageAdmin',
                        meta: {
                            title: '页面管理',
                            showflg: true,
                            roles: "50101",
                            level1: "shop_level",
                            level2: "PageAdmin_level"
                        },
                        component: () =>
                            import ('@/views/shop/smallprogram/PageAdmin'),
                    },
                    {
                        path: '',
                        name: '5010101',
                        meta: {
                            title: '添加新的页面',
                            showflg: false,
                            roles: "5010101",
                            level1: "shop_level",
                            level2: "PageAdmin_level"
                        },
                    },
                    // {
                    //     path: '',
                    //     name: '',
                    //     meta: {
                    //         title: '编辑页面管理',
                    //         showflg: false,
                    //         roles: "5010102",
                    //         level1: "shop_level"
                    //     },
                    // },
                    {
                        path: '',
                        name: '5010103',
                        meta: {
                            title: '启用/禁用页面',
                            showflg: false,
                            roles: "5010103",
                            level1: "shop_level",
                            level2: "PageAdmin_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010104',
                        meta: {
                            title: '复制页面',
                            showflg: false,
                            roles: "5010104",
                            level1: "shop_level",
                            level2: "PageAdmin_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010105',
                        meta: {
                            title: '删除页面',
                            showflg: false,
                            roles: "5010105",
                            level1: "shop_level",
                            level2: "PageAdmin_level"
                        },
                    },

                    // 页面模板管理

                    {
                        path: '/@/views/shop/pagemodel/PageModel',
                        name: 'PageModel',
                        meta: {
                            title: '页面模板管理',
                            showflg: true,
                            roles: "50102",
                            level1: "shop_level",
                            level2: "PageModel_level"
                        },
                        component: () =>
                            import ('@/views/shop/pagemodel/PageModel'),
                    },
                    {
                        path: '',
                        name: '5010201',
                        meta: {
                            title: '添加新模板',
                            showflg: false,
                            roles: "5010201",
                            level1: "shop_level",
                            level2: "PageModel_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010202',
                        meta: {
                            title: '启用/禁用模板',
                            showflg: false,
                            roles: "5010202",
                            level1: "shop_level",
                            level2: "PageModel_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010203',
                        meta: {
                            title: '复制模板',
                            showflg: false,
                            roles: "5010203",
                            level1: "shop_level",
                            level2: "PageModel_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010204',
                        meta: {
                            title: '删除模板',
                            showflg: false,
                            roles: "5010204",
                            level1: "shop_level",
                            level2: "PageModel_level"
                        },
                    },
                    {
                        path: '/@/views/shop/smallprogramsetting/SmallSetting',
                        name: 'SmallSetting',
                        meta: {
                            title: '小程序设置',
                            showflg: true,
                            roles: "50103",
                            level1: "shop_level",
                            level2: "SmallSettingl_level"
                        },
                        component: () =>
                            import ('@/views/shop/smallprogramsetting/SmallSetting'),
                    },
                    {
                        path: '',
                        name: '5010301',
                        meta: {
                            title: '保存小程序设置',
                            showflg: false,
                            roles: "5010301",
                            level1: "shop_level",
                            level2: "SmallSettingl_level"
                        }
                    },
                    {
                        path: '/@/views/shop/twocode/QrCode',
                        name: 'QrCode',
                        meta: {
                            title: '商品二维码',
                            showflg: true,
                            roles: "50104",
                            level1: "shop_level",
                            level2: "QrCode_level"
                        },
                        component: () =>
                            import ('@/views/shop/qrcode/QrCode'),
                    },
                    {
                        path: '',
                        name: '5010401',
                        meta: {
                            title: "查看列表",
                            showflg: false,
                            roles: "5010401",
                            level1: "shop_level",
                            level2: "QrCode_level"
                        },

                    },

                    {
                        path: '/@/views/shop/advertisement/Advertisement',
                        name: 'Advertisement',
                        meta: {
                            title: '启动广告',
                            showflg: true,
                            roles: "50105",
                            level1: "shop_level",
                            level2: "Advertisement_level"
                        },
                        component: () =>
                            import ('@/views/shop/advertisement/Advertisement'),
                    },
                    {
                        path: '',
                        name: '5010501',
                        meta: {
                            title: '添加/编辑启动广告图',
                            showflg: false,
                            roles: "5010501",
                            level1: "shop_level",
                            level2: "Advertisement_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010503',
                        meta: {
                            title: '删除启动广告图',
                            showflg: false,
                            roles: "5010503",
                            level1: "shop_level",
                            level2: "Advertisement_level"
                        },
                    },
                    {
                        path: '/@/components/advertisement',
                        name: 'Advertisements',
                        meta: {
                            title: '广告设置',
                            showrole: true,
                            showflg: false,
                            roles: "-2",
                            level1: "shop_level",
                            level2: "Advertisement_level"
                        },
                        component: () =>
                            import ('@/components/advertisement'),
                    },

                    {
                        path: '/@/views/shop/templatemessages/TemplateMessageS',
                        name: 'CreateReductions',
                        meta: {
                            title: '模板消息库',
                            showflg: true,
                            roles: '5010600',
                            level1: "shop_level",
                            level2: "CreateReductions_level",
                        },
                        component: () =>
                            import ('@/views/shop/templatemessages/TemplateMessageS'),
                    },
                    {
                        path: '',
                        name: '5010601',
                        meta: {
                            title: '同步模板消息库',
                            showflg: false,
                            roles: '5010601',
                            level1: "shop_level",
                            level2: "CreateReductions_level",
                        },

                    },


                    {
                        path: '/@/views/shop/templatemessages/TemplateMessageShow',
                        name: 'CreateReductions',
                        meta: {
                            title: '模板消息库编辑',
                            showflg: false,
                            roles: '50108',
                            level1: "shop_level",
                            level2: "CreateReductions_level",
                        },
                        component: () =>
                            import ('@/views/shop/templatemessages/TemplateMessageShow'),
                    },
                    {
                        path: '',
                        name: '5010603',
                        meta: {
                            title: '删除模板消息库',
                            showflg: false,
                            roles: '5010603',
                            level1: "shop_level",
                            level2: "CreateReductions_level",
                        },
                    },


                    {
                        path: '/@/views/shop/templatemessage/TemplateMessage',
                        name: 'CreateReduction',
                        meta: {
                            title: '模板消息',
                            showflg: true,
                            roles: '50107',
                            level1: "shop_level",
                            level2: "CreateReduction_level"
                        },
                        component: () =>
                            import ('@/views/shop/templatemessage/TemplateMessage'),
                    },

                    {
                        path: '/@/views/shop/templatemessage/TemplateMessageAdd',
                        name: 'CreateReduction',
                        meta: {
                            title: '添加/编辑模板消息',
                            showflg: false,
                            roles: '50109',
                            level1: "shop_level",
                            level2: "CreateReduction_level"
                        },
                        component: () =>
                            import ('@/views/shop/templatemessage/TemplateMessageAdd'),
                    },

                    {
                        path: '',
                        name: '5010902',
                        meta: {
                            title: '启用/禁用模板消息',
                            showflg: false,
                            roles: '5010902',
                            level1: "shop_level",
                            level2: "CreateReduction_level"
                        },
                    },
                    {
                        path: '',
                        name: '5010903',
                        meta: {
                            title: '删除模板消息',
                            showflg: false,
                            roles: '5010903',
                            level1: "shop_level",
                            level2: "CreateReduction_level"
                        },

                    }
                ]
            }]
        },

        {
            path: '/analyse',
            name: 'analyse',
            component: Main,
            meta: {
                title: '数据',
                roles: "9",
                level1: "data_level"
            },
            children: [{
                    path: '/@/view/data/overview/Overview',
                    name: 'Overview',
                    meta: {
                        title: '数据概览',
                        showflg: true,
                        roles: "901",
                        level1: "data_level",
                        level2: "Overview_level",
                    },
                    component: () =>
                        import ('@/views/data/overview/Overview')
                },
                {
                    path: '',
                    name: 'Overview',
                    meta: {
                        title: '查看数据概览',
                        showflg: false,
                        roles: "90101",
                        level1: "data_level",
                        level2: "Overview_level",
                    }
                },
                {
                    path: '/@/view/data/dataanalyse/dataanalyse',
                    name: 'dataanalyse',
                    meta: {
                        title: '流量分析',
                        showflg: true,
                        roles: "902",
                        level1: "data_level",
                        level2: "dataanalys_level",
                    },
                    component: () =>
                        import ('@/views/data/dataanalyse/dataanalyse')
                },
                {
                    path: '',
                    name: 'Overview',
                    meta: {
                        title: '查看流量分析',
                        showflg: false,
                        roles: "90201",
                        level1: "data_level",
                        level2: "dataanalys_level"
                    }
                },


                {
                    path: '/@/view/data/transaction/Transaction',
                    name: 'Transaction',
                    meta: {
                        title: '交易分析',
                        showflg: true,
                        roles: "903",
                        level1: "data_level",
                        level2: "Transaction_level"
                    },
                    component: () =>
                        import ('@/views/data/transaction/Transaction')
                },
                {
                    path: '',
                    name: '90301',
                    meta: {
                        title: '查看交易分析',
                        showflg: false,
                        roles: "90301",
                        level1: "data_level",
                        level2: "Transaction_level",
                    }
                },


                {
                    path: '/@/view/data/customeranalyse/customeranalyse',
                    name: 'customeranalyse',
                    meta: {
                        title: '客群分析',
                        showflg: true,
                        roles: "904",
                        level1: "data_level",
                        level2: "customeranalyse_level",
                    },
                    component: () =>
                        import ('@/views/data/customeranalyse/customeranalyse')
                },
                {
                    path: '',
                    name: '90401',
                    meta: {
                        title: '查看客群分析',
                        showflg: false,
                        roles: "90401",
                        level1: "data_level",
                        level2: "customeranalyse_level",
                    }
                },

                {
                    path: '/@/view/data/shopanalyse/shopanalyse',
                    name: 'shopanalyse',
                    meta: {
                        title: '商品分析',
                        showflg: true,
                        roles: "905",
                        level1: "data_level",
                        level2: "shopanalyse_level",
                    },
                    component: () =>
                        import ('@/views/data/shopanalyse/shopanalyse')
                },
                {
                    path: '',
                    name: '90501',
                    meta: {
                        title: '查看商品分析',
                        showflg: false,
                        roles: "90501",
                        level1: "data_level",
                        level2: "shopanalyse_level",
                    }
                }
            ]
        },

        // 设置
        {
            path: '/@/views/payment/shopping',
            name: 'payment',
            component: Main,
            meta: {
                title: '设置',
                roles: "6",
                level1: "payment_level"

            },
            children: [{
                    path: '/@/views/payment/shopping',
                    name: 'baseMarketing',
                    meta: {
                        title: '商城设置',
                        showrole: true,
                        roles: "-2",
                        level1: "payment_level",
                        level2: "baseMarketing_level"
                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/payment/shopping',
                            name: 'shopping',
                            meta: {
                                title: '商城设置',
                                showflg: true,
                                roles: "60101",
                                level1: "payment_level",
                                level2: "baseMarketing_level"
                            },
                            component: () =>
                                import ('@/views/payment/shopping'),
                        },
                        {
                            path: '',
                            name: '6010101',
                            meta: {
                                title: '保存商城设置',
                                showflg: false,
                                roles: "6010101",
                                level1: "payment_level",
                                level2: "baseMarketing_level"
                            }
                        },
                    ]
                },


                {
                    path: '/@/views/payment/PaySetting',
                    name: 'PaySettparent',
                    meta: {
                        title: '交易设置',
                        showflg: true,
                        showrole: true,
                        roles: "-2",
                        level1: "payment_level",
                        level2: "PaySettparent_level"
                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/payment/PayTransaction',
                            name: 'PayTransaction',
                            meta: {
                                title: '交易设置',
                                showflg: true,
                                roles: "60201",
                                level1: "payment_level",
                                level2: "PaySettparent_level"
                            },
                            component: () =>
                                import ('@/views/payment/PayTransaction'),
                        },
                        {
                            path: '/@/views/payment/PayTransaction',
                            name: 'PayTransaction',
                            meta: {
                                title: '保存交易设置',
                                showflg: false,
                                roles: "6020101",
                                level1: "payment_level",
                                level2: "PaySettparent_level"
                            },
                        },


                        {
                            path: '/@/views/payment/PaySetting',
                            name: 'PaySetting',
                            meta: {
                                title: '支付设置',
                                showflg: true,
                                roles: "60202",
                                level1: "payment_level",
                                level2: "PaySetting_level"
                            },
                            component: () =>
                                import ('@/views/payment/PaySetting'),
                        },
                        {
                            path: '',
                            name: '6020201',
                            meta: {
                                title: '支付设置保存',
                                showflg: false,
                                roles: "6020201",
                                level1: "payment_level",
                                level2: "PaySetting_level"
                            },
                        },

                        {
                            path: '/@/views/payment/PayManagement',
                            name: 'PayManagement',
                            meta: {
                                title: '支付管理',
                                showflg: true,
                                roles: "60203",
                                level1: "payment_level",
                                level2: "PayManagement_level"
                            },
                            component: () =>
                                import ('@/views/payment/PayManagement'),
                        },
                        {
                            path: '/@/views/payment/components/CreatePayMangement',
                            name: 'CreatePayMangement',
                            meta: {
                                title: '添加/编辑支付',
                                showflg: false,
                                roles: "60204",
                                level1: "payment_level",
                                level2: "PayManagement_level"
                            },
                            component: () =>
                                import ('@/views/payment/components/CreatePayMangement'),
                        },
                        {
                            path: '/@/views/payment/components/CreatePayMangement',
                            name: 'CreatePayMangement',
                            meta: {
                                title: '删除支付设置',
                                showflg: false,
                                roles: "60206",
                                level1: "payment_level",
                                level2: "PayManagement_level"
                            },
                        },
                        {
                            path: '/@/views/payment/components/CreatePayMangement',
                            name: 'CreatePayMangement',
                            meta: {
                                title: '启用/禁用支付设置',
                                showflg: false,
                                roles: "60207",
                                level1: "payment_level",
                                level2: "PayManagement_level"
                            }
                        }
                    ]
                },

                {
                    path: '/@/views/payment/letter',
                    name: 'adhibition_c14',
                    meta: {
                        title: '短信设置',
                        showflg: true,
                        roles: "603",
                        level1: "payment_level",
                        level2: "letter_level"
                    },
                    component: parentView,
                    children: [{
                            path: '/@/views/payment/letter',
                            name: 'letter',
                            meta: {
                                title: '短信模板',
                                showflg: true,
                                roles: "60301",
                                level1: "payment_level",
                                level2: "letter_level"
                            },
                            component: () =>
                                import ('@/views/payment/letter'),
                        },
                        {
                            path: '/@/views/payment/components/addLetter',
                            name: 'addLetter',
                            meta: {
                                title: '添加/编辑短信模板',
                                showflg: false,
                                roles: "60303",
                                level1: "payment_level",
                                level2: "letter_level"
                            },
                            component: () =>
                                import ('@/views/payment/components/addLetter'),
                        },
                        {
                            path: '',
                            name: '6030302',
                            meta: {
                                title: '禁用/启用短信模板',
                                showflg: false,
                                roles: "6030302",
                                level1: "payment_level",
                                level2: "letter_level"
                            },
                        },

                        {
                            path: '',
                            name: '6030303',
                            meta: {
                                title: '删除短信模板',
                                showflg: false,
                                roles: "6030303",
                                level1: "payment_level",
                                level2: "letter_level"
                            },
                        },


                        {
                            path: '/@/views/payment/letterSet',
                            name: 'letterSet',
                            meta: {
                                title: '短信接口设置',
                                showflg: true,
                                roles: "60302",
                                level1: "payment_level",
                                level2: "letterSet_level"

                            },
                            component: () =>
                                import ('@/views/payment/letterSet'),
                        },
                        {
                            path: '',
                            name: '6030201',
                            meta: {
                                title: '保存短信接口设置',
                                showflg: false,
                                roles: "6030201",
                                level1: "payment_level",
                                level2: "letterSet_level"

                            }
                        }
                    ]
                }
            ]
        },

        {
            path: '/@/views/system',
            name: 'system',
            component: Main,
            redirect: '/@/views/system/usermanagement',
            meta: {
                title: '系统',
                roles: '7',
                level1: "system_level"
            },
            children: [{
                    path: '/@/views/system/usermanagement',
                    name: 'usermanagement',
                    meta: {
                        title: '用户管理',
                        showflg: true,
                        roles: "701",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                    component: () =>
                        import ('@/views/system/usermanagement'),
                },
                {
                    path: '/@/views/system/adduser',
                    name: 'adduser',
                    meta: {
                        title: '添加用户',
                        showflg: false,
                        roles: "70101",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                    component: () =>
                        import ('@/views/system/adduser'),
                },
                {
                    path: '',
                    name: '70102',
                    meta: {
                        title: '编辑用户',
                        showflg: false,
                        roles: "70102",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                },
                {
                    path: '',
                    name: '70103',
                    meta: {
                        title: '角色分配',
                        showflg: false,
                        roles: "70103",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                },
                {
                    path: '',
                    name: '70104',
                    meta: {
                        title: '密码重置',
                        showflg: false,
                        roles: "70104",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                },
                {
                    path: '',
                    name: '70105',
                    meta: {
                        title: '删除用户',
                        showflg: false,
                        roles: "70105",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                },
                {
                    path: '',
                    name: '70106',
                    meta: {
                        title: '启用/锁定用户',
                        showflg: false,
                        roles: "70106",
                        level1: "system_level",
                        level2: "usermanagement_level"
                    },
                },

                {
                    path: '/@/views/system/rolemanagement',
                    name: 'rolemanagement',
                    meta: {
                        title: '角色管理',
                        showflg: true,
                        roles: "702",
                        level1: "system_level",
                        level2: "rolemanagement_level"
                    },
                    component: () =>
                        import ('@/views/system/rolemanagement'),
                },
                {
                    path: '',
                    name: '70201',
                    meta: {
                        title: '添加新角色',
                        showflg: false,
                        roles: "70201",
                        level1: "system_level",
                        level2: "rolemanagement_level"
                    },
                },
                {
                    path: '',
                    name: '70202',
                    meta: {
                        title: '编辑角色',
                        showflg: false,
                        roles: "70202",
                        level1: "system_level",
                        level2: "rolemanagement_level"
                    },
                },
                {
                    path: '',
                    name: '70203',
                    meta: {
                        title: '权限分配',
                        showflg: false,
                        roles: "70203",
                        level1: "system_level",
                        level2: "rolemanagement_level"
                    },
                },

                {
                    path: '',
                    name: '70204',
                    meta: {
                        title: '删除角色',
                        showflg: false,
                        roles: "70204",
                        level1: "system_level",
                        level2: "rolemanagement_level"
                    },
                },

                // {
                //     path: '/@/views/system/operationlog',
                //     name: 'operationLog',
                //     meta: {
                //         title: '组织架构',
                //         showflg: true,
                //         roles: "703",
                //         level1: "system_level",
                //         level2: "operationLog_level"
                //     },
                //     component: () =>
                //         import ('@/views/system/centersystem'),
                // },
                {
                    path: '/@/views/brand',
                    name: 'BrandAdmin',
                    meta: {
                        title: '店铺管理',
                        roles: "704",
                        level1: "system_level",
                        level2: "BrandAdmin_level"
                    },
                    component: parentView,
                    redirect: '/@/views/platform/store/ChoiceStore',
                    children: [{
                        path: '/@/views/platform/store/ChoiceStore',
                        name: 'PageAdmin',
                        meta: {
                            title: '品牌管理',
                            showflg: true,
                            roles: "70401",
                            level1: "system_level",
                            level2: "BrandAdmin_level"
                        },
                        component: () =>
                            import ('@/views/platform/store/ChoiceStore'),
                    }, ]
                },
                {
                    path: '/@/views/platform/store/AddStore',
                    name: 'AddBrand',
                    meta: {
                        title: '品牌添加',
                        showflg: false,
                        roles: "70402",
                        level1: "system_level",
                        level2: "BrandAdmin_level"
                    },
                    component: () =>
                        import ('@/views/platform/store/AddStore'),
                },
                {
                    path: '/@/views/system/helpcenter',
                    name: 'helpcenter',
                    meta: {
                        title: '操作日志',
                        showflg: true,
                        roles: "705",
                        level1: "system_level",
                        level2: "helpcenter_level"
                    },
                    component: () =>
                        import ('@/views/system/helpcenter'),
                },
                {
                    path: '',
                    name: '70501',
                    meta: {
                        title: '查看操作日志列表',
                        showflg: false,
                        roles: "70501",
                        level1: "system_level",
                        level2: "helpcenter_level"
                    },
                }
            ]
        },
    ]

})