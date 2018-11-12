import { Component, Vue, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import TextInput from 'cmp/InputEx.vue'
import ListContainer from 'cmp/ListContainer.vue'
import EditCategory from 'pages/sku/cmp/EditCategory.vue'
import ExportDialog from 'cmp/ExportDialog.vue'
import SkuEdit from 'pages/sku/cmp/SkuEdit.vue'
import PermissionMgr from 'mgr/PermissionMgr'
import SkuCategoryApi from 'http/basicdata/sku/SkuCategoryApi'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import { Dialog, Loading } from 'fant'
import JobQueryApi from 'http/excel/JobQueryApi'
import ExcelApi from 'http/excel/ExcelApi'
import ExcelImport from 'cmp/ExcelImport.vue'


@Component({
  components: {
    PageBody,
    ListContainer,
    EditCategory,
    ExportDialog,
    SkuEdit,
    TextInput
  }
})
export default class SkuList extends Vue {
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  // 导入模板
  importTemplate: string
  skuCategoryList: SkuCategory[] = []
  uuid: string
  data: SkuCategory
  dragObj: SkuCategory = new SkuCategory()
  isEdit: boolean = false
  defaultProps = {
    children: 'children',
    label: 'name'
  }
  // 面包屑菜单
  menu = [{
    name: '商品',
    url: '/skuList'
  }, {
    name: '商品分类'
  }]
  resolveCopy: any = ''
  parent: any = {}
  completeFlag = false
  beforeMount() {
    ExcelApi.listTemplate('skuCategory').then((res) => {
      if (res && res.success) {
        this.importTemplate = res.data![0]!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  mounted() {
    this.getList()

  }


  getList() {
    let loading = Loading.show()
    SkuCategoryApi.getByMerchantMgr().then((resp) => {
      loading.hide()
      this.skuCategoryList = resp.data[0].children
      this.completeFlag = true
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  loadNode1(node: any, resolve: any) {
    this.resolveCopy = resolve
    if (node.level === 0) {
      SkuCategoryApi.getByCategory('').then(resp => {
        if (resp.success) {
          return resolve(resp.data)
        }
      })
    }
  }
  handleNodeClick(data: any) {
    this.uuid = data.id
    this.data = data
    this.isEdit = true
  }

  @Watch('data')
  watchData(value: SkuCategory) {
    if (value) {
      this.data = value
    }
  }

  handleDragEnd(draggingNode: any, dropNode: any, dropType: any, ev: any) {
    this.dragObj = draggingNode.data
    let parent: SkuCategory = new SkuCategory()
    let temp: SkuCategory = dropNode.data
    if (temp && this.dragObj && temp.code === this.dragObj.code) {
      temp = new SkuCategory()
    }
    parent.code = temp.code
    this.dragObj.parent = parent
    this.update()
  }

  update() {
    let loading = Loading.show()
    // 允许修改层级，但是后端会做校验。有子分类的情况下，层级不允许修改
    SkuCategoryApi.edit(this.dragObj).then(resp => {
      loading.hide()
      this.$emit('hide')
      this.getList()
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  doCreate() {
    if (this.data && this.data.id) {
      SkuCategoryApi.get(this.data.id).then((resp) => {
        this.data = resp.data
        this.createDialog()
      })
    } else {
      this.createDialog()
    }
  }

  doEdit() {
    new Dialog(EditCategory, {
      uuid: this.uuid,
      onConfirm: () => {
        this.getList()
      }
    }).show()
  }

  doDelete() {
    let loading = Loading.show()
    SkuCategoryApi.delete(this.uuid).then((resp) => {
      this.$message.success('删除成功')
      loading.hide()
      this.getList()
    }).catch((err) => {
      this.$message.error(err.message)
      loading.hide()
    })
  }

  /**
   * 选择商品分类
   */
  onSelectSkuCategory(data: SkuCategory) {
    console.log(data.code)
    // let filter: FilterParam = new FilterParam('categoryCode:=', data.code)
    // this.addFilter(filter)
    // this.query()
  }

  append(data: any) {
    const newChild = { id: data.id++, label: 'testtest', children: [] }
    if (!data.children) {
      this.$set(data, 'children', [])
    }
    data.children.push(newChild)
  }

  remove(node: any, data: any) {
    // const parent = node.parent
    // const children = parent.data.children || parent.data
    // const index = children.findIndex(d => d.id === data.id)
    // children.splice(index, 1)
    console.log(1)
  }

  /**
   *  导入商品分类资料
   */
  doImport() {
    new Dialog(ExcelImport, {
      title: '导入商品分类资料',
      doUpload: (files: any) => {
        return ExcelApi.upload(files)
      },
      doImport: (uuid: string) => {
        return ExcelApi.importSkuCategory(uuid)
      },
      doProgress: (uuid: string) => {
        return JobQueryApi.query(uuid)
      },
      onConfirm: () => {
        this.getList()
      },
      doStop: (uuid: string) => {
        // todo
      },
      downloadUrl: this.importTemplate
    }).show()
  }

  private createDialog() {
    new Dialog(EditCategory, {
      uuid: '',
      data: this.data, // 建议是把data改为prent（父级code），不然传一个不完整的data不符合面向对象编程设计
      onConfirm: () => {
        this.getList()
      }
    }).show()
  }

}
