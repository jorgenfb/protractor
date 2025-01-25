import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

function isNumeric(n: any): n is number {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

@Component({
    selector: 'protractor-cake',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <svg
      class="indicator"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="60"
        cy="60"
        r="55"
        [attr.stroke-width]="strokeWidth"
        stroke="#ddd"
        fill="#eee"
      />
      <path
        [attr.d]="path"
        stroke="#000"
        fill="#ff4081"
        [attr.stroke-width]="strokeWidth"
        stroke-linecap="round"
      />
      <!--<rect x="40" y="70" width="40" height="20" rx="2" ry="2" fill="#888"/>-->
      <text
        *ngIf="showLabel && angle"
        x="60"
        y="80"
        stroke="#eee"
        fill="#000"
        stroke-width="1"
        text-anchor="middle"
        font-family="Verdana"
        font-size="12"
        style="paint-order: stroke;"
      >
        {{ (angle || 0).toFixed(0) }}°
      </text>
    </svg>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ]
})
export class CakeComponent implements OnChanges {
  @Input() angle: number | undefined | null;
  @Input() strokeWidth = 2;
  @Input() showLabel: boolean | undefined | null;

  path = '';

  static get RADIUS() {
    return 55;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['angle'] && isNumeric(this.angle)) {
      this.path = this.computePath(this.angle).trim();
    }
  }

  private computePath(angleInDegrees: number) {
    const angle = (angleInDegrees * Math.PI) / 180;

    const dx = CakeComponent.RADIUS * Math.sin(angle);
    const dy = CakeComponent.RADIUS - CakeComponent.RADIUS * Math.cos(angle);

    const sweepFlag = angle > 0 ? 1 : 0;
    const largeArc = Math.abs(angle) > Math.PI ? 1 : 0;

    return `
          M60 60
          L 60 5
          a 55 55 0 ${largeArc} ${sweepFlag} ${dx} ${dy}
          L 60 60
      `;
  }
}
