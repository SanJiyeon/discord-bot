require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on('debug', console.log);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!reverse') {
    message.reply('Please provide a string to reverse.');
  } else if (message.content.startsWith('!reverse ')) {
    const inputString = message.content.slice(9); // remove the "!reverse " prefix
    const reversedString = inputString.split('').reverse().join('');
    message.reply(`The reversed string is: ${reversedString}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
