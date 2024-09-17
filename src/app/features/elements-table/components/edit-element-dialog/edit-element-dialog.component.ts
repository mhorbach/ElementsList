import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../../models/periodic-element.model';

@Component({
  selector: 'app-edit-element-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
  ],
  templateUrl: './edit-element-dialog.component.html',
  styleUrl: './edit-element-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditElementDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { element: PeriodicElement; key: keyof PeriodicElement }
  ) {}

  getType(val: any): string {
    return typeof val;
  }
}
