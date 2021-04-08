require("dotenv").config(); // Pega de modo seguro o token do bot

const Discord = require("discord.js"); //baixar a lib
const fs = require("fs"); //Gerenciador de arquivos - cuida do diretório
const client = new Discord.Client(); // API do discord
const Sequelize = require("sequelize");

const database = {};
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

//configuração do banco de dados
fs.readdir("./models/", async (err, files) => {
  files.forEach((file) => {
    const modelHandler = require(`./models/${file}`)(sequelize, Sequelize);
    const modelName = file.split(".")[0];

    libs["database"][modelName] = modelHandler;

    modelHandler.sync();
  });

  const config = await libs.database.configs.findAll({
    raw: true,
  });
  config = config.reduce(
    (obj, item) => Object.assign(obj, { [item.name]: item.value }),
    {}
  );
});

fs.readdir("./events/", (err, files) => {
  //Esse proximo comando cria todas as funções de tratamentos dos eventos baseados nas pastas
  files.forEach((file) => {
    const eventHandler = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, (...arg) => eventHandler(libs, ...arg));
  });
}); //Importa todos os eventos pra o projeto

client.login(process.env.BOT_TOKEN); // login do bot usando o token protegido
