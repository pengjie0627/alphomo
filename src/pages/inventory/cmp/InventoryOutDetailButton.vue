<template>
  <div class="inventory-out-detail-button">
    <qf-button type="primary" @click="doAudit" v-if="bill.status === 'UNAUDITED'&&hasPermissions('inventory.deliver.deliver')">
      出库
    </qf-button>
    <print-view :id="bill.id" type="inventoryOut" btnType="default"
                v-if="hasPermissions('inventory.deliver.print')"></print-view>
    <print-pre-view :id="bill.id" type="inventoryOut" btnType="default"
                    v-if="hasPermissions('inventory.deliver.print')"></print-pre-view>
    <print-maintenance-view type="inventoryOut" btnType="default"
                            v-if="hasPermissions('system.system.setup')"></print-maintenance-view>
  </div>
</template>
<script lang="ts" src="./InventoryOutDetailButton.ts"/>
