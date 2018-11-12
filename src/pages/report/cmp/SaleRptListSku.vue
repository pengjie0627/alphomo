<template>
  <div class="sale-rpt-list-sku">
    <!--搜索栏-->
    <qf-list-container>
      <template slot="search">
        <div class="search-style">
          <qf-row v-if="!opened" class="query-line">
            <qf-col :span="12">
              <qf-form-item label="商品">
                <qf-input v-model="sku" ref="skuRef" placeholder="商品条码/名称/自编码等"
                          :maxlength="64" @keydown.native.enter="doEnterSearch()"></qf-input>
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
                <qf-input v-model="sku" ref="skuExpendRef" placeholder="商品条码/名称/自编码等"
                          :maxlength="64" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="类别">
                <qf-select placeholder="请选择" v-model="selectCatogory">
                  <qf-option value="" label="">全部</qf-option>
                  <qf-option v-for="(item, index) in catogoryList" :key="index" :value="item.id"
                             :label="item.name">
                    {{item.name}}
                  </qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="所属供应商">
                <search display-field="name" :value="searchObj" type="supplier"
                        @select="setSupplier($event)" placeholder="请输入名称或编码查询"
                        @clear="onSupplierClear">
                </search>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row class="query-line marginTop20" v-if="opened">
            <qf-col :span="8">
              <qf-form-item label="税收分类">
                <qf-input v-model="taxClassification" ref="taxClassificationRef" placeholder="税收分类编码"
                          :maxlength="19" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="2">
              <slot name="openedQuery"></slot>
            </qf-col>
            <qf-col :span="14">
              <div class="opened-action">
                <qf-checkbox class="check" v-model="zeroSale">不显示零销售量商品</qf-checkbox>
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
          <qf-table-column label="序号" type="index" align="center" width="50px"/>
          <qf-table-column label="操作" align="center" width="50px">
            <template slot-scope="props">
              <qf-button type="link" @click="onCheck(props.row)"
                         v-if="hasPermission('report.sale.view')">查看
              </qf-button>
            </template>
          </qf-table-column>
          <qf-table-column label="名称规格" align="left" minWidth="180px">
            <template slot-scope="props">
              <div class="sku-no-wrap">{{props.row.sku.name}} ( {{props.row.sku.munit}} ) {{props.row.sku.spec}}</div>
              <div>{{props.row.sku.barcode}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="单位" prop="sku.munit" align="left" width="50px"/>
          <qf-table-column label="类别" prop="sku.category.name" align="left"/>
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
      </template>
      <template slot="pagination">
        <qf-pagination :total='totalItem'
                       v-model="start"
                       :page-size='10'
                       @change="onChange"></qf-pagination>
      </template>
    </qf-list-container>
    <!--分页栏-->
  </div>
</template>

<script lang="ts" src="./SaleRptListSku.ts">

</script>

<style lang="scss">
  .sale-rpt-list-sku {
    .search-style {
      padding: 0px 25px 24px 25px;
    }
    .sku-no-wrap {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    .marginTop20{
      margin-top:20px;
    }
  }
</style>
