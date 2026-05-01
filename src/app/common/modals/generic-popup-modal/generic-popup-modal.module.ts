import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericPopupModalPageRoutingModule } from './generic-popup-modal-routing.module';

import { GenericPopupModalPage } from './generic-popup-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenericPopupModalPageRoutingModule
  ],
  declarations: [GenericPopupModalPage]
})
export class GenericPopupModalPageModule {}
