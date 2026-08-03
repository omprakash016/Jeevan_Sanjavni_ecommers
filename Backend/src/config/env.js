const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV,
  mongoURI: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,

  cookieExpires: process.env.COOKIE_EXPIRES,

  frontendURL: process.env.FRONTEND_URL,

  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};

export default env;