import axios from "../utils/request"
import * as qs from "qs"

//获取版本列表
export const getTextBookVersionByGradeTerm = params => {
    return axios.post("resource/getTextBookVersionByGradeTerm", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//年级学科信息以及配置信息
export const getGradeSubjectTypeRelationList = params => {
    return axios.post("resource/getGradeSubjectTypeRelationList", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//获取教材课程列表
export const getTextBookCourseList = params => {
    return axios.post("resource/getTextBookCourseList", qs.stringify({ requestJson: JSON.stringify(params) }))
}