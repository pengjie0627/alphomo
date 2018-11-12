<template>
  <qf-page-body :menu="menu" class="rpt-sell-sku-dtl">
    <div slot="actions">
      <qf-button @click="onExport()" v-if="hasPermission('report.purchase.export')">导出</qf-button>
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
          <qf-col :span="5">
            <div class="label-style">仓库：{{this.warehouse}}</div>
          </qf-col>
          <qf-col :span="9" v-if="type !== 'BUSINESS'">
            <qf-form-item label="业务日期" required>
              <qf-date-picker
                v-model="businessDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </qf-date-picker>
            </qf-form-item>
          </qf-col>
          <qf-col :span="5" v-if="type !== 'BUSINESS'">
            <qf-form-item label="统计维度" required>
              <qf-select v-model="totalType" v-if="type === 'SUPPLIER'" @change="changeSelect">
                <qf-option value="business" label="按业务统计">按业务统计</qf-option>
                <qf-option value="sku" label="按供应商统计">按供应商统计</qf-option>
              </qf-select>
              <qf-select v-model="totalType" v-if="type === 'SKU'" @change="changeSelect">
                <qf-option value="business" label="按业务统计">按业务统计</qf-option>
                <qf-option value="supplier" label="按供应商统计">按供应商统计</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
        </qf-row>
      </div>
      <div class="search">
        <qf-row v-if="type !== 'BUSINESS' && totalType==='business'">
          <qf-col :span="8">
            <qf-form-item labelWidth="0px">
              <qf-input placeholder="单据编号" v-model="billNum"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-button type="primary" @click="onSearch">查询</qf-button>
          </qf-col>
        </qf-row>
        <qf-row v-if="type === 'SKU' && totalType==='supplier'">
          <qf-col :span="8">
            <qf-form-item labelWidth="0px">
              <qf-input placeholder="供应商名称" v-model="supplierName"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-button type="primary" @click="onSearch">查询</qf-button>
          </qf-col>
        </qf-row>
        <qf-row v-if="type === 'SUPPLIER' && totalType==='sku'">
          <qf-col :span="8">
            <qf-form-item labelWidth="0px">
              <qf-input placeholder="商品名称" v-model="skuName"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-button type="primary" @click="onSearch">查询</qf-button>
          </qf-col>
        </qf-row>
        <qf-row v-if="type === 'BUSINESS'">
          <qf-col :span="5">
            <qf-form-item label="单据：" labelWidth="70px">
              <qf-input placeholder="单据" v-model="billNum"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="1"></qf-col>
          <qf-col :span="6">
            <qf-form-item label="业务类型：" labelWidth="90px">
              <qf-select v-model="billType">
                <qf-option value="" label="">全部</qf-option>
                <qf-option value="Purchase" label="进货">进货</qf-option>
                <qf-option value="PurchaseReturn" label="进货退货">进货退货</qf-option>
              </qf-select>
            </qf-form-item>
          </qf-col>
          <qf-col :span="5">
            <qf-button type="primary" @click="onSearch">查询</qf-button>
            <qf-button @click="onReset">重置</qf-button>
          </qf-col>
        </qf-row>
      </div>
      <div class="table-style">
        <sell-rpt-dtl-sku v-if="type === 'SUPPLIER' && totalType === 'sku'" slot="list" :summary="summary" :data="tableData"
                          @setSorters="onSortChange"></sell-rpt-dtl-sku>
        <sell-rpt-dtl-supplier v-if="type === 'SKU' && totalType === 'supplier'" slot="list" :summary="summary" :data="tableData"
                               @setSorters="onSortChange"></sell-rpt-dtl-supplier>
        <sell-rpt-dtl-business v-if="type === 'BUSINESS' || (totalType === 'business' && type !== 'BUSINESS') " slot="list" :summary="summary" :data="tableData"
                               @setSorters="onSortChange"></sell-rpt-dtl-business>

        <!-- 翻页 -->
        <div class="page">
          <qf-pagination slot="pagination" :total="totalItem" :page-size="pageSize"
                         v-model="start" @change="onPageChange"></qf-pagination>
        </div>
      </div>

    </div>
  </qf-page-body>
</template>

<script lang="ts" src="./RptSellSkuDtl.ts">

</script>

<style lang="scss">
  .rpt-sell-sku-dtl {
    .sell-rpt {
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
      padding: 24px 20px;
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

