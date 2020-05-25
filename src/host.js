const axios = require('axios');

const fetchHosts = async () => {
  const response = await axios.get(process.env.HOST_POOL_URL);

  return response.data.ips;
};

module.exports = { fetchHosts };
