<template>
  <page-body class="sale-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="primary" @click="doGoCreate" v-if="hasPermissions('sale.sale.create')">新建销售单</qf-button>
      <qf-button icon="ic_icon-add" type="default" @click="doImport" v-if="hasPermissions('sale.sale.import')">导入销售单</qf-button>
    </div>

    <!-- 列表页面模板 -->
    <list-container>

      <!-- 搜索栏 -->
      <sale-list-search slot="search" @setFilters="onSetFilter" @resetFilters="onSetFilter"></sale-list-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button v-if="hasPermissions('sale.sale.audit')" type="default" @click="doAudit" :disabled="!(selectedData && selectedData.length)">审核</qf-button>
        <qf-button v-if="hasPermissions('sale.sale.delete')" type="default" @click="doDelete" :disabled="!(selectedData && selectedData.length)">删除</qf-button>
        <qf-button v-if="hasPermissions('sale.sale.abolish')" type="default" @click="doAbolish" :disabled="!(selectedData && selectedData.length)">作废</qf-button>
        <qf-button v-if="hasPermissions('sale.sale.export')" type="primary" @click="doExport">导出全部</qf-button>
        <print-view :id="id" type="Sale" btnType="default" :disabled="!(selectedData && selectedData.length)"
                    v-if="hasPermissions('sale.sale.print')"></print-view>
      </div>

      <!-- 数据列表 -->
      <sale-list-table slot="list" :query="query" :ids="ids" :data="tableData" @setSorters="onSortChange"
                       @selectData="onSelectionChange" @getList="doSearch"></sale-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./SaleList.ts"/>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-list {
    background: $--color-bg;
  }
</style>
