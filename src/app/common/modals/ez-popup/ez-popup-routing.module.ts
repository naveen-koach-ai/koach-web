import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EzPopupPage } from './ez-popup.page';


const routes: Routes = [
  {
    path: '',
    component: EzPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EzPopupPageRoutingModule {}
