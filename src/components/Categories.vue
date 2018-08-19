<template>
  <div class="categories">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="showAddDialog" class="mb_10" type="success" plain>添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data="cateList"
      style="width: 100%"
      v-loading="loading">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="40">
      </el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_delete">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showEditCate(scope.row)" size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="delCate(scope.row.cat_id)" size="small" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加功能显示框 -->
    <el-dialog width="40%" title="添加分类" :visible.sync="cateDialogFormVisible">
      <el-form :rules="addRules" ref="cateAddForm" :model="cateAddForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateAddForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <!-- 级联组件 -->
          <el-cascader
            :options="options"
            change-on-select
            :props="props"
            clearable
            v-model="cateAddForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cateDialogFormVisible = false">取 消</el-button>
        <el-button @click="addCate" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="增加分类" :visible.sync="editDialogFormVisible" width="40%">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item prop="cat_name" label="分类名称" label-width="80px">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button @click="editCate" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入树形网格组件
import Vue from 'vue'
import ElTreeGrid from 'element-tree-grid'
Vue.component('el-table-tree-column', ElTreeGrid)
export default {
  data () {
    return {
      pagesize: 10,
      current: 1,
      total: 0,
      loading: true,
      // 添加
      cateDialogFormVisible: false,
      cateAddForm: {
        cat_name: '',
        cat_pid: []
      },
      addRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      // 级联
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 编辑
      editForm: {
        id: '',
        cat_name: ''
      },
      editDialogFormVisible: false,
      rules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      cateList: []
    }
  },
  methods: {
    // 渲染
    async getCateList () {
      const res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagesize: this.pagesize,
          pagenum: this.current
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.cateList = data.result
        this.total = data.total
        this.loading = false
        // console.log(this.cateList)
      }
    },
    // 分页
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1
      this.getCateList()
      this.loading = true
    },
    handleCurrentChange (val) {
      this.current = val
      this.getCateList()
      this.loading = true
    },
    // 添加
    async showAddDialog () {
      this.cateDialogFormVisible = true
      const res = await this.axios.get('categories?type=2')
      console.log(res.data)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    addCate () {
      // 表单验证
      this.$refs.cateAddForm.validate(async valid => {
        if (valid) {
          // console.log(this.cateAddForm.cat_name, this.cateAddForm.cate_pid)
          const {cat_name: catName, cat_pid: catPid} = this.cateAddForm
          const res = await this.axios.post('categories', {
            cat_name: catName,
            // 如果没有选择参数,默认值0
            cat_pid: catPid[catPid.length - 1] || 0,
            cat_level: catPid.length
          })
          console.log(res)
          const {meta} = res.data
          if (meta.status === 201) {
            this.cateDialogFormVisible = false
            this.$refs.cateAddForm.resetFields()
            this.$message.success('添加分类成功')
            this.getCateList()
          } else {
            return false
          }
        }
      })
    },
    // 删除
    async delCate (id) {
      try {
        await this.$confirm('你确定删除分类吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${id}`)
        console.log(res.data)
        if (res.data.meta.status === 200) {
          if (this.cateList.length === 1) {
            this.current--
          }
          this.getCateList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 编辑
    showEditCate (cate) {
      this.editDialogFormVisible = true
      this.editForm.cat_name = cate.cat_name
      this.editForm.id = cate.cat_id
    },
    editCate () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`categories/${this.editForm.id}`, this.editForm)
          console.log(res)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editDialogFormVisible = false
            this.$message.success('编辑成功')
            this.$refs.editForm.resetFields()
            this.getCateList()
          }
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less">
.mb_10 {
  margin-bottom: 10px;
}
</style>
