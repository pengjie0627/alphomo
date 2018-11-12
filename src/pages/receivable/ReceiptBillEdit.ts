import { Component, Vue, Watch } from 'vue-property-decorator'
import BillViewTitle from 'pages/receivable/cmp/ViewTitle.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import BillViewMoneyTable from 'pages/receivable/cmp/BillViewMoneyTable.vue'
import BillEditMoneyTable from 'pages/receivable/cmp/BillEditMoneyTable.vue'
import BillEditActionTable from 'pages/receivable/cmp/BillEditActionTable.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import { DateUtil, FormValidator, Loading } from 'fant'
import Search from 'cmp/Search.vue'
import OperateLog from 'model/operatelog/OperateLog'
import Ucn from 'model/entity/Ucn'
import OssResult from 'model/image/OssResult'
import ConstantMgr from 'mgr/ConstantMgr'
import Receipt from 'model/statement/receipt/Receipt'
import ReceiptApi from 'http/statement/receipt/ReceiptApi'
import ReceivableReportApi from 'http/statement/receivable/ReceivableReportApi'
import ReceiptLine from 'model/statement/receipt/ReceiptLine'
import Customer from 'model/basicdata/customer/Customer'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import PermissionMgr from 'mgr/PermissionMgr'

class DOssObject {
  storageId: Nullable<string>
  imageUrl: Nullable<string>
  objectUrl: Nullable<string>
  url: Nullable<string>
}

@Component({
  components: {
    PageBody,
    BillBody,
    BillViewTitle,
    OperateLogView,
    BillViewMoneyTable,
    BillEditActionTable,
    BillEditMoneyTable,
    Search,
    QfImgUpload
  }
})
export default class ReceiptBillEdit extends Vue {
  @State('user') user: User
  menuList = [{
    name: '应收对账',
    url: '/receivableList'
  }, {
    name: '新建收款单'
  }]
  imgUploadData: DOssObject[] = []
  receipt: Receipt = new Receipt()
  customer: Customer = new Customer()
  validator: FormValidator = new FormValidator()
  billValidator: FormValidator = new FormValidator()
  logs: Array<OperateLog> = []
  id: string
  isView: boolean = false
  isEdit: boolean = false
  billNum: string = ''
  // 页面输入限制
  limits = ConstantMgr.limits.receivable
  hasPermissions: Function = PermissionMgr.hasOptionPermission


  data() {
    return {
      receipt: {
        customer: {},
        manager: {},
        businessDate: new Date()
      }
    }
  }

  @Watch('id')
  watchId(value: string) {
    this.id = value
  }

  beforeMount() {
    this.id = this.$route.query.id || ''
    if (this.id !== '') {
      this.menuList = [{
        name: '应收对账',
        url: '/receivableList'
      }, {
        name: '编辑收款单'
      }]
    }
  }

  mounted() {
    this.receipt.billNum = ''
    this.id = this.$route.query.id || ''
    this.customer.name = this.$route.query.customerName || ''
    this.customer.id = this.$route.query.customerId || ''
    this.customer.code = this.$route.query.customerCode || ''
    this.watchCustomer(this.customer)
    this.watchReceipt(this.receipt)
    if (this.id === '') {
      this.getNum()
      this.receipt.manager = new Ucn()
      this.receipt.manager = this.doGetUcn(this.user)
    } else {
      this.isEdit = true
      this.getDetail(this.id)
    }
    this.bindValidator()
    this.bindBillValidator()
  }

  /**
   * 获取UCN对象
   */
  doGetUcn(ucn: any) {
    let newValue = new Ucn()
    if (ucn) {
      newValue.id = ucn.id
      newValue.name = ucn.name
      newValue.code = ucn.code
    }
    return newValue
  }

  @Watch('customer')
  watchCustomer(value: Customer) {
    if (!value) {
      return new Ucn()
    }
    let m = new Ucn()
    m.id = value.id
    m.name = value.name
    m.code = value.code
    this.receipt.customer = m
    if (value.id) {
      this.getAmount(value.id!)
    }
  }

  get model() {
    if (Array.isArray(this.imgUploadData)) {
      return this.imgUploadData
    } else {
      if (this.imgUploadData) {
        let result: DOssObject[] = []
        result.push(this.imgUploadData)
        return result
      } else {
        return []
      }
    }
  }

  set model(item: DOssObject[]) {
    if (Array.isArray(this.imgUploadData)) {
      this.$emit('input', item)
    } else {
      this.$emit('input', item.length > 0 ? item[0] : null)
    }
  }

