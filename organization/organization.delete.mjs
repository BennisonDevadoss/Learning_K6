import http from "k6/http";
import { check } from "k6";
import { BASE_URL, PARAMS } from "../const.mjs";

const body = {} /* We should provide an empty body, otherwise the http.del considers the params as body, so we should provide the empty body object */

export default () => {
    const res = http.del(`${BASE_URL}/organizations?ids=10`, JSON.stringify(body), PARAMS);
    console.log("Response is", res)
    check(res, { "Organization was deleted": (r) => r.status === 200 })
}

/* This program will be shown the error invalid organization ID */