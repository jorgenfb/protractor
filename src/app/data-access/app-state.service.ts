import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { isNumeric } from "../utils/utils";

export interface Measurement {
  value: number;
  time: number;
}

export interface AppState {
  reference: number;
  hasReference: boolean;
  history: Measurement[];
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private _reference: WritableSignal<number | undefined> = signal(undefined);
  private _history: WritableSignal<Measurement[]> = signal([]);

  public reference: Signal<number | undefined> = this._reference.asReadonly();
  public history: Signal<Measurement[]> = this._history.asReadonly();

  constructor() {
    // Try read existing history from local storage
    try {
      const fromStorage = JSON.parse(
        localStorage.getItem('protractor-history') || ''
      );
      if (Array.isArray(fromStorage)) {
        this._history.set(fromStorage);
      }
    } catch (e) {}
  }

  setMeasurement(value: number) {
    if (!isNumeric(value)) {
      return;
    }

    const ref = this.reference();

    // On first call to setMeasurement, set the reference value
    if (ref === undefined) {
      this._reference.set(value);
      return;
    }

    // On any other call, add the measurement to the history
    this._history.set([
      {
        value: value - ref,
        time: Date.now(),
      },
      ...this.history(),
    ]);

    // Store the 10 latest measurements for later lookup
    try {
      localStorage.setItem(
        'protractor-history',
        JSON.stringify(this.history().slice(0, 10))
      );
    } catch (e) {}
  }

  setReference(n: number) {
    this._reference.set(n);
  }
}
