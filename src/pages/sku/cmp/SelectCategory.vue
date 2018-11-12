<template>
  <div class="select-category">
    <qf-dialog-def title="选择分类" :showConfirm="false" :showCancel="false" @cancel="doCancel" class="content">
      <qf-tree :data="skuCategoryList" :props="defaultProps" default-expand-all node-key="id" ref="tree"
               highlight-current @node-click="onSelectSkuCategory"
               :expand-on-click-node="false" class="content">
            <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
        </span>
      </qf-tree>
    </qf-dialog-def>
  </div>

</template>

<script lang="ts" src="./SelectCategory.ts">
</script>

<style lang="scss">
  @import '~styles/base.scss';

  .select-category {
    .content {
      padding: 20px 0;
      width: 500px;
      min-height: 200px;
      height: 550px;
      .content {
        height: 450px;
        width: 480px;
        overflow: auto;
      }
      .marTop12 {
        margin-top: 12px;
      }
      .receivable {
        text-align: right
      }
    }
    .qf-dialog-body {
      overflow: visible;
    }
  }
</style>
