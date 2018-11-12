<template>
    <div class="bind-mobile-confirm-view">
        <qf-dialog-def class="dialog-body-wrap" title="修改绑定手机" @cancel="doCancel" @confirm="doConfirm">
            <section class="dialog-content">
               <qf-tip type="info">为了保证您的账号安全，更换绑定手机前请先进行安全验证</qf-tip>
              <qf-form-item label="原手机号">
                <div class="mobile">{{getLoginMobile}}</div>
              </qf-form-item>
              <qf-form-item label="验证码" required>
                <qf-input v-form:modifyCode="validator" class="width-input" placeholder="请输入原手机号验证码" regex="^[0-9]*$" :maxlength="6" v-model="modifyCode"></qf-input>
                <qf-count-button
                  @click="sendCode"
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
<script lang="ts" src='./BindMobileConfirm.ts'></script>
<style lang="scss">
    .bind-mobile-confirm-view {
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
