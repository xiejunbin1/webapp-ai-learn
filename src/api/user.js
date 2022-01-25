import axios from "../utils/request"
import * as qs from "qs"

// 获取用户档案信息
export const getUserProfileInfo = params => {
    return axios.post("user/getUserProfileInfo", qs.stringify({ requestJson: JSON.stringify(params) }))
}

// 保存/更新用户档案信息
export const saveProfileInfo = params => {
    return axios.post("user/saveProfileInfo", qs.stringify({ requestJson: JSON.stringify(params) }))
}