import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EzPopupPageRoutingModule } from './ez-popup-routing.module';
import { EzPopupPage } from './ez-popup.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EzPopupPageRoutingModule,
    EzPopupPage
  ],
})
export class EzPopupPageModule {}
