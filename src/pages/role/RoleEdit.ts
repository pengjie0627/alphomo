import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import RoleApi from 'http/framework/role/RoleApi'
import { Loading, FormValidator } from 'fant'
import Role from 'model/framework/role/Role'
import ConstantMgr from 'mgr/ConstantMgr'
// import SaleApi from 'http/sale/SaleApi'
// import FunctionPerm from 'model/framework/role/FunctionPerm'

@Component({
  name: 'RoleEdit',
  components: {
    PageBody,
    ListContainer
  }
})
export default class RoleEdit extends Vue {
  menu = [
    {
      name: '角色管理',
      url: '/roleManage'
    },
    {
      name: '新建角色'
    }
  ]
  rolePermissionList: any[] = []
  moduleNameBind: boolean[] = []
  permissionChild: boolean[] = []
  permissionBind: any[] = []
  prePermissonList: any[] = []
  dtlPermissionList: any[] = []
  type = ''
  roleName = ''
  roleNote = ''
  validator = new FormValidator()
  merchant: any = ''
  version = 0

  @Watch('moduleNameBind', { deep: true })
  onModuleNameBind(value: any) {
    value.forEach((item: any, index: any) => {
      if (item) {
        let count = 0
        this.permissionBind[index].forEach((item: any, childIndex: any) => {
          if (item) {
            count++
          }
          // this.permissionBind[index][childIndex] = true
        })
        if (count === 0) {
          this.permissionBind[index].forEach((item: any, childIndex: any) => {
            this.permissionBind[index][childIndex] = true
          })
        }
      } else {
        this.permissionBind[index].forEach((item: any, childIndex: any) => {
          this.permissionBind[index][childIndex] = false
        })
      }
    })
  }

  @Watch('permissionBind', { deep: true })
  onPermissionBind(value: any) {
    value.forEach((fir: any, firIndex: any) => {
      let arr = fir.filter((item: any) => {
        return item === true
      })
      if (arr.length > 0) {
        this.moduleNameBind[firIndex] = true
      } else {
        this.moduleNameBind[firIndex] = false
      }
    })
  }

  mounted() {
    this.menu[1]['name'] = this.$route.query.type === 'new' ? '新建角色' : '编辑角色'
    this.type = this.$route.query.type
    this.validator.push({
      name: [
        { minLength: 1, message: '请输入角色名称' }
      ]
    })
    this.getListPermission()
  }

  onSaveAndAdd() {
    // todo
    this.saveNewRole('saveAndAdd')
  }

  onSave() {
    // todo
    this.saveNewRole('save')
  }

  onCancel() {
    // todo
    this.$router.go(-1)
  }

  objectSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (columnIndex === 0) {
      if (rowIndex === row.specialIndex) {
        return {
          rowspan: row.moduleNameLength,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
  }

  private getListPermission() {
    let loading = Loading.show()
    RoleApi.listPerms().then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.prePermissonList = []
        this.moduleNameBind = []
        this.permissionBind = []
        this.rolePermissionList = []
        this.prePermissonList = resp.data
        let count = 0
        resp.data.forEach(item => {
          item.children.forEach((fir, index) => {
            let obj = {
              businessName: '',
              moduleName: '',
              permission: [],
              moduleNameLength: 0,
              code: '',
              name: '',
              specialIndex: 0
            }
            obj.businessName = item.caption!.toString()
            obj.moduleName = fir.caption!.toString()
            obj.permission = (fir.children as any)
            obj.moduleNameLength = item.children.length
            this.rolePermissionList.push(obj)
          })
        })

        // 初始化checkbox绑定
        this.rolePermissionList.forEach((item, index) => {
          if (index === 0) {
            item.specialIndex = 0
          } else { // todo
            if (item.businessName !== this.rolePermissionList[index - 1].businessName &&
              this.rolePermissionList[index + 1] && item.businessName === this.rolePermissionList[index + 1].businessName) {
              count += this.rolePermissionList[index - 1].moduleNameLength
              item.specialIndex = count
            } else { // 越界
              if (index + 1 >= this.rolePermissionList.length && item.moduleNameLength === 1) {
                count += this.rolePermissionList[index - 1].moduleNameLength
                item.specialIndex = count
              }
            }
          }
          this.moduleNameBind.push(false)
          this.permissionChild = []
          item.permission.forEach(() => {
            this.permissionChild.push(false)
          })
          this.permissionBind.push(this.permissionChild)
          console.log(this.rolePermissionList)
        })
        // console.log(this.rolePermissionList)
        if (this.type === 'edit') {
          this.getRoleDtlList()
        }
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  /**
   * 新建或编辑
   */
  private saveNewRole(type: string) {
    this.validator.validate(true).then(() => {
      let role = new Role()
      role.name = this.roleName
      role.remark = this.roleNote
      role.version = this.version
      if (this.$route.query.type === 'edit') {
        role.id = this.$route.query.id
        role.merchant = this.merchant
      }
      let count = 0
      this.prePermissonList.forEach((item, index) => {
        item.children.forEach((fir: any, firIndex: any) => {
          this.permissionBind[count].forEach((sec: any, secIndex: any) => {
            if (sec) {
              role.functionPerms.push(fir.children[secIndex])
            }
          })
          count++
        })
        // role.functionPerms[index].children = arr
      })
      // console.log(role)
      let loading = Loading.show()
      if (this.$route.query.type === 'new') { // 新建
        RoleApi.saveNew(role).then(resp => {
          if (resp && resp.success) {
            // todo
            loading.hide()
            if (type === 'save') {
              this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
              this.$router.push({ name: 'roleDtl', query: { id: resp.data } })
            } else {
              this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
              // todo 保存并新增
              this.roleName = ''
              this.roleNote = ''
              this.getListPermission()
            }
          }
        }).catch(error => {
          loading.hide()
          this.$message.error(error.message)
        })
      } else { // 编辑
        RoleApi.saveModify(role).then(resp => {
          if (resp && resp.success) {
            // todo
            loading.hide()
            this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
            this.$router.push({ name: 'roleDtl', query: { id: this.$route.query.id } })
          }
        }).catch(error => {
          loading.hide()
          this.$message.error(error.message)
        })
      }
    })
  }

  private getRoleDtlList() {
    RoleApi.get(this.$route.query.id).then(resp => {
      if (resp && resp.success) {
        this.roleName = resp.data!.name!.toString()
        this.roleNote = resp.data!.remark!.toString()
        this.merchant = resp.data.merchant
        this.version = resp.data.version
        resp.data.functionPerms.forEach((item: any) => {
          item.children.forEach((fir: any) => {
            let obj = {
              businessName: '',
              moduleName: '',
              permission: [],
              moduleNameLength: 0,
              code: '',
              name: ''
            }
            obj.businessName = item.caption!.toString()
            obj.moduleName = fir.caption!.toString()
            obj.permission = (fir.children as any)
            obj.moduleNameLength = item.children.length
            this.dtlPermissionList.push(obj)
            // 构造已分配的权限
            for (let i = 0; i < this.rolePermissionList.length; i++) {
              for (let j = 0; j < this.dtlPermissionList.length; j++) {
                // 找到同一个模块
                if (this.rolePermissionList[i].moduleName === this.dtlPermissionList[j].moduleName) {
                  for (let m = 0; m < this.rolePermissionList[i].permission.length; m++) {
                    for (let n = 0; n < this.dtlPermissionList[j].permission.length; n++) {
                      // 找到已分配权限的位置
                      if (this.rolePermissionList[i].permission[m].caption === this.dtlPermissionList[j].permission[n].caption) {
                        // this.permissionBind[i][m] = true
                        // 选中
                        this.$set(this.permissionBind[i], m, true)
                        // this.$forceUpdate()
                      }
                    }
                  }
                }
              }
            }
          })
          console.log(this.dtlPermissionList)
          console.log(this.permissionBind)
        })
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


