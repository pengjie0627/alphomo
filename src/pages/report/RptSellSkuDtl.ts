import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import SellRptDtlSku from 'pages/report/cmp/sellRptDtlSku.vue'
import SellRptDtlSupplier from 'pages/report/cmp/SellRptDtlSupplier.vue'
import SellRptDtlBusiness from 'pages/report/cmp/SellRptDtlBusiness.vue'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import PurchaseReportApi from 'http/purchase/report/PurchaseReportApi.ts'
import { DateUtil, Dialog, Loading } from 'fant'
import SkuApi from 'http/basicdata/sku/SkuApi'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import ExportDialog from 'cmp/ExportDialog.vue'
import JobQueryApi from 'http/excel/JobQueryApi'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  name: 'rpt-sell-sku-dtl',
  components: {
    QfPageBody,
    SellRptDtlSku,
    SellRptDtlSupplier,
    SellRptDtlBusiness
  }
})
export default class RptSellSkuDtl extends Vue {
  tableData: any[] = []
  summary: any = null
  //
  type: string = '' // 表示从哪个列表页进来的
  supplierP: string = '' // 供应商详情对应的供应商id
  skuP: string = '' // 商品详情对应的商品id
  //
  totalType = 'business' // 统计维度
  start = 0
  totalItem = 0
  pageSize: number = 10
  hasPermission = PermissionMgr.hasOptionPermission

  // 搜索条件
  businessDate: any = [DateUtil.clearTime(new Date()) + ' 00:00:00', DateUtil.clearTime(new Date()) + ' 00:00:00']
  billType = '' // 业务类型
  billNum: string = '' // 单号
  skuName: string = '' // 商品名称
  supplierName: string = '' // 供应商名称

  // 供应商-商品查询条件
  queriesSku: QueryParam = new QueryParam()
  // 商品-供应商查询条件
  queriesSupplier: QueryParam = new QueryParam()
  // 单据查询条件
  queriesBill: QueryParam = new QueryParam()

  //
  titleName: string = ''
  titleCode: string = ''
  warehouse: string = '' // 仓库名，参数
  warehouseId: string = '' // 仓库id

  get menu() {
    return [{
      name: '进货报表',
      icon: '',
      url: '/sellRptList'
    }, {
      name: this.type === 'BUSINESS' ? '单据流水' : this.type === 'SKU' ? '商品详情' : '供应商详情',
      icon: '',
      url: ''
    }]
  }


