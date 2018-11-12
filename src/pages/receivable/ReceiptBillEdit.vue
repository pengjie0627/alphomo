<template>
  <div class="pay-bill-edit">
    <page-body :menu="menuList">
      <template slot="actions">
        <qf-button type="primary" @click="onSave" v-if="hasPermissions('finance.receivable.create')">保存</qf-button>
        <qf-button @click="onCancel">取消</qf-button>
      </template>
      <div class="content">
        <bill-body class="bill-content" v-if="receipt.status!=='AUDITED'">
          <bill-view-title slot="title" title="收款单" :receipt="receipt" :isView="isView" :billNum="billNum">
          </bill-view-title>
          <div slot="header" class="search">
            <qf-row>
              <qf-col class="header-col">
                <qf-form-item required label="客户" v-if="!isEdit">
                  <search display-field="name" v-model="receipt.customer" @input="onCustomerChange"
                          type="customer" v-form:customer="validator" v-form:billCustomer="billValidator"
                          placeholder="请输入名称/助记码/编码查询"/>
                </qf-form-item>
                <qf-form-item required label="客户" v-if="isEdit">
                  {{receipt.customer.name}}
                </qf-form-item>
              </qf-col>
              <qf-col class="header-col">
                <qf-form-item required label="经办人">
                  <search display-field="name" v-model="receipt.manager" @input="onManagerChange" type="user"
                          v-form:manager="validator" placeholder="请输入名称查询"/>
                </qf-form-item>
              </qf-col>
              <qf-col class="header-col">
                <qf-form-item required label="业务日期">
                  <qf-date-picker v-model="receipt.businessDate" v-form:businessDate="validator"
                                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" disabled="true"
                  ></qf-date-picker>
                </qf-form-item>
              </qf-col>
            </qf-row>
          </div>

          <bill-edit-money-table slot="table" :receipt="receipt" ref="saleTable"
                                 @getSumAmount="getSumAmount"></bill-edit-money-table>

          <div slot="summary">
            <qf-row class="remark">
              <qf-form-item label="备注：" label-width="80px">
                <qf-input v-model="receipt.remark" placeholder="请输入备注内容" v-form:remark="validator"
                          :maxlength="limits.remark"></qf-input>
              </qf-form-item>
            </qf-row>
          </div>
          <div slot="remark" class="imgs">
            <qf-form-item label="图片附件：" label-width="80px">
              <div class="qf-img-upload-btn">
                <qf-img-upload upload-type="shop" :total="5" @getImage="getImage" v-model="imgUploadData">
                </qf-img-upload>
              </div>
            </qf-form-item>
          </div>
          <operate-log-view slot="operateLog" class="operate-log" :logs="logs"></operate-log-view>
        </bill-body>
        <bill-body class="sale-detail-body" v-if="receipt.status=='AUDITED'">
          <bill-view-title slot="title" title="收款单" :receipt="receipt" :isView="isView"
                           :billNum="billNum" :status="status" :ids="ids" :query="query"></bill-view-title>
          <template slot="header">
            <qf-row class="sale-view-header">
              <qf-col :span="8">
                <qf-form-item class="sku-code" label="客户：" labelWidth="70px">
                  <span>{{receipt.customer.name}}</span>
                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item class="sku-code" label="经办人：" labelWidth="70px">
                  {{receipt.manager.name}}

                </qf-form-item>
              </qf-col>
              <qf-col :span="8">
                <qf-form-item class="sku-code" label="业务日期：" labelWidth="90px">
                  <span>{{receipt.businessDate | dateFormatter}}</span>
                </qf-form-item>
              </qf-col>

            </qf-row>
          </template>
          <div slot="table">
            <bill-view-money-table :receipt="receipt"></bill-view-money-table>
          </div>

          <template slot="summary">
            <qf-form-item label="备注：">
              <span>{{receipt.remark}} </span>
            </qf-form-item>
          </template>
          <div slot="remark">
            <qf-form-item label="图片附件：">
              <qf-img-group v-model="model" :value="model"></qf-img-group>

            </qf-form-item>

          </div>
          <operate-log-view slot="operateLog" class="operate-log" :logs="logs"></operate-log-view>
          <div slot="bottomActions" v-if="status=='ABOLISHED'" class="bottomAction">
            <qf-form-item label="单据状态：">
            <span class="tag">  <qf-tag type="err" class="ml15"
            >{{receipt.status | statusFormatter}}</qf-tag> </span>
            </qf-form-item>
          </div>

        </bill-body>
        <div class="bottom">
          <bill-edit-action-table :receipt="receipt" :billValidator="billValidator" @getLines="onGetLines"
          ></bill-edit-action-table>

          <div class="bottomAction">
            <qf-button type="primary" @click="onSave" v-if="hasPermissions('finance.receivable.create')">保存</qf-button>
            <qf-button @click="onCancel">取消</qf-button>
          </div>
        </div>
      </div>

    </page-body>
  </div>
</template>

<script lang="ts" src="./ReceiptBillEdit.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .pay-bill-edit {
    height: 100%;
    .content {
      background: #ffffff;
      .qf-form-label {
        text-align: left;
        padding-left: 5px;
      }
      .qf-form-content {
        line-height: 36px;
      }
      .remark {
        .qf-form-item {
          width: 100%
        }
      }
      .imgs {
        margin-top: 15px;
      }
      .bottom {
        padding: 0 20px;
        .bottomAction {
          padding: 10px;
          text-align: right
        }
      }
      .search {
        line-height: 36px;
      }

    }
    .qf-popper {
      top: 36px !important;
    }

  }
</style>
