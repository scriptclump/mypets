const redis = require('redis');

redisClient = redis.createClient({ port: process.env.REDIS_PORT, host: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD });
redisClient.on('error', (err) => {
     console.log('error', err);
});

redisClient.on('connect', (err, res) => {
     if (err) {
          console.log(err);
     } else {
          // console.log('connected to redis');
     }
});

module.exports = redisClient;