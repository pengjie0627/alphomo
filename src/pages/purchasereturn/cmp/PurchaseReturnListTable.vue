<template>
  <!-- 数据列表 -->
  <qf-table class="purchase-return-list-table" :data="data" @sort-change="doSortChange"
            @selection-change="doSelectionChange"
            :cell-class-name="getCellClass"
            ref="purchaseReturnTable" row-key="id">
    <qf-table-column type="selection" align="center"/>
    <qf-table-column label="操作" width="150px" align="center">
      <template slot-scope="props">
        <detail-button class="purchase-return-list-button-group" :bill="props.row" target="list" type="link"
                       @getList="getList"></detail-button>
      </template>
    </qf-table-column>
    <qf-table-column label="单号" sortable prop="billNum">
      <template slot-scope="props">
        <div class="table-group">
          <qf-button type="link" @click="doGoDetail(props.row.id)">{{props.row.billNum}}</qf-button>
        </div>
      </template>
    </qf-table-column>
    <qf-table-column label="退货日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
    <qf-table-column label="供应商" prop="supplier.name"></qf-table-column>
    <qf-table-column label="仓库" prop="warehouse.name"></qf-table-column>
    <qf-table-column v-if="merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputOnlyTax" label="金额(去税)"
                     sortable prop="taxExcAmount" :formatter="priceFormatter"
                     align="right"></qf-table-column>
    <qf-table-column label="金额(含税)" sortable prop="realAmount" :formatter="priceFormatter"
                     align="right"></qf-table-column>
    <qf-table-column label="单据状态" prop="status" align="center">
      <template slot-scope="props">
        <span :class="[statusFormatter(props.row.status)]">{{props.row.status | status}}</span>
      </template>
    </qf-table-column>
    <qf-table-column label="结算状态" prop="settleStatus" align="center">
      <template slot-scope="props">
        <span
          :class="[settleStatusFormatter(props.row.settleStatus)]">{{props.row.settleStatus | settleStatus}}</span>
      </template>
    </qf-table-column>
    <qf-table-column label="付款状态" prop="payStatus" align="center">
      <template slot-scope="props">
        <span
          :class="[payStatusFormatter(props.row.payStatus)]">{{props.row.payStatus | payStatus}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./PurchaseReturnListTable.ts"></script>
<style lang="scss">
  @import '~styles/var.scss';

  .purchase-return-list-table {
    .danger {
      color: $--color-error;
    }
    .success {
      color: $--color-success;
    }
    .info {
      color: $--color-info;
    }
    .warning {
      color: $--color-warning
    }

    .purchase-return-list-button-group {
      float: none;
    }
    .qf-table-fixed {
      overflow: visible;
    }
  }
</style>
