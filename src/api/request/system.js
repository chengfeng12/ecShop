// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : '/admin'
let SystemApi = {

    // 角色管理接口
    /**
     * 保存角色信息
     */
    saveRole(params) {
        return api.request(basePrefix + '/role/roles', 'POST', {
            ...params
        })
    },
    /**
     * 获取角色列表
     */
    getRoleList(params) {
        return api.request(basePrefix + '/role/rolesByPage', 'POST', {
            ...params
        })
    },
    /**
     * 创建角色
     */
    createRole(params) {
        return api.request(basePrefix + '/role/roles', 'POST', {
            ...params
        })
    },
    /**
     * 删除角色信息
     */
    delRote(params) {
        return api.request(basePrefix + '/role/delRoles', 'POST', {
            ...params
        })
    },
    /**
     * 获取角色信息
     */
    roleDetail(params) {
        return api.request(basePrefix + '/role/queryRoleById', 'POST', {
            ...params
        })
    },
    /**
     * 更新角色信息
     */
    updateRole(params) {
        return api.request(basePrefix + '/role/rolesupdate', 'POST', {
            ...params
        })
    },
    /**
     * 分配角色
     */
    assignRole(params) {
        return api.request(basePrefix + '/role/roles/auth/assign', 'POST', {
            ...params
        })
    },

    /**
     * 查看角色的权限
     */
    roleDetailList(params) {
        return api.request(basePrefix + '/role/menus', 'POST', {
            ...params
        })
    },

    // 用户管理接口
    /**
     * 用户列表
     */
    getUserByPage(params) {
        return api.request(basePrefix + '/user/getUserByPage', 'POST', {
            ...params
        })
    },
    // 新增用户
    saveUserData(params) {
        return api.request(basePrefix + '/user/saveUser', 'POST', {
            ...params
        })
    },
    // 修改用户
    seveEditdata(params) {
        return api.request(basePrefix + '/user/updateUser', 'POST', {
            ...params
        })
    },
    //编辑获取数据
    getEditdata(params) {
        return api.request(basePrefix + '/user/getUserById', 'POST', {
            ...params
        })
    },

    // 删除用户
    deleteUser(params) {
        return api.request(basePrefix + '/user/users', 'POST', {
            ...params
        })
    },

    // 重置密码
    resetPsd(params) {
        return api.request(basePrefix + '/user/users/password', 'POST', {
            ...params
        })
    },

    // 权限树
    getRoletree(params) {
        return api.request(basePrefix + '/role/roles/tree', 'POST', {
            ...params
        })
    },

    // 赋权
    assignRoleSpec(params) {
        return api.request(basePrefix + '/role/roles/assign', 'POST', {
            ...params
        })
    },

    // 路由权限
    searchRole(params) {
        return api.request(basePrefix + '/menu/menus/left', 'POST', {
            ...params
        })
    },
    getDistribution(params) {
        return api.request(basePrefix + '/menu/menus/auth/distribution', 'POST', {
            ...params
        })
    },

    // 修改用户状态
    updatestatus(params) {
        return api.request(basePrefix + '/user/updatestatus', 'POST', {
            ...params
        })
    },

     // 查询所有操作日志列表
     logList(params) {
        return api.request(basePrefix + '/api/sys/log/list', 'POST', {
            ...params
        })
    },
    
       // 导出所有操作日志列表
    // exportLogList(params) {
    //     return api.request(basePrefix + '/api/sys/log/exportLogList', 'POST', {
    //         ...params
    //     })
    // },

    // 查询所有日志操作类型列表
    getLogTypeList(params) {
        return api.request(basePrefix + '/api/sys/log/getLogTypeList', 'POST', {
            ...params
        })
    },

}
export default SystemApi