<template>
  <div class="app-container">
    <div>
      APP开门权限:
      <el-switch
        style="display: inline-block;vertical-align: 1px"
        v-model="value2"
        active-text="开启"
        inactive-text="关闭">
      </el-switch>
      <hr/>
      <el-switch
        style="display: inline-block;"
        v-model="isDeletedPwd"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="未删除密码"
        inactive-text="已删除密码"
        @change.native="switchList">
      </el-switch>
      <div style="float:right">
        <el-button type="primary">查看离线密码</el-button>
        <el-button type="primary" @click="dialogFormVisible = true">设置密码</el-button>
        <!-- 设置密码 -->
        <div class="pwd-set">
          <el-dialog title="设置密码" :visible.sync="dialogFormVisible" append-to-body width="30%">
            <el-form :model="form" label-width="100px">
              <el-form-item label="活动时间" required>
                <el-date-picker
                  v-model="value7"
                  type="daterange"
                  align="left"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2"
                  size="large"
                  style="width:100%">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="门锁密码" required>
                <el-input placeholder="请输入内容" v-model="randomNumber" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" type="primary" @click=" getRandomNumber">随机密码</el-button>
              </el-input>
              </el-form-item>
              <el-form-item label="操作对象" required>
                <el-input placeholder="例如 房间A李三" v-model="input5" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" type="primary" @click="dialogTableVisible = true">选择租客号码</el-button>
              </el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入手机号码"></el-input>
              </el-form-item>
            </el-form>
            <span>
              提示说明：<br/>
              这里的操作对象只是方便记录密码实际应用的场景，方便查看开门记录的时候有对应显示。
              部分品牌门锁添加密码可能存在延迟，请耐心等待。
            </span>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- 选择租客号码 -->
        <div clas="">
            <el-dialog title="选择租客号码" :visible.sync="dialogTableVisible" append-to-body width="40%" >
            <span style="color: #999">温馨提示：当前只显示目前房间在住租客的手机号码</span>
            <el-card class="box-card">
              <el-table
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column
                  type="index"
                  width="50">
                </el-table-column>
                <el-table-column
                  property="date"
                  label="日期"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="name"
                  label="姓名"
                  width="120">
                </el-table-column>
                <el-table-column
                  property="address"
                  label="地址">
                </el-table-column>
              </el-table>
            </el-card>
            <div slot="footer" class="dialog-footer">
              <!-- <el-button @click="setCurrent(tableData[1])">选中第二行</el-button> -->
              <el-button @click="setCurrent()">确认选择</el-button>
              <el-button @click="setCurrent()">取消选择</el-button>
            </div>
          </el-dialog>
        </div>
        <!-- <pwdSet v-if="isShowPwdSet"></pwdSet> -->
      </div>
    </div>
    <div :style="tableStyle"  class="model-search clearfix">
      <el-table :data="tableData" v-loading.body="listLoading" :max-height="tableHeight" size="small" fit stripe highlight-current-row>
        <el-table-column type="index" width="60" align="center">
        </el-table-column>
        <el-table-column v-for="(item,index) in colModels" :label="item.label" :width="item.width" key="index" fit show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              {{scope.row[item.prop]}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { validate } from '@/utils/validate'
import pwdSet from './pwdSet'
export default {
  computed: {
    tableStyle: function() {
      return {
        width: '100%',
        height: this.tableHeight + 'px'
      }
    }
  },
  components: { pwdSet },
  data() {
    return {
      isShowPwdSet: false,
      value2: true,
      isDeletedPwd: true,
      tableHeight: 300,
      listLoading: false,
      colModels: [
        { prop: 'id', label: '添加时间', width: 80 },
        { prop: 'gmtCreate', label: '创建人', width: 100 },
        { prop: 'organizationName', label: '密码' },
        { prop: 'type', label: '操作对象', width: 100, type: 'formatType' },
        { prop: 'status', label: '有效时间', width: 80, type: 'status' },
        { prop: 'status', label: '密码状态', width: 80, type: 'status' }
      ],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      input5: '',
      randomNumber: '',
      formLabelWidth: '40px',
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      value7: '',
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val
      console.log(val)
    },
    submitForm(formName) {
      this.dialogFormVisible = false
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     this.dialogFormVisible = false
      //     alert('submit!');
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // })
    },
    resetForm(formName) {
      this.dialogFormVisible = false
      // this.$refs[formName].resetFields();
    },
    getRandomNumber () {
      this.randomNumber = parseInt(Math.random() * 100000 + 100000)
    },
    switchList () {
      let deletedColModels = [
        { prop: 'id', label: '删除时间', width: 80 },
        { prop: 'gmtCreate', label: '删除人', width: 100 },
        { prop: 'organizationName', label: '密码' },
        { prop: 'type', label: '操作对象', width: 100, type: 'formatType' },
        { prop: 'status', label: '有效时间', width: 80, type: 'status' },
        { prop: 'status', label: '添加时间', width: 80, type: 'status' },
        { prop: 'status', label: '创建人', width: 80, type: 'status' }
      ]
      let notDeleteColModels = [
        { prop: 'id', label: '添加时间', width: 80 },
        { prop: 'gmtCreate', label: '创建人', width: 100 },
        { prop: 'organizationName', label: '密码' },
        { prop: 'type', label: '操作对象', width: 100, type: 'formatType' },
        { prop: 'status', label: '有效时间', width: 80, type: 'status' },
        { prop: 'status', label: '密码状态', width: 80, type: 'status' },
        { prop: 'status', label: '操作', width: 80, type: 'status' }
      ]
      this.colModels = !this.isDeletedPwd ? deletedColModels : notDeleteColModels
    }
  }
}
</script>

