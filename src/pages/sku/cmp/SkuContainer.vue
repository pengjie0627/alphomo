<template>
  <div class="sku-container">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="qf-list-container">
      <div class="qf-search-box">
        <slot name="search"></slot>
      </div>
      <div class="qf-total">
        <slot name="total"></slot>
      </div>
      <div class="qf-table-box">
        <div class="qf-tool-bar">
          <slot name="toolbar"></slot>
        </div>
        <div class="qf-table-list">
          <slot name="list"></slot>
        </div>
        <div class="pagination">
          <slot name="pagination"></slot>
        </div>
      </div>
    </div>
    <div class="clear-fix"></div>
  </div>

</template>

<script lang="ts" src="./SkuContainer.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sku-container {
    overflow: hidden;
    background: $--color-white;
    padding: 20px;
    .left {
      width: 200px;
      float: left;
      padding: 10px;
      border: 1px solid $--color-border;
      height: 720px;
      overflow-x: auto;
      overflow-y: auto;
    }
    .qf-list-container {
      margin-left: 200px;
      padding-left: 10px;
      .qf-search-box {
        padding: 24px 20px;
        /*margin: 0 auto 30px;*/
        background: $--color-white;
        .query-condition {
          padding: 0;
        }
        .qf-form-label {
          padding-left: 8px;
        }
      }

      .qf-tool-bar {
        font-size: 0;
        margin: 0px auto 10px;
      }

      .qf-table-list {
        margin: 10px auto 20px;
      }

      .pagination {
        margin: 20px auto;
      }
    }
    .clear-fix {
      clear: both
    }
  }

</style>
