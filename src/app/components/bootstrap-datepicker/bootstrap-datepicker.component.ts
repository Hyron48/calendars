import {Component, inject, signal} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {
  BootstrapRangeSelectionPopupComponent
} from './bootstrap-range-selection-popup/bootstrap-range-selection-popup.component';
import {DateRange} from '../../models/date-range';

@Component({
  selector: 'app-bootstrap-datepicker',
  standalone: true,
  imports: [
    BootstrapRangeSelectionPopupComponent
  ],
  template: `
    <div class="d-flex">
      <div class="col-4 d-flex flex-column">
        <h4>Selettore range - popup</h4>
        <app-bootstrap-range-selection-popup (changePeriodEmitter)="onChangeRangeSelectionPopup($event)"/>
        @if (rangeSelectionPopup()?.start || rangeSelectionPopup()?.end) {
          <span class="mt-4">Valore selezionato:
            {{ rangeSelectionPopup()?.start }}- {{ rangeSelectionPopup()?.end }}
          </span>
        }
      </div>
    </div>
  `,
})
export class BootstrapDatepickerComponent {
  public rangeSelectionPopup = signal<DateRange | undefined>(undefined);

  public onChangeRangeSelectionPopup(val: DateRange) {
    this.rangeSelectionPopup.update(() => val);
  }
}
