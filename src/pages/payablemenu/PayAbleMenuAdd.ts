import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectPayBill from 'pages/payablemenu/cmp/SelectPayBill.vue'
import { Dialog, DateUtil, FormValidator } from 'fant'
import Payment from 'model/statement/payment/Payment'
import PaymentApi from 'http/statement/payment/PaymentApi'
// import QueryParam from 'model/request/QueryParam'
// import SupplierApi from 'http/basicdata/supplier/SupplierApi'
// import UserApi from 'http/framework/user/UserApi'
import Ucn from 'model/entity/Ucn'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import PermissionMgr from 'mgr/PermissionMgr'
import PaymentLine from 'model/statement/payment/PaymentLine'
import Search from 'cmp/Search.vue'
// import MerchantConfigApi from 'http/framework/merchant/MerchantConfigApi'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'
@Component({
  name: 'PayAbleMenuAdd',
  components: {
    PageBody,
    BillBody,
    QfImgUpload,
    SelectPayBill,
    Search
  }
})
export default class PayAbleMenuAdd extends Vue {
  @State('user') user: User
  @State('merchantConfig') merchantConfig: MerchantConfig
  tipTitle: string = ''
  menu = [{
    name: '付款单',
    url: '/payAbleMenu'
  }, {
    name: '新建付款单'
  }]
  type = ''
  usd = [{
    amount: 0, // 本次付款
    usdAmount: 0, // 本次付款（美元）
    totalAmount: 0, // 合计应付金额
    lossesAmount: 0, // 外币损益金额
    exchangeRate: 0, // 汇率
    foreignPaidAmount: 0, // 外币已付金额
    foreignAdvanceAmount: 0, // 外币预付金额
    foreignTotalAmount: 0, // 外币 合计金额
  }]
  payment = new Payment()
  providerList: any[] = []
  manageList: any[] = []
  exchangeRate: string = ''
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  validator = new FormValidator()
  $refs: {
    tableDef: any
  }
  get getCurrentDate() {
    if (this.type === 'add') {
      return DateUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    } else {
      return this.payment.created
    }
  }
  get getSumPay() {
    if (this.payment && this.payment.lines) {
      let sum = 0
      this.payment.lines.forEach(item => {
        sum += item.amount
      })
      return sum
    } else {
      return 0
    }
  }
  created() {
    // 初始化数据
    this.payment.supplier = null
    this.payment.manager = null
    this.payment.businessDate = new Date(DateUtil.format(new Date(), 'yyyy-MM-dd'))
  }
  mounted() {
    this.getMerchantConfig()
    this.type = this.$route.query.type
    // this.getProviderList()
    // this.getManageList()
    if (this.type === 'add') {
      this.menu[1].name = '新建付款单'
      // @ts-ignore
      let manager: Ucn = new Ucn()
      manager.id = this.user.id
      manager.code = this.user.mobile
      manager.name = this.user.name
      this.payment.manager = manager
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
      this.getNum()
    } else {
      this.validator.push({
        manage: [
          { required: true, message: '请选择经办人' }
        ]
      })
      this.menu[1].name = '编辑付款单'
      this.getDetail()
    }
  }

  getImage(imgs: any) {
    console.log(imgs)
    // this.payment.images.length = 0
    // this.payment.images = imgs
  }
  setManager(manager: User) {
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    this.payment.manager = m
    this.$forceUpdate()
  }
  onManagerClear() {
    this.payment.manager = null
    // this.$forceUpdate()
  }
  setSupplier(manager: User) {
    let m = new Ucn()
    m.id = manager.id
    m.name = manager.name
    this.payment.supplier = m
    this.$forceUpdate()
  }
  onSupplierClear() {
    this.payment.supplier = null
    // this.$forceUpdate()
  }

