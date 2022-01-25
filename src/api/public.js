import axios from "../utils/request"
import * as qs from "qs"

export const addAppraise = params => {
return axios.post("public/addAppraise", qs.stringify(params))
}