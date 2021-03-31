import { Command } from 'discord-akairo';
import {
    Message,
    MessageEmbed,
    GuildMember,
    NewsChannel,
    TextChannel
} from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';

export default class PurgeCommand extends Command {
    public constructor() {
        super('purge', {
            aliases: ['purge', 'delete', 'clear'],
            description: {
                content: 'Löscht bestimmte Anzahl Nachrichten, optional von bestimmtem Nutzer.',
                usage: '<menge> [member]',
                examples: ['42', '42 @Spammer#1337']
            },
            category: 'Moderation',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            ratelimit: 2,
            args: [
                {
                    id: 'amount',
                    type: 'integer',
                    prompt: {
                        start: (message: Message): string => `${message.author}, wieviele Nachrichten möchtest du löschen?`,
                        retry: (message: Message): string => `${message.author}, bitte eine gültige Anzahl angeben!`,
                        retries: 2
                    }
                },
                {
                    id: 'member',
                    type: 'member',
                    match: 'phrase',
                    default: null
                }
            ]
        });
    }

    public async exec(message: Message, { amount, member }: { amount: number, member: GuildMember }): Promise<Message | Message[] | void> {
        if (message.deletable && !message.deleted) await message.delete();

        var isMod: boolean = message.member.hasPermission('MANAGE_MESSAGES');

        const clientMember = await message.guild!.members.fetch(this.client.user!.id);

        if (!clientMember.permissions.has('MANAGE_MESSAGES')) return message.util!.reply('Ich darf hier keine Nachrichten löschen....');

        if (amount < 2 || amount > 99) return message.util!.send('Du kannst nur zwischen 1 und 100 Nachrichten auf einmal löschen.');

        try {
            if (member && member != null) {

                message.channel.messages.fetch({ limit: 20 })
                    .then((msgs) => {
                        let messages: Message[] = msgs.filter(m => m.author.id === this.client.user.id && m.mentions.users.first() === message.author).array();
                        (message.channel as TextChannel).bulkDelete(messages)
                    });

                message.channel.messages.fetch({ limit: 100 })
                    .then((msgs) => {
                        let messages: Message[] = msgs.filter(m => m.author.id === member.id && Date.now() - m.createdTimestamp < 1209600000).array().slice(0, amount);
                        (message.channel as TextChannel).bulkDelete(messages).then(async (deleted) => {
                            const embed = new MessageEmbed({
                                author: {
                                    name: `#${(message.channel as TextChannel).name}`,
                                    url: `https://discord.com/channels/${message.guild.id}/${message.channel.id}`
                                },
                                color: member.displayHexColor,
                                description: stripIndents`
                                ${deleted.size} ${deleted.size > 1 ? 'Nachrichten wurden' : 'Nachricht wurde'} gelöscht
                                from ${member.user.tag} (${member.id})
                                by ${message.author.tag} (${message.author.id})
                                `
                            });
                            message.util!.send(embed).then(m => {
                                // @ts-ignore
                                m.delete({ timeout: 5000 });
                            });
                        });
                    });
            } else {

                message.channel.messages.fetch({ limit: 20 })
                    .then((msgs) => {
                        let messages: Message[] = msgs.filter(m => m.author.id === this.client.user.id && m.mentions.users.first() === message.author && Date.now() - m.createdTimestamp < 1209600000).array();
                        (message.channel as TextChannel).bulkDelete(messages)
                    });

                (message.channel as TextChannel).bulkDelete(amount, true).then(async (deleted) => {
                    const embed = new MessageEmbed({
                        author: {
                            name: `#${(message.channel as TextChannel).name}`,
                            url: `https://discord.com/channels/${message.guild.id}/${message.channel.id}`
                        },
                        color: message.member.displayHexColor,
                        description: stripIndents`
                        ${deleted.size} ${deleted.size > 1 ? 'Nachrichten wurden' : 'Nachricht wurde'} gelöscht
                        by ${message.author.tag} (${message.author.id})
                        `
                    });
                    message.util!.send(embed).then(m => {
                        // @ts-ignore
                        m.delete({ timeout: 3000 });
                    });
                });
            };

        } catch (error) {
            console.log(error.stack)
            const fail = new MessageEmbed()
                .setColor([245, 155, 55])
                .setDescription('Huch?! Da lief was schief.\n\n```' + error + '```');

            message.channel.messages.fetch({ limit: 20 })
                .then((msgs) => {
                    let messages: Message[] = msgs.filter(m => m.author.id === this.client.user.id && m.mentions.users.first() === message.author).array();
                    (message.channel as TextChannel | NewsChannel).bulkDelete(messages)
                });

            return message.util!.send(fail);
        }

    }
}