import { createClient } from "redis";

const client = createClient({
  url: "redis://127.0.0.1:3999",
});

export const connectToRedis = () => {
  return client.connect().then(() => {
    console.log("Connected To Redis");
  });
};

export const setValue = (key, value) => {
  return client.set(key, value);
};

export const getValue = (key) => {
  return client.get(key);
};
