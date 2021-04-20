import { AkairoClient } from 'discord-akairo';
import { Message } from 'discord.js';

export default {
	check(client: AkairoClient, message: Message, list: string[]) {
		let replies = [
            "https://cdn.discordapp.com/attachments/521225137903894529/833745470475337779/reface-2021-04-19-06-18-56.gif", 
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAfYEQbSR6XxA6Pqy2KIenEmZibDcUyhOJqA&usqp=CAU",
            "https://i.kym-cdn.com/photos/images/facebook/002/078/089/99d.jpg",
            "https://i.redd.it/1vjxtr58c9h61.jpg",
            "https://www.memecreator.org/static/images/memes/5274930.jpg",
            "https://i.redd.it/16wprni3gjg61.jpg",
            "https://i.imgflip.com/4vutfo.jpg"
		];
		let rnd = Math.floor(Math.random() * replies.length) - 1;
		if (
			message.content
				.split(' ')
				.some((word) => list.includes(word.toLowerCase()))
		)
			message.reply(`${replies[rnd]}`);
	},
};
