const { Client, GatewayIntentBits } = require('discord.js');
const { getSecretValue } = require('./utils/aws-secrets');
const { searchIdols } = require('./utils/api');

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

client.on('messageCreate', async (msg) => {
  if (msg.content.startsWith('!idol')) {
    console.log('received !idol query');
    const query = msg.content.split(' ')[1];
    const idols = await searchIdols(query);
    if (Array.isArray(idols)) {
      msg.channel.send({ embeds: idols });
    } else {
      msg.channel.send(idols);
    }
  }
});

const login = async () => {
  console.log('Logging in');
  const secret = await getSecretValue();
  client.login(secret.DISCORD_BOT_TOKEN);
};

login();
