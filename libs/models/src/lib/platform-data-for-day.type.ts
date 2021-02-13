import type { Stock, StockShort } from './stock.type';

export interface PlatformDataForDay {
    topStocks: Stock[];
}

export interface PlatformDataForDayShort {
    topStocks: StockShort[];
}
