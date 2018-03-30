<template>
	<div>
	  <el-dialog title="电子签章" :visible.sync="layer_showInfo" width="840px" @close="dialogClose">
	    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" size="small">
	      <div class="clearfix">
	        <el-col :span="12">
            <el-form-item :label="layerType == 1 ? '实名认证' : '企业名称'" >
              <el-input
              v-model="ruleForm.name"
              disabled
              ></el-input>
            </el-form-item>
	        </el-col>
	        <el-col :span="12">
            <el-form-item label="合同联系电话" prop="mobile">
              <el-input v-model.trim="ruleForm.mobile"></el-input>
            </el-form-item>
	        </el-col>
	      </div>
	      <div class="clearfix">
	        <el-col :span="12">
	            <el-form-item label="社会统一信用代码" prop="name" >
	                <el-input
	                v-model.trim="ruleForm.name"
	                ></el-input>
	            </el-form-item>
	        </el-col>
	        <el-col :span="12">
	            <el-form-item label="法人身份证" prop="mobile">
	                <el-input v-model.trim="ruleForm.mobile"></el-input>
	            </el-form-item>
	        </el-col>
	      </div>
	      <div class="clearfix">
	        <el-form-item label="您的电子签名" >
	            <el-button type="info" size="mini">未使用</el-button>
	        </el-form-item>
	      </div>
	      <div :class="{clearfix: true}">
	        <el-form-item label="营业执照">
	          <el-upload
	            :action="`${actionBaseUrl}/util/upload/uploadPicture`"
	            :before-upload="pictureUpload"
	            :on-preview="picturePreview"
	            :on-change="resetFile"
	            :on-error="pictureError"
	            :on-success="pictureSuccess"
	            :file-list="fileList"
	            :on-remove="pictureRemove"
	            multiple
	            accept="image/jpg,image/jpeg,image/png"
	            list-type="picture-card">
	            <i class="el-icon-plus"></i>
	            <div slot="tip" class="el-upload__tip">点击确定后，会提交审核申请</div>
	          </el-upload>
	        </el-form-item>
	      </div>
	      <div class="clearfix">
	      	<el-checkbox v-model="ruleForm.checked">
	      	我已阅读并同意</el-checkbox>
	      	<span class="attorney" @click="lookAttorney">《电子签章授权委托书》</span>并生成电子签名/签章用于签署在线房租合同、分期协议
	      </div>
	      <!-- <vue-qr text="http://www.baidu.com?112" height="200" width="200"></vue-qr> -->
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	    	<el-button type="primary" size="small" @click="handleSaveData">确 定</el-button>
	      <el-button @click="layer_showInfo = false" size="small">取 消</el-button>

	    </div>
	  </el-dialog>

    <el-dialog
      title="查看协议"
      :visible.sync="layer_attorney" width="800px"
      @close="layer_attorney = false">
      <div class="protocolDiv">
	      <h4 class="text-center">电子签章授权委托书</h4>
	      <br />
	      <p style="margin-left:2em;">
          兹授权<span class="underline weight"> 杭州复恒科技有限公司 </span>
          在<span class="underline weight red"> {{attorneyData.name}} </span>与租客签约时，调用电子签名完成自动签约。
	      </p>
	      <p style="margin-left:2em;">
          在上述授权范围内，<span class="underline weight"> 杭州复恒科技有限公司 </span>
          有权代表<span class="underline weight red"> {{attorneyData.name}} </span>
          在租房合同、分期协议上调用签名进行在线签约。
	      </p>
	      <p>如因该授权委托产生的一切经营风险和法律风险，由
	        <span class="underline weight red"> {{attorneyData.name}} </span>自行承担。
	      </p>
	      <p style="margin-left:2em;">本授权书不可以转授权。</p>
	      <p style="margin-left:2em;">
          以上授权的有效期限为
          <span class="underline weight red"> {{attorneyData.onlineContractEffectiveDateStr}} </span> 至
          <span class="underline weight red"> {{attorneyData.onlineContractIneffectiveDateStr}} </span> 。
	      </p>
	      <p style="text-align: right;">
          授权人（签字）：
          <span class="underline weight red"> {{attorneyData.name}} </span>
	      </p>
	      <p style="text-align: right;">
	        <span class="underline weight red"> {{attorneyData.onlineContractEffectiveDateStr}} </span>
	      </p>
    	</div>
    	<div slot="footer" class="dialog-footer">
    		<el-button type="primary" size="small" @click="layer_attorney = false;ruleForm.checked = true">我已阅读并同意</el-button>
	      <el-button @click="layer_attorney = false" size="small">取 消</el-button>
	    </div>
    </el-dialog>
	</div>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import VueQr from 'vue-qr'
export default {
  name: 'signature',
  props: {
    type: {
      type: Number,
      default: 1
    },
    isShow: {
      type: Boolean,
      default: false,
    }
  },
  components: {VueQr},
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
        mobile: [
          { validator: validatePhone, required: true,trigger: 'blur' }
        ]

      },
      actionBaseUrl: process.env.BASE_API,
      ruleForm: {
        mobile: '',
        name: '',
        checked: false
      },
      attorneyData: {
      	name: '杭州麦家公寓',
      	onlineContractEffectiveDateStr: '2018/03/12',
      	onlineContractIneffectiveDateStr: '2019/03/12',
      	onlineContractEffectiveDateStr: '2018/03/12'
      },
      layerType: 1,
      fileList: [],
      layer_showInfo: false,
      layer_attorney: false
    }
  },
  created() {
    this.layer_showInfo = this.isShow;
  },
  methods: {
    handleSaveData() {
      console.log(1)
    },
    dialogClose() {
      this.$emit('closeOverlay')
    },
    /* 上传图片 */
    pictureUpload(file){
      const isLt5M = file.size / 1024 / 1024 <= 5
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) == -1) {
        this.$message.error('请上传jpg/png的图片');
        return false;
      }
      if(!isLt5M){
        this.$message.error('请上传5Mb大小以内的图片');
        return false;
      }

    },
    closeDialog(){
      this.layer_showImage = false;
    },
    pictureRemove(file, fileList) {
      this.showPicUrl = '';
      let imgList = [];
      this.isHideUpload = false;

      fileList.map(key => {
        if (key.response) {
          key.url = key.response.data[0];
        }
        imgList.push(key);
      })
      this.stepForm1.picList = deepClone(imgList);

    },
    picturePreview(file) {
      this.showPicUrl = file.url;
      this.layer_showImage = true;
	  },
    pictureSuccess(response, file, fileList){
      if (fileList.length >= 10) {
        this.isHideUpload = true;
      }
      this.stepForm1.picList.push({'url':file.response.data[0]})
    },
    pictureError(err,file){
      file = null;
    },
    resetFile(file){
      file = null;
    },
    showPicUrlClose(){
      this.showPicUrl = '';
    },
    lookAttorney() {
			this.layer_attorney = true;
    }
  },
  watch: {
    isShow(val) {
      this.layer_showInfo = val;
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.attorney {
		text-decoration: underline;
	}
	.underline {
    display: inline-block;
    min-width: 50px;
    font-weight: 700;
    padding: 0 15px;
    border-bottom: 1px solid #000;
	}
	.red {
		color:red;
	}
	h4.text-center {
		font-size: 20px;
		margin: 0;
	}
</style>
