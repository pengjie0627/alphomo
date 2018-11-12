<template>
  <div class="login-view">
    <div class="login-form">
      <header class="header">
        <img src="~images/auth/img_logo_shangmao.png" v-if="!jdEnv" alt="千帆商贸">
        <img src="~images/auth/img_logo_jd.png" v-if="jdEnv" alt="京东云Elite商贸管家">
      </header>
      <section>
        <div class="wrap">
          <qf-input
            v-model="user"
            :maxlength="20"
            placeholder="账号/手机号"
            ref="name"
            @keydown.native="confirmByKey($event,'userName')">
            <template slot="icon">
              <img src="~images/auth/ic_login_user_hl.svg" alt="">
            </template>
          </qf-input>
          <qf-input
            class="sec-pwd"
            autocomplete="new-password"
            ref="password"
            :minlength="6"
            :maxlength="16"
            placeholder="密码"
            v-form:pwd='validator'
            type="password"
            @keydown.native="confirmByKey($event,'password')"
            v-model="password">
            <template slot="icon">
              <img src="~images/auth/ic_login_psw_hl.svg" alt="">
            </template>
          </qf-input>
        </div>
      </section>
      <section class="save-pwd">
        <span>
          <qf-checkbox class="sel" v-model="savePwd" v-show="false">记住密码</qf-checkbox>
          <span class="gph-wrap" @click="onToAuthorize('vipmro')">
            <img class="gph-logo" src="~/images/vipmro_logo.jpg" alt="暂无图片">
            <qf-button type="link" class="gph-btn">工品汇登录</qf-button>
          </span>
          <qf-button class="pull-right" type="link" @click="onToRegister('forgot')">忘记密码</qf-button>
        </span>
      </section>
      <section class="login">
        <qf-button :disabled="!user || !password" class="btn-login" type="primary" ref="login"
                   @click="onLogin">登&nbsp;录
        </qf-button>
      </section>
      <footer class="footer" v-show="!jdEnv">
        没有账号？
        <qf-button class="register" type="link" @click="onToRegister('new')">立即入驻</qf-button>
      </footer>
    </div>
    <footer class="page-footer">
      <p>客服电话： 400-9009-123</p>
      <p>© 1997-2018上海海鼎信息工程股份有限公司 沪ICP备15000535号-5</p>
    </footer>
  </div>
</template>

<script lang="ts" src="./Login.ts"></script>

<style lang="scss">
  .login-view {
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
        .sec-pwd {
          margin-top: 30px;
        }
        img {
          width: 15px;
          height: 15px;
        }
        input {
          padding-left: 10px;
        }
      }
      .save-pwd {
        line-height: 56px;
        padding: 5px 0;
        .pull-right {
          float: right;
          margin-top: 9px;
        }
        .sel {
          vertical-align: middle;
        }
        .gph-wrap{
          cursor: pointer;
          position: relative;
          .gph-logo{
            width: 14px;
            height: 14px;
            position: absolute;
            top: 2px;
          }
          .gph-btn{
            margin-left: 18px;
          }
        }
      }
      .login {
        .btn-login {
          width: 100%;
          font-size: 16px;
        }
      }
      .footer {
        margin-top: 10px;
        text-align: center;
      }
    }
  }
</style>
