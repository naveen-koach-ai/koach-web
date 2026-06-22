import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportAndInsightsPage } from './report-and-insights.page';

const routes: Routes = [
  {
    path: '',
    component: ReportAndInsightsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportAndInsightsPageRoutingModule {}
