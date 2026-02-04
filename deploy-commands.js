const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("FiveM server status"),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Atidaryti ticket"),

  new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Serverio taisyklės")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Deploying GUILD slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        "1467894943971414062" // 👈 TAVO DISCORD SERVER ID
      ),
      { body: commands }
    );

    console.log("✅ Slash commands deployed to guild");
  } catch (error) {
    console.error(error);
  }
})();
