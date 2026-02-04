const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const GUILD_ID = "1467894943971414062"; // tavo serverio ID

const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("FiveM serverio statusas"),

  new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Serverio taisyklės"),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Atidaryti ticket"),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Užblokuoti narį")
    .addUserOption(o => o.setName("narys").setDescription("Narys").setRequired(true))
    .addStringOption(o => o.setName("priezastis").setDescription("Priežastis")),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Išmesti narį")
    .addUserOption(o => o.setName("narys").setDescription("Narys").setRequired(true))
    .addStringOption(o => o.setName("priezastis").setDescription("Priežastis")),

  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Nutildyti narį (minutėmis)")
    .addUserOption(o => o.setName("narys").setDescription("Narys").setRequired(true))
    .addIntegerOption(o => o.setName("minutes").setDescription("Minutės").setRequired(true))
    .addStringOption(o => o.setName("priezastis").setDescription("Priežastis")),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Išvalyti žinutes šiame kanale")
    .addIntegerOption(o => o.setName("kiekis").setDescription("Kiek žinučių").setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Slash komandos užregistruotos");
  } catch (e) {
    console.error(e);
  }
})();
