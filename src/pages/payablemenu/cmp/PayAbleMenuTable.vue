<template>
  <div class="pay-able-menu-table-view">
<qf-table
  ref="tableDef"
  @selection-change="selectionChange"
  @sort-change="sortChange"
  :data="tableData">
  <qf-table-column type="selection" align="center"/>
  <qf-table-column label="操作" align="center" width="100px">
    <template slot-scope="props">
      <qf-button type="link" @click="onBtnAudit(props.row)" v-if="props.row.status === 'UNAUDITED' && hasPermissions('finance.payment.audit')">审核</qf-button>
      <qf-button type="link" @click="onBtnEdit(props.row)" v-if="props.row.status === 'UNAUDITED' && hasPermissions('finance.payment.create')">编辑</qf-button>
      <qf-button type="link" @click="onBtnAbolish(props.row)" v-if="props.row.status === 'AUDITED' && hasPermissions('finance.payment.abolish')">作废</qf-button>
    </template>
  </qf-table-column>
  <qf-table-column label="单号" prop="billNum" width="150px" align="center" sortable>
    <template slot-scope="props">
      <qf-button class="textOverflow" type="link" @click="onBtnDtl(props.row)">{{props.row.billNum}}</qf-button>
    </template>
  </qf-table-column>
  <qf-table-column label="业务日期" width="180px" prop="businessDate" align="center" sortable>
    <template slot-scope="props">
      {{props.row.businessDate ? props.row.businessDate.substring(0, 11) : ''}}
    </template>
  </qf-table-column>
  <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
  <qf-table-column label="供应商" prop="supplier.name" align="left"></qf-table-column>
  <qf-table-column label="币种" prop="currency" align="left"></qf-table-column>
  <qf-table-column label="单据状态" prop="status" align="center">
    <template slot-scope="props">
      <div style="color: #FFCC66" v-if="props.row.status === 'UNAUDITED'" type="danger">未审核</div>
      <div style="color: #33CC66" v-if="props.row.status === 'AUDITED'" type="success">已审核</div>
      <div style="color: #FE514D" v-if="props.row.status === 'ABOLISHED'">已作废</div>
    </template>
  </qf-table-column>
  <qf-table-column label="应付金额(元)" prop="paidAmount" align="right" sortable>
    <template slot-scope="props">
      <div v-if="props.row.status !== 'ABOLISHED'" style="color: #33CC66">{{props.row.paidAmount | fmt}}</div>
      <div v-if="props.row.status === 'ABOLISHED'" style="color: #CCCCCC">{{props.row.paidAmount | fmt}}</div>
    </template>
  </qf-table-column>
</qf-table>
  </div>
</template>
<script lang="ts" src='./PayAbleMenuTable.ts'></script>
<style lang="scss">
  .pay-able-menu-table-view {
  }
</style>
