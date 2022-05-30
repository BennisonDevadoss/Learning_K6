import http from "k6/http";
import { check } from "k6";
import { BASE_URL, PARAMS } from "../const.mjs";

export const options = {
  stages: [
    { duration: "30s", target: 30 },
    { duration: "15s", target: 0 },
  ],
};

const body = {
  user: {
    current_password: "12345678",
    password: "bennison",
    password_confirmation: "bennison",
  },
};

export default function () {
  const res = http.put(`${BASE_URL}/users/change_password`, JSON.stringify(body), PARAMS);
  console.log("response is", res);
  check(res, {
    "Passworod updated successfully": (r) => {
      return r.status === 200;
    },
  });
}
