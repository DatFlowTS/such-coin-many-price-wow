import { stripIndents } from 'common-tags';
import { AkairoClient, Listener } from 'discord-akairo';
import { MessageEmbed, TextChannel, Message, Presence } from 'discord.js';
import moment from 'moment';
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

	public async exec(): Promise<void> {
        const client = this.client;

        defaultPresence(client);

        setInterval(checkForRecordTimestamp, 4567);

        setInterval(recordingReminder, 600000, client);
        setInterval(listGuilds, 56789, client)

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

async function checkForRecordTimestamp (client: AkairoClient): Promise <Presence | void> {
    let checkString = fs.readFileSync(`${path}goTimestamp.json`, { encoding: 'utf-8' });

    let checkArr = checkString.split(",");

    var timestamp: number = parseInt(checkArr[0].replace(new RegExp('{"timestamp":'), ''));
    var channelID: string = checkArr[1].replace(new RegExp('"channelID":"'), '').replace(new RegExp('"}'), '');

    if (timestamp == 0) {
        // do simply nothing
        if (client.user.presence.status !== 'online') {
			return await defaultPresence(client);
		}
		return;
    } else {
        let now: number = Date.now();

        var passedTime: number = now - timestamp;

        return recordingPresence(client, passedTime);
    }
}

async function defaultPresence (client: AkairoClient): Promise<Presence> {
	return await client.user.setPresence({
        activity: {
            type: 'LISTENING',
            name: `Radio-Rexford.com [${botConfig.botDefaultPrefix}help]`
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

async function listGuilds ( client: AkairoClient ): Promise<Message | void> {
	let now: moment.Moment = moment(Date.now());
	let nowMonth: string = now.format('MMM');
	let nowMonthString: string;

	switch (nowMonth) {
		case 'Jan':
			nowMonthString = 'Januar'
			break;
		case 'Feb':
			nowMonthString = 'Februar'
			break;
		case 'Mar':
			nowMonthString = 'März'
			break;
		case 'Apr':
			nowMonthString = 'April'
			break;
		case 'May':
			nowMonthString = 'Mai'
			break;
		case 'Jun':
			nowMonthString = 'Juni'
			break;
		case 'Jul':
			nowMonthString = 'Juli'
			break;
		case 'Aug':
			nowMonthString = 'August'
			break;
		case 'Sep':
			nowMonthString = 'September'
			break;
		case 'Oct':
			nowMonthString = 'Oktober'
			break;
		case 'Nov':
			nowMonthString = 'November'
			break;
		case 'Dec':
			nowMonthString = 'Dezember'
			break;
		default:
			nowMonthString = nowMonth;
			break;
	}

	let guilds: string = stripIndents`
		\`\`\`HTML
		${fetchGuilds(client).toString()}
		\`\`\``
	
	let embed: MessageEmbed = new MessageEmbed({
		title: "✧ GUILDS LIST ✧",
		description: guilds,
		footer: {
			iconURL: client.user.avatarURL({ dynamic: true }),
			text: now.format(`DD. [${nowMonthString}] YYYY [|] HH:mm:ss`)
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

function fetchGuilds ( client: AkairoClient ): string[] {
	
	let guilds: string[] = [];

	if ( client.guilds.cache.size > 1 ) {
		let index: number = 0;
		client.guilds.cache.forEach( async (g) => {
			index++;
			guilds.push(`\n\n${index}. "${g.name}" [${g.id}] by ${g.owner.user.tag} [${g.owner.id}]`)
		})
	} else {
		guilds = ["none cached yet"]
	}

	return guilds;
}
