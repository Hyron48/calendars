import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {DateRange} from '../../../../models/date-range';
import {preselectedPeriods} from '../../../../helpers/preselected-periods.helper';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-primeng-ng-inline-modal',
  standalone: true,
  imports: [
    ButtonDirective,
    CalendarModule,
    FormsModule,
    DatePipe
  ],
  template: `
    <div class="modal-header border-0">
      <div class="w-100 d-flex justify-content-between">
        <h3 class="mb-0">Seleziona periodo</h3>
        <button class="btn btn-primary" (click)="activeModal.close()">x</button>
      </div>
    </div>
    <div class="modal-body">
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
    </div>
    <div class="modal-footer">
      <button pButton type="button" [disabled]="!selectedRange().start || !selectedRange().end" (click)="save()"
              class="btn btn-primary base-p-button">
        Applica
      </button>
      <button pButton type="button" (click)="activeModal.close()"
              class="btn btn-danger p-button-danger base-p-button">
        Annulla
      </button>
    </div>
  `
})
export class PrimeNgInlineModalComponent {
  public activeModal: NgbActiveModal = inject(NgbActiveModal);
  private datePipe: DatePipe = inject(DatePipe);

  public calendarVisibility: WritableSignal<'start' | 'end' | undefined> = signal(undefined);

  public readonly preselectedPeriods = preselectedPeriods;
  public readonly Object = Object;
  public rangeModel: WritableSignal<Date[]> = signal(new Array(2));

  public selectedRange: Signal<DateRange> = computed(() => ({
    start: this.datePipe.transform(this.rangeModel()[0], 'dd.MM.yyyy') ?? '',
    end: this.datePipe.transform(this.rangeModel()[1], 'dd.MM.yyyy') ?? ''
  }));

  public updatePeriod(range: Date[]) {
    this.rangeModel.update(() => range);
  }

  public save() {
    if (this.selectedRange().start && this.selectedRange().end) {
      this.activeModal.close(this.selectedRange());
    }
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
