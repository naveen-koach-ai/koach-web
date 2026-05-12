import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { timer } from 'rxjs';

import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class QuestionComponent implements OnChanges {

  @Input() difficultyIncreaseFlag: boolean = false;
  @Input() question: any = {};
  @Input() translateButtonColor: string = 'light';

  translateButtonDisable: boolean = false;
  alreadyTranslated: boolean = false;

  constructor(
    public commonService: CommonService,

    private userService: UserService
  ) { }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['question'] && !simpleChanges['question'].firstChange && simpleChanges['question'].previousValue !== simpleChanges['question'].currentValue) {
      this.alreadyTranslated = false;
      this.translateButtonDisable = false;
    }
  }
}
