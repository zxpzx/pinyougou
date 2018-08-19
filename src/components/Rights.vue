<template>
  <div id="rights">
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="rightList"
      ref="rightList"
      style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="authName" label="权限名称"></el-table-column>
      <el-table-column property="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-if="scope.row.level == 1">二级</span>
          <span v-if="scope.row.level == 2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      const res = await this.axios.get('rights/list')
      console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.rightList = data
      }
    }
  },
  created () {
    this.getRightList()
  }
}
</script>

<style lang="less">
.mb_10 {
  margin-bottom: 10px;
}
</style>
