<template>
  <div class="purchase-view-process">
    <div class="billInfo">
      <operate-log-view :logs="bill.operateLogs"></operate-log-view>
    </div>
    <div class="actions">
      <detail-button :bill="bill"></detail-button>
    </div>

  </div>

</template>
<script lang="ts" src="./PurchaseViewProcess.ts"/>
<style lang="scss">
  @import '~styles/var.scss';

  .purchase-view-process {
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
