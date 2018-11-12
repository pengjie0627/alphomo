<template>
    <div class="charge-add-table">
      <qf-col :span="12">费用合计：<span class="item" style="color: #f93e61;font-weight: bold"> {{ bill.amount | fmt  }}</span></qf-col>
      <qf-table
        ref="tableDef"
        :data="lines"
        @table-keydown="onTableKeyDown">
        <qf-table-column label="科目" prop="accountCategory" min-width="250px">
          <template slot-scope="props">
            <search type="account" display-field="name" :value="getRowAccount(props.row.accountCategory)"
                    @select="setRowChargeLine($event, props.row, props.rowIndex)"
                    @clear="onChargeLineClear($event, props.row, props.rowIndex)" ref="accountCategory" v-form:accountCategory="tableValidator"
                    placeholder="编码/名称">
            </search>
          </template>
        </qf-table-column>
        <qf-table-column label="费用金额（元）" min-width="150px" prop="amount" align="left" class="charge-input-cell">
          <template slot-scope="props">
            <qf-input v-model="props.row.amount" :disabled="isEmptyLine(props.row)" ref="amount" select-onfocus
                      scale="2" class="charge-input" @change="onRowChange('amount', props.row)" v-form:amount="tableValidator"></qf-input>
          </template>
        </qf-table-column>
        <qf-table-column label="金额大写（选填）" min-width="150px" prop="amountUpper" align="left">
          <template slot-scope="props">
            <qf-input v-model="props.row.amountUpper" :disabled="isEmptyLine(props.row)" ref="amountUpper" select-onfocus
                        class="charge-input" :maxlength="32"></qf-input>
          </template>
        </qf-table-column>
        <qf-table-column label="" prop="name"  align="center" width="90px">
          <template slot-scope="props">
            <!--<qf-button class="textOverflow" type="link" @click="removeLine(props.rowIndex, props.row)">删除</qf-button>-->
            <qf-font-icon @click="removeLine(props.rowIndex, props.row)" name="ic-ic_clean" color="#f93e61"></qf-font-icon>
          </template>
        </qf-table-column>
      </qf-table>
    </div>
</template>
<script lang="ts" src='./ChargeAddTable.ts'></script>
<style lang="scss">
  .charge-add-table {
    .qf-table {
      margin-top: 20px;
    }
  }
</style>
