import axios from "../utils/request"
import * as qs from "qs"

// 手机号/用户名登录
export const doUserLogin = params => {
  return axios.post("user/phoneLogin", qs.stringify(params))
}

// 获取验证码
export const getVailCode = params => {
  return axios.get("user/genCode", { params })
}

// AI慧学注册
export const registerUserInfo = params => {
  return axios.post("register/registerUserInfo", qs.stringify({ requestJson: JSON.stringify(params) }))
}
// 修改密码
export const operateUserPassWd = params => {
  return axios.post('register/operateUserPassWd',qs.stringify(params))
}

// 找回密码
export const findUserPassWd = params => {
  return axios.post('register/findUserPassWd', qs.stringify(params))
}



