import http from "k6/http";
import { check } from "k6";
import { BASE_URL } from "../const.mjs";

const body = {
    user: {
        email: "bennisondevadoss@gmail.com"
    }
}

const params = {
    headers: {
        'content-type': 'application/json'
    }
}
export default function () {
    const res = http.put(`${BASE_URL}/password/reset_link/send`, JSON.stringify(body), params);
    console.log("response is", res)
    check(res, {
        "Reset password link is sent successfully": (r) => {
            return res.status === 200
        }
    })
}
