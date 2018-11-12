<template>
  <div class="detail-button">
    <qf-button :type="type?type:'primary'" @click="onAudit"
               v-if="hasPermissions('purchase.purchase.audit')&& (btnPerm[0] = true)&& btnStatus[0].show">审核
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onReturn"
               v-if="hasPermissions('purchase.purchaseReturn.create')&& (btnPerm[1] = true)&&btnStatus[1].show">退货
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onAbolish"
               v-if="hasPermissions('purchase.purchase.abolish')&& (btnPerm[2] = true)&&btnStatus[2].show">
      作废
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onEdit"
               v-if="hasPermissions('purchase.purchase.create')&& (btnPerm[3] = true)&&btnStatus[3].show">编辑
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onDel"
               v-if="hasPermissions('purchase.purchase.delete')&& (btnPerm[4] = true)&&btnStatus[4].show">删除
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onCopy"
               v-if="hasPermissions('purchase.purchase.create')&& (btnPerm[5] = true)&&btnStatus[5].show">复制
    </qf-button>
    <qf-button :type="type?type:'default'" @click="onExport" v-if="hasPermissions('purchase.purchase.export') && target === 'detail'">
      导出
    </qf-button>
    <print-view :id="id" type="Purchase" btnType="default"
                v-if="hasPermissions('purchase.purchase.print') && target === 'detail'"></print-view>
    <print-pre-view :id="id" type="Purchase" btnType="default"
                v-if="hasPermissions('purchase.purchase.print') && target === 'detail'"></print-pre-view>
    <print-maintenance-view type="Purchase" btnType="default"
                            v-if="hasPermissions('system.system.setup') && target === 'detail'"></print-maintenance-view>

    <qf-dropdown trigger="click" class="dropdown" v-if="btnShow.length > 3 && target === 'list'">
      <template>
        <span slot="text">更多 <qf-font-icon name="ic-ic_xiangxia"></qf-font-icon></span>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchase.audit')&& btnMore[0].show" @click="onAudit">审核</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchaseReturn.create')&& btnMore[1].show" @click="onReturn">退货
        </qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchase.abolish')&& btnMore[2].show" @click="onAbolish">作废</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchase.create')&& btnMore[3].show" @click="onEdit">编辑</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchase.delete')&& btnMore[4].show" @click="onDel">删除</qf-dropdown-menu>
        <qf-dropdown-menu v-if="hasPermissions('purchase.purchase.create')&& btnMore[5].show" @click="onCopy">复制</qf-dropdown-menu>
      </template>
    </qf-dropdown>
  </div>

</template>
<script lang="ts" src="./PurchaseViewButton.ts"/>

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
