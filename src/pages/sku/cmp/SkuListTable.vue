<template>
  <!-- 数据列表 -->
  <qf-table class="sku-list-table" :data="data" @sort-change="doSortChange" @selection-change="doSelectionChange"
            ref="table" row-key="id">
    <qf-table-column type="selection" align="center"/>
    <qf-table-column label="操作" align="center" width="150px">
      <template slot-scope="props">
        <qf-button type="link" @click="doEdit(props.row.id)" v-if="hasPermissions('basicdata.sku.create')">编辑
        </qf-button>
        <qf-button type="link" @click="doGoDetail(props.row.id)" v-if="hasPermissions('basicdata.sku.view')">查看
        </qf-button>
      </template>
    </qf-table-column>
    <qf-table-column label="名称/条码" prop="name">
      <template slot-scope="props">
        <span class="sku-name" :title="props.row.name">{{props.row.name}}</span><br/>
        {{props.row.barcode}}
      </template>
    </qf-table-column>
    <qf-table-column label="商品编号" prop="code">
    </qf-table-column>
    <qf-table-column label="基本单位" prop="munit" width="80"></qf-table-column>
    <qf-table-column label="规格" prop="spec" width="90"></qf-table-column>
    <qf-table-column label="批发价" prop="wholePrice" :formatter="priceFormatter">
    </qf-table-column>
    <qf-table-column label="零售价" prop="salePrice" :formatter="priceFormatter">
    </qf-table-column>
    <qf-table-column label="分类" prop="category.name">
      <template slot-scope="props">
        <span class="sku-name" :title="props.row.category.name">{{props.row.category.code + '    ' }}{{props.row.category.name}}</span>
      </template>
    </qf-table-column>
  </qf-table>
</template>

<script lang="ts" src="./SkuListTable.ts"></script>

<style lang="scss">
  @import '~styles/var.scss';

  .sku-list-table {
    .qf-table-expand {
      padding: 0px;
    }
  }
</style>
