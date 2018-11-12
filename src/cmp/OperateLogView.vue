<template>
  <div class="operate-log-view">
    <div class="billInfo" v-for="(log) in logs" :key="">

      <qf-form-item :label="log.operate+'：'+log.operator"
                    labelWidth="300px">
        <span>{{log.operateTime}} </span>
      </qf-form-item>
    </div>
  </div>
</template>

<script lang="ts" src="./OperateLogView.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .operate-log-view {
    width: 100%;
    line-height: 36px;
    overflow: auto;
  }
</style>
