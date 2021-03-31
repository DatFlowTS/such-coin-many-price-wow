import { describe, Type } from '@mrboolean/envconfig';

type BotConfig = {
    clientId: string;
    clientSecret: string;
    botToken: string;
    botOwners: string;
    botDefaultPrefix: string;
    botDirectory: string;
}

const botConfig = <BotConfig>describe({
    clientId: {
        name: "BOT_CLIENT_ID",
        type: Type.STRING,
        isRequired: true
    },
    clientSecret: {
        name: "BOT_CLIENT_SECRET",
        type: Type.STRING,
        isRequired: true
    },
    botToken: {
        name: "BOT_TOKEN",
        type: Type.STRING,
        isRequired: true
    },
    botOwners: {
        name: "BOT_OWNER",
        type: Type.STRING,
        isRequired: true
    },
    botDefaultPrefix: {
        name: "BOT_DEFAULT_PREFIX",
        type: Type.STRING,
        isRequired: true
    },
    botDirectory: {
        name: "BOT_DIRECTORY",
        type: Type.STRING,
        isRequired: true
    }
});

export default botConfig;