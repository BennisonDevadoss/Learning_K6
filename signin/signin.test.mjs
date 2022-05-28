import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { BASE_URL } from '../const.mjs'

const users = new SharedArray('users', function () {
    const data = JSON.parse(open('../users.json'));
    return data;
})

export const options = {
    vus: 2,
    duration: '15s',

    thresholds: {
        http_req_duration: ['p(99)<1500'] // 99% of request must complete below 1.5s
    }
}

console.log("body is", users[Math.floor(Math.random() * users.length)])
const params = {
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
    }
}

export default () => {
    const body = {
        user: users[Math.floor(Math.random() * users.length)]
    }
    const loginRes = http.post(`${BASE_URL}/signin`, JSON.stringify(body), params);
    console.log("response is", loginRes)
    check(loginRes, { 'OTP Generated Successfully': (r) => r.status === 200 });
    sleep(15)
}
