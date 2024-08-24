const fs = require('fs');
const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  PermissionsBitField } = require('discord.js');
const { BotName, ServerLogo, LogChannel } = require('../config.js');

module.exports = {
  name: 'sendapp',
  description: 'Send a whitelist application.',
  async execute(message) {
    try {
      const embed = new EmbedBuilder()
        .setTitle('Whitelist Application')
        .setDescription('Click the button below to open the Application form Panel.\n\n**Note:** You can only open the Application form Panel once per day.')
        .setColor('#66ff33');

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('open_whitelist_form')
            .setLabel('Click Here To Open Whitelist Application Form')
            .setStyle(ButtonStyle.Success)
        );

      await message.reply({ embeds: [embed], components: [row] });

      message.client.on('interactionCreate', async interaction => {
        try {
          if (interaction.isButton() && interaction.customId === 'open_whitelist_form') {
            const modal = new ModalBuilder()
              .setCustomId('Whitelist_Application')
              .setTitle('Whitelist Application');

            const characternameInput = new TextInputBuilder()
              .setCustomId('charactername')
              .setLabel('Character Name')
              .setPlaceholder('Formate : Sebastian_Varkey')
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const ageInput = new TextInputBuilder()
              .setCustomId('age')
              .setLabel('Age')
              .setMinLength(2)
              .setPlaceholder('Must be over 10 years old')
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            const experienceInput = new TextInputBuilder()
              .setCustomId('experience')
              .setLabel('Roleplay Experience (month/year)')
              .setPlaceholder('Example: 2 Months/2 Years')
              .setStyle(TextInputStyle.short)
              .setRequired(true);

            const guidelinesInput = new TextInputBuilder()
              .setCustomId('guidelines')
              .setLabel('Have you read all the Rules? (yes or no)')
              .setPlaceholder('Always Allow Rules')
              .setStyle(TextInputStyle.Short)
              .setRequired(true);

            modal.addComponents(
              new ActionRowBuilder().addComponents(characternameInput),
              new ActionRowBuilder().addComponents(ageInput),
              new ActionRowBuilder().addComponents(experienceInput),
              new ActionRowBuilder().addComponents(guidelinesInput)
            );

            await interaction.showModal(modal);
          } else if (interaction.isModalSubmit() && interaction.customId === 'Whitelist_Application') {
            const charactername = interaction.fields.getTextInputValue('charactername');
            const age = interaction.fields.getTextInputValue('age');
            const experience = interaction.fields.getTextInputValue('experience');
            const guidelines = interaction.fields.getTextInputValue('guidelines');

            const channelId = '1252596956413431899';
            const channel = await interaction.client.channels.fetch(channelId);

            if (channel) {
              const whitelistembed = new EmbedBuilder()
                .setTitle('New Application Is Here')
                .setDescription('A new player has submitted an application')
                .addFields(
                  { name: 'Character Name', value: charactername, inline: true },
                  { name: 'Age', value: age, inline: true },
                  { name: 'Roleplay Experience', value: experience, inline: true },
                  { name: 'Read Guidelines', value: guidelines, inline: true },
                  { name: 'User ID', value: interaction.user.id, inline: true }
                );

              const buttons = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('accepted')
                    .setLabel('Accepted')
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId('pending')
                    .setLabel('Pending')
                    .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                    .setCustomId('rejected')
                    .setLabel('Rejected')
                    .setStyle(ButtonStyle.Danger)
                );

              await channel.send({ embeds: [whitelistembed], components: [buttons] });

              const userMessage = 'Here is the information that you submitted to admins. Please check it carefully.\n\n';
              
              const userEmbed = new EmbedBuilder()
                .setTitle('Application Information')
                .setAuthor({ name:BotName, iconURL:ServerLogo})
                .setDescription('Notice any errors? Please contact the admins or create a ticket to re-edit the information and get whitelisted.\n\n## HAVE A NICE GAMEPLAY EXPERIENCE')
                .addFields(
                  { name: 'Character Name', value: charactername, inline: true },
                  { name: 'Age', value: age, inline: true },
                  { name: 'Roleplay Experience', value: experience, inline: true },
                  { name: 'Read Guidelines', value: guidelines, inline: true }
                )
                .setFooter({ text: 'Developed By God Dc Team', iconURL: 'https://media.discordapp.net/attachments/1243430259299192884/1252624005421207562/a-minimalist-and-dark-themed-logo-for-god-dc-devel-V4qUZQLxR3e3KDdU9DE40w-yEu4fW2oQTmPTxfhc_4YnQ.jpeg?ex=66743603&is=6672e483&hm=dbfc6527459f595117bfd26e1e6ebe8c1637bd192e575620f9b867a093a2db79&=&format=webp&width=472&height=472' });

              await interaction.user.send({ content: userMessage, embeds: [userEmbed] });

              await interaction.reply({ content: 'Your application has been submitted successfully!', ephemeral: true });
            } else {
              await interaction.reply({ content: 'Error: Channel not found.', ephemeral: true });
            }
          }

          if (interaction.isButton()) {
            const userIdField = interaction.message.embeds[0].fields.find(field => field.name === 'User ID');
            const userId = userIdField ? userIdField.value : null;

            if (!userId) {
              console.error('Error 1002 Contucted Dont Worry');
              return;
            }

            const user = await interaction.client.users.fetch(userId);


            if (interaction.customId === 'accepted') {
              const acceptedEmbed = new EmbedBuilder()
                .setTitle('Whitelist Application Approved!')
                .setDescription('Congratulations! Your in-game whitelist application has been approved.')
                .setColor('#4CAF50')
                .addFields(
                  { name: 'Enjoy Roleplay', value: 'Have a great time immersing yourself in the roleplay experience! 🌟', inline: true },
                  { name: 'Next Steps', value: 'Make sure to read the rules and guidelines before you start. 📜', inline: true }
                );

              await user.send({ embeds: [acceptedEmbed] });
            } else if (interaction.customId === 'pending') {
              const pendingEmbed = new EmbedBuilder()
                .setTitle('Whitelist Application Pending ⏳')
                .setDescription('Your in-game whitelist application is currently under review.')
                .setColor('#E67E22')
                .addFields(
                  { name: 'Next Steps', value: 'Your application has been forwarded to the high-level admins for further review. Please be patient while we process your request. 🕵️‍♂️', inline: true },
                  { name: 'Estimated Time', value: 'The review process typically takes 24-48 hours. ⏲️', inline: true }
                );

              await user.send({ embeds: [pendingEmbed] });
            } else if (interaction.customId === 'rejected') {
              const rejectedEmbed = new EmbedBuilder()
                .setTitle('Whitelist Application Rejected ❌')
                .setDescription('Your in-game whitelist application has been rejected.')
                .setColor('#E74C3C')
                .addFields(
                  { name: 'Reason', value: 'Your application has been rejected because either your in-game name was incorrect or we detected multiple IP addresses associated with your application.' },
                  { name: 'Next Steps', value: 'Please double-check your in-game name and ensure you are using a consistent IP address for your application. You may reapply after correcting any issues. 🛠️' }
                );

              await user.send({ embeds: [rejectedEmbed] });
            }
          }
        } catch (error) {
          console.error('Error handling interaction:', error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Something went wrong. Please try again later.', ephemeral: true });
          } else {
            await interaction.reply({ content: 'Something went wrong. Please try again later.', ephemeral: true });
          }
        }
      });
    } catch (error) {
      console.error('Error executing command:', error);
      await message.reply({ content: 'Something went wrong. Please try again later.', ephemeral: true });
    }
  }
};
