import dotenv from 'dotenv'

dotenv.config()

const dev = {
  NODE_ENV: process.env.NODE_ENV,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || '',
  SLACK_CHANNEL: process.env.SLACK_CHANNEL || '',
  LEETCODE_URL: process.env.LEETCODE_URL || '',
  LEETCODE_API_URL: process.env.LEETCODE_API_URL || '',
}
export default dev
