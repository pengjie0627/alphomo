import { DomUtil } from 'fant'
import CommonUtil from 'util/CommonUtil'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import debounce from 'lodash/debounce.js'
import CancelPromise from 'util/CancelPromise'
import SkuApi from 'http/basicdata/sku/SkuApi'
import QueryParam from 'model/request/QueryParam'
import CustomerApi from 'http/basicdata/customer/CustomerApi'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import UserApi from 'http/framework/user/UserApi'
import AccountCategoryApi from 'http/basicdata/accountcategory/AccountCategoryApi'
import { sessionStorage } from 'mgr/BrowserMgr.js'
@Component({
  name: 'search',
  components: {}
})
export default class Search extends Vue {
  keyword: string = '' // 搜索关键字
  selectedIndex: number = -1 // 选择项下标
  resultVisible = false
  $refs: {
    input: any // 输入框
    result: any // 搜索框的引用
  }
  @Prop({
    type: Boolean,
    default: false
  })
  customFlag: any
  @Prop({
    type: Object,
    default: function () {
      return {}
    }
  })
  value: any
  @Prop({
    type: String,
    default: 'name'
  })
  displayField: string
  @Prop({
    default: '编码/名称/首字母'
  })
  placeholder: string
  @Prop({
    default: 'sku'
  })
  type: string
  @Prop({
    default: false
  }) disabled: boolean
  @Prop({
    default: false
  }) readonly: boolean
  @Prop({
    default: () => {
      return new QueryParam()
    }
  }) queryParam: QueryParam
  // 商品查询结果
  items: any[] = []
  queryPromise: CancelPromise
  /**
   * 模糊查询
   */
  debounceQuery: any = debounce((self: any) => {
    ((keyword) => {
      self.queryMatch(keyword)
    })(self.keyword)
  }, 300)

  @Watch('resultVisible')
  watchResultVisible(val: boolean) {
    if (!val) {
      this.$refs.result.doClose()
      this.selectedIndex = -1
      this.items = []
    } else {
      this.$refs.result.doShow()
    }
  }

  @Watch('value', { deep: true })
  watchValue(val: any) {
    if (val) {
      let field = val as any
      // 科目 显示 code 和 name
      if (this.type === 'account') {
        if (field.code && field.name) {
          this.keyword = field.code + '  ' + field.name
        } else {
          this.keyword = ''
        }
      } else {
        this.keyword = field[this.displayField] ? field[this.displayField] : ''
      }
    } else {
      this.keyword = ''
    }
  }

  mounted() {
    DomUtil.on(document as any, 'click' as any, this.handleDocumentClick)
    this.watchValue(this.value)
  }

  beforeDestroy() {
    DomUtil.off(document as any, 'click' as any, this.handleDocumentClick)
  }

  handleDocumentClick(e: any) {
    const popper = this.$refs.result
    if (!this.$el || this.$el.contains(e.target) || !popper || popper.$el.contains(e.target)) return
    this.resultVisible = false
  }

  /**
   *  搜索框失去焦点
   */
  onKeywordBlur() {
    this.watchValue(this.value)
    this.$emit('blur')
  }

  /**
   *  tab 切换
   */
  onTab() {
    this.resultVisible = false
  }

  /**
   *  监听输入框值的变化
   */
  onKeywordChange() {
    if (this.keyword.length === 0) {
      this.updateModel({})
    }
    this.debounceQuery(this)
  }
  getCustom() {
    return sessionStorage.getItem('customer')
  }

  /**
   *  enter event
   */
  onEnter() {
    if (this.customFlag) {
      if (!this.getCustom()) {
        this.$message.error('请先选择客户')
        return
      }
    }
    // 清空input
    if (this.keyword === '') {
      this.updateModel({})
    }
    // 回车选中商品
    if (this.items && this.items.length && this.selectedIndex >= 0) {
      return this.onSelected()
    }
    let keyword = this.keyword
    // this.keyword = ''
    this.selectedIndex = -1
    this.items = []
    this.$refs.input.$el.getElementsByTagName('input')[0].value = ''
    this.debounceQuery.cancel() // 撤销模糊查询
    this.queryPromise && this.queryPromise.cancel()
    this.resultVisible = false
    this.queryPrecise(keyword) // 精确查询
  }

