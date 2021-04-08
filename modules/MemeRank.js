const { default: message } = require("../events/message");
const { default: cemiterios } = require("../models/cemiterios");
const { default: moment } = require("../node_modules/moment/moment");

module.exports = (libs, reaction, user) => {
  return; //ANCHOR DESLIGAR
  ReactionManager(reaction, user);
  setRank(reaction, user, libs);
};

// Variaveis simples para tornar o Código mais legivel na hora de testar os emojis
const EMOJIMUERTE = "737814147261267989";
const EMOJIARRIBA = "737813991472103466";

// Pega as variaveis de retorno do messageReactionAdd
function ReactionManager(reaction, user) {
  if (user.bot) return; // anula verificação em caso de bot
  //Object de functions para testar a reação utilizada (Muito melhor q um if ou switch)
  const fastcheck = {
    [EMOJIMUERTE]: (reaction, user) => {
      if (reaction.message.reactions.cache.get(EMOJIARRIBA) !== undefined) {
        return reaction.message.reactions.cache
          .get(EMOJIARRIBA)
          .users.remove(user.id);
      }
    },
    [EMOJIARRIBA]: (reaction, user) => {
      if (reaction.message.reactions.cache.get(EMOJIMUERTE) !== undefined) {
        return reaction.message.reactions.cache
          .get(EMOJIMUERTE)
          .users.remove(user.id);
      }
    },
  };
  feascheck[reaction.emoji.id](reaction, user); // executa a ação sem necessidade de teste lógico
  if (reaction.emoji.name == "🇫") return;
  return reaction.remove();
  break;
}

async function setRank(reaction, user, libs) {
  const caliente = await libs.database.calientes.findAll({
    where: {
      id: reaction.message.id,
    },
  });
  const cemiterio = await libs.database.cemiterios.findAll({
    where: {
      id: reaction.message.id,
    },
  });
  if (caliente.length > 0 || cemiterio.length > 0) return;
  var template = new libs.Discord.MessageEmbed()
    .setColor("#0099ff")
    .setDescription(reaction.message.content)
    .addField(
      ":ribbon: Enviado por:",
      `__${reaction.message.author.username}__`,
      true
    )
    .addField(
      ":alarm_clock: Data:",
      libs.moment(reaction.message.created_at).format("DD/MM/YY"),
      true
    )
    .addField(":link: Url", `[click aqui](${reaction.message.url})`, true)
    .setAuthor(
      `Enviado por ${reaction.message.author.username}`,
      reaction.message.author.avatarURL({
        dynamic: true,
      })
    )
    .setFooter(reaction.message.id);

  if (user.bot) return;
  if (!reaction.message.attachments.size > 0) return;
  if (
    reaction.count >= libs.config.minCaliente ||
    reaction.count >= libs.config.minCemiterio
  ) {
    switch (reaction.emoji.id) {
      case "737814147261267989": //muerte
        reaction.message.attachments.forEach(async (attachment) => {
          //database
          try {
            const cemiterio = await libs.database.cemiterios.create({
              id: reaction.message.id,
              data: Date.now(),
            });
          } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
              return console.log("Essa Cova ja existe.");
            }
            return console.log(
              "Alguma coisa deu errado ao adicionar essa Cova"
            );
          }

          regex = new RegExp("[^.]+$");
          extension = attachment.name.match(regex);
          if (extension == "mp4" || extension == "mp3") {
            //double post
            reaction.message.guild.channels.cache
              .get("737886406864535582")
              .send(
                `:ribbon: Enviado por: __${
                  reaction.message.author.username
                }__\n:pushpin: Título: ${
                  reaction.message.content
                }\n:alarm_clock: Data: ${libs
                  .moment(reaction.message.created_at)
                  .format("DD/MM/YY")}`,
                {
                  files: [attachment.url],
                }
              );
          } else {
            //embed
            reaction.message.attachments.forEach(async (attachment) => {
              template.setImage(attachment.url);
            });
            reaction.message.guild.channels.cache
              .get("737886406864535582")
              .send(template);
          }
        });
        break;
      case "737813991472103466": //arriba
        reaction.message.attachments.forEach(async (attachment) => {
          //database
          try {
            const caliente = await libs.database.calientes.create({
              id: reaction.message.id,
              data: Date.now(),
            });
          } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
              return console.log("Essa ascendindo ja existe.");
            }
            return console.log("Alguma coisa deu errado ao ascender esse meme");
          }

          regex = new RegExp("[^.]+$");
          extension = attachment.name.match(regex);
          if (extension == "mp4" || extension == "mp3") {
            //double post
            reaction.message.guild.channels.cache
              .get("737739637925085304")
              .send(
                `:ribbon: Enviado por: __${
                  reaction.message.author.username
                }__\n:pushpin: Título: ${
                  reaction.message.content
                }\n:alarm_clock: Data: ${libs
                  .moment(reaction.message.created_at)
                  .format("DD/MM/YY")}`,
                {
                  files: [attachment.url],
                }
              );
          } else {
            //embed
            template.setImage(attachment.url);
            reaction.message.guild.channels.cache
              .get("737739637925085304")
              .send(template);
          }
        });
        break;
    }
  }
}
