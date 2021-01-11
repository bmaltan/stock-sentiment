import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as https from 'https';

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<any> {
    const tickers = req.query.tickers;
    const date = new Date(req.query.date);
    const adjustedDate = new Date(date.setDate(date.getDate() - 1))
        .toISOString()
        .substring(0, 10);

    return new Promise(async function (resolve, reject) {
        let stockDataString = '';

        https.get(
            `https://api.unibit.ai/v2/stock/historical?tickers=${tickers}&interval=1&startDate=${adjustedDate}&endDate=${adjustedDate}&selectedFields=all&accessKey=nAo_jAf1LvXfY8W0gVfLRe_QlWsOGvys`,
            (resp) => {
                let data = '';

                resp.on('data', (chunk) => {
                    stockDataString += chunk;
                });

                resp.on('end', () => {
                    console.log(JSON.parse(data).explanation);
                });

                resp.on('error', (err) => {
                    console.log('Error: ' + err.message);
                    reject(err);
                });

                const stockData = JSON.parse(stockDataString);

                resolve({ body: stockData.result_data });
            }
        );
    });
};

export default httpTrigger;
