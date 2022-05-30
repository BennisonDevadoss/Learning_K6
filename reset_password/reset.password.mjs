import http from "k6/http";
import { check } from "k6";
import { BASE_URL } from "../const.mjs";
import { SharedArray } from "k6/data";

const passwordToken = new SharedArray("token", function () {
  const data = JSON.parse(open("./linkCredentials.json"));
  return data;
});
console.log("password token Array is", passwordToken);
let token = passwordToken[Math.floor(Math.random() * passwordToken.length)];
console.log("token is", token.link);
const body = {
  user: {
    password_token: token.link,
    password: "12345678",
    password_confirmation: "12345678",
  },
};

const params = {
  headers: {
    "content-type": "application/json",
  },
};
export default function () {
  const res = http.put(`${BASE_URL}/password/reset`, JSON.stringify(body), params);
  console.log("response is", res);
  check(res, {
    "Password updated successfully": (r) => {
      return res.status === 200;
    },
  });
}
