import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectPayBill from 'pages/payablemenu/cmp/SelectPayBill.vue'
import ChargeAddTable from 'pages/charge/cmp/ChargeAddTable'
import { DateUtil, Dialog, FormValidator, Loading, ObjectUtil } from 'fant'
import Charge from 'model/charge/Charge'
import ChargeApi from 'http/charge/ChargeApi'
import ChargeLine from 'model/charge/ChargeLine'
import Ucn from 'model/entity/Ucn'
import { State } from 'vuex-class'
import User from 'model/framework/user/User'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import QueryParam from 'model/request/QueryParam'
import UserApi from 'http/framework/user/UserApi'
import ConstantMgr from 'mgr/ConstantMgr'
import PermissionMgr from 'mgr/PermissionMgr'
import Supplier from 'model/basicdata/supplier/Supplier'
import Search from 'cmp/Search.vue'

@Component({
  name: 'ChargeAdd',
  components: {
    PageBody,
    BillBody,
    QfImgUpload,
    SelectPayBill,
    ChargeAddTable,
    Search
  }
})
export default class ChargeAdd extends Vue {
  menu = [{
    name: '费用单',
    url: '/chargeList'
  }, {
    name: '新建费用单'
  }]
  type = ''
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  @State('user') user: User
  bill: Charge = new Charge()
  supplierList: Ucn[] = []
  managerList: Ucn[] = []
  supplier: string = ''
  manager: string = ''
  param: QueryParam = new QueryParam()
  listParam: QueryParam = new QueryParam() // 接收query  参数
  ids: string[] = [] // 接收 IDS 参数
  validator: FormValidator = new FormValidator()
  presentation: string = ''
  makeBillDate = '' // 制单日期
  $refs: {
    chargeTable: any
  }
  created() {
    // 初始化数据
    this.bill.supplier = new Ucn()
    this.bill.manager = new Ucn()
    this.bill.businessDate = new Date(DateUtil.format(new Date(), 'yyyy-mm-dd'))
  }
  mounted() {
    if (this.$route.params.ids) {
      this.ids = JSON.parse(this.$route.params.ids)
    }
    if (this.$route.params.query) {
      this.listParam = JSON.parse(this.$route.params.query)
    }
    this.type = this.$route.query.type
    if (this.type === 'add') {
      this.menu[1].name = '新建费用单'
      this.createCharge()
      // 初始化制单日期
      this.makeBillDate = DateUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    } else {
      let id: string = this.$route.query.id
      this.menu[1].name = '编辑费用单'
      this.getCharge(id)
    }
    this.getSupplierList()
    this.getManangerList()
    this.bindValidator()
  }
  bindValidator() {
    this.validator.push({
      supplier0: [{
        required: true, message: '供应商不允许为空'
      }],
      manager: [{
        required: true, message: '经办人不允许为空'
      }],
      businessDate: [{
        required: true, message: '业务日期不允许为空'
      }],
      accountCategory: [{
        required: true, message: '科目不允许为空'
      }],
      remark: [{
        maxLength: 140, message: '备注最多输入140个字符'
      }],
      amount: [{
        min: -999999.99,
        message: '费用的最小值为-999999.99'
      }, {
        max: 999999.99,
        message: '费用的最大值为999999.99'
      }],
      payStatus: [{
        required: true, message: '付款类型不能为空'
      }],
    })
  }
  createCharge() {
    let loading = Loading.show({
      msg: '创建中'
    })
    ChargeApi.create().then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Charge
        this.bill.category = null // 费用单的 付款类型默认为空
        if (!this.bill.lines || this.bill.lines === null) {
          this.bill.lines = []
        }
        this.defaultManagerFromUser()
        this.addEmptyLine()
        this.$refs.chargeTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      this.$router.back()
    })
  }
  // 获取 费用单信息
  getCharge(id: string) {
    let loading = Loading.show()
    ChargeApi.get(id).then((resp) => {
      loading.hide()
      if (resp.data) {
        this.bill = resp.data as Charge
        if (!this.bill.lines || this.bill.lines === null) {
          this.bill.lines = []
        }
        this.makeBillDate = resp.data.created.toString()
        this.addEmptyLine()
        this.$refs.chargeTable.editLastRow()
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
      // this.$router.back()
    })
  }
  // 保存
  onSave() {
    let bill: Charge = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      ChargeApi.save(bill).then((resp) => {
        loading.hide()
        this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
        this.toView(resp.data.id || '')
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }
  // 保存并继续
  onSaveAndAudit() {
    let bill: Charge = this.beforeSave()
    this.validator.validate(true).then(() => {
      let loading = Loading.show({
        msg: '保存中'
      })
      ChargeApi.saveAndAudit(bill).then((resp) => {
        if (resp.data) {
          loading.hide()
          this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
          this.toView(resp.data.id || '')
        }
      }).catch(e => {
        loading.hide()
        this.$message.error(e.message)
      })
    })
  }
  beforeSave(): Charge {
    // 供应商 经办人 赋值
    // this.supplierList.forEach(item => {
    //   if (this.bill!.supplier!.id === item.id) {
    //     let ucn = new Ucn()
    //     ucn.id = item.id
    //     ucn.name = item.name
    //     ucn.code = item.code
    //     this.bill.supplier = ucn
    //   }
    // })
    // this.managerList.forEach(item => {
    //   if (this.bill!.manager!.id === item.id) {
    //     let ucn = new Ucn()
    //     ucn.id = item.id
    //     ucn.name = item.name
    //     ucn.code = item.code
    //     this.bill.manager = ucn
    //   }
    // })
    // 去掉空行
    let charge: Charge = ObjectUtil.copy(this.bill)
    // charge.businessDate = new Date(charge.businessDate || new Date())
    for (let i = charge.lines.length - 1; i >= 0; i--) {
      let line: ChargeLine = charge.lines[i]
      if (!line.accountCategory || !line.accountCategory.id) {
        charge.lines.splice(i,1)
      }
    }
    return charge
  }
  addEmptyLine() {
    let empty = new ChargeLine()
    empty.id = ObjectUtil.uuid()
    this.bill.lines.push(empty)
  }
  defaultManagerFromUser() {
    let manager: Ucn = new Ucn()
    manager.id = this.user.id
    manager.code = this.user.mobile
    manager.name = this.user.name
    this.bill.manager = manager
    if (this.supplier === null || !this.supplier) {
      // this.bill.supplier = new Ucn()
    }
    if (!this.bill.businessDate || this.bill.businessDate === null) {
      this.bill.businessDate = new Date(DateUtil.format(new Date(), 'yyyy-MM-dd'))
    }
  }
  getImage(imgs: any) {
    console.log(imgs)
    // this.imgUrl = imgs[0]
  }
  // 获取 供应商列表
  getSupplierList() {
    let loading = Loading.show()
    SupplierApi.query(this.param).then((resp) => {
      loading.hide()
      if (resp.data) {
        let ary: Ucn[] = []
        for (let user of resp.data) {
          let u = new Ucn()
          u.id = user.id
          u.name = user.name
          u.code = user.code
          ary.push(u)
        }
        this.supplierList = ary
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }
  setSupplier(supplier: Supplier) {
    if (!supplier) {
      return new Ucn()
    }
    let m = new Ucn()
    m.id = supplier.id
    m.name = supplier.name
    m.code = supplier.code
    this.bill.supplier = m
  }

  onSupplierClear() {
    this.bill.supplier = null
  }
  onManagerClear() {
    this.bill.manager = null
  }

  setManager(manager: User) {
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    this.bill.manager = m
  }
  // 获取经办人列表
  getManangerList() {
    let loading = Loading.show()
    UserApi.query(this.param).then((resp) => {
      loading.hide()
      if (resp.data) {
        let ary: Ucn[] = []
        for (let user of resp.data) {
          let u = new Ucn()
          u.id = user.id
          u.name = user.name
          u.code = user.id
          ary.push(u)
        }
        this.managerList = ary
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }
  toCreate() {
    // this.$router.replace('/saleEdit?aa=' + ObjectUtil.uuid())
    this.bill.supplier = new Ucn()
    this.createCharge()
  }
  onCancel() {
    this.$router.back()
  }
  toView(id: string) {
    // this.$router.replace(`/chargeDetail?id=${this.bill.id}`)
    this.$router.replace({
      name: 'chargeDetail', query: { id: id }, params: { ids: JSON.stringify(this.ids), query: JSON.stringify(this.listParam) }
    })
  }
  /**
   * 选择付款的单据
   */
  onSelectPayBill() {
    new Dialog(SelectPayBill).show()
  }
}
ChargeAdd.filter('status', function (val: string) {
  if (val === 'UNAUDITED') {
    return '未审核'
  } else if (val === 'AUDITED') {
    return '已审核'
  } else if (val === 'PART_DELIVERED') {
    return '部分出库'
  } else if (val === 'DELIVERED') {
    return '已出库'
  } else if (val === 'ABOLISHED') {
    return '已作废'
  } else {
    return '--'
  }
})
ChargeAdd.filter('payStatus', function (val: string) {
  if (val === 'UNPAID') {
    return '未付款'
  } else if (val === 'PAID') {
    return '已付款'
  } else {
    return '--'
  }
})


