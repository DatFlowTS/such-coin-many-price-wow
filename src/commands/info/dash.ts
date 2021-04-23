import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';
import request from 'request';

export default class DashInfoCommand extends Command {
    public constructor() {
        super('dash', {
            aliases: ['dash', 'dashkurs', 'dashinfo', 'dashrate', 'dashexchange'],
            description: {
                content: 'Shows actual rate of Dash.',
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

        let rate: number;
        let rates: string = "";

        //@ts-ignore
        let lastRate: number = this.client.settings.get('global', 'lastrate.dash.dollar', 0);

        let embedColor: number;

        //@ts-ignore
        this.client.settings.set('global', 'lastrate.dash.euro', 0);

        request('https://api.binance.com/api/v3/ticker/price?symbol=DASHUSDT', (err2, res2) => {
            if (err2) return message.reply('```js\n' + err2.stack + '\n```')
            var usd: string = res2.body.split('price":"')[1].replace('"}', "")
            rate = parseFloat(usd);
            //@ts-ignore
            this.client.settings.set('global', 'lastrate.dash.dollar', rate);
            rates += "$ " + usd;

            if (lastRate > rate) {
                embedColor = 0xD80000
            } else if (lastRate < rate) {
                embedColor = 0x00A835
            } else {
                embedColor = 0xE0FF00
            }

            const embed = new MessageEmbed()
                .setAuthor("Dash prices provided by Binance.com", this.client.user.displayAvatarURL({ dynamic: true }), "https://www.binance.com/en/register?ref=UKL9SBW0")
                .setColor(embedColor)
                .setDescription(stripIndents`
                    \`\`\`js
                    ${rates}
                    \`\`\``)
                .setFooter(`Checked at ${now.format(`MM/DD/YYYY [|] HH:mm:ss`)}`, message.guild.iconURL({ dynamic: true }))

            return message.util!.send(embed);
        })
    }
}