import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildEmoji, TextChannel, NewsChannel } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';
import * as emojis from 'node-emoji';
import * as punycode from 'punycode.js';

const emojiRegex = /<(?:a)?:(?:\w{2,32}):(\d{17,19})>?/;

export default class EmojiInfoCommand extends Command {
    public constructor() {
        super('emoji', {
            aliases: ['emoji', 'emoji-info'],
            description: {
                content: 'Zeigt Infos über ein Emoji.',
                usage: '<emoji>',
                examples: ['🤔', 'thinking', '721497150302847017', '<:think:588127063257645077>']
            },
            category: 'Info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'emoji',
                    match: 'content',
                    type: async (message, content): Promise<any> => {
                        if (emojiRegex.test(content)) [, content] = content.match(emojiRegex)!;
                        if (!isNaN(content as any)) return message.guild!.emojis.cache.get(content);
                        return message.guild!.emojis.cache.find((e: GuildEmoji): boolean => e.name === content) || emojis.find(content);
                    },
                    prompt: {
                        start: (message: Message): string => `${message.author}, über welches Emoji möchtest du Infos?`,
                        retry: (message: Message): string => `${message.author}, gebe bitte ein gültiges Emoji an.`,
                        retries: 2
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { emoji }: { emoji: any }): Promise<Message | Message[]> {

        let emojiDate: moment.Moment = moment(emoji.createdAt);
		let emojiMonth: string = emojiDate.format('MMM');
        let emojiMonthString: string;

        switch (emojiMonth) {
            case 'Jan':
                emojiMonthString = 'Januar'
				break;
            case 'Feb':
                emojiMonthString = 'Februar'
				break;
            case 'Mar':
                emojiMonthString = 'März'
				break;
            case 'Apr':
                emojiMonthString = 'April'
				break;
            case 'May':
                emojiMonthString = 'Mai'
				break;
            case 'Jun':
                emojiMonthString = 'Juni'
				break;
            case 'Jul':
                emojiMonthString = 'Juli'
				break;
            case 'Aug':
                emojiMonthString = 'August'
				break;
            case 'Sep':
                emojiMonthString = 'September'
				break;
            case 'Oct':
                emojiMonthString = 'Oktober'
				break;
            case 'Nov':
                emojiMonthString = 'November'
				break;
            case 'Dec':
                emojiMonthString = 'Dezember'
				break;
			default:
				emojiMonthString = emojiMonth;
				break;
        }

        const embed = new MessageEmbed()
            .setColor(Math.floor(Math.random() * 12777214) + 1);

        if (emoji instanceof GuildEmoji) {
            embed.setDescription(`Info über **${emoji.name}** (ID: ${emoji.id})`);
            embed.addField(
                '⇒ Info',
                stripIndents`
				• Identifier: \`<${emoji.identifier}>\`
				• Erstellt: ${emojiDate.format(`DD. [${emojiMonthString}] YYYY [|] HH:mm:ss`)}
                • URL: ${emoji.url}
            `);
            embed.setImage(emoji.url);
        } else {
            embed.setDescription(`Info about ${emoji.emoji}`);
            embed.addField(
                '⇒ Info',
                stripIndents`
				• Name: \`${emoji.key}\`
				• Raw: \`${emoji.emoji}\`
				• Unicode: \`${punycode.ucs2.decode(emoji.emoji).map((e: any): string => `\\u${e.toString(16).toUpperCase().padStart(4, '0')}`).join('')}\`
				`);
        }

        message.channel.messages.fetch({ limit: 20 })
            .then((msgs) => {
                let messages: Message[] = msgs.filter(m => m.author.id === this.client.user.id && m.mentions.users.first() === message.author).array();
                (message.channel as TextChannel | NewsChannel).bulkDelete(messages)
            });

        return message.util!.send(embed);
    }
}