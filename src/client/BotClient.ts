import {
	CommandHandler,
	ListenerHandler,
	AkairoClient,
} from 'discord-akairo';
import { join } from 'path';
import botConfig from '../config/botConfig';

declare module 'discord-akairo' {
	interface AkairoCLient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		config: BotOptions;
		ownerID: string[];
	}
}

interface BotOptions {
	token?: string;
	owners?: string[];
	botDir?: string;
}

export default class BotClient extends AkairoClient {
	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', 'commands'),
		prefix: botConfig.botDefaultPrefix,
		ignorePermissions: botConfig.botOwners,
		handleEdits: true,
		commandUtil: true,
		commandUtilLifetime: 3e5,
		defaultCooldown: 1e4,
		argumentDefaults: {
			prompt: {
				modifyStart: (_, str): string =>
					`${str}\n\n*Schreibe \`stop\` um abzubrechen...*`,
				modifyRetry: (_, str): string =>
					`${str}\n\n*Schreibe \`stop\` um abzubrechen...*`,
				timeout: 'Timeout. Hast dir zu viel Zeit gelassen...',
				ended:
					'Digger, wie oft noch?! Maximale Anzahl Versuche erreicht!',
				retries: 3,
				time: 3e4,
			},
			otherwise: '',
		},
	});

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
	});

	public constructor(config: BotOptions) {
		super({
			ownerID: config.owners,
			shards: 'auto',
			shardCount: 1
		});

		//@ts-ignore
		this.config = config;
	}
	
	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process: process,
		});

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
	}

	public async start(): Promise<string> {
		await this._init();
		//@ts-ignore
		return this.login(this.config.token);
	}
}