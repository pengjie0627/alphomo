import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ExportDialog extends Vue {
  title: string
  msg: string = '您确定导出全部数据？'
  onConfirm: Function
  onExport: Function
  onProgress: Function

  showCancel: boolean = true
  cancelText: string = '取消'
  showConfirm: boolean = true
  step: number = 1
  point: number = 0
  interval: any
  uuid: string = ''
  progressColor: string = '#5090f0'
  exportErr: string = ''


  doCancel() {
    this.onConfirm && this.onConfirm()
    this.$emit('hide')
  }


  doExport() {
    this.onExport && this.onExport().then((resp: any) => {
      this.uuid = resp.data
      this.doStartTimer()
    }).catch((err: any) => {
      this.step = 3
      this.title = '导出异常'
      this.showCancel = true
      this.cancelText = '知道了'
      this.exportErr = err.message
    })
  }

  doGetProgress() {
    this.onProgress && this.onProgress(this.uuid).then((resp: any) => {
      console.log('start', this.interval)
      if (this.point < 99) {
        this.point = resp.data.percent
      } else {
        this.point = 100
        this.progressColor = '#64c73e'
        this.step = 4
        this.doClearTimer()
        if (resp.data.success && resp.data.finished) {
          if (resp.data.result) {
            window.location.href = resp.data.result
            this.showCancel = true
            this.cancelText = '知道了'
          } else {
            this.step = 3
            this.title = '导出异常'
            this.showCancel = true
            this.cancelText = '知道了'
            this.exportErr = '未生成下载文件'
          }
        } else {
          this.step = 3
          this.title = '导出异常'
          this.showCancel = true
          this.cancelText = '知道了'
          this.exportErr = resp.data.lastMessage
        }
      }
    }).catch((err: any) => {
      this.step = 3
      this.title = '导出异常'
      this.showCancel = true
      this.cancelText = '知道了'
      this.exportErr = err.message
    })
  }

  doStartTimer() {
    if (this.onProgress) {
      this.interval = setInterval(() => {
        this.doGetProgress()
      }, 1000)
    } else {
      this.progressColor = '#64c73e'
      this.point = 100
      this.step = 4
      this.doClearTimer()
      this.showCancel = true
      this.cancelText = '知道了'
      window.location.href = this.uuid
    }
  }

  doClearTimer() {
    console.log('end', this.interval)
    clearInterval(this.interval)
  }

  doConfirm() {
    switch (this.step) {
      case 1:
        this.step = 2
        this.showCancel = false
        this.showConfirm = false
        this.doExport()
        break
      case 2:
        break
      case 3:
        this.showConfirm = true
        this.onConfirm && this.onConfirm()
        this.$emit('hide')
        break
      default:
        this.onConfirm && this.onConfirm()
        this.$emit('hide')
    }
  }
}
