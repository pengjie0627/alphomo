import { Vue, Component, Watch } from 'vue-property-decorator'
import PageBody from 'cmp/PageBody.vue'
import ListContainer from 'cmp/ListContainer.vue'
import UserApi from 'http/framework/user/UserApi'
import User from 'model/framework/user/User'
import { FormValidator, Loading } from 'fant'
import RoleApi from 'http/framework/role/RoleApi'
import ScopePerm from 'model/framework/role/ScopePerm'
import ConstantMgr from 'mgr/ConstantMgr'

@Component({
  name: 'EmployEdit',
  components: {
    PageBody,
    ListContainer
  }
})
export default class EmployEdit extends Vue {
  menu = [
    {
      name: '员工',
      url: '/employManage'
    },
    {
      name: '新建员工'
    }
  ]
  userBind = {
    name: '',
    mobile: '',
    login: '',
    sex: '',
    password: ''
  }
  confirmPwd = ''
  validator = new FormValidator()
  roleList: any[] = []
  roleSel: boolean[] = []
  priceList: any[] = []
  priceSel: boolean[] = []
  wareList: any[] = []
  wareSel: boolean[] = []
  status = '正常'
  allWarePer = true
  wareCode = ''
  wareName = ''
  merchant: any = ''
  fileType = ''
  version = 0
  $refs: {
    name: any,
    login: any
  }

  @Watch('wareSel', { deep: true })
  onWareSelChange(value: boolean[]) {
    if (value) {
      // let ware = this.wareSel.filter(item => {
      //   return item === true
      // })
      // if (ware.length > 0) {
      //   this.allWarePer = false
      // } else {
      //   this.allWarePer = true
      // }
      let count = 0
      this.wareSel.forEach(item => {
        item && count++
      })
      if (count > 0) {
        this.allWarePer = false
      }
      if (count === this.wareSel.length) {
        this.allWarePer = true
      }
    }
  }

  @Watch('allWarePer')
  onAllWarePerChange(value: boolean) {
    if (value) {
      for (let item in this.wareSel) {
        // this.$set(this.wareSel, item, true)
        this.wareSel[item] = true
      }
    }
  }

  mounted() {
    this.fileType = this.$route.query.type
    this.$nextTick(() => {
      this.$refs.name.focus()
    })
    this.getPriceAndWareList()
    this.menu[1]['name'] = this.$route.query.type === 'add' ? '新建员工' : '编辑员工'
    this.validator.push({
      name: [
        { minLength: 1, message: '请输入姓名' }
      ],
      login: [
        { minLength: 1, message: '请输入登录用户名' }
      ],
      password: [
        { minLength: 6, message: '请输入6-16位密码' },
        { maxLength: 16, message: '请输入6-16位密码' }
      ],
      confirmPwd: [
        { minLength: 6, message: '请输入6-16位密码' },
        { maxLength: 16, message: '请输入6-16位密码' },
        {
          validate: (value: string) => {
            if (value !== this.userBind.password) {
              return false
            }
            return true
          }, message: '密码不一致'
        }
      ]
    })
  }

  onSaveAndAdd() {
    this.onSaveOrAdd('saveAndAdd')
  }

  allWareChange() {
    this.wareSel.forEach((item, index) => {
      this.$set(this.wareSel, index, false)
    })
  }

  onSave() {
    this.onSaveOrAdd('add')
  }

  onCancel() {
    this.$router.back()
  }

