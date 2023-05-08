import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
} from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { AppStateService } from './data-access/app-state.service';
import { DeviceOrientationService } from './data-access/device-orientation.service';
import { CakeComponent } from './ui/cake.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HistoryComponent } from './ui/history.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    MatButtonModule,
    CakeComponent,
    HistoryComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  alpha: Signal<number | undefined>;
  diff: Signal<number | undefined>;
  actionText: Signal<string>;

  constructor(
    public state: AppStateService,
    private deviceMotionService: DeviceOrientationService
  ) {
    // Set the button action text based on the state
    this.actionText = computed(() =>
      this.state.reference() === undefined ? 'SET REFERENCE' : 'MEASURE'
    );

    this.alpha = toSignal(
      this.deviceMotionService.get().pipe(
        map((event) => event.alpha),
        filter((alpha): alpha is number => alpha !== null)
      )
    );

    this.diff = computed(() => {
      const ref = this.state.reference();
      const alpha = this.alpha();
      if (ref === undefined || alpha === undefined) {
        return undefined;
      }
      const diff = alpha - ref;

      // Normalize value to +/- 180 degrees
      return diff - 360 * Math.floor((diff + 180) / 360);
    });
  }

  onMeasureClick() {
    const angle = this.alpha();
    if (angle) {
      this.state.setMeasurement(angle);
    }
  }

  results = [
    { value: 52, created: Date.now() },
    { value: -152, created: Date.now() },
    { value: 152, created: Date.now() },
  ];
}
