import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";

const tokens = new SharedArray('token', function () {
    const data = JSON.parse(open('bearerCredential.json'));
    console.log("data is", data)
    return data;
})
console.log("Token is", tokens);

const BASE_URL = 'https://chiefnet-dev-api.yavar.in/v1/organizations'
const body = {
    organization: {
        name: "Bennison Devaodss",
        client_email: "yourEmail@gmail.com",
        description: "Test Org",
        client_mobile_number: '6379705181',
        client_name: "Bennison Devadoss",
        client_address: 'Tirunelveli'
    }
}

console.log("Authorization is in the outside", tokens[Math.floor(Math.random() * tokens.length)].token)

export default function () {
    const res = http.post(BASE_URL, JSON.stringify(body), {
        headers: {
            'content-type': 'application/json',
            Authorization: tokens[Math.floor(Math.random() * tokens.length)].token
        }
    });

    console.log("response is", res)
    check(res, { 'Organization was created': (r) => { return r.status === 201 } })
}
