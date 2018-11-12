<template>
  <div class="bill-edit-action-table">
    <div class="title">
      <qf-row>
        <qf-col :span="12">
          合计收款／核销已收款 ：{{receipt.totalRcvdAmount |price}}/{{pageReceivedAmount | price}}
        </qf-col>
        <qf-col :span="12" class="actions">
          <qf-button @click="doNewOther" type="default">核销其他收入</qf-button>
          <qf-button @click="doNewBill" type="default">核销单据</qf-button>
        </qf-col>
      </qf-row>
    </div>
    <!-- 数据列表 -->
    <qf-table :data="lines" row-key="id">
      <qf-table-column label="结算单据单号" prop="billNum"></qf-table-column>
      <qf-table-column label="单据类型" prop="billType" :formatter="billTypeFormatter"></qf-table-column>
      <qf-table-column label="业务日期" prop="billBusinessDate" :formatter="dateFormatter"></qf-table-column>
      <qf-table-column label="经办人" prop="billManager.name"></qf-table-column>
      <qf-table-column label="应收金额(元)" prop="amount" :formatter="priceFormatter"></qf-table-column>
      <qf-table-column label="剩余应收(元)" prop="remainAmount" :formatter="priceFormatter">
      </qf-table-column>
      <qf-table-column label="本次收款(元)">
        <template slot-scope="props">
          <qf-input v-model="props.row.rcvdAmount" scale="2" @change="onAmountChange(props.row)"></qf-input>
        </template>
      </qf-table-column>
      <qf-table-column label="操作">
        <template slot-scope="props">
          <span @click="remove(props.rowIndex,props.row.rcvdAmount)" class="red"><i
            class="iconfont qf-icon qf-img-delete ic-ic_clean"></i></span>
        </template>
      </qf-table-column>
    </qf-table>
  </div>

</template>

<script lang="ts" src="./BillEditActionTable.ts">
</script>

<style lang="scss">
  @import '~styles/var.scss';

  .bill-edit-action-table {
    border-top: 1px dashed $--color-font-light-3;
    padding-top: 10px;
    .title {
      padding: 10px 0;
    }
    .red {
      i {
        color: $--color-minor;
      }
    }
    .actions {
      text-align: right
    }
  }
</style>
