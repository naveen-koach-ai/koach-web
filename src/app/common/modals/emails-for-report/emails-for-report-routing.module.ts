import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailsForReportPage } from './emails-for-report.page';

const routes: Routes = [
  {
    path: '',
    component: EmailsForReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailsForReportPageRoutingModule {}
