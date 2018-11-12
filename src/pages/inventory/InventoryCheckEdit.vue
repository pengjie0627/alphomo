<template>
  <qf-page-body :menu="menu" class="inventory-check-edit">

    <div slot="actions">
      <qf-button type="default" @click="doSaveAndCreate"
                 v-if="!isEdit&&hasPermissions('inventory.check.create')">保存并新增
      </qf-button>
      <qf-button @click="doSave()" :type="isEdit?'primary':'primary'"
                 v-if="hasPermissions('inventory.check.create')">保存
      </qf-button>
      <qf-button @click="doSaveAndAudit"
                 v-if="hasPermissions('inventory.check.create') && hasPermissions('inventory.check.audit')">保存并审核
      </qf-button>
      <qf-button @click="doCancelEdit">取消</qf-button>
    </div>

    <qf-bill-body>

      <qf-bill-title slot="title" title="盘点单">
        <span slot="tips">单号：{{bill.billNum}}</span>
      </qf-bill-title>

      <qf-row slot="header">
        <qf-col :span="8">
          <qf-form-item label="仓库" required>
            <qf-select v-model="bill.warehouse" v-form:warehouse="validator" display-field="name"
                       value-key="id" @change="doWarehouseChange">
              <qf-option v-for="(item, index) in warehouseList" :value="doGetUcn(item)"
                         :label="item.name"
                         :key="index"></qf-option>
            </qf-select>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="经办人">
            <search v-form:manager="validator" display-field="name" type="user"
                    :value="bill.manager"
                    @select="setRowCustomer"
                    @clear="onCustomerClear"></search>
          </qf-form-item>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="盘点日期" required>
            <qf-date-picker type="date" v-model="bill.checkDate" v-form:businessDate="validator"
                            :disabled="true"></qf-date-picker>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <div slot="toolbar">
        <qf-button type="default" @click="onAddSku">选择商品</qf-button>
        <qf-button type="default" :disabled="!onDeletedStatus" @click="doDeletedLine">删除</qf-button>
      </div>
      <inventory-edit-table ref="goodsTable" slot="table" :lines="bill.lines" :bill="bill"
                            @selectionChange="onSelectionChange"
                            @linesChange="onLinesChange"
                            :validator="validator"></inventory-edit-table>

      <qf-row slot="remark">
        <qf-col :span="24">
          <qf-form-item label="备注：">
            <qf-input v-model="bill.remark" placeholder="请输入备注"
                      :maxlength="limits.remark"></qf-input>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <operate-log-view slot="operateLog" class="operate-log"
                        :logs="bill.operateLogs"></operate-log-view>

      <div slot="bottomActions">
        <qf-button type="default" @click="doSaveAndCreate"
                   v-if="!isEdit&&hasPermissions('inventory.check.create')">保存并新增
        </qf-button>
        <qf-button @click="doSave()" :type="isEdit?'primary':'primary'"
                   v-if="hasPermissions('inventory.check.create')">保存
        </qf-button>
        <qf-button @click="doSaveAndAudit"
                   v-if="hasPermissions('inventory.check.create') && hasPermissions('inventory.check.audit')">保存并审核
        </qf-button>
        <qf-button @click="doCancelEdit">取消</qf-button>
      </div>

    </qf-bill-body>
  </qf-page-body>
</template>

<script lang="ts" src="./InventoryCheckEdit.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .inventory-check-edit {

    .qf-form-label {
      padding-left: 8px;
    }

    .qf-row {
      margin: 10px auto;
    }

    .font-tips {
      line-height: 36px;
      color: $--color-placeholder;
    }

  }
</style>
