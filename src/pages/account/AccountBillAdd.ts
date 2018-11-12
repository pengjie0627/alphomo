import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectAccountBill from 'pages/account/cmp/SelectAccountBill.vue'
import SupplierStatementApi from 'http/supplierstatement/SupplierStatementApi'
import { Dialog, FormValidator, DateUtil } from 'fant'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import QueryParam from 'model/request/QueryParam'
import UserApi from 'http/framework/user/UserApi'
import Invoice from 'model/invoice/Invoice'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import SupplierStatement from 'model/supplierstatement/SupplierStatement'
import Ucn from 'model/entity/Ucn'
import SupplierStatementLine from 'model/supplierstatement/SupplierStatementLine'
import PermissionMgr from 'mgr/PermissionMgr'
import Search from 'cmp/Search.vue'
// import SupplierStatementBill from 'model/supplierstatement/SupplierStatementBill'

@Component({
  name: 'AccountBillAdd',
  components: {
    PageBody,
    BillBody,
    QfImgUpload,
    SelectAccountBill,
    Search
  }
})

export default class AccountBillAdd extends Vue {
  @State('user') user: User
  $refs: {
    invetory: any
  }
  menu = [{
    name: '结算单',
    url: '/accountBillList'
  }, {
    name: '新建结算单'
  }]
  type = '' // 新建/编辑
  tableData: any[] = [
    {
      amount: 0, // 实际结算金额
      discountAmount: 0, // 优惠金额
      settleAmount: 0 // 结算金额
    }
  ]
  inventoryTableData: Invoice[] = [] // 发票tableData
  note = ''
  inventor: any = '' // 开票信息
  imgUploadData: any[] = []
  preNumber = '' // 预结算单
  providerList: any[] = [] // 服务商
  selectProvider: any = null // 选择服务商
  manageList: any[] = [] // 经办人
  selectManage: any = {} // 选择经办人
  selectDate = '' // 选择日期
  makeBillDate = '' // 制单日期
  isInventoryFlag = false // 是否勾选已开票
  editMerchant: any = ''
  // selectManageName: any = {}
  billTableData: any[] = []
  validator = new FormValidator()
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  uploadSupplier: any = ''
  uploadManage: any = ''
  selectBillFlag = false
  @Watch('selectProvider')
  onSelectProviderChange(value: any) {
    if (value) {
      this.getSupplyInfo(value.id)
    }
  }
  // @Watch('getCurrentAmount',{ deep: true })
  // onTableDataChange(newValue: any) {
  //   if (this.type === 'edit' && !this.selectBillFlag) {
  //     this.$set(this.tableData[0], 'amount', Number(newValue) - Number(this.tableData[0].discountAmount))
  //   } else {
  //     this.$set(this.tableData[0], 'settleAmount', Number(newValue))
  //     this.$set(this.tableData[0], 'discountAmount', 0)
  //     this.$set(this.tableData[0], 'amount', Number(newValue) - Number(this.tableData[0].discountAmount))
  //   }
  // }
  @Watch('isInventoryFlag')
  onInventoryChange(value: boolean) {
    if (value) {
      if (this.inventoryTableData.length === 0) {
        let rowDta = new Invoice()
        rowDta.category = 'VAT'
        // rowDta.amount = this.tableData[0].amount
        this.inventoryTableData.push(rowDta)
      }
    } else {
      this.inventoryTableData.length = 0
    }
  }

