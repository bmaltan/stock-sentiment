import { app } from 'firebase-admin';
import * as https from 'https';
import { RootObject } from './types/unibit-stock-response.type';

export async function getStockData(
    _tickers: string[],
    date: Date
): Promise<RootObject> {
    const adjustedDate = getApplicableDate(date);
    const tickers = _tickers.join(',');

    return new Promise(async function (resolve, reject) {
        let stockDataString = '';

        const url = 'https://api.unibit.ai/v2/stock/historical';
        const queryParams = {
            tickers,
            interval: 1,
            startDate: adjustedDate,
            endDate: adjustedDate,
            selectedFields: 'all',
            accessKey: process.env.UNIBIT_API_SECRET,
        };
        const query = Object.entries(queryParams)
            .map(([k, v]) => `${k}=${v}`)
            .join('&');

        https.get(`${url}?${query}`, (resp) => {
            resp.on('data', (chunk) => {
                stockDataString += chunk;
            });

            resp.on('end', () => {
                const stockData: RootObject = JSON.parse(stockDataString);
                resolve(stockData);
            });

            resp.on('error', (err) => {
                reject(err);
            });
        });
    });
}

function getApplicableDate(date: Date): string {
    let applicableDate = new Date(date.getTime());

    if (date.getDay() == 6 || date.getDay() == 0) {
        applicableDate = getLastFridayOf(date);
    } else if (applicableDate.getHours() < 4) {
        applicableDate.setDate(applicableDate.getDate() - 1);
    }

    return applicableDate.toISOString().substring(0, 10);
}

function getLastFridayOf(date: Date): Date {
    const d = new Date(date.getTime());

    const day = d.getDay();
    const diff = day <= 5 ? 7 - 5 + day : day - 5;

    d.setDate(d.getDate() - diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    return d;
}
