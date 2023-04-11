import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, fromEvent, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceOrientationService {
  private events = new Subject();

  constructor(private zone: NgZone) {}

  get(): Observable<DeviceOrientationEvent> {
    return fromEvent<DeviceOrientationEvent>(window, 'deviceorientation').pipe(
      tap(() => {
        this.zone.run(() => {});
      })
    );
  }
}
