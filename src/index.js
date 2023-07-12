const { Client, IntentsBitField } = require('discord.js');

const fs = require('fs')

const config = JSON.parse(fs.readFileSync("token.json"))

const token = config.token;

const ping_role = config.ping_role

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.GuildMembers
    ]
});

const emojis = ["💀", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "😍"]

function containsImage(content) {
    return content.includes(".png") || content.includes(".jpg") || content.includes(".jpeg");
}

function react(msg) {
    for (let i = 0; i < emojis.length; i++) {
        var emoji = emojis[i];
        msg.react(emoji);
    }
    msg.reply(`${ping_role} Rate This Picture From 1-5`);
}

client.on("ready", (c) => {
    console.log(`${c.user.tag} has started`)
});

client.on("messageCreate", (msg) => {
    if (msg.channelId == "1113556170523803688") {
        if (msg.author.bot) {
            msg.react(msg.guild.emojis.resolveId("1113567038418460712"))
            msg.react(msg.guild.emojis.resolveId("1113567234439249970"))
        } else if (msg.attachments.size == 1 || msg.content.includes("https://cdn.discordapp.com/attachments/") && containsImage(msg.content)) {
            // check if the person is adding a message to their attachments first
            if (msg.attachments.size == 1 && msg.content.length !== 0) {
                msg.delete();
                return;
            }

            msg.attachments.forEach((_str) => {
                if (_str.contentType.includes("image/")) {
                    react(msg);
                } else {
                    msg.delete();
                }
            });
            // if message is a link instead
            if (msg.attachments.size == 0) {
                react(msg);
            }
        } else if (msg.author.id !== "110939134897451008" && msg.author.id !== "316014509217021962") {
            msg.delete();
        }
    }
});

client.login(token);

