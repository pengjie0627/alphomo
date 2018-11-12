<template>
  <qf-page-body :menu="menu" class="rpt-storage-sku-dtl">
    <div slot="actions">
      <qf-button @click="onExport()" v-if="hasPermission('report.inventory.export')">导出</qf-button>
    </div>
    <div class="wrap">
      <div class="sub-header">
        <qf-row>
          <qf-col :span="6">
            <div>
              <div class="common-over title-weight">{{titleName}}</div>
              <div class="common-over">{{titleCode}}</div>
            </div>
          </qf-col>
          <qf-col :span="9">
            <div class="label-style">仓库：{{this.warehouse}}</div>
          </qf-col>
          <qf-col :span="9">
            <qf-form-item label="业务日期" required labelWidth="70px">
              <qf-date-picker
                v-model="businessDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </qf-date-picker>
            </qf-form-item>
          </qf-col>
        </qf-row>
      </div>
      <div class="table-style">
        <storage-rpt-dtl-sku slot="list" :data="tableData" :sku="skuP" :warehouse="warehouse" :warehouseId="warehouseId"></storage-rpt-dtl-sku>
        <!-- 翻页 -->
        <div class="page">
          <qf-pagination slot="pagination" :total="totalItem" :page-size="pageSize"
                         v-model="start" @change="onPageChange"></qf-pagination>
        </div>
      </div>

    </div>
  </qf-page-body>
</template>

<script lang="ts" src="./RptStorageSkuDtl.ts">

</script>

<style lang="scss">
  .rpt-storage-sku-dtl {
    .qf-date-editor--daterange.qf-input__inner{
     width: 100%;
    }
    .storage-rpt {
      color: #40C2EB;
      text-decoration: none;
      cursor: pointer;
    }
    .wrap {
      background: white;
    }
    .sub-header {
      width: 100%;
      padding: 20px;
      padding-bottom: 0;
      .common-over {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .title-weight {
        font-size: 20px;
      }
    }
    .table-style {
      padding: 20px;
    }
    .page {
      padding-top: 20px;
    }
    .label-style {
      line-height: 36px;
      vertical-align: middle;
      text-align: right;
      margin-right: 40px;
      color: #909399;
    }
  }
</style>
