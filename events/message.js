import Discord from "discord.js";
import _ from "lodash";

export default async (Neo, message) => {
  var result = await Neo.select("Configs", ["*"], {});
  var config = _.mapValues(_.keyBy(result, "name"), "value");
  //Mensagem de configurações atuais ao mencionar o bot
  if (message.content == `<@!${Neo.client.user.id}>`) {
    var template = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setDescription("Olá, Essas são minhas configurações atuais:")
      .addField("Prefix", config.prefix, true)
      .addField("Minimo para Calientes", config.minCaliente, true)
      .addField("Minimo para Cemitério", config.minCemiterio, true);
    message.channel.send(template);
  }

  //Tratador de comandos
  if (message.content.startsWith(config.prefix)) {
    var args = message.content.split(" ");
    var commandName = args[0];
    args.shift();
    var Command = await Neo.select(
      "Commands",
      ["command", "status", "system"],
      {
        name: commandName.replace(config.prefix, ""),
      }
    );

    if (Command.length == 0) return console.log("Comando não existe");
    if (Command[0].status == 0) return console.log("Comando desativado");
    if (Command[0].system == 1) {
      try {
        var func = new Function(
          "Neo",
          "message",
          "args",
          "config",
          "Discord",
          Command[0].command
        );
        return func(Neo, message, args, config, Discord);
      } catch (error) {
        message.reply("O código que você digitou gerou um erro!");
        return console.log(error);
      }
    }
    message.channel.send(Command[0].command);
  }
};
