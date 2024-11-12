import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomIntService {
  private lastValue: number | undefined;

  private *generate(max: number, min = 0): Generator<number> {
    while (true) {
      yield Math.floor(Math.random() * (max - min) + min);
    }
  }

  getValue(max: number, min = 0): number {
    const value = this.generate(max, min).next().value;

    if (value === this.lastValue) {
      return this.getValue(min, max);
    }

    this.lastValue = value;
    return value;
  }
}
