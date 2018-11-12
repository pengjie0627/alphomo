<template>
  <div>
    <qf-button @click="onBtnAudit()" v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.payment.audit')" type="primary">审核</qf-button>
    <qf-button @click="onBtnEdit()" v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.payment.create')">编辑</qf-button>
    <qf-button @click="onBtnDel()" v-if="bill.status === 'UNAUDITED' && hasPermissions('finance.payment.delete')">删除</qf-button>
    <qf-button @click="onBtnAbolished()" v-if="bill.status === 'AUDITED' && hasPermissions('finance.payment.abolish')">作废</qf-button>
    <qf-button @click="onBtnExpot()" v-if="hasPermissions('finance.payment.export')">导出</qf-button>
    <print-view :id="id" type="Payment" btnType="default" v-if="hasPermissions('finance.payment.print')"></print-view>
    <print-pre-view :id="id" type="Payment" btnType="default" v-if="hasPermissions('finance.payment.print')"></print-pre-view>
    <print-maintenance-view type="Payment" btnType="default" v-if="hasPermissions('system.system.setup')"></print-maintenance-view>
  </div>
</template>

<script lang="ts" src="./PayAbleMenuDetailButton.ts"/>
