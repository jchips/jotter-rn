export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    API_URL: process.env.API_URL,
    "eas": {
      "projectId": "2a426c49-a633-40b6-b237-b2c537bd1e47"
    }
  },
});
