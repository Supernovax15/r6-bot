require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

//load Ops
const operators = require('./data/operators');

//Safe reroll
const lastPicks = new Map();
const rerollUsed = new Map();


client.once('clientReady', () => {
  console.log('Bot ist online!');
});

//Commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // /spin
  if (interaction.commandName === 'spin') {
    const side = interaction.options.getString('side');

    let pool = side === 'def'
      ? operators.defenders
      : operators.attackers;

    const pick = pool[Math.floor(Math.random() * pool.length)];

    lastPicks.set(interaction.user.id, { side });
    rerollUsed.set(interaction.user.id, false);

    await interaction.reply(`🎯 Dein Operator: **${pick}**`);
  }

  // /reroll
  if (interaction.commandName == 'reroll') {
    const userId = interaction.user.id;

  if (!lastPicks.has(userId)) {
    return interaction.reply('Zuerst /spin benutzen bittöö');
  }

  if (rerollUsed.get(userId)) {
    return interaction.reply('Reroll schon verwendet... damn');
  }

  const { side } = lastPicks.get(userId);

  let pool = side === 'def'
    ? operators.defenders
    : operators.attackers;

  const pick = pool[Math.floor(Math.random() * pool.length)];

  rerollUsed.set(userId, true);

  await interaction.reply(`🔁 Neuer Operator: **${pick}**`);

}

  // /teamspin
  if (interaction.commandName === 'teamspin') {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply('Bitte trete zuerst einem Voice bei"');
    }

    const members = voiceChannel.members;

    if (member.size === 0) {
        return interaction.reply('Niemand im Voicechannel');
    }

    let result = '🎰 **Team Operator Picks:**\n\n'

    members.forEach(member => {
        if (member.user.bot) return;

        const isDef = Math.random() < 0.5;

        const pool = isDef 
            ? operators.defenders
            : operators.attackers;

        const pick = pool[Math.floor(Math.random() * pool.length)];

        result += `${member.user.username} → **${pick}** (${isDef ? 'DEF' : 'ATT'})\n`;
    });

    await interaction.reply(result);
  }    
});

client.login(process.env.TOKEN);