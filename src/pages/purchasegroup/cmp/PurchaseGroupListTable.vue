<template>
  <!-- 数据列表 -->
  <qf-table class="shop-list-table" :data="data"
            @selection-change="doSelectionChange"
            ref="table" row-key="id">
    <qf-table-column type="selection" align="center"/>
    <qf-table-column label="采购组" prop="value"></qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./PurchaseGroupListTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';
</style>
