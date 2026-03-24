const app = require("./app");
const { env } = require("./config/env");
const { testDbConnection } = require("./config/db");

const startServer = async () => {
  await testDbConnection();

  app.listen(env.PORT, () => {
    console.log(`API running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
