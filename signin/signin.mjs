import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { BASE_URL } from "../const.mjs";

const users = new SharedArray("users", function () {
  const data = JSON.parse(open("../users.json"));
  console.log("data is", data);
  return data;
});

console.log("Users are", users[0]);
export const options = {
  vus: 2,
  iterations: 2,

  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of request must complete below 1.5s
  },
};

const params = {
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
};

console.log("params is", params);
export default () => {
  let body = {
    user: users[
      Math.floor(Math.random() * (users.length - 0) + 0)
    ] /* min value is inclusive and max value is exculisve */,
  };
  console.log("Body is", body);
  const loginRes = http.post(`${BASE_URL}/signin`, JSON.stringify(body), params);
  console.log("response is", loginRes);
  check(loginRes, { "OTP Generated Successfully": (r) => r.status === 200 });
};

/* Error: When the body takes the second index object, then the http.post method give an invalid email or password error */
