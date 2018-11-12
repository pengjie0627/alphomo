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
    <list-container>
      <!-- 汇总 -->
      <div slot="summary">
        <receivable-summary></receivable-summary>
      </div>
      <!-- 搜索栏 -->
      <receivable-list-search slot="search" @setFilters="onSetFilter"
                              @resetFilters="onSetFilter"></receivable-list-search>
      <!--数据汇总-->
      <table slot="total" width="100%">
        <tr>
          <td width="70">合计</td>
          <td colspan="3"></td>
          <td width="12%">{{beginingAmount | fmtThumb}}</td>
          <td width="12%">{{inAmount | fmtThumb}}</td>
          <td width="12%">{{discountAmount | fmtThumb}}</td>
          <td width="12%">{{receivedAmount | fmtThumb}}</td>
          <td width="12%"><span class="fail">{{amount | fmtThumb}}</span></td>
        </tr>
      </table>
      <!-- 数据列表 -->
      <receivable-list-table slot="list" :data="tableData" @setSorters="onSortChange"
                             @selectData="onSelectionChange"></receivable-list-table>

      <!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./ReceivableList.ts"/>
