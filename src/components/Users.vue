<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input @keyup.enter.native="search" placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddModel">添加用户</el-button>
    <!-- 表格 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editShowModel(scope.row)" type="primary" icon="el-icon-edit" size="small" plain></el-button>
          <el-button @click="showDelModel(scope.row)" type="danger" icon="el-icon-delete" size="small" plain></el-button>
          <el-button @click="showAssignModel(scope.row)" type="success" icon="el-icon-check" size="small" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page = "pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="this.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加功能 -->
    <!-- rules 校验 -->
    <el-dialog
    title="添加用户"
    :visible.sync="addDialogFormVisible"
    width="40%">
      <el-form
      :model="addForm"
      :rules="addRules"
      ref="addForm"
      label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑功能 -->
    <el-dialog
    title="修改用户"
    :visible.sync="editDialogFormVisible"
    width="40%">
      <el-form
      :model="editForm"
      ref="editForm"
      :rules="addRules"
      label-width="70px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogFormVisible">
      <el-form :model="assignForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogFormVisible = false">取 消</el-button>
        <el-button @click="assignRole" type="primary">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userList: [],
      total: 0,
      delDialogVisible: false,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在3到6位', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在6到12位', trigger: 'blur'}
        ],
        email: [
          // {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
        ],
        mobile: [
          // {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1\d{10}$/, message: '请输入正确的手机号格式', trigger: 'blur'}
        ]
      },
      assignDialogFormVisible: false,
      assignForm: {
        rid: '',
        username: '',
        id: ''
      },
      options: []
    }
  },
  methods: {
    async getUserList () {
      const res = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          'Authorization': localStorage.getItem('myToken')
        }
      })
      // console.log(res.data)
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users
        this.total = res.data.data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    search () {
      this.pagenum = 1
      this.getUserList()
    },
    async changeUserStatus (userstatus) {
      const res = await this.axios({
        method: 'put',
        url: `users/${userstatus.id}/state/${userstatus.mg_state}`
      })
      const {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('修改用户状态成功')
        this.getUserList()
      } else {
        this.$message.error('修改用户状态失败')
      }
    },
    async showDelModel (users) {
      try {
        await this.$confirm('你确定要删除这个用户吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios({
          method: 'delete',
          url: `users/${users.id}`
        })
        // console.log(res.data)
        if (res.data.meta.status === 200) {
          if (this.userList.length === 1) {
            this.pagenum--
          }
          this.getUserList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 点击显示添加用户模态
    showAddModel () {
      this.addDialogFormVisible = true
    },
    // 添加用户
    addUser () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('users', this.addForm)
          console.log(res.data)
          if (res.data.meta.status === 201) {
            this.addDialogFormVisible = false
            this.$refs.addForm.resetFields()
            this.total++
            this.pagenum = Math.ceil(this.total / this.pagesize)
            this.getUserList()
          }
        }
      })
    },
    // 点击显示编辑用户模态
    editShowModel (user) {
      this.editDialogFormVisible = true
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.id = user.id
    },
    // 点击编辑用户
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios({
            method: 'put',
            url: `users/${this.editForm.id}`,
            data: this.editForm
          })
          console.log(res.data)
          if (res.data.meta.status === 200) {
            this.editDialogFormVisible = false
            this.getUserList()
            this.$message.success('编辑用户成功')
          }
        } else {
          return false
        }
      })
    },
    // 分配角色
    async showAssignModel (user) {
      this.assignDialogFormVisible = true
      // 让姓名回显
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      const res2 = await this.axios.get(`users/${user.id}`)
      console.log(res2.data)
      if (res2.data.meta.status === 200) {
        if (res2.data.data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = res2.data.data.rid
        }
      }
      // 获取所有列表
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
        console.log(data)
      }
    },
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      const res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      console.log(res.data)
      const {meta} = res.data
      if (meta.status === 200) {
        this.assignDialogFormVisible = false
        this.$message.success('设置角色成功')
        this.getUserList()
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style>
.input-with-select {
  width: 300px;
  margin: 10px 5px 10px 0;
}
</style>
