/*
 * @Author: xjb
 * @Date: 2021-04-6 17:28:00
 * @LastEditTime: 
 * @LastEditors: xjb
 * @Description: 
 */

import axios from '../utils/request'
import * as qs from 'qs'
// 获取城市列表
export const cityList = params => {
    return axios.post(`http://119.23.113.71:9001/service-soa/sysArea/getSysAreaList`, qs.stringify({ requestJson: JSON.stringify(params) }))
}