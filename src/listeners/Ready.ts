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

		setInterval(refreshOtherRates, 4567, client);
		setInterval(switchPresence, 10000, client);

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

async function refreshOtherRates(client: AkairoClient): Promise<void> {

	// BAT
	request('https://api.binance.com/api/v3/ticker/price?symbol=BATUSDT', (err, res) => {
		if (err) return console.log(err.stack)
		var usd: number = parseFloat(res.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.basicattentiontoken.dollar', usd);
		//@ts-ignore
		client.settings.set('global', 'lastrate.basicattentiontoken.euro', 0);
	})

	// BTC
	request('https://api.binance.com/api/v3/ticker/price?symbol=BTCEUR', (err1, res1) => {
		if (err1) return console.log(err1.stack);
		var eur: number = parseFloat(res1.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.bitcoin.euro', eur);

		request('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', (err2, res2) => {
			if (err2) return console.log('```js\n' + err2.stack + '\n```')
			var usd: number = parseFloat(res2.body.split('price":"')[1].replace('"}', ""));
			//@ts-ignore
			client.settings.set('global', 'lastrate.bitcoin.dollar', usd);
		})
	})

	// ADA
	request('https://api.binance.com/api/v3/ticker/price?symbol=ADAEUR', (err1, res1) => {
		if (err1) return console.log(err1.stack);
		var eur: number = parseFloat(res1.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.cardano.euro', eur);

		request('https://api.binance.com/api/v3/ticker/price?symbol=ADAUSDT', (err2, res2) => {
			if (err2) return console.log('```js\n' + err2.stack + '\n```')
			var usd: number = parseFloat(res2.body.split('price":"')[1].replace('"}', ""));
			//@ts-ignore
			client.settings.set('global', 'lastrate.cardano.dollar', usd);
		})
	})

	// DASH
	request('https://api.binance.com/api/v3/ticker/price?symbol=DASHUSDT', (err, res) => {
		if (err) return console.log(err.stack)
		var usd: number = parseFloat(res.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.dash.dollar', usd);
		//@ts-ignore
		client.settings.set('global', 'lastrate.dash.euro', 0);
	})

	// DGB
	request('https://api.binance.com/api/v3/ticker/price?symbol=DGBUSDT', (err, res) => {
		if (err) return console.log(err.stack)
		var usd: number = parseFloat(res.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.digibyte.dollar', usd);
		//@ts-ignore
		client.settings.set('global', 'lastrate.digibyte.euro', 0);
	})

	// ETH
	request('https://api.binance.com/api/v3/ticker/price?symbol=ETHEUR', (err1, res1) => {
		if (err1) return console.log(err1.stack);
		var eur: number = parseFloat(res1.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.ethereum.euro', eur);

		request('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT', (err2, res2) => {
			if (err2) return console.log('```js\n' + err2.stack + '\n```')
			var usd: number = parseFloat(res2.body.split('price":"')[1].replace('"}', ""));
			//@ts-ignore
			client.settings.set('global', 'lastrate.ethereum.dollar', usd);
		})
	})

	// TRX
	request('https://api.binance.com/api/v3/ticker/price?symbol=TRXUSDT', (err, res) => {
		if (err) return console.log(err.stack)
		var usd: number = parseFloat(res.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.tron.dollar', usd);
		//@ts-ignore
		client.settings.set('global', 'lastrate.tron.euro', 0);
	})

	// ZIL
	request('https://api.binance.com/api/v3/ticker/price?symbol=ZILUSDT', (err, res) => {
		if (err) return console.log(err.stack)
		var usd: number = parseFloat(res.body.split('price":"')[1].replace('"}', ""));
		//@ts-ignore
		client.settings.set('global', 'lastrate.zilliqa.dollar', usd);
		//@ts-ignore
		client.settings.set('global', 'lastrate.zilliqa.euro', 0);
	})
}