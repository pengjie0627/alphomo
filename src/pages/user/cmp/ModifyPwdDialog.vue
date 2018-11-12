<template>
  <div class="modify-pwd-dialog">
    <qf-dialog-def class="dialog-body-wrap" title="修改登录密码" @cancel="doCancel" @confirm="doConfirm" confirmText="保存">
      <section class="dialog-content">
        <qf-form-item label="原密码" required>
          <qf-input :maxlength="16" type="password" v-form:oldPwd='validator' v-model="oldPwd" placeholder="请输入原密码"></qf-input>
        </qf-form-item>
        <qf-form-item label="新密码" required>
          <qf-input :maxlength="16" type="password" v-form:newPwd='validator' v-model="newPwd" placeholder="6-16位密码，区分大小写"></qf-input>
        </qf-form-item>
        <qf-form-item label="确认密码" required>
          <qf-input :maxlength="16" type="password" v-form:reNewPwd='validator' v-model="reNewPwd" placeholder="再输一遍新密码"></qf-input>
        </qf-form-item>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./ModifyPwdDialog.ts'></script>
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
