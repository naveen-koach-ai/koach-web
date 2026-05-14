import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { AlertTypeEnum, RegExPatterns } from '../constants/constants';
import { NetworkService } from './network.service';
import { GenericPopupModalPage } from '../modals/generic-popup-modal/generic-popup-modal.page';
import { PersonalInsightsInterstitialPage } from '../modals/personal-insights-interstitial/personal-insights-interstitial.page';


export interface ConfirmModalResponse {
  confirmed: boolean;
  route?: string;
}
export interface NavigationState {
  currentUrl: string;
  isModalOpen: boolean;
  isNavigating: boolean;
}
@Injectable({
  providedIn: 'root'
})


export class CommonService  {

  loading!: HTMLIonLoadingElement;
  toast!: HTMLIonToastElement;
  alert!: HTMLIonModalElement;
  private modalInstance: HTMLIonModalElement | null = null;
  private navigationSubscription: Subscription | null = null;
  passedData: any;
  extraData: any;
  flag: any;
  private isNavigating = new BehaviorSubject<boolean>(false);
  private isModalOpen = false;
  private navigationInProgress = false;
  alertShown: boolean = false;
  private isBackNavigation = false;

  public isSessionDeleted = new BehaviorSubject<boolean>(false);
  public sessionDeleted$ = this.isSessionDeleted.asObservable();

  selectedLang = new BehaviorSubject<string | null>(null);
  translateCount = new BehaviorSubject<number>(0);

