import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';

export default class HelpCommand extends Command {
    public constructor() {
        super('help', {
            aliases: ['help', 'commands', 'cmdlist'],
            description: {
                content: 'Zeigt eine liste verfügbarer Befehle.',
                usage: '[command]'
            },
            category: 'Util',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 2,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias'
                }
            ]
        });
    }

    public async exec(message: Message, { command }: { command: Command }): Promise<Message | Message[]> {
        const guildOwner = await this.client.users.fetch(message.guild!.ownerID);
        //const authorMember = await message.guild!.members.fetch(message.author!.id);
        const owners: string[] = this.client.ownerID as string[];
        if (message.deletable && !message.deleted) message.delete();
        
        // ------------------------------------
        // ---------- DEVS --------------------
        var isDev: boolean = owners.includes(message.author.id);
        // ------------------------------------
        // ---------- GUILDOWNER --------------
        //var isOwner: boolean = guildOwner.id === message.author.id;



        const prefix = await (this.handler.prefix as PrefixSupplier)(message);
        var rnd = Math.floor(Math.random() * prefix.length);
        if (rnd === prefix.length) rnd = rnd - 1;
        if (!command) {
            const embed = new MessageEmbed()
                //@ts-ignore
                .setColor(message.member.displayColor)
                .setTitle('Befehlübersicht')
                .setDescription(stripIndents`Eine Liste verfügbarer Befehle.
                Für zusätzliche Infos, schreibe \`${prefix[rnd]}help <befehl>\`
            `);

            var cmdSize: number = 0;

            for (const category of this.handler.categories.values()) {
                var categoryName: string = category.id.replace(/(\b\w)/gi, (lc): string => lc.toUpperCase());

                var pubCats: string[] = ['Info', 'Util'];

                var catSize: number;

                if (isDev && categoryName !== 'Default') {
                    catSize = category.filter((cmd): boolean => cmd.aliases.length > 0).size
                    embed.addField(
                        `⇒ ${categoryName} (${catSize} commands)`,
                        `${category.filter((cmd): boolean => cmd.aliases.length > 0).map((cmd): string => `\`${cmd.aliases[0]}\``).join(' | ')}`
                    );
                    cmdSize += catSize;
                } else if (!isDev && pubCats.includes(categoryName)) {
                    catSize = category.filter((cmd): boolean => cmd.aliases.length > 0).size
                    embed.addField(
                        `⇒ ${categoryName} (${catSize} commands)`,
                        `${category.filter((cmd): boolean => cmd.aliases.length > 0).map((cmd): string => `\`${cmd.aliases[0]}\``).join(' | ')}`
                    );
                    cmdSize += catSize;
                }
            }

            let now: moment.Moment = moment.utc(Date.now());
            let Month: string = now.format('MMMM');
            let nowMonth: string;

            switch (Month.toLowerCase()) {
                case 'january':
                    nowMonth = 'Januar'
                case 'february':
                    nowMonth = 'Februar'
                case 'march':
                    nowMonth = 'März'
                case 'april':
                    nowMonth = 'April'
                case 'may':
                    nowMonth = 'Mai'
                case 'june':
                    nowMonth = 'Juni'
                case 'july':
                    nowMonth = 'Juli'
                case 'august':
                    nowMonth = 'August'
                case 'september':
                    nowMonth = 'September'
                case 'october':
                    nowMonth = 'Oktober'
                case 'november':
                    nowMonth = 'November'
                default:
                    nowMonth = 'Dezember'
            }

            embed.setFooter(
                `${cmdSize} befehle insgesamt ✧ angefragt von ${message.author.tag} ✧ ${now.format(`DD. [${nowMonth}] YYYY [|] HH:mm:ss [UTC]`)}`,
                `${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`
            )

            return message.util!.send(embed);
        }

        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
            .addField('⇒ Beschreibung', `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[Nur Entwickler]**' : ''}`);

        if (command.aliases.length > 1) embed.addField('⇒ Aliasse', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples && command.description.examples.length) embed.addField('⇒ Beispiele', `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``, true);

        return message.util!.send(embed);
    }
}