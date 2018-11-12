<template>
  <div class="employ-dtl-view">
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
          <qf-row>
            <qf-col :span="12">
              <qf-form-item label="姓名：">
                <div class="text-style">{{employDtl.name}}</div>
              </qf-form-item>
            </qf-col>
            <qf-col :span="12">
              <qf-form-item label="性别：">
                <div class="text-style">{{employDtl.sex === 'female' ? '女' : '男'}}</div>
              </qf-form-item>
            </qf-col>
          </qf-row>
          <qf-form-item label="手机号：">
            <div class="text-style">{{employDtl.mobile}}</div>
          </qf-form-item>
        </section>
        <section>
          <div class="sub-titlw">
            登录账号
          </div>
          <qf-form-item label="登录用户名：">
            <div class="text-style">{{employDtl.login}}</div>
          </qf-form-item>
          <qf-form-item label="绑定手机号：">
            <div class="text-style">{{employDtl.loginMobile}}</div>
          </qf-form-item>
        </section>
        <section>
          <div class="sub-titlw">
            员工权限
          </div>
          <qf-form-item label="角色" required>
            <div class="text-style">{{getRoles}}</div>
          </qf-form-item>
          <qf-form-item label="价格权限" required>
            <div class="text-style">{{getPricePerms}}</div>
          </qf-form-item>
          <qf-form-item label="仓库权限" required>
            <div class="text-style">{{getScopePerms}}</div>
          </qf-form-item>
          <qf-form-item>
            <p>只能查看相应仓库的单据</p>
          </qf-form-item>
        </section>
        <section>
          <div class="sub-titlw">
            其它
          </div>
          <qf-form-item label="锁定状态" required>
            <div class="text-style">{{employDtl.status === 0 ? '正常' : (employDtl.status === 1 ? '锁定' : '删除')}}</div>
          </qf-form-item>
          <qf-form-item>
            <p>锁定后员工将不能登录系统使用</p>
          </qf-form-item>
        </section>
        <footer class="footers">
          <qf-button icon="ic_icon-add" type="primary" @click="onEdit">编辑</qf-button>
          <qf-button type="default" @click="onDel">删除</qf-button>
        </footer>
      </div>
    </page-body>
  </div>
</template>
<script lang="ts" src='./EmployDtl.ts'></script>
<style lang="scss">
  .employ-dtl-view {
    .content {
      background-color: white;
      padding: 30px;
      section {
        margin-bottom: 10px;
        .sub-titlw {
          font-weight: 600;
          font-style: normal;
          font-size: 16px;
          color: #3A3A41;
          line-height: 21px;
          padding-bottom: 20px;
        }
        .margin-style {
          margin-top: 7px;
        }
        p {
          font-weight: 400;
          font-style: normal;
          color: #A09FAF;
          line-height: 24px;
          position: relative;
          top: -15px;
        }
      }
      .footers {
        text-align: right;
      }
      .text-style {
        line-height: 36px;
      }
    }
  }
</style>
