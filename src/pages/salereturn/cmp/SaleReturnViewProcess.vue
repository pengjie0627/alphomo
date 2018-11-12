<template>
  <div class="sale-return-view-process">
    <div class="billInfo">
      <operate-log-view :logs="bill.operateLogs"></operate-log-view>
    </div>
    <div class="actions">
      <sale-return-view-button :bill="bill"></sale-return-view-button>
    </div>

  </div>

</template>
<script lang="ts" src="./SaleReturnViewProcess.ts"/>
<style lang="scss">
  @import '~styles/var.scss';

  .sale-return-view-process {
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
