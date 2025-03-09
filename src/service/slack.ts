import { WebClient } from "@slack/web-api";

export class SlackService {
  private client: WebClient;
  private channel: string;
  constructor(token: string, channel: string) {
    this.client = new WebClient(token);
    this.channel = channel;
  }

  async postLeetcodeProblem(problem: any) {
    try {
      if (!problem) {
        console.error("No problem data to post");
        return false;
      }
      const message = this._formatProblemMessage(problem);

      await this.client.chat.postMessage({
        channel: this.channel,
        text: "Today's LeetCode Challenge",
        blocks: message
      });
      
      console.log(`Message posted to ${this.channel}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  _formatProblemLink(link: string) {
    // const arr = link.split(',');
    // console.log(arr,  '==> arr..')
    // const baseUrl = arr[0].replace(/'/g, '');
    // console.log(baseUrl, arr[1], '==> baseUrl, arr[1]..');
    // return baseUrl + arr[1];
    // With ec2 the result link is fully, so not nessccary to split
    return link;
  }

  _formatProblemMessage(problem: any) {
    // Phase 1
    const difficultyEmoji = {
      'Easy': '🟢',
      'Medium': '🟠',
      'Hard': '🔴'
    };

    const formartedLink = this._formatProblemLink(problem.link);
    console.log(formartedLink, '==> formartedLink...');
    
    // @ts-ignore
    const difficultyText = `${difficultyEmoji[problem.difficulty] || '❓'} ${problem.difficulty}`;
    
    const blocks = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "📝 Daily LeetCode Challenge"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*<${formartedLink} | ${problem.title}>* • ${difficultyText}`
        }
      },
      {
        "type": "divider"
      }
    ];
    
    if (problem.examples && problem.examples.length > 0) {
      const examplesText = "*Examples:*\n```\n" + problem.examples.join("\n\n") + "\n```";
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": examplesText
        }
      });
    }
    
    if (problem.constraints && problem.constraints.length > 0) {
      // @ts-ignore
      const constraintsText = "*Constraints:*\n" + problem.constraints.slice(0, 5).map(constraint => `• ${constraint}`).join("\n");
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": constraintsText
        }
      });
    }

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `👉 <${formartedLink} | Solve this problem on LeetCode>`
      }
    });
    
    return blocks;
  }
}