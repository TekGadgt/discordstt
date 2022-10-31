const { SlashCommandBuilder } = require("discord.js");
const joinlogic = require("../lib/joinlogic");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the current voice channel."),
  async execute(interaction) {
    await joinlogic(interaction);
  },
};
