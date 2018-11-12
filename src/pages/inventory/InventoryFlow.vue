<template>
  <page-body :menu="menu" class="inventory-flow">
    <list-container>

      <qf-row slot="search">
        <qf-col :span="16">
          <h3 class="sku-name" v-if="skuDetail">{{skuDetail.name}}</h3>
          <p v-if="skuDetail">编号：{{skuDetail.code}}，条码：{{skuDetail.barcode}}</p>
        </qf-col>
        <qf-col :span="8">
          <qf-form-item label="业务日期" required labelWidth="80px">
            <qf-date-picker
              v-model="businessDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </qf-date-picker>
          </qf-form-item>
        </qf-col>
      </qf-row>

      <qf-row slot="toolbar" class="qf-order-info">
        <qf-col :span="12">
          <qf-button type="primary" @click="doExport" v-if="hasPermissions('inventory.view.export')">导出全部</qf-button>
        </qf-col>
        <qf-col :span="4">
          <qf-form-item label="仓库："><span
            v-if="warehouse">{{warehouse}}</span>
          </qf-form-item>
        </qf-col>
        <qf-col :span="4">
          <qf-form-item label="当前库存：">{{skuSummary.qty}}</qf-form-item>
        </qf-col>
        <qf-col :span="4">
          <qf-form-item label="出库量/入库量：" label-width="110px">{{skuSummary.outQty + '/' + skuSummary.inQty}}
          </qf-form-item>
        </qf-col>
      </qf-row>

      <qf-table slot="list" :data="tableData" @sort-change="doSortChange">
        <qf-table-column label="序号" width="80px">
          <template slot-scope="props">
            {{(props.rowIndex + query.start + 1)}}
          </template>
        </qf-table-column>
        <qf-table-column label="业务日期" sortable prop="businessDate" :formatter="dateFormatter"></qf-table-column>
        <qf-table-column label="仓库" prop="warehouse.name"></qf-table-column>
        <qf-table-column label="出入库单号" prop="billNum"></qf-table-column>
        <qf-table-column label="业务" prop="sourceBillType" :formatter="formatterType"></qf-table-column>
        <qf-table-column label="往来单位" prop="contactUnit"></qf-table-column>
        <qf-table-column label="出库量" prop="outQty" align="right"></qf-table-column>
        <qf-table-column label="入库量" prop="inQty" align="right"></qf-table-column>
      </qf-table>

      <qf-pagination slot="pagination" :total="pagination.total" :page-size="pagination.limit"
                     v-model="pagination.start" @change="onPageChange"></qf-pagination>

    </list-container>
  </page-body>
</template>

<script lang="ts" src="./InventoryFlow.ts"></script>

<style lang="scss">
  .inventory-flow {
    .qf-date-editor--daterange.qf-input__inner{
     width: 100%;
    }
    .date-picker-width {
      width: 45%;
    }

    .gap {
      padding: 0 10px;
    }

    .qf-order-info {
      line-height: 36px;
    }

    .qf-form-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .qf-form-content {
      font-size: 14px;
    }

    .sku-name {
      line-height: 36px;
      font-weight:normal;
      font-size: 20px;
    }

  }
</style>
