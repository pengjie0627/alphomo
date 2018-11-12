<template>
  <qf-dialog-def class="verification-sheet" title="核销单据"
                 @cancel="doCancel" @confirm="doConfirm">
    <div class="content">
      <div class="search">
        <qf-row>
          <qf-col :span="6" class="paddingBottom10">
            <qf-form-item label="单据信息" label-width="80px">
              <qf-input :auto-create="true" v-model="queryCondition.billNum" placeholder="单号"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="10">
            <qf-form-item label="业务日期" label-width="80px">
              <div class="qf-form-group">
                <qf-date-picker placeholder="开始时间" v-model="queryCondition.businessDateFrom"
                                format="yyyy-MM-dd"></qf-date-picker>
                -
                <qf-date-picker placeholder="结束时间" v-model="queryCondition.businessDateTo"
                                format="yyyy-MM-dd"></qf-date-picker>
              </div>
            </qf-form-item>
          </qf-col>
          <qf-col :span="8">
            <qf-form-item label="经办人" label-width="80px">
              <search display-field="name" v-model="manager" placeholder="请输入名称查询" @input="onManagerChange"
                      type="user"/>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row>
          <qf-col :span="24" class="actions">
            <qf-button @click="onSetFilter" type="primary">确定</qf-button>
            <qf-button @click="doReset" type="default">重置</qf-button>
          </qf-col>
        </qf-row>
      </div>

      <!-- 数据列表 -->
      <qf-table class="sale-list-table" :data="data" @selection-change="doSelectionChange"
                ref="skuTable" row-key="id">
        <qf-table-column type="selection"/>
        <qf-table-column label="结算单据单号" prop="billNum"></qf-table-column>
        <qf-table-column label="单据类型" prop="businessTypeName"></qf-table-column>
        <qf-table-column label="业务日期" prop="businessDate" :formatter="dateFormatter"></qf-table-column>
        <qf-table-column label="经办人" prop="manager.name"></qf-table-column>
        <qf-table-column label="应收金额(元)" sortable prop="realAmount" :formatter="priceFormatter"></qf-table-column>
        <qf-table-column label="剩余应收(元)" sortable prop="remainedAmount" :formatter="priceFormatter"></qf-table-column>
      </qf-table><!-- 翻页 -->
      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>
    </div>
  </qf-dialog-def>
</template>

<script lang="ts" src="./VerificationSheet.ts"></script>

<style lang="scss">
  .verification-sheet {
    .qf-dialog-body {
      overflow: visible;
    }
    .content {
      padding: 20px 0;
      .search {
        padding-bottom: 20px;
        .paddingBottom10 {
          padding-bottom: 10px;
        }
        .qf-form-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .qf-form-content {
        padding-right: 5px;
      }
      .qf-form-label {
        text-align: right;
        padding-right: 5px;
      }

      .actions {
        text-align: right
      }

    }

  }

</style>
