require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "123456",
    database: "dev_project_to_do_list",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  /*
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  */
};
