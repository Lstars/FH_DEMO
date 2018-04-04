<template>
  <div>
    <div class="model-search clearfix">
      <el-form size="small" :inline="true" :model="formData">
        <el-date-picker v-model="dateTime" size="small" id="bolin" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:360px">
        </el-date-picker>
        <el-select size="small" style="width:130px" v-model="formData.type" placeholder="电子签章模块" class="item-select filter-item" clearable>
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input size="small" v-model="formData.name" placeholder="输入组织名称查询" class="filter-item" style="width:180px;" @keydown.native.enter="searchParam">
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click.native="searchParam" v-waves class="filter-item">查询</el-button>
        <el-button plain size="small" icon="el-icon-remove-outline" @click.native="clearForm">清空</el-button>
      </el-form>
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
    <div class="model-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageItems.pageNo" :page-sizes="pageSizeList" :page-size="pageItems.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getDoorControlRecord } from '@/api/intelligentDevice'
import { ObjectMap, deepClone } from '@/utils'
import waves from '@/directive/waves' // 水波纹指令

export default {
  props: {
    deviceData: {
      type: Object,
      default: function () {
        return {
          houseType: 1,
          positionType: 3,
          roomId: 91211,
          operatorType: 0,
          deviceType: 3,
          keyword: '',
          startTime: '2018-01-01 16:41:40',
          endTime: '2018-03-31 16:41:40'
        }
      }
    }
  },
  components: { },
  data() {
    return {
      pageSizeList: [10, 20, 30, 50],
      total: null,
      formData: {
        name: '',
        type: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      pageItems: {
        pageNo: 1,
        pageSize: 20
      },
      typeOptions: [
        { value: 3, label: '个人电子签章' },
        { value: 2, label: '企业电子签章' },
        { value: 1, label: '个人升级企业' }
      ],
      auditOptions: [
        { value: 1, label: '未审核' },
        { value: 3, label: '审核不通过' },
        { value: 2, label: '审核通过' }
      ],
      listLoading: false,
      tableData: [],
      tableHeight: 300,
      tableData: [],
      searchParams: {},
      dateTime: [],
      colModels: [
        { prop: 'id', label: '操作时间', width: 80 },
        { prop: 'gmtCreate', label: '操作对象', width: 180 },
        { prop: 'organizationName', label: '设备位置' },
        { prop: 'type', label: '操作平台', width: 100, type: 'formatType' },
        { prop: 'status', label: '类型', width: 150, type: 'status' }
      ]
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
  directives: {
    waves
  },
  methods: {
    handleSizeChange(val) {
      this.pageItems.pageSize = val;
      this.getGridData(this.pageItems);
    },
    handleCurrentChange(val) {
      this.pageItems.pageNo = val;
      this.getGridData(this.pageItems);
    }
  },
  mounted () {
    let params = Object.assign(deepClone(this.pageItems), deepClone(this.deviceData));
    // getDoorControlRecord(ObjectMap(params)).then(res => {
    //   console.log(res)
    //     // this.tableData = response.data.list;
    //     // this.total = response.data.record;
    //     // this.listLoading = false;
    //   })
    // this.listLoading = true
    // this.$store.dispatch('getdoorControlRecord', this.deviceData).then((res) => {
    //   this.loading = false
    //   this.tableData = response.data.list;
    //  this.total = response.data.record;
    //  this.listLoading = false;
    // }).catch(() => {
    //   this.loading = false
    // })
  }
}
</script>

