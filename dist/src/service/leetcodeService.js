"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.LeetcodeService = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const env_1 = __importDefault(require("../configs/env"));
class LeetcodeService {
    constructor() {
        this.baseUrl = env_1.default.LEETCODE_URL;
        this.apiUrl = env_1.default.LEETCODE_API_URL;
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Content-Type': 'application/json',
            'Referer': this.baseUrl
        };
    }
    getDailyChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            link
            question {
              title
              titleSlug
              difficulty
              content
            }
          }
        }
      `;
                const response = yield axios_1.default.post(this.apiUrl, { query }, { headers: this.headers });
                if (response.status === 200) {
                    const data = response.data;
                    const challenge = data.data.activeDailyCodingChallengeQuestion;
                    const problemLink = `${this.baseUrl}${challenge.link}`;
                    const problemTitle = challenge.question.title;
                    const problemDifficulty = challenge.question.difficulty;
                    // Get more details about the problem
                    const problemDetails = yield this.getProblemDetails(challenge.question.titleSlug);
                    return {
                        title: problemTitle,
                        difficulty: problemDifficulty,
                        link: problemLink,
                        content: challenge.question.content,
                        examples: problemDetails.examples || [],
                        constraints: problemDetails.constraints || []
                    };
                }
                else {
                    console.error(`Failed to fetch daily challenge: ${response.status}`);
                    return null;
                }
            }
            catch (error) {
                // @ts-ignore
                console.error(`Error fetching daily challenge: ${error === null || error === void 0 ? void 0 : error.message}`);
                return null;
            }
        });
    }
    getProblemDetails(titleSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          content
          exampleTestcases
          metaData
        }
      }
      `;
                const response = yield axios_1.default.post(this.apiUrl, {
                    query,
                    variables: { titleSlug }
                }, { headers: this.headers });
                if (response.status === 200) {
                    const data = response.data;
                    const content = data.data.question.content;
                    // Parse examples and constraints from content
                    const $ = cheerio.load(content);
                    const examples = [];
                    // @ts-ignore
                    $('pre').each((i, el) => {
                        examples.push($(el).text().trim());
                    });
                    const constraints = [];
                    // @ts-ignore
                    $('li').each((i, el) => {
                        constraints.push($(el).text().trim());
                    });
                    return {
                        examples,
                        constraints
                    };
                }
                return {};
            }
            catch (error) {
                // @ts-ignore
                console.error(`Error fetching problem details: ${error.message}`);
                return {};
            }
        });
    }
}
exports.LeetcodeService = LeetcodeService;
//# sourceMappingURL=leetcodeService.js.map