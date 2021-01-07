import * as Snoowrap from 'snoowrap';
import * as functions from 'firebase-functions';
import { FirebaseEnvironmentConfig } from '../types/FirebaseEnvironmentConfig';

function getSnoowrapClient() {
    const { reddit: config } = functions.config() as FirebaseEnvironmentConfig;

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
