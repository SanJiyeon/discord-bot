require('dotenv').config();
const axios = require('axios');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const mapIdolToEmbed = (idol) => new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle(`${idol.stageName} - ${idol.mainGroupDisplayName}`)
  .setThumbnail(idol.countryFlag)
  .addFields(
    { name: 'Gook name', value: `${idol.stageNameOrig}` },
    { name: 'Real name', value: `${idol.realNameOrig} / ${idol.realNameOrigClean}` },
    { name: 'Country', value: `${idol.countryName}` },
    { name: '\u200B', value: '\u200B' },
    {
      name: 'Birthdate',
      value: `${idol.birthdate}`,
      inline: true,
    },
    {
      name: 'Age',
      value: `${idol.birthdateAge}`,
      inline: true,
    },
  )
  .addFields({
    name: 'Height',
    value: `${idol.height}`,
    inline: true,
  })
  .setImage(`https://selca.kastden.org/thumb/${idol.mediaId}.jpg`)
  .setTimestamp();

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
    const query = msg.content.split(' ')[1];
    if (query) {
      const searchRandom = query.toLowerCase() === 'random';
      const params = searchRandom ? { pt: 'kpop' } : { pt: 'kpop', an_op: 'cnt', an: query };
      const endpoint = 'https://selca.kastden.org/json/noona';

      try {
        const response = await axios.get(endpoint, { params });
        const { data } = response;
        const { idols } = data;

        if (idols.length > 0) {
          let embedsReturned;
          const properIdols = idols.map((idol) => ({
            stageName: idol.stage_name,
            mainGroupDisplayName: idol.main_group_display_name,
            mediaId: idol.media_id,
            birthdate: idol.birthdate,
            birthdateAge: idol.birthdate_age,
            stageNameOrig: idol.stage_name_orig,
            height: idol.height,
            realName: idol.real_name,
            realNameOrig: idol.real_name_orig,
            realNameOrigClean: idol.real_name_orig_clean,
            countryFlag: `https://selca.kastden.org/static/famfamfam_flags/${idol.country}.png`,
            countryName: idol.country_name,
          }));

          if (!searchRandom) {
            embedsReturned = properIdols.map((idol) => mapIdolToEmbed(idol));
          } else {
            const randomIdol = properIdols[Math.floor(Math.random() * properIdols.length)];
            embedsReturned = [mapIdolToEmbed(randomIdol)];
          }

          msg.channel.send({ embeds: embedsReturned });
        } else {
          msg.channel.send('Could not find any idol matching that query.');
        }
      } catch (error) {
        console.error(error);
        msg.channel.send('Error fetching data from the API.');
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
