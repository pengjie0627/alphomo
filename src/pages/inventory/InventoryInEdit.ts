import { Component, Vue } from 'vue-property-decorator'
import QfPageBody from 'cmp/PageBody.vue'
import QfBillBody from 'cmp/BillBody.vue'
import QfBillViewTitle from 'cmp/BillViewTitle.vue'
import InventoryInEditTable from 'pages/inventory/cmp/InventoryInEditTable.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import InInventoryApi from 'http/inventory/in/InInventoryApi'
import { FormValidator, Loading } from 'fant'
import InInventory from 'model/inventory/in/InInventory'
import Search from 'cmp/Search.vue'
import Customer from 'model/basicdata/customer/Customer'
import InInventoryLine from 'model/inventory/in/InInventoryLine'
import Ucn from 'model/entity/Ucn'
import CommonUtil from 'util/CommonUtil'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: {
    QfPageBody,
    QfBillBody,
    QfBillViewTitle,
    InventoryInEditTable,
    Search
  }
})
export default class InventoryInEdit extends Vue {
  // 面包屑菜单
  menu = [ {
    name: '入库管理',
    url: '/InventoryInList'
  }, {
    name: '入库',
    url: ''
  }]
  // 单据详情
  bill: InInventory = new InInventory()
  // 包含商品
  selectedData: InInventoryLine[] = []
  // 页面输入限制
  limits = ConstantMgr.limits.inventory
  // 是否可以输入
  canInput: boolean = false
  isDisabled: boolean = false
  // 表单验证
  validator: FormValidator = new FormValidator()
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  created() {
    if (this.$route.query && this.$route.query.id) {
      this.doGetDetail(this.$route.query.id)
    }
  }

  mounted() {
    this.validator.push({
      manager: [{ required: true, message: '经办人不能为空！' }]
    })
  }

  /**
   * 获取详情
   * @param {string} id
   */
  doGetDetail(id: string) {
    let loading = Loading.show()
    InInventoryApi.detail(id).then((resp) => {
      this.bill = resp.data
      this.checkStatus()
      loading.hide()
    }).catch((err) => {
      loading.hide()
      this.$message.error(err.message)
    })
  }

  /**
   * 检查可输入状态
   */
  checkStatus() {
    if (this.canInput && this.bill && this.bill.source && this.bill.source.billType !== 'InventoryTransfer' && this.bill.source.billType !== 'CheckInventory ') {
      this.isDisabled = false
    } else {
      this.isDisabled = true
    }
  }

  /**
   * 选择经办人
   * @param {Customer} customer
   * @returns {Customer}
   */
  setRowCustomer(customer: Customer) {
    let ucn = new Ucn()
    if (!customer) {
      return ucn
    }
    ucn.name = customer.name
    ucn.id = customer.id
    ucn.code = customer.code
    this.bill.manager = ucn
  }

  /**
   * 清除经办人
   */
  onCustomerClear() {
    this.bill.manager = null
  }

  /**
   * 选择数据
   * @param {InInventory[]} val
   */
  onSelectData(val: InInventoryLine[]) {
    this.selectedData = val
  }

  /**
   * 删除商品行
   */
  doDelete() {
    // todo
    this.$msgBox.confirm('删除商品行', '请确认是否要删除所选中的商品行?', () => {
      if (this.bill.lines.length === 1 || this.selectedData.length === this.bill.lines.length) {
        this.$message.error('至少要包含一条商品记录！')
      } else {
        let newData: InInventoryLine[] = []
        newData = this.bill.lines.filter((item) => {
          let isExist = this.selectedData.some((item1) => {
            return item1.sku!.id! === item.sku!.id!
          })
          return !isExist
        })
        this.bill.lines = CommonUtil.copy(newData)
      }
    })
  }

  /**
   * 返回上一页
   */
  doGoback() {
    this.$router.back()
  }

  /**
   * 确认入库
   */
  doConfirmEntry() {
    this.validator.validate(true).then(() => {
      if (!(this.bill.lines && this.bill.lines.length)) {
        this.$message.error('至少包含一个商品行!')
        return
      }
      if (this.bill.lines.length === 1 && Number(this.bill.lines[0].qty) === 0) {
        this.$message.error('至少包含一个商品行且数量大于0!')
        return
      }
      this.bill.lines.some((value, index) => {
        return true
      })
      let loading = Loading.show()
      InInventoryApi.audit(this.bill).then((res) => {
        loading.hide()
        this.$message.success('入库成功！')
        this.$router.replace({
          name: 'inventoryInList'
        })
      }).catch((err) => {
        loading.hide()
        this.$message.error(err.message)
      })
    }).catch(() => {
      // todo
    })
  }

}
