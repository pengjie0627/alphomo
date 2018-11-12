import { Vue, Component } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import SupplierStatementApi from 'http/supplierstatement/SupplierStatementApi'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import User from 'model/framework/user/User'
import { State } from 'vuex-class'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import PrintView from 'cmp/print/PrintView.vue'
import PrintMaintenanceView from 'cmp/print/PrintMaintenanceView.vue'
import AccountBillDetailButton from 'pages/account/cmp/AccountBillDetailButton.vue'
import PrintPreView from 'cmp/print/PrintPreView.vue'
import { Dialog } from 'fant'
import PermissionMgr from 'mgr/PermissionMgr'
import ImgCheck from 'cmp/ImgCheck.vue'

@Component({
  name: 'AccountBillDtl',
  components: { PageBody, BillBody, PrintView, PrintMaintenanceView,PrintPreView, ImgCheck, AccountBillDetailButton }
})
export default class AccountBillDtl extends Vue {
  @State('user') user: User
  accountDtl: any = ''
  billTableData: any[] = []
  delVersion = 0
  record = ''
  id = ''
  ids: any[] = []
  menu = [{
    name: '结算单',
    url: '/accountBillList'
  }, {
    name: '结算单详情'
  }]
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  hasPermissions: Function = PermissionMgr.hasOptionPermission
  type = ''
  inventor: any = ''
  tableData: any[] = [
    {
      amount: 0, // 实际结算金额
      discountAmount: 0, // 优惠金额
      settleAmount: 0 // 结算金额
    }
  ]
  inventoryTableData: any[] = []

  get preBillFlag() {
    let ids = JSON.parse(this.$route.query.ids)
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === this.id) {
        if (i === 0) {
          return true
        }
      }
    }
    return false
  }

  get nextBillFlag() {
    let ids = JSON.parse(this.$route.query.ids)
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === this.id) {
        if (i === ids.length - 1) {
          return true
        }
      }
    }
    return false
  }

  mounted() {
    this.type = ''
    this.id = this.$route.query.uuid
    this.contextPageInfo.id = this.id
    // this.contextPageInfo.ids = JSON.parse(this.$route.query.ids)
    this.ids = JSON.parse(this.$route.query.ids)
    if (this.$route.query.ids) {
      this.contextPageInfo.ids = JSON.parse(this.$route.query.ids)
    }
    if (this.$route.query.queryParams) {
      this.contextPageInfo.query = JSON.parse(this.$route.query.queryParams)
    }
    this.getDetail(this.$route.query.uuid)
  }

  onOtherBill(type: string) {
    if (type === 'pre') {
      this.record = 'pre'
      this.getPreBill()
    } else {
      this.record = 'next'
      this.getNextBill()
    }
  }

  formatter(row: any, column: any, value: string) {
    if (value) {
      return parseFloat(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  onToCheck(url: string) {
    new Dialog(ImgCheck, {
      imgUrl: url
    }).show()
  }

  private getDetail(uuid: string) {
    SupplierStatementApi.detail(uuid).then(resp => {
      if (resp.data && resp.success) {
        this.accountDtl = resp.data
        this.delVersion = resp.data.version
        this.tableData[0].amount = resp.data.amount
        this.tableData[0].discountAmount = resp.data.discountAmount
        this.tableData[0].settleAmount = resp.data.settleAmount
        this.inventoryTableData = resp.data.invoices
        this.billTableData = resp.data.lines
        this.getSupplyInfo(resp.data.supplier!.id!)
      }
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private getPreBill() {
    // this.checkId(this.id)
    SupplierStatementApi.prev(this.contextPageInfo).then(resp => {
      if (this.id === resp.data.id) {
        this.$message.info('没有上一单了')
        return
      }
      this.contextPageInfo.id = resp.data.id
      this.contextPageInfo.ids = resp.data.ids
      this.contextPageInfo.query = resp.data.query
      this.id = resp.data.id!
      this.ids = resp.data.ids
      this.$router.replace({
        name: 'accountBillDtl',
        query: {
          uuid: resp!.data!.id!,
          ids: this.$route.query.ids,
          queryParams: this.$route.query.queryParams
        }
      })
      this.getDetail(resp.data.id!)
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private getNextBill() {
    // this.checkId(this.id)
    SupplierStatementApi.next(this.contextPageInfo).then(resp => {
      if (this.id === resp.data.id) {
        this.$message.info('没有下一单了')
        return
      }
      this.contextPageInfo.id = resp.data.id
      this.contextPageInfo.ids = resp.data.ids
      this.contextPageInfo.query = resp.data.query
      this.id = resp.data.id!
      this.ids = resp.data.ids
      this.$router.replace({
        name: 'accountBillDtl',
        query: {
          uuid: resp!.data!.id!,
          ids: this.$route.query.ids,
          queryParams: this.$route.query.queryParams
        }
      })
      this.getDetail(resp.data.id!)
    }).catch(error => {
      this.$message.error(error.message)
    })
  }

  private getSupplyInfo(selectProvider: string) {
    SupplierApi.get(selectProvider).then((resp) => {
      this.inventor = resp.data
    }).catch((error) => {
      this.$message.error(error.message)
    })
  }

  // private checkId(id: string) {
  //   let ids = JSON.parse(this.$route.query.ids)
  //   if (ids && ids.length > 0) {
  //     for (let i = 0;i < ids.length; i++) {
  //       if (id === ids[i]) {
  //         if (this.record === 'pre') {
  //           if (i === 0) {
  //             this.id = ids[0]
  //             this.$message.info('没有上一单了')
  //             break
  //           } else {
  //             this.id = ids[i - 1]
  //             break
  //           }
  //         } else {
  //           if (i === ids.length - 1) {
  //             this.id = ids[ids.length - 1]
  //             this.$message.info('没有下一单了')
  //             break
  //           } else {
  //             this.id = ids[i + 1]
  //             break
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}


