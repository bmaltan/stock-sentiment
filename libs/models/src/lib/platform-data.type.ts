import type { Stock } from './stock.type';

export interface PlatformData {
    [platformName: string]: {
        [date: string]: {
            topStocks: Stock[];
        };
    };
}
