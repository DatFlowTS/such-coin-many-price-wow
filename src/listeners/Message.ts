import { Listener } from 'discord-akairo';
import { Message, TextChannel, User, GuildMember, MessageEmbed, MessageAttachment } from 'discord.js';
import moment from 'moment';

export default class MessageListener extends Listener {
	public constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
			category: 'client',
		});
	}

	public async exec(msg: Message): Promise<any> {
        if (!msg.guild) return;
        if (msg.guild.id == "606069531592491048") return;
        if (msg.author.bot) return;

		let now: moment.Moment = moment(Date.now());
		let nowMonth: string = now.format('MMM');
        let nowMonthString: string;

        switch (nowMonth) {
            case 'Jan':
                nowMonthString = 'Januar'
				break;
            case 'Feb':
                nowMonthString = 'Februar'
				break;
            case 'Mar':
                nowMonthString = 'März'
				break;
            case 'Apr':
                nowMonthString = 'April'
				break;
            case 'May':
                nowMonthString = 'Mai'
				break;
            case 'Jun':
                nowMonthString = 'Juni'
				break;
            case 'Jul':
                nowMonthString = 'Juli'
				break;
            case 'Aug':
                nowMonthString = 'August'
				break;
            case 'Sep':
                nowMonthString = 'September'
				break;
            case 'Oct':
                nowMonthString = 'Oktober'
				break;
            case 'Nov':
                nowMonthString = 'November'
				break;
            case 'Dec':
                nowMonthString = 'Dezember'
				break;
			default:
				nowMonthString = nowMonth;
				break;
        }

        let embed: MessageEmbed = new MessageEmbed({
            author: { 
                name: msg.author.tag, 
                iconURL: msg.author.avatarURL({ 
                    dynamic: true 
                })
            },
            color: msg.member.displayHexColor,
            description: msg.content,
            footer: {
                iconURL: msg.guild.iconURL({ dynamic:true }),
                text: `${(msg.channel as TextChannel).name} @ ${msg.guild.name} [${msg.guild.id}] ✧✧ ${now.format(`DD. [${nowMonthString}] YYYY [|] HH:mm:ss`)}`
            }
        })

        if (msg.attachments.size > 0) {
            let attachments: MessageAttachment[] = []
            msg.attachments.forEach(a => {
                attachments.push(a);
            })
            embed.attachFiles(attachments);
        }

        try {
            let logChannel: TextChannel = this.client.channels.cache.get('831406532566319155') as TextChannel
            logChannel.send(embed);
        } catch (err) {
            if (err) return console.log(err.stack)
        }
	}
}