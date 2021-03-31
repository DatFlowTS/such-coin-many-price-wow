import { stripIndents } from 'common-tags';
import { AkairoClient, Listener } from 'discord-akairo';
import { MessageEmbed, Webhook, TextChannel, User } from 'discord.js';
import moment from 'moment';
import ms from 'ms';
import BotClient from '../client/BotClient';
import botConfig from '../config/botConfig';
import fs from 'fs';

const path: string = "/home/datflow/RadioRexfordBot/";

export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client',
		});
	}

	public exec(): void {
        const client = this.client;
        defaultPresence(client);
        setInterval(checkForRecordTimestamp, 30000, client);

        console.log(stripIndents`
		${this.client.user.tag} - An exclusive simple bot, related to the Radio Rexford Podcast.
		Copyright (C) 2021 DatFlow#0001
			
			Contact:
			datflow@radio-rexford.com
			<https://radio-rexford.com>

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

async function checkForRecordTimestamp (client: AkairoClient) {
    let checkString = fs.readFileSync(`${path}goTimestamp.json`, { encoding: 'utf-8' });

    console.log(checkString);

    let check = JSON.parse(JSON.stringify(checkString));

    if (check.timestamp == 0) {
        // do simply nothing
        if (client.user.presence.status !== 'online') return defaultPresence(client);
        return
    } else {
        var timestamp: number = check.timestamp;
        var channelID: string = check.channelID;

        let channel: TextChannel = client.channels.cache.get(channelID) as TextChannel;
        let now: number = Date.now();

        var passedTime: number = now - timestamp;

        recordingPresence(client, passedTime);

        switch (timePassed(passedTime)) {
            case 1:
                return channel.send(`**${moment.duration(passedTime).humanize(true)}**`)
            case 2:
                return channel.send(`*Es wird langsam eng...*\n**${moment.duration(passedTime).humanize(true)}**`)
            case 3:
                return channel.send(`*Jetzt ist es lang genug!*\n**${moment.duration(passedTime).humanize(true)}**`)
            case 4:
                return channel.send(`*Heute wieder überlänge?*\n**${moment.duration(passedTime).humanize(true)}**`)
            default:
                return;
        }
    }
}

function defaultPresence (client: AkairoClient) {
    client.user.setPresence({
        activity: {
            type: 'LISTENING',
            name: 'Radio Rexford'
        },
        status: 'online',
        afk: false
    })
}

function recordingPresence (client: AkairoClient, passedTime: number) {
    client.user.setPresence({
        activity: {
            type: 'CUSTOM_STATUS',
            name: `Recording: ${moment.duration(passedTime).humanize(true)}`
        },
        status: 'dnd',
        afk: true
    })
}

function timePassed (passedTime: number): number {
    if (passedTime >= 600000) return 1
    if (passedTime >= 2700000) return 2
    if (passedTime >= 3600000) return 3
    if (passedTime >= 4800000) return 4
    return 0
}