<template>
  <div id="roles">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-row class="mb_10">
      <el-button @click="addShowModel" type="success" plain>添加角色</el-button>
    </el-row>
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 如果没有权限的提示 -->
          <el-row v-if="scope.row.children.length === 0">
            <span>该角色暂时没有权限</span>
          </el-row>
          <el-row v-for="level1 in scope.row.children" :key="level1.id">
            <!-- 一级 -->
            <el-col :span="4">
              <el-tag closable @close="delRight(scope.row,level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级 -->
            <el-col :span="20">
              <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4" class="mb_10">
                  <el-tag closable type="success" @close="delRight(scope.row,level2.id)">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级 -->
                <el-col :span="20" class="mb_10">
                  <span class="mr_10" v-for="level3 in level2.children" :key="level3.id">
                    <el-tag closable type="warning" @close="delRight(scope.row,level3.id)">{{level3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showEditDialog(scope.row)" size="small" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="rolesDel(scope.row)" size="small" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button @click="showAssignDialog(scope.row)" size="small" type="success" icon="el-icon-check" plain>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加功能 -->
    <el-dialog title="添加角色" width="450px" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="角色名称" prop="roleName" label-width="80px">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="修改角色" width="450px" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="80px">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog title="分配权限" :visible.sync="assignDialogFormVisible">
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogFormVisible = false">取 消</el-button>
        <el-button @click="assign" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 添加
      addDialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {required: true, message: '角色名称不能为空', trigger: 'blur'}
        ]
      },
      // 编辑
      editDialogFormVisible: false,
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 权限分配
      assignDialogFormVisible: false,
      rightList: [],
      assignRoleId: '',
      // 可以让分配权限的内容出现
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rolesList: []
    }
  },
  methods: {
    async getRolesList () {
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      console.log(meta, data)
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    // 删除
    async rolesDel (role) {
      try {
        await this.$confirm('你是否要删除这个权限?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${role.id}`)
        const status = res.data.meta.status
        if (status === 200) {
          this.getRolesList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.error('删除失败')
      }
    },
    // 添加
    addShowModel () {
      this.addDialogFormVisible = true
    },
    addRoles () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('roles', this.addForm)
          const status = res.data.meta.status
          console.log(res)
          if (status === 201) {
            this.addDialogFormVisible = false
            this.$refs.addForm.resetFields()
            this.$message.success('添加成功')
            this.getRolesList()
          }
        }
      })
    },
    // 编辑
    showEditDialog (edit) {
      this.editDialogFormVisible = true
      this.editForm.id = edit.id
      this.editForm.roleName = edit.roleName
      this.editForm.roleDesc = edit.roleDesc
    },
    editRoles () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editDialogFormVisible = false
            this.$message.success('编辑成功')
            this.getRolesList()
          }
        }
      })
    },
    // 删除角色制定权限
    async delRight (role, rightid) {
      const res = await this.axios.delete(`roles/${role.id}/rights/${rightid}`)
      const {meta, data} = res.data
      if (meta.status === 200) {
        role.children = data
        this.$message.success('取消权限成功')
      }
    },
    // 分配权限
    async showAssignDialog (role) {
      this.assignDialogFormVisible = true
      const res = await this.axios.get('rights/tree')
      console.log(res.data)
      const {meta, data} = res.data
      this.assignRoleId = role.id
      if (meta.status === 200) {
        this.rightList = data
        const checkedKeys = []
        role.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              checkedKeys.push(level3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(checkedKeys)
      }
    },
    async assign () {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let getHalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: [...checkedKeys, ...getHalfCheckedKeys].join()
      })
      console.log(res.data)
      const {meta} = res.data
      if (meta.status === 200) {
        this.assignDialogFormVisible = false
        this.$message.success('分配权限成功')
        this.getRolesList()
      }
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less">
.mb_10 {
  margin-bottom: 10px;
}
.mr_10 {
  margin-right: 10px;
}
.dotted {
  border-bottom: 1px dotted #ccc;
}
</style>
