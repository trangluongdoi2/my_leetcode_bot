import express, { Request, Response } from 'express'
import { LeetCodeCrawler } from './leetcodeCrawler';
import configs from './configs/env'
import { SlackConnector } from './slack';

class App {
  private app: express.Application;
  private PORT = 4444;
  constructor() {
    this.app = express()
  }

  async getLeetcode() {
    const leetcode = new LeetCodeCrawler(configs.LEETCODE_URL, configs.LEETCODE_API_URL);
    const problem = await leetcode.getDailyChallenge();
    if (problem) {
        console.log(`Successfully fetched problem: ${problem.title}`);
        const slack = new SlackConnector(configs.SLACK_BOT_TOKEN, configs.SLACK_CHANNEL);
        const result = await slack.postLeetcodeProblem(problem);
        console.log(result, '==> result..');
        if (result) {
          console.log("Successfully posted to Slack");
        } else {
          console.error("Failed to post to Slack");
        }
    } else {
      console.error("Failed to fetch LeetCode problem");
    }
  }
  run() {
    this.app.use('/', () => {

    })
   
    this.app.listen(this.PORT, async () => {
      console.log(`App running on port ${this.PORT}: http://localhost:${this.PORT}`);
      await this.getLeetcode();
    })
  }
}

export default new App()