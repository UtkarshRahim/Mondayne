import { createClient } from 'redis';
import { REDIS } from './constants';
const client = createClient({
	url: REDIS,
});

const connectRedis = () => {
	return client.connect().then(() => {
		console.log('*** connected to Redis ***');
	});
};

const setKV = (key, value) => {
	return client.set(key, value);
};

const getKV = (key) => {
	return client.get(key);
};

export { connectRedis, setKV, getKV };
