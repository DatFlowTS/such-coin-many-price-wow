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
            "https://i.imgflip.com/4vutfo.jpg",
			"https://tenor.com/view/hodl-braveheart-gif-10465865",
			"https://tenor.com/view/cat-gato-dogecoin-doge-hodl-gif-20856412",
			"https://tenor.com/view/dogecoin-doge-wallstreetbets-stonks-stocks-gif-20855962",
			"https://tenor.com/view/hodl-btc-bitcoin-crypto-gif-10571522",
			"https://tenor.com/view/hodl-hold-dfv-wsb-gif-20662588",
			"https://tenor.com/view/xdn-hodl-dgb-divi-gif-18010239",
			"https://tenor.com/view/hodl-hodler-bitcoin-btc-60k-gif-21012138",
			"https://tenor.com/view/bitcoin-btc-dinero-money-invest-gif-20854240",
			"https://tenor.com/view/hodl-crypto-cryply-bitcoin-cryptoworld-gif-14756123",
			"https://tenor.com/view/elon-musk-hodl-hold-digibyte-dgb-gif-19316228",
			"https://tenor.com/view/yes-yes-yes-hodl-hodor-gif-11931825",
			"https://tenor.com/view/digibyte-dgb-hodl-crypto-cryptocurrency-gif-20300554",
			"https://tenor.com/view/hodl-cryptocurrency-blockchain-gif-10784431"
		];
		let rnd = Math.floor(Math.random() * replies.length) - 1;
		if (
			message.content
				.replaceAll("!", "")
				.replaceAll("?", "")
				.replaceAll(".", "")
				.replaceAll(",", "")
				.replaceAll("-", "")
				.replaceAll("_", "")
				.replaceAll("(", "")
				.replaceAll(")", "")
				.split(' ')
				.some((word) => list.includes(word.toLowerCase()))
		)
			message.channel.send(replies[rnd]);
	},
};
