import { Command, Argument } from 'discord-akairo';
import { Message, MessageEmbed, GuildMember } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';

export default class UserInfoCommand extends Command {
    public constructor() {
        super('user', {
            aliases: ['user', 'userinfo', 'user-info', 'member-info', 'memberinfo'],
            description: {
                content: 'Zeigt Infos über einen bestimmten Nutzer.',
                usage: '[member]',
                examples: ['Crussong', '@Clashi', '440231273852698644']
            },
            category: 'Info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'member',
                    match: 'content',
                    type: 'member',
                    default: (message: Message): GuildMember => message.member!
                }
            ]
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | Message[]> {

        const { user } = member;

        let userDate: moment.Moment = moment(user.createdAt);
		let userMonth: string = userDate.format('MMM');
        let userMonthString: string;

        switch (userMonth) {
            case 'Jan':
                userMonthString = 'Januar'
				break;
            case 'Feb':
                userMonthString = 'Februar'
				break;
            case 'Mar':
                userMonthString = 'März'
				break;
            case 'Apr':
                userMonthString = 'April'
				break;
            case 'May':
                userMonthString = 'Mai'
				break;
            case 'Jun':
                userMonthString = 'Juni'
				break;
            case 'Jul':
                userMonthString = 'Juli'
				break;
            case 'Aug':
                userMonthString = 'August'
				break;
            case 'Sep':
                userMonthString = 'September'
				break;
            case 'Oct':
                userMonthString = 'Oktober'
				break;
            case 'Nov':
                userMonthString = 'November'
				break;
            case 'Dec':
                userMonthString = 'Dezember'
				break;
			default:
				userMonthString = userMonth;
				break;
        }

        let memberDate: moment.Moment = moment(member.joinedAt);
		let memberMonth: string = memberDate.format('MMM');
        let memberMonthString: string;

        switch (memberMonth) {
            case 'Jan':
                memberMonthString = 'Januar'
				break;
            case 'Feb':
                memberMonthString = 'Februar'
				break;
            case 'Mar':
                memberMonthString = 'März'
				break;
            case 'Apr':
                memberMonthString = 'April'
				break;
            case 'May':
                memberMonthString = 'Mai'
				break;
            case 'Jun':
                memberMonthString = 'Juni'
				break;
            case 'Jul':
                memberMonthString = 'Juli'
				break;
            case 'Aug':
                memberMonthString = 'August'
				break;
            case 'Sep':
                memberMonthString = 'September'
				break;
            case 'Oct':
                memberMonthString = 'Oktober'
				break;
            case 'Nov':
                memberMonthString = 'November'
				break;
            case 'Dec':
                memberMonthString = 'Dezember'
				break;
			default:
				memberMonthString = memberMonth;
				break;
        }

        let roleString: string = member.roles.cache.filter((r) => r.id !== message.guild.id).sort((r1, r2) => r2.comparePositionTo(r1)).map((roles): string => `\n<:empty:744513757962829845><@&${roles.id}>`).join(' ');
        let roleSize: number = member.roles.cache.filter((r) => r.id !== message.guild.id).size;

        const embed = new MessageEmbed()
            .setColor(member.displayColor)
            .setDescription(`Info über **${user.tag}** (ID: ${member.id})`)
            .addField(
                `${this.client.ownerID.includes(user.id) ? `⇒ Bot Entwickler Details` : `⇒ Member Details`}`,
                stripIndents`
                ${member.nickname == undefined ? '• Keinen Nicknamen' : ` • Nickname: ${member.nickname}`}
				• Rollen ${roleString.length < 896 ? `(${roleSize}): ${roleString}` : `: ${roleSize}`}
                • Beigetreten: ${memberDate.format(`DD. [${memberMonthString}] YYYY [|] HH:mm:ss`)}
                ${member.guild.owner == member ? '• Server Owner' : ''}
            `)
            .addField(
                '⇒ Benutzer Details',
                stripIndents`
				• ID: ${member.id}
				• Benutzername: ${member.user.tag}
                • Account erstellt: ${userDate.format(`DD. [${userMonthString}] YYYY [|] HH:mm:ss`)}
				• Status: ${user.presence.status.toUpperCase()}
                • Aktivität: ${user.presence.activities[0] ? `${user.presence.activities[0].type}: ${user.presence.activities[0].name}` : 'Keine'}
            `)
            .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }));


        return message.util!.send(embed);
    }
}