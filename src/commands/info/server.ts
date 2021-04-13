import { Command } from 'discord-akairo';
import { Message, MessageEmbed, TextChannel, Guild } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';

interface HumanLevels {
    [key: string]: string;
}
interface GuildFeatures {
    [key: string]: string;
}

const HUMAN_LEVELS: HumanLevels = {
    'NONE': '[0] None',
    'LOW': '[1] Low',
    'MEDIUM': '[2] Medium',
    'HIGH': '[3] High\n(╯°□°）╯︵ ┻━┻',
    'VERY_HIGH': '[4] Highest\n┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const GUILD_FEATURES: GuildFeatures = {
    'ANIMATED_ICON': 'Animated Icon',
    'BANNER': 'Banner',
    'COMMERCE': 'Commerce',
    'COMMUNITY': 'Community',
    'DISCOVERABLE': 'Discoverable',
    'FEATUREABLE': 'Featurable',
    'INVITE_SPLASH': 'Splash Invite',
    'NEWS': 'News Channel',
    'PARTNERED': 'Partnered',
    'VANITY_URL': 'Vanity URL',
    'VIP_REGIONS': 'VIP Server Regions',
    'WELCOME_SCREEN_ENABLED': 'Welcome Screen'
}

export default class ServerInfoCommand extends Command {
    public constructor() {
        super('server', {
            aliases: ['server', 'server-info', 'serverinfo', 'guild', 'guild-info', 'guildinfo'],
            description: {
                content: 'Zeigt Info über den Server',
            },
            category: 'Info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'guild',
                    match: 'content',
                    type: 'guild',
                    default: (message: Message): Guild => message.guild
                }
            ]
        });
    }

    public async exec(message: Message, { guild }: { guild: Guild }): Promise<Message | Message[]> {

        let guildDate: moment.Moment = moment(guild!.createdAt);
		let guildMonth: string = guildDate.format('MMM');
        let guildMonthString: string;

        switch (guildMonth) {
            case 'Jan':
                guildMonthString = 'Januar'
				break;
            case 'Feb':
                guildMonthString = 'Februar'
				break;
            case 'Mar':
                guildMonthString = 'März'
				break;
            case 'Apr':
                guildMonthString = 'April'
				break;
            case 'May':
                guildMonthString = 'Mai'
				break;
            case 'Jun':
                guildMonthString = 'Juni'
				break;
            case 'Jul':
                guildMonthString = 'Juli'
				break;
            case 'Aug':
                guildMonthString = 'August'
				break;
            case 'Sep':
                guildMonthString = 'September'
				break;
            case 'Oct':
                guildMonthString = 'Oktober'
				break;
            case 'Nov':
                guildMonthString = 'November'
				break;
            case 'Dec':
                guildMonthString = 'Dezember'
				break;
			default:
				guildMonthString = guildMonth;
				break;
        }

        let guildFeatures: string[] = guild!.features.map((f, k): string => `• ${GUILD_FEATURES[f]}\n`)
        let guildBanner: string = guild.features.filter((f) => GUILD_FEATURES[f] === 'Banner').length > 0 ? guild.bannerURL({ format: 'png', size: 4096 }) : '';
        let guildSplash: string = guild.features.filter((f) => GUILD_FEATURES[f] === 'Splash Invite').length > 0 ? guild.splashURL({ format: "png", size: 4096 }) : '';
        let vanityURL: string = guild.features.filter((f) => GUILD_FEATURES[f] === 'Vanity URL').length > 0 ? `https://discord.gg/${guild.vanityURLCode}/` : '';

        const on: string = '🟢';
        const off: string = '⚪';
        const dnd: string = '🔴';
        const afk: string = '🟡';

        var onMembers: number = guild.members.cache.filter((m) => m.user.presence.status === 'online' && !m.user.bot).size;
        var offMembers: number = guild.members.cache.filter((m) => m.user.presence.status === 'offline' && !m.user.bot).size;
        var dndMembers: number = guild.members.cache.filter((m) => m.user.presence.status === 'dnd' && !m.user.bot).size;
        var afkMembers: number = guild.members.cache.filter((m) => m.user.presence.status === 'idle' && !m.user.bot).size;

        let adminRoleString: string = guild.roles.cache.filter((r) => r.permissions.has('ADMINISTRATOR')).sort((r1, r2) => r2.comparePositionTo(r1)).map((roles): string => `\n<:empty:744513757962829845><:empty:744513757962829845>• <@&${roles.id}>`).join(' ')
        let adminRoleSize: number = guild.roles.cache.filter((r) => r.permissions.has('ADMINISTRATOR')).size;

        const guildOwner = await guild!.members.fetch(guild!.ownerID);
        const embed = new MessageEmbed()
            .setColor(guildOwner.displayColor)
            .setAuthor(`${guild!.name}`, guild!.iconURL({ dynamic: true, format: "png" }))
            .setDescription(`(ID: ${guild!.id}${guildSplash !== '' ? `, [Splash](${guildSplash})` : ''})`)
            .addField(
                '⇒ Channels',
                stripIndents`
                • ${guild!.channels.cache.filter((ch): boolean => ch.type === 'text').size} Text (${guild!.channels.cache.filter((ch) => (ch as TextChannel).nsfw).size} NSFW)
                • ${guild!.channels.cache.filter((ch): boolean => ch.type === 'voice').size} Voice
                ${guild!.afkChannelID ? `• AFK: <#${guild!.afkChannelID}> after ${guild!.afkTimeout / 60}min` : `• AFK-Timeout: ${guild!.afkTimeout ? `${guild!.afkTimeout / 60}min` : ''}`}
                • Kategorien: ${guild!.channels.cache.filter((ch): boolean => ch.type === 'category').size}
            `, true)
            .addField(
                '⇒ Mitglieder',
                stripIndents`
                • ${guild!.members.cache.size} members
                <:empty:744513757962829845>• ${guild!.members.cache.filter((m) => m.user.bot).size} bots
                <:empty:744513757962829845>• ${guild!.members.cache.filter((m) => !m.user.bot).size} menschen
                • Owner: ${guildOwner}
                <:empty:744513757962829845>• ID: ${guildOwner.id}
                <:empty:744513757962829845>• Tag: ${guildOwner.user.tag}
            `, true)
            .addField('<:empty:744513757962829845>', '<:empty:744513757962829845>', true)
            .addField(
                '⇒ Features',
                stripIndents`
                ${guildFeatures.length > 0 ? `${guild!.features.map((f, k): string => `• ${GUILD_FEATURES[f]}\n`).join(' ')}${guild.verified ? `\n• Verified` : ''}` : '• No Features'}
            `, true)
            .addField(
                '⇒ Nitro Boosts',
                stripIndents`
                ${guild!.premiumSubscriptionCount > 0 ? stripIndents`
                • Boost tier: ${guild!.premiumTier}
                • Anzahl Boosts: ${guild!.premiumSubscriptionCount}
                ${guild!.premiumTier === 1 ? `• Perks:
                <:empty:744513757962829845>• 100 Emoji Slots
                <:empty:744513757962829845>• 128kbps max audio quality
                <:empty:744513757962829845>• High Quality Streaming` : `${guild!.premiumTier === 2 ? `• Perks:
                <:empty:744513757962829845>• 150 Emoji Slots
                <:empty:744513757962829845>• 256kbps max audio quality
                <:empty:744513757962829845>• 50 MB upload limit
                <:empty:744513757962829845>• 1080p @ 60fps Streaming` : `${guild!.premiumTier === 3 ? `• Perks:
                <:empty:744513757962829845>• 250 Emoji Slots
                <:empty:744513757962829845>• 384kbps max audio quality
                <:empty:744513757962829845>• 100 MB upload limit
                <:empty:744513757962829845>• 1080p @ 60fps Streaming` : `• Keine Perks`}`}`}
                ` : '• Not boosted yet.'}
            `, true)
            .addField('<:empty:744513757962829845>', '<:empty:744513757962829845>', true)
            .addField(
                '⇒ Weiteres',
                stripIndents`
                • Rollen: ${guild!.roles.cache.size}
                <:empty:744513757962829845>• Administratorrollen: ${adminRoleSize > 0 && adminRoleString.length < 768 ? `(${adminRoleSize})${adminRoleString}` : `${adminRoleSize}`}
                • Region: ${guild!.region}
                • Erstellt: ${guildDate.format(`DD. [${guildMonthString}] YYYY [|] HH:mm:ss`)}
                • Verifikationsstufe: ${HUMAN_LEVELS[guild!.verificationLevel]}
            `)


        let now: moment.Moment = moment(Date.now());
        let nowMonth: string = guildDate.format('MMMM');
        let nowMonthString: string;

        switch (nowMonth.toLowerCase()) {
            case 'january':
                nowMonthString = 'Januar'
            case 'february':
                nowMonthString = 'Februar'
            case 'march':
                nowMonthString = 'März'
            case 'april':
                nowMonthString = 'April'
            case 'may':
                nowMonthString = 'Mai'
            case 'june':
                nowMonthString = 'Juni'
            case 'july':
                nowMonthString = 'Juli'
            case 'august':
                nowMonthString = 'August'
            case 'september':
                nowMonthString = 'September'
            case 'october':
                nowMonthString = 'Oktober'
            case 'november':
                nowMonthString = 'November'
            default:
                nowMonthString = 'Dezember'
        }

        embed.setFooter(`Meitglieder nach Status: ${onMembers > 0 ? `${on} ${onMembers} ✧ ` : ''}${afkMembers > 0 ? `${afk} ${afkMembers} ✧ ` : ''}${dndMembers > 0 ? `${dnd} ${dndMembers} ✧ ` : ''}${offMembers > 0 ? `${off} ${offMembers} ✧ ` : ''}${now.format(`DD. [${nowMonthString}] YYYY [|] HH:mm:ss`)}`)



        if (guildBanner !== '') embed.setImage(guildBanner);
        if (vanityURL !== '') embed.setAuthor(`${guild!.name}`, guild!.iconURL({ dynamic: true, format: "png" }), vanityURL);

        return message.util!.send(embed).catch(e => { if (e) return message.util!.send('something went wrong') });
    }
}