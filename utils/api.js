// require('dotenv').config();
const axios = require('axios');
const { mapIdolToProperIdol, mapIdolToEmbed } = require('./idol');
const logger = require('./logger');

const endpoint = 'https://selca.kastden.org/json/noona';

const searchIdols = async (query) => {
  if (query) {
    const searchRandom = query.toLowerCase() === 'random';
    const searchFmk = query.toLowerCase() === 'fmk';
    const fetchRandom = searchRandom || searchFmk;
    const params = fetchRandom
      ? { pt: 'kpop' }
      : { pt: 'kpop', an_op: 'cnt', an: query };

    try {
      const response = await axios.get(endpoint, { params });
      const { data } = response;
      const { idols } = data;

      if (idols.length > 0) {
        logger.info(`Found ${idols.length} idols.`);
        let embedsReturned;
        const properIdols = idols.map((idol) => mapIdolToProperIdol(idol));

        if (!fetchRandom) {
          logger.info('Searching by name');
          for (const idol of properIdols) {
            logger.info(
              `Found ${idol.stageName} - ${idol.mainGroupDisplayName}`
            );
          }
          embedsReturned = properIdols.map((idol) => mapIdolToEmbed(idol));
        } else {
          if (searchRandom) {
            logger.info('Searching random');
            const randomIdol =
              properIdols[Math.floor(Math.random() * properIdols.length)];
            embedsReturned = [mapIdolToEmbed(randomIdol)];
          }
          if (searchFmk) {
            logger.info('Searching fmk');
            const distinctIdols = [];
            while (distinctIdols.length < 3) {
              const randomIdol =
                properIdols[Math.floor(Math.random() * properIdols.length)];
              if (!distinctIdols.includes(randomIdol)) {
                distinctIdols.push(randomIdol);
              }
            }
            embedsReturned = distinctIdols.map((idol) => mapIdolToEmbed(idol));
          }
        }
        return embedsReturned;
      }
      const noIdolsMessage = 'Could not find any idol matching that query.';
      logger.warn(noIdolsMessage);
      return noIdolsMessage;
    } catch (error) {
      const errorMessage = 'Error fetching data from the API.';
      logger.error(error);
      logger.error(errorMessage);
      return errorMessage;
    }
  }
};

module.exports = {
  searchIdols,
};
