<template>
  <div class="role-edit-view">
    <page-body class="sale-list" :menu="menu">
      <!--面包屑右边部分 插槽位slot="actions"-->
      <div slot="actions">
        <qf-button v-if="type ==='new'" icon="ic_icon-add" type="default" @click="onSaveAndAdd">保存并新增</qf-button>
        <qf-button v-if="type ==='new'" type="primary" @click="onSave">保存</qf-button>
        <qf-button v-if="type ==='edit'" type="primary" @click="onSave">保存</qf-button>
        <qf-button type="default" @click="onCancel">取消</qf-button>
      </div>
      <div class="content">
        <section>
          <div class="sub-titlw">
            基本信息
          </div>
          <qf-form-item class="role-width" label="角色名称" required>
            <qf-input v-model="roleName" :maxlength="10" v-form:name='validator'></qf-input>
          </qf-form-item>
          <qf-form-item label="备注">
            <textarea style="resize:none" ref="texTArea" class="text-area" v-model="roleNote"
                      :maxlength="140"></textArea>
          </qf-form-item>
        </section>
        <section>
          <div class="sub-titlw sec-title">
            角色权限
          </div>
          <qf-table
            :data="rolePermissionList"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px">
            <qf-table-column
              prop="businessName"
              label="业务"
              width="180">
            </qf-table-column>
            <qf-table-column label="模块" width="200px">
              <template slot-scope="props">
                <qf-checkbox v-model="moduleNameBind[props.rowIndex]">{{props.row.moduleName}}</qf-checkbox>
              </template>
            </qf-table-column>
            <qf-table-column prop="amount1" label="权限">
              <template slot-scope="props">
                <qf-checkbox class="margin-right-5" v-for="(item, index) in props.row.permission" :key="index"
                             v-model="permissionBind[props.rowIndex][index]">{{item.caption}}
                </qf-checkbox>
              </template>
            </qf-table-column>
          </qf-table>
        </section>
        <footer class="footers">
          <qf-button v-if="type ==='new'" icon="ic_icon-add" type="default" @click="onSaveAndAdd">保存并新增</qf-button>
          <qf-button v-if="type ==='new'" type="primary" @click="onSave">保存</qf-button>
          <qf-button v-if="type ==='edit'" type="primary" @click="onSave">保存</qf-button>
          <qf-button type="default" @click="onCancel">取消</qf-button>
        </footer>
      </div>
    </page-body>
  </div>
</template>
<script lang="ts" src='./RoleEdit.ts'></script>
<style lang="scss">
  .role-edit-view {
    .content {
      background-color: white;
      padding: 30px;
      .text-area {
        width: 100%;
        height: 100px;
      }
      .margin-right-5 {
        margin-right: 5px;
      }
      section {
        margin-bottom: 10px;
        .sub-titlw {
          font-weight: 600;
          font-style: normal;
          font-size: 16px;
          color: #3A3A41;
          line-height: 21px;
          padding-bottom: 20px
        }
        .sec-title {
          padding-bottom: 0;
        }
        .margin-style {
          margin-top: 7px;
        }
        .role-width {
          width: 500px;
        }
      }
      .footers {
        text-align: right;
      }
    }
    .qf-table td {
      border-bottom: 1px solid #ebeef5
    }
  }
</style>
