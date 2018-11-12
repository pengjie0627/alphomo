<template>
  <page-body :menu="menuList">
    <template slot="actions">
      <qf-button v-if="!bill.sale && presentation !== 'edit' && hasPermissions('sale.saleReturn.create')"
                 :type="!sale ? 'default' : 'default'"
                 @click="onSaveAndCreate">保存并新增
      </qf-button>
      <qf-button v-if="hasPermissions('sale.saleReturn.create')"
                 :type="(bill.sale || presentation === 'edit') ? 'primary' : 'primary'"
                 @click="onSave">保存
      </qf-button>
      <!--<qf-button type="primary" @click="onSave">保存</qf-button>-->
      <qf-button v-if="hasPermissions('sale.saleReturn.create') && hasPermissions('sale.saleReturn.audit')"
                 @click="onSaveAndAudit">保存并审核
      </qf-button>
      <qf-button @click="onCancel">取消</qf-button>
    </template>
    <bill-body>
      <sale-return-title slot="title" :bill="bill" :presentation="presentation"></sale-return-title>
      <sale-return-edit-header slot="header" :bill="bill" :warehouses="warehouses"
                               :presentation="presentation"
                               :validator="validator"
                               :isReturnFromSale="isReturnFromSale()"></sale-return-edit-header>
      <template slot="toolbar">
        <qf-button type="default" @click="onAddSku"
                   v-if="!isReturnFromSale() && hasPermissions('sale.saleReturn.create')">添加商品
        </qf-button>
        <qf-button v-if="hasPermissions('sale.saleReturn.delete')" :disabled="selected.length <= 0"
                   @click="onRemoveLines">删除商品
        </qf-button>
        <qf-button :disabled="selected.length <= 0" @click="onFreeTaxRate">免税</qf-button>
      </template>
      <sale-return-edit-table slot="table" :lines="bill.lines" :bill="bill"
                              @selectionChange="onSelectionChange"
                              ref="saleReturnTable"
                              @linesChange="onLinesChange" :validator="validator"
                              :isReturnFromSale="isReturnFromSale()" :presentation="pre0"></sale-return-edit-table>
      <sale-return-summary slot="summary" :bill="bill" :validator="validator"
                           :isReturnFromSale="isReturnFromSale()"></sale-return-summary>
      <qf-form-item slot="remark" label="备注" labelWidth="50px" v-form:remark="validator">
        <qf-input v-model="bill.remark" style="width: 500px" :maxlength="140"
                  placeholder="请输入备注内容"></qf-input>
      </qf-form-item>
      <operate-log-view slot="operateLog" class="operate-log"
                        :logs="bill.operateLogs"></operate-log-view>
      <template slot="bottomActions">
        <qf-button :type="!sale ? 'default' : 'default'"
                   v-if=" !bill.sale && presentation !== 'edit' && hasPermissions('sale.saleReturn.create')"
                   @click="onSaveAndCreate">保存并新增
        </qf-button>
        <qf-button v-if="hasPermissions('sale.saleReturn.create')"
                   :type="(bill.sale || presentation === 'edit') ? 'primary' : 'primary'"
                   @click="onSave">保存
        </qf-button>
        <qf-button v-if="hasPermissions('sale.saleReturn.create') && hasPermissions('sale.saleReturn.audit')"
                   @click="onSaveAndAudit">保存并审核
        </qf-button>
        <qf-button @click="onCancel">取消</qf-button>
      </template>
    </bill-body>
  </page-body>
</template>

<script lang="ts" src="./SaleReturnEdit.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

</style>
