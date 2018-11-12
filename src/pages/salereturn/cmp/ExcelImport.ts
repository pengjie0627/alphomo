import { Component, Vue } from 'vue-property-decorator'
import { FormValidator, Loading } from 'fant'
import CommonUtil from 'util/CommonUtil'


@Component({
  name: 'ExcelImport',
  components: {}
})

export default class ExcelImport extends Vue {
  confirmText = ''
  cancelText = '停止导入'
  showConfirmBtn: boolean = false
  showCancel: boolean = false
  uuid: string = '' // 文件UUID
  timer: any // 定时器
  step: string = 'step1' // 步骤
  fileName: string // 模板文件名称
  successNum: number = 0
  stopNum: number = 0
  fields: any[] = []
  mapperStr: string
  mapper: any = {}
  test: string = '2'
  isMap: boolean = true
  percentage: number = 0
  validator = new FormValidator()
  validatorFile = new FormValidator()
  file: any
  cacheTitle: string = ''
  importError: string = '' // 导入异常错误

  // 导入参数
  title = '' // 弹出框title
  isMatch: boolean = false // 是否需要列匹配
  downloadUrl = '' // 模板下载地址
  fieldDate: any[]
  description: string[] = ['仅支持导入.xls和.xlsx的文件格式', '模板中红色星号的是必填项', '建议商品条数≤300条,文件≤1M'] // 描述
  onConfirm: Function // 回调函数
  doUpload: Function  // 上传函数
  importRequst: Function  // 导入函数
  getProgessRequst: Function // 获取进度条
  getRusultRequst: Function // 获取结果

  $refs: {
    fileInput: any
  }

  mounted() {
    this.cacheTitle = CommonUtil.copy(this.title)
    this.validator.push({
      match: [{
        validate: () => {
          if (this.fields.filter(item => !item.value && item.require).length > 0) {
            return false
          }
          return true
        }, message: '请选择必填项'
      }]
    })
    this.validatorFile.push({
      file: [{
        validate: () => {
          if (this.file.size > 1024 * 1024) {
            return false
          }
          return true
        }, message: '文件大小不超过1MB'
      }]
    })

  }


  /**
   * 下载模板
   */
  doDownloadTemplate() {
    // 下载文件
    if (this.downloadUrl) {
      window.location.href = this.downloadUrl
    } else {
      this.$message.warning('没有发现模板，请通知管理人员上传模板!')
    }
  }

  /**
   * 列匹配之后手动导入
   */
  doImport() {
    this.validator.validate(true).then(() => {
      let $this = this
      $this.isMap = true
      this.fields.forEach(function (item) {
        $this.mapper[item.name] = item.value
      })
      $this.mapperStr = JSON.stringify($this.mapper)
      // todo mapper
      console.log('do something')
    })

  }


  /**
   * 选择文件之后预上传
   * @param ev
   */
  changeImportFile(ev: any) {
    this.file = ev.target.files[0]
    this.upload(this.file)
  }

  /**
   * 上传文件
   * @param file
   */
  upload(file: any) {
    this.validatorFile.validate(true).then(() => {
      let loading = Loading.show()
      this.showConfirmBtn = true
      loading.hide()
      // todo upload
      this.doUpload && this.doUpload(file).then((res: any) => {
        if (res && res.success) {
          this.fileName = '未闻花名.xlsx'
          console.log(res.data)
          // this.jump(this.fields)
        }
      }).catch((err: any) => {
        this.title = '导入异常提醒'
        this.step = 'step5'
        this.importError = err.message
        this.showCancel = true
        this.confirmText = '下载模板'
        this.cancelText = '取消'
      })
    })
  }

  clearMapper() {
    this.fields.forEach(function (item) {
      item.value = ''
    })
  }


  /**
   * 检查是否需要列匹配
   * @param {any[]} data
   */
  jump(data: any[]) {
    if (this.isMatch) { // 是否需要列匹配
      this.step = 'step2'
      this.confirmText = '开始导入'
      if (this.fields) {
        this.fields.forEach(function (item, i) {
          data.forEach(function (obj) {
            if (obj.columnName && obj.key) {
              if (item.text === obj.columnName.replace('（必填）', '')) {
                item.value = obj.key
              }
            }
          })
        })
      }
    } else {
      this.doImportBegin()
    }
  }

  /**
   * 开始导入
   */
  doImportBegin() {
    // todo begin import
    this.importRequst && this.importRequst().then((res: any) => {
      this.step = 'step3'
      this.showConfirmBtn = false
      this.title = this.cacheTitle
      this.startTimer(300)
    }).catch((err: any) => {
      this.$message.error(err.message)
    })
  }


  /**
   * 文件控件上传文件
   */
  doUploadFile() {
    this.$refs.fileInput.click()
  }

  /**
   * 清理定时器
   */
  clearTimer() {
    clearInterval(this.timer)
    this.percentage = 0
  }

  /**
   * 获取进度条
   */
  getPercent() {
    // todo 获取进度条
    this.getProgessRequst && this.getProgessRequst().then((res: any) => {
      if (res && res.success) {
        this.percentage = res.data
        if (this.percentage > 100) {
          this.step = 'step4'
          this.clearTimer()
          this.getResult()
        }
      }
    }).catch((err: any) => {
      this.$message.error(err.message)
    })
  }

  /**
   * 开始获取进度
   */
  startTimer(time: number) {
    this.showCancel = false
    this.confirmText = '停止导入'
    this.timer = setInterval(() => {
      this.getPercent()
    }, time)
  }

  /**
   * 获取上传结果
   */
  getResult() {
    // todo 获取上传结果
    this.showConfirmBtn = true
    this.showCancel = false
    if (this.stopNum === 0) {
      this.confirmText = '关闭弹框'
    } else {
      this.confirmText = '导出错误数据'
    }
  }

  /**
   * 停止导入
   */
  doStopImport() {
    // todo stop
    this.$emit('hide')
  }

  /**
   * 确认函数
   */
  doConfirm() {
    switch (this.step) {
      case 'step1': {
        break
      }
      case 'step2': {
        this.doImport()
        break
      }
      case 'step3': {
        this.doStopImport()
        break
      }
      case 'step4': {
        if (this.stopNum > 0) {
          this.doDownloadDetail()
        } else {
          this.$emit('hide')
        }
        break
      }
      case 'step5':
        this.doDownloadTemplate()
        break
    }
  }

  /**
   * 取消
   */
  doCancel() {
    if (this.step === 'step3') {
      if (this.showCancel) {
        this.startTimer(300)
      } else {
        this.showCancel = true
        this.showConfirmBtn = true
        clearInterval(this.timer)
        this.showCancel = true
        this.confirmText = '取消导入'
        this.cancelText = '不，手滑了'
      }
    } else {
      this.$emit('hide')
      this.clearMapper()
      this.onConfirm && this.onConfirm()
    }
  }

  doDownloadDetail() {
    // todo 获取上传结果下载地址
    window.location.href = '123'
    this.$emit('hide')
  }

}
