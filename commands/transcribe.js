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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transcribe")
    .setDescription("Transcribes spoken words to messages in text chat."),
  async execute(interaction) {
    //TODO: Add logic to join channel if not already joined
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
            duration: 3000,
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
        //TODO: Add Deepgram Transcription and file deletion
        connection.receiver.subscriptions.delete(userId);
        newSubscription(connection, filePath, userId);
      });
    }

    const deepgram = new Deepgram(deepgramKey);
    const encoder = new OpusEncoder(16000, 1);
    const connection = getVoiceConnection(interaction.guildId);
    newSubscription(connection, interaction.user.id);
  },
};
