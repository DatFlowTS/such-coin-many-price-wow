import { Listener } from 'discord-akairo';
import { Message, TextChannel, User, GuildMember, MessageEmbed, MessageAttachment } from 'discord.js';
import moment from 'moment';
import hodlTrigger from "../structures/hodlTrigger"

export default class MessageListener extends Listener {
	public constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
			category: 'client',
		});
	}

	public async exec(msg: Message): Promise<any> {
        if (!msg.guild) return;
        if (msg.author.bot) return;

        const list: string[] = ["hodl", "h0dl", "hodl!", "h0dl!", "hold", "hold!"];

        hodlTrigger.check(this.client, msg, list);
	}
}