<template>
  <div class="sell-rpt-dtl-business">
    <qf-table
      :data="data"
      show-summary
      :summary-method="getSummaries"
      @sort-change="sortChange"
      border>
      <!--<qf-table-column type="selection"/>-->
      <qf-table-column label="序号" align="center" type="index" width="50px"/>
      <qf-table-column label="操作" align="center" width="50px">
        <template slot-scope="props">
          <qf-button type="link" @click="onCheck(props.row)" v-if="hasPermission('report.purchase.view')">查看</qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="业务日期" prop="businessDate" :formatter="dateFormatter" align="left"/>
      <qf-table-column label="单号" prop="billNum" align="left"/>
      <qf-table-column label="业务类型" prop="billType" align="left"/>
      <qf-table-column label="进货量" prop="qty" align="right" sortable>
        <template slot-scope="props">
          <div>{{props.row.billType === '退货'?'-':''}}{{props.row.qty}}</div>
        </template>
      </qf-table-column>
      <qf-table-column
        v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
        label="进货额(去税)" align="right" prop="taxExcAmount" width="150px"
        sortable>
        <template slot-scope="props">
          <div>{{props.row.billType === '退货'?'-':''}}{{props.row.taxExcAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货额(含税)" align="right" prop="amount" width="150px"
                       sortable>
        <template slot-scope="props">
          <div>{{props.row.billType === '退货'?'-':''}}{{props.row.amount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column
        v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
        label="进货均价(去税)" align="right" prop="taxExcAvgPrice" width="150px"
        sortable>
        <template slot-scope="props">
          <div>{{props.row.taxExcAvgPrice | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货均价(含税)" align="right" prop="avgPrice" width="150px"
                       sortable>
        <template slot-scope="props">
          <div>{{props.row.avgPrice | fmt}}</div>
        </template>
      </qf-table-column>
    </qf-table>
  </div>
</template>

<script lang="ts" src="./SellRptDtlBusiness.ts">

</script>

<style lang="scss">

  .sell-rpt-dtl-business {

    .table-style {
      margin-top: 50px;
    }

    .qf-table-footer-wrapper {
      position: absolute;
      top: -45px;
    }

  }

</style>
