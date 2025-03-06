import { WebClient } from "@slack/web-api";

export class SlackConnector {
  private client: WebClient;
  private channel: string;
  constructor(token: string, channel: string) {
    this.client = new WebClient(token);
    this.channel = channel;
  }

  async listAllChannels() {
    try {
      const publicResult = await this.client.conversations.list({
        exclude_archived: true,
        types: 'public_channel',
        limit: 1000
      });
      
      console.log('PUBLIC CHANNELS:');
      console.log('================');
      if (publicResult.channels && publicResult.channels.length > 0) {
        publicResult.channels.forEach((channel: any) => {
          console.log(`${channel.name.padEnd(30)} | ID: ${channel.id}`);
        });
      } else {
        console.log('No public channels found or bot doesn\'t have access.');
      }
      
      console.log('\n');
      
      // List private channels (if bot has access)
      const privateResult = await this.client.conversations.list({
        exclude_archived: true,
        types: 'private_channel',
        limit: 1000
      });
      
      console.log('PRIVATE CHANNELS:');
      console.log('=================');
      if (privateResult.channels && privateResult.channels.length > 0) {
        privateResult.channels.forEach((channel: any) => {
          console.log(`${channel.name.padEnd(30)} | ID: ${channel.id}`);
        });
      } else {
        console.log('No private channels found or bot doesn\'t have access.');
      }
      
    } catch (error) {
    }
  }

  async postLeetcodeProblem(problem: any) {
    const result = await this.listAllChannels();
    console.log(result, '==> result..');
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
      console.error(error, '==> error..');
      return false;
    }
  }

  _formatProblemMessage(problem: any) {
    const difficultyEmoji = {
      'Easy': '🟢',
      'Medium': '🟠',
      'Hard': '🔴'
    };
    
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
          "text": `*<${problem.link}|${problem.title}>* • ${difficultyText}`
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
        "text": `👉 <${problem.link}|Solve this problem on LeetCode>`
      }
    });
    
    return blocks;
  }
}