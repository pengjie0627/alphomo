import ObjectUtil from 'fant/lib/util/object'
import store from '../store'
// import { sessionStorage } from 'mgr/BrowserMgr'

export default class PermissionMgr {
  static filterMenus(menus: any[]): any {
    return new Promise((resolve) => {
      let result: any[] = []
      menus = ObjectUtil.copy(menus)
      menus.forEach(group => {
        if (PermissionMgr.hasMenuPermissions(group.permissions)) {
          if (group.children && group.children.length >= 0) {
            let children: any[] = []
            group.children.forEach((item: any) => {
              if (PermissionMgr.hasMenuPermissions(item.permissions)) {
                children.push(item)
              }
            })
            group.children = children
            result.push(group)
          } else {
            result.push(group)
          }
        }
      })
      resolve(result)
    })
  }

  static hasMenuPermissions(permissions: string[] | string) {
    if (!permissions) {
      return true
    }
    if (permissions.length === 0) {
      return true
    }
    if (!store.state.permission || store.state.permission.length === 0) {
      return false
    }
    let result: any = []
    console.log(store.state.permission)
    for (let i = 0; i < store.state.permission.length; i++) {
      for (let j = 0; j < permissions.length; j++) {
        if (store.state.permission[i].code === permissions[j]) {
          result.push(store.state.permission[i])
        }
      }
    }
    if (result.length > 0) {
      return true
    } else {
      return false
    }
  }

  static hasPermissions(permissions: string[] | string) {
    if (!permissions) {
      return true
    }
    if (Array.isArray(permissions)) {
      if (permissions.length <= 0) {
        return true
      }
    } else {
      let result: string[] = []
      result.push(permissions)
      permissions = result
    }

    // if (!store.state.permissions || store.state.permissions.length === 0) {
    //   return false
    // }
    //
    // let result = true
    // let index = permissions.indexOf('owner')
    // if (index >= 0) {
    //   result = result && store.state.shop.owner.id === store.state.user.id
    //   permissions.splice(index, 1)
    // }
    // permissions.forEach(item => {
    //   result = result && store.state.permissions.indexOf(item) >= 0
    // })

    // return result
    return true
  }

  static hasOptionPermission(permission: string) {
    // if (store.state.user && store.state.user.admin) {
    //   return true
    // }
    // let user = sessionStorage.getItem('vuex').user
    // let roles: any[] = []
    // if (user && user.roles && user.roles.length > 0) {
    //   // 对于多角色取并集
    //   for (let i = 0; i < user.roles.length; i++) {
    //     roles.push.apply(roles, user.roles[i].functionPerms)
    //   }
    // }
    // roles.forEach((item: any) => {
    //   if (item.code === 'system.system.setup') {
    //     return true
    //   }
    // })
    let storePermission = store.state.permission
    if (!permission) {
      return true
    }
    if (!storePermission || storePermission.length === 0) {
      return false
    }
    let filterItem = storePermission.filter((item: any) => {
      return item.code === permission
    })
    if (filterItem.length > 0) {
      return true
    } else {
      return false
    }
  }
}
