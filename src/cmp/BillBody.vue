<template>
  <div class="bill-body">
    <div class="bill-title">
      <slot name="title"></slot>
    </div>
    <div class="bill-header">
      <slot name="header"></slot>
    </div>
    <div class="bill-toolbar">
      <slot name="toolbar"></slot>
    </div>
    <div class="bill-main">
      <div class="bill-table">
        <slot name="table"></slot>
      </div>
      <div class="bill-summary">
        <slot name="summary"></slot>
      </div>
      <div class="bill-remark">
        <slot name="remark"></slot>
      </div>
      <div class="bill-bottom">
        <div class="operate-log">
          <slot name="operateLog"></slot>
        </div>
        <div class="bottom-actions">
          <slot name="bottomActions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./BillBody.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .bill-body {
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    padding: 20px;
    background: $--color-white;

    .bill-title {
      padding: 0 0 15px 0;
      border-bottom: 2px solid $--color-font-light-3;
    }
    .bill-header {
      padding: 20px 0;
      margin-top: 3px;
      border-top: 1px solid $--color-font-light-3;
      border-bottom: 1px dashed $--color-font-light-3;
    }
    .bill-toolbar {
      padding: 10px;
      font-size: 0;
    }
    .bill-main {
      overflow: auto;
      .bill-table {
      }
      .bill-summary {
        padding: 20px 0;
      }
      .bill-remark {
        padding: 5px 0px;
      }
      .bill-bottom {
        margin-top: 10px;
        display: flex;
        .operate-log {
          width: 450px;
        }
        .bottom-actions {
          flex: 1;
          font-size: 0;
          text-align: right;
        }
      }
    }
  }
</style>
