import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { timer } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service';
import { CommonService } from 'src/app/common/services/common.service';
import { UserService } from 'src/app/common/services/user.service';
import { AlertTypeEnum, CONVERSATION_IDS, StatusCodes } from 'src/app/common/constants/constants';
import { PersonalInsightsInterstitialPage } from 'src/app/common/modals/personal-insights-interstitial/personal-insights-interstitial.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  user: any = {};
  device_details: any = {};
  personalMotivationObject: any = {};
  workPlaceObject: any = {};
  developmentDimensionsObject: any = {};
  reportTextArray: any[] = [];
  isFeedbackConversationAvailable: boolean = false;
  b2cCount: any;
  b2bCount: any;

  wizbotEyesAnimation: any = '1.3';
  wizbotScaling: any = 'scale';
  promptText: string = 'See how you place yourself on key development dimensions. This is your starting point — your own honest view of where you are today';

  calloutButton: any = {
    label: 'Start',
    shape: 'round',
    color: 'neon-blue',
    icon_name: 'arrow-forward-circle',
    icon_slot: 'end',
    icon_font: '',
  };

  exploreData: any[] = [];

  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private apiService: ApiService,
    private modalCtrl: ModalController
  ) { }
   ngOnInit() {
    this.isFeedbackConversationAvailable = this.userService.isFeedback360Available.getValue();    
  }

  async ionViewWillEnter() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.getExploreThemes();
  }

  goBack() {
    console.log('goBack');
  }

  goToConversation(conversation: any) {
    if (conversation.conv_uuid === CONVERSATION_IDS.Development_Dimensions) {
      if (conversation.conv_status === 'FN') {
        this.commonService.navigateForward('report-and-insights', { state: {...conversation, redirectedFrom: 'home'} });
        return;
      }
      else {
          this.commonService.openConversationIntroModal(conversation.before_text, 'before');

          timer(1000).subscribe(() => {
          this.commonService.navigateForward('pre-assessment', { state: conversation });
        });
        return;
        }
    }

    if (conversation.conv_status === 'FN') {
      this.commonService.navigateForward('report-and-insights', { state: {...conversation, redirectedFrom: 'home'} });
      return;
    }
    this.commonService.openConversationIntroModal(conversation.before_text, 'before');

    timer(1000).subscribe(() => {
      this.commonService.navigateForward('strength-aspiration-conversation', { state: {...conversation, redirectedFrom: 'home' } });
    });
  }

  goToPreAssessment() {
    this.commonService.navigateForward('ask-for-feedback', {state: {feedback: 'pre'}})
  }

  goToPostAssessment(){
    this.commonService.navigateForward('ask-for-feedback', {state: {feedback: 'post'}})

  }

  getExploreThemes() {
    this.apiService.getExploreThemes()
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          const removeId = '360';
          const conversations = resp.data.conversations;
          this.exploreData = conversations.filter((conversation: any) => conversation.conv_name && !conversation.conv_name.includes(removeId));

          window.sessionStorage.setItem('exploreData', JSON.stringify(this.exploreData));
          this.reportTextArray = resp.data.report_text;
          window.sessionStorage.setItem('reportTextArray', JSON.stringify(this.reportTextArray));
          this.personalMotivationObject = conversations.find((item: any) => item.alt_name === 'Personal Motivations');
          this.workPlaceObject = conversations.find((item: any) => item.alt_name === 'Work Place Preferences');
          this.developmentDimensionsObject = conversations.find((item: any) => item.alt_name === 'Development Dimensions');
        }
      })
      .catch(() => this.commonService.showAlert(AlertTypeEnum.Error, '', 'Error retrieving explore themes', this.commonService.alertButtonList));
  }
}