  beforeMount() {
    let params: any = this.$route.query
    this.type = params!.type
    this.supplierP = params!.supplierP! || ''
    this.skuP = params!.skuP! || ''
    this.warehouse = params!.warehouse! || '全部'
    this.warehouseId = params!.warehouseId! || ''
    let date = params!.businessDate
    if (date) {
      this.businessDate[0] = DateUtil.format(new Date(date), 'yyyy-MM-dd') + ' 00:00:00'
      this.businessDate[1] = DateUtil.format(new Date(date), 'yyyy-MM-dd') + ' 00:00:00'
    }
    if (this.type === 'BUSINESS') {
      this.titleName = '单据流水'
    } else if (this.type === 'SKU') {
      SkuApi.getThin(this.skuP).then((res) => {
        if (res && res.success && res.data) {
          this.titleName = res.data!.name!
          this.titleCode = res.data!.barcode!
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
      // this.titleName = params!.sku!.name + ' ' + params!.sku!.spec
      // this.titleCode = params!.sku.code
    } else if (this.type === 'SUPPLIER') {
      SupplierApi.getThin(this.supplierP).then((res) => {
        if (res && res.success && res.data) {
          this.titleName = res.data!.name!
          this.titleCode = '联系方式：' + (res.data!.mobile ? res.data!.mobile! : '')
        }
      }).catch((err) => {
        this.$message.error(err.message)
      })
    }
    console.log(this.type)
    console.log(this.supplierP)
    console.log(this.skuP)
    console.log(date)
    //

    // 供应商-商品查询条件
    let queriesSku = this.queriesSku
    queriesSku.limit = this.pageSize
    let f1: FilterParam = new FilterParam('businessDate:[,]', '')
    let f2: FilterParam = new FilterParam('skuName:%=%', '')
    let f3: FilterParam = new FilterParam('supplier:=', '')
    let f4: FilterParam = new FilterParam('warehouseUuid:=', this.warehouseId! || '')
    queriesSku.filters.push(f1)
    queriesSku.filters.push(f2)
    queriesSku.filters.push(f3)
    queriesSku.filters.push(f4)
    // 商品-供应商查询条件
    let queriesSupplier = this.queriesSupplier
    queriesSupplier.limit = this.pageSize
    let f21: FilterParam = new FilterParam('businessDate:[,]', '')
    let f22: FilterParam = new FilterParam('supplierName:%=%', '')
    let f23: FilterParam = new FilterParam('sku:=', '')
    let f24: FilterParam = new FilterParam('warehouseUuid:=', this.warehouseId! || '')
    queriesSupplier.filters.push(f21)
    queriesSupplier.filters.push(f22)
    queriesSupplier.filters.push(f23)
    queriesSupplier.filters.push(f24)
    // 单据查询条件
    let queriesBill = this.queriesBill
    queriesBill.limit = this.pageSize
    let f31: FilterParam = new FilterParam('businessDate:[,]', '')
    let f32: FilterParam = new FilterParam('billNum:%=%', '')
    let f33: FilterParam = new FilterParam('billType:=', '')
    let f34: FilterParam = new FilterParam('sku:=', '')
    let f35: FilterParam = new FilterParam('supplier:=', '')
    let f36: FilterParam = new FilterParam('warehouseUuid:=', this.warehouseId! || '')
    queriesBill.filters.push(f31)
    queriesBill.filters.push(f32)
    queriesBill.filters.push(f33)
    queriesBill.filters.push(f34)
    queriesBill.filters.push(f35)
    queriesBill.filters.push(f36)
  }


  mounted() {
    this.onSearch()
  }

  goBack() {
    this.$router.back()
  }

  onExport() {
    if (this.type === 'SUPPLIER' && this.totalType === 'sku') {
      this.exportSupplierSkuList()
    }
    if (this.type === 'SKU' && this.totalType === 'supplier') {
      this.exportSkuSupplierExport()
    }
    if (this.type === 'SUPPLIER' && this.totalType === 'business') {
      this.exportSupplierBillList()
    }
    if (this.type === 'SKU' && this.totalType === 'business') {
      this.exportSkuBillExport()
    }
    if (this.type === 'BUSINESS') {
      this.exportBusinessBillList()
    }
  }

  onSearch() {
    if (this.type === 'SUPPLIER' && this.totalType === 'sku') {
      if (this.businessDate !== null && this.businessDate.length < 2) {
        this.queriesSku.filters[0].value = ''
      } else {
        this.queriesSku.filters[0].value = this.businessDate
      }
      this.queriesSku.filters[1].value = this.skuName
      this.queriesSku.filters[2].value = this.supplierP
      this.queriesSku.filters[3].value = this.warehouseId! || ''
      this.getSkuList()
    }
    if (this.type === 'SKU' && this.totalType === 'supplier') {
      if (this.businessDate !== null && this.businessDate.length < 2) {
        this.queriesSupplier.filters[0].value = ''
      } else {
        this.queriesSupplier.filters[0].value = this.businessDate
      }
      this.queriesSupplier.filters[1].value = this.supplierName
      this.queriesSupplier.filters[2].value = this.skuP
      this.queriesSupplier.filters[3].value = this.warehouseId! || ''
      this.getSupplierList()
    }
    if (this.type === 'BUSINESS' || (this.type !== 'BUSINESS' && this.totalType === 'business')) {
      if (this.businessDate !== null && this.businessDate.length < 2) {
        this.queriesBill.filters[0].value = ''
      } else {
        this.queriesBill.filters[0].value = this.businessDate
      }
      this.queriesBill.filters[1].value = this.billNum
      this.queriesBill.filters[2].value = this.billType
      this.queriesBill.filters[3].value = this.skuP
      this.queriesBill.filters[4].value = this.supplierP
      this.queriesBill.filters[5].value = this.warehouseId! || ''
      this.getBusinessList()
    }
  }

  onPageChange() {
    if (this.type === 'SUPPLIER' && this.totalType === 'sku') {
      this.getSkuList()
    }
    if (this.type === 'SKU' && this.totalType === 'supplier') {
      this.getSupplierList()
    }
    if (this.type === 'BUSINESS' || (this.type !== 'BUSINESS' && this.totalType === 'business')) {
      this.getBusinessList()
    }
  }

  getSkuList() {
    this.queriesSku.start = (this.start - 1) * this.pageSize
    let loading = Loading.show()
    PurchaseReportApi.querySupplier(true, this.queriesSku).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.tableData = res.data
        this.summary = res.summary
        this.totalItem = res.total
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  getSupplierList() {
    this.queriesSupplier.start = (this.start - 1) * this.pageSize
    let loading = Loading.show()
    PurchaseReportApi.querySupplier(true, this.queriesSupplier).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.tableData = res.data
        this.summary = res.summary
        this.totalItem = res.total
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  getBusinessList() {
    this.queriesBill.start = (this.start - 1) * this.pageSize
    let loading = Loading.show()
    PurchaseReportApi.businessBills(this.queriesBill).then((res) => {
      if (res && res.success) {
        loading.hide()
        this.tableData = res.data
        this.summary = res.summary
        this.totalItem = res.total
        if (this.type === 'BUSINESS') {
          this.titleCode = '进货单：' + res.summary!.purchaseCount + '；进货退货单：' + res.summary!.returnCount
        }
      }
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  /**
   * 改变统计维度，清空除时间之外的其他条件
   */
  changeSelect() {
    this.skuName = ''
    this.supplierName = ''
    this.billNum = ''
    this.billType = ''
    this.start = 1
    this.totalItem = 0
    this.onSearch()
  }

  /**
   * 重置
   */
  onReset() {
    this.billNum = ''
    this.billType = ''
    this.start = 1
    this.totalItem = 0
    this.onSearch()
  }

  onSortChange(val: any) {
    this.start = 1
    if (this.type === 'SUPPLIER' && this.totalType === 'sku') {
      this.queriesSku.sorters = val
      this.getSkuList()
    }
    if (this.type === 'SKU' && this.totalType === 'supplier') {
      this.queriesSupplier.sorters = val
      this.getSupplierList()
    }
    if (this.type === 'BUSINESS' || (this.type !== 'BUSINESS' && this.totalType === 'business')) {
      this.queriesBill.sorters = val
      this.getBusinessList()
    }
  }

  private exportBusinessBillList() {
    new Dialog(ExportDialog, {
      title: '导出进货报表-单据流水',
      onExport: () => {
        return PurchaseReportApi.exportBusinessBillList(this.queriesBill)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  private exportSupplierBillList() {
    new Dialog(ExportDialog, {
      title: '导出供应商详情-按业务统计',
      onExport: () => {
        return PurchaseReportApi.exportSupplierBillList(this.queriesBill)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  private exportSkuBillExport() {
    new Dialog(ExportDialog, {
      title: '导出商品详情-按业务统计',
      onExport: () => {
        return PurchaseReportApi.exportSkuBillExport(this.queriesBill)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   * 商品-按供应商维度
   */
  private exportSkuSupplierExport() {
    new Dialog(ExportDialog, {
      title: '导出商品详情-按供应商统计',
      onExport: () => {
        return PurchaseReportApi.exportSkuSupplierExport(true, this.queriesSupplier)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

  /**
   * 供应商-按商品维度
   */
  private exportSupplierSkuList() {
    new Dialog(ExportDialog, {
      title: '导出供应商详情-按供应商统计',
      onExport: () => {
        return PurchaseReportApi.exportSupplierSkuList(this.queriesSku)
      },
      onProgress: (val: string) => {
        return JobQueryApi.query(val)
      }
    }).show()
  }

}
