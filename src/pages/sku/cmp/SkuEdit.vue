<template>
  <div class="sku-edit-view">
    <page-body class="sku-edit" :menu="menuList">
      <div slot="actions">
        <qf-button v-if="hasPermissions('basicdata.sku.create')" :type="presentation === 'edit' ? 'primary' : 'primary'"
                   @click="onSave">保存
        </qf-button>
        <qf-button :type="presentation === 'create' ? 'default' : 'default'"
                   v-if="presentation === 'create' && hasPermissions('basicdata.sku.create')"
                   @click="onSaveAndCreate">保存并新增
        </qf-button>
        <qf-button @click="onCancel">取消</qf-button>
      </div>
      <div class="content">
        <qf-row>
          <qf-col :span="2">
            <div class="qf-form-label sub-titlw">基本信息</div>
          </qf-col>
          <qf-col :span="12">
            <qf-form-item label="商品条码">
              <qf-input v-model="sku.barcode" :maxlength="limits.barcode" v-form:barcode="validator"
              ></qf-input>
            </qf-form-item>
            <qf-form-item label="商品名称" :required="true">
              <qf-input v-model="sku.name" :maxlength="limits.name"
                        v-form:name="validator"></qf-input>
            </qf-form-item>
            <qf-form-item label="分类">
              <span class="category">{{category.name}}</span>
              <qf-button type="link" @click="selectCategory" class="link">选择分类</qf-button>
            </qf-form-item>
            <qf-form-item label="规格">
              <qf-input class="receivable" v-model="sku.spec"
                        :maxlength="limits.spec" placeholder="250ml"></qf-input>
            </qf-form-item>
            <qf-form-item label="品牌">
              <qf-input class="receivable" v-model="sku.brand"
                        :maxlength="limits.brand"></qf-input>
            </qf-form-item>
            <qf-form-item label="采购组">
              <qf-select v-model="sku.purchaseGroup" clearable
                         display-field="value" :maxlength="limits.purchaseGroup" placeholder="选择采购组">
                <!--<qf-option label="无" value=""></qf-option>-->
                <qf-option v-for="(item,index) in purchaseGroupList" :key="index" :value="item.value"
                           :label="item.value"></qf-option>
              </qf-select>
            </qf-form-item>
            <qf-form-item label="进项税率">
              <qf-input class="receivable" v-model="sku.inputTaxRate" v-form:inputTaxRate="validator" scale="2"
                        placeholder="0.00" @change="changeInputTaxRate"><span slot="append">%</span></qf-input>
            </qf-form-item>
            <qf-form-item label="税收分类编码">
              <qf-input v-model="sku.taxClassification" regex="^[0-9]*$" :maxlength="limits.taxClassification" v-form:taxClassification="validator"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="12" class="padding-left-40">
            <qf-form-item label="商品编号" :required="true">
              <qf-input v-model="sku.code" v-form:code="validator"
                        :maxlength="limits.code"></qf-input>
            </qf-form-item>
            <qf-form-item label="外部编码">
              <qf-input v-model="sku.externalCode" :maxlength="limits.externalCode"
                        v-form:externalCode="validator"></qf-input>
            </qf-form-item>
            <qf-form-item label="单位" :required="true">
              <qf-row>
                <qf-col :span="12">
                  <qf-select v-model="sku.munit" clearable :auto-create="autoCreate" searchable
                             display-field="value"
                             v-form:munit="validator" :maxlength="limits.munit">
                    <qf-option v-for="(item,index) in munitList" :key="index" :value="item.value"
                               :label="item.value"></qf-option>
                  </qf-select>
                </qf-col>
                <qf-col :span="12" class="checkBox">
                  <qf-checkbox label="多包装" v-model="manyPack"></qf-checkbox>
                  <qf-tooltip content="同一商品进货/销售单位不同时可选，如按箱进，拆箱卖。">
                    <qf-font-icon name="ic-ic_help" color="#f93e61"></qf-font-icon>
                  </qf-tooltip>
                </qf-col>
              </qf-row>
            </qf-form-item>
            <qf-form-item label="包装">
              <qf-input class="receivable" v-model="sku.qpc"
                        :maxlength="limits.amount" placeholder="1*6*2"></qf-input>
            </qf-form-item>
            <qf-form-item label="产地">
              <qf-input class="receivable" :maxlength="limits.origin" v-model="sku.origin"></qf-input>
            </qf-form-item>
            <qf-form-item label="所属供应商">
              <qf-select v-model="supplier" clearable placeholder="选择供应商" display-field="name" value-key="id">
                <!--// <qf-option label="无" value=""></qf-option>-->
                <qf-option v-for="(item,index) in supplierList" :key="index" :value="item"
                           :label="item.name"></qf-option>
              </qf-select>
            </qf-form-item>
            <qf-form-item label="销项税率">
              <qf-input class="receivable" v-model="sku.outputTaxRate" v-form:outputTaxRate="validator" scale="2"
                        placeholder="0.00"><span slot="append">%</span></qf-input>
            </qf-form-item>
            <qf-form-item label="助记码">
              <qf-input v-model="sku.smartCodes"
                        :maxlength="limits.smartCodes"></qf-input>
            </qf-form-item>
          </qf-col>
        </qf-row>
        <qf-row class="marTop12" v-if="manyPack">
          <qf-col :span="2">
            <div class="qf-form-label sub-titlw">多包装设置</div>
          </qf-col>
          <qf-col :span="24">
            <qf-row>
              <qf-col :span="12">
                <qf-form-item label="基本单位">
                  <span style="line-height: 36px; font-size: 14px;">&nbsp;{{ sku.munit }}</span>
                </qf-form-item>
              </qf-col>
            </qf-row>
            <qf-row v-for="(item, index) in sku.skuMunitList" :key="index" class="sku-pakage">
              <qf-col :span="12">
                <qf-form-item :label="getPageLabel(index)" class="sku-pakage">
                  <qf-col :span="24">
                    <qf-select v-model="item.name" clearable :auto-create="autoCreate" searchable
                               display-field="value"
                               v-form:pakgeMunit="validator" :maxlength="limits.munit">
                      <qf-option v-for="(item,index) in munitList" :key="index" :value="item.value"
                                 :label="item.value"></qf-option>
                    </qf-select>
                  </qf-col>
                </qf-form-item>
              </qf-col>
              <qf-col :span="12">
                <qf-row class="padding-left-40">
                  <qf-col :span="12">
                    <span>{{'='}}&nbsp;&nbsp;</span>
                    <qf-input class="time_input" v-model="item.times" v-form:input="validator" regex="^[0-9]*$"
                              :maxlength="6"></qf-input>
                    <span>&nbsp;{{ sku.munit }}</span>
                  </qf-col>
                  <qf-col :span="12" class="sku-pakage-delete">
                    <qf-button @click="onDeleteMunit(index)" type="link">删除本单位</qf-button>
                  </qf-col>
                </qf-row>
              </qf-col>
            </qf-row>
            <qf-button @click="onAddMunit" type="link" v-if="sku.skuMunitList.length < 3">新增单位</qf-button>
          </qf-col>
        </qf-row>

        <div v-if="!merchantConfig.inputOnlyTax&&merchantConfig.enableInputTaxRateSupport">
          <qf-row class="marTop12">
            <qf-col :span="2">
              <div class="qf-form-label sub-titlw">价格信息</div>
            </qf-col>
            <qf-col :span="12">
              <qf-form-item label="批发价(含税)">
                <qf-input v-model="sku.wholePrice"
                          :maxlength="limits.amount" scale="2" v-form:wholePrice="validator"
                          @change="changeAmount"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="12" class="padding-left-40">
            </qf-col>
          </qf-row>
          <qf-row class="marTop12">
            <qf-col :span="2">
              <div class="qf-form-label sub-titlw"></div>
            </qf-col>
            <qf-col :span="12">
              <qf-form-item label="参考进价(含税)">
                <qf-input v-model="sku.refPurchasePrice"
                          :maxlength="limits.amount" :scale="merchantConfig.purchasePriceBit"
                          v-form:refPurchasePrice="validator"
                          @change="changeRefPurchasePrice(false)"></qf-input>
              </qf-form-item>
              <qf-form-item label="零售价(含税)">　
                <qf-input v-model="sku.salePrice"
                          :maxlength="limits.amount" scale="2" v-form:salePrice="validator"
                          @change="changeAmount"></qf-input>
              </qf-form-item>
            </qf-col>
            <qf-col :span="12" class="padding-left-40">
              <qf-form-item label="参考进价(去税)">
                <qf-input v-model="sku.taxExcRefPurchasePrice"
                          :maxlength="limits.amount" :scale="merchantConfig.purchasePriceBit"
                          v-form:taxExcRefPurchasePrice="validator"
                          @change="changeRefPurchasePrice(true)"></qf-input>
              </qf-form-item>

              <qf-form-item label="最低售价(含税)">
                <qf-input v-model="sku.minSalePrice"
                          :maxlength="limits.amount" scale="2" v-form:minSalePrice="validator"
                          @change="changeAmount"></qf-input>
              </qf-form-item>
            </qf-col>
          </qf-row>
        </div>
        <qf-row class="marTop12" v-else>
          <qf-col :span="2">
            <div class="qf-form-label sub-titlw">价格信息</div>
          </qf-col>
          <qf-col :span="12">
            <qf-form-item label="批发价(含税)">
              <qf-input v-model="sku.wholePrice"
                        :maxlength="limits.amount" scale="2" v-form:wholePrice="validator"
                        @change="changeAmount"></qf-input>
            </qf-form-item>
            <qf-form-item label="零售价(含税)">　
              <qf-input v-model="sku.salePrice"
                        :maxlength="limits.amount" scale="2" v-form:salePrice="validator"
                        @change="changeAmount"></qf-input>
            </qf-form-item>
          </qf-col>
          <qf-col :span="12" class="padding-left-40">
            <qf-form-item label="参考进价(含税)">
              <qf-input v-model="sku.refPurchasePrice"
                        :maxlength="limits.amount" :scale="merchantConfig.purchasePriceBit"
                        v-form:refPurchasePrice="validator"
                        @change="changeRefPurchasePrice(false)"></qf-input>
            </qf-form-item>

            <qf-form-item label="最低售价(含税)">
              <qf-input v-model="sku.minSalePrice"
                        :maxlength="limits.amount" scale="2" v-form:minSalePrice="validator"
                        @change="changeAmount"></qf-input>
            </qf-form-item>
          </qf-col>
        </qf-row>

        <div class="toolbar-style" slot="bottomActions">
          <qf-button v-if="hasPermissions('basicdata.sku.create')"
                     :type="presentation === 'edit' ? 'primary' : 'primary'"
                     @click="onSave">保存
          </qf-button>
          <qf-button :type="presentation === 'create' ? 'default' : 'default'"
                     v-if="hasPermissions('basicdata.sku.create') && presentation === 'create'"
                     @click="onSaveAndCreate">保存并新增
          </qf-button>
          <qf-button @click="onCancel">取消</qf-button>
        </div>
      </div>
    </page-body>
  </div>
