const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── ⚠️ আপনার নিজের হোয়াটসঅ্যাপ নম্বর এখানে বসাবেন ভাই ───
// দেশের কোডসহ (যেমন বাংলাদেশের জন্য 880) আপনার নম্বরটি দিন। কোনো স্পেস বা '+' দিবেন না।
// এই নম্বরেই হোস্টিং চালু হওয়ার সাথে সাথে ৮ ডিজিটের পেয়ার কোড চলে যাবে!
const MY_NUMBER = "8801300285514"; 

app.get("/", (req, res) => {
  res.send("LUCKY-XD V7 Premium Engine is Online! Created by Fahim Hussain.");
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // 💡 রেন্ডার হোস্টিংয়ের জন্য কিউআর কোড অফ করে দিলাম ভাই
    logger: pino({ level: "silent" }),
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  });

  // 🚀 টার্মিনাল ছাড়া সরাসরি পেয়ারিং কোড নেওয়ার অটোমেটিক লজিক
  if (!sock.authState.creds.registered) {
    console.log(`\n⏳ [LUCKY-XD] Requesting pairing code for: ${MY_NUMBER}...`);
    await delay(3000); // সার্ভার রেডি হওয়ার জন্য ৩ সেকেন্ড বিরতি
    try {
      const code = await sock.requestPairingCode(MY_NUMBER);
      console.log(`\n==============================================`);
      console.log(`🔥 YOUR WHATSAPP PAIRING CODE IS: ${code} 🔥`);
      console.log(`==============================================\n`);
    } catch (err) {
      console.error("❌ Failed to generate pairing code:", err.message);
    }
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting...", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ LUCKY-XD V7 Successfully Connected to WhatsApp!");
    }
  });

  sock.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const msg = chatUpdate.messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const from = msg.key.remoteJid;
      const type = Object.keys(msg.message)[0];
      const body = type === "conversation" ? msg.message.conversation : 
                   type === "extendedTextMessage" ? msg.message.extendedTextMessage.text : "";

      const prefix = ".";
      if (!body.startsWith(prefix)) return;

      const args = body.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      // 📁 প্লাগইন ফোল্ডার পাথ
      const pluginPath = path.join(__dirname, "plugins", `${command}.js`);
      if (fs.existsSync(pluginPath)) {
        const plugin = require(pluginPath);
        await plugin.start({ 
          api: { sock, sendMessage: async (jid, content, options) => sock.sendMessage(jid, content, options) }, 
          event: { threadId: from, senderId: msg.key.participant || from, message: msg }, 
          args 
        });
      }
    } catch (err) {
      console.error("Message handling error:", err);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Web Server running on port ${PORT}`);
  startBot();
});
