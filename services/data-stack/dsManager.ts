// import { cloudUsername, cloudPassword } from '../../../creds';
import {
  CLOUD_CHECK,
  CLOUD_LOGIN,
  CLOUD_LOGIN_KEY,
} from "../../helpers/constants";
import { get, post, put } from "../../helpers/http";
import { getValue, setValue } from "../../helpers/redis";
import { cloudLogin } from "../../loginCreds";

export async function dsLogin() {
  return await post(CLOUD_LOGIN, {
    username: cloudLogin.username,
    password: cloudLogin.password,
  }).then((resp: any) => {
    return resp.token;
  });
}

export async function isTokenValid(token) {
  return await get(CLOUD_CHECK, { Authorization: token }).then(
    (resp) => resp.status === 200
  );
}
export async function check() {
  let token = await getValue(CLOUD_LOGIN_KEY);
  if (token) {
    let tokenValid = await isTokenValid(token);
    if (tokenValid) {
      return token;
    } else {
      token = "JWT " + (await dsLogin());
      await setValue(CLOUD_LOGIN_KEY, token);
      return token;
    }
  } else {
    token = "JWT " + (await dsLogin());
    await setValue(CLOUD_LOGIN_KEY, token);
    return token;
  }
}

export async function getDs(url, params = {}, skipCheck = false) {
  const token = skipCheck ? await getValue(CLOUD_LOGIN_KEY) : await check();
  return get(url, { Authorization: token }, params) as any;
}

export async function postDs(url, body, skipCheck = false) {
  const token = skipCheck ? await getValue(CLOUD_LOGIN_KEY) : await check();
  return post(url, body, { Authorization: token });
}

export async function putDs(url, id, body, skipCheck = false) {
  const token = skipCheck ? await getValue(CLOUD_LOGIN_KEY) : await check();
  return put(url, id, body, { Authorization: token });
}
