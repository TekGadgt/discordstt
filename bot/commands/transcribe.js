const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { Deepgram } = require("@deepgram/sdk");
const { deepgramKey } = require("../config.json");
const { EndBehaviorType } = require("@discordjs/voice");
const fs = require("fs");
const { Writable, Transform } = require("stream");
const { FileWriter } = require("wav");
const { OpusEncoder } = require("@discordjs/opus");
const { v4 } = require("uuid");
const joinlogic = require("../lib/joinlogic");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transcribe")
    .setDescription("Transcribes spoken words to messages in text chat."),
  async execute(interaction) {
    await joinlogic(interaction);

    const deepgram = new Deepgram(deepgramKey);
    const encoder = new OpusEncoder(16000, 1);
    const connection = getVoiceConnection(interaction.guildId);

    class OpusDecodingStream extends Transform {
      encoder;

      constructor(options, encoder) {
        super(options);
        this.encoder = encoder;
      }

      _transform(data, encoding, callback) {
        this.push(this.encoder.decode(data));
        callback();
      }
    }

    function newSubscription(connection, userId) {
      let filePath = `./recordings/${interaction.user.id}-${v4()}.wav`;
      let audioStream = connection.receiver
        .subscribe(interaction.user.id, {
          end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 2000,
          },
        })
        .pipe(new OpusDecodingStream({}, encoder))
        .pipe(
          new FileWriter(filePath, {
            channels: 1,
            sampleRate: 16000,
          })
        );
      audioStream.on("end", () => {
        let audioSource = {
          stream: fs.createReadStream(filePath),
          mimetype: "audio/wav",
        };
        deepgram.transcription.preRecorded(audioSource).then((response) => {
          interaction.channel.send(
            `${
              interaction.user.nickname
                ? interaction.user.nickname
                : interaction.user.tag
            }: ${response.results.channels[0].alternatives[0].transcript}`
          );
        });
        //TODO: Add Deepgram Transcription and file deletion
        connection.receiver.subscriptions.delete(userId);
        newSubscription(connection, userId);
      });
    }

    newSubscription(connection, interaction.user.id);
  },
};
