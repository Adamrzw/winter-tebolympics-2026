export const config = {
  port: process.env.PORT || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  updateInterval: 5 * 60 * 1000,
  useMockData: process.env.USE_MOCK_DATA !== 'false',
  nodeEnv: process.env.NODE_ENV || 'development'
};
