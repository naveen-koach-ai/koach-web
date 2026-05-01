import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericPopupModalPage } from './generic-popup-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GenericPopupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericPopupModalPageRoutingModule {}
