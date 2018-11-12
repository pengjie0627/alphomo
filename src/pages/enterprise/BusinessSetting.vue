<template>
  <div class="business-setting">
    <page-body class="sale-list" :menu="menu">
      <div class="content">
        <section class="contents">
          <div class="header"><h3>税率支持</h3></div>
          <qf-row class="list">
            <qf-col :span="12">
              <qf-checkbox v-model="merchantConfig.enableInputTaxRateSupport" class="checkbox"
                           @change="saveModify('enableInputTaxRateSupport',merchantConfig.enableInputTaxRateSupport)">
                启用进项税率支持
              </qf-checkbox>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item class="set-input" label="默认税率">
                <qf-input v-model="merchantConfig.inputTaxRate" class="input"
                          @blur="saveModify('inputTaxRate',merchantConfig.inputTaxRate)" align="right" scale="2">
                  <span slot="append">%</span>
                </qf-input>
              </qf-form-item>
            </qf-col>

          </qf-row>
          <div class="onlyTax">
            <qf-row class="list">
              <qf-col :span="8">
                <qf-checkbox v-model="merchantConfig.inputOnlyTax" class="checkbox"
                             :disabled="merchantConfig.enableInputTaxRateSupport == false"
                             @change="saveModify('inputOnlyTax',merchantConfig.inputOnlyTax)">
                  进货单据只显示含税价格和金额
                </qf-checkbox>
              </qf-col>
              <qf-col :span="8">
                <qf-checkbox v-model="merchantConfig.inputReportOnlyTax" class="checkbox"
                             :disabled="merchantConfig.enableInputTaxRateSupport == false"
                             @change="saveModify('inputReportOnlyTax',merchantConfig.inputReportOnlyTax)">
                  进货报表只显示含税价格和金额
                </qf-checkbox>
              </qf-col>
            </qf-row>
            <qf-row class="list">
              <qf-col class="onlyTaxExplain">
                启用进项税率支持后，进货单据和报表显示税率和税额等信息。
              </qf-col>
            </qf-row>
          </div>
          <qf-row class="list">
            <qf-col :span="12">
              <qf-checkbox v-model="merchantConfig.enableOutputTaxRateSupport" class="checkbox"
                           @change="saveModify('enableOutputTaxRateSupport',merchantConfig.enableOutputTaxRateSupport)">
                启用销项税率支持
              </qf-checkbox>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item class="common" label="默认税率">
                <qf-input v-model="merchantConfig.outputTaxRate" class="input" align="right"
                          @blur="saveModify('outputTaxRate',merchantConfig.outputTaxRate)" scale="2">
                  <span slot="append">%</span>
                </qf-input>
              </qf-form-item>
            </qf-col>

          </qf-row>

          <div class="onlyTax">
            <qf-row class="list">
              <qf-col :span="8">
                <qf-checkbox v-model="merchantConfig.outputOnlyTax" class="checkbox"
                             :disabled="merchantConfig.enableOutputTaxRateSupport == false"
                             @change="saveModify('outputOnlyTax',merchantConfig.outputOnlyTax)">
                  销售单据只显示含税价格和金额
                </qf-checkbox>
              </qf-col>
              <qf-col :span="8">
                <qf-checkbox v-model="merchantConfig.outputReportOnlyTax" class="checkbox"
                             :disabled="merchantConfig.enableOutputTaxRateSupport == false"
                             @change="saveModify('outputReportOnlyTax',merchantConfig.outputReportOnlyTax)">
                  销售报表只显示含税价格和金额
                </qf-checkbox>
              </qf-col>
            </qf-row>
            <qf-row class="list">
              <qf-col class="onlyTaxExplain">
                启用销项税率支持后，销售单据和报表显示税率和税额等信息。
              </qf-col>
            </qf-row>
          </div>

          <div class="header"><h3>常用设置</h3></div>
          <qf-row class="list">
            <qf-col :span="12">
              <label class="qf-form-label label-style">进价小数位数</label>
            </qf-col>
            <qf-col :span="12">
              <qf-radio-group class="height-style" v-model="purchasePriceBit"
                              @input="saveModify('purchasePriceBit',purchasePriceBit)">
                <qf-radio label="4">4位</qf-radio>
                <qf-radio label="6">6位</qf-radio>
              </qf-radio-group>
            </qf-col>

          </qf-row>
          <qf-row class="list">
            <qf-col :span="12">
              <label class="qf-form-label label-style">成本价小数位数</label>
            </qf-col>
            <qf-col :span="12">
              <qf-radio-group disabled="true" class="height-style" v-model="costPriceBit"
                              @input="saveModify('costPriceBit',costPriceBit)">
                <qf-radio label="4">4位</qf-radio>
                <qf-radio label="6">6位</qf-radio>
              </qf-radio-group>
            </qf-col>
          </qf-row>
          <qf-row class="list">
            <qf-col :span="12">
              <label class="qf-form-label label-style">进货单进价默认值</label>
            </qf-col>
            <qf-col :span="12">
              <qf-radio-group class="height-style" v-model="merchantConfig.defaultPurchasePrice"
                              @input="saveModify('defaultPurchasePrice',merchantConfig.defaultPurchasePrice)">
                <qf-radio label="refPurchasePrice">商品参考进货价</qf-radio>
                <qf-radio label="lastPurchasePrice">上次进货价</qf-radio>
              </qf-radio-group>
            </qf-col>
          </qf-row>
          <qf-row class="list">
            <qf-col :span="12">
              <label class="qf-form-label label-style">汇率算法</label>
            </qf-col>
            <qf-col :span="12">
              <qf-radio-group class="height-style" v-model="merchantConfig.exchangeRate"
                              @input="saveModify('exchangeRate',merchantConfig.exchangeRate)">
                <qf-radio label="multiply">美元 × 汇率 = 人民币</qf-radio>
                <qf-radio label="divide">美元 ÷ 汇率 = 人民币</qf-radio>
              </qf-radio-group>
            </qf-col>
          </qf-row>
        </section>
      </div>
    </page-body>
  </div>
</template>
<script lang="ts" src='./BusinessSetting.ts'></script>
<style lang="scss">
  @import '~styles/var.scss';

  .business-setting {
    height: 100%;
    .contents {
      padding-top: 40px;
      background-color: white;
      .header {
        padding: 20px 0;
        margin: 0 20px;
        border-bottom: 1px dashed $--color-font-light-3;
      }
      .list {
        padding: 10px 20px;
      }

      .percentage {
        line-height: 36px;
      }
      .height-style {
        height: 36px;
        line-height: 36px;
        label {
          margin-top: 10px;
        }
      }
      .label-style {
        font-size: 14px;
        color: #303133;
        line-height: 36px;
        box-sizing: border-box;
        vertical-align: middle;
      }
      .onlyTax {
        background: $--color-bg;
        margin: 10px 20px;
        .onlyTaxExplain {
          color: $--color-font-light-3;
        }
      }
    }
  }
</style>
