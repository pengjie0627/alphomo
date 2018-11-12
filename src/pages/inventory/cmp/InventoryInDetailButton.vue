<template>
  <div class="inventory-in-detail-button">
    <qf-button type="primary" @click="doAudit" v-if="bill.status === 'UNAUDITED'&&hasPermissions('inventory.storage.storage')">
      入库
    </qf-button>
    <print-view :id="bill.id" type="inventoryIn" btnType="default"
                v-if="hasPermissions('inventory.storage.print')"></print-view>
    <print-pre-view :id="bill.id" type="inventoryIn" btnType="default"
                    v-if="hasPermissions('inventory.storage.print')"></print-pre-view>
    <print-maintenance-view type="inventoryIn" btnType="default"
                            v-if="hasPermissions('system.system.setup')"></print-maintenance-view>
  </div>
</template>
<script lang="ts" src="./InventoryInDetailButton.ts"/>
