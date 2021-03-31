import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fs from 'fs';
import botConfig from '../../config/botConfig'

export default class StopCommand extends Command {
	public constructor() {
		super('stop', {
			aliases: ['stop', 'ende', 'stopp', 'beenden', 'end'],
			category: 'Util',
			description: {
				content: 'Beendet Erinnerung an vergangene Aufnahmezeit.',
				usages: 'stop',
			},
			ratelimit: 3,
		});
	}

	public async exec(message: Message) {
		const timeStamp: number = 0;
        const channelID: string = "0";

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

		if (message.deletable) message.delete();
		return message.reply('Aufnahme gestoppt!')
	}
}