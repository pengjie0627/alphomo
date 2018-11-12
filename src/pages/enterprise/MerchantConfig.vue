<template>
  <div class="merchant-config">
    <page-body class="sale-list" :menu="menu">
      <div class="content">
        <section class="contents">
          <div class="item">
            <qf-form-item class="common" label="企业名称" required>
              <qf-input :maxlength="14" v-model="merchant.name" v-form:enterName='validator' ref="enterprise"
                        placeholder="请输入"></qf-input>
            </qf-form-item>
            <qf-form-item class="common" label="所属行业" required>
              <qf-select v-model="merchant.industry" v-form:catogory='validator' placeholder="请选择">
                <qf-option v-for="(item, index) in industry" :value="item.value" :label="item.value" :key="index">
                  {{item.value}}
                </qf-option>
              </qf-select>
            </qf-form-item>
            <qf-form-item class="common" label="企业地址" required>
              <qf-row placeholder="请选择">
                <qf-col :span="6" class="margin-right">
                  <qf-select v-model="province" placeholder="省" v-form:province='validator'>
                    <qf-option v-for="(item, index) in provinceArray" :value="item.text" :label="item.text"
                               :key="index">
                      {{item.text}}
                    </qf-option>
                  </qf-select>
                </qf-col>
                <qf-col :span="6" class="margin-right">
                  <qf-select v-model="city" placeholder="市" v-form:city='validator'>
                    <qf-option v-for="(item, index) in cityArray" :value="item.text" :label="item.text" :key="index">
                      {{item.text}}
                    </qf-option>
                  </qf-select>
                </qf-col>
                <qf-col :span="6" class="margin-right">
                  <qf-select v-model="county" placeholder="区/县" v-form:county='validator'>
                    <qf-option v-for="(item, index) in countyArray" :value="item.text" :label="item.text" :key="index">
                      {{item.text}}
                    </qf-option>
                  </qf-select>
                </qf-col>
                <qf-col :span="6" class="margin-right">
                  <qf-select v-model="street" placeholder="街道" v-form:street='validator'>
                    <qf-option v-for="(item, index) in streetArray" :value="item.text" :label="item.text" :key="index">
                      {{item.text}}
                    </qf-option>
                  </qf-select>
                </qf-col>
              </qf-row>
              <qf-row style="margin-top: 10px">
                <qf-col>
                  <qf-input type="text" placeholder="详细地址" :maxlength="32" v-model="merchant.address"
                            v-form:addressDtl='validator'></qf-input>
                </qf-col>
              </qf-row>
            </qf-form-item>
            <qf-form-item class="common" label="企业logo">
              <qf-img-upload upload-type="shop" :total="1" @getImage="getImage" v-model="imgUploadData">
              </qf-img-upload>
            </qf-form-item>
            <qf-form-item class="common" label="联系人姓名">
              <qf-input :maxlength="10" placeholder="请输入联系人姓名" v-model="merchant.contact"></qf-input>
            </qf-form-item>
            <qf-form-item class="common" label="联系人电话">
              <qf-input :maxlength="13" placeholder="请输入联系人电话" regex="^[0-9]*$" v-model="merchant.phone"
                        ></qf-input>
              <!--v-form:mobile='validator'测试需要跟注册保持一致校验规则拿掉-->
            </qf-form-item>
            <qf-button class="confirm" type="primary" @click="savemodify()">确定</qf-button>
          </div>
        </section>
      </div>
    </page-body>
  </div>
</template>
<script lang="ts" src='./MerchantConfig.ts'></script>
<style lang="scss">
  .merchant-config {
    height: 100%;
    .headers {
      height: 70px;
      text-align: center;
      line-height: 70px;
      font-weight: 600;
      font-style: normal;
      font-size: 24px;
      color: #232424;
      .pull-right {
        position: absolute;
        right: 65px;
        top: 16px;
      }
    }
    .contents {
      padding-top: 40px;
      /*margin: 0 10px 0px;*/
      background-color: white;
      padding-bottom: 40px;
      .item {
        width: 565px;
        margin: 0 auto;
        .confirm {
          margin-left: 96px;
        }
        .common {
          margin-bottom: 30px;
          .margin-right {
            &:nth-child(-n+3) {
              padding-right: 10px;
            }
          }
        }
      }
    }
    .footers {
      position: absolute;
      bottom: 0;
      text-align: center;
      margin-left: 50%;
      margin-left: -215px;
      left: 50%;
      padding-bottom: 22px;
      p {
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.447059);
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }
</style>
