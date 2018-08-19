<template>
  <div class='login'>
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/1.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click='reset'>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        username: '',
        paddword: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 6, message: '长度在3到6个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 12, message: '长度在6到12个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log('校验成功')
          const res = await this.axios({
            method: 'post',
            url: '/login',
            data: this.form
          })
          if (res.data.meta.status === 200) {
            this.$message('登陆成功')
            // 把token存起来
            localStorage.setItem('myToken', res.data.data.token)
            this.$router.push('home')
          } else {
            this.$message(res.data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang='less'>
  .login {
    width: 100%;
    height: 100%;
    background-color: #eee;
    overflow: hidden;
    .el-form {
      width: 400px;
      background-color: #fff;
      margin: 200px auto;
      padding: 75px 30px 10px 5px;
      border-radius: 20px;
      position: relative;
      img {
        width: 100px;
        position: absolute;
        left: 50%;
        top: -50px;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 10px solid #fff;
      }
    }
    .el-button ~ .el-button {
      margin-left: 80px;
    }
  }
</style>
