<template>
  <div class="app-container">
    <div class="model-search clearfix">
      <el-radio-group v-model="formData.houseType" size="small" @change="changeType">
        <el-radio-button label="1">分散式</el-radio-button>
        <el-radio-button label="2">集中式</el-radio-button>
      </el-radio-group>
      <el-select size="small" v-model="formData.type"
          placeholder="全部房源" class="item-select"
          style="width: 150px;"
          @change="searchParam"
          >
          <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
      </el-select>
      <el-input size="small" v-model.trim="formData.searchField" placeholder="公寓/小区名称" class="filter-item"
          style="width:180px;"
          @keydown.native.enter="searchParam">
      </el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click.native="searchParam" v-waves class="filter-item">查询</el-button>
      <el-button plain size="small" icon="el-icon-remove-outline" @click.native="clearForm">清空</el-button>
      <el-button class="right" type="primary" size="small" icon="el-icon-circle-plus-outline" @click.native="handleApply">成为金融用户</el-button>
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
            <el-table-column label="操作" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="small" @click.native="editData(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" @click.native="delData(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="model-pagination">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageItems.pageNo"
            :page-sizes="pageSizeList"
            :page-size="pageItems.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>

    <!-- 成为金融用户 -->
    <div class="dialog-info">
      <el-dialog title="注册磐谷金融" :visible.sync="layer_showInfo" width="600px" @close="dialogClose">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" size="small">
          <el-form-item label-width="20px">
            <el-radio-group v-model="ruleForm.radio" size="small">
              <el-radio-button label="1">个人用户</el-radio-button>
              <el-radio-button label="2">企业用户</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model.number="ruleForm.mobile"></el-input>
          </el-form-item>
          <el-form-item :label="ruleForm.radio == 1 ? '姓名' : '法人姓名'" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="ruleForm.radio == 1 ? '身份证' : '法人身份证'" prop="cardNo">
            <el-input v-model="ruleForm.cardNo"></el-input>
          </el-form-item>
          <div class="clearfix" v-if="ruleForm.radio == 2">
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
      <signature :isShow="layer_showInfo2" @closeOverlay="closeOverlay"></signature>
    </div>
  </div>

</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { validateMobile } from '@/utils/validate'
import signature from './components/signature'
export default {
  name: 'applyFinance',
  directives: {
      waves
  },
  components: { signature },
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
      selectOptions: [
        {label: '全部房源', value: 1},
      ],
      formData: {
        type: '',
        houseType: 1,
        searchField: ''
      },
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
        { prop:'organizationName', label: '房源位置'},
        { prop:'displayName', label: '房源信息'},
        { prop:'status', label: '状态', type:'status', width:80}
      ],
      tableHeight: 300,
      tableData: [],
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
    searchParam() {

    },
    clearForm() {

    },
    handleApply() {
      this.layer_showInfo2 = true;
      console.log(this.layer_showInfo2)
    },
    dialogClose() {
      this.layer_showInfo = false;
      this.$refs.ruleForm.clearValidate();
      Object.keys(this.ruleForm).forEach((key) => {
        if (key == 'radio') {
          this.ruleForm[key] = 1;
        } else {
          this.ruleForm[key] = '';
        }

      })
    },
    handleSaveData() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
        } else {
          return false;
        }
      });
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

