<template>
  <div class="sale-rpt-list-guest">
    <qf-list-container>
      <template slot="search">
        <div class="search-style">
          <qf-row class="query-line">
            <qf-col :span="12">
              <qf-form-item label="客户">
                <qf-input ref="guestRef" placeholder="客户编号/名称等" v-model="guest" :maxlength='32' @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="12" class="closed-action">
              <qf-button type="primary" @click="onSearch">查询</qf-button>
              <qf-checkbox v-model="saleGuest" class="check">不显示零销售量客户</qf-checkbox>

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
              <qf-button type="link" @click="onCheck(props.row)" v-if="hasPermission('report.sale.view')">查看</qf-button>
            </template>
          </qf-table-column>
          <qf-table-column label="客户编号" prop="customer.code" align="left"/>
          <qf-table-column label="客户名称" prop="customer.name" align="left"/>
          <qf-table-column label="销售笔数" prop="saleCount" align="right" sortable/>
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
          <qf-table-column label="客单价(含税)" align="right" prop="perCustomerPrice" sortable>
            <template slot-scope="props">
              <div>{{props.row.perCustomerPrice | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column
            v-if="hasPermission('price.costPrice') &&merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputReportOnlyTax"
            label="毛利额(去税)" prop="taxExcGrossAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcGrossAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.costPrice')" label="毛利额(含税)" prop="grossAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.grossAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <!--<qf-table-column label="销售占比(元)" prop="saleRate" align="right" sortable>-->
            <!--<template slot-scope="props">-->
              <!--<div>{{props.row.saleRate | fmt}}</div>-->
            <!--</template>-->
          <!--</qf-table-column>-->
        </qf-table>
      </template>
      <template slot="pagination">
        <qf-pagination :total='totalItem'
                       v-model="start"
                       :page-size='10'
                       @change="onChange"></qf-pagination>
      </template>
    </qf-list-container>

  </div>
</template>

<script lang="ts" src="./SaleRptListGuest.ts">

</script>

<style lang="scss">
  .sale-rpt-list-guest{
    .search-style{
      padding: 0px 25px 24px 25px;
    }
    .closed-action{
      padding-left: 12px;
    }
    .check{
      padding-left: 10px;
    }
    .table-style {
      margin-top: 50px;
    }
    .qf-table-footer-wrapper{
      position: absolute;
      top: -45px;
    }
  }
</style>
