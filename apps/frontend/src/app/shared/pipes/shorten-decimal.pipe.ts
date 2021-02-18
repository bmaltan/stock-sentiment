import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortenDecimal' })
export class ShortenDecimalPipe implements PipeTransform {
    transform(value: number | string): string {

        if (typeof value === 'number') {
            return roundToTwoDecimals(value);
        } else {
            return roundToTwoDecimals(parseFloat(value));
        }

        function roundToTwoDecimals(value: number) {
            if (value > 0.01) {
                return value.toFixed(2);
            } else {
                return value.toFixed(4);
            }
        }
    }
}