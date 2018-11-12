<template>
  <div>
    <qf-button v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.supplierStatement.delete')" @click="onBtnDel()">删除</qf-button>
    <qf-button v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.supplierStatement.create')" @click="onBtnEdit()">编辑</qf-button>
    <qf-button v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.supplierStatement.audit')" @click="onBtnAudit()" type="primary">审核</qf-button>
    <qf-button v-if="bill.payStatus !== 'PAID' && bill.status === 'AUDITED' && hasPermissions('finance.supplierStatement.abolish')" @click="onBtnAbolish()">作废</qf-button>
    <qf-button v-if="hasPermissions('finance.supplierStatement.export')" @click="onBtnExport()">导出</qf-button>
    <print-view :id="bill.id" type="SupplierStatement" btnType="default" v-if="hasPermissions('finance.supplierStatement.print')"></print-view>
    <print-pre-view :id="bill.id" type="SupplierStatement" btnType="default" v-if="hasPermissions('finance.supplierStatement.print')"></print-pre-view>
    <print-maintenance-view type="SupplierStatement" btnType="default" v-if="hasPermissions('system.system.setup')"></print-maintenance-view>
  </div>
</template>
<script lang="ts" src="./AccountBillDetailButton.ts"/>
