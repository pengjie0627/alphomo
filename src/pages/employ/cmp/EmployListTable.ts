import { Vue, Component, Prop } from 'vue-property-decorator'
import UserApi from 'http/framework/user/UserApi'
import { Loading } from 'fant'

@Component({
  name: 'EmployListTable',
  components: {}
})
export default class EmployListTable extends Vue {
  sort: any[] = []
  @Prop()
  employList: any

  /**
   * 选择
   */
  selectionChange() {
    // todo
  }

  onEdit(row: any) {
    this.$router.push({ name: 'employEdit', query: { id: row.id, type: 'edit' } })
  }

  onDel(row: any) {
    this.$msgBox.confirm('删除', '确定删除该员工？', () => {
      let loading = Loading.show()
      UserApi.delete(row.id, row.version).then(resp => {
        if (resp && resp.success) {
          loading.hide()
          this.$message.success('删除成功')
          this.$emit('refreshList')
        }
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  onCheck(row: any) {
    this.$router.push({ name: 'employDtl', query: { id: row.id } })
  }

  roleFormatter(row: any, column: any, value: string) {
    if (row.roles.length > 0) {
      let str = ''
      row.roles.forEach((item: any, index: any) => {
        if (index === row.roles.length - 1 && item) {
          str += item.name
        } else {
          if (item) {
            str += item && item.name + ','
          }
        }
      })
      return str
    } else {
      return ''
    }
  }

  /**
   * 表格排序
   */
  sortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    this.sort = []
    column && prop && order && this.sort.push({ 'property': prop, 'direction': order })
    this.$emit('refreshListBySort', this.sort)
  }

}


