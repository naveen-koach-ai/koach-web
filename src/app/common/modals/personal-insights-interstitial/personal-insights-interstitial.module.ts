import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalInsightsInterstitialPageRoutingModule } from './personal-insights-interstitial-routing.module';

import { PersonalInsightsInterstitialPage } from './personal-insights-interstitial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalInsightsInterstitialPageRoutingModule
  ],
  declarations: [PersonalInsightsInterstitialPage]
})
export class PersonalInsightsInterstitialPageModule {}
