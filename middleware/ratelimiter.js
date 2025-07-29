// middleware/ratelimiter.js
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import 'dotenv/config'

const redis = Redis.fromEnv()

const apiratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(4, '60s'),
  analytics: true
})

export default apiratelimiter;
