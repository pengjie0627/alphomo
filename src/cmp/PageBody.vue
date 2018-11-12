<template>
  <qf-container class="page-body">
    <qf-header class="page-title" height="72px">
      <page-header :menu="menu">
        <slot name="tip"></slot>
        <slot name="actions" slot="actions"></slot>
      </page-header>
    </qf-header>
    <qf-main class="page-content">
      <slot></slot>
      <!--<footer class="foot-center"><img style="height: 50px;padding-top: 10px" src="~images/main/img_logo.png"></footer>-->
      <footer class="foot-center">— 千帆，更懂零售业 —</footer>
    </qf-main>
  </qf-container>
</template>

<script lang="ts" src="./PageBody.ts"></script>

<style lang="scss">

  @import '~styles/var.scss';

  .page-body {
    .qf-select .qf-select-options {
      max-width: 500px;
    }
    height: 100%;
    background-color: $--color-bg;

    .qf-card + .qf-card {
      margin-top: 24px;
    }

    .page-title {
      height: 72px;
      padding: 0 16px;
    }

    .page-content {
      padding: 0 16px 16px 16px;
    }
    .sku-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .foot-center{
      text-align: center;
      padding: 24px;
      opacity: 0.45;
    }
  }
</style>
