import express, { Request, Response } from 'express'
import { WebClient } from '@slack/web-api';
import configs from './src/configs/env';
import App from './src/app'

App.run()

// async function getChannelId(channelName: string) {
//   try {
//     const client = new WebClient(configs.SLACK_BOT_TOKEN);
    
//     // For public channels
//     const publicResult = await client.conversations.list({
//       exclude_archived: true,
//       types: 'public_channel'
//     });
    
//     // @ts-ignore
//     let channel = publicResult.channels.find(c => c.name === channelName);
    
//     // If not found, check private channels (if your bot has access)
//     if (!channel) {
//       const privateResult = await client.conversations.list({
//         exclude_archived: true,
//         types: 'private_channel'
//       });
//       // @ts-ignore
//       channel = privateResult.channels.find(c => c.name === channelName);
//     }
    
//     return channel ? channel.id : null;
//   } catch (error) {
//     console.log(error, '==> error 999');
//     // console.error(`Error fetching channel ID: ${error?.message}`);
//     return null;
//   }
// }

// // Example usage
// getChannelId('leetcode-bot').then(id => {
//   console.log(`Channel ID: ${id}`);
// });
