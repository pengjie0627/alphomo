import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import QueryCondition from 'cmp/QueryCondition.vue'
import EmployListTable from 'pages/employ/cmp/EmployListTable.vue'
import { Dialog, Loading } from 'fant'
// import AddCheckDialog from 'pages/employ/cmp/AddCheckDialog.vue'
import UserApi from 'http/framework/user/UserApi'
import User from 'model/framework/user/User'
import QueryParam from 'model/request/QueryParam'
import RoleApi from 'http/framework/role/RoleApi'
import ExcelImport from 'cmp/ExcelImport.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import ExportDialog from 'cmp/ExportDialog.vue'


@Component({
  name: 'EmployList',
  components: {
    PageBody,
    ListContainer,
    QueryCondition,
    EmployListTable
  }
})
export default class EmployList extends Vue {
  menu = [
    {
      name: '员工',
      url: '/employManage'
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
    note: '',
    nameAndNote: ''
  }
  employList: User[] = []
  sort: any[] = []
  queryArr: any[] = []
  isOpenFlag = false
  roleList: any[] = []
  downloadUrl = ''
  $refs: {
    selName: any
    query: any
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'employDtl' && from.name !== 'employManage' && to.name === 'employManage') {
      this.reset()
      this.$refs.query.doToggle()
    }
  }

  mounted() {
    this.sort.push({ 'property': 'lastModified', 'direction': 'DESC' })
    this.$refs.selName.focus()
    this.getEmployList(this.setParams())
    this.getRoleList()
    this.getUserTemplate()
  }

  onPageChange(val: number) {
    this.pagination.start = val / (this.pagination.limit - 1)
    this.getEmployList(this.setParams())
  }

  onAddEmploy() {
    // todo 有判断逻辑(下面注释的就是员工检查提示，下个版本做)
    // new Dialog(AddCheckDialog).show()
    // this.$router.replace('/employEdit?type=add')
    this.$router.push({ name: 'employEdit', query: { type: 'add' } })
  }

  onImportEmploy() {
    // todo
    new Dialog(ExcelImport, {
      title: '导入员工',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importUser(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      onConfirm: () => {
        this.getEmployList(this.setParams())
      },
      downloadUrl: this.downloadUrl
    }).show()
  }

  search(isOpen: boolean) {
    this.queryArr = []
    this.isOpenFlag = isOpen
    this.pagination.start = 1
    if (isOpen) {
      this.queryArr.push(this.query.name)
      this.queryArr.push(this.query.mobile)
      this.queryArr.push(this.query.status)
      this.queryArr.push(this.query.role)
      this.queryArr.push(this.query.note)
    } else {
      this.queryArr = [this.query.nameAndNote]
    }
    this.getEmployList(this.setParams())
  }

  reset() {
    // todo
    this.query.name = '',
      this.query.mobile = '',
      this.query.status = '',
      this.query.role = '',
      this.query.note = '',
      this.query.nameAndNote = ''
    this.queryArr = []
    this.pagination.start = 1
    this.getEmployList(this.setParams())
  }

  toggle(isOpen: boolean) {
    // todo
    this.isOpenFlag = isOpen
    if (isOpen) {
      this.query.nameAndNote = ''
    } else {
      this.query.name = ''
      this.query.mobile = ''
      this.query.note = ''
      this.query.role = ''
      this.query.status = ''
    }
  }

  onExport() {
    new Dialog(ExportDialog, {
      title: '导出员工',
      onExport: () => {
        return this.getExport()
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      },
      onConfirm: () => {
        // this.getEmployList(this.setParams())
      }
    }).show()
  }

  onBuyNow() {
    // todo
  }
  doEnterSearch() {
    this.search(this.isOpenFlag)
  }

  onRefreshList() {
    this.pagination.start = 1
    this.getEmployList(this.setParams())
  }

  refreshListBySort(sort: any[]) {
    this.pagination.start = 1
    this.sort = sort
    this.getEmployList(this.setParams())
  }

  private getEmployList(query: any) {
    let loading = Loading.show()
    UserApi.queryEmployee(query).then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.employList = resp.data
        this.pagination.total = resp.total
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  private setParams() {
    let query = new QueryParam()
    query.limit = 10
    query.start = (this.pagination.start - 1) * 10
    query.sorters = this.sort
    if (this.isOpenFlag) {
      query.filters.push({ 'property': 'name:%=%', 'value': this.queryArr[0] ? this.queryArr[0] : '' })
      query.filters.push({ 'property': 'mobile:%=%', 'value': this.queryArr[1] ? this.queryArr[1] : '' })
      query.filters.push({ 'property': 'status:=', 'value': this.queryArr[2] ? this.queryArr[2] : '' })
      query.filters.push({ 'property': 'roleId:=', 'value': this.queryArr[3] ? this.queryArr[3] : '' })
      query.filters.push({ 'property': 'remark:%=%', 'value': this.queryArr[4] ? this.queryArr[4] : '' })
    } else {
      if (this.queryArr[0]) {
        query.filters.push({ 'property': 'roleName:%=%', 'value': this.queryArr[0] ? this.queryArr[0] : '' })
      } else {
        query.filters = []
      }
    }
    return query
  }

  private getRoleList() {
    let query = new QueryParam()
    query.start = 0
    query.limit = 0
    let loading = Loading.show()
    RoleApi.query(query).then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.roleList = resp.data
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  private getExport() {
    return UserApi.exportList(this.setParams())
  }

  private getUserTemplate() {
    ExcelApi.listTemplate('user').then(resp => {
      if (resp && resp.success) {
        this.downloadUrl = resp.data[0]
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}



