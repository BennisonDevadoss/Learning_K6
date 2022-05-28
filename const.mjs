import { SharedArray } from "k6/data"

export const BASE_URL = 'https://chiefnet-dev-api.yavar.in/v1'

export const tokens = new SharedArray('tokens', () => {
    const data = JSON.parse(open(`./organization/bearerCredential.json`));
    return data;
});

export const PARAMS = {
    headers: {
        'content-type': 'application/json',
        Authorization: tokens[Math.floor(Math.random() * tokens.length)].token
    }
}
