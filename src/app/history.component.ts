import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Measurement } from './app-state.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { CakeComponent } from './cake.component';

@Component({
  standalone: true,
  imports: [CommonModule, MatListModule, CakeComponent],
  selector: 'protractor-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-list *ngIf="(history?.length || 0) > 0">
      <ng-container *ngFor="let result of history; trackBy: trackByStamp">
        <mat-divider></mat-divider>
        <mat-list-item>
          <protractor-cake
            style="width:40px; height:40px"
            [angle]="result.value"
            [strokeWidth]="0"
            matListItemAvatar
          ></protractor-cake>
          <span matListItemTitle>{{ result.value.toFixed(1) }} °</span>
          <span matListItemLine>{{ result.time | date : 'mediumTime' }}</span>
        </mat-list-item>
      </ng-container>
    </mat-list>
  `,
})
export class HistoryComponent {
  @Input() history: Measurement[] | null | undefined;

  trackByStamp(index: number, item: Measurement) {
    return item.time;
  }
}
