import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import QfImgUpload from 'cmp/img-upload/Index.vue'
import SelectPayBill from 'pages/payablemenu/cmp/SelectPayBill.vue'
import { DateUtil, FormValidator, ObjectUtil } from 'fant'
import Ucn from 'model/entity/Ucn'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import PermissionMgr from 'mgr/PermissionMgr'
import Search from 'cmp/Search.vue'
import AdvancePayment from 'model/advancepayment/AdvancePayment'
import AccountCategory from 'model/basicdata/accountcategory/AccountCategory'
import ChargeLine from 'model/charge/ChargeLine'
import AdvancePaymentLine from 'model/advancepayment/AdvancePaymentLine'
import AdvancePaymentApi from 'http/advancepayment/AdvancePaymentApi'
import Supplier from 'model/basicdata/supplier/Supplier'
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
export default class AdvancePaymentAdd extends Vue {
  @State('user') user: User
  @State('merchantConfig') merchantConfig: MerchantConfig
  menu = [{
    name: '预付款单',
    url: '/advancePayment'
  }, {
    name: '新建预付款单'
  }]
  type = ''
  payment = new AdvancePayment()
  providerList: any[] = []
  manageList: any[] = []
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  validator = new FormValidator()
  exchangeRate: string = ''
  tipTitle: string = ''
  usd = [{
    accountCategory: {}, // 科目
    advanceAmount: 0, // 预付金额（元）
    capitalAmount: '', // 金额大写
    advanceUsdAmount: 0, // 预付金额美元
    exchangeRate: 0 // 汇率
  }]
  $refs: {
    tableDef: any // 输入框
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
    this.payment.supplier = new Ucn()
    this.payment.manager = new Ucn()
    this.payment.businessDate = new Date(DateUtil.format(new Date(), 'yyyy-MM-dd'))
    this.type = this.$route.query.type
  }

