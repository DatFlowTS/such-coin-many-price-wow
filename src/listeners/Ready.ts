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
        setInterval(checkForRecordTimestamp, 4567, client);
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
        return;
    } else {
        let channel: TextChannel = client.channels.cache.get(channelID) as TextChannel;
        let now: number = Date.now();

        var passedTime: number = now - timestamp;

        return recordingPresence(client, passedTime);
    }
}

function defaultPresence (client: AkairoClient) {
    return client.user.setPresence({
        activity: {
            type: 'LISTENING',
            name: `Radio Rexford [${botConfig.botDefaultPrefix}help]`
        },
        status: 'online',
        afk: false
    })
}

function recordingPresence (client: AkairoClient, passedTime: number) {
    return client.user.setPresence({
        activity: {
            type: 'PLAYING',
            name: `Recording: ${moment.duration(passedTime).format('hh:mm:ss')}`
        },
        status: 'dnd',
        afk: true
    })
}

function recordingReminder (client: AkairoClient) {
    const checkString = fs.readFileSync(`${path}goTimestamp.json`, { encoding: 'utf-8' });

    const checkArr = checkString.split(",");

    const timestamp: number = parseInt(checkArr[0].replace(new RegExp('{"timestamp":'), ''));
    const channelID: string = checkArr[1].replace(new RegExp('"channelID":"'), '').replace(new RegExp('"}'), '');

    const channel: TextChannel = client.channels.cache.get(channelID) as TextChannel;
    const now: number = Date.now();

    var passedTime: number = now - timestamp;

    var reminder: string = 'null';

    if (passedTime >= 6000000 && timestamp != 0) {
        const data = {
            "timestamp": 0,
            "channelID": "0"
        };
        const dataString: string = JSON.stringify(data);
	
        fs.writeFile(`${botConfig.botDirectory}goTimestamp.json`, dataString, 'utf8', function (err) {
            if(err) {
                return console.log(err.stack)
            }
        })
        passedTime = 0;
        reminder = "**Die Aufnahme wurde automatisch gestoppt!**";
    } else if (timestamp === 0) {
        return;
    } else {
        passedTime = now - timestamp;
        switch (timePassed(passedTime)) {
            case 1:
                reminder = `**${moment.duration(passedTime).format('HH[h] mm[m] ss[s]')}**`;
                break;
            case 2:
                reminder = `*es wird langsam eng...*\n**${moment.duration(passedTime).format('HH[h] mm[m] ss[s]')}**`;
                break;
            case 3:
                reminder = `*jetzt ist es lang genug!*\n**${moment.duration(passedTime).format('HH[h] mm[m] ss[s]')}**`;
                break;
            case 4:
                reminder = `*heute wieder überlänge?*\n**${moment.duration(passedTime).format('HH[h] mm[m] ss[s]')}**`;
                break;
            default:
                break;
        }
    }

    if (reminder !== 'null') {
        return channel.send(reminder);
    }
    return;
}

function timePassed (passedTime: number): number {
    if (passedTime >= 4800000) return 4
    if (passedTime >= 3600000) return 3
    if (passedTime >= 2700000) return 2
    if (passedTime >= 600000) return 1
    return 0
}
