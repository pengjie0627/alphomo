<template>
  <div class="modify-pwd-dialog">
    <qf-dialog-def class="dialog-body-wrap" title="重置密码" @cancel="doCancel" @confirm="doConfirm" confirmText="确定重置">
      <section class="dialog-content">
        <qf-form-item label="商户账号" required>
          <qf-input :maxlength="16" type="text" v-model="loginCode" disabled></qf-input>
        </qf-form-item>
        <qf-form-item label="登录密码" required>
          <qf-input :maxlength="16" type="text" v-form:loginPwd='validator' v-model="loginPwd" placeholder="6-16位密码，区分大小写"></qf-input>
        </qf-form-item>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./PwdResetDialog.ts'></script>
<style lang="scss">
  .modify-pwd-dialog {
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
