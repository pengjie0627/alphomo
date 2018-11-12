<template>
  <div class="detail-info">
    <div class="content">
      <h3>基本信息</h3>
      <qf-form-item label="商品条码" :required="true">
        <qf-input v-model="sku.barcode"
        ></qf-input>
      </qf-form-item>
      <qf-form-item label="商品名称" :required="true">
        <qf-input v-model="sku.name" v-form:name="validator"
                  :maxlength="limits.name"></qf-input>
      </qf-form-item>
      <qf-form-item label="规格">
        <qf-input class="receivable" v-model="sku.spec" type="number"
                  :maxlength="limits.amount" v-form:receivable="validator" scale="2"></qf-input>
      </qf-form-item>
      <qf-form-item label="品牌">
        <qf-input class="receivable" v-model="sku.spec" type="number"
                  :maxlength="limits.amount" v-form:receivable="validator" scale="2"></qf-input>
      </qf-form-item>
      <h3>价格信息</h3>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="批发价">
            <qf-input v-model="sku.wholePrice"
                      :maxlength="limits.mobile" v-form:mobile="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="进货价">
            <qf-input v-model="sku.refPurchasePrice"
                      :maxlength="limits.qq"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12">
          <qf-form-item label="建议零售价">
            <qf-input v-model="sku.salePrice"
                      :maxlength="limits.contact"></qf-input>
          </qf-form-item>
          <qf-form-item label="最低零售价">
            <qf-input v-model="sku.minSalePrice"
                      :maxlength="limits.mobile" v-form:mobile="validator"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </div>
  </div>
</template>

<script lang="ts" src="./DetailInfo.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .detail-info {
    padding: 20px;
    background: $--color-bg;
    .content {
      line-height: 36px;

      .marTop12 {
        margin-top: 12px;
      }
    }
  }
</style>
