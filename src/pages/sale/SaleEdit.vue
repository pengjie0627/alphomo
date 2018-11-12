<template>
  <page-body :menu="menuList">
    <template slot="actions">
      <qf-button :type="presentation === 'create' ? 'default' : 'default'" v-if="presentation === 'create' && hasPermissions('sale.sale.create')"
                 @click="onSaveAndCreate">保存并新增
      </qf-button>
      <qf-button v-if="hasPermissions('sale.sale.create')" :type="presentation === 'edit' ? 'primary' : 'primary'" @click="onSave">保存</qf-button>
      <qf-button v-if="hasPermissions('sale.sale.create') && hasPermissions('sale.sale.audit')" @click="onSaveAndAudit">保存并审核</qf-button>
      <qf-button @click="onCancel">取消</qf-button>
    </template>
    <bill-body>
      <sale-title slot="title" :bill="bill" :presentation="presentation"></sale-title>
      <sale-edit-header slot="header" :bill="bill" :warehouses="warehouses" :presentation="presentation"
                        :validator="validator"></sale-edit-header>
      <template slot="toolbar">
        <qf-button v-if="hasPermissions('sale.sale.create')" type="default" @click="onAddSku">添加商品</qf-button>
        <qf-button v-if="hasPermissions('sale.sale.delete')" :disabled="selected.length <= 0" @click="onRemoveLines">删除商品</qf-button>
        <qf-button :disabled="selected.length <= 0" @click="onFreeTaxRate">免税</qf-button>
      </template>
      <sale-edit-table slot="table" :lines="bill.lines" :bill="bill" @selectionChange="onSelectionChange" ref="saleTable"
                       @linesChange="onLinesChange" :validator="validator" :presentation="pre0"></sale-edit-table>
      <sale-summary slot="summary" :bill="bill" :validator="validator"></sale-summary>
      <qf-form-item slot="remark" label="备注" labelWidth="50px" v-form:remark="validator">
        <qf-input v-model="bill.remark" :maxlength="140" style="width: 500px" placeholder="请输入备注内容"></qf-input>
      </qf-form-item>
      <operate-log-view slot="operateLog" class="operate-log" :logs="bill.operateLogs"></operate-log-view>
      <template slot="bottomActions">
        <qf-button :type="presentation === 'create' ? 'default' : 'default'" v-if="hasPermissions('sale.sale.create') && presentation === 'create'"
                   @click="onSaveAndCreate">保存并新增
        </qf-button>
        <qf-button v-if="hasPermissions('sale.sale.create')" :type="presentation === 'edit' ? 'primary' : 'primary'" @click="onSave">保存</qf-button>
        <qf-button v-if="hasPermissions('sale.sale.create') && hasPermissions('sale.sale.audit')" @click="onSaveAndAudit">保存并审核</qf-button>
        <qf-button @click="onCancel">取消</qf-button>
      </template>
    </bill-body>
  </page-body>
</template>

<script lang="ts" src="./SaleEdit.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

</style>
