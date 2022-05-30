import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";

const tokens = new SharedArray("token", () => {
  const data = JSON.parse(open("bearerCredential.json"));
  return data;
});

const BASE_URL = `https://chiefnet-dev-api.yavar.in/v1/organizations`;
const params = {
  headers: {
    "content-type": "application/json",
    Authorization: tokens[Math.floor(Math.random() * tokens.length)].token,
  },
};

console.log("Authorization is", tokens[Math.floor(Math.random() * tokens.length)].token);
console.log(`URL is ${BASE_URL}/${Math.floor(Math.random() * 10)}`);

export default function () {
  let id = Math.floor(Math.random() * 5);
  console.log("id is", id);
  const res = http.get(`${BASE_URL}/132`, params);
  console.log("Response is", res);
  check(res, {
    "Is Organization detail being shown": (r) => {
      return r.status === 200;
    },
  });
}

/* When the above program is run, The error "Organization should be present" is occurred */