  /**
   * 选择付款的单据
   */
  onSelectPayBill() {
    if (this.type === 'add') {
      if (!this.payment.supplier || !this.payment.supplier!.id) {
        this.$message.error('请先选择供应商')
        return
      }
      if (!this.payment.currency) {
        this.$message.error('请先选择币种')
        return
      }
    }
    new Dialog(SelectPayBill, {
      uuids: () => {
        if (this.payment.lines && this.payment.lines.length > 0) {
          let arrId: any[] = []
          this.payment.lines.forEach(item => {
            arrId.push(item.billUuid)
          })
          return arrId
        } else {
          return []
        }
      },
      supplierId: this.payment.supplier!.id,
      currency: this.payment.currency,
      onConfirm: (arr: any) => {
        if (!this.payment || !this.payment.lines) {
          this.payment.lines = []
        }
        arr.forEach((item: any) => {
          let line = new PaymentLine()
          line.amount = item.amount
          line.merchant = item.merchant
          line.billBusinessDate = item.businessDate
          line.billManager = item.manager
          line.billNum = item.billNum
          line.billType = item.billType
          line.billUuid = item.id
          line.foreignAmount = item.foreignAmount
          this.payment.lines.push(line)
          // 输入框设为 0
          this.payment.foreignPaidAmount = 0
          this.payment.exchangeRate = 0
          this.getUsdAmount(true)
        })
      }
    }).show()
  }
  onFormatter() {
    // todo
  }

  /**
   * 删除行
   */
  onDelRow(row: any) {
    this.payment.lines.splice(row.rowIndex, 1)
    this.payment.foreignPaidAmount = 0
    this.payment.exchangeRate = 0
    this.getUsdAmount(true)
    this.$forceUpdate()
  }
  // 获取外币信息
  getUsdAmount(isUpdate: boolean = false) {
    if (isUpdate === true) {
      this.exchangeRate = this.merchantConfig.exchangeRate || ''
    }
    if (this.payment.lines === null || this.payment.lines.length === 0) {
      this.usd[0].lossesAmount = 0
      this.usd[0].exchangeRate = 0
      this.usd[0].foreignAdvanceAmount = 0
      this.usd[0].usdAmount = 0
      this.usd[0].totalAmount = 0
      this.usd[0].foreignTotalAmount = 0
      this.usd[0].amount = 0
      return
    }
    let sum = 0
    let usdSum = 0
    this.payment.lines.forEach(item => {
      sum += item.amount
      usdSum += item.foreignAmount
    })
    this.usd[0].exchangeRate = this.payment.exchangeRate
    this.usd[0].foreignAdvanceAmount = this.payment.foreignAdvanceAmount
    this.usd[0].usdAmount = this.payment.foreignPaidAmount
    if (this.exchangeRate === 'multiply') {
      this.usd[0].amount = this.payment.foreignPaidAmount * this.payment.exchangeRate
    } else {
      this.usd[0].amount = Number(this.payment.exchangeRate) === 0 ? 0 : this.payment.foreignPaidAmount / this.payment.exchangeRate
    }
    this.usd[0].totalAmount = sum
    this.usd[0].foreignAdvanceAmount = usdSum
    if (isUpdate === true) {
      this.payment.foreignTotalAmount = usdSum + this.usd[0].usdAmount
      this.payment.lossesAmount = Number(sum) - Number(this.usd[0].amount)
    }
    this.usd[0].foreignTotalAmount = this.payment.foreignTotalAmount
    this.usd[0].lossesAmount = this.payment.lossesAmount
  }
  // 外边设置 外币
  setUsdAmount() {
    if (this.payment.currency === 'CNY') {
      this.payment.lossesAmount = 0
    } else {
      this.payment.lossesAmount = Number(this.usd[0].lossesAmount)
    }
    this.payment.exchangeRate = Number(this.usd[0].exchangeRate)
    this.payment.foreignAdvanceAmount = Number(this.usd[0].foreignAdvanceAmount)
    this.payment.foreignPaidAmount = Number(this.usd[0].usdAmount)
    this.payment.paidAmount = Number(this.usd[0].amount)
    this.payment.foreignTotalAmount = Number(this.usd[0].foreignTotalAmount)
  }
  getStatusName(type: string) {
    if (type === 'SupplierStatement') {
      return '结算单'
    }
    if (type === 'ChargeDeduction') {
      return '费用单(账款结算)'
    }
    if (type === 'ChargeCash') {
      return '费用单（现金）'
    }
    if (type === 'AdvancePayment') {
      return '预付款单'
    }
  }

