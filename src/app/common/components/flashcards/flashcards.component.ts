import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { timer } from 'rxjs';

import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class FlashcardsComponent implements OnChanges {

  @Input() question: any = {};
  @Input() onSubmitDiv: boolean = true;
  @Input() translateButtonColor: string = 'light';

  @Output() selectedFlashcard: EventEmitter<any> = new EventEmitter();
  
  highestIsCorrectAns!: number;
  
  selectedItem: any = {};

  translateButtonDisable: boolean = false;
  alreadyTranslated: boolean = false;
  OG_flashcards_text: string | null = null;
  translatedFC: string[] = [];
  
  constructor(
    private userService: UserService,
    
    public commonService: CommonService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && !changes['question'].firstChange && changes['question'].previousValue !== changes['question'].currentValue) {
      console.log('question changed in flashcards component', this.question);
      if (this.alreadyTranslated && this.OG_flashcards_text) {
        const og_FCText = this.OG_flashcards_text.split('===');
        og_FCText.forEach((text, index) => {
          if (this.question.flashcards && this.question.flashcards[index]) {
            this.question.flashcards[index].fc_display_text = text.trim();
          }
        });
      }
      
      this.alreadyTranslated = false;
      this.translateButtonDisable = false;
      this.OG_flashcards_text = null;
      this.translatedFC = [];
    }

    if (this.commonService.isValidData(this.question.flashcards)) {
      this.highestIsCorrectAns = Math.max(...(this.question.flashcards as any[]).map(flashcard => flashcard.is_crct_ans));

    }
  }

  onFlashcardSelect(event: any) {
    this.selectedItem = event.detail.value;
    this.selectedFlashcard.emit({ selectedFlashcard: event.detail.value, isFlashcardSelected: true });
  }

  onTranslateBack() {
    this.alreadyTranslated = false;
    this.OG_flashcards_text?.split('===').forEach((text, index) => {
      this.question.flashcards[index].fc_display_text = text;
    });
  }

}