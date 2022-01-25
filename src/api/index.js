/*
 * @Author: wgj
 * @Date: 2021-03-22 17:28:00
 * @LastEditTime: 2021-04-16 20:00:47
 * @LastEditors: wgj
 * @Description: 
 */
import axios from '../utils/request'
import * as qs from 'qs'
// 查询班级
export const getSchoolClass = params => {
    return axios.post(`school/getSchoolClass`, qs.stringify(params))
}
// 获取详情内容html
export const getContent = (url) => {
    return axios.get(url)
  }