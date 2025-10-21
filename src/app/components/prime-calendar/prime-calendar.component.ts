import {Component, signal, ViewEncapsulation} from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule} from '@angular/forms';
import {PrimeNgInitialEndDateComponent} from './prime-ng-initial-end-date/prime-ng-initial-end-date.component';
import {DateRange} from '../../models/date-range';
import {
  PrimeNgDynamicCalendarViewComponent
} from './prime-ng-dynamic-calendar-view/prime-ng-dynamic-calendar-view.component';
import {PrimeNgModalComponent} from './prime-ng-modal/prime-ng-modal.component';
import {
  PrimeOverlayPanelCalendarComponent
} from './prime-overlay-panel-calendar/prime-overlay-panel-calendar.component';

@Component({
  selector: 'app-prime-calendar',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    PrimeNgInitialEndDateComponent,
    PrimeNgDynamicCalendarViewComponent,
    PrimeNgModalComponent,
    PrimeOverlayPanelCalendarComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="d-flex">
      <div class="col-4 d-flex flex-column">
        <h4>Selettore range - singolo calendario</h4>
        <app-prime-ng-dynamic-calendar-view [numberOfMonths]="1"
                                            (changePeriodEmitter)="onChangeSingleCalendarPeriod($event)"/>
        @if (singleCalendarPeriod()?.start || singleCalendarPeriod()?.end) {
          <span class="mt-4">
            Valore selezionato:
            {{ singleCalendarPeriod()?.start }} - {{ singleCalendarPeriod()?.end }}
          </span>
        }
      </div>
      <div class="col-4 d-flex flex-column">
        <h4>Selettore range - doppio calendario</h4>
        <app-prime-ng-dynamic-calendar-view [numberOfMonths]="2"
                                            (changePeriodEmitter)="onChangeDoubleCalendarPeriod($event)"/>
        @if (doubleCalendarPeriod()?.start || doubleCalendarPeriod()?.end) {
          <span class="mt-4">
            Valore selezionato:
            {{ doubleCalendarPeriod()?.start }} - {{ doubleCalendarPeriod()?.end }}
          </span>
        }
      </div>
      <div class="col-4 d-flex flex-column">
        <h4>Preset, data inizio e data fine</h4>
        <app-prime-ng-initial-end-date (changePeriodEmitter)="onChangeInitialEndDate($event)"/>
        @if (changeInitialEndDate()?.start || changeInitialEndDate()?.end) {
          <span class="mt-4">
            Valore selezionato:
            {{ changeInitialEndDate()?.start }} - {{ changeInitialEndDate()?.end }}
          </span>
        }
      </div>
    </div>
    <div class="d-flex my-4">
      <div class="col-4 d-flex flex-column">
        <h4>Modale</h4>
        <app-prime-ng-modal (changePeriodEmitter)="onModalRangePeriod($event)"/>
        @if (modalRangePeriod()?.start || modalRangePeriod()?.end) {
          <span class="mt-4">
            Valore selezionato:
            {{ modalRangePeriod()?.start }} - {{ modalRangePeriod()?.end }}
          </span>
        }
      </div>
      <div class="col-4 d-flex flex-column">
        <h4>Modale - calendario inline</h4>
        <app-prime-ng-modal [modalDatePickerInline]="true" (changePeriodEmitter)="onModalCalendarInlineRangePeriod($event)"/>
        @if (modalCalendarInlineRangePeriod()?.start || modalCalendarInlineRangePeriod()?.end) {
          <span class="mt-4">
            Valore selezionato:
            {{ modalCalendarInlineRangePeriod()?.start }} - {{ modalCalendarInlineRangePeriod()?.end }}
          </span>
        }
      </div>
      <div class="col-4 d-flex flex-column">
        <h4>OverlayPanel calendario inline</h4>
        <app-prime-overlay-panel-calendar (changePeriodEmitter)="onChangeOverlayPanelRangePeriod($event)"/>
        @if (overlayPanelRangePeriod()?.start || overlayPanelRangePeriod()?.end) {
          <span class="mt-4">
            Valore selezionato:
            {{ overlayPanelRangePeriod()?.start }} - {{ overlayPanelRangePeriod()?.end }}
          </span>
        }
      </div>
    </div>
  `,
  styles: `
    p-calendar > span,
    p-calendar > span > input {
      width: 100%;
    }
  `
})
export class PrimeCalendarComponent {
  public singleCalendarPeriod = signal<DateRange | undefined>(undefined);
  public doubleCalendarPeriod = signal<DateRange | undefined>(undefined);
  public changeInitialEndDate = signal<DateRange | undefined>(undefined);
  public modalRangePeriod = signal<DateRange | undefined>(undefined);
  public modalCalendarInlineRangePeriod = signal<DateRange | undefined>(undefined);
  public overlayPanelRangePeriod = signal<DateRange | undefined>(undefined);

  public onChangeSingleCalendarPeriod(val: DateRange) {
    this.singleCalendarPeriod.update(() => val);
  }

  public onChangeDoubleCalendarPeriod(val: DateRange) {
    this.doubleCalendarPeriod.update(() => val);
  }

  public onChangeInitialEndDate(val: DateRange) {
    this.changeInitialEndDate.update(() => val);
  }

  public onModalRangePeriod(val: DateRange) {
    this.modalRangePeriod.update(() => val);
  }

  public onModalCalendarInlineRangePeriod(val: DateRange) {
    this.modalCalendarInlineRangePeriod.update(() => val);
  }

  public onChangeOverlayPanelRangePeriod(val: DateRange) {
    this.overlayPanelRangePeriod.update(() => val);
  }
}
