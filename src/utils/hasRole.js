import { getRouterKey } from '@/utils/auth'
export function hasRole(role) {
    let RouterKey = getRouterKey().slice(1, -1).split(',')
    let roleArr = []

    for (let i in RouterKey) {
        roleArr.push(RouterKey[i] * 1)
    }
    return roleArr.includes(role)
}