  onCurrencyChange() {
    this.$nextTick(() => {
      this.$refs.tableDef.doLayout()
      // this.$forceUpdate()
    })
    // 清空撤销单据 并且 清零数据
    this.payment.lines = []
    this.usd[0].lossesAmount = 0
    this.usd[0].exchangeRate = 0
    this.usd[0].foreignAdvanceAmount = 0
    this.usd[0].usdAmount = 0
    this.usd[0].totalAmount = 0
    this.usd[0].foreignTotalAmount = 0
    this.usd[0].amount = 0
  }
  renderHeader(h: any, { column }: { column: any }) {
    return h('div', [
      h('span', column.label),
      h('qf-tooltip', {
        props: {
          content: this.tipTitle
        }
      }, [
        h('qf-font-icon', {
          props: {
            name: 'ic-ic_help'
          },
          style: 'margin-left: 5px; color: #f93e61; font-weight: 500;'
        })
      ])
    ])
  }

  /**
   *  外币计算
   */
  onRowChange(type: string, row: any) {
    this.exchangeRate = this.merchantConfig.exchangeRate || ''
    if (row.exchangeRate === '') {
      row.exchangeRate = 0
    }
    if (row.usdAmount === '') {
      row.usdAmount = 0
    }
    if (row.amount === '') {
      row.amount = 0
    }
    if (this.exchangeRate === 'multiply') {
      if (type === 'amount') {
        if (row.usdAmount === 0) {
          row.usdAmount = row.exchangeRate === 0 ? 0 : Number(row.amount) / Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.usdAmount === 0 ? 0 : Number(row.amount) / Number(row.usdAmount)
        }
      } else if (type === 'usdAmount') {
        if (row.amount === 0) {
          row.amount = Number(row.usdAmount) * Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.usdAmount === 0 ? 0 : Number(row.amount) / Number(row.usdAmount)
        }
      } else if (type === 'exchangeRate') {
        if (row.usdAmount === 0) {
          row.usdAmount = row.exchangeRate === 0 ? 0 : Number(row.amount) / Number(row.exchangeRate)
        } else if (row.amount === 0) {
          row.amount = Number(row.usdAmount) * Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.usdAmount === 0 ? 0 : Number(row.amount) / Number(row.usdAmount)
        }
      }
    } else if (this.exchangeRate === 'divide') {
      if (type === 'amount') {
        if (row.usdAmount === 0) {
          row.usdAmount = Number(row.amount) * Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.amount === 0 ? 0 : Number(row.usdAmount) / Number(row.amount)
        }
      } else if (type === 'usdAmount') {
        if (row.amount === 0) {
          row.amount = row.exchangeRate === 0 ? 0 : Number(row.usdAmount) / Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.amount === 0 ? 0 : Number(row.usdAmount) / Number(row.amount)
        }
      } else if (type === 'exchangeRate') {
        if (row.usdAmount === 0) {
          row.usdAmount = Number(row.amount) * Number(row.exchangeRate)
        } else if (row.amount === 0) {
          row.amount = row.exchangeRate === 0 ? 0 : Number(row.usdAmount) / Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.amount === 0 ? 0 : Number(row.usdAmount) / Number(row.amount)
        }
      }
    }
    // 当修改了 保存 汇率配置
    row.exchangeRateConfig = this.exchangeRate
    row.lossesAmount = Number(row.totalAmount) - Number(row.amount)
    row.foreignTotalAmount = Number(row.usdAmount) + Number(row.foreignAdvanceAmount)
    this.payment.exchangeRateConfig = this.merchantConfig.exchangeRate || ''
  }
  /**
   * 保存
   */
  onBtnSave() {
    this.setUsdAmount()
    this.validator.validate(true).then(() => {
      this.providerList.forEach(item => {
        if (this.payment!.supplier!.id === item.id) {
          let ucn = new Ucn()
          ucn.id = item.id
          ucn.name = item.name
          ucn.code = item.code
          this.payment.supplier = ucn
        }
      })
      this.manageList.forEach(item => {
        if (this.payment!.manager!.id === item.id) {
          let ucn = new Ucn()
          ucn.id = item.id
          ucn.name = item.name
          ucn.code = item.code
          this.payment.manager = ucn
        }
      })
      if (this.type === 'add') {
        PaymentApi.create(this.payment).then(resp => {
          if (resp && resp.success) {
            this.$message.success('新建成功')
            this.$router.push({ name: 'payAbleMenuDtl',
              query: { uuid: resp.data, ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams } })
          }
        })
      } else {
        PaymentApi.save(this.payment).then(resp => {
          if (resp && resp.success) {
            this.$message.success('保存成功')
            this.$router.push({ name: 'payAbleMenuDtl',
              query: { uuid: this.$route.query.uuid, ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams } })
          }
        })
      }
    })
  }

