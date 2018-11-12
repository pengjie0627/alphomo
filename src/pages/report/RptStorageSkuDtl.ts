import { Component, Vue, Watch } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import { DateUtil, Dialog, Loading } from 'fant'
import SkuApi from 'http/basicdata/sku/SkuApi'
import InventoryReportApi from 'http/inventory/report/InventoryReportApi'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import StorageRptDtlSku from 'pages/report/cmp/StorageRptDtlSku.vue'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'rpt-storage-sku-dtl',
  components: {
    QfPageBody,
    StorageRptDtlSku
  }
})
export default class RptStorageSkuDtl extends Vue {
  get menu() {
    return [{
      name: '库存报表',
      icon: '',
      url: '/storageRptList'
    }, {
      name: '商品详情',
      icon: '',
      url: ''
    }]
  }

  tableData: any[] = []
  skuP: string = '' // 商品详情对应的商品id。参数
  warehouse: string = '' // 商品详情对应的仓库名，参数
  warehouseId: string  // 商品详情对应的仓库id，参数

  // 分页信息
  start = 1
  totalItem = 0
  pageSize: number = 10
  hasPermission = PermissionMgr.hasOptionPermission

  // 查询条件
  businessDate: any[] = [DateUtil.clearTime(new Date()), DateUtil.clearTime(new Date())]
  queriesSku: QueryParam = new QueryParam()

  // 标题
  titleName: string = '商品名称规格'
  titleCode: string = '商品编码'

  beforeMount() {
    // 默认今天
    let today: Date = DateUtil.clearTime(new Date())
    this.businessDate[0] = DateUtil.format(today, 'yyyy-MM-dd HH:mm:ss')
    this.businessDate[1] = DateUtil.format(today, 'yyyy-MM-dd HH:mm:ss')
    // 参数
    let params: any = this.$route.query
    this.skuP = params!.skuP! || ''
    this.warehouse = params!.warehouseName! || '全部'
    this.warehouseId = params!.warehouseId! || ''

    // 查询条件
    let queriesSku = this.queriesSku
    queriesSku.limit = this.pageSize
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    queriesSku.filters.push(f1)
    this.title()
  }

  mounted() {
    this.onSearch()
  }

  @Watch('businessDate')
  onBusinessDateChange(value: any[]) {
    this.onSearch()
  }

  onSearch() {
    if (this.businessDate !== null && this.businessDate.length < 2) {
      this.queriesSku.filters[0].value = ''
    } else {
      this.queriesSku.filters[0].value = this.businessDate
    }
    if (this.warehouseId !== '') {
      this.queriesSku.filters.push(new FilterParam('warehouseUuid:=',this.warehouseId))
    }
    this.getList()
  }

  getList() {
    this.queriesSku.start = (this.start - 1) * this.pageSize
    let loading = Loading.show()
    InventoryReportApi.querySku(this.skuP, this.queriesSku).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.tableData = res.data
        this.totalItem = res.total
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  onPageChange() {
    this.getList()
  }

  onExport() {
    new Dialog(ExportDialog, {
      title: '导出库存报表-商品详情',
      onExport: () => {
        return InventoryReportApi.exportBySku(this.skuP, this.queriesSku)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }


  private title() {
    SkuApi.getThin(this.skuP).then((res) => {
      if (res && res.success) {
        this.titleName = res.data!.name!
        this.titleCode = res.data!.barcode!
      }
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }
}
