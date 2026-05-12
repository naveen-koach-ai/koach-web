import { Component, Input, OnInit } from '@angular/core';

import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';



@Component({
  selector: 'app-no-response',
  templateUrl: './no-response.component.html',
  styleUrls: ['./no-response.component.scss'],
})
export class NoResponseComponent  implements OnInit {

  @Input() question: any = {};

  alreadyTranslated: boolean = false;
  ogText: string = '';

  constructor(
    public commonService: CommonService,
    private userService: UserService
  ) { }

  ngOnInit() {}

  translate(text: string) {
    if (!this.alreadyTranslated) {
      this.ogText = text;
      this.userService.translateText(text).then((resp: any) => {
        this.alreadyTranslated = true;
        this.question.q_text = resp;
        this.commonService.loader.next(false);
      });
    }
  }

}