  /**
   * 获取结算金额
   */
  getCurrentAmount() {
    let sum = 0
    if (this.billTableData && this.billTableData.length > 0) {
      // this.selectBillFlag = true
      this.billTableData.forEach(item => {
        sum += Number(item.paidAmount)
      })
    }
    // this.$set(this.tableData[0], 'settleAmount' , sum)
    return sum
  }
  mounted() {
    // 获取界面类型
    this.type = this.$route.query.type
    // 新建初始化
    if (this.type === 'add') {
      this.menu[1].name = '新建结算单'
      let manager: Ucn = new Ucn()
      manager.id = this.user.id
      manager.code = this.user.mobile
      manager.name = this.user.name
      this.selectManage = manager
      this.getManageList()
      this.getProviderList()
      this.validator.push({
        supplyName: [
          { required: true, message: '请选择供应商' }
        ],
        manage: [
          { required: true, message: '请选择经办人' }
        ],
        date: [
          { required: true, message: '请选择业务日期' }
        ]
      })
      // 初始化开票行
      // let firData = new Invoice()
      // firData.category = 'VAT'
      // firData.amount = this.tableData[0].amount
      // this.inventoryTableData.push(firData)
      // 初始化业务日期
      this.selectDate = DateUtil.format(new Date(), 'yyyy-MM-dd')
      // 初始化制单日期
      this.makeBillDate = DateUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      this.getPreNum()
    } else { // 编辑初始化
      this.validator.push({
        manage: [
          { required: true, message: '请选择经办人' }
        ]
      })
      this.menu[1].name = '编辑结算单'
      // this.preNumber = this.$route.query.uuid
      this.getDetail(this.$route.query.uuid)
    }
    this.validator.push({
      tableAmount: [
        { max: 999999, message: '实际结算不得大于999999！' }
      ],
      tableDiscountAmount: [
        { max: 999999, message: '已优惠不得大于999999！' }
      ],
      validatorInventorAmount: [
        { max: 999999, message: '发票金额不得大于999999！' }
      ],
    })
    if (this.isInventoryFlag) {
      this.validator.push({
        validatorInventorAmount: [
          { max: 999999, message: '发票金额不得大于999999！' }
        ]
      })
    }
  }

  setManager(manager: User) {
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    this.selectManage = m
  }
  onManagerClear() {
    this.selectManage = null
  }
  setSupplier(manager: User) {
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    this.selectProvider = m
  }
  onSupplierClear() {
    this.selectProvider = null
  }
  /**
   * 图片回调
   * @param imgs
   */
  getImage(imgs: any) {
    console.log(imgs)
    // this.imgUrl = imgs[0]
  }

  /**
   * 选择付款的单据
   */
  onSelectAccountBill() {
    if (this.type === 'add') {
      if (!this.selectProvider) {
        this.$message.error('请先选择供应商')
        return
      }
    }
    // if (!this.tableData[0].amount) {
    //   this.$message.error('请先填写实际结算金额')
    //   return
    // }
    new Dialog(SelectAccountBill, {
      uuids: () => {
        if (this.billTableData && this.billTableData.length > 0) {
          let arrId: any[] = []
          this.billTableData.forEach(item => {
            arrId.push(item.billUuid)
          })
          return arrId
        } else {
          return []
        }
      },
      supplierId: this.selectProvider.id,
      manageList: this.manageList,
      onConfirm: (billTableData: any) => {
        if (billTableData && billTableData.length > 0) {
          billTableData.forEach((item: any) => {
            let oLine = new SupplierStatementLine()
            oLine.billUuid = item.id
            oLine.billNum = item.billNum
            oLine.billType = item.businessType
            oLine.billBusinessDate = item.businessDate
            oLine.billManager = item.manager
            oLine.amount = item.realAmount
            oLine.paidAmount = item.remainedAmount
            oLine.remainAmount = item.remainedAmount
            this.billTableData.push(oLine)
          })
          this.$set(this.tableData[0], 'discountAmount', 0)
          this.$set(this.tableData[0], 'settleAmount', this.getCurrentAmount())
          this.$set(this.tableData[0], 'amount', Number(this.tableData[0].settleAmount) - Number(this.tableData[0].discountAmount))
        }
      }
    }).show()
  }