  /**
   * 上下键选中
   */
  onUpdown(ev: KeyboardEvent) {
    if (this.items.length === 0) {
      return
    }
    let nextIndex = 0
    if (ev.keyCode === 38) {
      if (this.selectedIndex - 1 < 0) {
        nextIndex = this.items.length - 1
      } else {
        nextIndex = this.selectedIndex - 1
      }
      this.onSelecting(nextIndex)

      ev.preventDefault()
      ev.stopPropagation()
      ev.returnValue = false
      ev.cancelBubble = true
    } else if (ev.keyCode === 40) {
      if (this.selectedIndex + 1 > this.items.length - 1) {
        nextIndex = 0
      } else {
        nextIndex = this.selectedIndex + 1
      }
      this.onSelecting(nextIndex)

      ev.preventDefault()
      ev.stopPropagation()
      ev.returnValue = false
      ev.cancelBubble = true
    }
  }

  /**
   * 精确查询
   */
  queryPrecise(keyword: string) {
    if (!keyword) {
      return
    }
    if (this.value && keyword === this.value[this.displayField]) {
      return
    }
    let param = new QueryParam()
    param.start = 0
    param.limit = 10
    param.filters = [{ 'property': 'keyword:=', 'value': keyword }]
    if (this.queryParam && this.queryParam.filters) {
      param.filters = param.filters.concat(this.queryParam.filters)
    }

    let request: Promise<any> = new Promise<any>((resolve) => {
      resolve()
    })
    if (this.type === 'sku' || this.type === 'sku2' || this.type === 'sku3') {
      request = SkuApi.query(param)
    } else if (this.type === 'supplier') {
      request = SupplierApi.query(param)
    } else if (this.type === 'customer') {
      request = CustomerApi.query(param)
    } else if (this.type === 'user') {
      request = UserApi.query(param)
    } else if (this.type === 'account') {
      request = AccountCategoryApi.query(param)
    }
    request.then(resp => {
      this.items = resp.data || []
      if (this.items.length === 0) {
        this.updateModel({})
      } else if (this.items.length === 1) {
        this.updateModel(this.items[0])
      } else {
        this.resultVisible = true
      }
    }).catch(e => {
      this.$message.error(e.message)
    })
  }

  /**
   *  模糊查询所有商品
   */
  queryMatch(keyword: string) {
    if (this.customFlag) {
      if (!this.getCustom()) {
        this.$message.error('请先选择客户')
        return
      }
    }
    // 如果录入的内容和原来一样，则不查询
    if (this.value && keyword === this.value[this.displayField]) {
      this.resultVisible = false
      return
    }
    // 单个汉字允许模糊查询, 也就是首字母是汉字的话，就允许模糊查询
    if (/^[\u4e00-\u9fa5]/.test(keyword)) {
      // 跳过
    } else if (keyword.length < 2 || /^([1-9]{1}[0-9]{0,1}|0)(\.\d*)?$/.test(keyword)) {
      // 输入内容长度大于等于2，才会查询
      // 0-100内的纯数字不查询， 但010这个是允许查询的
      this.resultVisible = false
      return
    }
    let param = new QueryParam()
    param.start = 0
    param.limit = 10
    param.filters = [{ 'property': 'keyword:%=%', 'value': keyword }]
    if (this.queryParam && this.queryParam.filters) {
      param.filters = param.filters.concat(this.queryParam.filters)
    }
    let request: any = null
    if (this.type === 'sku' || this.type === 'sku2' || this.type === 'sku3') {
      request = SkuApi.query(param)
    } else if (this.type === 'supplier') {
      request = SupplierApi.query(param)
    } else if (this.type === 'customer') {
      request = CustomerApi.query(param)
    } else if (this.type === 'user') {
      request = UserApi.query(param)
    } else if (this.type === 'account') {
      request = AccountCategoryApi.query(param)
    }
    this.queryPromise = new CancelPromise(request)
    this.queryPromise.then((resp: any) => {
      if (resp) {
        this.resultVisible = true
        this.items = resp.data
        this.selectedIndex = -1
      }
    }).catch((e: any) => {
      this.$message.error(e.message)
    })
  }


  /**
   *  点击选中商品
   */
  onClickSelect(index: number) {
    this.onSelecting(index)
    this.onSelected()
  }

  /**
   * 选中商品
   */
  onSelecting(index: number) {
    this.selectedIndex = index
    CommonUtil.scrollIntoView(this.$refs.result.$el.children[0], document.getElementsByClassName('sku-search-item')[index])
  }

  /**
   * 确认选中项
   */
  onSelected() {
    this.updateModel(this.items[this.selectedIndex])
    this.resultVisible = false
    this.selectedIndex = -1
    this.items = []
  }

  /**
   *  更新v-model数据
   */
  updateModel(item: any) {
    this.watchValue(item)
    this.$emit('input', item)
    if (item.id) {
      this.$emit('select', item)
    } else {
      this.$emit('clear')
    }
  }

  /**
   *  focus输入框
   */
  focus() {
    if (this.$refs.input) {
      this.$refs.input.focus()
    }
  }
}
