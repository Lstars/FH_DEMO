<template>
  <div class="app-container">
    <div class="model-search clearfix">
      <el-radio-group v-model="houseType" size="small" @change="changeType">
        <el-radio-button label="2">分散式</el-radio-button>
        <el-radio-button label="1">集中式</el-radio-button>
      </el-radio-group>
      <el-button class="right" type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="searchRoom">查询</el-button>
    </div>
    <div class="model-table" :style="tableStyle">
        <el-table
            :data="tableData"
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
                        v-if="item.type === 'houseState'"
                        :type="scope.row[item.prop] | statusFilter">
                        {{scope.row[item.prop] | filterStr('houseState')}}
                    </el-tag>
                    <span v-else>
                        {{scope.row[item.prop]}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="scope.row.houseState == 3" size="small" @click.native="orderCreate(scope.row)">租客录入</el-button>
                    <el-button type="primary" v-if="scope.row.houseState != 3" size="small" @click.native="editData(scope.$index,scope.row)">订单信息</el-button>
                    <el-button type="primary" size="small" @click.native="delData(scope.$index,scope.row)">智能门锁</el-button>
                    <el-button type="primary" v-if="scope.row.houseState != 3" size="small" @click.native="editData(scope.$index,scope.row)">退房</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 租客录入 -->
    <div class="dialog-info">
      <el-dialog title="租客录入" :visible.sync="layer_showInfo" width="680px" @close="dialogClose">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" size="small">
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="交租方式" >
                <el-input value="磐谷分期·月付"
                disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="房价" prop="rentFee">
                <el-input v-model="ruleForm.rentFee">
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="押金" prop="depositFee">
                <el-input v-model="ruleForm.depositFee">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="入住日期" prop="startDate">
                <el-date-picker
                  v-model="ruleForm.startDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租期" prop="rentMonth">
                <el-select size="small" v-model="ruleForm.rentMonth"
                  placeholder="请选择租期" style="width:100%"
                  >
                  <el-option
                    v-for="(item,index) in 12"
                    :key="item"
                    :label="item+'月'"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix border">
            <el-col :span="9">
              <el-form-item label="姓名" prop="customerName">
                <el-input v-model="ruleForm.customerName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select size="small" v-model="ruleForm.customerGender"
                  placeholder="" style="width:100%"
                  >
                  <el-option
                    v-for="item in sexOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="customerMobile">
                <el-input v-model.number="ruleForm.customerMobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号码" prop="customerCardNo">
                <el-input v-model="ruleForm.customerCardNo"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix" style="padding-top: 10px">请引导租客在APP签订合同后再付款</div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="handleSaveData">确定</el-button>
          <el-button @click="layer_showInfo = false" size="small">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 确认弹窗 -->
    <div class="dialog-info">
      <el-dialog title="信息" :visible.sync="layer_alert"
        width="500px" @close="dialogClose">
        <div>
          请确认客户资料是否正确，点击确定后，<br>
          订单信息会同步至客户（手机号）<span class="red">{{ruleForm.customerMobile}}</span>,<br>
          的APP账号，如果需要请引导客户在APP端完成签约或者完成支付操作
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="postSaveData">确定</el-button>
          <el-button @click="layer_alert = false" size="small">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 订单信息 -->
    <div class="dialog-info">
      <el-dialog title="租客录入" :visible.sync="layer_order" width="720px" @close="dialogClose">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" size="small">
          <div class="clearfix">
            <el-col :span="9">
              <el-form-item label="姓名" prop="customerName">
                <el-input v-model="ruleForm.customerName" :disabled="isDidsabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select size="small" v-model="ruleForm.customerGender"
                  placeholder="" style="width:100%" :disabled="isDidsabled">
                  <el-option
                    v-for="item in sexOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="customerMobile">
                <el-input v-model.number="ruleForm.customerMobile" :disabled="isDidsabled"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="身份证号码" prop="customerCardNo">
                <el-input v-model="ruleForm.customerCardNo" :disabled="isDidsabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交租方式" >
                <el-input value="磐谷分期·月付"
                disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="房价" prop="rentFee">
                <el-input v-model="ruleForm.rentFee" :disabled="isDidsabled">
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="押金" prop="depositFee">
                <el-input v-model="ruleForm.depositFee" :disabled="isDidsabled">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="合同开始日期" prop="startDate" :disabled="isDidsabled">
                <el-date-picker
                  v-model="ruleForm.startDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同结束日期" prop="startDate" :disabled="isDidsabled">
                <el-date-picker
                  v-model="ruleForm.startDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </div>
          <!-- <div class="clearfix border orderBox">
            <div v-for="(item,index) in orderData" :class="{clearfix:true,borderBottom : index == 0}">
              <el-col :span="5">{{item.name}}</el-col>
              <el-col :span="4">{{item.price}}</el-col>
              <el-col :span="5">{{item.date}}</el-col>
              <el-col :span="4">{{item.type}}</el-col>
              <el-col :span="6">{{item.realDate}}</el-col>
            </div>
          </div> -->
          <!-- <div style="padding-top:10px">
            <el-button type="primary" size="small" @click="handleSaveData">房租合同</el-button>
            <el-button type="primary" size="small" @click="handleSaveData">分期合同</el-button>
          </div> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="handleSaveData">确定</el-button>
          <el-button @click="layer_order = false" size="small">取 消</el-button>
        </div>
      </el-dialog>
    </div>

  </div>

</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { validateMobile } from '@/utils/validate'
import { ObjectMap,deepClone } from '@/utils'
import { houseStateApi,createOrderApi } from '@/api/rentals'
export default {
  name: 'rentals',
  directives: {
      waves
  },
  filters: {
    statusFilter(status) {
        const statusMap = {
            '0': 'info',
            '1': 'success',
            '2': 'danger'
        }
        return statusMap[status] || 'info'
    },
    filterStr(status, key) {
      console.log(key)
      const statusStrData = {
        'status': ['已定','已租','未租']
      }
      if (!statusStrData[key]) {
        return '';
      }
      return ;
    },
  },
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
        rentFee: [
          { required: true, message: '请输入房价', trigger: 'blur' }
        ],
        depositFee: [
          { required: true, message: '请输入押金', trigger: 'blur' }
        ],
        startDate: [
          { required: true, type:'date', message: '请选择入住日期', trigger: 'change' }
        ],
        rentMonth: [
          { required: true, message: '请选择租期', trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        customerMobile: [
          { validator: validatePhone, required: true,trigger: 'blur' }
        ],
        customerCardNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' }
        ]

      },
      selectOptions: [
        {label: '全部房源', value: 1},
      ],
      sexOpts: [
        {label: '男', value: 1},
        {label: '女', value: 2},
      ],
      isDidsabled: false,
      houseType: 1,
      ruleForm: {
        roomCode: '',
        rentFee: '',
        depositFee: '',
        startDate: '',
        rentMonth: '',
        renterRemark: '备注',
        customerName: '',
        customerGender: 1,
        customerMobile: '',
        customerCardType: '',
        customerCardNo: ''
      },
      listLoading: false,
      layer_alert: false,
      layer_order: false,
      colModels:[
        { prop:'roomCode', label: '房源编码'},
        { prop:'houseState', label: '状态', type:'status'}
      ],
      tableHeight: 300,
      userId: localStorage.getItem('userId'),
      accountName: '',
      tableData: [
        {
          "roomCode" : 100000011,
          "houseState" : "3"
        }
      ],
      orderData: [
        {
          name: '首期租金',
          price: '9999.99',
          date: '2018/03/12',
          type: '已支付',
          realDate: '2018/03/14 12:12:12'
        },
        {
          name: '第二期租金',
          price: '9999.99',
          date: '2018/03/12',
          type: '已支付',
          realDate: '2018/03/14 12:12:12'
        },
        {
          name: '第三期租金',
          price: '9999.99',
          date: '2018/03/12',
          type: '已支付',
          realDate: '2018/03/14 12:12:12'
        },
        {
          name: '第四期租金',
          price: '9999.99',
          date: '2018/03/12',
          type: '已支付',
          realDate: '2018/03/14 12:12:12'
        },
      ],
      total: null,
      pageItems: {
        pageNo: 1,
        pageSize: 20
      },
      pageSizeList: [10, 20, 30, 50],
      layer_showInfo: false,
      layer_showInfo2: true,
      houseType: 1,//分散式1 集中式2
    }
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
    this.financeUser = JSON.parse(localStorage.getItem('financeUser')) || [];
    this.financeUser.map(val => {
      if (val.userId == this.userId) {
        this.accountName = val.accountName;
      }
    })
    this.defaultRuleForm = deepClone(this.ruleForm);
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
    searchRoom() {
      this.$prompt('请输入房源编码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator(val) {
          if(!val) {
            return '房源编码不能为空'
          }
        }
      }).then(({ value }) => {
        // let param = {
        //   accountName: this.accountName,
        //   roomCode: value,
        //   houseType: this.houseType
        // }
        let param = {
          accountName: '6feb893c0080446f84fa234bc9665547',
          roomCode: value,
          houseType: 2
        }
        // this.tableData = [
        //   {
        //     "roomCode" : value,
        //     "houseState" : "1"
        //   }
        // ]
        //TODO 系统异常
        houseStateApi(param).then(response => {

        }).catch(response => {})
      }).catch(() => {

      });
    },
    orderCreate(val) {
      this.ruleForm.roomCode = val.roomCode;
      this.layer_showInfo = true;
    },
    handleApply() {
      // this.layer_showInfo = true;
      this.layer_order = true;
    },
    dialogClose() {
      this.layer_showInfo = false;
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = deepClone(this.defaultRuleForm)
    },
    handleSaveData() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.layer_alert = true;
        } else {
          return false;
        }
      });

    },
    postSaveData(){
      createOrderApi(this.ruleForm).then(response => {

      }).catch(response => {})
    },
    handleSizeChange(val) {
      this.pageItems.pageSize = val;
      this.getGridData(this.pageItems);
    },
    handleCurrentChange(val) {
      this.pageItems.pageNo = val;
      this.getGridData(this.pageItems);
    },
    changeType() {
    },
    closeOverlay() {
      this.layer_showInfo2 = false;
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .border {
    border:1px solid #ccc;
    padding: 10px;
  }
  .red {
    color: red;
  }
  .orderBox {
    padding: 5px;
    line-height: 30px;
    .borderBottom {
      border-bottom: 1px solid #ccc;
    }
  }

</style>
