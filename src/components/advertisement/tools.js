const tools = {
    "result":[
      // {
      //   'toolsName':'基础组件',
      //   'toolsOrder':'1',
      //   'toolsHeight':0,
      //   'toolsCollapse':'open',
      //   'toolsChildren':[
      //     {
      //       id:1,
      //       name:'会员信息',
      //       icon:'icon-huiyuan',
      //       current:0,
      //       all:1
      //     },{
      //       id:2,
      //       name:'订单图标组',
      //       icon:'icon-shangpintubiaozu',
      //       current:0,
      //       all:1
      //     },{
      //       id:3,
      //       name:'常用图标组',
      //       icon:'icon-changyongtubiaozu',
      //       current:0,
      //       all:1
      //     },{
      //       id:3,
      //       name:'常用图标组',
      //       icon:'icon-changyongtubiaozu',
      //       current:0,
      //       all:1
      //     }
      //   ]
      // },
      {
        'toolsName':'商品类',
        'toolsOrder':'2',
        'toolsHeight':0,
        'toolsCollapse':'open',
        'toolsChildren':[
          {
            id:1,
            name:'单列商品',
            icon:'icon-danlieshangpin',
            current:0,
            all:6,
            components:'danlieshangpin'
          },{
            id:2,
            name:'双列商品',
            icon:'icon-shuanglieshangpin',
            current:0,
            all:6,
            components:'shuanglieshangpin'
          },
          // {
          //   id:3,
          //   name:'其他类型',
          //   icon:'icon-qitaleixing',
          //   current:0,
          //   all:1
          // },{
          //   id:4,
          //   name:'选项卡',
          //   icon:'icon-xuanxiangqia',
          //   current:0,
          //   all:1
          // },{
          //   id:5,
          //   name:'猜你喜欢',
          //   icon:'icon-cainixihuan',
          //   current:0,
          //   all:1
          // },{
          //   id:6,
          //   name:'商品排行',
          //   icon:'icon-shangpinpaihang',
          //   current:0,
          //   all:1
          // }
        ]
      },{
        'toolsName':'图文类',
        'toolsOrder':'3',
        'toolsHeight':0,
        'toolsCollapse':'open',
        'toolsChildren':[
            {
              id:1,
              name:'魔方',
              icon:'icon-mofang',
              current:0,
              all:0,
              components:'mofang'
            },{
              id:2,
              name:'图片轮播',
              icon:'icon-banner',
              current:0,
              all:0,
              components:'banner'
            }
        ]
      }
    ] 
}

export default tools