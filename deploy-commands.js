const { REST, SlashCommandBuilder, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins a voice channel!"),
  new SlashCommandBuilder()
    .setName("streamaudio")
    .setDescription("Starts audio streaming!"),
  new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the current voice channel!"),
  new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Set the Transcription Text Channel!")
    .addChannelOption((channel) => {
      return channel
        .setName("channel")
        .setDescription("Channel you want to send the FAQ embed in")
        .setRequired(true);
    }),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
