import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import UserApi from 'http/framework/user/UserApi'
import { Loading } from 'fant'

@Component({
  name: 'EmployDtl',
  components: {
    PageBody,
    ListContainer
  }
})
export default class EmployDtl extends Vue {
  menu = [
    {
      name: '员工',
      url: '/employManage'
    },
    {
      name: '员工详情'
    }
  ]
  employDtl: any = ''
  version = 0
  get getRoles() {
    if (this.employDtl && this.employDtl.roles) {
      let str = ''
      this.employDtl.roles.forEach((item: any, index: any) => {
        if (index === this.employDtl.roles.length - 1) {
          str += item.name
        } else {
          str += item.name + ','
        }
      })
      return str
    } else {
      return ''
    }
  }

  get getPricePerms() {
    if (this.employDtl && this.employDtl.pricePerms) {
      let str = ''
      this.employDtl.pricePerms.forEach((item: any, index: any) => {
        if (index === this.employDtl.pricePerms.length - 1) {
          str += item.caption
        } else {
          str += item.caption + ','
        }
      })
      return str
    } else {
      return ''
    }
  }

  get getScopePerms() {
    if (this.employDtl && this.employDtl.warehousePerms) {
      if (this.employDtl.warehousePerms.captions.length === 0) {
        return '全部仓库'
      }
      let str = ''
      this.employDtl.warehousePerms.captions.forEach((item: any, index: any) => {
        if (index === this.employDtl.warehousePerms.captions.length - 1) {
          str += item.value
        } else {
          str += item.value + ','
        }
      })
      return str
    } else {
      return ''
    }
  }

  mounted() {
    let id = this.$route.query.id
    this.getEmployDtl(id)
  }

  onEdit() {
    // todo
    let id = this.$route.query.id
    this.$router.push({ name: 'employEdit', query: { id: id, type: 'edit' } })
  }

  onDel() {
    this.$msgBox.confirm('删除', '确定删除该员工？', () => {
      let loading = Loading.show()
      let id = this.$route.query.id
      UserApi.delete(id, this.version).then(resp => {
        if (resp && resp.success) {
          loading.hide()
          this.$message.success('删除成功')
          this.$router.push('employManage')
        }
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  private getEmployDtl(id: string) {
    let loading = Loading.show()
    UserApi.get(id).then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.version = resp.data.version
        this.employDtl = resp.data
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }
}


