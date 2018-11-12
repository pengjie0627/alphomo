<template>
  <qf-container class="page-list-body">
    <qf-header class="page-title" height="72px">
      <page-header :menu="menu">
        <slot name="tip"></slot>
        <slot name="actions" slot="actions"></slot>
      </page-header>
    </qf-header>
    <qf-main class="page-content">
      <div class="search-box">
        <slot name="search"></slot>
      </div>
      <div class="table-box">
        <div class="qf-tool-bar">
          <slot name="toolbar"></slot>
        </div>
        <div class="table-list">
          <slot name="list"></slot>
        </div>
        <div class="pagination">
          <slot name="pagination"></slot>
        </div>
      </div>
    </qf-main>
  </qf-container>
</template>

<script lang="ts" src="./PageBody.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .page-list-body {
    height: 100%;

    .qf-card + .qf-card {
      margin-top: 24px;
    }

    .page-title {
      height: 72px;
      padding: 0 16px;
    }

    .page-content {
      padding: 0 36px 16px 36px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .search-box {
        padding: 20px 0;
        border-bottom: 1px solid #dcdfe6;
      }

      .tool-bar {
        padding: 30px 0 10px;
      }

      .pagination {
        padding: 25px 0;
      }
    }
  }
</style>