  mounted() {
    this.getMerchantConfig()
    if (this.type === 'add') {
      this.menu[1].name = '新建预付款单'
      // @ts-ignore
      let manager: Ucn = new Ucn()
      manager.id = this.user.id
      manager.code = this.user.mobile
      manager.name = this.user.name
      this.payment.manager = manager
      this.validator.push({
        supplier0: [
          { required: true, message: '请选择供应商' }
        ],
        manage: [
          { required: true, message: '请选择经办人' }
        ],
        date: [
          { required: true, message: '请选择业务日期' }
        ],
        amount: [{
          min: -999999.99,
          message: '预付金额的最小值为-999999.99'
        }, {
          max: 999999.99,
          message: '预付金额的最大值为999999.99'
        }],
        usdAmount: [{
          min: -999999.99,
          message: '预付金额(美元)的最小值为-999999.99'
        }, {
          max: 999999.99,
          message: '预付金额(美元)的最大值为999999.99'
        }],
        exchangeRate: [{
          min: 0.0000,
          message: '汇率的最小值为0.0000'
        }, {
          max: 9999.9999,
          message: '汇率的最大值为9999.9999'
        }]
      })
      this.getNum()
    } else {
      this.validator.push({
        manage: [
          { required: true, message: '请选择经办人' }
        ]
      })
      this.menu[1].name = '编辑预付款单'
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
  }

  onManagerClear() {
    this.payment.manager = null
    this.$forceUpdate()
  }

  onFormatter() {
    // todo
  }

  /**
   * 删除行
   */
  onDelRow(row: any) {
    this.payment.lines.splice(row.rowIndex, 1)
  }

  // 获取外币信息
  getUsdAmount() {
    if (this.type === 'add') {
      let line = new AdvancePaymentLine()
      line.id = ObjectUtil.uuid()
      line.exchangeRate = 0
      line.accountCategory = new Ucn()
      line.amountUpper = ''
      line.foreignAmount = 0
      this.payment.lines = []
      this.payment.lines.push(line)
      // this.payment.lines.splice(0, 1, line)
    }
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

  getRowAccount(account: AccountCategory) {
    if (!account) {
      return new AccountCategory() // null
    }
    return account
  }

  setRowChargeLine(account: AccountCategory, row: ChargeLine, rowIndex: number) {
    let line: AdvancePaymentLine = this.payment.lines[0]
    let ucn = new Ucn()
    ucn.name = account.name
    ucn.id = account.id
    ucn.code = account.code
    line.accountCategory = ucn
    Vue.set(row, 'id', line.id)
    Vue.set(row, 'accountCategory', account)
    // this.focusCell('amount', rowIndex)
  }

  onAdvPaymentLineClear(account: AccountCategory, row: AdvancePaymentLine, rowIndex: number) {
    let line = this.payment.lines[rowIndex]
    line.accountCategory = new Ucn()
    line.amount = 0
    line.foreignAmount = 0
    line.exchangeRate = 0
    line.amountUpper = ''
  }

  onCurrencyChange() {
    this.$nextTick(() => {
      this.$refs.tableDef.doLayout()
      // this.$forceUpdate()
    })
  }

  /**
   *  外币计算
   */
  onRowChange(type: string, row: any) {
    if (this.payment.currency === 'CNY' || this.payment.currency === null) {
      return
    }
    if (row.exchangeRate === '') {
      row.exchangeRate = 0
    }
    if (row.foreignAmount === '') {
      row.foreignAmount = 0
    }
    if (row.amount === '') {
      row.amount = 0
    }
    if (this.exchangeRate === 'multiply') {
      if (type === 'amount') {
        if (row.foreignAmount === 0) {
          row.foreignAmount = row.exchangeRate === 0 ? 0 : Number(row.amount) / Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.foreignAmount === 0 ? 0 : Number(row.amount) / Number(row.foreignAmount)
        }
      } else if (type === 'foreignAmount') {
        if (row.amount === 0) {
          row.amount = Number(row.foreignAmount) * Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.foreignAmount === 0 ? 0 : Number(row.amount) / Number(row.foreignAmount)
        }
      } else if (type === 'exchangeRate') {
        if (row.foreignAmount === 0) {
          row.foreignAmount = row.exchangeRate === 0 ? 0 : Number(row.amount) / Number(row.exchangeRate)
        } else if (row.amount === 0) {
          row.amount = Number(row.foreignAmount) * Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.foreignAmount === 0 ? 0 : Number(row.amount) / Number(row.foreignAmount)
        }
      }
    } else if (this.exchangeRate === 'divide') {
      if (type === 'amount') {
        if (row.foreignAmount === 0) {
          row.foreignAmount = Number(row.amount) * Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.amount === 0 ? 0 : Number(row.foreignAmount) / Number(row.amount)
        }
      } else if (type === 'foreignAmount') {
        if (row.amount === 0) {
          row.amount = row.exchangeRate === 0 ? 0 : Number(row.foreignAmount) / Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.amount === 0 ? 0 : Number(row.foreignAmount) / Number(row.amount)
        }
      } else if (type === 'exchangeRate') {
        if (row.foreignAmount === 0) {
          row.foreignAmount = row.amount * row.exchangeRate
        } else if (row.amount === 0) {
          row.amount = row.exchangeRate === 0 ? 0 : Number(row.foreignAmount) / Number(row.exchangeRate)
        } else {
          row.exchangeRate = row.amount === 0 ? 0 : Number(row.foreignAmount) / Number(row.amount)
        }
      }
    }
    // 当修改了 保存 汇率配置
    row.exchangeRateConfig = this.exchangeRate
    // row.exchangeRate = Math.round(row.exchangeRate * 10000) / 10000
  }

  onSupplierClear() {
    this.payment.supplier = null
    // this.$forceUpdate()
  }

  defaultManagerFromUser() {
    let manager: Ucn = new Ucn()
    manager.id = this.user.id
    manager.code = this.user.mobile
    manager.name = this.user.name
    this.payment.manager = manager
    if (!this.payment.businessDate || this.payment.businessDate === null) {
      this.payment.businessDate = new Date(DateUtil.format(new Date(), 'yyyy-MM-dd'))
    }
    if (!this.payment.currency || this.payment.currency === '') {
      this.payment.currency = 'CNY'
    }
  }

  beforeSave() {
    if (this.payment.lines !== null && this.payment.lines.length !== 0 && this.payment.lines[0].accountCategory !== undefined) {
      let account = this.payment.lines[0].accountCategory
      let ucn = new Ucn()
      ucn.name = account!.name || ''
      ucn.id = account!.id
      ucn.code = account!.code
      this.payment.lines[0].accountCategory = ucn
    }
  }

  setSupplier(supplier: Supplier) {
    if (!supplier) {
      return new Ucn()
    }
    let m = new Ucn()
    m.id = supplier.id
    m.name = supplier.name
    m.code = supplier.code
    this.payment.supplier = m
  }

  /**
   * 保存
   */
  onBtnSave() {
    this.beforeSave()
    this.validator.validate(true).then(() => {
      if (this.type === 'add') {
        AdvancePaymentApi.save(this.payment).then(resp => {
          if (resp && resp.success) {
            this.$message.success('新建成功')
            this.$router.push({
              name: 'advancePaymentDetail',
              query: {
                uuid: resp.data.id || '', ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams
              }
            })
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      } else {
        AdvancePaymentApi.save(this.payment).then(resp => {
          if (resp && resp.success) {
            this.$message.success('保存成功')
            this.$router.push({
              name: 'advancePaymentDetail',
              query: {
                uuid: resp.data.id || '', ids: this.$route.query.ids,
                queryParams: this.$route.query.queryParams
              }
            })
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      }
    })
  }

  /**
   * 选择改变后强制刷新
   */
  onSelectChange() {
    this.$forceUpdate()
  }

  /**
   * 保存并审核
   */
  onBtnSaveAndAudit() {
    // todo
    this.beforeSave()
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
      AdvancePaymentApi.saveAndAudit(this.payment).then(resp => {
        if (resp.success) {
          this.$message.success('保存并审核成功')
          this.$router.push('advancePayment')
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
    AdvancePaymentApi.create().then((resp) => {
      if (resp.data && resp.success) {
        this.payment = resp.data
        this.defaultManagerFromUser()
        this.getUsdAmount()
        this.$forceUpdate()
      }
      // this.$set(this.payment, 'billNum', resp.data)
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  /**
   *  获取 计算 外币 配置
   */
  private getMerchantConfig() {
    this.exchangeRate = this.merchantConfig!.exchangeRate || ''
    if (this.exchangeRate === 'multiply') {
      this.tipTitle = '当前算法：预付金额（元）= 汇率 × 预付金额（美元） \n' +
        '您可以在系统设置- 业务设置模块中调整汇率算法。'
    } else {
      this.tipTitle = '当前算法：预付金额（元）= 预付金额（美元）/ 汇率 \n' +
        '您可以在系统设置- 业务设置模块中调整汇率算法。'
    }
    // MerchantConfigApi.get().then(resp => {
    //   if (resp.success) {
    //   }
    // }).catch(error => {
    //   this.$message.error(error.message)
    // })
  }

  /**
   * 获取详情
   */
  private getDetail() {
    AdvancePaymentApi.get(this.$route.query.uuid).then(resp => {
      if (resp.success) {
        this.payment = resp.data
        if (this.payment.lines === null || this.payment.lines.length === 0) {
          this.payment.lines = [new AdvancePaymentLine()]
        }
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }
}


