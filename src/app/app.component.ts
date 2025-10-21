import {Component} from '@angular/core';
import {PrimeCalendarComponent} from './components/prime-calendar/prime-calendar.component';
import {CommonModule} from '@angular/common';
import {BootstrapDatepickerComponent} from './components/bootstrap-datepicker/bootstrap-datepicker.component';
import {TaigauiRangeSelectorComponent} from './components/taigaui-range-selector/taigaui-range-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PrimeCalendarComponent, BootstrapDatepickerComponent, TaigauiRangeSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
