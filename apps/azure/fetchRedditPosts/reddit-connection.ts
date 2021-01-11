import * as Snoowrap from 'snoowrap';
import { FirebaseEnvironmentConfig } from './types/FirebaseEnvironmentConfig';

function getConfig(): FirebaseEnvironmentConfig {
    return {
        reddit: {
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD,
        },
    };
}

function getSnoowrapClient() {
    const { reddit: config } = getConfig();

    return new Snoowrap({
        userAgent: 'invest-bs-track:::functions:::api',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password,
    });
}

const instance = getSnoowrapClient();

export default instance;
