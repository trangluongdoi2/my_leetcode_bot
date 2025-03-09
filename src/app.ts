import express, { Request, Response } from 'express'
import configs from './configs/env'
import { LeetcodeService } from './service/leetcodeService';
import { SlackService } from './service/slack';

class App {
  private app: express.Application;
  private PORT = 4444;
  constructor() {
    this.app = express()
  }

  async getLeetcode() {
    const leetcode = new LeetcodeService();
    const problem = await leetcode.getDailyChallenge();
    if (problem) {
      const slack = new SlackService(configs.SLACK_BOT_TOKEN, configs.SLACK_CHANNEL);
      const result = await slack.postLeetcodeProblem(problem);
      // if (result) {
      //   console.log("Successfully posted to Slack");
      // } else {
      //   console.error("Failed to post to Slack");
      // }
    } else {
      console.error("Failed to fetch LeetCode problem");
    }
  }

  run() {
    this.app.use('/', (req: Request, res: Response) => {
      res.send('This is my server!')
    })
    this.app.listen(this.PORT, async () => {
      console.log(`App running on port ${this.PORT}: http://localhost:${this.PORT}`);
      await this.getLeetcode();
    })
  }
}

export default new App()