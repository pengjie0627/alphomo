<template>
  <page-body :menu="menu" class="sku-detail">
    <div slot="actions" class="button-action">
      <qf-button type="primary" @click="doEdit" v-if="hasPermissions('basicdata.sku.create')">
        编辑
      </qf-button>
      <qf-button type="default" @click="doDelete" v-if="hasPermissions('basicdata.sku.delete')">
        删除
      </qf-button>
    </div>
    <div class="content">
      <qf-row class="marginTop12">
        <qf-col :span="4">
          <div class="info">基本信息</div>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="商品名称:">
            <p class="sku-name" :title="sku.name">{{sku.name}}</p>
          </qf-form-item>
          <qf-form-item label="商品编号:">
            {{sku.code}}
          </qf-form-item>
          <qf-form-item label="分类:">
            {{sku.category.name}}
          </qf-form-item>
          <qf-form-item label="规格:">
            {{sku.qpc}}
          </qf-form-item>
          <qf-form-item label="品牌:">
            {{sku.brand}}
          </qf-form-item>
          <qf-form-item label="采购组:">
            {{sku.purchaseGroup}}
          </qf-form-item>
          <qf-form-item label="进项税率:">
            {{sku.inputTaxRate | taxRateFormatter}}
          </qf-form-item>
          <qf-form-item label="税收分类编码:">
           {{sku.taxClassification}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="margin-right-20">
          <qf-form-item label="商品条码:">
            {{sku.barcode}}
          </qf-form-item>
          <qf-form-item label="外部编码:">
            {{sku.externalCode}}
          </qf-form-item>
          <qf-form-item label="单位:">
            <span v-if="sku.skuMunitList.length === 0"> {{sku.munit}} </span>
            <span v-if="sku.skuMunitList.length > 0">{{ munits }}</span>
            <div class="muint-label" v-if="sku.skuMunitList.length > 0">{{ skuMunits }}</div>
          </qf-form-item>
          <qf-form-item label="包装:">
            {{sku.spec}}
          </qf-form-item>
          <qf-form-item label="产地:">
            {{sku.origin}}
          </qf-form-item>
          <qf-form-item label="所属供应商:">
            {{sku.supplier && sku.supplier.name}}
          </qf-form-item>
          <qf-form-item label="销项税率:">
            {{sku.outputTaxRate | taxRateFormatter}}
          </qf-form-item>
          <qf-form-item label="助记码:">
            <p class="sku-smartCodes" :title="sku.smartCodes">{{sku.smartCodes}}</p>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row class="marginTop40">
        <qf-col :span="4">
          <div class="price">价格信息</div>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="批发价(含税):">
            {{sku.wholePrice | price}}
          </qf-form-item>
          <qf-form-item label="零售价(含税):">
            {{sku.salePrice | price}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="12">
          <qf-form-item v-if="hasPermissions('price.refPurchasePrice')" label="参考进价(含税):">
            {{sku.refPurchasePrice | PriceBit(merchantConfig.purchasePriceBit)}}
            <label class="small-label" v-if="!merchantConfig.inputOnlyTax&&merchantConfig.enableInputTaxRateSupport">
              参考进价(去税):
            <span class="paddingLeft10">{{sku.taxExcRefPurchasePrice | PriceBit(merchantConfig.purchasePriceBit)}}</span>
            </label>
          </qf-form-item>
          <qf-form-item label="参考进价(含税):" v-else>
            *****
          </qf-form-item>
          <qf-form-item label="最低售价(含税):" class="width:40px">
            {{sku.minSalePrice | price}}
          </qf-form-item>
        </qf-col>
      </qf-row>

      <qf-row class="marginTop40">
        <qf-col>
          <qf-row class="font-tips" v-if="sku.lastModifier&&sku.lastModifier.name">
            <div class="tip-width">
              最后修改：{{sku.lastModifier&&sku.lastModifier.name}}
            </div>
            <div>
              {{sku.lastModified}}
            </div>
          </qf-row>
          <qf-row class="font-tips" v-if="sku.creator&&sku.creator.name">
            <div class="tip-width">
              创建：{{sku.creator&&sku.creator.name}}
            </div>
            <div>
              {{sku.created}}
            </div>
          </qf-row>
        </qf-col>
        <qf-col>
          <div class="button-action">
            <qf-button type="primary" @click="doEdit" v-if="hasPermissions('basicdata.sku.create')">
              编辑
            </qf-button>
            <qf-button type="default" @click="doDelete" v-if="hasPermissions('basicdata.sku.delete')">
              删除
            </qf-button>
          </div>
        </qf-col>
      </qf-row>
    </div>
  </page-body>
</template>
<script lang="ts" src="./SkuDetail.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .sku-detail {
    .content {
      background: $--color-white;
      padding: 20px;
      .price {
        line-height: 36px;
        font-size: 16px;
        font-weight: bold;
      }
      .info {
        line-height: 36px;
        font-size: 16px;
        font-weight: bold;
      }
      .margin-right-20 {
        margin-left: 20px;
      }
      .marginTop40 {
        .qf-form-item .qf-form-label{
          min-width: 110px;
        }
        margin-top: 40px;
      }
      .muint-label {
        display: inline-block;
        font-size: 12px;
        -webkit-transform : scale(0.88,0.88);
        vertical-align:bottom;
      }
      .marginTop12 {
        margin-top: 12px;
      }
      .qf-form-content {
        line-height: 36px;
      }
      .marTop12 {
        margin-top: 12px;
      }
      .receivable {
        text-align: right
      }
      .sku-smartCodes {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .font-tips {
        font-size: 14px;
        line-height: 36px;
        color: #606266;
      }
      .button-action {
        text-align: right
      }
      .tip-width {
        width: 300px;
      }
      .small-label {
        padding-left:20px;
        font-size:12px;
        color:gray
      }
      .paddingLeft10 {
        padding-left: 10px;
      }
    }
  }
</style>
