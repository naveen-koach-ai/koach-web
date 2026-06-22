import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { timer } from 'rxjs';

import { isAfter, isValid, parseISO } from 'date-fns';

import { WizbotProfileComponent } from "src/app/common/components/wizbot-profile/wizbot-profile.component";
import { CalloutComponent } from "src/app/common/components/callout/callout.component";
import { ApiService } from 'src/app/common/services/api.service';
import { CommonService } from 'src/app/common/services/common.service';
import { UserService } from 'src/app/common/services/user.service';
import { SharedModule } from 'src/app/common/components/shared.module';
import { AlertTypeEnum, RegExPatterns, StatusCodes } from 'src/app/common/constants/constants';

interface FeedbackStatus {
  canGiveFeedback: boolean;
  reason?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, SharedModule, RouterModule, WizbotProfileComponent, CalloutComponent],
  selector: 'app-ask-for-feedback',
  templateUrl: './ask-for-feedback.page.html',
  styleUrls: ['./ask-for-feedback.page.scss'],
})
export class AskForFeedbackPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private commonService = inject(CommonService);
  private userService = inject(UserService);
  private apiService = inject(ApiService);

  device_details: any = {};
  conversation: any = {};
  segment: string = 'first';
  namesForFeedbackForm!: FormGroup;
  user: any = {};
  jwtObject: any = {};
  relationships: any[] = [];

  maxNumberOfPeopleForPREFeedback: number = 0;
  peopleForPREFeedback: any[] = [];
  numberOfPeopleGivenPREFeedback: any[] = [];

  maxNumberOfPeopleForPOSTFeedback: number = 0;
  peopleForPOSTFeedback: any[] = [];
  numberOfPeopleGivenPOSTFeedback: any[] = [];

  selfAssessmentObject: any = {};
  pre360Object: any = {};

  activeTab: string = 'Pre';
  isModalOpen: boolean = false;

  reasonForNotAllowingPostFeedback: string | null = null;

  private readonly MINIMUM_FEEDBACK_COUNT = 2;

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const feedbackType = this.router.getCurrentNavigation()?.extras?.state?.['feedback'];
      console.log('Received feedback type:', feedbackType);
      this.changeTab(feedbackType === 'post' ? 'Post' : 'Pre');
    });
  }

  ngOnInit() {
    this.getExploreData();

    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (this.commonService.isValidData(userData)) {
      this.user = userData;
      this._buildForm(userData);
    }

    this.jwtObject = this.userService.jwtValue.getValue();
  }

  getExploreData() {
    const data = JSON.parse(sessionStorage.getItem('exploreData') || '[]');
    if (this.commonService.isValidData(data)) {
      this.selfAssessmentObject = data.find((item: any) => item.alt_name === 'Development Dimensions');
      this.conversation = this.selfAssessmentObject;
      this.feedbackUsers();
    }
  }

  goBack() {
    this.commonService.navigateBack('home');
  }

  changeTab(tab: 'Pre' | 'Post') {
    if (tab === 'Pre') {
      this.activeTab = 'Pre';
      this.conversation = this.selfAssessmentObject;
    } else {
      this.activeTab = 'Post';
    }
  }
  async feedbackUsers() {
    this.apiService
      .getFeedbackUsers(this.conversation?.conv_type_id)
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.relationships = [...resp.data.relationship];

          this.maxNumberOfPeopleForPREFeedback = resp.data.fdbackLimit ?? 7;
          this.peopleForPREFeedback = [...resp.data.usersList].filter((fdback_user) => fdback_user.type === 'PRE');
          this.numberOfPeopleGivenPREFeedback = this.peopleForPREFeedback.filter((fdback) => fdback.fdback_status === 'Feedback Shared');

          this.maxNumberOfPeopleForPOSTFeedback = resp.data.fdbackLimit ?? 7;
          this.peopleForPOSTFeedback = [...resp.data.usersList].filter((fdback_user) => fdback_user.type === 'POST');
          this.numberOfPeopleGivenPOSTFeedback = this.peopleForPOSTFeedback.filter((fdback) => fdback.fdback_status === 'Feedback Shared');
        }
      })
      .catch((err) => {});
  }

  get people(): number[] {
    return Array(this.maxNumberOfPeopleForPREFeedback).fill(0);
  }

  get POSTpeople(): number[] {
    return Array(this.maxNumberOfPeopleForPOSTFeedback).fill(0);
  }

  getIconColor(index: number): string {
    switch (this.activeTab) {
      case 'Pre':
        if (index < this.numberOfPeopleGivenPREFeedback.length) {
          return 'neon-blue';
        } else if (index < this.peopleForPREFeedback.length) {
          return 'light';
        } else {
          return 'medium';
        }
      case 'Post':
        if (index < this.numberOfPeopleGivenPOSTFeedback.length) {
          return 'neon-blue';
        } else if (index < this.peopleForPOSTFeedback.length) {
          return 'light';
        } else {
          return 'medium';
        }
      default:
        return 'medium';
    }
  }

  isPostFeedbackAvailable() {
    return !!this.jwtObject.isPostFdback;
  }

  isFeedbackConversationAvailable() {
    return !!this.jwtObject.isFdbackConv;
  }


  checkPostFeedbackDate(): boolean {
    this.reasonForNotAllowingPostFeedback = this.checkPostFeedbackEligibility().reason ?? null;
    return this.checkPostFeedbackEligibility().canGiveFeedback;
  }

  checkPostFeedbackEligibility(): FeedbackStatus {
    try {
      if (this.numberOfPeopleGivenPREFeedback.length < this.MINIMUM_FEEDBACK_COUNT) {
        return {
          canGiveFeedback: false,
          reason: `This feature will be available after a certain date in the program and completion of at least 2 pre-program feedbacks.`,
        };
      }

      const startDate = parseISO(this.jwtObject.post360_st_date);
      if (!isValid(startDate)) {
        throw new Error('Invalid start date in JWT');
      }

      const currentDate = new Date();

      if (!isAfter(currentDate, startDate)) {
        return {
          canGiveFeedback: false,
          reason: `This feature will be available after a certain date in the program and completion of at least 2 pre-program feedbacks.`,
        };
      }

      return {
        canGiveFeedback: true,
      };
    } catch (error) {
      return {
        canGiveFeedback: false,
        reason: 'An error occurred while checking feedback eligibility.',
      };
    }
  }

  private _buildForm(user: any) {
    this.namesForFeedbackForm = this.formBuilder.group({
      fdback_provider_name: new FormControl(null, Validators.compose([Validators.required])),
      fdback_provider_email: new FormControl(null, Validators.compose([Validators.required, Validators.email, Validators.pattern(RegExPatterns.EMAIL)])),
      relationship: new FormControl(null, Validators.compose([Validators.required])),
      name: new FormControl(user.name ?? user.profile_details.name, Validators.compose([Validators.required])),
      experience: new FormControl(user.exp ?? user.profile_details.exp, Validators.compose([Validators.required])),
      act_id: new FormControl(this.conversation.conv_type_id, Validators.compose([Validators.required])),
      conv_name: new FormControl(this.conversation.alt_name, Validators.compose([Validators.required])),
      avatar: new FormControl(user.avatar ?? user.profile_details.avatar, Validators.compose([Validators.required])),
    });
  }

  goTo(flag: string) {
    if (flag === 'session') {
      this.commonService.openConversationIntroModal(this.conversation.before_text, 'before');

      timer(1000).subscribe(() => {
        this.commonService.navigateForward('pre-assessment', {
          state: {
            ...this.conversation,
            redirectedFrom: 'ask-for-feedback',
          },
        });
      });
    } else {
      if (this.conversation.conv_status !== 'FN') {
        this.isModalOpen = true;
        return;
      }

      this.commonService.navigateForward('personal-insight-report', {
        state:
          flag === 'reportConsolidated'
            ? {
                ...this.conversation,
                consolidated: true,
                type: this.activeTab,
                redirectedFrom: 'ask-for-feedback',
              }
            : {
                ...this.conversation,
                type: this.activeTab,
                redirectedFrom: 'ask-for-feedback',
              },
      });
    }
  }

  goToSelf(flag: string) {
    if (flag === 'session') {
      this.commonService.openConversationIntroModal(this.selfAssessmentObject.before_text, 'before');

      timer(1000).subscribe(() => {
        this.commonService.navigateForward('pre-assessment', {
          state: this.selfAssessmentObject,
        });
      });
    } else {
      if (this.selfAssessmentObject.conv_status !== 'FN') {
        this.isModalOpen = true;
        return;
      }
      this.commonService.navigateForward('personal-insight-report', {
        state:
          flag === 'reportConsolidated'
            ? {
                ...this.selfAssessmentObject,
                consolidated: true,
                redirectedFrom: 'ask-for-feedback',
              }
            : {
                ...this.selfAssessmentObject,
                redirectedFrom: 'ask-for-feedback',
              },
      });
    }
  }

  onSubmit() {
    this.commonService.showLoader();

    this.apiService
      .askFeedback({
        ...this.namesForFeedbackForm.value,
        type: this.activeTab.toUpperCase(),
      })
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          let person = {
            fdback_provider_name: this.namesForFeedbackForm?.get('fdback_provider_name')?.value,
            fdback_provider_email: this.namesForFeedbackForm?.get('fdback_provider_email')?.value,
            fdback_status: 'Pending',
            type: this.activeTab.toUpperCase(),
          };
          this.activeTab.toUpperCase() === 'PRE' ? this.peopleForPREFeedback.push(person) : this.peopleForPOSTFeedback.push(person);

          this.commonService.showAlert(AlertTypeEnum.Success, '', resp.message, this.commonService.alertButtonList);
          this.resetFormAndPatchValue();
        } else {
          this.commonService.showAlert(AlertTypeEnum.Warning, '', resp.message, this.commonService.alertButtonList);
        }

        this.commonService.hideLoader();
      })
      .catch((err: any) => {
        this.commonService.showAlert(AlertTypeEnum.Error, '', err.message);
      });
  }

  resetFormAndPatchValue() {
    this.namesForFeedbackForm.reset();

    this.namesForFeedbackForm.patchValue({
      name: this.user.name ?? this.user.profile_details.name,
      experience: this.user.exp ?? this.user.profile_details.exp,
      act_id: this.selfAssessmentObject.conv_type_id,
      conv_name: this.selfAssessmentObject.alt_name,
      avatar: this.user.avatar ?? this.user.profile_details.avatar,
    });
  }

  onRemoveFromList(index: number) {
    this.commonService.showLoader();

    const body = {
      fdback_provider_email: this.activeTab.toUpperCase() === 'PRE' ? `${this.peopleForPREFeedback[index].fdback_provider_email}` : `${this.peopleForPOSTFeedback[index].fdback_provider_email}`,
      act_id: `${this.conversation.conv_type_id}`,
      type: this.activeTab.toUpperCase(),
    };

    this.apiService
      .removeFeedbackUser(body)
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_DELETE) {
          this.commonService.showAlert(AlertTypeEnum.Success, '', 
            this.activeTab.toUpperCase() === 'PRE'
              ? `${this.peopleForPREFeedback[index].fdback_provider_name} removed from the feedback requestee list!`
              : `${this.peopleForPOSTFeedback[index].fdback_provider_name} removed from the feedback requestee list!`
          );
          this.activeTab.toUpperCase() === 'PRE' ? this.peopleForPREFeedback.splice(index, 1) : this.peopleForPOSTFeedback.splice(index, 1);
        } else {
          this.commonService.showAlert(AlertTypeEnum.Warning, '', resp.message, this.commonService.alertButtonList);
        }

        this.commonService.hideLoader();
      })
      .catch((err: any) => {
        this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);

        this.commonService.hideLoader();
      });
  }
}
