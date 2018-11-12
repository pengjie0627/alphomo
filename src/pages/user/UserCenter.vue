<template>
  <div class="user-center-view">
    <page-body>
      <header class="header-wrap">
        <div class="sub-title">
          <span class="info">基本信息</span>
          <span class="btn-edit">
          <!--<qf-font-icon name="ic-ic_mengdianguanli"></qf-font-icon>-->
          <qf-button type="link" @click="onEdit()">编辑</qf-button>
        </span>
        </div>
        <div class="sub-content">
          <div class="common simple">{{getSimpleName}}</div>
          <div class="common welcome">
            <p>您好，</p>
            <p>{{userDtl.name}}</p>
          </div>
          <div class="common welcome desc">
            <p>姓名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{userDtl.name}}</p>
            <p>性别：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{userDtl.sex === 'male' ? '男' : '女'}}</p>
          </div>
        </div>

      </header>
      <footer class="footer-wrap">
        <div class="item">
          <span class="info">安全信息</span>
          <div class="common fir">登录账号：{{userDtl.login}}</div>
          <div class="common">登录密码：******<qf-button class="pull-right" type="link" @click="onModify()">修改</qf-button></div>
          <div class="common">手机绑定：<span v-if="!userDtl.loginMobile" style="color: #F5222D">未绑定</span><span v-if="userDtl.loginMobile">{{getSecretMobile}}</span>&nbsp;&nbsp;
            <qf-tooltip content="绑定后可使用手机号直接登录" placement="top">
              <qf-font-icon style="color: #1890ff" name="ic-ic_info"></qf-font-icon>
            </qf-tooltip>
            <qf-button class="pull-right" type="link" @click="onBind()">绑定</qf-button></div>
        </div>
        <div class="item">
          <span class="info">权限信息</span>
          <p class="common fir">角色：{{getRolePermission}}</p>
          <p class="common">价格权限：{{getPricePermission}}</p>
          <p class="common">仓库权限：{{getWarePerssion}}</p>
        </div>
      </footer>
    </page-body>
  </div>
</template>
<script lang="ts" src='./UserCenter.ts'></script>
<style lang="scss">
  .user-center-view {
    height: 100%;
    .page-body .page-title{
      display: none;
    }
    .header-wrap{
      height: 174px;
      background: white;
      margin: 20px;
      .sub-title{
        padding: 20px 30px;
        .btn-edit{
          float: right;
          i{
            color: #007ace;
          }
        }
        .info{
          font-weight: 400;
          font-style: normal;
          font-size: 20px;
          color: #232424;
        }
      }
    }
    .sub-content{
      padding: 10px 30px;
      .common{
        float: left;
        height: 60px;
      }
      .simple{
        width: 60px;
        border-radius: 100%;
        background-color: #1890ff;
        line-height: 60px;
        text-align: center;
        color: white;
        font-size: 24px;
      }
      .welcome{
        width: 200px;
        margin-left: 20px;
        p{
          &:first-child{
            margin-top: 10px;
          }
          &:last-child{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .desc{
        width: 500px;
      }
    }
    .footer-wrap{
      height: 206px;
      margin: 0 20px 0 20px;
      display: flex;
      justify-content: space-between;
      .item{
        padding: 20px 30px;
        height: 100%;
        width: 49%;
        background: white;
        .info{
          font-weight: 400;
          font-style: normal;
          font-size: 20px;
          color: #232424;
        }
        .common{
          height: 36px;
          line-height: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .fir{
          margin-top: 20px;
        }
        .pull-right{
          float: right;
        }
      }
    }
  }
</style>
