const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const keepAlive = require("./keepAlive");
keepAlive();

// ===== KONFIG =====
const LOG_CHANNEL_ID = "1468425536505253958";
const STAFF_ROLES = [
  "1468019100717416681",
  "1468019197387870471"
];

const WELCOME_CHANNEL_ID = "1467895298302148608";
const TICKET_CATEGORY_ID = "1467896081743610059";

const FIVEM_IP = "109.230.238.164";
const FIVEM_PORT = "30610";

// ===== CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("AxionRP bot online");
});

// ===== HELPERS =====
function isStaff(member) {
  return member.roles.cache.some(r => STAFF_ROLES.includes(r.id));
}

function sendLog(guild, embed) {
  const ch = guild.channels.cache.get(LOG_CHANNEL_ID);
  if (ch) ch.send({ embeds: [embed] });
}

// ===== WELCOME =====
client.on("guildMemberAdd", member => {
  const ch = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!ch) return;

  ch.send({
    embeds: [
      new EmbedBuilder()
        .setTitle("👋 Sveikas atvykęs į AxionRP")
        .setDescription(`Sveikas ${member}! Linkim gero RP 💙`)
        .setColor("Blue")
        .setTimestamp()
    ]
  });

  sendLog(member.guild,
    new EmbedBuilder()
      .setTitle("🟢 Narys prisijungė")
      .setDescription(member.user.tag)
      .setColor("Green")
      .setTimestamp()
  );
});

// ===== SLASH KOMANDOS =====
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = interaction.commandName;

  if (["ban","kick","timeout","clear"].includes(cmd)) {
    if (!isStaff(interaction.member)) {
      return interaction.reply({ content: "❌ Neturi teisių", ephemeral: true });
    }
  }

  // STATUS
  if (cmd === "status") {
    try {
      const res = await fetch(`http://${FIVEM_IP}:${FIVEM_PORT}/dynamic.json`);
      const d = await res.json();

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🟢 AxionRP Status")
            .addFields(
              { name: "Žaidėjai", value: `${d.clients}/${d.sv_maxclients}`, inline: true },
              { name: "Map", value: d.mapname || "Nežinoma", inline: true }
            )
            .setColor("Green")
        ]
      });
    } catch {
      return interaction.reply("🔴 Serveris offline");
    }
  }

  // RULES
  if (cmd === "rules") {
    return interaction.reply("📜 Jokio fail RP, jokio cheat, gerbk kitus.");
  }

  // CLEAR
  if (cmd === "clear") {
    const count = interaction.options.getInteger("kiekis");
    const msgs = await interaction.channel.bulkDelete(count, true);

    interaction.reply({ content: `🧹 Išvalyta ${msgs.size}`, ephemeral: true });

    sendLog(interaction.guild,
      new EmbedBuilder()
        .setTitle("🧹 CLEAR")
        .addFields(
          { name: "Staff", value: interaction.user.tag },
          { name: "Kanalas", value: interaction.channel.name },
          { name: "Kiekis", value: msgs.size.toString() }
        )
        .setColor("Blue")
        .setTimestamp()
    );
  }

  // BAN
  if (cmd === "ban") {
    const u = interaction.options.getUser("narys");
    const r = interaction.options.getString("priezastis") || "Nenurodyta";

    await interaction.guild.members.ban(u.id, { reason: r });
    interaction.reply({ content: `🔨 ${u.tag} užblokuotas`, ephemeral: true });

    sendLog(interaction.guild,
      new EmbedBuilder()
        .setTitle("🔨 BAN")
        .addFields(
          { name: "Narys", value: u.tag },
          { name: "Staff", value: interaction.user.tag },
          { name: "Priežastis", value: r }
        )
        .setColor("Red")
        .setTimestamp()
    );
  }

  // KICK
  if (cmd === "kick") {
    const u = interaction.options.getUser("narys");
    const r = interaction.options.getString("priezastis") || "Nenurodyta";

    await interaction.guild.members.kick(u.id, r);
    interaction.reply({ content: `👢 ${u.tag} išmestas`, ephemeral: true });

    sendLog(interaction.guild,
      new EmbedBuilder()
        .setTitle("👢 KICK")
        .addFields(
          { name: "Narys", value: u.tag },
          { name: "Staff", value: interaction.user.tag },
          { name: "Priežastis", value: r }
        )
        .setColor("Orange")
        .setTimestamp()
    );
  }

  // TIMEOUT
  if (cmd === "timeout") {
    const u = interaction.options.getUser("narys");
    const m = interaction.options.getInteger("minutes");
    const r = interaction.options.getString("priezastis") || "Nenurodyta";

    const mem = await interaction.guild.members.fetch(u.id);
    await mem.timeout(m * 60000, r);

    interaction.reply({ content: `⏱️ ${u.tag} nutildytas`, ephemeral: true });

    sendLog(interaction.guild,
      new EmbedBuilder()
        .setTitle("⏱️ TIMEOUT")
        .addFields(
          { name: "Narys", value: u.tag },
          { name: "Staff", value: interaction.user.tag },
          { name: "Minutės", value: m.toString() },
          { name: "Priežastis", value: r }
        )
        .setColor("Yellow")
        .setTimestamp()
    );
  }
});

client.login(process.env.TOKEN);
