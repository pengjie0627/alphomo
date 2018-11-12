<template>
  <qf-page-body class="inventory-in-view" :menu="menu">

    <div slot="actions">
      <qf-checkbox label="自动拆单入库" v-model="canInput" @input="checkStatus"></qf-checkbox>
      <qf-button type="primary" @click="doConfirmEntry" v-if="hasPermissions('inventory.storage.storage')">确定入库</qf-button>
      <qf-button type="default" @click="doGoback">取消</qf-button>
    </div>

    <qf-bill-body>
      <qf-bill-view-title slot="title" title="入库单">
        <span slot="tips">单号：{{bill.billNum}}</span>
      </qf-bill-view-title>

      <qf-row slot="header">
        <qf-col :span="8">
          <qf-form-item label="出库仓库：">
            <span class="line-height-36" v-if="bill.warehouse && bill.warehouse.name">{{bill.warehouse.name}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="经办人：" required>
            <search display-field="name" :value="bill.manager" type="user" v-form:manager="validator"
                    @select="setRowCustomer"
                    @clear="onCustomerClear"></search>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务日期：">
            <span class="line-height-36">{{bill.businessDate}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>
      <qf-row slot="header">
        <qf-col :span="8">
          <qf-form-item label="关联业务：">
            <span class="line-height-36" v-if="bill.source && bill.source.billNum">{{bill.source.billType | businessType}} {{bill.source.billNum}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="订单号：">
            <span class="line-height-36">{{bill.externalBillNum}}</span>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <div slot="toolbar">
        <qf-button type="primary" :disabled="!(selectedData && selectedData.length)" @click="doDelete">删除</qf-button>
      </div>

      <inventory-in-edit-table slot="table" :data="bill.lines" :is-disabled="isDisabled"
                               @selectData="onSelectData"></inventory-in-edit-table>

      <qf-row slot="remark">
        <qf-col :span="24">
          <qf-form-item label="备注：">
            <qf-input placeholder="请输入备注" v-model="bill.remark" :maxlength="limits.remark"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <span slot="operateLog" class="font-tips" v-if="bill.creator && bill.creator.name">制单：{{bill.creator.name}} {{bill.created}}</span>

      <div slot="bottomActions">
        <qf-checkbox v-model="canInput" label="自动拆单入库" @input="checkStatus"></qf-checkbox>
        <qf-button type="primary" @click="doConfirmEntry" v-if="hasPermissions('inventory.storage.storage')">确定入库</qf-button>
        <qf-button type="default" @click="doGoback">取消</qf-button>
      </div>

    </qf-bill-body>

  </qf-page-body>
</template>

<script lang="ts" src="./InventoryInEdit.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-in-view {

    .line-height-36 {
      display: block;
      line-height: 20px;
      padding: 8px 0;
      word-wrap: break-word;
    }

    .qf-form-label {
      padding-left: 8px;
    }

    .font-tips {
      line-height: 36px;
      color: $--color-placeholder;
    }

    .qf-checkbox {
      padding: 0 32px 0 0;
    }

  }
</style>
