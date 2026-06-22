import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { timer } from 'rxjs';
import { AlertTypeEnum, EZ_POPUP_EVENTS, StatusCodes } from 'src/app/common/constants/constants';
import { FlashcardsComponent } from 'src/app/common/components/flashcards/flashcards.component';
import { ProgressbarComponent } from 'src/app/common/components/progressbar/progressbar.component';
import { QuestionComponent } from 'src/app/common/components/question/question.component';
import { EzPopupPage } from 'src/app/common/modals/ez-popup/ez-popup.page';
import { ApiService } from 'src/app/common/services/api.service';
import { CommonService } from 'src/app/common/services/common.service';
import { RequestManagerService } from 'src/app/common/services/request-manager.service';
import { UserService } from 'src/app/common/services/user.service';
import { PageHeaderComponent } from 'src/app/common/components/page-header/page-header.component';
import preDefinedResponse from '../../../assets/local/pre-assessment-answers.json';

@Component({
  selector: 'app-pre-assessment',
  templateUrl: './pre-assessment.page.html',
  styleUrls: ['./pre-assessment.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, QuestionComponent, FlashcardsComponent, ProgressbarComponent, PageHeaderComponent],
})
export class PreAssessmentPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content!: IonContent;

  user: any = {};
  conv_info: any = {};
  listOfQuestions: any[] = [];
  question: any = {};
  responseArray: any[] = [];
  currentQuestionArray: any[] = [];
  currentQuestionIndex: number = 0;
  onSubmitDiv: boolean = false;
  disabledBtn: boolean | null = null;
  selectedFlashcard: any = {};
  isFlashcardSelected: boolean = false;
  isTesting: boolean = false;

  conversation: any = {
    conv_uuid: '60feca78-be99-41e9-a0c9-a9428a02ca09',
    cur_uuid: 'd1685b5b-ff55-4137-bf2a-5daf48717f5d',
    ms_id: 'OB-PR',
  };

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private router: Router,
    private requestManager: RequestManagerService,
    public commonService: CommonService,
    private apiService: ApiService,
  ) {}

  async ngOnInit() {
    this.isTesting = this.requestManager.isTesting;

    const navState = this.router.getCurrentNavigation()?.extras?.state;
    if (navState) {
      this.conversation = Object.keys(navState).length > 1
        ? navState
        : { ...this.conversation, ...navState };
    }

    this.userService.user.subscribe((resp: any) => {
      this.user = resp;
      this.initQuestionnaire(resp);
    });
  }

  initQuestionnaire(userData: any) {
    const exp = (userData?.exp || userData?.profile_details?.exp) ?? 0;
    this.commonService.showLoader();

    this.apiService.getPreAssessmentQuestions(exp).then(
      async (resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.conv_info = resp.data;
          this.listOfQuestions = this.sortByOrder(resp.data.questions);
          this.question = this.listOfQuestions[this.currentQuestionIndex];
          this.onSubmitDiv = true;
          this.disabledBtn = true;
        } else if (resp.code === StatusCodes.PK_NO_TEMPLATE) {
          this.commonService.showAlert(AlertTypeEnum.Information, '', resp.message, this.commonService.alertButtonList);
          this.commonService.navigateRoot('home');
        } else {
          this.commonService.showAlert(AlertTypeEnum.Warning, '', resp.message, this.commonService.alertButtonList);
          this.commonService.navigateRoot('home');
        }
      },
      (err: any) => {
        this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);
      }
    );
  }

  sortByOrder = (data: any[]) => data.sort((a, b) => a.q_order - b.q_order);

  markBotConversationValid() {
    this.commonService.showLoader();
    this.apiService.closePreAssessmentSession(this.responseArray).then(
      async (resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS || resp.code === StatusCodes.PK_NO_TEMPLATE) {
          this.commonService.openConversationIntroModal(this.conversation.after_text, 'after');
          this.commonService.navigateForward('report-and-insights', { state: this.conversation });
        } else {
          sessionStorage.setItem('preAssessmentResponse', JSON.stringify(this.responseArray));
          this.commonService.showAlert(AlertTypeEnum.Warning, '', resp.message, this.commonService.alertButtonList);
        }
      },
      (err: any) => {
        this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);
      }
    );
  }

  onFlashcardSelect(event: any) {
    this.disabledBtn = false;
    this.selectedFlashcard = event.selectedFlashcard;
    this.isFlashcardSelected = event.isFlashcardSelected;
    timer(350).subscribe(() => this.content.scrollToBottom(650));
  }

  onSubmit() {
    this.disabledBtn = true;

    const responsePayload = {
      q_uuid: this.question.q_uuid,
      opt_type_uuid: this.selectedFlashcard.fc_option_uuid,
      bot_conv_id: this.conv_info.bot_conv_id,
      is_correct: this.selectedFlashcard.is_crct_ans,
      coins_earned: Math.floor((this.selectedFlashcard.is_crct_ans / 100) * this.question.coins_earned),
      total_coins: this.question.coins_earned,
      conv_uuid: this.conv_info.conv_uuid,
      cur_uuid: this.conversation.cur_uuid,
    };
    this.responseArray.push(responsePayload);
    this.selectedFlashcard = {};
    this.content.scrollToTop(1500);

    if (this.question.flow === 'last_ques') {
      this.markBotConversationValid();
      return;
    }

    timer(750).subscribe(() => {
      this.currentQuestionIndex += 1;
      this.question = this.listOfQuestions[this.currentQuestionIndex];
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
        titles: ['Going back will take you to dashboard.'],
        subTitles: ['You might have to redo some actions. Are you sure you want to go back?'],
      },
    });

    await modal.present();
    const { ...resp } = await modal.onDidDismiss();
    if (resp?.data?.event === EZ_POPUP_EVENTS.CANCEL) return;
    if (resp?.data?.event === EZ_POPUP_EVENTS.BACK) {
      this.commonService.navigateRoot('home', { state: { cancelled: true } });
    }
  }

  skipPreAssessment() {
    if (this.isTesting) {
      this.commonService.showLoader();
      const jsonData = preDefinedResponse as any[];
      this.responseArray = jsonData.map((entry: any) => ({ ...entry, bot_conv_id: this.conv_info.bot_conv_id }));
      this.markBotConversationValid();
    }
  }
}
