<template>
  <div class="query-condition">
    <qf-row v-if="!opened" class="query-line" style="padding: 0">
      <qf-col :span="16">
        <slot></slot>
      </qf-col>
      <qf-col :span="8" class="closed-action">
        <qf-button type="primary" @click="onSearch">查询</qf-button>
        <qf-button @click="onToggle" trigger="ic-ic_xiangxia" type="link">展开</qf-button>
      </qf-col>
    </qf-row>
    <template v-else>
      <slot name="opened"></slot>
      <qf-row class="query-line">
        <qf-col :span="16">
          <slot name="openedQuery"></slot>
        </qf-col>
        <qf-col :span="8">
          <div class="opened-action">
            <qf-button type="primary" @click="onSearch">查询</qf-button>
            <qf-button @click="onReset">重置</qf-button>
            <qf-button @click="onToggle" trigger="ic-ic_xiangshang" type="link">收起</qf-button>
          </div>
        </qf-col>
      </qf-row>
    </template>
  </div>
</template>

<script lang="ts" src="./QueryCondition.ts"/>

<style lang="scss">
  .query-condition {
    padding: 0 20px;

    .qf-row {
      padding: 5px;
    }

    .query-line {
      paddinng: 5px;

      .qf-row {
        padding: 0px;
      }
    }

    .closed-action {
      padding-left: 12px;
    }

    .opened-action {
      float: right;
    }
  }
</style>
