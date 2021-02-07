import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortenDecimal' })
export class ShortenDecimalPipe implements PipeTransform {
    transform(value: string | number): string | number {
        if (typeof value === 'number') {
            if (value % 1 === 0) {
                return value.toString() + '.00';
            } else if (value.toString().split('.')[1].length === 1) {
                return value.toString() + '0';
            }
            return value.toString().length > 6 ? Math.round(value) : value;
        } else {
            if (value?.indexOf('.') === 0) {
                return '0' + value.substring(0, 5);
            } else {
                return value?.includes('.') ? value.split('.')[0] : value;
            }
        }
    }
}