<template>
  <qf-container class="main-frame">
    <qf-header class="headers">
      <img src="~images/img_qfzg_name_2x.png" v-if="!jdEnv" alt="千帆商贸">
      <img src="~images/img_qfzg_name_2x_jd.png" v-if="jdEnv" alt="京东云Elite商贸管家">
      <div class="nav-right">
        <div class="item">&nbsp;&nbsp;</div>
        <qf-popper
          ref="test"
          placement="top-end"
          trigger="click"
          :preventOverflow=true
          @show="showPopper()"
          @hide="hidePopper">
          <div class="proper-width">
            <div class="sec">
              <qf-row>
                <qf-col :label="24" class="common">
                  <span @click="toUserCenter()">
                    <qf-font-icon name="icon-ic_zhonxin__select"></qf-font-icon>
                    个人中心</span>
                </qf-col>
              </qf-row>
              <qf-row>
                <qf-col :label="24" class="common">
                  <span @click="toLogin()">
                    <qf-font-icon name="icon-ic_tuichudengl__se"></qf-font-icon>
                    退出登录</span>
                </qf-col>
              </qf-row>
            </div>
          </div>
        </qf-popper>
        <div class="item item-common item-left">
          <img v-if="merchantName && !merchantUrl"
               style="width: 35px;height: 35px;position: absolute;top: 10px;left: 10px"
               src="~images/ic_gongsi.png">
          <img v-if="merchantName && merchantUrl"
               style="width: 31px;height: 31px;position: absolute;top: 12px;left: 10px;border-radius: 100%"
               :src="merchantUrl">
          <div class="merchant-name" @click="toEnterPriseInfo">{{merchantName}}</div>
          <label>{{getUserSimpleName}}</label>
          <div v-popper:test class="name">
            {{user ? user.name : ''}}
            <qf-font-icon v-if="!popperFlag" name="ic-ic_xiangxia"></qf-font-icon>
            <qf-font-icon v-if="popperFlag" name="ic-ic_xiangshang"></qf-font-icon>
          </div>
        </div>
      </div>
    </qf-header>
    <qf-container>
      <qf-aside>
        <!---->
        <div v-show="!loaded" class="noLoaded"></div>
        <qf-nav v-show="loaded" :loaded="loaded">
          <qf-nav-group
            :menus="backendMenus"
            v-for="(item, key) in backendMenus"
            :title="item.name"
            :firTitle='item.firName'
            :secTitle='item.secName'
            :thirdTitle='item.thirdName'
            :home="item.home"
            :key="key"
            :router-link="item.url">
            <qf-font-icon :name="item.icon" slot="icon"/>
            <qf-nav-item
              v-for="(child, key) in item.children"
              :router-link="child.url"
              :secRouteUrl="child.secUrl"
              :key="key">
              {{child.name}}
            </qf-nav-item>
            <div v-if="item.name === '供应商'" style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px"></div>
            <div class="sec-menu">{{item.secName}}</div>
            <qf-nav-item
              v-if="item.secName"
              v-for="sec in item.secChildren"
              :key="sec.url"
              :secRouteUrl="sec.secUrl"
              :router-link="sec.url">
              {{sec.name}}
            </qf-nav-item>
            <div v-if="item.name === '客户'" style="height: 1px;border-top: 1px solid rgba(235,238,245,1);margin:10px"></div>
            <div class="sec-menu">{{item.thirdName}}</div>
            <qf-nav-item
              v-if="item.thirdName"
              v-for="third in item.thirdChildren"
              :key="third.name"
              :secRouteUrl="third.secUrl"
              :router-link="third.url">
              {{third.name}}
            </qf-nav-item>
          </qf-nav-group>
        </qf-nav>
      </qf-aside>
      <qf-main>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
      </qf-main>
    </qf-container>
  </qf-container>
</template>

<script lang="ts" src="./MainFrame.ts"></script>

<style lang="scss">

  .main-frame {
    height: 100%;
    .qf-aside {
      overflow: visible;
    }
    .noLoaded{
      width: 76px;height: 100%;background: linear-gradient(180deg,#2e334f,#4e3f54)
    }
    .sec-menu {
      height: 34px;
      line-height: 30px;
      padding-left: 10px;
      color: #909399;
    }
    .headers {
      line-height: 45px;
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      color: #FFFFFF;
      padding-left: 10px;
      background: linear-gradient(#2e334f, #2e334f);
      > img {
        /*width: 140px;*/
        height: 55px;
        padding: 5px;
        vertical-align: middle;
      }
      .nav-right {
        padding-right: 40px;
        float: right;
        height: 56px;
        .item {
          /*max-width: 236px;*/
          height: 56px;
          float: left;
          text-align: right;
          .version {
            width: 100px;
            margin-left: 20px;
            margin-right: 10px;
            background: linear-gradient(280deg, #ffd484, #ff3952);
          }
          label {
            width: 30px;
            height: 30px;
            border-radius: 100%;
            background: #1890FF;
            display: inline-block;
            text-align: center;
            margin-right: 10px;
            line-height: 32px;
          }
        }
        .item-left {
          padding-left: 20px;
        }
        .item-common {
          /*font-style: normal;*/
          position: relative;
          font-size: 14px;
          line-height: 55px;
          /*color: white;*/
          .merchant-name {
            line-height: 15px;
            display: inline-block;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 40px;
            padding-left: 30px;
            cursor: pointer;
          }
          .name {
            line-height: 13px;
            display: inline-block;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
        .proper-width {
          width: 100px;
          height: 80px;
          .fir {
            height: 140px;
            background-color: #F6F7FB;
            padding-top: 25px;
          }
          .sec {
            height: 30px;
            padding-top: 5px;
          }
          .common {
            text-align: center;
            padding: 5px 0;
            span {
              cursor: pointer;
            }
          }
          .mbr-num {
            margin-bottom: 10px;
          }
          .pur-num {
            margin-bottom: 10px;
            font-size: 20px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.847058823529412);
          }
        }
      }
    }
    .qf-nav {
      height: 100%;
      width: 76px;
      &.is-open {
        width: 210px;
        .qf-nav-trigger {
          left: 188px;
        }
      }
      .qf-nav-trigger {
        left: 76px;
      }
      .qf-nav-group {
        width: 76px;
        .menu-popper {
          width: 150px;
          left: 76px;
        }
        .nav-items {
          width: 134px;
          left: 76px;
        }
      }
    }
    .qf-nav-group .nav-btn {
      color: white;
    }
    .qf-nav-group .nav-btn .nav-icon i {
      font-size: 23px;
      color: white;
    }
  }
</style>
