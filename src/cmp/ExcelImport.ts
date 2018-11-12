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
  isMap: boolean = true
  percentage: number = 0
  validator = new FormValidator()
  validatorFile = new FormValidator()
  file: any
  cacheTitle: string = ''
  importError: string = '' // 导入异常错误
  errUrl: string = '' // 错误下载地址

  // 导入参数
  title = '' // 弹出框title
  isMatch: boolean = false // 是否需要列匹配
  downloadUrl = '' // 模板下载地址
  fieldDate: any[]
  description: string[] = ['仅支持导入.xls和.xlsx的文件格式', '建议数据条数≤300条，文件≤1M'] // 描述
  onConfirm: Function // 回调函数
  doUpload: Function  // 上传函数
  doImport: Function  // 导入函数
  doProgress: Function // 获取进度条
  doStop: Function // 停止导入

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
  doImportAuto() {
    this.validator.validate(false).then(() => {
      let $this = this
      $this.isMap = true
      this.fields.forEach(function (item) {
        $this.mapper[item.name] = item.value
      })
      $this.mapperStr = JSON.stringify($this.mapper)
      // todo mapper
      console.log('do something')
    }).catch(() => {
      this.importError = '文件大小不超过1MB'
      this.step = 'step5'
      this.title = '导入异常提醒'
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
    this.validatorFile.validate(false).then(() => {
      let loading = Loading.show()
      this.showConfirmBtn = true
      loading.hide()
      // todo upload
      this.doUpload && this.doUpload(file).then((res: any) => {
        if (res && res.success) {
          this.fileName = file.name
          this.uuid = res.data
          this.jump(this.fields)
        }
      }).catch((err: any) => {
        this.title = '导入异常提醒'
        this.step = 'step5'
        this.importError = err.message
        this.showCancel = true
        this.confirmText = '下载模板'
        this.cancelText = '取消'
      })
    }).catch((err) => {
      this.importError = err.message
      this.step = 'step5'
      this.title = '导入异常提醒'
      this.showConfirmBtn = true
      this.showCancel = false
      this.confirmText = '知道了'
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
    this.doImport && this.doImport(this.uuid).then((res: any) => {
      this.uuid = res.data
      this.step = 'step3'
      this.showConfirmBtn = false
      this.title = this.cacheTitle
      this.startTimer(1000)
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
    this.doProgress && this.doProgress(this.uuid).then((res: any) => {
      if (res && (res.data.success || !res.data.finished)) {
        this.percentage = res.data.percent
        if (this.percentage >= 100) {
          this.successNum = res.data.successCount
          this.stopNum = res.data.failCount
          this.step = 'step4'
          this.clearTimer()
          this.getResult(res.data.result)
        }
      } else {
        this.clearTimer()
        this.importError = res.data.lastMessage
        this.step = 'step5'
        this.title = '导入异常提醒'
        this.getResult(res.data.result)
        return false
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
    this.showConfirmBtn = false
    this.timer = setInterval(() => {
      this.getPercent()
    }, time)
  }

  /**
   * 获取上传结果
   */
  getResult(url: string) {
    // todo 获取上传结果
    this.errUrl = url || ''
    this.showConfirmBtn = true
    this.showCancel = false
    if (this.errUrl && this.stopNum > 0) {
      this.confirmText = '导出错误数据'
    } else {
      this.confirmText = '知道了'
    }
  }

  /**
   * 停止导入
   */
  doStopImport() {
    // todo stop
    this.doStop && this.doStop(this.uuid).then(() => {
      this.$message.success('停止导入!')
      this.$emit('hide')
    }).catch((err: any) => {
      this.$message.error(err.message)
      this.$emit('hide')
    })
  }

  doStopCheck() {
    this.showCancel = true
    this.showConfirmBtn = true
    clearInterval(this.timer)
    this.showCancel = true
    this.confirmText = '取消导入'
    this.cancelText = '不，手滑了'
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
        this.doDownloadDetail()
        break
      }
      case 'step5':
        this.doDownloadDetail()
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
        this.doStopCheck()
      }
    } else {
      this.$emit('hide')
      this.clearMapper()
      this.onConfirm && this.onConfirm()
    }
  }

  /**
   * 下载上传结果
   */
  doDownloadDetail() {
    // todo 获取上传结果下载地址
    if (this.errUrl) {
      window.location.href = this.errUrl
    }
    this.onConfirm && this.onConfirm()
    this.$emit('hide')
  }

}
