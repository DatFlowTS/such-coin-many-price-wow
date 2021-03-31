import {
	Command,
	AkairoClient
} from 'discord-akairo';
import {
	Message,
	MessageEmbed,
	User
} from 'discord.js';
import * as Discord from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';
import {
	version,
	description,
} from '../../../package.json';
import botConfig from '../../config/botConfig';

export default class StatsCommand extends Command {
	public constructor() {
		super('bot', {
			aliases: ['bot', 'bot-info', 'stats'],
			description: {
				content: 'Displays statistics about the bot.',
			},
			category: 'Info',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2
		});
	}

	public async exec(message: Message): Promise<Message | Message[]> {
		const owner: User = await this.client.users.fetch(this.client.ownerID[0]!);

		const memAlloc = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);
		const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
		const memPercent = (memUsed / memAlloc * 100).toFixed(2);

		var userCount: number = await getUserCount(this.client);
		var humanUserCount: number = await getHumanUserCount(this.client);
		var botUserCount: number = await getBotUserCount(this.client);
		var channelCount: number = await getChannelCount(this.client);
		var serverCount: number = await getServerCount(this.client);

		var boostedServerCount: number = this.client.guilds.cache.filter((g) => g.premiumSubscriptionCount > 0).size
		var tier1ServerCount: number = this.client.guilds.cache.filter((g) => g.premiumTier === 1).size
		var tier2ServerCount: number = this.client.guilds.cache.filter((g) => g.premiumTier === 2).size
		var tier3ServerCount: number = this.client.guilds.cache.filter((g) => g.premiumTier === 3).size
		var totalCategoryChannels: number = this.client.channels.cache.filter((ch) => ch.type === 'category').size
		var totalTextChannels: number = this.client.channels.cache.filter((ch) => ch.type === 'text').size
		var totalNSFWChannels: number = this.client.channels.cache.filter((ch) => (ch as Discord.TextChannel).nsfw).size
		var totalNewsChannels: number = this.client.channels.cache.filter((ch) => ch.type === 'news').size
		var totalVoiceChannels: number = this.client.channels.cache.filter((ch) => ch.type === 'voice').size
		var partneredServers: number = this.client.guilds.cache.filter((g) => g.partnered).size
		var verifiedServers: number = this.client.guilds.cache.filter((g) => g.verified).size

		let channelDate: moment.Moment = moment.utc(message.guild.me!.joinedAt);
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

