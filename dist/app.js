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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = __importDefault(require("./configs/env"));
const leetcodeService_1 = require("./service/leetcodeService");
const slack_1 = require("./service/slack");
class App {
    constructor() {
        this.PORT = 4444;
        this.app = (0, express_1.default)();
    }
    getLeetcode() {
        return __awaiter(this, void 0, void 0, function* () {
            const leetcode = new leetcodeService_1.LeetcodeService();
            const problem = yield leetcode.getDailyChallenge();
            if (problem) {
                const slack = new slack_1.SlackService(env_1.default.SLACK_BOT_TOKEN, env_1.default.SLACK_CHANNEL);
                const result = yield slack.postLeetcodeProblem(problem);
                // if (result) {
                //   console.log("Successfully posted to Slack");
                // } else {
                //   console.error("Failed to post to Slack");
                // }
            }
            else {
                console.error("Failed to fetch LeetCode problem");
            }
        });
    }
    run() {
        this.app.use('/', (req, res) => {
            res.send('This is my server!');
        });
        this.app.listen(this.PORT, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`App running on port ${this.PORT}: http://localhost:${this.PORT}`);
            yield this.getLeetcode();
        }));
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map