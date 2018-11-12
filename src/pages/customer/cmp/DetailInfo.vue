<template>
  <div class="detail-info">
    <div class="content">
      <qf-row>
        <qf-col :span="4"><h3>基本信息</h3></qf-col>
        <qf-col :span="10">
          <qf-form-item label="客户编号:">
            {{customer.code}}
          </qf-form-item>
          <qf-form-item label="期初应收欠款:">
            {{customer.receivable | priceFormatter}}
          </qf-form-item>
          <qf-form-item label="客户类型:">
            {{customer.category | customerCategory}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="10">
          <qf-form-item label="客户名称:">
            {{customer.name}}
          </qf-form-item>
          <qf-form-item label="助记码:">
            {{customer.smartCodes}}
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row class="marTop12">
        <qf-col :span="4"><h3>联系信息</h3></qf-col>
        <qf-col :span="10">
          <qf-form-item label="地址:">
            {{customer.contactInfo.address}}
          </qf-form-item>
          <qf-form-item label="联系人:">
            {{customer.contactInfo.contact}}
          </qf-form-item>
          <qf-form-item label="传真:">
            {{customer.contactInfo.fax}}
          </qf-form-item>
          <qf-form-item label="QQ:">
            {{customer.contactInfo.qq}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="10">
          <qf-form-item label="邮编:">
            {{customer.contactInfo.postcode}}
          </qf-form-item>
          <qf-form-item label="联系电话:">
            {{customer.contactInfo.mobile}}
          </qf-form-item>
          <qf-form-item label="邮箱:">
            {{customer.contactInfo.email}}
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
