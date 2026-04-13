import axios from "@/axios";

export function login(username, password) {
  var data = new FormData();
  data.append("username", username);
  data.append("password", password);
  return axios.post("/login", data);
}

export function register(userData) {
  return axios.post("/user/register", userData);
}

export function logout() {
  return axios.post("/logout");
}

export function userinfo() {
  return axios.get("/user/userinfo");
}

export function rePwd(rePwdObj) {
  return axios.post("/user/rePwd", rePwdObj);
}

export function reProfile(reProfileObj) {
  return axios.post("/user/reProfile", reProfileObj);
}

export function menu() {
  return axios.get("/user/menu");
}
