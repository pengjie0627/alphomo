<template>
  <page-body class="storage-rpt-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="default" @click="onExport()"
                 v-if="hasPermission('report.inventory.export')">导出
      </qf-button>
    </div>

    <!-- 列表页面模板 -->
    <qf-row class="common-style date-style">
      <qf-col :span="10">
        <qf-form-item label="业务日期">
          <qf-date-picker v-model="businessDate" value-format="yyyy-MM-dd"></qf-date-picker>
        </qf-form-item>
      </qf-col>
      <qf-col :span="14">
        <qf-radio-group v-model="businessTime" class="radio-style">
          <qf-radio-button label="今天"></qf-radio-button>
          <qf-radio-button label="昨天"></qf-radio-button>
        </qf-radio-group>
      </qf-col>
    </qf-row>


    <!--汇总栏-->
    <qf-row class="common-style total-border">
      <qf-col :span="3">
        <div class="total-style">
          <div>库存成本总额（去税）</div>
          <div v-if="hasPermission('price.costPrice')" class="storage-taxExcAmount">￥{{taxExcAmount}}</div>
          <div v-else class="storage-amount">*****</div>
        </div>
      </qf-col>
      <qf-col :span="3">
        <div class="total-style storage-border-right">
          <div>库存成本总额（含税）</div>
          <div v-if="hasPermission('price.costPrice')" class="storage-amount">￥{{amount}}</div>
          <div v-else class="storage-amount">*****</div>
        </div>
      </qf-col>
      <qf-col :span="5">
        <div class="total-style">
          <div>库存成本最高商品</div>
          <div class="storage-common-color">{{maxAmountSku}}</div>
        </div>
      </qf-col>
      <qf-col :span="4">
        <div class="total-style">
          <div>该商品成本总额</div>
          <div v-if="hasPermission('price.costPrice')" class="storage-common-color">
            {{amountOfMaxAmountSku | fmt}}
          </div>
          <div v-else class="storage-common-color">*****</div>
        </div>
      </qf-col>
      <qf-col :span="4">
        <div class="total-style">
          <div>该商品成本占比</div>
          <div v-if="hasPermission('price.costPrice')" class="storage-common-color">{{percentOfMaxAmountSku}}</div>
          <div v-else class="storage-common-color">*****</div>
        </div>
      </qf-col>
    </qf-row>

    <!-- 列表栏 -->
    <storage-rpt-list-sku
      :date="businessDate"
      ref="storageList"></storage-rpt-list-sku>

  </page-body>
</template>

<script lang="ts" src="./StorageRptList.ts">

</script>

<style lang="scss">
  .storage-rpt-list {

    .common-style {
      padding: 0 25px;
      background-color: white;
    }
    .date-style {
      padding-bottom: 15px;
      padding-top: 15px;
      border-bottom: 1px solid #eeeeee;
      .radio-style {
        position: relative;
        margin-left: 30px;
      }
    }
    .storage-border-right {
      border-right: 1px solid #ccc;
    }
    .total-style {
      margin: 20px;
      margin-left: 0;
      color: #999999;
      .storage-amount {
        color: #FF554B;
        font-weight: bold;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .storage-taxExcAmount {
        color: #64c73e;
        font-weight: bold;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .storage-common-color {
        color: black;
        font-weight: bold;
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .total-border {
      border-bottom: 1px solid #eeeeee;
    }
    .total-fir-style {
      border-right: 1px solid #eeeeee;
    }
    .type-padding {
      padding: 15px 0;
      padding-bottom: 0;
      margin-bottom: 0;
      background-color: white;
      padding-left: 20px;
    }

  }
</style>
