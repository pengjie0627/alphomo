<template>
    <div class="install-printer-dialog-view">
      <qf-dialog-def class="dialog-body-wrap" title="安装打印机提示" @cancel="doCancel" @confirm="doConfirm">
          <section class="dialog-content">
            <div class="common">
              1.该功能需要插件支持，如果您还未安装插件，可点击以下按钮进行下载： <qf-button type="link" @click="onDownload">【下载打印插件】</qf-button>
            </div>
            <div class="common">
              2.如果您已下载插件，您可以手动启动插件后重试
            </div>
          </section>
      </qf-dialog-def>
    </div>
</template>
<script lang="ts" src='./InstallPrinterDialog.ts'></script>
<style lang="scss">
    .install-printer-dialog-view {
      .dialog-content{
        padding: 30px;
      }
    }
</style>
