import Mock from 'mockjs' // 引入mockjs

const Random = Mock.Random

let goodsList = []

for (let i = 0; i < 10; i++) {
    let goods = {
        id: i + 1,
        displayOrder: (i + 6) * 3,
        thumb: require('@/assets/logo.png'),
        title: Random.cword(9),
        formName: [Random.cword(4), Random.cword(4)],
        price: `$${i * 6 + 3}`,
    }
}

Mock.mock('/api/goods/list', 'post', bardata)