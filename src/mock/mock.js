import Mock from 'mockjs' // 引入mockjs

const Random = Mock.Random

let bardata = [] //生成数组，用于提供柱形图

for (let i = 0; i < 7; i++) {
  let template = {
    'Integer': Random.integer(100, 200), // 生成1到100之间的整数
    'date': Random.date('M-dd')
  }
  bardata.push(template)
}
let linedata = []//用于提供折线图数据
for (let i = 0; i < 7; i++) {
  let template = {
    object: {
      'name': Random.cword(2), // 生成姓名
      'data': Random.range(10, 100, 12), // 生成一个随机数组
      'color': Random.rgb(),
      'type': "line",
      'smooth': true,

    },
    'date': Random.date('M-dd')
  }
  linedata.push(template)
}

let fandata = []//用于提供生成扇形图的数据
for (let i = 0; i < 3; i++) {
  let template = {
    'name': Random.cword(2), // 生成姓名
    'value': Random.integer(100, 300), // 生成一个随机数组
  }
  fandata.push(template)
}


let tabledata = []
for (let i = 0; i < 5; i++) {
  let template = {
    'id': i,
    'type': 's',
    'name': Random.csentence(30),
    'price': String(Random.integer(100, 200)),
    'inventory': String(Random.integer(500, 1000)),
    'status': false
  }
  tabledata.push(template)
}
let giftdata = []
for (let i = 0; i < 50; i++) {
  let template = {
    'id': i,
    'type': 'z',
    'name': Random.csentence(5),
    'price': String(Random.integer(1, 20)),
    'inventory': String(Random.integer(1, 100)),
    'status': false
  }
  giftdata.push(template)
}
let fromdata = [] //生成数据模板

let imagedata1 = []
for (let i = 0; i < 8; i++) {
  let template = {
    'id': i,
    'type': 's',
    'name': Random.cword(2),
    'url': "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=a62e824376d98d1069d40a31113eb807/838ba61ea8d3fd1fc9c7b6853a4e251f94ca5f46.jpg"
  }
  imagedata1.push(template)
}

let imagedata2 = []
for (let i = 0; i < 8; i++) {
  let template = {
    'id': i,
    'type': 's',
    'name': Random.cword(2),
    'url': "https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=a62e824376d98d1069d40a31113eb807/838ba61ea8d3fd1fc9c7b6853a4e251f94ca5f46.jpg"
  }
  imagedata2.push(template)
}
let specification = [
  {
    specificationitem: [
      {
        default: 'false',
        inputcont: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555663029899&di=6037714da60199f505e26a963b30367b&imgtype=0&src=http%3A%2F%2Fi1.17173cdn.com%2F9ih5jd%2FYWxqaGBf%2Fforum%2F201711%2F23%2F190426phszhdpfppj6zu8f.jpg',
        inputxttype: '3',
        open: '1',
        specificationitemname: 'color3'
      },
      {
        default: 'true',
        inputcont: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555663029899&di=6037714da60199f505e26a963b30367b&imgtype=0&src=http%3A%2F%2Fi1.17173cdn.com%2F9ih5jd%2FYWxqaGBf%2Fforum%2F201711%2F23%2F190426phszhdpfppj6zu8f.jpg',
        inputxttype: '3',
        open: '1',
        specificationitemname: 'color2'
      },
      {
        default: 'false',
        inputcont: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555663029899&di=6037714da60199f505e26a963b30367b&imgtype=0&src=http%3A%2F%2Fi1.17173cdn.com%2F9ih5jd%2FYWxqaGBf%2Fforum%2F201711%2F23%2F190426phszhdpfppj6zu8f.jpg',
        inputxttype: '3',
        open: '1',
        specificationitemname: 'color1'
      },
    ],
    specificationtype: 'img'
  },
  {
    specificationitem: [
      {
        default: 'false',
        inputcont: '64',
        inputxttype: '2',
        open: '1',
        specificationitemname: '64'
      },
      {
        default: 'true',
        inputcont: '128',
        inputxttype: '2',
        open: '1',
        specificationitemname: '128'
      },
      {
        default: 'false',
        inputcont: '32',
        inputxttype: '3',
        open: '1',
        specificationitemname: '32'
      },
    ],
    specificationtype: 'GB'
  },
  {
    specificationitem: [
      {
        default: 'false',
        inputcont: '64',
        inputxttype: '1',
        open: '1',
        specificationitemname: '联通'
      },
      {
        default: 'true',
        inputcont: '128',
        inputxttype: '1',
        open: '1',
        specificationitemname: '移动'
      },
      {
        default: 'false',
        inputcont: '32',
        inputxttype: '1',
        open: '1',
        specificationitemname: '电信'
      },
    ],
    specificationtype: '运营商'
  },
]




Mock.mock('/bardata/index', 'post', bardata)
Mock.mock('/linedata/index', 'post', linedata)
Mock.mock('/fandata/index', 'post', fandata)
Mock.mock('/tabledata/index', 'post', tabledata)
Mock.mock('/giftdata/index', 'post', giftdata)
Mock.mock('/url/data', 'post', fromdata)
Mock.mock('/url/imgdata', 'post', imagedata1)
Mock.mock('/url/imgdata2', 'post', imagedata2)
Mock.mock('/url/specification', 'post', specification)