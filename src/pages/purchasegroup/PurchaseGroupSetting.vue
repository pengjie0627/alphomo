<template>
  <page-body class="purchase-group-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="default" @click="doImport">导入采购组</qf-button>
    </div>

    <!-- 列表页面模板 -->
    <list-container>
      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doExport">导出全部</qf-button>
        <qf-button type="default" @click="doDelete" :disabled="!(selectedData && selectedData.length)">删除</qf-button>
      </div>

      <!-- 数据列表 -->
      <purchase-group-list-table slot="list" :query="query" :ids="ids" :data="tableData"
                       @selectData="onSelectionChange" @getList="doSearch"></purchase-group-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./PurchaseGroupSetting.ts"/>

<style lang="scss">
  @import '~styles/var.scss';

  .purchase-group-list {
    background: $--color-bg;
  }
</style>
