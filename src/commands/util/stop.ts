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
				content: 'Beendet Erinnerung an vergangene Aufnahmezeit. Nur für den Radio Rexford HQ Server!\nDieser Befehl wurde ausschließlich für das Podcast-Team erstellt, damit sie die Zeit besser im Blick behalten können.',
				usages: 'stop',
			},
			ratelimit: 3,
		});
	}

	public async exec(message: Message) {

		const allowedGuilds: string[] = ["729745265430364210","606069531592491048"];
		try {
			if (!message.guild || !allowedGuilds.includes(message.guild!.id)) {
				return message.util!.reply(`Das ist hier nicht erlaubt!\nSchreibe \`${this.handler.prefix}help ${this.aliases[0]}\`, um mehr zu erfahren.`)
				.then(async m => {
					if (message.deletable) message.delete();
					return await m.delete({timeout: 10000});
				})
			}
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
		} catch (err) {
			if (err) return console.log(err.stack)
		}
	}
}