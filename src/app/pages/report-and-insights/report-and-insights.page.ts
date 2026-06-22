import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertTypeEnum, StatusCodes } from 'src/app/common/constants/constants';
import { EmailsForReportPage } from 'src/app/common/modals/emails-for-report/emails-for-report.page';
import { ApiService } from 'src/app/common/services/api.service';
import { CommonService } from 'src/app/common/services/common.service';
import { UserService } from 'src/app/common/services/user.service';


@Component({
  selector: 'app-report-and-insights',
  templateUrl: './report-and-insights.page.html',
  styleUrls: ['./report-and-insights.page.scss'],
  standalone: false,
})
export class ReportAndInsightsPage implements OnInit {

  conversation: any = {};
  user: any;
  device_details: any = {};

  report: any = {};
  reportText: string[] = [];

  heading: string | null = null;
  dichotomyGraph: any[] = [];
  barGraph: any[] = [];

  growData: any = {};

  showShareButton: boolean = false;

  conditionMatched: boolean = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    this.conversation = this.router.getCurrentNavigation()?.extras?.state ?? {};
    if (!this.commonService.isValidData(this.conversation.ms_id)) {
      this.conversation = { ...this.conversation, ms_id: this.conversation.conv_type_id };
    }
    console.log('Conversation data: ', this.conversation);

    this.user = this.userService.user.getValue();
    console.log('User data: ', this.user);
    if (this.conversation.ms_id !== 'GROW') {
      const raw = sessionStorage.getItem('reportTextArray');
      this.reportText = raw ? JSON.parse(raw) : [];
    }

