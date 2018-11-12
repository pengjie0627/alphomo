<template>
  <div class="receivable-record-table">
    <!-- 数据列表 -->
    <qf-table :data="data" @sort-change="doSortChange" row-key="id">
      <qf-table-column label="序号" type="index" width="70"></qf-table-column>
      <qf-table-column label="操作" align="center">
        <template slot-scope="props">
          <qf-button type="link" @click="doGoDetail(props.row.id)" v-if="hasPermissions('finance.receivable.view')">查看</qf-button>
          <qf-button type="link" v-if="props.row.status=='UNAUDITED'&&hasPermissions('finance.receivable.audit')"
                     @click="doAudit(props.row.id)">审核
          </qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="单号" prop="billNum"></qf-table-column>
      <qf-table-column label="业务日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
      <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
      <qf-table-column label="审核状态" prop="status" :formatter="statusFormatter"></qf-table-column>
      <qf-table-column label="核销状态" prop="settleStatus" :formatter="settleFormatter"></qf-table-column>
      <qf-table-column label="已优惠(元)" prop="discountAmount" :formatter="priceFormatter"></qf-table-column>
      <qf-table-column label="合计付款(元)" sortable prop="totalRcvdAmount" :formatter="priceFormatter">
        <template slot-scope="props">
          <span class="fail">{{props.row.totalRcvdAmount | price}}</span>
        </template>
      </qf-table-column>
    </qf-table>

  </div>

</template>

<script lang="ts" src="./ReceivableRecordTable.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .receivable-record-table {
    .fail {
      color: $--color-minor
    }
  }

</style>
