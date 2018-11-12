<template>
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
</template>

<script lang="ts" src="./ListContainer.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .qf-list-container {
    padding: 24px 20px;
    background: $--color-white;

    .qf-search-box {
      margin: 0 auto 30px;
      margin-bottom: 0;
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
      margin: 24px auto 10px;
    }

    .qf-table-list {
      margin: 10px auto 20px;
    }

    .pagination {
      margin: 20px auto;
    }
  }
</style>
