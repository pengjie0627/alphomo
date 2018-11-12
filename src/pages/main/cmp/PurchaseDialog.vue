<template>
  <div class="purchase-dialog-view">
    <qf-dialog-def class="dialog-body-wrap" title="购买千帆商贸" @cancel="doCancel" @confirm="doConfirm">
      <section class="dialog-content">
        <qf-row>
          <qf-col>
            <qf-tip type="info">购买专业版，不会缩短你的试用天数哟～</qf-tip>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-20">
          <qf-col>
            <qf-form-item label="员工上限">
              <qf-radio-group v-model="mbrNum" class="radio-style">
                <qf-radio-button label="2个"></qf-radio-button>
                <qf-radio-button label="5个"></qf-radio-button>
                <qf-radio-button label="10个"></qf-radio-button>
                <qf-radio-button label="20个"></qf-radio-button>
              </qf-radio-group>
              <div class="sub-desc">若需更多员工请直接咨询客服 400-900-9123，价格面议优惠多多哟～</div>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-20">
          <qf-col>
            <qf-form-item label="时长">
              <qf-radio-group v-model="timeNum" class="radio-style">
                <qf-radio-button label="1年"></qf-radio-button>
                <qf-radio-button label="2年"></qf-radio-button>
                <qf-radio-button label="5年"></qf-radio-button>
              </qf-radio-group>
              <div class="sub-desc">到期日：2020-02-02</div>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-20">
          <qf-col>
            <qf-form-item label="应付金额">
              <div class="should-pay">¥ 688</div>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-20">
          <qf-col>
            <qf-form-item label="选择支付方式">
              <div>
                <span class="common" :class="{'sel' : payFlag === 'ali'}" @click="onSelPay('ali')">
                  <img class="alipay" src="~images/main/zhifubao.png">
                  <span>支付宝支付</span>
                  <img v-if="payFlag === 'ali'" class="select" src="~images/main/choose-red.png">
                </span>
                <span class="common" :class="{'sel' : payFlag === 'wx'}" @click="onSelPay('wx')">
                  <img class="wxpay" src="~images/main/weixingzhifu.png">
                  <span>微信支付</span>
                  <img v-if="payFlag === 'wx'" class="select" src="~images/main/choose-red.png">
                </span>
              </div>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-20">
          <qf-col>
            <qf-form-item>
              <qf-row>
                <qf-col>
                  <div class="qrcode-wrap">
                    <qrcode-vue :value="payUrl" :size="182" level="H"></qrcode-vue>
                  </div>
                </qf-col>
                <qf-col>
                  <div class="qrcode-wrap">
                    <div class="qrcode-time">距离二维码过期还剩<span>40s</span></div>
                    <div class="qrcode-time">过期后将重新刷新二维码</div>
                    <div class="refresh">
                      <qf-button type="link">重新刷新</qf-button>
                    </div>
                  </div>
                </qf-col>
              </qf-row>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="margin-top-20">
          <qf-col>
            <div class="border-bottom"><qf-checkbox v-model="selTicket"></qf-checkbox>&nbsp;需要发票</div>
            <qf-form-item v-if="selTicket" label="抬头类型：" labelWidth="70px">
              <div class="ticket">公司</div>
            </qf-form-item>
            <div v-if="selTicket">
              <qf-form-item label="抬头：" labelWidth="45px">
                <qf-input placeholder="请输入"></qf-input>
              </qf-form-item>
              <qf-form-item label="税号：" labelWidth="45px">
                <qf-input placeholder="请输入"></qf-input>
              </qf-form-item>
              <qf-form-item label="邮箱：" labelWidth="45px">
                <qf-input placeholder="输入用来接收电子发票的邮箱"></qf-input>
              </qf-form-item>
            </div>
          </qf-col>
        </qf-row>
      </section>
    </qf-dialog-def>
  </div>
</template>
<script lang="ts" src='./PurchaseDialog.ts'></script>
<style lang="scss">
  .purchase-dialog-view {
    .dialog-content{
      width: 600px;
      height: 700px;
      padding-top: 20px;
      .margin-top-20{
        margin-top: 20px;
        .border-bottom{
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 5px;
        }
        .ticket{
          height: 36px;
          line-height: 36px;
          color: #606266;
          font-size: 13px;
        }
        .sub-desc{
          color: rgba(118, 117, 130, 0.8);
          line-height: 32px;
          font-size: 13px;
        }
        .should-pay{
          height: 100%;
          line-height: 36px;
        }
        .sel{
          border: 2px solid #5090f0 !important;
        }
        .common{
          cursor: pointer;
          width: 135px;
          border: 1px solid #cccccc;
          position: relative;
          display: inline-block;
          text-align: center;
          line-height: 35px;
          img{
            vertical-align: middle;
            margin-top: -3px;
            font-weight: bold;
          }
          .select{
            position: absolute;
            right: 0;
            bottom: 0;
            width: 15px;
            height: 15px;
          }
          &:first-child{
            margin-right: 10px;
          }
        }
        .qrcode-wrap{
          width: 199px;
          height: 199px;
          border: 1px solid #cccccc;
          padding: 7px;
          .qrcode-time{
            font-size: 12px;
            color: #4E4E56;
            text-align: center;
            >span{
              color: #EB3B4E;
            }
            &:first-child{
              margin-top: 30px;
            }
          }
          .refresh{
            text-align: center;
          }
        }
      }
    }
  }
</style>
