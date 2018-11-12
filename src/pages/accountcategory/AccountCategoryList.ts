import { Component, Vue } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import ListContainer from 'cmp/ListContainer.vue'
import AccountCategoryApi from 'http/basicdata/accountcategory/AccountCategoryApi'
import { Dialog, Loading } from 'fant'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import SubjectEdit from './cmp/AccountCategoryEdit.vue'
import AccountCategory from 'model/basicdata/accountcategory/AccountCategory'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelImport from 'cmp/ExcelImport.vue'
import ExcelApi from 'http/excel/ExcelApi'
@Component({
  components: {
    PageBody,
    ListContainer,
    SubjectEdit
  }
})
export default class AccountCategoryList extends Vue {
  // 面包屑菜单
  menus = [{
    name: '科目',
    url: '/accountCategoryList'
  }]
  // 权限
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  // 查询数据
  keyword: string = ''
  // 界面长度限制
  limits = ConstantMgr.limits.sale
  // 表单查询数据对象
  query: QueryParam = new QueryParam()
  // 导出科目查询的 参数
  exportQuery: QueryParam = new QueryParam()
  // 科目数据
  data: AccountCategory[] = []
  // 选中的科目
  selectData: AccountCategory
  // 选中并展开
  selectId: string[] = []
  isSelect: boolean = false
  isCreate: boolean = false
  defaultProps = {
    key: 'id',
    children: 'children',
    label: 'name'
  }
  $refs: {
    tree: any
  }
  // 导入销售单模板
  importTemplate: string
  mounted() {
    this.getAccount()
  }
  beforeMount() {
    ExcelApi.listTemplate('accountCategory').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }
  getAccount() {
    let loading = Loading.show()
    AccountCategoryApi.getByMerchant().then((resp) => {
      loading.hide()
      if (resp.data) {
        this.data = resp.data
        if (this.selectData) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.selectData.id)
          })
        } else {
          this.selectData = resp.data[0]
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(resp.data[0].id)
          })
          this.isCreate = true
        }
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }
  getExpandAccount(selData: AccountCategory) {
    let loading = Loading.show()
    AccountCategoryApi.getByMerchant().then((resp) => {
      loading.hide()
      if (resp.data) {
        this.data = resp.data
        this.selectData = selData
        this.selectId = [selData.id || '']
        this.$refs.tree.setCurrentKey(selData.id)
        this.isSelect = true
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }
  onSelectAccountCategory(data: AccountCategory) {
    this.selectData = data
    this.selectId = [this.selectData.id || '']
    this.isCreate = true
    if (data.code !== null) {
      this.isSelect = true
    } else {
      this.isSelect = false
    }
  }

  handleCheckChange(data: AccountCategory, checked: boolean, indeterminate: any) {
    // if (checked === true) {
      // this.selectData = data
      // this.selectId = [this.selectData.id || '']
      // this.isSelect = true
    // } else {
    //   this.isSelect = false
    // }
  }

  importSubjectInfo() {
    new Dialog(ExcelImport, {
      title: '导入科目资料',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importAccountCategory(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      doStop: (uuid: string) => {
        // todo
      },
      onConfirm: () => {
        this.getAccount()
      },
      downloadUrl: this.importTemplate
    }).show()
  }

  doCreate() {
    new Dialog(SubjectEdit, {
      title: '新建科目',
      prentSub: this.selectData,
      doConfirm: (value: string) => {
        if (value) {
          this.getAccount()
        }
      }
    }).show()
  }

  doEdit() {
    new Dialog(SubjectEdit, {
      model: this.selectData,
      title: '编辑科目',
      doConfirm: (value: any) => {
        if (value) {
          this.getAccount()
        }
      }
    }).show()
  }

  doDelete() {
    let loading = Loading.show()
    AccountCategoryApi.delete(this.selectData.id || '',this.selectData.version).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.isCreate = false
        this.isSelect = false
        this.getAccount()
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  doExport() {
    console.log('导出')
    let query = new QueryParam()
    query.filters = []
    new Dialog(ExportDialog, {
      title: '导出全部科目',
      onExport: () => {
        return AccountCategoryApi.exportList(this.exportQuery)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  doSearch() {
    let filters: FilterParam[] = []
    filters.push(new FilterParam('keyword:=', this.keyword))
    this.query.start = 0
    this.query.limit = 10
    this.query.filters = filters
    this.getAccountList(this.query)
  }
  doEnterSearch() {
    this.doSearch()
  }

  getAccountList(query: QueryParam) {
    let loading = Loading.show()
    AccountCategoryApi.query(query).then((res) => {
      if (res && res.data && res.data.length > 0) {
        loading.hide()
        this.selectData = res.data[0]
        this.selectId = [res.data[0].id || '']
        this.$refs.tree.setCurrentKey(res.data[0].id)
        let currnetNode = this.$refs.tree.store.currentNode
        for (let a in this.$refs.tree.store.nodesMap) {
          // if (this.$refs.tree.store.nodesMap[a].id === currnetNode.parent.id) {
          //   break
          // }
          if (this.$refs.tree.store.nodesMap[a].id !== currnetNode.parent.id && this.$refs.tree.store.nodesMap[a].level === currnetNode.parent.level) {
            // this.$refs.tree.store.nodesMap[a].expanded = false
          } else {
            this.$refs.tree.store.nodesMap[a].expanded = true
          }
        }
        this.isSelect = true
        this.isCreate = true
      } else {
        loading.hide()
        this.$message.error('您搜索的科目不存在')
      }
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }
}
