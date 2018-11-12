<template>
  <page-body class="subject-list" :menu="menus">
    <div slot="actions">
      <!--头部  v-if="hasPermissions('sale.sale.create')"-->
      <qf-button icon="ic_icon-add" type="default" @click="importSubjectInfo" v-if="hasPermissions('finance.category.import')">导入科目资料</qf-button>
    </div>
    <list-container>
      <div slot="toolbar">
        <qf-row>
          <qf-col :span="12">
            <qf-button type="primary" @click="doCreate" :disabled="!isCreate" v-if="hasPermissions('finance.category.create')">+ 新建科目</qf-button>
            <qf-button  type="default" @click="doEdit" :disabled="!isSelect" v-if="hasPermissions('finance.category.create')">编辑科目</qf-button>
            <qf-button  type="default" @click="doDelete" :disabled="!isSelect" v-if="hasPermissions('finance.category.delete')">删除科目</qf-button>
            <qf-button  type="primary" @click="doExport" v-if="hasPermissions('finance.category.export')">导出全部科目</qf-button>
          </qf-col>
          <qf-col :span="10">
            <!-- 搜索栏 -->
            <qf-form-item label="科目" align="center">
              <qf-input placeholder="科目编号/科目名称" v-model="keyword" @keydown.native.enter="doEnterSearch()"
                        ></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="2" class="subject-list-sBtn">
            <qf-button type="primary" @click="doSearch">查询</qf-button>
          </qf-col>
        </qf-row>
      </div>
      <div slot="list" class="subject-list-contain">
        <qf-row>
          <qf-col :span="12" class="subject-list-tree">
            <!--:check-on-click-node="true" :show-checkbox="true"-->
            <qf-tree :data="data" Lazy node-key="id" ref="tree" :props="defaultProps" :default-expand-all="true" :default-expanded-keys=[] @node-click="onSelectAccountCategory" @check-change="handleCheckChange" highlight-current
            >
              <span slot-scope="{ node, data }">
                <span v-if="data.code !== null">{{ data.code + '    ' }}</span>
                {{ node.label }}
              </span>
            </qf-tree>
          </qf-col>
          <qf-col :span="12">
            <span><br/><br/>提示: <br/><br/>
              1、选中科目后，点击【新建科目】可以添加子科目，点击【编辑科目】可以对科目信息进行修改，点击【删除科目】则直接删除。<br/><br/>
              2、删除科目后，科目下的子科目会被一起删除，但不会影响历史单据上的记录。<br/>
            </span>
          </qf-col>
        </qf-row>
      </div>
    </list-container>
  </page-body>
</template>
<script lang="ts" src="./AccountCategoryList.ts"/>
<style lang="scss">
  .subject-list {
    .subject-list-sBtn {
      margin-left: 30px;
    }
    .subject-list-contain {
      width: 100%;
      min-height: 600px;
    }
    .subject-list-tree {
      padding-top: 30px;
    }
  }
</style>
