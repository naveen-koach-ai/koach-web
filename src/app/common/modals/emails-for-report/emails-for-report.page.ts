import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-emails-for-report',
  templateUrl: './emails-for-report.page.html',
  styleUrls: ['./emails-for-report.page.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class EmailsForReportPage implements OnInit {
  device_details: any = {};
  @Input() conversation: any = {};
  emailForm!: FormGroup;
  numEmails: number = 1;
  user: any = {};

  selectedRadio: string = 'digital';

  sendingReport: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    this._buildForm();
  }

  private _buildForm() {
    this.emailForm = this.formBuilder.group({
      emails: this.formBuilder.array([]),
    });

    this.addGuest();
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  addGuest() {
    const guest = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,8}$/i)])),
    });
    this.emails.push(guest);
  }

  get emails() {
    return this.emailForm.get('emails') as FormArray;
  }

  selectRadio(event: any) {
    this.selectedRadio = event.detail.value;
  }

  onSubmit() {
    this.commonService.showLoader();

    const emails = this.emailForm.value.emails.flat().map((item: any) => item.email);
    let payload: any = {
      email_list: emails,
      sh_uuid: this.commonService.generateUUID(),
      cur_uuid: this.conversation.cur_uuid ?? null,
      conv_uuid: this.conversation.conv_uuid ?? null,
      act_id: this.conversation.ms_id,
      report_type: this.conversation.report_type,
      name: this.user?.profile_details?.name ?? this.user?.name,
      avatar: this.user?.profile_details?.avatar ?? this.user?.avatar,
      printable: this.selectedRadio === 'printer' ? 'true' : 'false',
    };

    if (this.conversation.hasOwnProperty('type')) {
      payload = { ...payload, type: this.conversation.type.toUpperCase() };
    }

    this.sendingReport = true;
    this.commonService.showToast('Your report will be sent across shortly');
    this.onDismiss();
  }

  delete(index: number) {
    this.emails.removeAt(index);
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
