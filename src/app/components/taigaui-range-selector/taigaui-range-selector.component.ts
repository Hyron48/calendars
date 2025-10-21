import {Component, signal} from '@angular/core';
import {TaigauiPreSelectedPeriodComponent} from './taigaui-pre-selected-period/taigaui-pre-selected-period.component';
import {DateRange} from '../../models/date-range';
import {TuiRootModule} from '@taiga-ui/core';

@Component({
  selector: 'app-taigaui-range-selector',
  standalone: true,
  imports: [
    TaigauiPreSelectedPeriodComponent,
    TuiRootModule
  ],
  template: `
    <tui-root>
      <div class="d-flex">
        <div class="col-4 d-flex flex-column">
          <h4>Selettore range - singolo calendario</h4>
          <app-taigaui-pre-selected-period (changePeriodEmitter)="onChangePerSelectedPeriod($event)"/>
          @if (preSelectedPeriod()?.start || preSelectedPeriod()?.end) {
            <span class="mt-4">
            Valore selezionato:
              {{ preSelectedPeriod()?.start }} - {{ preSelectedPeriod()?.end }}
          </span>
          }
        </div>
      </div>
    </tui-root>
  `
})
export class TaigauiRangeSelectorComponent {
  public preSelectedPeriod = signal<DateRange | undefined>(undefined);

  public onChangePerSelectedPeriod(val: DateRange) {
    this.preSelectedPeriod.update(() => val);
  }
}
