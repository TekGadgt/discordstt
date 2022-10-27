const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
    .addBooleanOption(option =>
      option.setName('secret')
        .setDescription('Whether Pong should be secret or not.')),
	async execute(interaction) {
    let secret = interaction.options.getBoolean('secret');
    await interaction.reply({content: 'Pong!', ephemeral: secret});
	},
};
