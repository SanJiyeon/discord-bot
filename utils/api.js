// require('dotenv').config();
const axios = require('axios');
const { mapIdolToProperIdol, mapIdolToEmbed } = require('./idol');

const endpoint = 'https://selca.kastden.org/json/noona';

const searchIdols = async (query) => {
  if (query) {
    const searchRandom = query.toLowerCase() === 'random';
    const params = searchRandom
      ? { pt: 'kpop' }
      : { pt: 'kpop', an_op: 'cnt', an: query };

    try {
      const response = await axios.get(endpoint, { params });
      const { data } = response;
      const { idols } = data;

      if (idols.length > 0) {
        let embedsReturned;
        const properIdols = idols.map((idol) => mapIdolToProperIdol(idol));

        if (!searchRandom) {
          embedsReturned = properIdols.map((idol) => mapIdolToEmbed(idol));
        } else {
          const randomIdol =
            properIdols[Math.floor(Math.random() * properIdols.length)];
          embedsReturned = [mapIdolToEmbed(randomIdol)];
        }
        return embedsReturned;
      }
      const noIdolsMessage = 'Could not find any idol matching that query.';
      console.log(noIdolsMessage);
      return noIdolsMessage;
    } catch (error) {
      const errorMessage = 'Error fetching data from the API.';
      console.error(error);
      console.log(errorMessage);
      return errorMessage;
    }
  }
};

module.exports = {
  searchIdols,
};
