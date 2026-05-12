import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailsForReportPageRoutingModule } from './emails-for-report-routing.module';

import { EmailsForReportPage } from './emails-for-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmailsForReportPageRoutingModule,
    EmailsForReportPage
  ],
})
export class EmailsForReportPageModule {}
