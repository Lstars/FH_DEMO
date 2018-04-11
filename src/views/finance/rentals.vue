<template>
  <div class="app-container">
    <div class="model-search clearfix">
      <el-button class="right" type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="searchRoom">房态查询</el-button>
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
                        v-if="item.type === 'status'"
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
                    <el-button type="primary" v-if="scope.row.houseState != 3" size="small" @click.native="orderLook(scope.row)">订单信息</el-button>
                    <el-button type="primary" size="small" @click.native="deviceInfo(scope.$index,scope.row)">智能门锁</el-button>
                    <el-button type="primary" v-if="scope.row.houseState != 3" size="small" @click.native="checkOut(scope.row)">退房</el-button>
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
          <div class="clearfix border orderBox" style="margin-top: 10px" v-show="showFirst">
            <el-col :span="5">首期租金</el-col>
            <el-col :span="4">{{ruleForm.rentFee}}</el-col>
            <el-col :span="6"></el-col>
            <el-col :span="3">未付款</el-col>
            <el-col :span="6"></el-col>
          </div>
          <div class="clearfix" style="padding-top: 10px">请引导租客在APP签订合同后再付款</div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" v-show="!showFirst" @click="handleSaveData">确定</el-button>
          <el-button type="primary" size="small" v-show="showFirst" @click="investment">首笔确认收款</el-button>
          <el-button type="primary" size="small" v-show="showFirst" @click="cancelOrder">取消录入</el-button>
          <el-button @click="layer_showInfo = false" size="small">取 消</el-button>

        </div>
      </el-dialog>
    </div>

    <!-- 房态查询 -->
    <div class="dialog-info">
      <el-dialog title="房态查询" :visible.sync="layer_status"
        width="500px" @close="closeStatus">
         <el-form :model="statusForm" status-icon :rules="rules" ref="statusForm" label-width="120px" size="small">
            <el-form-item label="房源类型">
              <el-radio-group v-model="statusForm.houseType" size="small">
                <el-radio-button label="2">分散式</el-radio-button>
                <el-radio-button label="1">集中式</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="房源编码" prop="roomCode">
              <el-input v-model="statusForm.roomCode" ></el-input>
            </el-form-item>
         </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="layer_status = false" size="small">取 消</el-button>
           <el-button type="primary" size="small" @click="statusSearch">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 确认弹窗 -->
    <div class="dialog-info">
      <el-dialog title="信息" :visible.sync="layer_alert"
        width="500px">
        <div>
          请确认客户资料是否正确，点击确定后，<br>
          订单信息会同步至客户（手机号）<span class="red">{{ruleForm.customerMobile}}</span>,<br>
          的APP账号，如果需要请引导客户在APP端完成签约或者完成支付操作
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="layer_alert = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="postSaveData">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="dialog-info">
      <el-dialog :visible.sync="layer_contract"
        width="100%" height="100%" :fullscreen="true">
        <iframe :src="contactUrl" width="100%" align="" :height="contactHeight"></iframe>
      </el-dialog>
    </div>

    <!-- 订单信息 -->
    <div class="dialog-info">
      <el-dialog title="订单信息" :visible.sync="layer_order" width="720px" @close="orderForm = {}">
        <el-form :model="orderForm" status-icon :rules="rules" ref="orderForm" label-width="120px" size="small">
          <div class="clearfix">
            <el-col :span="9">
              <el-form-item label="姓名">
                <el-input v-model="orderForm.contactName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-select size="small" v-model="orderForm.customerGender"
                  placeholder="" style="width:100%" disabled>
                  <el-option
                    v-for="item in sexOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码">
                <el-input v-model.number="orderForm.contactMobile" disabled></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="身份证号码" prop="customerCardNo">
                <el-input v-model="orderForm.customerCardNo" disabled></el-input>
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
                <el-input v-model="orderForm.rentFee" disabled>
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="押金" prop="depositFee">
                <el-input v-model="orderForm.depositFee" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item label="合同开始日期">
                <el-input :value="orderForm.startTime | dateStr" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同结束日期">
                <el-input :value="orderForm.endTime | dateStr" disabled></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix border orderBox" v-if="orderData.length > 0">
            <div v-for="(item,index) in orderData" :class="{clearfix:true,borderBottom : index == 0}">
              <el-col :span="5">{{item.period | nameStr}}</el-col>
              <el-col :span="4">{{item.repayAmt}}</el-col>
              <el-col :span="6">{{item.repayDate | dateStr}}</el-col>
              <el-col :span="3">{{item.status | statusStr}}</el-col>
              <el-col :span="6">{{item.realRepayDate | dateStr}}</el-col>
            </div>
          </div>
          <div style="padding-top:10px" v-if="isLook">
            <el-button type="primary" size="small" @click="lookContract(1)">房租合同</el-button>
            <el-button type="primary" size="small" @click="lookContract(2)">分期合同</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <intelligentDevice ref="dialog"></intelligentDevice>
  </div>

