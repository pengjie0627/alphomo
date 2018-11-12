<template>
  <page-body class="sale-return-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_ic-add" type="primary" @click="doGoCreate" v-if="hasPermissions('sale.saleReturn.create')"> 新建退货单
      </qf-button>
      <qf-button type="default" @click="doImport" v-if="hasPermissions('sale.saleReturn.import')">导入退货单</qf-button>
    </div>

    <!-- 列表页面模板 -->
    <list-container>

      <!-- 搜索栏 -->
      <sale-return-list-search slot="search" @setFilters="onSetFilter"
                               @resetFilters="onSetFilter"></sale-return-list-search>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button v-if="hasPermissions('sale.saleReturn.audit')" type="default" @click="doAudit"
                   :disabled="!(selectedData && selectedData.length)">审核
        </qf-button>
        <qf-button v-if="hasPermissions('sale.saleReturn.delete')" type="default" @click="doDelete"
                   :disabled="!(selectedData && selectedData.length)">删除
        </qf-button>
        <qf-button v-if="hasPermissions('sale.saleReturn.abolish')" type="default" @click="doAbolish"
                   :disabled="!(selectedData && selectedData.length)">作废
        </qf-button>
        <qf-button v-if="hasPermissions('sale.saleReturn.export')" type="primary" @click="doExport">导出全部</qf-button>
        <print-view :id="id" type="SaleReturn" btnType="default" :disabled="!(selectedData && selectedData.length)"
                    v-if="hasPermissions('sale.saleReturn.print')"></print-view>
      </div>

      <!-- 数据列表 -->
      <sale-return-list-table slot="list" :query="query" :ids="ids" :data="tableData" @setSorters="onSortChange"
                              @selectData="onSelectionChange" @getList="doSearch"></sale-return-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./SaleReturnList.ts"/>

<style lang="scss">
  @import '~styles/var.scss';

  .sale-return-list {
    background: $--color-bg;
  }
</style>
