import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryCondition from 'cmp/QueryCondition.vue'
import RoleListTable from 'pages/role/cmp/RoleListTable.vue'
import RoleApi from 'http/framework/role/RoleApi'
import QueryParam from 'model/request/QueryParam'
import { Loading, Dialog } from 'fant'
import JobQueryApi from 'http/excel/JobQueryApi'
import UserApi from 'http/framework/user/UserApi'
import ExportDialog from 'cmp/ExportDialog.vue'

@Component({
  name: 'RoleList',
  components: {
    PageBody,
    ListContainer,
    QueryCondition,
    RoleListTable
  }
})
export default class RoleList extends Vue {
  menu = [
    {
      name: '角色管理',
      url: '/roleManage'
    }
  ]
  pagination = {
    total: 0,
    limit: 10,
    start: 1
  }
  query = {
    name: '',
    mobile: '',
    status: '',
    role: '',
    note: ''
  }
  roleList: any[] = []
  sort: any[] = []

  mounted() {
    this.sort.push({ 'property': 'lastModified', 'direction': 'DESC' })
    this.getRoleList()
  }

  onAddRole() {
    // todo 有判断逻辑
    this.$router.push({ name: 'roleEdit', query: { type: 'new' } })
  }

  onExport() {
    new Dialog(ExportDialog, {
      title: '导出销售报表-按商品统计',
      onExport: () => {
        return this.getExport()
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      },
      onConfirm: () => {
        this.getRoleList()
      }
    }).show()
  }

  onRefresh() {
    this.getRoleList()
  }

  onPageChange(val: number) {
    this.pagination.start = val / (this.pagination.limit - 1)
    this.getRoleList()
  }

  refreshListBySort(sort: any[]) {
    this.pagination.start = 1
    this.sort = sort
    this.getRoleList()
  }

  private getRoleList() {
    let query = new QueryParam()
    query.start = (this.pagination.start - 1) * 10
    query.limit = 10
    query.sorters = this.sort
    let loading = Loading.show()
    RoleApi.queryAll(query).then(resp => {
      if (resp && resp.success) {
        // todo
        loading.hide()
        this.roleList = resp.data
        this.pagination.total = resp.total
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  private getExport() {
    let query = new QueryParam()
    query.start = 0
    query.limit = 0
    return UserApi.exportList(query)
  }
}


