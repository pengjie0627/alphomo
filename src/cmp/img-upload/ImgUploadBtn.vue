<template>
  <div class="qf-img-upload-btn">
    <qf-button v-if="type=='default'" type="link" id="upload">
      <div class="upload-image">
        <i class="iconfont qf-icon ic-ic_add"></i><br/>
        <span>上传</span>
      </div>
      <input type="file" :sizeLimit="sizeLimit" :multiple="total>1"
             @change="onImageChanged" ref="input">
    </qf-button>
    <!--<qf-button @click="onShowQrcodeDialog" v-if="type=='mobile'" type="link" icon="ic-icon_phone">-->
    <!--手机上传-->
    <!--</qf-button>-->
  </div>
</template>

<script lang="ts" src="./ImgUploadBtn.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .qf-img-upload-btn {
    display: inline-block;
    position: relative;
    #upload {
      width: 84px;
      height: 72px;
      i {
        color: $--color-font;
      }
    }
    .upload-image {
      width: 84px;
      height: 72px;
      text-align: center;
      border: 1px dashed $--color-font-light-2;
      background: $--color-bg;
      color: $--color-font;
      padding: 10px 0;
      line-height: 24px;
    }

    input[type='file'] {
      cursor: pointer;
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .qf-img-upload-btn + .qf-img-upload-btn {
    margin-left: 20px;
  }
</style>
