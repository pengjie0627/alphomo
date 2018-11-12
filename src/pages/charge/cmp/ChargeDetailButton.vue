<template>
  <div>
    <qf-button v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.charge.delete')" @click="onBtnDel()">删除</qf-button>
    <qf-button v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.charge.create')" @click="onBtnEdit()">编辑</qf-button>
    <qf-button v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.charge.audit')" @click="onBtnAudit()" type="primary">审核</qf-button>
    <qf-button v-if="bill.payStatus !== 'PAID' && bill.status === 'AUDITED' && hasPermissions('finance.charge.abolish')" @click="onBtnAbolish()">作废</qf-button>
    <qf-button v-if="hasPermissions('finance.charge.export')" @click="onBtnExport()">导出</qf-button>
    <print-view :id="id" type="Charge" btnType="default" v-if="hasPermissions('finance.charge.print')"></print-view>
    <print-pre-view :id="id" type="Charge" btnType="default" v-if="hasPermissions('finance.charge.print')"></print-pre-view>
    <print-maintenance-view type="Charge" btnType="default" v-if="hasPermissions('system.system.setup')"></print-maintenance-view>
  </div>
</template>
<script lang="ts" src="./ChargeDetailButton.ts"/>
