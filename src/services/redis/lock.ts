import { randomBytes } from "crypto";
import { client } from "./client";
import { ClientClosedError } from "redis";

export const withLock = async (key: string, cb: (redisClient: Client, signal: any) => any) => {
	// init vars to control retries
	const retryDelayMs = 100;
	const timeoutMs = 2000
	let retries = 20

	// random value to store at lock key
	const token = randomBytes(6).toString('hex')
	
	// create a lock key
	const lockKey = `lock:${key}`
	
	// retry logic
	while(retries >= 0){
		retries--

		// try to acquire lock
		const acquiredLock = await client.set(lockKey, token, {
			NX: true,
			PX: timeoutMs
		})

		// if loack busy
		if (!acquiredLock){
			// pause before retry
			await pause(retryDelayMs)
			continue
		}

		// if lock acquired
		try{
			const signal = {
				expired: false
			}
			setTimeout(() => {
				signal.expired = true
			}, timeoutMs)
			const proxiedClient = buildClientProxy(timeoutMs)
			const result = await cb(proxiedClient, signal)
			return result
		}finally{
			// unlock iff lock value is same
			await client.unlock(lockKey, token)
		}
	}
};

type Client = typeof client
const buildClientProxy = (timeoutMs: number) => {
	const startTime = Date.now()

	const handler = {
		get(target: Client, prop: keyof Client) {
			if(Date.now() >= startTime + timeoutMs){
				throw new Error('Lock has expired')
			}
		const value = target[prop]
		return typeof value === 'function' ? value.bind(target) : value
		}
	}

	return new Proxy(client, handler) as Client
};

export const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
