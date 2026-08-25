const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
    console.error("Redis Error:", error);
});

const connectRedis = async () => {
    try{
        await redisClient.connect();
        console.log("Redis connected");
    }
    catch(err){
        console.error("Error connecting to Redis:", err);
    }
};

module.exports = {
    redisClient,
    connectRedis
};