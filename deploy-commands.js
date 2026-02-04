const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder().setName("status").setDescription("FiveM server status"),
  new SlashCommandBuilder().setName("ticket").setDescription("Open a ticket"),
  new SlashCommandBuilder().setName("rules").setDescription("Server rules")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Slash commands deployed");
  } catch (err) {
    console.error(err);
  }
})();