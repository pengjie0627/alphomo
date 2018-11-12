<template>
  <qf-page-body class="rpt-sale-sku-dtl" :menu="menu">
    <template slot="tip">
      <div><a @click="goBack()" class="sale-rpt">销售报表</a>/{{type === 'SKU' ? '商品详情' : (type === 'GUEST' ? '客户详情' : '单据流水')}}</div>
    </template>
    <div slot="actions">
      <qf-button @click="onExport()" v-if="hasPermission('report.sale.export')">导出</qf-button>
    </div>
    <div class="wrap">
      <div class="sub-header">
        <qf-row class="border-bottom">
          <qf-col :span="5">
            <div>
              <div class="common-over title-weight">{{titleName}}</div>
              <div class="common-over">{{titleCode}}</div>
            </div>
          </qf-col>
          <qf-col :span="4">
            <div class="label-style">仓库：{{this.warehouse}}</div>
          </qf-col>
          <qf-col :span="8" v-if="type !== 'BUSINESS'">
            <qf-form-item label="业务日期" required>
              <qf-date-picker :clearable="false"
                v-model="businessDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </qf-date-picker>
            </qf-form-item>
          </qf-col>
          <qf-col :span="7" v-if="type !== 'BUSINESS'">
            <qf-form-item label="统计维度" required>
              <qf-select v-model="totalType" v-if="type === 'GUEST'">
                <qf-option value="business" label="按业务统计">按业务统计</qf-option>
                <qf-option value="sku" label="按商品统计">按商品统计</qf-option>
              </qf-select>
              <qf-select v-model="totalType" v-if="type === 'SKU'">
                <qf-option value="business" label="按业务统计">按业务统计</qf-option>
                <qf-option value="guest" label="按客户统计">按客户统计</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <!--<qf-row class="total-type-ls-1024 common-row" v-if="type !== 'BUSINESS'">-->
        <!--<qf-form-item label="统计维度" required class="width-style">-->
        <!--<qf-select v-model="totalType" v-if="type === 'GUEST'">-->
        <!--<qf-option value="business" label="按业务统计">按业务统计</qf-option>-->
        <!--<qf-option value="sku" label="按商品统计">按商品统计</qf-option>-->
        <!--</qf-select>-->
        <!--<qf-select v-model="totalType" v-if="type === 'SKU'">-->
        <!--<qf-option value="business" label="按业务统计">按业务统计</qf-option>-->
        <!--<qf-option value="guest" label="按客户统计">按客户统计</qf-option>-->
        <!--</qf-select>-->
        <!--</qf-form-item>-->
        <!--</qf-row>-->
      </div>
      <div class="search">
        <qf-row v-if="type !== 'BUSINESS'">
          <qf-col :span="8">
            <qf-form-item labelWidth="0px">
              <qf-input :placeholder="type === 'SKU' ? (totalType === 'business'? '单据编号' : '客户名称') : (totalType === 'business' ? '单据编号' : '商品名称')" v-model="skuOrGuestInfo"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-button type="primary" @click="onSearch()">查询</qf-button>
          </qf-col>
        </qf-row>
        <qf-row v-if="type === 'BUSINESS'">
          <qf-col :span="5">
            <qf-form-item label="单据：" labelWidth="50px">
              <qf-input placeholder="单据" v-model="skuOrGuestInfo"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="1"></qf-col>
          <qf-col :span="6">
            <qf-form-item label="业务类型：" labelWidth="70px">
              <qf-select v-model="businessType">
                <qf-option value="" label="">全部</qf-option>
                <qf-option value="Sale" label="销售">销售</qf-option>
                <qf-option value="SaleReturn" label="销售退货">销售退货</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="1"></qf-col>
          <qf-col :span="5">
            <qf-form-item label="来源：" labelWidth="50px">
              <qf-select v-model="source">
                <qf-option value="" label="全部">全部</qf-option>
                <qf-option value="new" label="新建">新建</qf-option>
                <qf-option value="mall" label="商城">商城</qf-option>
                <qf-option value="car" label="车销">车销</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="5">
            <qf-button type="primary" @click="onSearch()">查询</qf-button>
            <qf-button @click="onReset()">重置</qf-button>
          </qf-col>
        </qf-row>
      </div>
      <div class="table-style">
        <!--单据(商品-业务)(客户-业务)-->
        <sale-rpt-dtl-bill
          @exportEvent="exportEvent"
          :queryArr="queryArr"
          :exportFlag="exportFlag"
          :type="type"
          v-if="(type === 'SKU' && totalType === 'business') || (type === 'GUEST' && totalType === 'business')">

        </sale-rpt-dtl-bill>
        <!--客户(商品-客户)-->
        <sale-rpt-dtl-guest
          @exportEvent="exportEvent"
          :queryArr="queryArr"
          :exportFlag="exportFlag"
          v-if="type === 'SKU' && totalType === 'guest'">

        </sale-rpt-dtl-guest>
        <!--商品（客户-商品）-->
        <sale-rpt-dtl-sku
          @exportEvent="exportEvent"
          :queryArr="queryArr"
          :exportFlag="exportFlag"
          v-if="type === 'GUEST' && totalType === 'sku'">
        </sale-rpt-dtl-sku>
        <!--流水-->
        <sale-rpt-dtl-water
          @exportEvent="exportEvent"
          :queryArr="queryArr"
          :exportFlag="exportFlag"
          v-if="type === 'BUSINESS'">
        </sale-rpt-dtl-water>
      </div>
    </div>
  </qf-page-body>
</template>

<script lang="ts" src="./RptSaleSkuDtl.ts">
</script>

<style lang="scss">
  .rpt-sale-sku-dtl {
    .sale-rpt {
      color: #40C2EB;
      text-decoration: none;
      cursor: pointer;
    }
    .wrap {
      background: white;
    }
    .sub-header {
      margin: 0 20px;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
      .common-over {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .title-weight {
        font-size: 20px;
      }
    }
    .common-row {
      margin-top: 10px;
      .width-style {
        width: 400px;
      }
    }
    .total-type-mt-1024 {
      @at-root & {
        @media all and (min-width: 1520px) {
          & {
            display: block;
          }
        }
        @media all and (max-width: 1520px) {
          & {
            display: none;
          }
        }
      }
      label {
        text-align: right;
        padding-right: 10px;
      }
    }
    .total-type-ls-1024 {
      @at-root & {
        @media all and (max-width: 1520px) {
          & {
            display: block;
          }
        }
        @media all and (min-width: 1520px) {
          & {
            display: none;
          }
        }
      }
    }
    .search {
      padding: 24px;
      button {
        margin-left: 10px;
      }
    }
    .table-style {
      padding: 20px;
      margin-top: 30px;
    }
    .page {
      padding-top: 20px;
    }
    .qf-form-item .qf-form-label {
      text-align: right;
      padding-right: 10px;
      white-space: nowrap;
    }
    .qf-date-editor--daterange.qf-input__inner {
      width: 100%;
    }
    .label-style {
      line-height: 36px;
      vertical-align: middle;
      text-align: right;
      margin-right: 40px;
      color: #909399;
    }
  }
</style>
