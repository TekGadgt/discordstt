const {
  joinVoiceChannel,
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = async (interaction) => {
  let connection = getVoiceConnection(interaction.guildId);
    await interaction.deferReply();
    const guild = interaction.client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    if (!connection) {
      if (member.voice.channel) {
        const channel = member.voice.channel;
        connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          selfDeaf: false,
          selfMute: true,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
      } else {
        await interaction.followUp(
          "Join a voice channel and then try that again!"
        );
        return;
      }
    }

    await interaction.followUp("Joined!");
}