import { ShortenDecimalPipe } from './shorten-decimal.pipe';

describe('ShortenDecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenDecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
