import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { EZ_POPUP_EVENTS } from '../../constants/constants';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-ez-popup',
  templateUrl: './ez-popup.page.html',
  styleUrls: ['./ez-popup.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class EzPopupPage implements OnInit {

  @Input() public buttonContents: Array<{ content: string, event: string }> = [];
  @Input() public textButtonContents: Array<{ content: string, event: string }> = [];
  @Input() public logo: string = '';
  @Input() public titles: Array<string> = [];
  @Input() public subTitles: Array<string> = [];
  @Input() public showInput: boolean = false;
  @Input() public input: { type: string, placeholder: string } = { type: 'text', placeholder: '' };
  @Input() public color: Array<string> = [];
  @Input() public bgClass: string = '';
  @Input() public appInfo: any = {};

  public errorMsg: string = '';
  public isValidInput: boolean = false;
  public userInput: string = '';
  appStoreUrl: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    if (this.appInfo?.platform === 'ios') {
      this.appStoreUrl = 'itms-apps://itunes.apple.com/app/id6444056193';
    } else {
      this.appStoreUrl = 'https://play.google.com/store/apps/details?id=com.koachup.app'
    }
  }

  async onClick(buttonEvent: string) {
    switch (buttonEvent) {
      case EZ_POPUP_EVENTS.NONE: break;
      case EZ_POPUP_EVENTS.CANCEL: this.close(buttonEvent); break;
      case EZ_POPUP_EVENTS.CLOSE_APP: this.close(buttonEvent); (navigator as any)['app']?.exitApp(); break;
      case EZ_POPUP_EVENTS.VALIDATE: this.validateInput(buttonEvent); break;
      default: this.close(buttonEvent); break;
    }
  }

  validateInput(event: string) {
    if (this.userInput.length <= 0) {
      this.isValidInput = true;
      this.errorMsg = 'Enter password';
      return;
    }
    if (!(this.userInput.trim().length > 0)) {
      this.isValidInput = true;
      this.errorMsg = 'Invalid password!';
      return;
    }
    this.close(event);
  }

  close(data: any) {
    this.modalCtrl.dismiss({ event: data, user_input: this.userInput });
    this.userInput = '';
  }
}
