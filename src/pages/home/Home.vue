<template>
  <div class="home">
    <page-body>
      <div class="main-content" v-if="isShow">
        <qf-row>
          <qf-col :span="12">
            <h3>建立基础信息，录入期初数据</h3>
          </qf-col>
          <qf-col :span="12" class="textRight">
            <qf-button type="link" @click="setting">不再展示初始化流程</qf-button>
          </qf-col>
        </qf-row>
        <qf-row>
          <qf-col :span="6">
            <div class="box">
              <div class="title red">1.企业员工设置</div>
              <div>根据企业实际情况完成员工设置，包括角色管理和员工管理</div>
              <div class="btnList">
                <qf-button type="link" @click="doGoRoute('roleManage','角色管理')">角色管理</qf-button>
                <qf-button type="link" @click="doGoRoute('employManage','员工管理')">员工管理</qf-button>
              </div>
            </div>
          </qf-col>
          <qf-col :span="6">
            <div class="box">
              <div class="title green">2.业务设置</div>
              <div>根据业务实际情况完成业务设置，包括税率和打印模版设置</div>
              <div class="btnList">
                <qf-button type="link" @click="doGoRoute('businessSetting','业务设置')">业务设置</qf-button>
              </div>
            </div>
          </qf-col>
          <qf-col :span="6">
            <div class="box">
              <div class="title warn">3.仓库商品设置</div>
              <div>设置商品信息和保管商品存货的实体仓库信息，可导入</div>
              <div class="btnList">
                <qf-button type="link" @click="doGoRoute('warehouseList','仓库')">仓库</qf-button>
                <qf-button type="link" @click="doGoRoute('skuList','商品')">商品</qf-button>
              </div>
            </div>
          </qf-col>
          <qf-col :span="6">
            <div class="box">
              <div class="title info">4.往来单位</div>
              <div>管理登记供应商与客户的资料，包括基本信息及期初款项等，可导入</div>
              <div class="btnList">
                <qf-button type="link" @click="doGoRoute('supplierList','供应商')">供应商</qf-button>
                <qf-button type="link" @click="doGoRoute('customerList','客户')">客户</qf-button>
              </div>
            </div>
          </qf-col>
        </qf-row>
      </div>
      <div class="main-content">
        <qf-row>
          <qf-col :span="12">
            <h3>库存概览</h3>
            <div class="box-second inventory" id="inventory">
              <div class="fontNum">
                库存总数<br/>
                <p class="amount">{{qty}}</p>
                库存成本<br/>
                <p class="amount" v-if="hasPermissions('price.costPrice')">
                  ¥ {{amount | fmtThumb}}</p>
                <p class="amount" v-else>*****</p>
              </div>

            </div>
          </qf-col>
          <qf-col :span="12">
            <h3>销售概览
              <div class="textRight floatRight">
                <qf-radio-group v-model="businessTime" class="radio-style">
                  <qf-radio-button label="最近7天"></qf-radio-button>
                  <qf-radio-button label="最近1个月"></qf-radio-button>
                  <qf-radio-button label="全部"></qf-radio-button>
                </qf-radio-group>
              </div>
            </h3>

            <div class="box-second sale" id="sale">
              <div class="fontNum">销售总额<br/>
                <p class="amount">¥ {{saleAmount | fmtThumb}}</p>
                销售毛利<br/>
                <p class="amount"  v-if="hasPermissions('price.costPrice')"> ¥ {{saleProfit | fmtThumb}}</p>
                <p class="amount" v-else>*****</p>
              </div>
            </div>
          </qf-col>
        </qf-row>
      </div>
      <div class="main-content">
        <h3>常用功能</h3>
        <div class="box">
          <qf-row>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('saleList','销售')">
                <img src="~images/home/ic_kucungailan.png" width="48" height="48">
                <div>新增销售</div>
              </div>
            </qf-col>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('purchaseList','进货')">
                <img src="~images/home/ic_xinzengjinhuo.png" width="48" height="48">
                新增进货
              </div>
            </qf-col>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('inventoryOutList','出库管理')">
                <img src="~images/home/ic_chukuguanli.png" width="48" height="48">
                出库管理
              </div>
            </qf-col>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('inventoryInList','入库管理')">
                <img src="~images/home/ic_rukuguanli.png" width="48" height="48">
                入库管理
              </div>
            </qf-col>
          </qf-row>
          <qf-row>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('inventoryList','库存查询')">
                <img src="~images/home/ic_kucunchaxun.png" width="48" height="48">
                库存查询
              </div>
            </qf-col>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('receivableList','应收款管理')">
                <img src="~images/home/ic_yingshouduizhang.png" width="48" height="48">
                应收对账
              </div>
            </qf-col>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('saleRptList','销售报表')">
                <img src="~images/home/ic_xiaoshoubaobiao.png" width="48" height="48">
                销售报表
              </div>
            </qf-col>
            <qf-col :span="6">
              <div class="description" @click="doGoRoute('balanceRptList','收支报表')">
                <img src="~images/home/ic_shouzhilius.png" width="48" height="48">
                收支流水
              </div>
            </qf-col>
          </qf-row>
        </div>
      </div>
    </page-body>
  </div>
</template>

<script lang="ts" src="./Home.ts">

</script>

<style lang="scss">
  @import '~styles/var.scss';

  .home {
    padding: 20px 5px 20px 20px;
    [v-cloak] {
      display: none !important;
    }
    h3 {
      line-height: 36px;
      font-size: 16px;
      color: $--color-font;
    }
    .textRight {
      text-align: right;
      padding-right: 15px;
    }
    .floatRight {
      float: right
    }
    .main-content {
      padding: 15px 0;

      .box-second {
        margin-top: 15px;
        padding: 25px 50px;
        margin-right: 15px;
        line-height: 24px;
        border-radius: 3px;
        &.inventory {
          background: url(~images/home/cutting_kucun.png) bottom right no-repeat,
          linear-gradient(to right, #FA8B60, #FC558F);
          box-shadow: 0 4px 12px 1px rgba(254, 67, 82, 0.4);
          color: $--color-white;
        }
        &.sale {
          background: url(~images/home/cutting_xiaoshou.png) bottom right no-repeat,
          linear-gradient(to right, #997EE9, #288CC2);
          box-shadow: 0 4px 12px 1px #A5B8C2;
          color: $--color-white;
        }
      }
      .fontNum {
        font-size: 15px;
        font-weight: bold;
        line-height: 36px;
      }
      .amount {
        font-size: 18px;
      }
      .box {
        margin-top: 15px;
        padding: 20px 20px;
        margin-right: 15px;
        line-height: 24px;
        border-radius: 3px;
        background: $--color-white;
        .red {
          color: rgba(249, 108, 101, 1);
        }
        .green {
          color: rgba(251, 79, 128, 1);
        }
        .info {
          color: rgba(46, 112, 189, 1);
        }
        .warn {
          color: rgba(116, 98, 229, 1);
        }
        .step1 {
          background: $--color-error;
        }
        .step2 {
          background: $--color-success;
        }
        .step3 {
          background: $--color-warning;
        }
        .step4 {
          background: $--color-info;
        }

        .title {
          padding: 8px;
          line-height: 20px;
          font-size: 15px;
          padding-left: 0px;
          font-weight: bold;
          span {
            color: $--color-white;
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            padding-left: 5px;
            border-radius: 10px;
          }
        }
        .btnList {
          text-align: center
        }
        .description {
          padding: 20px;
          cursor: pointer;
          line-height: 48px;
          img {
            float: left;
            margin-right: 15px;
          }

        }
      }
    }
    .page-body .page-title {
      display: none;
    }
  }
</style>
