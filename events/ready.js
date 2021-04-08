export default async (Neo) => {
  console.log(`Logged in as ${Neo.client.user.tag}!`);
  Neo.client.user.setPresence({
    status: "online", //You can show online, idle....
    game: {
      name: "Bora destruir todos eles", //The message shown
      type: "PLAYING", //PLAYING: WATCHING: LISTENING: STREAMING:
    },
  });

  Neo.client.guilds.cache
    .get("737729545959899168")
    .channels.cache.get("737741243743862835")
    .messages.fetch({ limit: 100 }); //cache do canal de memes (Ultimas);
};
