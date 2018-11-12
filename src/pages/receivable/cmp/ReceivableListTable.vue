<template>

  <!-- 数据列表 -->
  <qf-table :data="data" row-key="id" class="payable-list-table" @sort-change="doSortChange">
    <qf-table-column label="序号" type="index" width="70"></qf-table-column>
    <qf-table-column label="操作" align="center">
      <template slot-scope="props">
        <qf-button type="link"
                   @click="doGoDetail(props.row.customer.id,props.row.customer.name,props.row.customer.code)"
                   v-if="hasPermissions('finance.receivable.view')">查看
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="客户编号" prop="customer.code"></qf-table-column>
    <qf-table-column label="客户名称" prop="customer.name"></qf-table-column>
    <qf-table-column label="期初应收(元)" sortable prop="beginingAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="新增应收(元)" sortable prop="inAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="已优惠(元)" sortable prop="discountAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="已收款(元)" sortable prop="receivedAmount" :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="应收欠款(元)" sortable>
      <template slot-scope="props">
        <span class="fail">{{props.row.amount | PriceBit(2)}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./ReceivableListTable.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .payable-list-table {
    .fail {
      color: $--color-minor
    }
  }

</style>
