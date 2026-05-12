import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-personal-insights-interstitial',
  templateUrl: './personal-insights-interstitial.page.html',
  styleUrls: ['./personal-insights-interstitial.page.scss'],
  standalone: false,
})
export class PersonalInsightsInterstitialPage implements OnInit {

  @Input() passedData: any = {};

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

}
