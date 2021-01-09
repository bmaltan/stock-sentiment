import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {

    const axios = require('axios');

    let stockData = '';

    const ticker = req.query.ticker;
    const date = new Date(req.query.date);
    const adjustedDate = new Date(date.setDate(date.getDate() - 1)).toISOString().substring(0, 10);

    try {
        const response = await axios.get(`https://api.unibit.ai/v2/stock/historical?tickers=${ticker}&interval=1&startDate=${adjustedDate}&endDate=${adjustedDate}&selectedFields=all&accessKey=Demo`);
        stockData = response.data.result_data
    } catch (error) {
        console.log(error.response.body);
    }

    return { body: { data: stockData } };
};

export default httpTrigger;