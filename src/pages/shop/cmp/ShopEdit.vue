<template>
  <qf-dialog-def class="shop-edit" :title="title"
                 @cancel="doCancel" @confirm="doConfirm" confirm-text="保存">
    <div class="content">
      <h3>基本信息</h3>
      <qf-form-item label="门店编号" :required="true">
        <qf-input v-model="shop.code" :maxlength="limits.code" v-form:code="validator"
        ></qf-input>
      </qf-form-item>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="门店名称" :required="true">
            <qf-input v-model="shop.name" v-form:name="validator"
                      :maxlength="limits.name"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="门店简称" :required="true">
            <qf-input v-model="shop.shortName" v-form:shortName="validator"
                      :maxlength="limits.name"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <h3>联系信息</h3>
      <qf-row class="width-limit">
        <qf-form-item label="地址" required>
          <qf-row placeholder="请选择">
            <qf-col :span="8" class="padding-right-10">
              <qf-select v-model="province" placeholder="省" v-form:province='validator'>
                <qf-option v-for="(item, index) in provinceArray" :value="item.text" :label="item.text" :key="index">
                  {{item.text}}
                </qf-option>
              </qf-select>
            </qf-col>
            <qf-col :span="8" class="padding-right-10">
              <qf-select v-model="city" placeholder="市" v-form:city='validator'>
                <qf-option v-for="(item, index) in cityArray" :value="item.text" :label="item.text" :key="index">
                  {{item.text}}
                </qf-option>
              </qf-select>
            </qf-col>
            <qf-col :span="8" class="padding-right-10">
              <qf-select v-model="county" placeholder="区/县" v-form:county='validator'>
                <qf-option v-for="(item, index) in countyArray" :value="item.text" :label="item.text" :key="index">
                  {{item.text}}
                </qf-option>
              </qf-select>
            </qf-col>
          </qf-row>
          <qf-row class="marTop12">
            <qf-col :span="8" class="padding-right-10">
              <qf-select v-model="street" placeholder="街道" v-form:street='validator'>
                <qf-option v-for="(item, index) in streetArray" :value="item.text" :label="item.text" :key="index">
                  {{item.text}}
                </qf-option>
              </qf-select>
            </qf-col>
            <qf-col :span="16" class="padding-right-10">
              <qf-input type="text" placeholder="详细地址" :maxlength="32" v-model="addressDtl"
                        v-form:addressDtl='validator'></qf-input>
            </qf-col>
          </qf-row>
        </qf-form-item>
      </qf-row>
      <qf-row class="marTop12">
        <qf-col :span="12">
          <qf-form-item label="联系人">
            <qf-input v-model="shop.contactInfo.contact"
                      :maxlength="limits.contact"></qf-input>
          </qf-form-item>
          <qf-form-item label="传真">
            <qf-input v-model="shop.contactInfo.fax"
                      :maxlength="limits.fax" v-form:fax="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮编">
            <qf-input v-model="shop.contactInfo.postcode"
                      :maxlength="limits.postcode" v-form:postCode="validator"></qf-input>
          </qf-form-item>
        </qf-col>
        <qf-col :span="12" class="padding-left-15">
          <qf-form-item label="联系电话">
            <qf-input v-model="shop.contactInfo.mobile"
                      :maxlength="limits.mobile" v-form:mobile="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="QQ">
            <qf-input v-model="shop.contactInfo.qq"
                      :maxlength="limits.qq" v-form:qq="validator"></qf-input>
          </qf-form-item>
          <qf-form-item label="邮箱">
            <qf-input v-model="shop.contactInfo.email"
                      :maxlength="limits.email" v-form:email="validator"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./ShopEdit.ts"/>

<style lang="scss">
  @import '~styles/base.scss';

  .shop-edit {
    .content {
      padding: 20px 0;
      min-width: 500px;
      min-height: 200px;
      .marTop12 {
        margin-top: 12px;
      }
      .width-limit{
        max-width:565px;
      }
      .receivable {
        text-align: right
      }
      .padding-left-15 {
        padding-left: 15px;
      }
      .padding-right-10{
        &:nth-child(-n+3) {
          padding-right: 10px;
        }
      }
    }
    .qf-dialog-body {
      overflow: visible;
    }
    .qf-dialog-footer-left {
      text-align: right;
      padding-right: 15px;
    }
  }
</style>
