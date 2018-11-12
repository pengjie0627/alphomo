import { Vue, Component, Prop } from 'vue-property-decorator'
import RoleApi from 'http/framework/role/RoleApi'
// import RoleApi from 'http/framework/role/RoleApi'

@Component({
  name: 'RoleListTable',
  components: {}
})
export default class RoleListTable extends Vue {
  sort: any[] = []
  @Prop()
  roleList: any

  /**
   * 选择
   */
  selectionChange() {
    // todo
  }

  onClick(pos: number) {
    // todo
  }

  onCheck(row: any) {
    this.$router.push({ name: 'roleDtl', query: { id: row.id } })
  }
  onEdit(row: any) {
    this.$router.push({ name: 'roleEdit', query: { type: 'edit', id: row.id } })
  }
  onDel(row: any) {
    this.$msgBox.confirm('删除', '确定要删除该角色吗？', () => {
      RoleApi.delete(row.id, row.version).then(resp => {
        if (resp && resp.success) {
          this.$message.success('删除成功')
          this.$emit('refresh')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    })
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


