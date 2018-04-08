<template>
  <div class="app-container">
    <div class="model-search clearfix">
      <el-button class="right left10" type="primary" size="small" v-if="isFinance" @click.native="layer_addHouse = true">录入房源并申请</el-button>
      <el-button class="right" type="primary" size="small" v-if="isFinance && !isReview" @click.native="layer_signature = true">电子签章</el-button>
      <el-button class="right" type="primary" size="small" v-if="!isFinance" @click.native="handleApply">成为金融用户</el-button>
    </div>
    <div class="model-table" :style="tableStyle">
        <el-table
            :data="tableData"
            v-loading.body="listLoading"
            :max-height="tableHeight"
            size="small"
            fit stripe highlight-current-row>
            <el-table-column v-for="(item,index) in colModels"
                :label="item.label"
                :width="item.width"
                :key="index"
                fit
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag
                        v-if="item.type === 'status'"
                        :type="scope.row[item.prop] | statusFilter">
                        {{scope.row[item.prop] | filterStr('status')}}
                    </el-tag>
                    <span v-else-if="item.type === 'dateStr'">
                        {{scope.row[item.prop] | dateFilter}}
                    </span>
                    <span v-else>
                        {{scope.row[item.prop]}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 成为金融用户 -->
    <div class="dialog-info">
      <el-dialog title="注册磐谷金融" :visible.sync="layer_showInfo" width="500px" @close="dialogClose">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" size="small">
          <el-form-item label-width="20px">
            <el-radio-group v-model="ruleForm.radio" size="small">
              <el-radio-button label="2">个人用户</el-radio-button>
              <el-radio-button label="1">企业用户</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model.number="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-form-item :label="ruleForm.radio == 2 ? '姓名' : '法人姓名'" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="ruleForm.radio == 2 ? '身份证' : '法人身份证'" prop="cardNo">
            <el-input v-model="ruleForm.cardNo"></el-input>
          </el-form-item>
          <div class="clearfix" v-if="ruleForm.radio == 1">
            <el-form-item label="企业名称" prop="company">
              <el-input v-model="ruleForm.company"></el-input>
            </el-form-item>
            <el-form-item label="社会统一信用代码" prop="companyNo">
              <el-input v-model="ruleForm.companyNo"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="layer_showInfo = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="handleSaveData">确定绑定并注册</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 电子签章 -->
    <div class="dialog-info">
      <signature :isShow="layer_signature" :nowFinance="nowFinance" @closeOverlay="layer_signature = false" @updateType="closeSignature"></signature>
    </div>
    <!-- 录入房源 -->
    <div class="dialog-info">
      <add-house :isShow="layer_addHouse" :uuid="accountName" @addTable="addTable" @closeOverlay="layer_addHouse = false"></add-house>
    </div>
  </div>

</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { validateMobile } from '@/utils/validate'
import signature from './components/signature'
import addHouse from './components/addHouse'
import { ObjectMap,deepClone } from '@/utils'
import { addAccountApi } from '@/api/applyFinance'
export default {
  name: 'applyFinance',
  directives: {
      waves
  },
  components: { signature,addHouse },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validateMobile(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        cardNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        companyNo: [
          { required: true, message: '请输入社会统一信用代码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        mobile: [
          { validator: validatePhone, required: true,trigger: 'blur' }
        ]

      },
      userId: localStorage.getItem('userId'),
      accountName: null,
      financeUser: [],//已申请的用户数组
      isReview:false,//是否申请过电子签章
      nowFinance: {},
      isFinance:false,//是否已申请为金融用户
      formData: {
        type: '',
        houseType: 1,
        searchField: ''
      },
      defalutForm: {},
      ruleForm: {
        mobile: '',
        name: '',
        cardNo: '',
        company: '',
        companyNo: '',
        address: '',
        radio: '1'
      },
      listLoading: false,
      colModels:[
        { prop:'houseAddress', label: '房源位置'},
        { prop:'houseInfo', label: '房源信息'},
        { prop:'rentType', label: '出租方式'},
        { prop:'status', label: '状态'}
      ],
      tableHeight: 300,
      tableData: [],
      layer_showInfo: false,
      layer_signature: false,
      layer_addHouse: false,
      houseType: 1,//分散式1 集中式2
    }
  },
  created() {
    this.defalutForm = deepClone(this.ruleForm);
    this.tableData = JSON.parse(localStorage.getItem(this.userId)) || [];
    this.financeUser = JSON.parse(localStorage.getItem('financeUser')) || [];
    let accountName = null;
    this.financeUser.map(val => {
      if (val.userId == this.userId) {
        this.isFinance = true;
        this.accountName = val.accountName;
        this.nowFinance = val;
        this.isReview = val.isReview || false;
      }
    })
  },
  mounted() {
    /* 表格高度控制 */
    let temp_height = document.body.clientHeight - 200;
    this.tableHeight = temp_height > 300 ? temp_height : 300;
    window.onresize = () => {
      return (() => {
        temp_height = document.body.clientHeight - 200;
        this.tableHeight = this.tableHeight = temp_height > 300 ? temp_height : 300;
      })()
    }
  },
  computed: {
    tableStyle: function() {
      return {
        width: '100%',
        height: this.tableHeight + 'px'
      }
    }
  },
  methods: {
    handleApply() {
      this.layer_showInfo = true;
    },
    addTable(val) {//数组添加房源
      this.tableData.push(val);
      this.layer_addHouse = false;
    },
    dialogClose() {
      this.layer_showInfo = false;
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = deepClone(this.defalutForm)
    },
    closeSignature() {
      this.financeUser.map(val => {
        if (val.userId == this.userId) {
          this.isReview = true;
          val.isReview = true;
        }
      })
      localStorage.setItem('financeUser',JSON.stringify(this.financeUser));
      this.layer_signature = false;
    },
    handleSaveData() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let param = {
            basicInfo: {//组织基本信息 个人也要组织 莫名其妙
              organizationName: this.ruleForm.company || this.ruleForm.name,
              orgLicence: this.ruleForm.companyNo || this.ruleForm.name,
              type: this.ruleForm.radio,
              orgLegalPersonName: this.ruleForm.name,
              orgLegalPersonCardNo: this.ruleForm.cardNo,
              orgAddrDetail: this.ruleForm.address
            },
            userInfo: {//用户基本信息
              name: this.ruleForm.name,
              cardType: 1,
              cardNo: this.ruleForm.cardNo,
              mobile: this.ruleForm.mobile
            }
          }

          addAccountApi(ObjectMap(param)).then(response => {
            let userData = {
              accountName: response.data.accountName,
              userId: this.userId,
              houseType: this.ruleForm.radio,
              name: this.ruleForm.name,
              cardNo: this.ruleForm.cardNo,
              mobile: this.ruleForm.mobile,
              company: this.ruleForm.company,
              companyNo: this.ruleForm.companyNo
            }
            this.nowFinance = userData;
            this.financeUser.push(userData);
            this.isFinance = true;
            this.accountName = response.data.accountName;
            localStorage.setItem('financeUser',JSON.stringify(this.financeUser));
            this.layer_showInfo = false;
          }).catch(response => {

          })

        } else {
          return false;
        }
      });
    }
  },
  watch:{
    tableData (val){//监测表格数据 如果增加了修改缓存数据
      localStorage.setItem(this.userId, JSON.stringify(val));
    }
  }
}
</script>

