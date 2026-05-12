import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-qt-question',
  templateUrl: './qt-question.component.html',
  styleUrls: ['./qt-question.component.scss'],
})
export class QtQuestionComponent  implements OnInit {

  @Input() question: any = {};

  @Output() flashcardValue: EventEmitter<any> = new EventEmitter();

  isFlashcardSelected: boolean = false;
  alreadyTranslatedQuestion: boolean = false;
  alreadyTranslatedFlashcards: boolean = false;
  ogQuestionTest: string = '';
  ogFCtext: string = '';

  constructor(
    public commonService: CommonService,
    private userService: UserService
  ) { }

  ngOnInit() {}

  selectedFlashcard(event: any) {
    this.isFlashcardSelected = true;

    this.flashcardValue.emit(this.question.flashcards[0]);
  }

  translate(text: string, flag: string) {    
    if (flag === 'question') {
      this.ogQuestionTest = text;
      if (!this.alreadyTranslatedQuestion) {
        this.userService.translateText(text).then((resp: any) => {
          this.alreadyTranslatedQuestion = true;
          this.question.q_text = resp;
          this.commonService.loader.next(false);
        });
      }
    } else {
      this.ogFCtext = text;
      if (!this.alreadyTranslatedFlashcards) {
        this.userService.translateText(text).then((resp: any) => {
          this.alreadyTranslatedFlashcards = true;
          this.question.q_text = resp;
          this.commonService.loader.next(false);
        });
      }
    }
  }

}
