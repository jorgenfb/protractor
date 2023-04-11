import { Component } from '@angular/core';
import { combineLatestWith, filter, map, tap } from 'rxjs/operators';
import { AppStateService, Measurement } from './data-access/app-state.service';
import { DeviceOrientationService } from './data-access/device-orientation.service';
import { Observable } from 'rxjs';
import { CakeComponent } from './ui/cake.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HistoryComponent } from './ui/history.component';

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
})
export class AppComponent {
  /* TODO: Remove this piece of state and use a stream of clicks$ to do actions when they occour */
  private currentValue!: number;

  public diff$!: Observable<number>;
  public history$!: Observable<Measurement[]>;
  public actionText$!: Observable<string>;

  constructor(
    private stateService: AppStateService,
    private deviceMotionService: DeviceOrientationService
  ) {}

  ngOnInit() {
    const alpha$: Observable<number> = this.deviceMotionService.get().pipe(
      map((event) => event.alpha as number),
      filter<number>((event) => event !== null),
      tap((value) => {
        this.currentValue = value as number;
      })
    );

    // Start listen for history items
    this.history$ = this.stateService.state$.pipe(
      map((state) => state.history)
    );

    this.diff$ = this.stateService.state$.pipe(
      filter((state) => state.hasReference),
      map((state) => state.reference),
      combineLatestWith(alpha$),
      map(([reference, alpha]) => {
        return alpha - reference;
      }),
      map((value) => {
        // Normalize value to +/- 180 degrees
        return value - 360 * Math.floor((value + 180) / 360);
      })
    );

    this.actionText$ = this.stateService.state$.pipe(
      map((state) => state.hasReference),
      map((hasRef) => {
        return hasRef ? 'MEASURE' : 'SET REFERENCE';
      })
    );
  }

  onMeasureClick() {
    this.stateService.setMeasurement(this.currentValue);
  }

  results = [
    { value: 52, created: Date.now() },
    { value: -152, created: Date.now() },
    { value: 152, created: Date.now() },
  ];
}
