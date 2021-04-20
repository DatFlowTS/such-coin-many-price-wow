import { stripIndents } from 'common-tags';
import { AkairoClient, Listener } from 'discord-akairo';
import { MessageEmbed, TextChannel, Message, Presence } from 'discord.js';
import moment from 'moment';
import request from 'request'
import botConfig from '../config/botConfig';
import fs from 'fs';
import 'moment-duration-format';

export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client',
		});
	}

	public async exec(): Promise<void> {
		const client = this.client;

		setInterval(switchPresence, 10000, client)

		console.log(stripIndents`
		${this.client.user.tag}
		A Discord Bot displaying DOGE Value in € and $ (switching every 10s) in status and also via command. Does have other features, too. Maybe.
		Copyright (C) 2021 DatFlow#0001
			
			Contact:
			info@datflow.de

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU Affero General Public License as published
		by the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU Affero General Public License for more details.

		You should have received a copy of the GNU Affero General Public License
		along with this program.  If not, see <https://www.gnu.org/licenses/>.
		`);
	}
}

async function switchPresence(client: AkairoClient) {
	//@ts-ignore
	let lastCurrency: string = client.settings.get('global', 'presence.currency.switch', '€');
	switch (lastCurrency) {
		case "€":
			lastCurrency = await dollarPresence(client);
			break;
		default:
			lastCurrency = await euroPresence(client);
			break;
	};
	//@ts-ignore
	client.settings.set('global', 'presence.currency.switch', lastCurrency);
}

async function euroPresence(client: AkairoClient): Promise<string> {
	let euroRate: string;

	request('https://api.binance.com/api/v3/ticker/price?symbol=DOGEEUR', async (err, res) => {
		if (err) return console.log(err.stack)
		euroRate = "€ " + res.body.split('price":"')[1].replace('"}', "")

		//@ts-ignore
		client.settings.set('global', 'lastrate.dogecoin.euro', parseFloat(euroRate.replace("€ ", "")));

		await client.user.setPresence({
			activity: {
				type: 'WATCHING',
				name: `Đ <-> ${euroRate}`
			},
			status: 'online',
			afk: false
		})
	})
	return "€";
}
async function dollarPresence(client: AkairoClient): Promise<string> {

	let dollarRate: string;

	request('https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT', async (err, res) => {
		if (err) return console.log(err.stack)
		dollarRate = "$ " + res.body.split('price":"')[1].replace('"}', "")

		//@ts-ignore
		client.settings.set('global', 'lastrate.dogecoin.dollar', parseFloat(dollarRate.replace("$ ", "")));

		await client.user.setPresence({
			activity: {
				type: 'WATCHING',
				name: `Đ <-> ${dollarRate}`
			},
			status: 'online',
			afk: false
		})
	})
	return "$";
}

async function listGuilds(client: AkairoClient): Promise<Message | void> {
	let now: moment.Moment = moment(Date.now());

	let guilds: string = stripIndents`
		\`\`\`HTML
		${fetchGuilds(client).toString()}
		\`\`\``

	let embed: MessageEmbed = new MessageEmbed({
		title: "✧ GUILDS LIST ✧",
		description: guilds,
		footer: {
			iconURL: client.user.avatarURL({ dynamic: true }),
			text: now.format(`MM/DD/YYYY [|] HH:mm:ss`)
		}
	})
	try {

	} catch (err) {
		if (err) return console.log(err)
	}
	let channel: TextChannel = await client.channels.fetch("831417911968399361", true, true) as TextChannel
	let msg: Message = await channel.messages.fetch("831418581475655700", true, true);
	let oldEmbeds = msg.embeds.filter(e => e.description !== embed.description)
	if (oldEmbeds.length > 0 || msg.embeds.length < 1) {
		return await msg.edit("", embed);
	}
}

function fetchGuilds(client: AkairoClient): string[] {

	let guilds: string[] = [];

	if (client.guilds.cache.size > 1) {
		let index: number = 0;
		client.guilds.cache.forEach(async (g) => {
			index++;
			guilds.push(`\n\n${index}. "${g.name}" [${g.id}] by ${g.owner.user.tag} [${g.owner.id}]`)
		})
	} else {
		guilds = ["none cached yet"]
	}

	return guilds;
}