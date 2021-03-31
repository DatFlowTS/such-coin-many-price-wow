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

        let userDate: moment.Moment = moment.utc(user.createdAt);
        let userMonth: string = userDate.format('MMMM');
        let userMonthString: string;

        switch (userMonth.toLowerCase()) {
            case 'january':
                userMonthString = 'Januar'
            case 'february':
                userMonthString = 'Februar'
            case 'march':
                userMonthString = 'März'
            case 'april':
                userMonthString = 'April'
            case 'may':
                userMonthString = 'Mai'
            case 'june':
                userMonthString = 'Juni'
            case 'july':
                userMonthString = 'Juli'
            case 'august':
                userMonthString = 'August'
            case 'september':
                userMonthString = 'September'
            case 'october':
                userMonthString = 'Oktober'
            case 'november':
                userMonthString = 'November'
            default:
                userMonthString = 'Dezember'
        }

        let memberDate: moment.Moment = moment.utc(member.joinedAt);
        let memberMonth: string = memberDate.format('MMMM');
        let memberMonthString: string;

        switch (memberMonth.toLowerCase()) {
            case 'january':
                memberMonthString = 'Januar'
            case 'february':
                memberMonthString = 'Februar'
            case 'march':
                memberMonthString = 'März'
            case 'april':
                memberMonthString = 'April'
            case 'may':
                memberMonthString = 'Mai'
            case 'june':
                memberMonthString = 'Juni'
            case 'july':
                memberMonthString = 'Juli'
            case 'august':
                memberMonthString = 'August'
            case 'september':
                memberMonthString = 'September'
            case 'october':
                memberMonthString = 'Oktober'
            case 'november':
                memberMonthString = 'November'
            default:
                memberMonthString = 'Dezember'
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
                • Beigetreten: ${memberDate.format(`DD. [${memberMonthString}] YYYY [|] HH:mm:ss [UTC]`)}
                ${member.guild.owner == member ? '• Server Owner' : ''}
            `)
            .addField(
                '⇒ Benutzer Details',
                stripIndents`
				• ID: ${member.id}
				• Benutzername: ${member.user.tag}
                • Account erstellt: ${userDate.format(`DD. [${userMonthString}] YYYY [|] HH:mm:ss [UTC]`)}
				• Status: ${user.presence.status.toUpperCase()}
                • Aktivität: ${user.presence.activities[0] ? `${user.presence.activities[0].type}: ${user.presence.activities[0].name}` : 'Keine'}
            `)
            .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }));


        return message.util!.send(embed);
    }
}