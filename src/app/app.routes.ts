import { Routes } from '@angular/router';
import { ElementsTableComponent } from './features/elements-table/pages/elements-table/elements-table.component';

export const routes: Routes = [
  { path: '**', component: ElementsTableComponent },
];
