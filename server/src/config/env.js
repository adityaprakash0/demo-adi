const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/emergency-blood-finder',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default env;
