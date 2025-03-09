"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackService = void 0;
const web_api_1 = require("@slack/web-api");
class SlackService {
    constructor(token, channel) {
        this.client = new web_api_1.WebClient(token);
        this.channel = channel;
    }
    postLeetcodeProblem(problem) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!problem) {
                    console.error("No problem data to post");
                    return false;
                }
                const message = this._formatProblemMessage(problem);
                yield this.client.chat.postMessage({
                    channel: this.channel,
                    text: "Today's LeetCode Challenge",
                    blocks: message
                });
                console.log(`Message posted to ${this.channel}`);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    _formatProblemLink(link) {
        // const arr = link.split(',');
        // console.log(arr,  '==> arr..')
        // const baseUrl = arr[0].replace(/'/g, '');
        // console.log(baseUrl, arr[1], '==> baseUrl, arr[1]..');
        // return baseUrl + arr[1];
        // With ec2 the result link is fully, so not nessccary to split
        return link;
    }
    _formatProblemMessage(problem) {
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
exports.SlackService = SlackService;
//# sourceMappingURL=slack.js.map