  public alertButtonList: any[] = [{
    label: 'Okay',
    event: 'close-modal',
    shape: 'round',
    buttonCss: ['generic__button', 'btn-green'],
    icon: {}
  }];



  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly alertCtrl: AlertController,
    private readonly toastctrl: ToastController,
    private readonly navCtrl: NavController,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private networkService: NetworkService
  ) {}

  async showNoInternetAlert() {
    if (this.alertShown) {
      console.log("Aleady shown")
      return
    }
    console.log("showing")
    this.alert = await this.modalCtrl.create({
      component: GenericPopupModalPage,
      componentProps: {
        alertType: AlertTypeEnum.Error,
        image: '/assets/icons/error-types/error-icon.svg',
        title: `${"No Internet Connection"}`,
        message: `${"Please check your connection and try again."}`,
      },
      cssClass: 'popup-modal',
      backdropDismiss: false,
      keyboardClose: false,
    });
    this.alert.present();
    this.alertShown = true;
    this.networkService.isOnline$.subscribe(isOnline => {
      if (isOnline && this.alert) {
        console.log("closing")
        this.alert.dismiss();
        this.alertShown = false;
      }
    });
  }

  getIsBackNavigation(): boolean {
    return this.isBackNavigation;
  }

  resetBackNavigation(): void {
    this.isBackNavigation = false;
  }


  showLoader = async () => {
    this.loading = await this.loadingCtrl.create({
      // message: 'Please Wait...',
      keyboardClose: true,
      spinner: null,
      duration: 3000,
      cssClass: 'custom-lottie-loading'
    });

    this.addLottieToLoading();
    await this.loading.present();
  };

  addLottieToLoading(sourceUrl='') {
    const loadingWrapper = document.querySelector('.loading-wrapper.ion-overlay-wrapper');
    if (loadingWrapper) {
      // Create the dotlottie-player element
      const lottiePlayer = document.createElement('dotlottie-player');

      // Set attributes
      lottiePlayer.setAttribute('src', sourceUrl ? sourceUrl : '/assets/local/loader.json');
      lottiePlayer.setAttribute('background', 'transparent');
      lottiePlayer.setAttribute('speed', '1.5');
      lottiePlayer.setAttribute('loop', '');
      lottiePlayer.setAttribute('autoplay', '');

      // Set style
      lottiePlayer.style.width = sourceUrl ? '400px' : '250px';
      lottiePlayer.style.height = sourceUrl ? '400px' : '250px';

      // Clear existing content and append Lottie player
      loadingWrapper.innerHTML = '';
      loadingWrapper.appendChild(lottiePlayer);
    }
  }

  hideLoader = async () => {
    this.loadingCtrl
      .getTop()
      .then((v) => (v ? this.loadingCtrl.dismiss() : null));
  };

  showToast = async (message: string, color?: string, duration?: number) => {
    this.toast = await this.toastctrl.create({
      animated: true,
      message: message,
      duration: duration ?? 2000,
      color: color ?? 'dark',
      mode: 'ios',
    });
    await this.toast.present();
  };

  showAlert = async (alertType: AlertTypeEnum, title: string = '', message: string, buttonList: any[] = [], buttonWrapper?: string, durationTime?: number, userEmail?: string, password?: string) => {
    let data: any = {};

    switch (alertType) {
      case AlertTypeEnum.Error:
        this.alert = await this.modalCtrl.create({
          component: GenericPopupModalPage,
          componentProps: {
            alertType: AlertTypeEnum.Error,
            image: '/assets/icons/error-types/error-icon.svg',
            title: `${title}`,
            message: `${message}`,
            buttonList: buttonList,
            buttonWrapper: buttonWrapper
          },
          cssClass: 'popup-modal',
          backdropDismiss: false,
          keyboardClose: true,
        });

        this.alert.present();

        data = await this.alert.onWillDismiss();
        console.log('Click in service: ', data);
        break;

      case AlertTypeEnum.Warning:
        this.alert = await this.modalCtrl.create({
          component: GenericPopupModalPage,
          componentProps: {
            alertType: AlertTypeEnum.Warning,
            image: '/assets/icons/error-types/warning-icon.svg',
            title: `${title}`,
            message: `${message}`,
            buttonList: buttonList,
            buttonWrapper: buttonWrapper
          },
          cssClass: 'popup-modal',
          backdropDismiss: false,
          keyboardClose: true,
        });

        this.alert.present();

        data = await this.alert.onWillDismiss();
        console.log('Click in modal and logged in service: ', data);
        break;

      case AlertTypeEnum.Information:
        this.alert = await this.modalCtrl.create({
          component: GenericPopupModalPage,
          componentProps: {
            alertType: AlertTypeEnum.Information,
            image: '/assets/icons/error-types/information-icon.svg',
            title: `${title}`,
            message: `${message}`,
            buttonList: buttonList,
            buttonWrapper: buttonWrapper
          },
          cssClass: 'popup-modal',
          backdropDismiss: false,
          keyboardClose: true,
        });

        this.alert.present();

        data = await this.alert.onWillDismiss();
        console.log('Click in modal and logged in service: ', data);
        break;

      case AlertTypeEnum.Success:
        this.alert = await this.modalCtrl.create({
          component: GenericPopupModalPage,
          componentProps: {
            alertType: AlertTypeEnum.Success,
            image: '/assets/icons/error-types/success-icon.svg',
            title: `${title}`,
            message: `${message}`,
            buttonList: [],
            buttonWrapper: buttonWrapper,
            userEmail: userEmail,
            password: password
          },
          cssClass: this.isValidData(userEmail) && this.isValidData(password) ? 'user-detail-model' : 'popup-modal',
          backdropDismiss: false,
          keyboardClose: true,
        });

        this.alert.present();
        timer(durationTime ?? 1200).subscribe(() => {
          this.alert.dismiss()
        });

        break;

      default:
        break;
    }
  };

  validateEmail(email: string) {
    const emailRegex = RegExPatterns.EMAIL;

    if (!email) {
      return { isValid: false, message: 'Email is empty' };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }

    return { isValid: true, message: '' };
  }

  shuffleArray(array: any[]) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  public setData(data: any) {
    this.passedData = data;
  }

  public getData() {
    return this.passedData;
  }

  public setExtraData(exData: any, flag: any) {
    this.extraData = exData;
    this.flag = flag
  }

  public getExtraData() {
    let body = {
      data: this.extraData,
      flag: this.flag
    };
    return body;
  }

  public isValidData(dataToCheck: string | any[] | null | undefined): boolean {
    return dataToCheck !== undefined && dataToCheck !== null && dataToCheck !== '' && dataToCheck.length !== 0 && JSON.stringify(dataToCheck) !== "{}";
  }

  public isValidUUID(uuid: string): boolean {
    return this.isValidData(uuid?.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'));
  }

  generateUUID() {
    let uuidValue = "", count, randomValue;
    for (count = 0; count < 32; count++) {
      randomValue = Math.random() * 16 | 0;
      if (count == 8 || count == 12 || count == 16 || count == 20) {
        uuidValue += "-"
      }
      uuidValue += (count == 12 ? 4 : (count == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
    }
    return uuidValue;
  }

  navigateForward(path: string, options: any = {}) {
    this.navCtrl.navigateForward(path, options);
  }

  navigateBack(path: string, options: any = {}) {
    this.navCtrl.navigateBack(path, options);
  }

  navigateRoot(path: string, options: any = {}) {
    this.navCtrl.setDirection('root');
    this.navCtrl.navigateRoot(path, options);
  }

  async openConversationIntroModal(text: string, flag: string) {
    const modal = await this.modalCtrl.create({
      component: PersonalInsightsInterstitialPage,
      componentProps: { passedData: { text: text, flag: flag } },
    });

    modal.present();
  }
}
