<template>
  <div class="qf-table-container">
    <div class="qf-summary">
      <slot name="summary"></slot>
    </div>
    <div class="qf-tab">
      <slot name="tab"></slot>
    </div>
    <div class="qf-table-box">
      <div class="qf-search-box">
        <slot name="search"></slot>
      </div>
      <div class="qf-total">
        <slot name="total"></slot>
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

<script lang="ts" src="./ReceivableTableContainer.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .qf-table-container {
    background: #ffffff;
    padding: 10px 20px;
    .qf-search-box {
      padding: 24px 0;
      border-bottom: 1px solid #dcdfe6;
      background: $--color-white;
    }
    .qf-total {
      table {
        width: 100%;
        td {
          padding: 6px;
          line-height: 36px;
          font-weight: bold;
          .success {
            color: $--color-success
          }
          .fail {
            color: $--color-minor
          }
        }
      }
    }
    .qf-date-editor {
      width: 100%;
    }

    .qf-summary {
      padding: 20px 0;
      width: 100%;
    }

    .pagination {
      padding: 25px 0;
    }
    .qf-form-content {
      padding-right: 5px;
    }
    .qf-form-label {
      text-align: left;
      padding-left: 5px;
    }
    .sale-list-search {

      .qf-form-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

    }
  }
</style>