  private getPriceAndWareList() {
    let loading = Loading.show()
    RoleApi.listUserPerms().then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.roleSel = []
        this.priceSel = []
        this.wareSel = []
        this.roleList = resp.data.roles
        this.priceList = resp.data.pricePerms
        this.wareList = resp.data.warehousePerms!.captions
        if (resp.data && resp.data.warehousePerms) {
          this.wareCode = resp.data.warehousePerms!.code!.toString()
          this.wareName = resp.data.warehousePerms!.name!.toString()
        }
        if (this.roleList && this.roleList.length > 0) {
          this.roleList.forEach(item => {
            this.roleSel.push(false)
          })
        }
        if (this.priceList && this.priceList.length > 0) {
          this.priceList.forEach(item => {
            this.priceSel.push(false)
          })
        }
        if (this.wareList && this.wareList.length > 0) {
          this.wareList.forEach(item => {
            this.wareSel.push(false)
          })
        }
        if (this.$route.query.type === 'edit') {
          let id = this.$route.query.id
          this.getEmployDtl(id)
        } else {
          for (let item in this.wareSel) {
            this.wareSel[item] = true
          }
        }
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  private getEmployDtl(id: string) {
    let loading = Loading.show()
    UserApi.get(id).then(resp => {
      if (resp && resp.success) {
        loading.hide()
        this.userBind.name = resp.data.name ? resp.data.name!.toString() : ''
        this.userBind.mobile = resp.data.mobile ? resp.data.mobile!.toString() : ''
        this.userBind.sex = resp.data.sex ? (resp.data.sex!.toString() === 'male' ? '男' : '女') : ''
        this.userBind.login = resp.data.login ? resp.data.login!.toString() : ''
        this.userBind.password = '**##**'
        this.confirmPwd = '**##**'
        this.status = resp.data.status === 0 ? '正常' : resp.data.status === 1 ? '锁定' : '删除'
        this.merchant = resp.data.merchant
        this.version = resp.data.version
        // 角色处理
        if (resp.data.roles && resp.data.roles.length > 0) {
          resp.data.roles.forEach(item => {
            this.roleList.forEach((role, index) => {
              if (item.name === role.name) {
                this.$set(this.roleSel, index, true)
              }
            })
          })
        }
        // 价格处理
        if (resp.data.pricePerms && resp.data.pricePerms.length > 0) {
          resp.data.pricePerms.forEach(item => {
            this.priceList.forEach((price, index) => {
              if (item.name === price.name) {
                this.$set(this.priceSel, index, true)
              }
            })
          })
        }
        // 仓库权限
        if (resp.data.warehousePerms && resp.data.warehousePerms!.captions && resp.data.warehousePerms!.captions.length === 0) {
          this.allWarePer = true
          for (let item in this.wareSel) {
            // this.$set(this.wareSel, item, true)
            this.wareSel[item] = true
          }
        } else {
          if (resp.data.warehousePerms && resp.data.warehousePerms!.captions && resp.data.warehousePerms!.captions.length > 0) {
            resp.data.warehousePerms!.captions.forEach(item => {
              this.wareList.forEach((ware, index) => {
                if (item.value === ware.value) {
                  this.$set(this.wareSel, index, true)
                }
              })
            })
          }
        }
      }
    }).catch(error => {
      loading.hide()
      this.$message.error(error.message)
    })
  }

  private onSaveOrAdd(param: string) {
    this.validator.validate(true).then(() => {
      if (!this.userBind.sex) {
        this.$message.warning('请选择性别')
        return
      }
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,20}$/g
      if (!reg.test(this.userBind.login)) {
        this.$message.warning('登录名需要同时包含数字和字母，限20字以内')
        this.$refs.login.focus()
        return
      }
      // todo 角色
      let roleFlag = this.roleSel.filter(item => {
        return item === true
      })
      if (roleFlag.length <= 0) {
        this.$message.warning('请选择角色')
        return
      }
      // todo 价格权限
      let priceFlag = this.priceSel.filter(item => {
        return item === true
      })
      if (priceFlag.length <= 0) {
        this.$message.warning('请选择价格权限')
        return
      }
      // todo 仓库权限
      let wareFlag = this.wareSel.filter(item => {
        return item === true
      })
      if (wareFlag.length <= 0 && !this.allWarePer) {
        this.$message.warning('请选择仓库权限')
        return
      }
      // todo 锁定状态
      if (!this.status) {
        this.$message.warning('请选择锁定状态')
        return
      }
      let user = new User()
      user.name = this.userBind.name
      user.mobile = this.userBind.mobile
      user.sex = this.userBind.sex === '男' ? 'male' : 'female'
      user.login = this.userBind.login
      user.password = this.userBind.password !== '**##**' ? this.userBind.password : ''
      user.status = this.status === '正常' ? 0 : 1
      user.version = this.version
      if (this.$route.query.type === 'edit') {
        user.id = this.$route.query.id
        user.merchant = this.merchant
      }
      // 角色
      this.roleList.forEach((item, index) => {
        if (this.roleSel[index]) {
          user.roles.push(item)
        }
      })
      // 价格
      this.priceList.forEach((item, index) => {
        if (this.priceSel[index]) {
          user.fieldPerms.push(item)
        }
      })
      // 仓库
      if (this.allWarePer) {
        let perm = new ScopePerm()
        perm.scope = null
        perm.code = this.wareCode
        perm.name = this.wareName
        user.scopePerms.push(perm)
      } else {
        let idStr = ''
        this.wareSel.forEach((item, index) => {
          if (item) {
            idStr += this.wareList[index].id + ','
          }
        })
        let perm = new ScopePerm()
        perm.scope = idStr.substring(0, idStr.length - 1)
        perm.code = this.wareCode
        perm.name = this.wareName
        user.scopePerms.push(perm)
      }
      if (this.$route.query.type === 'add') {
        UserApi.saveNew(user).then(resp => {
          if (resp && resp.success) {
            if (param === 'add') { // 保存
              this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
              this.$router.push({ name: 'employDtl', query: { id: resp.data } })
            } else { // 保存并新增
              this.$message.success(ConstantMgr.tips.saveNewAndModifySuccessTip)
              this.userBind.name = ''
              this.userBind.password = ''
              this.userBind.login = ''
              this.userBind.sex = ''
              this.userBind.mobile = ''
              this.status = '正常'
              this.roleList = []
              this.roleSel = []
              this.priceList = []
              this.priceSel = []
              this.wareList = []
              this.wareSel = []
              this.confirmPwd = ''
              this.getPriceAndWareList()
            }
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      } else {
        UserApi.saveModify(user).then(resp => {
          if (resp && resp.success) {
            this.$message.success(ConstantMgr.tips.saveModifySuccessTip)
            this.$router.push({ name: 'employDtl', query: { id: this.$route.query.id } })
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      }
    })
  }
}


