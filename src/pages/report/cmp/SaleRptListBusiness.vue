<template>
  <div class="sale-rpt-list-business">
    <qf-list-container>
      <template slot="search">
        <div class="search-style">
          <qf-row class="query-line">
            <qf-col :span="12">
              <qf-form-item label="来源">
                <qf-select v-model="sourceSelect">
                  <qf-option value="" label="全部">全部</qf-option>
                  <qf-option value="new" label="新建">新建</qf-option>
                  <qf-option value="mall" label="商城">商城</qf-option>
                  <qf-option value="car" label="车销">车销</qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="12" class="closed-action">
              <qf-button type="primary" @click="onSearch">查询</qf-button>
              <!--<qf-checkbox v-model="saleDateFlag" class="check">不显示无销售业务日期</qf-checkbox>-->
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
              <qf-button type="link" @click="onCheck(props.row)">查看</qf-button>
            </template>
          </qf-table-column>
          <qf-table-column label="业务日期" prop="businessDate" align="left" :formatter="formatter"/>
          <qf-table-column label="销售笔数" prop="saleCount" align="right" sortable/>
          <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputReportOnlyTax"
                           label="销售合计(去税)" prop="taxExcSaleAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcSaleAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="销售合计(含税)" prop="saleAmount" align="right" sortable>
            <template slot-scope="props">
              <div>{{props.row.saleAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="销售退货笔数" prop="returnCount" align="right" sortable/>
          <qf-table-column v-if="merchantConfig.enableOutputTaxRateSupport && !merchantConfig.outputReportOnlyTax"
                           label="退货合计(去税)" align="right" prop="taxExcReturnAmount" sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcReturnAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="退货合计(含税)" align="right" prop="returnAmount" sortable>
            <template slot-scope="props">
              <div>{{props.row.returnAmount | fmt}}</div>
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

<script lang="ts" src="./SaleRptListBusiness.ts">

</script>

<style lang="scss">
  .sale-rpt-list-business {
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
