export default async (libs, reaction, user) => {
  return; //ANCHOR DESLIGAR
  if (reaction.message.channel.id == "737741243743862835") {
    const MemeRank = require("../modules/MemeRank");
    MemeRank(libs, reaction, user);
  }
};
