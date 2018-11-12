<template>
  <div class="sell-rpt-list-supplier">
    <list-container>
      <template slot="search">
        <div class="search-style">
          <qf-row class="query-line">
            <qf-col :span="12">
              <qf-form-item label="供应商：">
                <qf-input placeholder="供应商编号/名称等" v-model="supplierKeyword" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="12" class="closed-action">
              <qf-button type="primary" @click="onSearch">查询</qf-button>
              <qf-checkbox class="check" v-model="zeroSell" @change="zeroChcek">不显示零进货供应商</qf-checkbox>
            </qf-col>
          </qf-row>
        </div>
      </template>
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
          <qf-table-column label="供应商编号" prop="supplier.code" align="left"/>
          <qf-table-column label="供应商名称" prop="supplier.name" align="left"/>
          <qf-table-column label="进货笔数" prop="purchaseCount" align="right" sortable/>
          <qf-table-column
            v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
            label="进货额(去税)"
            prop="taxExcPurchaseAmount"
            align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcPurchaseAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货额(含税)" prop="purchaseAmount"
                           align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.purchaseAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="退货笔数" align="right" prop="returnCount" sortable>
          </qf-table-column>
          <qf-table-column label="退货额(去税)"
                           v-if="merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
                           prop="taxExcReturnAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcReturnAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="退货额(含税)" prop="returnAmount" align="right" sortable>
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
    </list-container>

  </div>
</template>

<script lang="ts" src="./sellRptListSupplier.ts">

</script>

<style lang="scss">
  .sell-rpt-list-supplier {

    .search-style {
      padding: 0px 25px 24px 25px;
    }

    .closed-action {
      padding-left: 12px;
    }

    .check {
      padding-left: 10px;
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
