import {Component, effect, inject, input, output, signal, Signal, viewChild, WritableSignal} from '@angular/core';
import {Calendar, CalendarModule} from 'primeng/calendar';
import {PrimeTemplate} from 'primeng/api';
import {preselectedPeriods} from '../../../helpers/preselected-periods.helper';
import {FormsModule} from '@angular/forms';
import {DateRange} from '../../../models/date-range';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-prime-ng-dynamic-calendar-view',
  standalone: true,
  imports: [
    CalendarModule,
    PrimeTemplate,
    FormsModule
  ],
  template: `
    <p-calendar #doubleCalendarView
                selectionMode="range"
                placeholder="Inserisci range"
                class="d-block max-w-300px"
                dateFormat="dd.mm.yy"
                [numberOfMonths]="numberOfMonths()"
                [ngModel]="doubleCalendarModel()"
                (ngModelChange)="updatePeriod($event, false)"
                [showIcon]="true"
                [iconDisplay]="'input'">
      <ng-template pTemplate="footer">
        @for (preselect of Object.values(preselectedPeriods); track $index) {
          @let preselectedPeriod = preselect();
          <button (click)="updatePeriod(preselectedPeriod.range, true)" class="btn btn-primary m-1">
            {{ preselectedPeriod.label }}
          </button>
        }
      </ng-template>
    </p-calendar>
  `
})
export class PrimeNgDynamicCalendarViewComponent {
  private datePipe: DatePipe = inject(DatePipe);

  public numberOfMonths = input<number>(1);
  public changePeriodEmitter = output<DateRange>();
  public doubleCalendarView: Signal<Calendar | undefined> = viewChild('doubleCalendarView');
  public readonly preselectedPeriods = preselectedPeriods;
  public readonly Object = Object;
  public doubleCalendarModel: WritableSignal<Date[]> = signal([]);

  constructor() {
    effect(() => {
      this.changePeriodEmitter.emit({
        start: this.datePipe.transform(this.doubleCalendarModel()[0], 'dd.MM.yyyy') ?? '',
        end: this.datePipe.transform(this.doubleCalendarModel()[1], 'dd.MM.yyyy') ?? ''
      });
    });
  }

  public updatePeriod(range: Date[], isPreset: boolean) {
    this.doubleCalendarModel.update(() => range);
    if (isPreset && this.doubleCalendarView()?.overlayVisible) {
      this.doubleCalendarView()!.overlayVisible = false;
    }
  }
}
