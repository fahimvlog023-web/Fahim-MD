module.exports = {
  config: {
    name: "ping",
    category: "utility",
    description: "Check bot speed"
  },
  start: async ({ api, event }) => {
    await api.sendMessage(event.threadId, { text: "🤖 Pong! LUCKY-XD V7 is active and super fast!" }, { quoted: event.message });
  }
};
