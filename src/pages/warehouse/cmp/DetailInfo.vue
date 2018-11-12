<template>
  <div class="detail-info">
    <div class="content">
      <qf-row>
        <qf-col :span="4"><h3>基本信息</h3></qf-col>
        <qf-col :span="10">
          <qf-form-item label="编号:">
            {{warehouse.code}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="10">
          <qf-form-item label="名称:">
            {{warehouse.name}}
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row class="marTop12">
        <qf-col :span="4"><h3>联系信息</h3></qf-col>
        <qf-col :span="10">
          <qf-form-item label="地址:">
            {{warehouse.contactInfo.address}}
          </qf-form-item>
          <qf-form-item label="联系人:">
            {{warehouse.contactInfo.contact}}
          </qf-form-item>
          <qf-form-item label="传真:">
            {{warehouse.contactInfo.fax}}
          </qf-form-item>
          <qf-form-item label="邮编:">
            {{warehouse.contactInfo.postcode}}
          </qf-form-item>
        </qf-col>
        <qf-col :span="10">

          <qf-form-item label="联系电话:">
            {{warehouse.contactInfo.mobile}}
          </qf-form-item>
          <qf-form-item label="QQ:">
            {{warehouse.contactInfo.qq}}
          </qf-form-item>
          <qf-form-item label="邮箱:">
            {{warehouse.contactInfo.email}}
          </qf-form-item>
          <qf-form-item label="仓库分类:">
            {{warehouse.category == "CAR" ? "车辆" : "一般仓库"}}
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
