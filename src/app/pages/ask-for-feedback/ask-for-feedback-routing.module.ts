import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AskForFeedbackPage } from './ask-for-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: AskForFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskForFeedbackPageRoutingModule {}
