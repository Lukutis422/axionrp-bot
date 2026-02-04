const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;

const commands = [
  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Atidaryti pagalbos ticket")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🚀 Registruojamos slash komandos...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Komandos įkeltos");
  } catch (err) {
    console.error(err);
  }
})();
