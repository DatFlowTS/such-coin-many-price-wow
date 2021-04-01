import { Command } from 'discord-akairo';
import { Message, MessageEmbed, GuildChannel, DMChannel, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';

export default class ChannelInfoCommand extends Command {
    public constructor() {
        super('channel', {
            aliases: ['channel', 'channelinfo', 'channel-info'],
            description: {
                content: 'Zeigt Infos über einen Channel.',
                usage: '[channel]',
                examples: ['#general', 'general', '606069531592491050']
            },
            category: 'Info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'channel',
                    match: 'content',
                    type: 'channel',
                    default: (message: Message): GuildChannel | DMChannel => message.channel
                }
            ]
        });
    }

    public async exec(message: Message, { channel }: { channel: TextChannel }): Promise<Message | Message[]> {

        let channelDate: moment.Moment = moment(channel.createdAt);
		let channelMonth: string = channelDate.format('MMM');
        let channelMonthString: string;

        switch (channelMonth) {
            case 'Jan':
                channelMonthString = 'Januar'
				break;
            case 'Feb':
                channelMonthString = 'Februar'
				break;
            case 'Mar':
                channelMonthString = 'März'
				break;
            case 'Apr':
                channelMonthString = 'April'
				break;
            case 'May':
                channelMonthString = 'Mai'
				break;
            case 'Jun':
                channelMonthString = 'Juni'
				break;
            case 'Jul':
                channelMonthString = 'Juli'
				break;
            case 'Aug':
                channelMonthString = 'August'
				break;
            case 'Sep':
                channelMonthString = 'September'
				break;
            case 'Oct':
                channelMonthString = 'Oktober'
				break;
            case 'Nov':
                channelMonthString = 'November'
				break;
            case 'Dec':
                channelMonthString = 'Dezember'
				break;
			default:
				channelMonthString = channelMonth;
				break;
        }

        const embed = new MessageEmbed()
            .setColor(Math.floor(Math.random() * 12777214) + 1)
            .setDescription(`Info about **${channel.name}**`)
            .addField(
                '⇒ Info',
                stripIndents`
                • Typ: ${channel.type}
				• Topic: ${channel.topic ? channel.topic : 'None'}
				• NSFW: ${channel.nsfw ? 'Ja' : 'Nein'}
				• Erstellt: ${channelDate.format(`DD. [${channelMonthString}] YYYY [|] HH:mm:ss`)}
			    `
            )
            .setThumbnail(message.guild!.iconURL()!);

        return message.util!.send(embed);
    }
}