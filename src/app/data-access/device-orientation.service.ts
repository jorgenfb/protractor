import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, filter, fromEvent, map } from 'rxjs';
import { isNumeric } from '../utils/utils';

export interface Orientation {
	alpha: number;
	beta: number;
	gamma: number;
}

@Injectable({
	providedIn: 'root',
})
export class DeviceOrientationService {
	get(): Observable<Orientation> {
		return fromEvent<DeviceOrientationEvent>(window, 'deviceorientation').pipe(
			filter((event) => isNumeric(event.alpha)),
			map((v) => v as Orientation),
		);
	}
}
