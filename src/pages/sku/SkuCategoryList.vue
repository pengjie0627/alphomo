<template>
  <page-body class="sku-category-list" :menu="menu">

    <!-- 头部 -->
    <div slot="actions">
      <qf-button icon="ic_icon-add" type="default" @click="doImport"
                 v-if="hasPermissions('basicdata.skuCategory.import')">导入分类资料
      </qf-button>
    </div>

    <!-- 列表页面模板 -->
    <list-container>

      <!-- 表格工具栏 -->
      <div slot="toolbar">
        <qf-button type="primary" @click="doCreate" v-if="hasPermissions('basicdata.skuCategory.create')">新建分类
        </qf-button>
        <qf-button type="default" @click="doEdit" :disabled="!isEdit"
                   v-if="hasPermissions('basicdata.skuCategory.create')">编辑分类
        </qf-button>
        <qf-button type="default" @click="doDelete" :disabled="!isEdit"
                   v-if="hasPermissions('basicdata.skuCategory.delete')">删除分类
        </qf-button>
      </div>

      <!-- 数据列表 -->
      <div slot="list">
        <div style="font-size: 16px">商品分类</div>
        <qf-tree  :props="defaultProps"
                  :load="loadNode1"
                  lazy
                 node-key="id"
                 ref="tree"
                 highlight-current
                 @node-click="handleNodeClick"
                 :expand-on-click-node="false"
                  v-if="!completeFlag"
                 >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span v-if="data.code !== null">{{ data.code + '    ' }}</span>
              {{ node.label }}
            </span>
        </qf-tree>
        <qf-tree  :data="skuCategoryList"
                  :props="defaultProps"
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  highlight-current
                  draggable
                  @node-click="handleNodeClick"
                  :expand-on-click-node="false"
                  @node-drag-end="handleDragEnd"
        >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span v-if="data.code !== null">{{ data.code + '    ' }}</span>
              {{ node.label }}
            </span>
        </qf-tree>
      </div>

    </list-container>

  </page-body>
</template>

<script lang="ts" src="./SkuCategoryList.ts"/>

<style lang="scss">
  @import '~styles/var.scss';

  .sku-category-list {
    background: $--color-bg;
    .qf-list-container .qf-search-box {
      padding: 0px;
    }
  }

</style>
