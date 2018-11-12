<template>
  <qf-page-body class="sale-rpt-list-view">
    <div slot="actions">
      <qf-button @click="onExport()" v-if="hasPermission('report.sale.export')">导出</qf-button>
    </div>
    <!--业务日期栏-->
    <qf-row class="common-style date-style">
      <qf-col :span="24">
        <qf-form-item label="业务日期">
          <qf-date-picker v-model="businessDate"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="daterange"
                          :disabled="businessTime === '全部'"
                          range-separator="~"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"></qf-date-picker>
          <qf-radio-group v-model="businessTime" class="radio-style">
            <qf-radio-button label="今天"></qf-radio-button>
            <qf-radio-button label="昨天"></qf-radio-button>
            <qf-radio-button label="最近7天"></qf-radio-button>
            <qf-radio-button label="最近1个月"></qf-radio-button>
            <qf-radio-button label="全部"></qf-radio-button>
          </qf-radio-group>
        </qf-form-item>
      </qf-col>
    </qf-row>
    <!--汇总栏-->
    <qf-row class="common-style total-border">
      <qf-col :span="5">
        <div class="total-style sale-border-right">
          <div>销售总额(去税)</div>
          <div class="sale-amount">￥{{sale.taxExcSaleTotal.toString() | fmtThumb}}</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style sale-border-right">
          <div>销售总额(含税)</div>
          <div class="sale-amount">￥{{sale.saleTotal.toString() | fmtThumb}}</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style">
          <div>销售笔数</div>
          <div class="sale-common-color">{{sale.saleCount | fmt('0')}}</div>
        </div>
      </qf-col>
      <qf-col :span="5" >
        <div class="total-style">
          <div>销售毛利额(去税)</div>
          <div class="sale-common-color" v-if="hasPermission('price.costPrice')">￥{{sale.taxExcSaleAmount.toString() | fmtThumb}}</div>
          <div class="sale-common-color" v-else>*****</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style">
          <div>销售毛利额(含税)</div>
          <div class="sale-common-color" v-if="hasPermission('price.costPrice')">￥{{sale.saleAmount.toString() | fmtThumb}}</div>
          <div class="sale-common-color" v-else>*****</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style">
          <div>销售毛利率</div>
          <div class="sale-common-color" v-if="hasPermission('price.costPrice')">{{sale.saleRate*100 | fmt('0.00')}}%</div>
          <div class="sale-common-color" v-else>*****</div>
        </div>
      </qf-col>
      <!--<qf-col :span="4">-->
        <!--<div class="total-style">-->
          <!--<div>销售额最高商品</div>-->
          <!--<div class="sale-common-color">{{sale.saleMostSku}}</div>-->
        <!--</div>-->
      <!--</qf-col>-->
    </qf-row>
    <!--统计栏-->
    <qf-row class="type-padding">
      <qf-col :span="16">
        <!--<qf-tabs v-model="selectName" type="card">-->
        <!--<qf-tab-pane label="按商品统计" name="first"></qf-tab-pane>-->
        <!--<qf-tab-pane label="按客户统计" name="second"></qf-tab-pane>-->
        <!--<qf-tab-pane label="按业务统计" name="third"></qf-tab-pane>-->
        <!--</qf-tabs>-->
        <qf-radio-group v-model="selectName">
          <qf-radio-button label="按商品统计"></qf-radio-button>
          <qf-radio-button label="按客户统计"></qf-radio-button>
          <qf-radio-button label="按业务统计"></qf-radio-button>
        </qf-radio-group>
      </qf-col>
      <qf-col :span="8">
          <qf-form-item label="仓库">
            <qf-select v-model="warehouseId">
              <qf-option value="" label="全部">全部</qf-option>
              <qf-option
                v-for="type in warehouses"
                :key="type.id"
                :label="type.name"
                :value="type.id">
              </qf-option>
            </qf-select>
          </qf-form-item>
      </qf-col>
    </qf-row>
    <!--搜索栏-->
    <sale-rpt-list-sku ref="query"
      @exportEvent="exportEvent"
      v-if="selectName === '按商品统计'"
      :flag="flag"
      :businessDate="businessDate"
      :exportFlag="exportFlag"
      :warehouse="warehouse">
    </sale-rpt-list-sku>
    <sale-rpt-list-guest
      @exportEvent="exportEvent"
      v-if="selectName === '按客户统计'"
      :flag="flag"
      :businessDate="businessDate"
      :exportFlag="exportFlag"
      :warehouse="warehouse">
    </sale-rpt-list-guest>
    <sale-rpt-list-business
      @exportEvent="exportEvent"
      v-if="selectName === '按业务统计'"
      :flag="flag"
      :businessDate="businessDate"
      :exportFlag="exportFlag"
      :warehouse="warehouse">
    </sale-rpt-list-business>
  </qf-page-body>
</template>

<script lang="ts" src="./SaleRptList.ts">

</script>

<style lang="scss">
  .sale-rpt-list-view {

    .common-style {
      padding: 0 25px;
      background-color: white;
    }
    .date-style {
      padding-bottom: 15px;
      padding-top: 15px;
      border-bottom: 1px solid #eeeeee;
      .radio-style {
        position: relative;
        top: -6px;
        margin-left: 30px;
      }
    }
    .sale-border-right {
      border-right: 1px solid #ccc;
    }
    .total-style {
      margin: 20px;
      margin-left: 0;
      color: #999999;
      .sale-amount {
        color: #FF554B;
        font-weight: bold;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .sale-common-color {
        color: black;
        font-weight: bold;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .total-border {
      border-bottom: 1px solid #eeeeee;
    }
    .total-fir-style {
      border-right: 1px solid #eeeeee;
    }
    .type-padding {
      padding: 24px 20px;
      padding-bottom: 0;
      margin-bottom: 0;
      background-color: white;
      padding-left: 20px;
    }
  }
</style>
