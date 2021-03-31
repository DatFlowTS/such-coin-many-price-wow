import { Command } from 'discord-akairo';
import { Message, MessageEmbed, Role, TextChannel, NewsChannel } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';
import 'moment-duration-format';

interface Permissions {
    [key: string]: string;
}

const PERMISSIONS: Permissions = {
    ADMINISTRATOR: 'Administrator',
    VIEW_AUDIT_LOG: 'View audit log',
    MANAGE_GUILD: 'Manage server',
    MANAGE_ROLES: 'Manage roles',
    MANAGE_CHANNELS: 'Manage channels',
    KICK_MEMBERS: 'Kick members',
    BAN_MEMBERS: 'Ban members',
    CREATE_INSTANT_INVITE: 'Create instant invite',
    CHANGE_NICKNAME: 'Change nickname',
    MANAGE_NICKNAMES: 'Manage nicknames',
    MANAGE_EMOJIS: 'Manage emojis',
    MANAGE_WEBHOOKS: 'Manage webhooks',
    VIEW_CHANNEL: 'Read text channels and see voice channels',
    SEND_MESSAGES: 'Send messages',
    SEND_TTS_MESSAGES: 'Send TTS messages',
    MANAGE_MESSAGES: 'Manage messages',
    EMBED_LINKS: 'Embed links',
    ATTACH_FILES: 'Attach files',
    READ_MESSAGE_HISTORY: 'Read message history',
    MENTION_EVERYONE: 'Mention everyone',
    USE_EXTERNAL_EMOJIS: 'Use external emojis',
    ADD_REACTIONS: 'Add reactions',
    CONNECT: 'Connect',
    SPEAK: 'Speak',
    MUTE_MEMBERS: 'Mute members',
    DEAFEN_MEMBERS: 'Deafen members',
    MOVE_MEMBERS: 'Move members',
    USE_VAD: 'Use voice activity'
};

export default class RoleInfoCommand extends Command {
    public constructor() {
        super('role', {
            aliases: ['role', 'roleinfo', 'role-info'],
            description: {
                content: 'Gets info about a role.',
                usage: '[role]',
                examples: ['Admin', '@Admin']
            },
            category: 'Info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'role',
                    match: 'content',
                    type: 'role',
                    default: (message: Message): Role => message.member!.roles.highest
                }
            ]
        });
    }

    public async exec(message: Message, { role }: { role: Role }): Promise<Message | Message[]> {

        let roleDate: moment.Moment = moment.utc(role.createdAt);
        let roleMonth: string = roleDate.format('MMMM');
        let roleMonthString: string;

        switch (roleMonth.toLowerCase()) {
            case 'january':
                roleMonthString = 'Januar'
            case 'february':
                roleMonthString = 'Februar'
            case 'march':
                roleMonthString = 'März'
            case 'april':
                roleMonthString = 'April'
            case 'may':
                roleMonthString = 'Mai'
            case 'june':
                roleMonthString = 'Juni'
            case 'july':
                roleMonthString = 'Juli'
            case 'august':
                roleMonthString = 'August'
            case 'september':
                roleMonthString = 'September'
            case 'october':
                roleMonthString = 'Oktober'
            case 'november':
                roleMonthString = 'November'
            default:
                roleMonthString = 'Dezember'
        }

        const permissions = Object.keys(PERMISSIONS).filter(
            // @ts-ignore
            (permission): string => role.permissions.serialize()[permission]
        );
        const embed = new MessageEmbed()
            .setColor(role.color)
            .setDescription(`Info über **${role.name}** (ID: ${role.id})`)
            .addField(
                '⇒ Info',
                stripIndents`
				• Farbe: ${role.hexColor.toUpperCase()}
				• Gruppiert: ${role.hoist ? 'Ja' : 'Nein'}
                • Pingbar: ${role.mentionable ? 'Ja' : 'Nein'}
                • Mitglieder: ${role.guild.members.cache.filter((m) => m.roles.cache.has(role.id)).size}
				• Erstellt: ${roleDate.format(`DD. [${roleMonthString}] YYYY [|] HH:mm:ss [UTC]`)}
            `)
            .addField(
                '⇒ Berechtigungen',
                stripIndents`
				${permissions.map((permission): string => `• ${PERMISSIONS[permission]}`).join('\n') || 'Keine'}
            `)
            .setThumbnail(message.guild!.iconURL()!);

        message.channel.messages.fetch({ limit: 20 })
            .then((msgs) => {
                let messages: Message[] = msgs.filter(m => m.author.id === this.client.user.id && m.mentions.users.first() === message.author).array();
                (message.channel as TextChannel | NewsChannel).bulkDelete(messages)
            });

        return message.util!.send(embed);
    }
}