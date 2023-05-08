import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceOrientationService {
  get(): Observable<DeviceOrientationEvent> {
    return fromEvent<DeviceOrientationEvent>(window, 'deviceorientation');
  }
}
