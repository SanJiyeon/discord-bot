const { EmbedBuilder } = require('discord.js');

const mapIdolToProperIdol = (idol) => ({
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
});

const mapIdolToEmbed = (idol) =>
  new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${idol.stageName} - ${idol.mainGroupDisplayName}`)
    .setThumbnail(idol.countryFlag)
    .addFields(
      { name: 'Gook name', value: `${idol.stageNameOrig}` },
      {
        name: 'Real name',
        value: `${idol.realNameOrig} / ${idol.realNameOrigClean}`,
      },
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
      }
    )
    .addFields({
      name: 'Height',
      value: `${idol.height}`,
      inline: true,
    })
    .setImage(`https://selca.kastden.org/thumb/${idol.mediaId}.jpg`)
    .setTimestamp();

module.exports = {
  mapIdolToProperIdol,
  mapIdolToEmbed,
};
