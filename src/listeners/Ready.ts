import { stripIndents } from 'common-tags';
import { AkairoClient, Listener } from 'discord-akairo';
import { MessageEmbed, Webhook, TextChannel, User } from 'discord.js';
import moment from 'moment';
import ms from 'ms';
import BotClient from '../client/BotClient';
import botConfig from '../config/botConfig';
import fs from 'fs';

export default class ReadyListener extends Listener {
	public constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client',
		});
	}

	public exec(): void {
        const client: AkairoClient = this.client;
        setInterval(checkForRecordTimestamp, 30000, [client, botConfig.botDirectory]);
    }
}

async function checkForRecordTimestamp (client: AkairoClient, path: String) {
    let checkString = fs.readFile(`${path}goTimestamp.json`, function (err) {
        if(err) {
            return console.log(err.stack)
        }
    });

    let check: String = JSON.parse(JSON.stringify(checkString));

    if (check["timestamp"] == 0) {
        // do simply nothing
        if (client.user.presence.status !== 'online') return defaultPresence(client);
        return
    } else {
        var timestamp: number = check["timestamp"];
        var channelID: string = check["channelID"];

        let channel: TextChannel = client.channels.cache.get(channelID) as TextChannel;
        let now: number = Date.now();

        var passedTime: number = now - timestamp;

        recordingPresence(client, passedTime);

        switch (timePassed(passedTime)) {
            case 1:
                return channel.send(`**${ms(ms(passedTime, { long: true }))}**`)
            case 2:
                return channel.send(`*Es wird langsam eng...*\n**${ms(ms(passedTime, { long: true }))}**`)
            case 3:
                return channel.send(`*Jetzt ist es lang genug!*\n**${ms(ms(passedTime, { long: true }))}**`)
            case 4:
                return channel.send(`*Heute wieder überlänge?*\n**${ms(ms(passedTime, { long: true }))}**`)
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
            name: `Recording: ${ms(ms(passedTime))}`
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