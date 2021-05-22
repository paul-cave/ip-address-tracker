const axios = require("axios");

const handler = async (event) => {
  const { input } = event.queryStringParameters;
  console.log(event);

  const API_SECRET = process.env.API_SECRET;
  const url = `https://geo.ipify.org/api/v1?apiKey=${API_SECRET}&${input}`;

  try {
    const { data } = await axios.get(url);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    const { status, statusText, headers, data } = err.response;
    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data }),
    };
  }
};

module.exports = { handler };
