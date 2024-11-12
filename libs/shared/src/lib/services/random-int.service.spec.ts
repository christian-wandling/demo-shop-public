import { RandomIntService } from './random-int.service';

describe('RandomIntService', () => {
  let service: RandomIntService;

  beforeEach(() => {
    service = new RandomIntService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a number within the specified range', () => {
    const min = 1;
    const max = 10;
    const result = service.getValue(max, min);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should work with only max parameter', () => {
    const max = 5;
    const result = service.getValue(max);

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(max);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should never return the same number twice in a row', () => {
    const max = 10;
    let lastValue: number = service.getValue(max);

    for (let i = 0; i < 20; i++) {
      const nextValue = service.getValue(max);
      expect(nextValue).not.toBe(lastValue);
      lastValue = nextValue;
    }
  });

  it('should handle min equal to max', () => {
    const min = 5;
    const max = 5;

    expect(() => service.getValue(max, min)).not.toThrow();
  });

  it('should handle negative numbers', () => {
    const min = -10;
    const max = -5;
    const result = service.getValue(max, min);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle min greater than max by swapping them', () => {
    const min = 10;
    const max = 5;
    const result = service.getValue(max, min);

    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThan(10);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle zero as min and max', () => {
    expect(() => service.getValue(0, 0)).not.toThrow();
  });

  it('should handle very large numbers', () => {
    const min = 1000000;
    const max = 1000100;
    const result = service.getValue(max, min);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
    expect(Number.isInteger(result)).toBe(true);
  });
});
