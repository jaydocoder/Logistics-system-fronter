<template>
  <el-row class="register-container">
    <el-col :lg="14" :md="12" class="left">
      <el-image :src="logo" />
      <div class="title">物流运输管理系统</div>
    </el-col>
    <el-col :lg="10" :md="12" class="right">
      <h2 class="title">欢迎注册</h2>

      <div class="info-box">
        <span class="info-line"></span>
        <span>用户注册</span>
        <span class="info-line"></span>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" class="w-[300px]">
        <el-form-item prop="name">
          <el-input v-model="form.name" placeholder="请输入真实姓名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别" class="w-full">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="idNo">
          <el-input v-model="form.idNo" placeholder="请输入身份证号" maxlength="18">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11">
            <template #prefix>
              <el-icon>
                <Phone />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="address">
          <el-input v-model="form.address" placeholder="请输入家庭住址">
            <template #prefix>
              <el-icon>
                <Location />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="请确认密码"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            color="#8b5cf6"
            class="w-[300px]"
            type="primary"
            round
            @click="onSubmit"
          >
            注 册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="switch-auth">
        已有账号？
        <el-link type="primary" :underline="false" @click="router.push('/login')">去登录</el-link>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import logo from "@/assets/logo.png";
import { customNotification } from "@/composables/util";
import { useRouter } from "vue-router";
import { register } from "@/api/user";

const router = useRouter();

const form = reactive({
  name: "",
  gender: "",
  idNo: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const validateConfirmPassword = (_, value, callback) => {
  if (!value) {
    callback(new Error("确认密码不能为空"));
    return;
  }
  if (value !== form.password) {
    callback(new Error("两次输入密码不一致"));
    return;
  }
  callback();
};

const validateIdNo = (_, value, callback) => {
  if (!value) {
    callback(new Error("身份证号不能为空"));
    return;
  }
  if (!/^\d{17}[\dXx]$/.test(value)) {
    callback(new Error("身份证号格式不正确，应为18位"));
    return;
  }
  callback();
};

const validatePhone = (_, value, callback) => {
  if (!value) {
    callback(new Error("手机号不能为空"));
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error("手机号格式不正确"));
    return;
  }
  callback();
};

const rules = {
  name: [
    {
      required: true,
      message: "姓名不能为空",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
  idNo: [
    {
      required: true,
      validator: validateIdNo,
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      validator: validatePhone,
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: "家庭住址不能为空",
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
    {
      min: 6,
      message: "密码长度至少 6 位",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: validateConfirmPassword,
      trigger: "blur",
    },
  ],
};

const formRef = ref(null);
const loading = ref(false);
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    loading.value = true;
    const { confirmPassword, ...userData } = form;
    register(userData)
      .then((res) => {
        if (res.data.code === 200) {
          customNotification("success", res.data.msg || "注册成功，请登录");
          router.push("/login");
        } else {
          customNotification("error", res.data.msg || "注册失败");
        }
      })
      .catch((err) => {
        customNotification("error", err?.response?.data?.msg || "注册失败");
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

function onKeyUp(e) {
  if (e.key === "Enter") onSubmit();
}

onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<style lang="postcss" scoped>
.register-container {
  @apply bg-purple-500 min-h-screen;
}

.register-container .left,
.register-container .right {
  @apply flex flex-col items-center justify-center;
}

.register-container .right {
  @apply bg-gray-100;
}

.left .title {
  @apply font-bold text-2xl text-gray-100;
}

.right .title {
  @apply font-bold text-3xl text-gray-800;
}

.right .info-box {
  @apply flex items-center justify-center my-5 text-gray-400 font-bold;
}

.right .info-line {
  @apply h-[3px] w-16 bg-gray-200;
}

.switch-auth {
  @apply text-gray-500 text-sm mt-2;
}
</style>