  getDetail(uuid: string) {
    let loading = Loading.show()
    ReceiptApi.detail(uuid).then((resp) => {
      loading.hide()
      let log: OperateLog = new OperateLog()
      this.receipt = resp.data
      this.billNum = this.receipt.billNum!
      if (resp.data) {
        log.operate = '制单人'
        log.operator = this.receipt.creator.name
        log.operateTime = this.receipt.created
        this.logs.push(log)
      }
      let $this = this
      if (resp.data.images) {
        resp.data.images.forEach(function (item) {
          let imgObj: DOssObject = new DOssObject()
          imgObj.storageId = item.storageId
          imgObj.url = item.url
          $this.imgUploadData.push(imgObj)
        })
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  bindValidator() {
    this.validator.push({
      customer: [{
        validate: (value: Ucn) => {
          if (!value.name || value.name.trim().length === 0) {
            return false
          }
          return true
        }, message: '请选择一个客户'
      }],
      manager: [{
        validate: (value: Ucn) => {
          if (!value.name || value.name.trim().length === 0) {
            return false
          }
          return true
        }, message: '请选择一个经办人'
      }],
      businessDate: [{
        required: true, message: '业务日期不允许为空'
      }],
      remark: [{
        maxLength: 140, message: '超过长度限制'
      }]
    })
    this.validator.bindTravel()
  }

  bindBillValidator() {
    this.billValidator.push({
      billCustomer: [{
        validate: (value: Ucn) => {
          if (!value.name || value.name.trim().length === 0) {
            return false
          }
          return true
        }, message: '请选择一个客户'
      }]
    })
    this.billValidator.bindTravel()
  }

  getNum() {
    ReceiptApi.getNum().then((res) => {
      this.receipt.billNum = res.data
      this.billNum = res.data
    })
  }

  @Watch('receipt.billNum')
  watchBillNum(value: string) {
    this.receipt.billNum = value
  }

  getImage(imgs: Array<OssResult>) {
    this.receipt.images = imgs
  }

  onGetLines(lines: Array<ReceiptLine>) {
    this.receipt.lines = lines
  }

  onCustomerChange(customer: Ucn) {
    if (!customer) {
      return new Ucn()
    }
    let m = new Ucn()
    m.id = customer.id
    m.name = customer.name
    m.code = customer.code
    this.receipt.customer = m
    this.getAmount(customer.id!)
  }

  onManagerChange(manager: Ucn) {
    if (!manager) {
      return new Ucn()
    }
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    m.code = manager.code
    this.receipt.manager = m
  }

  getAmount(id: string) {
    let customer: string = this.receipt.customer!.id!
    ReceivableReportApi.totalByCustomer(customer).then((resp) => {
      this.receipt.amount = resp.data.amount

    })
  }

  onSave() {
    this.validator.validate(true).then(() => {
      if (this.id === '') {
        this.doCreate()
      } else {
        this.doSave()
      }
    })

  }

  doCreate() {
    let loading = Loading.show()
    ReceiptApi.create(this.receipt).then((resp) => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      this.toDetail(resp.data)
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  doSave() {
    let loading = Loading.show()
    ReceiptApi.save(this.receipt).then((resp) => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      this.toDetail(resp.data)
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  toDetail(id: string) {
    this.$router.push({
      name: 'receiptBillView', query: { id: id }
    })
  }

  getSumAmount(receipt: Receipt) {
    this.receipt = receipt
  }

  @Watch('receipt', { deep: true })
  watchReceipt(value: Receipt) {
    this.receipt = value
    this.receipt.totalRcvdAmount = value.totalRcvdAmount
    this.receipt.billNum = value.billNum
  }

  onSaveAndPrint() {
    this.validator.validate(true).then(() => {
      if (this.id === '') {
        this.doCreateAndPrint()
      } else {
        this.doSaveAndPrint()
      }
    })
  }

  doCreateAndPrint() {
    let loading = Loading.show()
    ReceiptApi.create(this.receipt).then((resp) => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      window.print()
      this.toDetail(resp.data)
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  doSaveAndPrint() {
    let loading = Loading.show()
    ReceiptApi.save(this.receipt).then((resp) => {
      loading.hide()
      this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
      window.print()
      this.toDetail(resp.data)
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

  onCancel() {
    this.$router.back()
  }


}
ReceiptBillEdit.filter('dateFormatter', (value: string) => {
  if (value) {
    let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
    return date
  } else {
    return '--'
  }
})
