import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DateRange} from '../../../../models/date-range';
import {preselectedPeriods} from '../../../../helpers/preselected-periods.helper';
import {DatePipe} from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-prime-ng-modal-filter',
  standalone: true,
  imports: [
    ButtonDirective,
    CalendarModule,
    FormsModule
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
        <p-calendar #doubleCalendarView
                    placeholder="Inserisci range"
                    class="d-block w-150px pe-1 col-6"
                    dateFormat="dd.mm.yy"
                    [maxDate]="rangeModel()[1]"
                    [ngModel]="rangeModel()[0]"
                    (ngModelChange)="updateRange($event, 'start')"
                    [showIcon]="true"
                    [iconDisplay]="'input'">
        </p-calendar>
        <p-calendar #doubleCalendarView
                    placeholder="Inserisci range"
                    class="d-block w-150px ps-1 col-6"
                    dateFormat="dd.mm.yy"
                    [minDate]="rangeModel()[0]"
                    [ngModel]="rangeModel()[1]"
                    (ngModelChange)="updateRange($event, 'end')"
                    [showIcon]="true"
                    [iconDisplay]="'input'">
        </p-calendar>
      </div>
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
export class PrimeNgModalFilterComponent {
  public activeModal: NgbActiveModal = inject(NgbActiveModal);
  private datePipe: DatePipe = inject(DatePipe);

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
}
