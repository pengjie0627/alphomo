<template>
  <div class="qf-img-upload">
    <div class="qf-img-upload-title">
      <qf-img-upload-btn type="default" @onChanged="onChanged" :uploadType="uploadType" :target="target"
                         :total="max" :imgList="imgs"></qf-img-upload-btn>
      <!--<qf-img-upload-btn type="mobile" @onChanged="onChanged" :uploadType="qrUploadType"-->
      <!--:target="target"></qf-img-upload-btn>-->
      <qf-img-group v-if="preview" v-model="model" deletable :sortable="sortable" @input="onDelete"
                    class="images"></qf-img-group>
    </div>

  </div>
</template>

<script lang="ts" src="./Index.ts"></script>

<style lang="scss">
  .qf-img-upload {
    .qf-img-upload-title {
      display: flex;
      flex-wrap: wrap;
      .qf-img-group .qf-img .qf-img-delete {
        top: -14px;
        right: -5px;
      }

    }

    .qf-img-group {
      margin-left: 8px;
    }
  }
</style>