		const embed: MessageEmbed = new MessageEmbed({
			color: message.guild.me!.displayColor,
			description: stripIndents`
			**${this.client.user!.username} Statistiken**\n
			*${description}`,
			fields: [
				{
					name: '⇒ Allgemein',
					value: stripIndents`
					• Beigetreten ${message.guild.name}: ${channelDate.format(`DD. [${channelMonthString}] YYYY [|] HH:mm:ss [UTC]`)}
					• Discord.js: v${Discord.version}
					• NodeJS: ${process.version/*@ts-ignore*/}
					• Prefix: ${this.client.guildsettings.get(message.guild, 'config.prefix', botConfig.botDefaultPrefix)}
					• Uptime: ${moment.duration(this.client.uptime!).humanize(true)}
					• RAM Nutzung: ${memUsed}MB genutzt/${memAlloc}MB zugewiesen (${memPercent}%)
					`,
					inline: true
				},
				{
					name: '<:empty:744513757962829845>',
					value: '<:empty:744513757962829845>',
					inline: true
				},
				{
					name: '<:empty:744513757962829845>',
					value: '<:empty:744513757962829845>',
					inline: true
				},
				{
					name: '⇒ Server Stats',
					value: stripIndents`
					• ${serverCount} Server Gesamt
					${boostedServerCount > 0 ? `${boostedServerCount > 1 ? `• ${boostedServerCount} geboostete Server` : `• ${boostedServerCount} geboosteter Server`}` : ''}${tier1ServerCount >= 1 ? `\n• ${tier1ServerCount} Tier 1 Server` : ''}${tier2ServerCount >= 1 ? `\n• ${tier2ServerCount} Tier 2 Server` : '' }${tier3ServerCount >= 1 ? `\n• ${tier3ServerCount} Tier 3 Server` : ''}
					${verifiedServers >= 1 ? `\n• ${verifiedServers} Verified Server` : ''}${partneredServers >= 1 ? `\n• ${partneredServers} Pertnered Servers` : ''}‚
					`,
					inline: true
				},
				{
					name: '⇒ Channel Stats',
					value: stripIndents`
					• ${channelCount} Channels Gesamt
					${totalCategoryChannels > 0 ? `${totalCategoryChannels > 1 ? `• ${totalCategoryChannels} Kategorien` : `• ${totalCategoryChannels} Kategorie`}` : ''}${totalTextChannels > 0 ? `\n• ${totalTextChannels} Text${totalNSFWChannels > 0 ? ` (${totalNSFWChannels} NSFW)` : ''}` : ''}${totalVoiceChannels > 0 ? `\n• ${totalVoiceChannels} Voice` : ''}${totalNewsChannels > 0 ? `\n• ${totalNewsChannels} News` : ''}
					`,
					inline: true
				},
				{
					name: '⇒ User Stats',
					value: stripIndents`
					${userCount >= 1 ? `• ${userCount} User Gesamt` : '• Keine User'}
					${botUserCount > 1 ? `• ${botUserCount} Bots` : `${botUserCount === 1 ? `• ${botUserCount} Bot` : '• Keine bots'}`}
					${humanUserCount > 1 ? `• ${humanUserCount} Menschen` : `${humanUserCount === 1 ? `• ${humanUserCount} Mensch` : '• Keine Menschen'}`}
					`,
					inline: true
				},
				{
					name: '⇒ Version',
					value: `[v${version}](https://github.com/datflowts/RadioRexfordBot 'view my GitHub Repository!')`,
					inline: true
				},
				{
					name: '<:empty:744513757962829845>',
					value: '<:empty:744513757962829845>',
					inline: true
				},
				{
					name: '<:empty:744513757962829845>',
					value: '<:empty:744513757962829845>',
					inline: true
				},
				{
					name: '⇒ Invite',
					value: `[Discord](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=0&scope=bot \'Invite me to your server!\')`,
					inline: true
				},
				{
					name: '⇒ Development server',
					value: '[Casual Coding Corner](https://discord.gg/GrmxKeZ \'This is my home!\')',
					inline: true
				},
				{
					name: '<:empty:744513757962829845>',
					value: '<:empty:744513757962829845>',
					inline: true
				}
			],
			thumbnail: {
				url: this.client.user!.displayAvatarURL()
			},
			footer: {
				text: `✧ © 2021 ${owner.tag} ✧`
			}
		})

		return message.util!.send(embed);
	}
}

var getUserCount = async function (client: AkairoClient) {
	var count: number;
	while (!client.shard || client.shard == null) {
		count = client.users.cache.size;
		return count;
	}
	var shardUsers = client.shard.fetchClientValues('users.cache.size').then(async (res) => {
		var c: number = await res.reduce((prev, val) => prev + val, 0);
		return c;
	}).catch(e => {
		if (e) return 0;
	});
	count = await shardUsers;
	return count;
}
var getHumanUserCount = async function (client: AkairoClient) {
	var count: number;
	while (!client.shard || client.shard == null) {
		count = client.users.cache.filter((u): boolean => !u.bot).size;
		return count;
	}
	var shardsUsers = await client.shard.broadcastEval('this.users.cache.filter((u)=>!u.bot).size');
	shardsUsers.forEach((u) => {
		count = + parseInt(u);
	});
	return count;
}
var getBotUserCount = async function (client: AkairoClient) {
	var count: number;
	while (!client.shard || client.shard == null) {
		count = client.users.cache.filter((u): boolean => u.bot).size;
		return count;
	}
	var shardsUsers = await client.shard.broadcastEval('this.users.cache.filter((u)=>u.bot).size');
	shardsUsers.forEach((u) => {
		count = + parseInt(u);
	});
	return count;
}
var getChannelCount = async function (client: AkairoClient) {
	var count: number;
	while (!client.shard || client.shard == null) {
		count = client.channels.cache.size;
		return count;
	}
	var shardChannels = client.shard.fetchClientValues('channels.cache.size').then(async (res) => {
		var c: number = await res.reduce((prev, val) => prev + val, 0);
		return c;
	}).catch(e => {
		if (e) return 0;
	});
	count = await shardChannels;
	return count;
}
var getServerCount = async function (client: AkairoClient) {
	var count: number;
	while (!client.shard || client.shard == null) {
		count = client.guilds.cache.size;
		return count;
	}
	var shardGuilds = client.shard.fetchClientValues('guilds.cache.size').then(async (res) => {
		var c: number = await res.reduce((prev, val) => prev + val, 0);
		return c;
	}).catch(e => {
		if (e) return 0;
	});
	count = await shardGuilds;
	return count;
}