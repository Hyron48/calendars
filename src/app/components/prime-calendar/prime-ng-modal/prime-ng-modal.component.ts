import {Component, computed, effect, inject, input, output, Signal, signal} from '@angular/core';
import {DateRange} from '../../../models/date-range';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PrimeNgModalFilterComponent} from './prime-ng-modal-filter/prime-ng-modal-filter.component';
import {filter, tap} from 'rxjs';
import {PrimeNgInlineModalComponent} from './prime-ng-inline-modal/prime-ng-inline-modal.component';
import {PaginatorModule} from 'primeng/paginator';

@Component({
  selector: 'app-prime-ng-modal',
  standalone: true,
  imports: [
    PaginatorModule
  ],
  template: `
    <input class="w-100 max-w-300px me-1 p-inputtext"
           [ngModel]="parsedRange()"
           placeholder="Seleziona range"
           (click)="openModal()"
           readonly/>
  `
})
export class PrimeNgModalComponent {
  private modalService: NgbModal = inject(NgbModal);
  public selectedRange = signal<DateRange>({start: '', end: ''});
  public modalDatePickerInline = input<boolean>(false);
  public parsedRange: Signal<string> = computed(() =>
    (this.selectedRange()?.start || this.selectedRange()?.end) ? `${this.selectedRange()?.start} - ${this.selectedRange()?.end}` : 'Seleziona range'
  );

  public changePeriodEmitter = output<DateRange>();

  constructor() {
    effect(() => this.changePeriodEmitter.emit(this.selectedRange()));
  }

  public openModal() {
    const modalRef = this.modalService.open(this.modalDatePickerInline() ? PrimeNgInlineModalComponent : PrimeNgModalFilterComponent, {
      centered: true,
      size: 'md',
      windowClass: 'custom-border-modal'
    });
    modalRef.closed.pipe(
      filter(res => !!res),
      tap((res) => this.selectedRange.update(() => res))
    ).subscribe();
  }
}
