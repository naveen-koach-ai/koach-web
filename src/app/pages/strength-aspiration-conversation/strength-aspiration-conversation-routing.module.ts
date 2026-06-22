import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StrengthAspirationConversationPage } from './strength-aspiration-conversation.page';

const routes: Routes = [
  {
    path: '',
    component: StrengthAspirationConversationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrengthAspirationConversationPageRoutingModule {}
