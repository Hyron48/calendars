import {Component, computed, effect, inject, output, Signal} from '@angular/core';
import {DateRange} from '../../../models/date-range';
import {TuiDayRangePeriod, TuiInputDateRangeModule} from '@taiga-ui/kit';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiDay, TuiDayRange} from '@taiga-ui/cdk';
import {preselectedPeriods} from '../../../helpers/preselected-periods.helper';
import {toSignal} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-taigaui-pre-selected-period',
  standalone: true,
  imports: [
    TuiInputDateRangeModule,
    ReactiveFormsModule
  ],
  template: `
    <tui-input-date-range
      class="b-form max-w-300px"
      [formControl]="control"
      [items]="preSelectedTaigaPeriods">
      Seleziona range
    </tui-input-date-range>
  `
})
export class TaigauiPreSelectedPeriodComponent {
  private datePipe: DatePipe = inject(DatePipe);

  public changePeriodEmitter = output<DateRange>();

  public control = new FormControl();
  public preSelectedTaigaPeriods: TuiDayRangePeriod[] = Object.values(preselectedPeriods).map(el => {
    const evaluatedElement = el();
    const startDate = new TuiDay(evaluatedElement.range[0].getFullYear(), evaluatedElement.range[0].getMonth(), evaluatedElement.range[0].getDate());
    const endDate = new TuiDay(evaluatedElement.range[1].getFullYear(), evaluatedElement.range[1].getMonth(), evaluatedElement.range[1].getDate());
    return new TuiDayRangePeriod(
      new TuiDayRange(startDate, endDate),
      evaluatedElement.label
    );
  });

  private taigaUIRangeSelected = toSignal(this.control.valueChanges);
  private selectedRange: Signal<DateRange> = computed(() => ({
    start: this.datePipe.transform(this.taigaUIRangeSelected()?.from.toLocalNativeDate(), 'dd.MM.yyyy') ?? '',
    end: this.datePipe.transform(this.taigaUIRangeSelected()?.to.toLocalNativeDate(), 'dd.MM.yyyy') ?? ''
  }));

  constructor() {
    effect(() => this.changePeriodEmitter.emit(this.selectedRange()));
  }
}
