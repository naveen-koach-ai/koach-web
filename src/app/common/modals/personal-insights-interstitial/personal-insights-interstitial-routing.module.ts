import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalInsightsInterstitialPage } from './personal-insights-interstitial.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalInsightsInterstitialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalInsightsInterstitialPageRoutingModule {}
