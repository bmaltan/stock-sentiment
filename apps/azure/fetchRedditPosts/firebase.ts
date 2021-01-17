// Import Admin SDK
import * as admin from 'firebase-admin';
import { Platform } from './types/platform.enum';
import { TickerData } from './types/ticker.type';

admin.initializeApp({
    credential: admin.credential.cert(
        __dirname + '/service_account_credentials.json'
    ),
    databaseURL:
        'https://bs-invest-track-default-rtdb.europe-west1.firebasedatabase.app',
});

export class FirebaseDatabase {
    tickerData: { [key: string]: TickerData };
    platform: string;
    day: string;

    constructor(name: string, platform: Platform, day: Date) {
        this.platform = this.getPlatformKey(name, platform);
        this.day = day.toISOString().substr(0, 10);
        this.tickerData = {};
    }

    getPlatformKey(name: string, platform: Platform): string {
        switch (platform) {
            case Platform.Reddit:
                return `r-${name}`;
            default:
                throw new Error('unsupported platform');
        }
    }

    addRedditData(tickerData: TickerData) {
        this.tickerData[tickerData.ticker] = tickerData;
    }

    addAllData(data: Record<string, TickerData>) {
        this.tickerData = data;
    }

    finalizeData() {
        return {
            url: `platforms/${this.platform}/${this.day}/topStocks`,
            data: this.tickerData,
        };
    }

    async saveData() {
        const { url, data } = this.finalizeData();

        const ref = this.getFirebaseDatabaseRef(url);
        await ref.set(JSON.parse(JSON.stringify(data)));
    }

    private getFirebaseDatabaseRef(url: string): admin.database.Reference {
        const db = admin.database();
        const ref = db.ref(url);
        return ref;
    }
}
