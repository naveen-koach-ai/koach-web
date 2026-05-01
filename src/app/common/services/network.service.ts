import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';
import { AlertTypeEnum } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class NetworkService implements OnDestroy {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', this.updateStatus.bind(this));
    window.addEventListener('offline', this.updateStatus.bind(this));
  }

  private updateStatus() {
    this.onlineStatus.next(navigator.onLine);
  }

  get isOnline$() {
    return this.onlineStatus.asObservable();
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.updateStatus.bind(this));
    window.removeEventListener('offline', this.updateStatus.bind(this));
  }
}
