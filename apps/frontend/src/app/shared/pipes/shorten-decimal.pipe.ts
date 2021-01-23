import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortenDecimal' })
export class ShortenDecimalPipe implements PipeTransform {
    transform(value: string | number): string | number {
        if (typeof value === 'number') {
            return value.toString().length > 6 ? Math.round(value) : value;
        } else {
            return value?.includes('.') ? value.split('.')[0] : value;
        }
    }
}