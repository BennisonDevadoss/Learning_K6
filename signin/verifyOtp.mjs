import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import file from 'k6/x/file';

const filePath = 'token.txt';
const BASE_URL = `https://chiefnet-dev-api.yavar.in/v1/verify_otp`;
const otpCredentials = new SharedArray("otp credential", function () {
    const data = JSON.parse(open('./otpCredentials.json'));
    return data;
})

console.log(otpCredentials.length)
console.log("data is", otpCredentials)
const credential = otpCredentials[Math.floor(Math.random() * otpCredentials.length)];

const body = {
    user: credential
}

const params = {
    headers: {
        'content-type': 'application/json'
    }
}

export default function () {
    const res = http.post(BASE_URL/* 'http://localhost:4000/verify_otp' */, JSON.stringify(body), params);
    console.log("bearer token is", res.headers.Authorization);
    check(res, {
        "Login Successfully": (r) => { return r.status === 200 }
    })
    const token = res.headers.Authorization
    console.log("token is ", token)
    file.writeString(filePath, token)
}

// Note: ./k6 run sample-script.js (This file should be run like this example command)

/* If the above command does't work, we should run the below one

 xk6 build v0.36.0 --with github.com/avitalique/xk6-file@latest
 
 */
