import * as cheerio from 'cheerio';
import axios from 'axios';

export class LeetCodeCrawler {
  private baseUrl: string
  private apiUrl: string
  private headers: Record<string, string>
  constructor(baseUrl: string, apiUrl: string) {
    this.baseUrl = baseUrl;
    this.apiUrl = apiUrl;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Content-Type': 'application/json',
      'Referer': this.baseUrl
    };
  }
  async getDailyChallenge() {
    try {
      // GraphQL query to get the daily coding challenge
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
      const response = await axios.post(
        this.apiUrl,
        { query },
        { headers: this.headers }
      );
      
      if (response.status === 200) {
        const data = response.data;
        const challenge = data.data.activeDailyCodingChallengeQuestion;
        
        const problemLink = `${this.baseUrl}${challenge.link}`;
        const problemTitle = challenge.question.title;
        const problemDifficulty = challenge.question.difficulty;
        
        // Get more details about the problem
        const problemDetails = await this.getProblemDetails(challenge.question.titleSlug);
        
        return {
          title: problemTitle,
          difficulty: problemDifficulty,
          link: problemLink,
          content: challenge.question.content,
          examples: problemDetails.examples || [],
          constraints: problemDetails.constraints || []
        };
      } else {
        console.error(`Failed to fetch daily challenge: ${response.status}`);
        return null;
      }
    } catch (error) {
      // @ts-ignore
      console.error(`Error fetching daily challenge: ${error?.message}`);
      return null;
    }
  }
  async getProblemDetails(titleSlug: any) {
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
      
      const response = await axios.post(
        this.apiUrl,
        {
          query,
          variables: { titleSlug }
        },
        { headers: this.headers }
      );
      
      if (response.status === 200) {
        const data = response.data;
        const content = data.data.question.content;
        // Parse examples and constraints from content
        const $ = cheerio.load(content);
        const examples: any = [];
        // @ts-ignore
        $('pre').each((i, el) => {
          examples.push($(el).text().trim());
        });
        
        const constraints: any = [];
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
    } catch (error) {
      // @ts-ignore
      console.error(`Error fetching problem details: ${error.message}`);
      return {};
    }
  }
}