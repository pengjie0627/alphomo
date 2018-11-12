<template>
  <div class="employ-edit-view">
    <page-body class="sale-list" :menu="menu">
      <!--面包屑右边部分 插槽位slot="actions"-->
      <div slot="actions">
        <qf-button v-if="fileType === 'add'" icon="ic_icon-add" type="default" @click="onSaveAndAdd">保存并新增</qf-button>
        <qf-button v-if="fileType === 'edit'" type="primary" @click="onSave">保存</qf-button>
        <qf-button v-if="fileType === 'add'" type="primary" @click="onSave">保存</qf-button>
        <qf-button type="default" @click="onCancel">取消</qf-button>
      </div>
      <div class="content">
        <section>
          <div class="sub-titlw">
            基本信息
          </div>
          <qf-form-item label="姓名" required>
            <qf-input ref="name" :maxlength="14" v-model="userBind.name"  v-form:name='validator'></qf-input>
          </qf-form-item>
          <qf-form-item label="手机号">
            <qf-input type="text" :maxlength="11" regex="^[0-9]*$" v-model="userBind.mobile"></qf-input>
          </qf-form-item>
          <qf-form-item label="性别" required>
            <qf-radio-group class="margin-style" v-model="userBind.sex">
              <qf-radio label="男">男</qf-radio>
              <qf-radio label="女">女</qf-radio>
            </qf-radio-group>
          </qf-form-item>
        </section>
        <section>
          <div class="sub-titlw">
            登录账号
          </div>
          <qf-form-item label="登录用户名" required>
            <qf-input ref="login" :maxlength="20" v-model="userBind.login" v-form:login='validator'></qf-input>
            <div style="color: #A09FAF;padding-top: 5px">登录名需要同时包含数字和字母，限20字以内</div>
          </qf-form-item>
          <qf-form-item label="登录密码" required>
            <qf-input type="password" :minlength="6" :maxlength="16" v-model="userBind.password" v-form:password='validator'></qf-input>
          </qf-form-item>
          <qf-form-item label="确认密码" required>
            <qf-input type="password" :minlength="6" :maxlength="16" v-model="confirmPwd" v-form:confirmPwd='validator'></qf-input>
          </qf-form-item>
        </section>
        <section>
          <div class="sub-titlw">
            员工权限
          </div>
          <qf-form-item label="角色" required>
            <qf-checkbox v-for="(item, index) in roleList" :key="index" v-model="roleSel[index]" class="margin-style">{{item.name}}</qf-checkbox>
          </qf-form-item>
          <qf-form-item label="价格权限" required>
            <qf-checkbox v-for="(item, index) in priceList" v-model="priceSel[index]" :key="index" class="margin-style">{{item.caption}}</qf-checkbox>
          </qf-form-item>
          <qf-form-item label="仓库权限" required>
            <qf-checkbox class="margin-style" v-model="allWarePer" @change="allWareChange">全部仓库</qf-checkbox>
            <qf-checkbox v-for="(item, index) in wareList" v-model="wareSel[index]" :key="index" class="margin-style">{{item.value}}</qf-checkbox>
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
            <qf-radio-group class="margin-style" v-model="status">
              <qf-radio label="正常">正常</qf-radio>
              <qf-radio label="锁定">锁定</qf-radio>
            </qf-radio-group>
          </qf-form-item>
          <qf-form-item>
            <p>锁定后员工将不能登录系统使用</p>
          </qf-form-item>
        </section>
        <footer class="footers">
          <qf-button v-if="fileType === 'add'" icon="ic_icon-add" type="default" @click="onSaveAndAdd">保存并新增</qf-button>
          <qf-button v-if="fileType === 'edit'" type="primary" @click="onSave">保存</qf-button>
          <qf-button v-if="fileType === 'add'" type="primary" @click="onSave">保存</qf-button>
          <qf-button type="default" @click="onCancel">取消</qf-button>
        </footer>
      </div>
    </page-body>
  </div>
</template>
<script lang="ts" src='./EmployEdit.ts'></script>
<style lang="scss">
  .employ-edit-view {
    .content{
      background-color: white;
      padding: 30px;
      section{
        margin-bottom: 10px;
        &:nth-child(-n+2){
          width: 500px;
        }
        .sub-titlw{
          font-weight: 600;
          font-style: normal;
          font-size: 16px;
          color: #3A3A41;
          line-height: 21px;
          padding-bottom: 20px;
        }
        .margin-style{
          margin-top: 7px;
          margin-right: 10px;
        }
        p{
          font-weight: 400;
          font-style: normal;
          color: #A09FAF;
          line-height: 24px;
          position: relative;
          top: -15px;
        }
      }
      .footers{
        text-align: right;
      }
    }
  }
</style>
