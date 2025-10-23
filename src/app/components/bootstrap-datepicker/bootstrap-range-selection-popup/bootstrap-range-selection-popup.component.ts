import {Component, effect, inject, output, signal} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {DateRange} from '../../../models/date-range';
import {DropdownChangeEvent, DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {preselectedPeriods} from '../../../helpers/preselected-periods.helper';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-bootstrap-range-selection-popup',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    DropdownModule,
    FormsModule
  ],
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
        <form class="d-flex">
          <div class="m-2">
            <div class="dp-hidden position-absolute">
              <div class="input-group">
                <input name="datepicker"
                       class="form-control"
                       ngbDatepicker
                       #datepicker="ngbDatepicker"
                       [autoClose]="'outside'"
                       (dateSelect)="onDateSelection($event)"
                       [displayMonths]="2"
                       [dayTemplate]="t"
                       outsideDays="hidden"
                       tabindex="-1"/>
                <ng-template #t let-date let-focused="focused">
              <span class="custom-day"
                    [class.focused]="focused"
                    [class.range]="isRange(date)"
                    [class.faded]="isHovered(date) || isInside(date)"
                    (mouseenter)="hoveredDate = date"
                    (mouseleave)="hoveredDate = null">
                {{ date.day }}
              </span>
                </ng-template>
              </div>
            </div>
            <div class="input-group h-100">
              <input #dpFromDate
                     class="form-control"
                     placeholder="Data inizio"
                     name="dpFromDate"
                     [value]="ngbDateParserFormatter.format(selectedRange().fromDate)"
                     (input)="selectedRange().fromDate = validateInput(selectedRange().fromDate, dpFromDate.value)"/>
              <button class="btn btn-outline-secondary bi bi-calendar3" (click)="datepicker.toggle()" type="button">
              </button>
            </div>
          </div>
          <div class="m-2">
            <div class="input-group h-100">
              <input #dpToDate
                     class="form-control"
                     placeholder="Data fine"
                     name="dpToDate"
                     [value]="ngbDateParserFormatter.format(selectedRange().toDate)"
                     (input)="selectedRange().toDate = validateInput(selectedRange().toDate, dpToDate.value)"/>
              <button class="btn btn-outline-secondary bi bi-calendar3" (click)="datepicker.toggle()" type="button">
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
  styles: `
    .dp-hidden {
      width: 0;
      margin: 0;
      border: none;
      padding: 0;
    }

    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }

    .custom-day.focused {
      background-color: #e6e6e6;
    }

    .custom-day.range,
    .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }

    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `,
})
export class BootstrapRangeSelectionPopupComponent {
  public ngbDateParserFormatter = inject(NgbDateParserFormatter);
  private ngbCalendar = inject(NgbCalendar);
  private datePipe: DatePipe = inject(DatePipe);

  public changePeriodEmitter = output<DateRange>();

  public isRangeVisible = signal(false);
  public dropdownValue = undefined;
  public hoveredDate: NgbDate | null = null;
  public selectedRange = signal<{ fromDate: NgbDate | null, toDate: NgbDate | null }>({
    fromDate: null,
    toDate: null
  });

  constructor() {
    effect(() => {
      this.changePeriodEmitter.emit({
        start: this.datePipe.transform(this.ngbDateParserFormatter.format(this.selectedRange()?.fromDate), 'dd.MM.yyyy') ?? '',
        end: this.datePipe.transform(this.ngbDateParserFormatter.format(this.selectedRange()?.toDate), 'dd.MM.yyyy') ?? '',
      });
    });
  }

  public onDateSelection(date: NgbDate) {
    const actualRange = this.selectedRange();
    if (!actualRange?.fromDate && !actualRange?.toDate) {
      this.selectedRange.update(() => ({
        fromDate: date,
        toDate: null
      }));
      return;
    }
    if (actualRange?.fromDate && !actualRange?.toDate && date && date.after(actualRange.fromDate)) {
      this.selectedRange.update(() => ({
        fromDate: actualRange.fromDate,
        toDate: date
      }));
      return;
    }
    this.selectedRange.update(() => ({
      fromDate: date,
      toDate: null
    }));
  }

  public isHovered(date: NgbDate) {
    return (
      this.selectedRange().fromDate && !this.selectedRange().toDate && this.hoveredDate && date.after(this.selectedRange().fromDate) && date.before(this.hoveredDate)
    );
  }

  public isInside(date: NgbDate) {
    return this.selectedRange().toDate && date.after(this.selectedRange().fromDate) && date.before(this.selectedRange().toDate);
  }

  public isRange(date: NgbDate) {
    return (
      date.equals(this.selectedRange().fromDate) ||
      (this.selectedRange().toDate && date.equals(this.selectedRange().toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  public validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.ngbDateParserFormatter.parse(input);
    return parsed && this.ngbCalendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
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
      this.selectedRange.update(() => ({fromDate: null, toDate: null}));
      return;
    }
    this.isRangeVisible.set(false);
    const range = preselectedPeriods[value]().range;
    const fromDate: NgbDate = new NgbDate(range[0].getFullYear(), range[0].getMonth() + 1, range[0].getDate());
    const toDate: NgbDate = new NgbDate(range[1].getFullYear(), range[1].getMonth() + 1, range[1].getDate());
    this.selectedRange.update(() => ({fromDate, toDate}));
  }
}
