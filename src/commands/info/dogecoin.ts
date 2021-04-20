import { Command, Argument } from 'discord-akairo';
import { Message, MessageEmbed, GuildMember } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';
import request from 'request';
import fs from 'fs';
import botConfig from '../../config/botConfig';

export default class DogeInfoCommand extends Command {
    public constructor() {
        super('dogecoin', {
            aliases: ['dogecoin', 'doge', 'kurs', 'dogeinfo', 'rate', 'exchange'],
            description: {
                content: 'Shows actual rate of Đogecoin.',
                usage: ''
            },
            category: 'Info',
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,

        });
    }

    public async exec(message: Message): Promise<void> {

        let now: moment.Moment = moment(Date.now());

        let euroRate: number;
        let dollarRate: number;
        let rates: string = "";

        //@ts-ignore
        let lastRateEUR: number = this.client.settings.get('global', 'lastrate.dogecoin.euro', 0);
        //@ts-ignore
        let lastRateDollar: number = this.client.settings.get('global', 'lastrate.dogecoin.dollar', 0);

        let embedColor: number;

        request('https://api.binance.com/api/v3/ticker/price?symbol=DOGEEUR', (err1, res1) => {
            if (err1) return message.reply('```js\n' + err1.stack + '\n```');
            var eur: string = res1.body.split('price":"')[1].replace('"}', "");
            rates += "€ " + eur;
            euroRate = parseFloat(eur);
            //@ts-ignore
            this.client.settings.set('global', 'lastrate.dogecoin.euro', euroRate);

            request('https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT', (err2, res2) => {
                if (err2) return message.reply('```js\n' + err2.stack + '\n```')
                var usd: string = res2.body.split('price":"')[1].replace('"}', "")
                dollarRate = parseFloat(usd); 
                //@ts-ignore
                this.client.settings.set('global', 'lastrate.dogecoin.dollar', dollarRate);
                rates += "\n$ " + usd;

                if (lastRateEUR > euroRate || lastRateDollar > dollarRate) {
                    embedColor = 0xD80000
                } else if (lastRateEUR < euroRate || lastRateDollar < dollarRate) {
                    embedColor = 0x00A835
                } else {
                    embedColor = 0xE0FF00
                }
        
                const embed = new MessageEmbed()
                .setAuthor("Đogecoin prices provided by Binance.com", this.client.user.displayAvatarURL({ dynamic: true }), "https://www.binance.com/en/register?ref=UKL9SBW0")
                .setColor(embedColor)
                .setDescription(stripIndents`
                    \`\`\`js
                    ${rates}
                    \`\`\``)
                .setFooter(`Checked at ${now.format(`MM/DD/YYYY [|] HH:mm:ss`)}`, message.guild.iconURL({ dynamic: true }))

            return message.util!.send(embed);
            })
        })
    }
}