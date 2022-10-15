// Require the necessary discord.js classes
const { Client, GatewayIntentBits, User } = require("discord.js");
const { token, deepgramKey } = require("./config.json");
const {
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
  getVoiceConnection,
  EndBehaviorType,
  VoiceReceiver,
} = require("@discordjs/voice");
const { pipeline, Readable } = require("node:stream");
const { Deepgram } = require("@deepgram/sdk");
const WebSocket = require("ws");
const prism = require('prism-media');

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const deepgram = new Deepgram(deepgramKey);

function getDisplayName(userId, user) {
  return user ? `${user.username}_${user.discriminator}` : userId;
}

// async function getTranscription(audioSource) {
//   return await deepgram.transcription.preRecorded(audioSource, {
//     punctuate: true,
//   });
// }

async function createListeningStream(receiver, userId, user, client) {
  const textChannel = client.channels.cache.get("1026313954642903100");

  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 1000,
    },
  });

  const oggStream = new prism.opus.OggLogicalBitstream({
		opusHead: new prism.opus.OpusHead({
			channelCount: 2,
			sampleRate: 48000,
		}),
		pageSizeControl: {
			maxPackets: 10,
		},
	});

  const socket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?punctuate=true&numerals=true",
    ["token", deepgramKey]
  );

  console.log(opusStream);
  console.log(oggStream);
  console.log(socket);

  // opusStream.on("data", (chunk) => {
  //   audioBuffer.write(chunk);
  // });
  
  // socket.on('open', function open() {
  //   socket.send(audioBuffer);
  // });
  
  // socket.on('message', function message(message) {
  //   const received = JSON.parse(message.data);
  //   const transcript = received.channel.alternatives[0].transcript;
  //   if (transcript && received.is_final) {
  //     textChannel.send(`${getDisplayName(userId, user)}: ${transcript}`);
  //   }
  // });

  // const audioSource = {
  //   stream: chunk,
  //   mimetype: 'audio/ogg'
  // };
  // console.log(chunk);
  // textChannel.send(`${getDisplayName(userId, user)}`);
  // textChannel.send(`${getTranscription(audioSource)}`);
  // });

  // console.log(opusStream);
  // console.log(opusStream._readableState.buffer);
  // opusStream.pipeline()
  // console.log(opusStream);
  // console.log(opusStream);
  // console.log(opusStream);
  // console.log(opusStream);
  //
  // const mediaRecorder = new MediaRecorder(opusStream, {
  //   mimeType: 'audio/webm',
  // })
  // const socket = new WebSocket('wss://api.deepgram.com/v1/listen?punctuate=true&numerals=true', [
  //   'token',
  //   'e2b927ffdec7662f8ee515b688fb26f9c48e108d',
  // ]);
  // socket.onopen = () => {
  //   console.log({ event: 'onopen' })
  //   mediaRecorder.addEventListener('dataavailable', async (event) => {
  //     if (event.data.size > 0 && socket.readyState == 1) {
  //       socket.send(event.data)
  //     }
  //   });
  //   mediaRecorder.start(1000)
  // };
  // socket.onmessage = (message) => {
  //   const received = JSON.parse(message.data)
  //   const transcript = received.channel.alternatives[0].transcript
  //   if (transcript && received.is_final) {
  //     interaction.reply(`${getDisplayName(userId, user)}: ${transcript}`);
  //   };
  // };
}

async function join(interaction, client, connection) {
  await interaction.deferReply();
  const guild = client.guilds.cache.get(interaction.guildId);
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

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
    const receiver = connection.receiver;

    receiver.speaking.on("start", (userId) => {
      createListeningStream(
        receiver,
        userId,
        client.users.cache.get(userId),
        client
      );
    });
  } catch (error) {
    console.warn(error);
    await interaction.followUp(
      "Failed to join voice channel within 20 seconds, please try again later!"
    );
  }

  await interaction.followUp("Joined!");
}

async function record(interaction, client, connection) {
  if (connection) {
    const userId = interaction.options.get("speaker").value;

    const receiver = connection.receiver;
    if (connection.receiver.speaking.users.has(userId)) {
      createListeningStream(
        receiver,
        userId,
        client.users.cache.get(userId),
        client
      );
    }

    await interaction.reply({ ephemeral: true, content: "Listening!" });
  } else {
    await interaction.reply({
      ephemeral: true,
      content: "Join a voice channel and then try that again!",
    });
  }
}

async function leave(interaction, connection) {
  if (connection) {
    connection.destroy();
    await interaction.reply({ ephemeral: true, content: "Left the channel!" });
  } else {
    await interaction.reply({
      ephemeral: true,
      content: "Not playing in this server!",
    });
  }
}

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // console.log(interaction);

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user") {
    await interaction.reply(
      `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\nYour Nickname: ${interaction.member.nickname}`
    );
  } else if (commandName === "join") {
    await join(interaction, client, getVoiceConnection(interaction.guildId));
  } else if (commandName === "streamaudio") {
    await record(interaction, client, getVoiceConnection(interaction.guildId));
  } else if (commandName === "leave") {
    await leave(interaction, getVoiceConnection(interaction.guildId));
  } else if (commandName === "setchannel") {
    await interaction.reply(
      `This will eventually set the channel for transcribed audio, for now it is: <#${interaction.options._hoistedOptions[0].value}>`
    );
  }
});

// Login to Discord with your client's token
client.login(token);
