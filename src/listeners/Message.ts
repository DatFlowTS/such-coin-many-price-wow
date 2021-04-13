import { Listener } from 'discord-akairo';
import { Message, TextChannel, User, GuildMember, MessageEmbed } from 'discord.js';
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
        if ( !msg.guild ) return;

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
            title: "[ MESSAGE EDITED ]",
            description: msg.content,
            footer: {
                iconURL: msg.guild.iconURL({ dynamic:true }),
                text: `${(msg.channel as TextChannel).name} @ ${msg.guild.name} [${msg.guild.id}] ✧✧ ${now.format(`DD. [${nowMonthString}] YYYY [|] HH:mm:ss`)}`
            }
        })

        try {
            let logChannel: TextChannel = this.client.channels.cache.get('831405229483753474') as TextChannel
            logChannel.send(embed);
        } catch (err) {
            if (err) return console.log(err.stack)
        }
	}
}