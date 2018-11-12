<template>
  <page-body class="sell-rpt-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="default" @click="onExport()" v-if="hasPermission('report.purchase.export')">导出
      </qf-button>
    </div>

    <!-- 列表页面模板 -->
    <qf-row class="common-style date-style">
      <qf-col :span="24">
        <qf-form-item label="业务日期">
          <qf-date-picker v-model="businessDate" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="~"
                          start-placeholder="开始日期" end-placeholder="结束日期"></qf-date-picker>
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
        <div class="total-style sell-border-right">
          <div>进货总额(去税)</div>
          <div class="sell-amount" v-if="hasPermission('price.refPurchasePrice')">￥{{taxExcSellTotal}}</div>
          <div class="sell-amount" v-else>*****</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style sell-border-right">
          <div>进货总额(含税)</div>
          <div class="sell-amount" v-if="hasPermission('price.refPurchasePrice')">￥{{sellTotal}}</div>
          <div class="sell-amount" v-else>*****</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style">
          <div>进货笔数</div>
          <div class="sell-common-color">{{sellCount | fmt('0')}}</div>
        </div>
      </qf-col>
      <qf-col :span="4">
        <div class="total-style">
          <div>进货额最高商品</div>
          <div class="sell-common-color">{{maxAmountSku}}</div>
        </div>
      </qf-col>
    </qf-row>

    <!--统计栏-->
    <qf-row class="type-padding">
      <qf-col :span="16">
        <qf-radio-group v-model="selectName">
          <qf-radio-button label="按商品统计"></qf-radio-button>
          <qf-radio-button label="按供应商统计"></qf-radio-button>
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

    <!-- 搜索栏 -->
    <sell-rpt-list-sku v-if="selectName === '按商品统计'"
                       :date="businessDate"
                       ref="skuList" :warehouse="warehouse"></sell-rpt-list-sku>
    <sell-rpt-list-supplier v-if="selectName === '按供应商统计'" :date="businessDate"
                            ref="supplierList" :warehouse="warehouse"></sell-rpt-list-supplier>
    <sell-rpt-list-business v-if="selectName === '按业务统计'" :date="businessDate"
                            ref="businessList" :warehouse="warehouse" :warehouseId="warehouseId"></sell-rpt-list-business>

  </page-body>

</template>

<script lang="ts" src="./SellRptList.ts">

</script>

<style lang="scss">
  .sell-rpt-list {

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
    .sell-border-right {
      border-right: 1px solid #ccc;
    }
    .total-style {
      margin: 20px;
      margin-left: 0;
      color: #999999;
      .sell-amount {
        color: #FF554B;
        font-weight: bold;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .sell-common-color {
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
      padding: 15px 0;
      padding-bottom: 0;
      margin-bottom: 0;
      background-color: white;
      padding-left: 20px;
    }

  }
</style>
