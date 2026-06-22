import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { timer } from 'rxjs';
import { AlertTypeEnum, EZ_POPUP_EVENTS, StatusCodes } from 'src/app/common/constants/constants';
import { EzPopupPage } from 'src/app/common/modals/ez-popup/ez-popup.page';
import { ApiService } from 'src/app/common/services/api.service';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-strength-aspiration-conversation',
  templateUrl: './strength-aspiration-conversation.page.html',
  styleUrls: ['./strength-aspiration-conversation.page.scss'],
  standalone: false,
})
export class StrengthAspirationConversationPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content!: IonContent;

  device_details: any = {};
  conversation: any = {};
  bot_conv_id: string | null = null;
  act_ses_uuid: string | null = null;

  title: string = '';
  listOfQuestions: any[] = [];
  currentQuestionIndex: number = 0;
  currentQuestionArray: any[] = [];
  question: any = {};

  disabledBtn: boolean = true;
  difficultyIncreaseFlag: boolean = false;
  selectedFlashcard: any = {};
  isFlashcardSelected: boolean = false;
  conv_info: any;
  responseArray: any[] = [];

  user: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private modalCtrl: ModalController,
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      this.conversation = this.router.getCurrentNavigation()?.extras?.state ?? {};
      this.title = this.conversation?.alt_name;
    });

    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.getQuestions();
  }

  getQuestions() {
    this.commonService.showLoader();

    const payload = {
      cur_uuid: this.conversation.cur_uuid,
      conv_uuid: this.conversation.conv_uuid,
      ses_uuid: this.conversation.ses_uuid,
      act_id: this.conversation.ms_id,
      act_ses_uuid: this.conversation.act_ses_uuid,
      exp: this.user.profile_details ? this.user.profile_details?.exp : this.user.exp,
    };

    this.apiService.getBulkQuestions(payload).then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        this.listOfQuestions = [...resp.data.questions];
        this.bot_conv_id = resp.data.bot_conv_id;
        this.act_ses_uuid = resp.data.act_ses_uuid;
        this.question = this.listOfQuestions[this.currentQuestionIndex];
        console.log('question', this.question);
        this.currentQuestionArray.push(this.question);
        this.patchingActSesUuidInSessionStorage();
      } else {
        this.commonService.showAlert(AlertTypeEnum.Error, '', resp.message, this.commonService.alertButtonList);
      }
    }).catch((error: any) => {
      this.commonService.showAlert(AlertTypeEnum.Error, '', error.message, this.commonService.alertButtonList);
    });
  }

  patchingActSesUuidInSessionStorage() {
    const themes = JSON.parse(sessionStorage.getItem('exploreData') || '[]');
    const updatedThemes = themes.map((theme: any) =>
      theme.conv_uuid === this.conversation.conv_uuid ? { ...theme, act_ses_uuid: this.act_ses_uuid } : theme
    );
    sessionStorage.setItem('exploreData', JSON.stringify(updatedThemes));
  }

  onFlashcardSelect(event: any) {
    this.disabledBtn = false;
    this.selectedFlashcard = event.selectedFlashcard;
    this.isFlashcardSelected = event.isFlashcardSelected;
    timer(350).subscribe(() => this.content.scrollToBottom(650));
  }

  onSubmit() {
    this.disabledBtn = true;
    const flascardPills = document.getElementById('flashcardPills');
    if (flascardPills) flascardPills.style.opacity = '0';

    const responsePayload = {
      cur_uuid: this.conversation.cur_uuid,
      ms_id: this.conversation.ms_id,
      q_uuid: this.question.q_uuid,
      conv_uuid: this.conversation.conv_uuid,
      opt_type_uuid: this.selectedFlashcard.fc_option_uuid,
      bot_conv_id: this.bot_conv_id,
    };
    this.responseArray.push(responsePayload);
    this.selectedFlashcard = {};

    if (this.question.flow === 'last_ques') {
      this.markBotConversationValid();
      return;
    }

    timer(750).subscribe(() => {
      this.currentQuestionIndex += 1;
      this.question = this.listOfQuestions[this.currentQuestionIndex];
      this.isFlashcardSelected = false;

      timer(250).subscribe(() => {
        if (flascardPills) flascardPills.style.opacity = '1';
        this.currentQuestionArray = [];
        this.currentQuestionArray.push(this.question);
      });
    });
  }

  markBotConversationValid() {
    const response = {
      responses: this.responseArray,
      act_ses_uuid: this.act_ses_uuid,
    };

    this.commonService.showLoader();
    this.apiService.submitBulkResponses(response).then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        this.commonService.openConversationIntroModal(this.conversation.after_text, 'after');
        timer(1500).subscribe(() => {
          this.getExploreThemes();
          this.commonService.navigateForward('report-and-insights', { state: this.conversation });
        });
      } else {
        this.commonService.showAlert(AlertTypeEnum.Error, '', resp.message, this.commonService.alertButtonList);
      }
    }).catch((error: any) => {
      this.commonService.showAlert(AlertTypeEnum.Error, '', error.message, this.commonService.alertButtonList);
    });
  }

  calculatePercentage() {
    return (this.currentQuestionIndex / this.listOfQuestions?.length) * 100;
  }

  async onBack() {
    const modal = await this.modalCtrl.create({
      component: EzPopupPage,
      cssClass: 'ez-popup-medium',
      keyboardClose: true,
      id: 'ez-popup',
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        textButtonContents: [{ content: 'Yes', event: EZ_POPUP_EVENTS.BACK }],
        buttonContents: [{ content: 'No', event: EZ_POPUP_EVENTS.CANCEL }],
        logo: '/assets/icons/png/direct-back-icon.png',
        titles: ['Going back will take you to the previous page.'],
        subTitles: ['You might have to redo some actions. Are you sure you want to go back?'],
      },
    });

    await modal.present();
    const { ...resp } = await modal.onDidDismiss();
    if (resp?.data?.event === EZ_POPUP_EVENTS.CANCEL) return;
    if (resp?.data?.event === EZ_POPUP_EVENTS.BACK) {
      this.commonService.navigateRoot('home');
    }
  }

  getExploreThemes() {
    this.apiService.getExploreThemes().then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        const conversations = resp.data?.conversations ?? [];
        const exploreData = conversations.filter(
          (c: any) => c.conv_name && !c.conv_name.includes('360')
        );
        sessionStorage.setItem('exploreData', JSON.stringify(exploreData));
        sessionStorage.setItem('reportTextArray', JSON.stringify(resp.data.report_text));
      } else {
        sessionStorage.removeItem('exploreData');
        sessionStorage.removeItem('reportTextArray');
      }
    }).catch(() => {
      sessionStorage.removeItem('exploreData');
      sessionStorage.removeItem('reportTextArray');
    });
  }
}