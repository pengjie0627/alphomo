<template>
  <div>
    <qf-button @click="onBtnDel()" v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.advancePayment.delete')">删除</qf-button>
    <qf-button @click="onBtnEdit()" v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.advancePayment.create')">编辑</qf-button>
    <qf-button @click="onBtnAudit()" v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.advancePayment.audit')" type="primary">审核</qf-button>
    <qf-button @click="onBtnAbolished()" v-if="bill.status === 'AUDITED' && hasPermissions('finance.advancePayment.abolish') && bill.deductStatus !== 'DEDUCTED'">作废</qf-button>
    <qf-button @click="onBtnExpot()" v-if="hasPermissions('finance.advancePayment.export')">导出</qf-button>
    <print-view :id="id" type="AdvancePayment" btnType="default" v-if="hasPermissions('finance.advancePayment.print')"></print-view>
    <print-pre-view :id="id" type="AdvancePayment" btnType="default" v-if="hasPermissions('finance.advancePayment.print')"></print-pre-view>
    <print-maintenance-view type="AdvancePayment" btnType="default" v-if="hasPermissions('system.system.setup')"></print-maintenance-view>
  </div>
</template>
<script lang="ts" src="./AdvancePaymentDetailButton.ts"/>