</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { validateMobile } from '@/utils/validate'
import { ObjectMap, deepClone, parseTime } from '@/utils'
import { houseStateApi, createOrderApi, contractApi, orderListApi, planListApi, firstConfirmOrderApi, fcheckOutApi } from '@/api/rentals'
const intelligentDevice = () => import('./components/intelligentDevice')
export default {
  name: 'rentals',
  directives: {
    waves
  },
  components: {
    intelligentDevice
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'primary',
        '2': 'primary',
        '3': 'info'
      }
      return statusMap[status] || 'primary'
    },
    filterStr(status, key) {
      const statusText = {
        '1': '已定',
        '2': '已租',
        '3': '未租'
      }
      return statusText[status] || '未租';
    },
    dateStr(val) {
      return val ? parseTime(val) : '';
    },
    nameStr(val) {
      let str = '';
      if (val) {
        str = val == 1 ? '首期租金' : `第${val}期租金`
      }
      return str;
    },
    statusStr(val) {
      return val == 2 ? '已还款' : '未还款'
    }
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
      isShowIntelligentDevice: false,
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
        ],
        roomCode: [
          { required: true, message: '请输入房源编码', trigger: 'blur' }
        ]
      },
      selectOptions: [
        {label: '全部房源', value: 1},
      ],
      sexOpts: [
        {label: '男', value: 1},
        {label: '女', value: 2},
      ],
      locationUrl: 'http://www.baidu.com',
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
        customerCardType: 1,
        customerCardNo: ''
      },
      orderForm: {},
      statusForm: {
        houseType: 2,
        roomCode: ''
      },
      showFirst: false,
      layer_contract: false,
      listLoading: false,
      layer_alert: false,
      layer_status: false,
      layer_order: false,
      isLook: false,//是否订单详情
      colModels:[
        { prop:'roomCode', label: '房源编码'},
        { prop:'houseState', label: '状态', type:'status'}
      ],
      tableHeight: 300,
      contactHeight: 500,
      contactUrl: '',
      userId: localStorage.getItem('userId'),
      accountName: '',
      tableData: [],
      orderData: [],
      total: null,
      orderNo: '',
      pageItems: {
        pageNo: 1,
        pageSize: 20
      },
      line: '',
      pageSizeList: [10, 20, 30, 50],
      layer_showInfo: false,
      houseType: 1,//分散式1 集中式2
    }
  },
  mounted() {
    /* 表格高度控制 */
    let temp_height = document.body.clientHeight - 200;
    this.tableHeight = temp_height > 300 ? temp_height : 300;
    this.contactHeight = document.body.clientHeight - 80;
    window.onresize = () => {
      return (() => {
        temp_height = document.body.clientHeight - 200;
        this.contactHeight = document.body.clientHeight - 80;
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
      this.layer_status = true;
    },
    statusSearch() {//查询房态
      this.$refs.statusForm.validate((valid) => {
        if (valid) {
          this.statusForm.accountName = this.accountName;
          houseStateApi(this.statusForm).then(response => {
            if (response.data) {
              this.tableData.push(response.data)
            }
            this.layer_status = false;
          }).catch(response => {})
        } else {
          return false;
        }
      });
    },
    closeStatus() {
      this.statusForm = {
        houseType: 2,
        roomCode: ''
      }
      this.$refs.statusForm.clearValidate();
    },
    orderCreate(val) {//租客录入
      this.isLook = false;
      this.ruleForm.roomCode = val.roomCode;
      this.layer_showInfo = true;
      this.line = val;
    },
    orderLook(val) {//订单详情
      let param = {
        accountName: this.accountName,
        roomCode: val.roomCode
      }
      this.getOrderNo(val).then(orderNo => {
        let plan = {
          accountName: this.accountName,
          orderNo: orderNo
        }
        this.orderNo = orderNo;
        // 查询交租计划
        planListApi(plan).then(response => {
          this.orderData = response.data;
        }).catch(response => {})

        this.isLook = true;
        this.layer_order = true;
        return false;
      }).catch(response => {})
    },
    getOrderNo(val) {//获取订单号
      return new Promise((resolve,reject) => {
        let param = {
          accountName: this.accountName,
          roomCode: val.roomCode
        }
        orderListApi(param).then(response => {
          if (response.data) {
            for (var i in response.data) {
              if (response.data[i].status == 3) {
                this.orderForm = response.data[i];
                resolve(response.data[i].orderNo)
              }
            }

          }
          this.layer_status = false;
        }).catch(response => {
          reject()
        })
      })
    },
    checkOut(val) {//退房
      this.$confirm('确定要退房吗？退房后，租客会失去门锁APP开门权限', '退房提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          accountName: this.accountName,
          roomCode: val.roomCode
        }
        //获取订单号退房
        this.getOrderNo(val).then(orderNo => {
          let checkOutData = {
            accountName: this.accountName,
            orderNo: orderNo,
            checkoutDate: parseTime(new Date())
          }
          fcheckOutApi(checkOutData).then(response => {
            this.$message.success('退房成功');
            val.houseState = 3;
          }).catch(response => {})
        })

      }).catch(() => {});
    },
    investment() {//首笔确认收款
      this.$confirm('已确认收到首期租金', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          orderNo: this.orderNo,
          payType: 1,//默认现金
          accountName: this.accountName
        }
        firstConfirmOrderApi(param).then(response => {
          this.isLook = true;
          this.layer_showInfo = false;
          this.line.houseState = 2;
        }).catch(response => {})
      }).catch(() => {});
    },
    cancelOrder() {//取消录入
      this.$confirm('确定要取消录入吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.layer_showInfo = false;
      }).catch(() => {});
    },
    lookContract(type) {//房租合同/分期合同
      let param = {
        accountName: this.accountName,
        orderNo: this.orderNo
      }
      contractApi(this.statusForm).then(response => {
        if (response.data) {
          let url = null;
          response.data.map(val => {
            if (val.type == type) {
              url = val.contentUrl;
              return;
            }
          })
          if(url) {
            this.contactUrl = url;
            this.layer_contract = true;
          } else {
            let msg = '查询到' + (type == 1 ? '房租合同' : '分期合同');
            this.$message.error(msg);
          }
        }
        this.layer_status = false;
      }).catch(response => {})
    },
    handleApply() {
      this.layer_order = true;
    },
    dialogClose() {
      this.layer_showInfo = false;
      this.$refs.ruleForm.clearValidate();
      this.showFirst = false;
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
      this.ruleForm.startDate = parseTime(this.ruleForm.startDate);
      this.ruleForm.accountName = this.accountName;

      createOrderApi(this.ruleForm).then(response => {
        this.layer_alert = false;
        this.showFirst = true;
        this.orderNo = response.data;
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
    deviceInfo() {//智能门锁
      this.$message.error('等台柱子')
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
    line-height: 35px;
    .borderBottom {
      border-bottom: 1px solid #ccc;
    }
  }

</style>
