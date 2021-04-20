import {
	CommandHandler,
	ListenerHandler,
	AkairoClient,
} from 'discord-akairo';
import { join } from 'path';
import { Connection } from 'typeorm';
import Database from '../structures/Database';
import botConfig from '../config/botConfig';
import dbConfig from '../config/dbConfig';
import SettingsProvider from '../structures/SettingsProvider'
import { Settings } from '../models/Settings'

declare module 'discord-akairo' {
	interface AkairoCLient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		config: BotOptions;
		settings: SettingsProvider;
		ownerID: string[];
	}
}

interface BotOptions {
	token?: string;
	owners?: string[];
	botDir?: string;
}

export default class BotClient extends AkairoClient {
	public db!: Connection;

	public settings: SettingsProvider;

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
					`${str}\n\n*type \`cancel\` to cancel the command...*`,
				modifyRetry: (_, str): string =>
					`${str}\n\n*type \`cancel\` to cancel the command...*`,
				timeout: 'Timeout. You took too long...',
				ended:
					'Calm down! You reached the maximum amount of tries!',
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

		this.db = Database.get(dbConfig.databaseName);
		await this.db.connect();
		await this.db.synchronize();

		this.settings = new SettingsProvider(this.db.getRepository(Settings));
		await this.settings.init();
	}

	public async start(): Promise<string> {
		await this._init();
		//@ts-ignore
		return this.login(this.config.token);
	}
}