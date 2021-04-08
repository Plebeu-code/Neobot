module.exports = (libs, msg) => {
  if (msg.attachments.size > 0) {
    return; //ANCHOR DESLIGAR
    msg.react("737813991472103466").then(() => {
      msg.react("737814147261267989"); // Muerte
    }); // Arriba
  }
};