  /**
   * 保存
   */
  onSave() {
    this.validator.validate(true).then(() => {
      if (this.isInventoryFlag && !this.checkInvatoryInfo('number')) {
        this.$message.error('发票号码为必填项')
        return
      }
      if (this.isInventoryFlag && !this.checkInvatoryInfo('amount')) {
        this.$message.error('发票金额不能为空')
        return
      }
      if (this.type === 'add') {
        SupplierStatementApi.create(this.setSaveParams()).then(resp => {
          if (resp.data && resp.success) {
            this.$message.success('新增成功')
            this.$router.push({ name: 'accountBillDtl',
              query: {
                uuid : resp.data, ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams
              } })
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      } else {
        SupplierStatementApi.save(this.setSaveParams()).then(resp => {
          if (resp.data && resp.success) {
            this.$message.success('修改成功')
            this.$router.push({ name: 'accountBillDtl',
              query: {
                uuid : this.$route.query.uuid, ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams
              } })
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      }
    })
  }

  /**
   * 新增一行发票行
   * @param event
   */
  onAddTableRow(row: any) {
    if (row.rowIndex === 9) {
      this.$message.error('最多只能有10张发票')
      return
    }
    if (row.rowIndex === this.inventoryTableData.length - 1) {
      let rowDta = new Invoice()
      rowDta.category = 'VAT'
      // rowDta.amount = this.tableData[0].amount
      this.inventoryTableData.push(rowDta)
      this.$nextTick(() => {
        this.$refs.invetory[row.rowIndex + 1].$refs.input.focus()
        // console.log(this.$refs.invetory[row.rowIndex].$refs.input.focus())
      })
    }
  }

  /**
   * 金额格式化
   * @param row
   * @param column
   * @param value
   */
  formatter(row: any, column: any, value: string) {
    if (value) {
      return parseFloat(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  /**
   * 删除结算单据行
   * @param row
   */
  onDelRow(row: any) {
    this.billTableData.splice(row.rowIndex, 1)
    this.$set(this.tableData[0], 'discountAmount', 0)
    this.$set(this.tableData[0], 'settleAmount', this.getCurrentAmount())
    this.$set(this.tableData[0], 'amount', Number(this.tableData[0].settleAmount) - Number(this.tableData[0].discountAmount))
  }
  onDelInvetoryRow(row: any) {
    this.inventoryTableData.splice(row.rowIndex, 1)
  }

  /**
   * 保存并审核
   */
  onAudit() {
    this.validator.validate(true).then(() => {
      if (this.isInventoryFlag && !this.checkInvatoryInfo('number')) {
        this.$message.error('发票号码为必填项')
        return
      }
      if (this.isInventoryFlag && !this.checkInvatoryInfo('amount')) {
        this.$message.error('发票金额不能为空')
        return
      }
      SupplierStatementApi.saveAndAudit(this.setSaveParams()).then(resp => {
        if (resp.data && resp.success) {
          SupplierStatementApi.audit(resp.data).then(() => {
            this.$message.success('新增并审核成功')
            this.$router.push({ name: 'accountBillDtl',
              query: {
                uuid : resp.data, ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams
              } })
          }).catch(error => {
            this.$message.error(error.message)
          })
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }

  /**
   * 取消
   */
  onCancel() {
    this.$router.back()
  }
  onPaidAmountChange(row: any) {
    if (row.remainAmount < 0) {
      if (row.paidAmount > 0) {
        // this.$set(row, 'paidAmount', row.remainAmount)
      } else {
        if (Math.abs(row.remainAmount) < Math.abs(row.paidAmount)) {
          this.$set(row, 'paidAmount', row.remainAmount)
        }
      }
    } else {
      if (row.paidAmount > row.remainAmount) {
        this.$set(row, 'paidAmount',row.remainAmount)
      }
    }
    this.$set(this.tableData[0], 'discountAmount', 0)
    this.$set(this.tableData[0], 'settleAmount', this.getCurrentAmount())
    this.$set(this.tableData[0], 'amount', Number(this.tableData[0].settleAmount) - Number(this.tableData[0].discountAmount))
  }
  onAmountChange() {
    if (this.tableData[0].amount) {
      this.$set(this.tableData[0], 'discountAmount', Number(this.tableData[0].settleAmount) - Number(this.tableData[0].amount))
      // todo alphamo-1240让去掉
      // if (this.isInventoryFlag) {
      //   this.$set(this.inventoryTableData[0], 'amount', this.tableData[0].amount)
      // }
    } else {
      this.$set(this.tableData[0], 'amount', 0)
    }
  }
  onDiscountChange() {
    if (this.tableData[0].discountAmount) {
      this.$set(this.tableData[0], 'amount', Number(this.tableData[0].settleAmount) - Number(this.tableData[0].discountAmount))
      // todo alphamo-1240让去掉
      // if (this.isInventoryFlag) {
      //   this.$set(this.inventoryTableData[0], 'amount', Number(this.tableData[0].settleAmount) - Number(this.tableData[0].discountAmount))
      // }
    } else {
      this.$set(this.tableData[0], 'discountAmount', 0)
    }
  }

  /**
   * 获取预单号
   */
  private getPreNum() {
    SupplierStatementApi.getNum().then((resp) => {
      this.preNumber = resp.data
    }).catch((error) => {
      this.$message.error(error.message)
    })
  }

  /**
   * 获取供应商列表
   */
  private getProviderList() {
    let query = new QueryParam()
    query.start = 0
    query.limit = 0
    SupplierApi.query(query).then(resp => {
      this.providerList = resp.data
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  /**
   * 获取经办人列表
   */
  private getManageList() {
    let query = new QueryParam()
    query.start = 0
    query.limit = 0
    UserApi.query(query).then(resp => {
      this.manageList = resp.data
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  /**
   * 获取开票信息
   */
  private getSupplyInfo(selectProvider: any) {
    SupplierApi.get(selectProvider).then((resp) => {
      this.inventor = resp.data
    }).catch((error) => {
      this.$message.error(error.message)
    })
  }

  /**
   * 获设置保存参数
   */
  private setSaveParams() {
    let supplier = new SupplierStatement()
    supplier.merchant = this.user.merchant
    if (this.type === 'add') {
      // let supplierUcn = new Ucn()
      // this.providerList.forEach(item => {
      //   if (item.id === this.selectProvider.id) {
      //     supplierUcn.id = item.id
      //     supplierUcn.code = item.code
      //     supplierUcn.name = item.name
      //   }
      // })
      supplier.supplier = this.selectProvider
      let manageUcn = new Ucn()
      this.manageList.forEach(item => {
        if (item.id === this.selectManage.id) {
          manageUcn.id = item.id
          manageUcn.code = item.code
          manageUcn.name = item.name
        }
      })
      supplier.manager = manageUcn
    } else {
      supplier.supplier = this.selectProvider
      supplier.manager = this.selectManage
    }
    supplier.billNum = this.preNumber
    supplier.businessDate = new Date(this.selectDate)
    supplier.amount = this.tableData[0].amount
    supplier.discountAmount = this.tableData[0].discountAmount
    supplier.settleAmount = this.tableData[0].settleAmount
    supplier.isInvoice = this.isInventoryFlag
    // 和后端沟通为空@王建华
    supplier.status = ''
    supplier.payStatus = ''
    supplier.remark = this.note
    supplier.images = this.imgUploadData
    supplier.lines = this.billTableData
    if (this.isInventoryFlag) {
      supplier.invoices = this.inventoryTableData
    }
    if (this.type !== 'add') {
      supplier.id = this.$route.query.uuid
    }
    return supplier
  }

  /**
   * 检查发票信息
   */
  private checkInvatoryInfo(type: string) {
    let oCheck = this.inventoryTableData.filter(item => {
      if (type === 'number') {
        if (!item.number) {
          return item
        }
      } else {
        if (!item.amount && item.amount !== 0) {
          return item
        }
      }
    })
    if (oCheck.length > 0) {
      return false
    } else {
      return true
    }
  }

  /**
   * 获取详情
   */
  private getDetail(uuid: string) {
    SupplierStatementApi.detail(uuid).then((resp) => {
      if (resp.data && resp.success) {
        this.preNumber = resp.data!.billNum!
        this.editMerchant = resp.data
        this.selectProvider = resp!.data!.supplier!.id! || ''
        this.selectManage = resp!.data!.manager
        // this.selectManageName = resp!.data!.manager
        this.selectDate = resp!.data!.businessDate!.toString().substring(0,10)
        this.note = resp.data.remark || ''
        if (resp.data.isInvoice) {
          this.inventoryTableData = resp.data.invoices
          this.isInventoryFlag = resp.data.isInvoice
        }
        this.getSupplyInfo(resp!.data!.supplier!.id!)
        this.imgUploadData = resp.data.images
        this.makeBillDate = resp.data.created.toString()
        this.selectProvider = resp.data.supplier
        this.selectManage = resp.data.manager
        if (resp.data.lines && resp.data.lines.length > 0) {
          resp.data.lines.forEach((item, index) => {
            let line = new SupplierStatementLine()
            line.id = item.id
            line.billNum = item.billNum
            line.billUuid = item.billUuid
            line.billType = item.billType
            line.billBusinessDate = item.billBusinessDate
            line.billManager = item.billManager
            line.amount = item.amount
            line.paidAmount = item.paidAmount
            line.remainAmount = item.remainAmount
            this.billTableData.push(line)
          })
        }
        this.tableData[0].amount = resp.data.amount
        this.tableData[0].discountAmount = resp.data.discountAmount
        this.tableData[0].settleAmount = resp.data.settleAmount
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}





