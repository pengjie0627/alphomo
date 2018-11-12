import { Component, Vue, Watch } from 'vue-property-decorator'
import PermissionMgr from 'mgr/PermissionMgr'
import BillViewTitle from 'pages/receivable/cmp/ViewTitle.vue'
import OperateLogView from 'cmp/OperateLogView.vue'
import { Loading, Dialog } from 'fant'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import BillViewMoneyTable from 'pages/receivable/cmp/BillViewMoneyTable.vue'
import BillViewActionTable from 'pages/receivable/cmp/BillViewActionTable.vue'
import ViewBtn from 'pages/receivable/cmp/ViewBtn.vue'
import Receipt from 'model/statement/receipt/Receipt'
import PageBody from 'cmp/PageBody.vue'
import BillBody from 'cmp/BillBody.vue'
import ReceiptApi from 'http/statement/receipt/ReceiptApi'
import OperateLog from 'model/operatelog/OperateLog'
import ImgCheck from 'cmp/ImgCheck.vue'

// import ReceiptApi from 'http/statement/receipt/ReceiptApi'
class DOssObject {
  storageId: Nullable<string>
  imageUrl: Nullable<string>
  objectUrl: Nullable<string>
  url: Nullable<string>
}

@Component({
  components: {
    BillViewTitle,
    OperateLogView,
    PageBody,
    BillBody,
    BillViewMoneyTable,
    BillViewActionTable,
    ViewBtn
  }
})
export default class PayBillView extends Vue {
  id: string = '0294e8e6-a1fb-461e-ad97-4ee3c744fe3c'
  hasPermissions: Function = PermissionMgr.hasOptionPermission // 判断是否有权限
  receipt: Receipt = new Receipt()
  presentation = 'view'
  query: string = ''
  ids: string = ''
  customer: string = ''
  logs: Array<OperateLog> = []
  isView: boolean = true
  contextPageInfo: ContextPageInfo = new ContextPageInfo()
  value: Array<DOssObject> = []
  billNum: string = ''
  status: string = ''

  // 标题头
  get menu() {
    return [{
      name: '应收对账',
      icon: '',
      url: '/receivableList'
    }, {
      name: '收款单详情',
      icon: '',
      url: ''
    }]
  }

  get model() {
    if (Array.isArray(this.value)) {
      return this.value
    } else {
      if (this.value) {
        let result: DOssObject[] = []
        result.push(this.value)
        return result
      } else {
        return []
      }
    }
  }

  set model(item: DOssObject[]) {
    if (Array.isArray(this.value)) {
      this.$emit('input', item)
    } else {
      this.$emit('input', item.length > 0 ? item[0] : null)
    }
  }

  @Watch('receipt')
  watchReceipt(value: Receipt) {
    this.receipt = value
    this.status = value.status!
  }

  data() {
    return {
      receipt: {
        customer: {
          name: ''
        },
        manager: {
          name: ''
        }
      }
    }
  }

  mounted() {
    this.receipt.status = ''
    console.log(this.receipt)
    this.id = this.$route.query.id
    this.customer = this.$route.query.customer
    this.query = this.$route.params.query || ''
    this.ids = this.$route.params.ids || ''
    this.getDetail(this.id)
  }

  onToCheck(url: string) {
    new Dialog(ImgCheck, {
      imgUrl: url
    }).show()
  }
  onGetDetail(obj: ContextPageInfo) {
    this.id = obj.id!
    this.query = JSON.stringify(obj.query)
    this.ids = JSON.stringify(obj.ids)
    this.getDetail(this.id)
  }

  getDetail(uuid: string) {
    this.value = []
    let loading = Loading.show()
    ReceiptApi.detail(uuid).then((resp) => {
      loading.hide()
      let log: OperateLog = new OperateLog()
      this.receipt = resp.data
      if (this.receipt.lines) {
        this.receipt.lines = resp.data.lines
      } else {
        this.receipt.lines = []
      }
      this.billNum = this.receipt.billNum!
      this.status = this.receipt.status!
      this.logs = []
      if (resp.data) {
        console.log(this.receipt)
        log.operate = '制单人'
        log.operator = this.receipt.creator.name
        log.operateTime = this.receipt.created
        this.logs.push(log)
      }
      let $this = this
      if (resp.data && resp.data.images) {
        resp.data.images.forEach(function (item) {
          let imgObj: DOssObject = new DOssObject()
          imgObj.url = item.url
          imgObj.storageId = item.storageId
          $this.value.push(imgObj)
        })
      }
    }).catch(e => {
      loading.hide()
      this.$message.error(e.message)
    })
  }

}
PayBillView.filter('dateFormatter', (val: string) => {
  if (val) {
    let date = val.split(' ')[0]
    return date
  } else {
    return '--'
  }
})
PayBillView.filter('statusFormatter', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'UNAUDITED':
        statusText = '未审核'
        break
      case 'AUDITED':
        statusText = '已审核'
        break
      case 'ABOLISHED':
        statusText = '已作废'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})
