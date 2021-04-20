import { Command, PrefixSupplier } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import moment from 'moment';

export default class HelpCommand extends Command {
    public constructor() {
        super('help', {
            aliases: ['help', 'commands', 'cmdlist'],
            description: {
                content: 'A list of available commands.',
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
        // ---------- MODS --------------------
        var isMod: boolean = message.member.hasPermission('MANAGE_MESSAGES');
        // ------------------------------------
        // ---------- DEVS --------------------
        var isDev: boolean = owners.includes(message.author.id);
        // ------------------------------------
        // ---------- GUILDOWNER --------------
        //var isOwner: boolean = guildOwner.id === message.author.id;



        const prefix = this.handler.prefix;
        var rnd = Math.floor(Math.random() * prefix.length);
        if (rnd === prefix.length) rnd = rnd - 1;
        if (!command) {
            const embed = new MessageEmbed()
                //@ts-ignore
                .setColor(message.member.displayColor)
                .setTitle('Command overview')
                .setDescription(stripIndents`A list of available commands.
                For mor information, type \`${prefix[rnd]}help <command>\`
            `);

            var cmdSize: number = 0;

            for (const category of this.handler.categories.values()) {
                var categoryName: string = category.id.replace(/(\b\w)/gi, (lc): string => lc.toUpperCase());

                var pubCats: string[] = ['Info', 'Util'];
                var modCats: string[] = ['Info', 'Util', 'Moderation'];

                var catSize: number;

                if(isMod && !isDev && modCats.includes(categoryName)) {
                    catSize = category.filter((cmd): boolean => cmd.aliases.length > 0).size
                    embed.addField(
                        `⇒ ${categoryName} (${catSize} commands)`,
                        `${category.filter((cmd): boolean => cmd.aliases.length > 0).map((cmd): string => `\`${cmd.aliases[0]}\``).join(' | ')}`
                    );
                    cmdSize += catSize;
                }else if (isDev && categoryName !== 'Default') {
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

            let now: moment.Moment = moment(Date.now());

            embed.setFooter(
                `${cmdSize} total commands ✧ requested by ${message.author.tag} ✧ ${now.format(`MM/DD/YYYY [|] HH:mm:ss`)}`,
                `${message.author.displayAvatarURL({ format: 'png', dynamic: true })}`
            )

            return message.util!.send(embed);
        }

        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setTitle(`\`${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}\``)
            .addField('⇒ Description', `${command.description.content ? command.description.content : ''} ${command.description.ownerOnly ? '\n**[DEVS ONLY]**' : ''}`);

        if (command.aliases.length > 1) embed.addField('⇒ Aliases', `\`${command.aliases.join('` `')}\``, true);
        if (command.description.examples && command.description.examples.length) embed.addField('⇒ Examples', `\`${command.aliases[0]} ${command.description.examples.join(`\`\n\`${command.aliases[0]} `)}\``, true);

        return message.util!.send(embed);
    }
}