<template>
  <div>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" append-to-body>
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    components: { 
    },
    data() {
      return {
        dialogFormVisible: true,
        tabMapOptions: ['开门记录', '房间权限管理'],
        activeName: '开门记录',
        pageItems: {
          pageNo: 1,
          pageSize: 20
        },
        pageSizeList: [10, 20, 30, 50],
        total: null,
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
        formLabelWidth: '120px'
      };
    },
    methods: {
      handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleSizeChange(val) {
        this.pageItems.pageSize = val;
        this.getGridData(this.pageItems);
      },
      handleCurrentChange(val) {
        this.pageItems.pageNo = val;
        this.getGridData(this.pageItems);
      }
    }
  };
</script>