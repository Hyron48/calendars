import {Component, computed, inject, output, Signal, signal, WritableSignal} from '@angular/core';
import {DateRange} from '../../../models/date-range';
import {PaginatorModule} from 'primeng/paginator';
import {CalendarModule} from 'primeng/calendar';
import {DatePipe} from '@angular/common';
import {preselectedPeriods} from '../../../helpers/preselected-periods.helper';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@Component({
  selector: 'app-prime-overlay-panel-calendar',
  standalone: true,
  imports: [
    PaginatorModule,
    CalendarModule,
    DatePipe,
    OverlayPanelModule
  ],
  template: `
    <input class="w-100 max-w-300px me-1 p-inputtext"
           [ngModel]="parsedRange()"
           placeholder="Seleziona range"
           (click)="op.toggle($event)"
           readonly/>
    <p-overlayPanel #op>
      <h4>Preset</h4>
      @for (preselect of Object.values(preselectedPeriods); track $index) {
        @let preselectedPeriod = preselect();
        <button (click)="updatePeriod(preselectedPeriod.range)" class="btn btn-primary m-1">
          {{ preselectedPeriod.label }}
        </button>
      }
      <h4 class="mt-4">Periodo</h4>
      <div class="d-flex">
        @let startDate = rangeModel()[0] | date: 'dd.MM.yyyy';
        @let endDate = rangeModel()[1] | date: 'dd.MM.yyyy';
        <input class="col-6 me-1 p-inputtext"
               [ngModel]="startDate"
               placeholder="Data inizio"
               (click)="manageCalendarVisibility($event, 'start')"
               readonly/>
        <input class="col-6 ms-1 p-inputtext"
               [ngModel]="endDate"
               placeholder="Data fine"
               (click)="manageCalendarVisibility($event, 'end')"
               readonly/>
      </div>
      @if (calendarVisibility()) {
        <h6 class="mt-4">Seleziona data {{ calendarVisibility() === 'start' ? 'inizio' : 'fine' }}</h6>
        <p-calendar placeholder="Inserisci range"
                    class="d-block"
                    dateFormat="dd.mm.yy"
                    [inline]="true"
                    [maxDate]="calendarVisibility() === 'start' ? rangeModel()[1] : undefined"
                    [minDate]="calendarVisibility() === 'end' ? rangeModel()[0] : undefined"
                    [ngModel]="calendarVisibility() === 'start' ? rangeModel()[0] : rangeModel()[1]"
                    (ngModelChange)="updateRange($event, calendarVisibility() === 'start' ? 'start' : 'end')"
                    [showIcon]="true"
                    [iconDisplay]="'input'"/>
      }
    </p-overlayPanel>
  `
})
export class PrimeOverlayPanelCalendarComponent {
  private datePipe: DatePipe = inject(DatePipe);

  public changePeriodEmitter = output<DateRange>();
  public readonly preselectedPeriods = preselectedPeriods;
  public readonly Object = Object;

  public rangeModel: WritableSignal<Date[]> = signal(new Array(2));
  public calendarVisibility: WritableSignal<'start' | 'end' | undefined> = signal(undefined);
  public selectedRange: Signal<DateRange> = computed(() => ({
    start: this.datePipe.transform(this.rangeModel()[0], 'dd.MM.yyyy') ?? '',
    end: this.datePipe.transform(this.rangeModel()[1], 'dd.MM.yyyy') ?? ''
  }));
  public parsedRange: Signal<string> = computed(() =>
    (this.selectedRange()?.start || this.selectedRange()?.end) ? `${this.selectedRange()?.start} - ${this.selectedRange()?.end}` : 'Seleziona range'
  );

  public updatePeriod(range: Date[]) {
    this.rangeModel.update(() => range);
  }

  public updateRange(date: Date, type: 'start' | 'end') {
    if (type == 'start') {
      this.rangeModel.update((prev) => [date, prev?.[1]]);
    } else {
      this.rangeModel.update((prev) => [prev?.[0], date]);
    }
  }

  public manageCalendarVisibility(evt: MouseEvent, type: 'start' | 'end') {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.calendarVisibility() === type) {
      this.calendarVisibility.set(undefined);
    } else {
      this.calendarVisibility.set(type);
    }
  }

}
