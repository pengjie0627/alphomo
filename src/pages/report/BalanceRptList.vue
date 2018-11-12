<template>
  <page-body class="balance-rpt-list-view" :menu="menu">
    <div slot="actions">
      <qf-button @click="doExport()" v-if="hasPermission('report.finance.export')">导出</qf-button>
    </div>

    <list-container>
      <!--业务日期栏-->
      <balance-rpt-search slot="search" @setFilters="onSetFilter" @resetFilters="onSetFilter"></balance-rpt-search>
      <!--数据汇总-->
      <balance-rpt-summary slot="total" :summary="summary"></balance-rpt-summary>
      <!-- 列表 -->
      <balance-rpt-table slot="list" :tableData="tableData" @toView="doGoDetail"></balance-rpt-table>
      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </list-container>
  </page-body>
</template>

<script lang="ts" src="./BalanceRptList.ts">

</script>

<style lang="scss">
  .balance-rpt-list-view {
    .qf-table-container {
      background: #ffffff;
      padding: 10px 20px;
      .qf-search-box {
        padding: 20px 0;
        border-bottom: 1px solid #dcdfe6;
      }

      .qf-summary {
        padding: 20px 0;
      }

      .pagination {
        padding: 25px 0;
      }
      .qf-form-content {
        padding-right: 5px;
      }
      .qf-form-label {
        text-align: right;
        padding-right: 5px;
      }
    }
    .qf-list-container .qf-search-box .query-condition{
      margin-bottom: 24px;
    }
  }
</style>
