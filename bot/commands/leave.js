const { SlashCommandBuilder } = require('discord.js');
const {
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leaves the current voice channel.'),
	async execute(interaction) {
    let connection = getVoiceConnection(interaction.guildId);
		if (connection) {
      connection.destroy();
      await interaction.reply({ ephemeral: true, content: "Left the channel!" });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: "Not listening in this server!",
      });
    }
	},
};