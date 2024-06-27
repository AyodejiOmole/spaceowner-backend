const app = require("./app.js");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const DB = require("./config/db.config");
const task = require("./services/cronjobs.services.js");

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const connected = await DB(MONGO_URL);

    if (connected) {
      app.listen(port, () => {
        console.log(`server is listening on port ${port}`);
        task.start();
      }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

start();
