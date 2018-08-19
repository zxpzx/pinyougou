<template>
  <div id="add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="goodsForm" :model="goodsForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              v-model="goodsForm.goods_cat"
              :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="goodsForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="goodsForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :headers='headers'
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="content" label="商品内容">
        <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
        <el-button @click="addProduct" class="mt_10" type="primary">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'basic',
      goodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        is_promote: true,
        picList: [],
        goods_cat: []
      },
      headers: {
        Authorization: localStorage.getItem('myToken')
      },
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      options: []
    }
  },
  methods: {
    // tab栏切换
    handleClick (tab) {
      this.active = +tab.index
    },
    // 下一步
    next (active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 图片上传
    handleRemove (file, fileList) {
      let temPath = file.response.data.tmp_path
      console.log(file)
      let index = this.goodsForm.picList.findIndex(item => item.pic === temPath)
      this.goodsForm.picList.splice(index, 1)
    },
    handleSuccess (res, file, fileList) {
      if (res.meta.status === 200) {
        this.$router.push({pic: res.data.tmp_path})
      }
    },
    // 点击确定添加商品
    async addProduct () {
      const res = await this.axios.post('goods', {
        // goods_cat有要求,需要用,拆分开
        ...this.goodsForm,
        goods_cat: this.goodsForm.goods_cat.join()
      })
      console.log(res)
      const {meta} = res.data
      if (meta.status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加商品成功')
      }
    }
  },
  async created () {
    const res = await this.axios.get('categories?type=3')
    const {meta, data} = res.data
    if (meta.status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less">
.quill-editor {
  background-color: #fff;
}
.ql-editor {
  min-height: 300px;
}
.mt_10 {
  margin-top: 10px;
}
</style>