  /**
   * 选择改变后强制刷新
   */
  onSelectChange() {
    // this.$forceUpdate()
  }

  /**
   * 保存并审核
   */
  onBtnSaveAndAudit() {
    // todo
    this.setUsdAmount()
    this.validator.validate(true).then(() => {
      if (this.providerList && this.providerList.length > 0) {
        this.providerList.forEach(item => {
          if (this.payment!.supplier!.id === item.id) {
            let providerUcn = new Ucn()
            providerUcn.name = item.name
            providerUcn.code = item.code
            providerUcn.id = item.id
            this.payment.supplier = providerUcn
          }
        })
      }
      if (this.manageList && this.manageList.length > 0) {
        this.manageList.forEach(item => {
          if (this.payment!.supplier!.id === item.id) {
            let manageUcn = new Ucn()
            manageUcn.name = item.name
            manageUcn.code = item.code
            manageUcn.id = item.id
            this.payment.manager = manageUcn
          }
        })
      }
      PaymentApi.saveAndAudit(this.payment).then(resp => {
        if (resp.success) {
          this.$message.success('保存并审核成功')
          this.$router.push({ name: 'payAbleMenuDtl',
            query: { uuid: resp.data, ids: this.$route.query.ids,
              queryParams: this.$route.query.queryParams } })
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
  }

  /**
   * 取消
   */
  onBtnCancel() {
    this.$router.back()
  }

  /**
   * 新增获取单号
   */
  private getNum() {
    PaymentApi.getNum().then((resp) => {
      this.payment.billNum = resp.data
      this.$forceUpdate()
      // this.$set(this.payment, 'billNum', resp.data)
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
  /**
   * 获取供应商列表
   */
  // private getProviderList() {
  //   let query = new QueryParam()
  //   query.start = 0
  //   query.limit = 0
  //   SupplierApi.query(query).then(resp => {
  //     this.providerList = resp.data
  //   }).catch(error => {
  //     this.$message.error(error.message)
  //   })
  // }

  /**
   * 获取经办人列表
   */
  // private getManageList() {
  //   let query = new QueryParam()
  //   query.start = 0
  //   query.limit = 0
  //   UserApi.query(query).then(resp => {
  //     this.manageList = resp.data
  //   }).catch(error => {
  //     this.$message.error(error.message)
  //   })
  // }
  /**
   *  获取 计算 外币 配置
   */
  private getMerchantConfig() {
    if (this.merchantConfig!.exchangeRate === 'multiply') {
      this.tipTitle = '当前算法：本次金额（元）= 汇率 × 本次金额（美元） \n' +
        '您可以在系统设置- 业务设置模块中调整汇率算法。'
    } else {
      this.tipTitle = '当前算法：本次金额（元）= 本次金额（美元）/ 汇率 \n' +
        '您可以在系统设置- 业务设置模块中调整汇率算法。'
    }
    // MerchantConfigApi.get().then(resp => {
    //   if (resp.success) {
    //     this.exchangeRate = resp.data.exchangeRate || ''
    //   }
    // }).catch(error => {
    //   this.$message.error(error.message)
    // })
  }
  /**
   * 获取详情
   */
  private getDetail(isUpdate: boolean = false) {
    PaymentApi.detail(this.$route.query.uuid).then(resp => {
      if (resp.success) {
        this.payment = resp.data
        this.exchangeRate = resp.data.exchangeRateConfig || ''
        this.getUsdAmount(isUpdate)
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


