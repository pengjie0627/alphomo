<template>
  <page-body class="purchase-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="primary" @click="doGoCreate" v-if="hasPermissions('purchase.purchase.create')">新建进货单
      </qf-button>
      <qf-button icon="ic_icon-add" type="default" @click="doImport" v-if="hasPermissions('purchase.purchase.import')">导入进货单
      </qf-button>
    </div>

    <!-- 列表页面模板 -->
    <list-container>

      <!-- 搜索栏 -->
      <purchase-list-search slot="search" @setFilters="onSetFilter" @resetFilters="onSetFilter"></purchase-list-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="default" @click="doAudit" :disabled="!(selectedData && selectedData.length)"
                   v-if="hasPermissions('purchase.purchase.audit')">审核
        </qf-button>
        <qf-button type="default" @click="doDelete" :disabled="!(selectedData && selectedData.length)"
                   v-if="hasPermissions('purchase.purchase.delete')">删除
        </qf-button>
        <qf-button type="default" @click="doAbolish" :disabled="!(selectedData && selectedData.length)"
                   v-if="hasPermissions('purchase.purchase.abolish')">作废
        </qf-button>
        <qf-button type="primary" @click="doExport" v-if="hasPermissions('purchase.purchase.export')">导出全部</qf-button>
      </div>

      <!-- 数据列表 -->
      <purchase-list-table slot="list" :query="query" :ids="ids" :data="tableData" @setSorters="onSortChange"
                           @getList="doSearch"
                           @selectData="onSelectionChange"></purchase-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./PurchaseList.ts"/>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-list {
    background: $--color-bg;
  }
</style>
