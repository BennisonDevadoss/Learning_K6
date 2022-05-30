import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import file from "k6/x/file";
import { BASE_URL } from "../const.mjs";

const filePath = "token.txt";
const otpCredentials = new SharedArray("otp credential", function () {
  const data = JSON.parse(open("./otpCredentials.json"));
  return data;
});

const otpArray = JSON.parse(JSON.stringify(otpCredentials));

const params = {
  headers: {
    "content-type": "application/json",
  },
};

export const options = {
  vus: 2,
  iterations: 2,
};

export default function () {
  const body = {
    user: JSON.parse(
      JSON.stringify(otpArray[Math.floor(Math.random() * (otpArray.length - 0) + 0)])
    ),
  };
  console.log("body is", JSON.stringify(body));
  const res = http.post(`${BASE_URL}/verify_otp`, JSON.stringify(body), params);
  console.log("bearer token is", res.headers.Authorization);
  check(res, {
    "Login Successfully": (r) => {
      return r.status === 200;
    },
  });
  console.log("response is", JSON.stringify(res));
  const token = res.headers.Authorization;
  console.log("token is ", token);
  file.appendString(filePath, `${token}\n`);
}

// Note: ./k6 run sample-script.js (This file should be run like this example command)
/* If the above command does't work, we should run the below one
 xk6 build v0.36.0 --with github.com/avitalique/xk6-file@latest
 */
