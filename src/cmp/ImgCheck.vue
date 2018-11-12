<template>
  <qf-dialog-def title="图片查看" @cancel="doCancel" @confirm="doConfirm" :show-cancel="showCancel">
    <div class="img-check-view" ref="imgWrap">
      <img ref="img" :src="imgUrl" alt="暂无图片">
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./ImgCheck.ts">
</script>

<style lang="scss">
.img-check-view{
  max-width: 1150px;
  max-height: 550px;
  overflow: auto;
  width: 1150px;
  height: 550px;
  img{
    width: 100%;
    /*height: 100%;*/
  }
}
</style>
