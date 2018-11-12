<template>
  <div class="inventory-view-title">
    <qf-row>
      <qf-col :span="8">
        <div class="font-tips">
          <slot name="tips"></slot>
        </div>
      </qf-col>
      <qf-col :span="8">
        <div class="header">
          <span class="header-text">{{title}}</span>
          <qf-tag v-if="status" :type="status.type">{{status.text}}</qf-tag>
        </div>
      </qf-col>
      <qf-col :span="8">
        <div class="header-actions">
          <slot name="actions"></slot>
        </div>
      </qf-col>
    </qf-row>
  </div>
</template>

<script lang="ts" src="./BillViewTitle.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-view-title {

    .qf-row {
      align-items: center;
    }

    .font-tips {
      color: $--color-placeholder;
    }

    .header {
      text-align: center;

      .header-text {
        font-size: 20px;
      }

    }

    .header-actions {
      float: right;
    }

  }
</style>
