import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../../models/periodic-element.model';
import { ElementsService } from '../../services/elements.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditElementDialogComponent } from '../../components/edit-element-dialog/edit-element-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-elements-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './elements-table.component.html',
  styleUrl: './elements-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementsTableComponent implements OnInit {
  private readonly elementsService = inject(ElementsService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  _isLoading: boolean = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(val: boolean) {
    this._isLoading = val;
    this.cdr.markForCheck();
  }

  displayedColumns: (keyof PeriodicElement)[] = [
    'position',
    'name',
    'weight',
    'symbol',
  ];
  elementsTable: PeriodicElement[] = [];
  filteredTable: PeriodicElement[] = [];
  filterControl = new FormControl<string>('');

  timeOut: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.isLoading = true;
    this.elementsService
      .getElements()
      .subscribe((elements: PeriodicElement[]) => {
        this.elementsTable = elements;
        this.filteredTable = elements;
        this.isLoading = false;
      });

    this.filterControl.valueChanges.subscribe(() => {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(() => {
        this.filterItems();
      }, 2000);
    });
  }

  filterItems(): void {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    const filterValue = this.filterControl.getRawValue()!.toLowerCase();
    this.filteredTable = this.elementsTable.filter(
      (element: PeriodicElement) => {
        return Object.values(element).some((val) =>
          val.toString().toLowerCase().includes(filterValue)
        );
      }
    );
    this.cdr.markForCheck();
  }

  onEditElement(element: PeriodicElement, key: keyof PeriodicElement): void {
    let dialogRef = this.dialog.open(EditElementDialogComponent, {
      data: { element: { ...element }, key },
    });

    dialogRef.afterClosed().subscribe((editedElement: PeriodicElement) => {
      if (editedElement && !isEqual(element, editedElement)) {
        this.isLoading = true;
        this.elementsService
          .editElement(element, editedElement)
          .subscribe((elements: PeriodicElement[]) => {
            this.elementsTable = elements;
            this.filteredTable = elements;
            this.filterControl.setValue('');
            this.isLoading = false;
          });
      }
    });
  }
}
