import { stripIndents } from "common-tags";
import { Listener } from "discord-akairo";
import { Message, TextChannel, User, GuildMember, MessageEmbed } from "discord.js";
import moment from "moment";

export default class MessageUpdateListener extends Listener {
    public constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate',
            category: 'client',
        });
    }

    public async exec(oMsg: Message, nMsg: Message): Promise<any> {
        if (!nMsg.guild && !oMsg.guild) return;
        if (nMsg.content == oMsg.content) return;
        if (nMsg.guild.id == "606069531592491048") return;
        if (nMsg.author.bot) return;

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
                name: nMsg.author.tag, 
                iconURL: nMsg.author.avatarURL({ 
                    dynamic: true 
                })
            },
            title: "[ MESSAGE EDITED ]",
            fields: [
                {
                    name: "Old Message",
                    value: oMsg.content
                },
                {
                    name: "New Message",
                    value: nMsg.content
                }
            ],
            footer: {
                iconURL: nMsg.guild.iconURL({ dynamic:true }),
                text: `${(nMsg.channel as TextChannel).name} @ ${nMsg.guild.name} [${nMsg.guild.id}] ✧✧ ${now.format(`DD. [${nowMonthString}] YYYY [|] HH:mm:ss`)}`
            }
        })

        try {
            let logChannel: TextChannel = this.client.channels.cache.get('831405334479634443') as TextChannel
            logChannel.send(embed);
        } catch (err) {
            if (err) return console.log(err.stack)
        }
    }
}