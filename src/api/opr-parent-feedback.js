
import axios from "../utils/request"
import * as qs from "qs"

export const uploadFeedback = params => {
return axios.post("oprParentFeedback/uploadFeedback", qs.stringify({ requestJson: JSON.stringify(params) }))
}