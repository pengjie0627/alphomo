<template>
  <div class="auth-dialog-view">
    <qf-dialog-def class="dialog-body-wrap" title="授权码" @cancel="doCancel" @confirm="doConfirm">
      <section class="dialog-content">
        <qf-row class="margin-top-20">
          <qf-col>
            <qf-row>
              <qf-col>
                <div class="center">
                  <qrcode-vue :value="payUrl" :size="200" level="H"></qrcode-vue>
                </div>
                <div class="center">
                  <h3>授权码：{{authCode}}</h3>
                </div>
                <qf-row class="margin-top-20">
                  <qf-col>
                    <div class="margin-left-30">
                      <qf-row>
                        <div>
                          <img class="middle" width="25px" height="25px" src="~images/main/ic_xiazai.png">
                          <qf-button type="link" @click="onDownload()">
                            下载授权码
                          </qf-button>
                        </div>
                      </qf-row>
                    </div>
                  </qf-col>
                  <qf-col>
                    <div class="margin-left-30">
                      <qf-row>
                        <div>
                          <img class="middle" width="25px" height="25px" src="~images/main/ic_shuaxin.png">
                          <qf-button type="link" @click="onRefresh()" class="middle">
                            刷新授权码
                          </qf-button>
                        </div>
                      </qf-row>
                    </div>
                  </qf-col>
                </qf-row>
              </qf-col>
            </qf-row>
          </qf-col>
        </qf-row>
        <div class="tips">
            点击刷新将重新生成授权码，原授权码失效
        </div>
        <div class="small-tips">
          <div class="margin-top-20">
            授权方式一：向商户出示授权码，商户使用APP扫码授权。
          </div>
          <div class="margin-top-5">
            授权方式二：商户手工录入6位授权码字符授权。
          </div>
        </div>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./AuthDialog.ts'></script>
<style lang="scss">
  .auth-dialog-view {
    .dialog-content {
      width: 400px;
      .margin-top-20 {
        margin-top: 20px;
      }
      .center {
        justify-content: center;
        padding: 7px;
        text-align: center;
      }
      .refresh {
        justify-content: center;
        text-align: center;
      }
      .margin-left-20 {
        margin-left: 20%;
      }
      .tips {
        margin-left: 15%;
        color:#909399;
      }
      .small-tips {
        font-size: 10px;
        margin-left:12%;
        color:#909399;
      }
      .margin-top-5{
        margin-top:5px;
      }
      .margin-left-30 {
        margin-left: 30%;
      }
      .large-font {
        font-size: 18px;
      }
      .middle {
        vertical-align: middle;
      }
    }
    .qf-dialog-def .qf-dialog-footer {
      display: none;
    }
    .qf-dialog-def .qf-dialog-header {
      font-size: 20px;
    }
    .qf-dialog-def .qf-dialog-body {
      padding-bottom: 40px;
      border-top: 0;
    }
  }
</style>