</template>

<script lang="ts" src="./SkuEdit.ts"/>

<style lang="scss">
  @import '~styles/var.scss';

  .sku-edit-view {
    .sku-edit {
      .content {
        background-color: white;
        padding: 30px;
        .marTop12 {
          margin-top: 12px;
        }
        .padding-left-40 {
          padding-left: 40px;
        }
        .category {
          padding-left: 40px;
          font-size: 14px;
          line-height: 36px;
        }
        .form-content {
          line-height: 36px;
          font-size: 14px;
        }
        .sku-pakage-delete {
          line-height: 36px;
          text-decoration: underline;
          color: #f93e61;
        }
        .sku-pakage {
          margin-bottom: 6px;
        }
        .time_input {
          display: inline-block;
        }
        span {
          font-size: 14px;
        }

        .checkBox {
          line-height: 36px;
          padding-left: 10px;
        }
        .link {
          float: left;
          font-size: 14px;
        }
        .toolbar-style {
          margin-top: 60px;
          text-align: right;
        }
        .label-style {
          font-size: 14px;
          color: black;
          line-height: 36px;
          box-sizing: border-box;
          vertical-align: middle;
        }
        .sub-titlw {
          font-weight: 600;
          font-style: normal;
          font-size: 16px;
          color: #3A3A41;
          line-height: 36px;
          vertical-align: middle;
        }
      }
    }
  }

</style>
