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

        let channelDate: moment.Moment = moment.utc(channel.createdAt);
        let channelMonth: string = channelDate.format('MMMM');
        let channelMonthString: string;

        switch (channelMonth.toLowerCase()) {
            case 'january':
                channelMonthString = 'Januar'
            case 'february':
                channelMonthString = 'Februar'
            case 'march':
                channelMonthString = 'März'
            case 'april':
                channelMonthString = 'April'
            case 'may':
                channelMonthString = 'Mai'
            case 'june':
                channelMonthString = 'Juni'
            case 'july':
                channelMonthString = 'Juli'
            case 'august':
                channelMonthString = 'August'
            case 'september':
                channelMonthString = 'September'
            case 'october':
                channelMonthString = 'Oktober'
            case 'november':
                channelMonthString = 'November'
            default:
                channelMonthString = 'Dezember'
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
				• Erstellt: ${channelDate.format(`DD. [${channelMonthString}] YYYY [|] HH:mm:ss [UTC]`)}
			    `
            )
            .setThumbnail(message.guild!.iconURL()!);

        return message.util!.send(embed);
    }
}