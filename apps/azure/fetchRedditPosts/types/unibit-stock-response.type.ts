export interface MetaData {
    api_name: string;
    num_total_data_points: number;
    credit_cost: number;
    start_date: string;
    end_date: string;
}

export interface TickerStockData {
    date: string;
    volume: number;
    high: number;
    low: number;
    adj_close: number;
    close: number;
    open: number;
}

export interface ResultData {
    [ticker: string]: TickerStockData[];
}

export interface RootObject {
    meta_data: MetaData;
    result_data: ResultData;
}
