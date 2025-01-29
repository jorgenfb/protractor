import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import { filter, map, take, tap } from 'rxjs/operators';
import { AppStateService } from './data-access/app-state.service';
import { DeviceOrientationService } from './data-access/device-orientation.service';
import { CakeComponent } from './ui/cake.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HistoryComponent } from './ui/history.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { isNumeric } from './utils/utils';
import { NormalizeAnglePipe } from './ui/normalize-angle.pipe';
import { Observable } from 'rxjs';

interface Orientation {
	alpha: number;
	beta: number;
	gamma: number;
}

@Component({
	selector: 'app-root',
	imports: [
		CommonModule,
		MatButtonModule,
		CakeComponent,
		HistoryComponent,
		NormalizeAnglePipe,
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	value: Signal<number | undefined>;
	diff: Signal<number | undefined>;

	constructor(
		public state: AppStateService,
		private deviceMotionService: DeviceOrientationService
	) {
		const eventAsSignal = toSignal(this.deviceMotionService.get());

		this.value = computed(() => {
			const event = eventAsSignal();
			return event ? event[this.state.axis()] : undefined;
		});

		this.diff = computed(() => {
			const ref = this.state.reference();
			const value = this.value();
			if (ref === undefined || value === undefined) {
				return undefined;
			}
			return value - ref;
		});

		// Initialize the first reference
		this.setNextValueAsReference();
	}

	onMeasureClick() {
		const angle = this.value();
		if (angle) {
			this.state.setMeasurement(angle);
		}
	}

	onResetClick() {
		const angle = this.value();
		if (angle) {
			this.state.setReference(angle);
		}
	}

	onToggleAxis() {
		this.state.setAxis(this.state.axis() === 'alpha' ? 'beta' : 'alpha');
	}

	private setNextValueAsReference() {
		// Take the first value and set is as the reference.
		this.deviceMotionService
			.get()
			.pipe(
				map((event) => event[this.state.axis()]),
				tap((value) => this.state.setMeasurement(value)),
				take(1),
				takeUntilDestroyed()
			)
			.subscribe();
	}
}
