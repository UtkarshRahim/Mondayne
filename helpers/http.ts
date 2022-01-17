import axios from 'axios';

function twirl() {
  const P = ['\\', '|', '/', '-'];
  let x = 0;
  return setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    x %= P.length;
  }, 100);
}

export async function post(url, body, header = {}) {
  const loader = twirl();
  return await axios(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      redirect: 'follow',
      ...header,
    },
    data: JSON.stringify(body),
  })
    .then((resp) => {
      return { status: resp.status, data: resp.data };
    })
    .catch((e) => {
      if (e.response.status !== 400) {
        console.error(JSON.stringify(e));
      }
      return { status: e.response.status };
    })
    .finally(() => {
      clearInterval(loader);
      process.stdout.write('\b');
    });
}

export async function get(url, header = {}, params = {}) {
  const loader = twirl();
  return await axios(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      redirect: 'follow',
      ...header,
    },
    params,
  })
    .then((resp) => {
      return { status: resp.status, data: resp.data };
    })
    .catch((e) => {
      if (e.response.status !== 400) {
        console.error(JSON.stringify(e));
      }
      return { status: e.response.status };
    })
    .finally(() => {
      clearInterval(loader);
      process.stdout.write('\b');
    });
}

export async function put(url, id, body, header = {}) {
  const loader = twirl();
  return await axios(url + '/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      redirect: 'follow',
      ...header,
    },
    data: JSON.stringify(body),
  })
    .then((resp) => {
      return { status: resp.status, data: resp.data };
    })
    .catch((e) => {
      if (e.response.status !== 400) {
        console.error(JSON.stringify(e));
      }
      return { status: e.response.status };
    })
    .finally(() => {
      clearInterval(loader);
      process.stdout.write('\b');
    });
}
