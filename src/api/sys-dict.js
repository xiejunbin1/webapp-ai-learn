import axios from "../utils/request"
import * as qs from "qs"

export const getSysDictList = params => {
return axios.post("sysDict/getSysDictList", qs.stringify({ requestJson: JSON.stringify(params) }))
}