import { BehaviorSubject } from 'rxjs';

export class StateManager<T> extends BehaviorSubject<T> {
  initialValue: T;

  constructor(initialValue: T) {
    super(initialValue);
    this.initialValue = initialValue;
  }

  /**
   * Apply a partial change to the state
   */
  public apply(changes: Partial<T>) {
    this.next({ ...this.value, ...changes });
  }

  public reset() {
    this.next(this.initialValue);
  }
}
