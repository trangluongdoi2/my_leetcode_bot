"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dev = {
    NODE_ENV: process.env.NODE_ENV,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || '',
    SLACK_CHANNEL: process.env.SLACK_CHANNEL || '',
    LEETCODE_URL: process.env.LEETCODE_URL || '',
    LEETCODE_API_URL: process.env.LEETCODE_API_URL || '',
};
exports.default = dev;
//# sourceMappingURL=env.js.map