<template>
  <div class="detail-info">
    <div class="content">
      <qf-row>
        <qf-col :span="4"><h3>基本信息</h3></qf-col>
        <qf-col :span="10">
          <qf-form-item label="供应商编号:">
            {{supplier.code}}
          </qf-form-item>
          <qf-form-item label="期初应收收款:">
            {{supplier.payable | price}}
          </qf-form-item>
          <qf-form-item label="发票抬头:">
            {{supplier.invoiceTitle}}
          </qf-form-item>
          <qf-form-item label="银行账户:">
            {{supplier.bankAccount}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="10">
          <qf-form-item label="供应商名称:">
            {{supplier.name}}
          </qf-form-item>
          <qf-form-item label="助记码:">
            {{supplier.smartCodes}}
          </qf-form-item>
          <qf-form-item label="纳税人识别号:">
            {{supplier.registrationNo}}
          </qf-form-item>
          <qf-form-item label="银行名称:">
            {{supplier.bankName}}
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row class="marTop12">
        <qf-col :span="4"><h3>联系信息</h3></qf-col>
        <qf-col :span="10">
          <qf-form-item label="地址:">
            {{supplier.contactInfo.address}}
          </qf-form-item>
          <qf-form-item label="联系人:">
            {{supplier.contactInfo.contact}}
          </qf-form-item>
          <qf-form-item label="单位电话:">
            {{supplier.contactInfo.workPhone}}
          </qf-form-item>
          <qf-form-item label="传真:">
            {{supplier.contactInfo.fax}}
          </qf-form-item>
          <qf-form-item label="邮编:">
            {{supplier.contactInfo.postcode}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="10">

          <qf-form-item label="联系电话:">
            {{supplier.contactInfo.mobile}}
          </qf-form-item>
          <qf-form-item label="QQ:">
            {{supplier.contactInfo.qq}}
          </qf-form-item>
          <qf-form-item label="邮箱:">
            {{supplier.contactInfo.email}}
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
