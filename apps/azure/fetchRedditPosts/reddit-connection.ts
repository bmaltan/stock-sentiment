import * as Snoowrap from 'snoowrap';

function getSnoowrapClient() {
    return new Snoowrap({
        userAgent: 'invest-bs-track:::functions:::api',
        clientId: process.env.REDDIT_CLIENT_ID,
        clientSecret: process.env.REDDIT_CLIENT_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD,
    });
}

const instance = getSnoowrapClient();

export default instance;
