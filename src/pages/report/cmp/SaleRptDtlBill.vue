<template>
  <div class="sale-rpt-dtl-bill">
    <qf-table
      ref="skuTable"
      :data="tableData"
      show-summary
      :summary-method="getSummaries"
      @sort-change="sortChange"
      border>
      <!--<qf-table-column type="selection"/>-->
      <qf-table-column label="序号" align="center" type="index" width="50px"/>
      <qf-table-column label="操作" align="center" width="50px">
        <template slot-scope="props">
          <qf-button type="link" @click="onCheck(props.row)">查看</qf-button>
        </template>
      </qf-table-column>
      <qf-table-column label="业务日期" prop="businessDate" align="left" :formatter="formatter">
      </qf-table-column>
      <qf-table-column label="单号" prop="billNum" align="left"/>
      <qf-table-column label="业务类型" prop="billType" align="left">
        <template slot-scope="props">
          <div>{{props.row.billType === 'Sale' ? '销售' : '销售退货'}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="销售量" prop="qty" align="right" sortable/>
      <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputReportOnlyTax"
                       label="销售额(去税)" align="right" prop="taxExcAmount" sortable>
        <template slot-scope="props">
          <div>{{props.row.taxExcAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="销售额(含税)" align="right" prop="amount" sortable>
        <template slot-scope="props">
          <div>{{props.row.amount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputReportOnlyTax"
                       label="销售均价(去税)" prop="taxExcAvgPrice" align="right" sortable minWidth="100px">
        <template slot-scope="props">
          <div>{{props.row.taxExcAvgPrice | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column label="销售均价(含税)" prop="avgPrice" align="right" sortable minWidth="100px">
        <template slot-scope="props">
          <div>{{props.row.avgPrice | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column
        v-if="hasPermission('price.costPrice') &&merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputReportOnlyTax"
        label="毛利额(去税)" prop="taxExcGrossAmount" align="right" sortable>
        <template slot-scope="props">
          <div>{{props.row.taxExcGrossAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="毛利额(含税)" prop="grossAmount" align="right"
                       sortable>
        <template slot-scope="props">
          <div>{{props.row.grossAmount | fmt}}</div>
        </template>
      </qf-table-column>
      <qf-table-column v-if="hasPermission('price.costPrice')" label="毛利率(含税)" align="right" prop="grossRate"
                       sortable>
        <template slot-scope="props">
          <div>{{props.row.grossRate * 100 | fmt('0.00')}}%</div>
        </template>
      </qf-table-column>
    </qf-table>
    <div class="page">
      <qf-pagination :total='totalItem'
                     v-model="start"
                     :page-size='10'
                     @change="onChange"></qf-pagination>
    </div>
  </div>
</template>

<script lang="ts" src="./SaleRptDtlBill.ts">

</script>

<style lang="scss">
  .sale-rpt-dtl-bill {
    .table-style {
      margin-top: 50px;
    }
    .qf-table-footer-wrapper {
      position: absolute;
      top: -45px;
    }
  }
</style>
