<template>
  <qf-dialog-def :title="title" @cancel="doCancel" @confirm="doConfirm" class="export-dialog" :show-cancel="showCancel"
                 :show-confirm="showConfirm" :cancel-text="cancelText">
    <div class="tips-container" v-if="step === 1">
      {{msg}}
    </div>
    <div v-if="step === 2" class="progress-container">
      <qf-progress :percentage="point" :color="progressColor"></qf-progress>
    </div>
    <div v-if="step === 3" class="progress-container">
      {{exportErr}}
    </div>
    <div v-if="step === 4" class="tips-container">
      <qf-progress class="margin-space" :percentage="point" :color="progressColor"></qf-progress>
      导出成功
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./ExportDialog.ts"></script>

<style lang="scss">
  .export-dialog {
    width: 480px;

    .tips-container {
      margin: 30px auto;
      .margin-space {
        margin: 20px auto;
      }
    }

    .progress-container {
      height: 30px;
      margin: 30px auto;
    }

  }
</style>
