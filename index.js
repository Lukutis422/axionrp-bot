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

// KEEP ALIVE + SLASH DEPLOY
const keepAlive = require("./keepAlive");
require("./deploy-commands"); // AUTOMATINIS SLASH KOMANDŲ DEPLOY
keepAlive();

// === KONFIGURACIJA ===
const STAFF_ROLE_ID = "1468019100717416681";
const TICKET_CATEGORY_ID = "1467896081743610059";
const WELCOME_CHANNEL_ID = "1467895298302148608";

const FIVEM_IP = "109.230.238.164";
const FIVEM_PORT = "30610";

// === DISCORD CLIENT ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => {
  console.log("AxionRP bot online");
});

// === WELCOME SISTEMA ===
client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("👋 Sveikas atvykęs į AxionRP")
    .setDescription(`Sveikas ${member}! Gero RP!`)
    .setColor(0x00bfff)
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// === SLASH KOMANDOS ===
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // /status
  if (interaction.commandName === "status") {
    try {
      const res = await fetch(`http://${FIVEM_IP}:${FIVEM_PORT}/dynamic.json`);
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("🟢 AxionRP Status")
        .addFields(
          { name: "Players", value: `${data.clients}/${data.sv_maxclients}`, inline: true },
          { name: "Map", value: data.mapname || "Unknown", inline: true }
        )
        .setColor(0x2ecc71);

      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply("❌ Server offline");
    }
  }

  // /rules
  if (interaction.commandName === "rules") {
    interaction.reply("📜 Jokio fail RP, jokio cheat, gerbk kitus.");
  }

  // /ticket
  if (interaction.commandName === "ticket") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("🎟️ Atidaryti ticket")
        .setStyle(ButtonStyle.Primary)
    );

    interaction.reply({
      content: "Reikia pagalbos?",
      components: [row],
      ephemeral: true
    });
  }
});

// === TICKET MYGTUKAS ===
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "open_ticket") return;

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    parent: TICKET_CATEGORY_ID,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel] },
      { id: STAFF_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel] }
    ]
  });

  channel.send(`🎟️ ${interaction.user}, staff netrukus atsakys.`);
  interaction.reply({ content: "✅ Ticket sukurtas", ephemeral: true });
});

// === LOGIN ===
client.login(process.env.TOKEN);
