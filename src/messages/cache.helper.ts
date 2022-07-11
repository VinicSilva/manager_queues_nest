import Redis from 'ioredis'

const redisClient = new Redis(
  6379,
  'localhost',
  {
    password: 'hub',
  },
)

const exists = async (key: string): Promise<boolean> => {
  const verifyKey = redisClient.exists(key)
  return !!verifyKey
}

const del = async (key: string): Promise<void> => {
    await redisClient.del(key)
}

const get = async (key: string): Promise<string> => {
  return redisClient.get(key)
}

const set = async (
  key: string,
  value: string | number,
  ttl?: number,
): Promise<void> => {
  if (ttl) {
    await redisClient.set(key, value, 'EX', ttl)
  } else {
    await redisClient.set(key, value)
  }
}

const rpush = async (
  key: string,
  value: any,
  ttl?: number,
): Promise<void> => {
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }

  await redisClient.rpush(key, value)

  if (ttl) {
    await redisClient.expire(key, ttl)
  }
}

const llen = (
  key: string
): Promise<number> => {
  return redisClient.llen(key)
}

const lrem = async (key: string, value: string): Promise<void> => {
  await redisClient.lrem(key, 0, value)
}

export { get, set, exists, del, rpush, llen, lrem }
