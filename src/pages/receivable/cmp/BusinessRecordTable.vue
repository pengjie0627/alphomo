<template>
  <!-- 数据列表 -->
  <qf-table :data="data" row-key="id" class="business-record-table" @sort-change="doSortChange">
    <qf-table-column label="序号" type="index" width="70"></qf-table-column>
    <qf-table-column label="操作" align="center">
      <template slot-scope="props">
        <qf-button type="link" v-if="props.row.billType=='Sale'&&hasPermissions('sale.sale.view')"
                   @click="doGoDetail(props.row.id,props.row.billType)">查看
        </qf-button>
        <qf-button type="link" v-if="props.row.billType=='SaleReturn'&&hasPermissions('sale.saleReturn.view')"
                   @click="doGoDetail(props.row.id,props.row.billType)">查看
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="业务类型 " prop="billType" :formatter="billTypeFormatter"></qf-table-column>
    <qf-table-column label="单号" prop="billNum"></qf-table-column>
    <qf-table-column label="业务日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
    <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
    <qf-table-column label="核销状态" prop="settleStatus" :formatter="settleFormatter"></qf-table-column>
    <qf-table-column label="应收金额(元)" prop="amount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="已收款(元)" sortable prop="receivedAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="剩余应收(元)" >
      <template slot-scope="props">
        <span class="fail">{{props.row.remainAmount | price}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./BusinessRecordTable.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .business-record-table {
    .fail {
      color: $--color-minor
    }
  }

</style>
