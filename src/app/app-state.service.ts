import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StateManager } from './state-manager';

export interface Measurement {
  value: number;
  time: number;
}

export interface AppState {
  reference: number;
  hasReference: boolean;
  history: Measurement[];
}

function isNumeric(n: any): n is number {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private measurements$ = new Subject<number>();

  public state$: StateManager<AppState>;

  constructor() {
    let initialHistory = [];

    try {
      const fromStorage = JSON.parse(
        localStorage.getItem('protractor-history') || ''
      );
      if (Array.isArray(fromStorage)) {
        initialHistory = fromStorage;
      }
    } catch (e) {}

    const initialState: AppState = {
      reference: 0,
      hasReference: false,
      history: initialHistory,
    };

    this.state$ = new StateManager(initialState);
  }

  setMeasurement(value: number) {
    if (!isNumeric(value)) {
      return;
    }

    const state = this.state$.value;
    let history = state.history;

    if (state.hasReference) {
      // add a new measurement
      history = [
        {
          value: value - state.reference,
          time: Date.now(),
        },
        ...history,
      ];

      // Store the 10 latest measurements for later lookup
      try {
        localStorage.setItem(
          'protractor-history',
          JSON.stringify(history.slice(0, 10))
        );
      } catch (e) {}
    }

    this.state$.apply({
      reference: value,
      hasReference: true,
      history,
    });

    this.measurements$.next(value);
  }
}
