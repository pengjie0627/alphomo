<template>
  <div class="storage-rpt-list-sku">
    <!--搜索栏-->
    <list-container>
      <template slot="search">
        <div class="search-style">
          <qf-row v-if="!opened" class="query-line">
            <qf-col :span="12">
              <qf-form-item label="商品">
                <qf-input placeholder="商品条码/名称/自编码等" v-model="skuKeyword" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8" class="closed-action">
              <qf-button type="primary" @click="onSearch">查询</qf-button>
              <qf-button @click="onToggle" trigger="ic-ic_xiangxia" type="link">展开</qf-button>
            </qf-col>
          </qf-row>
          <qf-row class="query-line" v-if="opened">
            <qf-col :span="8">
              <qf-form-item label="仓库">
                <qf-select v-model="warehouse">
                  <qf-option value="" label="全部">全部</qf-option>
                  <qf-option
                    v-for="type in warehouses"
                    :key="type.id"
                    :label="type.name"
                    :value="type.id">
                  </qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="商品">
                <qf-input placeholder="商品条码/编码/名称" v-model="skuKeyword" @keydown.native.enter="doEnterSearch()"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="8">
              <qf-form-item label="类别">
                <qf-select v-model="skuCategory">
                  <qf-option value="" label="全部">全部</qf-option>
                  <qf-option
                    v-for="type in skuCategories"
                    :key="type.code"
                    :label="type.name"
                    :value="type.id">
                  </qf-option>
                </qf-select>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-row class="query-line" v-if="opened">
            <qf-col :span="10">
              <slot name="openedQuery"></slot>
            </qf-col>
            <qf-col :span="14">
              <div class="opened-action">
                <qf-checkbox class="check" v-model="zeroStorage">不显示零库存商品</qf-checkbox>
                <qf-button type="primary" @click="onSearch">查询</qf-button>
                <qf-button @click="onReset">重置</qf-button>
                <qf-button @click="onToggle" trigger="ic-ic_xiangshang" type="link">收起</qf-button>
              </div>
            </qf-col>
          </qf-row>
        </div>
      </template>
      <template slot="list">
        <!--表格栏-->
        <qf-table
          class="table-style"
          :data="tableData"
          show-summary
          :summary-method="getSummaries"
          @sort-change="sortChange"
          border>
          <!--<qf-table-column type="selection"/>-->
          <qf-table-column label="序号" align="center" type="index" width="50px"/>
          <qf-table-column label="操作" align="center" width="50px">
            <template slot-scope="props">
              <qf-button type="link" @click="onCheck(props.row)" v-if="hasPermission('report.inventory.view')">查看</qf-button>
            </template>
          </qf-table-column>
          <qf-table-column label="商品名称">
            <template slot-scope="props">
              <div class="sku-name" :title="props.row.sku.name">{{props.row.sku.name}}</div>
              <div>{{props.row.sku.barcode}}</div>
            </template>
          </qf-table-column>
          <qf-table-column label="规格" prop="sku.spec" align="left"/>
          <qf-table-column label="单位" prop="sku.munit" width="50px"/>
          <qf-table-column label="类别" prop="sku.category.name" align="center"/>
          <qf-table-column label="期初库存" prop="beginingQty" align="right"/>
          <qf-table-column label="入库数" prop="inQty" align="right" sortable/>
          <qf-table-column label="出库数" prop="outQty" align="right" sortable/>
          <qf-table-column v-if="hasPermission('price.costPrice')" label="结余库存" prop="qty" align="right" sortable>
            <template slot-scope="props">
              <div v-if="props.row.qty>=0">{{props.row.qty}}</div>
              <div v-if="props.row.qty<0" class="warning">{{props.row.qty}}
                <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
                  <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
                </qf-tooltip>
              </div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.costPrice')" label="结余成本(去税)" prop="amount" align="right" sortable>
            <template slot-scope="props">
              <div v-if="props.row.amount>=0">{{props.row.taxExcAmount|fmt}}</div>
              <div v-if="props.row.amount<0" class="warning">{{props.row.taxExcAmount|fmt}}
                <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
                  <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
                </qf-tooltip>
              </div>
            </template>
          </qf-table-column>
          <qf-table-column v-if="hasPermission('price.costPrice')" label="结余成本(含税)" prop="amount" align="right" sortable>
            <template slot-scope="props">
              <div v-if="props.row.amount>=0">{{props.row.amount|fmt}}</div>
              <div v-if="props.row.amount<0" class="warning">{{props.row.amount|fmt}}
                <qf-tooltip content="未及时录入入库单可能导致库存、成本出现负值，请及时录入入库单">
                  <qf-font-icon name="ic-ic_warning" color="#fe4352"></qf-font-icon>
                </qf-tooltip>
              </div>
            </template>
          </qf-table-column>
        </qf-table>
      </template>
      <template slot="pagination">
        <qf-pagination :total='totalItem'
                       v-model="start"
                       :page-size='pageSize'
                       @change="onChange"></qf-pagination>
      </template>
    </list-container>
    <!--分页栏-->
  </div>
</template>

<script lang="ts" src="./StorageRptListSku.ts">

</script>

<style lang="scss">
  @import '~styles/var.scss';

  .storage-rpt-list-sku {
    .qf-select .qf-select-options {
      max-width: 280px;
    }
    .search-style {
      padding: 0px 25px 24px 25px;
    }

    .closed-action {
      padding-left: 12px;
    }
    .warning {
      color: $--color-primary
    }

    .opened-action {
      float: right;
      margin-top: 10px;
    }

    .check {
      margin-right: 10px;
    }

    .table-style {
      margin-top: 50px;
    }
    .qf-table-footer-wrapper {
      position: absolute;
      top: -45px;
    }

  }
</style>
