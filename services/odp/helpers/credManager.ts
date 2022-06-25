import {
  CLOUD_CHECK,
  CLOUD_LOGIN,
  CLOUD_LOGIN_KEY,
} from '../../../helpers/constants';
import { data } from '../../../creds';
import { get, post, put } from '../../../helpers/http';
import { getKV, setKV } from '../../../helpers/redis';

export async function cloudLogin() {
  return await post(CLOUD_LOGIN, {
    username: data.cloudUsername,
    password: data.cloudPassword,
  }).then((resp: any) => {
    return resp.data.token;
  });
}

export async function isTokenValid(token) {
  return await get(CLOUD_CHECK, { Authorization: token }).then(
    (resp) => resp.status === 200
  );
}
export async function cloudCheck() {
  let token = await getKV(CLOUD_LOGIN_KEY);
  if (token) {
    let tokenValid = await isTokenValid(token);
    if (tokenValid) {
      return token;
    } else {
      token = 'JWT ' + (await cloudLogin());
      await setKV(CLOUD_LOGIN_KEY, token);
      return token;
    }
  } else {
    token = 'JWT ' + (await cloudLogin());
    await setKV(CLOUD_LOGIN_KEY, token);
    return token;
  }
}

export async function cloudGet(url, params = {}, skipCheck = false) {
  const token = skipCheck ? await getKV(CLOUD_LOGIN_KEY) : await cloudCheck();
  return get(url, { Authorization: token }, params) as any;
}

export async function cloudPost(url, body, skipCheck = false) {
  const token = skipCheck ? await getKV(CLOUD_LOGIN_KEY) : await cloudCheck();
  return post(url, body, { Authorization: token });
}

export async function cloudPut(url, id, body, skipCheck = false) {
  const token = skipCheck ? await getKV(CLOUD_LOGIN_KEY) : await cloudCheck();
  return put(url, id, body, { Authorization: token });
}
