import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportAndInsightsPageRoutingModule } from './report-and-insights-routing.module';

import { SharedModule } from '../../common/components/shared.module';
import { ReportAndInsightsPage } from './report-and-insights.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportAndInsightsPageRoutingModule,
    SharedModule
  ],
  declarations: [ReportAndInsightsPage]
})
export class ReportAndInsightsPageModule {}
