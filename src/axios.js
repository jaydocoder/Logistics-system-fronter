import axios from "axios";
import { customNotification } from "@/composables/util";
import store from "@/store/index.js";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 请求头添加token
    const authorization = localStorage.getItem("authorization");

    // token赋值
    if (authorization) {
      config.headers = config.headers || {};
      config.headers["authorization"] = authorization;
    }

    return config;
  },
  function (err) {
    // 对请求错误做些什么
    customNotification("error", "请求失败");
    return Promise.reject(err);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 拦截token并存储
    const headers = response?.headers;
    const authorization =
      (headers?.get && headers.get("authorization")) || headers?.authorization;
    if (authorization) {
      localStorage.setItem("authorization", authorization);
    }
    return response;
  },
  function (err) {
    // Token失效则清空本地缓存
    if (err.response.status === 401) {
      console.error("401 request url:", err.config?.url, "data:", err.response?.data);
      store.dispatch("logout").finally(() => {
        // location.reload();
      });
      customNotification("warning", "无认证访问");
    } else {
      customNotification("warning", err.response.data.msg || "服务器错误");
    }
    return Promise.reject(err);
  }
);

export default service;
