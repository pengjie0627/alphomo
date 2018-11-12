<template>
    <div class="role-dtl-view">
      <page-body class="sale-list" :menu="menu">
        <!--面包屑右边部分 插槽位slot="actions"-->
        <div slot="actions">
          <qf-button icon="ic_icon-add" type="primary" @click="onEdit">编辑</qf-button>
          <qf-button type="default" @click="onDel">删除</qf-button>
        </div>
        <div class="content">
          <section>
            <div class="sub-titlw">
              基本信息
            </div>
            <qf-form-item class="role-width" label="角色名称：">
              <div class="info">{{name}}</div>
            </qf-form-item>
            <qf-form-item label="备注：">
              <div class="info">{{remark}}</div>
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
              <qf-table-column prop="name" label="模块">
                <template slot-scope="props">
                  <div>{{props.row.moduleName}}</div>
                </template>
              </qf-table-column>
              <qf-table-column prop="amount1" label="权限">
                <template slot-scope="props">
                  <!--<div><span v-for="(item, index) in props.row.copyPermission" :key="index">{{item.caption}},</span></div>-->
                  <div>{{props.row.copyPermission}}</div>
                </template>
              </qf-table-column>
            </qf-table>
          </section>
          <footer class="footers">
            <qf-button icon="ic_icon-add" type="primary" @click="onEdit">编辑</qf-button>
            <qf-button type="default" @click="onDel">删除</qf-button>
          </footer>
        </div>
      </page-body>
    </div>
</template>
<script lang="ts" src='./RoleDtl.ts'></script>
<style lang="scss">
    .role-dtl-view {
      .content{
        background-color: white;
        padding: 30px;
        .text-area{
          width: 100%;
          height: 100px;
        }
        .info{
          /*line-height: 36px;*/
          /*overflow: hidden;*/
          /*text-overflow: ellipsis;*/
          /*white-space: nowrap;*/
          line-height: 20px;
          padding-top: 9px;
        }
        section{
          margin-bottom: 10px;
          .sub-titlw{
            font-weight: 600;
            font-style: normal;
            font-size: 16px;
            color: #3A3A41;
            line-height: 21px;
            padding-bottom: 20px
          }
          .sec-title{
            padding-bottom: 0;
          }
          .margin-style{
            margin-top: 7px;
          }
          .role-width{
            width: 500px;
          }
        }
        .footers{
          text-align: right;
        }
      }
      .qf-table td{
        border-bottom: 1px solid #ebeef5
      }
    }
</style>
