import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fs from 'fs';
import botConfig from '../../config/botConfig'

export default class GoCommand extends Command {
	public constructor() {
		super('go', {
			aliases: ['go', 'start', 'begin', 'record', 'rec'],
			category: 'Util',
			description: {
				content: 'Startet Erinnerung an vergangene Aufnahmezeit.',
				usages: 'go',
			},
			ratelimit: 3,
		});
	}

	public async exec(message: Message) {
		const timeStamp: number = message.createdTimestamp;
        const channelID: string = message.channel.id;

		const data = {
			"timestamp": timeStamp,
			"channelID": channelID
		};
		const dataString: string = JSON.stringify(data);

		fs.writeFile(`${botConfig.botDirectory}goTimestamp.json`, dataString, 'utf8', function (err) {
			if(err) {
				message.reply(`\`\`\`js\n${err.stack}\`\`\``)
				return console.log(err.stack)
			}
		})
	}
}
