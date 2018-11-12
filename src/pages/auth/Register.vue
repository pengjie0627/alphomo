<template>
  <div class="register-view">
    <div class="login-form">
      <header class="header">
        <img src="~images/auth/img_logo_shangmao.png" alt="">
      </header>
      <section>
        <div class="wrap">
          <p class="title">{{typeInfo}}</p>
          <section class="mobile-sel">
            <qf-button class="area">+86</qf-button>
            <qf-input
              type="text"
              regex="^[0-9]*$"
              class="mobile"
              :maxlength="11"
              placeholder="11位手机号"
              ref="mobile"
              v-form:mobile='validator'
              @keydown.native="confirmByKey($event,'mobile')"
              v-model="mobile"></qf-input>
          </section>
          <section class="modify-num">
            <qf-input
              type="text"
              regex="^[0-9]*$"
              class="num"
              autocomplete="new-password"
              ref="modifyNum"
              :minlength="6"
              :maxlength="6"
              placeholder="输入验证码"
              v-form:modifyNum='validator'
              @keydown.native="confirmByKey($event,'modifyNum')"
              v-model="modifyNum">
            </qf-input>
            <qf-count-button @click="sendCode"
                             :count=60
                             text="获取验证码"
                             class="auto-count"
                             :autoStart="true"
                             ref="countBtn"></qf-count-button>
          </section>
          <qf-input
            v-model="pwd"
            :minlength="6"
            :maxlength="16"
            placeholder="6 - 16位密码，区分大小写"
            ref="pwd"
            type="password"
            v-form:pwd='validator'
            @keydown.native="confirmByKey($event,'pwd')">
          </qf-input>
          <qf-input
            class="sec-pwd"
            autocomplete="new-password"
            ref="confirmPwd"
            :minlength="6"
            :maxlength="16"
            placeholder="确认密码"
            v-form:confirmPwd='validator'
            type="password"
            @keydown.native="confirmByKey($event,'confirmPwd')"
            v-model="confirmPwd">
          </qf-input>
        </div>
      </section>
      <section class="login">
        <qf-button :disabled="!mobile || !modifyNum || !pwd || !confirmPwd" class="btn-login" type="primary"
                   ref="register" @click="onRegister">
          确&nbsp;定
        </qf-button>
        <qf-button class="have-number" type="link" @click="toLogin">使用已有账号登录</qf-button>
      </section>
    </div>
    <footer class="page-footer">
      <p>客服电话： 400-9009-123</p>
      <p>© 1997-2016上海海鼎信息工程股份有限公司 沪ICP备15000535号-5</p>
    </footer>
  </div>
</template>

<script lang="ts" src="./Register.ts"></script>

<style lang="scss">
  .register-view {
    background-color: #F1F2F6;
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
    .page-footer {
      position: absolute;
      bottom: 0;
      p {
        text-align: center;
        height: 40px;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.447058823529412);
      }
    }
    .login-form {
      width: 366px;
      min-height: 400px;
      .header {
        text-align: center;
        line-height: 45px;
        font-weight: 600;
        font-style: normal;
        font-size: 24px;
        color: #232424;
        > img {
          width: 200px;
          height: 90px;
          vertical-align: middle;
          margin-left: -10px;
        }
        > p {
          margin-top: 5px;
          font-weight: 400;
          font-style: normal;
          color: rgba(0, 0, 0, 0.447058823529412);
          line-height: 22px;
          font-size: 14px;
        }
      }
      .wrap {
        margin-top: 40px;
        .auto-count {
          width: 128px;
        }
        .modify-num {
          margin-bottom: 30px;
          .num {
            display: inline-block;
            width: 233px;
          }
        }
        .mobile-sel {
          margin-bottom: 30px;
          .mobile {
            display: inline-block;
            width: 302px;
          }
          .area{
            background: transparent;
          }
        }
        .sec-pwd {
          margin-top: 30px;
        }
        .title {
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          margin-bottom: 15px;
        }
        img {
          width: 15px;
          height: 15px;
        }
        input {
          padding-left: 10px;
        }
      }
      .login {
        margin-top: 30px;
        .have-number {
          float: right;
        }
        .btn-login {
          width: 170px;
          font-size: 16px;
        }
      }
    }
  }
</style>
