import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { FlashcardsComponent } from '../flashcards/flashcards.component';

@Component({
  selector: 'app-bot-question',
  templateUrl: './bot-question.component.html',
  styleUrls: ['./bot-question.component.scss'],
  imports: [CommonModule, IonicModule, FlashcardsComponent],
})
export class BotQuestionComponent implements OnInit {

  @Input() question: any = {};

  @Output() flashcardValue: EventEmitter<any> = new EventEmitter();

  isFlashcardSelected: boolean = false;

  alreadyTranslated: boolean = false;
  ogText :string = '';

  constructor(
    public commonService: CommonService,
    private userService: UserService
  ) { }

  ngOnInit() {}

  selectedFlashcard(event: any) {
    this.isFlashcardSelected = event.isFlashcardSelected;

    this.flashcardValue.emit(event.selectedFlashcard);
  }

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
