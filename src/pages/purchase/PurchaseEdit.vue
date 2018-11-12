<template>
  <page-body :menu="menuList">
    <template slot="actions">
      <qf-button :type="presentation === 'create' ? 'default' : 'default'"
                 v-if="presentation === 'create'&&hasPermissions('purchase.purchase.create')"
                 @click="onSaveAndCreate">保存并新增
      </qf-button>
      <qf-button :type="presentation === 'edit' ? 'primary' : 'primary'" @click="onSave"
                 v-if="hasPermissions('purchase.purchase.create')">保存
      </qf-button>
      <qf-button @click="onSaveAndAudit"
                 v-if="hasPermissions('purchase.purchase.create')&&hasPermissions('purchase.purchase.audit')">保存并审核
      </qf-button>
      <qf-button @click="onCancel">取消</qf-button>
    </template>
    <bill-body>
      <purchase-title slot="title" :bill="bill" :presentation="presentation"></purchase-title>
      <purchase-edit-header slot="header" :bill="bill" :warehouses="warehouses"
                            :presentation="presentation"
                            :validator="validator"></purchase-edit-header>
      <template slot="toolbar">
        <qf-button type="default" @click="onAddSku">添加商品</qf-button>
        <qf-button :disabled="selected.length <= 0" @click="onRemoveLines">删除商品</qf-button>
        <qf-button :disabled="selected.length <= 0" @click="onFreeTaxRate">免税</qf-button>
      </template>
      <purchase-edit-table slot="table" :lines="bill.lines" :bill="bill"
                           @selectionChange="onSelectionChange" ref="purchaseTable"
                           @linesChange="onLinesChange"
                           :validator="validator" :presentation="presentation"></purchase-edit-table>
      <purchase-summary slot="summary" :bill="bill" :validator="validator"></purchase-summary>
      <qf-form-item slot="remark" label="备注" labelWidth="40px">
        <qf-input v-model="bill.remark" style="width: 500px" placeholder="请输入备注内容"
                  v-form:remark="validator"></qf-input>
      </qf-form-item>
      <operate-log-view slot="operateLog" class="operate-log"
                        :logs="bill.operateLogs"></operate-log-view>
      <template slot="bottomActions">
        <qf-button :type="presentation === 'create' ? 'default' : 'default'"
                   v-if="presentation === 'create'&&hasPermissions('purchase.purchase.create')"
                   @click="onSaveAndCreate">保存并新增
        </qf-button>
        <qf-button :type="presentation === 'edit' ? 'primary' : 'primary'" @click="onSave"
                   v-if="hasPermissions('purchase.purchase.create')">保存
        </qf-button>
        <qf-button @click="onSaveAndAudit"
                   v-if="hasPermissions('purchase.purchase.create')&&hasPermissions('purchase.purchase.audit')">保存并审核
        </qf-button>
        <qf-button @click="onCancel">取消</qf-button>
      </template>
    </bill-body>
  </page-body>
</template>

<script lang="ts" src="./PurchaseEdit.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

</style>
