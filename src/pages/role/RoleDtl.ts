import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import RoleApi from 'http/framework/role/RoleApi'
import { Loading } from 'fant'

@Component({
  name: 'RoleDtl',
  components: {
    PageBody,
    ListContainer
  }
})
export default class RoleDtl extends Vue {
  menu = [
    {
      name: '角色管理',
      url: '/roleManage'
    },
    {
      name: '角色详情'
    }
  ]
  rolePermissionList: any[] = []
  dtlPermissionList: any[] = []
  name = ''
  remark = ''
  version = 0

  mounted() {
    this.getListPers()
    // this.getRoleDtlList()
  }

  onEdit() {
    // todo
    this.$router.push({ name: 'roleEdit', query: { id: this.$route.query.id, type: 'edit' } })
  }

  onDel() {
    this.$msgBox.confirm('删除', '确定要删除该角色吗？', () => {
      RoleApi.delete(this.$route.query.id, this.version).then(resp => {
        if (resp && resp.success) {
          this.$message.success('删除成功')
          this.$router.push('roleManage')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }

  objectSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    // todo 暂时还没有想到一个自动的好方法！！！一旦权限变化这边或许也要修改
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

  private getRoleDtlList() {
    RoleApi.get(this.$route.query.id).then(resp => {
      if (resp && resp.success) {
        this.name = resp.data!.name!.toString()
        this.remark = resp.data!.remark!.toString()
        this.version = resp.data.version
        resp.data.functionPerms.forEach((item: any) => {
          item.children.forEach((fir: any) => {
            let obj = {
              businessName: '',
              moduleName: '',
              permission: [],
              copyPermission: '',
              moduleNameLength: 0,
              code: '',
              name: '',
              specialIndex: 0
            }
            obj.businessName = item.caption!.toString()
            obj.moduleName = fir.caption!.toString()
            obj.permission = (fir.children as any)
            obj.moduleNameLength = item.children.length
            this.dtlPermissionList.push(obj)
          })
        })
        // 构造权限列表
        let count = 0
        for (let i = 0; i < this.rolePermissionList.length; i++) {
          if (i === 0) {
            this.rolePermissionList[i].specialIndex = 0
          } else { // todo
            if (this.rolePermissionList[i].businessName !== this.rolePermissionList[i - 1].businessName &&
              this.rolePermissionList[i + 1] && this.rolePermissionList[i].businessName === this.rolePermissionList[i + 1].businessName) {
              count += this.rolePermissionList[i - 1].moduleNameLength
              this.rolePermissionList[i].specialIndex = count
            } else { // 越界
              if (i + 1 >= this.rolePermissionList.length && this.rolePermissionList[i].moduleNameLength === 1) {
                count += this.rolePermissionList[i - 1].moduleNameLength
                this.rolePermissionList[i].specialIndex = count
              }
            }
          }
          for (let j = 0; j < this.dtlPermissionList.length; j++) {
            if (this.rolePermissionList[i].moduleName === this.dtlPermissionList[j].moduleName) {
              // this.rolePermissionList[i].copyPermission = this.dtlPermissionList[j].permission
              let arr: any = []
              this.dtlPermissionList[j].permission.forEach((item: any) => {
                arr.push(item.caption)
              })
              this.rolePermissionList[i].copyPermission = arr.join(',')
              break
            } else {
              this.rolePermissionList[i].copyPermission = ''
            }
          }
        }
        console.log(this.rolePermissionList)
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private getListPers() {
    let loading = Loading.show()
    RoleApi.listPerms().then(resp => {
      if (resp && resp.success) {
        loading.hide()
        resp.data.forEach((item: any) => {
          item.children.forEach((fir: any) => {
            let obj = {
              businessName: '',
              moduleName: '',
              permission: [],
              copyPermission: '',
              moduleNameLength: 0,
              code: '',
              name: ''
            }
            obj.businessName = item.caption!.toString()
            obj.moduleName = fir.caption!.toString()
            obj.permission = (fir.children as any)
            obj.moduleNameLength = item.children.length
            this.rolePermissionList.push(obj)
          })
        })
        this.getRoleDtlList()
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}


