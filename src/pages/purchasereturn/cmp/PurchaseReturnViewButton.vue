<template>
  <div class="detail-button">
    <qf-button :type="type?type:'primary'" @click="onAudit"
               v-if="hasPermissions('purchase.purchaseReturn.audit')&& (btnPerm[0] = true)&& btnStatus[0].show">审核
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onAbolish"
               v-if="hasPermissions('purchase.purchaseReturn.abolish')&& (btnPerm[1] = true)&&btnStatus[1].show">
      作废
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onEdit"
               v-if="hasPermissions('purchase.purchaseReturn.create')&& (btnPerm[2] = true)&&btnStatus[2].show">编辑
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onDel"
               v-if="hasPermissions('purchase.purchaseReturn.delete')&& (btnPerm[3] = true)&&btnStatus[3].show">删除
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onCopy"
               v-if="hasPermissions('purchase.purchaseReturn.create')&& (btnPerm[4] = true)&&btnStatus[4].show">
      复制
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onExport"
               v-if="hasPermissions('purchase.purchaseReturn.export') && target === 'detail'">导出
    </qf-button>
    <print-view :id="id" type="PurchaseReturn" btnType="default"
                v-if="hasPermissions('purchase.purchaseReturn.print') && target === 'detail'"></print-view>
    <print-pre-view :id="id" type="PurchaseReturn" btnType="default"
                v-if="hasPermissions('purchase.purchaseReturn.print') && target === 'detail'"></print-pre-view>
    <print-maintenance-view type="PurchaseReturn" btnType="default"
                            v-if="hasPermissions('system.system.setup') && target === 'detail'"></print-maintenance-view>

    <qf-dropdown trigger="click" class="dropdown" v-if="btnShow.length > 3 && target === 'list'">
      <template>
        <span slot="text">更多 <qf-font-icon name="ic-ic_xiangxia"></qf-font-icon></span>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchaseReturn.audit')&& btnMore[0].show" @click="onAudit">审核</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchaseReturn.abolish')&& btnMore[1].show" @click="onAbolish">作废
        </qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchaseReturn.create')&& btnMore[2].show" @click="onEdit">编辑
        </qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchaseReturn.delete')&& btnMore[3].show" @click="onDel">删除</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchaseReturn.create')&& btnMore[4].show" @click="onCopy">复制
        </qf-dropdown-menu>
      </template>
    </qf-dropdown>
  </div>

</template>
<script lang="ts" src="./PurchaseReturnViewButton.ts"/>

<style lang="scss">
  .detail-button {
    float: right;
    .dropdown {
      display: inline-block;
      .qf-button {
        padding: 0;
        background: none !important;
        display: inline-block;
        margin-left: 12px;
        border: none;
        color: #007ace;
        &:hover {
          color: red;
        }
      }
    }
  }
</style>
