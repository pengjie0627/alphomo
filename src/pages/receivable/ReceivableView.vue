<template>
  <page-body class="receivable-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="default" @click="doImport" v-if="hasPermissions('finance.receivable.export')">导出
      </qf-button>
      <qf-button icon="ic_icon-add" type="primary" @click="doGoCreate" v-if="hasPermissions('finance.receivable.create')">新建收款单
      </qf-button>
    </div>
    <!-- 列表页面模板 -->
    <receivable-container>
      <!-- 汇总 -->
      <div slot="summary">
        <receivable-summary :customer="customer" :customerName="customerName"></receivable-summary>
      </div>
      <div slot="tab">
        <qf-tabs v-model="selectName">
          <qf-tab-pane class="sku-tab" label="收款记录" name="first"></qf-tab-pane>
          <qf-tab-pane class="sku-tab" label="业务对账" name="second"></qf-tab-pane>
        </qf-tabs>
      </div>
      <!-- 搜索栏 -->
      <receivable-record-search slot="search" @setFilters="onSetFilter" @resetFilters="onSetFilter"
                                v-if="selectName=='first'"></receivable-record-search>
      <business-record-search slot="search" @setFilters="onSetFilter" @resetFilters="onSetFilter"
                              v-if="selectName=='second'"></business-record-search>
      <!--数据汇总-->
      <table slot="total" width="100%" v-if="selectName=='first'">
        <tr>
          <td width="70">合计</td>
          <td colspan="5"></td>
          <td width="12%">{{discountAmount | fmtThumb}}</td>
          <td width="12%"><span class="fail">{{totalPaidAmount | fmtThumb}}</span></td>
        </tr>
      </table>
      <!--数据汇总-->
      <table slot="total" width="100%" v-if="selectName=='second'">
        <tr>
          <td width="70">合计</td>
          <td colspan="6"></td>
          <td width="11%">{{amount | fmtThumb}}</td>
          <td width="11%"><span class="fail">{{receivedAmount | fmtThumb}}</span></td>
          <td width="10%"></td>
        </tr>

      </table>
      <!-- 数据列表 -->

      <receivable-record-table slot="list" :data="tableDataRecord" :ids="ids" :query="query" :customer="customerName"
                               v-if="selectName=='first'" @getList="doSearch"
                               @setSorters="onSortChange"></receivable-record-table>
      <business-record-table slot="list" :data="tableDataBusiness" v-if="selectName=='second'"
                             @setSorters="onSortChange"></business-record-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </receivable-container>
  </page-body>
</template>
<script lang="ts" src="./ReceivableView.ts"/>
