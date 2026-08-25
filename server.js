require("dotenv").config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database/database');
const { connectRedis } = require('./src/config/database/redis');

connectDB();
//await connectRedis();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
