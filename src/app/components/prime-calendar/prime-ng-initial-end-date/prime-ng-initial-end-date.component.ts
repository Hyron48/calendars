import {Component, effect, inject, output, signal, untracked, ViewEncapsulation, WritableSignal} from '@angular/core';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {preselectedPeriods} from '../../../helpers/preselected-periods.helper';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {DateRange} from '../../../models/date-range';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-prime-ng-initial-end-date',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    CalendarModule
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="d-flex flex-wrap m-negative-2">
      <p-dropdown id="preselectPeriod"
                  emptyMessage="Nessun elemento trovato"
                  placeholder="Seleziona data"
                  optionLabel="label"
                  optionValue="key"
                  class="m-2"
                  [options]="getAllPeriods()"
                  [filter]="false"
                  [resetFilterOnHide]="true"
                  [ngModel]="dropdownValue"
                  (onChange)="changePeriod($event)">
      </p-dropdown>
      @if (isRangeVisible()) {
        <p-calendar #doubleCalendarView
                    placeholder="Data inzio"
                    class="d-block w-150px m-2"
                    dateFormat="dd.mm.yy"
                    [maxDate]="rangeModel()[1]"
                    [ngModel]="rangeModel()[0]"
                    (ngModelChange)="updateRange($event, 'start')"
                    [showIcon]="true"
                    [iconDisplay]="'input'">
        </p-calendar>
        <p-calendar #doubleCalendarView
                    placeholder="Data fine"
                    class="d-block w-150px m-2"
                    dateFormat="dd.mm.yy"
                    [minDate]="rangeModel()[0]"
                    [ngModel]="rangeModel()[1]"
                    (ngModelChange)="updateRange($event, 'end')"
                    [showIcon]="true"
                    [iconDisplay]="'input'">
        </p-calendar>
      }
    </div>
  `,
  styles: `
    p-dropdown div.p-dropdown-items-wrapper {
      max-height: none !important;
      & > ul {
        padding-left: 0;
        margin-bottom: 0;
      }
    }
  `
})
export class PrimeNgInitialEndDateComponent {
  private datePipe: DatePipe = inject(DatePipe);
  public changePeriodEmitter = output<DateRange>();
  public rangeModel: WritableSignal<Date[]> = signal(new Array(2));
  public isRangeVisible = signal(false);
  public dropdownValue = undefined;

  constructor() {
    effect(() => {
      this.changePeriodEmitter.emit({
        start: this.datePipe.transform(this.rangeModel()?.[0], 'dd.MM.yyyy') ?? '',
        end: this.datePipe.transform(this.rangeModel()?.[1], 'dd.MM.yyyy') ?? '',
      });
    });
  }

  public getAllPeriods(): { label: string, range: Date[] }[] {
    const periods = Object.values(preselectedPeriods).map(el => el());
    periods.push({label: 'Personalizzato', range: [], key: 'custom'});
    return periods;
  }

  public changePeriod(event: DropdownChangeEvent) {
    const value = event?.value ?? event;
    this.dropdownValue = value;
    if (value == 'custom') {
      this.isRangeVisible.set(true);
      this.rangeModel.update(() => []);
      return;
    }
    this.isRangeVisible.set(false);
    const range = preselectedPeriods[value]().range;
    this.rangeModel.update(() => [range[0], range[1]]);
  }

  public updateRange(date: Date, type: 'start' | 'end') {
    if (type == 'start') {
      this.rangeModel.update((prev) => [date, prev?.[1]]);
    } else {
      this.rangeModel.update((prev) => [prev?.[0], date]);
    }
  }
}
