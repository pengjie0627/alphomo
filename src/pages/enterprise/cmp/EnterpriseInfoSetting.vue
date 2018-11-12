<template>
  <div class="enterprise-info-setting">
    <header class="headers">欢迎您加入千帆商贸，请设置企业信息
      <qf-button class="pull-right" type="link" @click="onToMain">暂不设置，进入首页 ></qf-button>
    </header>
    <section class="contents">
      <div class="item">
        <qf-form-item class="common" label="企业名称" required>
          <qf-input :maxlength="14" v-model="enterName" v-form:enterName='validator' ref="enterprise"
                    placeholder="请输入"></qf-input>
        </qf-form-item>
        <qf-form-item class="common" label="所属行业" required>
          <qf-select v-model="catogory" v-form:catogory='validator' placeholder="请选择">
            <qf-option v-for="(item, index) in industry" :value="item.value" :label="item.value" :key="index">
              {{item.value}}
            </qf-option>
          </qf-select>
        </qf-form-item>
        <qf-form-item class="common" label="企业地址" required>
          <qf-row placeholder="请选择">
            <qf-col :span="6" class="margin-right">
              <qf-select v-model="province" placeholder="省" v-form:province='validator'>
                <qf-option v-for="(item, index) in provinceArray" :value="item.text" :label="item.text" :key="index">
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
              <qf-input type="text" placeholder="详细地址" :maxlength="32" v-model="addressDtl"
                        v-form:addressDtl='validator'></qf-input>
            </qf-col>
          </qf-row>
        </qf-form-item>
        <qf-form-item class="common" label="企业logo">
          <qf-img-upload upload-type="shop" :total="1" @getImage="getImage" v-model="imgUploadData">
          </qf-img-upload>
        </qf-form-item>
        <qf-form-item class="common" label="联系人姓名">
          <qf-input :maxlength="10" placeholder="请输入" v-model="owner"></qf-input>
        </qf-form-item>
        <qf-form-item class="common" label="联系人电话">
          <qf-input regex="^[0-9]*$" :maxlength="13" placeholder="请输入" v-model="mobile"></qf-input>
        </qf-form-item>
        <qf-button class="confirm" type="primary" @click="onConfirm()">确定</qf-button>
      </div>
    </section>
    <footer class="footers">
      <p>客服电话： 400-9009-123</p>
      <p>© 1997-2016上海海鼎信息工程股份有限公司 沪ICP备15000535号-5</p>
    </footer>
  </div>
</template>
<script lang="ts" src='./EnterpriseInfoSetting.ts'></script>
<style lang="scss">
  .enterprise-info-setting {
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
      height: 584px;
      margin: 0 60px 60px;
      background-color: white;
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
