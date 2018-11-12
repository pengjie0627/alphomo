<template>
  <div class="sell-rpt-list-business">
    <qf-list-container>
      <template slot="list">
        <qf-table
          class="table-style"
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
              <qf-button type="link" @click="onCheck(props.row)" v-if="hasPermission('report.purchase.view')">查看
              </qf-button>
            </template>
          </qf-table-column>
          <qf-table-column label="业务日期" prop="businessDate" align="left"/>
          <qf-table-column label="进货笔数" prop="purchaseCount" align="right" sortable/>
          <qf-table-column
            v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
            label="进货合计(去税)" prop="taxExcPurchaseAmount"
            align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcPurchaseAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货合计(含税)" prop="purchaseAmount"
                           align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.purchaseAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="进货退货笔数" align="right" prop="returnCount" sortable>
          </qf-table-column>
          <qf-table-column label="退货合计(去税)"
                           v-if="merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
                           prop="returnAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.returnAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="退货合计(含税)" prop="returnAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.returnAmount | fmt}}</div>
            </template>
          </qf-table-column>
        </qf-table>
      </template>
      <template slot="pagination">
        <qf-pagination :total='totalItem'
                       v-model="start"
                       :page-size='pageSize'
                       @change="onChange"></qf-pagination>
      </template>
    </qf-list-container>

  </div>
</template>

<script lang="ts" src="./SellRptListBusiness.ts">

</script>

<style lang="scss">
  .sell-rpt-list-business {

    .qf-search-box {
      padding: 0px;
      margin: 0px;
    }
    .table-style {
      margin-top: 50px;
    }
    .qf-table-footer-wrapper {
      position: absolute;
      top: -45px;
    }

  }
</style>
