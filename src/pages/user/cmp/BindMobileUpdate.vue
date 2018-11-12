<template>
  <div class="bind-mobile-update-view">
    <qf-dialog-def class="dialog-body-wrap" title="修改绑定手机" @cancel="doCancel" @confirm="doConfirm">
      <section class="dialog-content">
        <qf-form-item  label="新手机号" required>
          <qf-input v-form:newMobile="validator" placeholder="请输入新手机号" :maxlength="11" regex="^[0-9]*$" v-model="newMobile"></qf-input>
        </qf-form-item>
        <qf-form-item label="验证码" required>
          <qf-input v-form:reModifyCode="validator" class="width-input" placeholder="请输入新手机号验证码" regex="^[0-9]*$" :maxlength="6" v-model="reModifyCode"></qf-input>
          <qf-count-button
            @click="sendCode"
            :count=60
            :disabled="!newMobile"
            text="获取验证码"
            class="auto-count"
            :autoStart="true">
          </qf-count-button>
        </qf-form-item>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./BindMobileUpdate.ts'></script>
<style lang="scss">
  .bind-mobile-update-view {
    .dialog-content{
      width: 540px;
      padding-top: 30px;
      padding-bottom: 30px;
      .mobile{
        height: 36px;
        line-height: 36px;
        margin-top: 15px;
      }
      .width-input{
        width: 311px;
        display: inline-block;
      }
      .auto-count{
        width: 128px;
        display: inline-block;
      }
    }
  }
</style>
