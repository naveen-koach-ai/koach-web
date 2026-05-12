import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { AlertTypeEnum } from '../../constants/constants';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class PageHeaderComponent {
  @Input() platform: string = '';
  @Input() showBackButton: boolean = true;
  @Input() title: string = '';
  @Input() noBorder: boolean = false;
  @Output() backClick = new EventEmitter<void>();

  isMenuOpen = false;
  popoverEvent: Event | null = null;

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
  ) {}

  async openMenu(event: Event) {
    this.isMenuOpen = true;
    this.popoverEvent = event;
  }

  logout() {
    this.isMenuOpen = false;
    this.apiService.logout()
      .then(() => {
        sessionStorage.clear();
        this.commonService.navigateRoot('login');
      })
      .catch((err: any) => {
        this.commonService.showAlert(AlertTypeEnum.Error, '', err?.message || 'An error occurred while logging out. Please try again.', this.commonService.alertButtonList);
      });
  }
}
