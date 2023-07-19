const { Client, GatewayIntentBits } = require('discord.js');
const { getSecretValue } = require('./utils/aws-secrets');
const { searchIdols } = require('./utils/api');
const logger = require('./utils/logger');

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
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
  if (msg.content.startsWith('!idol')) {
    logger.info('received !idol query');
    const query = msg.content.substring(6).trimEnd();
    const idols = await searchIdols(query);
    if (Array.isArray(idols)) {
      msg.channel.send({ embeds: idols });
    } else {
      msg.channel.send(idols);
    }
  }
});

const login = async () => {
  logger.info('Logging in');
  const secret = await getSecretValue();
  client.login(secret.DISCORD_BOT_TOKEN);
};

login();
