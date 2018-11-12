<template>
  <div class="sell-rpt-list-sku">
    <!--搜索栏-->
    <list-container>
      <template slot="search">
        <div class="search-style">
          <qf-row v-if="!opened" class="query-line">
            <qf-col :span="12">
              <qf-form-item label="商品：">
                <qf-input placeholder="商品条码/名称/自编码等" v-model="skuKeyword" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8" class="closed-action">
              <qf-button type="primary" @click="onSearch">查询</qf-button>
              <qf-button @click="onToggle" trigger="ic-ic_xiangxia" type="link">展开</qf-button>
            </qf-col>
          </qf-row>
          <qf-row class="query-line" v-if="opened">
            <qf-col :span="8">
              <qf-form-item label="商品">
                <qf-input placeholder="商品条码/名称/自编码等" v-model="skuKeyword" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="类别">
                <qf-select v-model="skuCategory">
                  <qf-option value="" label="全部">全部</qf-option>
                  <qf-option
                    v-for="type in skuCategories"
                    :key="type.code"
                    :label="type.name"
                    :value="type.id">
                  </qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="4">

            </qf-col>
          </qf-row>
          <qf-row class="query-line" v-if="opened">
            <qf-col :span="10">
              <slot name="openedQuery"></slot>
            </qf-col>
            <qf-col :span="14">
              <div class="opened-action">
                <qf-checkbox class="check" v-model="zeroSell">不显示零进货商品</qf-checkbox>
                <qf-button type="primary" @click="onSearch">查询</qf-button>
                <qf-button @click="onReset">重置</qf-button>
                <qf-button @click="onToggle" trigger="ic-ic_xiangshang" type="link">收起</qf-button>
              </div>
            </qf-col>
          </qf-row>
        </div>
      </template>
      <template slot="list">
        <!--表格栏-->
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
          <qf-table-column label="商品名称" align="left">
            <template slot-scope="props">
              <div class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</div>
              <div>{{props.row.sku.barcode}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="规格" prop="sku.spec" align="left"/>
          <qf-table-column label="单位" prop="sku.munit" align="left" width="50px"/>
          <qf-table-column label="类别" prop="sku.category.name" align="left"/>
          <qf-table-column label="进货量" prop="qty" align="right" sortable/>
          <qf-table-column
            v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
            label="进货额(去税)"
            prop="taxExcAmount"
            align="right"
            sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcAmount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货额(含税)"
                           prop="amount" align="right"
                           sortable>
            <template slot-scope="props">
              <div>{{props.row.amount | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column
            v-if="hasPermission('price.refPurchasePrice') && merchantConfig.enableInputTaxRateSupport && !merchantConfig.inputReportOnlyTax"
            label="进货均价(去税)"
            prop="taxExcAvgPrice"
            align="right"
            sortable>
            <template slot-scope="props">
              <div>{{props.row.taxExcAvgPrice | fmt}}</div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.refPurchasePrice')" label="进货均价(含税)" prop="avgPrice" align="right"
                           sortable>
            <template slot-scope="props">
              <div>{{props.row.avgPrice | fmt}}</div>
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
    <!--分页栏-->
  </div>
</template>

<script lang="ts" src="./SellRptListSku.ts">

</script>

<style lang="scss">
  @import '~styles/var.scss';

  .sell-rpt-list-sku {

    .search-style {
      padding: 0px 25px 24px 25px;
    }

    .closed-action {
      padding-left: 12px;
    }

    .opened-action {
      float: right;
      margin-top: 10px;
    }

    .check {
      margin-right: 10px;
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
