<template>
  <div class="account-bill-list-table-view">
    <qf-table
      ref="tableDef"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      :data="tableData">
      <qf-table-column type="selection" align="center"/>
      <qf-table-column label="操作" align="center" width="100px">
        <template slot-scope="props">
          <qf-button type="link" v-if="props.row.status === 'UNAUDITED' && hasPermissions('finance.supplierStatement.audit')" @click="onBtnAudit(props.row)">审核</qf-button>
          <qf-button type="link" v-if="props.row.status === 'UNAUDITED' && hasPermissions('finance.supplierStatement.create')" @click="onToEdit(props.row)">编辑</qf-button>
          <qf-button type="link" v-if="props.row.status === 'AUDITED' && props.row.payStatus !== 'PAID' && hasPermissions('finance.supplierStatement.abolish')" @click="onBtnAbolish(props.row)">作废</qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="单号" prop="billNum" width="100px" align="center" sortable>
        <template slot-scope="props">
          <qf-button class="textOverflow" type="link" @click="onToDtl(props.row)">{{props.row.billNum}}</qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="业务日期" prop="businessDate" width="150px" align="center" sortable>
        <template slot-scope="props">
          {{props.row.businessDate ? props.row.businessDate.substring(0,11) : ''}}
        </template>
      </qf-table-column>
      <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
      <qf-table-column label="供应商" prop="supplier.name" align="left"></qf-table-column>
      <qf-table-column label="单据状态" prop="status" width="100px" align="center" >
        <template slot-scope="props">
          <div style="color: #FFCC66" v-if="props.row.status === 'UNAUDITED'" type="danger">未审核</div>
          <div style="color: #33CC66" v-if="props.row.status === 'AUDITED'" type="success">已审核</div>
          <div style="color: #FE514D" v-if="props.row.status === 'ABOLISHED'">已作废</div>
        </template>
      </qf-table-column>
      <qf-table-column label="收票状态" prop="isInvoice" width="100px" align="center" >
        <template slot-scope="props">
          <div style="color: #FFCC66" v-if="!props.row.isInvoice" type="danger">未收票</div>
          <div style="color: #33CC66" v-if="props.row.isInvoice" type="success">已收票</div>
        </template>
      </qf-table-column>
      <qf-table-column label="付款状态" prop="payStatus" width="100px" align="center" >
        <template slot-scope="props">
          <div style="color: #FFCC66" v-if="props.row.payStatus === 'UNPAID'" type="danger">未付款</div>
          <div style="color: #33CC66" v-if="props.row.payStatus === 'PAID'" type="success">已付款</div>
        </template>
      </qf-table-column>
      <qf-table-column label="结算金额(元)" prop="settleAmount" align="right" sortable>
        <template slot-scope="props">
         <div v-if="props.row.status !== 'ABOLISHED'" style="color: #33CC66">{{props.row.settleAmount | fmt}}</div>
          <div v-if="props.row.status === 'ABOLISHED'" style="color: #CCCCCC">{{props.row.settleAmount | fmt}}</div>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>
<script lang="ts" src='./AccountBillListTable.ts'></script>
<style lang="scss">
  .account-bill-list-table-view {
  }
</style>
