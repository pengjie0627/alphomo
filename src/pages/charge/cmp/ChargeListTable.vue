<template>
    <div class="charge-table-list">
      <qf-table
        ref="tableDef"
        @selection-change="selectionChange"
        @sort-change="sortChange"
        :data="tableData">
        <qf-table-column type="selection" align="center"/>
        <qf-table-column label="操作" align="center" width="100px">
          <template slot-scope="props">
            <qf-button type="link" v-if="props.row.payStatus === 'UNPAID' && props.row.status === 'UNAUDITED' && hasPermissions('finance.charge.audit')" @click="onAudit(props.row)">审核</qf-button>
            <qf-button type="link" v-if="props.row.payStatus === 'UNPAID' && props.row.status === 'AUDITED' && hasPermissions('finance.charge.abolish')" @click="onAbolish(props.row)">作废</qf-button>
            <qf-button type="link" v-if="props.row.payStatus === 'UNPAID' && props.row.status === 'UNAUDITED' && hasPermissions('finance.charge.create')" @click="goToEdit(props.row)">编辑</qf-button>
          </template>
        </qf-table-column>
        <qf-table-column label="单号" prop="billNum" width="120px" align="center" sortable>
          <template slot-scope="props">
            <qf-button class="textOverflow" @click="goToChargeDetail(props.row.id)" type="link">{{ props.row.billNum }}</qf-button>
          </template>
        </qf-table-column>
        <qf-table-column label="业务日期" prop="businessDate" :formatter="dateFormatter" sortable></qf-table-column>
        <qf-table-column label="供应商" prop="supplier.name"></qf-table-column>
        <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
        <qf-table-column label="单据状态" prop="status" align="center">
          <template slot-scope="props">
            <!--<qf-pill v-if="props.row.status === 'UNAUDITED'" type="danger">未审核</qf-pill>-->
            <!--<qf-pill v-if="props.row.status === 'AUDITED'" type="success">已审核</qf-pill>-->
            <!--<qf-pill v-if="props.row.status === 'ABOLISHED'">已作废</qf-pill>-->
            <span :class="[statusFormatter(props.row.status)]">{{props.row.status | status}}</span>
          </template>
        </qf-table-column>
        <qf-table-column label="付款状态" prop="payStatus" align="center">
          <template slot-scope="props">
            <span v-if="props.row.payStatus === 'UNPAID'" class="danger">未付款</span>
            <span v-if="props.row.payStatus === 'PAID'" class="success">已付款</span>
          </template>
        </qf-table-column>
        <qf-table-column label="付款类型" prop="category" align="center" :formatter="categoryFormatter"></qf-table-column>
        <qf-table-column label="费用金额(元)" prop="amount" align="right" sortable>
          <template slot-scope="props">
            <div v-if="props.row.status !== 'ABOLISHED'" style="color: #f93e61">{{props.row.amount | fmt}}</div>
            <div v-if="props.row.status === 'ABOLISHED'" style="color: #CCCCCC">{{props.row.amount | fmt}}</div>
          </template>
        </qf-table-column>
      </qf-table>
    </div>
</template>

<script lang="ts" src='./ChargeListTable.ts'></script>

<style lang="scss">
  @import '~styles/var.scss';
.charge-table-list {
  .danger {
    color: #FFCC66;
  }
  .success {
    color:  #33CC66;
  }
  .info {
    color: $--color-info;
  }
  .warning {
    color: #FE514D
  }
}
</style>
