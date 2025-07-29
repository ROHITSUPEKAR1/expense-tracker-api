import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import 'dotenv/config'

// Initialize Redis
const redis = Redis.fromEnv()

// Create rate limiter
const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(4, '60s'), // 4 requests per 60 seconds
  analytics: true // optional
})

export default rateLimit;
