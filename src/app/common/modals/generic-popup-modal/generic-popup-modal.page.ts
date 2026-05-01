import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-generic-popup-modal',
  templateUrl: './generic-popup-modal.page.html',
  styleUrls: ['./generic-popup-modal.page.scss'],
  standalone: false,
})
export class GenericPopupModalPage implements OnInit {
  @Input() alertType: number | null = null;
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonList: any[] = [];
  @Input() buttonWrapper: string = 'flex-row';
  @Input() password: string = '';
  @Input() userEmail: string = '';

  // @Output() onClose = new EventEmitter<void>();

  constructor(
    private modalCtrl: ModalController,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    console.log(this.alertType);
  }

  onDismiss(buttonEvent: string) {
    this.modalCtrl.dismiss({ event: buttonEvent });
  }

  copyAll() {
    const accountDetails = `Email: ${this.userEmail}\nPassword: ${this.password}`;

    navigator.clipboard
      .writeText(accountDetails)
      .then(() => {
        this.commonService.showToast(
          'Account details copied to clipboard.',
          'success'
        );
        this.modalCtrl.dismiss();
      })
      .catch((err) => {
        console.error('Copy failed', err);
        this.commonService.showToast(
          'Failed to copy account details.',
          'error'
        );
        this.modalCtrl.dismiss();
      });
  }
}
