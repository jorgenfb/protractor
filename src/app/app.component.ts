import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  Signal,
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

@Component({
  standalone: true,
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
  alpha: Signal<number | undefined>;
  diff: Signal<number | undefined>;

  constructor(
    public state: AppStateService,
    private deviceMotionService: DeviceOrientationService
  ) {
    this.alpha = toSignal(
      this.deviceMotionService.get().pipe(
        map((event) => event.alpha),
        filter((alpha): alpha is number => alpha !== null)
      )
    );

    // Take the first value and set is as the reference.
    this.deviceMotionService
      .get()
      .pipe(
        map((event) => event.alpha),
        filter(isNumeric),
        tap((alpha) => this.state.setMeasurement(alpha)),
        take(1),
        takeUntilDestroyed()
      )
      .subscribe();

    this.diff = computed(() => {
      const ref = this.state.reference();
      const alpha = this.alpha();
      if (ref === undefined || alpha === undefined) {
        return undefined;
      }
      return alpha - ref;
    });
  }

  onMeasureClick() {
    const angle = this.alpha();
    if (angle) {
      this.state.setMeasurement(angle);
    }
  }

  onResetClick() {
    const angle = this.alpha();
    if (angle) {
      this.state.setReference(angle);
    }
  }
}
