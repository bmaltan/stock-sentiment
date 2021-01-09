import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {

    const axios = require('axios');

    try {
        const response = await axios.get('http://localhost:7071/api/fetchStockPrices?ticker=AAPL&date=2020-01-02')
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }

}
export default httpTrigger;