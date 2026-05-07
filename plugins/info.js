const os = require('os');

module.exports = {
  config: {
    name: 'info',
    aliases: ['about', 'admininfo', 'serverinfo'],
    permission: 0,
    prefix: 'both',
    categorie: 'Utilities',
    credit: 'Developed by Mohammad Nayan',
    usages: [`${global.config.PREFIX}info - Show admin and server information.`],
  },
  start: async ({ event, api, message }) => {
    try {
      const uptimeSeconds = process.uptime();
      const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);

      const adminListText =
        global.config.admin.length > 0
          ? global.config.admin
              .map((id, i) => `${i + 1}. @${id.split('@')[0]}`)
              .join('\n')
          : 'No admins found.';

      const infoMessage = `
---------------------------------------╔═══════════════╗
👑  𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 𝐈𝐍𝐅𝐎 👑
╚═══════════════╝

🎀 𝐍𝐚𝐦𝐞 : 𝐅𝐚𝐡𝐢𝐦 ⚡
🏠 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐒𝐲𝐥𝐡𝐞𝐭 / 𝐁𝐢𝐬𝐰𝐚𝐧𝐚𝐭 🌍
🧰 𝐖𝐨𝐫𝐤 : 𝐒𝐓𝐔𝐃𝐄𝐍𝐓
💌 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞 🕊️
🌟 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦 ✨

━━━━━━━━━━━━━━━
🎀 𝐅𝐀𝐇𝐈𝐌 —𝐁𝐎𝐓 🎀
━━━━━━━━━━━━━━━

---------------------------------------
\`\`\`
 
\`\`\``;

      await api.sendMessage(
            event.threadId,
            { image: { url: "https://i.postimg.cc/28KK0Ctd/IMG-20260425-111124.jpg" }, caption: infoMessage || '' },
            { quoted: event.message }
          );;
    } catch (error) {
      console.error(error);
      await api.sendMessage(event.threadId, '❌ An error occurred while fetching info.', { quoted: event.message });
    }
  },
};
