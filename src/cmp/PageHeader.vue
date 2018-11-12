<template>
  <div class="page-header">
    <qf-font-icon name="ic-ic_shangyiyue" class="page-header-back" @click="onBack"></qf-font-icon>
    <qf-breadcrumb>
      <qf-breadcrumb-item v-for="item in menuList" :to="item.url" :key="item.name">
        <qf-svg-icon :name="item.icon" v-if="item.icon"></qf-svg-icon>
        <span>{{item.name}}</span>
      </qf-breadcrumb-item>
    </qf-breadcrumb>
    <div class="page-header-slot">
      <slot></slot>
    </div>
    <slot name="actions"></slot>
  </div>
</template>

<script lang="ts" src="./PageHeader.ts"/>

<style lang="scss">
  .page-header {
    height: 72px;
    display: flex;
    align-items: center;
    font-size: 0;

    .page-header-back {
      font-size: 24px;
      font-weight: 500;
      width: 32px;
      height: 32px;
      line-height: 32px;
      margin-right: 8px;
    }

    .qf-breadcrumb-item {
      font-size: 16px;

      .qf-breadcrumb-inner {
        display: flex;
        align-items: center;

        .qf-svg-icon {
          font-size: 20px;
          margin-right: 8px;
        }
      }
    }

    .page-header-slot {
      flex: 1;
    }
  }
</style>
