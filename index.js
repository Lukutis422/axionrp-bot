const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/* ====== KONFIGŪRACIJA ====== */
const TOKEN = process.env.TOKEN;

const TICKET_CHANNEL_ID = "1467896081743610059"; // ticket kanalas
const STAFF_ROLE_ID = "1468019197387870471";     // staff role
const STATUS_CHANNEL_ID = "1467895501935349780"; // status kanalas

const FIVEM_IP = "109.230.238.164";
const FIVEM_PORT = "30610";

const LOGO_URL = "https://i.imgur.com/8QZQZQZ.png"; // pakeisi i savo logo
/* ========================== */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

/* ===== READY ===== */
client.once("ready", async () => {
  console.log("✅ AxionRP bot online");
  await updateStatus();
  setInterval(updateStatus, 60 * 1000);
});

/* ===== SERVER STATUS ===== */
async function updateStatus() {
  try {
    const res = await fetch(`http://${FIVEM_IP}:${FIVEM_PORT}/dynamic.json`);
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setTitle("🚓 AXIONRP SERVER STATUS")
      .setColor(0x2ecc71)
      .setThumbnail(LOGO_URL)
      .addFields(
        { name: "📡 Statusas", value: "🟢 **ONLINE**", inline: true },
        { name: "👥 Žaidėjai", value: `${data.clients} / ${data.sv_maxclients}`, inline: true }
      )
      .setFooter({ text: "AxionRP • Atnaujinta" })
      .setTimestamp();

    const channel = await client.channels.fetch(STATUS_CHANNEL_ID);
    const messages = await channel.messages.fetch({ limit: 1 });

    if (messages.size === 0) {
      channel.send({ embeds: [embed] });
    } else {
      messages.first().edit({ embeds: [embed] });
    }
  } catch {
    console.log("⚠️ FiveM serveris nepasiekiamas");
  }
}

/* ===== SLASH KOMANDOS ===== */
client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "ticket") {
      const embed = new EmbedBuilder()
        .setTitle("🎟️ AxionRP Pagalbos Centras")
        .setDescription("Pasirinkite kategoriją")
        .setColor(0x5865f2)
        .setImage(LOGO_URL);

      const menu = new StringSelectMenuBuilder()
        .setCustomId("ticket_category")
        .setPlaceholder("Pasirinkite kategoriją")
        .addOptions([
          { label: "Pranešti apie pažeidimą", value: "report", emoji: "🚨" },
          { label: "Kompensacijos", value: "kompensacija", emoji: "💰" },
          { label: "Automobilių edit", value: "auto", emoji: "🚗" },
          { label: "Atsiblokavimas", value: "unban", emoji: "🔓" },
          { label: "Serverio klaidos", value: "bug", emoji: "⚠️" },
          { label: "RP užklausos", value: "rp", emoji: "🎭" },
          { label: "Darbo keitimas", value: "job", emoji: "💼" },
          { label: "Pagalba", value: "help", emoji: "❓" }
        ]);

      const row = new ActionRowBuilder().addComponents(menu);
      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
  }

  /* ===== TICKET THREAD ===== */
  if (interaction.isStringSelectMenu() && interaction.customId === "ticket_category") {
    const thread = await interaction.channel.threads.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.PrivateThread,
      invitable: false
    });

    await thread.members.add(interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle("🎟️ Naujas ticket")
      .setDescription(`**Kategorija:** ${interaction.values[0]}`)
      .setColor(0x2ecc71)
      .addFields(
        { name: "👤 Vartotojas", value: `<@${interaction.user.id}>` }
      )
      .setThumbnail(LOGO_URL);

    await thread.send({
      content: `<@&${STAFF_ROLE_ID}>`,
      embeds: [embed]
    });

    await interaction.reply({ content: "✅ Ticket sukurtas!", ephemeral: true });
  }
});

client.login(TOKEN);
