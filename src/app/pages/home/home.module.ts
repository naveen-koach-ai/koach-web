import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { PersonalInsightsInterstitialPageModule } from 'src/app/common/modals/personal-insights-interstitial/personal-insights-interstitial.module';
import { WizbotProfileComponent } from "src/app/common/components/wizbot-profile/wizbot-profile.component";
import { CalloutComponent } from "src/app/common/components/callout/callout.component";
import { PageHeaderComponent } from "src/app/common/components/page-header/page-header.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PersonalInsightsInterstitialPageModule,
    WizbotProfileComponent,
    CalloutComponent,
    PageHeaderComponent
],
  declarations: [HomePage]
})
export class HomePageModule {}
