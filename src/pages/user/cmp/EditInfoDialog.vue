<template>
  <div class="edit-info-dialog">
    <qf-dialog-def class="dialog-body-wrap" title="编辑基本信息" @cancel="doCancel" @confirm="doConfirm" confirmText="保存">
      <section class="dialog-content">
        <qf-form-item label="姓名" required>
          <qf-input v-model="name" placeholder="请输入姓名" :maxlength="14"></qf-input>
        </qf-form-item>
        <qf-form-item label="性别" required>
          <qf-radio-group class="height-style" v-model="sex">
            <qf-radio label="男">男</qf-radio>
            <qf-radio label="女">女</qf-radio>
          </qf-radio-group>
        </qf-form-item>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./EditInfoDialog.ts'></script>
<style lang="scss">
  .edit-info-dialog {
    .dialog-content{
      width: 540px;
      padding-top: 30px;
      .height-style{
        height: 36px;
        line-height: 36px;
        label{
          margin-top: 10px;
        }
      }
    }
  }
</style>
