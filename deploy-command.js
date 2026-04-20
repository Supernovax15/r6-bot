
require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('spin')
    .setDescription('Bekomme einen zufälligen Operator')
    .addStringOption(option =>
      option.setName('side')
            .setDescription('Wähle Attacker oder Defender')
            .addChoices(
            { name: 'Attacker', value: 'att' },
            { name: 'Defender', value: 'def' }
            )
            .setRequired(true)),

    new SlashCommandBuilder()
            .setName('teamspin')
            .setDescription('Gibt allen im Voice Channel einen zufälligen Operator')
            .addStringOption(option =>
              option.setName('side')
                    .setDescription('Wähle Attacker, Defender oder Mixed')
                    .addChoices(
                      { name: 'Attacker', value: 'att' },
                      { name: 'Defender', value: 'def' },
                      { name: 'Mixed', value: 'mix' }
                    )
                    .setRequired(true)),

    new SlashCommandBuilder()
            .setName('reroll')
            .setDescription('Erlaubt dir einen neuen Operator (einmalig!)')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registriere Commands');

        await rest.put(
            Routes.applicationCommands('1495123609985880345'),
        { body: commands }
        );

        console.log('Commands registriert');
    }   catch (error) {
    console.error(error);
    }
})();

