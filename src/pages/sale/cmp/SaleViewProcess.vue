<template>
  <div class="sale-view-process">
    <div class="billInfo">
      <operate-log-view :logs="bill.operateLogs"></operate-log-view>
    </div>
    <div class="actions">
      <sale-view-button :bill="bill"></sale-view-button>
    </div>

  </div>

</template>
<script lang="ts" src="./SaleViewProcess.ts"/>
<style lang="scss">
  @import '~styles/var.scss';

  .sale-view-process {
    line-height: 36px;
    display: flex;
    billInfo {
      flex: 1
    }
    .actions {
      flex: 1;
      float: right;
    }

  }
</style>
