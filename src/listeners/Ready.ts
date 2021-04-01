import { stripIndents } from 'common-tags';
import { AkairoClient, Listener } from 'discord-akairo';
import { MessageEmbed, Webhook, TextChannel, User } from 'discord.js';
import moment, { duration } from 'moment';
import ms from 'ms';
import BotClient from '../client/BotClient';
import botConfig from '../config/botConfig';
import fs from 'fs';
import 'moment-duration-format';

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
        setInterval(recordingReminder, 600000, client);

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

    let checkArr = checkString.split(",");

    var timestamp: number = parseInt(checkArr[0].replace(new RegExp('{"timestamp":'), ''));
    var channelID: string = checkArr[1].replace(new RegExp('"channelID":"'), '').replace(new RegExp('"}'), '');

    if (timestamp == 0) {
        // do simply nothing
        if (client.user.presence.status !== 'online') return defaultPresence(client);
        return
    } else {
        let channel: TextChannel = client.channels.cache.get(channelID) as TextChannel;
        let now: number = Date.now();

        var passedTime: number = now - timestamp;

        recordingPresence(client, passedTime);
    }
}

function defaultPresence (client: AkairoClient) {
    client.user.setPresence({
        activity: {
            type: 'LISTENING',
            name: `Radio Rexford [${botConfig.botDefaultPrefix}help]`
        },
        status: 'online',
        afk: false
    })
}

function recordingPresence (client: AkairoClient, passedTime: number) {
    client.user.setPresence({
        activity: {
            type: 'PLAYING',
            name: `Recording: ${moment.duration(passedTime).format('HH:mm:ss')}`
        },
        status: 'dnd',
        afk: true
    })
}

function timePassed (passedTime: number): number {
    if (passedTime >= 4800000) return 4
    if (passedTime >= 3600000) return 3
    if (passedTime >= 2700000) return 2
    if (passedTime >= 600000) return 1
    return 0
}

function recordingReminder (client: AkairoClient) {
    let checkString = fs.readFileSync(`${path}goTimestamp.json`, { encoding: 'utf-8' });

    let checkArr = checkString.split(",");

    var timestamp: number = parseInt(checkArr[0].replace(new RegExp('{"timestamp":'), ''));
    var channelID: string = checkArr[1].replace(new RegExp('"channelID":"'), '').replace(new RegExp('"}'), '');

    let channel: TextChannel = client.channels.cache.get(channelID) as TextChannel;
    let now: number = Date.now();

    var passedTime: number = timestamp >= now - 6000000 ? now - timestamp : 0;

    var reminder: string = 'null';

    switch (timePassed(passedTime)) {
        case 1:
            reminder = `**${moment.duration(passedTime).format('HH:mm:ss')}**`
            break;
        case 2:
            reminder = `*es wird langsam eng...*\n**${moment.duration(passedTime).format('HH:mm:ss')}**`
            break;
        case 3:
            reminder = `*jetzt ist es lang genug!*\n**${moment.duration(passedTime).format('HH:mm:ss')}**`
            break;
        case 4:
            reminder = `*heute wieder überlänge?*\n**${moment.duration(passedTime).format('HH:mm:ss')}**`
            break;
        default:
            break;
    }
    if (reminder !== 'null') {
        return channel.send(reminder);
    }
    return;
}