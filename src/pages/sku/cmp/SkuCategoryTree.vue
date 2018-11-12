<template>
  <div class="sku-category-tree">
    <div class="content">
      <div class="title">
        <span>商品分类</span>
        <qf-button class="action" type="link" @click="goManagerCategory">管理</qf-button>
      </div>
      <qf-tree
        :props="defaultProps"
        :load="loadNode1"
        lazy
        @node-click="onSelectSkuCategory"
        >
        <span slot-scope="{ node, data }">
                <span v-if="data.code !== null">{{ data.code + '    ' }}</span>
                {{ node.label }}
              </span>
      </qf-tree>
    </div>
  </div>
</template>

<script lang="ts" src="./SkuCategoryTree.ts">
</script>

<style lang="scss">
  .sku-category-tree {
    .title {
      display: flex;
      font-size: 16px;
      line-height: 36px;
      span {
        flex: 1
      }
    }
    .action {
      flex: 1;
      text-align: right;
    }
  }

</style>