    if (this.conversation.hasOwnProperty('consolidated')) {
      this.getConsolidatedReports();
    } else {
      this.getReports();
    }
  }

  async getReports() {
    this.commonService.showLoader();

    if (this.conversation.conv_uuid === '60feca78-be99-41e9-a0c9-a9428a02ca09') {
      this.apiService.getSessionReport(this.conversation.conv_uuid, this.conversation.cur_uuid, 'PAC').then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.report = { reportData: resp.data.reports };
          this.reportText = [...resp.data.report_text];
        } else {
          this.report = {};
        }
      }).catch((err: any) => {
        this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);
      });
      return;
    }

    if (this.conversation.ms_id === 'pillars' || this.conversation.ms_id === 'skills') {
      this.getOverallReports(this.conversation.ms_id);
      return;
    }

    if (this.conversation.ms_id === 'GROW') {
      this.getGrowData();
      return;
    }

    if (this.conversation.ms_id === 'pillars') {
      this.conditionMatched = true;
    }

    this.apiService.getStrengthAspirationReport(this.conversation.ms_id).then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        this.heading = resp.data.pop();
        const temp_dichotomy_element: any[] = [];
        const dataArr: any[] = [];

        resp.data.forEach((ele: any) => {
          if (!temp_dichotomy_element.includes(ele.dichotomy_name)) {
            temp_dichotomy_element.push(ele.comp_name);
            dataArr.push(ele);
          }
        });
        this.conversation.ms_id === 'ST' ? this.dichotomyGraph = [...dataArr] : this.barGraph = [...dataArr];

        this.barGraph = this.barGraph.map((report: any) => {
          let percentage = report.percentage ?? 0;
          if (percentage === 100) {
            percentage = 90;
          } else if (percentage === 0) {
            percentage = 10;
          }
          return { ...report, comp_ele_name: report.comp_name, percentage };
        });
      } else {
        this.commonService.showAlert(AlertTypeEnum.Error, '', resp.message, this.commonService.alertButtonList);
      }
    }).catch((err: any) => {
      this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);
    });
  }

  async getConsolidatedReports() {
    this.commonService.showLoader();

    const payload = {
      conv_uuid: this.conversation.conv_uuid,
      act_id: this.conversation.ms_id,
      type: this.conversation.type.toUpperCase(),
    };

    this.apiService.getConsolidatedFeedbackReport(payload).then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        this.report.reportData = [...resp.data.reports];
      } else {
        this.report = {};
      }
    }).catch((err: any) => {
      this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);
    });
  }

  getGrowData() {
    this.commonService.showLoader();
    this.apiService.getGrowModel(this.conversation.cur_uuid).then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        this.growData = resp.data;
      }
    }, (err: any) => {
      console.error('Error while getting grow data', err);
    });
  }

  getOverallReports(flag: string) {
    this.commonService.showLoader();
    this.apiService.getOverallValues().then((resp: any) => {
      if (resp.code === StatusCodes.PK_SUCCESS) {
        const reportData: any[] = [];
        resp.data.forEach((element: any) => {
          if (element.comp_name == (flag === 'skills' ? 'Skills' : 'Pillars')) {
            let percentage = Math.floor((element.coins_earned / (element.total_coins === 0 ? 1 : element.total_coins)) * 100);
            if (percentage === 100) {
              percentage = 90;
            } else if (percentage === 0) {
              percentage = 10;
            }
            reportData.push({ ...element, comp_name: element.comp_ele_name, percentage });
          }
        });
        this.report = { reportData };
      } else if (resp.code === StatusCodes.PK_NO_DATA) {
        this.report = {};
      } else {
        this.commonService.showAlert(AlertTypeEnum.Error, '', resp.message, this.commonService.alertButtonList);
      }
    }, (err: any) => {
      this.commonService.showAlert(AlertTypeEnum.Error, '', err.message, this.commonService.alertButtonList);
    });
  }

  openedAccordion: number = 0;

  accordionGroupChange(event: any) {
    this.openedAccordion = event.detail.value;
  }

  toggleShareButtons() {
    this.showShareButton = true;
  }

  onShare(flag: string, _ms_id: string) {
    if (flag === 'report') {
      this.showEmailsModal();
    } else {
      this.shareReportData(this.conversation.cur_uuid, this.conversation.conv_uuid, this.conversation.ms_id);
    }
  }

  async showEmailsModal() {
    let conversationInfo: any = {};

    switch (this.conversation.ms_id) {
      case 'ST':
      case 'ASP':
        conversationInfo = { ...this.conversation, report_type: 'MISC_REPORT' };
        break;
      case 'OB-PR':
        if (this.conversation.hasOwnProperty('consolidated')) {
          conversationInfo = { ...this.conversation, report_type: 'CONSOLIDATED_ASSESS_REPORT' };
        } else {
          conversationInfo = { ...this.conversation, report_type: 'ASSESS_REPORT' };
        }
        break;
      default:
        conversationInfo = { ...this.conversation, report_type: 'ASSESS_REPORT' };
        break;
    }

    const modal = await this.modalCtrl.create({
      component: EmailsForReportPage,
      componentProps: { conversation: conversationInfo },
      backdropDismiss: false,
      cssClass: 'emails-for-report-modal'
    });

    modal.present();
  }

  back() {
    if (this.conversation?.redirectedFrom) {
      this.commonService.navigateBack(this.conversation?.redirectedFrom);
    } else {
      this.commonService.navigateRoot('home');
    }
  }

  async shareReportData(cur_uuid: any, conv_uuid?: any, act_id?: string) {
    this.commonService.showLoader();

    const sh_uuid = this.commonService.generateUUID();
    const tempUser = this.userService.user.getValue();
    const user = tempUser.profile_details ? tempUser.profile_details : tempUser;

    const payload = conv_uuid
      ? { cur_uuid, sh_uuid, conv_uuid, act_id }
      : { cur_uuid, sh_uuid };

    this.apiService.shareReport(payload).then(
      async (resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.commonService.hideLoader();
          await navigator.share({
            title: `Report as shared by ${user.name}`,
            text: `${user.name} has shared a snapshot of their report with you for your consideration and discussion.\n`,
            url: conv_uuid
              ? `https://koach.ai/grow-reports/${sh_uuid}?id=${btoa('3')}`
              : `https://koach.ai/grow-reports/${sh_uuid}?id=${btoa('4')}`,
          });
        }
      },
      (err: any) => {
        console.error('Error while sharing report', err);
      }
    );
  }
}
