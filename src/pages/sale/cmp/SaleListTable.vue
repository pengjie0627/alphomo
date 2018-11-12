<template>
  <!-- 数据列表 -->
  <qf-table class="sale-list-table" :data="data" @sort-change="doSortChange" @selection-change="doSelectionChange"
            :cell-class-name="getCellClass"
            ref="skuTable" row-key="id">
    <qf-table-column type="selection" align="center"/>
    <qf-table-column label="操作" align="center" width="150px">
      <template slot-scope="props">
        <sale-view-button class="sale-list-button-group" :bill="props.row" target="list" type="link"
                          @getList="getList"></sale-view-button>
      </template>
    </qf-table-column>
    <qf-table-column label="单号" sortable prop="billNum" width="180px">
      <template slot-scope="props">
        <div class="table-group">
          <qf-button type="link" @click="doGoSaleView(props.row.id)">{{props.row.billNum}}</qf-button>
          <qf-pill type="primary" size="small" v-if="props.row.saleReturns && props.row.saleReturns.length">有退货
          </qf-pill>
        </div>
      </template>
    </qf-table-column>
    <qf-table-column label="日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
    <qf-table-column label="客户" prop="customer.name" :formatter="customerFormatter"></qf-table-column>
    <qf-table-column label="仓库" prop="warehouse.name"></qf-table-column>
    <qf-table-column label="来源" prop="externalBill.source" :formatter="sourceFormatter" width="80px"></qf-table-column>
    <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputOnlyTax" label="金额(去税)"
                     align="right" sortable prop="taxExcAmount"
                     :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="金额(含税)" align="right" sortable prop="realAmount"
                     :formatter="priceFormatter"></qf-table-column>
    <qf-table-column label="状态" prop="status" align="center" width="100px">
      <template slot-scope="props">
        <span :class="[statusFormatter(props.row.status)]">{{props.row.status | status}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./SaleListTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-list-table {
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

    .sale-list-button-group {
      float: none;
    }
    .qf-table-fixed {
      overflow: visible;
    }
  }
</style>
