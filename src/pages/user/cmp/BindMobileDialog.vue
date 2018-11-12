<template>
    <div class="bind-mobile-dialog">
      <qf-dialog-def class="dialog-body-wrap" title="绑定手机" @cancel="doCancel" @confirm="doConfirm">
          <section class="dialog-content">
            <qf-form-item label="手机号" required>
              <qf-input v-form:mobile="validator" ref="mobile" placeholder="请输入需要绑定的手机" :maxlength="11" v-model="mobile" regex="^[0-9]*$"></qf-input>
            </qf-form-item>
            <qf-form-item label="验证码" required>
              <qf-input v-form:modifyCode="validator" class="width-input" placeholder="请输入验证码" regex="^[0-9]*$" :maxlength="6" v-model="modifyCode"></qf-input>
              <qf-count-button
                 @click="sendCode"
                 :disabled="!mobile"
                 :count=60
                 text="获取验证码"
                 class="auto-count"
                 :autoStart="true">
              </qf-count-button>

            </qf-form-item>
          </section>
      </qf-dialog-def>
    </div>
</template>
<script lang="ts" src='./BindMobileDialog.ts'></script>
<style lang="scss">
  .bind-mobile-dialog{
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
